import { WebGLRenderer, Vector3 } from "three";
import gsap from "gsap";
import { scene } from "./scene";
import { renderTarget } from "./renderTarget";
import { camera } from "./camera";
import { sceneWeights } from "../../animations/scenes";
import { colors } from "../common/colors";
import { threeSizes } from "../utils/sizes";

import type { Camera, Object3D, Scene } from "three";

let instance: WebGLRenderer | null = null;
let canvas: HTMLCanvasElement | null = null;
let visible = true;
let isActive = false;

const emptyVector = new Vector3();

const init = (_canvas: HTMLCanvasElement | null) => {
  if (instance) return;
  canvas = _canvas;
  instance = new WebGLRenderer({
    canvas: canvas!,
    antialias: true,
    alpha: false,
  });

  gsap.ticker.add(tick);
  threeSizes.on("resize", resize);
  resize();
};

const getInstance = () => {
  if (!instance) throw new Error("Renderer not initialized");
  return instance;
};

const resize = () => {
  if (!instance) return;
  instance.setSize(threeSizes.width, threeSizes.height, false);
  instance.setPixelRatio(threeSizes.pixelRatio);
};

const renderFrame = (force = false) => {
  const shouldBeVisible = !camera.instance.position.equals(emptyVector) && isActive;

  if (canvas && shouldBeVisible !== visible) {
    canvas.style.visibility = shouldBeVisible ? "visible" : "hidden";
    visible = shouldBeVisible;
  }

  if (!instance || (!force && !shouldBeVisible)) return;

  if (sceneWeights.about > 0.001) {
    renderTarget.render();
  }

  const color = sceneWeights.contact > 0.001 ? colors.beigeDark : colors.beigeLight;
  instance.setClearColor(color);
  instance.render(scene.instance, camera.instance);
};

const tick = () => renderFrame();

const renderOnce = () => {
  if (!instance) throw new Error("Renderer not initialized");
  renderFrame(true);
};

const hasNonBlankFrame = () => {
  if (!instance) return false;
  const gl = instance.getContext();
  const pixel = new Uint8Array(4);
  gl.readPixels(
    Math.floor(instance.domElement.width / 2),
    Math.floor(instance.domElement.height / 2),
    1,
    1,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel,
  );
  return (pixel[3] ?? 0) > 0 && ((pixel[0] ?? 0) > 0 || (pixel[1] ?? 0) > 0 || (pixel[2] ?? 0) > 0);
};

const compile = async () => {
  await Promise.all([compileScene(camera.instance, scene.instance), compileScene(camera.instance, renderTarget.scene)]);
};

const setIsActive = (value: boolean) => {
  isActive = value;
};

const compileScene = async (camera: Camera, sceneToCompile: Scene) => {
  if (!instance) {
    console.error("Renderer not initialized");
    return;
  }

  return new Promise<void>(async (resolve) => {
    if (!instance) {
      return;
    }

    const invisibleObjects: Object3D[] = [];
    const instancedWithOriginalCullState: [Object3D, boolean][] = [];

    sceneToCompile.traverse((child) => {
      if (child.visible === false) {
        invisibleObjects.push(child);
        child.visible = true;
      }

      if (child.frustumCulled === true) {
        instancedWithOriginalCullState.push([child, child.frustumCulled]);
        child.frustumCulled = false; // Ensure it's rendered
      }
    });

    instance.compile(sceneToCompile, camera);

    invisibleObjects.forEach((child) => (child.visible = false));
    instancedWithOriginalCullState.forEach(([child, originalState]) => {
      child.frustumCulled = originalState;
    });

    renderTarget.render();

    resolve();
  });
};

const destroy = () => {
  if (!instance) return;
  instance.dispose();
  gsap.ticker.remove(tick);
  instance = null;
  visible = true;
};

export const renderer = { init, destroy, getInstance, compile, renderOnce, hasNonBlankFrame, setIsActive };
