import type { ShopCategoryId, ShopProduct } from "@/storefront/components/shop/types";
import type { ReceiveKind } from "@/storefront/content/types";
import type { resolveLicensePresentation } from "@/storefront/lib/license-catalog";

export type PdpVariantOption = {
  id: string;
  name: string;
  priceVnd: number;
  compareAtPriceVnd?: number;
  discountPercent?: number;
  deliveryLabel: string;
  receiveLabel: string;
  receiveKind: ReceiveKind;
  slaPromise?: string | null;
  canBuy: boolean;
  fulfillmentInstant: boolean;
  quoteRequired?: boolean;
  licenseChannel?: string | null;
  licenseTerm?: string | null;
  seatsLabel?: string | null;
  regionCode?: string | null;
  activationMethod?: string | null;
};

export type PdpLicenseDefaults = {
  licenseChannelDefault?: string | null;
  licenseTermDefault?: string | null;
  seatsDefault?: string | null;
  activationMethodDefault?: string | null;
  platforms?: unknown;
  language?: string | null;
  transferPolicy?: string | null;
  upgradePolicy?: string | null;
  accountRequired?: string | null;
};

export type PdpLicensePresentation = ReturnType<typeof resolveLicensePresentation>;

export type PdpProductData = {
  slug: string;
  name: string;
  description: string;
  /** Lead under title when set in admin */
  shortDescription?: string;
  brandName: string;
  categoryId: ShopCategoryId;
  categoryLabel: string;
  /** Null/undefined = không hiện social proof giả */
  rating?: number | null;
  reviewCount?: number | null;
  soldCount?: number | null;
  mark?: ShopProduct["mark"];
  /** Gallery URLs from CMS (main + thumbs). Empty → demo art. */
  galleryUrls: string[];
  imageUrl?: string | null;
  variants: PdpVariantOption[];
  initialVariantId: string;
  features: string[];
  specs: { label: string; value: string }[];
  systemSpecs: { label: string; value: string }[];
  licenseDefaults: PdpLicenseDefaults;
  /** Rich HTML for «Hướng dẫn sử dụng» tab (empty → empty state) */
  usageGuideHtml: string;
  faqs: { id: string; question: string; answer: string }[];
  related: ShopProduct[];
  defaultEmail: string;
  loggedIn: boolean;
};

export type PdpTabId =
  | "description"
  | "details"
  | "guide"
  | "reviews"
  | "faq";
