"use client";

import Link from "next/link";
import type { CmsPolicy, CmsPolicyItem } from "@/server/cms/types";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  CARD_MARKETING,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";
import { IconHeadset } from "@/storefront/components/icons/StoreIcons";
import { POLICY_ICONS } from "./policy-icons";

export function PolicyView({ cms }: { cms: CmsPolicy }) {
  return (
    <div className="bg-white">
      {/* Hero — text only, sát header */}
      <section className="relative border-b border-border bg-[#F4F8FB]">
        <div className="home-container py-3 md:py-3.5">
          <div className="max-w-2xl">
            <nav
              className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
            >
              <Link href="/" className={`${TRANSITION_UI} hover:text-accent`}>
                Trang chủ
              </Link>
              <span aria-hidden>›</span>
              <span className={BREADCRUMB_CURRENT_CLASS}>Chính sách</span>
            </nav>
            <h1 className={`mt-2 ${SUBSECTION_TITLE_CLASS} md:text-[1.375rem]`}>
              {cms.heroTitle}{" "}
              <span className="text-accent">{cms.heroTitleAccent}</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-muted">
              {cms.heroLead}
            </p>
          </div>
        </div>
      </section>

      <div className="home-container space-y-6 py-8 md:space-y-8 md:py-10">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cms.items.map((item) => (
            <PolicyCard key={item.id} item={item} cta={cms.cardCta} />
          ))}
        </section>

        <SupportBar cms={cms} />
      </div>
    </div>
  );
}

function PolicyCard({ item, cta }: { item: CmsPolicyItem; cta: string }) {
  const Icon = POLICY_ICONS[item.iconKey] ?? POLICY_ICONS.terms;
  return (
    <Link
      href={`/policy/${item.slug}`}
      className={`group flex h-full flex-col items-center px-5 py-6 text-center ${CARD_MARKETING}`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent">
        {Icon({ size: 22 })}
      </span>
      <h2 className={`mt-4 ${CARD_TITLE_CLASS}`}>{item.title}</h2>
      <p className={`mt-2 line-clamp-3 flex-1 ${BODY_MUTED_CLASS}`}>
        {item.description}
      </p>
      <span
        className={`mt-4 inline-flex items-center gap-1 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} group-hover:gap-1.5`}
      >
        {cta}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

function SupportBar({ cms }: { cms: CmsPolicy }) {
  return (
    <aside
      className={`flex flex-col gap-5 rounded-2xl border border-sky-100 bg-[#EAF6FB] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 ${ELEVATION_HAIRLINE}`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <IconHeadset size={22} />
        </span>
        <div className="min-w-0">
          <p className={CARD_TITLE_CLASS}>{cms.supportTitle}</p>
          <p className={`mt-0.5 ${SECTION_LEAD_CLASS}`}>{cms.supportBody}</p>
        </div>
      </div>

      <Link
        href={cms.supportCtaHref}
        className={`inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
      >
        {cms.supportCta}
        <span aria-hidden>→</span>
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6 lg:shrink-0">
        <a
          href={`tel:${cms.supportPhone.replace(/\s/g, "")}`}
          className={`flex items-start gap-2.5 ${TRANSITION_UI} hover:opacity-90`}
        >
          <span className="mt-0.5 text-accent">
            <PhoneGlyph />
          </span>
          <span>
            <span className={`block ${CARD_TITLE_CLASS}`}>
              {cms.supportPhone}
            </span>
            <span className={`block text-xs text-muted`}>
              {cms.supportPhoneHint}
            </span>
          </span>
        </a>
        <a
          href={`mailto:${cms.supportEmail}`}
          className={`flex items-start gap-2.5 ${TRANSITION_UI} hover:opacity-90`}
        >
          <span className="mt-0.5 text-accent">
            <MailGlyph />
          </span>
          <span>
            <span className={`block break-all ${CARD_TITLE_CLASS}`}>
              {cms.supportEmail}
            </span>
            <span className={`block text-xs text-muted`}>
              {cms.supportEmailHint}
            </span>
          </span>
        </a>
      </div>
    </aside>
  );
}

function PhoneGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7.5 3.5h3L12 8l-2 1.5a12 12 0 0 0 4.5 4.5L16 12l4.5 1.5v3a2 2 0 0 1-2.2 2A16 16 0 0 1 3.5 5.7a2 2 0 0 1 2-2.2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}
