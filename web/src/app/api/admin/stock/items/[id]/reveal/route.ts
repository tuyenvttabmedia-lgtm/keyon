import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { decryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";
import { prisma } from "@/lib/db";
import { requireStaffSession } from "@/server/auth/require-staff";

/** Staff reveal — additive admin route; does not change Pool API. */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "stock_mutate" });
    const rl = await rateLimit(`stock-reveal:${session.id}`, 30);
    if (!rl.ok) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

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
