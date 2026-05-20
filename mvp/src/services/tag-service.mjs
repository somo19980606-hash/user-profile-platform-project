import { hash } from "../utils/hash.mjs";
import { nowIso, todayCompact } from "../utils/date.mjs";

const sensitivePatterns = [
  /email/i,
  /device/i,
  /(^|[_\W])ip([_\W]|$)/i,
  /trade|order|pay|amount|cost|renew/i,
  /af_|risk|reason/i,
  /user_id|uuid/i,
];

export function sensitivityFor(tag) {
  const text = `${tag.tag_code} ${tag.tag_name} ${tag.output_field} ${tag.business_definition}`;
  if (sensitivePatterns.some((pattern) => pattern.test(text))) {
    if (/email|device|trade|order|pay|amount|user_id|uuid|(^|[_\W])ip([_\W]|$)/i.test(text)) return "high";
    return "medium";
  }
  if (tag.tag_category_l1?.includes("用户风险标签")) return "medium";
  if (tag.tag_category_l1?.includes("用户会员标签") || tag.tag_category_l1?.includes("用户价值标签")) return "medium";
  return "low";
}

function normalizeTag(row) {
  const tag = { ...row };
  tag.sensitivity_level = tag.sensitivity_level || sensitivityFor(tag);
  tag.is_sensitive = typeof tag.is_sensitive === "boolean" ? tag.is_sensitive : tag.sensitivity_level !== "low";
  tag.search_text = Object.values(row).join(" ").toLowerCase();
  return tag;
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

function hasQualityIssue(tag) {
  return tag.has_monitor !== "Y" || tag.tag_status !== "已上线";
}

function buildGovernanceInsights(categoryAssets) {
  const insights = [];
  const levelWeight = { high: 3, medium: 2, low: 1 };
  for (const asset of categoryAssets) {
    if (asset.count === 0) continue;
    if (asset.high_sensitive_count > 0) {
      insights.push({
        type: "risk",
        level: "high",
        title: `${asset.category_l2}存在高敏标签`,
        detail: `${asset.category_l1} / ${asset.category_l2} 有 ${asset.high_sensitive_count} 个高敏标签，需要确认权限和导出审批链路。`,
        query: { categoryL2: asset.category_l2, sensitivity: "high" },
      });
    }
    if (asset.monitor_rate < 0.8) {
      insights.push({
        type: "monitor",
        level: asset.monitor_rate === 0 ? "high" : "medium",
        title: `${asset.category_l2}监控覆盖不足`,
        detail: `${asset.category_l2} 监控覆盖率为 ${Math.round(asset.monitor_rate * 100)}%，优先补齐核心标签监控。`,
        query: { categoryL2: asset.category_l2 },
      });
    }
    if (asset.online_count < asset.count) {
      insights.push({
        type: "status",
        level: "medium",
        title: `${asset.category_l2}存在非上线标签`,
        detail: `${asset.category_l2} 有 ${asset.count - asset.online_count} 个标签未处于已上线状态，标签目录需确认是否可用。`,
        query: { categoryL2: asset.category_l2 },
      });
    }
    if (asset.count === 1) {
      insights.push({
        type: "structure",
        level: "low",
        title: `${asset.category_l2}分类资产较薄`,
        detail: `${asset.category_l2} 当前仅 1 个标签，后续新增标签时建议复核分类是否需要合并或补充。`,
        query: { categoryL2: asset.category_l2 },
      });
    }
  }
  return insights.sort((left, right) => levelWeight[right.level] - levelWeight[left.level]).slice(0, 8);
}

export function createTagService({ tagStore }) {
  let normalizedCache = null;

  async function getTags() {
    if (normalizedCache) return normalizedCache;
    normalizedCache = (await tagStore.getTags()).map(normalizeTag);
    return normalizedCache;
  }

  async function getTag(tagCodeOrId) {
    const tags = await getTags();
    return tags.find((tag) => tag.tag_code === tagCodeOrId || tag.tag_id === tagCodeOrId);
  }

  async function getFilteredTags(query = {}) {
    const tags = await getTags();
    const keyword = (query.keyword ?? "").toLowerCase();
    return tags.filter((tag) => {
      if (keyword && !tag.search_text.includes(keyword)) return false;
      if (query.category && tag.tag_category_l1 !== query.category) return false;
      if (query.product && !tag.applicable_product.includes(query.product)) return false;
      if (query.region && tag.applicable_market_region !== query.region) return false;
      if (query.status && tag.tag_status !== query.status) return false;
      if (query.sensitivity && tag.sensitivity_level !== query.sensitivity) return false;
      if (query.categoryL2 && tag.tag_category_l2 !== query.categoryL2) return false;
      if (query.valueType && tag.tag_value_type !== query.valueType) return false;
      return true;
    });
  }

  async function getQualityStats() {
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

  async function getTagMap() {
    const tags = await getTags();
    const categoryMap = new Map();
    const categoryAssetMap = new Map();
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

      const assetKey = `${tag.tag_category_l1}::${tag.tag_category_l2}`;
      if (!categoryAssetMap.has(assetKey)) {
        categoryAssetMap.set(assetKey, {
          category_l1: tag.tag_category_l1,
          category_l2: tag.tag_category_l2,
          count: 0,
          online_count: 0,
          sensitive_count: 0,
          high_sensitive_count: 0,
          monitored_count: 0,
          monitor_rate: 0,
          quality_issue_count: 0,
        });
      }
      const asset = categoryAssetMap.get(assetKey);
      asset.count += 1;
      if (tag.tag_status === "已上线") asset.online_count += 1;
      if (tag.is_sensitive) asset.sensitive_count += 1;
      if (tag.sensitivity_level === "high") asset.high_sensitive_count += 1;
      if (tag.has_monitor === "Y") asset.monitored_count += 1;
      if (hasQualityIssue(tag)) asset.quality_issue_count += 1;
    }
    const categoryAssets = [...categoryAssetMap.values()].map((asset) => ({
      ...asset,
      monitor_rate: asset.count ? Number((asset.monitored_count / asset.count).toFixed(4)) : 0,
    }));
    return {
      categories: [...categoryMap.values()],
      category_assets: categoryAssets,
      product_distribution: groupCountMulti(tags, "applicable_product"),
      region_distribution: groupCount(tags, "applicable_market_region"),
      status_distribution: groupCount(tags, "tag_status"),
      sensitivity_distribution: groupCount(tags, "sensitivity_level"),
      value_type_distribution: groupCount(tags, "tag_value_type"),
      governance_insights: buildGovernanceInsights(categoryAssets),
    };
  }

  return {
    getTags,
    getTag,
    getFilteredTags,
    getQualityStats,
    getTagMap,
    groupCount,
    groupCountMulti,
  };
}
