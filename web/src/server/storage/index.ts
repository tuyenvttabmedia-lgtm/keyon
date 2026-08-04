import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";
import { newPublicId } from "@/lib/ids";
import { mediaProxyUrl } from "@/lib/media-url";
import { childLogger } from "@/lib/logger";
import {
  resolveStorage,
  type ResolvedWasabiConfig,
} from "@/server/storage/config";

const log = childLogger("storage");

export type StoredObject = {
  key: string;
  url: string;
  driver: string;
};

export interface StorageDriver {
  readonly name: string;
  put(input: {
    data: Buffer;
    contentType?: string;
    folder?: string;
    filename?: string;
  }): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  delete?(key: string): Promise<void>;
}

class LocalStorageDriver implements StorageDriver {
  readonly name = "local";
  constructor(private root: string) {}

  private resolve(key: string) {
    const rootAbs = path.resolve(this.root);
    // Normalize posix keys (media/yyyy/mm/file) on Windows
    const full = path.resolve(rootAbs, ...key.split("/").filter(Boolean));
    const prefix = rootAbs.endsWith(path.sep) ? rootAbs : rootAbs + path.sep;
    if (full !== rootAbs && !full.startsWith(prefix)) {
      throw new Error("Invalid storage key");
    }
    return full;
  }

  async put(input: {
    data: Buffer;
    contentType?: string;
    folder?: string;
    filename?: string;
  }): Promise<StoredObject> {
    const folder = input.folder ?? "media";
    const filename = input.filename ?? `${newPublicId("file")}`;
    const key = path.posix.join(folder, filename);
    const full = this.resolve(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, input.data);
    log.info({ key, driver: this.name }, "stored object");
    return {
      key,
      url: `/uploads/${filename}`,
      driver: this.name,
    };
  }

  async get(key: string): Promise<Buffer> {
    return readFile(this.resolve(key));
  }

  async delete(key: string): Promise<void> {
    const { unlink } = await import("fs/promises");
    await unlink(this.resolve(key)).catch(() => undefined);
  }
}

function publicUrl(cfg: ResolvedWasabiConfig, key: string): string {
  // Custom CDN that is already public (not raw Wasabi host)
  if (
    cfg.publicBaseUrl &&
    !/wasabisys\.com/i.test(cfg.publicBaseUrl)
  ) {
    return `${cfg.publicBaseUrl.replace(/\/$/, "")}/${key}`;
  }
  // Private Wasabi bucket → serve via app credentials (avoids AccessDenied)
  return mediaProxyUrl(key);
}

class WasabiStorageDriver implements StorageDriver {
  readonly name = "wasabi";
  private client: S3Client;

  constructor(private cfg: ResolvedWasabiConfig) {
    this.client = new S3Client({
      endpoint: cfg.endpoint,
      region: cfg.region,
      credentials: {
        accessKeyId: cfg.accessKeyId,
        secretAccessKey: cfg.secretAccessKey,
      },
      forcePathStyle: true,
    });
  }

  async put(input: {
    data: Buffer;
    contentType?: string;
    folder?: string;
    filename?: string;
  }): Promise<StoredObject> {
    const folder = input.folder ?? (this.cfg.pathPrefix || "media");
    const filename = input.filename ?? `${newPublicId("file")}`;
    const key = path.posix.join(folder, filename);

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: this.cfg.bucket,
          Key: key,
          Body: input.data,
          ContentType: input.contentType ?? "application/octet-stream",
          // Best-effort; many Wasabi buckets disable ACLs (Bucket owner enforced)
          ACL: "public-read",
        }),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (/ACL|AccessControl|public-read|NotImplemented|InvalidRequest/i.test(msg)) {
        log.warn({ err: e, key }, "PutObject ACL public-read rejected — retry without ACL");
        await this.client.send(
          new PutObjectCommand({
            Bucket: this.cfg.bucket,
            Key: key,
            Body: input.data,
            ContentType: input.contentType ?? "application/octet-stream",
          }),
        );
      } else {
        throw e;
      }
    }

    const url = publicUrl(this.cfg, key);
    log.info({ key, driver: this.name, source: this.cfg.source, url }, "stored object");
    return { key, url, driver: this.name };
  }

  async get(key: string): Promise<Buffer> {
    const res = await this.client.send(
      new GetObjectCommand({
        Bucket: this.cfg.bucket,
        Key: key,
      }),
    );
    const bytes = await res.Body?.transformToByteArray();
    if (!bytes) throw new Error("Empty object body");
    return Buffer.from(bytes);
  }

  async delete(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.cfg.bucket,
        Key: key,
      }),
    );
  }
}

let cached: StorageDriver | null = null;
let cachedFingerprint: string | null = null;

function fingerprint(resolved: Awaited<ReturnType<typeof resolveStorage>>): string {
  if (resolved.driver === "local") {
    return `local:${resolved.localRoot}`;
  }
  const w = resolved.wasabi;
  return `wasabi:${w.source}:${w.endpoint}:${w.region}:${w.bucket}:${w.accessKeyId}:${w.pathPrefix}:${w.publicBaseUrl}`;
}

export function resetStorageCache(): void {
  cached = null;
  cachedFingerprint = null;
}

export async function getStorage(): Promise<StorageDriver> {
  const resolved = await resolveStorage();
  const fp = fingerprint(resolved);
  if (cached && cachedFingerprint === fp) return cached;

  if (resolved.driver === "wasabi") {
    cached = new WasabiStorageDriver(resolved.wasabi);
  } else {
    cached = new LocalStorageDriver(resolved.localRoot);
  }
  cachedFingerprint = fp;
  return cached;
}

export const StorageService = {
  put: async (input: Parameters<StorageDriver["put"]>[0]) =>
    (await getStorage()).put(input),
  get: async (key: string) => (await getStorage()).get(key),
  delete: async (key: string) => {
    const d = await getStorage();
    if (d.delete) await d.delete(key);
  },
  driverName: async () => (await getStorage()).name,
};
