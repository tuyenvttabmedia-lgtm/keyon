import { NextResponse } from "next/server";
import { z } from "zod";
import { isStaff, readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { audit } from "@/lib/audit";
import { toErrorResponse, AppError } from "@/lib/errors";
import { parseStringList } from "@/storefront/lib/product-cms";

const schema = z.object({
  variantId: z.string().min(1).optional(),
  productId: z.string().min(1).optional(),
});

function uniqueSlug(base: string): string {
  const stamp = Date.now().toString(36).slice(-5);
  const cleaned = base.replace(/-copy(-\w+)?$/i, "").slice(0, 70);
  return `${cleaned}-copy-${stamp}`;
}

function uniqueSku(sku: string, idx: number): string {
  const stamp = Date.now().toString(36).slice(-4);
  const base = sku.replace(/-C\w+$/i, "").slice(0, 50);
  return `${base}-C${stamp}${idx > 0 ? idx : ""}`;
}

export async function POST(req: Request) {
  try {
    const session = await readSession();
    if (!session || !isStaff(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role === "CS") {
      throw new AppError("CS không được clone catalog", 403);
    }
    const body = schema.parse(await req.json());
    if (!body.variantId && !body.productId) {
      throw new AppError("Cần variantId hoặc productId", 400);
    }

    const source = body.productId
      ? await prisma.product.findUnique({
          where: { id: body.productId },
          include: { variants: { orderBy: { createdAt: "asc" } } },
        })
      : (
          await prisma.productVariant.findUnique({
            where: { id: body.variantId! },
            include: {
              product: { include: { variants: { orderBy: { createdAt: "asc" } } } },
            },
          })
        )?.product;

    if (!source) throw new AppError("Product not found", 404);

    const slug = uniqueSlug(source.slug);
    const exists = await prisma.product.findUnique({ where: { slug } });
    if (exists) throw new AppError("Slug clone trùng — thử lại", 409);

    const created = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          brandId: source.brandId,
          name: `${source.name} (bản sao)`,
          slug,
          description: source.description,
          shortDescription: source.shortDescription,
          categoryKey: source.categoryKey,
          badgeLabel: source.badgeLabel,
          galleryUrls: source.galleryUrls ?? [],
          features: source.features ?? [],
          specs: source.specs ?? [],
          faqs: source.faqs ?? [],
          seoTitle: source.seoTitle,
          seoDescription: source.seoDescription,
          ogImageUrl: source.ogImageUrl,
          relatedProductIds: parseStringList(source.relatedProductIds),
          active: false,
        },
      });

      const variants = [];
      for (let i = 0; i < source.variants.length; i++) {
        const v = source.variants[i]!;
        let sku = uniqueSku(v.sku, i);
        let attempt = 0;
        while (await tx.productVariant.findUnique({ where: { sku } })) {
          attempt += 1;
          sku = uniqueSku(v.sku, i + attempt * 10);
          if (attempt > 5) throw new AppError("Không tạo được SKU unique", 409);
        }
        const createdV = await tx.productVariant.create({
          data: {
            productId: product.id,
            sku,
            name: v.name,
            licenseModel: v.licenseModel,
            fulfillmentStrategy: v.fulfillmentStrategy,
            deliverableType: v.deliverableType,
            salesMotion: v.salesMotion,
            slaPromise: v.slaPromise,
            supplierId: v.supplierId,
            upstreamProductRef: v.upstreamProductRef,
            priceVnd: v.priceVnd,
            compareAtPriceVnd: v.compareAtPriceVnd,
            costVnd: v.costVnd,
            lowStockThreshold: v.lowStockThreshold,
            active: v.active,
          },
        });
        variants.push(createdV);
      }

      return { product, variants };
    });

    const firstVariantId = created.variants[0]?.id;
    if (!firstVariantId) throw new AppError("Clone không có variant", 500);

    await audit("catalog.product_clone", "Product", created.product.id, session.id, {
      sourceProductId: source.id,
      variantId: firstVariantId,
    });

    return NextResponse.json({
      ok: true,
      productId: created.product.id,
      variantId: firstVariantId,
      slug: created.product.slug,
    });
  } catch (e) {
    return toErrorResponse(e, "catalog.product.clone");
  }
}
