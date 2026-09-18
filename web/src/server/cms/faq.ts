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
  const items = normalizeItems(doc.items ?? []);
  const categories = normalizeCategories(doc.categories);
  return {
    categories: mergeCategoriesFromItems(
      categories.length ? categories : defaultCmsFaqCategories,
      items,
    ),
    items,
  };
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
      category: slugifyFaqCategory(String(r.category ?? "general")),
      showOnHome: Boolean(r.showOnHome),
      showOnFaqPage: r.showOnFaqPage !== false,
    }));
}

/** Ensure every item.category has a category row (orphan → "Chung" label). */
function mergeCategoriesFromItems(
  categories: CmsFaqCategoryDef[],
  items: CmsFaqItem[],
): CmsFaqCategoryDef[] {
  const map = new Map(categories.map((c) => [c.id, c]));
  for (const item of items) {
    const id = item.category || "general";
    if (!map.has(id)) {
      map.set(id, {
        id,
        label: id === "general" ? "Chung" : id,
        description: undefined,
      });
    }
  }
  if (!map.has("general")) {
    map.set("general", {
      id: "general",
      label: "Chung",
      description: "KEYON bán gì, chính sách",
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
