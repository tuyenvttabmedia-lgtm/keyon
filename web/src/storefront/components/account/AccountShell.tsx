"use client";

import { usePathname } from "next/navigation";
import { AccountNav } from "./AccountNav";

export function AccountShell({
  children,
  unreadNotifications = 0,
}: {
  children: React.ReactNode;
  unreadNotifications?: number;
}) {
  const pathname = usePathname();
  return (
    <div className="home-container flex flex-col gap-5 py-8 md:flex-row md:items-start md:gap-5 md:py-10 lg:gap-6">
      <AccountNav pathname={pathname} unreadNotifications={unreadNotifications} />
      <div className="min-w-0 flex-1 md:min-h-[60vh]">{children}</div>
    </div>
  );
}
