import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createAudienceService } from "../services/audience-service.mjs";
import { createAuditService } from "../services/audit-service.mjs";
import { createDashboardService } from "../services/dashboard-service.mjs";
import { createExportService } from "../services/export-service.mjs";
import { createRequestService } from "../services/request-service.mjs";
import { createTagService } from "../services/tag-service.mjs";
import { createJsonStore } from "../stores/json-store.mjs";
import { createTagMetadataStore } from "../stores/tag-metadata-store.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "../..");
const repoRoot = resolve(appRoot, "..");

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function actorFrom(req) {
  return req.headers["x-profile-user"] || "local-demo-user";
}

export function createDefaultServices() {
  const dataDir = join(appRoot, "data");
  const tagStore = createTagMetadataStore(join(repoRoot, "exports/user_tag_metadata_draft_20260514.csv"));
  const audienceStore = createJsonStore(dataDir, "audiences");
  const exportStore = createJsonStore(dataDir, "exports");
  const auditStore = createJsonStore(dataDir, "audit");
  const auditService = createAuditService({ auditStore });
  const tagService = createTagService({ tagStore });
  const audienceService = createAudienceService({ tagService, audienceStore, auditService });
  const exportService = createExportService({ audienceStore, exportStore, auditService });
  const dashboardService = createDashboardService({ tagService, audienceStore, exportStore });
  const requestService = createRequestService();

  return {
    audienceService,
    audienceStore,
    auditService,
    auditStore,
    dashboardService,
    exportService,
    exportStore,
    requestService,
    tagService,
  };
}

export function createApiRoute({ sendJson, services = createDefaultServices() }) {
  return async function handleApi(req, res, url) {
    const actor = actorFrom(req);

    if (req.method === "GET" && url.pathname === "/api/dashboard") {
      sendJson(res, 200, { ok: true, data: await services.dashboardService.getDashboard() });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/tags") {
      sendJson(res, 200, { ok: true, data: await services.tagService.getFilteredTags(Object.fromEntries(url.searchParams.entries())) });
      return;
    }

    if (req.method === "GET" && url.pathname.startsWith("/api/tags/")) {
      const tagId = decodeURIComponent(url.pathname.replace("/api/tags/", ""));
      const tag = await services.tagService.getTag(tagId);
      if (!tag) {
        sendJson(res, 404, { ok: false, error: { message: "标签不存在" } });
        return;
      }
      await services.auditService.appendAudit({
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
      sendJson(res, 200, { ok: true, data: await services.tagService.getTagMap() });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/quality") {
      sendJson(res, 200, { ok: true, data: await services.tagService.getQualityStats() });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/requests") {
      sendJson(res, 200, { ok: true, data: await services.requestService.getRequests() });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/audience/preview") {
      sendJson(res, 200, { ok: true, data: await services.audienceService.previewAudience(await readBody(req), actor) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/audiences") {
      sendJson(res, 200, { ok: true, data: await services.audienceStore.read() });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/audiences") {
      sendJson(res, 201, { ok: true, data: await services.audienceService.saveAudience(await readBody(req), actor) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/exports") {
      sendJson(res, 200, { ok: true, data: await services.exportStore.read() });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/exports") {
      sendJson(res, 201, { ok: true, data: await services.exportService.requestExport(await readBody(req), actor) });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/audit") {
      sendJson(res, 200, { ok: true, data: await services.auditStore.read() });
      return;
    }

    sendJson(res, 404, { ok: false, error: { message: "API 不存在" } });
  };
}
