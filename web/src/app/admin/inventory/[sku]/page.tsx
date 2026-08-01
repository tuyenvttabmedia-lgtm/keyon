import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { importStockHref, stockStatusLabel } from "@/lib/admin-inventory";
import { AppError } from "@/lib/errors";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import {
  ADMIN_PAGE_TITLE_CLASS,
  BODY_MUTED_CLASS,
  FIELD_CAPTION_CLASS,
  LINK_ACCENT_CLASS,
  SECTION_LEAD_CLASS,
  STAT_VALUE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";

export const dynamic = "force-dynamic";

export default async function AdminInventorySkuPage({
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

  let detail;
  try {
    detail = await InventoryReadModel.getBySku(sku);
  } catch (e) {
    if (e instanceof AppError && e.status === 404) notFound();
    throw e;
  }

  const needsRestock =
    detail.stock_status === "OUT_OF_STOCK" ||
    detail.stock_status === "LOW_STOCK";
  const statusTone =
    detail.stock_status === "OUT_OF_STOCK"
      ? "border-red-200 bg-red-50 text-red-800"
      : detail.stock_status === "LOW_STOCK"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/inventory" className={LINK_ACCENT_CLASS}>
          ← Tồn kho
        </Link>
        <h1 className={`mt-2 ${ADMIN_PAGE_TITLE_CLASS}`}>
          {variant.product.name}
        </h1>
        <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
          {variant.name} ·{" "}
          <span className="font-mono text-navy">{detail.sku}</span>
        </p>
      </div>

      <div
        className={`rounded-2xl border px-4 py-4 ${statusTone}`}
      >
        <p className="text-sm font-semibold">
          {detail.stock_status === "OUT_OF_STOCK"
            ? "🔴 Hết hàng"
            : detail.stock_status === "LOW_STOCK"
              ? "🟡 Sắp hết"
              : "🟢 Đủ hàng"}{" "}
          <span className="font-normal opacity-80">
            ({stockStatusLabel(detail.stock_status)})
          </span>
        </p>
        {detail.stock_status === "OUT_OF_STOCK" ? (
          <p className="mt-1 text-sm">
            Cần nhập thêm license để tiếp tục bán
          </p>
        ) : null}
        {detail.stock_status === "LOW_STOCK" ? (
          <p className="mt-1 text-sm">
            Còn {detail.available} license · ngưỡng cảnh báo{" "}
            {detail.low_stock_threshold}
          </p>
        ) : null}
        <div className="mt-3 flex flex-wrap gap-2">
          {needsRestock ? (
            <Link
              href={importStockHref(variant.productId, variant.id)}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white"
            >
              Nhập thêm
            </Link>
          ) : null}
          <Link
            href={`/admin/stock/${encodeURIComponent(sku)}`}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy"
          >
            Xem License
          </Link>
          <Link
            href={`/admin/products/${variant.id}`}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy"
          >
            Sửa ngưỡng cảnh báo
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetaCard label="Thương hiệu" value={variant.product.brand.name} />
        <MetaCard
          label="Nhà cung cấp"
          value={variant.supplier?.name ?? "—"}
        />
        <MetaCard
          label="Loại giao"
          value={receiveFromDeliverable(variant.deliverableType).label}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Có sẵn (Available)", detail.available],
          ["Đang giữ (Reserved)", detail.reserved],
          ["Đã sử dụng (Consumed)", detail.consumed],
          ["Vô hiệu (Disabled)", detail.disabled],
          ["Ngưỡng cảnh báo", detail.low_stock_threshold],
        ].map(([label, value]) => (
          <div
            key={label as string}
            className="rounded-xl border border-border bg-card p-4"
          >
            <p className={FIELD_CAPTION_CLASS}>{label}</p>
            <p className={`mt-1 ${STAT_VALUE_CLASS}`}>{value as number}</p>
          </div>
        ))}
      </div>

      {detail.reserved > 0 ? (
        <p className={`text-sm ${BODY_MUTED_CLASS}`}>
          Đang giữ: <strong className="text-navy">{detail.reserved}</strong>{" "}
          license (giữ cho đơn chưa hoàn tất — không cần hiểu TTL trên màn
          này).
        </p>
      ) : null}

      <details className="rounded-2xl border border-border bg-card p-4">
        <summary className={`${SUBSECTION_TITLE_CLASS} cursor-pointer text-accent`}>
          Lịch sử gần đây (kỹ thuật)
        </summary>
        <div className="mt-4 space-y-4">
          <EventBlock title="Reservations" rows={detail.recent_reservations} />
          <EventBlock title="Releases" rows={detail.recent_releases} />
          <EventBlock title="Consumes" rows={detail.recent_consumes} />
        </div>
      </details>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className={FIELD_CAPTION_CLASS}>{label}</p>
      <p className="mt-1 font-medium text-navy">{value}</p>
    </div>
  );
}

function EventBlock({
  title,
  rows,
}: {
  title: string;
  rows: Array<{
    id: string;
    licenseItemId: string;
    orderId: string | null;
    reason: string | null;
    createdAt: string;
  }>;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-navy">{title}</h3>
      {rows.length === 0 ? (
        <p className={`mt-1 ${BODY_MUTED_CLASS}`}>Không có</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-xs font-mono text-muted">
          {rows.map((r) => (
            <li key={r.id}>
              {new Date(r.createdAt).toLocaleString("vi-VN")} · lic=
              {r.licenseItemId.slice(0, 8)}…
              {r.orderId ? ` · order=${r.orderId.slice(0, 8)}…` : ""}
              {r.reason ? ` · ${r.reason}` : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
