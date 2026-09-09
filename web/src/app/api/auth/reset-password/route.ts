import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, revokeAllAuthSessions } from "@/server/auth/sessions";
import { consumePasswordResetJti } from "@/server/auth/password-reset";

const bodySchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

export async function POST(req: Request) {
  try {
    const ip = clientIp(req) ?? "unknown";
    const rl = await rateLimit(`reset-password:${ip}`, 10, 60 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Thử lại sau." },
        { status: 429 },
      );
    }

    const body = bodySchema.parse(await req.json());
    const { payload } = await jwtVerify(body.token, secret());
    if (payload.purpose !== "password_reset" || !payload.sub) {
      return NextResponse.json({ error: "Link đặt lại không hợp lệ" }, { status: 400 });
    }
    const jti = typeof payload.jti === "string" ? payload.jti : null;
    if (!jti) {
      return NextResponse.json({ error: "Link đặt lại không hợp lệ" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, passwordChangedAt: true, disabledAt: true },
    });
    if (!user || user.disabledAt) {
      return NextResponse.json({ error: "Link đặt lại không hợp lệ" }, { status: 400 });
    }

    const iat = typeof payload.iat === "number" ? payload.iat : 0;
    if (
      user.passwordChangedAt &&
      iat > 0 &&
      iat * 1000 < user.passwordChangedAt.getTime()
    ) {
      return NextResponse.json(
        { error: "Link đặt lại đã hết hiệu lực" },
        { status: 400 },
      );
    }

    const firstUse = await consumePasswordResetJti(jti);
    if (!firstUse) {
      return NextResponse.json(
        { error: "Link đặt lại đã được sử dụng" },
        { status: 400 },
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await hashPassword(body.password),
        passwordChangedAt: new Date(),
      },
    });
    await revokeAllAuthSessions(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Link đặt lại hết hạn hoặc không hợp lệ" },
      { status: 400 },
    );
  }
}
