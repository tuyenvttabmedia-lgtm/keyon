import type { FaqCategoryMeta } from "@/storefront/content/faq-categories";
import type { FaqItem } from "@/storefront/content/types";

/** Must match FaqSupportView PAGE_SIZE. */
export const FAQ_PAGE_SIZE = 12;

const LEGACY_CATEGORY: Record<string, string> = {
  general: "mua-hang",
  delivery: "gia-han-thay-doi",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function resolveCategoryId(
  raw: string | null | undefined,
  categories: FaqCategoryMeta[],
): string | null {
  if (!raw) return null;
  const mapped = LEGACY_CATEGORY[raw] ?? raw;
  return categories.some((c) => c.id === mapped) ? mapped : null;
}

/**
 * FAQ items currently visible in the UI (category/search + page) —
 * for FAQPage JSON-LD so schema matches rendered content.
 */
export function selectFaqVisibleItems(input: {
  categories: FaqCategoryMeta[];
  items: FaqItem[];
  query?: string;
  category?: string | null;
  page?: number;
}): FaqItem[] {
  const { categories, items } = input;
  const q = (input.query ?? "").trim();
  const searching = q.length >= 2;
  const page = Math.max(1, input.page ?? 1);

  const counts: Record<string, number> = Object.fromEntries(
    categories.map((c) => [c.id, 0]),
  );
  for (const item of items) {
    const raw = item.category ?? "mua-hang";
    const cat = LEGACY_CATEGORY[raw] ?? raw;
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  const resolved = resolveCategoryId(input.category, categories);
  const activeCategory =
    resolved && categories.some((c) => c.id === resolved)
      ? resolved
      : categories.find((c) => (counts[c.id] ?? 0) > 0)?.id ??
        categories[0]?.id ??
        "mua-hang";

  const filtered = searching
    ? items.filter(
        (item) =>
          normalize(item.question).includes(normalize(q)) ||
          normalize(item.answer).includes(normalize(q)),
      )
    : items.filter((item) => {
        const raw = item.category ?? "mua-hang";
        return (LEGACY_CATEGORY[raw] ?? raw) === activeCategory;
      });

  const totalPages = Math.max(1, Math.ceil(filtered.length / FAQ_PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  return filtered.slice(
    (safePage - 1) * FAQ_PAGE_SIZE,
    safePage * FAQ_PAGE_SIZE,
  );
}
