import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

const bodySchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET missing");
  return new TextEncoder().encode(s);
}

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const { payload } = await jwtVerify(body.token, secret());
    if (payload.purpose !== "password_reset" || !payload.sub) {
      return NextResponse.json({ error: "Link đặt lại không hợp lệ" }, { status: 400 });
    }
    await prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash: await hashPassword(body.password) },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Link đặt lại hết hạn hoặc không hợp lệ" },
      { status: 400 },
    );
  }
}
