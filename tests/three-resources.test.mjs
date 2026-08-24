import test from "node:test";
import assert from "node:assert/strict";

const { Resources } = await import("../src/utils/resources.ts");

const instantRetry = async (attempt) => {
  for (;;) {
    try {
      return await attempt();
    } catch {
      // Retry synchronously in tests.
    }
  }
};

test("Three resources retry failures and memoize one complete load", async () => {
  const sources = [
    { name: "avatar-model", type: "gltfModel", path: "/avatar.glb", weight: 3 },
    { name: "room-texture", type: "texture", path: "/room.webp", weight: 1 },
  ];
  const attempts = new Map();
  const progressValues = [];

  const adapter = async (source, onProgress) => {
    const count = (attempts.get(source.name) ?? 0) + 1;
    attempts.set(source.name, count);
    onProgress(0.5);
    if (source.name === "avatar-model" && count === 1) throw new Error("temporary");
    onProgress(1);
    return { source: source.name };
  };

  const resources = new Resources(sources, adapter, instantRetry);
  resources.on("progress", (value) => progressValues.push(value));

  const firstStart = resources.startLoading();
  const secondStart = resources.startLoading();

  assert.equal(firstStart, secondStart);
  assert.equal(await firstStart, undefined);
  assert.equal(attempts.get("avatar-model"), 2);
  assert.equal(attempts.get("room-texture"), 1);
  assert.equal(resources.loaded, 2);
  assert.equal(resources.isReady, true);
  assert.equal(progressValues.at(-1), 1);
});
