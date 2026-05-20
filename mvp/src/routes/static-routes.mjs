import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

export function createStaticRoute({ publicDir, sendJson }) {
  return async function serveStatic(req, res, url) {
    const relativePath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const filePath = resolve(join(publicDir, relativePath));
    if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
      sendJson(res, 404, { ok: false, error: { message: "页面不存在" } });
      return;
    }
    res.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  };
}
