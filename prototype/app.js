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

const taxonomy = [
  ["用户基础标签", "账号属性、渠道来源、注册信息", 42, ["账号属性", "渠道来源", "注册信息"], "普通"],
  ["用户行为标签", "访问、创作、互动、导出", 58, ["访问行为", "创作行为", "互动行为"], "普通"],
  ["用户偏好标签", "风格、模型、内容偏好", 14, ["风格偏好", "模型偏好", "内容偏好"], "普通"],
  ["用户风险标签", "设备、异常、合规风险", 9, ["设备风险", "异常行为", "合规风险"], "高敏"],
  ["用户价值标签", "收入、消耗、潜力价值", 16, ["收入贡献", "算力消耗", "潜力分层"], "中敏"],
  ["用户会员标签", "会员、续费、算力购买", 11, ["会员状态", "续费风险", "购买记录"], "中敏"],
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

function renderTaxonomy() {
  $("#taxonomyMap").innerHTML = taxonomy
    .map(
      ([name, desc, count, children, sensitivity]) => `
        <div class="taxonomy-card" data-jump="catalog">
          <div class="taxonomy-card-head">
            <strong>${escapeHtml(name)}</strong>
            <b>${count}</b>
          </div>
          <span>${escapeHtml(desc)}</span>
          <p>${children.map((item) => `<em>${escapeHtml(item)}</em>`).join("")}</p>
          <small>${escapeHtml(sensitivity)} · 点击进入目录筛选</small>
        </div>
      `,
    )
    .join("");
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

function boot() {
  renderBars();
  renderTags();
  renderTaxonomy();
  setupNavigation();
  setupTheme();
  setupSearch();
  const initialView = new URLSearchParams(window.location.search).get("view");
  if (viewTitles[initialView]) switchView(initialView);
}

boot();
