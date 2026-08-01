import "server-only";

import { prisma } from "@/lib/db";
import type { NotifHistoryRow } from "@/lib/admin-notifications";

export async function loadNotificationHistory(
  take = 80,
): Promise<NotifHistoryRow[]> {
  const rows = await prisma.userNotification.findMany({
    orderBy: { createdAt: "desc" },
    take,
    include: {
      user: { select: { email: true, name: true } },
    },
  });
  return rows.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    href: n.href,
    createdAt: n.createdAt.toISOString(),
    readAt: n.readAt?.toISOString() ?? null,
    userEmail: n.user.email,
    userName: n.user.name,
  }));
}
