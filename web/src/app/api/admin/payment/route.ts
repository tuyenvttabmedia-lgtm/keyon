import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getPaymentSettingsPublic,
  savePaymentSettings,
} from "@/server/payment/config";
import { resetPaymentCache } from "@/server/payment/service";
import { toErrorResponse } from "@/lib/errors";
import { requireAdminSession } from "@/server/auth/require-staff";

export async function GET() {
  try {
    await requireAdminSession({ capability: "payments", method: "GET" });
    return NextResponse.json(await getPaymentSettingsPublic());
  } catch (e) {
    return toErrorResponse(e);
  }
}

export async function PUT(req: Request) {
  try {
    await requireAdminSession({ capability: "payments", method: "PUT" });

    const body = await req.json();
    const parsed = z
      .object({
        provider: z.enum(["stub", "sepay", "payos", "megapay"]),
        sepay: z.object({
          environment: z.enum(["sandbox", "production"]).optional(),
          accountNumber: z.string(),
          bankBin: z.string(),
          bankName: z.string().optional(),
          bankDisplayName: z.string().optional(),
          accountName: z.string().optional(),
          qrTemplate: z.string().optional(),
          merchantId: z.string().optional(),
          paymentMethod: z.enum(["BANK_TRANSFER", "NAPAS_BANK_TRANSFER"]).optional(),
          apiKey: z.string().optional(),
          webhookSecret: z.string().optional(),
          merchantSecret: z.string().optional(),
          ipnSecret: z.string().optional(),
        }),
      })
      .parse(body);

    if (parsed.provider === "stub" && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Không được bật provider stub trên production" },
        { status: 400 },
      );
    }

    if (parsed.provider === "payos" || parsed.provider === "megapay") {
      return NextResponse.json(
        { error: "PayOS / MegaPay chưa được hỗ trợ — chọn Stub hoặc SePay" },
        { status: 400 },
      );
    }

    if (parsed.provider === "sepay") {
      const env = parsed.sepay.environment ?? "sandbox";
      if (env === "sandbox") {
        const mid = (parsed.sepay.merchantId ?? "").trim();
        const hasSecret = Boolean(parsed.sepay.merchantSecret?.trim());
        const pub = await getPaymentSettingsPublic();
        if (!mid && !pub.sepay.merchantId) {
          return NextResponse.json(
            { error: "Sandbox PG cần Merchant ID (SP-TEST-…)" },
            { status: 400 },
          );
        }
        if (!hasSecret && !pub.sepay.merchantSecretConfigured) {
          return NextResponse.json(
            { error: "Sandbox PG cần Merchant Secret Key (spsk_test_…)" },
            { status: 400 },
          );
        }
      } else if (!parsed.sepay.accountNumber.trim() || !parsed.sepay.bankBin.trim()) {
        return NextResponse.json(
          { error: "Production bank webhook cần số tài khoản và bank BIN" },
          { status: 400 },
        );
      }
    }

    await savePaymentSettings(parsed);
    resetPaymentCache();
    return NextResponse.json({
      ok: true,
      data: await getPaymentSettingsPublic(),
    });
  } catch (e) {
    return toErrorResponse(e);
  }
}
