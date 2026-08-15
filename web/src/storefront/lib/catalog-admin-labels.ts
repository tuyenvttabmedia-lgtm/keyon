/** Admin-facing Vietnamese labels for catalog enums (not customer PDP copy). */

import type {
  DeliverableType,
  FulfillmentStrategy,
  LicenseModel,
  SalesMotion,
} from "@prisma/client";
import type { ProductCategoryKey } from "@/storefront/lib/product-cms";

export const CATEGORY_ADMIN_LABELS: Record<ProductCategoryKey, string> = {
  windows: "Windows / Hệ điều hành",
  office: "Office / Năng suất",
  adobe: "Adobe / Sáng tạo",
  cloud: "Cloud / SaaS",
  security: "Bảo mật",
  other: "Khác",
};

export const FULFILLMENT_ADMIN_LABELS: Record<FulfillmentStrategy, string> = {
  INSTANT: "Giao ngay (Instant pool)",
  MANUAL: "KEYON xử lý thủ công",
  SEMI_AUTOMATED: "Bán tự động",
  MANAGED_SUBSCRIPTION: "Subscription quản lý",
};

export const DELIVERABLE_ADMIN_LABELS: Record<DeliverableType, string> = {
  KEY: "Key / mã kích hoạt",
  ACCOUNT: "Tài khoản",
  SUBSCRIPTION: "Subscription",
  DIGITAL_FILE: "Hồ sơ bàn giao / file",
  EXTERNAL_PORTAL: "Cổng kích hoạt ngoài",
};

export const LICENSE_MODEL_ADMIN_LABELS: Record<LicenseModel, string> = {
  PERPETUAL: "Vĩnh viễn",
  SUBSCRIPTION: "Thuê bao",
  MAINTENANCE: "Bảo trì / nâng cấp",
};

export const SALES_MOTION_ADMIN_LABELS: Record<SalesMotion, string> = {
  SELF_SERVE: "Tự mua (checkout)",
  QUOTE_REQUIRED: "Báo giá; gói MANUAL vẫn thanh toán được",
};

export const FULFILLMENT_OPTIONS = Object.keys(
  FULFILLMENT_ADMIN_LABELS,
) as FulfillmentStrategy[];

export const DELIVERABLE_OPTIONS = Object.keys(
  DELIVERABLE_ADMIN_LABELS,
) as DeliverableType[];

export const LICENSE_MODEL_OPTIONS = Object.keys(
  LICENSE_MODEL_ADMIN_LABELS,
) as LicenseModel[];

export const SALES_MOTION_OPTIONS = Object.keys(
  SALES_MOTION_ADMIN_LABELS,
) as SalesMotion[];
