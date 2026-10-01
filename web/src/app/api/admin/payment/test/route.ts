import { NextResponse } from "next/server";
import https from "node:https";
import { resolvePayment } from "@/server/payment/config";
import { resetPaymentCache } from "@/server/payment/service";
import {
  buildSepayPgCheckoutFields,
  getSepayPgCheckoutUrl,
} from "@/server/payment/providers/sepay-pg";
import { toErrorResponse } from "@/lib/errors";
import { requireAdminSession } from "@/server/auth/require-staff";

/** Validate SePay config for active mode (PG sandbox vs bank production). */
export async function POST() {
  try {
    await requireAdminSession({ capability: "payments" });

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
        orderInvoiceNumber: `KEYON_CFG_${Date.now()}`,
        orderAmount: 10000,
        orderDescription: "KEYON SePay PG config test",
        successUrl: "https://keyon.vn/checkout/test/success",
        errorUrl: "https://keyon.vn/checkout/test/error",
        cancelUrl: "https://keyon.vn/checkout/test/cancel",
      });

      const probe = await postCheckoutInit(
        checkoutUrl,
        new URLSearchParams(sampleFields).toString(),
      );
      const accepted =
        (probe.status === 302 || probe.status === 303) &&
        probe.location.includes("/v1/checkout");
      if (!accepted) {
        return NextResponse.json(
          {
            ok: false,
            error: `SePay sandbox từ chối form checkout (HTTP ${probe.status}). Kiểm tra Merchant ID và Secret Key của Test mode.`,
          },
          { status: 400 },
        );
      }

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
        message:
          "Sandbox OK — SePay nhận form checkout. IPN dùng X-Secret-Key, tách với HMAC production.",
      });
    }

    // production bank webhook
    const bank = sepay.bankBin || sepay.bankName || sepay.bankDisplayName;
    if (!sepay.accountNumber || !bank) {
      return NextResponse.json(
        {
          ok: false,
          error: "Production bank thiếu số VA hoặc mã ngân hàng (ví dụ MB)",
        },
        { status: 400 },
      );
    }
    if (!sepay.webhookSecret) {
      return NextResponse.json(
        {
          ok: false,
          error: "Production cần HMAC webhook secret",
        },
        { status: 400 },
      );
    }

    const sampleQr = `https://qr.sepay.vn/img?${new URLSearchParams({
      acc: sepay.accountNumber,
      bank,
      amount: "1000",
      des: "DH00000000",
      template: sepay.qrTemplate || "compact",
    }).toString()}`;

    return NextResponse.json({
      ok: true,
      provider,
      providerSource: resolved.providerSource,
      sepaySource: sepay.source,
      environment: sepay.environment,
      mode: sepay.mode,
      authMode: "hmac",
      accountNumber: sepay.accountNumber,
      bank,
      accountName: sepay.accountName,
      sampleQrUrl: sampleQr,
      message: "Bank webhook OK (HMAC-SHA256)",
    });
  } catch (e) {
    if (e && typeof e === "object" && "status" in e) {
      return toErrorResponse(e);
    }
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Test failed" },
      { status: 400 },
    );
  }
}

/** Raw POST so a 302 is visible. Next's fetch follows it and the checkout page looks like HTTP 200. */
function postCheckoutInit(
  url: string,
  body: string,
): Promise<{ status: number; location: string }> {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const req = https.request(
      {
        hostname: target.hostname,
        path: `${target.pathname}${target.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        res.resume();
        const location = res.headers.location;
        resolve({
          status: res.statusCode ?? 0,
          location: Array.isArray(location) ? location[0] ?? "" : location ?? "",
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}
