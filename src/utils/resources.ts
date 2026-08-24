import { SRGBColorSpace, TextureLoader } from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { threeSources } from "../criticalAssets.ts";
import EventEmitter from "./EventEmitter.ts";
import { runWithRetry } from "./retry.ts";
import { createWeightedProgress } from "./weightedProgress.ts";

import type { Texture } from "three";
import type { ThreeSource } from "../criticalAssets.ts";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

const isDev = import.meta.env?.DEV ?? false;

export type ResourceType = Texture | GLTF;
export type ResourceLoadAdapter = (
  source: ThreeSource,
  onProgress: (progress: number) => void,
) => Promise<ResourceType>;

type Retry = typeof runWithRetry;

function createDefaultAdapter(): ResourceLoadAdapter {
  const gltfLoader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const textureLoader = new TextureLoader();

  return (source, onProgress) =>
    new Promise((resolve, reject) => {
      const handleProgress = (event: ProgressEvent<EventTarget>) => {
        if (event.total > 0) onProgress(event.loaded / event.total);
      };

      if (source.type === "gltfModel") {
        gltfLoader.load(source.path, resolve, handleProgress, reject);
        return;
      }

      textureLoader.load(
        source.path,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          resolve(texture);
        },
        handleProgress,
        reject,
      );
    });
}

export class Resources extends EventEmitter<{
  ready: void;
  progress: number;
}> {
  readonly toLoad: number;
  isReady = false;
  loaded = 0;
  items: Record<string, any> = {};

  private readonly sources: readonly ThreeSource[];
  private readonly loadSource: ResourceLoadAdapter;
  private readonly retry: Retry;
  private readonly progress;
  private readonly progressCallbacks = new Set<(value: number) => void>();
  private loadPromise: Promise<void> | null = null;

  constructor(
    sources: readonly ThreeSource[] = threeSources,
    loadSource: ResourceLoadAdapter = createDefaultAdapter(),
    retry: Retry = runWithRetry,
  ) {
    super();
    this.sources = sources;
    this.loadSource = loadSource;
    this.retry = retry;
    this.toLoad = sources.length;
    this.progress = createWeightedProgress(
      sources.map((source) => ({ id: source.name, weight: source.weight })),
    );
    this.progress.subscribe((value) => {
      if (value === 0) return;
      this.emit("progress", value);
      this.progressCallbacks.forEach((callback) => callback(value));
    });
  }

  startLoading(onProgress?: (progress: number) => void): Promise<void> {
    if (onProgress) {
      this.progressCallbacks.add(onProgress);
      onProgress(this.progress.value);
    }
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = Promise.all(
      this.sources.map((source) =>
        this.retry(() => this.loadSource(source, (value) => this.progress.set(source.name, value))).then(
          (file) => {
            this.items[source.name] = file;
            this.loaded += 1;
            this.progress.set(source.name, 1);
          },
        ),
      ),
    ).then(() => {
      this.isReady = true;
      this.emit("ready");
      this.log("All resources loaded");
    });

    return this.loadPromise;
  }

  log(message: string) {
    if (!isDev) return;
    console.log(`[Resources] ${message}`);
  }
}

export const resources = new Resources();
