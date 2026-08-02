"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { staffCanSeeAdminPath } from "@/lib/staff-access";
import { staffRoleLabel } from "@/lib/admin-users";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  FIELD_VALUE_CLASS,
  LINK_ACCENT_CLASS,
  NAV_ITEM_ACTIVE_CLASS,
  SIDEBAR_SECTION_CLASS,
} from "@/storefront/typography";
import { TRANSITION_UI } from "@/storefront/effects";

type NavItem = {
  href: string;
  label: string;
  match: "exact" | "prefix";
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const GROUPS: NavGroup[] = [
  {
    items: [{ href: "/admin", label: "Dashboard", match: "exact" }],
  },
  {
    title: "Bán hàng",
    items: [
      { href: "/admin/orders", label: "Đơn hàng", match: "prefix" },
      { href: "/admin/inbox", label: "Inbox", match: "prefix" },
      { href: "/admin/customers", label: "Khách hàng", match: "prefix" },
      { href: "/admin/payments", label: "Thanh toán", match: "prefix" },
      { href: "/admin/tickets", label: "Hỗ trợ (tickets)", match: "prefix" },
      {
        href: "/admin/notifications",
        label: "Thông báo",
        match: "prefix",
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/catalog", label: "Sản phẩm", match: "prefix" },
      { href: "/admin/brands", label: "Thương hiệu", match: "prefix" },
    ],
  },
  {
    title: "Kho",
    items: [
      { href: "/admin/stock", label: "License", match: "prefix" },
      { href: "/admin/inventory", label: "Tồn kho", match: "prefix" },
      { href: "/admin/suppliers", label: "Nhà cung cấp", match: "prefix" },
    ],
  },
  {
    title: "Nội dung",
    items: [
      { href: "/admin/cms", label: "CMS", match: "prefix" },
      { href: "/admin/blog", label: "Bài viết", match: "prefix" },
      { href: "/admin/media", label: "Thư viện Media", match: "prefix" },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/users", label: "Người dùng", match: "prefix" },
      { href: "/admin/settings", label: "Cài đặt", match: "prefix" },
      { href: "/admin/monitoring", label: "Monitoring", match: "prefix" },
    ],
  },
];

function isActive(pathname: string, item: NavItem) {
  return item.match === "exact"
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");
}

export function AdminSidebar({
  email,
  role,
}: {
  email: string;
  role: UserRole;
}) {
  const pathname = usePathname();
  const visibleGroups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => staffCanSeeAdminPath(role, item.href)),
  })).filter((g) => g.items.length > 0);

  return (
    <aside className="flex w-full flex-col border-b border-border bg-card md:w-60 md:min-h-screen md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <Image
          src="/brand/keyon-logo.png"
          alt="KEYON"
          width={120}
          height={32}
          className="h-7 w-auto"
        />
        <span className={`rounded bg-accent-soft px-1.5 py-0.5 uppercase text-accent ${BADGE_CLASS}`}>
          Admin
        </span>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto md:gap-0">
        {visibleGroups.map((group, gi) => (
          <div key={group.title ?? `g-${gi}`} className="md:mb-3">
            {group.title ? (
              <p className={`mb-1 hidden px-3 pt-1 md:block ${SIDEBAR_SECTION_CLASS}`}>
                {group.title}
              </p>
            ) : null}
            <div className="flex gap-1 md:flex-col">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? `whitespace-nowrap rounded-lg bg-accent-soft px-3 py-2 ${NAV_ITEM_ACTIVE_CLASS}`
                        : `whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-muted ${TRANSITION_UI} hover:bg-navy-soft hover:text-navy`
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {gi < visibleGroups.length - 1 ? (
              <div className="my-2 hidden border-t border-border md:block" />
            ) : null}
          </div>
        ))}
      </nav>
      <div className="hidden border-t border-border p-4 md:block">
        <p className={`truncate ${FIELD_VALUE_CLASS}`}>{email}</p>
        <p className={CARD_META_CLASS}>{staffRoleLabel(role)}</p>
        <div className="mt-3 flex gap-3">
          <Link href="/" className={LINK_ACCENT_CLASS}>
            Storefront
          </Link>
          <form action="/api/auth/logout" method="post">
            <button type="submit" className={`${CARD_META_CLASS} hover:text-navy`}>
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
