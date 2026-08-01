"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IntegrationMode, SupplierType } from "@prisma/client";
import {
  integrationModeLabel,
  processingLabel,
  supplierTypeLabel,
  type AdminSupplierVariantRow,
} from "@/lib/admin-suppliers";
import { BADGE_CLASS } from "@/storefront/typography";
import { SupplierForm } from "./supplier-form";

type Tab = "overview" | "products" | "integration" | "edit";

type ApiPublic = {
  pax8: {
    driver: string;
    baseUrl: string;
    clientId: string;
    companyId: string;
    clientSecretConfigured: boolean;
  };
  pacisoft: {
    enabled: boolean;
    baseUrl: string;
    notes: string;
    apiKeyConfigured: boolean;
  };
  resolved: {
    pax8Driver: string;
    pax8DriverSource: string;
    pax8CredentialsSource: string;
    pacisoftEnabled: boolean;
  };
};

export function SupplierDetail({
  supplier,
  variants,
  waitingHumanCount,
  inventory,
  apiPublic,
}: {
  supplier: {
    id: string;
    name: string;
    supplierType: SupplierType;
    integrationMode: IntegrationMode;
    active: boolean;
    contactName: string | null;
    contactEmail: string | null;
    website: string | null;
    notes: string | null;
    skuCount: number;
  };
  variants: AdminSupplierVariantRow[];
  waitingHumanCount: number;
  inventory: { available: number; reserved: number } | null;
  apiPublic: ApiPublic | null;
}) {
  const isInternal = supplier.supplierType === "INTERNAL";
  const isApi = supplier.integrationMode === "API";
  const isManual = supplier.integrationMode === "MANUAL_OPS";

  const tabs = useMemo(() => {
    const list: { id: Tab; label: string }[] = [
      { id: "overview", label: "Tổng quan" },
      { id: "products", label: "Sản phẩm" },
    ];
    if (isApi) list.push({ id: "integration", label: "Tích hợp" });
    list.push({ id: "edit", label: "Sửa" });
    return list;
  }, [isApi]);

  const [tab, setTab] = useState<Tab>("overview");
  const [testMsg, setTestMsg] = useState<string | null>(null);
  const [testOk, setTestOk] = useState<boolean | null>(null);
  const [testing, setTesting] = useState(false);

  async function runConnectionTest() {
    setTesting(true);
    setTestMsg(null);
    setTestOk(null);
    try {
      const res = await fetch("/api/admin/suppliers-api/test", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        setTestOk(false);
        setTestMsg(data.error ?? data.message ?? "Kết nối lỗi");
      } else {
        setTestOk(true);
        setTestMsg(data.message ?? "OK");
      }
    } catch (e) {
      setTestOk(false);
      setTestMsg(e instanceof Error ? e.message : "Lỗi");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Link
          href="/admin/suppliers"
          className="text-sm font-medium text-accent hover:underline"
        >
          ← Nhà cung cấp
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-navy">
            {supplier.name}
          </h1>
          <span
            className={`rounded-full bg-navy-soft px-2.5 py-0.5 text-navy ${BADGE_CLASS}`}
          >
            {supplierTypeLabel(supplier.supplierType)}
          </span>
          <span
            className={
              supplier.active
                ? "rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700"
                : "rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
            }
          >
            {supplier.active ? "Đang dùng" : "Đang tắt"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted">
          {processingLabel(supplier.supplierType, supplier.integrationMode)} ·{" "}
          {supplier.skuCount} Gói / SKU
          {waitingHumanCount > 0
            ? ` · ${waitingHumanCount} đơn chờ Inbox`
            : ""}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {isInternal ? (
            <>
              <Link
                href="/admin/stock"
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-accent/40"
              >
                License Pool →
              </Link>
              <Link
                href="/admin/inventory"
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-accent/40"
              >
                Tồn kho →
              </Link>
            </>
          ) : null}
          {isManual || waitingHumanCount > 0 ? (
            <Link
              href="/admin/inbox"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-accent/40"
            >
              Inbox{waitingHumanCount > 0 ? ` (${waitingHumanCount})` : ""} →
            </Link>
          ) : null}
          {isApi ? (
            <Link
              href="/admin/settings?tab=ncc"
              className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:border-accent/40"
            >
              Cài đặt NCC / Pax8 →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
              tab === t.id
                ? "bg-navy text-white"
                : "text-muted hover:bg-navy-soft hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          {isInternal ? (
            <section className="rounded-2xl border border-border bg-card px-4 py-4">
              <p className="font-semibold text-navy">Kho nội bộ KEYON</p>
              <p className="mt-1 text-sm text-muted">
                Nguồn giao hàng sử dụng License Pool của KEYON.
              </p>
              {inventory ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Stat label="Gói / SKU" value={supplier.skuCount} />
                  <Stat label="License khả dụng" value={inventory.available} />
                  <Stat label="Đang giữ" value={inventory.reserved} />
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  {supplier.skuCount} Gói / SKU Instant (không có số liệu tồn nếu
                  chưa map Instant).
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/admin/stock"
                  className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white"
                >
                  Xem License
                </Link>
                <Link
                  href="/admin/inventory"
                  className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy"
                >
                  Xem tồn kho
                </Link>
              </div>
            </section>
          ) : null}

          {isManual ? (
            <section className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-4">
              <p className="font-semibold text-navy">Xử lý thủ công</p>
              <p className="mt-1 text-sm text-amber-950">
                Đơn hàng từ nhà cung cấp này cần nhân viên KEYON xử lý theo quy
                trình giao hàng.
              </p>
              {waitingHumanCount > 0 ? (
                <Link
                  href="/admin/inbox"
                  className="mt-3 inline-block rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white"
                >
                  Mở Inbox ({waitingHumanCount} đơn chờ)
                </Link>
              ) : (
                <Link
                  href="/admin/inbox"
                  className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
                >
                  Mở Inbox →
                </Link>
              )}
            </section>
          ) : null}

          <section className="rounded-2xl border border-border bg-card p-5">
            <p className="font-semibold text-navy">Thông tin</p>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <Row label="Tên" value={supplier.name} />
              <Row
                label="Loại"
                value={supplierTypeLabel(supplier.supplierType)}
              />
              <Row
                label="Phương thức xử lý"
                value={integrationModeLabel(supplier.integrationMode)}
              />
              <Row
                label="Xử lý đơn"
                value={processingLabel(
                  supplier.supplierType,
                  supplier.integrationMode,
                )}
              />
              <Row
                label="Trạng thái"
                value={supplier.active ? "Đang dùng" : "Đang tắt"}
              />
              <Row label="Gói / SKU" value={String(supplier.skuCount)} />
              <Row label="Người liên hệ" value={supplier.contactName || "—"} />
              <Row label="Email" value={supplier.contactEmail || "—"} />
              <Row label="Website" value={supplier.website || "—"} />
            </dl>
            {supplier.notes ? (
              <div className="mt-4">
                <p className="text-xs font-medium text-muted">Ghi chú nội bộ</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-navy">
                  {supplier.notes}
                </p>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}

      {tab === "products" ? (
        <ProductsTab variants={variants} />
      ) : null}

      {tab === "integration" && isApi ? (
        <section className="space-y-3 rounded-2xl border border-border bg-card p-5">
          <div>
            <p className="font-semibold text-navy">Tích hợp API</p>
            <p className="mt-1 text-xs text-muted">
              Kiểm tra kết nối dùng cấu hình toàn hệ thống tại Cài đặt → NCC /
              Pax8 (chưa theo từng nhà cung cấp).
            </p>
          </div>

          {apiPublic ? (
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <Row
                label="Provider / Driver"
                value={`Pax8 · ${apiPublic.resolved.pax8Driver}`}
              />
              <Row
                label="Nguồn driver"
                value={apiPublic.resolved.pax8DriverSource}
              />
              <Row
                label="Environment / Base URL"
                value={apiPublic.pax8.baseUrl || "— (ENV hoặc chưa cấu hình)"}
              />
              <Row
                label="Client ID"
                value={
                  apiPublic.pax8.clientId
                    ? `${apiPublic.pax8.clientId.slice(0, 6)}…`
                    : "—"
                }
              />
              <Row
                label="Secret"
                value={
                  apiPublic.pax8.clientSecretConfigured
                    ? "Đã cấu hình (ẩn)"
                    : "Chưa cấu hình"
                }
              />
              <Row
                label="PACISOFT slot"
                value={
                  apiPublic.resolved.pacisoftEnabled
                    ? apiPublic.pacisoft.apiKeyConfigured
                      ? "Bật · key đã cấu hình"
                      : "Bật · chưa có key"
                    : "Tắt"
                }
              />
            </dl>
          ) : (
            <p className="text-sm text-muted">Không đọc được cấu hình API.</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={testing}
              onClick={runConnectionTest}
              className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white disabled:opacity-50"
            >
              {testing ? "Đang kiểm tra…" : "Kiểm tra kết nối"}
            </button>
            <Link
              href="/admin/settings?tab=ncc"
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-navy"
            >
              Mở Cài đặt NCC
            </Link>
          </div>

          {testOk === null && !testMsg ? (
            <p className="text-sm text-amber-800">🟡 Chưa kiểm tra</p>
          ) : null}
          {testOk === true ? (
            <p className="text-sm text-emerald-700">
              🟢 Đã kết nối — {testMsg}
            </p>
          ) : null}
          {testOk === false ? (
            <p className="text-sm text-red-700">🔴 Kết nối lỗi — {testMsg}</p>
          ) : null}
        </section>
      ) : null}

      {tab === "edit" ? (
        <section className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 font-semibold text-navy">Sửa nhà cung cấp</p>
          <SupplierForm
            mode="edit"
            supplierId={supplier.id}
            initial={{
              name: supplier.name,
              supplierType: supplier.supplierType,
              integrationMode: supplier.integrationMode,
              active: supplier.active,
              contactName: supplier.contactName,
              contactEmail: supplier.contactEmail,
              website: supplier.website,
              notes: supplier.notes,
            }}
          />
        </section>
      ) : null}
    </div>
  );
}

function ProductsTab({ variants }: { variants: AdminSupplierVariantRow[] }) {
  if (variants.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
        <p className="font-medium text-navy">
          Nhà cung cấp này chưa được gán sản phẩm.
        </p>
        <Link
          href="/admin/catalog"
          className="mt-3 inline-block text-sm font-semibold text-accent hover:underline"
        >
          Xem Catalog →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-border bg-[#f8fafc] text-xs uppercase text-muted">
          <tr>
            <th className="px-4 py-3">Sản phẩm</th>
            <th className="px-4 py-3">Gói / SKU</th>
            <th className="px-4 py-3">Loại nhận</th>
            <th className="px-4 py-3">Phương thức xử lý</th>
            <th className="px-4 py-3">Trạng thái</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {variants.map((v) => (
            <tr key={v.id}>
              <td className="px-4 py-3 font-medium text-navy">
                {v.productName}
              </td>
              <td className="px-4 py-3">
                <p>{v.variantName}</p>
                <p className="font-mono text-xs text-muted">{v.sku}</p>
              </td>
              <td className="px-4 py-3">{v.deliverableLabel}</td>
              <td className="px-4 py-3">{v.strategyLabel}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    v.active
                      ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                      : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                  }
                >
                  {v.active ? "Đang bán" : "Tắt"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/products/${v.id}`}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Xem sản phẩm
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="px-4 py-2 text-xs text-muted">
        Mapping từ ProductVariant.supplierId — không duplicate logic Catalog.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border/60 py-1.5">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-navy">{value}</dd>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-[#f8fafc] px-3 py-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-navy">
        {value.toLocaleString("vi-VN")}
      </p>
    </div>
  );
}
