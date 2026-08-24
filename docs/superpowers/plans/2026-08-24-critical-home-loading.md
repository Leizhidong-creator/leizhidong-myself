# Critical Home Loading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox ('- [ ]') syntax for tracking.

**Goal:** Keep the current logo preloader visible until all home 3D assets, home sounds, three project covers, renderer compilation, and a verified first frame are complete, while reducing avoidable startup traffic.

**Architecture:** A typed critical-asset manifest supplies the Three.js, sound, and cover loaders. A reusable retry primitive retries failed work forever with capped backoff, while a weighted boot coordinator combines real progress from independent loaders. The home canvas starts the coordinator, and the preloader exits only on its single 'ready' event.

**Tech Stack:** Vue 3.5, TypeScript 5.9, Three.js 0.181, Howler 2.2, GSAP 3.13, Vite 7, Node 24 test runner.

## Global Constraints

- Keep the current GitHub Pages deployment and do not add a paid server or CDN.
- Keep the existing logo-first visual treatment.
- Never reveal a partial 3D scene.
- Home sounds and the three home project covers are critical.
- Project detail media remains deferred.
- Failed critical work retries indefinitely with delays of 1, 2, 4, 8, then 10 seconds.
- The progress indicator reaches 100% only after a nonblank first frame is verified.
- Browser autoplay rules remain unchanged; sound playback still starts after user interaction.

---

## File Structure

- Create 'src/criticalAssets.ts': typed source of truth for model, texture, sound, and cover URLs plus progress weights.
- Create 'src/utils/retry.ts': environment-injected infinite retry primitive.
- Create 'src/utils/weightedProgress.ts': monotonic weighted progress tracker.
- Create 'src/utils/criticalMedia.ts': Howler and image preload/decode adapters.
- Create 'src/utils/criticalBoot.ts': orchestration and the single readiness gate.
- Create 'src/features/sounds/criticalHowls.ts': unique list of required Howl instances.
- Modify 'src/utils/resources.ts': retrying Three.js loader with progress and a promise-based API.
- Modify 'src/three/index.ts', 'src/three/objects/index.ts', and 'src/three/core/renderer.ts': await construction/compile and validate one frame.
- Modify 'src/composables/usePreloader.ts' and 'src/features/home/components/Home.vue': connect the logo and canvas to critical boot.
- Modify 'index.html' and 'src/assets/styles/preloader.scss': inline the minimum preloader paint path while keeping the normal stylesheet authoritative.
- Modify 'src/App.vue', 'src/content/projects/index.ts', and 'src/features/projects/components/Project.vue': lazy-load project-only code and media.
- Modify sound definitions and preview definitions to reuse critical manifest URLs.
- Add focused Node tests under 'tests/' and asset budget checks.

---

### Task 1: Infinite Retry Primitive

**Files:**
- Create: 'src/utils/retry.ts'
- Create: 'tests/critical-retry.test.mjs'
- Modify: 'package.json'

**Interfaces:**
- Produces: 'runWithRetry<T>(attempt, options?): Promise<T>'
- Produces: 'RETRY_DELAYS_MS = [1000, 2000, 4000, 8000, 10000]'
- Consumes: an optional 'RetryEnvironment' for deterministic tests.

- [ ] **Step 1: Add the failing retry tests**

~~~js
import test from "node:test";
import assert from "node:assert/strict";

const { RETRY_DELAYS_MS, runWithRetry } = await import("../src/utils/retry.ts");

function createEnvironment() {
  const queue = [];
  const onlineListeners = new Set();
  let online = true;
  return {
    queue,
    environment: {
      isOnline: () => online,
      schedule: (callback, delay) => {
        queue.push({ callback, delay });
        return callback;
      },
      cancel: () => undefined,
      onOnline: (callback) => {
        onlineListeners.add(callback);
        return () => onlineListeners.delete(callback);
      },
    },
    setOnline(value) {
      online = value;
      if (value) onlineListeners.forEach((callback) => callback());
    },
    runNext() {
      const next = queue.shift();
      next?.callback();
      return next?.delay;
    },
  };
}

test("retry delays cap at ten seconds and eventually resolve", async () => {
  const fake = createEnvironment();
  let attempts = 0;
  const result = runWithRetry(
    async () => {
      attempts += 1;
      if (attempts < 7) throw new Error("temporary");
      return "loaded";
    },
    { environment: fake.environment },
  );

  await Promise.resolve();
  const delays = [];
  while (attempts < 7) {
    delays.push(fake.runNext());
    await Promise.resolve();
    await Promise.resolve();
  }

  assert.deepEqual(delays, [1000, 2000, 4000, 8000, 10000, 10000]);
  assert.equal(await result, "loaded");
});

