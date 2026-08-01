import { NextResponse } from "next/server";
import {
  createSessionToken,
  mintSessionJti,
  readSession,
  setSessionCookie,
} from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";
import { profileUpdateSchema } from "@/lib/profile-fields";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp, createAuthSession } from "@/server/auth/sessions";

export async function PATCH(req: Request) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rl = rateLimit(`profile:${session.id}`, 30);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = profileUpdateSchema.parse(await req.json());
    const data: {
      name?: string;
      phone?: string | null;
      address?: string | null;
      dateOfBirth?: Date | null;
    } = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.address !== undefined) data.address = body.address;
    if (body.dateOfBirth !== undefined) data.dateOfBirth = body.dateOfBirth;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Không có dữ liệu cập nhật" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        address: true,
        dateOfBirth: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "profile.update",
        entityType: "User",
        entityId: session.id,
        meta: { fields: Object.keys(data) },
      },
    });

    if (body.name !== undefined) {
      const jti = session.jti ?? mintSessionJti();
      if (!session.jti) {
        await createAuthSession({
          userId: user.id,
          jti,
          userAgent: req.headers.get("user-agent"),
          ip: clientIp(req),
        });
      }
      const token = await createSessionToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        jti,
      });
      await setSessionCookie(token);
    }

    return NextResponse.json({
      ok: true,
      user: {
        name: user.name,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.toISOString().slice(0, 10)
          : null,
      },
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
