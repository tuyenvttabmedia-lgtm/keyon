"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ImportPanel, type ImportVariantOpt } from "./import-panel";
import { SkuTable, type StockSkuRow } from "./sku-table";
import {
  ImportHistoryTable,
  type ImportHistoryRow,
} from "./import-history";

export type LicenseTab = "dashboard" | "import" | "skus" | "history";

export type DashboardKpis = {
  total: number;
  available: number;
  reserved: number;
  consumed: number;
  disabled: number;
  lowStockSkus: number;
  outOfStockSkus: number;
};

function syncTabUrl(tab: LicenseTab, health?: "low" | "out") {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (tab === "dashboard") url.searchParams.delete("tab");
  else url.searchParams.set("tab", tab);
  if (health) url.searchParams.set("health", health);
  else url.searchParams.delete("health");
  window.history.replaceState(null, "", url.pathname + url.search);
}

export function LicenseConsole({
  tab: initialTab,
  kpis,
  skuRows,
  brands,
  suppliers,
  importVariants,
  initialSkuHealth,
  initialImportProductId,
  initialImportVariantId,
  historyRows,
}: {
  tab: LicenseTab;
  kpis: DashboardKpis;
  skuRows: StockSkuRow[];
  brands: Array<{ slug: string; name: string }>;
  suppliers: Array<{ id: string; name: string }>;
  importVariants: ImportVariantOpt[];
  initialSkuHealth?: "all" | "low" | "out";
  initialImportProductId?: string;
  initialImportVariantId?: string;
  historyRows: ImportHistoryRow[];
}) {
  const [tab, setTab] = useState<LicenseTab>(initialTab);
  const [skuHealth, setSkuHealth] = useState<"all" | "low" | "out">(
    initialSkuHealth ?? "all",
  );

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialSkuHealth) setSkuHealth(initialSkuHealth);
  }, [initialSkuHealth]);

  function go(next: LicenseTab, health?: "low" | "out") {
    setTab(next);
    if (next === "skus" && health) setSkuHealth(health);
    if (next !== "skus") setSkuHealth("all");
    syncTabUrl(next, health);
  }

  const tabs: Array<{ id: LicenseTab; label: string }> = [
    { id: "dashboard", label: "Dashboard" },
    { id: "import", label: "Nhập kho" },
    { id: "skus", label: "Theo SKU" },
    { id: "history", label: "Import History" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
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

      {tab === "dashboard" ? (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(
              [
                ["Total", kpis.total],
                ["Available", kpis.available],
                ["Reserved", kpis.reserved],
                ["Consumed", kpis.consumed],
                ["Disabled", kpis.disabled],
                ["Low Stock SKU", kpis.lowStockSkus],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-xs text-muted">{label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-navy">
                  {value}
                </p>
              </div>
            ))}
          </div>
          {kpis.outOfStockSkus > 0 || kpis.lowStockSkus > 0 ? (
            <p className="text-sm text-muted">
              {kpis.outOfStockSkus > 0 ? (
                <>
                  <button
                    type="button"
                    onClick={() => go("skus", "out")}
                    className="font-semibold text-danger hover:underline"
                  >
                    {kpis.outOfStockSkus} SKU hết hàng
                  </button>
                  {" · "}
                </>
              ) : null}
              {kpis.lowStockSkus > 0 ? (
                <button
                  type="button"
                  onClick={() => go("skus", "low")}
                  className="font-semibold text-amber-700 hover:underline"
                >
                  {kpis.lowStockSkus} SKU low stock
                </button>
              ) : null}
              {" — xem tab Theo SKU"}
            </p>
          ) : (
            <p className="text-sm text-muted">
              Cảnh báo tồn kho chi tiết:{" "}
              <Link href="/admin/inventory" className="font-medium text-accent hover:underline">
                Tồn kho
              </Link>
            </p>
          )}
        </div>
      ) : null}

      {tab === "import" ? (
        <ImportPanel
          variants={importVariants}
          initialProductId={initialImportProductId}
          initialVariantId={initialImportVariantId}
        />
      ) : null}

      {tab === "skus" ? (
        <SkuTable
          key={skuHealth}
          rows={skuRows}
          brands={brands}
          suppliers={suppliers}
          initialHealth={skuHealth}
        />
      ) : null}

      {tab === "history" ? <ImportHistoryTable rows={historyRows} /> : null}
    </div>
  );
}
