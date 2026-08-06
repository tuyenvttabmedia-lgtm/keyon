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
  Headphones,
  KeyRound,
  LayoutGrid,
  Play,
  Quote,
  Rocket,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FONT_DISPLAY,
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

const ICON_MD = { size: 22, strokeWidth: 1.75 } as const;
const ICON_SM = { size: 16, strokeWidth: 1.85 } as const;

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
    body: "Mua và kích hoạt bản quyền chính hãng cho cá nhân, đội nhóm hoặc doanh nghiệp — đúng nhu cầu, đúng giá trị.",
    href: "/solutions/software-licensing",
    features: ["Hơn 5.000 sản phẩm", "Kích hoạt tự động", "Giá cạnh tranh"],
    Icon: KeyRound,
    tone: "bg-accent-soft text-accent",
  },
  {
    id: "license-management",
    title: "Quản lý bản quyền",
    body: "Theo dõi, phân bổ và tối ưu chi phí license trên một nền tảng — chủ động trước khi hết hạn.",
    href: "/solutions/license-management",
    features: ["Theo dõi & phân bổ license", "Cảnh báo gia hạn tự động", "Báo cáo chi tiết"],
    Icon: LayoutGrid,
    tone: "bg-violet-100 text-violet-700",
  },
  {
    id: "security",
    title: "Bảo mật & An toàn",
    body: "Bảo vệ thiết bị, dữ liệu và endpoint với các gói bảo mật phù hợp quy mô doanh nghiệp.",
    href: "/solutions/security",
    features: ["Bảo vệ thiết bị & dữ liệu", "Email / Endpoint security", "Giám sát 24/7"],
    Icon: Shield,
    tone: "bg-sky-100 text-sky-800",
  },
  {
    id: "backup",
    title: "Backup & Khôi phục",
    body: "Sao lưu linh hoạt và khôi phục nhanh khi sự cố — mã hóa an toàn cho endpoint đến máy chủ.",
    href: "/solutions/backup",
    features: ["Sao lưu linh hoạt", "Khôi phục một chạm", "Mã hóa an toàn"],
    Icon: HardDrive,
    tone: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "productivity",
    title: "Năng suất & Cộng tác",
    body: "Microsoft 365, Office, Teams và công cụ cộng tác chính hãng — làm việc hiệu quả hơn mỗi ngày.",
    href: "/solutions/productivity",
    features: ["Email & Lịch", "Cộng tác nhóm hiệu quả", "Chia sẻ an toàn"],
    Icon: Sparkles,
    tone: "bg-orange-100 text-orange-800",
  },
  {
    id: "other",
    title: "Giải pháp khác",
    body: "Cloud, hạ tầng và tư vấn triển khai — mở rộng theo nhu cầu vận hành của doanh nghiệp.",
    href: "/business",
    features: ["Cloud & Hạ tầng", "Quản trị hệ thống", "Tư vấn & triển khai"],
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

const WHY_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tư vấn chuyên sâu",
    body: "Chọn đúng gói theo quy mô và ngân sách thực tế.",
    Icon: Users,
  },
  {
    title: "Triển khai nhanh chóng",
    body: "Kích hoạt, giao nhận và hướng dẫn rõ ràng.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ tận tâm",
    body: "Kênh hỗ trợ tiếng Việt trong giờ làm việc.",
    Icon: Headphones,
  },
  {
    title: "Đồng hành dài hạn",
    body: "Gia hạn, tối ưu chi phí và mở rộng cùng bạn.",
    Icon: ShieldCheck,
  },
];

const TESTIMONIALS = [
  {
    id: "tn",
    company: "Trung Nguyên",
    logo: "TN",
    logoTone: "bg-[#1a1a1a] text-[#c4a35a]",
    quote:
      "KEYON giúp chúng tôi mua và quản lý bản quyền tập trung, quy trình rõ ràng hơn nhiều so với mua lẻ trước đây.",
    name: "Nguyễn Minh Tuấn",
    role: "IT Manager",
  },
  {
    id: "tiki",
    company: "Tiki",
    logo: "tiki",
    logoTone: "bg-[#1a94ff] text-white",
    quote:
      "Gói bảo mật và Office được giao nhanh, hỗ trợ kích hoạt kịp thời cho đội ngũ vận hành.",
    name: "Trần Thu Hà",
    role: "Procurement Lead",
  },
  {
    id: "fpt",
    company: "FPT Software",
    logo: "FPT",
    logoTone: "bg-[#f26f21] text-white",
    quote:
      "Chúng tôi dùng KEYON cho volume licensing — báo giá minh bạch, theo dõi gia hạn thuận tiện.",
    name: "Lê Quang Huy",
    role: "Infrastructure Lead",
  },
] as const;

