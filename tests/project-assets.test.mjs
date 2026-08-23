import { readFileSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const projectFiles = [
  "src/content/projects/en/garden-dream.ts",
  "src/content/projects/en/zhiyan-agent.ts",
  "src/content/projects/en/pet-agent.ts",
];

test("project detail images use compressed WebP assets", () => {
  for (const file of projectFiles) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /assets\/images\/projects\/[^\"']+\.(?:png|jpe?g)/i, file);
    assert.match(source, /assets\/images\/projects\/[^\"']+\.webp/i, file);

    for (const [, assetPath] of source.matchAll(/from "(\.\.\/\.\.\/\.\.\/assets\/images\/projects\/[^\"]+\.webp)"/g)) {
      const size = statSync(resolve(dirname(file), assetPath)).size;
      assert.ok(size < 400_000, `${assetPath} should stay below 400KB`);
    }
  }
});
