import { NextResponse } from "next/server";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export const dynamic = "force-dynamic";

/** GET /api/inventory — Inventory Read Model list (ADMIN / FULFILLMENT) */
export async function GET() {
  try {
    await requireStaffSession({ capability: "fulfillment", method: "GET" });
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
