import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import {
  agreementUpdateSchema,
  updateAgreement,
} from "@/server/admin/agreements";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "orders", "Không có quyền sửa khung HĐ");
    const { id } = await params;
    const body = agreementUpdateSchema.parse(await req.json());
    const row = await updateAgreement(id, body, session.id);
    return NextResponse.json({ id: row.id, status: row.status });
  } catch (e) {
    return toErrorResponse(e, "agreement.update");
  }
}
