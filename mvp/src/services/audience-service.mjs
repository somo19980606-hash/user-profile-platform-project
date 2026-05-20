import { hash } from "../utils/hash.mjs";
import { addDays as defaultAddDays, nowIso } from "../utils/date.mjs";
import { createId } from "../utils/id.mjs";

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

export function createAudienceService({
  tagService,
  audienceStore,
  auditService,
  idGenerator = () => createId("aud"),
  now = nowIso,
  addDays = defaultAddDays,
}) {
  async function getSampleUsers(limit = 800) {
    const tags = (await tagService.getTags()).slice(0, 120);
    return Array.from({ length: limit }, (_, index) => {
      const user = {
        uuid: `uuid_${String(index + 1).padStart(5, "0")}`,
        created_time: now(),
        tags: {},
      };
      for (const tag of tags) user.tags[tag.tag_code] = sampleValue(tag, index);
      return user;
    });
  }

  async function previewAudience(payload, actor = "anonymous") {
    const tags = await tagService.getTags();
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
    await auditService.appendAudit({
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

  async function saveAudience(payload, actor = "anonymous") {
    const preview = await previewAudience(payload, actor);
    const audiences = await audienceStore.read();
    const audience = {
      audience_id: idGenerator(),
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
      created_time: now(),
      updated_time: now(),
    };
    audiences.unshift(audience);
    await audienceStore.write(audiences);
    await auditService.appendAudit({
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

  return {
    getSampleUsers,
    previewAudience,
    saveAudience,
  };
}
