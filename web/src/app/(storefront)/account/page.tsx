import { redirect } from "next/navigation";
import type { DeliverableType } from "@prisma/client";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultCmsAccount, readJsonFile } from "@/server/cms/store";
import { resolveAccountCopy } from "@/storefront/lib/account-cms";
import {
  OverviewView,
  type OverviewLicenseBucket,
  type OverviewLicenseBreakdown,
  type OverviewLicenseEvent,
  type OverviewOrderRow,
  type OverviewSpendPoint,
} from "@/storefront/components/account/OverviewView";
import { orderListStatus } from "@/storefront/lib/order-list-status";
import { parseStringList } from "@/storefront/lib/product-cms";

export const dynamic = "force-dynamic";

function licenseBucket(
  type: DeliverableType,
  expiresAt: Date | null,
  disabledAt: Date | null,
): OverviewLicenseBucket {
  if (disabledAt) return "unavailable";
  if (expiresAt && expiresAt.getTime() < Date.now()) return "expired";
  if (type === "EXTERNAL_PORTAL" || type === "SUBSCRIPTION") return "activating";
  return "ready";
}

export default async function AccountOverviewPage() {
  const session = await readSession();
  if (!session) redirect("/login");

  const where = {
    OR: [{ userId: session.id }, { email: session.email }],
  };

  const [cmsRaw, orders, deliveries, notifications] = await Promise.all([
    readJsonFile("account.json", defaultCmsAccount),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 120,
      include: {
        items: {
          include: {
            deliveries: true,
            variant: { include: { product: true } },
          },
        },
        payments: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    }),
    prisma.delivery.findMany({
      where: { orderItem: { order: where } },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        orderItem: {
          include: {
            consumedLicenses: {
              orderBy: { consumedAt: "desc" },
              take: 1,
              select: { expiresAt: true, disabledAt: true },
            },
          },
        },
      },
    }),
    prisma.userNotification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  const cms = resolveAccountCopy(cmsRaw);

  const orderCreatedAt: string[] = [];
  const spendPoints: OverviewSpendPoint[] = [];
  const recentOrders: OverviewOrderRow[] = [];

  for (const o of orders) {
    orderCreatedAt.push(o.createdAt.toISOString());
    const payment = o.payments[0];
    const hasDelivery = o.items.some((i) => i.deliveries.length > 0);
    const status = orderListStatus(o.status, payment?.status, hasDelivery, cms);
    if (status.countsAsSpend) {
      spendPoints.push({
        createdAtIso: o.createdAt.toISOString(),
        amountVnd: o.totalVnd,
      });
    }
  }

  for (const o of orders.slice(0, 5)) {
    const payment = o.payments[0];
    const hasDelivery = o.items.some((i) => i.deliveries.length > 0);
    const status = orderListStatus(o.status, payment?.status, hasDelivery, cms);
    const primary = o.items[0];
    const gallery = primary
      ? parseStringList(primary.variant.product.galleryUrls)
      : [];
    const productTitle =
      o.items.length > 1
        ? `${primary?.title ?? "Đơn hàng"} +${o.items.length - 1}`
        : (primary?.title ?? "Đơn hàng");

    recentOrders.push({
      id: o.id,
      code: o.code,
      createdAtIso: o.createdAt.toISOString(),
      productTitle,
      productImageUrl: gallery[0] ?? null,
      totalVnd: o.totalVnd,
      statusLabel: status.statusLabel,
      statusTone: status.statusTone,
    });
  }

  const licenseBreakdown: OverviewLicenseBreakdown = {
    activating: 0,
    ready: 0,
    expired: 0,
    unavailable: 0,
  };
  const licenseEvents: OverviewLicenseEvent[] = [];

  for (const d of deliveries) {
    const meta = d.orderItem.consumedLicenses[0];
    const bucket = licenseBucket(
      d.deliverableType,
      meta?.expiresAt ?? null,
      meta?.disabledAt ?? null,
    );
    licenseBreakdown[bucket] += 1;
    licenseEvents.push({
      createdAtIso: d.createdAt.toISOString(),
      bucket,
    });
  }

  return (
    <OverviewView
      cms={cms}
      userName={session.name ?? null}
      recentOrders={recentOrders}
      orderCreatedAt={orderCreatedAt}
      spendPoints={spendPoints}
      licenseEvents={licenseEvents}
      licenseBreakdown={licenseBreakdown}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        createdAtIso: n.createdAt.toISOString(),
        readAt: n.readAt?.toISOString() ?? null,
      }))}
    />
  );
}
