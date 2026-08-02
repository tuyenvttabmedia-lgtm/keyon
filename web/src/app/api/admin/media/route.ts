import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { staffHasCapability } from "@/lib/staff-access";
import { StorageService } from "@/server/storage";
import {
  listBrandMedia,
  listLibraryMedia,
  uploadMedia,
} from "@/server/media/service";

export async function GET(req: Request) {
  const session = await readSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!staffHasCapability(session.role, "media_mutate")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(req.url);
  const includeBrand = url.searchParams.get("brand") !== "0";
  const q = url.searchParams.get("q") ?? undefined;
  const mime = url.searchParams.get("mime") ?? undefined;
  const purpose = url.searchParams.get("purpose") ?? undefined;
  const from = url.searchParams.get("from") ?? undefined;
  const to = url.searchParams.get("to") ?? undefined;
  const sort =
    (url.searchParams.get("sort") as
      | "newest"
      | "oldest"
      | "name"
      | "size"
      | null) ?? "newest";

  const [driver, library, brand] = await Promise.all([
    StorageService.driverName(),
    listLibraryMedia({ q, mime, purpose, from, to, sort }),
    includeBrand ? listBrandMedia() : Promise.resolve([]),
  ]);

  // Brand first only when no search — otherwise filter brand client-side by q
  let brandItems = brand;
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    brandItems = brand.filter(
      (b) =>
        b.filename.toLowerCase().includes(needle) ||
        b.originalName.toLowerCase().includes(needle),
    );
  }

  const files = [...library, ...brandItems];

  return NextResponse.json({
    driver,
    files,
    // Back-compat for older MediaPicker expecting {name,url,source}
    items: files.map((f) => ({
      ...f,
      name: f.filename,
      url: f.publicUrl,
      source: f.source === "brand" ? "brand" : f.storageDriver,
    })),
  });
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session || !isStaff(session.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!staffHasCapability(session.role, "media_mutate")) {
    return NextResponse.json({ error: "Không có quyền tải media" }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Thiếu file" }, { status: 400 });
    }
    const purpose = (form.get("purpose") as string | null) || null;
    const altText = (form.get("altText") as string | null) || null;
    const caption = (form.get("caption") as string | null) || null;

    const asset = await uploadMedia({ file, purpose, altText, caption });

    return NextResponse.json({
      ok: true,
      id: asset.id,
      url: asset.publicUrl,
      name: asset.filename,
      key: undefined,
      driver: asset.storageDriver,
      asset,
    });
  } catch (e) {
    const status =
      e && typeof e === "object" && "status" in e
        ? Number((e as { status: number }).status)
        : 500;
    const message = e instanceof Error ? e.message : "Lỗi upload";
    return NextResponse.json({ error: message }, { status: status || 500 });
  }
}
