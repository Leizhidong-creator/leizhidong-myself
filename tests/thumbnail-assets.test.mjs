import { statSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const thumbnailFiles = [
  "src/assets/thumbnails/garden-dream.webp",
  "src/assets/thumbnails/zhiyan-agent.webp",
  "src/assets/thumbnails/pet-agent.webp",
];

test("project preview thumbnails are optimized for public loading", () => {
  for (const file of thumbnailFiles) {
    const stat = statSync(file);

    assert.ok(stat.size > 10_000, `${file} should not be empty`);
    assert.ok(stat.size < 150_000, `${file} should stay below 150KB`);
  }
});
