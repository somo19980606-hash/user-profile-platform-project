import { readFile } from "node:fs/promises";
import { parseCsv } from "../utils/csv.mjs";

export function createTagMetadataStore(metadataCsvPath) {
  let cache = null;

  return {
    async getTags() {
      if (cache) return cache;
      const content = await readFile(metadataCsvPath, "utf8");
      cache = parseCsv(content);
      return cache;
    },
  };
}
