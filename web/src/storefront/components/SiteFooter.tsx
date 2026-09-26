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

type SocialNetwork =
  | "facebook"
  | "youtube"
  | "linkedin"
  | "zalo"
  | "tiktok"
  | "instagram"
  | "x";

type SocialLink = {
  network: SocialNetwork;
  href: string;
  label?: string;
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
  socialLinks?: SocialLink[];
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
const socialBtn = `inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-white ${TRANSITION_UI} hover:border-accent hover:bg-accent/15 hover:text-accent`;

const SOCIAL_LABEL: Record<SocialNetwork, string> = {
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  zalo: "Zalo",
  tiktok: "TikTok",
  instagram: "Instagram",
  x: "X",
};

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

function SocialNetworkIcon({ network }: { network: SocialNetwork }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };
  switch (network) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 7.2a3 3 0 0 0-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 0 0 .5 7.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-4.8zM9.8 15.5v-7l6.3 3.5-6.3 3.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M6.9 8.9H3.7V20h3.2V8.9zM5.3 4C4.2 4 3.3 4.9 3.3 6S4.2 8 5.3 8 7.3 7.1 7.3 6 6.4 4 5.3 4zM20.3 20h-3.2v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20H10V8.9h3.1v1.5h.1c.4-.8 1.5-1.8 3.1-1.8 3.3 0 3.9 2.2 3.9 5V20z" />
        </svg>
      );
    case "zalo":
      return (
        <svg {...common}>
          <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.5 5.5 3.8 7.2V22l3.5-1.9c.9.2 1.8.4 2.7.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2zm4.4 11.8-1.4 1.4c-1.7 1.2-3.9-.3-5.3-1.7s-2.9-3.6-1.7-5.3l1.4-1.4c.3-.3.7-.3 1 0l1.5 1.5c.3.3.3.7 0 1l-.7.7c-.2.2-.2.4 0 .7.8 1.2 1.8 2.2 3 3 .2.2.5.2.7 0l.7-.7c.3-.3.7-.3 1 0l1.5 1.5c.2.3.2.7-.2 1z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M19.6 8.2a6.3 6.3 0 0 1-3.6-1.1v6.5a5.6 5.6 0 1 1-4.8-5.5v2.9a2.8 2.8 0 1 0 2 2.7V2.5h2.8a6.3 6.3 0 0 0 3.6 3.4v2.3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zm6.1-8.2a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 2.5c-2.5 0-2.8 0-3.8.1-2.5.1-3.7 1.3-3.8 3.8-.1 1-.1 1.3-.1 3.8s0 2.8.1 3.8c.1 2.5 1.3 3.7 3.8 3.8 1 .1 1.3.1 3.8.1s2.8 0 3.8-.1c2.5-.1 3.7-1.3 3.8-3.8.1-1 .1-1.3.1-3.8s0-2.8-.1-3.8c-.1-2.5-1.3-3.7-3.8-3.8-1-.1-1.3-.1-3.8-.1zm0 1.8c2.4 0 2.7 0 3.7.1 1.8.1 2.6.9 2.7 2.7.1 1 .1 1.2.1 3.7s0 2.7-.1 3.7c-.1 1.8-.9 2.6-2.7 2.7-1 .1-1.2.1-3.7.1s-2.7 0-3.7-.1c-1.8-.1-2.6-.9-2.7-2.7-.1-1-.1-1.2-.1-3.7s0-2.7.1-3.7c.1-1.8.9-2.6 2.7-2.7 1-.1 1.3-.1 3.7-.1z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.2 2.5h3.2l-7 8 8.2 11H16l-4.7-6.2L6 21.5H2.8l7.5-8.6L2.2 2.5H8.6l4.3 5.7 5.3-5.7zm-1.1 17h1.8L7 4.4H5.1l12 15.1z" />
        </svg>
      );
  }
}

function oneLine(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

const labelClass = "font-medium text-slate-300";

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
        <span className={labelClass}>MST</span>{" "}
        <span className="font-mono text-slate-400">{tax}</span>
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
        <span className={labelClass}>Điện thoại</span> {phone}
      </a>,
    );
  }

  return (
    <div className="mt-4 max-w-md space-y-2.5 text-sm leading-relaxed text-slate-400">
      {name ? <p className="font-medium text-slate-300">{name}</p> : null}
      {address ? (
        <p>
          <span className={labelClass}>Địa chỉ:</span> {address}
        </p>
      ) : null}
      {metaBits.length ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {metaBits.map((bit, i) => (
            <span key={i} className="inline-flex items-center gap-x-2">
              {i > 0 ? (
                <span className="text-slate-500" aria-hidden>
                  ·
                </span>
              ) : null}
              {bit}
            </span>
          ))}
        </p>
      ) : null}
      {email ? (
        <p>
          <span className={labelClass}>Email:</span>{" "}
          <a href={`mailto:${email}`} className={footerLink}>
            {email}
          </a>
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
      width={160}
      height={52}
      className="h-11 w-auto max-w-[168px] object-contain object-left sm:h-12 sm:max-w-[180px]"
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
  socialLinks = [],
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
  const visibleColumns = columns.filter((c) => c.links.length > 0);
  const showBadges = Boolean(bctVisible || dmcaVisible);
  const visibleSocial = socialLinks.filter((s) => s.href?.trim());

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

      {/* Order: copyright → utility links → social → compliance (right) */}
      <div className="border-t border-white/10">
        <div className="home-container flex flex-col gap-3 py-3.5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
          <span className="shrink-0 text-xs leading-none text-slate-500">
            {copyright}
          </span>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:justify-center">
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
            {visibleSocial.length ? (
              <div
                className="flex items-center gap-2"
                aria-label="Mạng xã hội"
              >
                {visibleSocial.map((s) => {
                  const label = s.label?.trim() || SOCIAL_LABEL[s.network];
                  return (
                    <a
                      key={`${s.network}-${s.href}`}
                      href={s.href.trim()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={socialBtn}
                      aria-label={label}
                    >
                      <SocialNetworkIcon network={s.network} />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {showBadges ? (
            <div
              className="flex flex-wrap items-center gap-3 lg:justify-end"
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
          ) : (
            <span className="hidden lg:block" aria-hidden />
          )}
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
