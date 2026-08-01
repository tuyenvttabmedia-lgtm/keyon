import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { resendDelivery } from "@/server/fulfillment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ deliveryId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rl = rateLimit(`resend:${session.id}`, 20);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = schema.parse(await req.json());
    const result = await resendDelivery({
      deliveryId: body.deliveryId,
      actorId: session.id,
      reason: "customer_or_staff_resend",
    });
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "delivery.resend");
  }
}
