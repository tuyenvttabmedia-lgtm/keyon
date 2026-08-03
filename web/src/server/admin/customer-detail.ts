import "server-only";

import { prisma } from "@/lib/db";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import type { DeliverableType } from "@prisma/client";

export type CustomerTimelineItem = {
  at: string;
  title: string;
  detail?: string;
  tone?: "default" | "success" | "warn" | "danger";
};

export type CustomerLicenseRow = {
  id: string;
  productName: string;
  variantName: string;
  sku: string;
  deliverableType: string;
  receiveLabel: string;
  displayHint: string | null;
  deliveredAt: string;
  orderCode: string;
  orderId: string;
  resendCount: number;
};

export type CustomerWorkspaceData = {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    createdAt: string;
    emailVerifiedAt: string | null;
    pendingEmail: string | null;
    totpEnabledAt: string | null;
    lastSeenAt: string | null;
  };
  kpi: {
    orderCount: number;
    completedCount: number;
    awaitingCount: number;
    totalSpendVnd: number;
    avgOrderVnd: number;
    lastPurchaseAt: string | null;
  };
  licenses: CustomerLicenseRow[];
  orders: {
    id: string;
    code: string;
    status: string;
    totalVnd: number;
    createdAt: string;
    paidAt: string | null;
    paymentStatus: string | null;
    hasDelivery: boolean;
    jobStatus: string | null;
  }[];
  payments: {
    id: string;
    orderId: string;
    orderCode: string;
    status: string;
    provider: string;
    amountVnd: number;
    paymentReference: string;
    createdAt: string;
    succeededAt: string | null;
  }[];
  tickets: {
    id: string;
    subject: string;
    status: string;
    createdAt: string;
    adminNote: string | null;
  }[];
  orderNotes: {
    id: string;
    orderId: string;
    orderCode: string;
    body: string;
    createdAt: string;
    authorLabel: string;
  }[];
  timeline: CustomerTimelineItem[];
  noteOrderId: string | null;
};

/**
 * Split queries — avoid deep nested include (stale Next/Prisma HMR).
 */
