import { NextResponse } from "next/server";
import { collectMonitoringSnapshot } from "@/server/monitoring";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export const dynamic = "force-dynamic";

/** GET /api/monitoring/metrics — staff with monitoring + 2FA */
export async function GET() {
  try {
    await requireStaffSession({ capability: "monitoring", method: "GET" });
    const snapshot = await collectMonitoringSnapshot();
    return NextResponse.json(snapshot);
  } catch (e) {
    return toErrorResponse(e, "monitoring.metrics");
  }
}
