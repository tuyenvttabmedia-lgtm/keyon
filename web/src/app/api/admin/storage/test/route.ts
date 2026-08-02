import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { StorageService, resetStorageCache } from "@/server/storage";
import { resolveStorage } from "@/server/storage/config";

async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** Upload a tiny probe object to verify Wasabi (or local) credentials. */
export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
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
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Test failed",
      },
      { status: 400 },
    );
  }
}
