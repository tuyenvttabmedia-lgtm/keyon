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
  type CmsFooter,
  type CmsNav,
  type CmsPartners,
} from "@/server/cms/store";
import { normalizeFaqDocument } from "@/server/cms/faq";
import { pickHomeFaqs } from "@/storefront/content/faq-groups";
import { ProductRatingsService, getProductRatingMap } from "@/server/product-ratings";
import type { CategoryIconKey, CategoryItem } from "./types";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { resourcePostHref } from "@/storefront/lib/resources";
import { solutionTopicCards } from "@/storefront/nav/ia";
import {
  inferCategory,
  shopCatFromCmsIcon,
} from "@/storefront/components/shop/shop-utils";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import type {
  FeaturedProduct,
  FaqItem,
  FooterColumn,
  PartnerItem,
} from "./types";

/** Prefer CMS text; empty → fixture. Do not silently rewrite saved CMS copy. */
function cmsTextOrFallback(
  value: string | undefined,
  fallback: string,
): string {
  const v = value?.trim() ?? "";
  return v || fallback;
}

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
    readJsonFile("faq.json", defaultCmsFaq),
    prisma.brand.findMany({
      where: { active: true },
      select: { id: true, name: true, slug: true, logoUrl: true, featured: true, sortOrder: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
  ]);

  const faqDoc = normalizeFaqDocument(faqRaw);
  const faqItems = faqDoc.items;

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

  // Wave 5: only brands with ≥1 active sellable product (avoid empty /products?q=…)
  const sellableBrandNames = new Set(
    catalogRows
      .filter((p) => p.variants.length > 0 && p.brand?.name)
      .map((p) => p.brand!.name.trim().toLowerCase()),
  );
  partnerItems = partnerItems.filter((p) =>
    sellableBrandNames.has(p.name.trim().toLowerCase()),
  );

  // Soft default: featured catalog brands when CMS list empty after resolve
  if (partnerItems.length === 0) {
    partnerItems = catalogBrands
      .filter(
        (b) =>
          b.featured && sellableBrandNames.has(b.name.trim().toLowerCase()),
      )
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
    partnerItems = homeFixture.partners.items.filter(
      (p) =>
        p.visible !== false &&
        sellableBrandNames.has(p.name.trim().toLowerCase()),
    );
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
    .map(({ liveCount, ...rest }) => {
      void liveCount;
      return rest;
    });

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

  const faqHome: FaqItem[] = pickHomeFaqs(faqItems, 6).map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    category: f.category ?? "general",
  }));

  // Home cards = `/solutions` hub. Ignore stale CMS titles from the merge.
  const cmsSolutionsTitle = cmsHome.solutionsTitle?.trim();
  const solutions = {
    ...homeFixture.solutions,
    title:
      cmsSolutionsTitle &&
      cmsSolutionsTitle !== "Doanh nghiệp" &&
      cmsSolutionsTitle !== "Giải pháp doanh nghiệp"
        ? cmsSolutionsTitle
        : homeFixture.solutions.title,
    subtitle: cmsHome.solutionsSubtitle || homeFixture.solutions.subtitle,
    ctaLabel: homeFixture.solutions.ctaLabel,
    ctaHref: "/solutions",
    secondaryCtaLabel: homeFixture.solutions.secondaryCtaLabel,
    secondaryCtaHref: "/business",
    items: solutionTopicCards(),
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
    subtitle: cmsTextOrFallback(
      cmsHome.ctaSubtitle,
      homeFixture.ctaBanner.subtitle,
    ),
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
      title: cmsTextOrFallback(cmsHome.heroTitle, homeFixture.hero.title),
      titleAccent: cmsHome.heroTitleAccent?.trim() || undefined,
      subtitle: cmsTextOrFallback(
        cmsHome.heroSubtitle,
        homeFixture.hero.subtitle,
      ),
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
      logoUrl: (() => {
        const footerLogo =
          resolveMediaUrl(footer.logoUrl, mediaBase) || undefined;
        const navLogo = resolveMediaUrl(nav.logoUrl, mediaBase) || undefined;
        const picked = footerLogo || navLogo;
        // Dark wordmark on navy footer reads as a black slab — use light asset.
        if (
          picked &&
          /\/brand\/keyon-logo\.png(?:\?|$)/i.test(picked) &&
          !/keyon-logo-light/i.test(picked)
        ) {
          return "/brand/keyon-logo-light.png";
        }
        return picked;
      })(),
      brandName:
        footer.brandName?.trim() ||
        nav.brandName?.trim() ||
        defaultCmsFooter.brandName,
      blurb: cmsTextOrFallback(footer.blurb, homeFixture.footer.blurb),
      companyInfo: {
        companyName:
          footer.companyInfo?.companyName?.trim() ||
          defaultCmsFooter.companyInfo?.companyName ||
          "",
        address:
          footer.companyInfo?.address?.trim() ||
          defaultCmsFooter.companyInfo?.address ||
          "",
        taxCode:
          footer.companyInfo?.taxCode?.trim() ||
          defaultCmsFooter.companyInfo?.taxCode ||
          "",
        phone:
          footer.companyInfo?.phone?.trim() ||
          defaultCmsFooter.companyInfo?.phone ||
          "",
        email:
          footer.companyInfo?.email?.trim() ||
          defaultCmsFooter.companyInfo?.email ||
          homeFixture.footer.supportEmail ||
          "support@keyon.vn",
      },
      columns: sanitizeFooterColumns(
        footer.columns.length ? footer.columns : homeFixture.footer.columns,
        shopCounts,
      ),
      copyright: footer.copyright || homeFixture.footer.copyright,
      socialLinks: sanitizeSocialLinks(
        footer.socialLinks?.length
          ? footer.socialLinks
          : defaultCmsFooter.socialLinks || [],
      ),
      legalLinks: [],
      supportEmail:
        footer.companyInfo?.email?.trim() ||
        homeFixture.footer.supportEmail ||
        "support@keyon.vn",
      bctVisible: Boolean(footer.bctVisible),
      bctHref: footer.bctHref?.trim() || defaultCmsFooter.bctHref,
      bctImageUrl:
        resolveMediaUrl(footer.bctImageUrl, mediaBase) ||
        footer.bctImageUrl?.trim() ||
        "/brand/bct-thong-bao.svg",
      bctAlt: footer.bctAlt?.trim() || defaultCmsFooter.bctAlt,
      dmcaVisible: Boolean(footer.dmcaVisible),
      dmcaHref: footer.dmcaHref?.trim() || defaultCmsFooter.dmcaHref || "",
      dmcaImageUrl:
        resolveMediaUrl(footer.dmcaImageUrl, mediaBase) ||
        footer.dmcaImageUrl?.trim() ||
        "/brand/dmca-protected.svg",
      dmcaAlt: footer.dmcaAlt?.trim() || defaultCmsFooter.dmcaAlt,
    },
  };
});

