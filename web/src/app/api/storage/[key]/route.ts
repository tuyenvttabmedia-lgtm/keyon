import { NextResponse } from "next/server";
import { StorageService } from "@/server/storage";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  try {
    await requireStaffSession({ capability: "storage", method: "GET" });
    const { key } = await ctx.params;
    const decoded = decodeURIComponent(key);
    if (!decoded || decoded.includes("..") || decoded.startsWith("/")) {
      return NextResponse.json({ error: "Invalid key" }, { status: 400 });
    }
    const buf = await StorageService.get(decoded);
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": "application/octet-stream" },
    });
  } catch (e) {
    return toErrorResponse(e, "storage.get");
  }
}
