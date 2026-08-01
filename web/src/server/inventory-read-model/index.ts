import { prisma } from "@/lib/db";
import { LicensePoolService } from "@/server/license-pool";
import { AppError } from "@/lib/errors";
import {
  INVENTORY_METRICS_VERSION,
  LICENSE_POOL_VERSION,
  stockStatus,
  type InventoryHealth,
  type InventorySkuDetail,
  type InventorySkuRow,
  type InventoryEventRow,
} from "./types";

/**
 * Inventory Read Model — không sở hữu tồn kho.
 * Chỉ tổng hợp từ LicensePoolService.metrics / recentEvents.
 * Cấm: stock_quantity columns, UPDATE license, reserve/consume.
 */
export const InventoryReadModel = {
  _lastRefresh: null as Date | null,

  async listInstantSkus(): Promise<InventorySkuRow[]> {
    const variants = await prisma.productVariant.findMany({
      where: { fulfillmentStrategy: "INSTANT", active: true },
      include: { product: true },
      orderBy: { sku: "asc" },
    });

    const metricsMap = await LicensePoolService.metricsForVariants(
      variants.map((v) => v.id),
    );
    const rows: InventorySkuRow[] = variants.map((v) => {
      const m = metricsMap.get(v.id) ?? {
        available_count: 0,
        reserved_count: 0,
        consumed_count: 0,
        disabled_count: 0,
        ttl_release_count: 0,
        ttl_release_today: 0,
      };
      return toRow(v, m);
    });
    this._lastRefresh = new Date();
    return rows;
  },

  async getBySku(sku: string): Promise<InventorySkuDetail> {
    const variant = await prisma.productVariant.findUnique({
      where: { sku },
      include: { product: true },
    });
    if (!variant) throw new AppError("SKU not found", 404, "INV_SKU_NOT_FOUND");
    if (variant.fulfillmentStrategy !== "INSTANT") {
      throw new AppError("SKU không phải Instant pool", 400, "INV_NOT_INSTANT");
    }

    const m = await LicensePoolService.metrics(variant.id);
    const base = toRow(variant, m);

    const [reservedEv, releasedEv, consumedEv] = await Promise.all([
      LicensePoolService.recentEvents({
        variantId: variant.id,
        types: ["RESERVED"],
        take: 15,
      }),
      LicensePoolService.recentEvents({
        variantId: variant.id,
        types: ["RELEASED"],
        take: 15,
      }),
      LicensePoolService.recentEvents({
        variantId: variant.id,
        types: ["CONSUMED"],
        take: 15,
      }),
    ]);

    this._lastRefresh = new Date();
    return {
      ...base,
      recent_reservations: mapEvents(reservedEv),
      recent_releases: mapEvents(releasedEv),
      recent_consumes: mapEvents(consumedEv),
    };
  },

  /** Tổng hợp Instant — Dashboard dùng, không query LicenseItem. */
  async dashboardSummary() {
    const rows = await this.listInstantSkus();
    const available = rows.reduce((a, r) => a + r.available, 0);
    const reserved = rows.reduce((a, r) => a + r.reserved, 0);
    const consumed = rows.reduce((a, r) => a + r.consumed, 0);
    const disabled = rows.reduce((a, r) => a + r.disabled, 0);
    const lowStock = rows.filter((r) => r.stock_status === "LOW_STOCK").length;
    const outOfStock = rows.filter((r) => r.stock_status === "OUT_OF_STOCK").length;
    return {
      available,
      reserved,
      consumed,
      disabled,
      low_stock_skus: lowStock,
      out_of_stock_skus: outOfStock,
      skus: rows,
    };
  },

  health(): InventoryHealth {
    return {
      inventory_healthy: true,
      last_refresh: (this._lastRefresh ?? new Date()).toISOString(),
      metrics_version: INVENTORY_METRICS_VERSION,
      pool_version: LICENSE_POOL_VERSION,
    };
  },

  /** I1 helper: so khớp metrics row vs Pool raw counts */
  async assertMatchesPool(sku: string): Promise<boolean> {
    const detail = await this.getBySku(sku);
    const variant = await prisma.productVariant.findUniqueOrThrow({ where: { sku } });
    const m = await LicensePoolService.metrics(variant.id);
    return (
      detail.available === m.available_count &&
      detail.reserved === m.reserved_count &&
      detail.consumed === m.consumed_count &&
      detail.disabled === m.disabled_count &&
      detail.ttl_release_today === m.ttl_release_today
    );
  },
};

function toRow(
  v: {
    id: string;
    sku: string;
    name: string;
    lowStockThreshold: number;
    product: { name: string };
  },
  m: {
    available_count: number;
    reserved_count: number;
    consumed_count: number;
    disabled_count: number;
    ttl_release_today: number;
    ttl_release_count: number;
  },
): InventorySkuRow {
  const thr = v.lowStockThreshold;
  return {
    sku: v.sku,
    variantId: v.id,
    productName: v.product.name,
    variantName: v.name,
    available: m.available_count,
    reserved: m.reserved_count,
    consumed: m.consumed_count,
    disabled: m.disabled_count,
    ttl_release_today: m.ttl_release_today,
    ttl_release_count: m.ttl_release_count,
    low_stock_threshold: thr,
    stock_status: stockStatus(m.available_count, thr),
  };
}

function mapEvents(
  rows: Array<{
    id: string;
    type: string;
    licenseItemId: string;
    orderId: string | null;
    reason: string | null;
    createdAt: Date;
  }>,
): InventoryEventRow[] {
  return rows.map((e) => ({
    id: e.id,
    type: e.type,
    licenseItemId: e.licenseItemId,
    orderId: e.orderId,
    reason: e.reason,
    createdAt: e.createdAt.toISOString(),
  }));
}
