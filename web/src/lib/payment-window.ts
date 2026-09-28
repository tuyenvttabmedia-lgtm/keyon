/** QR display TTL is separate from the unpaid-order abandon window. */

export const PAYMENT_ABANDON_MS_DEFAULT = 24 * 60 * 60 * 1000;

export function isQrExpired(
  expiresAt: Date | string | null | undefined,
  now = Date.now(),
): boolean {
  if (expiresAt == null) return false;
  const t = typeof expiresAt === "string" ? new Date(expiresAt).getTime() : expiresAt.getTime();
  return Number.isFinite(t) && t < now;
}

/** Manual cancel only while the QR session is still open. */
export function canManualCancelOrder(input: {
  orderStatus: string;
  paymentStatus?: string | null;
  expiresAt: Date | string | null | undefined;
  now?: number;
}): boolean {
  if (input.orderStatus !== "PENDING_PAYMENT") return false;
  if (
    input.paymentStatus === "EXPIRED" ||
    input.paymentStatus === "CANCELLED" ||
    input.paymentStatus === "SUCCEEDED" ||
    input.paymentStatus === "FAILED"
  ) {
    return false;
  }
  return !isQrExpired(input.expiresAt, input.now);
}

/**
 * Close an unpaid order only after the abandon window, and never while the QR
 * session is still on screen.
 */
export function shouldAbandonUnpaid(input: {
  createdAt: Date;
  expiresAt: Date | null;
  now: number;
  abandonMs: number;
}): boolean {
  if (input.createdAt.getTime() + input.abandonMs > input.now) return false;
  if (input.expiresAt != null && input.expiresAt.getTime() > input.now) return false;
  return true;
}
