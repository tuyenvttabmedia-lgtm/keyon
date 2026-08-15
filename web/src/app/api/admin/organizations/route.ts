import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { createOrganization, orgCreateSchema } from "@/server/org/org-admin";

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "customers", "Không có quyền tạo tổ chức");
    const body = orgCreateSchema.parse(await req.json());
    const org = await createOrganization(body, session.id);
    return NextResponse.json({ id: org.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
