import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { collectMonitoringSnapshot } from "@/server/monitoring";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

/** GET /api/monitoring/metrics — staff */
export async function GET() {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const snapshot = await collectMonitoringSnapshot();
    return NextResponse.json(snapshot);
  } catch (e) {
    return toErrorResponse(e, "monitoring.metrics");
  }
}
