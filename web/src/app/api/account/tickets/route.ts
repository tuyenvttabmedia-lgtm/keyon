import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession, isStaff } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";

export async function GET() {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const tickets = await prisma.supportTicket.findMany({
      where: isStaff(session.role) ? undefined : { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: { select: { email: true, name: true } },
      },
    });
    return NextResponse.json({ tickets });
  } catch (e) {
    return toErrorResponse(e);
  }
}

const createSchema = z.object({
  subject: z.string().min(3).max(200),
  body: z.string().min(5).max(5000),
  orderId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rl = rateLimit(`ticket:${session.id}`, 20);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = createSchema.parse(await req.json());
    if (body.orderId) {
      const order = await prisma.order.findFirst({
        where: {
          id: body.orderId,
          OR: [{ userId: session.id }, { email: session.email }],
        },
      });
      if (!order && !isStaff(session.role)) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
    }
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.id,
        subject: body.subject,
        body: body.body,
        orderId: body.orderId,
      },
    });
    return NextResponse.json({ ticket });
  } catch (e) {
    return toErrorResponse(e);
  }
}
