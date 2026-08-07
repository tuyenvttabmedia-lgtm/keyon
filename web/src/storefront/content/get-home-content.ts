import { cache } from "react";
import type { HomeContent } from "./types";
import { homeFixture } from "./home.fixture";
import {
  defaultBlog,
  defaultCmsBanner,
  defaultCmsCategories,
  defaultCmsFooter,
  defaultCmsHome,
  defaultCmsNav,
  defaultCmsFaq,
  defaultCmsPartners,
  readJsonFile,
  type BlogPost,
  type CmsBanner,
  type CmsCategories,
  type CmsCategoryIconKey,
  type CmsFaqItem,
  type CmsFooter,
  type CmsNav,
  type CmsPartners,
} from "@/server/cms/store";
import { ProductRatingsService, getProductRatingMap } from "@/server/product-ratings";
import type { CategoryIconKey, CategoryItem } from "./types";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { resourcePostHref } from "@/storefront/lib/resources";
import {
  inferCategory,
  shopCatFromCmsIcon,
} from "@/storefront/components/shop/shop-utils";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import type { FeaturedProduct, FaqItem, PartnerItem } from "./types";

/**
 * Home content: fixture + overlay CMS (hero, nav, footer, news, partners, categories, ratings, why banner).
 * Partners on Home resolve from Catalog Brand (CMS only stores brandId + order/visibility).
 * Wrapped in React cache() so layout + page share one load per request.
 */
