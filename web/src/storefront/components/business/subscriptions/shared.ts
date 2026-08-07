/** Shared links, labels, and section rhythm for Subscriptions landing. */

export const SUB_CONSULT_HREF =
  "/contact/quote?intent=subscription-consult&requestType=SUBSCRIPTION";
export const SUB_BUSINESS_HREF = "/contact/quote?intent=business";
export const HOW_IT_WORKS_HREF = "/how-it-works";
export const ACCOUNT_ASSETS_HREF = "/account/assets";
export const PRODUCTS_HREF = "/products";

/** Consistent section vertical rhythm (matches Volume / Business landings). */
export const SECTION_PAD = "py-10 md:py-12 lg:py-14" as const;

export const SAMPLE_SUBSCRIPTIONS = [
  { name: "Productivity Suite", status: "renewal" as const, statusLabel: "Sắp đến kỳ gia hạn" },
  { name: "Creative Software", status: "active" as const, statusLabel: "Đang hoạt động" },
  { name: "Business Security", status: "review" as const, statusLabel: "Cần xem xét" },
] as const;

/** Interactive marketing card surface — lift + hairline shadow. */
export const CARD_SURFACE =
  "rounded-2xl border border-border bg-white" as const;