export async function loadCustomerWorkspace(
  id: string,
): Promise<CustomerWorkspaceData | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user || user.role !== "CUSTOMER") return null;

  const [
    lastSession,
    tickets,
    orders,
    orderCount,
    completedCount,
    awaitingCount,
    spendAgg,
  ] = await Promise.all([
    prisma.authSession
      .findFirst({
        where: { userId: id, revokedAt: null },
        orderBy: { lastSeenAt: "desc" },
        select: { lastSeenAt: true },
      })
      .catch(() => null),
    prisma.supportTicket.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        subject: true,
        status: true,
        createdAt: true,
        adminNote: true,
      },
    }),
    prisma.order.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        payments: { orderBy: { createdAt: "desc" } },
        items: {
          include: {
            deliveries: {
              include: {
                resends: { orderBy: { createdAt: "desc" }, take: 3 },
              },
            },
            fulfillmentJobs: { orderBy: { createdAt: "desc" }, take: 1 },
            variant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId: id } }),
    prisma.order.count({ where: { userId: id, status: "COMPLETED" } }),
    prisma.order.count({
      where: {
        userId: id,
        OR: [
          { status: { in: ["PENDING_PAYMENT", "PAID", "FULFILLING"] } },
          {
            fulfillmentJobs: {
              some: {
                status: {
                  in: [
                    "WAITING_HUMAN",
                    "WAITING_STOCK",
                    "FAILED",
                    "QUEUED",
                    "PROCESSING",
                  ],
                },
              },
            },
          },
        ],
      },
    }),
    prisma.order.aggregate({
      where: {
        userId: id,
        status: { in: ["COMPLETED", "PAID", "FULFILLING"] },
      },
      _sum: { totalVnd: true },
      _avg: { totalVnd: true },
      _max: { paidAt: true, completedAt: true, createdAt: true },
    }),
  ]);

  const orderIds = orders.map((o) => o.id);
  let rawNotes: {
    id: string;
    orderId: string;
    body: string;
    createdAt: Date;
    author: { email: string; name: string | null } | null;
  }[] = [];
  if (orderIds.length > 0) {
    try {
      rawNotes = await prisma.orderNote.findMany({
        where: { orderId: { in: orderIds } },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          author: { select: { email: true, name: true } },
        },
      });
    } catch {
      rawNotes = [];
    }
  }

  const orderCodeById = new Map(orders.map((o) => [o.id, o.code]));

  const totalSpendVnd = spendAgg._sum.totalVnd ?? 0;
  const avgOrderVnd = Math.round(spendAgg._avg.totalVnd ?? 0);
  const lastPurchaseAt =
    spendAgg._max.completedAt?.toISOString() ??
    spendAgg._max.paidAt?.toISOString() ??
    spendAgg._max.createdAt?.toISOString() ??
    null;

  const licenses: CustomerLicenseRow[] = [];
  for (const o of orders) {
    for (const item of o.items) {
      for (const d of item.deliveries) {
        const receive = receiveFromDeliverable(
          d.deliverableType as DeliverableType,
        );
        licenses.push({
          id: d.id,
          productName: item.variant.product.name,
          variantName: item.variant.name,
          sku: item.variant.sku,
          deliverableType: d.deliverableType,
          receiveLabel: receive.label,
          displayHint: d.displayHint,
          deliveredAt: d.createdAt.toISOString(),
          orderCode: o.code,
          orderId: o.id,
          resendCount: d.resendCount,
        });
      }
    }
  }

  const payments = orders.flatMap((o) =>
    o.payments.map((p) => ({
      id: p.id,
      orderId: o.id,
      orderCode: o.code,
      status: p.status,
      provider: p.provider,
      amountVnd: p.amountVnd,
      paymentReference: p.paymentReference,
      createdAt: p.createdAt.toISOString(),
      succeededAt: p.succeededAt?.toISOString() ?? null,
    })),
  );

  const orderNotes = rawNotes.map((n) => ({
    id: n.id,
    orderId: n.orderId,
    orderCode: orderCodeById.get(n.orderId) ?? n.orderId,
    body: n.body,
    createdAt: n.createdAt.toISOString(),
    authorLabel: n.author?.name || n.author?.email || "Staff",
  }));

  const timeline: CustomerTimelineItem[] = [];
  timeline.push({
    at: user.createdAt.toISOString(),
    title: "Đăng ký",
    detail: user.email,
  });
  if (user.emailVerifiedAt) {
    timeline.push({
      at: user.emailVerifiedAt.toISOString(),
      title: "Email verified",
      tone: "success",
    });
  }
  if (user.pendingEmail) {
    timeline.push({
      at: user.updatedAt.toISOString(),
      title: "Pending email (legacy)",
      detail: user.pendingEmail,
      tone: "warn",
    });
  }

  const chronological = [...orders].reverse();
  let firstOrderMarked = false;
  for (const o of chronological) {
    if (!firstOrderMarked) {
      timeline.push({
        at: o.createdAt.toISOString(),
        title: "Đơn đầu tiên",
        detail: o.code,
        tone: "success",
      });
      firstOrderMarked = true;
    } else {
      timeline.push({
        at: o.createdAt.toISOString(),
        title: "Tạo đơn",
        detail: o.code,
      });
    }
    if (o.paidAt) {
      timeline.push({
        at: o.paidAt.toISOString(),
        title: "Thanh toán",
        detail: `${o.code} · ${o.totalVnd.toLocaleString("vi-VN")} đ`,
        tone: "success",
      });
    }
    for (const item of o.items) {
      for (const d of item.deliveries) {
        timeline.push({
          at: d.createdAt.toISOString(),
          title: "Giao hàng",
          detail: `${o.code} · ${d.deliverableType}`,
          tone: "success",
        });
        for (const r of d.resends) {
          timeline.push({
            at: r.createdAt.toISOString(),
            title: "Resend",
            detail: o.code,
            tone: "warn",
          });
        }
      }
    }
  }

  timeline.sort(
    (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime(),
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      pendingEmail: user.pendingEmail,
      totpEnabledAt: user.totpEnabledAt?.toISOString() ?? null,
      lastSeenAt: lastSession?.lastSeenAt.toISOString() ?? null,
    },
    kpi: {
      orderCount,
      completedCount,
      awaitingCount,
      totalSpendVnd,
      avgOrderVnd,
      lastPurchaseAt,
    },
    licenses,
    orders: orders.map((o) => ({
      id: o.id,
      code: o.code,
      status: o.status,
      totalVnd: o.totalVnd,
      createdAt: o.createdAt.toISOString(),
      paidAt: o.paidAt?.toISOString() ?? null,
      paymentStatus: o.payments[0]?.status ?? null,
      hasDelivery: o.items.some((i) => i.deliveries.length > 0),
      jobStatus: o.items[0]?.fulfillmentJobs[0]?.status ?? null,
    })),
    payments,
    tickets: tickets.map((t) => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      adminNote: t.adminNote,
    })),
    orderNotes,
    timeline,
    noteOrderId: orders[0]?.id ?? null,
  };
}
