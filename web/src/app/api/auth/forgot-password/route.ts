import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { prisma } from "@/lib/db";
import { issuePasswordReset } from "@/server/auth/password-reset";
import { rateLimit } from "@/lib/rate-limit";
import { AppError } from "@/lib/errors";
import { clientIp } from "@/server/auth/sessions";
import { assertTurnstileToken } from "@/server/auth/turnstile";

const bodySchema = z.object({
  email: z.string().email(),
  turnstileToken: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const ip = clientIp(req) ?? "unknown";
    const rl = await rateLimit(`forgot-password:${ip}`, 8, 60 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Quá nhiều yêu cầu. Thử lại sau." },
        { status: 429 },
      );
    }

    const body = bodySchema.parse(await req.json());
    await assertTurnstileToken(body.turnstileToken, ip);
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
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
    }
    if (e instanceof AppError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
