import { randomBytes } from "crypto";
import { SignJWT } from "jose";
import { sendMail } from "@/server/mail";
import { emailPasswordReset } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";
import { getRedisConnection } from "@/server/queue";

const log = childLogger("auth.password-reset");
const RESET_TTL_SEC = 60 * 60;

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

function resetConsumeKey(jti: string) {
  return `keyon:pwd-reset:used:${jti}`;
}

export type PasswordResetIssueResult = {
  emailSent: boolean;
  /** Relative path — only in non-production when useful for local ops */
  resetUrl?: string;
  error?: string;
};

/** Issue a 1h password-reset JWT (with jti) and try to email it. */
export async function issuePasswordReset(input: {
  userId: string;
  email: string;
}): Promise<PasswordResetIssueResult> {
  const jti = randomBytes(24).toString("base64url");
  const token = await new SignJWT({ purpose: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(`${RESET_TTL_SEC}s`)
    .sign(secret());

  const resetPath = `/reset-password?token=${encodeURIComponent(token)}`;
  const resetUrl = `${appBaseUrl()}${resetPath}`;

  try {
    const tpl = emailPasswordReset({ resetUrl });
    await sendMail({
      to: input.email,
      subject: tpl.subject,
      text: tpl.text,
      html: tpl.html,
    });
    return {
      emailSent: true,
      ...(process.env.NODE_ENV !== "production" ? { resetUrl: resetPath } : {}),
    };
  } catch (e) {
    log.error(
      { err: e instanceof Error ? e.message : e, userId: input.userId },
      "password-reset mail failed",
    );
    if (process.env.NODE_ENV !== "production") {
      return {
        emailSent: false,
        resetUrl: resetPath,
        error: "Không gửi được email — dùng link đặt mật khẩu (dev).",
      };
    }
    return {
      emailSent: false,
      error: "Không gửi được email đặt mật khẩu. Kiểm tra cấu hình Mail.",
    };
  }
}

/** Mark reset jti consumed (one-time). Returns false if already used. */
export async function consumePasswordResetJti(jti: string): Promise<boolean> {
  const redis = getRedisConnection();
  const key = resetConsumeKey(jti);
  const ok = await redis.set(key, "1", "EX", RESET_TTL_SEC, "NX");
  return ok === "OK";
}
