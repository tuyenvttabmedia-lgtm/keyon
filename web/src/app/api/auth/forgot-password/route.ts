import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendMail } from "@/server/mail";
import { emailPasswordReset } from "@/server/mail/templates";
import { childLogger } from "@/lib/logger";

const log = childLogger("auth.forgot-password");

const bodySchema = z.object({
  email: z.string().email(),
});

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

function appBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    });

    // Always same message — no email enumeration
    const response: { ok: true; resetUrl?: string } = { ok: true };

    if (user) {
      const token = await new SignJWT({ purpose: "password_reset" })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(user.id)
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(secret());

      const resetPath = `/reset-password?token=${encodeURIComponent(token)}`;
      const resetUrl = `${appBaseUrl()}${resetPath}`;

      try {
        const tpl = emailPasswordReset({ resetUrl });
        await sendMail({
          to: user.email,
          subject: tpl.subject,
          text: tpl.text,
          html: tpl.html,
        });
      } catch (e) {
        log.error(
          { err: e instanceof Error ? e.message : e, userId: user.id },
          "forgot-password mail failed",
        );
        // Dev fallback: still return link so local ops can reset without SMTP
        if (process.env.NODE_ENV !== "production") {
          response.resetUrl = resetPath;
        } else {
          return NextResponse.json(
            { error: "Không gửi được email. Thử lại sau hoặc liên hệ hỗ trợ." },
            { status: 503 },
          );
        }
      }

      if (process.env.NODE_ENV !== "production") {
        response.resetUrl = resetPath;
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
