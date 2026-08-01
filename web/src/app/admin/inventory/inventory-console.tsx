"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  importStockHref,
  sortInventoryRows,
  stockStatusLabel,
  type AdminInventoryRow,
  type InventoryQuickFilter,
} from "@/lib/admin-inventory";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

type Kpis = {
  available: number;
  reserved: number;
  consumed: number;
  lowStockSkus: number;
  outOfStockSkus: number;
};

function StatusBadge({ status }: { status: AdminInventoryRow["stockStatus"] }) {
  if (status === "OUT_OF_STOCK") {
    return (
      <span
        className={`rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-red-200 ${BADGE_CLASS}`}
      >
        🔴 Hết hàng
      </span>
    );
  }
  if (status === "LOW_STOCK") {
    return (
      <span
        className={`rounded-full bg-amber-50 px-2 py-0.5 text-amber-900 ring-1 ring-amber-200 ${BADGE_CLASS}`}
      >
        🟡 Sắp hết
      </span>
    );
  }
  return (
    <span
      className={`rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200 ${BADGE_CLASS}`}
    >
      🟢 Đủ hàng
    </span>
  );
}

const QUICK: { id: InventoryQuickFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "needs", label: "Cần xử lý" },
  { id: "out", label: "Hết hàng" },
  { id: "low", label: "Sắp hết" },
  { id: "ok", label: "Đủ hàng" },
];

