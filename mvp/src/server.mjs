import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  appendAudit,
  getDashboard,
  getFilteredTags,
  getQualityStats,
  getRequests,
  getTag,
  getTagMap,
  previewAudience,
  readStore,
  requestExport,
  saveAudience,
} from "./repository.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const port = Number(process.env.PORT || 8787);
const currentFile = fileURLToPath(import.meta.url);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

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

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function actorFrom(req) {
  return req.headers["x-profile-user"] || "local-demo-user";
}

async function handleApi(req, res, url) {
  const actor = actorFrom(req);
  if (req.method === "GET" && url.pathname === "/api/dashboard") {
    sendJson(res, 200, { ok: true, data: await getDashboard() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/tags") {
    sendJson(res, 200, { ok: true, data: await getFilteredTags(Object.fromEntries(url.searchParams.entries())) });
    return;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/tags/")) {
    const tagId = decodeURIComponent(url.pathname.replace("/api/tags/", ""));
    const tag = await getTag(tagId);
    if (!tag) {
      sendJson(res, 404, { ok: false, error: { message: "标签不存在" } });
      return;
    }
    await appendAudit({
      actor,
      action_type: "view_tag",
      asset_type: "tag",
      asset_id: tag.tag_code,
      condition_json: "{}",
      result_summary: JSON.stringify({ sensitivity_level: tag.sensitivity_level }),
      risk_level: tag.is_sensitive ? "medium" : "low",
    });
    sendJson(res, 200, { ok: true, data: tag });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/tag-map") {
    sendJson(res, 200, { ok: true, data: await getTagMap() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/quality") {
    sendJson(res, 200, { ok: true, data: await getQualityStats() });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/requests") {
    sendJson(res, 200, { ok: true, data: await getRequests() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/audience/preview") {
    sendJson(res, 200, { ok: true, data: await previewAudience(await readBody(req), actor) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/audiences") {
    sendJson(res, 200, { ok: true, data: await readStore("audiences") });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/audiences") {
    sendJson(res, 201, { ok: true, data: await saveAudience(await readBody(req), actor) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/exports") {
    sendJson(res, 200, { ok: true, data: await readStore("exports") });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/exports") {
    sendJson(res, 201, { ok: true, data: await requestExport(await readBody(req), actor) });
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/audit") {
    sendJson(res, 200, { ok: true, data: await readStore("audit") });
    return;
  }

  sendJson(res, 404, { ok: false, error: { message: "API 不存在" } });
}

async function serveStatic(req, res, url) {
  const relativePath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
  const filePath = resolve(join(publicDir, relativePath));
  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    sendJson(res, 404, { ok: false, error: { message: "页面不存在" } });
    return;
  }
  res.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(res);
}

export function createProfileServer() {
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