test("offline work waits for the online event", async () => {
  const fake = createEnvironment();
  fake.setOnline(false);
  let attempts = 0;
  const result = runWithRetry(async () => ++attempts, { environment: fake.environment });

  await Promise.resolve();
  assert.equal(attempts, 0);
  fake.setOnline(true);
  await Promise.resolve();
  assert.equal(await result, 1);
});

test("the exported schedule is stable", () => {
  assert.deepEqual(RETRY_DELAYS_MS, [1000, 2000, 4000, 8000, 10000]);
});
~~~

- [ ] **Step 2: Add standard test and verification scripts**

Add these entries to 'package.json':

~~~json
"test": "node --test tests/*.test.mjs",
"verify": "npm run typecheck && npm test && npm run build"
~~~

- [ ] **Step 3: Run the test and verify it fails**

Run: 'npm test -- --test-name-pattern="retry"'

Expected: FAIL because 'src/utils/retry.ts' does not exist.

- [ ] **Step 4: Implement the retry primitive**

~~~ts
export const RETRY_DELAYS_MS = [1_000, 2_000, 4_000, 8_000, 10_000] as const;

export type RetryEnvironment = {
  isOnline: () => boolean;
  schedule: (callback: () => void, delayMs: number) => unknown;
  cancel: (handle: unknown) => void;
  onOnline: (callback: () => void) => () => void;
};

const browserEnvironment: RetryEnvironment = {
  isOnline: () => navigator.onLine,
  schedule: (callback, delayMs) => window.setTimeout(callback, delayMs),
  cancel: (handle) => window.clearTimeout(handle as number),
  onOnline: (callback) => {
    window.addEventListener("online", callback);
    return () => window.removeEventListener("online", callback);
  },
};

export function runWithRetry<T>(
  attempt: () => Promise<T>,
  options: { environment?: RetryEnvironment } = {},
): Promise<T> {
  const environment = options.environment ?? browserEnvironment;

  return new Promise<T>((resolve) => {
    let failures = 0;
    let running = false;
    let scheduled: unknown = null;

    const clearSchedule = () => {
      if (scheduled === null) return;
      environment.cancel(scheduled);
      scheduled = null;
    };

    const run = async () => {
      if (running || !environment.isOnline()) return;
      running = true;
      clearSchedule();
      try {
        const value = await attempt();
        unsubscribeOnline();
        resolve(value);
      } catch {
        const delay = RETRY_DELAYS_MS[Math.min(failures, RETRY_DELAYS_MS.length - 1)];
        failures += 1;
        scheduled = environment.schedule(run, delay);
      } finally {
        running = false;
      }
    };

    const unsubscribeOnline = environment.onOnline(() => {
      clearSchedule();
      void run();
    });

    void run();
  });
}
~~~

- [ ] **Step 5: Run focused and full tests**

Run: 'npm test -- --test-name-pattern="retry"'

Expected: 3 retry tests PASS.

Run: 'npm test'

Expected: all existing and new tests PASS.

- [ ] **Step 6: Commit**

~~~bash
git add package.json tests/critical-retry.test.mjs src/utils/retry.ts
git commit -m "feat: add resilient critical-load retries"
~~~

---

### Task 2: Critical Manifest And Weighted Progress

**Files:**
- Create: 'src/criticalAssets.ts'
- Create: 'src/utils/weightedProgress.ts'
- Create: 'tests/critical-assets.test.mjs'
- Modify: 'src/sources.ts'

**Interfaces:**
- Produces: 'criticalAssets', 'threeSources', 'soundAssetUrls', and 'coverAssetUrls'.
- Produces: 'createWeightedProgress(entries)' with 'set(id, progress)', 'value', and 'subscribe(callback)'.
- Preserves: existing 'sources' export as an alias of 'threeSources'.

- [ ] **Step 1: Write manifest and progress tests**

~~~js
import test from "node:test";
import assert from "node:assert/strict";

const { criticalAssets, coverAssetUrls, soundAssetUrls, threeSources } =
  await import("../src/criticalAssets.ts");
const { createWeightedProgress } = await import("../src/utils/weightedProgress.ts");

test("critical manifest includes all required home assets", () => {
  assert.equal(threeSources.filter((item) => item.type === "gltfModel").length, 4);
  assert.equal(threeSources.filter((item) => item.type === "texture").length, 15);
  assert.deepEqual(Object.keys(soundAssetUrls).sort(), ["about", "click", "contact", "luci", "room"]);
  assert.deepEqual(Object.keys(coverAssetUrls).sort(), ["gardenDream", "petAgent", "zhiyanAgent"]);
  assert.equal(new Set(criticalAssets.map((item) => item.name)).size, criticalAssets.length);
});

