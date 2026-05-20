# MVP 工程化重构实施计划

> **给 agentic workers：** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**目标：** 在不改变现有页面、API 路径和样例数据语义的前提下，把 MVP 拆成可测试的路由、服务、存储和工具模块。

**架构：** `server.mjs` 只负责组装 HTTP server；`routes/` 处理 HTTP 输入输出；`services/` 承载标签、人群、导出和看板业务；`stores/` 负责 CSV/JSON 文件读写；`utils/` 放纯函数。测试先覆盖纯函数和服务行为，再迁移实现。

**技术栈：** Node.js ESM、内置 `node:test`、内置 `node:assert/strict`、零新增依赖。

---

### 任务 1：测试入口和 CSV 工具

**Files:**
- Modify: `mvp/package.json`
- Create: `mvp/src/utils/csv.mjs`
- Create: `mvp/src/tests/csv.test.mjs`
- Move later: `mvp/src/smoke-test.mjs` to `mvp/src/tests/smoke-test.mjs`

- [ ] **Step 1: 写失败测试**

创建 `mvp/src/tests/csv.test.mjs`：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../utils/csv.mjs";

test("parseCsv parses quoted commas, escaped quotes, CRLF, and blank rows", () => {
  const rows = parseCsv('name,desc\r\n"会员,高价值","他说 ""好"""\r\n\r\n普通,无');

  assert.deepEqual(rows, [
    { name: "会员,高价值", desc: '他说 "好"' },
    { name: "普通", desc: "无" },
  ]);
});
```

- [ ] **Step 2: 验证 RED**

Run: `npm test`

Expected: FAIL，原因是 `../utils/csv.mjs` 不存在或没有导出 `parseCsv`。

- [ ] **Step 3: 最小实现**

创建 `mvp/src/utils/csv.mjs`，从现有 `repository.mjs` 搬移 `parseCsv`，并导出：

```js
export function parseCsv(content) {
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
```

- [ ] **Step 4: 更新测试入口**

修改 `mvp/package.json`：

```json
"test": "node --test src/tests/*.test.mjs src/tests/smoke-test.mjs"
```

移动 smoke test：

```bash
git mv mvp/src/smoke-test.mjs mvp/src/tests/smoke-test.mjs
```

并把其中导入改为：

```js
import { createProfileServer } from "../server.mjs";
const auditLogPath = new URL("../../data/audit-log.json", import.meta.url);
```

- [ ] **Step 5: 验证 GREEN**

Run: `npm test`

Expected: PASS。

### 任务 2：抽出基础工具和存储层

**Files:**
- Create: `mvp/src/utils/hash.mjs`
- Create: `mvp/src/utils/date.mjs`
- Create: `mvp/src/utils/id.mjs`
- Create: `mvp/src/stores/json-store.mjs`
- Create: `mvp/src/stores/tag-metadata-store.mjs`
- Modify: `mvp/src/repository.mjs`

- [ ] **Step 1: 写失败测试**

在 `mvp/src/tests/tag-service.test.mjs` 中先写对未来 `getFilteredTags` 的导入测试，驱动存储层可注入：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createTagService } from "../services/tag-service.mjs";

const tags = [
  {
    tag_code: "vip_level",
    tag_id: "1",
    tag_name: "会员等级",
    tag_category_l1: "用户会员标签",
    tag_category_l2: "等级",
    applicable_product: "Lovart",
    applicable_market_region: "US",
    tag_status: "已上线",
    output_field: "vip_level",
    business_definition: "会员等级",
    has_monitor: "Y",
  },
  {
    tag_code: "email_domain",
    tag_id: "2",
    tag_name: "邮箱域名",
    tag_category_l1: "用户基础标签",
    tag_category_l2: "邮箱",
    applicable_product: "Liblib",
    applicable_market_region: "JP",
    tag_status: "待下线",
    output_field: "email",
    business_definition: "邮箱域名",
    has_monitor: "N",
  },
];

test("tag service filters by keyword, sensitivity, product, region, status, and category", async () => {
  const service = createTagService({ tagStore: { getTags: async () => tags } });

  assert.deepEqual((await service.getFilteredTags({ keyword: "邮箱" })).map((tag) => tag.tag_code), ["email_domain"]);
  assert.deepEqual((await service.getFilteredTags({ sensitivity: "high" })).map((tag) => tag.tag_code), ["email_domain"]);
  assert.deepEqual((await service.getFilteredTags({ product: "Lovart" })).map((tag) => tag.tag_code), ["vip_level"]);
  assert.deepEqual((await service.getFilteredTags({ region: "JP" })).map((tag) => tag.tag_code), ["email_domain"]);
  assert.deepEqual((await service.getFilteredTags({ status: "已上线" })).map((tag) => tag.tag_code), ["vip_level"]);
  assert.deepEqual((await service.getFilteredTags({ category: "用户会员标签" })).map((tag) => tag.tag_code), ["vip_level"]);
});
```

- [ ] **Step 2: 验证 RED**

Run: `npm test`

Expected: FAIL，原因是 `services/tag-service.mjs` 尚不存在。

- [ ] **Step 3: 抽工具模块**

从 `repository.mjs` 搬移：

- `hash` 到 `utils/hash.mjs`
- `nowIso`、`todayCompact`、`addDays` 到 `utils/date.mjs`
- `id` 到 `utils/id.mjs`

- [ ] **Step 4: 抽 JSON store**

创建 `mvp/src/stores/json-store.mjs`，导出 `createJsonStore`，保留 `audiences`、`exports`、`audit` 三个 store 名称和文件路径语义。

- [ ] **Step 5: 抽标签元数据 store**

创建 `mvp/src/stores/tag-metadata-store.mjs`，负责读取 `exports/user_tag_metadata_draft_20260514.csv`，调用 `parseCsv`，缓存并返回原始标签行。

- [ ] **Step 6: 暂时保持兼容**

修改 `repository.mjs` 使用新工具和 store，但保留原有导出函数，让 smoke test 继续通过。

- [ ] **Step 7: 验证**

Run: `npm test`

Expected: PASS。

### 任务 3：抽服务层

**Files:**
- Create: `mvp/src/services/tag-service.mjs`
- Create: `mvp/src/services/dashboard-service.mjs`
- Create: `mvp/src/services/audience-service.mjs`
- Create: `mvp/src/services/export-service.mjs`
- Create: `mvp/src/services/request-service.mjs`
- Create: `mvp/src/tests/audience-service.test.mjs`
- Create: `mvp/src/tests/export-service.test.mjs`
- Modify: `mvp/src/repository.mjs`

- [ ] **Step 1: 写 audience 失败测试**

创建 `mvp/src/tests/audience-service.test.mjs`，断言敏感标签预览不返回 sample：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createAudienceService } from "../services/audience-service.mjs";

