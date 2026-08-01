import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { sendMail } from "@/server/mail";
import { emailVerifyAddress } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";

const log = childLogger("auth.email-verify");

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

function appBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export async function issueEmailVerifyToken(input: {
  userId: string;
  email: string;
  purpose?: "verify" | "change_email";
}) {
  return new SignJWT({
    purpose: input.purpose ?? "verify",
    email: input.email.toLowerCase(),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret());
}

export async function sendVerifyEmail(input: {
  userId: string;
  email: string;
  purpose?: "verify" | "change_email";
}) {
  const token = await issueEmailVerifyToken(input);
  const verifyUrl = `${appBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const tpl = emailVerifyAddress({
    verifyUrl,
    email: input.email,
  });
  await sendMail({
    to: input.email,
    subject: tpl.subject,
    text: tpl.text,
    html: tpl.html,
  });
  return { verifyUrl };
}

export async function consumeEmailVerifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret());
  const purpose = payload.purpose;
  if (purpose !== "verify" && purpose !== "change_email") {
    throw new Error("Token không hợp lệ");
  }
  if (!payload.sub || typeof payload.email !== "string") {
    throw new Error("Token không hợp lệ");
  }
  const userId = payload.sub;
  const email = payload.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Tài khoản không tồn tại");

  if (purpose === "change_email") {
    if (user.pendingEmail?.toLowerCase() !== email) {
      throw new Error("Email xác thực không khớp yêu cầu đổi email");
    }
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken && taken.id !== userId) {
      throw new Error("Email đã được sử dụng");
    }
    await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        pendingEmail: null,
        emailVerifiedAt: new Date(),
      },
    });
  } else {
    if (user.email.toLowerCase() !== email) {
      throw new Error("Email không khớp tài khoản");
    }
    await prisma.user.update({
      where: { id: userId },
      data: { emailVerifiedAt: new Date() },
    });
  }

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: purpose === "change_email" ? "email.change_verified" : "email.verified",
      entityType: "User",
      entityId: userId,
    },
  });

  log.info({ userId, purpose }, "email verified");
  return { userId, email, purpose };
}

export function isEmailVerified(user: {
  emailVerifiedAt: Date | null;
}): boolean {
  return Boolean(user.emailVerifiedAt);
}
