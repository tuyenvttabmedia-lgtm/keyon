"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BADGE_CLASS } from "@/storefront/typography";
import {
  ListPaginationBar,
  PageSizeSelect,
  useClientPagination,
} from "@/app/admin/ui/client-pagination";

export type BrandRow = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  supplierId: string | null;
  supplierName: string | null;
  productCount: number;
  variantCount: number;
  availableLicenses: number | null;
  health: "healthy" | "low" | "out" | "na";
  orders30d: number;
  featured: boolean;
  active: boolean;
  hasSeo: boolean;
  sortOrder: number;
};

type SupplierOpt = { id: string; name: string };

type StockFilter = "all" | "in_stock" | "low" | "out";
type StatusFilter = "all" | "active" | "archived";
type SeoFilter = "all" | "has" | "missing";
type FeaturedFilter = "all" | "yes" | "no";

function HealthBadge({ health }: { health: BrandRow["health"] }) {
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
  if (health === "out") {
    return (
      <span
        className={`rounded-full bg-red-50 px-2 py-0.5 text-red-700 ring-1 ring-red-200 ${BADGE_CLASS}`}
      >
        🔴 Out of Stock
      </span>
    );
  }
  return (
    <span
      className={`rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 ring-1 ring-slate-200 ${BADGE_CLASS}`}
    >
      — Manual
    </span>
  );
}

function LogoMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <span className="relative inline-flex h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
        <Image src={logoUrl} alt="" fill className="object-contain p-0.5" unoptimized />
      </span>
    );
  }
  const letter = (name.trim()[0] || "?").toUpperCase();
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-soft text-sm font-bold text-navy"
      aria-hidden
    >
      {letter}
    </span>
  );
}

