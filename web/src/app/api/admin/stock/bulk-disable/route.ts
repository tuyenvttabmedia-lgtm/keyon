import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { LicensePoolService } from "@/server/license-pool";
import { AppError, toErrorResponse } from "@/lib/errors";
import { audit } from "@/lib/audit";

const schema = z.object({
  licenseIds: z.array(z.string().min(1)).min(1).max(200),
  reason: z.string().min(1).max(200).default("admin_bulk_disable"),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "stock_mutate",
      "Không có quyền disable license",
    );

    const body = schema.parse(await req.json());
    let disabled = 0;
    const errors: Array<{ id: string; error: string }> = [];

    for (const licenseId of body.licenseIds) {
      try {
        await LicensePoolService.disable({
          licenseId,
          reason: body.reason,
          actorId: session.id,
        });
        disabled += 1;
      } catch (e) {
        errors.push({
          id: licenseId,
          error: e instanceof AppError ? e.message : "Failed",
        });
      }
    }

    await audit("stock.bulk_disable", "LicenseItem", undefined, session.id, {
      requested: body.licenseIds.length,
      disabled,
      failed: errors.length,
      reason: body.reason,
    });

    return NextResponse.json({ ok: true, disabled, failed: errors.length, errors });
  } catch (e) {
    return toErrorResponse(e, "stock.bulk_disable");
  }
}
