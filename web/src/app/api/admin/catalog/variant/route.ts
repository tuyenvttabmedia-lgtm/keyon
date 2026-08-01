import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma, SalesMotion } from "@prisma/client";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import {
  formatIssues,
  validateCatalogPublish,
} from "@/storefront/lib/catalog-validation";

const patchSchema = z.object({
  variantId: z.string().min(1),
  active: z.boolean().optional(),
  priceVnd: z.number().int().positive().optional(),
  costVnd: z.number().int().nonnegative().optional(),
  compareAtPriceVnd: z.number().int().positive().nullable().optional(),
  name: z.string().min(1).optional(),
  slaPromise: z.string().nullable().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  salesMotion: z.enum(["SELF_SERVE", "QUOTE_REQUIRED"]).optional(),
  /** Product fields */
  productName: z.string().min(1).optional(),
  productDescription: z.string().nullable().optional(),
  productShortDescription: z.string().nullable().optional(),
  productActive: z.boolean().optional(),
  categoryKey: z.enum(PRODUCT_CATEGORY_KEYS).nullable().optional(),
  badgeLabel: z.string().nullable().optional(),
  galleryUrls: z.array(z.string().min(1)).optional(),
  features: z.array(z.string().min(1)).optional(),
  specs: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .optional(),
  faqs: z
    .array(
      z.object({
        id: z.string().min(1),
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImageUrl: z.string().nullable().optional(),
  relatedProductIds: z.array(z.string().min(1)).max(8).optional(),
});

const createSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  sku: z.string().min(1),
  priceVnd: z.number().int().positive(),
  compareAtPriceVnd: z.number().int().positive().nullable().optional(),
  costVnd: z.number().int().nonnegative().optional(),
  licenseModel: z.enum(["PERPETUAL", "SUBSCRIPTION", "MAINTENANCE"]).default("PERPETUAL"),
  fulfillmentStrategy: z
    .enum(["MANUAL", "INSTANT", "SEMI_AUTOMATED", "MANAGED_SUBSCRIPTION"])
    .default("MANUAL"),
  deliverableType: z
    .enum(["KEY", "ACCOUNT", "SUBSCRIPTION", "DIGITAL_FILE", "EXTERNAL_PORTAL"])
    .default("KEY"),
  salesMotion: z.enum(["SELF_SERVE", "QUOTE_REQUIRED"]).default("SELF_SERVE"),
  slaPromise: z.string().nullable().optional(),
  supplierId: z.string().nullable().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") {
      throw new AppError("CS không được tạo variant", 403);
    }
    const body = createSchema.parse(await req.json());

    const product = await prisma.product.findUnique({ where: { id: body.productId } });
    if (!product) throw new AppError("Product not found", 404);

    const issues = validateCatalogPublish({
      name: product.name,
      sku: body.sku,
      priceVnd: body.priceVnd,
      compareAtPriceVnd: body.compareAtPriceVnd ?? null,
      costVnd: body.costVnd ?? 0,
      fulfillmentStrategy: body.fulfillmentStrategy,
      deliverableType: body.deliverableType,
      supplierId: body.supplierId,
      publishing: false,
    });
    if (issues.length) throw new AppError(formatIssues(issues), 400);

    const skuTaken = await prisma.productVariant.findUnique({ where: { sku: body.sku } });
    if (skuTaken) throw new AppError("SKU đã tồn tại", 409);

    if (body.supplierId) {
      const supplier = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
      if (!supplier) throw new AppError("Supplier not found", 404);
    }

    const created = await prisma.productVariant.create({
      data: {
        productId: body.productId,
        sku: body.sku.trim(),
        name: body.name.trim(),
        licenseModel: body.licenseModel,
        fulfillmentStrategy: body.fulfillmentStrategy,
        deliverableType: body.deliverableType,
        salesMotion: body.salesMotion,
        slaPromise: body.slaPromise ?? null,
        supplierId: body.supplierId || null,
        priceVnd: body.priceVnd,
        compareAtPriceVnd: body.compareAtPriceVnd ?? null,
        costVnd: body.costVnd ?? 0,
        lowStockThreshold: body.lowStockThreshold ?? 10,
        active: body.active ?? true,
      },
      include: { product: { include: { brand: true } }, supplier: true },
    });

    await audit("catalog.variant_create", "ProductVariant", created.id, session.id, {
      productId: body.productId,
      sku: body.sku,
    });

    return NextResponse.json({ ok: true, variant: created, variantId: created.id });
  } catch (e) {
    return toErrorResponse(e, "catalog.variant.create");
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") {
      throw new AppError("CS không được sửa catalog", 403);
    }
    const body = patchSchema.parse(await req.json());

    const variant = await prisma.productVariant.findUnique({
      where: { id: body.variantId },
      include: { product: true },
    });
    if (!variant) throw new AppError("Variant not found", 404);

    const nextPrice = body.priceVnd ?? variant.priceVnd;
    const nextCompare =
      body.compareAtPriceVnd !== undefined
        ? body.compareAtPriceVnd
        : variant.compareAtPriceVnd;
    const nextCost = body.costVnd ?? variant.costVnd;
    const nextProductActive =
      typeof body.productActive === "boolean" ? body.productActive : variant.product.active;
    const nextCategory =
      body.categoryKey !== undefined ? body.categoryKey : variant.product.categoryKey;
    const nextGallery =
      body.galleryUrls !== undefined
        ? body.galleryUrls
        : (variant.product.galleryUrls as string[] | null);

    const issues = validateCatalogPublish({
      name: body.productName ?? variant.product.name,
      sku: variant.sku,
      priceVnd: nextPrice,
      compareAtPriceVnd: nextCompare,
      costVnd: nextCost,
      fulfillmentStrategy: variant.fulfillmentStrategy,
      deliverableType: variant.deliverableType,
      supplierId: variant.supplierId,
      categoryKey: nextCategory,
      galleryUrls: Array.isArray(nextGallery) ? nextGallery : [],
      publishing: nextProductActive === true,
    });
    if (issues.length) throw new AppError(formatIssues(issues), 400);

    const variantData: {
      active?: boolean;
      priceVnd?: number;
      costVnd?: number;
      compareAtPriceVnd?: number | null;
      name?: string;
      slaPromise?: string | null;
      lowStockThreshold?: number;
      salesMotion?: SalesMotion;
    } = {};
    if (typeof body.active === "boolean") variantData.active = body.active;
    if (typeof body.priceVnd === "number") variantData.priceVnd = body.priceVnd;
    if (typeof body.costVnd === "number") variantData.costVnd = body.costVnd;
    if (body.compareAtPriceVnd !== undefined) {
      variantData.compareAtPriceVnd = body.compareAtPriceVnd;
    }
    if (body.name) variantData.name = body.name;
    if (body.slaPromise !== undefined) variantData.slaPromise = body.slaPromise;
    if (typeof body.lowStockThreshold === "number") {
      variantData.lowStockThreshold = body.lowStockThreshold;
    }
    if (body.salesMotion) variantData.salesMotion = body.salesMotion;

    const productPatch: Prisma.ProductUpdateInput = {};
    if (body.productName) productPatch.name = body.productName;
    if (body.productDescription !== undefined) {
      productPatch.description = body.productDescription;
    }
    if (body.productShortDescription !== undefined) {
      productPatch.shortDescription = body.productShortDescription;
    }
    if (typeof body.productActive === "boolean") {
      productPatch.active = body.productActive;
    }
    if (body.categoryKey !== undefined) productPatch.categoryKey = body.categoryKey;
    if (body.badgeLabel !== undefined) productPatch.badgeLabel = body.badgeLabel;
    if (body.galleryUrls !== undefined) productPatch.galleryUrls = body.galleryUrls;
    if (body.features !== undefined) productPatch.features = body.features;
    if (body.specs !== undefined) productPatch.specs = body.specs;
    if (body.faqs !== undefined) productPatch.faqs = body.faqs;
    if (body.seoTitle !== undefined) productPatch.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) {
      productPatch.seoDescription = body.seoDescription;
    }
    if (body.ogImageUrl !== undefined) productPatch.ogImageUrl = body.ogImageUrl;
    if (body.relatedProductIds !== undefined) {
      productPatch.relatedProductIds = body.relatedProductIds;
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (Object.keys(productPatch).length > 0) {
        await tx.product.update({
          where: { id: variant.productId },
          data: productPatch,
        });
      }
      return tx.productVariant.update({
        where: { id: body.variantId },
        data: variantData,
        include: { product: { include: { brand: true } }, supplier: true },
      });
    });

    await audit("catalog.variant_update", "ProductVariant", updated.id, session.id, body);
    return NextResponse.json({ ok: true, variant: updated });
  } catch (e) {
    return toErrorResponse(e, "catalog.variant");
  }
}