test("weighted progress is monotonic", () => {
  const progress = createWeightedProgress([
    { id: "large", weight: 3 },
    { id: "small", weight: 1 },
  ]);
  progress.set("large", 0.5);
  assert.equal(progress.value, 0.375);
  progress.set("large", 0.25);
  assert.equal(progress.value, 0.375);
  progress.set("small", 1);
  assert.equal(progress.value, 0.625);
});
~~~

- [ ] **Step 2: Verify the tests fail**

Run: 'npm test -- --test-name-pattern="critical manifest|weighted progress"'

Expected: FAIL because the manifest and tracker do not exist.

- [ ] **Step 3: Create the typed manifest**

Replace 'src/criticalAssets.ts' with this complete initial manifest:

~~~ts
import avatarModel from "./assets/models/avatar.glb";
import labModel from "./assets/models/lab.glb";
import roomModel from "./assets/models/room.glb";
import contactModel from "./assets/models/contact.glb";
import contactTexture from "./assets/textures/contact.webp";
import contactShadowTexture from "./assets/textures/contact-shadow.webp";
import desktopsTexture from "./assets/textures/desktops.webp";
import diffuseMap from "./assets/textures/diffuse-map.png";
import faceTexture from "./assets/textures/face-spritesheet.png";
import headTexture from "./assets/textures/head.webp";
import iconSpritesheet from "./assets/textures/icon-spritesheet.webp";
import matcapBlack from "./assets/textures/matcap-black.webp";
import matcapGray from "./assets/textures/matcap-gray.webp";
import matcapSkin from "./assets/textures/matcap-skin.webp";
import matcapWhite from "./assets/textures/matcap-white.webp";
import numbersBitmap from "./assets/textures/numbers-bitmap.webp";
import roomTexture from "./assets/textures/room.webp";
import roomShadowTexture from "./assets/textures/room-shadow.webp";
import hologramPlaneTexture from "./assets/textures/hologram-plane.webp";
import soundClick from "./assets/sounds/click.mp3";
import contactSprite from "./assets/sounds/sprites/contact.ogg";
import roomSprite from "./assets/sounds/sprites/room.mp3";
import trackLuci from "./assets/music/luci.ogg";
import trackAbout from "./assets/music/ambient-pads.ogg";
import thumbnailGardenDream from "./assets/thumbnails/garden-dream.jpg";
import thumbnailZhiyanAgent from "./assets/thumbnails/zhiyan-agent.jpg";
import thumbnailPetAgent from "./assets/thumbnails/pet-agent.jpg";

export type CriticalAssetType = "gltfModel" | "texture" | "sound" | "cover";

type BaseAsset = {
  name: string;
  path: string;
  weight: number;
};

export type ThreeSource = BaseAsset & { type: "gltfModel" | "texture" };
export type SoundSource = BaseAsset & { type: "sound" };
export type CoverSource = BaseAsset & { type: "cover" };
export type CriticalAsset = ThreeSource | SoundSource | CoverSource;

export const soundAssetUrls = {
  click: soundClick,
  contact: contactSprite,
  room: roomSprite,
  luci: trackLuci,
  about: trackAbout,
} as const;

export const coverAssetUrls = {
  gardenDream: thumbnailGardenDream,
  zhiyanAgent: thumbnailZhiyanAgent,
  petAgent: thumbnailPetAgent,
} as const;

export const criticalAssets = [
  { name: "avatar-model", type: "gltfModel", path: avatarModel, weight: 616_536 },
  { name: "lab-model", type: "gltfModel", path: labModel, weight: 11_384 },
  { name: "room-model", type: "gltfModel", path: roomModel, weight: 289_976 },
  { name: "contact-model", type: "gltfModel", path: contactModel, weight: 10_580 },
  { name: "contact-texture", type: "texture", path: contactTexture, weight: 111_790 },
  { name: "contact-shadow-texture", type: "texture", path: contactShadowTexture, weight: 2_910 },
  { name: "desktops-texture", type: "texture", path: desktopsTexture, weight: 5_320 },
  { name: "diffuse-map", type: "texture", path: diffuseMap, weight: 254 },
  { name: "face-texture", type: "texture", path: faceTexture, weight: 22_465 },
  { name: "head-texture", type: "texture", path: headTexture, weight: 16_854 },
  { name: "hologram-plane-texture", type: "texture", path: hologramPlaneTexture, weight: 688 },
  { name: "icon-spritesheet", type: "texture", path: iconSpritesheet, weight: 7_002 },
  { name: "matcap-black", type: "texture", path: matcapBlack, weight: 4_134 },
  { name: "matcap-gray", type: "texture", path: matcapGray, weight: 5_222 },
  { name: "matcap-skin", type: "texture", path: matcapSkin, weight: 5_596 },
  { name: "matcap-white", type: "texture", path: matcapWhite, weight: 3_548 },
  { name: "numbers-bitmap", type: "texture", path: numbersBitmap, weight: 6_564 },
  { name: "room-texture", type: "texture", path: roomTexture, weight: 117_996 },
  { name: "room-shadow-texture", type: "texture", path: roomShadowTexture, weight: 3_050 },
  { name: "sound-click", type: "sound", path: soundClick, weight: 1_419 },
  { name: "sound-contact", type: "sound", path: contactSprite, weight: 24_587 },
  { name: "sound-room", type: "sound", path: roomSprite, weight: 148_418 },
  { name: "music-luci", type: "sound", path: trackLuci, weight: 176_293 },
  { name: "music-about", type: "sound", path: trackAbout, weight: 199_850 },
  { name: "cover-garden-dream", type: "cover", path: thumbnailGardenDream, weight: 179_745 },
  { name: "cover-zhiyan-agent", type: "cover", path: thumbnailZhiyanAgent, weight: 151_303 },
  { name: "cover-pet-agent", type: "cover", path: thumbnailPetAgent, weight: 153_578 },
] as const satisfies readonly CriticalAsset[];

