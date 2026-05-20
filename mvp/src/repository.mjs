import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(__dirname, "..");
const repoRoot = resolve(appRoot, "..");
const metadataCsvPath = join(repoRoot, "exports/user_tag_metadata_draft_20260514.csv");
const dataDir = join(appRoot, "data");

const storeFiles = {
  audiences: join(dataDir, "audiences.json"),
  exports: join(dataDir, "exports.json"),
  audit: join(dataDir, "audit-log.json"),
};

const sensitivePatterns = [
  /email/i,
  /device/i,
  /ip/i,
  /trade|order|pay|amount|cost|renew/i,
  /af_|risk|reason/i,
  /user_id|uuid/i,
];

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const next = content[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  const headers = rows.shift() ?? [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""])),
  );
}

function hash(input) {
  let value = 0;
  for (const char of input) value = (value * 31 + char.charCodeAt(0)) % 100000;
  return value;
}

function nowIso() {
  return new Date().toISOString();
}

function todayCompact() {
  return new Date().toISOString().slice(0, 10).replaceAll("-", "");
}

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function id(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

function sensitivityFor(tag) {
  const text = `${tag.tag_code} ${tag.tag_name} ${tag.output_field} ${tag.business_definition}`;
  if (sensitivePatterns.some((pattern) => pattern.test(text))) {
    if (/email|device|ip|trade|order|pay|amount|user_id|uuid/i.test(text)) return "high";
    return "medium";
  }
  if (tag.tag_category_l1?.includes("用户风险标签")) return "medium";
  if (tag.tag_category_l1?.includes("用户会员标签") || tag.tag_category_l1?.includes("用户价值标签")) {
    return "medium";
  }
  return "low";
}

function normalizeTag(row) {
  const tag = { ...row };
  tag.sensitivity_level = sensitivityFor(tag);
  tag.is_sensitive = tag.sensitivity_level !== "low";
  tag.search_text = Object.values(row).join(" ").toLowerCase();
  return tag;
}

let tagCache = null;

export async function getTags() {
  if (tagCache) return tagCache;
  const content = await readFile(metadataCsvPath, "utf8");
  tagCache = parseCsv(content).map(normalizeTag);
  return tagCache;
}

export async function getTag(tagCodeOrId) {
  const tags = await getTags();
  return tags.find((tag) => tag.tag_code === tagCodeOrId || tag.tag_id === tagCodeOrId);
}

export async function getFilteredTags(query = {}) {
  const tags = await getTags();
  const keyword = (query.keyword ?? "").toLowerCase();
  return tags.filter((tag) => {
    if (keyword && !tag.search_text.includes(keyword)) return false;
    if (query.category && tag.tag_category_l1 !== query.category) return false;
    if (query.product && !tag.applicable_product.includes(query.product)) return false;
    if (query.region && tag.applicable_market_region !== query.region) return false;
    if (query.status && tag.tag_status !== query.status) return false;
    if (query.sensitivity && tag.sensitivity_level !== query.sensitivity) return false;
    return true;
  });
}

export async function getQualityStats() {
  const tags = await getTags();
  return tags.map((tag) => {
    const seed = hash(tag.tag_code);
    const hasMonitor = tag.has_monitor === "Y";
    const coverageRate = Number(((55 + (seed % 44)) / 100).toFixed(4));
    const nullRate = Number((((seed % 18) + (hasMonitor ? 0 : 6)) / 100).toFixed(4));
    const taskStatus = !tag.schedule_task_name ? "unknown" : seed % 17 === 0 ? "failed" : "success";
    return {
      tag_id: tag.tag_id,
      tag_code: tag.tag_code,
      tag_name: tag.tag_name,
      output_table: tag.output_table,
      output_field: tag.output_field,
      total_user_cnt: 120000,
      covered_user_cnt: Math.round(120000 * coverageRate),
      coverage_rate: coverageRate,
      null_rate: nullRate,
      latest_partition: todayCompact(),
      latest_output_time: nowIso(),
      task_status: taskStatus,
      has_monitor: tag.has_monitor || "N",
      issue_level: taskStatus === "failed" || nullRate > 0.2 ? "high" : hasMonitor ? "low" : "medium",
    };
  });
}

export async function getDashboard() {
  const tags = await getTags();
  const quality = await getQualityStats();
  const audiences = await readStore("audiences");
  const exports = await readStore("exports");
  return {
    tag_count: tags.length,
    online_tag_count: tags.filter((tag) => tag.tag_status === "已上线").length,
    sensitive_tag_count: tags.filter((tag) => tag.is_sensitive).length,
    quality_issue_count: quality.filter((item) => item.issue_level !== "low").length,
    audience_count: audiences.length,
    export_count: exports.length,
    pending_export_count: exports.filter((item) => item.approval_status === "pending").length,
    category_distribution: groupCount(tags, "tag_category_l1"),
    status_distribution: groupCount(tags, "tag_status"),
    product_distribution: groupCountMulti(tags, "applicable_product"),
    region_distribution: groupCount(tags, "applicable_market_region"),
    recent_tags: tags.slice(-8).reverse(),
  };
}

export async function getTagMap() {
  const tags = await getTags();
  const categories = [];
  const categoryMap = new Map();
  for (const tag of tags) {
    if (!categoryMap.has(tag.tag_category_l1)) {
      categoryMap.set(tag.tag_category_l1, { name: tag.tag_category_l1, count: 0, children: [] });
    }
    const category = categoryMap.get(tag.tag_category_l1);
    category.count += 1;
    let child = category.children.find((item) => item.name === tag.tag_category_l2);
    if (!child) {
      child = { name: tag.tag_category_l2, count: 0 };
      category.children.push(child);
    }
    child.count += 1;
  }
  categories.push(...categoryMap.values());
  return {
    categories,
    product_distribution: groupCountMulti(tags, "applicable_product"),
    region_distribution: groupCount(tags, "applicable_market_region"),
    status_distribution: groupCount(tags, "tag_status"),
  };
}

function groupCount(items, field) {
  return Object.entries(
    items.reduce((acc, item) => {
      const key = item[field] || "未填写";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, count]) => ({ name, count }));
}

function groupCountMulti(items, field) {
  const counts = {};
  for (const item of items) {
    const values = (item[field] || "未填写").split(",").map((value) => value.trim()).filter(Boolean);
    for (const value of values) counts[value] = (counts[value] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function sampleValue(tag, index) {
  const seed = hash(`${tag.tag_code}:${index}`);
  if (tag.tag_value_type === "number") return seed % 240;
  if (tag.tag_value_type === "boolean") return seed % 2 === 0 ? "1" : "0";
  if (tag.tag_value_type === "array") return seed % 3 === 0 ? ["20260512", "20260513"] : [];
  if (/vip/i.test(tag.tag_code)) return seed % 4 === 0 ? "是" : "否";
  if (/status/i.test(tag.tag_code)) return seed % 5 === 0 ? "暂停" : "有效";
  if (/country/i.test(tag.tag_code)) return ["US", "JP", "CN", "SG"][seed % 4];
  if (/level/i.test(tag.tag_code)) return ["高", "中", "低"][seed % 3];
  return seed % 2 === 0 ? "是" : "否";
}

export async function getSampleUsers(limit = 800) {
  const tags = (await getTags()).slice(0, 120);
  return Array.from({ length: limit }, (_, index) => {
    const user = {
      uuid: `uuid_${String(index + 1).padStart(5, "0")}`,
      created_time: nowIso(),
      tags: {},
    };
    for (const tag of tags) user.tags[tag.tag_code] = sampleValue(tag, index);
    return user;
  });
}

function compare(value, operator, expected, expectedTo) {
  if (operator === "empty") return value == null || value === "" || (Array.isArray(value) && value.length === 0);
  if (operator === "not_empty") return !compare(value, "empty");
  if (operator === "contains") return Array.isArray(value) ? value.includes(expected) : String(value ?? "").includes(String(expected));
  if (operator === "not_equals") return String(value ?? "") !== String(expected);
  if (operator === "gt") return Number(value) > Number(expected);
  if (operator === "lt") return Number(value) < Number(expected);
  if (operator === "between") return Number(value) >= Number(expected) && Number(value) <= Number(expectedTo);
  return String(value ?? "") === String(expected);
}

export async function previewAudience(payload, actor = "anonymous") {
  const tags = await getTags();
  const tagByCode = new Map(tags.map((tag) => [tag.tag_code, tag]));
  const conditions = Array.isArray(payload.conditions) ? payload.conditions : [];
  const logic = payload.logic === "OR" ? "OR" : "AND";
  const users = await getSampleUsers();
  const matched = users.filter((user) => {
    if (conditions.length === 0) return true;
    const checks = conditions.map((condition) =>
      compare(user.tags[condition.tag_code], condition.operator, condition.value, condition.value_to),
    );
    return logic === "OR" ? checks.some(Boolean) : checks.every(Boolean);
  });
  const sensitiveTags = conditions.map((condition) => tagByCode.get(condition.tag_code)).filter((tag) => tag?.is_sensitive);
  const result = {
    logic,
    conditions,
    estimated_user_cnt: matched.length,
    total_user_cnt: users.length,
    coverage_rate: users.length ? Number((matched.length / users.length).toFixed(4)) : 0,
    requires_approval: sensitiveTags.length > 0 || matched.length > 500,
    sensitive_tags: sensitiveTags.map((tag) => ({
      tag_code: tag.tag_code,
      tag_name: tag.tag_name,
      sensitivity_level: tag.sensitivity_level,
    })),
    samples: sensitiveTags.length > 0 ? [] : matched.slice(0, 10).map((user) => ({ uuid: user.uuid })),
  };
  await appendAudit({
    actor,
    action_type: "preview_audience",
    asset_type: "audience",
    asset_id: "preview",
    condition_json: JSON.stringify({ logic, conditions }),
    result_summary: JSON.stringify({ estimated_user_cnt: result.estimated_user_cnt, requires_approval: result.requires_approval }),
    risk_level: result.requires_approval ? "high" : "low",
  });
  return result;
}

export async function saveAudience(payload, actor = "anonymous") {
  const preview = await previewAudience(payload, actor);
  const audiences = await readStore("audiences");
  const audience = {
    audience_id: id("aud"),
    audience_name: payload.audience_name || "未命名人群包",
    audience_desc: payload.audience_desc || "",
    condition_json: JSON.stringify({ logic: preview.logic, conditions: preview.conditions }),
    logic_type: preview.logic,
    estimated_user_cnt: preview.estimated_user_cnt,
    created_by: actor,
    business_purpose: payload.business_purpose || "",
    status: "active",
    requires_approval: preview.requires_approval,
    expire_time: payload.expire_time || addDays(30),
    created_time: nowIso(),
    updated_time: nowIso(),
  };
  audiences.unshift(audience);
  await writeStore("audiences", audiences);
  await appendAudit({
    actor,
    action_type: "save_audience",
    asset_type: "audience",
    asset_id: audience.audience_id,
    condition_json: audience.condition_json,
    result_summary: JSON.stringify({ estimated_user_cnt: audience.estimated_user_cnt }),
    risk_level: audience.requires_approval ? "high" : "medium",
  });
  return audience;
}

export async function requestExport(payload, actor = "anonymous") {
  const audiences = await readStore("audiences");
  const audience = audiences.find((item) => item.audience_id === payload.audience_id);
  if (!audience) {
    const error = new Error("人群包不存在");
    error.statusCode = 404;
    throw error;
  }
  const exportFields = payload.export_fields?.length ? payload.export_fields : ["uuid", "audience_id", "matched_tag_summary", "created_time"];
  const hasSensitiveField = exportFields.some((field) => /email|device|ip|user_id|order|pay|amount/i.test(field));
  const needsApproval = audience.requires_approval || hasSensitiveField || audience.estimated_user_cnt > 500;
  const exports = await readStore("exports");
  const task = {
    export_task_id: id("exp"),
    audience_id: audience.audience_id,
    requested_by: actor,
    business_purpose: payload.business_purpose || audience.business_purpose || "",
    export_target: payload.export_target || "csv",
    export_fields: exportFields,
    approval_status: needsApproval ? "pending" : "completed",
    approved_by: needsApproval ? "" : "system",
    output_location: needsApproval ? "" : `local://exports/${audience.audience_id}.csv`,
    export_user_cnt: needsApproval ? 0 : audience.estimated_user_cnt,
    expire_time: payload.expire_time || addDays(7),
    created_time: nowIso(),
    updated_time: nowIso(),
  };
  exports.unshift(task);
  await writeStore("exports", exports);
  await appendAudit({
    actor,
    action_type: "request_export",
    asset_type: "export",
    asset_id: task.export_task_id,
    condition_json: audience.condition_json,
    result_summary: JSON.stringify({ approval_status: task.approval_status, export_target: task.export_target }),
    risk_level: needsApproval ? "high" : "medium",
  });
  return task;
}

export async function getRequests() {
  return [
    {
      request_id: "REQ202605140001",
      title: "沉默用户召回人群标签",
      requester: "运营",
      status: "口径确认中",
      expected_online_date: "2026-05-24",
      doc_url: "https://www.feishu.cn/docx/P84BdnQZHo7JjfxiXRhc4AoNnyc",
    },
    {
      request_id: "REQ202605140002",
      title: "高价值会员续费风险标签",
      requester: "会员业务",
      status: "待开发",
      expected_online_date: "2026-05-28",
      doc_url: "https://www.feishu.cn/docx/P84BdnQZHo7JjfxiXRhc4AoNnyc",
    },
  ];
}

export async function readStore(name) {
  const file = storeFiles[name];
  if (!file || !existsSync(file)) return [];
  return JSON.parse(await readFile(file, "utf8"));
}

async function writeStore(name, value) {
  await writeFile(storeFiles[name], `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function appendAudit(entry) {
  const audit = await readStore("audit");
  const record = {
    audit_id: id("audit"),
    request_time: nowIso(),
    ...entry,
  };
  audit.unshift(record);
  await writeStore("audit", audit.slice(0, 1000));
  return record;
}
