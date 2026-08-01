import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AccountShell } from "@/storefront/components/account/AccountShell";

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/login");

  let unread = 0;
  try {
    unread = await prisma.userNotification.count({
      where: { userId: session.id, readAt: null },
    });
  } catch {
    unread = 0;
  }

  return (
    <AccountShell unreadNotifications={unread}>{children}</AccountShell>
  );
}
