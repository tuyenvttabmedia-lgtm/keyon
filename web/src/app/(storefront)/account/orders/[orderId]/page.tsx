import { notFound, redirect } from "next/navigation";
import { readSession, isStaff } from "@/lib/auth";
import { decryptPayload } from "@/lib/crypto";
import { prisma } from "@/lib/db";
import {
  defaultCmsAccount,
  defaultCmsCheckout,
  readJsonFile,
} from "@/server/cms/store";
import { OrderDetailView } from "@/storefront/components/account/OrderDetailView";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import { mergeCheckoutCms } from "@/storefront/lib/checkout-cms";
import { parseStringList } from "@/storefront/lib/product-cms";
import { buildCustomerOrderTimeline } from "@/storefront/lib/order-timeline";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const session = await readSession();
  if (!session) redirect("/login");
  const { orderId } = await params;

  const [order, cmsAccount, cmsCheckoutRaw] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: { include: { product: { include: { brand: true } } } },
            deliveries: { orderBy: { createdAt: "desc" } },
            fulfillmentJobs: true,
          },
        },
        payments: { orderBy: { createdAt: "desc" } },
      },
    }),
    readJsonFile("account.json", defaultCmsAccount),
    readJsonFile("checkout.json", defaultCmsCheckout),
  ]);
  if (!order) notFound();

  const staff = isStaff(session.role);
  const allowed =
    staff || order.userId === session.id || order.email === session.email;
  if (!allowed) redirect("/account/orders");

  const owner = await prisma.user.findUnique({
    where: { id: session.id },
    select: { emailVerifiedAt: true },
  });
  const canRevealLicense = Boolean(owner?.emailVerifiedAt) || staff;

  const cms = resolveAccountCopy(cmsAccount);
  const cmsCheckout = mergeCheckoutCms(cmsCheckoutRaw);
  const latestPayment = order.payments[0];
  const hasDelivery = order.items.some((i) => i.deliveries.length > 0);
  const jobStatus = order.items[0]?.fulfillmentJobs[0]?.status;
  const deliveredAt =
    order.items
      .flatMap((i) => i.deliveries)
      .map((d) => d.createdAt)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  const paid =
    latestPayment?.status === "SUCCEEDED" ||
    order.status === "PAID" ||
    order.status === "FULFILLING" ||
    order.status === "COMPLETED";

  const completed = order.status === "COMPLETED" || (paid && hasDelivery);

  const overallStatus = !paid
    ? ("pending_pay" as const)
    : completed
      ? ("completed" as const)
      : ("processing" as const);

  const overallStatusLabel =
    overallStatus === "completed"
      ? cms.orderStatusCompleted
      : overallStatus === "processing"
        ? cms.orderStatusProcessing
        : cms.orderStatusPendingPay;

  const rawTimeline = buildCustomerOrderTimeline({
    createdAt: order.createdAt,
    orderStatus: order.status,
    paymentStatus: latestPayment?.status,
    paymentSucceededAt: latestPayment?.succeededAt,
    hasDelivery,
    deliveredAt,
    jobStatus,
  });

  // Mockup: 4 milestones — map/filter to customer-friendly history
  const timeline = [
    rawTimeline.find((s) => s.id === "created"),
    rawTimeline.find((s) => s.id === "paid"),
    rawTimeline.find((s) => s.id === "delivered"),
    rawTimeline.find((s) => s.id === "done"),
  ]
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => {
      if (s.id === "created") {
        return {
          ...s,
          title: "Đặt hàng thành công",
          detail: "Đơn hàng đã được tạo trên hệ thống KEYON.",
        };
      }
      if (s.id === "paid") {
        return {
          ...s,
          title: "Thanh toán thành công",
          detail: "KEYON đã ghi nhận thanh toán cho đơn hàng.",
        };
      }
      if (s.id === "delivered") {
        return {
          ...s,
          title: "Xác nhận & giao license",
          detail: hasDelivery
            ? "License đã được giao — kiểm tra bên trên hoặc Tài sản."
            : "KEYON đang xử lý giao license.",
        };
      }
      return {
        ...s,
        title: "Hoàn thành",
        detail: completed
          ? "Đơn hàng đã hoàn tất."
          : "Đơn sẽ hoàn tất khi license đã giao.",
      };
    });

  let listTotal = 0;
  const pay = order.totalVnd;
  let hasCompare = false;
  for (const item of order.items) {
    const compare = item.variant.compareAtPriceVnd;
    if (compare && compare > item.unitPriceVnd) {
      listTotal += compare * item.quantity;
      hasCompare = true;
    } else {
      listTotal += item.unitPriceVnd * item.quantity;
    }
  }
  const discount = hasCompare && listTotal > pay ? listTotal - pay : 0;
  const discountPct =
    hasCompare && listTotal > 0 ? Math.round((discount / listTotal) * 100) : 0;

  const methodTitle =
    cmsCheckout.paymentMethods.find((m) => m.provider === "sepay_qr")?.title ??
    "VietQR / chuyển khoản";

  const lines = order.items.map((item) => {
    const product = item.variant.product;
    const gallery = parseStringList(product.galleryUrls);
    const delivery = item.deliveries[0];
    let licensePlain: string | null = null;
    if (delivery && canRevealLicense) {
      try {
        licensePlain = decryptPayload(delivery.payloadEnc);
      } catch {
        licensePlain = null;
      }
    }
    return {
      id: item.id,
      productName: product.name,
      variantName: item.variant.name,
      brandName: product.brand.name,
      imageUrl: gallery[0] ?? product.ogImageUrl ?? null,
      unitPriceVnd: item.unitPriceVnd,
      quantity: item.quantity,
      licensePlain,
    };
  });

  return (
    <OrderDetailView
      cms={cms}
      overallStatus={overallStatus}
      overallStatusLabel={overallStatusLabel}
      order={{
        id: order.id,
        code: order.code,
        createdAtLabel: order.createdAt.toLocaleString("vi-VN"),
        paymentMethodTitle: methodTitle,
        paymentRef: latestPayment?.paymentReference ?? null,
        paidAtLabel: latestPayment?.succeededAt
          ? latestPayment.succeededAt.toLocaleString("vi-VN")
          : null,
        paymentSucceeded: paid,
      }}
      money={{
        listTotal: hasCompare ? listTotal : null,
        discount,
        discountPct,
        pay,
      }}
      timeline={timeline}
      lines={lines}
    />
  );
}
