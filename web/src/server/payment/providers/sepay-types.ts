import { randomInt } from "crypto";
import { parseVndAmount } from "../amount";

/**
 * Company payment-code pattern on SePay (prefix DH, suffix 6–8 digits).
 * The Keyon webhook only delivers transfers whose `code` starts with DH.
 * @see https://developer.sepay.vn/vi/sepay-webhooks/cau-hinh-ma-thanh-toan
 */
export function generateSepayPaymentCode(): string {
  const suffix = String(randomInt(0, 100_000_000)).padStart(8, "0");
  return `DH${suffix}`;
}

/** SePay field `code`, or the same token inside raw transfer content. */
export function extractSepayPaymentCode(input: {
  code?: unknown;
  content?: unknown;
}): string {
  const code = String(input.code ?? "").trim();
  if (/^DH\d{6,8}$/i.test(code)) return code.toUpperCase();
  const content = String(input.content ?? "");
  const found = content.match(/\b(DH\d{6,8})\b/i);
  if (found) return found[1]!.toUpperCase();
  if (code && !/\s/.test(code)) return code;
  return "";
}

export { parseVndAmount };

export type SepayPgIpnPayload = {
  timestamp?: number;
  notification_type?: string;
  order?: {
    order_invoice_number?: string;
    order_amount?: string;
    order_status?: string;
  };
  transaction?: {
    transaction_id?: string;
    transaction_status?: string;
    transaction_amount?: string;
  };
};

export function isSepayPgIpnPayload(payload: unknown): payload is SepayPgIpnPayload {
  return (
    !!payload &&
    typeof payload === "object" &&
    !Array.isArray(payload) &&
    "notification_type" in payload
  );
}

export function mapSepayPgIpn(payload: SepayPgIpnPayload): {
  paymentReference: string;
  success: boolean;
  amountVnd: number | null;
  providerTransactionId: string | null;
} {
  const paymentReference = payload.order?.order_invoice_number?.trim() ?? "";
  const txStatus = payload.transaction?.transaction_status?.toUpperCase() ?? "";
  const notificationType = payload.notification_type?.toUpperCase() ?? "";

  const amountRaw =
    payload.order?.order_amount ?? payload.transaction?.transaction_amount ?? null;
  const amountVnd = parseVndAmount(amountRaw);

  const providerTransactionId = payload.transaction?.transaction_id
    ? String(payload.transaction.transaction_id)
    : null;

  if (
    notificationType === "ORDER_PAID" &&
    txStatus === "APPROVED" &&
    paymentReference
  ) {
    return {
      paymentReference,
      success: true,
      amountVnd,
      providerTransactionId,
    };
  }

  return {
    paymentReference,
    success: false,
    amountVnd,
    providerTransactionId,
  };
}