export const threeSources = criticalAssets.filter(
  (asset): asset is (typeof criticalAssets)[number] & ThreeSource =>
    asset.type === "gltfModel" || asset.type === "texture",
);
~~~

Replace 'src/sources.ts' with:

~~~ts
export { threeSources as sources } from "./criticalAssets";
export type { ThreeSource as Source } from "./criticalAssets";
~~~

- [ ] **Step 4: Implement monotonic weighted progress**

~~~ts
type Entry = { id: string; weight: number };
type Listener = (value: number) => void;

export function createWeightedProgress(entries: readonly Entry[]) {
  const values = new Map(entries.map((entry) => [entry.id, 0]));
  const listeners = new Set<Listener>();
  const totalWeight = entries.reduce((total, entry) => total + entry.weight, 0);
  let current = 0;

  const calculate = () =>
    entries.reduce((total, entry) => total + entry.weight * (values.get(entry.id) ?? 0), 0) / totalWeight;

  return {
    get value() {
      return current;
    },
    set(id: string, progress: number) {
      const previous = values.get(id);
      if (previous === undefined) throw new Error("Unknown progress entry: " + id);
      values.set(id, Math.max(previous, Math.min(1, Math.max(0, progress))));
      current = Math.max(current, calculate());
      listeners.forEach((listener) => listener(current));
    },
    subscribe(listener: Listener) {
      listeners.add(listener);
      listener(current);
      return () => listeners.delete(listener);
    },
  };
}
~~~

- [ ] **Step 5: Run tests, type checking, and commit**

Run: 'npm test -- --test-name-pattern="critical manifest|weighted progress"'

Expected: 2 tests PASS.

Run: 'npm run typecheck'

Expected: PASS.

~~~bash
git add src/criticalAssets.ts src/sources.ts src/utils/weightedProgress.ts tests/critical-assets.test.mjs
git commit -m "feat: define critical home assets"
~~~

---

### Task 3: Critical Sound And Cover Loader

**Files:**
- Create: 'src/features/sounds/criticalHowls.ts'
- Create: 'src/utils/criticalMedia.ts'
- Create: 'tests/critical-media.test.mjs'
- Modify: 'src/features/sounds/definitions/music.ts'
- Modify: 'src/features/sounds/definitions/sounds.ts'
- Modify: 'src/features/sounds/definitions/sprites.ts'
- Modify: 'src/features/sounds/composables/useHowler.ts'
- Modify: 'src/content/projects/previews/en.ts'

**Interfaces:**
- Produces: 'criticalHowls: readonly Howl[]'.
- Produces: 'loadCriticalSounds(onProgress): Promise<void>'.
- Produces: 'loadCriticalCovers(onProgress): Promise<void>'.
- Consumes: 'runWithRetry', 'soundAssetUrls', and 'coverAssetUrls'.

- [ ] **Step 1: Add adapter-level tests**

Use this complete test body:

~~~js
import test from "node:test";
import assert from "node:assert/strict";

const { loadCriticalCovers, loadCriticalSounds } = await import("../src/utils/criticalMedia.ts");

const instantRetry = async (attempt) => {
  for (;;) {
    try {
      return await attempt();
    } catch {
      // Retry synchronously in tests.
    }
  }
};

class FakeHowl {
  attempts = 0;
  listeners = new Map();
  state() {
    return this.attempts >= 2 ? "loaded" : "unloaded";
  }
  once(event, callback) {
    this.listeners.set(event, callback);
  }
  off(event, callback) {
    if (this.listeners.get(event) === callback) this.listeners.delete(event);
  }
  load() {
    this.attempts += 1;
    queueMicrotask(() => {
      const event = this.attempts === 1 ? "loaderror" : "load";
      this.listeners.get(event)?.();
    });
  }
}

