import { NextResponse } from "next/server";
import { markPaymentSucceeded } from "@/server/payment/money";
import { enqueuePaymentSucceeded } from "@/server/queue";
import { recordWebhookProcessed } from "@/server/payment/kpis";
import { childLogger } from "@/lib/logger";
import { AppError, toErrorResponse } from "@/lib/errors";

export const runtime = "nodejs";

const log = childLogger("webhook.sepay");

/**
 * SePay webhook → Payment Domain only (ADR-004).
 * Không gọi LicensePool.consume.
 */
export async function POST(req: Request) {
  const t0 = Date.now();
  try {
    const { sepayPaymentProvider } = await import("@/server/payment/providers/sepay");
    if (!sepayPaymentProvider.verifyWebhook) {
      throw new AppError("SePay verifyWebhook missing", 501);
    }

    const rawBody = await req.text();
    let parsed: unknown = {};
    try {
      parsed = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      throw new AppError("Invalid JSON", 400);
    }

    const headers: Record<string, string> = {};
    req.headers.forEach((v, k) => {
      headers[k] = v;
    });

    const verified = await sepayPaymentProvider.verifyWebhook({
      headers,
      body: { ...(parsed as object), _rawBody: rawBody },
    });

    if (!verified.success) {
      recordWebhookProcessed(Date.now() - t0, false);
      log.info({ ref: verified.paymentReference }, "ignored non-in transfer");
      return NextResponse.json({ success: true });
    }

    await enqueuePaymentSucceeded(verified.paymentReference, verified.rawPayload ?? {}).catch(
      (err) => log.warn({ err }, "queue enqueue failed — inline fallback"),
    );

    const result = await markPaymentSucceeded({
      paymentReference: verified.paymentReference,
      rawPayload: (verified.rawPayload ?? { source: "sepay-webhook" }) as Record<
        string,
        string | number | boolean | null
      >,
      providerEventId: verified.providerEventId,
      providerTransactionId: verified.providerTransactionId,
      providerReference: verified.providerReference,
      providerPaidAt: verified.providerPaidAt,
      amountVnd: verified.amountVnd,
    });

    recordWebhookProcessed(Date.now() - t0, result.duplicateWebhook);
    log.info(
      { ref: verified.paymentReference, duplicate: result.duplicateWebhook },
      "sepay webhook accepted",
    );
    return NextResponse.json({ success: true, duplicate: result.duplicateWebhook });
  } catch (e) {
    log.warn({ err: e }, "sepay webhook error");
    return toErrorResponse(e, "webhook.sepay");
  }
}
