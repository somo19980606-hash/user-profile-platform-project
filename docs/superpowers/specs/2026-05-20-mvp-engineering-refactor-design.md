# MVP Engineering Refactor Design

## Goal

Refactor the lightweight MVP into a testable project structure while preserving the current user-facing behavior, API paths, sample data, and `npm start` workflow.

## Current Problems

- `mvp/src/repository.mjs` mixes CSV parsing, path configuration, metadata loading, dashboard aggregation, quality simulation, audience preview, export requests, JSON persistence, and audit logging.
- `mvp/src/server.mjs` imports many business functions directly, so HTTP routing and business behavior are tightly coupled.
- The MVP has a smoke test, but it does not protect individual module behavior during refactoring.
- Future replacement of local CSV/JSON storage with MaxCompute queries or a database would require touching most of the current repository file.

## Scope

This refactor is limited to `mvp/`. Top-level package organization remains unchanged:

- `docs/` keeps PRD, inventory, and technical design.
- `prototype/` keeps the high-fidelity static prototype.
- `sql/` keeps database and MaxCompute DDL drafts.
- `data-assets/` keeps governance and lineage source assets.
- `exports/` keeps the tag metadata sample CSV.

## Target Structure

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

## Module Responsibilities

- `server.mjs` creates the HTTP server, wires route handlers, and starts the process when run directly.
- `routes/api-routes.mjs` maps existing API paths to service calls and formats JSON responses.
- `routes/static-routes.mjs` serves files from `mvp/public` and keeps path traversal protection.
- `stores/tag-metadata-store.mjs` reads the metadata CSV, normalizes tags, caches loaded tags, and exposes tag lookup/query primitives.
- `stores/json-store.mjs` reads and writes local JSON stores for audiences, exports, and audit records.
- `services/tag-service.mjs` owns tag search, tag detail lookup, tag map aggregation, sensitivity classification, and tag quality simulation.
- `services/dashboard-service.mjs` builds overview metrics from tag, quality, audience, and export data.
- `services/audience-service.mjs` owns sample user generation, condition comparison, audience preview, audience save, and related audit writes.
- `services/export-service.mjs` owns export request approval decisions, export task creation, and related audit writes.
- `services/request-service.mjs` returns the current local request board samples.
- `utils/` contains pure helpers for CSV parsing, deterministic hashing, dates, and ids.

## Behavior Preservation

The refactor must preserve these HTTP contracts:

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

The static UI in `mvp/public` should not need changes. Existing JSON sample files remain versioned sample stores.

## Testing Strategy

Use Node's built-in `node:test` and `node:assert/strict` so the MVP keeps zero runtime dependencies.

Add unit tests before moving implementation:

- CSV parsing handles quoted commas, escaped quotes, CRLF, and blank rows.
- Tag service filters by keyword, sensitivity, product, region, status, and category.
- Audience service returns aggregate-only results when sensitive tags are used.
- Export service marks sensitive-field exports, approval-required audiences, and large audiences as pending.
- Smoke test continues to run the HTTP server on a temporary local port and proves the main API flow still works without mutating sample JSON permanently.

## Implementation Constraints

- Do not redesign the UI.
- Do not change API response shapes except where existing behavior is already invalid.
- Do not introduce external packages.
- Keep changes inside `mvp/` except for this spec and the implementation plan.
- Preserve `npm start` and `npm test`.
- Delete `mvp/src/repository.mjs` only after all consumers have moved to the new modules.

## Acceptance Criteria

- `npm test` passes.
- `npm start` can still launch the MVP.
- `git status --short --branch` is clean after commit.
- The final branch is pushed to `origin/main`.
