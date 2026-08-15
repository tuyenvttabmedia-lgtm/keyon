export const PAGE_SIZES = [20, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];

export type OrdersFilterChip =
  | "all"
  | "awaiting_payment"
  | "awaiting_fulfillment"
  | "fulfilling"
  | "needs_action"
  | "completed"
  | "cancelled";

export type DatePreset =
  | "all"
  | "today"
  | "yesterday"
  | "last7"
  | "last30"
  | "thisMonth"
  | "lastMonth"
  | "custom";

/** Customer-facing receive filter — never INSTANT/MANUAL enums */
export type ReceiveFilter = "all" | "key" | "account" | "activation";

export type SalesMotionFilter = "all" | "SELF_SERVE" | "QUOTE_REQUIRED";

export type OrdersListQuery = {
  q?: string;
  chip?: OrdersFilterChip;
  date?: DatePreset;
  from?: string; // YYYY-MM-DD
  to?: string;
  brandId?: string;
  productId?: string;
  receive?: ReceiveFilter;
  /** Payment.provider */
  provider?: string;
  salesMotion?: SalesMotionFilter;
  /** Inclusive VND bounds */
  minVnd?: string;
  maxVnd?: string;
  /** Company name (QuoteRequest) or email domain — not a Core Company id. */
  company?: string;
  /** PO / contract text on OrderNote commercial marker. */
  ref?: string;
  page?: number;
  pageSize?: PageSize;
};

/** Compact timeline for list hover — no extra fetch */
export type OrderTimelinePreview = {
  createdAt: string | Date;
  paidAt: string | Date | null;
  fulfillmentAt: string | Date | null;
  deliveredAt: string | Date | null;
};

export type AdminOrderListRow = {
  id: string;
  code: string;
  email: string;
  userId: string | null;
  status: string;
  totalVnd: number;
  createdAt: string | Date;
  itemTitles: string[];
  itemCount: number;
  brandName: string | null;
  productName: string | null;
  strategy: string | null;
  deliverableType: string | null;
  receiveLabel: string;
  salesMotion: string | null;
  paymentStatus: string | null;
  paymentReference: string | null;
  paymentProvider: string | null;
  paymentExpired: boolean;
  hasDelivery: boolean;
  primaryDeliveryId: string | null;
  jobStatus: string | null;
  waitingInbox: boolean;
  timeline: OrderTimelinePreview;
  /** Quote company name, else email domain. */
  companyLabel: string;
  /** Latest staff PO/HĐ from OrderNote — not Order columns. */
  commercialLabel: string | null;
};

/** Relative age for ops prioritization */
export function formatOrderAge(createdAt: string | Date, now = Date.now()): string {
  const t = typeof createdAt === "string" ? new Date(createdAt).getTime() : createdAt.getTime();
  if (Number.isNaN(t)) return "—";
  const sec = Math.max(0, Math.floor((now - t) / 1000));
  if (sec < 60) return `${sec} giây`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr} giờ`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} ngày`;
  const month = Math.floor(day / 30);
  return `${month} tháng`;
}
