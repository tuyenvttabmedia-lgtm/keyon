import { NextResponse } from "next/server";
import { z } from "zod";
import { consumeEmailVerifyToken } from "@/server/auth/email-verify";
import {
  createSessionToken,
  mintSessionJti,
  readSession,
  setSessionCookie,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientIp, createAuthSession } from "@/server/auth/sessions";

export async function POST(req: Request) {
  try {
    const body = z.object({ token: z.string().min(10) }).parse(await req.json());
    const result = await consumeEmailVerifyToken(body.token);

    const user = await prisma.user.findUnique({ where: { id: result.userId } });
    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Refresh session cookie if logged in as same user
    const session = await readSession();
    if (session?.id === user.id) {
      const jti = mintSessionJti();
      await createAuthSession({
        userId: user.id,
        jti,
        userAgent: req.headers.get("user-agent"),
        ip: clientIp(req),
      });
      const token = await createSessionToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        jti,
      });
      await setSessionCookie(token);
    }

    return NextResponse.json({ ok: true, email: user.email });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Token không hợp lệ" },
      { status: 400 },
    );
  }
}
