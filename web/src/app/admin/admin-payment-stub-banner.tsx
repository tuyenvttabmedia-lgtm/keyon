import { PaymentService } from "@/server/payment";

/** Red banner when production still runs stub payments. */
export async function AdminPaymentStubBanner() {
  if (process.env.NODE_ENV !== "production") return null;
  const provider = await PaymentService.providerName();
  if (provider !== "stub") return null;

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
