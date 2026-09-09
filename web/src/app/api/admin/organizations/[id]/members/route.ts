import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { addMemberByEmail, memberAddSchema } from "@/server/org/org-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    const { id } = await params;
    const body = memberAddSchema.parse(await req.json());
    const row = await addMemberByEmail(id, body, session.id);
    return NextResponse.json({ id: row.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