export function InventoryConsole({
  kpis,
  rows,
  brands,
  products,
  suppliers,
  deliverableOptions,
}: {
  kpis: Kpis;
  rows: AdminInventoryRow[];
  brands: Array<{ id: string; name: string }>;
  products: Array<{ id: string; name: string; brandId: string }>;
  suppliers: Array<{ id: string; name: string }>;
  deliverableOptions: Array<{ id: string; label: string }>;
}) {
  const [q, setQ] = useState("");
  const [quick, setQuick] = useState<InventoryQuickFilter>("all");
  const [status, setStatus] = useState<"all" | "OK" | "LOW_STOCK" | "OUT_OF_STOCK">(
    "all",
  );
  const [brandId, setBrandId] = useState("");
  const [productId, setProductId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [deliverable, setDeliverable] = useState("");

  const filteredProducts = useMemo(() => {
    if (!brandId) return products;
    return products.filter((p) => p.brandId === brandId);
  }, [products, brandId]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const list = rows.filter((r) => {
      if (quick === "needs") {
        if (r.stockStatus === "OK") return false;
      } else if (quick === "out") {
        if (r.stockStatus !== "OUT_OF_STOCK") return false;
      } else if (quick === "low") {
        if (r.stockStatus !== "LOW_STOCK") return false;
      } else if (quick === "ok") {
        if (r.stockStatus !== "OK") return false;
      }

      if (status !== "all" && r.stockStatus !== status) return false;
      if (brandId && r.brandId !== brandId) return false;
      if (productId && r.productId !== productId) return false;
      if (supplierId) {
        if (supplierId === "none") {
          if (r.supplierId != null) return false;
        } else if (r.supplierId !== supplierId) return false;
      }
      if (deliverable && r.deliverableType !== deliverable) return false;

      if (!query) return true;
      return (
        r.productName.toLowerCase().includes(query) ||
        r.variantName.toLowerCase().includes(query) ||
        r.sku.toLowerCase().includes(query) ||
        r.brandName.toLowerCase().includes(query)
      );
    });
    return sortInventoryRows(list);
  }, [
    rows,
    q,
    quick,
    status,
    brandId,
    productId,
    supplierId,
    deliverable,
  ]);

  const resetKey = `${q}|${quick}|${status}|${brandId}|${productId}|${supplierId}|${deliverable}|${filtered.length}`;
  const page = useClientPagination(
    filtered,
    "keyon.admin.inventory.pageSize",
    resetKey,
  );

  function setQuickFilter(next: InventoryQuickFilter) {
    setQuick(next);
    if (next === "out") setStatus("OUT_OF_STOCK");
    else if (next === "low") setStatus("LOW_STOCK");
    else if (next === "ok") setStatus("OK");
    else setStatus("all");
  }

  const kpiCards = [
    { label: "License khả dụng", value: kpis.available, tone: "text-emerald-700" },
    { label: "Đang giữ", value: kpis.reserved, tone: "text-amber-700" },
    { label: "Đã sử dụng", value: kpis.consumed, tone: "text-navy" },
    { label: "SKU sắp hết", value: kpis.lowStockSkus, tone: "text-amber-800" },
    { label: "SKU hết hàng", value: kpis.outOfStockSkus, tone: "text-red-700" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {kpiCards.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-border bg-card px-4 py-3"
          >
            <p className="text-xs text-muted">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold tabular-nums ${c.tone}`}>
              {c.value.toLocaleString("vi-VN")}
            </p>
          </div>
        ))}
      </div>

      {(kpis.outOfStockSkus > 0 || kpis.lowStockSkus > 0) && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4">
          <p className="text-sm font-semibold text-navy">Cần xử lý</p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {kpis.outOfStockSkus > 0 ? (
              <p className="text-red-700">
                🔴 Hết hàng:{" "}
                <span className="font-bold">{kpis.outOfStockSkus}</span> SKU
              </p>
            ) : null}
            {kpis.lowStockSkus > 0 ? (
              <p className="text-amber-900">
                🟡 Sắp hết:{" "}
                <span className="font-bold">{kpis.lowStockSkus}</span> SKU
              </p>
            ) : null}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {kpis.outOfStockSkus > 0 ? (
              <button
                type="button"
                onClick={() => setQuickFilter("out")}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Xem SKU hết hàng
              </button>
            ) : null}
            {kpis.lowStockSkus > 0 ? (
              <button
                type="button"
                onClick={() => setQuickFilter("low")}
                className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
              >
                Xem SKU sắp hết
              </button>
            ) : null}
          </div>
        </section>
      )}

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-1.5">
          {QUICK.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setQuickFilter(c.id)}
              className={
                quick === c.id
                  ? "rounded-full bg-navy px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-border px-3 py-1 text-xs font-medium text-navy hover:bg-navy-soft"
              }
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-end gap-2">
          <label className="min-w-[200px] flex-1 text-xs">
            <span className="font-medium text-navy">Tìm kiếm</span>
            <input
              className="mt-1 w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              placeholder="Sản phẩm, SKU…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Trạng thái tồn kho</span>
            <select
              className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              value={status}
              onChange={(e) => {
                const v = e.target.value as typeof status;
                setStatus(v);
                if (v === "OUT_OF_STOCK") setQuick("out");
                else if (v === "LOW_STOCK") setQuick("low");
                else if (v === "OK") setQuick("ok");
                else setQuick("all");
              }}
            >
              <option value="all">Tất cả</option>
              <option value="OUT_OF_STOCK">Hết hàng</option>
              <option value="LOW_STOCK">Sắp hết</option>
              <option value="OK">Đủ hàng</option>
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Thương hiệu</span>
            <select
              className="mt-1 block max-w-[160px] rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              value={brandId}
              onChange={(e) => {
                setBrandId(e.target.value);
                setProductId("");
              }}
            >
              <option value="">Tất cả</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Sản phẩm</span>
            <select
              className="mt-1 block max-w-[180px] rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
            >
              <option value="">Tất cả</option>
              {filteredProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Nhà cung cấp</span>
            <select
              className="mt-1 block max-w-[160px] rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="none">— Không NCC —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            <span className="font-medium text-navy">Loại giao</span>
            <select
              className="mt-1 block rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm"
              value={deliverable}
              onChange={(e) => setDeliverable(e.target.value)}
            >
              <option value="">Tất cả</option>
              {deliverableOptions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <PageSizeSelect
            value={page.pageSize}
            onChange={page.setPageSize}
            unit="SKU"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
            <tr>
              <th className="px-3 py-2.5">Sản phẩm / Gói</th>
              <th className="px-3 py-2.5">SKU</th>
              <th className="px-3 py-2.5">Nhà cung cấp</th>
              <th className="px-3 py-2.5">Có sẵn</th>
              <th className="px-3 py-2.5">Đang giữ</th>
              <th className="px-3 py-2.5">Đã sử dụng</th>
              <th className="px-3 py-2.5">Ngưỡng</th>
              <th className="px-3 py-2.5">Tình trạng</th>
              <th className="px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {page.pageItems.map((r) => {
              const needsRestock =
                r.stockStatus === "OUT_OF_STOCK" ||
                r.stockStatus === "LOW_STOCK";
              return (
                <tr key={r.variantId} className="hover:bg-[#f8fafc]/50">
                  <td className="px-3 py-3">
                    <p className="font-medium text-navy">{r.productName}</p>
                    <p className="text-xs text-muted">
                      {r.variantName}
                      {r.brandName ? ` · ${r.brandName}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs text-navy">
                    {r.sku}
                  </td>
                  <td className="px-3 py-3 text-muted">
                    {r.supplierName ?? "—"}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-emerald-700">
                    {r.available}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-amber-700">
                    {r.reserved}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums">
                    {r.consumed}
                  </td>
                  <td className="px-3 py-3 font-mono tabular-nums text-muted">
                    {r.lowStockThreshold}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.stockStatus} />
                    {r.stockStatus === "OUT_OF_STOCK" ? (
                      <p className="mt-1 max-w-[200px] text-[11px] text-red-700">
                        Cần nhập thêm license để tiếp tục bán
                      </p>
                    ) : null}
                    {r.stockStatus === "LOW_STOCK" ? (
                      <p className="mt-1 max-w-[200px] text-[11px] text-amber-900">
                        Còn {r.available} license · ngưỡng{" "}
                        {r.lowStockThreshold}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end gap-1">
                      {needsRestock ? (
                        <Link
                          href={importStockHref(r.productId, r.variantId)}
                          className="rounded-md bg-accent px-2.5 py-1 text-xs font-bold text-white hover:opacity-90"
                        >
                          Nhập thêm
                        </Link>
                      ) : null}
                      <Link
                        href={`/admin/inventory/${encodeURIComponent(r.sku)}`}
                        className="text-xs font-semibold text-accent hover:underline"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            {page.pageItems.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-10 text-center text-sm text-muted"
                >
                  Không có SKU Instant khớp bộ lọc.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <ListPaginationBar
        page={page.page}
        pageCount={page.pageCount}
        from={page.from}
        to={page.to}
        total={page.total}
        unit="SKU"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />

      <p className="text-xs text-muted">
        Đang xem {filtered.length}/{rows.length} SKU · tình trạng mặc định sắp
        xếp: {stockStatusLabel("OUT_OF_STOCK")} →{" "}
        {stockStatusLabel("LOW_STOCK")} → {stockStatusLabel("OK")}
      </p>
    </div>
  );
}
