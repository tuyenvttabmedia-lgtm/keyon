import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth";
import { resolvePayment } from "@/server/payment/config";
import { resetPaymentCache } from "@/server/payment/service";
import {
  buildSepayPgCheckoutFields,
  getSepayPgCheckoutUrl,
} from "@/server/payment/providers/sepay-pg";

async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/** Validate SePay config for active mode (PG sandbox vs bank production). */
export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    resetPaymentCache();
    const resolved = await resolvePayment();
    const { sepay, provider } = resolved;

    if (provider !== "sepay") {
      return NextResponse.json({
        ok: true,
        provider,
        message: `Provider hiện tại là ${provider} — không kiểm tra SePay`,
      });
    }

    if (sepay.mode === "payment_gateway") {
      if (!sepay.merchantId || !sepay.merchantSecretKey) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Sandbox PG thiếu Merchant ID hoặc Merchant Secret Key (Admin hoặc ENV)",
          },
          { status: 400 },
        );
      }

      const checkoutUrl = getSepayPgCheckoutUrl(sepay.environment);
      const sampleFields = buildSepayPgCheckoutFields({
        merchantId: sepay.merchantId,
        merchantSecretKey: sepay.merchantSecretKey,
        paymentMethod: sepay.paymentMethod,
        orderInvoiceNumber: "KEYON_TEST_REF",
        orderAmount: 10000,
        orderDescription: "KEYON SePay PG config test",
        successUrl: "https://keyon.vn/checkout/test/success",
        errorUrl: "https://keyon.vn/checkout/test/error",
        cancelUrl: "https://keyon.vn/checkout/test/cancel",
      });

      return NextResponse.json({
        ok: true,
        provider,
        providerSource: resolved.providerSource,
        sepaySource: sepay.source,
        environment: sepay.environment,
        mode: sepay.mode,
        merchantId: sepay.merchantId,
        ipnSecretConfigured: Boolean(sepay.ipnSecretKey),
        checkoutUrl,
        sampleSignaturePreview: sampleFields.signature?.slice(0, 12) + "…",
        message:
          "Cổng thanh toán PG (sandbox) OK — Merchant + chữ ký form hợp lệ. IPN dùng X-Secret-Key.",
      });
    }

    // production bank webhook
    if (!sepay.accountNumber || !sepay.bankBin) {
      return NextResponse.json(
        {
          ok: false,
          error: "Production bank thiếu số TK hoặc bank BIN (Admin hoặc ENV)",
        },
        { status: 400 },
      );
    }

    const authMode = sepay.webhookSecret
      ? "hmac"
      : sepay.apiKey
        ? "api_key"
        : "none";

    const sampleQr = `https://img.vietqr.io/image/${sepay.bankBin}-${sepay.accountNumber}-${sepay.qrTemplate || "compact2"}.png?amount=1000&addInfo=KEYONTEST`;

    return NextResponse.json({
      ok: true,
      provider,
      providerSource: resolved.providerSource,
      sepaySource: sepay.source,
      environment: sepay.environment,
      mode: sepay.mode,
      authMode,
      accountNumber: sepay.accountNumber,
      bankBin: sepay.bankBin,
      accountName: sepay.accountName,
      sampleQrUrl: sampleQr,
      message:
        authMode === "none"
          ? "STK/BIN OK — chưa có HMAC webhook secret; production nên cấu hình whsec_…"
          : `Bank webhook OK (auth: ${authMode})`,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Test failed" },
      { status: 400 },
    );
  }
}
