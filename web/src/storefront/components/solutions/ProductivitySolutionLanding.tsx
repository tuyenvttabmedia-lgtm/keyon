"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Headphones,
  Home,
  Rocket,
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
  SECTION_LEAD_CLASS,
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

export type ProductivityFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  description: string;
  priceLabel: string;
  priceHint?: string;
  brand: "m365" | "teams" | "office" | "outlook" | "onedrive" | "generic";
};

type Props = {
  featured: ProductivityFeaturedProduct[];
  usingFallback?: boolean;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };
const ICON_MD = { size: 22, strokeWidth: 1.75, "aria-hidden": true as const };

const HERO_CHECKS = [
  "Làm việc linh hoạt ở mọi nơi",
  "Cộng tác thời gian thực, liền mạch",
  "Dữ liệu an toàn, luôn được đồng bộ",
] as const;

const VALUE_PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Kết nối liền mạch",
    body: "Chat, họp và chia sẻ trong một không gian thống nhất.",
    Icon: Users,
  },
  {
    title: "Năng suất vượt trội",
    body: "Công cụ Office hiện đại giúp hoàn thành việc nhanh hơn.",
    Icon: Zap,
  },
  {
    title: "An toàn & Đáng tin cậy",
    body: "License chính hãng, dữ liệu được bảo vệ theo chuẩn.",
    Icon: ShieldCheck,
  },
  {
    title: "Linh hoạt & Mở rộng",
    body: "Từ cá nhân đến doanh nghiệp — mở rộng khi cần.",
    Icon: Cloud,
  },
];

type WorkModeId = "personal" | "team" | "remote" | "enterprise";

const WORK_MODES: {
  id: WorkModeId;
  label: string;
  Icon: LucideIcon;
  title: string;
  body: string;
  checks: string[];
  href: string;
  tools: { name: string; brand: ProductivityFeaturedProduct["brand"] }[];
  panelTone: string;
}[] = [
  {
    id: "personal",
    label: "Làm việc cá nhân",
    Icon: Home,
    title: "Tập trung, tổ chức, hoàn thành công việc",
    body: "Bộ công cụ gọn cho học tập và làm việc cá nhân — soạn thảo, mail, lưu trữ đồng bộ.",
    checks: [
      "Office apps trên nhiều thiết bị",
      "Lưu trữ OneDrive an toàn",
      "Email Outlook chuyên nghiệp",
    ],
    href: "/products?cat=office",
    tools: [
      { name: "Microsoft 365 Personal", brand: "m365" },
      { name: "OneNote", brand: "office" },
      { name: "To Do", brand: "outlook" },
      { name: "Outlook", brand: "outlook" },
      { name: "OneDrive", brand: "onedrive" },
    ],
    panelTone: "from-teal-600/90 via-cyan-700 to-navy",
  },
  {
    id: "team",
    label: "Làm việc nhóm",
    Icon: Users,
    title: "Cộng tác nhóm mượt mà, đúng nhịp",
    body: "Họp, chat và đồng biên tập tài liệu — mọi người cùng một nguồn sự thật.",
    checks: [
      "Microsoft Teams họp & chat",
      "Đồng biên tập Word / Excel / PPT",
      "Chia sẻ file có kiểm soát quyền",
    ],
    href: "/products?q=teams",
    tools: [
      { name: "Microsoft Teams", brand: "teams" },
      { name: "Microsoft 365", brand: "m365" },
      { name: "SharePoint", brand: "office" },
      { name: "OneDrive", brand: "onedrive" },
      { name: "Outlook", brand: "outlook" },
    ],
    panelTone: "from-sky-600 via-teal-700 to-navy",
  },
  {
    id: "remote",
    label: "Làm việc từ xa",
    Icon: Video,
    title: "Làm việc mọi nơi, kết nối tức thì",
    body: "Họp trực tuyến ổn định, truy cập file cloud và đồng bộ trên laptop, tablet, điện thoại.",
    checks: [
      "Họp HD trên Teams",
      "Đồng bộ OneDrive mọi thiết bị",
      "Bảo mật đăng nhập & thiết bị",
    ],
    href: "/products?q=microsoft+365",
    tools: [
      { name: "Microsoft Teams", brand: "teams" },
      { name: "OneDrive", brand: "onedrive" },
      { name: "Outlook", brand: "outlook" },
      { name: "Microsoft 365", brand: "m365" },
      { name: "Office 2024", brand: "office" },
    ],
    panelTone: "from-indigo-600 via-sky-700 to-navy",
  },
  {
    id: "enterprise",
    label: "Doanh nghiệp",
    Icon: Building2,
    title: "Quản trị tập trung, mở rộng theo quy mô",
    body: "Volume licensing, quản lý người dùng và tư vấn chọn gói phù hợp phòng ban.",
    checks: [
      "Gói doanh nghiệp / volume",
      "Quản trị identity & bảo mật",
      "Tư vấn triển khai với KEYON",
    ],
    href: "/contact/sales",
    tools: [
      { name: "Microsoft 365 Business", brand: "m365" },
      { name: "Microsoft Teams", brand: "teams" },
      { name: "Office LTSC", brand: "office" },
      { name: "OneDrive", brand: "onedrive" },
      { name: "Outlook", brand: "outlook" },
    ],
    panelTone: "from-navy via-slate-800 to-slate-900",
  },
];