export const getHomeContent = cache(async (): Promise<HomeContent> => {
  const [
    cmsHome,
    posts,
    footer,
    nav,
    partners,
    categories,
    ratingMap,
    banner,
    catalogRows,
    faqRaw,
    catalogBrands,
  ] = await Promise.all([
    readJsonFile("home.json", defaultCmsHome),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readJsonFile<CmsFooter>("footer.json", defaultCmsFooter),
    readJsonFile<CmsNav>("nav.json", defaultCmsNav),
    readJsonFile<CmsPartners>("partners.json", defaultCmsPartners),
    readJsonFile<CmsCategories>("categories.json", defaultCmsCategories),
    getProductRatingMap(),
    readJsonFile<CmsBanner>("banner.json", defaultCmsBanner),
    prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryKey: true,
        galleryUrls: true,
        brand: { select: { name: true } },
        variants: {
          where: { active: true },
          orderBy: { priceVnd: "asc" },
          select: {
            id: true,
            name: true,
            priceVnd: true,
            compareAtPriceVnd: true,
            deliverableType: true,
            fulfillmentStrategy: true,
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 40,
    }),
    readJsonFile<CmsFaqItem[]>("faq.json", defaultCmsFaq),
    prisma.brand.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true, logoUrl: true, featured: true, sortOrder: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  const published = posts.filter((p) => p.status === "published").slice(0, 4);

  const storage = await resolveStorage();
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";

  const brandById = new Map(catalogBrands.map((b) => [b.id, b]));
  const brandByName = new Map(
    catalogBrands.map((b) => [b.name.trim().toLowerCase(), b] as const),
  );

  const resolvePartnerLogo = (url?: string | null) =>
    url ? resolveMediaUrl(url, mediaBase) || url : undefined;

  const cmsPartnerSource =
    partners.items?.length > 0 ? partners.items : defaultCmsPartners.items;

  let partnerItems: PartnerItem[] = cmsPartnerSource
    .filter((p) => p.visible !== false)
    .map((p): PartnerItem | null => {
      const brand =
        (p.brandId ? brandById.get(p.brandId) : undefined) ||
        (p.name ? brandByName.get(p.name.trim().toLowerCase()) : undefined);

      if (brand) {
        return {
          id: p.id,
          name: brand.name,
          logoUrl: resolvePartnerLogo(brand.logoUrl),
          href: p.href?.trim() || `/products?q=${encodeURIComponent(brand.slug)}`,
          visible: true,
        };
      }

      // Legacy CMS row without catalog match — keep until admin re-links
      if (p.name) {
        return {
          id: p.id,
          name: p.name,
          logoUrl: resolvePartnerLogo(p.logoUrl),
          brandColor: p.brandColor,
          href: p.href,
          visible: true,
        };
      }

      return null;
    })
    .filter((p): p is PartnerItem => p !== null);

  // Soft default: featured catalog brands when CMS list empty after resolve
  if (partnerItems.length === 0) {
    partnerItems = catalogBrands
      .filter((b) => b.featured)
      .slice(0, 8)
      .map((b) => ({
        id: `brand_${b.id}`,
        name: b.name,
        logoUrl: resolvePartnerLogo(b.logoUrl),
        href: `/products?q=${encodeURIComponent(b.slug)}`,
        visible: true,
      }));
  }

  // Fixture fallback only if still empty (e.g. empty catalog)
  if (partnerItems.length === 0) {
    partnerItems = homeFixture.partners.items.filter((p) => p.visible !== false);
  }

  const shopCounts: Record<ShopCategoryId, number> = {
    windows: 0,
    office: 0,
    adobe: 0,
    cloud: 0,
    security: 0,
    other: 0,
  };
  for (const p of catalogRows) {
    if (!p.variants.length) continue;
    const categoryId: ShopCategoryId =
      p.categoryKey &&
      (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(p.categoryKey)
        ? (p.categoryKey as ShopCategoryId)
        : inferCategory(p.brand.name, p.name);
    shopCounts[categoryId] += 1;
  }

  const categorySource =
    categories.items?.length > 0 ? categories.items : defaultCmsCategories.items;
  // Wave 5: hide empty shop tiles; do not alias Backup→Cloud (misleading counts).
  const categoryItems: CategoryItem[] = categorySource
    .filter((c) => c.visible !== false)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => {
      const shopCat =
        c.iconKey === "backup" ? null : shopCatFromCmsIcon(c.iconKey);
      const liveCount =
        shopCat && shopCat !== "all" ? shopCounts[shopCat] : undefined;
      const countLabel =
        liveCount !== undefined
          ? `${liveCount} sản phẩm`
          : c.countLabel;
      const href =
        shopCat && shopCat !== "all"
          ? `/products?cat=${shopCat}`
          : c.href || "/products";
      return {
        id: c.id,
        title: c.title,
        countLabel,
        href,
        icon: toCategoryIcon(c.iconKey),
        iconUrl: c.iconUrl,
        accentColor: c.accentColor,
        liveCount,
      };
    })
    .filter((c) => {
      if (c.icon === "backup" || c.icon === "security") {
        return (c.liveCount ?? 0) > 0;
      }
      return c.liveCount === undefined || c.liveCount > 0;
    })
    .slice(0, 8)
    .map(({ liveCount: _n, ...rest }) => rest);

  const shopCards = mapProductsToShopCards(
    catalogRows.filter((p) => p.variants.length > 0).slice(0, 8),
  );
  const featuredFromCatalog: FeaturedProduct[] = shopCards.map((c) => {
    const gal = c.imageUrl;
    return {
      id: c.id,
      brandName: c.brandName,
      productName: c.productName,
      packageName: c.packageName,
      priceVnd: c.priceVnd,
      receiveLabel: c.receiveLabel,
      receiveKind: c.receiveKind,
      deliveryLabel: c.deliveryLabel,
      mark: c.mark,
      imageUrl: gal,
      href: c.href,
      ctaLabel: "Thanh toán ngay",
      rating: undefined,
      reviewCount: undefined,
    };
  });
  /** Prefer live catalog only — never pad with fixture demo prices. */
  const featuredItems = ProductRatingsService.applyToFeatured(
    featuredFromCatalog.slice(0, 5),
    ratingMap,
  );

  const faqHome: FaqItem[] = faqRaw
    .filter((f) => f.showOnHome)
    .slice(0, 6)
    .map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category ?? "general",
    }));

  const solutions = {
    ...homeFixture.solutions,
    title: cmsHome.solutionsTitle || homeFixture.solutions.title,
    subtitle: cmsHome.solutionsSubtitle || homeFixture.solutions.subtitle,
  };

  const why = {
    ...homeFixture.why,
    title: cmsHome.whyTitle || homeFixture.why.title,
    subtitle: cmsHome.whySubtitle || homeFixture.why.subtitle,
    sideBanner: {
      title: banner.title,
      ctaLabel: banner.ctaLabel,
      ctaHref: banner.ctaHref,
      imageUrl: banner.imageUrl,
      visible: banner.visible,
    },
  };

  const howItWorks = {
    ...homeFixture.howItWorks,
    title: cmsHome.howTitle || homeFixture.howItWorks.title,
    subtitle: cmsHome.howSubtitle || homeFixture.howItWorks.subtitle,
  };

  const ctaBanner = {
    ...homeFixture.ctaBanner,
    title: cmsHome.ctaTitle || homeFixture.ctaBanner.title,
    subtitle: cmsHome.ctaSubtitle || homeFixture.ctaBanner.subtitle,
    ctaLabel: cmsHome.ctaLabel || homeFixture.ctaBanner.ctaLabel,
    ctaHref: cmsHome.ctaHref || homeFixture.ctaBanner.ctaHref,
  };

  return {
    ...homeFixture,
    navigation: nav.items.length ? nav.items : homeFixture.navigation,
    brand: {
      logoUrl: resolveMediaUrl(nav.logoUrl, mediaBase) || undefined,
      brandName: nav.brandName?.trim() || defaultCmsNav.brandName,
      tagline:
        typeof nav.tagline === "string"
          ? nav.tagline.trim()
          : defaultCmsNav.tagline,
    },
    hero: {
      ...homeFixture.hero,
      title: cmsHome.heroTitle || homeFixture.hero.title,
      titleAccent: cmsHome.heroTitleAccent?.trim() || undefined,
      subtitle: cmsHome.heroSubtitle || homeFixture.hero.subtitle,
      ctaLabel: cmsHome.heroCta || homeFixture.hero.ctaLabel,
      ctaHref: cmsHome.heroCtaHref || homeFixture.hero.ctaHref,
      visible: cmsHome.published,
    },
    partners: {
      title: partners.title || homeFixture.partners.title,
      badges: partners.badges?.length ? partners.badges : homeFixture.partners.badges,
      items: partnerItems,
    },
    categories: {
      ...homeFixture.categories,
      title: categories.title || homeFixture.categories.title,
      viewAllHref: categories.viewAllHref || homeFixture.categories.viewAllHref,
      viewAllLabel: categories.viewAllLabel || homeFixture.categories.viewAllLabel,
      items: categoryItems.length ? categoryItems : homeFixture.categories.items,
    },
    featured: {
      ...homeFixture.featured,
      items: featuredItems,
      visible: featuredItems.length > 0,
    },
    why,
    howItWorks,
    solutions,
    ctaBanner,
    faqHome: {
      visible: faqHome.length > 0,
      title: "Câu hỏi thường gặp",
      items: faqHome,
    },
    news: {
      ...homeFixture.news,
      visible: published.length > 0,
      items: published.map((p, i) => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        dateLabel: new Date(p.publishedAt ?? p.updatedAt).toLocaleDateString(
          "vi-VN",
        ),
        href: resourcePostHref(p),
        tag: homeFixture.news.items[i]?.tag,
        tagTone: homeFixture.news.items[i]?.tagTone,
      })),
    },
    footer: {
      logoUrl:
        resolveMediaUrl(footer.logoUrl, mediaBase) ||
        resolveMediaUrl(nav.logoUrl, mediaBase) ||
        undefined,
      brandName:
        footer.brandName?.trim() ||
        nav.brandName?.trim() ||
        defaultCmsFooter.brandName,
      blurb: footer.blurb || homeFixture.footer.blurb,
      columns: footer.columns.length ? footer.columns : homeFixture.footer.columns,
      copyright: footer.copyright || homeFixture.footer.copyright,
      legalLinks: footer.legalLinks.length
        ? footer.legalLinks
        : homeFixture.footer.legalLinks,
      supportEmail: "support@keyon.vn",
      paymentBadges: ["VietQR", "Chuyển khoản"],
    },
  };
});

function toCategoryIcon(key?: CmsCategoryIconKey): CategoryIconKey {
  if (!key) return "other";
  return key;
}

export async function getFaqForPage() {
  const faq = await readJsonFile<CmsFaqItem[]>("faq.json", defaultCmsFaq);
  return faq
    .filter((f) => f.showOnFaqPage)
    .map((f) => ({
      ...f,
      category: f.category ?? ("general" as const),
    }));
}
