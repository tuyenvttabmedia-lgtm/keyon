import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { memberPatchSchema, patchMembership } from "@/server/org/org-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; membershipId: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "customers", "Không có quyền sửa thành viên");
    const { id, membershipId } = await params;
    const body = memberPatchSchema.parse(await req.json());
    const row = await patchMembership(id, membershipId, body, session.id);
    return NextResponse.json({
      id: row.id,
      role: row.role,
      status: row.status,
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
