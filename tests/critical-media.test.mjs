import test from "node:test";
import assert from "node:assert/strict";

const { loadCriticalCovers, loadCriticalSounds } = await import("../src/utils/criticalMedia.ts");
const { coverSources } = await import("../src/criticalAssets.ts");

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

test("cover loading waits for the mounted project preview images", async () => {
  class MountedImage {
    onload = null;
    onerror = null;
    complete = false;
    naturalWidth = 0;
    decoded = false;

    constructor(path) {
      this.currentSrc = path;
      this._src = path;
    }

    get src() {
      return this._src;
    }

    set src(value) {
      this._src = value;
      this.currentSrc = value;
      queueMicrotask(() => {
        this.complete = true;
        this.naturalWidth = 1200;
        this.onload?.();
      });
    }

    async decode() {
      this.decoded = true;
    }
  }

  const images = coverSources.map((source) => new MountedImage(source.path));
  const previousDocument = globalThis.document;
  globalThis.document = {
    querySelectorAll: (selector) => (selector === ".preview-card-image" ? images : []),
  };

  try {
    await loadCriticalCovers(
      () => undefined,
      undefined,
      (attempt) => attempt(),
    );
  } finally {
    globalThis.document = previousDocument;
  }

  assert.ok(images.every((image) => image.complete && image.naturalWidth > 0));
  assert.ok(images.every((image) => image.decoded));
});
