import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { retryInstantWaitingStock } from "@/server/fulfillment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { assertStaffCapability } from "@/lib/staff-access";

const schema = z.object({
  jobId: z.string().min(1),
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
      "Không có quyền retry Instant",
    );
    const rl = rateLimit(`fulfill-retry-instant:${session.id}`, 40);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const body = schema.parse(await req.json());
    const job = await retryInstantWaitingStock({
      jobId: body.jobId,
      actorId: session.id,
    });
    return NextResponse.json({ ok: true, status: job?.status, notes: job?.notes });
  } catch (e) {
    return toErrorResponse(e, "fulfillment.retry_instant");
  }
}
