import { createHash, randomUUID } from "crypto";

/** Public-facing IDs: never expose sequential integers. */
export function newPublicId(prefix?: string): string {
  const id = randomUUID();
  return prefix ? `${prefix}_${id}` : id;
}

export function hashForLog(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}
