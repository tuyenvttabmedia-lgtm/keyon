import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { decryptPayload, maskHint } from "@/lib/crypto";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { LicenseRevealButton } from "./reveal-button";

export const dynamic = "force-dynamic";

export default async function AdminStockItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.licenseItem.findUnique({
    where: { id },
    include: {
      variant: {
        include: {
          product: { include: { brand: true } },
          supplier: true,
        },
      },
      reservedOrder: { select: { id: true, code: true } },
      orderItem: {
        select: { order: { select: { id: true, code: true } } },
      },
      events: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });
  if (!item) notFound();

  let masked = "••••••••";
  try {
    masked = maskHint(decryptPayload(item.payloadEnc), 4);
  } catch {
    masked = "(decrypt lỗi)";
  }

  const order =
    item.status === "CONSUMED" ? item.orderItem?.order : item.reservedOrder;

  return (
    <div className="space-y-4">
      <div>
        <Link
          href={`/admin/stock/${encodeURIComponent(item.variant.sku)}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          ← {item.variant.sku}
        </Link>
        <h2 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>Chi tiết License</h2>
        <p className="font-mono text-xs text-muted">{item.id}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs text-muted">License (masked)</p>
              <p className="font-mono text-sm text-navy">{masked}</p>
            </div>
            <LicenseRevealButton id={item.id} />
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-xs text-muted">Status</dt>
              <dd className="font-semibold">{item.status}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Provider</dt>
              <dd>{item.variant.supplier?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Product</dt>
              <dd>
                {item.variant.product.brand.name} · {item.variant.product.name}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Variant</dt>
              <dd>
                {item.variant.name}{" "}
                <span className="font-mono text-xs text-muted">
                  {item.variant.sku}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Delivery</dt>
              <dd>
                {receiveFromDeliverable(item.variant.deliverableType).label}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Created</dt>
              <dd>{item.createdAt.toLocaleString("vi-VN")}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Reserved</dt>
              <dd>{item.reservedAt?.toLocaleString("vi-VN") ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Consumed</dt>
              <dd>{item.consumedAt?.toLocaleString("vi-VN") ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Disabled</dt>
              <dd>
                {item.disabledAt?.toLocaleString("vi-VN") ?? "—"}
                {item.disabledReason ? ` · ${item.disabledReason}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Order</dt>
              <dd>
                {order ? (
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-mono text-accent hover:underline"
                  >
                    {order.code}
                  </Link>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-muted">Reservation Token</dt>
              <dd className="font-mono text-xs break-all">
                {item.reservationToken ?? "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h3 className="font-semibold text-navy">History</h3>
          {item.events.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Chưa có LicenseEvent</p>
          ) : (
            <ul className="mt-3 max-h-[28rem] space-y-2 overflow-auto text-xs font-mono">
              {item.events.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-border/60 px-3 py-2"
                >
                  <p className="font-semibold text-navy">{e.type}</p>
                  <p className="text-muted">
                    {e.createdAt.toLocaleString("vi-VN")}
                    {e.reason ? ` · ${e.reason}` : ""}
                  </p>
                  {e.orderId ? (
                    <p className="text-muted">order {e.orderId.slice(0, 10)}…</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
