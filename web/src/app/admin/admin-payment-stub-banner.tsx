import { PaymentService } from "@/server/payment";
import { resolvePayment } from "@/server/payment/config";

/** Red banner when production still runs stub or SePay sandbox (not live bank). */
export async function AdminPaymentStubBanner() {
  if (process.env.NODE_ENV !== "production") return null;

  const [provider, resolved] = await Promise.all([
    PaymentService.providerName().catch(() => "unknown"),
    resolvePayment(),
  ]);

  if (provider === "stub") {
    return (
      <div
        role="alert"
        className="border-b border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-900 md:px-6"
      >
        <strong className="font-semibold">PAYMENT_PROVIDER=stub</strong>
        {" — "}
        Production đang chạy stub. Không nhận tiền thật. Cấu hình SePay tại{" "}
        <a href="/admin/settings?tab=sepay" className="font-medium underline">
          Settings → SePay
        </a>
        .
      </div>
    );
  }

  if (
    provider === "sepay" &&
    resolved.sepay.environment === "sandbox"
  ) {
    return (
      <div
        role="alert"
        className="border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-sm text-amber-950 md:px-6"
      >
        <strong className="font-semibold">SePay đang ở sandbox (PG)</strong>
        {" — "}
        Chưa phải chuyển khoản bank + HMAC production. Khi nhận tiền thật, chuyển{" "}
        <a href="/admin/settings?tab=sepay" className="font-medium underline">
          Settings → SePay
        </a>{" "}
        sang <strong>environment = production</strong>, điền STK/BIN + webhook HMAC.
      </div>
    );
  }

  return null;
}
