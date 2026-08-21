import { Mesh, ShaderMaterial, LinearSRGBColorSpace, LinearFilter } from "three";
import { room } from ".";
import { resources } from "../../../utils/resources";
import { planeGeometry } from "../../common/geometries";
import vertexShader from "../../shaders/message-popup/vertex.glsl";
import fragmentShader from "../../shaders/message-popup/fragment.glsl";
import gsap from "gsap";
import { playSound } from "../../../features/sounds/utils/sounds";

let mesh: Mesh | null = null;
let material: ShaderMaterial | null = null;

const init = () => {
  initMesh();
};

const initMesh = () => {
  if (mesh) return;

  const texture = resources.items["icon-spritesheet"];
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    uniforms: {
      uTexture: { value: texture },
      uProgress: { value: 0 },
    },
  });

  mesh = new Mesh(planeGeometry, material);
  mesh.visible = false;

  mesh.position.set(-1, 3.25, 2.5);

  room.group.add(mesh);
};

const show = () => {
  if (!material || !material.uniforms.uProgress) return;

  const tl = gsap.timeline();
  tl.set(mesh, { visible: true }, 0);
  tl.fromTo(
    material.uniforms.uProgress,
    { value: 0 },
    {
      value: 1,
      duration: 2,
      ease: "power4.out",
    },
    0,
  );
  tl.set(mesh, { visible: false });

  playSound("notification");
};

const destroy = () => {
  if (!material || !material.uniforms.uProgress) return;
  gsap.killTweensOf(material.uniforms.uProgress);
  gsap.killTweensOf(mesh);
};

export const messagePopup = { init, destroy, show };
