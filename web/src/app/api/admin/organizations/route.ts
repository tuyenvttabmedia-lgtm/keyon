import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { createOrganization, orgCreateSchema } from "@/server/org/org-admin";

export async function POST(req: Request) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    const body = orgCreateSchema.parse(await req.json());
    const org = await createOrganization(body, session.id);
    return NextResponse.json({ id: org.id });
  } catch (e) {
    return toErrorResponse(e);
  }
}
