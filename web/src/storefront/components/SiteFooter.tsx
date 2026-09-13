"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FooterColumn } from "@/storefront/content/types";
import { resolveMediaUrl } from "@/lib/media-url";
import {
  EASE_STANDARD,
  MOTION_NORMAL,
  TRANSITION_COLORS,
  TRANSITION_UI,
} from "@/storefront/effects";

type CompanyInfo = {
  companyName: string;
  address: string;
  taxCode: string;
  phone: string;
  email: string;
};

type Props = {
  logoUrl?: string;
  brandName?: string;
  blurb: string;
  companyInfo?: CompanyInfo;
  columns: FooterColumn[];
  copyright: string;
  supportEmail?: string;
  bctVisible?: boolean;
  bctHref?: string;
  bctImageUrl?: string;
  bctAlt?: string;
};

const footerLink = `inline-block text-slate-400 ${TRANSITION_COLORS} ${MOTION_NORMAL} ${EASE_STANDARD} hover:text-white hover:underline hover:underline-offset-4`;
const barLink = `text-slate-500 ${TRANSITION_COLORS} ${MOTION_NORMAL} hover:text-white hover:underline hover:underline-offset-4`;

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

function SocialIcon({ name }: { name: "mail" | "help" }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 0 1 5 1c0 1.5-2.5 2-2.5 3.5" />
      <path d="M12 17.5h.01" />
    </svg>
  );
}

function CompanyInfoBlock({ info }: { info: CompanyInfo }) {
  const name = info.companyName.trim();
  const address = info.address.trim();
  const tax = info.taxCode.trim();
  const phone = info.phone.trim();
  const email = info.email.trim();
  if (!name && !address && !tax && !phone && !email) return null;

  return (
    <dl className="mt-5 max-w-xs space-y-2 text-[12px] leading-relaxed text-slate-400">
      {name ? (
        <div>
          <dt className="sr-only">Tên công ty</dt>
          <dd className="font-medium text-slate-300">{name}</dd>
        </div>
      ) : null}
      {address ? (
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Địa chỉ
          </dt>
          <dd className="mt-0.5">{address}</dd>
        </div>
      ) : null}
      {tax ? (
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            MST
          </dt>
          <dd className="mt-0.5 font-mono text-[12px] text-slate-300">{tax}</dd>
        </div>
      ) : null}
      {phone ? (
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Điện thoại
          </dt>
          <dd className="mt-0.5">
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className={footerLink}>
              {phone}
            </a>
          </dd>
        </div>
      ) : null}
      {email ? (
        <div>
          <dt className="text-[11px] uppercase tracking-wide text-slate-500">
            Email
          </dt>
          <dd className="mt-0.5">
            <a href={`mailto:${email}`} className={footerLink}>
              {email}
            </a>
          </dd>
        </div>
      ) : null}
    </dl>
  );
}

/** Digital Home footer — navy · accordion on mobile · multi-col on desktop */
export function SiteFooter({
  logoUrl: logoUrlProp,
  brandName: brandNameProp,
  blurb,
  companyInfo,
  columns,
  copyright,
  supportEmail = "support@keyon.vn",
  bctVisible = false,
  bctHref = "https://online.gov.vn/",
  bctImageUrl = "/brand/bct-thong-bao.svg",
  bctAlt = "Đã thông báo Bộ Công Thương",
}: Props) {
  const name = brandNameProp?.trim() || "KEYON";
  const logoUrl = resolveMediaUrl(logoUrlProp) || undefined;
  const mark = name.charAt(0).toUpperCase() || "K";
  const mail = companyInfo?.email?.trim() || supportEmail;
  const social = [
    { label: "Email", href: `mailto:${mail}`, icon: "mail" as const },
    { label: "Hỗ trợ", href: "/support", icon: "help" as const },
  ];
  const visibleColumns = columns.filter((c) => c.links.length > 0);
  const bctSrc = resolveMediaUrl(bctImageUrl) || "/brand/bct-thong-bao.svg";
  const bctLink = bctHref?.trim() || "https://online.gov.vn/";

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
            {companyInfo ? <CompanyInfoBlock info={companyInfo} /> : null}
            {bctVisible ? (
              <a
                href={bctLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-5 inline-block ${TRANSITION_UI} hover:opacity-90`}
                aria-label={bctAlt}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bctSrc}
                  alt={bctAlt}
                  width={148}
                  height={56}
                  className="h-auto w-[148px] object-contain object-left"
                />
              </a>
            ) : null}
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
        <div className="home-container flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <span className="text-xs leading-none text-slate-500">{copyright}</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <nav
              aria-label="Liên hệ nhanh"
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5"
            >
              <a href={`mailto:${mail}`} className={barLink}>
                {mail}
              </a>
              <span className="text-slate-700" aria-hidden>
                ·
              </span>
              <Link href="/support" className={barLink}>
                Hỗ trợ
              </Link>
              <span className="text-slate-700" aria-hidden>
                ·
              </span>
              <Link href="/contact" className={barLink}>
                Liên hệ
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white ${TRANSITION_UI} hover:border-accent hover:bg-accent/15 hover:text-accent`}
                  aria-label={s.label}
                >
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
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
