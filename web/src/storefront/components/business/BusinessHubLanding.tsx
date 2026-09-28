"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
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
import { LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";

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
    body: "Phù hợp khi doanh nghiệp cần nhiều license hoặc triển khai cho nhiều người dùng.",
    href: "/business/volume-licensing",
    cta: "Tìm hiểu thêm",
    features: ["Volume / multi-seat", "Báo giá theo nhu cầu", "Quản lý license tập trung"],
    Icon: ShoppingCart,
    tone: "bg-accent text-white",
  },
  {
    id: "subscriptions",
    title: "Subscription & Gia hạn",
    body: "Mua subscription theo thời hạn, theo dõi ngày hết hạn và chủ động kế hoạch gia hạn.",
    href: "/business/subscriptions",
    cta: "Tìm hiểu thêm",
    features: ["Mua theo thời hạn", "Theo dõi ngày gia hạn", "Hỗ trợ khi cần thay đổi"],
    Icon: RefreshCw,
    tone: "bg-violet-600 text-white",
  },
  {
    id: "contracts",
    title: "Hợp đồng & Đơn hàng",
    body: "Theo dõi đơn hàng, license đã bàn giao và các yêu cầu mua sắm dành cho doanh nghiệp.",
    href: "/business/contracts",
    cta: "Tìm hiểu thêm",
    features: ["Đơn hàng trong Tài khoản", "License đã bàn giao", "PO qua đội kinh doanh"],
    Icon: FileText,
    tone: "bg-orange-600 text-white",
  },
  {
    id: "consulting",
    title: "Tư vấn bản quyền",
    body: "Chưa biết nên chọn license nào? KEYON hỗ trợ xác định nhu cầu và phương án phù hợp.",
    href: "/business/licensing-consulting",
    cta: "Tìm hiểu thêm",
    features: ["Tư vấn chọn gói", "So sánh hình thức license", "Phân tích theo quy mô"],
    Icon: MessageCircle,
    tone: "bg-sky-600 text-white",
  },
  {
    id: "implementation",
    title: "Dịch vụ triển khai",
    body: "Hỗ trợ triển khai và bàn giao license theo quy mô, checklist kỹ thuật hoặc yêu cầu của doanh nghiệp.",
    href: "/business/implementation",
    cta: "Tìm hiểu thêm",
    features: ["Onboarding sau mua", "Checklist triển khai", "Hỗ trợ phối hợp IT"],
    Icon: Rocket,
    tone: "bg-navy text-white",
  },
  {
    id: "sales",
    title: "Liên hệ kinh doanh",
    body: "Trao đổi trực tiếp với đội kinh doanh khi doanh nghiệp cần báo giá hoặc phương án riêng.",
    href: "/contact/quote",
    cta: "Liên hệ ngay",
    features: ["Tư vấn B2B", "Báo giá theo nhu cầu", "Hỗ trợ hồ sơ mua"],
    Icon: Headphones,
    tone: "bg-emerald-600 text-white",
  },
];

