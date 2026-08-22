import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { toErrorResponse } from "@/lib/errors";
import { verifyQuoteTrackOtp } from "@/server/quote/tracking";

function clientIp(req: Request) {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return req.headers.get("x-real-ip") ?? "unknown";
}

const schema = z.object({
  referenceCode: z.string().trim().min(4).max(20),
  email: z.string().trim().email().max(200),
  code: z.string().trim().regex(/^\d{6}$/, "Mã gồm 6 chữ số"),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req);
    const rl = rateLimit(`quote-track-verify-route:${ip}`, 30, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều lần thử. Thử lại sau." },
        { status: 429 },
      );
    }

    const body = schema.parse(await req.json());
    const result = await verifyQuoteTrackOtp({
      referenceCode: body.referenceCode,
      email: body.email,
      code: body.code,
      ip,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error ?? "Xác minh thất bại" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, quote: result.quote });
  } catch (e) {
    return toErrorResponse(e);
  }
}
