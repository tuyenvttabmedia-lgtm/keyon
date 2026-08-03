import Link from "next/link";
import { prisma } from "@/lib/db";
import { InventoryReadModel } from "@/server/inventory-read-model";
import { receiveFromDeliverable } from "@/storefront/lib/customer-labels";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { LicenseConsole, type LicenseTab } from "./license-console";
import type { StockSkuRow } from "./sku-table";
import type { ImportVariantOpt } from "./import-panel";
import type { ImportHistoryRow } from "./import-history";

export const dynamic = "force-dynamic";

function parseTab(raw: string | undefined): LicenseTab {
  if (raw === "import" || raw === "skus" || raw === "history") return raw;
  return "dashboard";
}

function parseHealth(raw: string | undefined): "all" | "low" | "out" | undefined {
  if (raw === "low" || raw === "out") return raw;
  return undefined;
}

function metaNum(meta: Record<string, unknown> | null, key: string): number {
  const v = meta?.[key];
  return typeof v === "number" && Number.isFinite(v) ? v : 0;
}

function metaStr(meta: Record<string, unknown> | null, key: string): string | null {
  const v = meta?.[key];
  return typeof v === "string" && v.trim() ? v : null;
}

export default async function AdminStockPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    health?: string;
    productId?: string;
    variantId?: string;
  }>;
}) {
  const sp = await searchParams;
  const initialSkuHealth = parseHealth(sp.health);
  const tab: LicenseTab =
    sp.tab === "import" || sp.productId || sp.variantId
      ? "import"
      : initialSkuHealth && !sp.tab
        ? "skus"
        : parseTab(sp.tab);
  const initialImportProductId = sp.productId?.trim() || undefined;
  const initialImportVariantId = sp.variantId?.trim() || undefined;

  const [summary, variants, suppliers, audits] = await Promise.all([
    InventoryReadModel.dashboardSummary().catch(() => null),
    prisma.productVariant.findMany({
      where: { fulfillmentStrategy: "INSTANT" },
      include: {
        product: { include: { brand: true } },
        supplier: true,
      },
      orderBy: { sku: "asc" },
    }),
    prisma.supplier.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.auditLog.findMany({
      where: { action: "stock.add" },
      orderBy: { createdAt: "desc" },
      take: 80,
      include: { actor: { select: { email: true } } },
    }),
  ]);

  const invByVariant = new Map(
    (summary?.skus ?? []).map((r) => [r.variantId, r]),
  );

  const skuRows: StockSkuRow[] = variants.map((v) => {
    const inv = invByVariant.get(v.id);
    const available = inv?.available ?? 0;
    const reserved = inv?.reserved ?? 0;
    const consumed = inv?.consumed ?? 0;
    const disabled = inv?.disabled ?? 0;
    let health: StockSkuRow["health"] = "out";
    if (inv) {
      if (inv.stock_status === "OUT_OF_STOCK" || available <= 0) health = "out";
      else if (inv.stock_status === "LOW_STOCK") health = "low";
      else health = "healthy";
    } else if (!v.active) {
      health = "out";
    }
    return {
      variantId: v.id,
      sku: v.sku,
      productName: v.product.name,
      variantName: v.name,
      brandName: v.product.brand.name,
      brandSlug: v.product.brand.slug,
      supplierName: v.supplier?.name ?? null,
      deliverableLabel: receiveFromDeliverable(v.deliverableType).label,
      available,
      reserved,
      consumed,
      disabled,
      health,
      lowStockThreshold: v.lowStockThreshold,
    };
  });

  const kpis = {
    total:
      (summary?.available ?? 0) +
      (summary?.reserved ?? 0) +
      (summary?.consumed ?? 0) +
      (summary?.disabled ?? 0),
    available: summary?.available ?? 0,
    reserved: summary?.reserved ?? 0,
    consumed: summary?.consumed ?? 0,
    disabled: summary?.disabled ?? 0,
    lowStockSkus: summary?.low_stock_skus ?? 0,
    outOfStockSkus: summary?.out_of_stock_skus ?? 0,
  };

  const brandMap = new Map<string, string>();
  for (const v of variants) {
    brandMap.set(v.product.brand.slug, v.product.brand.name);
  }
  const brands = Array.from(brandMap.entries())
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "vi"));

  const importVariants: ImportVariantOpt[] = variants
    .filter((v) => v.active)
    .map((v) => ({
      id: v.id,
      sku: v.sku,
      productId: v.productId,
      productName: v.product.name,
      variantName: v.name,
      brandName: v.product.brand.name,
      supplierName: v.supplier?.name ?? null,
      deliverableLabel: receiveFromDeliverable(v.deliverableType).label,
    }));

  const variantById = new Map(variants.map((v) => [v.id, v]));
  const historyRows: ImportHistoryRow[] = audits.map((a) => {
    const meta =
      a.meta && typeof a.meta === "object" && !Array.isArray(a.meta)
        ? (a.meta as Record<string, unknown>)
        : null;
    const variant = a.entityId ? variantById.get(a.entityId) : undefined;
    return {
      id: a.id,
      createdAt: a.createdAt.toLocaleString("vi-VN"),
      sku: metaStr(meta, "sku") ?? variant?.sku ?? null,
      productName:
        metaStr(meta, "productName") ?? variant?.product.name ?? null,
      variantId: a.entityId,
      added: metaNum(meta, "added"),
      duplicateFile: metaNum(meta, "duplicate_file"),
      duplicateDb: metaNum(meta, "duplicate_db"),
      invalid: metaNum(meta, "invalid"),
      actorEmail: a.actor?.email ?? null,
    };
  });

  const thinInstant = skuRows.filter((r) => {
    const v = variants.find((x) => x.id === r.variantId);
    return Boolean(v?.active) && r.available < 20;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className={ADMIN_PAGE_TITLE_CLASS}>Kho License</h2>
          <p className="text-sm text-muted">
            Giao Instant · tồn kho License · nhập key · xem chi tiết SKU
          </p>
        </div>
        <Link
          href="/admin/inventory"
          className="text-sm font-medium text-accent hover:underline"
        >
          Tồn kho (cảnh báo) →
        </Link>
      </div>
      {thinInstant.length > 0 ? (
        <div
          role="status"
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          <p className="font-semibold">
            Pilot buffer: {thinInstant.length} SKU Instant &lt; 20 AVAILABLE
          </p>
          <p className="mt-1 text-amber-900/90">
            {thinInstant
              .slice(0, 8)
              .map((s) => `${s.sku} (${s.available})`)
              .join(" · ")}
            {thinInstant.length > 8 ? " …" : ""}. Tab Import để nhập kho trước
            khi mở khách.
          </p>
        </div>
      ) : null}
      <LicenseConsole
        tab={tab}
        kpis={kpis}
        skuRows={skuRows}
        brands={brands}
        suppliers={suppliers}
        importVariants={importVariants}
        initialSkuHealth={initialSkuHealth}
        initialImportProductId={initialImportProductId}
        initialImportVariantId={initialImportVariantId}
        historyRows={historyRows}
      />
    </div>
  );
}
