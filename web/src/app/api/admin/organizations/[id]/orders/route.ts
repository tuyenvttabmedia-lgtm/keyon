import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import { orgLinkOrderSchema, pinOrderByCode } from "@/server/org/org-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "customers" });
    const { id } = await params;
    const body = orgLinkOrderSchema.parse(await req.json());
    const result = await pinOrderByCode(id, body.orderCode, session.id);
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "organization.pin_order");
  }
}
