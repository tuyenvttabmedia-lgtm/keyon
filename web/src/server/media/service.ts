import { promises as fs } from "fs";
import path from "path";
import { randomBytes } from "crypto";
import imageSize from "image-size";
import type { MediaAsset, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { MediaDto } from "@/lib/media-types";
import { childLogger } from "@/lib/logger";
import { StorageService } from "@/server/storage";
import {
  appendMediaIndex,
  listMediaIndex,
  removeMediaIndex,
} from "@/server/storage/media-index";

export type { MediaDto } from "@/lib/media-types";

const log = childLogger("media");

export const MEDIA_ALLOWED_MIME = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

export const MEDIA_MAX_BYTES = 2 * 1024 * 1024;

export type MediaPurpose = "product" | "blog" | "brand" | "ui";

function toDto(row: MediaAsset): MediaDto {
  return {
    id: row.id,
    filename: row.filename,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.size,
    width: row.width,
    height: row.height,
    storageDriver: row.storageDriver,
    publicUrl: row.publicUrl,
    altText: row.altText,
    caption: row.caption,
    purpose: row.purpose,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    source: "library",
  };
}

function safeBaseName(original: string): string {
  const base = original
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "image";
}

function extFromMime(mime: string): string {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "bin";
}

function sniffImageMime(buf: Buffer): string | null {
  if (buf.length >= 8 && buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
    return "image/png";
  }
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buf.length >= 12 &&
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (buf.length >= 6) {
    const sig = buf.toString("ascii", 0, 6);
    if (sig === "GIF87a" || sig === "GIF89a") return "image/gif";
  }
  return null;
}

function readDimensions(buf: Buffer): {
  width: number | null;
  height: number | null;
} {
  try {
    const dim = imageSize(buf);
    return {
      width: dim.width ?? null,
      height: dim.height ?? null,
    };
  } catch {
    return { width: null, height: null };
  }
}

/** One-shot import from legacy media-index.json into MediaAsset. */
export async function ensureMediaIndexMigrated(): Promise<void> {
  const count = await prisma.mediaAsset.count();
  if (count > 0) return;
  const index = await listMediaIndex();
  if (index.length === 0) return;

  for (const e of index) {
    await prisma.mediaAsset
      .create({
        data: {
          filename: e.name,
          originalName: e.name,
          mimeType: e.contentType || "application/octet-stream",
          size: 0,
          storageDriver: e.driver || "local",
          storageKey: e.key,
          publicUrl: e.url,
          createdAt: e.uploadedAt ? new Date(e.uploadedAt) : undefined,
        },
      })
      .catch(() => undefined);
  }
  log.info({ imported: index.length }, "migrated media-index.json → MediaAsset");
}

export async function listBrandMedia(): Promise<MediaDto[]> {
  const brandDir = path.join(process.cwd(), "public", "brand");
  const files = (await fs.readdir(brandDir).catch(() => [])).filter((f) =>
    /\.(png|jpe?g|webp|gif|svg)$/i.test(f),
  );
  return files.map((f) => {
    const lower = f.toLowerCase();
    let mime = "image/png";
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) mime = "image/jpeg";
    else if (lower.endsWith(".webp")) mime = "image/webp";
    else if (lower.endsWith(".gif")) mime = "image/gif";
    else if (lower.endsWith(".svg")) mime = "image/svg+xml";
    return {
      id: `brand:${f}`,
      filename: f,
      originalName: f,
      mimeType: mime,
      size: 0,
      width: null,
      height: null,
      storageDriver: "local",
      publicUrl: `/brand/${f}`,
      altText: null,
      caption: null,
      purpose: "brand",
      createdAt: new Date(0).toISOString(),
      updatedAt: new Date(0).toISOString(),
      source: "brand" as const,
    };
  });
}

export type ListMediaQuery = {
  q?: string;
  mime?: string; // image | png | jpeg | webp | gif
  purpose?: string;
  from?: string;
  to?: string;
  sort?: "newest" | "oldest" | "name" | "size";
};

export async function listLibraryMedia(
  query: ListMediaQuery = {},
): Promise<MediaDto[]> {
  await ensureMediaIndexMigrated();

  const where: Prisma.MediaAssetWhereInput = {};
  if (query.q?.trim()) {
    const q = query.q.trim();
    where.OR = [
      { filename: { contains: q, mode: "insensitive" } },
      { originalName: { contains: q, mode: "insensitive" } },
      { altText: { contains: q, mode: "insensitive" } },
    ];
  }
  if (query.mime === "image") {
    where.mimeType = { startsWith: "image/" };
  } else if (query.mime === "png") {
    where.mimeType = "image/png";
  } else if (query.mime === "jpeg") {
    where.mimeType = "image/jpeg";
  } else if (query.mime === "webp") {
    where.mimeType = "image/webp";
  } else if (query.mime === "gif") {
    where.mimeType = "image/gif";
  }
  if (query.purpose && query.purpose !== "all") {
    where.purpose = query.purpose;
  }
  if (query.from || query.to) {
    where.createdAt = {};
    if (query.from) {
      const d = new Date(query.from);
      d.setHours(0, 0, 0, 0);
      where.createdAt.gte = d;
    }
    if (query.to) {
      const d = new Date(query.to);
      d.setHours(23, 59, 59, 999);
      where.createdAt.lte = d;
    }
  }

  let orderBy: Prisma.MediaAssetOrderByWithRelationInput = {
    createdAt: "desc",
  };
  if (query.sort === "oldest") orderBy = { createdAt: "asc" };
  if (query.sort === "name") orderBy = { filename: "asc" };
  if (query.sort === "size") orderBy = { size: "desc" };

  const rows = await prisma.mediaAsset.findMany({ where, orderBy });
  return rows.map(toDto);
}

