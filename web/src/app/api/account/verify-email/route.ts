import { NextResponse } from "next/server";
import { z } from "zod";
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

  const body = z
    .object({ email: z.string().email().optional() })
    .parse(await req.json().catch(() => ({})));

  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (user.emailVerifiedAt && !body.email) {
    return NextResponse.json({ ok: true, alreadyVerified: true });
  }

  // Change-email flow: set pending then send to new address
  if (body.email && body.email.toLowerCase() !== user.email.toLowerCase()) {
    const next = body.email.toLowerCase();
    const taken = await prisma.user.findUnique({ where: { email: next } });
    if (taken) {
      return NextResponse.json({ error: "Email đã được sử dụng" }, { status: 409 });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { pendingEmail: next },
    });
    await sendVerifyEmail({
      userId: user.id,
      email: next,
      purpose: "change_email",
    });
    return NextResponse.json({ ok: true, pendingEmail: next });
  }

  await sendVerifyEmail({
    userId: user.id,
    email: user.email,
    purpose: "verify",
  });
  return NextResponse.json({ ok: true });
}
