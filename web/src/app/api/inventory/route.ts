import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

/** GET /api/inventory — Inventory Read Model list (staff) */
export async function GET() {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const started = Date.now();
    const items = await InventoryReadModel.listInstantSkus();
    const health = InventoryReadModel.health();
    return NextResponse.json({
      items,
      health,
      duration_ms: Date.now() - started,
    });
  } catch (e) {
    return toErrorResponse(e, "inventory.list");
  }
}
