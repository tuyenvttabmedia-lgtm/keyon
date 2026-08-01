import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

/** GET /api/admin/inventory/:sku */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ sku: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
