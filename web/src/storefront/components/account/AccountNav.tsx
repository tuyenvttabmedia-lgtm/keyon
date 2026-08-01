"use client";

import Link from "next/link";
import type { CustomerStatus } from "@/storefront/lib/order-status";
import { statusBadgeClass } from "@/storefront/lib/order-status";
import {
  BADGE_CLASS,
  NAV_ITEM_ACTIVE_CLASS,
  NAV_ITEM_CLASS,
  SIDEBAR_SECTION_CLASS,
} from "@/storefront/typography";
import { MOTION_FAST } from "@/storefront/effects";

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${BADGE_CLASS} ${statusBadgeClass(status.tone)}`}
    >
      {status.label}
    </span>
  );
}

export function DualStatus({
  payment,
  fulfillment,
}: {
  payment: CustomerStatus;
  fulfillment: CustomerStatus;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <StatusBadge status={payment} />
      <StatusBadge status={fulfillment} />
    </div>
  );
}

type NavItem = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
  icon: "grid" | "bag" | "box" | "user" | "lock" | "bell" | "headset";
};

const NAV: NavItem[] = [
  { href: "/account", label: "Tổng quan", match: "exact", icon: "grid" },
  { href: "/account/orders", label: "Đơn hàng của tôi", match: "prefix", icon: "bag" },
  { href: "/account/assets", label: "License của tôi", match: "prefix", icon: "box" },
  {
    href: "/account/profile",
    label: "Thông tin tài khoản",
    match: "exact",
    icon: "user",
  },
  {
    href: "/account/security",
    label: "Bảo mật tài khoản",
    match: "exact",
    icon: "lock",
  },
  {
    href: "/account/notifications",
    label: "Thông báo",
    match: "prefix",
    icon: "bell",
  },
  {
    href: "/account/tickets",
    label: "Yêu cầu hỗ trợ",
    match: "prefix",
    icon: "headset",
  },
];

/** Shared base — border-l always reserved so active state doesn't shift width */
const NAV_BASE = `inline-flex w-full items-center gap-2.5 border-l-2 px-2.5 py-2.5 transition ${MOTION_FAST}`;

export function AccountNav({
  pathname,
  unreadNotifications = 0,
}: {
  pathname: string;
  unreadNotifications?: number;
}) {
  return (
    <aside className="w-full shrink-0 md:sticky md:top-24 md:w-[12rem] md:self-start lg:w-[12.5rem]">
      <p className={`mb-3 ${SIDEBAR_SECTION_CLASS}`}>Tài khoản</p>
      <nav className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0.5 md:overflow-visible md:pb-0">
        {NAV.map((item) => {
          const active =
            item.match === "exact"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              className={
                active
                  ? `${NAV_BASE} ${NAV_ITEM_ACTIVE_CLASS} rounded-r-lg border-accent bg-accent-soft`
                  : `${NAV_BASE} ${NAV_ITEM_CLASS} rounded-r-lg border-transparent !text-muted hover:bg-navy-soft hover:!text-navy`
              }
            >
              <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <NavIcon name={item.icon} />
              </span>
              <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
              {item.href === "/account/notifications" ? (
                <span
                  className={`ml-1 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1 ${BADGE_CLASS} ${
                    unreadNotifications > 0
                      ? "bg-accent text-white"
                      : "invisible"
                  }`}
                  aria-hidden={unreadNotifications <= 0}
                >
                  {unreadNotifications > 9 ? "9+" : unreadNotifications || "0"}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function NavIcon({ name }: { name: NavItem["icon"] }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (name) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8V7a3 3 0 0 1 6 0v1" />
        </svg>
      );
    case "box":
      return (
        <svg {...common}>
          <path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" />
          <path d="M12 12v9M20 7.5 12 12 4 7.5" />
        </svg>
      );
    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M6 16h12l-1.2-2.2V10a4.8 4.8 0 1 0-9.6 0v3.8L6 16Z" />
          <path d="M10 18a2 2 0 0 0 4 0" />
        </svg>
      );
    case "headset":
      return (
        <svg {...common}>
          <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
          <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
          <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
        </svg>
      );
  }
}