let imageAttempts = 0;
class FakeImage {
  onload = null;
  onerror = null;
  async decode() {}
  set src(_value) {
    imageAttempts += 1;
    queueMicrotask(() => {
      if (imageAttempts === 1) this.onerror?.();
      else this.onload?.();
    });
  }
}

test("sound and cover loaders resolve only after every item decodes", async () => {
  const soundEvents = [];
  const coverEvents = [];
  const fakeHowls = [new FakeHowl(), new FakeHowl()];
  await Promise.all([
    loadCriticalSounds((value) => soundEvents.push(value), fakeHowls, instantRetry),
    loadCriticalCovers((value) => coverEvents.push(value), () => new FakeImage(), instantRetry),
  ]);
  assert.equal(soundEvents.at(-1), 1);
  assert.equal(coverEvents.at(-1), 1);
  assert.ok(soundEvents.every((value, index) => index === 0 || value >= soundEvents[index - 1]));
  assert.ok(coverEvents.every((value, index) => index === 0 || value >= coverEvents[index - 1]));
});
~~~

The fakes implement the exact minimal adapters exported from 'criticalMedia.ts':

~~~ts
export type HowlAdapter = {
  state(): string;
  once(event: "load" | "loaderror", callback: (...args: unknown[]) => void): void;
  off(event: "load" | "loaderror", callback: (...args: unknown[]) => void): void;
  load(): void;
};

export type ImageAdapter = {
  src: string;
  onload: null | (() => void);
  onerror: null | (() => void);
  decode(): Promise<void>;
};
~~~

- [ ] **Step 2: Verify the test fails**

Run: 'npm test -- --test-name-pattern="sound and cover"'

Expected: FAIL because 'criticalMedia.ts' does not exist.

- [ ] **Step 3: Reuse manifest URLs in existing definitions**

Replace direct asset imports in the three sound definition files with 'soundAssetUrls'. Replace the three direct JPG imports in 'src/content/projects/previews/en.ts' with 'coverAssetUrls'. Keep the exported content objects and Howl sprite timings unchanged.

Create 'criticalHowls.ts':

~~~ts
import { musicTracks } from "./definitions/music";
import { sounds } from "./definitions/sounds";
import { sprites } from "./definitions/sprites";

export const criticalHowls = [
  musicTracks.luci,
  musicTracks.about,
  sounds.click.howl,
  sprites.contact.howl,
  sprites.room.howl,
] as const;
~~~

Remove 'loadAllSounds()' and its call from 'useHowler.ts'; critical boot becomes the only preload owner.

- [ ] **Step 4: Implement media loading**

Use 'runWithRetry' around one Promise per Howl and image. Clean up 'load' and 'loaderror' listeners after every attempt. A cover attempt creates a new Image, assigns handlers before 'src', waits for 'onload', then awaits 'decode()'. Track completion with 'createWeightedProgress' and the weights in the critical manifest.

The public entry points must be:

~~~ts
export function loadCriticalSounds(
  onProgress: (value: number) => void,
  howls: readonly HowlAdapter[] = criticalHowls,
  retry: typeof runWithRetry = runWithRetry,
): Promise<void>;

export function loadCriticalCovers(
  onProgress: (value: number) => void,
  createImage: () => ImageAdapter = () => new Image(),
  retry: typeof runWithRetry = runWithRetry,
): Promise<void>;
~~~

- [ ] **Step 5: Verify**

Run: 'npm test -- --test-name-pattern="sound and cover"'

Expected: PASS.

Run: 'npm run typecheck'

Expected: PASS.

- [ ] **Step 6: Commit**

~~~bash
git add src/criticalAssets.ts src/features/sounds src/utils/criticalMedia.ts src/content/projects/previews/en.ts tests/critical-media.test.mjs
git commit -m "feat: preload home sounds and covers"
~~~

---

### Task 4: Retrying Three.js Resource Loader

**Files:**
- Modify: 'src/utils/resources.ts'
- Create: 'tests/three-resources.test.mjs'

**Interfaces:**
- Produces: 'Resources.startLoading(onProgress?): Promise<void>'.
- Produces: exported 'Resources' class with an injected source-load adapter for tests.
- Consumes: 'threeSources', 'runWithRetry', and 'createWeightedProgress'.

- [ ] **Step 1: Write failing resource tests**

Test a two-source Resources instance where one adapter rejects once. Assert:

~~~js
assert.equal(await resources.startLoading(), undefined);
assert.equal(attempts.get("avatar-model"), 2);
assert.equal(attempts.get("room-texture"), 1);
assert.equal(resources.loaded, 2);
assert.equal(resources.isReady, true);
assert.deepEqual(progressValues.at(-1), 1);
~~~

