import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { orgLinkOrderSchema, pinOrderByCode } from "@/server/org/org-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "customers", "Không có quyền gắn đơn vào tổ chức");
    const { id } = await params;
    const body = orgLinkOrderSchema.parse(await req.json());
    const result = await pinOrderByCode(id, body.orderCode, session.id);
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "organization.pin_order");
  }
}
