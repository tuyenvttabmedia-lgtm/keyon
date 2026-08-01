/** In-process KPI counters — Monitoring sprint can persist later. */
export const paymentKpis = {
  webhook_total: 0,
  webhook_duplicate: 0,
  webhook_retry: 0,
  webhook_processing_ms_sum: 0,
  webhook_processing_count: 0,
  payment_succeeded: 0,
  payment_failed: 0,
  fulfillment_ms_sum: 0,
  fulfillment_count: 0,
};

export function recordWebhookProcessed(ms: number, duplicate: boolean) {
  paymentKpis.webhook_total++;
  if (duplicate) {
    paymentKpis.webhook_duplicate++;
    paymentKpis.webhook_retry++;
  }
  paymentKpis.webhook_processing_ms_sum += ms;
  paymentKpis.webhook_processing_count++;
}

export function paymentSuccessRate(): number | null {
  const ok = paymentKpis.payment_succeeded;
  const fail = paymentKpis.payment_failed;
  const n = ok + fail;
  if (n === 0) return null;
  return ok / n;
}

export function avgWebhookMs(): number | null {
  if (paymentKpis.webhook_processing_count === 0) return null;
  return paymentKpis.webhook_processing_ms_sum / paymentKpis.webhook_processing_count;
}

export function avgFulfillmentMs(): number | null {
  if (paymentKpis.fulfillment_count === 0) return null;
  return paymentKpis.fulfillment_ms_sum / paymentKpis.fulfillment_count;
}
