import "server-only";

import { prisma } from "@/lib/db";
import {
  deriveInboxPriority,
  INBOX_OVERDUE_MS,
  type InboxJobRow,
  type InboxKpi,
  waitingLabelFromMs,
} from "@/lib/admin-inbox";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import type { DeliverableType } from "@prisma/client";

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function isPax8Job(strategy: string, supplierName: string | null) {
  if (strategy === "SEMI_AUTOMATED") return true;
  if (supplierName && /pax8/i.test(supplierName)) return true;
  return false;
}

export async function loadInboxWorkspace(): Promise<{
  jobs: InboxJobRow[];
  kpi: InboxKpi;
}> {
  const now = Date.now();
  const todayStart = startOfToday();

  // Keep include shallow — notes fetched separately (avoids nested-relation
  // validation issues on stale Prisma singletons during Next.dev HMR).
  const [rawJobs, completedToday] = await Promise.all([
    prisma.fulfillmentJob.findMany({
      where: {
        status: {
          in: [
            "WAITING_HUMAN",
            "WAITING_STOCK",
            "QUEUED",
            "PROCESSING",
            "FAILED",
          ],
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
      include: {
        order: true,
        orderItem: {
          include: {
            variant: {
              include: { product: true, supplier: true },
            },
          },
        },
      },
    }),
    prisma.fulfillmentJob.count({
      where: {
        status: "SUCCEEDED",
        finishedAt: { gte: todayStart },
      },
    }),
  ]);

  const orderIds = [...new Set(rawJobs.map((j) => j.orderId))];
  const notesByOrder = new Map<
    string,
    {
      id: string;
      body: string;
      createdAt: Date;
      author: { email: string; name: string | null } | null;
    }[]
  >();

  if (orderIds.length > 0) {
    try {
      const notes = await prisma.orderNote.findMany({
        where: { orderId: { in: orderIds } },
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { email: true, name: true } },
        },
      });
      for (const n of notes) {
        const list = notesByOrder.get(n.orderId) ?? [];
        if (list.length < 10) {
          list.push({
            id: n.id,
            body: n.body,
            createdAt: n.createdAt,
            author: n.author,
          });
          notesByOrder.set(n.orderId, list);
        }
      }
    } catch {
      // OrderNote table/client not ready — workspace still works without notes
    }
  }

  const jobs: InboxJobRow[] = rawJobs.map((job) => {
    const variant = job.orderItem.variant;
    const deliverableType = variant.deliverableType;
    const receive = receiveFromDeliverable(deliverableType as DeliverableType);
    const waitingMs = Math.max(0, now - job.createdAt.getTime());
    const overdue =
      waitingMs >= INBOX_OVERDUE_MS &&
      ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"].includes(job.status);
    const priority = deriveInboxPriority({
      status: job.status,
      waitingMs,
    });
    const supplierName = variant.supplier?.name ?? null;
    const pax8 = isPax8Job(job.strategy, supplierName);
    const orderNotes = notesByOrder.get(job.orderId) ?? [];

    return {
      id: job.id,
      status: job.status,
      strategy: job.strategy,
      notes: job.notes,
      createdAt: job.createdAt.toISOString(),
      startedAt: job.startedAt?.toISOString() ?? null,
      orderId: job.orderId,
      orderCode: job.order.code,
      orderEmail: job.order.email,
      orderPaidAt: job.order.paidAt?.toISOString() ?? null,
      orderCreatedAt: job.order.createdAt.toISOString(),
      productName: variant.product.name,
      variantName: variant.name,
      variantSku: variant.sku,
      deliverableType,
      receiveLabel: receive.label,
      supplierName,
      isPax8: pax8,
      priority,
      waitingMs,
      waitingLabel: waitingLabelFromMs(waitingMs, job.createdAt),
      overdue,
      actionable: ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"].includes(
        job.status,
      ),
      instruction: job.notes,
      notesList: orderNotes.map((n) => ({
        id: n.id,
        body: n.body,
        createdAt: n.createdAt.toISOString(),
        authorLabel: n.author?.name || n.author?.email || "Staff",
      })),
    };
  });

  jobs.sort((a, b) => {
    const rank = { high: 0, normal: 1, low: 2 };
    const d = rank[a.priority] - rank[b.priority];
    if (d !== 0) return d;
    return b.waitingMs - a.waitingMs;
  });

  const kpi: InboxKpi = {
    waiting: jobs.filter((j) => j.status === "WAITING_HUMAN").length,
    overdue: jobs.filter((j) => j.overdue).length,
    manual: jobs.filter((j) => j.strategy === "MANUAL").length,
    pax8: jobs.filter((j) => j.isPax8).length,
    completedToday,
  };

  return { jobs, kpi };
}
