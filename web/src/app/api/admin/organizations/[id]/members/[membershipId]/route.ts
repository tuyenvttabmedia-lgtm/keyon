import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { memberPatchSchema, patchMembership } from "@/server/org/org-admin";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; membershipId: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
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
