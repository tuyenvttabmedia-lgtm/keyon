import { CheckoutConfirmView } from "@/storefront/components/checkout/CheckoutConfirmView";
import {
  buildCheckoutPaymentUi,
  loadCheckoutContext,
} from "@/storefront/lib/checkout-load";

export const dynamic = "force-dynamic";

/** Step 3 — VietQR / xác nhận theo mockup. */
export default async function CheckoutConfirmPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<{ method?: string }>;
}) {
  const { orderId } = await params;
  const { method: methodId } = await searchParams;
  const ctx = await loadCheckoutContext(orderId);
  const paymentUi = await buildCheckoutPaymentUi(ctx.payment, ctx.orderStatus);

  const selected =
    ctx.cms.paymentMethods.find((m) => m.id === methodId) ??
    ctx.cms.paymentMethods.find((m) => m.provider === "sepay_qr" && m.enabled) ??
    ctx.cms.paymentMethods.find((m) => m.enabled);

  return (
    <CheckoutConfirmView
      cms={ctx.cms}
      order={ctx.order}
      item={ctx.item}
      methodTitle={selected?.title ?? "VietQR / chuyển khoản"}
      payment={{
        paymentReference: paymentUi.paymentReference,
        expiresAt: paymentUi.expiresAt,
        qrImageUrl: paymentUi.qrImageUrl,
        canConfirm: paymentUi.canConfirm,
      }}
    />
  );
}
