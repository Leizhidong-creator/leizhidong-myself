import test from "node:test";
import assert from "node:assert/strict";

const { createPreloaderGate } = await import("../src/composables/preloaderGate.ts");

test("preloader gate waits for the core 3D scene before revealing the app", async () => {
  let reveals = 0;
  const gate = createPreloaderGate(() => {
    reveals += 1;
  });

  await new Promise((resolve) => setTimeout(resolve, 25));

  assert.equal(reveals, 0);
  gate.markReady();
  assert.equal(reveals, 1);
  gate.markReady();
  assert.equal(reveals, 1);
});
