"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  Check,
  Clock,
  Cloud,
  Globe,
  HardDrive,
  KeyRound,
  LayoutGrid,
  Play,
  Shield,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  STAT_VALUE_CLASS,
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

const ICON_SM = { size: 18, strokeWidth: 1.85 } as const;
const ICON_MD = { size: 22, strokeWidth: 1.75 } as const;

type SolutionCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  features: string[];
  Icon: LucideIcon;
  tone: string;
};

const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: "software-licensing",
    title: "Bản quyền phần mềm",
    body: "Mua và kích hoạt bản quyền chính hãng cho cá nhân, đội nhóm hoặc doanh nghiệp — linh hoạt theo hình thức cấp phép.",
    href: "/solutions/software-licensing",
    features: ["Perpetual / Subscription", "Volume licensing", "Giao nhận nhanh trên KEYON"],
    Icon: KeyRound,
    tone: "bg-accent-soft text-accent",
  },
  {
    id: "license-management",
    title: "Quản lý bản quyền",
    body: "Tập trung theo dõi license, cảnh báo gia hạn và tối ưu chi phí trên một nền tảng.",
    href: "/solutions/license-management",
    features: ["Dashboard tập trung", "Cảnh báo hết hạn", "Báo cáo sử dụng"],
    Icon: LayoutGrid,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    id: "security",
    title: "Bảo mật & An toàn",
    body: "Bảo vệ endpoint, dữ liệu và thiết bị với các gói bảo mật phù hợp quy mô.",
    href: "/solutions/security",
    features: ["Antivirus / Internet Security", "Endpoint protection", "Tư vấn chọn gói"],
    Icon: Shield,
    tone: "bg-sky-100 text-sky-800",
  },
  {
    id: "backup",
    title: "Backup & Khôi phục",
    body: "Sao lưu tự động và khôi phục nhanh khi sự cố — endpoint, cloud và máy chủ.",
    href: "/solutions/backup",
    features: ["Backup endpoint / server", "Khôi phục nhanh", "Chống mất dữ liệu"],
    Icon: HardDrive,
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "productivity",
    title: "Năng suất & Cộng tác",
    body: "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng — kích hoạt nhanh.",
    href: "/solutions/productivity",
    features: ["Microsoft 365 / Office", "Teams & Outlook", "Gói cá nhân → doanh nghiệp"],
    Icon: Sparkles,
    tone: "bg-orange-100 text-orange-800",
  },
  {
    id: "cloud",
    title: "Cloud",
    body: "Hạ tầng, storage và dịch vụ cloud linh hoạt — tối ưu chi phí và mở rộng theo nhu cầu.",
    href: "/solutions/cloud",
    features: ["Infrastructure / Storage", "Đối tác nền tảng", "Tư vấn triển khai"],
    Icon: Cloud,
    tone: "bg-cyan-100 text-cyan-800",
  },
];

const STATS = [
  { value: "10.000+", label: "Doanh nghiệp tin dùng", Icon: ShieldCheck },
  { value: "50+", label: "Quốc gia hỗ trợ", Icon: Globe },
  { value: "24/7", label: "Hỗ trợ chuyên nghiệp", Icon: Clock },
  { value: "99,99%", label: "Thời gian hoạt động", Icon: Award },
] as const;

const WHY_POINTS = [
  {
    title: "Tư vấn chuyên sâu",
    body: "Đội ngũ hiểu sản phẩm và quy mô sử dụng thực tế.",
  },
  {
    title: "Triển khai nhanh chóng",
    body: "Kích hoạt, giao nhận và hướng dẫn rõ ràng sau thanh toán.",
  },
  {
    title: "Hỗ trợ tận tâm",
    body: "Kênh hỗ trợ tiếng Việt, theo dõi trong Tài khoản KEYON.",
  },
  {
    title: "Đồng hành dài hạn",
    body: "Gia hạn, tối ưu chi phí và mở rộng khi doanh nghiệp lớn lên.",
  },
] as const;

const TESTIMONIALS = [
  {
    id: "tn",
    company: "Trung Nguyên",
    quote:
      "KEYON giúp chúng tôi mua và quản lý bản quyền tập trung, quy trình rõ ràng hơn nhiều so với mua lẻ trước đây.",
    name: "Nguyễn Minh Tuấn",
    role: "IT Manager",
  },
  {
    id: "tiki",
    company: "Tiki",
    quote:
      "Gói bảo mật và Office được giao nhanh, hỗ trợ kích hoạt kịp thời cho đội ngũ vận hành.",
    name: "Trần Thu Hà",
    role: "Procurement Lead",
  },
  {
    id: "fpt",
    company: "FPT Software",
    quote:
      "Chúng tôi dùng KEYON cho volume licensing — báo giá minh bạch, theo dõi gia hạn thuận tiện.",
    name: "Lê Quang Huy",
    role: "Infrastructure Lead",
  },
] as const;

const HERO_TILES = [
  { label: "License", tone: "bg-accent text-white", x: "8%", y: "12%" },
  { label: "Security", tone: "bg-sky-600 text-white", x: "72%", y: "8%" },
  { label: "Backup", tone: "bg-emerald-600 text-white", x: "78%", y: "58%" },
  { label: "Cloud", tone: "bg-cyan-600 text-white", x: "6%", y: "62%" },
  { label: "Office", tone: "bg-orange-500 text-white", x: "40%", y: "78%" },
] as const;

