import "server-only";

import type {
  CmsCategories,
  CmsCategoryIconKey,
  CmsCategoryItem,
} from "@/server/cms/types";
import { defaultCmsCategories } from "@/server/cms/types";
import {
  PRODUCT_CATEGORY_KEYS,
  type ProductCategoryKey,
} from "@/storefront/lib/product-cms";
import { CATEGORY_LABELS } from "@/storefront/components/shop/shop-utils";
import { categoryHref } from "@/storefront/lib/shop-catalog";

const KEY_SET = new Set<string>(PRODUCT_CATEGORY_KEYS);

export const HOME_CATEGORY_ACCENTS: Record<ProductCategoryKey, string> = {
  windows: "#2563EB",
  office: "#EA580C",
  adobe: "#E11D48",
  security: "#0EA5A4",
  backup: "#1A73E8",
  cloud: "#0284C7",
  autodesk: "#0696D7",
  other: "#64748B",
};

export function isProductCategoryKey(raw: string): raw is ProductCategoryKey {
  return KEY_SET.has(raw);
}

/** Infer catalog key from legacy CMS fields (categoryKey → iconKey → href). */
export function inferCategoryKeyFromLegacy(item: {
  categoryKey?: string | null;
  iconKey?: string | null;
  href?: string | null;
}): ProductCategoryKey | null {
  const direct = item.categoryKey?.trim();
  if (direct && isProductCategoryKey(direct)) return direct;

  const icon = item.iconKey?.trim();
  if (icon && isProductCategoryKey(icon)) return icon;

  const href = item.href?.trim() ?? "";
  const m = href.match(/\/categories\/([a-z0-9-]+)/i);
  if (m?.[1] && isProductCategoryKey(m[1].toLowerCase())) {
    return m[1].toLowerCase() as ProductCategoryKey;
  }
  return null;
}

export function buildHomeCategoryItem(
  categoryKey: ProductCategoryKey,
  partial?: Partial<CmsCategoryItem> & { id?: string; sortOrder?: number },
): CmsCategoryItem {
  const title =
    partial?.title?.trim() || CATEGORY_LABELS[categoryKey] || categoryKey;
  const iconKey = (partial?.iconKey && isProductCategoryKey(partial.iconKey)
    ? partial.iconKey
    : categoryKey) as CmsCategoryIconKey;
  return {
    id: partial?.id ?? `c_${categoryKey}`,
    categoryKey,
    title: title.slice(0, 24),
    countLabel: `${0} sản phẩm`,
    href: categoryHref(categoryKey),
    iconUrl: partial?.iconUrl,
    accentColor:
      partial?.accentColor?.trim() || HOME_CATEGORY_ACCENTS[categoryKey],
    iconKey,
    visible: partial?.visible !== false,
    sortOrder: partial?.sortOrder ?? 0,
  };
}

type LegacyItem = Partial<CmsCategoryItem> & {
  id?: string;
  title?: string;
  countLabel?: string;
  href?: string;
  iconUrl?: string;
  accentColor?: string;
  iconKey?: string;
  categoryKey?: string;
  visible?: boolean;
  sortOrder?: number;
};

/**
 * Normalize Home categories CMS → catalog-driven.
 * Drops items that cannot map to a PRODUCT_CATEGORY_KEY; dedupes by key.
 */
export function normalizeCmsCategories(
  raw: unknown,
): CmsCategories {
  const base =
    raw && typeof raw === "object"
      ? (raw as Partial<CmsCategories>)
      : {};
  const incoming = Array.isArray(base.items)
    ? (base.items as LegacyItem[])
    : defaultCmsCategories.items;

  const seen = new Set<string>();
  const items: CmsCategoryItem[] = [];

  const sorted = [...incoming].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  for (const row of sorted) {
    const key = inferCategoryKeyFromLegacy(row);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    items.push(
      buildHomeCategoryItem(key, {
        id: row.id,
        title: row.title,
        iconUrl: row.iconUrl,
        accentColor: row.accentColor,
        iconKey: row.iconKey as CmsCategoryIconKey | undefined,
        visible: row.visible,
        sortOrder: items.length,
      }),
    );
  }

  // Empty after migrate → fall back to defaults (all catalog keys).
  const finalItems =
    items.length > 0
      ? items
      : defaultCmsCategories.items.map((it, i) =>
          buildHomeCategoryItem(it.categoryKey, { ...it, sortOrder: i }),
        );

  return {
    title: base.title?.trim() || defaultCmsCategories.title,
    viewAllHref: base.viewAllHref?.trim() || defaultCmsCategories.viewAllHref,
    viewAllLabel:
      base.viewAllLabel?.trim() || defaultCmsCategories.viewAllLabel,
    items: finalItems.slice(0, 8).map((it, i) => ({ ...it, sortOrder: i })),
  };
}
