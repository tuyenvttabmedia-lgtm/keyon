import { AppError } from "@/lib/errors";
import {
  recordTurnstileHealth,
  resolveTurnstile,
} from "@/server/turnstile/config";

type SiteverifyResponse = {
  success?: boolean;
  "error-codes"?: string[];
  hostname?: string;
};

/** Prefer Admin → Cài đặt → Turnstile; ENV is fallback. */
export async function assertTurnstileToken(
  token: string | null | undefined,
  remoteip?: string | null,
): Promise<void> {
  const resolved = await resolveTurnstile();
  if (!resolved.ready) return;

  if (!token?.trim()) {
    throw new AppError("Vui lòng xác nhận bạn không phải robot", 400);
  }

  const body = new URLSearchParams({
    secret: resolved.secretKey,
    response: token.trim(),
  });
  if (remoteip?.trim()) body.set("remoteip", remoteip.trim());

  try {
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
      const codes = data["error-codes"] ?? [];
      await recordTurnstileHealth(false, codes.join(",") || "verify_failed");
      if (codes.includes("timeout-or-duplicate")) {
        throw new AppError(
          "Turnstile đã hết hạn hoặc đã dùng — làm mới ô xác minh rồi thử lại",
          400,
        );
      }
      throw new AppError("Xác minh Turnstile thất bại — thử lại", 400);
    }
    await recordTurnstileHealth(true);
  } catch (e) {
    if (e instanceof AppError) throw e;
    await recordTurnstileHealth(
      false,
      e instanceof Error ? e.message : "network_error",
    );
    throw new AppError("Xác minh Turnstile thất bại — thử lại", 400);
  }
}
