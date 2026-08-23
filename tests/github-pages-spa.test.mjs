import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("GitHub Pages deployment publishes an SPA fallback", () => {
  const workflow = readFileSync(".github/workflows/static.yml", "utf8");

  assert.match(workflow, /cp\s+dist\/index\.html\s+dist\/404\.html/);
});
