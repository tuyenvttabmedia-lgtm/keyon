"use client";

import Link from "next/link";
import { useState } from "react";
import type { CmsPolicy, CmsPolicyItem } from "@/server/cms/types";
import {
  BODY_CLASS,
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
  ELEVATION_HAIRLINE,
  HOVER_OUTLINE_FILL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { IconCheck, IconHeadset } from "@/storefront/components/icons/StoreIcons";
import { POLICY_ICONS } from "./policy-icons";

type InlineBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; text: string };

type Section = { title: string; blocks: InlineBlock[] };

type Parsed = { intro: string[]; sections: Section[] };

function parsePolicyBody(body: string): Parsed {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const intro: string[] = [];
  const sections: Section[] = [];
  let current: Section | null = null;
  let paraBuf: string[] = [];
  let listBuf: string[] = [];

  function flushPara() {
    const t = paraBuf.join(" ").trim();
    paraBuf = [];
    if (!t) return;
    if (current) current.blocks.push({ type: "p", text: t });
    else intro.push(t);
  }

  function flushList() {
    if (!listBuf.length) return;
    if (current) current.blocks.push({ type: "ul", items: [...listBuf] });
    listBuf = [];
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushPara();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      flushPara();
      current = { title: trimmed.replace(/^##\s+/, "").trim(), blocks: [] };
      sections.push(current);
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushList();
      flushPara();
      const text = trimmed.replace(/^>\s?/, "").trim();
      if (current) current.blocks.push({ type: "callout", text });
      else intro.push(text);
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushPara();
      listBuf.push(trimmed.replace(/^[-*]\s+/, "").trim());
      continue;
    }

    flushList();
    paraBuf.push(trimmed);
  }
  flushList();
  flushPara();

  return { intro, sections };
}

function formatUpdated(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PolicyDetailView({
  cms,
  item,
  basePath = "/policy",
}: {
  cms: CmsPolicy;
  item: CmsPolicyItem;
  /** Public path prefix for sidebar links */
  basePath?: string;
}) {
  const parsed = parsePolicyBody(item.body);
  const openCount = Math.max(0, cms.openSectionCount ?? 2);
  const [openAcc, setOpenAcc] = useState<Record<number, boolean>>({});

  function toggle(i: number) {
    setOpenAcc((prev) => ({ ...prev, [i]: !prev[i] }));
  }

  const updated = formatUpdated(item.updatedAt);

  return (
    <div className="bg-white">
      {/* Hero navy — gọn, không neon */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 90% 40%, rgba(14,165,164,0.22), transparent 55%)",
          }}
        />
        <div className="home-container relative py-5 md:py-6">
          <nav
            className={`flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS} !text-white/65`}
          >
            <Link href="/" className={`${TRANSITION_UI} hover:text-accent`}>
              Trang chủ
            </Link>
            <span aria-hidden>›</span>
            <Link
              href={basePath === "/policy" ? "/policy" : "/"}
              className={`${TRANSITION_UI} hover:text-accent`}
            >
              {basePath === "/policy" ? "Chính sách" : "Trang chủ"}
            </Link>
            <span aria-hidden>›</span>
            <span className={`${BREADCRUMB_CURRENT_CLASS} !text-white/90`}>
              {item.title}
            </span>
          </nav>
          <h1 className={`mt-3 ${SUBSECTION_TITLE_CLASS} !text-white md:text-2xl`}>
            {item.title}
          </h1>
          <p className={`mt-2 max-w-2xl ${SECTION_LEAD_CLASS} !text-white/75`}>
            {item.description}
          </p>
        </div>
      </section>

      <div className="bg-[#F4F8FB]">
        <div className="home-container py-6 md:py-8">
          <div
            className={`grid gap-5 rounded-2xl border border-border bg-white p-4 sm:p-5 lg:grid-cols-[minmax(14rem,0.85fr)_minmax(0,1.65fr)] lg:gap-6 lg:p-6 ${ELEVATION_HAIRLINE}`}
          >
            {/* Sidebar */}
            <aside className="space-y-4">
              <div>
                <p className={`${CARD_TITLE_CLASS} mb-3`}>{cms.sidebarTitle}</p>
                <ul className="space-y-1.5">
                  {cms.items.map((nav) => {
                    const active = nav.slug === item.slug;
                    const Icon = POLICY_ICONS[nav.iconKey] ?? POLICY_ICONS.terms;
                    return (
                      <li key={nav.id}>
                        <Link
                          href={`${basePath}/${nav.slug}`}
                          className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                            active
                              ? "bg-accent text-white"
                              : "bg-surface text-navy hover:bg-accent-soft hover:text-accent"
                          }`}
                        >
                          <span
                            className={
                              active ? "text-white" : "text-muted"
                            }
                          >
                            {Icon({ size: 16 })}
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {nav.title}
                          </span>
                          {active ? (
                            <IconCheck size={14} />
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl bg-[#EAF6FB] p-4">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white">
                  <IconHeadset size={20} />
                </span>
                <p className={`mt-3 ${CARD_TITLE_CLASS}`}>
                  {cms.detailSupportTitle}
                </p>
                <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                  {cms.detailSupportBody}
                </p>
                <Link
                  href={cms.supportCtaHref}
                  className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-accent bg-white px-3 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                >
                  {cms.supportCta}
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </aside>

            {/* Content */}
            <article className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
                {updated ? (
                  <p className={BODY_MUTED_CLASS}>
                    {cms.detailUpdatedLabel}:{" "}
                    <span className="font-medium text-navy">{updated}</span>
                  </p>
                ) : (
                  <span />
                )}
                {item.pdfUrl ? (
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:border-accent`}
                  >
                    <DownloadIcon />
                    {cms.detailPdfLabel}
                  </a>
                ) : null}
              </div>

              {parsed.intro.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {parsed.intro.map((p, i) => (
                    <p key={i} className={BODY_MUTED_CLASS}>
                      {p}
                    </p>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 space-y-5">
                {parsed.sections.map((sec, i) => {
                  const isAccordion = i >= openCount;
                  const expanded = !isAccordion || Boolean(openAcc[i]);

                  if (!isAccordion) {
                    return (
                      <section key={i}>
                        <h2 className={SUBSECTION_TITLE_CLASS}>{sec.title}</h2>
                        <div className="mt-3 space-y-3">
                          <SectionBlocks
                            blocks={sec.blocks}
                            checkStyle={i === 0}
                          />
                        </div>
                      </section>
                    );
                  }

                  return (
                    <div key={i} className="border-b border-border">
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        className={`flex w-full items-center justify-between gap-3 py-3.5 text-left ${TRANSITION_UI}`}
                        aria-expanded={expanded}
                      >
                        <span className={`${CARD_TITLE_CLASS} !text-[15px]`}>
                          {sec.title}
                        </span>
                        <Chevron open={expanded} />
                      </button>
                      {expanded ? (
                        <div className="space-y-3 pb-4">
                          <SectionBlocks blocks={sec.blocks} />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionBlocks({
  blocks,
  checkStyle,
}: {
  blocks: InlineBlock[];
  checkStyle?: boolean;
}) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === "p") {
          return (
            <p key={i} className={BODY_MUTED_CLASS}>
              {b.text}
            </p>
          );
        }
        if (b.type === "callout") {
          return (
            <div
              key={i}
              className="rounded-xl border border-accent/20 bg-accent-soft/40 px-4 py-3"
            >
              <p className={BODY_CLASS}>{b.text}</p>
            </div>
          );
        }
        return (
          <ul key={i} className="space-y-2.5">
            {b.items.map((item) => (
              <li key={item} className="flex gap-2.5">
                {checkStyle ? (
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <IconCheck size={12} />
                  </span>
                ) : (
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                )}
                <span className={BODY_MUTED_CLASS}>{item}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`shrink-0 text-muted ${TRANSITION_UI} ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4v10M8 10l4 4 4-4M5 18h14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
