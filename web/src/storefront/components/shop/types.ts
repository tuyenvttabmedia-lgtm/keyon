import type { FeaturedProduct, ReceiveKind } from "@/storefront/content/types";

export type ShopCategoryId =
  | "windows"
  | "office"
  | "adobe"
  | "cloud"
  | "security"
  | "other";

export type ShopLicenseType = "retail" | "oem" | "volume" | "subscription";
export type ShopPlatform = "windows" | "macos" | "linux" | "android";
export type ShopSort = "newest" | "price_asc" | "price_desc" | "name";
export type ShopViewMode = "grid" | "list";

export type ShopProduct = FeaturedProduct & {
  deliveryActionLabel: string;
  deliveryKind?: "instant" | "manual";
  highlights?: string[];
  /** Compare-at price for strikethrough (optional). */
  compareAtPriceVnd?: number;
  discountPercent?: number;
  categoryId: ShopCategoryId;
  licenseTypes: ShopLicenseType[];
  platforms: ShopPlatform[];
  /** Stable sort seed when DB has no createdAt on mapped DTO */
  sortIndex?: number;
};

export type ShopCategoryMeta = {
  id: ShopCategoryId;
  title: string;
  count: number;
};

export type ShopFilterOption<T extends string> = {
  id: T;
  label: string;
  count: number;
};

export type ShopCatalogProps = {
  products: ShopProduct[];
  categories: ShopCategoryMeta[];
  initialCategory?: string;
  initialQuery?: string;
};

export type { ReceiveKind };
