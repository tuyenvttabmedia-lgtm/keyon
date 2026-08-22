"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { UserRole } from "@prisma/client";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  Bell,
  Boxes,
  CreditCard,
  FileText,
  ImageIcon,
  FileInput,
  Inbox,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  Newspaper,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Truck,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { staffCanSeeAdminPath } from "@/lib/staff-access";
import { staffRoleLabel } from "@/lib/admin-users";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  FIELD_VALUE_CLASS,
  LINK_ACCENT_CLASS,
  SIDEBAR_SECTION_CLASS,
} from "@/storefront/typography";
import { Z_OVERLAY, Z_MODAL } from "@/storefront/effects";

type NavItem = {
  href: string;
  label: string;
  match: "exact" | "prefix";
  icon: LucideIcon;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const GROUPS: NavGroup[] = [
  {
    items: [
      {
        href: "/admin",
        label: "Dashboard",
        match: "exact",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Bán hàng",
    items: [
      { href: "/admin/orders", label: "Đơn hàng", match: "prefix", icon: ShoppingCart },
      { href: "/admin/inbox", label: "Inbox", match: "prefix", icon: Inbox },
      {
        href: "/admin/quote-requests",
        label: "Yêu cầu BG",
        match: "prefix",
        icon: FileInput,
      },
      { href: "/admin/customers", label: "Khách hàng", match: "prefix", icon: Users },
      { href: "/admin/organizations", label: "Tổ chức", match: "prefix", icon: Building2 },
      { href: "/admin/agreements", label: "Khung HĐ", match: "prefix", icon: FileText },
      { href: "/admin/payments", label: "Thanh toán", match: "prefix", icon: CreditCard },
      { href: "/admin/tickets", label: "Hỗ trợ", match: "prefix", icon: LifeBuoy },
      {
        href: "/admin/notifications",
        label: "Thông báo",
        match: "prefix",
        icon: Bell,
      },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/admin/catalog", label: "Sản phẩm", match: "prefix", icon: Package },
      { href: "/admin/brands", label: "Thương hiệu", match: "prefix", icon: Tag },
    ],
  },
  {
    title: "Kho",
    items: [
      { href: "/admin/stock", label: "License", match: "prefix", icon: KeyRound },
      { href: "/admin/inventory", label: "Tồn kho", match: "prefix", icon: Boxes },
      { href: "/admin/suppliers", label: "Nhà cung cấp", match: "prefix", icon: Truck },
    ],
  },
  {
    title: "Nội dung",
    items: [
      { href: "/admin/cms", label: "CMS", match: "prefix", icon: FileText },
      { href: "/admin/blog", label: "Bài viết", match: "prefix", icon: Newspaper },
      { href: "/admin/media", label: "Media", match: "prefix", icon: ImageIcon },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { href: "/admin/users", label: "Người dùng", match: "prefix", icon: UserCog },
      { href: "/admin/settings", label: "Cài đặt", match: "prefix", icon: Settings },
      { href: "/admin/monitoring", label: "Monitoring", match: "prefix", icon: Activity },
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
  open,
  onClose,
}: {
  email: string;
  role: UserRole;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const visibleGroups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => staffCanSeeAdminPath(role, item.href)),
  })).filter((g) => g.items.length > 0);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close drawer on navigate only
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const nav = (
    <>
      <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Image
            src="/brand/keyon-logo.png"
            alt="KEYON"
            width={120}
            height={32}
            className="h-7 w-auto"
            priority
          />
          <span
            className={`rounded-md bg-accent-soft px-1.5 py-0.5 uppercase tracking-wide text-accent ${BADGE_CLASS}`}
          >
            Admin
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-navy-soft hover:text-navy md:hidden"
          aria-label="Đóng menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="admin-sidebar-scroll flex-1 overflow-y-auto p-3">
        {visibleGroups.map((group, gi) => (
          <div key={group.title ?? `g-${gi}`} className={gi > 0 ? "mt-3" : ""}>
            {group.title ? (
              <p className={`mb-1.5 px-2.5 ${SIDEBAR_SECTION_CLASS}`}>
                {group.title}
              </p>
            ) : null}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActive(pathname, item);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={active ? "true" : "false"}
                    className="admin-nav-link"
                    onClick={onClose}
                  >
                    <Icon className="admin-nav-icon" strokeWidth={1.75} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-4">
        <p className={`truncate ${FIELD_VALUE_CLASS}`}>{email}</p>
        <p className={`mt-0.5 ${CARD_META_CLASS}`}>{staffRoleLabel(role)}</p>
        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/account/security" className={LINK_ACCENT_CLASS}>
            Bảo mật
          </Link>
          <Link href="/" className={LINK_ACCENT_CLASS}>
            Storefront
          </Link>
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className={`${CARD_META_CLASS} transition hover:text-navy`}
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden w-[var(--admin-sidebar-w)] shrink-0 flex-col border-r border-border bg-card md:sticky md:top-0 md:flex md:h-screen md:self-start">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className={`fixed inset-0 ${Z_OVERLAY} md:hidden`} role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-navy/40 backdrop-blur-[2px]"
            aria-label="Đóng overlay"
            onClick={onClose}
          />
          <aside
            className={`absolute inset-y-0 left-0 flex w-[min(18rem,88vw)] flex-col bg-card shadow-xl ${Z_MODAL} animate-[admin-fade-in_200ms_var(--motion-ease)]`}
          >
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
