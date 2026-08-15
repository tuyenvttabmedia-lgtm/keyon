import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import type {
  FulfillmentJobStatus,
  OrderStatus,
  PaymentStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { DualStatus, StatusBadge } from "@/storefront/components/account/AccountNav";
import {
  fulfillmentStatusForCustomer,
  paymentStatusForCustomer,
} from "@/storefront/lib/order-status";
import {
  deliveryPromiseLabel,
  receiveFromDeliverable,
} from "@/storefront/lib/customer-labels";
import { CancelOrderButton } from "../cancel-button";
import { CopyTextButton } from "../copy-button";
import { OrderNotesForm } from "../order-notes-form";
import { CommercialRefForm } from "../commercial-ref-form";
import {
  commercialRefLabel,
  latestCommercialRef,
  parseCommercialRefNote,
} from "@/server/admin/commercial-ref";
import { ResendDeliverableButton } from "../resend-deliverable-button";
import {
  ADMIN_PAGE_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  SUMMARY_TOTAL_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

type TimelineItem = {
  at: Date;
  title: string;
  detail?: string;
  tone?: "default" | "success" | "warn" | "danger";
};

function toneClass(tone: TimelineItem["tone"]) {
  switch (tone) {
    case "success":
      return "bg-emerald-500";
    case "warn":
      return "bg-amber-500";
    case "danger":
      return "bg-red-500";
    default:
      return "bg-slate-400";
  }
}

function Panel({
  id,
  title,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section
      id={id}
      className={`rounded-2xl border border-border bg-card ${className}`}
    >
      <h2 className="border-b border-border px-5 py-3 font-semibold text-navy">
        {title}
      </h2>
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, name: true } },
      items: {
        include: {
          variant: {
            include: { product: true, supplier: true },
          },
          deliveries: {
            include: { resends: { orderBy: { createdAt: "desc" }, take: 5 } },
          },
          fulfillmentJobs: { orderBy: { createdAt: "desc" } },
          reservedLicenses: {
            select: {
              id: true,
              status: true,
              variant: { select: { sku: true } },
            },
            take: 20,
          },
          consumedLicenses: {
            select: {
              id: true,
              status: true,
              variant: { select: { sku: true } },
            },
            take: 20,
          },
        },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        include: { events: { orderBy: { createdAt: "asc" } } },
      },
      fulfillmentJobs: { orderBy: { createdAt: "asc" } },
      internalNotes: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          author: { select: { id: true, email: true, name: true } },
        },
      },
      agreementLinks: {
        include: {
          agreement: {
            select: { id: true, title: true, reference: true, status: true },
          },
        },
      },
    },
  });
  if (!order) notFound();

  const audits = await prisma.auditLog.findMany({
    where: { entityType: "Order", entityId: order.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { actor: { select: { email: true, name: true } } },
  });

  const payment = order.payments[0];
  const hasDelivery = order.items.some((i) => i.deliveries.length > 0);
  const jobStatus = order.items[0]?.fulfillmentJobs[0]?.status ?? null;
  const payUi = paymentStatusForCustomer(
    payment?.status as PaymentStatus | undefined,
    order.status as OrderStatus,
  );
  const fulfillUi = fulfillmentStatusForCustomer({
    orderStatus: order.status as OrderStatus,
    hasDelivery,
    jobStatus: jobStatus as FulfillmentJobStatus | null,
  });

  const timeline: TimelineItem[] = [];
  timeline.push({
    at: order.createdAt,
    title: "Đơn được tạo",
    detail: `${order.code} · ${order.email}`,
  });

  for (const p of order.payments) {
    for (const ev of p.events) {
      timeline.push({
        at: ev.createdAt,
        title: `Payment ${ev.type}`,
        detail:
          [ev.reason, p.paymentReference].filter(Boolean).join(" · ") ||
          undefined,
        tone:
          ev.type === "SUCCEEDED"
            ? "success"
            : ev.type === "FAILED" || ev.type === "CANCELLED"
              ? "danger"
              : ev.type === "EXPIRED"
                ? "warn"
                : "default",
      });
    }
    if (p.succeededAt) {
      timeline.push({
        at: p.succeededAt,
        title: "Thanh toán thành công",
        detail: `${p.provider} · ${p.amountVnd.toLocaleString("vi-VN")} đ`,
        tone: "success",
      });
    }
  }

  for (const job of order.fulfillmentJobs) {
    timeline.push({
      at: job.createdAt,
      title: `Fulfillment job ${job.status}`,
      detail: `${job.strategy}${job.notes ? ` — ${job.notes}` : ""}`,
      tone:
        job.status === "SUCCEEDED"
          ? "success"
          : job.status === "FAILED"
            ? "danger"
            : job.status === "WAITING_HUMAN" || job.status === "WAITING_STOCK"
              ? "warn"
              : "default",
    });
    if (job.startedAt) {
      timeline.push({
        at: job.startedAt,
        title: "Bắt đầu xử lý giao",
        detail: job.id,
      });
    }
    if (job.finishedAt) {
      timeline.push({
        at: job.finishedAt,
        title: "Kết thúc job giao",
        detail: job.status,
        tone: job.status === "SUCCEEDED" ? "success" : "default",
      });
    }
  }

  for (const item of order.items) {
    for (const d of item.deliveries) {
      timeline.push({
        at: d.createdAt,
        title: "Đã tạo delivery / tài sản",
        detail: `${d.deliverableType}${d.displayHint ? ` · ${d.displayHint}` : ""}`,
        tone: "success",
      });
      for (const r of d.resends) {
        timeline.push({
          at: r.createdAt,
          title: "Resend delivery",
          detail: r.reason ?? undefined,
          tone: "warn",
        });
      }
    }
  }

  if (order.paidAt) {
    timeline.push({
      at: order.paidAt,
      title: "Order đánh dấu đã thanh toán",
      tone: "success",
    });
  }
  if (order.completedAt) {
    timeline.push({
      at: order.completedAt,
      title: "Order hoàn tất",
      tone: "success",
    });
  }

  timeline.sort((a, b) => a.at.getTime() - b.at.getTime());

  const waitingInbox = order.fulfillmentJobs.some((j) =>
    ["WAITING_HUMAN", "WAITING_STOCK", "FAILED"].includes(j.status),
  );

  const commercial = latestCommercialRef(order.internalNotes);
  const commercialLabel = commercialRefLabel(commercial);

  const licenses = order.items.flatMap((item) => [
    ...item.reservedLicenses.map((l) => ({
      ...l,
      kind: "reserved" as const,
      itemTitle: item.title,
    })),
    ...item.consumedLicenses.map((l) => ({
      ...l,
      kind: "consumed" as const,
      itemTitle: item.title,
    })),
  ]);

  return (
    <div className="space-y-4">
      <div>
        <Link href="/admin/orders" className={LINK_ACCENT_CLASS}>
          ← Đơn hàng
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className={ADMIN_PAGE_TITLE_CLASS}>{order.code}</h1>
            <p className={SECTION_LEAD_CLASS}>
              {order.email}
              {order.user?.name ? ` · ${order.user.name}` : ""} ·{" "}
              {order.createdAt.toLocaleString("vi-VN")}
              {commercialLabel ? ` · ${commercialLabel}` : ""}
            </p>
            <div className="mt-2">
              <DualStatus payment={payUi} fulfillment={fulfillUi} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className={SUMMARY_TOTAL_CLASS}>
              {order.totalVnd.toLocaleString("vi-VN")} đ
            </span>
            {waitingInbox ? (
              <Link
                href="/admin/inbox"
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800"
              >
                Mở Inbox
              </Link>
            ) : null}
            {order.status === "PENDING_PAYMENT" ? (
              <CancelOrderButton orderId={order.id} />
            ) : null}
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-2 text-xs">
          {(
            [
              ["timeline", "Timeline"],
              ["customer", "Customer"],
              ["payment", "Payment"],
              ["delivery", "Delivery"],
              ["license", "License"],
              ["commercial", "HĐ / PO"],
              ["notes", "Notes"],
              ["audit", "Audit"],
            ] as const
          ).map(([hash, label]) => (
            <a
              key={hash}
              href={`#${hash}`}
              className="rounded-full border border-border bg-card px-2.5 py-1 font-medium text-navy hover:border-accent/40"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="customer" title="Customer">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Email</dt>
              <dd className="text-navy">{order.email}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">User</dt>
              <dd className="text-navy">
                {order.userId ? (
                  <Link
                    href={`/admin/customers?q=${encodeURIComponent(order.email)}`}
                    className="text-accent hover:underline"
                  >
                    {order.user?.email ?? order.userId}
                  </Link>
                ) : (
                  "Guest / chưa gắn user"
                )}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted">Order status</dt>
              <dd className="font-mono text-xs">{order.status}</dd>
            </div>
          </dl>
        </Panel>

        <Panel id="payment" title="Payment">
          {payment ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Provider</dt>
                <dd className="text-navy">{payment.provider}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt className="text-muted">Status</dt>
                <dd>
                  <StatusBadge status={payUi} />
                </dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <dt className="text-muted">Payment ref</dt>
                <dd className="flex items-center gap-2 font-mono text-xs text-navy">
                  {payment.paymentReference}
                  <CopyTextButton text={payment.paymentReference} />
                </dd>
              </div>
              {payment.providerTransactionId ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Provider Txn</dt>
                  <dd className="font-mono text-xs">
                    {payment.providerTransactionId}
                  </dd>
                </div>
              ) : null}
              {payment.expiresAt ? (
                <div className="flex justify-between gap-2">
                  <dt className="text-muted">Hết hạn QR</dt>
                  <dd>{payment.expiresAt.toLocaleString("vi-VN")}</dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="text-sm text-muted">Chưa có bản ghi payment</p>
          )}
        </Panel>
      </div>

      <Panel id="delivery" title="Delivery" bodyClassName="p-0">
        <ul className="divide-y divide-border">
          {order.items.map((item) => {
            const receive = receiveFromDeliverable(item.variant.deliverableType);
            const delivery = deliveryPromiseLabel(
              item.variant.fulfillmentStrategy,
            );
            const job = item.fulfillmentJobs[0];
            return (
              <li key={item.id} className="space-y-3 px-5 py-4 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <p className="font-medium text-navy">{item.title}</p>
                    <p className="text-muted">
                      SKU {item.variant.sku} · SL {item.quantity} ·{" "}
                      {item.unitPriceVnd.toLocaleString("vi-VN")} đ
                    </p>
                    <p className="text-muted">
                      {receive.label} · {delivery}
                      {item.variant.supplier
                        ? ` · NCC ${item.variant.supplier.name}`
                        : ""}
                      {item.variant.salesMotion
                        ? ` · ${item.variant.salesMotion}`
                        : ""}
                    </p>
                  </div>
                  {job ? (
                    <p className="text-xs text-muted">
                      Job:{" "}
                      <span className="font-medium text-navy">{job.status}</span>
                    </p>
                  ) : null}
                </div>
                {item.deliveries.length > 0 ? (
                  <div className="rounded-lg bg-[#f8fafc] px-3 py-2">
                    <p className="text-xs font-semibold uppercase text-muted">
                      Deliverable
                    </p>
                    {item.deliveries.map((d) => (
                      <div
                        key={d.id}
                        className="mt-1 flex flex-wrap items-center justify-between gap-2"
                      >
                        <div>
                          <p className="text-navy">
                            {d.deliverableType}
                            {d.displayHint
                              ? ` · ${d.displayHint}`
                              : " · (đã mã hóa)"}
                          </p>
                          <p className="text-xs text-muted">
                            Resend: {d.resendCount} ·{" "}
                            {d.createdAt.toLocaleString("vi-VN")}
                          </p>
                        </div>
                        <ResendDeliverableButton deliveryId={d.id} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted">Chưa có delivery</p>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel id="license" title="License">
        {licenses.length === 0 ? (
          <p className="text-sm text-muted">Không có bản ghi license gắn đơn.</p>
        ) : (
          <ul className="divide-y divide-border text-sm">
            {licenses.map((l) => (
              <li
                key={`${l.kind}-${l.id}`}
                className="flex flex-wrap justify-between gap-2 py-2 first:pt-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-navy font-mono text-xs">
                    {l.id.slice(0, 12)}…
                  </p>
                  <p className="text-xs text-muted">
                    {l.itemTitle} · {l.variant.sku} · {l.kind}
                  </p>
                </div>
                <span className="font-mono text-xs text-muted">{l.status}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel id="timeline" title="Timeline">
          <ol className="relative space-y-4 border-l border-border pl-5">
            {timeline.map((t, idx) => (
              <li key={`${t.at.toISOString()}-${idx}`} className="relative">
                <span
                  className={`absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-card ${toneClass(t.tone)}`}
                />
                <p className="text-sm font-medium text-navy">{t.title}</p>
                <p className="text-xs text-muted">
                  {t.at.toLocaleString("vi-VN")}
                </p>
                {t.detail ? (
                  <p className="mt-0.5 text-sm text-muted">{t.detail}</p>
                ) : null}
              </li>
            ))}
            {timeline.length === 0 && (
              <li className="text-sm text-muted">Chưa có sự kiện</li>
            )}
          </ol>
        </Panel>

        <div className="space-y-4">
          <Panel id="commercial" title="HĐ / PO (tham chiếu)">
            <CommercialRefForm
              orderId={order.id}
              poNumber={commercial?.poNumber ?? ""}
              contractRef={commercial?.contractRef ?? ""}
            />
            {order.agreementLinks.length ? (
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {order.agreementLinks.map((l) => (
                  <li key={l.id} className="text-sm">
                    <Link
                      href={`/admin/agreements/${l.agreement.id}`}
                      className="font-medium text-navy hover:text-accent"
                    >
                      {l.agreement.title}
                    </Link>
                    <p className="text-xs text-muted">
                      Khung HĐ
                      {l.agreement.reference ? ` · ${l.agreement.reference}` : ""}{" "}
                      · {l.agreement.status}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-muted">
                Gắn đơn vào khung nhiều Order tại{" "}
                <Link href="/admin/agreements" className="text-accent hover:underline">
                  Khung HĐ
                </Link>
                .
              </p>
            )}
          </Panel>
          <Panel id="notes" title="Notes (nội bộ)">
            <OrderNotesForm orderId={order.id} />
            <ul className="mt-4 space-y-3 border-t border-border pt-4">
              {order.internalNotes.length === 0 ? (
                <li className="text-sm text-muted">Chưa có ghi chú.</li>
              ) : (
                order.internalNotes.map((n) => {
                  const tagged = parseCommercialRefNote(n.body);
                  return (
                    <li key={n.id} className="text-sm">
                      {tagged ? (
                        <p className="text-navy">
                          <span className="mr-1.5 rounded-full border border-border px-2 py-0.5 text-[11px] font-semibold text-muted">
                            HĐ/PO
                          </span>
                          {commercialRefLabel(tagged)}
                        </p>
                      ) : (
                        <p className="whitespace-pre-wrap text-navy">{n.body}</p>
                      )}
                      <p className="mt-1 text-xs text-muted">
                        {n.author?.name || n.author?.email || "Staff"} ·{" "}
                        {n.createdAt.toLocaleString("vi-VN")}
                      </p>
                    </li>
                  );
                })
              )}
            </ul>
          </Panel>

          <Panel id="audit" title="Audit">
            {audits.length === 0 ? (
              <p className="text-sm text-muted">Chưa có audit.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {audits.map((a) => (
                  <li key={a.id} className="border-b border-border pb-2 last:border-0">
                    <p className="font-medium text-navy">{a.action}</p>
                    <p className="text-xs text-muted">
                      {a.actor?.email || a.actorId || "system"} ·{" "}
                      {a.createdAt.toLocaleString("vi-VN")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
