import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { assertAdminRole } from "@/lib/staff-access";
import { toErrorResponse } from "@/lib/errors";
import {
  deleteOrganization,
  orgUpdateSchema,
  updateOrganization,
} from "@/server/org/org-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    const { id } = await params;
    const body = orgUpdateSchema.parse(await req.json());
    const org = await updateOrganization(id, body, session.id);
    return NextResponse.json({ id: org.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    assertAdminRole(session.role, "Chỉ ADMIN được xóa tổ chức");
    const { id } = await params;
    await deleteOrganization(id, session.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e);
  }
}
