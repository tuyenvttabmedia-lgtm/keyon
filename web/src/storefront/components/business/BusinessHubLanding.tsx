"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BadgePercent,
  Check,
  ClipboardList,
  FileText,
  Headphones,
  LayoutGrid,
  MessageCircle,
  RefreshCw,
  Rocket,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  FONT_DISPLAY,
  HERO_TITLE_CLASS,
  LINK_FIELD_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_FLOAT_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

const ICON_MD = { size: 22, strokeWidth: 1.75 } as const;
const ICON_SM = { size: 16, strokeWidth: 1.85 } as const;

type BizCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  features: string[];
  Icon: LucideIcon;
  tone: string;
};

const BIZ_CARDS: BizCard[] = [
  {
    id: "volume",
    title: "Mua bản quyền số lượng lớn",
    body: "Phù hợp đội nhóm và doanh nghiệp — báo giá theo quy mô, triển khai tập trung.",
    href: "/business/volume-licensing",
    cta: "Tìm hiểu thêm",
    features: ["Volume / multi-seat", "Báo giá theo nhu cầu", "Gắn quản lý trên KEYON"],
    Icon: ShoppingCart,
    tone: "bg-accent text-white",
  },
  {
    id: "subscriptions",
    title: "Subscription & Gia hạn",
    body: "Theo dõi chu kỳ subscription DN, nhắc gia hạn và hỗ trợ renew theo hợp đồng.",
    href: "/business/subscriptions",
    cta: "Tìm hiểu thêm",
    features: ["Theo dõi chu kỳ", "Nhắc gia hạn", "Hỗ trợ renew managed"],
    Icon: RefreshCw,
    tone: "bg-violet-600 text-white",
  },
  {
    id: "contracts",
    title: "Hợp đồng & đơn hàng",
    body: "Xem đơn và license tổ chức sau đăng nhập. PO / gia hạn qua đội kinh doanh.",
    href: "/business/contracts",
    cta: "Tìm hiểu thêm",
    features: ["Đơn trên Tài khoản", "Chưa phải cổng HĐ pháp lý", "Liên hệ khi cần PO"],
    Icon: FileText,
    tone: "bg-orange-600 text-white",
  },
  {
    id: "consulting",
    title: "Tư vấn bản quyền",
    body: "Chưa chắc chọn gói nào? KEYON tư vấn trước khi mua — đúng nhu cầu, đúng ngân sách.",
    href: "/business/licensing-consulting",
    cta: "Tìm hiểu thêm",
    features: ["Tư vấn chọn gói", "Perpetual vs subscription", "Đề xuất theo quy mô"],
    Icon: MessageCircle,
    tone: "bg-sky-600 text-white",
  },
  {
    id: "implementation",
    title: "Dịch vụ triển khai",
    body: "Bàn giao và kích hoạt bản quyền theo quy mô — không giả catalog MSP cloud.",
    href: "/business/implementation",
    cta: "Tìm hiểu thêm",
    features: ["Onboarding sau mua", "Checklist cho IT", "Form loại triển khai"],
    Icon: Rocket,
    tone: "bg-navy text-white",
  },
  {
    id: "sales",
    title: "Liên hệ kinh doanh",
    body: "Đội ngũ B2B sẵn sàng tư vấn, báo giá và đồng hành triển khai dài hạn.",
    href: "/contact/quote",
    cta: "Liên hệ ngay",
    features: ["Tư vấn B2B", "Báo giá nhanh", "Đồng hành dài hạn"],
    Icon: Headphones,
    tone: "bg-emerald-600 text-white",
  },
];

const HERO_TRUST = [
  {
    title: "Đối tác chính hãng",
    body: "100% bản quyền hợp pháp",
    Icon: BadgeCheck,
  },
  {
    title: "Triển khai nhanh",
    body: "Kích hoạt & giao nhận rõ ràng",
    Icon: Rocket,
  },
  {
    title: "Tối ưu chi phí",
    body: "Đúng gói, đúng quy mô",
    Icon: Wallet,
  },
  {
    title: "Hỗ trợ chuyên sâu",
    body: "Đội ngũ tiếng Việt",
    Icon: Headphones,
  },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tuân thủ bản quyền",
    body: "Đảm bảo 100% bản quyền hợp pháp, an tâm sử dụng lâu dài.",
    Icon: ShoppingCart,
  },
  {
    title: "Tối ưu chi phí",
    body: "Chọn đúng gói theo quy mô, tránh mua thừa.",
    Icon: BadgePercent,
  },
  {
    title: "Quản lý dễ dàng",
    body: "Tập trung, minh bạch và kiểm soát mọi license.",
    Icon: LayoutGrid,
  },
  {
    title: "Hỗ trợ chuyên sâu",
    body: "Đội ngũ kỹ thuật & kinh doanh hỗ trợ tiếng Việt.",
    Icon: Headphones,
  },
];

