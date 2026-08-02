import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";
import { assertStaffCapability } from "@/lib/staff-access";

/** Staff reveal — additive admin route; does not change Pool API. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "stock_mutate",
      "Không có quyền xem plaintext license",
    );

    const { id } = await params;
    const item = await prisma.licenseItem.findUnique({ where: { id } });
    if (!item) throw new AppError("License not found", 404);

    const plain = decryptPayload(item.payloadEnc);

    await audit("stock.reveal", "LicenseItem", item.id, session.id, {
      variantId: item.variantId,
      status: item.status,
    });

    return NextResponse.json({ plain });
  } catch (e) {
    return toErrorResponse(e);
  }
}
