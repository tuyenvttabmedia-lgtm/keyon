import { notFound, redirect } from "next/navigation";
import type { OrderStatus, Payment } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  defaultCmsCheckout,
  defaultSettings,
  readJsonFile,
} from "@/server/cms/store";
import { PaymentService } from "@/server/payment";
import { resolvePayment } from "@/server/payment/config";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import { mergeCheckoutCms } from "@/storefront/lib/checkout-cms";
import { paymentStatusForCustomer } from "@/storefront/lib/order-status";
import { parseStringList } from "@/storefront/lib/product-cms";
import type {
  CheckoutItemInfo,
  CheckoutOrderInfo,
} from "@/storefront/components/checkout/CheckoutView";
import type { CmsCheckout } from "@/server/cms/types";

export type LoadedCheckout = {
  cms: CmsCheckout;
  supportEmail: string;
  order: CheckoutOrderInfo;
  item: CheckoutItemInfo | null;
  payment: Payment;
  orderStatus: OrderStatus;
};

/** Shared load + redirect guards for checkout wizard steps. */
export async function loadCheckoutContext(orderId: string): Promise<LoadedCheckout> {
  const [order, cmsRaw, settings] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: { include: { product: { include: { brand: true } } } },
          },
        },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    readJsonFile("checkout.json", defaultCmsCheckout),
    readJsonFile("settings.json", defaultSettings),
  ]);
  if (!order) notFound();

  const payment = order.payments[0];
  if (!payment) notFound();

  const expired =
    payment.status === "EXPIRED" ||
    (payment.expiresAt != null &&
      payment.expiresAt.getTime() < Date.now() &&
      payment.status !== "SUCCEEDED" &&
      order.status === "PENDING_PAYMENT");

  if (expired) {
    redirect(`/checkout/${order.id}/expired`);
  }

  if (
    payment.status === "SUCCEEDED" ||
    order.status === "PAID" ||
    order.status === "FULFILLING" ||
    order.status === "COMPLETED"
  ) {
    redirect(`/checkout/${order.id}/success`);
  }

  const cms = mergeCheckoutCms(cmsRaw);
  const line = order.items[0];
  const product = line?.variant.product;
  const gallery = product ? parseStringList(product.galleryUrls) : [];
  const receive = line
    ? receiveFromDeliverable(line.variant.deliverableType)
    : null;
  const delivery = line
    ? deliveryPromiseLabel(line.variant.fulfillmentStrategy)
    : null;

  return {
    cms,
    supportEmail: settings.supportEmail,
    payment,
    orderStatus: order.status,
    order: {
      id: order.id,
      code: order.code,
      email: order.email,
      totalVnd: order.totalVnd,
      productHref: product ? `/products/${product.slug}` : "/products",
    },
    item:
      line && product
        ? {
            title: line.title,
            productName: product.name,
            brandName: product.brand.name,
            variantName: line.variant.name,
            quantity: line.quantity,
            unitPriceVnd: line.unitPriceVnd,
            compareAtUnitVnd: line.variant.compareAtPriceVnd,
            imageUrl: gallery[0] ?? product.ogImageUrl ?? null,
            receiveLabel: receive?.label ?? "—",
            deliveryLabel: delivery ?? "—",
            fulfillmentInstant: line.variant.fulfillmentStrategy === "INSTANT",
          }
        : null,
  };
}

/** Rebuild VietQR / instructions for confirm step (same ref + amount). */
export async function buildCheckoutPaymentUi(
  payment: Payment,
  orderStatus: OrderStatus,
) {
  const created = await PaymentService.createPayment({
    orderId: payment.orderId,
    amountVnd: payment.amountVnd,
    paymentReference: payment.paymentReference,
  });
  const resolved = await resolvePayment();
  const status = paymentStatusForCustomer(payment.status, orderStatus);
  /** Stub-only: never show “confirm paid” when real gateway is active. */
  const stubConfirmAllowed =
    resolved.provider === "stub" &&
    (payment.status === "AWAITING" || payment.status === "CREATED");

  return {
    paymentReference: payment.paymentReference,
    statusLabel: status.label,
    expiresAt: payment.expiresAt?.toISOString() ?? null,
    qrImageUrl: created.qrImageUrl,
    instructions: created.instructions,
    bankName: resolved.sepay.bankDisplayName || resolved.sepay.bankName || "Ngân hàng",
    account: resolved.sepay.accountNumber || "—",
    accountName: resolved.sepay.accountName || "KEYON",
    canConfirm: stubConfirmAllowed,
  };
}