const PROCESS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận nhu cầu",
    body: "Thu thập yêu cầu, quy mô người dùng và ngân sách dự kiến.",
    Icon: ClipboardList,
  },
  {
    title: "Tư vấn giải pháp",
    body: "Đề xuất gói phù hợp — volume, subscription hoặc kết hợp.",
    Icon: MessageCircle,
  },
  {
    title: "Báo giá & chốt",
    body: "Báo giá minh bạch, điều khoản rõ ràng trước khi triển khai.",
    Icon: FileText,
  },
  {
    title: "Triển khai",
    body: "Cấp license, kích hoạt và hướng dẫn vận hành cho đội IT.",
    Icon: Rocket,
  },
  {
    title: "Đồng hành",
    body: "Gia hạn, hỗ trợ và tối ưu chi phí theo chu kỳ sử dụng.",
    Icon: Headphones,
  },
];

const HERO_FLOATS: {
  id: string;
  label: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    id: "top",
    label: "Bản quyền số lượng lớn",
    Icon: ShoppingCart,
    tone: "text-accent",
  },
  {
    id: "tr",
    label: "Subscription & Gia hạn",
    Icon: RefreshCw,
    tone: "text-violet-600",
  },
  {
    id: "mr",
    label: "Tư vấn bản quyền",
    Icon: MessageCircle,
    tone: "text-sky-700",
  },
  {
    id: "bc",
    label: "Quản lý bản quyền",
    Icon: LayoutGrid,
    tone: "text-orange-600",
  },
  {
    id: "ml",
    label: "Liên hệ kinh doanh",
    Icon: Headphones,
    tone: "text-emerald-700",
  },
];

