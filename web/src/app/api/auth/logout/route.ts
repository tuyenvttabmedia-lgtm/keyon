import { NextResponse } from "next/server";
import { clearSessionCookie, readSession } from "@/lib/auth";
import { revokeAuthSessionByJti } from "@/server/auth/sessions";

export async function POST(req: Request) {
  const session = await readSession();
  if (session?.jti) {
    await revokeAuthSessionByJti(session.jti).catch(() => undefined);
  }
  await clearSessionCookie();
  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  return NextResponse.redirect(new URL("/", base), 303);
}