Call 'startLoading()' twice and assert the same Promise is returned and no source starts twice.

- [ ] **Step 2: Run and verify failure**

Run: 'npm test -- --test-name-pattern="Three resources"'

Expected: FAIL because current Resources is not injectable and never retries.

- [ ] **Step 3: Refactor Resources**

Remove the unused FontLoader. Export the class. Its constructor accepts sources and:

~~~ts
export type ResourceLoadAdapter = (
  source: ThreeSource,
  onProgress: (progress: number) => void,
) => Promise<ResourceType>;
~~~

The default adapter wraps GLTFLoader and TextureLoader 'load()' callbacks, supplies the error callback, and derives progress from 'event.loaded / event.total' when total is positive. Configure GLTFLoader with Three.js 'MeshoptDecoder'.

'startLoading()' must memoize a Promise, run all source loads through 'runWithRetry', update weighted progress, store each decoded item once, and resolve only when all 19 sources succeed.

- [ ] **Step 4: Verify**

Run: 'npm test -- --test-name-pattern="Three resources"'

Expected: PASS.

Run: 'npm run typecheck'

Expected: PASS.

- [ ] **Step 5: Commit**

~~~bash
git add src/utils/resources.ts tests/three-resources.test.mjs
git commit -m "feat: retry critical Three.js assets"
~~~

---

### Task 5: Scene Compilation And First-Frame Gate

**Files:**
- Modify: 'src/three/index.ts'
- Modify: 'src/three/objects/index.ts'
- Modify: 'src/three/core/renderer.ts'
- Create: 'src/utils/criticalBoot.ts'
- Create: 'tests/critical-boot.test.mjs'

**Interfaces:**
- Produces: 'three.prepare(canvas, onProgress): Promise<void>'.
- Produces: 'renderer.renderOnce(): void' and 'renderer.hasNonBlankFrame(): boolean'.
- Produces: singleton 'criticalBoot' with 'start(canvas)', 'progress', 'ready', 'onProgress', and 'onReady'.
- Consumes: 'resources.startLoading', critical media loaders, and 'runWithRetry'.

- [ ] **Step 1: Write coordinator tests**

Inject four fake stages into an exported 'createCriticalBoot(dependencies)' factory. Resolve them one at a time and assert:

~~~js
assert.equal(boot.ready, false);
assert.ok(progressAfterAssets <= 0.8);
assert.ok(progressAfterCompile >= 0.95);
assert.equal(boot.progress, 1);
assert.equal(boot.ready, true);
assert.equal(readyEvents, 1);
~~~

Add a failed scene preparation attempt and prove it retries without rerunning the already successful asset loaders.

- [ ] **Step 2: Verify failure**

Run: 'npm test -- --test-name-pattern="critical boot"'

Expected: FAIL because the coordinator does not exist.

- [ ] **Step 3: Make object and renderer setup awaitable**

Change 'objects.init()' to 'async' and await 'renderer.compile()'. Extract the existing body of 'renderer.tick()' into 'renderFrame()'. Export:

~~~ts
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
  return pixel[3] > 0 && (pixel[0] > 0 || pixel[1] > 0 || pixel[2] > 0);
};
~~~

'renderFrame(force)' bypasses the normal visibility guard only when 'force' is true.

- [ ] **Step 4: Make Three.js preparation promise-based**

'three.prepare(canvas, onProgress)' initializes sizes, camera, render target, and renderer; awaits 'objects.init()'; reports compile completion; renders once; throws if 'hasNonBlankFrame()' is false; then initializes raycasting. Memoize successful preparation and reset the memoized Promise in 'destroy()'.

- [ ] **Step 5: Implement critical boot**

Run the Three asset, sound, and cover loaders concurrently with weights 65, 10, and 5. After all three resolve, run 'three.prepare()' through 'runWithRetry' with weights 15 for preparation and 5 for frame validation. Emit 'ready' once only after progress reaches 1.

- [ ] **Step 6: Verify and commit**

Run: 'npm test -- --test-name-pattern="critical boot"'

Expected: PASS.

Run: 'npm run typecheck'

Expected: PASS.

~~~bash
git add src/three src/utils/criticalBoot.ts tests/critical-boot.test.mjs
git commit -m "feat: gate entry on a complete 3d frame"
~~~

---

### Task 6: Connect The Logo Preloader

**Files:**
- Modify: 'src/composables/usePreloader.ts'
- Modify: 'src/features/home/components/Home.vue'
- Modify: 'index.html'
- Modify: 'src/assets/styles/preloader.scss'
- Create: 'tests/preloader-contract.test.mjs'

