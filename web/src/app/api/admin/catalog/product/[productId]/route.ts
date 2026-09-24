import { requireStaffSession } from "@/server/auth/require-staff";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { assertAdminRole } from "@/lib/staff-access";
import { parseStringList } from "@/storefront/lib/product-cms";

/**
 * Permanent product delete (demo / unused catalog cleanup).
 * Blocked when any OrderItem or RESERVED/CONSUMED LicenseItem exists.
 * AVAILABLE/DISABLED pool keys under the product are removed with the product.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  try {
    const session = await requireStaffSession({ capability: "catalog_mutate" });
    assertAdminRole(session.role, "Chỉ ADMIN được xóa vĩnh viễn sản phẩm");
    const { productId } = await params;
    z.string().min(1).parse(productId);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        name: true,
        slug: true,
        variants: { select: { id: true, sku: true } },
      },
    });
    if (!product) throw new AppError("Không tìm thấy sản phẩm", 404);

    const variantIds = product.variants.map((v) => v.id);
    if (!variantIds.length) {
      await prisma.product.delete({ where: { id: productId } });
      await audit("catalog.product_delete", "Product", productId, session.id, {
        name: product.name,
        slug: product.slug,
        variants: 0,
      });
      return NextResponse.json({ ok: true, deletedProductId: productId });
    }

    const [orderItemCount, blockedLicenseCount, poolKeyCount] =
      await Promise.all([
        prisma.orderItem.count({ where: { variantId: { in: variantIds } } }),
        prisma.licenseItem.count({
          where: {
            variantId: { in: variantIds },
            status: { in: ["RESERVED", "CONSUMED"] },
          },
        }),
        prisma.licenseItem.count({
          where: {
            variantId: { in: variantIds },
            status: { in: ["AVAILABLE", "DISABLED"] },
          },
        }),
      ]);

    if (orderItemCount > 0) {
      throw new AppError(
        `Không xóa được: đã có ${orderItemCount} dòng đơn hàng gắn sản phẩm này. Dùng «Ngừng bán / Lưu trữ» thay vì xóa.`,
        409,
      );
    }
    if (blockedLicenseCount > 0) {
      throw new AppError(
        `Không xóa được: còn ${blockedLicenseCount} key đang RESERVED/CONSUMED. Xử lý đơn/kho trước hoặc dùng «Ngừng bán / Lưu trữ».`,
        409,
      );
    }

    await prisma.$transaction(async (tx) => {
      const licenseIds = (
        await tx.licenseItem.findMany({
          where: { variantId: { in: variantIds } },
          select: { id: true },
        })
      ).map((r) => r.id);

      if (licenseIds.length) {
        await tx.licenseEvent.deleteMany({
          where: { licenseItemId: { in: licenseIds } },
        });
        await tx.licenseItem.deleteMany({
          where: { id: { in: licenseIds } },
        });
      }

      await tx.productVariant.deleteMany({
        where: { productId },
      });

      /** Drop this id from other products' curated related lists. */
      const relatedHolders = await tx.product.findMany({
        where: { id: { not: productId } },
        select: { id: true, relatedProductIds: true },
      });
      for (const row of relatedHolders) {
        const ids = parseStringList(row.relatedProductIds);
        if (!ids.includes(productId)) continue;
        await tx.product.update({
          where: { id: row.id },
          data: {
            relatedProductIds: ids.filter((id) => id !== productId),
          },
        });
      }

      await tx.product.delete({ where: { id: productId } });
    });

    await audit("catalog.product_delete", "Product", productId, session.id, {
      name: product.name,
      slug: product.slug,
      variantCount: variantIds.length,
      skus: product.variants.map((v) => v.sku),
      poolKeysRemoved: poolKeyCount,
    });

    return NextResponse.json({
      ok: true,
      deletedProductId: productId,
      deletedVariants: variantIds.length,
      poolKeysRemoved: poolKeyCount,
    });
  } catch (e) {
    return toErrorResponse(e, "catalog.product_delete");
  }
}
