# MVP 工程化重构设计

## 目标

在保留现有 API、样例数据和启动方式的前提下，把轻量 MVP 重构为可测试、可替换、适合继续工程化演进的项目结构。同时优化当前前端的信息组织、筛选能力、空状态和响应式布局，让它更像一个可反复使用的数据治理工作台。

## 当前问题

- `mvp/src/repository.mjs` 混合了 CSV 解析、路径配置、元数据加载、看板聚合、质量模拟、人群预览、导出申请、JSON 持久化和审计写入，职责过载。
- `mvp/src/server.mjs` 直接导入大量业务函数，HTTP 路由和业务逻辑耦合。
- MVP 只有 smoke test，无法在拆模块时保护 CSV、标签筛选、人群预览、导出审批等核心行为。
- 当前前端文案声称支持分类、产品、区域、状态检索，但标签目录 UI 只提供关键词和敏感等级筛选。
- 人群圈选页面把条件编辑、预估结果、保存动作放在同一个面板内，流程层级不清。
- 导出任务空状态和错误提示较弱，`alert` 打断式反馈不适合后台工具。
- 看板固定 4 列但状态有 6 个，窄屏和中等宽度下容易拥挤。
- 视觉风格偏松散，卡片圆角和阴影偏大，不够贴近高频数据操作界面。

## 范围

本次重构主要限制在 `mvp/`，只配套更新 `docs/superpowers/`、`mvp/README.md` 和 `MANIFEST.md`。顶层项目组织保持不变：

- `docs/` 继续保存 PRD、数据盘点和技术设计。
- `prototype/` 继续保存高保真静态原型。
- `sql/` 继续保存业务库和 MaxCompute DDL 草稿。
- `data-assets/` 继续保存治理文档、血缘和任务样例。
- `exports/` 继续保存标签元数据样例 CSV。

## 目标结构

```text
mvp/src/
  server.mjs
  routes/
    api-routes.mjs
    static-routes.mjs
  services/
    dashboard-service.mjs
    tag-service.mjs
    audience-service.mjs
    export-service.mjs
    request-service.mjs
  stores/
    json-store.mjs
    tag-metadata-store.mjs
  utils/
    csv.mjs
    date.mjs
    hash.mjs
    id.mjs
  tests/
    csv.test.mjs
    tag-service.test.mjs
    audience-service.test.mjs
    export-service.test.mjs
    smoke-test.mjs
```

## 模块职责

- `server.mjs` 只创建 HTTP server，组装路由，并在直接运行时监听端口。
- `routes/api-routes.mjs` 负责现有 API 路径映射、请求体读取、操作者识别和 JSON 响应格式。
- `routes/static-routes.mjs` 负责 `mvp/public` 静态文件服务和路径穿越保护。
- `stores/tag-metadata-store.mjs` 读取标签元数据 CSV，缓存标签行，并提供元数据读取能力。
- `stores/json-store.mjs` 读写本地 JSON store，包括人群包、导出任务和审计日志。
- `services/tag-service.mjs` 负责标签标准化、敏感等级识别、标签查询、标签地图和质量模拟。
- `services/dashboard-service.mjs` 基于标签、质量、人群包和导出任务构建首页指标。
- `services/audience-service.mjs` 负责样例用户生成、条件比较、人群预览、人群包保存和相关审计写入。
- `services/export-service.mjs` 负责导出审批判断、导出任务创建和相关审计写入。
- `services/request-service.mjs` 返回当前本地需求看板样例。
- `utils/` 存放纯函数，包括 CSV、日期、hash 和 id。

## API 行为保持

以下 HTTP 契约保持不变：

- `GET /api/dashboard`
- `GET /api/tags`
- `GET /api/tags/:tagId`
- `GET /api/tag-map`
- `GET /api/quality`
- `GET /api/requests`
- `POST /api/audience/preview`
- `GET /api/audiences`
- `POST /api/audiences`
- `GET /api/exports`
- `POST /api/exports`
- `GET /api/audit`

前端仍使用这些 API，不引入构建系统，不增加外部依赖。

## 前端优化

前端优化以 `mvp/public` 为范围，保留单页 Hash 导航和现有页面主题，做以下调整：

- 补齐标签目录筛选控件：关键词、分类、产品、区域、状态、敏感等级。
- 首页保留 KPI，但降低卡片装饰感，增强表格和列表的可扫描性。
- 人群圈选拆成三个清晰区域：条件编辑、预估与保存、已保存人群。
- 导出任务增加页面内提示和空状态，移除 `alert`。
- 看板改为可横向滚动或响应式 6 状态布局，避免强行塞进 4 列。
- 全局 UI 调整为更紧凑的后台工具风格：8px 圆角、轻量边框、少阴影、稳定表格宽度。
- 增加 loading、error、empty 状态，避免加载失败时只显示空白。
- 移动端和窄屏下导航、筛选、条件行、看板不重叠、不挤压。

## 测试策略

使用 Node 内置 `node:test` 和 `node:assert/strict`，保持 MVP 零新增依赖。

新增测试先于实现：

- CSV 解析覆盖 quoted comma、escaped quote、CRLF 和空行。
- 标签服务覆盖关键词、分类、产品、区域、状态、敏感等级筛选。
- 人群服务覆盖敏感标签只返回聚合结果，不返回 sample。
- 导出服务覆盖敏感字段、需审批人群、大人群进入 `pending`。
- Smoke test 继续启动 HTTP server，验证主 API 流程，并且不永久修改样例 JSON。

前端通过浏览器验证：

- 桌面宽度下首页、标签目录、人群圈选、导出任务和看板无明显重叠。
- 窄屏宽度下导航、筛选行、条件行和表格可用。
- 页面加载后没有明显控制台错误。

## 实施约束

- 不引入前端框架和构建工具。
- 不引入外部 npm 包。
- 不改变 API 路径和核心响应结构。
- 不重做 `prototype/`，只优化可运行的 `mvp/public`。
- 保留 `npm start` 和 `npm test`。
- 删除 `mvp/src/repository.mjs` 前必须完成所有消费者迁移。

## 验收标准

- `npm test` 通过。
- `npm start` 能启动 MVP。
- 浏览器验证桌面和窄屏布局无明显重叠、不可读、按钮挤压。
- `git status --short --branch` 在提交后干净。
- 最终推送到 `origin/main`。
