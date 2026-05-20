import assert from "node:assert/strict";
import { once } from "node:events";
import { readFile, writeFile } from "node:fs/promises";
import { createProfileServer } from "./server.mjs";

const auditLogPath = new URL("../data/audit-log.json", import.meta.url);

async function request(baseUrl, path, options = {}) {
  const response = await fetch(new URL(path, baseUrl), {
    headers: { "content-type": "application/json", "x-profile-user": "smoke-test" },
    ...options,
  });
  const payload = await response.json();
  return { response, payload };
}

async function withServer(testFn) {
  const server = createProfileServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const { port } = server.address();
  try {
    await testFn(`http://127.0.0.1:${port}`);
  } finally {
    server.close();
    await once(server, "close");
  }
}

const originalAuditLog = await readFile(auditLogPath, "utf8");

try {
  await withServer(async (baseUrl) => {
    const dashboard = await request(baseUrl, "/api/dashboard");
    assert.equal(dashboard.response.status, 200);
    assert.equal(dashboard.payload.ok, true);
    assert.ok(dashboard.payload.data.tag_count > 0);

    const tags = await request(baseUrl, "/api/tags?sensitivity=high");
    assert.equal(tags.response.status, 200);
    assert.equal(tags.payload.ok, true);
    assert.ok(tags.payload.data.length > 0);

    const preview = await request(baseUrl, "/api/audience/preview", {
      method: "POST",
      body: JSON.stringify({ logic: "AND", conditions: [] }),
    });
    assert.equal(preview.response.status, 200);
    assert.equal(preview.payload.ok, true);
    assert.equal(preview.payload.data.total_user_cnt, 800);
  });
} finally {
  await writeFile(auditLogPath, originalAuditLog, "utf8");
}

console.log("Smoke tests passed.");