export function BusinessHubLanding() {
  return (
    <div className="bg-white">
      {/* ── Hero (dark) ──────────────────────────────────────── */}
      <section className="relative overflow-x-clip bg-[#071a2b] text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_30%,rgba(14,165,164,0.28),transparent_42%),radial-gradient(ellipse_at_12%_80%,rgba(14,165,233,0.1),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative pt-9 md:pt-10 lg:pt-12">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] md:gap-10 lg:gap-12">
            <div className="min-w-0 w-full max-w-[540px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Doanh nghiệp
              </p>
              <h1
                className={`mt-3 max-w-[18ch] ${HERO_TITLE_CLASS} !text-white`}
              >
                Nền tảng bản quyền dành cho{" "}
                <span className="bg-gradient-to-r from-accent to-teal-100 bg-clip-text text-transparent">
                  doanh nghiệp
                </span>{" "}
                hiện đại
              </h1>
              <p className={`mt-4 max-w-[520px] ${PAGE_LEAD_CLASS} !text-slate-300`}>
                Licensing linh hoạt, subscription và tối ưu chi phí — KEYON đồng hành
                tổ chức mua, triển khai và quản lý bản quyền trên một nền tảng.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Tư vấn giải pháp →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Liên hệ kinh doanh
                </Link>
              </div>
            </div>

            <div className="relative flex w-full min-w-0 justify-center md:justify-start">
              <BusinessHeroArt />
            </div>
          </div>

          {/* Trust strip inside hero */}
          <ul className="mt-10 grid gap-5 border-t border-white/10 py-7 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-4 lg:py-8">
            {HERO_TRUST.map((t) => (
              <li key={t.title} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"
                  aria-hidden
                >
                  <t.Icon {...ICON_SM} />
                </span>
                <div className="min-w-0">
                  <p className={`${CARD_TITLE_CLASS} !text-white`}>{t.title}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS} !text-slate-400`}>{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Buying motions ───────────────────────────────────── */}
      <section className="bg-[#F4F8FB] py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Mua, gia hạn, triển khai & đơn DN</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Cách tổ chức mua và làm việc với KEYON — khác với giải pháp theo
              nhu cầu ở menu Giải pháp.
            </p>
          </header>

          <ul className="mt-9 grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 lg:gap-3.5">
            {BIZ_CARDS.map((card) => (
              <li key={card.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${card.tone}`}
                    aria-hidden
                  >
                    <card.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 text-center ${CARD_TITLE_CLASS}`}>
                    {card.title}
                  </h3>
                  <p className={`mt-2 text-center ${BODY_MUTED_CLASS}`}>{card.body}</p>
                  <ul className="mt-4 space-y-2">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                          <Check size={10} strokeWidth={3} aria-hidden />
                        </span>
                        <span className={`${BODY_CLASS} leading-snug`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={card.href}
                    className={`mt-auto inline-flex items-center justify-center gap-1 pt-5 ${LINK_FIELD_CLASS} ${TRANSITION_UI} ${HOVER_LINK_ACCENT}`}
                  >
                    {card.cta}
                    <span aria-hidden>→</span>
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Benefits + shield ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 42% 70% at 92% 50%, rgba(14,165,164,0.28), transparent 55%), radial-gradient(ellipse 35% 45% at 8% 85%, rgba(14,165,233,0.08), transparent 50%)",
          }}
        />
        <div className="home-container relative py-8 md:py-9 lg:py-10">
          <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>KEYON giúp doanh nghiệp</h2>

          <div className="mt-5 grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(180px,0.26fr)] lg:gap-10 xl:gap-12">
            <ul className="grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2 sm:gap-y-9 lg:gap-x-10 lg:gap-y-10">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-3.5">
                  <span
                    className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/45 text-accent"
                    aria-hidden
                  >
                    <b.Icon size={20} strokeWidth={1.7} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <h3 className={`${CARD_TITLE_CLASS} !text-white`}>{b.title}</h3>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS} !text-slate-300`}>{b.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative mx-auto w-full max-w-[200px] lg:mx-0 lg:max-w-[220px]">
              <BusinessShieldArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình làm việc</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước rõ ràng — từ tiếp nhận nhu cầu đến đồng hành dài hạn.
            </p>
          </header>

          <div className="relative mt-10">
            <div
              className="pointer-events-none absolute left-[10%] right-[10%] top-[1.85rem] z-0 hidden h-px border-t border-dashed border-border lg:block"
              aria-hidden
            />
            <ol className="relative z-[1] grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {PROCESS.map((step, i) => {
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={step.title} className="flex flex-col items-center text-center">
                    <span className={`${BADGE_CLASS} mb-2 font-semibold text-muted`}>{n}</span>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/40 bg-white text-accent ${ELEVATION_HAIRLINE} ${TRANSITION_UI}`}
                      aria-hidden
                    >
                      <step.Icon {...ICON_MD} />
                    </span>
                    <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                    <p className={`mt-1.5 max-w-[16rem] ${BODY_MUTED_CLASS}`}>{step.body}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-10 pt-2 md:pb-12 md:pt-2 lg:pb-14">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-gradient-to-br from-accent-soft via-[#E6FFFB] to-sky-50 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={SECTION_TITLE_CLASS}>Sẵn sàng bắt đầu?</h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
                Nhận tư vấn miễn phí về bản quyền, subscription và quản lý license cho doanh
                nghiệp của bạn.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact/quote"
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Tư vấn miễn phí →
              </Link>
              <Link
                href="/contact"
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-accent/40 bg-white px-5 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft`}
              >
                Liên hệ KEYON
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BusinessShieldArt() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[200px] lg:max-w-[220px]">
      <span
        className="pointer-events-none absolute inset-[8%] rounded-full bg-accent/30 blur-2xl"
        aria-hidden
      />
      <svg
        viewBox="0 0 200 250"
        className="relative h-full w-full drop-shadow-[0_20px_48px_rgba(14,165,164,0.35)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="bizShieldGlass" x1="0.15" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#99f6e4" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#2dd4bf" stopOpacity="0.85" />
            <stop offset="70%" stopColor="#0d9488" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#115e59" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="bizShieldShine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="bizPedestal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0b1f33" stopOpacity="0.35" />
          </linearGradient>
          <filter id="bizShieldGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Pedestal rings */}
        <ellipse cx="100" cy="228" rx="62" ry="9" fill="#0ea5a4" opacity="0.2" />
        <ellipse
          cx="100"
          cy="222"
          rx="48"
          ry="7"
          fill="none"
          stroke="#5eead4"
          strokeWidth="1.5"
          opacity="0.55"
        />
        <ellipse
          cx="100"
          cy="216"
          rx="34"
          ry="5"
          fill="none"
          stroke="#99f6e4"
          strokeWidth="1.2"
          opacity="0.45"
        />
        <path
          d="M72 208h56l10 10H62l10-10Z"
          fill="url(#bizPedestal)"
          stroke="rgba(94,234,212,0.4)"
          strokeWidth="1"
        />

        {/* Shield body */}
        <g filter="url(#bizShieldGlow)">
          <path
            d="M100 22 36 52v54c0 48 32 88 64 102 32-14 64-54 64-102V52L100 22Z"
            fill="url(#bizShieldGlass)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2.5"
          />
          <path
            d="M100 38 52 62v42c0 38 26 70 48 82 22-12 48-44 48-82V62L100 38Z"
            fill="url(#bizShieldShine)"
          />
        </g>

        {/* Checkmark */}
        <path
          d="M74 112l18 18 34-40"
          fill="none"
          stroke="#ecfeff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.95"
        />
        <path
          d="M74 112l18 18 34-40"
          fill="none"
          stroke="#5eead4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Dark hero visual — building + K hub + 5 float cards. */
function BusinessHeroArt() {
  return (
    <div
      className="business-hero-visual group/hub"
      role="img"
      aria-label="Hệ sinh thái giải pháp doanh nghiệp KEYON"
    >
      <div className="business-hero-skyline" aria-hidden>
        <svg viewBox="0 0 560 400" className="h-full w-full" fill="none">
          <defs>
            <linearGradient id="bizBldg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a3a55" />
              <stop offset="100%" stopColor="#0a1624" />
            </linearGradient>
            <linearGradient id="bizGlowWin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5eead4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {/* Far buildings */}
          <rect x="40" y="160" width="70" height="200" rx="2" fill="#0d2236" />
          <rect x="120" y="120" width="90" height="240" rx="2" fill="url(#bizBldg)" />
          <rect x="220" y="90" width="120" height="270" rx="3" fill="url(#bizBldg)" />
          <rect x="350" y="130" width="100" height="230" rx="2" fill="#0d2236" />
          <rect x="460" y="170" width="70" height="190" rx="2" fill="#0a1c2e" />
          {/* Windows */}
          {Array.from({ length: 40 }, (_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            return (
              <rect
                key={`w-${i}`}
                x={236 + col * 20}
                y={110 + row * 28}
                width={10}
                height={14}
                rx={1}
                fill={
                  (row + col) % 3 === 0
                    ? "url(#bizGlowWin)"
                    : "rgba(148,163,184,0.18)"
                }
              />
            );
          })}
          {Array.from({ length: 18 }, (_, i) => {
            const row = Math.floor(i / 3);
            const col = i % 3;
            return (
              <rect
                key={`w2-${i}`}
                x={136 + col * 22}
                y={140 + row * 30}
                width={10}
                height={14}
                rx={1}
                fill={
                  (row + col) % 2 === 0
                    ? "rgba(94,234,212,0.45)"
                    : "rgba(148,163,184,0.15)"
                }
              />
            );
          })}
          <ellipse cx="280" cy="380" rx="160" ry="14" fill="#0ea5a4" opacity="0.12" />
        </svg>
      </div>

      <div className="business-hero-glow" aria-hidden />

      <svg className="business-hero-mesh" viewBox="0 0 560 400" fill="none" aria-hidden>
        <path
          d="M280 70 L280 200 M160 140 L280 200 M400 120 L280 200 M120 230 L280 200 M440 240 L280 200 M280 200 L280 320"
          stroke="#14BBA6"
          strokeOpacity="0.2"
          strokeWidth="1.2"
        />
        <path
          d="M170 100 C210 140 250 170 280 200 M410 90 C360 130 310 170 280 200 M130 250 C180 230 230 210 280 200 M430 260 C380 235 320 215 280 200"
          stroke="#14BBA6"
          strokeOpacity="0.14"
          strokeWidth="1"
          strokeDasharray="4 7"
        />
      </svg>

      <div className={`business-hero-k ${ELEVATION_FLOAT}`}>
        <div className="business-hero-k-grid" aria-hidden />
        <span className={`business-hero-k-letter ${FONT_DISPLAY}`}>K</span>
      </div>

      <div className="business-hero-cards-desktop">
        {HERO_FLOATS.map((f) => (
          <div
            key={f.id}
            className={`business-hero-card business-hero-card--${f.id} ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER} hover:border-accent/40`}
          >
            <span className={`business-hero-card-icon ${f.tone}`} aria-hidden>
              <f.Icon {...ICON_SM} />
            </span>
            <span className="business-hero-card-label">{f.label}</span>
          </div>
        ))}
      </div>

      <ul className="business-hero-cards-mobile">
        {HERO_FLOATS.map((f) => (
          <li
            key={f.id}
            className={`business-hero-card ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_FLOAT_HOVER} hover:border-accent/40`}
          >
            <span className={`business-hero-card-icon ${f.tone}`} aria-hidden>
              <f.Icon {...ICON_SM} />
            </span>
            <span className="business-hero-card-label">{f.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
