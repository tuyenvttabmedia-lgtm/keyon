import { NextResponse } from "next/server";
import { StorageService } from "@/server/storage";
import { toErrorResponse } from "@/lib/errors";

const ALLOWED_PREFIX = ["media/", "brand/"];

function contentTypeForKey(key: string): string {
  const lower = key.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

/**
 * Public media proxy — streams objects from Wasabi/local with app credentials.
 * Needed when the bucket is private (direct S3 URL → AccessDenied).
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string[] }> },
) {
  try {
    const segments = (await ctx.params).key ?? [];
    const key = segments.map((s) => decodeURIComponent(s)).join("/");
    if (!key || key.includes("..")) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }
    if (!ALLOWED_PREFIX.some((p) => key.startsWith(p))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const buf = await StorageService.get(key);
    return new NextResponse(new Uint8Array(buf), {
      status: 200,
      headers: {
        "Content-Type": contentTypeForKey(key),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (e) {
    return toErrorResponse(e, "media.proxy");
  }
}
