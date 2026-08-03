import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendVerifyEmail } from "@/server/auth/email-verify";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`verify-email:${session.id}`, 5);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // Ignore body — email is immutable login identity; only verify current address.
  await req.json().catch(() => ({}));

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (user.emailVerifiedAt) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  if (user.pendingEmail) {
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingEmail: null },
    });
  }

  await sendVerifyEmail({
    userId: user.id,
    email: user.email,
  });
  return NextResponse.json({ ok: true });
}
