import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decryptPayload, encryptPayload } from "@/lib/crypto";
import { audit } from "@/lib/audit";
import { AppError, toErrorResponse } from "@/lib/errors";
import {
  applyDbDuplicates,
  countPreview,
  parseStockKeysText,
} from "@/lib/stock-import-preview";

const schema = z.object({
  variantId: z.string().min(1),
  keysText: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") throw new AppError("CS không nhập kho", 403);

    const body = schema.parse(await req.json());
    const variant = await prisma.productVariant.findUnique({
      where: { id: body.variantId },
      include: { product: { select: { name: true } } },
    });
    if (!variant) throw new AppError("Variant not found", 404);
    if (variant.fulfillmentStrategy !== "INSTANT") {
      throw new AppError("Chỉ nhập kho cho Instant", 400);
    }

    const parsed = parseStockKeysText(body.keysText);
    const existingItems = await prisma.licenseItem.findMany({
      where: { variantId: variant.id },
      select: { payloadEnc: true },
    });
    const existing = new Set<string>();
    for (const item of existingItems) {
      try {
        existing.add(decryptPayload(item.payloadEnc).trim().toLowerCase());
      } catch {
        /* skip */
      }
    }
    const lines = applyDbDuplicates(parsed, existing);
    const counts = countPreview(lines);
    const toAdd = lines.filter((l) => l.status === "ok").map((l) => l.raw);

    if (toAdd.length === 0) {
      throw new AppError(
        "Không có key hợp lệ để nhập (toàn bộ invalid / trùng file / trùng DB)",
        400,
      );
    }

    await prisma.licenseItem.createMany({
      data: toAdd.map((k) => ({
        variantId: variant.id,
        payloadEnc: encryptPayload(k),
        status: "AVAILABLE" as const,
      })),
    });

    await audit("stock.add", "ProductVariant", variant.id, session.id, {
      sku: variant.sku,
      productName: variant.product.name,
      added: toAdd.length,
      duplicate_file: counts.duplicate_file,
      duplicate_db: counts.duplicate_db,
      invalid: counts.invalid,
      submitted: counts.total,
    });

    return NextResponse.json({
      ok: true,
      added: toAdd.length,
      duplicate_file: counts.duplicate_file,
      duplicate_db: counts.duplicate_db,
      invalid: counts.invalid,
    });
  } catch (e) {
    return toErrorResponse(e, "stock.add");
  }
}
