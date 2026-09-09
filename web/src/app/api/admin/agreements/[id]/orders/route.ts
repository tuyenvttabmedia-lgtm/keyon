import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import {
  agreementLinkOrderSchema,
  linkOrderByCode,
} from "@/server/admin/agreements";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "orders" });
    const { id } = await params;
    const body = agreementLinkOrderSchema.parse(await req.json());
    const result = await linkOrderByCode(id, body.orderCode, session.id);
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "agreement.link_order");
  }
}
