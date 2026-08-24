import { readFileSync, statSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const models = ["avatar.glb", "contact.glb", "lab.glb", "room.glb"].map(
  (name) => `src/assets/models/${name}`,
);
const sounds = [
  "src/assets/sounds/click.ogg",
  "src/assets/sounds/sprites/contact.ogg",
  "src/assets/sounds/sprites/room.ogg",
  "src/assets/music/luci.ogg",
  "src/assets/music/ambient-pads.ogg",
];
const covers = ["garden-dream.webp", "zhiyan-agent.webp", "pet-agent.webp"].map(
  (name) => `src/assets/thumbnails/${name}`,
);

test("critical asset budgets reduce startup transfer size", () => {
  const totalModelBytes = models.reduce((total, file) => total + statSync(file).size, 0);
  const totalSoundBytes = sounds.reduce((total, file) => total + statSync(file).size, 0);

  assert.ok(totalModelBytes < 928_476, "Meshopt models must be smaller than the current baseline");
  assert.ok(totalSoundBytes < 500_000, "critical OGG audio must stay below 500KB");
  for (const cover of covers) {
    assert.match(cover, /\.webp$/);
    assert.ok(statSync(cover).size < 150_000, `${cover} must stay below 150KB`);
  }
});

test("critical manifest points at the optimized files", () => {
  const manifest = readFileSync("src/criticalAssets.ts", "utf8");
  assert.match(manifest, /sounds\/click\.ogg/);
  assert.match(manifest, /sounds\/sprites\/room\.ogg/);
  assert.doesNotMatch(manifest, /thumbnails\/(garden-dream|zhiyan-agent|pet-agent)\.jpg/);
});
