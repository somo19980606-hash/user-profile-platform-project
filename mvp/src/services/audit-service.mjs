import { createId } from "../utils/id.mjs";
import { nowIso } from "../utils/date.mjs";

export function createAuditService({ auditStore, idGenerator = () => createId("audit"), now = nowIso }) {
  return {
    async appendAudit(entry) {
      const audit = await auditStore.read();
      const record = {
        audit_id: idGenerator(),
        request_time: now(),
        ...entry,
      };
      audit.unshift(record);
      await auditStore.write(audit.slice(0, 1000));
      return record;
    },
  };
}
