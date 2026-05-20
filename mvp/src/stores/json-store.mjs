import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const storeFileNames = {
  audiences: "audiences.json",
  exports: "exports.json",
  audit: "audit-log.json",
};

export function createJsonStore(dataDir, name) {
  const fileName = storeFileNames[name];
  if (!fileName) throw new Error(`未知 JSON store: ${name}`);
  const filePath = join(dataDir, fileName);

  return {
    async read() {
      if (!existsSync(filePath)) return [];
      return JSON.parse(await readFile(filePath, "utf8"));
    },
    async write(value) {
      await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
    },
  };
}
