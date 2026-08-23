import test from "node:test";
import assert from "node:assert/strict";

const { createPreloaderGate } = await import("../src/composables/preloaderGate.ts");

test("preloader gate reveals the app without waiting for resource completion", async () => {
  let reveals = 0;
  const gate = createPreloaderGate(() => {
    reveals += 1;
  }, 10);

  await new Promise((resolve) => setTimeout(resolve, 25));

  assert.equal(reveals, 1);
  gate.revealOnce();
  assert.equal(reveals, 1);
});
