import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  isAuthSessionActive,
  newSessionJti,
  touchAuthSession,
} from "@/server/auth/sessions";

const COOKIE = "keyon_session";

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

export type SessionUser = {
  id: string;
  email: string;
  role: UserRole;
  name?: string | null;
  /** Raw jti (not hashed) — present for sessions created after AuthSession rollout. */
  jti?: string;
};

export async function createSessionToken(user: SessionUser & { jti: string }): Promise<string> {
  return new SignJWT({
    email: user.email,
    role: user.role,
    name: user.name ?? null,
    jti: user.jti,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setJti(user.jti)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export function mintSessionJti() {
  return newSessionJti();
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.email !== "string" || typeof payload.role !== "string") {
      return null;
    }
    const jti =
      typeof payload.jti === "string"
        ? payload.jti
        : typeof (payload as { jti?: unknown }).jti === "string"
          ? String((payload as { jti: string }).jti)
          : undefined;

    // Legacy JWTs without jti still work until re-login
    if (jti) {
      const active = await isAuthSessionActive(jti);
      if (!active) return null;
      // Fire-and-forget lastSeen (ignore errors)
      void touchAuthSession(jti);
    }

    const account = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { disabledAt: true, role: true, email: true, name: true },
    });
    if (!account || account.disabledAt) return null;

    return {
      id: payload.sub,
      email: account.email,
      role: account.role,
      name: account.name,
      jti,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export function isStaff(role: UserRole) {
  return role === "ADMIN" || role === "FULFILLMENT" || role === "CS";
}
