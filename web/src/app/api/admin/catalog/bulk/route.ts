import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { assertStaffCapability } from "@/lib/staff-access";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";

const schema = z.object({
  variantIds: z.array(z.string().min(1)).min(1).max(100),
  action: z.enum([
    "variant_on",
    "variant_off",
    "product_publish",
    "product_draft",
    "set_price",
    "adjust_price_percent",
    "adjust_price_amount",
    "set_cost",
  ]),
  /** Absolute price / cost (VND) for set_* */
  value: z.number().int().optional(),
  /** Percent e.g. 10 = +10%, -5 = -5% */
  percent: z.number().optional(),
  /** Absolute delta VND for adjust_price_amount */
  amount: z.number().int().optional(),
});

function clampPrice(n: number): number {
  return Math.max(1000, Math.round(n));
}

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    assertStaffCapability(
      session.role,
      "catalog_mutate",
      "Không có quyền bulk catalog",
    );
    const body = schema.parse(await req.json());

    const variants = await prisma.productVariant.findMany({
      where: { id: { in: body.variantIds } },
      select: { id: true, productId: true, priceVnd: true, costVnd: true },
    });
    if (!variants.length) throw new AppError("Không tìm thấy variant", 404);

    const ids = variants.map((v) => v.id);
    const productIds = [...new Set(variants.map((v) => v.productId))];

    if (body.action === "variant_on" || body.action === "variant_off") {
      await prisma.productVariant.updateMany({
        where: { id: { in: ids } },
        data: { active: body.action === "variant_on" },
      });
    } else if (body.action === "product_publish" || body.action === "product_draft") {
      await prisma.product.updateMany({
        where: { id: { in: productIds } },
        data: { active: body.action === "product_publish" },
      });
    } else if (body.action === "set_price") {
      if (body.value == null || body.value <= 0) {
        throw new AppError("Giá set_price phải > 0", 400);
      }
      await prisma.productVariant.updateMany({
        where: { id: { in: ids } },
        data: { priceVnd: body.value },
      });
    } else if (body.action === "set_cost") {
      if (body.value == null || body.value < 0) {
        throw new AppError("Giá vốn không âm", 400);
      }
      await prisma.productVariant.updateMany({
        where: { id: { in: ids } },
        data: { costVnd: body.value },
      });
    } else if (body.action === "adjust_price_percent") {
      if (body.percent == null || !Number.isFinite(body.percent)) {
        throw new AppError("Thiếu percent", 400);
      }
      await prisma.$transaction(
        variants.map((v) =>
          prisma.productVariant.update({
            where: { id: v.id },
            data: {
              priceVnd: clampPrice(v.priceVnd * (1 + body.percent! / 100)),
            },
          }),
        ),
      );
    } else if (body.action === "adjust_price_amount") {
      if (body.amount == null || !Number.isFinite(body.amount)) {
        throw new AppError("Thiếu amount", 400);
      }
      await prisma.$transaction(
        variants.map((v) =>
          prisma.productVariant.update({
            where: { id: v.id },
            data: { priceVnd: clampPrice(v.priceVnd + body.amount!) },
          }),
        ),
      );
    }

    await audit("catalog.bulk", "ProductVariant", ids[0]!, session.id, {
      action: body.action,
      count: ids.length,
      productCount: productIds.length,
      value: body.value,
      percent: body.percent,
      amount: body.amount,
    });

    return NextResponse.json({
      ok: true,
      affectedVariants: ids.length,
      affectedProducts: productIds.length,
    });
  } catch (e) {
    return toErrorResponse(e, "catalog.bulk");
  }
}
