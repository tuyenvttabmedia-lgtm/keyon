"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FooterColumn, NavItem } from "@/storefront/content/types";
import { resolveMediaUrl } from "@/lib/media-url";
import { EASE_STANDARD, MOTION_NORMAL, TRANSITION_COLORS, TRANSITION_UI } from "@/storefront/effects";

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
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{blurb}</p>
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
            <FooterAccordions columns={columns} />
            <div className="hidden gap-8 lg:grid lg:grid-cols-4 lg:gap-6 xl:gap-8">
              {columns.map((col) => (
                <div key={col.title} className="min-w-0">
                  <p className="mb-3 text-sm font-semibold text-white">{col.title}</p>
                  <ul className="space-y-2.5 text-sm">
                    {col.links.map((link) => (
                      <li key={link.href + link.label} className="min-w-0">
                        <Link
                          href={link.href}
                          className={`${footerLink} break-words`}
                        >
                          {link.label}
                        </Link>
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
        <div className="home-container grid gap-4 py-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <span className="text-xs text-slate-500 sm:justify-self-start">
            {copyright}
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:justify-self-center">
            {paymentBadges.map((p) => (
              <span
                key={p}
                className={`rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 ${TRANSITION_UI} hover:border-white/25 hover:text-white`}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:justify-self-end">
            {legalLinks.map((link, i) => (
              <span key={link.href + link.label} className="flex items-center gap-2">
                {i > 0 ? <span className="text-slate-600" aria-hidden>|</span> : null}
                <Link
                  href={link.href}
                  className={`text-slate-500 ${TRANSITION_COLORS} ${MOTION_NORMAL} hover:text-white hover:underline hover:underline-offset-4`}
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
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
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
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
