import test from "node:test";
import assert from "node:assert/strict";

const { createProjectLoader } = await import("../src/features/projects/utils/projectLoader.ts");

test("latest project load wins when navigation changes quickly", async () => {
  const resolvers = new Map();
  const load = (id) =>
    new Promise((resolve) => {
      resolvers.set(id, resolve);
    });

  const loader = createProjectLoader(load);
  const first = loader.load("garden-dream");
  const second = loader.load("pet-agent");

  resolvers.get("garden-dream")({ title: "Garden" });
  resolvers.get("pet-agent")({ title: "Pet" });

  assert.equal(await first, null);
  assert.deepEqual(await second, { title: "Pet" });
  assert.deepEqual(loader.current.value, { title: "Pet" });
});

test("a stale failed load does not reject the active project", async () => {
  const resolvers = new Map();
  const rejectors = new Map();
  const load = (id) =>
    new Promise((resolve, reject) => {
      resolvers.set(id, resolve);
      rejectors.set(id, reject);
    });

  const loader = createProjectLoader(load);
  const first = loader.load("garden-dream");
  const second = loader.load("pet-agent");

  rejectors.get("garden-dream")(new Error("stale failure"));
  assert.equal(await first, null);

  resolvers.get("pet-agent")({ title: "Pet" });
  assert.deepEqual(await second, { title: "Pet" });
});
