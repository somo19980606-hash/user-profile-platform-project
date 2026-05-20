const state = {
  allTags: [],
  tags: [],
  audiences: [],
  lastPreview: null,
};

const $ = (selector) => document.querySelector(selector);

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "content-type": "application/json", "x-profile-user": "local-demo-user" },
    ...options,
  });
  const payload = await response.json();
  if (!payload.ok) throw new Error(payload.error?.message || "请求失败");
  return payload.data;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function badge(text, level = "low") {
  return `<span class="badge ${level}">${escapeHtml(text)}</span>`;
}

function emptyState(title, detail = "") {
  return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${detail ? `<p>${escapeHtml(detail)}</p>` : ""}</div>`;
}

function setNotice(message, level = "info") {
  const notice = $("#notice");
  notice.textContent = message;
  notice.className = `notice ${level}`;
  notice.hidden = false;
}

function clearNotice() {
  $("#notice").hidden = true;
}

function uniqueValues(rows, field) {
  return [...new Set(rows.flatMap((row) => String(row[field] || "").split(",").map((value) => value.trim()).filter(Boolean)))].sort();
}

function fillSelect(selector, values, label) {
  const current = $(selector).value;
  $(selector).innerHTML = `<option value="">${label}</option>${values
    .map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`)
    .join("")}`;
  $(selector).value = values.includes(current) ? current : "";
}

function renderBars(container, rows) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  container.innerHTML = rows
    .map(
      (row) => `
        <div class="bar">
          <span>${escapeHtml(row.name)}</span>
          <div class="bar-track"><div class="bar-fill" style="width:${(row.count / max) * 100}%"></div></div>
          <strong>${row.count}</strong>
        </div>
      `,
    )
    .join("");
}

async function loadDashboard() {
  const data = await api("/api/dashboard");
  $("#kpis").innerHTML = [
    ["标签总数", data.tag_count],
    ["已上线", data.online_tag_count],
    ["敏感标签", data.sensitive_tag_count],
    ["质量问题", data.quality_issue_count],
    ["人群包", data.audience_count],
    ["待审批导出", data.pending_export_count],
  ]
    .map(([label, value]) => `<div class="kpi"><span>${label}</span><strong>${value}</strong></div>`)
    .join("");
  renderBars($("#categoryDistribution"), data.category_distribution);
  $("#recentTags").innerHTML = data.recent_tags
    .map(
      (tag) => `
        <div class="list-item">
          <strong>${escapeHtml(tag.tag_name)}</strong>
          <p>${escapeHtml(tag.tag_code)} · ${escapeHtml(tag.tag_category_l1)} · ${escapeHtml(tag.tag_status)}</p>
        </div>
      `,
    )
    .join("");
}

async function loadTagFilterOptions() {
  state.allTags = await api("/api/tags");
  fillSelect("#tagCategory", uniqueValues(state.allTags, "tag_category_l1"), "全部分类");
  fillSelect("#tagProduct", uniqueValues(state.allTags, "applicable_product"), "全部产品");
  fillSelect("#tagRegion", uniqueValues(state.allTags, "applicable_market_region"), "全部区域");
  fillSelect("#tagStatus", uniqueValues(state.allTags, "tag_status"), "全部状态");
}

