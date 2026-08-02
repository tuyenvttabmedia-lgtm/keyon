import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { fireAlert, listAlerts } from "@/server/monitoring/alerts";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

/** POST /api/monitoring/alert-test — M7 */
export async function POST() {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "monitoring",
      "Không có quyền test alert",
    );
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
