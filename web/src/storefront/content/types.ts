/**
 * CMS-shaped content types for storefront Home.
 * Replace fixture with CMS/API later — keep this contract.
 */

import type { FaqCategoryId } from "./faq-categories";

export type NavItem = {
  label: string;
  href: string;
};

export type HomeHeroTrustItem = {
  title: string;
  description: string;
};

export type HomeHero = {
  visible: boolean;
  badge?: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  trustItems?: HomeHeroTrustItem[];
};

/** Key / Tài khoản / Kích hoạt — customer-facing receive type (not INSTANT/MANUAL) */
export type ReceiveKind = "key" | "account" | "activation";

export type FeaturedProduct = {
  id: string;
  brandName: string;
  productName: string;
  packageName: string;
  priceVnd: number;
  /** Customer-facing receive type label */
  receiveLabel: string;
  receiveKind: ReceiveKind;
  /** Optional delivery timing line — never raw INSTANT/MANUAL */
  deliveryLabel?: string;
  /** Product mark for card art fallback */
  mark?: "windows" | "office" | "defender" | "adobe" | "security" | "server" | "generic";
  /** Optional box / cover image */
  imageUrl?: string;
  /** Average rating 0–5 when real reviews exist — omit to hide stars */
  rating?: number;
  reviewCount?: number;
  /** CTA on featured card — default “Thanh toán ngay” */
  ctaLabel?: string;
  href: string;
};

export type ValueProp = {
  id: string;
  title: string;
  description: string;
};

export type HowItWorksStep = {
  id: string;
  title: string;
  description: string;
};

export type CategoryIconKey =
  | "windows"
  | "office"
  | "adobe"
  | "cloud"
  | "security"
  | "autodesk"
  | "backup"
  | "other";

export type CategoryItem = {
  id: string;
  title: string;
  /** e.g. "18 sản phẩm" or "Xem thêm" */
  countLabel: string;
  href: string;
  /** SVG fallback key when iconUrl missing */
  icon: CategoryIconKey;
  /** Uploaded / CDN icon — preferred over SVG */
  iconUrl?: string;
  /** Glow / accent color override */
  accentColor?: string;
};

export type WhyItem = {
  id: string;
  title: string;
  description: string;
  icon: "shield" | "bolt" | "price" | "card" | "support" | "refund";
};

export type SolutionItem = {
  id: string;
  title: string;
  description: string;
  art: "bars" | "trend" | "api" | "headset";
};

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  href: string;
  tag?: string;
  tagTone?: "win" | "ms" | "sec" | "adobe";
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: FaqCategoryId;
};

export type FooterColumn = {
  title: string;
  links: NavItem[];
};

export type PartnerItem = {
  id: string;
  name: string;
  /** Optional uploaded logo (`/uploads/...`) */
  logoUrl?: string;
  /** Brand accent for built-in / text mark */
  brandColor?: string;
  href?: string;
  visible?: boolean;
};

export type HomeContent = {
  navigation: NavItem[];
  /** Header brand — from CMS · Điều hướng */
  brand: {
    logoUrl?: string;
    brandName: string;
    tagline: string;
  };
  hero: HomeHero;
  partners: {
    title: string;
    badges: string[];
    items: PartnerItem[];
  };
  categories: {
    visible: boolean;
    title: string;
    viewAllHref: string;
    viewAllLabel: string;
    items: CategoryItem[];
  };
  /** @deprecated Prefer why — kept for CMS overlay compat */
  valueProps: {
    visible: boolean;
    items: ValueProp[];
  };
  /** @deprecated Prefer why — kept for CMS overlay compat */
  howItWorks: {
    visible: boolean;
    title: string;
    subtitle?: string;
    steps: HowItWorksStep[];
  };
  featured: {
    visible: boolean;
    title: string;
    subtitle?: string;
    viewAllHref: string;
    viewAllLabel: string;
    items: FeaturedProduct[];
  };
  why: {
    visible: boolean;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    items: WhyItem[];
    /** Square column (col 3) — from CMS banner.json */
    sideBanner?: {
      title: string;
      ctaLabel: string;
      ctaHref: string;
      imageUrl: string;
      visible: boolean;
    };
  };
  solutions: {
    visible: boolean;
    title: string;
    subtitle?: string;
    kicker?: string;
    ctaLabel?: string;
    ctaHref?: string;
    items: SolutionItem[];
  };
  news: {
    visible: boolean;
    title: string;
    subtitle?: string;
    viewAllHref: string;
    viewAllLabel: string;
    items: NewsItem[];
  };
  /** FAQ marked showOnHome in CMS */
  faqHome?: {
    visible: boolean;
    title: string;
    items: FaqItem[];
  };
  ctaBanner: {
    visible: boolean;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
  };
  footer: {
    blurb: string;
    columns: FooterColumn[];
    copyright: string;
    legalLinks: NavItem[];
    contactLines?: string[];
    supportEmail?: string;
    paymentBadges?: string[];
  };
};
