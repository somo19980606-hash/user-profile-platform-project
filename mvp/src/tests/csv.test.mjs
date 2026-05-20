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
