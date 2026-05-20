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
