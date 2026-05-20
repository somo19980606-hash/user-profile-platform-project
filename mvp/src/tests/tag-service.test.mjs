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
