const tags = [
  {
    name: "生成媒体数",
    code: "user_generate_media_cnt",
    category: "用户行为标签",
    subCategory: "创作行为",
    product: "Lovart",
    region: "海外",
    status: "已上线",
    quality: "98.4%",
    sensitivity: "普通",
    sensitivityClass: "low",
    definition: "截至统计分区，用户累计生成图片、视频、音频等媒体数量。",
    source: "dwd_ad_agent_media_output_df",
    output: "dws_ad_uuid_user_profile_df_1d.generate_media_cnt",
    owner: "fengjun",
  },
  {
    name: "是否 VIP",
    code: "user_is_vip",
    category: "用户会员标签",
    subCategory: "会员状态",
    product: "Lovart",
    region: "海外",
    status: "已上线",
    quality: "99.1%",
    sensitivity: "中敏",
    sensitivityClass: "medium",
    definition: "统计分区当天用户是否为在期会员。",
    source: "ods_w_user_member_df",
    output: "dws_ad_uuid_user_profile_df_1d.is_vip",
    owner: "fengjun",
  },
  {
    name: "支付金额",
    code: "user_pay_amount",
    category: "用户价值标签",
    subCategory: "收入贡献",
    product: "Lovart",
    region: "海外",
    status: "已上线",
    quality: "92.0%",
    sensitivity: "中敏",
    sensitivityClass: "medium",
    definition: "用户历史累计支付金额，用于价值分层和续费分析。",
    source: "dwd_ad_order_pay_di",
    output: "dws_ad_uuid_user_profile_df_1d.pay_amount",
    owner: "fengjun",
  },
  {
    name: "反作弊注册设备ID",
    code: "user_af_register_device_id",
    category: "用户风险标签",
    subCategory: "设备风险",
    product: "Lovart",
    region: "海外",
    status: "已上线",
    quality: "35.0%",
    sensitivity: "高敏",
    sensitivityClass: "high",
    definition: "用户注册时关联的风控设备标识，仅允许授权场景使用。",
    source: "dws_ad_uuid_user_profile_df_1d",
    output: "dws_ad_uuid_user_profile_df_1d.af_register_device_id",
    owner: "security",
  },
  {
    name: "首次访问渠道",
    code: "user_first_visit_channel_type",
    category: "用户基础标签",
    subCategory: "渠道来源",
    product: "Lovart",
    region: "海外",
    status: "待治理",
    quality: "88.6%",
    sensitivity: "普通",
    sensitivityClass: "low",
    definition: "用户首次访问的渠道类型，需补充渠道枚举说明。",
    source: "dws_ad_uuid_user_profile_df_1d",
    output: "dws_ad_uuid_user_profile_df_1d.first_visit_channel_type",
    owner: "fengjun",
  },
];

const categoryAssets = [
  { category: "用户基础标签", subCategory: "账号属性", count: 9, online: 9, sensitive: 2, monitorRate: 78, issue: 2 },
  { category: "用户基础标签", subCategory: "渠道来源", count: 16, online: 14, sensitive: 1, monitorRate: 63, issue: 4 },
  { category: "用户基础标签", subCategory: "地域语言", count: 5, online: 5, sensitive: 0, monitorRate: 82, issue: 0 },
  { category: "用户行为标签", subCategory: "登录访问行为", count: 16, online: 16, sensitive: 0, monitorRate: 88, issue: 1 },
  { category: "用户行为标签", subCategory: "创作行为", count: 10, online: 10, sensitive: 0, monitorRate: 92, issue: 0 },
  { category: "用户行为标签", subCategory: "导出发布行为", count: 7, online: 6, sensitive: 1, monitorRate: 71, issue: 2 },
  { category: "用户会员标签", subCategory: "会员状态", count: 6, online: 6, sensitive: 6, monitorRate: 83, issue: 1 },
  { category: "用户会员标签", subCategory: "付费行为", count: 30, online: 28, sensitive: 30, monitorRate: 67, issue: 5 },
  { category: "用户价值标签", subCategory: "收入贡献", count: 16, online: 13, sensitive: 14, monitorRate: 69, issue: 4 },
  { category: "用户风险标签", subCategory: "设备风险", count: 4, online: 4, sensitive: 4, monitorRate: 50, issue: 3 },
  { category: "用户偏好标签", subCategory: "风格偏好", count: 6, online: 4, sensitive: 0, monitorRate: 42, issue: 3 },
  { category: "用户偏好标签", subCategory: "模型偏好", count: 5, online: 4, sensitive: 0, monitorRate: 44, issue: 2 },
];

