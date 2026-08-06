"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  PortalMenu,
  PORTAL_MENU_ITEM_CLASS,
} from "@/components/PortalMenu";
import { ToggleActiveButton } from "./toggle-active";
import { UpdatePriceForm } from "./update-price";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

export type CatalogRow = {
  id: string;
  productId: string;
  sku: string;
  brandName: string;
  productName: string;
  variantName: string;
  supplierName: string | null;
  receiveLabel: string;
  deliveryLabel: string;
  fulfillmentStrategy: string;
  priceVnd: number;
  costVnd: number;
  variantActive: boolean;
  productActive: boolean;
  productSlug: string;
  skuCount: number;
  invAvailable: number | null;
  invReserved: number | null;
  invDisabled: number | null;
  health: "healthy" | "low" | "out" | "na";
};

type BulkAction =
  | "variant_on"
  | "variant_off"
  | "product_publish"
  | "product_draft"
  | "set_price"
  | "adjust_price_percent"
  | "adjust_price_amount"
  | "set_cost";

function HealthBadge({ health }: { health: CatalogRow["health"] }) {
  if (health === "healthy") {
    return (
      <span className={`rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 ring-1 ring-emerald-200 ${BADGE_CLASS}`}>
        🟢 Healthy
      </span>
    );
  }
  if (health === "low") {
    return (
      <span className={`rounded-full bg-amber-50 px-2 py-0.5 text-amber-900 ring-1 ring-amber-200 ${BADGE_CLASS}`}>
        🟡 Low Stock
      </span>
    );
  }
  if (health === "out") {
    return (
      <span className={`rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-red-200 ${BADGE_CLASS}`}>
        🔴 Out Of Stock
      </span>
    );
  }
  return (
    <span className={`rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 ring-1 ring-slate-200 ${BADGE_CLASS}`}>
      — Manual
    </span>
  );
}

function RowMenu({ row }: { row: CatalogRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  async function clone() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/catalog/product/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: row.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Clone thất bại");
      const nextId = data.variantId as string;
      setOpen(false);
      router.push(`/admin/products/${nextId}`);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi clone");
    } finally {
      setBusy(false);
    }
  }

  const item = PORTAL_MENU_ITEM_CLASS;

  return (
    <div className="relative inline-flex justify-end">
      <button
        ref={btnRef}
        type="button"
        aria-label="Thao tác"
        aria-expanded={open}
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-navy hover:bg-navy-soft"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>
      <PortalMenu
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={btnRef}
        width={176}
      >
        <a
          href={`/products/${row.productSlug}`}
          target="_blank"
          rel="noreferrer"
          className={item}
          onClick={() => setOpen(false)}
        >
          Xem PDP
        </a>
        <Link
          href={`/admin/products/${row.id}`}
          className={item}
          onClick={() => setOpen(false)}
        >
          Chỉnh sửa
        </Link>
        <button type="button" className={item} disabled={busy} onClick={clone}>
          Clone
        </button>
        <Link
          href={`/admin/products/${row.id}#variant`}
          className={item}
          onClick={() => setOpen(false)}
        >
          Variant
        </Link>
        {row.fulfillmentStrategy === "INSTANT" ? (
          <Link
            href={`/admin/inventory/${encodeURIComponent(row.sku)}`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Inventory
          </Link>
        ) : null}
        <Link
          href={`/admin/products/${row.id}#media`}
          className={item}
          onClick={() => setOpen(false)}
        >
          Media
        </Link>
        <Link
          href={`/admin/products/${row.id}#seo`}
          className={item}
          onClick={() => setOpen(false)}
        >
          SEO
        </Link>
      </PortalMenu>
    </div>
  );
}

