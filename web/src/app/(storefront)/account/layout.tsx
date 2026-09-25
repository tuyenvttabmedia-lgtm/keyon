import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AccountShell } from "@/storefront/components/account/AccountShell";
import { NOINDEX_ROBOTS } from "@/server/seo/noindex";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tài khoản",
  robots: NOINDEX_ROBOTS,
};

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
