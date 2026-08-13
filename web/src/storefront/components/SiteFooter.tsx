"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FooterColumn, NavItem } from "@/storefront/content/types";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  EASE_STANDARD,
  MOTION_NORMAL,
  TRANSITION_COLORS,
  TRANSITION_UI,
} from "@/storefront/effects";

type Props = {
  logoUrl?: string;
  brandName?: string;
  blurb: string;
  columns: FooterColumn[];
  copyright: string;
  legalLinks: NavItem[];
  supportEmail?: string;
  paymentBadges?: string[];
};

const footerLink = `inline-block text-slate-400 ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} hover:text-white hover:underline hover:underline-offset-4`;

function isExternalHref(href: string) {
  return /^(mailto:|tel:|https?:\/\/)/i.test(href);
}

function FooterHref({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

/** Digital Home footer — navy · accordion on mobile · multi-col on desktop */
export function SiteFooter({
  logoUrl: logoUrlProp,
  brandName: brandNameProp,
  blurb,
  columns,
  copyright,
  legalLinks,
  supportEmail = "support@keyon.vn",
  paymentBadges = ["VietQR", "Chuyển khoản"],
}: Props) {
  const name = brandNameProp?.trim() || "KEYON";
  const logoUrl = resolveMediaUrl(logoUrlProp) || undefined;
  const mark = name.charAt(0).toUpperCase() || "K";
  const social = [
    { label: "Email", href: `mailto:${supportEmail}`, letter: "✉" },
    { label: "Liên hệ", href: "/contact", letter: "?" },
  ];
  const visibleColumns = columns.filter((c) => c.links.length > 0);

  return (
    <footer className="mt-auto bg-footer text-slate-400">
      <div className="home-container">
        <div className="py-10 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,3.2fr)] lg:gap-10 lg:py-12">
          <div className="mb-8 lg:mb-0">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-2.5 transition hover:opacity-90"
              aria-label={`${name} trang chủ`}
            >
              {logoUrl ? (
                <span className="relative block h-8 w-[min(180px,48vw)] sm:h-9 sm:w-[200px]">
                  <Image
                    src={logoUrl}
                    alt={name}
                    fill
                    className="object-contain object-left"
                    sizes="(max-width: 640px) 48vw, 200px"
                    unoptimized
                  />
                </span>
              ) : (
                <>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan-600 text-sm font-extrabold text-white">
                    {mark}
                  </span>
                  <strong className="text-lg text-white">{name}</strong>
                </>
              )}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
              {blurb}
            </p>
            <div className="mt-5 flex gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-white ${TRANSITION_UI} hover:border-accent hover:bg-accent/15 hover:text-accent`}
                  aria-label={s.label}
                >
                  {s.letter}
                </a>
              ))}
            </div>
          </div>

          <div>
            <FooterAccordions columns={visibleColumns} />
            <div
              className={`hidden gap-8 lg:grid lg:gap-6 xl:gap-8 ${
                visibleColumns.length >= 4
                  ? "lg:grid-cols-4"
                  : visibleColumns.length === 3
                    ? "lg:grid-cols-3"
                    : "lg:grid-cols-2"
              }`}
            >
              {visibleColumns.map((col) => (
                <div key={col.title} className="min-w-0">
                  <p className="mb-3 text-sm font-semibold text-white">
                    {col.title}
                  </p>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map((link) => (
                      <li key={link.href + link.label} className="min-w-0">
                        <FooterHref
                          href={link.href}
                          className={`${footerLink} break-words`}
                        >
                          {link.label}
                        </FooterHref>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="home-container flex flex-col gap-4 py-4 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.4fr)] lg:items-start lg:gap-6">
          <span className="text-xs text-slate-500 lg:pt-1">
            {copyright}
          </span>
          <div className="flex flex-wrap items-center gap-2 lg:justify-self-center">
            {paymentBadges.map((p) => (
              <span
                key={p}
                className={`rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${TRANSITION_UI} hover:border-white/25 hover:text-white`}
              >
                {p}
              </span>
            ))}
          </div>
          <nav
            aria-label="Chính sách"
            className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs lg:justify-end"
          >
            {legalLinks.map((link) => (
              <FooterHref
                key={link.href + link.label}
                href={link.href}
                className={`text-slate-500 ${TRANSITION_COLORS} ${MOTION_NORMAL} hover:text-white hover:underline hover:underline-offset-4 ${
                  link.href === "/policy" ? "font-medium text-slate-300" : ""
                }`}
              >
                {link.label}
              </FooterHref>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterAccordions({ columns }: { columns: FooterColumn[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="border-t border-white/10 lg:hidden">
      {columns.map((col) => {
        const isOpen = open === col.title;
        return (
          <div key={col.title} className="border-b border-white/10">
            <button
              type="button"
              className="flex min-h-12 w-full items-center justify-between gap-3 py-3 text-left text-sm font-semibold text-white"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : col.title)}
            >
              {col.title}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`shrink-0 text-slate-400 ${MOTION_NORMAL} transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {isOpen ? (
              <ul className="space-y-2.5 pb-4 text-sm">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <FooterHref href={link.href} className={footerLink}>
                      {link.label}
                    </FooterHref>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
