import { coverSources, soundSources } from "../criticalAssets.ts";
import { runWithRetry } from "./retry.ts";
import { createWeightedProgress } from "./weightedProgress.ts";

export type HowlAdapter = {
  state(): string;
  once(event: "load" | "loaderror", callback: (...args: unknown[]) => void): void;
  off(event: "load" | "loaderror", callback: (...args: unknown[]) => void): void;
  load(): void;
};

export type ImageAdapter = {
  src: string;
  onload: null | ((...args: any[]) => void);
  onerror: null | ((...args: any[]) => void);
  decode(): Promise<void>;
};

type Retry = typeof runWithRetry;

function loadHowl(howl: HowlAdapter): Promise<void> {
  if (howl.state() === "loaded") return Promise.resolve();

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      howl.off("load", handleLoad);
      howl.off("loaderror", handleError);
    };
    const handleLoad = () => {
      cleanup();
      resolve();
    };
    const handleError = () => {
      cleanup();
      reject(new Error("Sound failed to load"));
    };

    howl.once("load", handleLoad);
    howl.once("loaderror", handleError);
    howl.load();
  });
}

function loadImage(path: string, createImage: () => ImageAdapter): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = createImage();
    image.onload = () => {
      image.onload = null;
      image.onerror = null;
      image.decode().then(resolve, reject);
    };
    image.onerror = () => {
      image.onload = null;
      image.onerror = null;
      reject(new Error(`Cover failed to load: ${path}`));
    };
    image.src = path;
  });
}

export async function loadCriticalSounds(
  onProgress: (value: number) => void,
  howls?: readonly HowlAdapter[],
  retry: Retry = runWithRetry,
): Promise<void> {
  const resolvedHowls = howls ?? (await import("../features/sounds/criticalHowls")).criticalHowls;
  const entries = resolvedHowls.map((_, index) => ({
    id: `sound-${index}`,
    weight: resolvedHowls.length === soundSources.length ? (soundSources[index]?.weight ?? 1) : 1,
  }));
  const progress = createWeightedProgress(entries);
  progress.subscribe(onProgress);

  await Promise.all(
    resolvedHowls.map((howl, index) =>
      retry(() => loadHowl(howl)).then(() => progress.set(`sound-${index}`, 1)),
    ),
  );
}

export async function loadCriticalCovers(
  onProgress: (value: number) => void,
  createImage: () => ImageAdapter = () => new Image(),
  retry: Retry = runWithRetry,
): Promise<void> {
  const entries = coverSources.map((source) => ({ id: source.name, weight: source.weight }));
  const progress = createWeightedProgress(entries);
  progress.subscribe(onProgress);

  await Promise.all(
    coverSources.map((source) =>
      retry(() => loadImage(source.path, createImage)).then(() => progress.set(source.name, 1)),
    ),
  );
}
