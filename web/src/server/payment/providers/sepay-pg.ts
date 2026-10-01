import { createHmac } from "crypto";

export type SepayPgEnvironment = "sandbox" | "production";
export type SepayPgPaymentMethod = "BANK_TRANSFER" | "NAPAS_BANK_TRANSFER";

const CHECKOUT_URLS: Record<SepayPgEnvironment, string> = {
  sandbox: "https://pay-sandbox.sepay.vn/v1/checkout/init",
  production: "https://pay.sepay.vn/v1/checkout/init",
};

/**
 * SePay signs only these fields, in this order.
 * https://developer.sepay.vn/vi/cong-thanh-toan/API/don-hang/form-thanh-toan
 * Do not sort or reorder — a different order is an invalid signature.
 */
const SIGNED_FIELD_ORDER = [
  "order_amount",
  "merchant",
  "currency",
  "operation",
  "order_description",
  "order_invoice_number",
  "customer_id",
  "payment_method",
  "success_url",
  "error_url",
  "cancel_url",
] as const;

export type SepayPgCheckoutParams = {
  merchantId: string;
  merchantSecretKey: string;
  paymentMethod: SepayPgPaymentMethod;
  orderInvoiceNumber: string;
  orderAmount: number;
  orderDescription: string;
  successUrl: string;
  errorUrl: string;
  cancelUrl: string;
  customerId?: string;
};

export function getSepayPgCheckoutUrl(environment: SepayPgEnvironment): string {
  return CHECKOUT_URLS[environment];
}

export function signSepayPgFields(
  fields: Record<string, string | number | undefined>,
  secretKey: string,
): string {
  const signed: string[] = [];
  for (const field of SIGNED_FIELD_ORDER) {
    if (!(field in fields)) continue;
    const value = fields[field];
    if (value === undefined || value === null) continue;
    signed.push(`${field}=${String(value)}`);
  }
  return createHmac("sha256", secretKey)
    .update(signed.join(","))
    .digest("base64");
}

export function buildSepayPgCheckoutFields(
  params: SepayPgCheckoutParams,
): Record<string, string> {
  const baseFields: Record<string, string | number> = {
    merchant: params.merchantId,
    operation: "PURCHASE",
    payment_method: params.paymentMethod,
    order_amount: Math.round(params.orderAmount),
    currency: "VND",
    order_invoice_number: params.orderInvoiceNumber,
    order_description: params.orderDescription,
    success_url: params.successUrl,
    error_url: params.errorUrl,
    cancel_url: params.cancelUrl,
  };
  if (params.customerId?.trim()) {
    baseFields.customer_id = params.customerId.trim();
  }

  const signature = signSepayPgFields(baseFields, params.merchantSecretKey);
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(baseFields)) {
    result[key] = String(value);
  }
  result.signature = signature;
  return result;
}
