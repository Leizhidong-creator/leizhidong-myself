import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { objects } from "./objects";
import { renderTarget } from "./core/renderTarget";
import { threeSizes } from "./utils/sizes";
import { raycast } from "./utils/raycast";
import { resources } from "../utils/resources";

let canvas: HTMLCanvasElement | null = null;
let preparation: Promise<void> | null = null;
let sceneInitialized = false;
let raycastInitialized = false;

const prepare = (_canvas: HTMLCanvasElement, onProgress: (value: number) => void = () => undefined) => {
  if (preparation) return preparation;

  preparation = (async () => {
    canvas = _canvas;

    if (!sceneInitialized) {
      threeSizes.init(_canvas);
      camera.init();
      renderTarget.init();
      renderer.init(canvas);
      await objects.init();
      sceneInitialized = true;
    }

    onProgress(0.75);
    renderer.renderOnce();
    if (!renderer.hasNonBlankFrame()) throw new Error("The first 3D frame is blank");
    onProgress(1);

    if (!raycastInitialized) {
      raycast.init();
      raycastInitialized = true;
    }
  })().catch((error) => {
    preparation = null;
    throw error;
  });

  return preparation;
};

const init = (_canvas: HTMLCanvasElement) => {
  void resources.startLoading().then(() => prepare(_canvas));
};

const destroy = () => {
  if (raycastInitialized) raycast.destroy();
  threeSizes.destroy();
  renderTarget.destroy();
  renderer.destroy();
  objects.destroy();
  camera.destroy();
  canvas = null;
  preparation = null;
  sceneInitialized = false;
  raycastInitialized = false;
};

export const three = { init, prepare, destroy };
