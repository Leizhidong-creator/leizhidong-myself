import { ShaderMaterial, LinearSRGBColorSpace } from "three";
import { resources } from "../../../utils/resources";
import { aboutProgress } from "../../../animations/transitions/about";
import gsap from "gsap";
import { sizes } from "../../../utils/sizes";

import vertexShader from "../../shaders/lab-base/vertex.glsl";
import fragmentShader from "../../shaders/lab-base/fragment.glsl";

import type { Mesh } from "three";

let material: ShaderMaterial | null = null;
let display: Mesh | null = null;

const uniforms = {
  uDiffuseMap: { value: null },
  uProgress: { value: 0 },
};

const init = (mesh: Mesh, _display: Mesh) => {
  display = _display;

  const texture = resources.items["diffuse-map"];
  texture.colorSpace = LinearSRGBColorSpace;
  texture.generateMipmaps = false;
  texture.flipY = false;

  uniforms.uDiffuseMap.value = texture;

  material = new ShaderMaterial({
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms,
  });
  mesh.material = material;

  display.material = material;

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!material) return;
  material.uniforms.uProgress!.value = aboutProgress.value;

  if (display) {
    display.visible = sizes.isLandscape;
  }
};

const destroy = () => {
  gsap.ticker.remove(tick);
};

export const labBase = { init, destroy };
