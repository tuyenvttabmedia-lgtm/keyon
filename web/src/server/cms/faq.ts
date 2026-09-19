import "server-only";

import {
  defaultCmsFaq,
  defaultCmsFaqCategories,
  type CmsFaqCategoryDef,
  type CmsFaqDocument,
  type CmsFaqItem,
} from "@/server/cms/types";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isFaqCategorySlug(id: string): boolean {
  return SLUG_RE.test(id) && id.length <= 48;
}

export function slugifyFaqCategory(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return s || "general";
}

/** Accept legacy array or { categories, items } document. */
export function normalizeFaqDocument(raw: unknown): CmsFaqDocument {
  if (Array.isArray(raw)) {
    const items = normalizeItems(raw);
    return {
      categories: mergeCategoriesFromItems(defaultCmsFaqCategories, items),
      items,
    };
  }
  if (!raw || typeof raw !== "object") {
    return structuredClone(defaultCmsFaq);
  }
  const doc = raw as Partial<CmsFaqDocument>;
  const categories = normalizeCategories(doc.categories);
  const baseCats =
    categories.length > 0 ? categories : defaultCmsFaqCategories;
  const items = normalizeItems(doc.items ?? []).map((item) => ({
    ...item,
    category: resolveCategoryId(item.category, baseCats),
  }));
  return {
    categories: mergeCategoriesFromItems(baseCats, items),
    items,
  };
}

/** Map slug or label → known category id. */
export function resolveCategoryId(
  raw: string | undefined,
  categories: CmsFaqCategoryDef[],
): string {
  const value = (raw ?? "").trim();
  if (!value) {
    return categories.some((c) => c.id === "mua-hang")
      ? "mua-hang"
      : categories[0]?.id ?? "general";
  }
  const legacy: Record<string, string> = {
    general: "mua-hang",
    delivery: "gia-han-thay-doi",
  };
  const mapped = legacy[value] ?? value;
  const byId = categories.find((c) => c.id === mapped);
  if (byId) return byId.id;
  const byLegacy = categories.find((c) => c.id === value);
  if (byLegacy) return byLegacy.id;
  const slug = slugifyFaqCategory(mapped);
  const bySlug = categories.find((c) => c.id === slug);
  if (bySlug) return bySlug.id;
  const byLabel = categories.find(
    (c) => c.label.trim().toLowerCase() === value.toLowerCase(),
  );
  if (byLabel) return byLabel.id;
  const byLabelSlug = categories.find(
    (c) => slugifyFaqCategory(c.label) === slug,
  );
  if (byLabelSlug) return byLabelSlug.id;
  return slug || categories[0]?.id || "general";
}

function normalizeCategories(raw: unknown): CmsFaqCategoryDef[] {
  if (!Array.isArray(raw)) return [];
  const out: CmsFaqCategoryDef[] = [];
  const seen = new Set<string>();
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const r = row as Record<string, unknown>;
    const id = slugifyFaqCategory(String(r.id ?? r.slug ?? ""));
    if (!isFaqCategorySlug(id) || seen.has(id)) continue;
    const label = String(r.label ?? "").trim();
    if (!label) continue;
    seen.add(id);
    out.push({
      id,
      label: label.slice(0, 80),
      description: String(r.description ?? "").trim().slice(0, 200) || undefined,
    });
  }
  return out;
}

function normalizeItems(raw: unknown): CmsFaqItem[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((row): row is Record<string, unknown> => !!row && typeof row === "object")
    .map((r, i) => ({
      id: String(r.id ?? `q_${i + 1}`).trim() || `q_${i + 1}`,
      question: String(r.question ?? "").trim(),
      answer: String(r.answer ?? "").trim(),
      category: slugifyFaqCategory(String(r.category ?? "mua-hang")),
      showOnHome: Boolean(r.showOnHome),
      showOnFaqPage: r.showOnFaqPage !== false,
    }));
}

/** Ensure every item.category has a category row. */
function mergeCategoriesFromItems(
  categories: CmsFaqCategoryDef[],
  items: CmsFaqItem[],
): CmsFaqCategoryDef[] {
  const map = new Map(categories.map((c) => [c.id, c]));
  for (const item of items) {
    const id = item.category || "mua-hang";
    if (!map.has(id)) {
      map.set(id, {
        id,
        label:
          id === "mua-hang"
            ? "Mua hàng"
            : id === "general"
              ? "Chung"
              : id,
        description: undefined,
      });
    }
  }
  if (map.size === 0) {
    map.set("mua-hang", {
      id: "mua-hang",
      label: "Mua hàng",
      description: "Quy trình đặt mua trên KEYON",
    });
  }
  // Keep declared order, then any orphaned at end
  const ordered: CmsFaqCategoryDef[] = [];
  for (const c of categories) {
    const hit = map.get(c.id);
    if (hit) {
      ordered.push(hit);
      map.delete(c.id);
    }
  }
  for (const c of map.values()) ordered.push(c);
  return ordered;
}
