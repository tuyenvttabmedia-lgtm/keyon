import { AppError } from "@/lib/errors";

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
};

/** When both keys are set, auth/contact forms must pass a Turnstile token. */
export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY?.trim() &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
  );
}

export function turnstileSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;
}

export async function assertTurnstileToken(
  token: string | null | undefined,
  remoteip?: string | null,
): Promise<void> {
  if (!isTurnstileEnabled()) return;

  if (!token?.trim()) {
    throw new AppError("Vui lòng xác nhận bạn không phải robot", 400);
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY!.trim(),
    response: token.trim(),
  });
  if (remoteip?.trim()) body.set("remoteip", remoteip.trim());

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8_000),
    },
  );
  const data = (await res.json()) as SiteverifyResponse;
  if (!res.ok || data.success !== true) {
    throw new AppError("Xác minh Turnstile thất bại — thử lại", 400);
  }
}
