import { NextResponse } from "next/server";
import { z } from "zod";
import { readSession } from "@/lib/auth";
import {
  getPaymentSettingsPublic,
  savePaymentSettings,
} from "@/server/payment/config";
import { resetPaymentCache } from "@/server/payment/service";

async function requireAdmin() {
  const session = await readSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getPaymentSettingsPublic());
}

export async function PUT(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
}
