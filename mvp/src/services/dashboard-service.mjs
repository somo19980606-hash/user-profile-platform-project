export function createDashboardService({ tagService, audienceStore, exportStore }) {
  async function getDashboard() {
    const tags = await tagService.getTags();
    const quality = await tagService.getQualityStats();
    const audiences = await audienceStore.read();
    const exports = await exportStore.read();
    return {
      tag_count: tags.length,
      online_tag_count: tags.filter((tag) => tag.tag_status === "已上线").length,
      sensitive_tag_count: tags.filter((tag) => tag.is_sensitive).length,
      quality_issue_count: quality.filter((item) => item.issue_level !== "low").length,
      audience_count: audiences.length,
      export_count: exports.length,
      pending_export_count: exports.filter((item) => item.approval_status === "pending").length,
      category_distribution: tagService.groupCount(tags, "tag_category_l1"),
      status_distribution: tagService.groupCount(tags, "tag_status"),
      product_distribution: tagService.groupCountMulti(tags, "applicable_product"),
      region_distribution: tagService.groupCount(tags, "applicable_market_region"),
      recent_tags: tags.slice(-8).reverse(),
    };
  }

  return { getDashboard };
}