const ECOSYSTEM_CHECKS = [
  "Tương thích Windows, macOS, iOS và Android",
  "Làm việc trên trình duyệt hoặc app desktop",
  "Đồng bộ với hệ sinh thái Microsoft bạn đang dùng",
] as const;

export function ProductivitySolutionLanding({ featured, usingFallback }: Props) {
  const products = featured.slice(0, 4);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,164,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.05),_transparent_50%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-9 lg:py-11">
          <nav className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>
                Năng suất & Cộng tác
              </p>
              <h1 className={`mt-2.5 max-w-xl ${HERO_TITLE_CLASS}`}>
                Kết nối con người.
                <span className="mt-1 block">Tăng tốc công việc.</span>
              </h1>
              <p className={`mt-4 max-w-lg ${PAGE_LEAD_CLASS}`}>
                Công cụ và dịch vụ thông minh giúp cá nhân, đội nhóm làm việc linh hoạt — cộng tác
                liền mạch, dữ liệu luôn đồng bộ.
              </p>

              <ul className="mt-5 space-y-2.5">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"
                      aria-hidden
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className={CARD_TITLE_CLASS}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=office"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn miễn phí
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <ProductivityHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Value pillars ────────────────────────────────────── */}
      <section className="py-8 md:py-9">
        <div className="home-container">
          <ul className="grid gap-5 rounded-2xl bg-navy px-5 py-6 sm:grid-cols-2 sm:px-7 sm:py-7 lg:grid-cols-4 lg:gap-6 lg:px-8">
            {VALUE_PILLARS.map((v) => (
              <li key={v.title} className="flex gap-3.5">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent"
                  aria-hidden
                >
                  <v.Icon {...ICON_MD} />
                </span>
                <div>
                  <p className={`${CARD_TITLE_CLASS} text-white`}>{v.title}</p>
                  <p className={`mt-1 text-sm leading-relaxed text-slate-300`}>{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Work modes ───────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo cách bạn làm việc</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn ngữ cảnh phù hợp — cá nhân, nhóm, từ xa hoặc doanh nghiệp.
            </p>
          </header>
          <div className="mt-7">
            <WorkModesPanel />
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface py-9 md:py-11">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Công cụ phù hợp cho bạn ngày hôm nay</h2>
              {usingFallback ? (
                <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>
                  Giá tham khảo — xác nhận khi xem chi tiết hoặc tư vấn.
                </p>
              ) : null}
            </div>
            <Link
              href="/products?cat=office"
              className={`inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="relative">
            <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {products.map((p) => (
                <li key={p.id}>
                  <article
                    className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <span className="flex h-12 w-12 items-center justify-center" aria-hidden>
                      <ProductBrandMark brand={p.brand} />
                    </span>
                    <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                    <p className={`mt-2 ${CARD_PRICE_CLASS} text-accent`}>{p.priceLabel}</p>
                    {p.priceHint ? (
                      <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                    ) : null}
                    <Link
                      href={p.href}
                      className={`mt-auto pt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
                    >
                      Mua ngay
                      <span aria-hidden>→</span>
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
            <Link
              href="/products?cat=office"
              className={`absolute -right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-navy xl:flex ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              aria-label="Xem thêm sản phẩm"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ecosystem + consult ──────────────────────────────── */}
      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Hoạt động tốt hơn cùng hệ sinh thái bạn đang dùng
            </h2>
          </header>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
            <div
              className={`rounded-2xl border border-border bg-white p-6 sm:p-7 ${ELEVATION_HAIRLINE}`}
            >
              <ul className="flex flex-wrap items-center gap-3">
                <EcoMark kind="windows" />
                <EcoMark kind="apple" />
                <EcoMark kind="android" />
                <EcoMark kind="browser" />
                <EcoMark kind="chrome" />
                <EcoMark kind="slack" />
              </ul>
              <ul className="mt-6 space-y-3">
                {ECOSYSTEM_CHECKS.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className={BODY_MUTED_CLASS}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-accent p-6 text-white sm:p-7">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
              <div className="relative flex h-full flex-col">
                <span
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"
                  aria-hidden
                >
                  <Headphones size={24} strokeWidth={1.7} />
                </span>
                <h3 className={`${SUBSECTION_TITLE_CLASS} text-white`}>
                  Bạn cần tư vấn giải pháp phù hợp?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  Đội ngũ KEYON hỗ trợ chọn gói Microsoft 365 / Office theo nhu cầu cá nhân hoặc
                  doanh nghiệp.
                </p>
                <Link
                  href="/contact/sales"
                  className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-5 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:bg-white/95 sm:w-auto`}
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-10 md:pb-12">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-8 sm:px-10 sm:py-9 lg:px-12">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex max-w-xl gap-4">
                <span
                  className="mt-1 hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-accent sm:flex"
                  aria-hidden
                >
                  <Rocket size={24} strokeWidth={1.7} />
                </span>
                <div>
                  <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                    Sẵn sàng nâng tầm hiệu suất làm việc?
                  </h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-300 md:text-[15px]">
                    Chọn giải pháp phù hợp hoặc nhận tư vấn miễn phí từ KEYON.
                  </p>
                </div>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/products?cat=office"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:bg-white/5 hover:text-accent`}
                >
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkModesPanel() {
  const [active, setActive] = useState<WorkModeId>("personal");
  const mode = WORK_MODES.find((m) => m.id === active) ?? WORK_MODES[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {WORK_MODES.map((m) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setActive(m.id)}
              className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-left ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                selected
                  ? "bg-accent text-white"
                  : `border border-border bg-white text-navy hover:border-accent/50 ${ELEVATION_HAIRLINE}`
              }`}
            >
              <m.Icon size={18} strokeWidth={1.85} aria-hidden />
              {m.label}
            </button>
          );
        })}
      </div>

      <article
        className={`overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE}`}
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr] xl:grid-cols-[0.85fr_1fr_0.85fr]">
          <div
            className={`relative min-h-[180px] bg-gradient-to-br ${mode.panelTone} p-5 md:min-h-full`}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 25% 30%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 40%)",
              }}
              aria-hidden
            />
            <div className="relative flex h-full flex-col justify-end">
              <span
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm"
                aria-hidden
              >
                <mode.Icon {...ICON_MD} />
              </span>
              <p className={`${BADGE_CLASS} font-semibold tracking-wide text-white/80`}>
                {mode.label}
              </p>
            </div>
          </div>

          <div className="flex flex-col p-5 sm:p-6">
            <h3 className={SUBSECTION_TITLE_CLASS}>{mode.title}</h3>
            <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{mode.body}</p>
            <ul className="mt-4 space-y-2.5">
              {mode.checks.map((c) => (
                <li key={c} className="flex gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <Check size={12} strokeWidth={3} />
                  </span>
                  <span className={CARD_TITLE_CLASS}>{c}</span>
                </li>
              ))}
            </ul>
            <Link href={mode.href} className={`mt-5 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
              Xem giải pháp →
            </Link>
          </div>

          <div className="border-t border-border bg-surface/70 p-5 sm:p-6 md:col-span-2 xl:col-span-1 xl:border-l xl:border-t-0">
            <p className={`${OVERLINE_CLASS} text-muted`}>Công cụ nổi bật</p>
            <ul className="mt-3 space-y-2.5">
              {mode.tools.map((t) => (
                <li
                  key={t.name}
                  className={`flex items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2 ${ELEVATION_HAIRLINE}`}
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

/** Illustrative cards when catalog has no matching SKUs — prices are reference only. */
export const PRODUCTIVITY_FALLBACK_FEATURED: ProductivityFeaturedProduct[] = [
  {
    id: "fb-m365",
    title: "Microsoft 365",
    href: "/products?q=microsoft+365",
    description: "Bộ công cụ Office + Teams + OneDrive trên cloud.",
    priceLabel: "Từ 2.399.000 đ / năm",
    priceHint: "Giá tham khảo",
    brand: "m365",
  },
  {
    id: "fb-teams",
    title: "Microsoft Teams",
    href: "/products?q=teams",
    description: "Họp trực tuyến, chat và cộng tác nhóm.",
    priceLabel: "Từ 1.190.000 đ / năm",
    priceHint: "Giá tham khảo",
    brand: "teams",
  },
  {
    id: "fb-office",
    title: "Office 2024",
    href: "/products?cat=office",
    description: "Word, Excel, PowerPoint cài đặt trên máy.",
    priceLabel: "Từ 3.490.000 đ",
    priceHint: "Giá tham khảo",
    brand: "office",
  },
  {
    id: "fb-onedrive",
    title: "OneDrive",
    href: "/products?q=onedrive",
    description: "Lưu trữ đám mây và đồng bộ file an toàn.",
    priceLabel: "Từ 690.000 đ / năm",
    priceHint: "Giá tham khảo",
    brand: "onedrive",
  },
];

/* ── Marks & hero art ───────────────────────────────────────────────────── */

function ProductBrandMark({
  brand,
  size = 40,
}: {
  brand: ProductivityFeaturedProduct["brand"];
  size?: number;
}) {
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
    default:
      return <M365Mark size={size} />;
  }
}

function M365Mark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#EB3C00" />
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
      <rect width="40" height="40" rx="9" fill="#5059C9" />
      <circle cx="27.5" cy="13.5" r="3.2" fill="#fff" opacity="0.95" />
      <rect x="9" y="14" width="14" height="15" rx="2.5" fill="#fff" />
      <rect x="21" y="17" width="10" height="12" rx="2" fill="#B6BAF0" />
    </svg>
  );
}

function OfficeMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#D83B01" />
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
      <rect width="40" height="40" rx="9" fill="#0078D4" />
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
      <rect width="40" height="40" rx="9" fill="#0078D4" />
      <path
        fill="#fff"
        d="M24.2 15.2c-1.1-2.2-3.4-3.6-5.9-3.6-2.8 0-5.2 1.7-6.2 4.2-2.4.3-4.3 2.4-4.3 4.9 0 2.7 2.2 4.9 4.9 4.9h15.4c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-.6-2.2-2.5-3.9-4.5-1.4Z"
        opacity="0.95"
      />
    </svg>
  );
}

function EcoMark({
  kind,
}: {
  kind: "windows" | "apple" | "android" | "browser" | "chrome" | "slack";
}) {
  const wrap = `flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface ${ELEVATION_HAIRLINE}`;
  if (kind === "windows") {
    return (
      <span className={wrap} title="Windows" aria-label="Windows">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="#0078D4" d="M3 5.5 11 4.3v7.2H3V5.5Zm9-.9 9-1.3v9.4h-9V4.6ZM3 13.5h8V21l-8-1.2v-6.3Zm9 0h9v8.7l-9-1.3v-7.4Z" />
        </svg>
      </span>
    );
  }
  if (kind === "apple") {
    return (
      <span className={wrap} title="Apple" aria-label="Apple">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#111" aria-hidden>
          <path d="M16.4 12.7c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.3 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.7c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.6s-2.3-.9-2.3-3.2ZM14.7 5.7c.6-.8 1.1-1.9.9-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.8-.9 2.9 1 .1 2-.5 2.6-1.3Z" />
        </svg>
      </span>
    );
  }
  if (kind === "android") {
    return (
      <span className={wrap} title="Android" aria-label="Android">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <path fill="#3DDC84" d="M6 10.5c0-3.3 2.7-6 6-6s6 2.7 6 6v6.5H6V10.5Zm-2.5 1.2c-.8 0-1.5.7-1.5 1.5v4c0 .8.7 1.5 1.5 1.5S5 17.5 5 16.7v-4c0-.8-.7-1.5-1.5-1.5Zm17 0c-.8 0-1.5.7-1.5 1.5v4c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5v-4c0-.8-.7-1.5-1.5-1.5ZM9 19.5c0 .8.7 1.5 1.5 1.5h.5V22c0 .6.4 1 1 1s1-.4 1-1v-1h1v1c0 .6.4 1 1 1s1-.4 1-1v-1h.5c.8 0 1.5-.7 1.5-1.5v-.5H9v.5ZM8.2 6.3l-.9-1.5c-.1-.2 0-.5.2-.6.2-.1.5 0 .6.2l.9 1.5c.7-.3 1.4-.5 2.2-.6V3.5c0-.3.2-.5.5-.5s.5.2.5.5V5.3c.8.1 1.5.3 2.2.6l.9-1.5c.1-.2.4-.3.6-.2.2.1.3.4.2.6l-.9 1.5c1.3.7 2.2 1.9 2.5 3.4H5.7c.3-1.5 1.2-2.7 2.5-3.4Z" />
        </svg>
      </span>
    );
  }
  if (kind === "chrome") {
    return (
      <span className={wrap} title="Chrome" aria-label="Chrome">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="9" fill="none" stroke="#4285F4" strokeWidth="2" />
          <circle cx="12" cy="12" r="3.2" fill="#4285F4" />
          <path fill="#EA4335" d="M12 3a9 9 0 0 1 7.8 4.5H12V3Z" />
          <path fill="#FBBC04" d="M19.8 7.5A9 9 0 0 1 15.6 19l-3.6-6.2 7.8-5.3Z" />
          <path fill="#34A853" d="M8.4 19A9 9 0 0 1 4.2 7.5l7.8 5.3L8.4 19Z" />
        </svg>
      </span>
    );
  }
  if (kind === "slack") {
    return (
      <span className={wrap} title="Slack" aria-label="Slack">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="1.7" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ProductivityHeroArt() {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-gradient-to-br from-[#ecfeff] via-[#f0f9ff] to-[#e2e8f0] p-3 sm:p-4 ${ELEVATION_FLOAT}`}
    >
      <div
        className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl"
        aria-hidden
      />

      <div className="relative aspect-[5/4] w-full">
        {/* Main stage */}
        <div className="absolute inset-x-6 bottom-3 top-8 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-700 via-navy to-slate-900 sm:inset-x-8">
          <div
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 35% 40%, rgba(14,165,164,0.45), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(56,189,248,0.2), transparent 40%)",
            }}
            aria-hidden
          />
          {/* Person / workspace silhouette */}
          <svg
            viewBox="0 0 360 280"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <ellipse cx="180" cy="250" rx="90" ry="14" fill="#000" opacity="0.25" />
            <rect x="95" y="150" width="170" height="100" rx="10" fill="#1e293b" />
            <rect x="115" y="95" width="130" height="85" rx="8" fill="#0f172a" stroke="#334155" />
            <rect x="125" y="105" width="110" height="58" rx="4" fill="#0ea5a4" opacity="0.3" />
            {/* person */}
            <circle cx="180" cy="130" r="22" fill="#cbd5e1" />
            <path d="M145 210c10-35 25-50 35-50s25 15 35 50" fill="#94a3b8" />
          </svg>
        </div>

        {/* Video call card */}
        <div
          className={`absolute left-1 top-2 w-[42%] max-w-[11rem] rounded-xl border border-border bg-white p-2 ${ELEVATION_HAIRLINE} sm:left-2 sm:top-3`}
        >
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-gradient-to-br from-slate-200 to-slate-300"
                style={{
                  backgroundImage: `linear-gradient(135deg, hsl(${160 + i * 18}, 35%, ${70 - i}%) 0%, hsl(${200 + i * 10}, 30%, 55%) 100%)`,
                }}
              />
            ))}
          </div>
          <p className={`mt-1.5 ${BADGE_CLASS} font-semibold text-navy`}>Họp nhóm · 6 người</p>
        </div>

        {/* Sync card */}
        <div
          className={`absolute right-1 top-4 w-[46%] max-w-[12rem] rounded-xl border border-border bg-white px-3 py-2.5 ${ELEVATION_HAIRLINE} sm:right-2`}
        >
          <p className={`${BADGE_CLASS} font-semibold text-navy`}>Đồng bộ dữ liệu</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full w-full rounded-full bg-accent" />
          </div>
          <p className={`mt-1 ${CARD_META_CLASS}`}>100% hoàn tất</p>
        </div>

        {/* Meetings count */}
        <div
          className={`absolute bottom-[22%] right-1 rounded-xl border border-border bg-white px-3 py-2 ${ELEVATION_HAIRLINE} sm:right-2`}
        >
          <p className={`${BADGE_CLASS} text-muted`}>Cuộc họp hôm nay</p>
          <p className="mt-0.5 font-display text-2xl font-bold tabular-nums text-navy">6</p>
        </div>

        {/* Docs chip */}
        <div
          className={`absolute bottom-2 left-2 flex items-center gap-1.5 rounded-xl border border-border bg-white px-2.5 py-2 ${ELEVATION_HAIRLINE} sm:left-3`}
        >
          <WordChip />
          <ExcelChip />
          <PptChip />
          <span className={`${BADGE_CLASS} ml-1 font-semibold text-navy`}>Tài liệu cộng tác</span>
        </div>
      </div>
    </div>
  );
}

function WordChip() {
  return (
    <svg width="22" height="22" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="6" fill="#185ABD" />
      <path fill="#fff" d="M10 9h7.5l1.2 10.2L20.8 9H28l-3.4 18h-5.2l-1.5-11.4L16.4 27H11L10 9Z" />
    </svg>
  );
}

function ExcelChip() {
  return (
    <svg width="22" height="22" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="6" fill="#107C41" />
      <path fill="#fff" d="M12 9h5.2l2.6 6.4L22.6 9H28l-4.8 9L28 27h-5.5l-2.8-6.6L16.8 27H11.5l4.9-9L12 9Z" />
    </svg>
  );
}

function PptChip() {
  return (
    <svg width="22" height="22" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="6" fill="#C43E1C" />
      <path fill="#fff" d="M11 9h9.2c3.4 0 5.6 2 5.6 5.1 0 3.2-2.3 5.2-5.8 5.2H15.6V27H11V9Zm4.6 3.4v5.2h3.8c1.7 0 2.7-.9 2.7-2.6s-1-2.6-2.7-2.6h-3.8Z" />
    </svg>
  );
}
