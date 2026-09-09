import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteMedia, updateMedia } from "@/server/media/service";

const patchSchema = z.object({
  altText: z.string().trim().max(300).nullable().optional(),
  caption: z.string().trim().max(500).nullable().optional(),
  purpose: z.string().trim().max(40).nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireStaffSession({ capability: "media_mutate" });

  const { id } = await params;
  if (id.startsWith("brand:")) {
    return NextResponse.json(
      { error: "Ảnh brand tĩnh không sửa được tại đây" },
      { status: 400 },
    );
  }

  try {
    const body = patchSchema.parse(await req.json());
    const asset = await updateMedia(id, body);
    return NextResponse.json({ ok: true, asset });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid" }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Lỗi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await requireStaffSession({ capability: "media_mutate" });

  const { id } = await params;
  try {
    await deleteMedia(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const status =
      e && typeof e === "object" && "status" in e
        ? Number((e as { status: number }).status)
        : 500;
    const message = e instanceof Error ? e.message : "Lỗi xóa";
    return NextResponse.json({ error: message }, { status: status || 500 });
  }
}