export function CatalogTable({ rows }: { rows: CatalogRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [priceMode, setPriceMode] = useState<
    "set_price" | "adjust_price_percent" | "adjust_price_amount" | "set_cost"
  >("set_price");
  const [priceInput, setPriceInput] = useState("");

  const page = useClientPagination(rows, "keyon.admin.catalog.pageSize", rows.length);
  const pageIds = page.pageItems.map((r) => r.id);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        for (const id of pageIds) next.delete(id);
      } else {
        for (const id of pageIds) next.add(id);
      }
      return next;
    });
  }

  async function run(action: BulkAction, extras?: Record<string, number>) {
    if (selected.size === 0) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/catalog/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantIds: Array.from(selected),
          action,
          ...extras,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Bulk failed");
      setMsg(`Đã cập nhật ${data.affectedVariants} gói`);
      setSelected(new Set());
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setLoading(false);
    }
  }

  async function applyPrice() {
    const n = Number(priceInput);
    if (!Number.isFinite(n)) {
      setMsg("Nhập số hợp lệ");
      return;
    }
    if (priceMode === "set_price") await run("set_price", { value: Math.round(n) });
    else if (priceMode === "set_cost") await run("set_cost", { value: Math.round(n) });
    else if (priceMode === "adjust_price_percent")
      await run("adjust_price_percent", { percent: n });
    else await run("adjust_price_amount", { amount: Math.round(n) });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2">
        <span className="text-sm text-muted">
          Đã chọn {selected.size}/{rows.length}
        </span>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="SKU"
        />
        <span className="text-xs text-muted">
          trang {page.page}/{page.pageCount}
        </span>
        <button
          type="button"
          disabled={loading || selected.size === 0}
          onClick={() => run("variant_on")}
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40"
        >
          Bật gói
        </button>
        <button
          type="button"
          disabled={loading || selected.size === 0}
          onClick={() => run("variant_off")}
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40"
        >
          Tắt gói
        </button>
        <button
          type="button"
          disabled={loading || selected.size === 0}
          onClick={() => run("product_publish")}
          className="rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-semibold text-accent disabled:opacity-40"
        >
          Xuất bản
        </button>
        <button
          type="button"
          disabled={loading || selected.size === 0}
          onClick={() => run("product_draft")}
          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-40"
          title="Archive = về nháp (không xóa)"
        >
          Archive (nháp)
        </button>
        {msg ? <span className="text-xs text-muted">{msg}</span> : null}
      </div>

      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card px-3 py-3">
        <p className="w-full text-xs font-semibold text-navy">Bulk giá</p>
        <label className="text-xs">
          <span className="text-muted">Chế độ</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={priceMode}
            onChange={(e) => setPriceMode(e.target.value as typeof priceMode)}
          >
            <option value="set_price">Set giá bán =</option>
            <option value="adjust_price_percent">± % giá bán</option>
            <option value="adjust_price_amount">± số tiền (đ)</option>
            <option value="set_cost">Set giá vốn =</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Giá trị</span>
          <input
            type="number"
            className="mt-1 block w-36 rounded-lg border border-border px-2 py-1.5 text-sm"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
          />
        </label>
        <button
          type="button"
          disabled={loading || selected.size === 0 || priceInput === ""}
          onClick={applyPrice}
          className="rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white disabled:opacity-40"
        >
          Áp dụng giá
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Sản phẩm</th>
              <th className="px-3 py-2">Delivery</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Inventory</th>
              <th className="px-3 py-2">SKU #</th>
              <th className="px-3 py-2">Giá</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Health</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {page.pageItems.map((v) => (
              <tr key={v.id} className="border-b border-border/70 align-top hover:bg-[#f8fafc]/40">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(v.id)}
                    onChange={() => toggle(v.id)}
                  />
                </td>
                <td className="px-3 py-3 font-mono text-xs">{v.sku}</td>
                <td className="px-3 py-3">
                  <p className="font-medium">
                    {v.brandName} · {v.productName}
                  </p>
                  <p className="text-muted">{v.variantName}</p>
                  <p className="text-xs text-muted">{v.deliveryLabel}</p>
                </td>
                <td className="px-3 py-3">{v.receiveLabel}</td>
                <td className="px-3 py-3 text-muted">{v.supplierName ?? "—"}</td>
                <td className="px-3 py-3 text-xs">
                  {v.invAvailable == null ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <div className="space-y-0.5 font-mono">
                      <p>
                        <span className="text-emerald-700">A {v.invAvailable}</span>
                        {" · "}
                        <span className="text-amber-700">R {v.invReserved ?? 0}</span>
                      </p>
                      <p className="text-muted">
                        D {v.invDisabled ?? 0}
                        {(v.invAvailable ?? 0) <= 0 ? " · Out" : ""}
                      </p>
                    </div>
                  )}
                </td>
                <td className="px-3 py-3">{v.skuCount}</td>
                <td className="px-3 py-3">
                  <UpdatePriceForm
                    variantId={v.id}
                    priceVnd={v.priceVnd}
                    costVnd={v.costVnd}
                  />
                </td>
                <td className="px-3 py-3">
                  <div className="space-y-1">
                    <ToggleActiveButton variantId={v.id} active={v.variantActive} />
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 font-medium ${BADGE_CLASS} ${
                        v.productActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {v.productActive ? "Live" : "Nháp"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <HealthBadge health={v.health} />
                </td>
                <td className="px-3 py-3 text-right">
                  <RowMenu row={v} />
                </td>
              </tr>
            ))}
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
