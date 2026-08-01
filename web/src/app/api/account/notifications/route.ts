import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";

export async function GET() {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const notifications = await prisma.userNotification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ notifications });
  } catch (e) {
    return toErrorResponse(e);
  }
}

const markSchema = z.object({
  ids: z.array(z.string()).min(1).optional(),
  all: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = markSchema.parse(await req.json());
    if (body.all) {
      await prisma.userNotification.updateMany({
        where: { userId: session.id, readAt: null },
        data: { readAt: new Date() },
      });
    } else if (body.ids?.length) {
      await prisma.userNotification.updateMany({
        where: { userId: session.id, id: { in: body.ids } },
        data: { readAt: new Date() },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e);
  }
}

/** Admin create / broadcast */
const adminCreateSchema = z.object({
  userId: z.string().optional(),
  email: z.string().email().optional(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(2000),
  href: z.string().optional(),
  broadcast: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = adminCreateSchema.parse(await req.json());
    if (body.broadcast) {
      const users = await prisma.user.findMany({
        where: { role: "CUSTOMER" },
        select: { id: true },
        take: 500,
      });
      await prisma.userNotification.createMany({
        data: users.map((u) => ({
          userId: u.id,
          title: body.title,
          body: body.body,
          href: body.href,
        })),
      });
      return NextResponse.json({ ok: true, count: users.length });
    }
    let userId = body.userId;
    if (!userId && body.email) {
      const u = await prisma.user.findUnique({ where: { email: body.email } });
      if (!u) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      userId = u.id;
    }
    if (!userId) {
      return NextResponse.json({ error: "userId or email required" }, { status: 400 });
    }
    const n = await prisma.userNotification.create({
      data: {
        userId,
        title: body.title,
        body: body.body,
        href: body.href,
      },
    });
    return NextResponse.json({ notification: n });
  } catch (e) {
    return toErrorResponse(e);
  }
}
