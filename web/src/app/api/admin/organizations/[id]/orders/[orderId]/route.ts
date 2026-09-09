import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { unpinOrder } from "@/server/org/org-admin";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; orderId: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    const { id, orderId } = await params;
    await unpinOrder(id, orderId, session.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "organization.unpin_order");
  }
}
