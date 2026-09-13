import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";
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
import {
  isSharedOrgOrder,
  loadOrgPeerAccounts,
  orderWhereForActor,
} from "@/server/org/customer-order-access";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

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

function orderLookupWhere(q: string): Prisma.OrderWhereInput {
  const term = q.trim();
  return {
    OR: [
      { code: { contains: term, mode: "insensitive" } },
      { items: { some: { title: { contains: term, mode: "insensitive" } } } },
      {
        payments: {
          some: {
            OR: [
              { paymentReference: { contains: term, mode: "insensitive" } },
              { providerTransactionId: { contains: term, mode: "insensitive" } },
            ],
          },
        },
      },
    ],
  };
}

export default async function OrdersPage({ searchParams }: Props) {
  const session = await readSession();
  if (!session) {
    const sp = await searchParams;
    const q = sp.q?.trim();
    const next = q
      ? `/account/orders?q=${encodeURIComponent(q)}`
      : "/account/orders";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const sp = await searchParams;
  const query = sp.q?.trim() ?? "";

  const actor = { id: session.id, email: session.email };
  const peers = await loadOrgPeerAccounts(session.id);
  const accessWhere = orderWhereForActor(actor, peers);
  const hasOrgShare = peers.userIds.some((id) => id !== session.id);

  // Exact mã đơn → mở chi tiết luôn (tra cứu có login).
  if (query) {
    const exact = await prisma.order.findFirst({
      where: {
        AND: [accessWhere, { code: { equals: query, mode: "insensitive" } }],
      },
      select: { id: true },
    });
    if (exact) redirect(`/account/orders/${exact.id}`);
  }

  const listWhere: Prisma.OrderWhereInput = query
    ? { AND: [accessWhere, orderLookupWhere(query)] }
    : accessWhere;

  const [cmsRaw, orders, quote] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.order.findMany({
      where: listWhere,
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
      take: query ? 50 : 100,
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
      sharedOrg: isSharedOrgOrder(actor, o),
    };
  });

  return (
    <OrdersView
      cms={cms}
      items={items}
      initialQuery={query}
      companyName={quote?.companyName?.trim() || null}
      hasOrgShare={hasOrgShare}
    />
  );
}
