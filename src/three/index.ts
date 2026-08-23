import { camera } from "./core/camera";
import { renderer } from "./core/renderer";
import { objects } from "./objects";
import { renderTarget } from "./core/renderTarget";
import { threeSizes } from "./utils/sizes";
import { resources } from "../utils/resources";
import { raycast } from "./utils/raycast";
import { ref } from "vue";

let canvas: HTMLCanvasElement | null = null;
let initializing = false;
export const threeReady = ref(false);

const init = (_canvas: HTMLCanvasElement) => {
  if (initializing || threeReady.value) return;
  canvas = _canvas;
  initializing = true;

  const initialize = async () => {
    threeSizes.init(_canvas);
    camera.init();
    renderTarget.init();
    renderer.init(canvas);

    await objects.init();
    raycast.init();
    threeReady.value = true;
    initializing = false;
  };

  if (resources.isReady) {
    initialize();
  } else {
    resources.once("ready", initialize);
  }
};

const destroy = () => {
  threeSizes.destroy();
  renderTarget.destroy();
  renderer.destroy();
  objects.destroy();
  camera.destroy();
  canvas = null;
  initializing = false;
  threeReady.value = false;
};

export const three = { init, destroy };
