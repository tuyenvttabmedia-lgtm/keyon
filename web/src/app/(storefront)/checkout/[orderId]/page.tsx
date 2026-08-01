import { CheckoutView } from "@/storefront/components/checkout/CheckoutView";
import { loadCheckoutContext } from "@/storefront/lib/checkout-load";

export const dynamic = "force-dynamic";

/** Step 2 — chọn phương thức (không hiện QR). */
export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const ctx = await loadCheckoutContext(orderId);

  return (
    <CheckoutView
      cms={ctx.cms}
      supportEmail={ctx.supportEmail}
      order={ctx.order}
      item={ctx.item}
    />
  );
}
