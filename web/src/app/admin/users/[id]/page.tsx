import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { readSession } from "@/lib/auth";
import { isStaffRole, type StaffRole } from "@/lib/admin-users";
import { UserDetail } from "../user-detail";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await readSession();
  const canManage = session?.role === "ADMIN";

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      totpEnabledAt: true,
      emailVerifiedAt: true,
      disabledAt: true,
      createdAt: true,
      passwordChangedAt: true,
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

  if (!user || !isStaffRole(user.role)) notFound();

  return (
    <UserDetail
      canManage={canManage}
      user={{
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as StaffRole,
        totpEnabled: Boolean(user.totpEnabledAt),
        emailVerified: Boolean(user.emailVerifiedAt),
        disabled: Boolean(user.disabledAt),
        createdAt: user.createdAt.toISOString(),
        passwordChangedAt: user.passwordChangedAt?.toISOString() ?? null,
        lastSeenAt: user.authSessions[0]?.lastSeenAt?.toISOString() ?? null,
        activeSessionCount: user._count.authSessions,
        isSelf: session?.id === user.id,
      }}
    />
  );
}
