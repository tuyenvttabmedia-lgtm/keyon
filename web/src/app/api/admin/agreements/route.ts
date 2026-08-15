import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import {
  agreementCreateSchema,
  createAgreement,
} from "@/server/admin/agreements";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "orders", "Không có quyền tạo khung HĐ");
    const body = agreementCreateSchema.parse(await req.json());
    const row = await createAgreement(body, session.id);
    return NextResponse.json({ id: row.id });
  } catch (e) {
    return toErrorResponse(e, "agreement.create");
  }
}
