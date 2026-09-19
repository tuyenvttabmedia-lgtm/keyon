/** FAQ sidebar groups — scales many CMS categories without a flat 35-row list. */

export type FaqGroupId =
  | "mua-tren-keyon"
  | "sau-khi-mua"
  | "san-pham"
  | "su-co"
  | "doanh-nghiep";

export type FaqGroupDef = {
  id: FaqGroupId;
  label: string;
  /** Category ids belonging to this group (order = sidebar order). */
  categoryIds: string[];
};

/**
 * Groups for /faq navigation. Unknown CMS categories fall into the last group
 * that still makes sense, or a residual bucket under "sau-khi-mua".
 */
export const FAQ_GROUPS: FaqGroupDef[] = [
  {
    id: "mua-tren-keyon",
    label: "Mua trên KEYON",
    categoryIds: [
      "tong-quan-keyon",
      "account",
      "san-pham-license",
      "software-license",
      "mua-hang",
      "general",
      "payment",
    ],
  },
  {
    id: "sau-khi-mua",
    label: "Sau khi mua",
    categoryIds: [
      "nhan-kich-hoat-license",
      "quan-ly-license",
      "gia-han-thay-doi",
      "delivery",
      "doi-tra-hoan-tien",
      "bao-mat-chinh-sach",
      "ho-tro-khach-hang",
    ],
  },
  {
    id: "san-pham",
    label: "Sản phẩm & giải pháp",
    categoryIds: [
      "cloud-server",
      "security",
      "backup",
      "email-server",
      "saas",
    ],
  },
  {
    id: "su-co",
    label: "Sự cố & xử lý",
    categoryIds: [
      "loi-xu-ly-su-co",
      "thanh-toan-giao-dich",
      "don-hang-fulfillment",
      "license-kich-hoat-su-co",
      "cai-dat-phan-mem",
      "cloud-server-su-co",
      "email-server-su-co",
      "backup-restore-su-co",
      "api-tich-hop",
    ],
  },
  {
    id: "doanh-nghiep",
    label: "Doanh nghiệp",
    categoryIds: [
      "doanh-nghiep-dai-ly-api",
      "doanh-nghiep-b2b",
      "mua-so-luong-lon",
      "reseller-dai-ly",
      "partner-hop-tac",
      "bao-gia-quotation",
      "procurement-doanh-nghiep",
      "api-doanh-nghiep",
      "enterprise-quan-tri",
    ],
  },
];

/** Strip CMS paths / raw URLs from descriptions shown on the storefront. */
export function sanitizeFaqDescription(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw
    .replace(/https?:\/\/[^\s)]+/gi, "")
    .replace(
      /\s*\/(?:contact|business|products|account|policy|faq|admin|api|solutions|support)[/\w.-]*/gi,
      "",
    )
    .replace(/\s{2,}/g, " ")
    .replace(/\s([.,;:!?])/g, "$1")
    .replace(/\s*—\s*—+/g, " —")
    .trim()
    .replace(/^[\s·|,—-]+|[\s·|,—-]+$/g, "")
    .trim();
}

/**
 * Prefer actionable FAQ titles for popular chips (not "X là gì?" definitions).
 */
const POPULAR_ACTION_HINTS = [
  /thanh toán/i,
  /chưa (nhận|thấy|cập nhật)/i,
  /license/i,
  /kích hoạt/i,
  /hoàn tiền/i,
  /mật khẩu/i,
  /báo giá/i,
  /đơn hàng/i,
  /hủy đơn/i,
  /liên hệ/i,
  /otp/i,
  /vietqr|chuyển khoản/i,
  /tài khoản/i,
  /spam/i,
];

const POPULAR_AVOID = /^(KEYON|SaaS|Cloud|Backup|Email|Security|License|SKU|API|SPF) .*là gì\?$/i;

export function pickPopularFaqItems<
  T extends { id: string; question: string; popular?: boolean },
>(items: T[], limit: number): T[] {
  const flagged = items.filter((i) => i.popular);
  const pool = flagged.length > 0 ? flagged : items;

  const scored = pool
    .map((item, index) => {
      let score = item.popular ? 20 : 0;
      if (POPULAR_AVOID.test(item.question.trim())) score -= 30;
      if (/là gì\?$/i.test(item.question)) score -= 12;
      for (const re of POPULAR_ACTION_HINTS) {
        if (re.test(item.question)) score += 8;
      }
      return { item, score, index };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const picked: T[] = [];
  const seen = new Set<string>();
  for (const row of scored) {
    if (picked.length >= limit) break;
    if (seen.has(row.item.id)) continue;
    // Skip remaining pure definitions if we already have enough action items
    if (
      picked.length >= Math.ceil(limit / 2) &&
      /là gì\?$/i.test(row.item.question)
    ) {
      continue;
    }
    seen.add(row.item.id);
    picked.push(row.item);
  }

  if (picked.length < limit) {
    for (const item of pool) {
      if (picked.length >= limit) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      picked.push(item);
    }
  }

  return picked;
}

export function groupCategoriesForSidebar<
  T extends { id: string },
>(categories: T[]): { group: FaqGroupDef; categories: T[] }[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const used = new Set<string>();
  const result: { group: FaqGroupDef; categories: T[] }[] = [];

  for (const group of FAQ_GROUPS) {
    const cats: T[] = [];
    for (const id of group.categoryIds) {
      const hit = byId.get(id);
      if (hit && !used.has(id)) {
        cats.push(hit);
        used.add(id);
      }
    }
    if (cats.length > 0) result.push({ group, categories: cats });
  }

  const orphan = categories.filter((c) => !used.has(c.id));
  if (orphan.length > 0) {
    result.push({
      group: {
        id: "sau-khi-mua",
        label: "Khác",
        categoryIds: orphan.map((c) => c.id),
      },
      categories: orphan,
    });
  }

  return result;
}

export function findGroupIdForCategory(categoryId: string): FaqGroupId | null {
  for (const g of FAQ_GROUPS) {
    if (g.categoryIds.includes(categoryId)) return g.id;
  }
  return null;
}

/**
 * Six homepage FAQs — buyer questions, not definitions or “how to contact”.
 * Order is the display order on Home.
 */
export const HOME_FAQ_QUESTIONS = [
  "KEYON là gì?",
  "KEYON hỗ trợ những phương thức thanh toán nào?",
  "Sau khi thanh toán tôi nhận license ở đâu?",
  "Tôi có cần tạo tài khoản để mua hàng không?",
  "KEYON có hoàn tiền không?",
  "Tôi đã thanh toán nhưng đơn hàng vẫn chưa được cập nhật?",
] as const;

export function pickHomeFaqs<T extends { question: string; showOnHome?: boolean }>(
  items: T[],
  limit = 6,
): T[] {
  const marked = items.filter((i) => i.showOnHome);
  const pool = marked.length > 0 ? marked : items;
  const byQuestion = new Map(pool.map((i) => [i.question, i]));
  const picked: T[] = [];
  const seen = new Set<T>();
  for (const q of HOME_FAQ_QUESTIONS) {
    const hit = byQuestion.get(q);
    if (hit && !seen.has(hit)) {
      picked.push(hit);
      seen.add(hit);
    }
    if (picked.length >= limit) return picked;
  }
  for (const item of pool) {
    if (picked.length >= limit) break;
    if (seen.has(item)) continue;
    seen.add(item);
    picked.push(item);
  }
  return picked;
}
