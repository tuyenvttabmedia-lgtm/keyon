import { SignJWT } from "jose";
import { sendMail } from "@/server/mail";
import { emailPasswordReset } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";

const log = childLogger("auth.password-reset");

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

export type PasswordResetIssueResult = {
  emailSent: boolean;
  /** Relative path — only in non-production when useful for local ops */
  resetUrl?: string;
  error?: string;
};

/** Issue a 1h password-reset JWT and try to email it. */
export async function issuePasswordReset(input: {
  userId: string;
  email: string;
}): Promise<PasswordResetIssueResult> {
  const token = await new SignJWT({ purpose: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(input.userId)
    .setIssuedAt()
    .setExpirationTime("1h")
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
