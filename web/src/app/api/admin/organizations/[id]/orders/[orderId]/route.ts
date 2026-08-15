import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { unpinOrder } from "@/server/org/org-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; orderId: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "customers", "Không có quyền gỡ đơn khỏi tổ chức");
    const { id, orderId } = await params;
    await unpinOrder(id, orderId, session.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "organization.unpin_order");
  }
}
