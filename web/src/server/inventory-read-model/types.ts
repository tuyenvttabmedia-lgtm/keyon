export const INVENTORY_METRICS_VERSION = "inv-rm-1.0";
export const LICENSE_POOL_VERSION = "pool-1.0";

export type StockStatus = "OK" | "LOW_STOCK" | "OUT_OF_STOCK";

export type InventorySkuRow = {
  sku: string;
  variantId: string;
  productName: string;
  variantName: string;
  available: number;
  reserved: number;
  consumed: number;
  disabled: number;
  ttl_release_today: number;
  ttl_release_count: number;
  low_stock_threshold: number;
  stock_status: StockStatus;
};

export type InventorySkuDetail = InventorySkuRow & {
  recent_reservations: InventoryEventRow[];
  recent_releases: InventoryEventRow[];
  recent_consumes: InventoryEventRow[];
};

export type InventoryEventRow = {
  id: string;
  type: string;
  licenseItemId: string;
  orderId: string | null;
  reason: string | null;
  createdAt: string;
};

export type InventoryHealth = {
  inventory_healthy: boolean;
  last_refresh: string;
  metrics_version: string;
  pool_version: string;
};

export function stockStatus(available: number, threshold: number): StockStatus {
  if (available <= 0) return "OUT_OF_STOCK";
  if (available < threshold) return "LOW_STOCK";
  return "OK";
}
