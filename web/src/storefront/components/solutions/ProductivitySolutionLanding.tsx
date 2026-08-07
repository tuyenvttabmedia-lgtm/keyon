"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Headphones,
  Home,
  ShieldCheck,
  Users,
  Video,
  Zap,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SolutionFinalCta } from "./SolutionFinalCta";

export type ProductivityBrand =
  | "m365"
  | "teams"
  | "office"
  | "outlook"
  | "onedrive"
  | "onenote"
  | "todo"
  | "generic";

export type ProductivityFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  description: string;
  priceLabel: string;
  priceHint?: string;
  brand: ProductivityBrand;
};

type Props = {
  featured: ProductivityFeaturedProduct[];
  /** CMS: hero banner trong organic blob. */
  heroImageUrl?: string;
  /** CMS: ảnh tư vấn cột phải ecosystem. */
  consultImageUrl?: string;
  /** CMS: ảnh cột trái work-mode panel. */
  workSceneImageUrl?: string;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };
const ICON_MD = { size: 20, strokeWidth: 1.75, "aria-hidden": true as const };

const HERO_CHECKS = [
  "Làm việc linh hoạt ở mọi nơi",
  "Cộng tác thời gian thực, liền mạch",
  "Dữ liệu an toàn, luôn được đồng bộ",
] as const;

const VALUE_PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Kết nối liền mạch",
    body: "Giao tiếp, họp và chia sẻ trên một nền tảng thống nhất.",
    Icon: Users,
  },
  {
    title: "Năng suất vượt trội",
    body: "Tối ưu quy trình, tiết kiệm thời gian với bộ công cụ hiện đại.",
    Icon: Zap,
  },
  {
    title: "An toàn & Đáng tin cậy",
    body: "Bảo vệ dữ liệu theo chuẩn bảo mật — license chính hãng.",
    Icon: ShieldCheck,
  },
  {
    title: "Linh hoạt & Mở rộng",
    body: "Dễ dàng mở rộng theo nhu cầu cá nhân đến doanh nghiệp.",
    Icon: Cloud,
  },
];

type WorkModeId = "personal" | "team" | "remote" | "enterprise";

const WORK_MODES: {
  id: WorkModeId;
  label: string;
  Icon: LucideIcon;
  title: string;
  checks: string[];
  href: string;
  tools: { name: string; brand: ProductivityBrand }[];
  scene: "desk" | "team" | "remote" | "office";
}[] = [
  {
    id: "personal",
    label: "Làm việc cá nhân",
    Icon: Home,
    title: "Tập trung, tổ chức, hoàn thành công việc",
    checks: [
      "Quản lý công việc & lịch trình",
      "Lưu trữ & chia sẻ tài liệu",
      "Ghi chú & ý tưởng nhanh",
    ],
    href: "/products?cat=office",
    tools: [
      { name: "Microsoft 365 Personal", brand: "m365" },
      { name: "OneNote", brand: "onenote" },
      { name: "To Do", brand: "todo" },
      { name: "OneDrive", brand: "onedrive" },
    ],
    scene: "desk",
  },
  {
    id: "team",
    label: "Làm việc nhóm",
    Icon: Users,
    title: "Cộng tác nhóm mượt mà, đúng nhịp",
    checks: [
      "Họp & chat trên Microsoft Teams",
      "Đồng biên tập Word / Excel / PPT",
      "Chia sẻ file có kiểm soát quyền",
    ],
    href: "/products?q=teams",
    tools: [
      { name: "Microsoft Teams", brand: "teams" },
      { name: "Microsoft 365", brand: "m365" },
      { name: "OneDrive", brand: "onedrive" },
      { name: "Outlook", brand: "outlook" },
    ],
    scene: "team",
  },
  {
    id: "remote",
    label: "Làm việc từ xa",
    Icon: Video,
    title: "Làm việc mọi nơi, kết nối tức thì",
    checks: [
      "Họp HD trên Teams mọi lúc",
      "Đồng bộ OneDrive đa thiết bị",
      "Bảo mật đăng nhập & thiết bị",
    ],
    href: "/products?q=microsoft+365",
    tools: [
      { name: "Microsoft Teams", brand: "teams" },
      { name: "OneDrive", brand: "onedrive" },
      { name: "Outlook", brand: "outlook" },
      { name: "Microsoft 365", brand: "m365" },
    ],
    scene: "remote",
  },
  {
    id: "enterprise",
    label: "Doanh nghiệp",
    Icon: Building2,
    title: "Quản trị tập trung, mở rộng theo quy mô",
    checks: [
      "Gói doanh nghiệp / volume",
      "Quản trị identity & bảo mật",
      "Tư vấn triển khai với KEYON",
    ],
    href: "/contact/quote",
    tools: [
      { name: "Microsoft 365 Business", brand: "m365" },
      { name: "Microsoft Teams", brand: "teams" },
      { name: "Office LTSC", brand: "office" },
      { name: "OneDrive", brand: "onedrive" },
    ],
    scene: "office",
  },
];

