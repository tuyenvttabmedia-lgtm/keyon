import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { unlinkOrder } from "@/server/admin/agreements";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; orderId: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "orders" });
    const { id, orderId } = await params;
    await unlinkOrder(id, orderId, session.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "agreement.unlink_order");
  }
}
