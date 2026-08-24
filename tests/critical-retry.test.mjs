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
        const handle = { callback, delay };
        queue.push(handle);
        return handle;
      },
      cancel: (handle) => {
        const index = queue.indexOf(handle);
        if (index >= 0) queue.splice(index, 1);
      },
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

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

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

  await flushPromises();
  const delays = [];
  while (attempts < 7) {
    delays.push(fake.runNext());
    await flushPromises();
  }

  assert.deepEqual(delays, [1_000, 2_000, 4_000, 8_000, 10_000, 10_000]);
  assert.equal(await result, "loaded");
});

test("offline work waits for the online event", async () => {
  const fake = createEnvironment();
  fake.setOnline(false);
  let attempts = 0;
  const result = runWithRetry(async () => ++attempts, { environment: fake.environment });

  await flushPromises();
  assert.equal(attempts, 0);
  fake.setOnline(true);
  assert.equal(await result, 1);
});

test("the exported schedule is stable", () => {
  assert.deepEqual(RETRY_DELAYS_MS, [1_000, 2_000, 4_000, 8_000, 10_000]);
});
