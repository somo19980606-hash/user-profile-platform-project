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