const SOCIAL_NETWORKS = new Set([
  "facebook",
  "youtube",
  "linkedin",
  "zalo",
  "tiktok",
  "instagram",
  "x",
]);

function sanitizeSocialLinks(
  links: { network?: string; href?: string; label?: string }[],
): { network: "facebook" | "youtube" | "linkedin" | "zalo" | "tiktok" | "instagram" | "x"; href: string; label?: string }[] {
  const out: {
    network: "facebook" | "youtube" | "linkedin" | "zalo" | "tiktok" | "instagram" | "x";
    href: string;
    label?: string;
  }[] = [];
  for (const raw of links) {
    const network = (raw.network || "").trim().toLowerCase();
    const href = (raw.href || "").trim();
    if (!SOCIAL_NETWORKS.has(network) || !href) continue;
    out.push({
      network: network as (typeof out)[number]["network"],
      href,
      label: raw.label?.trim() || undefined,
    });
  }
  return out;
}

/** Drop empty shop-category footer links; trim noisy business lists; keep company intact. */
function sanitizeFooterColumns(
  columns: FooterColumn[],
  shopCounts: Record<ShopCategoryId, number>,
): FooterColumn[] {
  const BUSINESS_HREFS = new Set([
    "/business",
    "/business/volume-licensing",
    "/business/subscriptions",
    "/business/licensing-consulting",
    "/business/implementation",
    "/business/contracts",
    "/contact/quote",
  ]);

  /** Only dedupe across product / business / support — never strip company identity links. */
  const seenNav = new Set<string>();

  return columns
    .map((col) => {
      const title = col.title.trim().toLowerCase();
      // "Thông tin doanh nghiệp" must be company, NOT business
      const isCompany =
        title.includes("công ty") ||
        title.includes("cong ty") ||
        title.includes("thông tin") ||
        title.includes("thong tin") ||
        title === "company" ||
        title === "about";
      const isBusiness =
        !isCompany &&
        (title === "doanh nghiệp" ||
          title === "doanh nghiep" ||
          title.startsWith("doanh nghiệp") ||
          title.startsWith("doanh nghiep") ||
          title === "business");

      let links = col.links
        .map((link) => {
          let href = link.href?.trim() || "";
          let label = link.label?.trim() || "";
          if (href === "/products?q=adobe") href = "/products?cat=adobe";
          if (href === "/contact/sales") href = "/contact/quote";
          if (href === "/resources" || href.startsWith("/resources/")) {
            href = href.replace(/^\/resources/, "/knowledge");
          }
          if (label === "Tài nguyên") label = "Kiến thức";
          if (label === "Hướng dẫn nhận hàng" || label === "Cách nhận hàng") {
            label = "Cách KEYON hoạt động";
          }
          // Shorten very long address labels in company column
          if (isCompany && href === "/contact" && label.length > 48) {
            label = "Hà Nội, Việt Nam";
          }
          if (isCompany && (href === "/about" || href.startsWith("/about"))) {
            if (/công\s*ty/i.test(label) || label.length > 40) {
              label = "Về KEYON";
            }
          }
          return href !== link.href || label !== link.label
            ? { ...link, href, label }
            : link;
        })
        .filter((link) => {
          const href = link.href || "";
          if (!href || !link.label?.trim()) return false;
          const m = href.match(/[?&]cat=([a-z]+)/i);
          if (!m) return true;
          const cat = m[1] as ShopCategoryId;
          if (!(cat in shopCounts)) return true;
          return shopCounts[cat] > 0;
        });

      // Business column: buying hubs — allow /solutions hub, drop /solutions/* dump
      if (isBusiness) {
        links = links.filter((l) => {
          const href = (l.href || "").split("?")[0]!;
          if (href === "/solutions") return true;
          if (href.startsWith("/solutions/")) return false;
          if (BUSINESS_HREFS.has(href)) return true;
          return href.startsWith("/business");
        });
      }

      // Company: drop sales CTA only (lives under Doanh nghiệp)
      if (isCompany) {
        links = links.filter((l) => {
          const path = (l.href || "").split("?")[0]!;
          return path !== "/contact/quote";
        });
      }

      // Nav-style dedupe (skip company so address/email/about always show)
      if (!isCompany) {
        links = links.filter((l) => {
          const key = (l.href || "").trim().toLowerCase();
          if (!key || seenNav.has(key)) return false;
          seenNav.add(key);
          return true;
        });
      } else {
        // Still dedupe within the company column itself
        const local = new Set<string>();
        links = links.filter((l) => {
          const key = (l.href || "").trim().toLowerCase();
          if (!key || local.has(key)) return false;
          local.add(key);
          return true;
        });
      }

      return {
        ...col,
        title: isCompany
          ? title.includes("thông tin") || title.includes("thong tin")
            ? "Công ty"
            : col.title
          : isBusiness && title.includes("tổng")
            ? col.title
            : col.title,
        links,
      };
    })
    .filter((col) => col.links.length > 0 || col.title.trim().length > 0);
}

function toCategoryIcon(key?: CmsCategoryIconKey): CategoryIconKey {
  if (!key) return "other";
  return key;
}

export async function getFaqForPage() {
  const raw = await readJsonFile("faq.json", defaultCmsFaq);
  const doc = normalizeFaqDocument(raw);
  return {
    categories: doc.categories.map((c) => ({
      id: c.id,
      label: c.label,
      description: c.description ?? "",
    })),
    items: doc.items
      .filter((f) => f.showOnFaqPage)
      .map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: f.category ?? "general",
        popular: Boolean(f.showOnHome),
      })),
  };
}
