import { NextResponse } from "next/server";
import { z } from "zod";
import { PaymentService } from "@/server/payment";
import { resolvePayment } from "@/server/payment/config";
import { AppError, toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  paymentReference: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    // Hard kill: production always off; non-prod requires explicit ALLOW_STUB_CONFIRM=1
    if (process.env.NODE_ENV === "production") {
      throw new AppError("Stub confirm bị tắt trên production", 403);
    }
    if (
      process.env.ALLOW_STUB_CONFIRM !== "1" &&
      process.env.ALLOW_STUB_CONFIRM !== "true"
    ) {
      throw new AppError(
        "Stub confirm tắt — set ALLOW_STUB_CONFIRM=1 trên môi trường dev",
        403,
      );
    }
    const resolved = await resolvePayment();
    if (resolved.provider !== "stub") {
      throw new AppError("Stub confirm không khả dụng khi cổng thanh toán thật đang bật", 403);
    }
    const ip = req.headers.get("x-forwarded-for") ?? "local";
    const rl = await rateLimit(`stub-confirm:${ip}`, 30);
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
