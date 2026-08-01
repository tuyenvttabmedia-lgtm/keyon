import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

function getKey(): Buffer {
  const raw = process.env.DELIVERY_ENCRYPTION_KEY;
  if (!raw || raw.length < 32) {
    throw new Error("DELIVERY_ENCRYPTION_KEY must be at least 32 characters");
  }
  return scryptSync(raw, "keyon-delivery", 32);
}

/** Encrypt sensitive deliverable payload (key/password/JSON). */
export function encryptPayload(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decryptPayload(payloadEnc: string): string {
  const buf = Buffer.from(payloadEnc, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", getKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function maskHint(value: string, visible = 4): string {
  if (value.length <= visible) return "*".repeat(value.length);
  return `${value.slice(0, visible)}${"*".repeat(Math.min(8, value.length - visible))}`;
}