**Interfaces:**
- Consumes: 'criticalBoot.onProgress' and 'criticalBoot.onReady'.
- Preserves: 'preloaderVisible' for existing animation and layout consumers.

- [ ] **Step 1: Add a static contract test**

Assert that 'usePreloader.ts' references 'criticalBoot' and no longer hides on 'resourcesProgress === 1'. Assert that 'Home.vue' calls 'criticalBoot.start' with the canvas. Assert that 'index.html' contains a 'data-critical-preloader' style block before the Vite entry script.

- [ ] **Step 2: Verify failure**

Run: 'npm test -- --test-name-pattern="preloader contract"'

Expected: FAIL against the old preloader implementation.

- [ ] **Step 3: Update usePreloader**

Subscribe immediately to current boot progress, update '.preloader-rect', and hide only from the 'ready' callback. Remove subscriptions on unmount. Keep the existing 0.2-second delayed transition and GSAP behavior.

- [ ] **Step 4: Start boot from the mounted canvas**

Replace 'three.init(threeCanvasRef.value)' in 'Home.vue' with:

~~~ts
void criticalBoot.start(threeCanvasRef.value);
threeInitialized.value = true;
~~~

Keep animation startup dependent on 'preloaderVisible === false'.

- [ ] **Step 5: Inline minimum preloader paint styles**

Add a compact 'style data-critical-preloader' block in 'index.html' that uses literal '#f5efe6' and '#2d2a24' colors, fixed full-viewport positioning, centered 120px SVG, the current opacity transition, and the bottom transform origin. Keep 'preloader.scss' for the full application state and ensure both definitions match.

- [ ] **Step 6: Verify and commit**

Run: 'npm test -- --test-name-pattern="preloader contract"'

Expected: PASS.

Run: 'npm run typecheck'

Expected: PASS.

~~~bash
git add index.html src/assets/styles/preloader.scss src/composables/usePreloader.ts src/features/home/components/Home.vue tests/preloader-contract.test.mjs
git commit -m "feat: reveal home after critical boot"
~~~

---

### Task 7: Defer Project Detail Code And Media

**Files:**
- Modify: 'src/App.vue'
- Modify: 'src/content/projects/index.ts'
- Modify: 'src/features/projects/components/Project.vue'
- Modify: 'tests/project-loading.test.mjs'
- Create: 'tests/deferred-project-assets.test.mjs'

**Interfaces:**
- Produces: lazy project module functions returning 'Promise<{ default: ProjectContent }>'.
- Preserves: direct '/project/:id' routes and the latest-navigation-wins behavior.

- [ ] **Step 1: Add failing lazy-loading tests**

Assert that project globs no longer use '{ eager: true }'. Add a loader test where the project module itself is async. Add a static App test that Project and ProjectBackground use 'defineAsyncComponent'.

- [ ] **Step 2: Verify failure**

Run: 'npm test -- --test-name-pattern="deferred project|latest project"'

Expected: the deferred-project test FAILS while current project-loader tests remain PASSING.

- [ ] **Step 3: Make project content modules lazy**

Remove '{ eager: true }' from both locale globs. Type each value as:

~~~ts
type ProjectModuleLoader = () => Promise<{ default: ProjectContent }>;
~~~

In 'Project.vue', await the selected module loader before returning its default export.

- [ ] **Step 4: Lazy-load project UI**

In 'App.vue', replace static imports with:

~~~ts
import { defineAsyncComponent } from "vue";

const Project = defineAsyncComponent(() => import("./features/projects/components/Project.vue"));
const ProjectBackground = defineAsyncComponent(
  () => import("./features/projects/components/ProjectBackground.vue"),
);
~~~

Mount these components only while 'projectVisible' or 'isTransitioning' is true. Confirm that a direct project URL sets 'projectVisible' early enough to mount both components.

- [ ] **Step 5: Verify and commit**

Run: 'npm test -- --test-name-pattern="deferred project|latest project"'

Expected: PASS.

Run: 'npm run typecheck'

Expected: PASS.

~~~bash
git add src/App.vue src/content/projects/index.ts src/features/projects/components/Project.vue tests/project-loading.test.mjs tests/deferred-project-assets.test.mjs
git commit -m "perf: defer project detail bundles"
~~~

---

### Task 8: Optimize Critical Binary Assets

**Files:**
- Modify: 'package.json'
- Modify: 'package-lock.json'
- Modify: 'src/assets/models/avatar.glb'
- Modify: 'src/assets/models/contact.glb'
- Modify: 'src/assets/models/lab.glb'
- Modify: 'src/assets/models/room.glb'
- Create: 'src/assets/sounds/click.ogg'
- Create: 'src/assets/sounds/sprites/room.ogg'
- Create: 'src/assets/thumbnails/garden-dream.webp'
- Create: 'src/assets/thumbnails/zhiyan-agent.webp'
- Create: 'src/assets/thumbnails/pet-agent.webp'
- Modify: 'src/criticalAssets.ts'
- Modify: 'tests/thumbnail-assets.test.mjs'
- Create: 'tests/critical-asset-budgets.test.mjs'

