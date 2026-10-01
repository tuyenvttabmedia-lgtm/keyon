import { cache } from "react";
import { unstable_cache } from "next/cache";
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
  readJsonFile,
  type BlogPost,
  type CmsBanner,
  type CmsCategories,
  type CmsCategoryIconKey,
  type CmsFooter,
  type CmsNav,
} from "@/server/cms/store";
import { normalizeFaqDocument } from "@/server/cms/faq";
import { normalizeCmsCategories } from "@/server/cms/home-categories";
import { pickHomeFaqs } from "@/storefront/content/faq-groups";
import { ProductRatingsService, getProductRatingMap } from "@/server/product-ratings";
import type { CategoryIconKey, CategoryItem } from "./types";
import { prisma } from "@/lib/db";
import { resolveMediaUrl } from "@/lib/media-url";
import { resolveStorage } from "@/server/storage/config";
import { resourcePostHref } from "@/storefront/lib/resources";
import { solutionTopicCards } from "@/storefront/nav/ia";
import { isBlogPostLive } from "@/server/cms/blog-utils";
import { CATEGORY_LABELS, inferCategory, shopCatFromCmsIcon } from "@/storefront/components/shop/shop-utils";
import { PRODUCT_CATEGORY_KEYS } from "@/storefront/lib/product-cms";
import type { ShopCategoryId } from "@/storefront/components/shop/types";
import { mapProductsToShopCards } from "@/storefront/lib/related-products";
import { parseOfferingProfile } from "@/storefront/lib/offering-profile";
import {
  LICENSE_TERM_LABELS,
  type LicenseTermCode,
} from "@/storefront/lib/license-catalog";
import type {
  FeaturedProduct,
  FaqItem,
  FooterColumn,
} from "./types";

/** Prefer CMS text; empty or a retired Home positioning line → fixture. */
function cmsTextOrFallback(
  value: string | undefined,
  fallback: string,
  stale: readonly string[] = [],
): string {
  const v = value?.trim() ?? "";
  if (!v || stale.includes(v)) return fallback;
  return v;
}

const RETIRED_HERO_TITLES = [
  "Mua & quản lý bản quyền số trên KEYON",
  "Nền tảng phân phối bản quyền số",
];

const RETIRED_HERO_SUBTITLES = [
  "Mua license chính hãng, nhận đúng loại (key / tài khoản / kích hoạt) và theo dõi trong Tài khoản. Hỗ trợ tiếng Việt — báo giá khi cần quy mô lớn.",
  "Mua, triển khai và quản lý bản quyền phần mềm, cloud và dịch vụ số trên một nền tảng duy nhất. Dành cho cá nhân, đội nhóm và doanh nghiệp.",
];

/**
 * Home content: fixture + overlay CMS (hero, nav, footer, news, categories, ratings, why banner).
 * Ecosystem row is a fixed label set — vendor logos are not looped on Home.
 * React cache() = per-request dedupe; unstable_cache = cross-request ISR (60s).
 */
