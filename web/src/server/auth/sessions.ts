import { createHash, randomBytes } from "crypto";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";

export function newSessionJti() {
  return randomBytes(24).toString("base64url");
}

export function hashSessionToken(jti: string) {
  return createHash("sha256").update(jti).digest("hex");
}

export function parseDeviceLabel(userAgent: string | null | undefined): string {
  const ua = userAgent ?? "";
  let browser = "Trình duyệt";
  if (/Edg\//i.test(ua)) browser = "Edge";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Chrome";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";

  let os = "Thiết bị";
  if (/Windows/i.test(ua)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  return `${os} · ${browser}`;
}

export function clientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || null;
  return req.headers.get("x-real-ip");
}

export async function createAuthSession(input: {
  userId: string;
  jti: string;
  userAgent?: string | null;
  ip?: string | null;
}) {
  return prisma.authSession.create({
    data: {
      userId: input.userId,
      jti: hashSessionToken(input.jti),
      userAgent: input.userAgent?.slice(0, 500) ?? null,
      ip: input.ip?.slice(0, 64) ?? null,
      deviceLabel: parseDeviceLabel(input.userAgent),
    },
  });
}

export async function touchAuthSession(jti: string) {
  const hash = hashSessionToken(jti);
  await prisma.authSession.updateMany({
    where: { jti: hash, revokedAt: null },
    data: { lastSeenAt: new Date() },
  });
}

export async function revokeAuthSessionByJti(jti: string) {
  const hash = hashSessionToken(jti);
  await prisma.authSession.updateMany({
    where: { jti: hash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAuthSessionById(userId: string, id: string) {
  await prisma.authSession.updateMany({
    where: { id, userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllAuthSessions(userId: string, exceptJti?: string) {
  const exceptHash = exceptJti ? hashSessionToken(exceptJti) : null;
  await prisma.authSession.updateMany({
    where: {
      userId,
      revokedAt: null,
      ...(exceptHash ? { NOT: { jti: exceptHash } } : {}),
    },
    data: { revokedAt: new Date() },
  });
}

export async function isAuthSessionActive(jti: string): Promise<boolean> {
  const row = await prisma.authSession.findUnique({
    where: { jti: hashSessionToken(jti) },
  });
  if (!row || row.revokedAt) return false;
  return true;
}

/** Roles that must enable TOTP (map KEYON roles → policy). */
export function roleRequiresTotp(role: UserRole): boolean {
  return role === "ADMIN" || role === "FULFILLMENT" || role === "CS";
}
