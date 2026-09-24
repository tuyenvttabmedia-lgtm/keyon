import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import { PdpView } from "@/storefront/components/pdp/PdpView";
import type { PdpProductData, PdpVariantOption } from "@/storefront/components/pdp/types";
import {
  computeSocialRating,
  computeSocialReviews,
  computeSocialSold,
} from "@/storefront/lib/social-proof";
import {
  PDP_CATEGORY_BADGE,
} from "@/storefront/components/pdp/pdp-utils";
import type { ShopCategoryId, ShopProduct } from "@/storefront/components/shop/types";
import {
  discountPercent,
  inferCategory,
  inferMark,
} from "@/storefront/components/shop/shop-utils";
import {
  parseFaqRows,
  parseSpecRows,
  parseStringList,
  splitSpecsByGroup,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";
import { parseSeoKeywords } from "@/storefront/lib/license-catalog";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import { variantAllowsCheckout, variantShowsQuoteCta } from "@/lib/variant-checkout";
import {
  resolveWithGlobalFallback,
  toNextMetadata,
} from "@/server/seo/metadata";
import { loadSiteSettings } from "@/server/seo/settings";
import { buildProductJsonLd } from "@/server/seo/product-json-ld";
import { absoluteUrl } from "@/server/seo/site-url";
import { isHtmlBody, stripHtml } from "@/server/cms/blog-utils";

/** Strip internal demo prefixes from customer-facing blurb. */
function cleanStorefrontBlurb(raw: string | null | undefined): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  const cleaned = t
    .replace(/^demo\s*ops\s*[·•\-–—:]?\s*/i, "")
    .trim();
  return cleaned || undefined;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      select: {
        name: true,
        active: true,
        seoTitle: true,
        seoDescription: true,
        shortDescription: true,
        description: true,
        ogImageUrl: true,
        ogTitle: true,
        ogDescription: true,
        canonicalUrl: true,
        focusKeyword: true,
        seoKeywords: true,
        galleryUrls: true,
      },
    }),
    loadSiteSettings(),
  ]);
  if (!product || !product.active) {
    return { title: "Sản phẩm" };
  }
  const gallery = parseStringList(product.galleryUrls);
  const keywords = parseSeoKeywords(product.seoKeywords);
  const path = `/products/${slug}`;
  const seo = resolveWithGlobalFallback(settings, {
    path,
    title: product.seoTitle?.trim() || product.name,
    description:
      product.seoDescription?.trim() ||
      product.shortDescription?.trim() ||
      product.description?.trim()?.slice(0, 160) ||
      undefined,
    ogImageUrl: product.ogImageUrl || gallery[0] || null,
  });
  const meta = toNextMetadata(seo);
  const ogTitle =
    product.ogTitle?.trim() || seo.title;
  const ogDescription =
    product.ogDescription?.trim() || seo.description;
  const canonical =
    product.canonicalUrl?.trim() || seo.canonical;

  return {
    ...meta,
    alternates: { canonical },
    keywords: [
      ...(product.focusKeyword?.trim()
        ? [product.focusKeyword.trim()]
        : []),
      ...keywords,
    ].filter(Boolean),
    openGraph: {
      ...meta.openGraph,
      title: ogTitle,
      description: ogDescription,
      url: canonical,
    },
    twitter: {
      ...meta.twitter,
      title: ogTitle,
      description: ogDescription,
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ variant?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      variants: { where: { active: true }, orderBy: { priceVnd: "asc" } },
    },
  });
  if (!product || !product.active) notFound();

  const variantsRaw = product.variants;
  if (!variantsRaw.length) notFound();

  const initial =
    variantsRaw.find((v) => v.id === sp.variant) ?? variantsRaw[0]!;

  const session = await readSession();
  const inferredCat = inferCategory(product.brand.name, product.name);
  const categoryId: ShopCategoryId =
    product.categoryKey &&
    (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(product.categoryKey)
      ? (product.categoryKey as ShopCategoryId)
      : inferredCat;
  const mark = inferMark(categoryId, product.name);
  const categoryLabel =
    product.badgeLabel?.trim() || PDP_CATEGORY_BADGE[categoryId];

  const cmsGallery = parseStringList(product.galleryUrls);
  const cmsFeatures = parseStringList(product.features);
  const cmsSpecsAll = parseSpecRows(product.specs);
  const { general: cmsSpecs, system: cmsSystemSpecs } =
    splitSpecsByGroup(cmsSpecsAll);
  const cmsFaqs = parseFaqRows(product.faqs);
  const cmsUsageGuideHtml = product.usageGuideHtml?.trim() ?? "";

  const variants: PdpVariantOption[] = variantsRaw.map((v) => {
    const receive = receiveFromDeliverable(v.deliverableType);
    const compareAtPriceVnd =
      v.compareAtPriceVnd && v.compareAtPriceVnd > v.priceVnd
        ? v.compareAtPriceVnd
        : undefined;
    const canBuy = variantAllowsCheckout(v);
    return {
      id: v.id,
      name: v.name,
      priceVnd: v.priceVnd,
      compareAtPriceVnd,
      discountPercent: discountPercent(v.priceVnd, compareAtPriceVnd),
      deliveryLabel: deliveryPromiseLabel(v.fulfillmentStrategy),
      receiveLabel: receive.label,
      receiveKind: receive.kind,
      slaPromise: v.slaPromise,
      canBuy,
      fulfillmentInstant: v.fulfillmentStrategy === "INSTANT",
      quoteRequired: variantShowsQuoteCta(v),
      licenseChannel: v.licenseChannel,
      licenseTerm: v.licenseTerm,
      seatsLabel: v.seatsLabel,
      regionCode: v.regionCode,
      activationMethod: v.activationMethod,
    };
  });

  const activeVariant = variants.find((v) => v.id === initial.id) ?? variants[0]!;
  const receive = receiveFromDeliverable(
    variantsRaw.find((v) => v.id === activeVariant.id)!.deliverableType,
  );

  const soldCount = computeSocialSold(product.slug);
  const reviewCount =
    soldCount != null
      ? computeSocialReviews(product.slug, soldCount)
      : null;
  const rating = computeSocialRating(product.slug);

  const curatedIds = parseStringList(product.relatedProductIds).slice(0, 8);
  let related: ShopProduct[] = [];

  if (curatedIds.length) {
    const curatedDb = await prisma.product.findMany({
      where: {
        id: { in: curatedIds },
        active: true,
        NOT: { id: product.id },
      },
      include: {
        brand: true,
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          take: 1,
        },
      },
    });
    const byId = new Map(curatedDb.map((p) => [p.id, p]));
    const ordered = curatedIds
      .map((id) => byId.get(id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    related = mapProductsToShopCards(ordered).slice(0, 4);
  }

  if (related.length < 4) {
    const excludeIds = [product.id, ...related.map((x) => x.id)];
    const relatedDb = await prisma.product.findMany({
      where: {
        active: true,
        id: { notIn: excludeIds },
        OR: [
          { brandId: product.brandId },
          ...(product.categoryKey
            ? [{ categoryKey: product.categoryKey }]
            : [{ name: { contains: product.brand.name } }]),
        ],
      },
      include: {
        brand: true,
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          take: 1,
        },
      },
      take: 8,
    });
    related = [
      ...related,
      ...mapProductsToShopCards(relatedDb, related.length),
    ].slice(0, 4);
  }

  if (related.length < 4) {
    const excludeIds = [product.id, ...related.map((x) => x.id)];
    const more = await prisma.product.findMany({
      where: { active: true, id: { notIn: excludeIds } },
      include: {
        brand: true,
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          take: 1,
        },
      },
      take: 12,
    });
    const need = 4 - related.length;
    const picked: typeof more = [];
    for (const p of more) {
      if (picked.length >= need) break;
      const cat =
        p.categoryKey &&
        (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
          ? (p.categoryKey as ShopCategoryId)
          : inferCategory(p.brand.name, p.name);
      if (cat !== categoryId && related.length + picked.length >= 2) continue;
      picked.push(p);
    }
    related = [
      ...related,
      ...mapProductsToShopCards(picked, related.length),
    ].slice(0, 4);
  }

  const data: PdpProductData = {
    slug: product.slug,
    name: product.name,
    description:
      product.description?.trim() ||
      `${product.name} — bản quyền số chính hãng. Thanh toán rõ, nhận trong Tài khoản KEYON.`,
    shortDescription: cleanStorefrontBlurb(product.shortDescription),
    brandName: product.brand.name,
    categoryId,
    categoryLabel,
    rating,
    reviewCount,
    soldCount,
    mark,
    galleryUrls: cmsGallery,
    imageUrl: cmsGallery[0] ?? null,
    variants,
    initialVariantId: activeVariant.id,
    features: cmsFeatures.length
      ? cmsFeatures
      : [
          `${product.name} — bản quyền số chính hãng, giao qua Tài khoản KEYON sau thanh toán.`,
        ],
    specs: cmsSpecs.length
      ? cmsSpecs
      : [
          { label: "Thương hiệu", value: product.brand.name },
          { label: "Gói", value: activeVariant.name },
          {
            label: "Loại nhận",
            value: receive.label,
          },
        ],
    systemSpecs: cmsSystemSpecs,
    licenseDefaults: {
      licenseChannelDefault: product.licenseChannelDefault,
      licenseTermDefault: product.licenseTermDefault,
      seatsDefault: product.seatsDefault,
      activationMethodDefault: product.activationMethodDefault,
      platforms: product.platforms,
      language: product.language,
      transferPolicy: product.transferPolicy,
      upgradePolicy: product.upgradePolicy,
      accountRequired: product.accountRequired,
    },
    usageGuideHtml: cmsUsageGuideHtml,
    faqs: cmsFaqs,
    related,
    defaultEmail: session?.email ?? "",
    loggedIn: Boolean(session),
  };

  const initialDb = variantsRaw.find((v) => v.id === activeVariant.id)!;
  const jsonLd = buildProductJsonLd({
    name: product.name,
    description:
      product.seoDescription?.trim() ||
      product.shortDescription?.trim() ||
      (product.description?.trim()
        ? isHtmlBody(product.description)
          ? stripHtml(product.description).slice(0, 300)
          : product.description.trim().slice(0, 300)
        : undefined),
    brandName: product.brand.name,
    sku: initialDb.sku,
    priceVnd: activeVariant.priceVnd,
    url: absoluteUrl(
      `/products/${product.slug}?variant=${activeVariant.id}`,
    ),
    imageUrl: cmsGallery[0] ?? product.ogImageUrl,
    availability: activeVariant.canBuy ? "InStock" : "OutOfStock",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdpView data={data} />
    </>
  );
}
