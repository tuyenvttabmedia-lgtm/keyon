import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import { createCheckoutOrder } from "@/server/checkout";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  variantId: z.string().min(1),
  email: z.string().email(),
  quantity: z.number().int().min(1).max(5).optional(),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const rl = rateLimit(`checkout:${ip}`);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const session = await readSession();
    const body = schema.parse(await req.json());
    const result = await createCheckoutOrder({
      variantId: body.variantId,
      email: session?.email ?? body.email,
      userId: session?.id,
      quantity: body.quantity ?? 1,
    });
    return NextResponse.json({
      orderId: result.order.id,
      code: result.order.code,
      paymentReference: result.paymentReference,
      instructions: result.instructions,
    });
  } catch (e) {
    return toErrorResponse(e, "checkout");
  }
}
