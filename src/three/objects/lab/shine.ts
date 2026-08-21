import { DoubleSide, ShaderMaterial } from "three";
import vertexShader from "../../shaders/lab-shine/vertex.glsl";
import fragmentShader from "../../shaders/lab-shine/fragment.glsl";
import gsap from "gsap";
import { aboutProgress } from "../../../animations/transitions/about";

import type { Mesh } from "three";

let material: ShaderMaterial | null = null;

const uniforms = {
  uTime: { value: 0 },
  uProgress: { value: 0 },
};

const init = (mesh: Mesh) => {
  if (material) return;
  material = new ShaderMaterial({
    transparent: true,
    side: DoubleSide,
    depthWrite: false,
    depthTest: false,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms,
  });
  mesh.material = material;

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!material) return;
  material.uniforms.uTime!.value = gsap.ticker.time;
  material.uniforms.uProgress!.value = aboutProgress.value;
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const labShine = { init, destroy };