export async function uploadMedia(input: {
  file: File;
  purpose?: string | null;
  altText?: string | null;
  caption?: string | null;
}): Promise<MediaDto> {
  const { file } = input;
  if (file.size > MEDIA_MAX_BYTES) {
    throw Object.assign(new Error("Tối đa 2MB"), { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageMime(buf);
  if (!sniffed || !MEDIA_ALLOWED_MIME.has(sniffed)) {
    throw Object.assign(new Error("Chỉ nhận PNG/JPEG/WebP/GIF hợp lệ"), {
      status: 400,
    });
  }
  if (file.type && MEDIA_ALLOWED_MIME.has(file.type) && file.type !== sniffed) {
    // Client MIME mismatch — trust sniffed bytes
    log.warn(
      { client: file.type, sniffed },
      "media mime mismatch — using sniffed type",
    );
  }

  const mimeType = sniffed;
  const ext = extFromMime(mimeType);
  const originalName = file.name?.trim() || `upload.${ext}`;
  const now = new Date();
  const folder = `media/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const filename = `${randomBytes(8).toString("hex")}-${safeBaseName(originalName)}.${ext}`;
  const { width, height } = readDimensions(buf);

  let stored;
  try {
    stored = await StorageService.put({
      data: buf,
      contentType: mimeType,
      folder,
      filename,
    });
  } catch (e) {
    log.error({ err: e }, "storage put failed");
    throw Object.assign(new Error("Upload lưu trữ thất bại"), { status: 502 });
  }

  // Local: mirror under public/uploads for static CMS URLs (filename only)
  if (stored.driver === "local") {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buf);
    stored.url = `/uploads/${filename}`;
  }

  try {
    const row = await prisma.mediaAsset.create({
      data: {
        filename,
        originalName,
        mimeType,
        size: file.size,
        width,
        height,
        storageDriver: stored.driver,
        storageKey: stored.key,
        publicUrl: stored.url,
        altText: input.altText?.trim() || null,
        caption: input.caption?.trim() || null,
        purpose: input.purpose?.trim() || null,
      },
    });

    await appendMediaIndex({
      key: stored.key,
      url: stored.url,
      name: filename,
      driver: stored.driver,
      contentType: mimeType,
      uploadedAt: row.createdAt.toISOString(),
    }).catch(() => undefined);

    return toDto(row);
  } catch (e) {
    log.error({ err: e, key: stored.key }, "media DB create failed — cleanup");
    await StorageService.delete(stored.key).catch(() => undefined);
    if (stored.driver === "local") {
      await fs
        .unlink(path.join(process.cwd(), "public", "uploads", filename))
        .catch(() => undefined);
    }
    throw Object.assign(new Error("Không tạo được bản ghi Media"), {
      status: 500,
    });
  }
}

export async function updateMedia(
  id: string,
  data: { altText?: string | null; caption?: string | null; purpose?: string | null },
): Promise<MediaDto> {
  const row = await prisma.mediaAsset.update({
    where: { id },
    data: {
      altText:
        data.altText === undefined
          ? undefined
          : data.altText?.trim() || null,
      caption:
        data.caption === undefined
          ? undefined
          : data.caption?.trim() || null,
      purpose:
        data.purpose === undefined
          ? undefined
          : data.purpose?.trim() || null,
    },
  });
  return toDto(row);
}

export async function deleteMedia(id: string): Promise<void> {
  if (id.startsWith("brand:")) {
    throw Object.assign(new Error("Không xóa được ảnh brand tĩnh"), {
      status: 400,
    });
  }
  const row = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!row) {
    throw Object.assign(new Error("Không tìm thấy ảnh"), { status: 404 });
  }

  await StorageService.delete(row.storageKey);
  if (row.storageDriver === "local") {
    await fs
      .unlink(path.join(process.cwd(), "public", "uploads", row.filename))
      .catch(() => undefined);
  }
  await removeMediaIndex(row.storageKey).catch(() => undefined);
  await prisma.mediaAsset.delete({ where: { id } });
}
