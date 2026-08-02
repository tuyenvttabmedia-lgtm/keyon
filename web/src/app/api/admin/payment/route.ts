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
        accountNumber: z.string(),
        bankBin: z.string(),
        bankName: z.string().optional(),
        bankDisplayName: z.string().optional(),
        accountName: z.string().optional(),
        qrTemplate: z.string().optional(),
        apiKey: z.string().optional(),
        webhookSecret: z.string().optional(),
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
    if (!parsed.sepay.accountNumber.trim() || !parsed.sepay.bankBin.trim()) {
      return NextResponse.json(
        { error: "SePay cần số tài khoản và bank BIN" },
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