async function loadTags() {
  clearNotice();
  const params = new URLSearchParams();
  [
    ["keyword", $("#tagKeyword").value.trim()],
    ["category", $("#tagCategory").value],
    ["product", $("#tagProduct").value],
    ["region", $("#tagRegion").value],
    ["status", $("#tagStatus").value],
    ["sensitivity", $("#tagSensitivity").value],
  ].forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  state.tags = await api(`/api/tags?${params.toString()}`);
  $("#tagTable").innerHTML = state.tags.length
    ? `
    <table>
      <thead>
        <tr><th>标签</th><th>分类</th><th>产品/区域</th><th>状态</th><th>敏感</th></tr>
      </thead>
      <tbody>
        ${state.tags
          .slice(0, 80)
          .map(
            (tag) => `
              <tr class="clickable" data-tag="${escapeHtml(tag.tag_code)}">
                <td><strong>${escapeHtml(tag.tag_name)}</strong><br><small>${escapeHtml(tag.tag_code)}</small></td>
                <td>${escapeHtml(tag.tag_category_l1)}<br><small>${escapeHtml(tag.tag_category_l2)}</small></td>
                <td>${escapeHtml(tag.applicable_product)}<br><small>${escapeHtml(tag.applicable_market_region)}</small></td>
                <td>${escapeHtml(tag.tag_status)}</td>
                <td>${badge(tag.sensitivity_level, tag.sensitivity_level)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `
    : emptyState("没有匹配的标签", "调整筛选条件后重试。");
  document.querySelectorAll("[data-tag]").forEach((row) => {
    row.addEventListener("click", () => loadTagDetail(row.dataset.tag));
  });
  renderConditionRows();
}

async function loadTagDetail(tagCode) {
  const tag = await api(`/api/tags/${encodeURIComponent(tagCode)}`);
  $("#tagDetail").innerHTML = `
    <div class="detail-grid">
      <span>标签名称</span><strong>${escapeHtml(tag.tag_name)}</strong>
      <span>标签编码</span><code>${escapeHtml(tag.tag_code)}</code>
      <span>分类</span><span>${escapeHtml(tag.tag_category_l1)} / ${escapeHtml(tag.tag_category_l2)}</span>
      <span>产品区域</span><span>${escapeHtml(tag.applicable_product)} / ${escapeHtml(tag.applicable_market_region)}</span>
      <span>值类型</span><span>${escapeHtml(tag.tag_value_type)} · ${escapeHtml(tag.tag_value_field_type)}</span>
      <span>状态</span><span>${escapeHtml(tag.tag_status)}</span>
      <span>敏感等级</span><span>${badge(tag.sensitivity_level, tag.sensitivity_level)}</span>
      <span>业务口径</span><span>${escapeHtml(tag.business_definition)}</span>
      <span>统计周期</span><span>${escapeHtml(tag.stat_period)} · ${escapeHtml(tag.update_frequency)} · ${escapeHtml(tag.data_latency)}</span>
      <span>来源表</span><span>${escapeHtml(tag.source_table)}</span>
      <span>产出</span><span>${escapeHtml(tag.output_table)}.${escapeHtml(tag.output_field)}</span>
      <span>负责人</span><span>业务：${escapeHtml(tag.business_owner || "未填写")} / 数据：${escapeHtml(tag.data_owner || "未填写")}</span>
    </div>
  `;
}

async function loadTagMap() {
  const data = await api("/api/tag-map");
  $("#tagTree").innerHTML = data.categories
    .map(
      (category) => `
        <details open>
          <summary>${escapeHtml(category.name)} (${category.count})</summary>
          <ul>${category.children.map((child) => `<li>${escapeHtml(child.name)}：${child.count}</li>`).join("")}</ul>
        </details>
      `,
    )
    .join("");
  $("#mapDistributions").innerHTML = `
    <div><h3>产品分布</h3><div id="productBars"></div></div>
    <div><h3>区域分布</h3><div id="regionBars"></div></div>
    <div><h3>状态分布</h3><div id="statusBars"></div></div>
  `;
  renderBars($("#productBars"), data.product_distribution);
  renderBars($("#regionBars"), data.region_distribution);
  renderBars($("#statusBars"), data.status_distribution);
}

function conditionHtml(index, condition = {}) {
  const tagOptions = state.tags
    .slice(0, 120)
    .map((tag) => `<option value="${escapeHtml(tag.tag_code)}" ${tag.tag_code === condition.tag_code ? "selected" : ""}>${escapeHtml(tag.tag_name)} (${escapeHtml(tag.tag_code)})</option>`)
    .join("");
  return `
    <div class="condition-row" data-condition-index="${index}">
      <select class="condition-tag">${tagOptions}</select>
      <select class="condition-operator">
        ${[
          ["equals", "等于"],
          ["not_equals", "不等于"],
          ["contains", "包含"],
          ["gt", "大于"],
          ["lt", "小于"],
          ["between", "区间"],
          ["empty", "为空"],
          ["not_empty", "不为空"],
        ]
          .map(([value, label]) => `<option value="${value}" ${value === condition.operator ? "selected" : ""}>${label}</option>`)
          .join("")}
      </select>
      <input class="condition-value" value="${escapeHtml(condition.value ?? "是")}" placeholder="值" />
      <input class="condition-value-to" value="${escapeHtml(condition.value_to ?? "")}" placeholder="区间结束" />
      <button class="secondary remove-condition" type="button">删除</button>
    </div>
  `;
}

function renderConditionRows() {
  if (!$("#conditionList").children.length && state.tags.length) {
    $("#conditionList").innerHTML = conditionHtml(0);
  }
  document.querySelectorAll(".remove-condition").forEach((button) => {
    button.onclick = () => {
      button.closest(".condition-row").remove();
    };
  });
}

function collectConditions() {
  return [...document.querySelectorAll(".condition-row")].map((row) => ({
    tag_code: row.querySelector(".condition-tag").value,
    operator: row.querySelector(".condition-operator").value,
    value: row.querySelector(".condition-value").value,
    value_to: row.querySelector(".condition-value-to").value,
  }));
}

async function previewAudience() {
  const data = await api("/api/audience/preview", {
    method: "POST",
    body: JSON.stringify({
      logic: $("#audienceLogic").value,
      conditions: collectConditions(),
    }),
  });
  state.lastPreview = data;
  setNotice("人群预估已更新。", data.requires_approval ? "warning" : "success");
  $("#audiencePreview").innerHTML = `
    <strong>预估命中：${data.estimated_user_cnt} / ${data.total_user_cnt}</strong>
    <p>覆盖率：${(data.coverage_rate * 100).toFixed(2)}%</p>
    <p>${data.requires_approval ? badge("涉及敏感标签或大人群，导出需审批", "high") : badge("可保存并提交普通导出", "success")}</p>
    ${
      data.sensitive_tags.length
        ? `<p>敏感标签：${data.sensitive_tags.map((tag) => `${escapeHtml(tag.tag_name)}(${escapeHtml(tag.sensitivity_level)})`).join("、")}</p>`
        : `<p>样例：${data.samples.map((sample) => sample.uuid).join("、") || "无"}</p>`
    }
  `;
}

async function saveAudience() {
  const data = await api("/api/audiences", {
    method: "POST",
    body: JSON.stringify({
      audience_name: $("#audienceName").value || "未命名人群包",
      business_purpose: $("#audiencePurpose").value || "未填写",
      logic: $("#audienceLogic").value,
      conditions: collectConditions(),
    }),
  });
  setNotice("人群包已保存，可在导出任务中选择。", data.requires_approval ? "warning" : "success");
  $("#audiencePreview").innerHTML = `已保存人群包：${escapeHtml(data.audience_name)}，预估 ${data.estimated_user_cnt} 人。`;
  await loadAudiences();
  await loadAudit();
}

async function loadAudiences() {
  state.audiences = await api("/api/audiences");
  $("#audienceList").innerHTML = state.audiences.length
    ? state.audiences
        .map(
          (audience) => `
            <div class="list-item">
              <strong>${escapeHtml(audience.audience_name)}</strong>
              ${audience.requires_approval ? badge("导出需审批", "high") : badge("普通", "success")}
              <p>${escapeHtml(audience.business_purpose)} · ${audience.estimated_user_cnt} 人 · ${escapeHtml(audience.created_by)}</p>
            </div>
          `,
        )
        .join("")
    : emptyState("暂无人群包", "先在人群圈选中保存一个常用人群。");
  $("#exportAudience").innerHTML = state.audiences
    .map((audience) => `<option value="${escapeHtml(audience.audience_id)}">${escapeHtml(audience.audience_name)}</option>`)
    .join("");
}

async function requestExport() {
  if (!$("#exportAudience").value) {
    setNotice("请先保存人群包后再提交导出。", "warning");
    return;
  }
  await api("/api/exports", {
    method: "POST",
    body: JSON.stringify({
      audience_id: $("#exportAudience").value,
      export_target: $("#exportTarget").value,
      business_purpose: $("#exportPurpose").value || "未填写",
    }),
  });
  setNotice("导出申请已提交。", "success");
  await loadExports();
  await loadAudit();
}

async function loadExports() {
  const data = await api("/api/exports");
  $("#exportList").innerHTML = data.length
    ? data
        .map(
          (task) => `
            <div class="list-item">
              <strong>${escapeHtml(task.export_task_id)}</strong>
              ${badge(task.approval_status, task.approval_status === "pending" ? "high" : "success")}
              <p>人群包：${escapeHtml(task.audience_id)} · 目标：${escapeHtml(task.export_target)} · 行数：${task.export_user_cnt}</p>
              <p>位置：${escapeHtml(task.output_location || "待审批后生成")}</p>
            </div>
          `,
        )
        .join("")
    : emptyState("暂无导出任务", "保存人群包后，可在这里提交 CSV 或 ODPS 导出。");
}

async function loadQuality() {
  const data = await api("/api/quality");
  $("#qualityTable").innerHTML = `
    <table>
      <thead><tr><th>标签</th><th>覆盖率</th><th>空值率</th><th>任务</th><th>监控</th><th>风险</th></tr></thead>
      <tbody>
        ${data
          .slice(0, 80)
          .map(
            (item) => `
              <tr>
                <td><strong>${escapeHtml(item.tag_name)}</strong><br><small>${escapeHtml(item.tag_code)}</small></td>
                <td>${(item.coverage_rate * 100).toFixed(2)}%</td>
                <td>${(item.null_rate * 100).toFixed(2)}%</td>
                <td>${escapeHtml(item.task_status)}</td>
                <td>${escapeHtml(item.has_monitor)}</td>
                <td>${badge(item.issue_level, item.issue_level === "low" ? "success" : item.issue_level)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

async function loadRequests() {
  const data = await api("/api/requests");
  const statuses = ["需求中", "口径确认中", "待开发", "开发中", "待验收", "已上线"];
  $("#requestBoard").innerHTML = statuses
    .map(
      (status) => `
        <div class="kanban-column">
          <h3>${status}</h3>
          ${data
            .filter((item) => item.status === status)
            .map(
              (item) => `
                <div class="list-item">
                  <strong>${escapeHtml(item.title)}</strong>
                  <p>${escapeHtml(item.requester)} · ${escapeHtml(item.expected_online_date)}</p>
                </div>
              `,
            )
            .join("") || emptyState("暂无需求")}
        </div>
      `,
    )
    .join("");
}

async function loadAudit() {
  const data = await api("/api/audit");
  $("#auditTable").innerHTML = `
    <table>
      <thead><tr><th>时间</th><th>操作人</th><th>动作</th><th>资产</th><th>风险</th></tr></thead>
      <tbody>
        ${data
          .slice(0, 80)
          .map(
            (item) => `
              <tr>
                <td>${escapeHtml(item.request_time)}</td>
                <td>${escapeHtml(item.actor)}</td>
                <td>${escapeHtml(item.action_type)}</td>
                <td>${escapeHtml(item.asset_type)} / ${escapeHtml(item.asset_id)}</td>
                <td>${badge(item.risk_level, item.risk_level)}</td>
              </tr>
            `,
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function setupNavigation() {
  const links = [...document.querySelectorAll("nav a")];
  const views = [...document.querySelectorAll(".view")];
  function activate(hash) {
    const target = hash || "#overview";
    links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === target));
    views.forEach((view) => view.classList.toggle("active", `#${view.id}` === target));
  }
  window.addEventListener("hashchange", () => activate(location.hash));
  activate(location.hash);
}

function setupEvents() {
  $("#tagSearchBtn").addEventListener("click", loadTags);
  ["#tagKeyword", "#tagCategory", "#tagProduct", "#tagRegion", "#tagStatus", "#tagSensitivity"].forEach((selector) => {
    $(selector).addEventListener("change", loadTags);
  });
  $("#tagKeyword").addEventListener("keydown", (event) => {
    if (event.key === "Enter") loadTags();
  });
  $("#addConditionBtn").addEventListener("click", () => {
    $("#conditionList").insertAdjacentHTML("beforeend", conditionHtml(Date.now()));
    renderConditionRows();
  });
  $("#previewAudienceBtn").addEventListener("click", previewAudience);
  $("#saveAudienceBtn").addEventListener("click", saveAudience);
  $("#requestExportBtn").addEventListener("click", requestExport);
}

async function boot() {
  setupNavigation();
  setupEvents();
  await loadTagFilterOptions();
  await Promise.all([loadDashboard(), loadTags(), loadTagMap(), loadAudiences(), loadExports(), loadQuality(), loadRequests(), loadAudit()]);
}

boot().catch((error) => {
  document.body.innerHTML = `<main><div class="card"><h1>启动失败</h1><p>${escapeHtml(error.message)}</p></div></main>`;
});
