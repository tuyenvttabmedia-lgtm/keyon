import { NextResponse } from "next/server";
import { isStaff, readSession } from "@/lib/auth";
import { resolvePayment } from "@/server/payment/config";
import { resetPaymentCache } from "@/server/payment/service";

async function requireAdmin() {
  const session = await readSession();
  if (!session || !isStaff(session.role)) return null;
  if (session.role === "CS") return null;
  return session;
}

/** Validate SePay config resolves (legacy QR) — mirrors CardOn configuration test. */
export async function POST() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    resetPaymentCache();
    const resolved = await resolvePayment();
    const { sepay, provider } = resolved;

    if (!sepay.accountNumber || !sepay.bankBin) {
      return NextResponse.json(
        {
          ok: false,
          error: "Thiếu số TK hoặc bank BIN (Admin hoặc ENV)",
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
      authMode,
      accountNumber: sepay.accountNumber,
      bankBin: sepay.bankBin,
      accountName: sepay.accountName,
      sampleQrUrl: sampleQr,
      message:
        authMode === "none"
          ? "STK/BIN OK — chưa có webhook auth (HMAC/API key); prod nên cấu hình"
          : `Cấu hình SePay OK (auth: ${authMode})`,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Test failed" },
      { status: 400 },
    );
  }
}
