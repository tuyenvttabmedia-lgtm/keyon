import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import {
  agreementLinkOrderSchema,
  linkOrderByCode,
} from "@/server/admin/agreements";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "orders", "Không có quyền gắn đơn vào HĐ");
    const { id } = await params;
    const body = agreementLinkOrderSchema.parse(await req.json());
    const result = await linkOrderByCode(id, body.orderCode, session.id);
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "agreement.link_order");
  }
}
