import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("preloader contract waits for critical boot without changing the logo experience", () => {
  const preloader = readFileSync("src/composables/usePreloader.ts", "utf8");
  const home = readFileSync("src/features/home/components/Home.vue", "utf8");
  const html = readFileSync("index.html", "utf8");

  assert.match(preloader, /criticalBoot/);
  assert.doesNotMatch(preloader, /resources\.on\("progress"/);
  assert.match(home, /criticalBoot\.start\(threeCanvasRef\.value\)/);

  const criticalStyle = html.indexOf("<style data-critical-preloader>");
  const viteEntry = html.indexOf('<script type="module" src="./src/main.ts"></script>');
  assert.ok(criticalStyle >= 0, "minimum preloader CSS must be inline");
  assert.ok(criticalStyle < viteEntry, "minimum preloader CSS must precede the Vite entry");
});
