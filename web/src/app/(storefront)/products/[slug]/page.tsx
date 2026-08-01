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
  defaultFeatures,
  defaultGuides,
  PDP_CATEGORY_BADGE,
} from "@/storefront/components/pdp/pdp-utils";
import type { ShopCategoryId, ShopProduct } from "@/storefront/components/shop/types";
import {
  CATEGORY_LABELS,
  discountPercent,
  inferCategory,
  inferMark,
} from "@/storefront/components/shop/shop-utils";
import {
  parseFaqRows,
  parseSpecRows,
  parseStringList,
  PRODUCT_CATEGORY_KEYS,
} from "@/storefront/lib/product-cms";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import { absoluteAssetUrl } from "@/storefront/lib/asset-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: {
      name: true,
      active: true,
      seoTitle: true,
      seoDescription: true,
      shortDescription: true,
      description: true,
      ogImageUrl: true,
      galleryUrls: true,
    },
  });
  if (!product || !product.active) {
    return { title: "Sản phẩm" };
  }
  const title = product.seoTitle?.trim() || product.name;
  const description =
    product.seoDescription?.trim() ||
    product.shortDescription?.trim() ||
    product.description?.trim()?.slice(0, 160) ||
    `${product.name} — bản quyền số trên KEYON`;
  const gallery = parseStringList(product.galleryUrls);
  const og = absoluteAssetUrl(product.ogImageUrl || gallery[0] || null);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(og ? { images: [{ url: og }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(og ? { images: [og] } : {}),
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
  const cmsSpecs = parseSpecRows(product.specs);
  const cmsFaqs = parseFaqRows(product.faqs);

  const variants: PdpVariantOption[] = variantsRaw.map((v) => {
    const receive = receiveFromDeliverable(v.deliverableType);
    const compareAtPriceVnd =
      v.compareAtPriceVnd && v.compareAtPriceVnd > v.priceVnd
        ? v.compareAtPriceVnd
        : undefined;
    const canBuy =
      v.salesMotion === "SELF_SERVE" &&
      (v.fulfillmentStrategy === "INSTANT" ||
        v.fulfillmentStrategy === "MANUAL" ||
        v.fulfillmentStrategy === "SEMI_AUTOMATED");
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
    };
  });

  const activeVariant = variants.find((v) => v.id === initial.id) ?? variants[0]!;
  const receive = receiveFromDeliverable(
    variantsRaw.find((v) => v.id === activeVariant.id)!.deliverableType,
  );

  const soldCount = computeSocialSold(product.slug);
  const reviewCount = computeSocialReviews(product.slug, soldCount);
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

  const defaultSpecs = [
    { label: "Nhà phát hành", value: product.brand.name },
    { label: "Danh mục", value: CATEGORY_LABELS[categoryId] },
    { label: "Kích hoạt", value: "Toàn cầu" },
    { label: "Thiết bị", value: "Theo mô tả gói" },
    { label: "Ngôn ngữ", value: "Đa ngôn ngữ" },
    { label: "Loại nhận", value: receive.label },
    {
      label: "Giao hàng",
      value: activeVariant.fulfillmentInstant ? "Tự động (1–5 phút)" : "KEYON xử lý",
    },
    { label: "Lưu trữ", value: "Tài sản trong Tài khoản" },
  ];

  const defaultFaqs = [
    {
      id: "1",
      question: "Sản phẩm này là gì?",
      answer:
        product.description ||
        `${product.name} — giấy phép bản quyền số trên KEYON.`,
    },
    {
      id: "2",
      question: "Tôi sẽ nhận được gì sau khi thanh toán?",
      answer: `Loại nhận: ${receive.label}. Đã thanh toán chưa đồng nghĩa đã giao — theo dõi trong Đơn hàng / Tài sản.`,
    },
    {
      id: "3",
      question: "Cách kích hoạt như thế nào?",
      answer:
        "Sau khi giao, mở Tài sản trong Tài khoản để xem key / tài khoản / hướng dẫn kích hoạt.",
    },
    {
      id: "4",
      question: "Có mua nhiều sản phẩm khác nhau trong một đơn không?",
      answer:
        "Mỗi lần thanh toán là một giao dịch cho một gói (có thể chọn số lượng cùng gói). Muốn mua gói khác hãy tạo đơn riêng.",
    },
    {
      id: "5",
      question: "Thanh toán xong bao lâu thì nhận được?",
      answer: activeVariant.fulfillmentInstant
        ? "Thường giao trong 1–5 phút sau khi hệ thống xác nhận thanh toán."
        : "KEYON xử lý theo SLA gói — theo dõi trong Đơn hàng / Tài sản.",
    },
    {
      id: "6",
      question: "Nếu kích hoạt lỗi thì sao?",
      answer:
        "Liên hệ hỗ trợ từ Tài khoản. Hoàn / gửi lại khi giao sai loại hoặc không kích hoạt được theo mô tả gói.",
    },
  ];

  const data: PdpProductData = {
    slug: product.slug,
    name: product.name,
    description:
      product.description?.trim() ||
      `${product.name} — bản quyền số chính hãng. Thanh toán rõ, nhận trong Tài khoản KEYON.`,
    shortDescription: product.shortDescription?.trim() || undefined,
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
    features: cmsFeatures.length ? cmsFeatures : defaultFeatures(categoryId, product.name),
    specs: cmsSpecs.length ? cmsSpecs : defaultSpecs,
    guides: defaultGuides(activeVariant.fulfillmentInstant),
    faqs: cmsFaqs.length ? cmsFaqs : defaultFaqs,
    related,
    defaultEmail: session?.email ?? "",
    loggedIn: Boolean(session),
  };

  return <PdpView data={data} />;
}
