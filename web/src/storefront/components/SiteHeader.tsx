"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavItem } from "@/storefront/content/types";
import {
  EASE_STANDARD,
  ELEVATION_CTA_HOVER,
  TRANSITION_UI,
  Z_HEADER,
} from "@/storefront/effects";

type Props = {
  navItems: NavItem[];
  sessionEmail?: string | null;
  isStaff?: boolean;
  showSearch?: boolean;
};

const linkEase = `${TRANSITION_UI} ${EASE_STANDARD}`;

/** Digital Home header — H82 · logo mark + stack · nav · utils · CTAs */
export function SiteHeader({
  navItems,
  sessionEmail,
  isStaff,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className={`sticky top-0 ${Z_HEADER} border-b border-border bg-white/95 backdrop-blur`}>
      <div className="home-container">
        <div className="flex h-[64px] items-center gap-3 sm:h-[72px] lg:h-[82px]">
          <Link
            href="/"
            className={`group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5 ${linkEase} hover:opacity-90`}
            aria-label="KEYON trang chủ"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-600 text-base font-extrabold text-white shadow-sm ${TRANSITION_UI} group-hover:shadow-md sm:h-10 sm:w-10 sm:text-lg`}>
              K
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-sm font-extrabold tracking-tight text-navy sm:text-base">KEYON</span>
              <span className="block truncate text-[10px] font-medium text-muted-soft sm:text-[11px]">
                Digital License Platform
              </span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 text-[14px] font-medium text-muted lg:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/products"
                  ? pathname.startsWith("/products")
                  : item.href.startsWith("/#")
                    ? false
                    : pathname === item.href ||
                      (item.href === "/about" && pathname === "/about");
              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={
                    active
                      ? "text-navy underline decoration-accent decoration-2 underline-offset-[6px]"
                      : `${linkEase} hover:text-accent hover:underline hover:decoration-accent/50 hover:underline-offset-[6px]`
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-6">
            <Link
              href="/products"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-muted ${linkEase} hover:bg-surface hover:text-accent`}
              aria-label="Tìm kiếm sản phẩm"
            >
              <SearchIcon />
            </Link>

            {sessionEmail ? (
              <div className="hidden items-center gap-3 text-sm sm:flex">
                <Link href="/account" className={`text-muted ${linkEase} hover:text-accent`}>
                  Tài khoản
                </Link>
                {isStaff && (
                  <Link href="/admin" className={`text-muted ${linkEase} hover:text-accent`}>
                    Admin
                  </Link>
                )}
                <form action="/api/auth/logout" method="post">
                  <button type="submit" className={`text-muted ${linkEase} hover:text-accent`}>
                    Đăng xuất
                  </button>
                </form>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className={`inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-muted ${linkEase} hover:bg-surface hover:text-accent`}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex h-10 items-center justify-center rounded-xl bg-accent px-4 text-sm font-semibold text-white shadow-sm ${linkEase} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Đăng ký
                </Link>
              </div>
            )}

            <button
              type="button"
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border ${linkEase} hover:border-accent hover:text-accent lg:hidden`}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="text-lg leading-none">
                {open ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1 text-[15px] font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={`rounded-lg px-2 py-2 text-navy ${linkEase} hover:bg-surface hover:text-accent`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!sessionEmail ? (
              <>
                <Link
                  href="/login"
                  className={`rounded-lg px-2 py-2 text-navy ${linkEase} hover:bg-surface hover:text-accent`}
                  onClick={() => setOpen(false)}
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={`rounded-lg px-2 py-2 font-semibold text-accent ${linkEase} hover:bg-accent-soft`}
                  onClick={() => setOpen(false)}
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <Link
                href="/account"
                className={`rounded-lg px-2 py-2 text-navy ${linkEase} hover:bg-surface hover:text-accent`}
                onClick={() => setOpen(false)}
              >
                Tài khoản
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3-3" />
    </svg>
  );
}
