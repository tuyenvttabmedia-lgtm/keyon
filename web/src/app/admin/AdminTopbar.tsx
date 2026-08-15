"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ExternalLink, Search } from "lucide-react";
import { Z_HEADER } from "@/storefront/effects";

const TITLE_BY_PREFIX: { prefix: string; title: string }[] = [
  { prefix: "/admin/orders", title: "Đơn hàng" },
  { prefix: "/admin/inbox", title: "Inbox fulfillment" },
  { prefix: "/admin/customers", title: "Khách hàng" },
  { prefix: "/admin/organizations", title: "Tổ chức" },
  { prefix: "/admin/agreements", title: "Khung HĐ" },
  { prefix: "/admin/payments", title: "Thanh toán" },
  { prefix: "/admin/tickets", title: "Hỗ trợ" },
  { prefix: "/admin/notifications", title: "Thông báo" },
  { prefix: "/admin/catalog", title: "Catalog" },
  { prefix: "/admin/products", title: "Sản phẩm" },
  { prefix: "/admin/brands", title: "Thương hiệu" },
  { prefix: "/admin/stock", title: "License kho" },
  { prefix: "/admin/inventory", title: "Tồn kho" },
  { prefix: "/admin/suppliers", title: "Nhà cung cấp" },
  { prefix: "/admin/cms", title: "CMS" },
  { prefix: "/admin/blog", title: "Bài viết" },
  { prefix: "/admin/media", title: "Thư viện Media" },
  { prefix: "/admin/users", title: "Người dùng" },
  { prefix: "/admin/settings", title: "Cài đặt" },
  { prefix: "/admin/monitoring", title: "Monitoring" },
  { prefix: "/admin", title: "Dashboard" },
];

function titleForPath(pathname: string) {
  for (const row of TITLE_BY_PREFIX) {
    if (row.prefix === "/admin") {
      if (pathname === "/admin") return row.title;
      continue;
    }
    if (pathname === row.prefix || pathname.startsWith(row.prefix + "/")) {
      return row.title;
    }
  }
  return "Admin";
}

export function AdminTopbar({
  email,
  onOpenNav,
}: {
  email: string;
  onOpenNav: () => void;
}) {
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <header
      className={`admin-topbar sticky top-0 ${Z_HEADER} flex h-14 shrink-0 items-center gap-3 border-b border-border px-3 md:px-6`}
    >
      <button
        type="button"
        onClick={onOpenNav}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy transition hover:border-accent hover:text-accent md:hidden"
        aria-label="Mở menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy">{title}</p>
        <p className="hidden truncate text-[11px] text-muted-soft sm:block">
          Vận hành KEYON · {email}
        </p>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/admin/orders"
          className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-muted transition hover:border-accent hover:text-accent sm:inline-flex"
          title="Tìm đơn"
        >
          <Search className="h-3.5 w-3.5" />
          Đơn hàng
        </Link>
        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 text-xs font-medium text-navy transition hover:border-accent hover:bg-accent-soft hover:text-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>
      </div>
    </header>
  );
}