const distributionGroups = [
  { title: "产品分布", rows: [["Lovart", 108], ["LibTV", 42]] },
  { title: "区域分布", rows: [["海外", 132], ["国内", 18]] },
  { title: "状态分布", rows: [["已上线", 126], ["待治理", 24]] },
  { title: "敏感等级", rows: [["普通", 102], ["中敏", 35], ["高敏", 13]] },
  { title: "值类型", rows: [["string", 89], ["number", 42], ["array", 19]] },
];

const viewTitles = {
  overview: "用户画像平台",
  catalog: "标签目录",
  tagmap: "标签地图",
  audience: "人群圈选",
  exports: "导出审批",
  quality: "质量监控",
  requirements: "需求看板",
  audit: "审计中心",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderBars() {
  if (!$("#overviewBars")) return;
  const rows = [
    ["用户行为标签", 58],
    ["用户基础标签", 42],
    ["用户价值标签", 16],
    ["用户偏好标签", 14],
    ["用户会员标签", 11],
    ["用户风险标签", 9],
  ];
  const max = Math.max(...rows.map((row) => row[1]));
  $("#overviewBars").innerHTML = rows
    .map(
      ([name, count]) => `
        <div class="bar-row">
          <span>${name}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${(count / max) * 100}%"></div></div>
          <strong>${count}</strong>
        </div>
      `,
    )
    .join("");
}

function statusClass(tag) {
  if (tag.status === "已上线") return "success";
  if (tag.status === "待治理") return "warning";
  return "neutral";
}

function renderTags() {
  $("#tagRows").innerHTML = tags
    .map(
      (tag, index) => `
        <button class="catalog-card" data-tag-index="${index}">
          <div class="catalog-card-main">
            <strong>${escapeHtml(tag.name)}</strong>
            <code>${escapeHtml(tag.code)}</code>
            <p>${escapeHtml(tag.definition)}</p>
          </div>
          <div class="catalog-card-meta">
            <span>${escapeHtml(tag.category)} / ${escapeHtml(tag.subCategory)}</span>
            <span>${escapeHtml(tag.product)} / ${escapeHtml(tag.region)} · uuid 粒度 · T+1</span>
            <span>${escapeHtml(tag.source)} → ${escapeHtml(tag.output.split(".").pop())}</span>
          </div>
          <div class="catalog-card-state">
            <span class="status-pill ${statusClass(tag)}">${escapeHtml(tag.status)}</span>
            <span class="status-pill ${tag.sensitivityClass}">${escapeHtml(tag.sensitivity)}</span>
            <small>${escapeHtml(tag.quality)} 覆盖率 · ${escapeHtml(tag.owner)}</small>
          </div>
        </button>
      `,
    )
    .join("");

  $$("[data-tag-index]").forEach((row) => {
    row.addEventListener("click", () => renderTagDetail(tags[Number(row.dataset.tagIndex)]));
  });
  renderTagDetail(tags[0]);
}

function renderTagDetail(tag) {
  $("#tagDetail").innerHTML = `
    <div class="detail-hero">
      <span class="eyebrow">Tag Detail</span>
      <h3>${escapeHtml(tag.name)}</h3>
      <span class="status-pill ${tag.sensitivityClass}">${escapeHtml(tag.sensitivity)}</span>
      <span class="status-pill ${statusClass(tag)}">${escapeHtml(tag.status)}</span>
    </div>
    <div class="detail-actions">
      <button class="primary-action">加入圈选</button>
      <button class="secondary-action">申请权限</button>
    </div>
    <div class="detail-list">
      <section>
        <h4>业务先读懂</h4>
        <div><span>标签编码</span><strong>${escapeHtml(tag.code)}</strong></div>
        <div><span>分类</span><strong>${escapeHtml(tag.category)} / ${escapeHtml(tag.subCategory)}</strong></div>
        <div><span>适用范围</span><strong>${escapeHtml(tag.product)} / ${escapeHtml(tag.region)} / uuid 粒度</strong></div>
        <div><span>业务口径</span><strong>${escapeHtml(tag.definition)}</strong></div>
      </section>
      <section>
        <h4>数据可追溯</h4>
        <div><span>来源表</span><strong>${escapeHtml(tag.source)}</strong></div>
        <div><span>产出字段</span><strong>${escapeHtml(tag.output)}</strong></div>
        <div><span>质量状态</span><strong>${escapeHtml(tag.quality)} 覆盖率 · 最近分区 2026-05-14</strong></div>
        <div><span>负责人</span><strong>${escapeHtml(tag.owner)} · 需求链接待接入</strong></div>
      </section>
    </div>
  `;
}

function jumpToCatalog(filterText = "") {
  switchView("catalog");
  const keywordInput = $(".catalog-filter input");
  if (keywordInput) keywordInput.value = filterText;
}

function renderTaxonomy() {
  const keyword = ($("#mapLocator")?.value || "").trim().toLowerCase();
  const assets = categoryAssets.filter((item) => {
    if (!keyword) return true;
    return `${item.category} ${item.subCategory}`.toLowerCase().includes(keyword);
  });

  $("#taxonomyMap").innerHTML = assets.length
    ? assets
        .map(
          (item) => `
            <button class="taxonomy-card" data-filter="${escapeHtml(item.subCategory)}">
              <div class="taxonomy-card-head">
                <div>
                  <span>${escapeHtml(item.category)}</span>
                  <strong>${escapeHtml(item.subCategory)}</strong>
                </div>
                <b>${item.count}</b>
              </div>
              <dl class="asset-metrics">
                <div><dt>已上线</dt><dd>${item.online}</dd></div>
                <div><dt>敏感</dt><dd>${item.sensitive}</dd></div>
                <div><dt>监控</dt><dd>${item.monitorRate}%</dd></div>
              </dl>
              <p class="monitor-meter"><i style="width:${item.monitorRate}%"></i></p>
              <small class="${item.issue ? "warning" : "success"}">${item.issue ? `${item.issue} 个治理风险` : "暂无明显风险"} · 点击进入目录</small>
            </button>
          `,
        )
        .join("")
    : `<div class="empty-map-state"><strong>没有匹配的二级分类</strong><span>清空定位条件后查看全部标签资产。</span></div>`;

  $$("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => jumpToCatalog(button.dataset.filter));
  });
}

