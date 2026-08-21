import { PlaneGeometry, ShaderMaterial, Mesh, Color } from "three";
import { renderTarget } from "../../core/renderTarget";
import vertexShader from "../../shaders/grid-floor/vertex.glsl";
import fragmentShader from "../../shaders/grid-floor/fragment.glsl";
import gsap from "gsap";
import { sceneWeightsInOut } from "../../../animations/scenes";
import { aboutProgress } from "../../../animations/transitions/about";
import { lab } from "../lab";

let mesh: Mesh | null = null;
let geometry: PlaneGeometry | null = null;
let material: ShaderMaterial | null = null;

const uniforms = {
  uColor: { value: new Color("#0157A0").convertLinearToSRGB() },
  uLineColor: { value: new Color("#34BCFD").convertLinearToSRGB() },
  uOpacity: { value: 0 },
  uTime: { value: 0 },
  uProgress: { value: 0 },
};

const init = () => {
  if (geometry) return;
  geometry = new PlaneGeometry(18, 18, 18, 18);
  geometry.rotateX(-Math.PI / 2);

  material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    uniforms,
  });

  mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -100;

  renderTarget.scene.add(mesh);

  gsap.ticker.add(tick);
};

const tick = () => {
  if (!mesh || !(mesh.material instanceof ShaderMaterial)) return;

  mesh.material.uniforms.uOpacity!.value = 0.2 + 0.8 * sceneWeightsInOut.about.in;
  mesh.material.uniforms.uTime!.value = gsap.ticker.time;
  mesh.material.uniforms.uProgress!.value = aboutProgress.value;

  mesh.position.copy(lab.group.position);
  mesh.position.y = -0.4;
};

const destroy = () => {
  gsap.ticker.remove(tick);
  //geometry?.dispose();
  //geometry = null;
  //material?.dispose();
  //material = null;
  //mesh = null;
};

export const gridFloor = { init, destroy, getMesh: () => mesh, uniforms };
