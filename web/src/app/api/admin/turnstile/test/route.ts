import { NextResponse } from "next/server";
import {
  getTurnstileSettingsPublic,
  recordTurnstileHealth,
  resolveTurnstile,
} from "@/server/turnstile/config";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export async function POST() {
  try {
    await requireStaffSession({ capability: "settings" });
    const resolved = await resolveTurnstile();
    if (!resolved.ready) {
      return NextResponse.json(
        {
          ok: false,
          error: "Chưa cấu hình đủ Site key + Secret (hoặc chưa bật)",
          data: await getTurnstileSettingsPublic(),
        },
        { status: 400 },
      );
    }

    // Cloudflare dummy token always fails — we only check siteverify is reachable
    // and credentials are accepted shape-wise by probing with empty response.
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: resolved.secretKey,
          response: "keyon-admin-ping",
        }),
        signal: AbortSignal.timeout(8_000),
      },
    );
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    const codes = data["error-codes"] ?? [];
    // invalid-input-response = secret accepted, token bogus (expected for ping)
    // invalid-input-secret = bad secret
    const secretOk = !codes.includes("invalid-input-secret");
    if (!secretOk) {
      await recordTurnstileHealth(false, codes.join(",") || "bad_secret");
      return NextResponse.json(
        {
          ok: false,
          error: "Secret key không hợp lệ (Cloudflare từ chối)",
          data: await getTurnstileSettingsPublic(),
        },
        { status: 400 },
      );
    }

    await recordTurnstileHealth(true);
    return NextResponse.json({
      ok: true,
      message: `Secret OK · Site key: ${resolved.siteKey.slice(0, 8)}… · nguồn ${resolved.source}`,
      data: await getTurnstileSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
