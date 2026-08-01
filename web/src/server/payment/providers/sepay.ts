import { createHmac, timingSafeEqual } from "crypto";
import type {
  PaymentProvider,
  CreatePaymentInput,
  CreatePaymentResult,
  VerifyWebhookInput,
  VerifyWebhookResult,
} from "../types";
import { AppError } from "@/lib/errors";
import { resolvePayment } from "../config";

function header(headers: VerifyWebhookInput["headers"], name: string): string | undefined {
  const v = headers[name] ?? headers[name.toLowerCase()];
  if (Array.isArray(v)) return v[0];
  return v;
}

function verifyHmac(rawBody: string, timestamp: string, signature: string, secret: string) {
  const expected = `sha256=${createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex")}`;
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * SePay Payment Provider (Outer Layer).
 * Credentials: Admin payment.json (encrypted secrets) ?? ENV — CardOn-style hybrid.
 * createPayment → QR (VietQR) + transfer content = paymentReference.
 * verifyWebhook → HMAC/API key · map code → paymentReference + event id.
 */
export const sepayPaymentProvider: PaymentProvider = {
  name: "sepay",

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const { sepay } = await resolvePayment();
    const account = sepay.accountNumber;
    const bankBin = sepay.bankBin;
    if (!account || !bankBin) {
      throw new AppError(
        "SePay chưa cấu hình (cần số TK + bank BIN — Admin → Cài đặt → SePay)",
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
      raw: {
        accountNumber: account,
        bankBin,
        accountName: sepay.accountName,
        bankDisplayName: sepay.bankDisplayName,
        content: input.paymentReference,
        amount: input.amountVnd,
        qrImageUrl,
      },
    };
  },

  async verifyWebhook(input: VerifyWebhookInput): Promise<VerifyWebhookResult> {
    const { sepay } = await resolvePayment();
    const apiKey = sepay.apiKey;
    const hmacSecret = sepay.webhookSecret;

    if (hmacSecret) {
      const signature =
        header(input.headers, "x-sepay-signature") ?? header(input.headers, "X-SePay-Signature");
      const timestamp =
        header(input.headers, "x-sepay-timestamp") ?? header(input.headers, "X-SePay-Timestamp");
      const rawBody =
        typeof input.body === "object" && input.body && "_rawBody" in (input.body as object)
          ? String((input.body as { _rawBody: string })._rawBody)
          : JSON.stringify(input.body);
      if (!signature || !timestamp) {
        throw new AppError("Missing SePay HMAC headers", 401, "SEPAY_AUTH");
      }
      const ts = Number(timestamp);
      if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
        throw new AppError("SePay timestamp expired", 401, "SEPAY_REPLAY");
      }
      if (!verifyHmac(rawBody, timestamp, signature, hmacSecret)) {
        throw new AppError("Invalid SePay signature", 401, "SEPAY_SIG");
      }
    } else if (apiKey) {
      const auth =
        header(input.headers, "authorization") ?? header(input.headers, "Authorization") ?? "";
      const ok =
        auth === apiKey || auth === `Apikey ${apiKey}` || auth === `Bearer ${apiKey}`;
      if (!ok) throw new AppError("Invalid SePay API key", 401, "SEPAY_AUTH");
    } else if (process.env.NODE_ENV === "production") {
      throw new AppError("SePay webhook auth not configured", 501, "PAYMENT_NOT_CONFIGURED");
    }

    const body = (input.body ?? {}) as Record<string, unknown>;
    const data = { ...body } as Record<string, unknown>;
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
      },
    };
  },
};
