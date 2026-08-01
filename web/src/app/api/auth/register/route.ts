import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import {
  createSessionToken,
  mintSessionJti,
  setSessionCookie,
} from "@/lib/auth";
import { registerProfileSchema } from "@/lib/profile-fields";
import { rateLimit } from "@/lib/rate-limit";
import { toErrorResponse } from "@/lib/errors";
import { clientIp, createAuthSession } from "@/server/auth/sessions";
import { sendVerifyEmail } from "@/server/auth/email-verify";
import { childLogger } from "@/lib/logger";

const log = childLogger("auth.register");

export async function POST(req: Request) {
  try {
    const rl = rateLimit("register:ip", 20);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = registerProfileSchema.parse(await req.json());
    const email = body.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email đã được đăng ký" }, { status: 409 });
    }

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(body.password),
        name: body.name,
        phone: body.phone,
        address: body.address ?? null,
        dateOfBirth: body.dateOfBirth ?? null,
        role: "CUSTOMER",
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "auth.register",
        entityType: "User",
        entityId: user.id,
      },
    });

    try {
      await sendVerifyEmail({ userId: user.id, email: user.email });
    } catch (e) {
      log.warn(
        { err: e instanceof Error ? e.message : e, userId: user.id },
        "verify email send failed on register",
      );
    }

    const jti = mintSessionJti();
    await createAuthSession({
      userId: user.id,
      jti,
      userAgent: req.headers.get("user-agent"),
      ip: clientIp(req),
    });

    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      jti,
    });
    await setSessionCookie(token);
    return NextResponse.json({ ok: true, role: user.role, emailVerified: false });
  } catch (e) {
    return toErrorResponse(e);
  }
}