test("audience preview hides samples when sensitive tags are used", async () => {
  const audit = [];
  const service = createAudienceService({
    tagService: {
      getTags: async () => [
        {
          tag_code: "email_domain",
          tag_name: "邮箱域名",
          tag_value_type: "string",
          is_sensitive: true,
          sensitivity_level: "high",
        },
      ],
    },
    auditService: { appendAudit: async (entry) => audit.push(entry) },
  });

  const result = await service.previewAudience({
    logic: "AND",
    conditions: [{ tag_code: "email_domain", operator: "not_empty", value: "" }],
  }, "tester");

  assert.equal(result.requires_approval, true);
  assert.deepEqual(result.samples, []);
  assert.equal(result.sensitive_tags[0].tag_code, "email_domain");
  assert.equal(audit[0].action_type, "preview_audience");
});
```

- [ ] **Step 2: 写 export 失败测试**

创建 `mvp/src/tests/export-service.test.mjs`，断言敏感字段导出进入 pending：

```js
import test from "node:test";
import assert from "node:assert/strict";
import { createExportService } from "../services/export-service.mjs";

test("export request is pending when sensitive fields are requested", async () => {
  const exports = [];
  const audit = [];
  const service = createExportService({
    audienceStore: {
      read: async () => [{
        audience_id: "aud_1",
        requires_approval: false,
        estimated_user_cnt: 12,
        business_purpose: "测试",
        condition_json: "{}",
      }],
    },
    exportStore: {
      read: async () => exports,
      write: async (value) => {
        exports.splice(0, exports.length, ...value);
      },
    },
    auditService: { appendAudit: async (entry) => audit.push(entry) },
    idGenerator: () => "exp_test",
    now: () => "2026-05-20T00:00:00.000Z",
    addDays: () => "2026-05-27T00:00:00.000Z",
  });

  const task = await service.requestExport({
    audience_id: "aud_1",
    export_fields: ["uuid", "email"],
  }, "tester");

  assert.equal(task.approval_status, "pending");
  assert.equal(task.output_location, "");
  assert.equal(audit[0].action_type, "request_export");
});
```

- [ ] **Step 3: 验证 RED**

Run: `npm test`

Expected: FAIL，原因是 audience/export service 尚未实现。

- [ ] **Step 4: 实现 tag service**

从 `repository.mjs` 搬移并导出 `createTagService`，包含：

- `normalizeTag`
- `sensitivityFor`
- `getTags`
- `getTag`
- `getFilteredTags`
- `getTagMap`
- `getQualityStats`

- [ ] **Step 5: 实现 audience service**

从 `repository.mjs` 搬移：

- `getSampleUsers`
- `compare`
- `previewAudience`
- `saveAudience`

依赖通过参数注入：`tagService`、`audienceStore`、`auditService`。

- [ ] **Step 6: 实现 export service**

从 `repository.mjs` 搬移 `requestExport`，依赖通过参数注入：`audienceStore`、`exportStore`、`auditService`。

- [ ] **Step 7: 实现 dashboard/request service**

创建 `dashboard-service.mjs` 和 `request-service.mjs`，保持现有返回结构不变。

- [ ] **Step 8: 让 repository 变为组合层**

`repository.mjs` 暂时只创建默认 store/service，并重新导出现有函数，降低一次性改动风险。

- [ ] **Step 9: 验证**

Run: `npm test`

Expected: PASS。

### 任务 4：抽路由层并删除旧 repository

**Files:**
- Create: `mvp/src/routes/api-routes.mjs`
- Create: `mvp/src/routes/static-routes.mjs`
- Modify: `mvp/src/server.mjs`
- Delete: `mvp/src/repository.mjs`
- Modify: `mvp/src/tests/smoke-test.mjs`

- [ ] **Step 1: 写 smoke 期望**

保留 `mvp/src/tests/smoke-test.mjs` 的 HTTP 断言，用它作为路由重构的回归测试。

- [ ] **Step 2: 抽 static route**

创建 `static-routes.mjs`，从 `server.mjs` 搬移 mime 类型、静态文件解析和路径穿越保护。

- [ ] **Step 3: 抽 api route**

创建 `api-routes.mjs`，从 `server.mjs` 搬移所有 `/api/*` 路由分支，依赖默认 service 组合。

- [ ] **Step 4: 简化 server**

`server.mjs` 只保留：

- `createProfileServer`
- URL 创建
- `/api/` 分发
- 静态分发
- 直接运行时 listen

- [ ] **Step 5: 删除 repository**

所有消费者改到 routes/services/stores 后删除 `mvp/src/repository.mjs`。

- [ ] **Step 6: 验证**

Run: `npm test`

Expected: PASS。

Run: `npm start`

Expected: 输出 `画像平台 MVP 已启动: http://localhost:8787`。验证后停止进程。

### 任务 5：文档、提交、推送

**Files:**
- Modify: `mvp/README.md`
- Modify: `MANIFEST.md`

- [ ] **Step 1: 更新文档**

更新 `mvp/README.md` 的工程结构说明，列出 `routes/services/stores/utils/tests`。

更新 `MANIFEST.md` 的 `mvp/src/` 描述。

- [ ] **Step 2: 最终验证**

Run: `npm test`

Expected: PASS。

Run: `git status --short --branch`

Expected: 只显示当前分支状态和待提交文件。

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "refactor: 重组 mvp 工程结构"
```

- [ ] **Step 4: 推送**

```bash
GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_github -o IdentitiesOnly=yes' git push
```

Expected: push 到 `origin/main` 成功。
