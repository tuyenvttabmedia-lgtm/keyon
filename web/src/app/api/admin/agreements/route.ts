import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { toErrorResponse } from "@/lib/errors";
import {
  agreementCreateSchema,
  createAgreement,
} from "@/server/admin/agreements";

export async function POST(req: Request) {
  try {
    const session = await requireStaffSession({ capability: "orders" });
    const body = agreementCreateSchema.parse(await req.json());
    const row = await createAgreement(body, session.id);
    return NextResponse.json({ id: row.id });
  } catch (e) {
    return toErrorResponse(e, "agreement.create");
  }
}