async function loadHomeContent(): Promise<HomeContent> {
  const [
    cmsHome,
    posts,
    footer,
    nav,
    categories,
    ratingMap,
    banner,
    catalogRows,
    faqRaw,
  ] = await Promise.all([
    readJsonFile("home.json", defaultCmsHome),
    readJsonFile<BlogPost[]>("blog.json", defaultBlog),
    readJsonFile<CmsFooter>("footer.json", defaultCmsFooter),
    readJsonFile<CmsNav>("nav.json", defaultCmsNav),
    readJsonFile<CmsCategories>("categories.json", defaultCmsCategories).then(
      (raw) => normalizeCmsCategories(raw),
    ),
    getProductRatingMap(),
    readJsonFile<CmsBanner>("banner.json", defaultCmsBanner),
    prisma.product.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryKey: true,
        offeringProfile: true,
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
            licenseModel: true,
            licenseTerm: true,
          },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      take: 16,
    }),
    readJsonFile("faq.json", defaultCmsFaq),
  ]);

  const faqDoc = normalizeFaqDocument(faqRaw);
  const faqItems = faqDoc.items;

  const published = posts
    .filter((p) => isBlogPostLive(p))
    .slice()
    .sort((a, b) => {
      const ta = new Date(a.publishedAt ?? a.scheduledAt ?? a.updatedAt).getTime();
      const tb = new Date(b.publishedAt ?? b.scheduledAt ?? b.updatedAt).getTime();
      return tb - ta;
    })
    .slice(0, 4);

  const storage = await resolveStorage();
  const mediaBase =
    storage.driver === "wasabi"
      ? storage.wasabi.publicBaseUrl ||
        `${storage.wasabi.endpoint.replace(/\/$/, "")}/${storage.wasabi.bucket}`
      : "";

  const shopCounts: Record<ShopCategoryId, number> = {
    windows: 0,
    office: 0,
    adobe: 0,
    cloud: 0,
    security: 0,
    backup: 0,
    autodesk: 0,
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
  // Hide empty shop tiles; catalog categoryKey → canonical /categories/{key}.
  const categoryItems: CategoryItem[] = categorySource
    .filter((c) => c.visible !== false)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((c) => {
      const shopCat =
        c.categoryKey &&
        (PRODUCT_CATEGORY_KEYS as readonly string[]).includes(c.categoryKey)
          ? (c.categoryKey as ShopCategoryId)
          : shopCatFromCmsIcon(c.iconKey);
      if (!shopCat || shopCat === "all") return null;
      const liveCount = shopCounts[shopCat] ?? 0;
      return {
        id: c.id,
        title: c.title.trim() && CATEGORY_LABELS[shopCat]
        ? CATEGORY_LABELS[shopCat]
        : c.title,
        countLabel: `${liveCount} sản phẩm`,
        href: `/categories/${shopCat}`,
        icon: toCategoryIcon(c.iconKey ?? shopCat),
        iconUrl: c.iconUrl,
        accentColor: c.accentColor,
        liveCount,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c != null)
    .filter((c) => c.liveCount > 0)
    .sort((a, b) => homeCategoryRank(a.href) - homeCategoryRank(b.href))
    .slice(0, 8)
    .map(({ liveCount, ...rest }) => {
      void liveCount;
      return rest;
    });

  const shopCards = mapProductsToShopCards(
    catalogRows.filter((p) => p.variants.length > 0).slice(0, 8),
  );
  const rowById = new Map(catalogRows.map((row) => [row.id, row]));
  const featuredFromCatalog: FeaturedProduct[] = shopCards.map((c) => {
    const gal = c.imageUrl;
    const line = featuredPackageLine(rowById.get(c.id));
    return {
      id: c.id,
      brandName: c.brandName,
      productName: c.productName,
      packageName: line ?? c.packageName,
      priceVnd: c.priceVnd,
      receiveLabel: c.receiveLabel,
      receiveKind: c.receiveKind,
      deliveryLabel: c.deliveryLabel,
      mark: c.mark,
      imageUrl: gal,
      href: c.href,
      ctaLabel: "Xem sản phẩm",
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
    subtitle: homeFixture.solutions.subtitle,
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
      title: cmsTextOrFallback(
        cmsHome.heroTitle,
        homeFixture.hero.title,
        RETIRED_HERO_TITLES,
      ),
      titleAccent: cmsHome.heroTitleAccent?.trim() || undefined,
      subtitle: cmsTextOrFallback(
        cmsHome.heroSubtitle,
        homeFixture.hero.subtitle,
        RETIRED_HERO_SUBTITLES,
      ),
      ctaLabel: cmsHome.heroCta || homeFixture.hero.ctaLabel,
      ctaHref: cmsHome.heroCtaHref || homeFixture.hero.ctaHref,
      visible: cmsHome.published,
    },
    partners: {
      title: "Hệ sinh thái công nghệ",
      subtitle:
        "Các nền tảng phần mềm, bảo mật, cloud và hạ tầng KEYON hỗ trợ phân phối và triển khai.",
      badges: [],
      items: [],
    },
    categories: {
      ...homeFixture.categories,
      title: categories.title || homeFixture.categories.title,
      viewAllHref: categories.viewAllHref || homeFixture.categories.viewAllHref,
      viewAllLabel: categories.viewAllLabel || homeFixture.categories.viewAllLabel,
      items: categoryItems,
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
        excerpt: (() => {
          const raw = (p.excerpt || "").trim();
          if (raw.length <= 140) return raw;
          return `${raw.slice(0, 137).trimEnd()}…`;
        })(),
        dateLabel: new Date(p.publishedAt ?? p.updatedAt).toLocaleDateString(
          "vi-VN",
        ),
        href: resourcePostHref(p),
        imageUrl: (() => {
          const raw = p.coverUrl?.trim();
          if (!raw) return undefined;
          // Prefer CDN host as stored (Wasabi behind media.keyon.vn).
          // Do not rewrite to S3 endpoint — Next/optimizer & private S3 break thumbs.
          if (/^https?:\/\/media\.keyon\.vn\//i.test(raw)) return raw;
          if (/wasabisys\.com/i.test(raw)) return raw;
          return resolveMediaUrl(raw, mediaBase) || raw;
        })(),
        imageAlt: p.coverAlt?.trim() || p.title,
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
}

const getHomeContentCached = unstable_cache(loadHomeContent, ["storefront-home-content-v3"], {
  revalidate: 60,
});

export const getHomeContent = cache(() => getHomeContentCached());

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
          if (href === "/products?q=adobe") href = "/brands/adobe";
          if (href === "/products?q=microsoft") href = "/brands/microsoft";
          if (href === "/products?q=autodesk") href = "/brands/autodesk";
          if (href === "/products?q=backup") href = "/categories/backup";
          // Legacy shop category query → path (ADR-006 amend)
          {
            const m = href.match(/^\/products\?cat=([a-z0-9-]+)/i);
            if (m?.[1]) {
              const key = m[1].toLowerCase() === "design" ? "adobe" : m[1].toLowerCase();
              href = `/categories/${key}`;
            }
          }
          if (href === "/categories/design") href = "/categories/adobe";
          if (href === "/contact/sales") href = "/contact/quote";
          if (href === "/resources" || href.startsWith("/resources/")) {
            href = href.replace(/^\/resources/, "/kien-thuc").replace(/^\/knowledge/, "/kien-thuc");
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

const HOME_CATEGORY_RANK: Record<string, number> = {
  windows: 0,
  office: 1,
  adobe: 2,
  autodesk: 3,
  security: 4,
  backup: 5,
  cloud: 6,
};

function homeCategoryRank(href: string) {
  const key = href.split("/").filter(Boolean).pop() ?? "";
  return HOME_CATEGORY_RANK[key] ?? 50;
}

function termShort(code: string | null | undefined): string | null {
  if (!code) return null;
  if (code === "PERPETUAL") return "Vĩnh viễn";
  if (code in LICENSE_TERM_LABELS) {
    return LICENSE_TERM_LABELS[code as LicenseTermCode];
  }
  return null;
}

function featuredPackageLine(row: {
  offeringProfile: string | null;
  variants: Array<{
    name: string;
    licenseModel: string | null;
    licenseTerm: string | null;
  }>;
} | undefined): string | null {
  const variant = row?.variants[0];
  if (!row || !variant) return null;
  const profile = parseOfferingProfile(row.offeringProfile);
  const term = termShort(variant.licenseTerm);
  if (profile === "SERVICE") return "Theo nhu cầu doanh nghiệp";
  if (profile === "INFRASTRUCTURE") return variant.name;
  if (variant.licenseModel === "SUBSCRIPTION") {
    return term ? `Subscription · ${term}` : "Subscription";
  }
  if (profile === "SOFTWARE") return term ? `License · ${term}` : "License";
  return null;
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
