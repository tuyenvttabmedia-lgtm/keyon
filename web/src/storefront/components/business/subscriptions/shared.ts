/** Shared links & labels for Subscriptions landing — no fake metrics. */

export const SUB_CONSULT_HREF =
  "/contact/quote?intent=subscription-consult&requestType=SUBSCRIPTION";
export const SUB_BUSINESS_HREF = "/contact/quote?intent=business";
export const HOW_IT_WORKS_HREF = "/how-it-works";
export const ACCOUNT_ASSETS_HREF = "/account/assets";
export const PRODUCTS_HREF = "/products";

export const SAMPLE_SUBSCRIPTIONS = [
  { name: "Productivity Suite", status: "renewal" as const, statusLabel: "Sắp đến kỳ gia hạn" },
  { name: "Creative Software", status: "active" as const, statusLabel: "Đang hoạt động" },
  { name: "Business Security", status: "review" as const, statusLabel: "Cần xem xét" },
] as const;