const HERO_TRUST = [
  {
    title: "Bản quyền rõ ràng",
    body: "Nguồn cung và loại license được xác định trước khi mua.",
    Icon: BadgeCheck,
  },
  {
    title: "Bàn giao đầy đủ",
    body: "Nhận key, tài khoản hoặc thông tin license theo từng sản phẩm.",
    Icon: Rocket,
  },
  {
    title: "Theo đúng quy mô",
    body: "Tư vấn gói phù hợp với số lượng người dùng và nhu cầu thực tế.",
    Icon: Wallet,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hướng dẫn kích hoạt, gia hạn và xử lý các vấn đề liên quan đến license.",
    Icon: Headphones,
  },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tuân thủ bản quyền",
    body: "Xác định đúng loại license, số lượng và điều kiện sử dụng trước khi mua.",
    Icon: ShoppingCart,
  },
  {
    title: "Chọn đúng quy mô",
    body: "Tư vấn số lượng và hình thức license phù hợp, hạn chế mua dư hoặc sai nhu cầu.",
    Icon: Wallet,
  },
  {
    title: "Quản lý tập trung",
    body: "Theo dõi license, đơn hàng và thông tin mua hàng trong Tài khoản KEYON.",
    Icon: LayoutGrid,
  },
  {
    title: "Hỗ trợ sau mua",
    body: "Hỗ trợ kích hoạt, gia hạn và các vấn đề liên quan đến license theo từng sản phẩm.",
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
    body: "Đề xuất sản phẩm và hình thức license phù hợp với nhu cầu.",
    Icon: MessageCircle,
  },
  {
    title: "Báo giá & chốt",
    body: "Báo giá minh bạch, điều khoản rõ ràng trước khi mua.",
    Icon: FileText,
  },
  {
    title: "Bàn giao",
    body: "Cấp license, hướng dẫn kích hoạt và bàn giao thông tin cần thiết.",
    Icon: Rocket,
  },
  {
    title: "Gia hạn & hỗ trợ",
    body: "Nhắc hạn, hỗ trợ gia hạn và xử lý các vấn đề phát sinh khi cần.",
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
      <section className={`relative overflow-x-clip bg-[#071a2b] text-white ${LANDING_HERO_PAD}`}>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_30%,rgba(14,165,164,0.28),transparent_42%),radial-gradient(ellipse_at_12%_80%,rgba(14,165,233,0.1),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] md:gap-10 lg:gap-12">
            <div className="min-w-0 w-full max-w-[540px]">
              <h1 className={`${HERO_TITLE_CLASS} !text-white`}>
                <span className="block">Giải pháp</span>
                <span className="block bg-gradient-to-r from-accent to-teal-100 bg-clip-text text-transparent">
                  bản quyền phần mềm
                </span>
                <span className="block">cho doanh nghiệp</span>
              </h1>
              <p className={`mt-4 max-w-[520px] ${PAGE_LEAD_CLASS} !text-slate-300`}>
                KEYON hỗ trợ doanh nghiệp mua, bàn giao, quản lý và gia hạn bản quyền phần mềm
                theo quy mô sử dụng — từ nhóm nhỏ đến tổ chức nhiều người dùng.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Gửi yêu cầu tư vấn →
                </Link>
                <Link
                  href="/contact"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-white/30 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Trao đổi với KEYON
                </Link>
              </div>
            </div>

            <div className="relative flex w-full min-w-0 justify-center md:justify-start">
              <BusinessHeroArt />
            </div>
          </div>

          {/* Trust strip inside hero */}
          <ul className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
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
      <section className="bg-[#F4F8FB] home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp cần hỗ trợ gì?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn nhu cầu phù hợp để xem thông tin chi tiết, nhận tư vấn hoặc gửi yêu cầu báo
              giá đến KEYON.
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
      <section className="relative overflow-hidden bg-navy home-section">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 42% 70% at 92% 50%, rgba(14,165,164,0.28), transparent 55%), radial-gradient(ellipse 35% 45% at 8% 85%, rgba(14,165,233,0.08), transparent 50%)",
          }}
        />
        <div className="home-container relative">
          <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>KEYON đồng hành cùng doanh nghiệp</h2>
          <p className={`mt-2.5 max-w-2xl ${SECTION_LEAD_CLASS} !text-slate-300`}>
            Từ lựa chọn license đến bàn giao và quản lý sau mua, mọi bước đều được thiết kế rõ
            ràng.
          </p>

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
      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình làm việc</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ tiếp nhận nhu cầu đến bàn giao và hỗ trợ sau mua — rõ ràng trong từng bước.
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
      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-gradient-to-br from-accent-soft via-[#E6FFFB] to-sky-50 px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp cần tư vấn bản quyền?</h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
                Gửi nhu cầu sử dụng và quy mô người dùng. KEYON sẽ tư vấn phương án phù hợp và
                báo giá theo nhu cầu.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/contact/quote"
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Gửi yêu cầu tư vấn →
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
        className="relative h-full w-full"
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
