import { NextResponse } from "next/server";
import { z } from "zod";
import { retryInstantWaitingStock } from "@/server/fulfillment";
import { toErrorResponse } from "@/lib/errors";
import { rateLimit } from "@/lib/rate-limit";
import { requireStaffSession } from "@/server/auth/require-staff";

const schema = z.object({
  jobId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await requireStaffSession({ capability: "fulfillment" });
    const rl = await rateLimit(`fulfill-retry-instant:${session.id}`, 40);
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
