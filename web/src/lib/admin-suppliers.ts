import type { IntegrationMode, SupplierType } from "@prisma/client";
import { z } from "zod";

export type AdminSupplierListRow = {
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
  waitingHumanCount: number;
};

export type AdminSupplierVariantRow = {
  id: string;
  sku: string;
  variantName: string;
  productId: string;
  productName: string;
  productSlug: string;
  deliverableLabel: string;
  strategyLabel: string;
  active: boolean;
};

export function supplierTypeLabel(type: SupplierType): string {
  switch (type) {
    case "INTERNAL":
      return "Kho KEYON";
    case "EXTERNAL":
      return "Nhà cung cấp ngoài";
    case "DISTRIBUTOR":
      return "Nhà phân phối";
    case "MARKETPLACE":
      return "Sàn thương mại";
    default:
      return type;
  }
}

export function integrationModeLabel(mode: IntegrationMode): string {
  switch (mode) {
    case "NONE":
      return "Không tích hợp";
    case "MANUAL_OPS":
      return "Xử lý thủ công";
    case "API":
      return "API tự động";
    default:
      return mode;
  }
}

/** Cột “Xử lý đơn” — presentation theo combo type + mode. */
export function processingLabel(
  type: SupplierType,
  mode: IntegrationMode,
): string {
  if (type === "INTERNAL" && mode === "NONE") return "Kho License";
  if (mode === "MANUAL_OPS") return "Xử lý thủ công";
  if (mode === "API") return "API tự động";
  return integrationModeLabel(mode);
}

export function fulfillmentStrategyLabel(strategy: string): string {
  switch (strategy) {
    case "INSTANT":
      return "Giao ngay";
    case "MANUAL":
      return "Thủ công";
    case "SEMI_AUTOMATED":
      return "Bán tự động (NCC)";
    case "MANAGED_SUBSCRIPTION":
      return "Subscription quản lý";
    default:
      return strategy;
  }
}

const optionalTrimmed = z
  .string()
  .trim()
  .max(200)
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null));

export const supplierWriteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  supplierType: z.enum([
    "INTERNAL",
    "EXTERNAL",
    "DISTRIBUTOR",
    "MARKETPLACE",
  ]),
  integrationMode: z.enum(["NONE", "MANUAL_OPS", "API"]),
  active: z.boolean().optional().default(true),
  contactName: optionalTrimmed,
  contactEmail: z
    .string()
    .trim()
    .max(200)
    .optional()
    .nullable()
    .transform((v) => {
      if (!v) return null;
      const t = v.trim();
      if (!t) return null;
      return t;
    })
    .refine((v) => v === null || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Email liên hệ không hợp lệ",
    }),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .nullable()
    .transform((v) => {
      if (!v) return null;
      const t = v.trim();
      if (!t) return null;
      if (/^https?:\/\//i.test(t)) return t;
      return `https://${t}`;
    }),
  notes: z.string().trim().max(2000).optional().nullable(),
});

export type SupplierWriteInput = z.infer<typeof supplierWriteSchema>;
