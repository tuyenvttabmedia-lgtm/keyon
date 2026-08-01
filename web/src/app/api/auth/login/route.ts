import { NextResponse } from "next/server";
import { z } from "zod";
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

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  totpCode: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = bodySchema.parse(json);
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });
    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "Sai email hoặc mật khẩu" }, { status: 401 });
    }

    if (user.totpEnabledAt && user.totpSecretEnc) {
      if (!body.totpCode?.trim()) {
        return NextResponse.json(
          { error: "Yêu cầu mã xác thực 2FA", requiresTotp: true },
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
          return NextResponse.json(
            { error: "Mã 2FA không đúng", requiresTotp: true },
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
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bad request" },
      { status: 400 },
    );
  }
}
