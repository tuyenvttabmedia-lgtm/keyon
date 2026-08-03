import { CheckoutConfirmView } from "@/storefront/components/checkout/CheckoutConfirmView";
import { SepayPgCheckoutRedirect } from "@/storefront/components/checkout/SepayPgCheckoutRedirect";
import {
  buildCheckoutPaymentUi,
  loadCheckoutContext,
} from "@/storefront/lib/checkout-load";

export const dynamic = "force-dynamic";

/** Step 3 — SePay PG redirect (sandbox) hoặc VietQR (production). */
export default async function CheckoutConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ method?: string; payment?: string }>;
}) {
  const { orderId } = await params;
  const { method: methodId, payment: paymentFlag } = await searchParams;
  const ctx = await loadCheckoutContext(orderId);
  const paymentUi = await buildCheckoutPaymentUi(ctx.payment, ctx.orderStatus);

  const selected =
    ctx.cms.paymentMethods.find((m) => m.id === methodId) ??
    ctx.cms.paymentMethods.find((m) => m.provider === "sepay_qr" && m.enabled) ??
    ctx.cms.paymentMethods.find((m) => m.enabled);

  if (
    paymentUi.integrationMode === "payment_gateway" &&
    paymentUi.checkoutUrl &&
    paymentUi.checkoutFormFields &&
    paymentFlag !== "cancel" &&
    paymentFlag !== "error"
  ) {
    return (
      <div className="home-container py-10">
        <SepayPgCheckoutRedirect
          checkoutUrl={paymentUi.checkoutUrl}
          checkoutFormFields={paymentUi.checkoutFormFields}
        />
      </div>
    );
  }

  return (
    <CheckoutConfirmView
      cms={ctx.cms}
      order={ctx.order}
      item={ctx.item}
      methodTitle={
        paymentUi.integrationMode === "payment_gateway"
          ? "Cổng thanh toán SePay"
          : (selected?.title ?? "VietQR / chuyển khoản")
      }
      payment={{
        paymentReference: paymentUi.paymentReference,
        expiresAt: paymentUi.expiresAt,
        qrImageUrl: paymentUi.qrImageUrl,
        canConfirm: paymentUi.canConfirm,
        notice:
          paymentFlag === "cancel"
            ? "Bạn đã hủy trên cổng SePay. Có thể thử thanh toán lại."
            : paymentFlag === "error"
              ? "Thanh toán SePay gặp lỗi. Thử lại hoặc liên hệ hỗ trợ."
              : null,
      }}
    />
  );
}
