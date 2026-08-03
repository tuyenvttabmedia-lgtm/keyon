import { createHmac, timingSafeEqual } from "crypto";

const SEPAY_HMAC_MAX_SKEW_SECONDS = 5 * 60;

function header(
  headers: Record<string, string | string[] | undefined>,
  name: string,
): string {
  const v = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

export function verifySepayApiKey(
  headers: Record<string, string | string[] | undefined>,
  expectedApiKey: string,
): boolean {
  const auth = header(headers, "authorization") || header(headers, "Authorization");
  const candidates = [
    expectedApiKey,
    `Apikey ${expectedApiKey}`,
    `Bearer ${expectedApiKey}`,
  ];
  return candidates.some((expected) => {
    if (!auth || auth.length !== expected.length) return false;
    try {
      return timingSafeEqual(Buffer.from(auth), Buffer.from(expected));
    } catch {
      return false;
    }
  });
}

/** Bank webhook HMAC — SePay Dashboard → Webhooks → HMAC-SHA256 (production). */
export function verifySepayHmacSignature(
  headers: Record<string, string | string[] | undefined>,
  rawBody: string,
  webhookSecret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  const signatureHeader =
    header(headers, "x-sepay-signature") || header(headers, "X-SePay-Signature");
  const timestamp =
    header(headers, "x-sepay-timestamp") || header(headers, "X-SePay-Timestamp");

  if (!signatureHeader || !timestamp || !webhookSecret) return false;

  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  if (Math.abs(nowSeconds - ts) > SEPAY_HMAC_MAX_SKEW_SECONDS) return false;

  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;

  const expected = createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

/** PG IPN — header X-Secret-Key (sandbox Cổng thanh toán). */
export function verifySepayPgIpnSecret(
  headers: Record<string, string | string[] | undefined>,
  ipnSecretKey: string,
): boolean {
  const provided =
    header(headers, "x-secret-key") ||
    header(headers, "X-Secret-Key") ||
    header(headers, "X-SECRET-KEY");
  if (!provided || !ipnSecretKey || provided.length !== ipnSecretKey.length) {
    return false;
  }
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(ipnSecretKey));
  } catch {
    return false;
  }
}
