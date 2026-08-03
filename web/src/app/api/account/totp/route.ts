import { NextResponse } from "next/server";
import { z } from "zod";
import QRCode from "qrcode";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { encryptPayload, decryptPayload } from "@/lib/crypto";
import { hashPassword, verifyPassword } from "@/lib/password";
import {
  generateBackupCodes,
  generateTotpSecret,
  totpOtpauthUrl,
  verifyTotpCode,
} from "@/lib/totp";
import { roleRequiresTotp } from "@/server/auth/sessions";

/** Start setup — returns secret + otpauth URL (not yet enabled). */
export async function POST(req: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = z
    .object({
      action: z.enum(["setup", "enable", "disable"]),
      code: z.string().optional(),
      password: z.string().optional(),
    })
    .parse(await req.json());

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "setup") {
    const secret = generateTotpSecret();
    const otpauthUrl = totpOtpauthUrl({
      secret,
      email: user.email,
      issuer: "KEYON",
    });
    const qrDataUrl = await QRCode.toDataURL(otpauthUrl, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark: "#0f2747", light: "#ffffff" },
    });
    // Stash encrypted secret without enabling
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totpSecretEnc: encryptPayload(secret),
        totpEnabledAt: null,
      },
    });
    return NextResponse.json({
      ok: true,
      secret,
      otpauthUrl,
      qrDataUrl,
      required: roleRequiresTotp(user.role),
    });
  }

  if (body.action === "enable") {
    if (!user.totpSecretEnc || !body.code?.trim()) {
      return NextResponse.json(
        { error: "Thiếu mã xác thực — chạy setup trước" },
        { status: 400 },
      );
    }
    let secret = "";
    try {
      secret = decryptPayload(user.totpSecretEnc);
    } catch {
      return NextResponse.json({ error: "Secret lỗi" }, { status: 500 });
    }
    if (!verifyTotpCode(secret, body.code.trim())) {
      return NextResponse.json({ error: "Mã 2FA không đúng" }, { status: 400 });
    }

    const plainCodes = generateBackupCodes(10);
    await prisma.totpBackupCode.deleteMany({ where: { userId: user.id } });
    await prisma.user.update({
      where: { id: user.id },
      data: { totpEnabledAt: new Date() },
    });
    for (const code of plainCodes) {
      await prisma.totpBackupCode.create({
        data: {
          userId: user.id,
          codeHash: await hashPassword(code),
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: "totp.enable",
        entityType: "User",
        entityId: user.id,
      },
    });

    return NextResponse.json({ ok: true, backupCodes: plainCodes });
  }

  // disable
  if (!body.password) {
    return NextResponse.json({ error: "Cần mật khẩu để tắt 2FA" }, { status: 400 });
  }
  if (!(await verifyPassword(body.password, user.passwordHash))) {
    return NextResponse.json({ error: "Mật khẩu không đúng" }, { status: 401 });
  }
  if (roleRequiresTotp(user.role)) {
    return NextResponse.json(
      { error: "Vai trò của bạn bắt buộc bật 2FA" },
      { status: 403 },
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { totpSecretEnc: null, totpEnabledAt: null },
    }),
    prisma.totpBackupCode.deleteMany({ where: { userId: user.id } }),
  ]);

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      action: "totp.disable",
      entityType: "User",
      entityId: user.id,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      totpEnabledAt: true,
      role: true,
      emailVerifiedAt: true,
      email: true,
      passwordChangedAt: true,
      createdAt: true,
    },
  });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    totpEnabled: Boolean(user.totpEnabledAt),
    totpRequired: roleRequiresTotp(user.role),
    email: user.email,
    emailVerified: Boolean(user.emailVerifiedAt),
    passwordUpdatedAt: (user.passwordChangedAt ?? user.createdAt).toISOString(),
  });
}
