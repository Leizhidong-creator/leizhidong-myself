import gsap from "gsap";
import { Mesh, PlaneGeometry, ShaderMaterial, BufferAttribute } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import fragmentShader from "../../shaders/notes/fragment.glsl";
import vertexShader from "../../shaders/notes/vertex.glsl";
import { room } from ".";
import { resources } from "../../../utils/resources";
import { sceneWeights } from "../../../animations/scenes";
import { lerp } from "../../../utils/math";
import { soundsEnabled } from "../../../features/sounds/composables/useHowler";

import type { BufferGeometry } from "three";

let mesh: Mesh | null = null;
let geometry: BufferGeometry | null = null;
let material: ShaderMaterial | null = null;

const PLANE_COUNT = 3;

const uniforms = {
  uTime: { value: 0 },
  uOpacity: { value: 0 },
};

const init = (musicMeshPosition: { x: number; y: number; z: number }) => {
  gsap.ticker.add(tick);
  initMesh(musicMeshPosition);
};

const initMesh = (musicMeshPosition: { x: number; y: number; z: number }) => {
  if (mesh) return;

  const texture = resources.items["icon-spritesheet"];

  const geometries = [];

  for (let i = 0; i < PLANE_COUNT; i++) {
    // Create a single plane
    const plane = new PlaneGeometry(1, 1);

    // Normalized index value between 0 → 1
    const indexValue = i / PLANE_COUNT;

    // Add a per-vertex attribute "aIndex"
    const vertexCount = plane.getAttribute("position").count;
    const aIndexArray = new Float32Array(vertexCount).fill(indexValue);
    plane.setAttribute("aIndex", new BufferAttribute(aIndexArray, 1));

    geometries.push(plane);
  }

  // Merge all planes into one geometry
  geometry = mergeGeometries(geometries, false);

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    uniforms: {
      uTexture: { value: texture },
      ...uniforms,
    },
  });

  mesh = new Mesh(geometry, material);
  mesh.renderOrder = -1;

  mesh.position.set(musicMeshPosition.x - 0.4, musicMeshPosition.y + 0.4, musicMeshPosition.z + 0.2);

  room.group.add(mesh);
};

const tick = () => {
  if (!mesh) return;

  const progress = sceneWeights.hero;
  if (progress < 0.001) {
    mesh.visible = false;
    return;
  } else {
    mesh.visible = true;
  }

  // Lerp opacity toward target
  const delta = gsap.ticker.deltaRatio(60);
  const opacityTarget = soundsEnabled.value ? 1 : 0;
  const speed = opacityTarget === 1 ? 0.02 : 0.1;
  uniforms.uOpacity.value = lerp(uniforms.uOpacity.value, opacityTarget, speed * delta);

  // Hide mesh if opacity is almost zero
  if (uniforms.uOpacity.value < 0.01) mesh.visible = false;

  // Advance time uniform
  uniforms.uTime.value += delta / 60;
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const notes = { init, destroy };
