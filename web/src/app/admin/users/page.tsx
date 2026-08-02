import Link from "next/link";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";
import {
  isStaffRole,
  type AdminUserListRow,
  type StaffRole,
} from "@/lib/admin-users";
import { ADMIN_PAGE_TITLE_CLASS } from "@/storefront/typography";
import { UsersConsole } from "./users-console";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await readSession();
  const canManage = session?.role === "ADMIN";

  const users = await prisma.user.findMany({
    where: { role: { in: ["ADMIN", "FULFILLMENT", "CS"] } },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      totpEnabledAt: true,
      emailVerifiedAt: true,
      disabledAt: true,
      createdAt: true,
      authSessions: {
        where: { revokedAt: null },
        orderBy: { lastSeenAt: "desc" },
        take: 1,
        select: { lastSeenAt: true },
      },
      _count: {
        select: {
          authSessions: { where: { revokedAt: null } },
        },
      },
    },
  });

  const rows: AdminUserListRow[] = users
    .filter((u) => isStaffRole(u.role))
    .map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as StaffRole,
      totpEnabled: Boolean(u.totpEnabledAt),
      emailVerified: Boolean(u.emailVerifiedAt),
      disabled: Boolean(u.disabledAt),
      createdAt: u.createdAt.toISOString(),
      lastSeenAt: u.authSessions[0]?.lastSeenAt?.toISOString() ?? null,
      activeSessionCount: u._count.authSessions,
    }));

  const summary = {
    total: rows.length,
    admin: rows.filter((r) => r.role === "ADMIN").length,
    fulfillment: rows.filter((r) => r.role === "FULFILLMENT").length,
    cs: rows.filter((r) => r.role === "CS").length,
    totpOn: rows.filter((r) => r.totpEnabled).length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className={ADMIN_PAGE_TITLE_CLASS}>Người dùng</h1>
          <p className="text-sm text-muted">
            Quản lý tài khoản nhân viên và quyền truy cập hệ thống
          </p>
        </div>
        {canManage ? (
          <Link
            href="/admin/users/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            + Thêm nhân viên
          </Link>
        ) : null}
      </div>

      <UsersConsole rows={rows} summary={summary} canManage={canManage} />
    </div>
  );
}
