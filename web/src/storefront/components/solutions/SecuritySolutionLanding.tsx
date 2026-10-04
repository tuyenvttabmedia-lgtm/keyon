import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  ChevronRight,
  Cloud,
  CreditCard,
  Fingerprint,
  Headphones,
  KeyRound,
  Lock,
  Mail,
  Monitor,
  Network,
  Rocket,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { LANDING_CRUMB_GAP } from "@/storefront/components/marketing/hero-shell";
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
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
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

export type SecurityBrand =
  | "bitdefender"
  | "kaspersky"
  | "eset"
  | "symantec"
  | "acronis"
  | "generic";

export type SecurityFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  brandLabel: string;
  meta: string;
  priceLabel: string;
  priceHint?: string;
  imageUrl?: string;
  features: string[];
  brand: SecurityBrand;
};

type Props = {
  featured: SecurityFeaturedProduct[];
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Gói bảo mật trên catalog",
    body: "Sản phẩm bảo mật cho thiết bị, email, dữ liệu, danh tính và mạng.",
    Icon: ShieldCheck,
  },
  {
    title: "Thông tin theo từng vendor",
    body: "Thông tin license, tính năng và điều kiện sử dụng được trình bày theo từng sản phẩm.",
    Icon: Zap,
  },
  {
    title: "Mua & kích hoạt trên KEYON",
    body: "Nhận license rõ ràng sau thanh toán — hỗ trợ tiếng Việt.",
    Icon: Rocket,
  },
];

const TRUST_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "License chính hãng",
    body: "Nguồn cung rõ ràng — đúng loại license trước khi mua.",
    Icon: BadgeCheck,
  },
  {
    title: "Tính năng theo gói",
    body: "Biết rõ tính năng, thiết bị và phạm vi sử dụng của từng SKU.",
    Icon: Shield,
  },
  {
    title: "Bàn giao trên KEYON",
    body: "Nhận thông tin license sau thanh toán — hỗ trợ tiếng Việt.",
    Icon: Monitor,
  },
  {
    title: "Chọn theo nhu cầu",
    body: "Từ cá nhân đến doanh nghiệp — chọn sản phẩm phù hợp.",
    Icon: Lock,
  },
];

const PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bảo vệ thiết bị",
    body: "License endpoint và bảo vệ thiết bị — tính năng theo từng sản phẩm.",
    Icon: Monitor,
  },
  {
    title: "Bảo vệ email",
    body: "License chống phishing, spam và thư độc hại — phạm vi theo từng gói.",
    Icon: Mail,
  },
  {
    title: "Bảo vệ dữ liệu",
    body: "Tính năng bảo vệ dữ liệu tùy theo sản phẩm và gói license.",
    Icon: Cloud,
  },
  {
    title: "Bảo vệ danh tính",
    body: "Xác thực và kiểm soát tài khoản tùy theo sản phẩm. KEYON không vận hành hệ thống danh tính thuê ngoài.",
    Icon: Fingerprint,
  },
  {
    title: "Bảo vệ mạng",
    body: "Tường lửa và lọc web tùy theo sản phẩm — không phải dịch vụ giám sát mạng thuê ngoài.",
    Icon: Network,
  },
];

const WHY: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "License chính hãng",
    body: "Nguồn cung rõ ràng — đúng loại license trước khi mua.",
    Icon: ShieldCheck,
  },
  {
    title: "Thông tin rõ ràng",
    body: "Biết trước thời hạn, số thiết bị và phạm vi sử dụng của từng gói.",
    Icon: BadgeCheck,
  },
  {
    title: "Nhận nhanh",
    body: "Nhận license sau thanh toán — kích hoạt theo hướng dẫn.",
    Icon: Rocket,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Tư vấn chọn gói và hỗ trợ sau mua trên KEYON.",
    Icon: Headphones,
  },
];

const STEPS: { n: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "1",
    title: "Chọn giải pháp",
    body: "Chọn gói bảo mật phù hợp với thiết bị và nhu cầu.",
    Icon: ShoppingCart,
  },
  {
    n: "2",
    title: "Thanh toán",
    body: "Thanh toán an toàn qua các phương thức được hỗ trợ.",
    Icon: CreditCard,
  },
  {
    n: "3",
    title: "Nhận license",
    body: "Nhận key, tài khoản hoặc thông tin license trong Tài khoản KEYON.",
    Icon: KeyRound,
  },
  {
    n: "4",
    title: "Kích hoạt & sử dụng",
    body: "Cài đặt, kích hoạt và bắt đầu sử dụng theo hướng dẫn.",
    Icon: ShieldCheck,
  },
];

