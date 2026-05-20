import { addDays as defaultAddDays, nowIso } from "../utils/date.mjs";
import { createId } from "../utils/id.mjs";

export function createExportService({
  audienceStore,
  exportStore,
  auditService,
  idGenerator = () => createId("exp"),
  now = nowIso,
  addDays = defaultAddDays,
}) {
  async function requestExport(payload, actor = "anonymous") {
    const audiences = await audienceStore.read();
    const audience = audiences.find((item) => item.audience_id === payload.audience_id);
    if (!audience) {
      const error = new Error("人群包不存在");
      error.statusCode = 404;
      throw error;
    }
    const exportFields = payload.export_fields?.length ? payload.export_fields : ["uuid", "audience_id", "matched_tag_summary", "created_time"];
    const hasSensitiveField = exportFields.some((field) => /email|device|ip|user_id|order|pay|amount/i.test(field));
    const needsApproval = audience.requires_approval || hasSensitiveField || audience.estimated_user_cnt > 500;
    const exports = await exportStore.read();
    const task = {
      export_task_id: idGenerator(),
      audience_id: audience.audience_id,
      requested_by: actor,
      business_purpose: payload.business_purpose || audience.business_purpose || "",
      export_target: payload.export_target || "csv",
      export_fields: exportFields,
      approval_status: needsApproval ? "pending" : "completed",
      approved_by: needsApproval ? "" : "system",
      output_location: needsApproval ? "" : `local://exports/${audience.audience_id}.csv`,
      export_user_cnt: needsApproval ? 0 : audience.estimated_user_cnt,
      expire_time: payload.expire_time || addDays(7),
      created_time: now(),
      updated_time: now(),
    };
    exports.unshift(task);
    await exportStore.write(exports);
    await auditService.appendAudit({
      actor,
      action_type: "request_export",
      asset_type: "export",
      asset_id: task.export_task_id,
      condition_json: audience.condition_json,
      result_summary: JSON.stringify({ approval_status: task.approval_status, export_target: task.export_target }),
      risk_level: needsApproval ? "high" : "medium",
    });
    return task;
  }

  return { requestExport };
}
