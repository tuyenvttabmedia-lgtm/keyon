import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { StorageService } from "@/server/storage";
import { toErrorResponse } from "@/lib/errors";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { key } = await ctx.params;
    const decoded = decodeURIComponent(key);
    const buf = await StorageService.get(decoded);
    return new NextResponse(new Uint8Array(buf), {
      headers: { "Content-Type": "application/octet-stream" },
    });
  } catch (e) {
    return toErrorResponse(e, "storage.get");
  }
}
