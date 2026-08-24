import test from "node:test";
import assert from "node:assert/strict";

const { createCriticalBoot } = await import("../src/utils/criticalBoot.ts");

const deferred = () => {
  let resolve;
  const promise = new Promise((done) => {
    resolve = done;
  });
  return { promise, resolve };
};

const flush = async () => {
  await new Promise((resolve) => setImmediate(resolve));
};

test("critical boot becomes ready only after assets, compile, and the first frame", async () => {
  const modelAssets = deferred();
  const sounds = deferred();
  const covers = deferred();
  const sceneStarted = deferred();
  const compile = deferred();
  const frame = deferred();
  let readyEvents = 0;

  const boot = createCriticalBoot({
    loadThree: async (onProgress) => {
      await modelAssets.promise;
      onProgress(1);
    },
    loadSounds: async (onProgress) => {
      await sounds.promise;
      onProgress(1);
    },
    loadCovers: async (onProgress) => {
      await covers.promise;
      onProgress(1);
    },
    prepareScene: async (_canvas, onProgress) => {
      sceneStarted.resolve();
      await compile.promise;
      onProgress(0.75);
      await frame.promise;
      onProgress(1);
    },
  });
  boot.onReady(() => {
    readyEvents += 1;
  });

  const result = boot.start({});
  modelAssets.resolve();
  sounds.resolve();
  covers.resolve();
  await sceneStarted.promise;
  const progressAfterAssets = boot.progress;

  assert.equal(boot.ready, false);
  assert.ok(progressAfterAssets <= 0.8);

  compile.resolve();
  await flush();
  const progressAfterCompile = boot.progress;
  assert.ok(progressAfterCompile >= 0.95);
  assert.equal(boot.ready, false);

  frame.resolve();
  await result;
  assert.equal(boot.progress, 1);
  assert.equal(boot.ready, true);
  assert.equal(readyEvents, 1);
});

test("critical boot retries scene preparation without rerunning loaded assets", async () => {
  const calls = { three: 0, sounds: 0, covers: 0, scene: 0 };
  const instantRetry = async (attempt) => {
    for (;;) {
      try {
        return await attempt();
      } catch {
        // Retry synchronously in tests.
      }
    }
  };
  const complete = (name) => async (onProgress) => {
    calls[name] += 1;
    onProgress(1);
  };
  const boot = createCriticalBoot({
    loadThree: complete("three"),
    loadSounds: complete("sounds"),
    loadCovers: complete("covers"),
    prepareScene: async (_canvas, onProgress) => {
      calls.scene += 1;
      if (calls.scene === 1) throw new Error("blank frame");
      onProgress(1);
    },
    retry: instantRetry,
  });

  await boot.start({});
  assert.deepEqual(calls, { three: 1, sounds: 1, covers: 1, scene: 2 });
});
