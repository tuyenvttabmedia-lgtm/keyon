import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { completeManualDelivery } from "@/server/fulfillment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { assertStaffCapability } from "@/lib/staff-access";

const schema = z.object({
  jobId: z.string().min(1),
  plainPayload: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "fulfillment",
      "Không có quyền hoàn tất giao hàng thủ công",
    );
    const rl = rateLimit(`fulfill-complete:${session.id}`, 60);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = schema.parse(await req.json());
    await completeManualDelivery({
      jobId: body.jobId,
      plainPayload: body.plainPayload,
      actorId: session.id,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return toErrorResponse(e, "fulfillment.complete");
  }
}
