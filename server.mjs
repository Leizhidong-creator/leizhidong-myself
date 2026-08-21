import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".glb": "model/gltf-binary",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
};

const send = (response, statusCode, body, contentType = "text/plain; charset=utf-8") => {
  response.writeHead(statusCode, {
    "content-type": contentType,
    "cache-control": statusCode === 200 ? "no-store" : "no-cache",
  });
  response.end(body);
};

const getSafeFilePath = (root, requestPath) => {
  const decodedPath = decodeURIComponent(requestPath.split("?")[0] ?? "/");
  const relativePath = normalize(decodedPath).replace(/^(\.\.(\/|\\|$))+/, "").replace(/^[/\\]+/, "");
  const filePath = resolve(root, relativePath);
  const rootWithSeparator = root.endsWith(sep) ? root : `${root}${sep}`;

  if (filePath !== root && !filePath.startsWith(rootWithSeparator)) {
    return null;
  }

  return filePath;
};

const normalizeBasePath = (basePath = "") => {
  if (!basePath || basePath === "/") return "";

  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
};

const stripBasePath = (requestPath, basePath) => {
  if (!basePath) return requestPath;
  if (requestPath === basePath) return "/";
  if (requestPath.startsWith(`${basePath}/`)) return requestPath.slice(basePath.length);

  return requestPath;
};

export const createStaticRequestHandler = (distRoot = resolve("dist"), basePath = process.env.BASE_PATH || "") => {
  const root = resolve(distRoot);
  const indexPath = join(root, "index.html");
  const normalizedBasePath = normalizeBasePath(basePath);

  return (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      send(response, 405, "Method Not Allowed");
      return;
    }

    const originalPath = request.url?.split("?")[0] || "/";
    const requestPath = stripBasePath(originalPath, normalizedBasePath);

    if (!requestPath) {
      send(response, 404, "Not Found");
      return;
    }

    if (requestPath === "/api/health") {
      send(response, 200, JSON.stringify({ status: "ok" }), "application/json; charset=utf-8");
      return;
    }

    const safePath = getSafeFilePath(root, requestPath === "/" ? "/index.html" : requestPath);
    const hasExtension = extname(requestPath) !== "";
    let filePath = safePath;

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      filePath = hasExtension ? null : indexPath;
    }

    if (!filePath || !existsSync(filePath)) {
      send(response, 404, "Not Found");
      return;
    }

    const extension = extname(filePath).toLowerCase();
    const contentType = contentTypes[extension] ?? "application/octet-stream";
    const cacheControl = extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable";

    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": cacheControl,
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  };
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT || 3000);
  const server = createServer(createStaticRequestHandler());

  server.listen(port, "0.0.0.0", () => {
    console.log(`Portfolio server listening on ${port}`);
  });
}
