import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { createStaticRequestHandler } from "../server.mjs";

const read = async (baseUrl, path) => {
  const response = await fetch(`${baseUrl}${path}`);

  return {
    status: response.status,
    contentType: response.headers.get("content-type"),
    text: await response.text(),
  };
};

test("static server serves assets and falls back frontend routes to index", async () => {
  const root = join(tmpdir(), `portfolio-static-${Date.now()}`);

  mkdirSync(join(root, "assets"), { recursive: true });
  writeFileSync(join(root, "index.html"), "<!doctype html><title>Portfolio</title><div id=\"app\"></div>");
  writeFileSync(join(root, "assets", "card.jpg"), "fake-jpg");

  const server = createServer(createStaticRequestHandler(root));

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const home = await read(baseUrl, "/");
    assert.equal(home.status, 200);
    assert.match(home.contentType, /text\/html/);
    assert.match(home.text, /Portfolio/);

    const asset = await read(baseUrl, "/assets/card.jpg");
    assert.equal(asset.status, 200);
    assert.match(asset.contentType, /image\/jpeg/);
    assert.equal(asset.text, "fake-jpg");

    const health = await read(baseUrl, "/api/health");
    assert.equal(health.status, 200);
    assert.match(health.contentType, /application\/json/);
    assert.deepEqual(JSON.parse(health.text), { status: "ok" });

    const route = await read(baseUrl, "/project/garden-dream");
    assert.equal(route.status, 200);
    assert.match(route.contentType, /text\/html/);
    assert.match(route.text, /Portfolio/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
  }
});

test("static server supports a CloudBase route base path", async () => {
  const root = join(tmpdir(), `portfolio-static-base-${Date.now()}`);

  mkdirSync(join(root, "chunks"), { recursive: true });
  writeFileSync(join(root, "index.html"), "<!doctype html><title>Portfolio Base</title>");
  writeFileSync(join(root, "chunks", "app.js"), "console.log('ok')");

  const server = createServer(createStaticRequestHandler(root, "/leizhidong-ai-developer"));

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const { port } = server.address();
    const baseUrl = `http://127.0.0.1:${port}`;

    const home = await read(baseUrl, "/leizhidong-ai-developer/");
    assert.equal(home.status, 200);
    assert.match(home.text, /Portfolio Base/);

    const asset = await read(baseUrl, "/leizhidong-ai-developer/chunks/app.js");
    assert.equal(asset.status, 200);
    assert.match(asset.contentType, /text\/javascript/);
    assert.equal(asset.text, "console.log('ok')");

    const route = await read(baseUrl, "/leizhidong-ai-developer/project/garden-dream");
    assert.equal(route.status, 200);
    assert.match(route.text, /Portfolio Base/);

    const forwardedHome = await read(baseUrl, "/");
    assert.equal(forwardedHome.status, 200);
    assert.match(forwardedHome.text, /Portfolio Base/);

    const forwardedAsset = await read(baseUrl, "/chunks/app.js");
    assert.equal(forwardedAsset.status, 200);
    assert.match(forwardedAsset.contentType, /text\/javascript/);

    const forwardedRoute = await read(baseUrl, "/project/garden-dream");
    assert.equal(forwardedRoute.status, 200);
    assert.match(forwardedRoute.text, /Portfolio Base/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    rmSync(root, { recursive: true, force: true });
  }
});
