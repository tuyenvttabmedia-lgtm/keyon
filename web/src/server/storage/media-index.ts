import { readJsonFile } from "@/server/cms/store";

/**
 * Legacy JSON index — only used for one-shot migration into MediaAsset.
 * New uploads/deletes go through Prisma only (no dual-write).
 */
export type MediaIndexEntry = {
  key: string;
  url: string;
  name: string;
  driver: string;
  contentType?: string;
  uploadedAt: string;
};

const FILE = "media-index.json";

export async function listMediaIndex(): Promise<MediaIndexEntry[]> {
  return readJsonFile<MediaIndexEntry[]>(FILE, []);
}
