"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { UserRole } from "@prisma/client";
import { staffCanSeeAdminPath } from "@/lib/staff-access";

/** UX guard — APIs remain source of truth. */
export function AdminPathGuard({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!pathname?.startsWith("/admin")) return;
    if (!staffCanSeeAdminPath(role, pathname)) {
      router.replace("/admin");
    }
  }, [pathname, role, router]);

  return null;
}
