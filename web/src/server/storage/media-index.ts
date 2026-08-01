import { readJsonFile, writeJsonFile } from "@/server/cms/store";

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

export async function appendMediaIndex(entry: MediaIndexEntry): Promise<void> {
  const list = await listMediaIndex();
  const next = [entry, ...list.filter((e) => e.key !== entry.key)];
  await writeJsonFile(FILE, next.slice(0, 500));
}

export async function removeMediaIndex(key: string): Promise<void> {
  const list = await listMediaIndex();
  await writeJsonFile(
    FILE,
    list.filter((e) => e.key !== key),
  );
}
