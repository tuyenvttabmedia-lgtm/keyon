import { NextResponse } from "next/server";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { toErrorResponse } from "@/lib/errors";
import { requireStaffSession } from "@/server/auth/require-staff";

export const dynamic = "force-dynamic";

/** GET /api/admin/inventory/:sku */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ sku: string }> },
) {
  try {
    await requireStaffSession({ capability: "fulfillment", method: "GET" });
    const { sku } = await ctx.params;
    const detail = await InventoryReadModel.getBySku(decodeURIComponent(sku));
    return NextResponse.json({
      ...detail,
      health: InventoryReadModel.health(),
    });
  } catch (e) {
    return toErrorResponse(e, "inventory.sku");
  }
}
