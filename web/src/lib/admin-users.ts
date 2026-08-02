import type { UserRole } from "@prisma/client";
import { z } from "zod";

export const STAFF_ROLES = ["ADMIN", "FULFILLMENT", "CS"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: UserRole): role is StaffRole {
  return (STAFF_ROLES as readonly string[]).includes(role);
}

export function staffRoleLabel(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "Quản trị viên";
    case "FULFILLMENT":
      return "Giao hàng";
    case "CS":
      return "CSKH";
    case "CUSTOMER":
      return "Khách hàng";
    default:
      return role;
  }
}

export function staffRoleHint(role: StaffRole): string {
  switch (role) {
    case "ADMIN":
      return "Toàn quyền Admin · cấu hình · người dùng";
    case "FULFILLMENT":
      return "Inbox · đơn hàng · kho license";
    case "CS":
      return "Đơn hàng · khách · tickets (không sửa NCC / settings)";
  }
}

export type AdminUserListRow = {
  id: string;
  email: string;
  name: string | null;
  role: StaffRole;
  totpEnabled: boolean;
  emailVerified: boolean;
  disabled: boolean;
  createdAt: string;
  lastSeenAt: string | null;
  activeSessionCount: number;
};

export const staffCreateSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Email không hợp lệ")
    .transform((v) => v.toLowerCase()),
  name: z.string().trim().min(1, "Họ tên bắt buộc").max(120),
  role: z.enum(STAFF_ROLES),
});

export const staffPatchSchema = z
  .object({
    name: z.string().trim().max(120).optional().nullable(),
    role: z.enum(STAFF_ROLES).optional(),
  })
  .refine((v) => v.name !== undefined || v.role !== undefined, {
    message: "Không có thay đổi",
  });

export const staffStatusSchema = z.object({
  disabled: z.boolean(),
});
