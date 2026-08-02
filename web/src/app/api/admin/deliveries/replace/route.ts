import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { replaceDelivery } from "@/server/fulfillment/replace";
import { toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";

const schema = z.object({
  deliveryId: z.string().min(1),
  plainPayload: z.string().min(1),
  reason: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "fulfillment",
      "Không có quyền thay thế deliverable",
    );
    const body = schema.parse(await req.json());
    const delivery = await replaceDelivery({
      deliveryId: body.deliveryId,
      plainPayload: body.plainPayload,
      actorId: session.id,
      reason: body.reason,
    });
    return NextResponse.json({ ok: true, deliveryId: delivery.id });
  } catch (e) {
    return toErrorResponse(e, "delivery.replace");
  }
}
