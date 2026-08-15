import type { UserRole } from "@prisma/client";
import { AppError } from "@/lib/errors";

/** Coarse capabilities for KEYON ops (not enterprise RBAC). */
export type StaffCapability =
  | "users"
  | "settings"
  | "monitoring"
  | "storage"
  | "suppliers_mutate"
  | "stock_mutate"
  | "brands_mutate"
  | "catalog_mutate"
  | "media_mutate"
  | "cms_mutate"
  | "payments"
  | "fulfillment"
  | "customers"
  | "tickets"
  | "notifications"
  | "orders";

const ROLE_CAPS: Record<"ADMIN" | "FULFILLMENT" | "CS", ReadonlySet<StaffCapability>> = {
  ADMIN: new Set([
    "users",
    "settings",
    "monitoring",
    "storage",
    "suppliers_mutate",
    "stock_mutate",
    "brands_mutate",
    "catalog_mutate",
    "media_mutate",
    "cms_mutate",
    "payments",
    "fulfillment",
    "customers",
    "tickets",
    "notifications",
    "orders",
  ]),
  FULFILLMENT: new Set([
    "orders",
    "fulfillment",
    "stock_mutate",
    "tickets",
    "notifications",
    "customers",
    "cms_mutate",
    "media_mutate",
  ]),
  CS: new Set([
    "orders",
    "customers",
    "tickets",
    "notifications",
  ]),
};

export function staffHasCapability(
  role: UserRole,
  capability: StaffCapability,
): boolean {
  if (role === "ADMIN" || role === "FULFILLMENT" || role === "CS") {
    return ROLE_CAPS[role].has(capability);
  }
  return false;
}

export function assertStaffCapability(
  role: UserRole,
  capability: StaffCapability,
  message = "Không có quyền thực hiện thao tác này",
) {
  if (!staffHasCapability(role, capability)) {
    throw new AppError(message, 403);
  }
}

/** Settings / mail / payment / storage / NCC API — ADMIN only. */
export function assertSettingsAdmin(role: UserRole) {
  assertStaffCapability(
    role,
    "settings",
    "Không có quyền cấu hình hệ thống",
  );
}

/** Sidebar / page path visibility (UX only — APIs still enforce). */
export function staffCanSeeAdminPath(role: UserRole, href: string): boolean {
  if (role === "ADMIN") return true;
  if (role !== "FULFILLMENT" && role !== "CS") return false;

  if (href === "/admin") return true;

  if (href.startsWith("/admin/users")) return false;
  if (href.startsWith("/admin/settings")) return false;
  if (href.startsWith("/admin/monitoring")) return false;

  if (role === "CS") {
    return (
      href.startsWith("/admin/orders") ||
      href.startsWith("/admin/customers") ||
      href.startsWith("/admin/organizations") ||
      href.startsWith("/admin/tickets") ||
      href.startsWith("/admin/notifications")
    );
  }

  // FULFILLMENT
  if (href.startsWith("/admin/payments")) return false;
  if (href.startsWith("/admin/catalog")) return false;
  if (href.startsWith("/admin/brands")) return false;
  return (
    href.startsWith("/admin/orders") ||
    href.startsWith("/admin/inbox") ||
    href.startsWith("/admin/customers") ||
    href.startsWith("/admin/organizations") ||
    href.startsWith("/admin/tickets") ||
    href.startsWith("/admin/notifications") ||
    href.startsWith("/admin/stock") ||
    href.startsWith("/admin/inventory") ||
    href.startsWith("/admin/suppliers") ||
    href.startsWith("/admin/cms") ||
    href.startsWith("/admin/blog") ||
    href.startsWith("/admin/media")
  );
}