const ECOSYSTEM_CHECKS = [
  "Tương thích Windows, macOS, iOS và Android",
  "Tích hợp hàng trăm ứng dụng phổ biến",
  "Kết nối liền mạch với hệ sinh thái Microsoft",
] as const;

export function ProductivitySolutionLanding({
  featured,
  heroImageUrl,
  consultImageUrl,
  workSceneImageUrl,
}: Props) {
  const products = featured.slice(0, 4);
  const showFeatured = products.length > 0;

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_12%,rgba(14,165,164,0.07),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.05),transparent_45%)]"
          aria-hidden
        />
        <div className="home-container relative py-7 md:py-9 lg:py-10">
          <nav className={`mb-6 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/solutions" className={HOVER_LINK_ACCENT}>
              Giải pháp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Năng suất & Cộng tác</span>
          </nav>

          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
            <div className="min-w-0">
              <h1 className={`max-w-[520px] ${HERO_TITLE_CLASS}`}>
                Kết nối con người.
                <span className="mt-1 block">Tăng tốc công việc.</span>
              </h1>
              <p className={`mt-4 max-w-[510px] ${PAGE_LEAD_CLASS}`}>
                Bộ công cụ và dịch vụ thông minh giúp cá nhân, đội nhóm làm việc linh hoạt hơn —
                cộng tác liền mạch, dữ liệu luôn đồng bộ.
              </p>

              <ul className="mt-6 space-y-3">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                      aria-hidden
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className={`${CARD_TITLE_CLASS} text-[15px]`}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=office"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>

            <div className="relative w-full min-w-0">
              <ProductivityHeroArt imageUrl={heroImageUrl} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Value pillars ────────────────────────────────────── */}
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <ul className="grid gap-6 rounded-2xl bg-navy px-6 py-7 sm:grid-cols-2 sm:px-8 sm:py-8 lg:grid-cols-4 lg:gap-5 lg:px-9 lg:py-9">
            {VALUE_PILLARS.map((v) => (
              <li key={v.title} className="flex flex-col gap-3 sm:flex-row sm:items-start lg:flex-col xl:flex-row">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
                  aria-hidden
                >
                  <v.Icon {...ICON_MD} />
                </span>
                <div>
                  <p className={`${CARD_TITLE_CLASS} text-white`}>{v.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300/90">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Work modes ───────────────────────────────────────── */}
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo cách bạn làm việc</h2>
          </header>
          <div className="mt-6">
            <WorkModesPanel workSceneImageUrl={workSceneImageUrl} />
          </div>
        </div>
      </section>

      {/* ── Products — left title + right cards (mockup) ─────── */}
      {showFeatured ? (
      <section className="py-8 md:py-9">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
            <div className="grid items-center gap-5 lg:grid-cols-[minmax(148px,0.38fr)_minmax(0,1fr)] lg:gap-5 xl:gap-6">
              <div className="min-w-0 lg:max-w-[200px]">
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Công cụ phù hợp cho bạn ngày hôm nay
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  License chính hãng trên KEYON.
                </p>
                <Link
                  href="/products?cat=office"
                  className={`mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-white/35 bg-transparent px-3.5 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Xem tất cả →
                </Link>
              </div>

              <div className="relative min-w-0 self-stretch pr-0 lg:pr-10 xl:pr-12">
                <ul className="grid h-full grid-cols-2 items-stretch gap-3 lg:grid-cols-4 lg:gap-3">
                  {products.map((p) => (
                    <li key={p.id} className="flex h-full min-h-[180px] items-center">
                      <article
                        className={`flex h-full w-full flex-col rounded-2xl bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                      >
                        <span className="shrink-0" aria-hidden>
                          <ProductBrandMark brand={p.brand} size={36} />
                        </span>
                        <h3 className={`mt-3 ${CARD_TITLE_CLASS} line-clamp-2`}>{p.title}</h3>
                        <p className={`mt-2 ${CARD_PRICE_CLASS} text-accent`}>{p.priceLabel}</p>
                        {p.priceHint ? (
                          <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                        ) : null}
                        <Link
                          href={p.href}
                          className={`mt-auto pt-3 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
                        >
                          Mua ngay →
                        </Link>
                      </article>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products?cat=office"
                  className={`absolute -right-0.5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white lg:flex ${ELEVATION_FLOAT} ${TRANSITION_UI} hover:bg-accent-hover`}
                  aria-label="Xem thêm sản phẩm"
                >
                  <ChevronRight size={18} strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {/* ── Ecosystem + consult ──────────────────────────────── */}
      <section className="py-8 md:py-9">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Hoạt động tốt hơn cùng hệ sinh thái bạn đang dùng
            </h2>
          </header>

          <div className="mt-6 grid items-center gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:gap-8 xl:gap-10">
            {/* Left — icon row + checklist (mockup: ~48px tiles, soft gap) */}
            <div className="flex flex-col justify-center gap-5">
              <ul className="flex flex-wrap items-center gap-3">
                <EcoMark kind="windows" />
                <EcoMark kind="apple" />
                <EcoMark kind="android" />
                <EcoMark kind="browser" />
                <EcoMark kind="chrome" />
                <EcoMark kind="slack" />
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white text-sm font-semibold text-muted ${ELEVATION_HAIRLINE}`}
                  aria-hidden
                >
                  …
                </span>
              </ul>
              <ul className="space-y-3">
                {ECOSYSTEM_CHECKS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                      aria-hidden
                    >
                      <Check size={13} strokeWidth={3} />
                    </span>
                    <span className={`${BODY_MUTED_CLASS} text-[15px] text-navy`}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — consult card + CMS portrait */}
            <div
              className={`relative overflow-hidden rounded-2xl border border-border bg-surface ${ELEVATION_HAIRLINE}`}
            >
              <div className="grid h-full min-h-[220px] sm:grid-cols-[1.15fr_0.85fr]">
                <div className="flex flex-col justify-center p-5 sm:p-6">
                  <h3 className={SUBSECTION_TITLE_CLASS}>Bạn cần tư vấn giải pháp phù hợp?</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>
                    Đội ngũ KEYON hỗ trợ chọn gói Microsoft 365 / Office theo nhu cầu — cá nhân hoặc
                    doanh nghiệp.
                  </p>
                  <Link
                    href="/contact/quote"
                    className={`mt-5 inline-flex h-11 w-fit items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                  >
                    Liên hệ tư vấn
                  </Link>
                </div>
                <div className="relative hidden min-h-[200px] sm:block">
                  <ConsultPortrait imageUrl={consultImageUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SolutionFinalCta
        title="Sẵn sàng nâng tầm hiệu suất làm việc?"
        subtitle="Bắt đầu hành trình làm việc thông minh hơn cùng KEYON ngay hôm nay."
        primaryHref="/contact/quote"
        primaryLabel="Liên hệ tư vấn →"
        secondaryHref="/products?cat=office"
        secondaryLabel="Khám phá giải pháp →"
      />
    </div>
  );
}

function WorkModesPanel({ workSceneImageUrl }: { workSceneImageUrl?: string }) {
  const [active, setActive] = useState<WorkModeId>("personal");
  const mode = WORK_MODES.find((m) => m.id === active) ?? WORK_MODES[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-6">
      <div
        role="tablist"
        aria-label="Cách làm việc"
        className="flex gap-1.5 overflow-x-auto pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0"
      >
        {WORK_MODES.map((m) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(m.id)}
              className={`inline-flex w-full shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-left ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                selected
                  ? "bg-accent text-white shadow-sm"
                  : "bg-transparent text-navy hover:bg-surface"
              }`}
            >
              <m.Icon size={18} strokeWidth={1.85} aria-hidden />
              {m.label}
            </button>
          );
        })}
      </div>

      <article
        role="tabpanel"
        className={`overflow-hidden rounded-2xl border border-border/80 bg-surface ${ELEVATION_HAIRLINE}`}
      >
        <div className="grid lg:grid-cols-[0.92fr_1.15fr_0.88fr]">
          <div className="relative min-h-[200px] overflow-hidden lg:min-h-[260px]">
            <WorkScene
              kind={mode.scene}
              label={mode.label}
              imageUrl={workSceneImageUrl}
            />
          </div>

          <div className="flex flex-col justify-center bg-white p-6 sm:p-7">
            <h3 className={SUBSECTION_TITLE_CLASS}>{mode.title}</h3>
            <ul className="mt-5 space-y-3">
              {mode.checks.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                    aria-hidden
                  >
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <span className={CARD_TITLE_CLASS}>{c}</span>
                </li>
              ))}
            </ul>
            <Link
              href={mode.href}
              className={`mt-6 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
            >
              Xem giải pháp →
            </Link>
          </div>

          <div className="border-t border-border bg-white p-5 sm:p-6 lg:border-l lg:border-t-0">
            <p className={`${OVERLINE_CLASS} tracking-wide text-muted`}>Công cụ nổi bật</p>
            <ul className="mt-3.5 space-y-2">
              {mode.tools.map((t) => (
                <li
                  key={t.name}
                  className={`flex items-center gap-3 rounded-xl px-2.5 py-2 ${TRANSITION_UI} hover:bg-surface`}
                >
                  <span className="shrink-0" aria-hidden>
                    <ProductBrandMark brand={t.brand} size={28} />
                  </span>
                  <span className={CARD_TITLE_CLASS}>{t.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ── Scenes / portraits ─────────────────────────────────────────────────── */

function WorkScene({
  kind,
  label,
  imageUrl,
}: {
  kind: "desk" | "team" | "remote" | "office";
  label: string;
  imageUrl?: string;
}) {
  if (imageUrl) {
    return (
      <div className="absolute inset-0">
        <Image src={imageUrl} alt={label} fill className="object-cover" unoptimized sizes="320px" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span
            className={`inline-flex rounded-lg bg-white/90 px-2.5 py-1 ${BADGE_CLASS} font-semibold text-navy backdrop-blur-sm ${ELEVATION_HAIRLINE}`}
          >
            {label}
          </span>
        </div>
      </div>
    );
  }

  const tones = {
    desk: "from-[#d8f3f0] via-[#e8f6f4] to-[#c5e8e4]",
    team: "from-[#dbeafe] via-[#e0f2fe] to-[#c7d2fe]",
    remote: "from-[#e0e7ff] via-[#ede9fe] to-[#dbeafe]",
    office: "from-[#e2e8f0] via-[#f1f5f9] to-[#cbd5e1]",
  } as const;

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${tones[kind]}`}>
      <svg viewBox="0 0 320 360" className="h-full w-full" aria-hidden>
        <rect x="24" y="28" width="90" height="70" rx="8" fill="#fff" opacity="0.55" />
        <rect x="32" y="36" width="74" height="54" rx="4" fill="#bae6fd" opacity="0.5" />
        <rect x="40" y="250" width="240" height="14" rx="3" fill="#94a3b8" opacity="0.45" />
        <rect x="70" y="170" width="160" height="90" rx="8" fill="#0f172a" opacity="0.12" />
        <rect x="82" y="180" width="136" height="72" rx="4" fill="#0ea5a4" opacity="0.22" />
        <circle cx="160" cy="145" r="28" fill="#f8fafc" />
        <circle cx="160" cy="140" r="22" fill="#cbd5e1" />
        <path d="M115 250c12-48 28-70 45-70s33 22 45 70" fill="#64748b" opacity="0.55" />
        <rect x="100" y="230" width="120" height="8" rx="2" fill="#475569" opacity="0.5" />
      </svg>
      <div className="absolute bottom-4 left-4 right-4">
        <span
          className={`inline-flex rounded-lg bg-white/90 px-2.5 py-1 ${BADGE_CLASS} font-semibold text-navy backdrop-blur-sm ${ELEVATION_HAIRLINE}`}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function ConsultPortrait({ imageUrl }: { imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt="Tư vấn KEYON"
          fill
          className="object-cover object-top"
          unoptimized
          sizes="280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/25 to-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-teal-100 to-slate-200">
      <svg viewBox="0 0 220 260" className="h-full w-full" aria-hidden>
        <defs>
          <linearGradient id="cpSkin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <path d="M30 260c20-70 50-100 80-100s60 30 80 100" fill="#0f172a" opacity="0.55" />
        <circle cx="110" cy="110" r="42" fill="url(#cpSkin)" />
        <path
          d="M68 110a42 42 0 0 1 84 0"
          fill="none"
          stroke="#0ea5a4"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="58" y="108" width="14" height="22" rx="4" fill="#0ea5a4" />
        <rect x="148" y="108" width="14" height="22" rx="4" fill="#0ea5a4" />
        <path d="M72 130c8 18 28 28 48 18" fill="none" stroke="#0ea5a4" strokeWidth="3" />
        <circle cx="95" cy="155" r="5" fill="#14b8a6" />
      </svg>
      <div className="absolute bottom-3 left-3 right-3">
        <p className={`${BADGE_CLASS} font-semibold text-navy/80`}>Hỗ trợ KEYON</p>
      </div>
    </div>
  );
}

/* ── Brand marks ────────────────────────────────────────────────────────── */

function ProductBrandMark({ brand, size = 40 }: { brand: ProductivityBrand; size?: number }) {
  switch (brand) {
    case "m365":
      return <M365Mark size={size} />;
    case "teams":
      return <TeamsMark size={size} />;
    case "office":
      return <OfficeMark size={size} />;
    case "outlook":
      return <OutlookMark size={size} />;
    case "onedrive":
      return <OneDriveMark size={size} />;
    case "onenote":
      return <OneNoteMark size={size} />;
    case "todo":
      return <ToDoMark size={size} />;
    default:
      return <M365Mark size={size} />;
  }
}

function M365Mark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#EB3C00" />
      <path
        fill="#fff"
        d="M11 12h7.2v7.2H11V12Zm10.8 0H29v7.2h-7.2V12ZM11 22.8h7.2V30H11v-7.2Zm10.8 0H29V30h-7.2v-7.2Z"
      />
    </svg>
  );
}

function TeamsMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#5059C9" />
      <circle cx="27.5" cy="13.5" r="3.2" fill="#fff" opacity="0.95" />
      <rect x="9" y="14" width="14" height="15" rx="2.5" fill="#fff" />
      <rect x="21" y="17" width="10" height="12" rx="2" fill="#B6BAF0" />
    </svg>
  );
}

function OfficeMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#D83B01" />
      <path
        fill="#fff"
        d="M22.5 10.5 12 13.2v13.6l10.5 2.7 10-2.5V13l-10-2.5Zm0 2.2 7.2 1.8v11l-7.2 1.8V12.7Zm-1.6 1.1v12.4L13.6 24.5V15.5l7.3-1.7Z"
      />
    </svg>
  );
}

function OutlookMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#0078D4" />
      <path
        fill="#fff"
        d="M10 13.5h11.5c.8 0 1.5.7 1.5 1.5v10c0 .8-.7 1.5-1.5 1.5H10c-.8 0-1.5-.7-1.5-1.5v-10c0-.8.7-1.5 1.5-1.5Zm1.8 2.2v8.6l5.2-3.6 5.2 3.6v-8.6H11.8Z"
      />
    </svg>
  );
}

function OneDriveMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#0078D4" />
      <path
        fill="#fff"
        d="M24.2 15.2c-1.1-2.2-3.4-3.6-5.9-3.6-2.8 0-5.2 1.7-6.2 4.2-2.4.3-4.3 2.4-4.3 4.9 0 2.7 2.2 4.9 4.9 4.9h15.4c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-.6-2.2-2.5-3.9-4.5-1.4Z"
        opacity="0.95"
      />
    </svg>
  );
}

function OneNoteMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#7719AA" />
      <path fill="#fff" d="M12 10h7l9 20h-7.2L18.2 22H12v8h-4V10h4Zm0 8.5h5.2l-2.4-5.4h-.2L12 18.5Z" />
    </svg>
  );
}

function ToDoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="8" fill="#2564CF" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 20.5 16.5 27 30 12"
      />
    </svg>
  );
}

function EcoMark({
  kind,
}: {
  kind: "windows" | "apple" | "android" | "browser" | "chrome" | "slack";
}) {
  const wrap = `flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-white ${ELEVATION_HAIRLINE}`;
  if (kind === "windows") {
    return (
      <span className={wrap} title="Windows" aria-label="Windows">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#0078D4"
            d="M3 5.5 11 4.3v7.2H3V5.5Zm9-.9 9-1.3v9.4h-9V4.6ZM3 13.5h8V21l-8-1.2v-6.3Zm9 0h9v8.7l-9-1.3v-7.4Z"
          />
        </svg>
      </span>
    );
  }
  if (kind === "apple") {
    return (
      <span className={wrap} title="Apple" aria-label="Apple">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#111" aria-hidden>
          <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.3 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.6s-2.3-.9-2.3-3.2ZM14.7 5.7c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z" />
        </svg>
      </span>
    );
  }
  if (kind === "android") {
    return (
      <span className={wrap} title="Android" aria-label="Android">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#3DDC84"
            d="M17 10.5V17a1 1 0 0 1-1 1h-1v3.5a1.5 1.5 0 1 1-3 0V18H12v3.5a1.5 1.5 0 1 1-3 0V18H8a1 1 0 0 1-1-1v-6.5h10ZM7 11.5H5a1.5 1.5 0 0 0 0 3h2v-3Zm12 0h-2v3h2a1.5 1.5 0 0 0 0-3ZM8.5 6.2 7.6 4.7a.5.5 0 1 1 .86-.5l.95 1.6A6.9 6.9 0 0 1 12 5.5c.9 0 1.8.2 2.6.4l.95-1.6a.5.5 0 1 1 .86.5l-.9 1.5A6 6 0 0 1 18 10.5H6a6 6 0 0 1 2.5-4.3ZM10 8.2a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Zm4 0a.7.7 0 1 0 0-1.4.7.7 0 0 0 0 1.4Z"
          />
        </svg>
      </span>
    );
  }
  if (kind === "chrome") {
    return (
      <span className={wrap} title="Chrome" aria-label="Chrome">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
          <path fill="#EA4335" d="M12 3a9 9 0 0 1 7.8 4.5H12V3Z" />
          <path fill="#FBBC04" d="M19.8 7.5A9 9 0 0 1 15.6 19l-3.6-6.2 7.8-5.3Z" />
          <path fill="#34A853" d="M8.4 19A9 9 0 0 1 4.2 7.5l7.8 5.3L8.4 19Z" />
          <circle cx="12" cy="12" r="9" fill="none" stroke="#E8EAED" strokeWidth="0.5" />
        </svg>
      </span>
    );
  }
  if (kind === "slack") {
    return (
      <span className={wrap} title="Slack" aria-label="Slack">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="#E01E5A" d="M6.5 15.5a2 2 0 1 1-2-2h2v2Zm1 0a2 2 0 1 1 4 0v5a2 2 0 1 1-4 0v-5Z" />
          <path fill="#36C5F0" d="M8.5 6.5a2 2 0 1 1 2-2v2h-2Zm0 1a2 2 0 1 1 0 4h-5a2 2 0 1 1 0-4h5Z" />
          <path fill="#2EB67D" d="M17.5 8.5a2 2 0 1 1 2 2h-2v-2Zm-1 0a2 2 0 1 1-4 0v-5a2 2 0 1 1 4 0v5Z" />
          <path fill="#ECB22E" d="M15.5 17.5a2 2 0 1 1-2 2v-2h2Zm0-1a2 2 0 1 1 0-4h5a2 2 0 1 1 0 4h-5Z" />
        </svg>
      </span>
    );
  }
  return (
    <span className={wrap} title="Browser" aria-label="Browser">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0f172a"
        strokeWidth="1.7"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ProductivityHeroArt({ imageUrl }: { imageUrl?: string }) {
  return (
    <div className="flex w-full items-center justify-center max-h-[300px] sm:max-h-[380px] lg:h-[440px] lg:max-h-[460px] xl:h-[450px]">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Năng suất & Cộng tác"
          width={900}
          height={700}
          className="h-auto max-h-full w-auto max-w-full object-contain object-center"
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 48vw, 640px"
          priority
        />
      ) : (
        <div
          className="flex h-full min-h-[200px] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 via-teal-50/70 to-slate-100 lg:min-h-0"
          aria-hidden
        >
          <span className="font-display text-3xl font-bold tracking-wide text-accent/25 sm:text-4xl">
            KEYON
          </span>
        </div>
      )}
    </div>
  );
}
