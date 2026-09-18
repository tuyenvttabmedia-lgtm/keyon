import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import {
  createSessionToken,
  mintSessionJti,
  setSessionCookie,
} from "@/lib/auth";
import {
  clientIp,
  createAuthSession,
  roleRequiresTotp,
} from "@/server/auth/sessions";
import { verifyTotpCode } from "@/lib/totp";
import { decryptPayload } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";
import { assertTurnstileToken } from "@/server/auth/turnstile";
import {
  mintLoginTotpChallenge,
  verifyLoginTotpChallenge,
} from "@/server/auth/login-challenge";

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  totpCode: z.string().optional(),
  turnstileToken: z.string().optional(),
  /** Issued after password + Turnstile pass when 2FA is still required. */
  loginChallenge: z.string().optional(),
  remember: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req) ?? "unknown";
    const rlIp = await rateLimit(`login:ip:${ip}`, 20, 15 * 60_000);
    if (!rlIp.ok) {
      return NextResponse.json(
        { error: "Quá nhiều lần đăng nhập. Thử lại sau 15 phút." },
        { status: 429 },
      );
    }

    const json = await req.json();
    const body = bodySchema.parse(json);
    const emailKey = body.email.toLowerCase();

    // Turnstile token is single-use. After password OK we mint loginChallenge so
    // the 2FA step does not re-verify (and fail) the same token.
    const challengeOk = await verifyLoginTotpChallenge(
      body.loginChallenge,
      emailKey,
    );
    if (!challengeOk) {
      await assertTurnstileToken(body.turnstileToken, ip);
    }

    const rlEmail = await rateLimit(`login:email:${emailKey}`, 10, 15 * 60_000);
    if (!rlEmail.ok) {
      return NextResponse.json(
        { error: "Quá nhiều lần đăng nhập. Thử lại sau 15 phút." },
        { status: 429 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }

    if (user.disabledAt) {
      return NextResponse.json(
        { error: "Tài khoản đã bị khóa. Liên hệ quản trị viên." },
        { status: 403 },
      );
    }

    if (user.totpEnabledAt && user.totpSecretEnc) {
      if (!body.totpCode?.trim()) {
        const loginChallenge = await mintLoginTotpChallenge({
          userId: user.id,
          email: user.email,
        });
        return NextResponse.json(
          {
            error: "Yêu cầu mã xác thực 2FA",
            requiresTotp: true,
            loginChallenge,
          },
          { status: 401 },
        );
      }
      let secretPlain = "";
      try {
        secretPlain = decryptPayload(user.totpSecretEnc);
      } catch {
        return NextResponse.json({ error: "2FA cấu hình lỗi" }, { status: 500 });
      }
      const codeOk = verifyTotpCode(secretPlain, body.totpCode.trim());
      if (!codeOk) {
        // Try backup codes
        const unused = await prisma.totpBackupCode.findMany({
          where: { userId: user.id, usedAt: null },
        });
        let matched = false;
        for (const row of unused) {
          if (await verifyPassword(body.totpCode.trim().toUpperCase(), row.codeHash)) {
            await prisma.totpBackupCode.update({
              where: { id: row.id },
              data: { usedAt: new Date() },
            });
            matched = true;
            break;
          }
        }
        if (!matched) {
          // Keep challenge so user can retry 2FA without a new Turnstile token.
          const loginChallenge = await mintLoginTotpChallenge({
            userId: user.id,
            email: user.email,
          });
          return NextResponse.json(
            {
              error: "Mã 2FA không đúng",
              requiresTotp: true,
              loginChallenge,
            },
            { status: 401 },
          );
        }
      }
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

    return NextResponse.json({
      ok: true,
      role: user.role,
      emailVerified: Boolean(user.emailVerifiedAt),
      totpEnabled: Boolean(user.totpEnabledAt),
      totpRequired: roleRequiresTotp(user.role) && !user.totpEnabledAt,
    });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
