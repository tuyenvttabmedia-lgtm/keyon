import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { issuePasswordReset } from "@/server/auth/password-reset";

const bodySchema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
      select: { id: true, email: true, disabledAt: true },
    });

    // Always same ok message — no email enumeration
    const response: { ok: true; resetUrl?: string } = { ok: true };

    if (user && !user.disabledAt) {
      const issued = await issuePasswordReset({
        userId: user.id,
        email: user.email,
      });
      if (issued.resetUrl) response.resetUrl = issued.resetUrl;
      if (!issued.emailSent && !issued.resetUrl && issued.error) {
        return NextResponse.json({ error: issued.error }, { status: 503 });
      }
    }

    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Bad request" },
      { status: 400 },
    );
  }
}
