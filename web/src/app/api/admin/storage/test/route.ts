import { NextResponse } from "next/server";
import { StorageService, resetStorageCache } from "@/server/storage";
import { resolveStorage } from "@/server/storage/config";
import { toErrorResponse } from "@/lib/errors";
import { requireAdminSession } from "@/server/auth/require-staff";

/** Upload a tiny probe object to verify Wasabi (or local) credentials. */
export async function POST() {
  try {
    await requireAdminSession({ capability: "storage" });

    resetStorageCache();
    const resolved = await resolveStorage();
    if (resolved.driver !== "wasabi") {
      return NextResponse.json({
        ok: true,
        driver: "local",
        message: "Đang dùng local storage — không cần test Wasabi",
      });
    }

    const probe = Buffer.from(`keyon-storage-probe ${new Date().toISOString()}`);
    const stored = await StorageService.put({
      data: probe,
      contentType: "text/plain",
      folder: `${resolved.wasabi.pathPrefix}/_probe`,
      filename: `probe-${Date.now()}.txt`,
    });

    // Cleanup probe (best-effort)
    await StorageService.delete(stored.key).catch(() => undefined);

    return NextResponse.json({
      ok: true,
      driver: "wasabi",
      source: resolved.wasabi.source,
      bucket: resolved.wasabi.bucket,
      message: "Kết nối Wasabi OK",
      probeKey: stored.key,
      probeUrl: stored.url,
    });
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) {
      return toErrorResponse(e);
    }
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Test failed",
      },
      { status: 400 },
    );
  }
}
