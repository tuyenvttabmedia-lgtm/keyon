import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { resendDelivery } from "@/server/fulfillment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { customerCanAccessOrder } from "@/server/org/customer-order-access";

const schema = z.object({ deliveryId: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const rl = rateLimit(`resend:${session.id}`, 20);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = schema.parse(await req.json());

    const delivery = await prisma.delivery.findUnique({
      where: { id: body.deliveryId },
      select: {
        id: true,
        orderItem: {
          select: {
            order: { select: { id: true, userId: true, email: true } },
          },
        },
      },
    });
    if (!delivery) {
      return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
    }

    const order = delivery.orderItem.order;
    const ownsOrder = await customerCanAccessOrder(
      { id: session.id, email: session.email },
      order,
    );
    if (!ownsOrder && !isStaff(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await resendDelivery({
      deliveryId: body.deliveryId,
      actorId: session.id,
      reason: isStaff(session.role) ? "staff_resend" : "customer_resend",
    });
    return NextResponse.json(result);
  } catch (e) {
    return toErrorResponse(e, "delivery.resend");
  }
}
