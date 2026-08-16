import { parseVndAmount } from "../amount";

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
