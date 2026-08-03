import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyWebhookInput,
  VerifyWebhookResult,
} from "../types";
import { AppError } from "@/lib/errors";
import { resolvePayment } from "../config";
import {
  buildSepayPgCheckoutFields,
  getSepayPgCheckoutUrl,
} from "./sepay-pg";
import {
  verifySepayApiKey,
  verifySepayHmacSignature,
  verifySepayPgIpnSecret,
} from "./sepay-auth";
import { isSepayPgIpnPayload, mapSepayPgIpn } from "./sepay-types";

function appBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "https://keyon.vn").replace(/\/$/, "");
}

/**
 * SePay — một phương thức theo môi trường:
 * - sandbox → Cổng thanh toán PG (form checkout + IPN X-Secret-Key)
 * - production → VietQR + webhook bank HMAC-SHA256
 */
export const sepayPaymentProvider: PaymentProvider = {
  name: "sepay",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { sepay } = await resolvePayment();

    if (sepay.mode === "payment_gateway") {
      return createPgCheckout(input, sepay);
    }
    return createBankQr(input, sepay);
  },

  async verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult> {
    const { sepay } = await resolvePayment();
    const body = (input.body ?? {}) as Record<string, unknown>;
    const rawBody =
      typeof body._rawBody === "string"
        ? body._rawBody
        : JSON.stringify(body);

    if (sepay.mode === "payment_gateway") {
      return verifyPgIpn(input.headers, body, sepay.ipnSecretKey);
    }
    return verifyBankWebhook(input.headers, body, rawBody, sepay);
  },
};

async function createPgCheckout(
  input: CreatePaymentInput,
  sepay: Awaited<ReturnType<typeof resolvePayment>>["sepay"],
): Promise<CreatePaymentResult> {
  if (!sepay.merchantId || !sepay.merchantSecretKey) {
    throw new AppError(
      "SePay PG sandbox chưa cấu hình (cần Merchant ID + Secret Key)",
      501,
      "PAYMENT_NOT_CONFIGURED",
    );
  }

  const base = appBaseUrl();
  const orderPath = `${base}/checkout/${input.orderId}`;
  const checkoutUrl = getSepayPgCheckoutUrl(sepay.environment);
  const checkoutFormFields = buildSepayPgCheckoutFields({
    merchantId: sepay.merchantId,
    merchantSecretKey: sepay.merchantSecretKey,
    paymentMethod: sepay.paymentMethod,
    orderInvoiceNumber: input.paymentReference,
    orderAmount: input.amountVnd,
    orderDescription: input.description?.trim() || `KEYON ${input.paymentReference}`,
    successUrl: `${orderPath}/success`,
    errorUrl: `${orderPath}/confirm?payment=error`,
    cancelUrl: `${orderPath}/confirm?payment=cancel`,
  });

  const amount = input.amountVnd.toLocaleString("vi-VN");
  return {
    provider: "sepay",
    redirectUrl: checkoutUrl,
    instructions: `Đang chuyển tới Cổng thanh toán SePay (sandbox) · ${amount}đ · Mã: ${input.paymentReference}`,
    checkoutUrl,
    checkoutFormFields,
    integrationMode: "payment_gateway",
    raw: {
      integrationMode: "payment_gateway",
      environment: sepay.environment,
      checkoutUrl,
      checkoutFormFields,
      amount: input.amountVnd,
    },
  };
}

async function createBankQr(
  input: CreatePaymentInput,
  sepay: Awaited<ReturnType<typeof resolvePayment>>["sepay"],
): Promise<CreatePaymentResult> {
  const account = sepay.accountNumber;
  const bankBin = sepay.bankBin;
  if (!account || !bankBin) {
    throw new AppError(
      "SePay production chưa cấu hình (cần số TK + bank BIN — Admin → Cài đặt → SePay)",
      501,
      "PAYMENT_NOT_CONFIGURED",
    );
  }

  const template = sepay.qrTemplate || "compact2";
  const addInfo = encodeURIComponent(input.paymentReference);
  const qrImageUrl = `https://img.vietqr.io/image/${bankBin}-${account}-${template}.png?amount=${input.amountVnd}&addInfo=${addInfo}`;
  const amount = input.amountVnd.toLocaleString("vi-VN");

  return {
    provider: "sepay",
    qrImageUrl,
    redirectUrl: qrImageUrl,
    instructions: `Quét QR hoặc CK ${amount}đ · STK ${account} · Nội dung đúng: ${input.paymentReference}`,
    integrationMode: "bank_webhook",
    raw: {
      integrationMode: "bank_webhook",
      accountNumber: account,
      bankBin,
      accountName: sepay.accountName,
      bankDisplayName: sepay.bankDisplayName,
      content: input.paymentReference,
      amount: input.amountVnd,
      qrImageUrl,
    },
  };
}

