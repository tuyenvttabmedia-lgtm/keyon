/**
 * GA4 / GTM ecommerce helpers (client-only).
 * Prefer dataLayer (GTM) + gtag when present. Safe no-op without analytics.
 */

export type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function pushGa4Event(
  event: string,
  params: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
    transaction_id?: string;
  },
) {
  if (typeof window === "undefined") return;

  const payload: Record<string, unknown> = {
    currency: params.currency,
    value: params.value,
    items: params.items,
  };
  if (params.transaction_id) {
    payload.transaction_id = params.transaction_id;
  }

  window.dataLayer = window.dataLayer || [];
  // GA4 ecommerce: clear previous then push (GTM + gtag both read this).
  window.dataLayer.push({ ecommerce: null });
  window.dataLayer.push({ event, ecommerce: payload });

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }
}

export function trackViewItem(input: {
  items: AnalyticsItem[];
  value: number;
}) {
  pushGa4Event("view_item", {
    currency: "VND",
    value: input.value,
    items: input.items,
  });
}

export function trackBeginCheckout(input: {
  items: AnalyticsItem[];
  value: number;
}) {
  pushGa4Event("begin_checkout", {
    currency: "VND",
    value: input.value,
    items: input.items,
  });
}

export function trackPurchase(input: {
  transactionId: string;
  items: AnalyticsItem[];
  value: number;
}) {
  if (typeof window === "undefined") return;
  const key = `keyon_purchase_${input.transactionId}`;
  try {
    if (sessionStorage.getItem(key) === "1") return;
    sessionStorage.setItem(key, "1");
  } catch {
    // private mode / blocked storage — still fire once this mount
  }
  pushGa4Event("purchase", {
    currency: "VND",
    value: input.value,
    items: input.items,
    transaction_id: input.transactionId,
  });
}
