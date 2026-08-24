import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("critical manifest includes all required home assets", () => {
  const source = readFileSync("src/criticalAssets.ts", "utf8");
  const entries = [...source.matchAll(/\{ name: "([^"]+)", type: "([^"]+)"/g)].map((match) => ({
    name: match[1],
    type: match[2],
  }));

  assert.equal(entries.filter((entry) => entry.type === "gltfModel").length, 4);
  assert.equal(entries.filter((entry) => entry.type === "texture").length, 15);
  assert.equal(entries.filter((entry) => entry.type === "sound").length, 5);
  assert.equal(entries.filter((entry) => entry.type === "cover").length, 3);
  assert.equal(new Set(entries.map((entry) => entry.name)).size, entries.length);
});

test("weighted progress uses weights and never moves backward", async () => {
  const { createWeightedProgress } = await import("../src/utils/weightedProgress.ts");
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
