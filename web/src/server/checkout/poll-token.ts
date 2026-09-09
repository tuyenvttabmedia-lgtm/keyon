import { createHmac, timingSafeEqual } from "crypto";

function hmacSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return s;
}

/** Short-lived HMAC token so payment-status poll is not open by UUID alone. */
export function mintCheckoutPollToken(
  orderId: string,
  ttlSec = 60 * 60,
): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = `${orderId}.${exp}`;
  const sig = createHmac("sha256", hmacSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyCheckoutPollToken(
  token: string | null | undefined,
  orderId: string,
): boolean {
  if (!token || !orderId) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [oid, expStr, sig] = parts;
  if (oid !== orderId) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const payload = `${oid}.${expStr}`;
  const expected = createHmac("sha256", hmacSecret())
    .update(payload)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
