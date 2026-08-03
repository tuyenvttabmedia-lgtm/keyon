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

/** Email is the login identity — only verify current address (no change-email). */
export async function issueEmailVerifyToken(input: {
  userId: string;
  email: string;
}) {
  return new SignJWT({
    purpose: "verify",
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
  if (purpose !== "verify") {
    throw new Error("Token không hợp lệ");
  }
  if (!payload.sub || typeof payload.email !== "string") {
    throw new Error("Token không hợp lệ");
  }
  const userId = payload.sub;
  const email = payload.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Tài khoản không tồn tại");

  if (user.email.toLowerCase() !== email) {
    throw new Error("Email không khớp tài khoản");
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerifiedAt: new Date(),
      pendingEmail: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: userId,
      action: "email.verified",
      entityType: "User",
      entityId: userId,
    },
  });

  log.info({ userId, purpose }, "email verified");
  return { userId, email, purpose: "verify" as const };
}

export function isEmailVerified(user: {
  emailVerifiedAt: Date | null;
}): boolean {
  return Boolean(user.emailVerifiedAt);
}