function RowMenu({ row }: { row: BrandRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  async function setActive(active: boolean) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/brands/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Cập nhật thất bại");
      setOpen(false);
      router.refresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setBusy(false);
    }
  }

  const item =
    "block w-full px-3 py-2 text-left text-sm text-navy hover:bg-[#f8fafc] disabled:opacity-40";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Thao tác"
        className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-navy hover:bg-navy-soft"
        onClick={() => setOpen((v) => !v)}
      >
        ⋮
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-1 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <a
            href={`/brands/${row.slug}`}
            target="_blank"
            rel="noreferrer"
            className={item}
            onClick={() => setOpen(false)}
          >
            Xem Landing
          </a>
          <Link
            href={`/admin/catalog?brand=${encodeURIComponent(row.slug)}`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Danh sách sản phẩm
          </Link>
          <Link
            href={`/admin/brands/${row.id}#seo`}
            className={item}
            onClick={() => setOpen(false)}
          >
            SEO
          </Link>
          <Link
            href={`/admin/brands/${row.id}#media`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Media
          </Link>
          <Link
            href={`/admin/brands/${row.id}`}
            className={item}
            onClick={() => setOpen(false)}
          >
            Chỉnh sửa
          </Link>
          {row.active ? (
            <button
              type="button"
              className={item}
              disabled={busy}
              onClick={() => setActive(false)}
            >
              Archive
            </button>
          ) : (
            <button
              type="button"
              className={item}
              disabled={busy}
              onClick={() => setActive(true)}
            >
              Khôi phục Active
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

export function BrandsTable({
  rows,
  suppliers,
}: {
  rows: BrandRow[];
  suppliers: SupplierOpt[];
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [providerId, setProviderId] = useState("all");
  const [stock, setStock] = useState<StockFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("active");
  const [seo, setSeo] = useState<SeoFilter>("all");
  const [featured, setFeatured] = useState<FeaturedFilter>("all");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (status === "active" && !r.active) return false;
      if (status === "archived" && r.active) return false;
      if (featured === "yes" && !r.featured) return false;
      if (featured === "no" && r.featured) return false;
      if (seo === "has" && !r.hasSeo) return false;
      if (seo === "missing" && r.hasSeo) return false;
      if (providerId === "none") {
        if (r.supplierId != null) return false;
      } else if (providerId !== "all" && r.supplierId !== providerId) {
        return false;
      }
      if (stock === "in_stock" && r.health !== "healthy" && r.health !== "low")
        return false;
      if (stock === "low" && r.health !== "low") return false;
      if (stock === "out" && r.health !== "out") return false;
      if (!qq) return true;
      return (
        r.name.toLowerCase().includes(qq) ||
        r.slug.toLowerCase().includes(qq) ||
        (r.supplierName?.toLowerCase().includes(qq) ?? false)
      );
    });
  }, [rows, q, providerId, stock, status, seo, featured]);

  const resetKey = `${q}|${providerId}|${stock}|${status}|${seo}|${featured}`;
  const page = useClientPagination(
    filtered,
    "keyon.admin.brands.pageSize",
    resetKey,
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-end gap-2 rounded-2xl border border-border bg-card px-3 py-3">
        <label className="text-xs">
          <span className="text-muted">Tìm</span>
          <input
            className="mt-1 block w-40 rounded-lg border border-border px-2 py-1.5 text-sm"
            placeholder="Tên / slug…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="text-xs">
          <span className="text-muted">Trạng thái</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Provider</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="none">Chưa gắn NCC</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Tồn Instant</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={stock}
            onChange={(e) => setStock(e.target.value as StockFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="in_stock">Có hàng</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">Featured</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={featured}
            onChange={(e) => setFeatured(e.target.value as FeaturedFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="yes">Featured</option>
            <option value="no">Không</option>
          </select>
        </label>
        <label className="text-xs">
          <span className="text-muted">SEO</span>
          <select
            className="mt-1 block rounded-lg border border-border px-2 py-1.5 text-sm"
            value={seo}
            onChange={(e) => setSeo(e.target.value as SeoFilter)}
          >
            <option value="all">Tất cả</option>
            <option value="has">Có SEO</option>
            <option value="missing">Chưa SEO</option>
          </select>
        </label>
        <PageSizeSelect
          value={page.pageSize}
          onChange={page.setPageSize}
          unit="brand"
        />
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-muted"
          onClick={() => {
            setQ("");
            setProviderId("all");
            setStock("all");
            setStatus("active");
            setSeo("all");
            setFeatured("all");
            router.refresh();
          }}
        >
          Reset
        </button>
        <span className="ml-auto text-xs text-muted">
          {filtered.length}/{rows.length} brand · trang {page.page}/
          {page.pageCount}
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[1180px] text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-3 py-2">Logo</th>
              <th className="px-3 py-2">Brand</th>
              <th className="px-3 py-2">URL</th>
              <th className="px-3 py-2">Products</th>
              <th className="px-3 py-2">Variants</th>
              <th className="px-3 py-2">Licenses</th>
              <th className="px-3 py-2">Provider</th>
              <th className="px-3 py-2">Health</th>
              <th className="px-3 py-2">Orders 30d</th>
              <th className="px-3 py-2">Featured</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {page.pageItems.map((b) => (
              <tr
                key={b.id}
                className="border-b border-border/70 align-middle hover:bg-[#f8fafc]/40"
              >
                <td className="px-3 py-3">
                  <LogoMark name={b.name} logoUrl={b.logoUrl} />
                </td>
                <td className="px-3 py-3">
                  <Link
                    href={`/admin/brands/${b.id}`}
                    className="font-medium text-navy hover:text-accent"
                  >
                    {b.name}
                  </Link>
                  {!b.hasSeo ? (
                    <p className="text-[10px] text-amber-700">Chưa SEO</p>
                  ) : null}
                </td>
                <td className="px-3 py-3 font-mono text-xs text-muted">
                  /brands/{b.slug}
                </td>
                <td className="px-3 py-3">{b.productCount}</td>
                <td className="px-3 py-3">{b.variantCount}</td>
                <td className="px-3 py-3 font-mono text-xs">
                  {b.availableLicenses == null ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <span className="text-emerald-700">A {b.availableLicenses}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted">{b.supplierName ?? "—"}</td>
                <td className="px-3 py-3">
                  <HealthBadge health={b.health} />
                </td>
                <td className="px-3 py-3">{b.orders30d}</td>
                <td className="px-3 py-3">
                  {b.featured ? (
                    <span
                      className={`rounded-full bg-accent/10 px-2 py-0.5 text-accent ring-1 ring-accent/20 ${BADGE_CLASS}`}
                    >
                      Featured
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 ring-1 ${BADGE_CLASS} ${
                      b.active
                        ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                        : "bg-slate-100 text-slate-600 ring-slate-200"
                    }`}
                  >
                    {b.active ? "Active" : "Archived"}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <RowMenu row={b} />
                </td>
              </tr>
            ))}
            {page.pageItems.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-8 text-center text-sm text-muted">
                  Không có brand khớp bộ lọc
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
        unit="brand"
        onPrev={() => page.setPage(page.page - 1)}
        onNext={() => page.setPage(page.page + 1)}
      />
    </div>
  );
}
