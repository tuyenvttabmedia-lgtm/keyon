import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { decryptPayload, maskHint } from "@/lib/crypto";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { KeysTable, type KeyRow } from "../keys-table";

export const dynamic = "force-dynamic";

export default async function AdminStockSkuPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku: raw } = await params;
  const sku = decodeURIComponent(raw);

  const variant = await prisma.productVariant.findUnique({
    where: { sku },
    include: {
      product: { include: { brand: true } },
      supplier: true,
    },
  });
  if (!variant || variant.fulfillmentStrategy !== "INSTANT") notFound();

  const [detail, items] = await Promise.all([
    InventoryReadModel.getBySku(sku).catch(() => null),
    prisma.licenseItem.findMany({
      where: { variantId: variant.id },
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        reservedOrder: { select: { id: true, code: true } },
        orderItem: {
          select: { order: { select: { id: true, code: true } } },
        },
      },
    }),
  ]);

  const rows: KeyRow[] = items.map((item) => {
    let masked = "••••••••";
    try {
      masked = maskHint(decryptPayload(item.payloadEnc), 4);
    } catch {
      masked = "(decrypt lỗi)";
    }
    const order =
      item.status === "CONSUMED"
        ? item.orderItem?.order
        : item.reservedOrder;
    return {
      id: item.id,
      masked,
      status: item.status,
      createdAt: item.createdAt.toLocaleString("vi-VN"),
      reservedAt: item.reservedAt?.toLocaleString("vi-VN") ?? null,
      consumedAt: item.consumedAt?.toLocaleString("vi-VN") ?? null,
      disabledAt: item.disabledAt?.toLocaleString("vi-VN") ?? null,
      orderCode: order?.code ?? null,
      orderId: order?.id ?? null,
      reservationToken: item.reservationToken,
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/stock?tab=skus"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Theo SKU
        </Link>
        <h2 className={`mt-2 font-mono ${ADMIN_PAGE_TITLE_CLASS}`}>{sku}</h2>
        <p className="text-sm text-muted">
          {variant.product.brand.name} · {variant.product.name} · {variant.name}
        </p>
        <p className="mt-1 text-xs text-muted">
          Provider: {variant.supplier?.name ?? "—"} · Delivery:{" "}
          {receiveFromDeliverable(variant.deliverableType).label}
        </p>
        <p className="mt-2">
          <Link
            href={`/admin/inventory/${encodeURIComponent(sku)}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Xem tồn kho →
          </Link>
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["Available", detail?.available ?? 0],
            ["Reserved", detail?.reserved ?? 0],
            ["Consumed", detail?.consumed ?? 0],
            ["Disabled", detail?.disabled ?? 0],
            ["Keys (page)", rows.length],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-3">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-0.5 text-xl font-bold tabular-nums text-navy">{value}</p>
          </div>
        ))}
      </div>

      <KeysTable rows={rows} sku={sku} />
    </div>
  );
}
