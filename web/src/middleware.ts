import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { UserRole } from "@prisma/client";
import { staffCanSeeAdminPath } from "@/lib/staff-access";

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
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    const role = payload.role;
    if (typeof role !== "string") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (!staffCanSeeAdminPath(role as UserRole, pathname)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
