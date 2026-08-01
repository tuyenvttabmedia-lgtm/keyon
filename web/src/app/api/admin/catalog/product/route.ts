import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import {
  formatIssues,
  validateCatalogPublish,
} from "@/storefront/lib/catalog-validation";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const schema = z.object({
  brandId: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  shortDescription: z.string().nullable().optional(),
  categoryKey: z.enum(PRODUCT_CATEGORY_KEYS).nullable().optional(),
  badgeLabel: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  faqs: z
    .array(z.object({ id: z.string(), question: z.string(), answer: z.string() }))
    .optional(),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImageUrl: z.string().nullable().optional(),
  relatedProductIds: z.array(z.string().min(1)).max(8).optional(),
  variantName: z.string().min(1),
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
  /** false = nháp; true = xuất bản cửa hàng */
  active: z.boolean().optional(),
  lowStockThreshold: z.number().int().nonnegative().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") {
      throw new AppError("CS không được tạo catalog", 403);
    }
    const body = schema.parse(await req.json());
    const publishing = body.active === true;

    const issues = validateCatalogPublish({
      name: body.name,
      sku: body.sku,
      priceVnd: body.priceVnd,
      compareAtPriceVnd: body.compareAtPriceVnd ?? null,
      costVnd: body.costVnd ?? 0,
      fulfillmentStrategy: body.fulfillmentStrategy,
      deliverableType: body.deliverableType,
      supplierId: body.supplierId,
      categoryKey: body.categoryKey,
      galleryUrls: body.galleryUrls ?? [],
      publishing,
    });
    if (issues.length) throw new AppError(formatIssues(issues), 400);

    const brand = await prisma.brand.findUnique({ where: { id: body.brandId } });
    if (!brand) throw new AppError("Brand not found", 404);

    let slug = body.slug?.trim() || slugify(body.name);
    if (!slug) slug = `product-${Date.now()}`;
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) throw new AppError("Slug đã tồn tại — chọn slug khác", 409);

    const skuTaken = await prisma.productVariant.findUnique({ where: { sku: body.sku } });
    if (skuTaken) throw new AppError("SKU đã tồn tại", 409);

    if (body.supplierId) {
      const supplier = await prisma.supplier.findUnique({ where: { id: body.supplierId } });
      if (!supplier) throw new AppError("Supplier not found", 404);
    }

    const created = await prisma.product.create({
      data: {
        brandId: body.brandId,
        name: body.name,
        slug,
        description: body.description ?? null,
        shortDescription: body.shortDescription ?? null,
        categoryKey: body.categoryKey ?? null,
        badgeLabel: body.badgeLabel ?? null,
        galleryUrls: body.galleryUrls ?? [],
        features: body.features ?? [],
        specs: body.specs ?? [],
        faqs: body.faqs ?? [],
        seoTitle: body.seoTitle ?? null,
        seoDescription: body.seoDescription ?? null,
        ogImageUrl: body.ogImageUrl ?? null,
        relatedProductIds: body.relatedProductIds ?? [],
        active: publishing,
        variants: {
          create: {
            sku: body.sku.trim(),
            name: body.variantName,
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
            active: true,
          },
        },
      },
      include: { variants: true, brand: true },
    });

    const variantId = created.variants[0]?.id;
    await audit("catalog.product_create", "Product", created.id, session.id, {
      slug,
      variantId,
    });

    return NextResponse.json({ ok: true, product: created, variantId });
  } catch (e) {
    return toErrorResponse(e, "catalog.product");
  }
}
