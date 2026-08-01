import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentService } from "@/server/payment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  paymentReference: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const rl = rateLimit(`stub-confirm:${ip}`, 30);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = schema.parse(await req.json());
    const payment = await PaymentService.confirmDev(body.paymentReference);
    return NextResponse.json({ ok: true, status: payment.status, orderId: payment.orderId });
  } catch (e) {
    return toErrorResponse(e, "stub-confirm");
  }
}
