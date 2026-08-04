"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/storefront/content/types";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  EASE_STANDARD,
  ELEVATION_CTA_HOVER,
  TRANSITION_UI,
  Z_HEADER,
} from "@/storefront/effects";
import {
  IA_PRIMARY_NAV,
  type DropdownNavItem,
  type MegaNavItem,
  type PrimaryNavItem,
} from "@/storefront/nav/ia";

export type HeaderBrand = {
  logoUrl?: string;
  brandName: string;
  tagline: string;
};

type Props = {
  /** @deprecated Phase 1: IA tree is source of truth; kept for layout compat */
  navItems?: NavItem[];
  brand: HeaderBrand;
  sessionEmail?: string | null;
  isStaff?: boolean;
  showSearch?: boolean;
};

const linkEase = `${TRANSITION_UI} ${EASE_STANDARD}`;

function pathActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.includes("?")) {
    const base = href.split("?")[0]!;
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Storefront header — IA v1 mega / dropdown (NAV-01..05) */
export function SiteHeader({ brand, sessionEmail, isStaff }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const pathname = usePathname();
  const name = brand.brandName?.trim() || "KEYON";
  const tagline = brand.tagline?.trim() ?? "";
  const logoUrl = resolveMediaUrl(brand.logoUrl) || undefined;
  const mark = name.charAt(0).toUpperCase() || "K";
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setOpenId(null);
  }, [pathname]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpenId(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={`sticky top-0 ${Z_HEADER} border-b border-border bg-white/95 backdrop-blur`}>
      <div className="home-container">
        <div className="flex h-[64px] items-center gap-3 sm:h-[72px] lg:h-[82px]">
          <Link
            href="/"
            className={`group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5 ${linkEase} hover:opacity-90`}
            aria-label={`${name} trang chủ`}
          >
            {logoUrl ? (
              <span className="relative block h-8 w-[min(180px,42vw)] sm:h-9 sm:w-[200px] lg:h-10 lg:w-[220px]">
                <Image
                  src={logoUrl}
                  alt={name}
                  fill
                  className="object-contain object-left"
                  sizes="(max-width: 640px) 42vw, 220px"
                  priority
                  unoptimized
                />
              </span>
            ) : (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-base font-extrabold text-white sm:h-10 sm:w-10 sm:text-lg ${TRANSITION_UI}`}
                >
                  {mark}
                </span>
                <span className="min-w-0 leading-tight">
                  <span className="block text-sm font-extrabold tracking-tight text-navy sm:text-base">
                    {name}
                  </span>
                  {tagline ? (
                    <span className="block truncate text-[10px] font-medium text-muted-soft sm:text-[11px]">
                      {tagline}
                    </span>
                  ) : null}
                </span>
              </>
            )}
          </Link>

          <nav
            ref={navRef}
            className="ml-auto hidden items-center gap-1 text-[14px] font-medium text-muted lg:flex"
            aria-label="Điều hướng chính"
          >
            {IA_PRIMARY_NAV.map((item) => (
              <DesktopNavItem
                key={item.id}
                item={item}
                pathname={pathname}
                open={openId === item.id}
                onOpen={() => setOpenId(item.id)}
                onClose={() => setOpenId(null)}
                onToggle={() => setOpenId((v) => (v === item.id ? null : item.id))}
              />
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
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
                {isStaff ? (
                  <Link href="/admin" className={`text-muted ${linkEase} hover:text-accent`}>
                    Admin
                  </Link>
                ) : null}
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
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span aria-hidden className="text-lg leading-none">
                {mobileOpen ? "×" : "☰"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-nav" className="max-h-[min(80vh,640px)] overflow-y-auto border-t border-border bg-white px-4 py-3 lg:hidden">
          <MobileNav
            onNavigate={() => setMobileOpen(false)}
            sessionEmail={sessionEmail}
          />
        </div>
      ) : null}
    </header>
  );
}

function DesktopNavItem({
  item,
  pathname,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  item: PrimaryNavItem;
  pathname: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const panelId = useId();
  const active = pathActive(pathname, item.href);
  const triggerClass = active
    ? "text-navy underline decoration-accent decoration-2 underline-offset-[6px]"
    : `${linkEase} hover:text-accent`;

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-2 ${triggerClass}`}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {open ? (
        item.kind === "mega" ? (
          <MegaPanel id={panelId} item={item} onNavigate={onClose} />
        ) : (
          <DropdownPanel id={panelId} item={item} onNavigate={onClose} />
        )
      ) : null}
    </div>
  );
}

function MegaPanel({
  id,
  item,
  onNavigate,
}: {
  id: string;
  item: MegaNavItem;
  onNavigate: () => void;
}) {
  const colCount = item.columns.length + (item.promo ? 1 : 0);
  return (
    <div
      id={id}
      role="region"
      aria-label={item.label}
      className="absolute left-1/2 top-full z-50 w-[min(92vw,720px)] -translate-x-1/2 pt-2"
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-slate-900/8">
        <div
          className={`grid gap-0 ${colCount >= 3 ? "grid-cols-3" : colCount === 2 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {item.columns.map((col) => (
            <div key={col.title} className="border-r border-border p-5 last:border-r-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-soft">
                {col.title}
              </p>
              <ul className="mt-3 space-y-1">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-2 py-2 ${linkEase} hover:bg-surface`}
                      onClick={onNavigate}
                    >
                      <span className="block text-sm font-semibold text-navy">{link.label}</span>
                      {link.description ? (
                        <span className="mt-0.5 block text-xs leading-snug text-muted">
                          {link.description}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {item.promo ? (
            <div className="bg-surface/80 p-5">
              <p className="font-display text-base font-semibold text-navy">{item.promo.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.promo.description}</p>
              <Link
                href={item.promo.href}
                className={`mt-4 inline-flex text-sm font-semibold text-accent ${linkEase} hover:underline`}
                onClick={onNavigate}
              >
                {item.promo.ctaLabel}
              </Link>
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-surface/50 px-5 py-3">
          <Link
            href={item.href}
            className={`text-sm font-semibold text-navy ${linkEase} hover:text-accent`}
            onClick={onNavigate}
          >
            Xem tất cả {item.label.toLowerCase()} →
          </Link>
        </div>
      </div>
    </div>
  );
}

function DropdownPanel({
  id,
  item,
  onNavigate,
}: {
  id: string;
  item: DropdownNavItem;
  onNavigate: () => void;
}) {
  return (
    <div id={id} role="region" aria-label={item.label} className="absolute left-0 top-full z-50 min-w-[220px] pt-2">
      <div className="overflow-hidden rounded-xl border border-border bg-white py-2 shadow-lg shadow-slate-900/8">
        {item.links.map((link) => (
          <Link
            key={link.href + link.label}
            href={link.href}
            className={`block px-4 py-2.5 text-sm font-medium text-navy ${linkEase} hover:bg-surface hover:text-accent`}
            onClick={onNavigate}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileNav({
  onNavigate,
  sessionEmail,
}: {
  onNavigate: () => void;
  sessionEmail?: string | null;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <nav className="flex flex-col gap-1 text-[15px] font-medium" aria-label="Menu mobile">
      {IA_PRIMARY_NAV.map((item) => {
        const open = expanded === item.id;
        const links =
          item.kind === "mega"
            ? item.columns.flatMap((c) => c.links)
            : item.links;
        return (
          <div key={item.id} className="border-b border-border/70 last:border-0">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-2 py-2.5 text-left text-navy"
              aria-expanded={open}
              onClick={() => setExpanded((v) => (v === item.id ? null : item.id))}
            >
              {item.label}
              <Chevron open={open} />
            </button>
            {open ? (
              <ul className="mb-2 space-y-0.5 pb-2 pl-2">
                <li>
                  <Link
                    href={item.href}
                    className={`block rounded-lg px-2 py-2 text-sm font-semibold text-accent ${linkEase}`}
                    onClick={onNavigate}
                  >
                    Tổng quan {item.label}
                  </Link>
                </li>
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-2 py-2 text-sm text-navy ${linkEase} hover:bg-surface`}
                      onClick={onNavigate}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                {item.kind === "mega" && item.promo ? (
                  <li>
                    <Link
                      href={item.promo.href}
                      className={`block rounded-lg px-2 py-2 text-sm font-medium text-accent ${linkEase}`}
                      onClick={onNavigate}
                    >
                      {item.promo.title}
                    </Link>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        );
      })}
      {!sessionEmail ? (
        <>
          <Link
            href="/login"
            className={`rounded-lg px-2 py-2 text-navy ${linkEase} hover:bg-surface`}
            onClick={onNavigate}
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className={`rounded-lg px-2 py-2 font-semibold text-accent ${linkEase} hover:bg-accent-soft`}
            onClick={onNavigate}
          >
            Đăng ký
          </Link>
        </>
      ) : (
        <Link
          href="/account"
          className={`rounded-lg px-2 py-2 text-navy ${linkEase} hover:bg-surface`}
          onClick={onNavigate}
        >
          Tài khoản
        </Link>
      )}
    </nav>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`${TRANSITION_UI} ${open ? "rotate-180" : ""}`}
    >
      <path d="M2.5 4.5 6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
