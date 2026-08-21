import gsap from "gsap";
import { Mesh, PlaneGeometry, ShaderMaterial, BufferAttribute } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import fragmentShader from "../../shaders/sleeping-sprite/fragment.glsl";
import vertexShader from "../../shaders/sleeping-sprite/vertex.glsl";
import { contact } from ".";
import { resources } from "../../../utils/resources";
import { sceneWeights } from "../../../animations/scenes";
import { lerp } from "../../../utils/math";

import type { BufferGeometry } from "three";

let mesh: Mesh | null = null;
let geometry: BufferGeometry | null = null;
let material: ShaderMaterial | null = null;
let opacityTarget = 1;

const PLANE_COUNT = 3;

const uniforms = {
  uTime: { value: 0 },
  uOpacity: { value: 1 },
};

const init = () => {
  gsap.ticker.add(tick);
  initMesh();
};

const initMesh = () => {
  if (mesh) return;

  const texture = resources.items["icon-spritesheet"];

  const geometries = [];

  for (let i = 0; i < PLANE_COUNT; i++) {
    // Create a single plane
    const plane = new PlaneGeometry(1, 1);

    // Normalized index value between 0 → 1
    const indexValue = i / PLANE_COUNT; // not PLANE_COUNT - 1

    // Add a per-vertex attribute "aIndex"
    const vertexCount = plane.getAttribute("position").count;
    const aIndexArray = new Float32Array(vertexCount).fill(indexValue);
    plane.setAttribute("aIndex", new BufferAttribute(aIndexArray, 1));

    // Slightly offset each plane in Y so they don’t overlap visually (optional)
    //plane.translate(0, 4.5 + i * 0.1, 0);

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
  mesh.position.set(-0.3, 3.5, 0);

  contact.group.add(mesh);
};

const hide = () => {
  opacityTarget = 0;
};

const tick = () => {
  if (!mesh) return;

  const progress = sceneWeights.contact;
  if (progress < 0.001) {
    mesh.visible = false;
    return;
  } else {
    mesh.visible = true;
  }

  // --- lerp opacity toward target ---
  const delta = gsap.ticker.deltaRatio(60);
  const speed = 0.1; // adjust how fast opacity interpolates
  uniforms.uOpacity.value = lerp(uniforms.uOpacity.value, opacityTarget, speed * delta);

  // Hide mesh if opacity is almost zero
  if (uniforms.uOpacity.value < 0.01) mesh.visible = false;

  // Advance time uniform
  uniforms.uTime.value += delta / 60;
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const sleepingSprite = { init, destroy, hide };
