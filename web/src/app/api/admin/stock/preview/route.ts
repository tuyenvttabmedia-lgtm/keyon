import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { decryptPayload } from "@/lib/crypto";
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

async function existingKeysForVariant(variantId: string): Promise<Set<string>> {
  const items = await prisma.licenseItem.findMany({
    where: { variantId },
    select: { payloadEnc: true },
  });
  const set = new Set<string>();
  for (const item of items) {
    try {
      set.add(decryptPayload(item.payloadEnc).trim().toLowerCase());
    } catch {
      // skip corrupt rows
    }
  }
  return set;
}

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") throw new AppError("CS không xem preview kho", 403);

    const body = schema.parse(await req.json());
    const variant = await prisma.productVariant.findUnique({
      where: { id: body.variantId },
    });
    if (!variant) throw new AppError("Variant not found", 404);
    if (variant.fulfillmentStrategy !== "INSTANT") {
      throw new AppError("Chỉ nhập kho cho Instant", 400);
    }

    const parsed = parseStockKeysText(body.keysText);
    const existing = await existingKeysForVariant(variant.id);
    const lines = applyDbDuplicates(parsed, existing);
    const counts = countPreview(lines);

    return NextResponse.json({ lines, counts, sku: variant.sku });
  } catch (e) {
    return toErrorResponse(e, "stock.preview");
  }
}
