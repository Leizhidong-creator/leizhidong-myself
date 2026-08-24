import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

test("deferred project code and media stay out of the home startup path", () => {
  const projects = readFileSync("src/content/projects/index.ts", "utf8");
  const app = readFileSync("src/App.vue", "utf8");
  const project = readFileSync("src/features/projects/components/Project.vue", "utf8");

  assert.doesNotMatch(projects, /eager:\s*true/);
  assert.match(projects, /ProjectModuleLoader/);
  assert.match(project, /await\s+loadModule\(\)/);
  assert.match(app, /defineAsyncComponent\(\(\)\s*=>\s*import\("\.\/features\/projects\/components\/Project\.vue"\)\)/);
  assert.match(app, /defineAsyncComponent\([\s\S]*ProjectBackground\.vue/);
  assert.match(app, /v-if="projectVisible \|\| isTransitioning"/);
});
