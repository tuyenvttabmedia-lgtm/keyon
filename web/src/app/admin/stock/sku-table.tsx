"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

export type StockSkuRow = {
  variantId: string;
  sku: string;
  productName: string;
  variantName: string;
  brandName: string;
  brandSlug: string;
  supplierName: string | null;
  deliverableLabel: string;
  available: number;
  reserved: number;
  consumed: number;
  disabled: number;
  health: "healthy" | "low" | "out";
  lowStockThreshold: number;
};

function HealthBadge({ health }: { health: StockSkuRow["health"] }) {
  if (health === "healthy") {
    return (
      <span
        className={`rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200 ${BADGE_CLASS}`}
      >
        🟢 Healthy
      </span>
    );
  }
  if (health === "low") {
    return (
      <span
        className={`rounded-full bg-amber-50 px-2 py-0.5 text-amber-900 ring-1 ring-amber-200 ${BADGE_CLASS}`}
      >
        🟡 Low Stock
      </span>
    );
  }
  return (
    <span
      className={`rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-red-200 ${BADGE_CLASS}`}
    >
      🔴 Out of Stock
    </span>
  );
}

export function SkuTable({
  rows,
  brands,
  suppliers,
  initialHealth,
}: {
  rows: StockSkuRow[];
  brands: Array<{ slug: string; name: string }>;
  suppliers: Array<{ id: string; name: string }>;
  initialHealth?: "all" | "low" | "out";
}) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("all");
  const [provider, setProvider] = useState("all");
  const [health, setHealth] = useState<"all" | "healthy" | "low" | "out">(
    initialHealth ?? "all",
  );
  const [delivery, setDelivery] = useState("all");

  const deliveryOpts = useMemo(() => {
    const s = new Set(rows.map((r) => r.deliverableLabel));
    return Array.from(s).sort();
  }, [rows]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (brand !== "all" && r.brandSlug !== brand) return false;
      if (provider === "none") {
        if (r.supplierName != null) return false;
      } else if (provider !== "all" && r.supplierName !== provider) {
        return false;
      }
      if (health !== "all" && r.health !== health) return false;
      if (delivery !== "all" && r.deliverableLabel !== delivery) return false;
      if (!qq) return true;
      return (
        r.sku.toLowerCase().includes(qq) ||
        r.productName.toLowerCase().includes(qq) ||
        r.variantName.toLowerCase().includes(qq) ||
        r.brandName.toLowerCase().includes(qq)
      );
    });
  }, [rows, q, brand, provider, health, delivery]);

  const resetKey = `${q}|${brand}|${provider}|${health}|${delivery}`;
  const page = useClientPagination(
    filtered,
    "keyon.admin.stock.skuPageSize",
    resetKey,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card px-3 py-3">
        <label className="text-xs">
          <span className="text-muted">Tìm</span>
          <input
            className="mt-1 block w-44 rounded-lg border border-border px-2 py-1.5 text-sm"
            placeholder="SKU / sản phẩm…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Brand</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {brands.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Provider</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="none">Chưa gắn</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Delivery</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
          >
            <option value="all">Tất cả</option>
            {deliveryOpts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Health</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={health}
            onChange={(e) => setHealth(e.target.value as typeof health)}
          >
            <option value="all">Tất cả</option>
            <option value="healthy">Healthy</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="SKU"
        />
        <span className="ml-auto text-xs text-muted">
          {filtered.length}/{rows.length} SKU · trang {page.page}/{page.pageCount}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">Variant</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Delivery</th>
              <th className="px-3 py-2">A</th>
              <th className="px-3 py-2">R</th>
              <th className="px-3 py-2">D</th>
              <th className="px-3 py-2">C</th>
              <th className="px-3 py-2">Health</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {page.pageItems.map((r) => (
              <tr
                key={r.variantId}
                className="border-b border-border/70 hover:bg-[#f8fafc]/40"
              >
                <td className="px-3 py-3">
                  <p className="font-medium text-navy">{r.productName}</p>
                  <p className="text-xs text-muted">{r.brandName}</p>
                </td>
                <td className="px-3 py-3">
                  <p>{r.variantName}</p>
                  <p className="font-mono text-xs text-muted">{r.sku}</p>
                </td>
                <td className="px-3 py-3 text-muted">{r.supplierName ?? "—"}</td>
                <td className="px-3 py-3">{r.deliverableLabel}</td>
                <td className="px-3 py-3 font-mono text-emerald-700">{r.available}</td>
                <td className="px-3 py-3 font-mono text-amber-700">{r.reserved}</td>
                <td className="px-3 py-3 font-mono text-muted">{r.disabled}</td>
                <td className="px-3 py-3 font-mono">{r.consumed}</td>
                <td className="px-3 py-3">
                  <HealthBadge health={r.health} />
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex flex-col items-end gap-1">
                    <Link
                      href={`/admin/stock/${encodeURIComponent(r.sku)}`}
                      className="text-sm font-semibold text-accent hover:underline"
                    >
                      Xem key
                    </Link>
                    <Link
                      href={`/admin/inventory/${encodeURIComponent(r.sku)}`}
                      className="text-xs font-medium text-navy hover:underline"
                    >
                      Xem tồn kho
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {page.pageItems.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-sm text-muted">
                  Không có SKU khớp bộ lọc
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
    </div>
  );
}
