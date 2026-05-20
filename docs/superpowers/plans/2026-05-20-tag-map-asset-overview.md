# Tag Map Asset Overview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把标签地图从静态分类树改成以二级分类为核心的标签资产概览和目录导航入口。

**Architecture:** 服务层在 `tag-service.mjs` 聚合二级分类、分布和治理提示，前端 `app.js` 只负责渲染和筛选跳转。PRD 同步描述页面职责，避免功能无出处。

**Tech Stack:** Node.js built-in test runner, static HTML/CSS/JS, existing no-build MVP server.

---

### Task 1: 服务层契约

**Files:**
- Modify: `mvp/src/tests/tag-service.test.mjs`
- Modify: `mvp/src/services/tag-service.mjs`

- [ ] **Step 1: Write the failing test**

Add tests that assert `getTagMap()` returns `category_assets`, richer distributions, and governance insights, and that `getFilteredTags()` supports `categoryL2` and `valueType`.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/tests/tag-service.test.mjs`

Expected: FAIL because the new map fields and filters are missing.

- [ ] **Step 3: Write minimal implementation**

Extend `getFilteredTags()` and `getTagMap()` without changing unrelated services.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/tests/tag-service.test.mjs`

Expected: PASS.

### Task 2: PRD 对齐

**Files:**
- Modify: `docs/phase1-prd.md`

- [ ] **Step 1: Update PRD section 7.4**

Describe the tag map as a secondary-category asset overview, lightweight locator, richer distributions, and metadata-driven governance hints.

- [ ] **Step 2: Update acceptance criteria**

Change the tag map acceptance row to require secondary category overview, richer dimensions, governance hints, and catalog linkage.

### Task 3: 前端标签地图

**Files:**
- Modify: `mvp/public/index.html`
- Modify: `mvp/public/app.js`
- Modify: `mvp/public/styles.css`

- [ ] **Step 1: Update markup**

Replace the old two-card tag map with a locator, secondary category matrix, governance panel, and distribution sections.

- [ ] **Step 2: Render new API fields**

Render `category_assets`, `governance_insights`, and the new distributions. Add click handlers that apply tag catalog filters and switch to `#tags`.

- [ ] **Step 3: Style responsive layout**

Keep controls compact, avoid nested cards, preserve mobile readability, and ensure text does not overflow controls.

### Task 4: Verification and Git

**Files:**
- Verify only.

- [ ] **Step 1: Run full test suite**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Browser check**

Open `http://localhost:8899/#map`, verify desktop and mobile layouts, and test a map item jumps to 标签目录 with filters.

- [ ] **Step 3: Commit and push**

Commit the focused changes and push to GitHub.
