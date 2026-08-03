import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { staffCanSeeAdminPath } from "@/lib/staff-access";

/**
 * Resolve public origin behind nginx/Cloudflare.
 * Next behind `next start -H 127.0.0.1` often has req.url host=localhost —
 * absolute redirects must NOT use that host.
 */
function publicOrigin(req: NextRequest): string {
  const envBase = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  const forwardedHost = req.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const hostHeader = req.headers.get("host")?.split(",")[0]?.trim();
  const host = forwardedHost || hostHeader || "";
  const protoHeader = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = protoHeader === "http" || protoHeader === "https" ? protoHeader : "https";

  const hostIsLoopback =
    !host ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  if (hostIsLoopback) {
    return envBase || "https://keyon.vn";
  }
  return `${proto}://${host}`;
}

function redirectPublic(req: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, publicOrigin(req)));
}

/**
 * Server-side Admin path gate (complements client AdminPathGuard).
 * Role from JWT only — APIs still enforce capabilities + DB session.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("keyon_session")?.value;
  if (!token) {
    return redirectPublic(req, "/login");
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    // Layout + APIs still enforce; avoid locking all staff out if Edge env incomplete.
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    const role = payload.role;
    if (typeof role !== "string") {
      return redirectPublic(req, "/login");
    }
    if (!staffCanSeeAdminPath(role as UserRole, pathname)) {
      return redirectPublic(req, "/admin");
    }
  } catch {
    return redirectPublic(req, "/login");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
