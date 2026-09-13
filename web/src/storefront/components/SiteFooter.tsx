"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
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

type ComplianceBadge = {
  visible?: boolean;
  href?: string;
  imageUrl?: string;
  alt?: string;
  fallbackSrc: string;
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
  dmcaVisible?: boolean;
  dmcaHref?: string;
  dmcaImageUrl?: string;
  dmcaAlt?: string;
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

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function CompanyInfoBlock({ info }: { info: CompanyInfo }) {
  const name = info.companyName.trim();
  const address = oneLine(info.address);
  const tax = info.taxCode.trim();
  const phone = info.phone.trim();
  const email = info.email.trim();
  if (!name && !address && !tax && !phone && !email) return null;

  const metaBits: ReactNode[] = [];
  if (tax) {
    metaBits.push(
      <span key="tax">
        <span className="text-slate-500">MST</span>{" "}
        <span className="font-mono text-slate-300">{tax}</span>
      </span>,
    );
  }
  if (phone) {
    metaBits.push(
      <a
        key="phone"
        href={`tel:${phone.replace(/\s+/g, "")}`}
        className={footerLink}
      >
        <span className="text-slate-500">ĐT</span> {phone}
      </a>,
    );
  }
  if (email) {
    metaBits.push(
      <a key="email" href={`mailto:${email}`} className={footerLink}>
        {email}
      </a>,
    );
  }

  return (
    <div className="mt-4 max-w-md space-y-1.5 text-[12px] leading-snug text-slate-400">
      {name ? <p className="font-medium text-slate-300">{name}</p> : null}
      {address ? (
        <p>
          <span className="text-slate-500">Địa chỉ:</span> {address}
        </p>
      ) : null}
      {metaBits.length ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {metaBits.map((bit, i) => (
            <span key={i} className="inline-flex items-center gap-x-2">
              {i > 0 ? (
                <span className="text-slate-600" aria-hidden>
                  ·
                </span>
              ) : null}
              {bit}
            </span>
          ))}
        </p>
      ) : null}
    </div>
  );
}

function ComplianceBadgeLink({
  visible,
  href,
  imageUrl,
  alt,
  fallbackSrc,
}: ComplianceBadge) {
  if (!visible) return null;
  const src = resolveMediaUrl(imageUrl) || fallbackSrc;
  const link = href?.trim() || undefined;
  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      width={120}
      height={40}
      className="h-9 w-auto max-w-[140px] object-contain object-left"
    />
  );
  if (!link) {
    return <span className="inline-flex shrink-0 opacity-95">{img}</span>;
  }
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex shrink-0 ${TRANSITION_UI} hover:opacity-90`}
      aria-label={alt}
    >
      {img}
    </a>
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
  dmcaVisible = false,
  dmcaHref = "",
  dmcaImageUrl = "/brand/dmca-protected.svg",
  dmcaAlt = "DMCA protected",
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
  const showBadges = Boolean(bctVisible || dmcaVisible);

  return (
    <footer className="mt-auto bg-footer text-slate-400">
      <div className="home-container">
        <div className="py-10 lg:grid lg:grid-cols-[minmax(0,1.35fr)_minmax(0,3fr)] lg:gap-10 lg:py-12">
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
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
              {blurb}
            </p>
            {companyInfo ? <CompanyInfoBlock info={companyInfo} /> : null}
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
        <div className="home-container flex flex-col gap-3 py-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <span className="text-xs leading-none text-slate-500">{copyright}</span>

          {showBadges ? (
            <div
              className="flex flex-wrap items-center gap-3"
              aria-label="Chứng nhận"
            >
              <ComplianceBadgeLink
                visible={bctVisible}
                href={bctHref}
                imageUrl={bctImageUrl}
                alt={bctAlt}
                fallbackSrc="/brand/bct-thong-bao.svg"
              />
              <ComplianceBadgeLink
                visible={dmcaVisible}
                href={dmcaHref}
                imageUrl={dmcaImageUrl}
                alt={dmcaAlt}
                fallbackSrc="/brand/dmca-protected.svg"
              />
            </div>
          ) : null}

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