**Interfaces:**
- Preserves: logical asset names and sound sprite timing definitions.
- Updates: manifest URLs and weights to exact optimized file byte sizes.

- [ ] **Step 1: Add failing asset-budget tests**

Assert:

~~~js
assert.ok(totalModelBytes < 928_476, "Meshopt models must be smaller than the current baseline");
assert.ok(totalSoundBytes < 500_000, "critical OGG audio must stay below 500KB");
for (const cover of covers) {
  assert.match(cover, /\.webp$/);
  assert.ok(statSync(cover).size < 150_000);
}
~~~

- [ ] **Step 2: Verify failure**

Run: 'npm test -- --test-name-pattern="critical asset budgets|preview thumbnails"'

Expected: FAIL because the new OGG and WebP files do not exist.

- [ ] **Step 3: Install free build-time tools**

Run:

~~~bash
npm install --save-dev @gltf-transform/cli sharp-cli ffmpeg-static
~~~

Expected: package and lock files update; no runtime dependency is added to the production bundle.

- [ ] **Step 4: Convert the three covers**

Run 'npx sharp' for each JPG with WebP quality 82 and the original pixel dimensions. Write to the three exact WebP paths listed above. Inspect all three images before updating imports.

- [ ] **Step 5: Convert active MP3 sounds to OGG**

Resolve the 'ffmpeg-static' binary with Node, then encode 'click.mp3' and 'sprites/room.mp3' using libvorbis quality 4. Preserve sample rate and channels. Verify the room sprite duration and each configured sprite segment.

- [ ] **Step 6: Optimize every GLB with Meshopt**

For each model run:

~~~bash
npx gltf-transform optimize input.glb output.glb --compress meshopt
~~~

Use a temporary output path, compare model structure and rendered screenshots, then replace the source GLB only after it passes.

- [ ] **Step 7: Update URLs, weights, and tests**

Point the critical manifest at the new OGG and WebP files. Replace every manifest weight with the exact post-conversion byte size. Update 'thumbnail-assets.test.mjs' to check only the three WebP cover paths.

- [ ] **Step 8: Verify and commit**

Run: 'npm test -- --test-name-pattern="critical asset budgets|preview thumbnails"'

Expected: PASS.

Run: 'npm run build'

Expected: PASS with Meshopt-compressed models emitted.

~~~bash
git add package.json package-lock.json src/assets/models src/assets/sounds src/assets/thumbnails src/criticalAssets.ts tests/thumbnail-assets.test.mjs tests/critical-asset-budgets.test.mjs
git commit -m "perf: compress critical home assets"
~~~

---

### Task 9: Full Verification And Production Comparison

**Files:**
- Modify only if verification finds an in-scope defect.

**Interfaces:**
- Validates all prior task outputs together.

- [ ] **Step 1: Run repository verification**

Run: 'npm run verify'

Expected: type checking, every Node test, and Vite production build PASS.

- [ ] **Step 2: Start the production preview**

Run: 'npm run preview -- --host 127.0.0.1'

Expected: Vite prints a local preview URL and keeps running.

- [ ] **Step 3: Verify cold desktop loading**

Open the preview in a fresh browser context at 1440x900. Confirm the logo appears before application content, progress never reverses, the preloader exits once, the first visible frame contains the complete 3D scene, all three covers are already painted, and enabling sound plays immediately.

- [ ] **Step 4: Verify mobile loading**

Repeat at 390x844. Confirm no overlap, no missing canvas content, and the preloader remains centered with stable dimensions.

- [ ] **Step 5: Verify retry and reconnect**

Block one model request, one OGG request, and one cover request independently. Confirm the logo remains, completed progress is retained, retries follow the capped schedule, and restoring the request completes the page without reload.

- [ ] **Step 6: Verify deferred traffic**

During the preloader phase, inspect the network list. Confirm no project detail WebP, JPG, PNG, or MP4 request appears. Open each project route afterward and confirm its detail chunk and media load on demand.

- [ ] **Step 7: Capture evidence**

Save desktop and mobile screenshots plus a network summary recording critical request count, critical transferred bytes, cold time-to-ready, and warm time-to-ready. Compare these values with the production observations in the design document. Do not claim a fixed GitHub Pages timing guarantee.

- [ ] **Step 8: Final commit if verification required fixes**

Stage only files changed to correct verified in-scope defects and commit:

~~~bash
git commit -m "fix: complete critical loading verification"
~~~
