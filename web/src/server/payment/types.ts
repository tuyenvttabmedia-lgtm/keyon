import type { Payment } from "@prisma/client";

export type CreatePaymentInput = {
  orderId: string;
  amountVnd: number;
  paymentReference: string;
  description?: string;
};

export type CreatePaymentResult = {
  provider: string;
  redirectUrl?: string;
  /** Image URL for QR (VietQR / SePay bank mode) */
  qrImageUrl?: string;
  instructions: string;
  /** SePay PG hosted checkout */
  checkoutUrl?: string;
  checkoutFormFields?: Record<string, string>;
  integrationMode?: "payment_gateway" | "bank_webhook" | "stub";
  raw?: unknown;
};

export type VerifyWebhookInput = {
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
};

export type VerifyWebhookResult = {
  paymentReference: string;
  success: boolean;
  providerEventId?: string | null;
  providerTransactionId?: string | null;
  providerReference?: string | null;
  providerPaidAt?: Date | null;
  amountVnd?: number | null;
  rawPayload?: Record<string, string | number | boolean | null>;
};

/**
 * PaymentProvider — Outer Layer. Checkout gọi PaymentService.
 * Không đụng License Pool (ADR-004).
 */
export interface PaymentProvider {
  readonly name: string;
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  verifyWebhook?(input: VerifyWebhookInput): Promise<VerifyWebhookResult>;
  confirmDev?(paymentReference: string): Promise<Payment>;
}