function renderMapDistributions() {
  $("#mapDistributions").innerHTML = distributionGroups
    .map((group) => {
      const max = Math.max(...group.rows.map((row) => row[1]));
      return `
        <div>
          <strong>${escapeHtml(group.title)}</strong>
          ${group.rows
            .map(
              ([name, count]) => `
                <button data-distribution="${escapeHtml(name)}">
                  <span>${escapeHtml(name)}</span>
                  <em style="width:${(count / max) * 100}%"></em>
                  <b>${count}</b>
                </button>
              `,
            )
            .join("")}
        </div>
      `;
    })
    .join("");

  $$("[data-distribution]").forEach((button) => {
    button.addEventListener("click", () => jumpToCatalog(button.dataset.distribution));
  });
}

function renderMapInsights() {
  const insights = [
    ["风险", "付费行为高敏占比过高", "付费行为 30 个标签全部为中高敏，目录侧需要明确导出审批和授权范围。", "high", "付费行为"],
    ["监控", "设备风险监控覆盖不足", "设备风险仅 50% 标签有监控，优先补覆盖率、空值率和任务失败告警。", "high", "设备风险"],
    ["治理", "渠道来源存在非上线标签", "渠道来源 16 个标签中 2 个未上线，使用前需要确认口径和枚举说明。", "medium", "渠道来源"],
    ["结构", "偏好类资产仍然偏薄", "风格偏好和模型偏好合计 11 个标签，后续运营分析可能不够用。", "low", "偏好"],
  ];
  $("#mapInsights").innerHTML = insights
    .map(
      ([type, title, detail, level, filter]) => `
        <button class="insight-card ${level}" data-insight="${escapeHtml(filter)}">
          <b>${escapeHtml(type)}</b>
          <strong>${escapeHtml(title)}</strong>
          <span>${escapeHtml(detail)}</span>
        </button>
      `,
    )
    .join("");
  $$("[data-insight]").forEach((button) => {
    button.addEventListener("click", () => jumpToCatalog(button.dataset.insight));
  });
}

function switchView(viewId) {
  document.body.dataset.view = viewId;
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.view === viewId));
  $("#viewTitle").textContent = viewTitles[viewId] ?? "用户画像平台";
}

function setupNavigation() {
  $$(".nav-item").forEach((item) => {
    item.addEventListener("click", () => switchView(item.dataset.view));
  });
  $$("[data-jump]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.jump));
  });
}

function setupTheme() {
  const savedTheme = localStorage.getItem("profile-platform-theme") || "light";
  document.documentElement.dataset.theme = savedTheme;
  $("#themeToggle").textContent = savedTheme === "dark" ? "☀" : "☾";
  $("#themeToggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    $("#themeToggle").textContent = next === "dark" ? "☀" : "☾";
    localStorage.setItem("profile-platform-theme", next);
  });
}

function setupSearch() {
  $("#globalSearch").addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    switchView("catalog");
  });
}

function setupMapLocator() {
  $("#mapLocator")?.addEventListener("input", renderTaxonomy);
  $("#mapCatalogSearch")?.addEventListener("click", () => jumpToCatalog($("#mapLocator").value.trim()));
}

function boot() {
  renderBars();
  renderTags();
  renderTaxonomy();
  renderMapDistributions();
  renderMapInsights();
  setupNavigation();
  setupTheme();
  setupSearch();
  setupMapLocator();
  const initialView = new URLSearchParams(window.location.search).get("view");
  if (viewTitles[initialView]) switchView(initialView);
}

boot();
