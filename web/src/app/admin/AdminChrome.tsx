"use client";

import { useCallback, useState, type ReactNode } from "react";
import type { UserRole } from "@prisma/client";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminChrome({
  email,
  role,
  banner,
  children,
}: {
  email: string;
  role: UserRole;
  banner?: ReactNode;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const openNav = useCallback(() => setNavOpen(true), []);
  const closeNav = useCallback(() => setNavOpen(false), []);

  return (
    <div className="admin-shell flex min-h-screen">
      <AdminSidebar
        email={email}
        role={role}
        open={navOpen}
        onClose={closeNav}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        {banner}
        <AdminTopbar email={email} onOpenNav={openNav} />
        <main className="admin-main-enter flex-1 p-4 md:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
