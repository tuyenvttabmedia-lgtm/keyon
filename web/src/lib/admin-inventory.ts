import type { StockStatus } from "@/server/inventory-read-model/types";

/** Serializable row for Admin Tồn kho (IRM metrics + catalog labels). */
export type AdminInventoryRow = {
  sku: string;
  variantId: string;
  productId: string;
  productName: string;
  variantName: string;
  brandId: string;
  brandName: string;
  supplierId: string | null;
  supplierName: string | null;
  deliverableType: string;
  deliverableLabel: string;
  available: number;
  reserved: number;
  consumed: number;
  disabled: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
};

export type InventoryQuickFilter =
  | "all"
  | "needs"
  | "out"
  | "low"
  | "ok";

export function stockStatusLabel(status: StockStatus): string {
  if (status === "OUT_OF_STOCK") return "Hết hàng";
  if (status === "LOW_STOCK") return "Sắp hết";
  return "Đủ hàng";
}

export function stockStatusRank(status: StockStatus): number {
  if (status === "OUT_OF_STOCK") return 0;
  if (status === "LOW_STOCK") return 1;
  return 2;
}

export function importStockHref(productId: string, variantId: string): string {
  const sp = new URLSearchParams({
    tab: "import",
    productId,
    variantId,
  });
  return `/admin/stock?${sp.toString()}`;
}

export function sortInventoryRows(rows: AdminInventoryRow[]): AdminInventoryRow[] {
  return [...rows].sort((a, b) => {
    const r = stockStatusRank(a.stockStatus) - stockStatusRank(b.stockStatus);
    if (r !== 0) return r;
    return a.productName.localeCompare(b.productName, "vi");
  });
}