export function SolutionsHubLanding() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_20%,rgba(14,165,164,0.12),transparent_45%),radial-gradient(ellipse_at_8%_90%,rgba(14,165,233,0.05),transparent_50%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Giải pháp toàn diện</p>
              <h1 className={`mt-2.5 max-w-[18ch] ${HERO_TITLE_CLASS}`}>
                Giải pháp số cho doanh nghiệp hiện đại
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                KEYON đồng hành chuyển đổi số với bản quyền, bảo mật, backup, cloud và
                quản lý license — đúng nhu cầu, dễ triển khai, hỗ trợ tiếng Việt.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#danh-muc-giai-phap"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </a>
                <Link
                  href="/how-it-works"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-2 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:text-accent`}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-accent">
                    <Play size={14} fill="currentColor" strokeWidth={0} />
                  </span>
                  Xem cách KEYON hoạt động
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
              <SolutionsHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust stats ──────────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="home-container py-5 md:py-6">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {STATS.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                  aria-hidden
                >
                  <s.Icon {...ICON_MD} />
                </span>
                <div className="min-w-0">
                  <p className={STAT_VALUE_CLASS}>{s.value}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section id="danh-muc-giai-phap" className="scroll-mt-24 py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Danh mục giải pháp</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Chọn đúng hướng giải quyết — từ bản quyền và bảo mật đến cloud, backup và
              quản lý license.
            </p>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {SOLUTION_CARDS.map((card) => (
              <li key={card.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border/80 bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}
                    aria-hidden
                  >
                    <card.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{card.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{card.body}</p>
                  <ul className="mt-4 space-y-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check
                          size={14}
                          strokeWidth={2.6}
                          className="mt-0.5 shrink-0 text-accent"
                          aria-hidden
                        />
                        <span className={`text-[13px] leading-snug text-navy`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className={`mt-auto pt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-accent ${TRANSITION_UI} ${HOVER_LINK_ACCENT}`}
                  >
                    Tìm hiểu thêm
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why KEYON (dark) ─────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-8 sm:px-8 sm:py-9 lg:px-10 lg:py-10">
            <div
              className="pointer-events-none absolute inset-0 opacity-50"
              aria-hidden
              style={{
                background:
                  "radial-gradient(ellipse 50% 70% at 92% 40%, rgba(14,165,164,0.28), transparent 58%)",
              }}
            />
            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10">
              <div className="min-w-0">
                <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                  Chọn KEYON làm đối tác công nghệ của bạn
                </h2>
                <p className={`mt-3 max-w-lg ${SECTION_LEAD_CLASS} !text-white/70`}>
                  Từ tư vấn chọn gói đến kích hoạt và hỗ trợ dài hạn — KEYON đồng hành
                  doanh nghiệp với quy trình rõ ràng, sản phẩm chính hãng.
                </p>
                <Link
                  href="/contact/sales"
                  className={`mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Liên hệ tư vấn →
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {WHY_POINTS.map((p) => (
                  <li key={p.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <p className={`${CARD_TITLE_CLASS} !text-white`}>{p.title}</p>
                    <p className={`mt-1.5 text-sm leading-relaxed text-white/65`}>{p.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="border-t border-border bg-surface py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Khách hàng nói về KEYON</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <div className="mt-8 hidden gap-4 lg:grid lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} item={t} />
            ))}
          </div>

          <div className="mt-8 lg:hidden">
            <TestimonialCard item={TESTIMONIALS[quoteIdx]!} />
            <div className="mt-5 flex items-center justify-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  aria-label={`Xem đánh giá ${i + 1}`}
                  aria-current={i === quoteIdx}
                  onClick={() => setQuoteIdx(i)}
                  className={`h-2.5 w-2.5 rounded-full ${TRANSITION_UI} ${
                    i === quoteIdx ? "bg-accent" : "bg-border hover:bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function TestimonialCard({
  item,
}: {
  item: (typeof TESTIMONIALS)[number];
}) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
    >
      <span className={`${BADGE_CLASS} font-bold text-accent`} aria-hidden>
        “
      </span>
      <p className={`mt-1 ${BADGE_CLASS} font-semibold uppercase tracking-wide text-muted`}>
        {item.company}
      </p>
      <p className={`mt-3 flex-1 ${BODY_MUTED_CLASS}`}>{item.quote}</p>
      <div className="mt-5 border-t border-border pt-4">
        <p className={CARD_TITLE_CLASS}>{item.name}</p>
        <p className={`mt-0.5 ${CARD_META_CLASS}`}>{item.role}</p>
      </div>
    </article>
  );
}

function SolutionsHeroArt() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-[460px]"
      role="img"
      aria-label="Minh họa hệ sinh thái giải pháp KEYON"
    >
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,164,0.2),transparent_68%)] blur-2xl"
        aria-hidden
      />
      <svg
        className="pointer-events-none absolute inset-[12%] opacity-40"
        viewBox="0 0 400 400"
        aria-hidden
      >
        <path
          d="M80 120 L200 200 L320 90 M70 280 L200 200 L330 300 M200 60 L200 200 L200 340"
          fill="none"
          stroke="rgb(14 165 164 / 0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
      </svg>

      <div
        className={`absolute left-1/2 top-1/2 z-20 flex h-[7.5rem] w-[7.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-navy text-accent sm:h-36 sm:w-36 ${ELEVATION_FLOAT}`}
      >
        <span className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">K</span>
      </div>

      {HERO_TILES.map((tile) => (
        <div
          key={tile.label}
          className={`absolute z-10 flex h-12 w-12 items-center justify-center rounded-2xl text-[10px] font-bold shadow-md sm:h-14 sm:w-14 sm:text-[11px] ${tile.tone}`}
          style={{ left: tile.x, top: tile.y }}
        >
          {tile.label}
        </div>
      ))}
    </div>
  );
}
