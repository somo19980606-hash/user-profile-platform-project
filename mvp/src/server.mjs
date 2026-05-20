import { createServer } from "node:http";
import { resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createApiRoute } from "./routes/api-routes.mjs";
import { createStaticRoute } from "./routes/static-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const port = Number(process.env.PORT || 8787);
const currentFile = fileURLToPath(import.meta.url);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendError(res, error) {
  const statusCode = error.statusCode || 500;
  sendJson(res, statusCode, {
    ok: false,
    error: {
      message: error.message || "internal error",
      statusCode,
    },
  });
}

export function createProfileServer() {
  const handleApi = createApiRoute({ sendJson });
  const serveStatic = createStaticRoute({ publicDir, sendJson });
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      if (url.pathname.startsWith("/api/")) {
        await handleApi(req, res, url);
        return;
      }
      await serveStatic(req, res, url);
    } catch (error) {
      sendError(res, error);
    }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === currentFile) {
  createProfileServer().listen(port, () => {
    console.log(`画像平台 MVP 已启动: http://localhost:${port}`);
  });
}
