import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import { addMemberByEmail, memberAddSchema } from "@/server/org/org-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(session.role, "customers", "Không có quyền gán thành viên");
    const { id } = await params;
    const body = memberAddSchema.parse(await req.json());
    const row = await addMemberByEmail(id, body, session.id);
    return NextResponse.json({ id: row.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
