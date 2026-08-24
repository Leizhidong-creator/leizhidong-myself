import { runWithRetry } from "./retry.ts";
import { createWeightedProgress } from "./weightedProgress.ts";

type ProgressStage = (onProgress: (value: number) => void) => Promise<void>;
type SceneStage = (canvas: HTMLCanvasElement, onProgress: (value: number) => void) => Promise<void>;
type Retry = typeof runWithRetry;

export type CriticalBootDependencies = {
  loadThree: ProgressStage;
  loadSounds: ProgressStage;
  loadCovers: ProgressStage;
  prepareScene: SceneStage;
  retry?: Retry;
};

export function createCriticalBoot(dependencies: CriticalBootDependencies) {
  const progressTracker = createWeightedProgress([
    { id: "three", weight: 65 },
    { id: "sounds", weight: 10 },
    { id: "covers", weight: 5 },
    { id: "scene", weight: 20 },
  ]);
  const progressListeners = new Set<(value: number) => void>();
  const readyListeners = new Set<() => void>();
  let progress = 0;
  let ready = false;
  let startPromise: Promise<void> | null = null;

  progressTracker.subscribe((value) => {
    progress = value;
    progressListeners.forEach((listener) => listener(value));
  });

  const start = (canvas: HTMLCanvasElement) => {
    if (startPromise) return startPromise;

    startPromise = (async () => {
      await Promise.all([
        dependencies.loadThree((value) => progressTracker.set("three", value)),
        dependencies.loadSounds((value) => progressTracker.set("sounds", value)),
        dependencies.loadCovers((value) => progressTracker.set("covers", value)),
      ]);

      await (dependencies.retry ?? runWithRetry)(() =>
        dependencies.prepareScene(canvas, (value) => progressTracker.set("scene", value)),
      );
      progressTracker.set("scene", 1);
      ready = true;
      readyListeners.forEach((listener) => listener());
      readyListeners.clear();
    })();

    return startPromise;
  };

  return {
    get progress() {
      return progress;
    },
    get ready() {
      return ready;
    },
    start,
    onProgress(listener: (value: number) => void) {
      progressListeners.add(listener);
      listener(progress);
      return () => progressListeners.delete(listener);
    },
    onReady(listener: () => void) {
      if (ready) {
        listener();
        return () => undefined;
      }
      readyListeners.add(listener);
      return () => readyListeners.delete(listener);
    },
  };
}

export const criticalBoot = createCriticalBoot({
  loadThree: async (onProgress) => (await import("./resources")).resources.startLoading(onProgress),
  loadSounds: async (onProgress) => (await import("./criticalMedia")).loadCriticalSounds(onProgress),
  loadCovers: async (onProgress) => (await import("./criticalMedia")).loadCriticalCovers(onProgress),
  prepareScene: async (canvas, onProgress) => (await import("../three")).three.prepare(canvas, onProgress),
});