const HERO_FLOATS: {
  label: string;
  Icon: LucideIcon;
  x: string;
  y: string;
  tone: string;
}[] = [
  {
    label: "Bản quyền phần mềm",
    Icon: KeyRound,
    x: "0%",
    y: "8%",
    tone: "text-accent",
  },
  {
    label: "Quản lý bản quyền",
    Icon: LayoutGrid,
    x: "58%",
    y: "0%",
    tone: "text-violet-600",
  },
  {
    label: "Bảo mật & An toàn",
    Icon: Shield,
    x: "68%",
    y: "38%",
    tone: "text-sky-700",
  },
  {
    label: "Backup & Khôi phục",
    Icon: HardDrive,
    x: "52%",
    y: "72%",
    tone: "text-emerald-700",
  },
  {
    label: "Năng suất & Cộng tác",
    Icon: Sparkles,
    x: "2%",
    y: "62%",
    tone: "text-orange-600",
  },
];

export function SolutionsHubLanding() {
  const [quoteIdx, setQuoteIdx] = useState(0);

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_25%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_12%_80%,rgba(14,165,233,0.06),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative py-9 md:py-11 lg:py-14">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-12">
            <div className="min-w-0 max-w-xl">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Giải pháp toàn diện
              </p>
              <h1 className={`mt-3 max-w-[16ch] ${HERO_TITLE_CLASS}`}>
                Giải pháp số cho doanh nghiệp hiện đại
              </h1>
              <p className={`mt-4 max-w-lg ${PAGE_LEAD_CLASS}`}>
                KEYON đồng hành chuyển đổi số với bản quyền, bảo mật, backup, cloud và
                quản lý license — đúng nhu cầu, dễ triển khai, hỗ trợ tiếng Việt.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href="#danh-muc-giai-phap"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá giải pháp →
                </a>
                <Link
                  href="/how-it-works"
                  className={`inline-flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-white px-4 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
                    <Play size={12} fill="currentColor" strokeWidth={0} />
                  </span>
                  <span>Xem video giới thiệu</span>
                  <span className={`${BADGE_CLASS} text-muted`}>02:18</span>
                </Link>
              </div>
            </div>

            <div className="relative w-full min-w-0">
              <SolutionsHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust stats ──────────────────────────────────────── */}
      <section className="border-y border-border bg-[#F4F8FB]">
        <div className="home-container py-6 md:py-7">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {STATS.map((s, i) => (
              <li
                key={s.label}
                className={`flex items-center gap-3.5 lg:px-5 ${
                  i > 0 ? "lg:border-l lg:border-border" : ""
                }`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm ring-1 ring-border/80"
                  aria-hidden
                >
                  <s.Icon {...ICON_MD} />
                </span>
                <div className="min-w-0">
                  <p className={`${STAT_VALUE_CLASS} text-lg sm:text-xl`}>{s.value}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{s.label}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section id="danh-muc-giai-phap" className="scroll-mt-24 py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Danh mục giải pháp</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn đúng hướng giải quyết — từ bản quyền và bảo mật đến cloud, backup và
              quản lý license.
            </p>
          </header>

          <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {SOLUTION_CARDS.map((card) => (
              <li key={card.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-border ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.tone}`}
                    aria-hidden
                  >
                    <card.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-5 ${CARD_TITLE_CLASS} text-[15px]`}>{card.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{card.body}</p>
                  <ul className="mt-5 space-y-2.5">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check size={10} strokeWidth={3} aria-hidden />
                        </span>
                        <span className="text-[13px] leading-snug text-navy">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className={`mt-auto inline-flex items-center gap-1 pt-6 text-[13px] font-semibold text-accent ${TRANSITION_UI} ${HOVER_LINK_ACCENT}`}
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

      {/* ── Why KEYON — full-bleed dark ──────────────────────── */}
      <section className="relative overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 88% 45%, rgba(14,165,164,0.22), transparent 55%), radial-gradient(ellipse 40% 50% at 10% 90%, rgba(14,165,233,0.08), transparent 50%)",
          }}
        />
        <div className="home-container relative py-10 md:py-12 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Chọn KEYON làm đối tác công nghệ của bạn
              </h2>
              <p className={`mt-3 ${SECTION_LEAD_CLASS} !text-white/70`}>
                Từ tư vấn chọn gói đến kích hoạt và hỗ trợ dài hạn — KEYON đồng hành
                doanh nghiệp với quy trình rõ ràng, sản phẩm chính hãng.
              </p>
              <Link
                href="/contact/sales"
                className={`mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Liên hệ tư vấn →
              </Link>
            </div>

            <ul className="space-y-5 sm:space-y-6">
              {WHY_POINTS.map((p) => (
                <li key={p.title} className="flex gap-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
                    aria-hidden
                  >
                    <p.Icon {...ICON_MD} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className={`${CARD_TITLE_CLASS} !text-white`}>{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Khách hàng nói về KEYON</h2>
          </header>

          <div className="mt-9 hidden gap-5 lg:grid lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.id} item={t} />
            ))}
          </div>

          <div className="mt-9 lg:hidden">
            <TestimonialCard item={TESTIMONIALS[quoteIdx]!} />
          </div>

          <div className="mt-7 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Xem đánh giá ${i + 1}`}
                aria-current={i === quoteIdx}
                onClick={() => setQuoteIdx(i)}
                className={`h-2 w-2 rounded-full ${TRANSITION_UI} ${
                  i === quoteIdx ? "w-6 bg-accent" : "bg-border hover:bg-muted lg:bg-border"
                } ${i === quoteIdx ? "" : "lg:opacity-70"}`}
              />
            ))}
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
      className={`flex h-full flex-col rounded-2xl border border-border bg-white p-6 ${ELEVATION_HAIRLINE}`}
    >
      <Quote className="h-8 w-8 text-accent/80" strokeWidth={1.5} aria-hidden />
      <div className="mt-4 flex items-center gap-2.5">
        <span
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[11px] font-bold tracking-wide ${item.logoTone}`}
        >
          {item.logo}
        </span>
        <p className={`${CARD_TITLE_CLASS}`}>{item.company}</p>
      </div>
      <p className={`mt-4 flex-1 ${BODY_MUTED_CLASS}`}>{item.quote}</p>
      <div className="mt-6">
        <p className={CARD_TITLE_CLASS}>{item.name}</p>
        <p className={`mt-0.5 ${CARD_META_CLASS}`}>{item.role}</p>
      </div>
    </article>
  );
}

/** Hero visual — central K hub + 5 white floating solution cards (mockup). */
function SolutionsHeroArt() {
  return (
    <div
      className="solutions-hero-art relative mx-auto aspect-[1.05/1] w-full max-w-[520px] lg:max-w-none"
      role="img"
      aria-label="Hệ sinh thái giải pháp KEYON"
    >
      <div
        className="pointer-events-none absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_center,rgba(14,165,164,0.18),transparent_65%)] blur-2xl"
        aria-hidden
      />

      {/* Circuit lines behind hub */}
      <svg
        className="pointer-events-none absolute inset-[10%] z-[1] opacity-50"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
      >
        <path
          d="M70 110 C120 140 160 170 200 200 M330 80 C280 130 240 170 200 200 M80 300 C130 260 160 230 200 200 M320 310 C270 270 230 230 200 200 M200 50 L200 200 M200 200 L200 350"
          stroke="rgb(14 165 164 / 0.35)"
          strokeWidth="1.25"
          strokeDasharray="3 7"
        />
        <circle cx="70" cy="110" r="3" fill="rgb(14 165 164 / 0.5)" />
        <circle cx="330" cy="80" r="3" fill="rgb(14 165 164 / 0.5)" />
        <circle cx="80" cy="300" r="3" fill="rgb(14 165 164 / 0.5)" />
        <circle cx="320" cy="310" r="3" fill="rgb(14 165 164 / 0.5)" />
      </svg>

      {/* Central K cube */}
      <div
        className={`absolute left-1/2 top-1/2 z-20 flex h-[7.75rem] w-[7.75rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.35rem] bg-navy sm:h-[8.75rem] sm:w-[8.75rem] sm:rounded-[1.5rem] ${ELEVATION_FLOAT}`}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(14,165,164,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,164,0.15) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
          aria-hidden
        />
        <span
          className={`${FONT_DISPLAY} relative text-[2.75rem] font-extrabold tracking-tight text-accent sm:text-[3.25rem]`}
          style={{ textShadow: "0 0 28px rgba(14,165,164,0.45)" }}
        >
          K
        </span>
      </div>

      {/* Floating white cards */}
      {HERO_FLOATS.map((f) => (
        <div
          key={f.label}
          className={`absolute z-10 flex max-w-[11.5rem] items-center gap-2 rounded-xl border border-border/80 bg-white px-2.5 py-2 sm:max-w-[12.5rem] sm:gap-2.5 sm:px-3 sm:py-2.5 ${ELEVATION_FLOAT}`}
          style={{ left: f.x, top: f.y }}
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface ${f.tone}`}
            aria-hidden
          >
            <f.Icon {...ICON_SM} />
          </span>
          <span className="truncate text-[11px] font-semibold leading-tight text-navy sm:text-[12px]">
            {f.label}
          </span>
        </div>
      ))}
    </div>
  );
}
