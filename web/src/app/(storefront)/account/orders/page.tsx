import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import {
  OrdersView,
  type OrderListItem,
} from "@/storefront/components/account/OrdersView";
import { orderListStatus } from "@/storefront/lib/order-list-status";
import { parseStringList } from "@/storefront/lib/product-cms";

export const dynamic = "force-dynamic";

function paymentMethodLabel(provider: string | undefined): string {
  switch (provider) {
    case "sepay":
    case "sepay_qr":
      return "VietQR";
    case "stub":
      return "Thanh toán thử";
    default:
      return provider ? provider.toUpperCase() : "—";
  }
}

export default async function OrdersPage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const where = {
    OR: [{ userId: session.id }, { email: session.email }],
  };

  const [cmsRaw, orders, quote] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            deliveries: true,
            variant: { include: { product: true } },
          },
        },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      take: 100,
    }),
    prisma.quoteRequest.findFirst({
      where: { email: session.email },
      orderBy: { createdAt: "desc" },
      select: { companyName: true },
    }),
  ]);

  const cms = resolveAccountCopy(cmsRaw);

  const items: OrderListItem[] = orders.map((o) => {
    const payment = o.payments[0];
    const hasDelivery = o.items.some((i) => i.deliveries.length > 0);
    const status = orderListStatus(o.status, payment?.status, hasDelivery, cms);
    const primary = o.items[0];
    const gallery = primary
      ? parseStringList(primary.variant.product.galleryUrls)
      : [];
    const qty = o.items.reduce((s, i) => s + i.quantity, 0);
    const productTitle =
      o.items.length > 1
        ? `${primary?.title ?? "Đơn hàng"} +${o.items.length - 1}`
        : (primary?.title ?? "Đơn hàng");

    return {
      id: o.id,
      code: o.code,
      createdAtIso: o.createdAt.toISOString(),
      totalVnd: o.totalVnd,
      countsAsSpend: status.countsAsSpend,
      tab: status.tab,
      statusLabel: status.statusLabel,
      statusSub: status.statusSub,
      statusTone: status.statusTone,
      productTitle,
      productImageUrl: gallery[0] ?? null,
      quantity: qty || 1,
      paymentMethodLabel: paymentMethodLabel(payment?.provider),
      paymentReference:
        payment?.providerTransactionId || payment?.paymentReference || null,
    };
  });

  return (
    <OrdersView
      cms={cms}
      items={items}
      companyName={quote?.companyName?.trim() || null}
    />
  );
}
