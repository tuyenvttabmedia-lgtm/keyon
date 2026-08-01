import type { DeliverableType, FulfillmentStrategy } from "@prisma/client";

export type CatalogValidationIssue = { field: string; message: string };

export type CatalogPublishInput = {
  name: string;
  categoryKey?: string | null;
  galleryUrls?: string[];
  priceVnd: number;
  compareAtPriceVnd?: number | null;
  costVnd?: number;
  sku: string;
  fulfillmentStrategy: FulfillmentStrategy | string;
  deliverableType?: DeliverableType | string;
  supplierId?: string | null;
  /** When true, enforce publish-ready rules */
  publishing: boolean;
};

/** Soft SKU: letters, digits, dash, underscore */
export function isValidSku(sku: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9._-]{1,62}$/.test(sku.trim());
}

export function validateCatalogDraft(input: CatalogPublishInput): CatalogValidationIssue[] {
  const issues: CatalogValidationIssue[] = [];
  if (!input.name.trim()) issues.push({ field: "name", message: "Thiếu tên sản phẩm" });
  if (!input.sku.trim()) issues.push({ field: "sku", message: "Thiếu SKU" });
  else if (!isValidSku(input.sku)) {
    issues.push({
      field: "sku",
      message: "SKU chỉ gồm chữ/số/.-_ (2–63 ký tự, bắt đầu bằng chữ hoặc số)",
    });
  }
  if (!Number.isFinite(input.priceVnd) || input.priceVnd <= 0) {
    issues.push({ field: "priceVnd", message: "Giá bán phải > 0" });
  }
  if (
    input.compareAtPriceVnd != null &&
    input.compareAtPriceVnd > 0 &&
    input.compareAtPriceVnd < input.priceVnd
  ) {
    issues.push({
      field: "compareAtPriceVnd",
      message: "Giá gốc phải ≥ giá bán (hoặc để trống)",
    });
  }
  if (input.costVnd != null && input.costVnd < 0) {
    issues.push({ field: "costVnd", message: "Giá vốn không âm" });
  }
  if (input.fulfillmentStrategy === "INSTANT" && !input.supplierId) {
    issues.push({
      field: "supplierId",
      message: "Gói INSTANT nên gắn Supplier (kho / nguồn key)",
    });
  }
  return issues;
}

export function validateCatalogPublish(input: CatalogPublishInput): CatalogValidationIssue[] {
  const issues = validateCatalogDraft(input);
  if (!input.publishing) return issues;

  if (!input.categoryKey) {
    issues.push({ field: "categoryKey", message: "Xuất bản cần chọn danh mục" });
  }
  return issues;
}

/** Soft checks — show in UI, không chặn API */
export function catalogPublishWarnings(input: CatalogPublishInput): CatalogValidationIssue[] {
  if (!input.publishing) return [];
  const warnings: CatalogValidationIssue[] = [];
  if (!input.galleryUrls?.length) {
    warnings.push({
      field: "galleryUrls",
      message: "Chưa có gallery — PDP sẽ dùng ảnh demo cho đến khi upload Media",
    });
  }
  return warnings;
}

export function formatIssues(issues: CatalogValidationIssue[]): string {
  return issues.map((i) => `• ${i.message}`).join("\n");
}
