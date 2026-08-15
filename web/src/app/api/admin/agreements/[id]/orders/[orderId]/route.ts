import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { unlinkOrder } from "@/server/admin/agreements";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; orderId: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "orders", "Không có quyền gỡ đơn khỏi HĐ");
    const { id, orderId } = await params;
    await unlinkOrder(id, orderId, session.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "agreement.unlink_order");
  }
}
