import { NextResponse } from "next/server";
import { fireAlert, listAlerts } from "@/server/monitoring/alerts";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export const dynamic = "force-dynamic";

/** POST /api/monitoring/alert-test — M7 */
export async function POST() {
  try {
    const session = await requireStaffSession({ capability: "monitoring" });
    const alert = fireAlert({
      level: "info",
      source: "alert-test",
      message: `KEYON alert test by ${session.email} at ${new Date().toISOString()}`,
    });
    return NextResponse.json({ ok: true, alert, recent: listAlerts(5) });
  } catch (e) {
    return toErrorResponse(e, "monitoring.alert-test");
  }
}