export function SecuritySolutionLanding({ featured }: Props) {
  const products = featured.slice(0, 4);
  const showFeatured = products.length > 0;

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.06),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative pb-5 pt-5 md:pb-4 md:pt-5 lg:pb-6 lg:pt-8">
          <nav className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Bảo mật</span>
          </nav>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10">
            <div className="min-w-0">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>
                Giải pháp bảo mật cho doanh nghiệp
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Khám phá các sản phẩm và license bảo mật cho thiết bị, email, dữ liệu, danh tính
                và mạng trên KEYON, với thông tin rõ ràng và hỗ trợ tiếng Việt.
              </p>

              <ul className="mt-6 space-y-3.5">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <div>
                      <p className={CARD_TITLE_CLASS}>{p.title}</p>
                      <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/categories/security"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Xem sản phẩm bảo mật →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Gửi yêu cầu tư vấn
                </Link>
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-[460px] lg:block lg:max-w-none">
              <SecurityHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust points ─────────────────────────────────────── */}
      <section className="bg-navy">
        <div className="home-container home-section">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {TRUST_POINTS.map((s) => (
              <li key={s.title} className="flex items-start gap-3.5">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/40 text-accent"
                  aria-hidden
                >
                  <s.Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className={`${CARD_TITLE_CLASS} text-white`}>{s.title}</p>
                  <p className="mt-0.5 text-sm text-slate-300">{s.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Protection pillars ───────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Các lớp bảo mật trên KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Khám phá các nhóm sản phẩm bảo mật theo nhu cầu bảo vệ thiết bị, dữ liệu, danh
              tính và hệ thống.
            </p>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-5 lg:gap-3.5">
            {PILLARS.map((p, i) => (
              <li
                key={p.title}
                className={i === PILLARS.length - 1 ? "col-span-2 lg:col-span-1" : undefined}
              >
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-3 sm:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <p.Icon size={18} strokeWidth={1.75} />
                    </span>
                    <h3 className={`min-w-0 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  </div>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      {showFeatured ? (
      <section className="home-section">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp bảo mật phù hợp với bạn</h2>
            <Link href="/categories/security" className={`hidden shrink-0 lg:inline ${LINK_ACCENT_CLASS}`}>
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="relative pr-0 lg:pr-12">
            <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4 lg:gap-3">
              {products.map((p) => (
                <li
                  key={p.id}
                  className={`flex min-h-0 min-w-0 ${products.length % 2 === 1 ? "last:col-span-2 lg:last:col-span-1" : ""}`}
                >
                  <article
                    className={`flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-white sm:rounded-2xl ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <Link href={p.href} className="relative block aspect-[5/4] bg-white">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          className="object-contain p-1.5"
                          sizes="(max-width: 1024px) 45vw, 220px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center" aria-hidden>
                          <SecurityBrandMark brand={p.brand} size={40} />
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3.5 sm:pb-3.5 sm:pt-2.5">
                      <p className={`${BADGE_CLASS} font-semibold text-muted`}>{p.brandLabel}</p>
                      <h3 className={`mt-0.5 line-clamp-2 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                      <p className={`mt-1.5 ${CARD_PRICE_CLASS}`}>{p.priceLabel}</p>
                      {p.priceHint ? (
                        <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                      ) : null}
                      <Link
                        href={p.href}
                        className={`mt-auto inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent px-2 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                      >
                        Mua ngay →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            <Link
              href="/categories/security"
              className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-4 lg:hidden ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
            >
              Xem tất cả sản phẩm
            </Link>
            <Link
              href="/categories/security"
              className={`absolute -right-0.5 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-navy lg:flex ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              aria-label="Xem thêm sản phẩm"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {/* ── Why KEYON ────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-8 sm:px-8 sm:py-9 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(14,165,164,0.18),transparent_45%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.1),transparent_40%)]"
              aria-hidden
            />
            <div className="relative">
              <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                Vì sao chọn giải pháp bảo mật từ KEYON?
              </h2>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-slate-300">
                KEYON giúp bạn chọn đúng gói, nhận đúng loại license và quản lý trong Tài khoản sau khi mua.
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {WHY.map((w) => (
                  <li
                    key={w.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3"
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent"
                      aria-hidden
                    >
                      <w.Icon size={18} strokeWidth={1.85} />
                    </span>
                    <div className="min-w-0">
                      <p className={`${CARD_TITLE_CLASS} text-white`}>{w.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-slate-300">{w.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 steps ──────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>4 bước mua và kích hoạt gói bảo mật</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ chọn gói đến kích hoạt — mỗi bước có thông tin rõ trên KEYON.
            </p>
          </header>
          <div className="relative mt-6 lg:mt-8">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-8 z-0 hidden border-t border-dashed border-accent/40 lg:block"
              aria-hidden
            />
            <ol className="relative z-[1] grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className={`relative z-[1] flex items-start gap-3.5 rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-lg font-bold text-white">
                  {s.n}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <s.Icon size={16} strokeWidth={1.85} className="shrink-0 text-accent" aria-hidden />
                    <p className={CARD_TITLE_CLASS}>{s.title}</p>
                  </div>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{s.body}</p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </div>
      </section>

      <SolutionFinalCta
        title="Chưa biết chọn gói bảo mật nào?"
        subtitle="KEYON hỗ trợ bạn xác định sản phẩm phù hợp theo thiết bị, số lượng người dùng và nhu cầu bảo vệ."
        primaryHref="/contact/quote"
        primaryLabel="Gửi yêu cầu tư vấn →"
        secondaryHref="/categories/security"
        secondaryLabel="Xem sản phẩm bảo mật"
      />
    </div>
  );
}

function SecurityHeroArt() {
  const floats: { Icon: LucideIcon; className: string }[] = [
    { Icon: Lock, className: "left-[6%] top-[18%]" },
    { Icon: Mail, className: "right-[8%] top-[14%]" },
    { Icon: Fingerprint, className: "left-[2%] bottom-[28%]" },
    { Icon: Shield, className: "right-[4%] bottom-[24%]" },
  ];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[420px]">
      <div
        className="pointer-events-none absolute inset-[18%] rounded-full bg-accent/15 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[8%] rounded-full border border-accent/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[18%] rounded-full border border-dashed border-accent/30"
        aria-hidden
      />

      {floats.map(({ Icon, className }) => (
        <span
          key={className}
          className={`absolute z-20 flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-white text-accent ${className} ${ELEVATION_FLOAT}`}
          aria-hidden
        >
          <Icon size={18} strokeWidth={1.85} />
        </span>
      ))}

      {/* Shield with K */}
      <div className="absolute inset-[22%] z-10 flex items-center justify-center">
        <div
          className="relative flex h-full w-full max-h-[280px] max-w-[240px] items-center justify-center"
          style={{ filter: "drop-shadow(0 18px 40px rgba(14,165,164,0.35))" }}
        >
          <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="secShield" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#e2e8f0" />
                <stop offset="45%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="secGlow" x1="0.5" y1="0" x2="0.5" y2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <ellipse cx="100" cy="220" rx="70" ry="10" fill="#0ea5a4" opacity="0.35" />
            <path
              d="M100 12 28 42v58c0 52 34 98 72 112 38-14 72-60 72-112V42L100 12Z"
              fill="url(#secShield)"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <path
              d="M100 28 48 50v46c0 42 27 80 52 92 25-12 52-50 52-92V50L100 28Z"
              fill="url(#secGlow)"
              opacity="0.25"
            />
            <circle cx="100" cy="108" r="36" fill="#0b1f33" />
            <text
              x="100"
              y="122"
              textAnchor="middle"
              fontFamily="var(--font-display), system-ui, sans-serif"
              fontSize="36"
              fontWeight="800"
              fill="#5eead4"
            >
              K
            </text>
          </svg>
        </div>
      </div>

      {/* Platform glow */}
      <div
        className="absolute bottom-[8%] left-1/2 h-8 w-[55%] -translate-x-1/2 rounded-[100%] bg-accent/40 blur-md"
        aria-hidden
      />
    </div>
  );
}

function SecurityBrandMark({ brand, size = 36 }: { brand: SecurityBrand; size?: number }) {
  const label =
    brand === "bitdefender"
      ? "BD"
      : brand === "kaspersky"
        ? "KS"
        : brand === "eset"
          ? "ES"
          : brand === "symantec"
            ? "NT"
            : brand === "acronis"
              ? "AC"
              : "SEC";
  const tone =
    brand === "bitdefender"
      ? "bg-[#E31C23] text-white"
      : brand === "kaspersky"
        ? "bg-[#006D5B] text-white"
        : brand === "eset"
          ? "bg-[#00843D] text-white"
          : brand === "symantec"
            ? "bg-[#FFC72C] text-navy"
            : brand === "acronis"
              ? "bg-[#1A73E8] text-white"
              : "bg-accent-soft text-accent";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-display text-xs font-bold ${tone}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {label}
    </span>
  );
}