async function verifyPgIpn(
  headers: VerifyWebhookInput["headers"],
  body: Record<string, unknown>,
  ipnSecretKey: string,
): Promise<VerifyWebhookResult> {
  if (!ipnSecretKey) {
    throw new AppError("SePay PG IPN secret chưa cấu hình", 501, "PAYMENT_NOT_CONFIGURED");
  }
  if (!verifySepayPgIpnSecret(headers, ipnSecretKey)) {
    throw new AppError("Invalid SePay PG IPN secret", 401, "SEPAY_AUTH");
  }

  const data = { ...body };
  delete data._rawBody;

  if (!isSepayPgIpnPayload(data)) {
    throw new AppError("SePay PG IPN payload invalid", 400, "SEPAY_PAYLOAD");
  }

  const mapped = mapSepayPgIpn(data);
  if (!mapped.paymentReference) {
    throw new AppError("SePay PG IPN missing order_invoice_number", 400, "SEPAY_PAYLOAD");
  }

  return {
    paymentReference: mapped.paymentReference,
    success: mapped.success,
    providerEventId: mapped.providerTransactionId,
    providerTransactionId: mapped.providerTransactionId,
    providerReference: mapped.providerTransactionId,
    amountVnd: mapped.amountVnd,
    rawPayload: {
      notification_type: data.notification_type ?? null,
      order_invoice_number: mapped.paymentReference,
      transaction_id: mapped.providerTransactionId,
      amount: mapped.amountVnd,
      integrationMode: "payment_gateway",
    },
  };
}

async function verifyBankWebhook(
  headers: VerifyWebhookInput["headers"],
  body: Record<string, unknown>,
  rawBody: string,
  sepay: Awaited<ReturnType<typeof resolvePayment>>["sepay"],
): Promise<VerifyWebhookResult> {
  const hmacSecret = sepay.webhookSecret;
  const apiKey = sepay.apiKey;

  if (hmacSecret) {
    if (!verifySepayHmacSignature(headers, rawBody, hmacSecret)) {
      throw new AppError("Invalid SePay HMAC signature", 401, "SEPAY_SIG");
    }
  } else if (apiKey) {
    if (!verifySepayApiKey(headers, apiKey)) {
      throw new AppError("Invalid SePay API key", 401, "SEPAY_AUTH");
    }
  } else {
    throw new AppError(
      "SePay bank webhook auth not configured (HMAC secret hoặc API key)",
      501,
      "PAYMENT_NOT_CONFIGURED",
    );
  }

  const data = { ...body };
  delete data._rawBody;

  const transferType = String(data.transferType ?? data.transfer_type ?? "in");
  const code = String(data.code ?? data.content ?? "").trim();
  const paymentReference =
    code || String(data.referenceCode ?? data.reference_code ?? "").trim();

  if (!paymentReference) {
    throw new AppError("SePay payload missing payment code", 400, "SEPAY_PAYLOAD");
  }

  const eventId =
    data.id != null
      ? String(data.id)
      : data.sepay_id != null
        ? String(data.sepay_id)
        : null;

  const paidAtRaw = data.transactionDate ?? data.transaction_date;
  let providerPaidAt: Date | null = null;
  if (typeof paidAtRaw === "string" || typeof paidAtRaw === "number") {
    const d = new Date(paidAtRaw);
    if (!Number.isNaN(d.getTime())) providerPaidAt = d;
  }

  return {
    paymentReference,
    success: transferType === "in" || transferType === "In",
    providerEventId: eventId,
    providerTransactionId:
      data.referenceCode != null
        ? String(data.referenceCode)
        : data.reference_code != null
          ? String(data.reference_code)
          : null,
    providerReference: eventId,
    providerPaidAt,
    amountVnd: typeof data.transferAmount === "number" ? data.transferAmount : null,
    rawPayload: {
      id: eventId,
      transferAmount: typeof data.transferAmount === "number" ? data.transferAmount : null,
      code: paymentReference,
      gateway: data.gateway != null ? String(data.gateway) : null,
      integrationMode: "bank_webhook",
    },
  };
}
