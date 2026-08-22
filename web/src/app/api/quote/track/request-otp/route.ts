import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { toErrorResponse } from "@/lib/errors";
import {
  isQuotePublicTrackingEnabled,
  requestQuoteTrackOtp,
} from "@/server/quote/tracking";

function clientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

const schema = z.object({
  referenceCode: z.string().trim().min(4).max(20),
  email: z.string().trim().email().max(200),
});

export async function POST(req: Request) {
  try {
    const enabled = await isQuotePublicTrackingEnabled();
    if (!enabled) {
      return NextResponse.json(
        { error: "Tính năng tra cứu chưa được bật" },
        { status: 403 },
      );
    }

    const ip = clientIp(req);
    const rl = rateLimit(`quote-track-req:${ip}`, 30, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Thử lại sau." },
        { status: 429 },
      );
    }

    const body = schema.parse(await req.json());
    await requestQuoteTrackOtp({
      referenceCode: body.referenceCode,
      email: body.email,
      ip,
    });

    return NextResponse.json({
      ok: true,
      message:
        "Nếu mã và email khớp yêu cầu, bạn sẽ nhận mã OTP trong vài phút.",
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
