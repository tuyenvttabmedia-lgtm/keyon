"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  FileText,
  Headphones,
  Infinity,
  KeyRound,
  Package,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Users,
  User,
  Zap,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_PRICE_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
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
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SolutionFinalCta } from "./SolutionFinalCta";

export type LicensingBrand =
  | "windows"
  | "office"
  | "m365"
  | "adobe"
  | "autodesk"
  | "generic";

export type LicensingFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  meta: string;
  priceLabel: string;
  priceHint?: string;
  brand: LicensingBrand;
};

type Props = {
  featured: LicensingFeaturedProduct[];
};

type AudienceId = "personal" | "team" | "business" | "org";

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Nguồn gốc rõ ràng",
    body: "License chính hãng 100%",
    Icon: ShieldCheck,
  },
  {
    title: "Giao license tức thì",
    body: "Nhận ngay sau thanh toán",
    Icon: Zap,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Trước và sau khi mua",
    Icon: Headphones,
  },
];

const LICENSE_FORMS: {
  title: string;
  subtitle: string;
  items: string[];
  href: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: "Perpetual License",
    subtitle: "Bản quyền vĩnh viễn",
    items: [
      "Sử dụng lâu dài",
      "Thanh toán một lần",
      "Phù hợp nhu cầu ổn định",
    ],
    href: "/products",
    Icon: Infinity,
    tone: "bg-accent/15 text-accent",
  },
  {
    title: "Subscription License",
    subtitle: "Bản quyền thuê bao",
    items: [
      "Thanh toán định kỳ",
      "Luôn được cập nhật",
      "Phù hợp nhu cầu linh hoạt",
    ],
    href: "/products",
    Icon: CalendarDays,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Volume License",
    subtitle: "Bản quyền số lượng lớn",
    items: [
      "Quản lý tập trung",
      "Tối ưu chi phí",
      "Phù hợp doanh nghiệp",
    ],
    href: "/business/volume-licensing",
    Icon: Users,
    tone: "bg-violet-100 text-violet-700",
  },
];

const AUDIENCES: {
  id: AudienceId;
  label: string;
  Icon: LucideIcon;
  benefits: { title: string; body: string; Icon: LucideIcon }[];
  products: { name: string; price: string; brand: LicensingBrand; href: string }[];
  scene: "personal" | "team" | "business" | "org";
}[] = [
  {
    id: "personal",
    label: "Cá nhân",
    Icon: User,
    benefits: [
      {
        title: "Sử dụng đơn giản",
        body: "Mua nhanh, kích hoạt rõ ràng trên thiết bị của bạn.",
        Icon: Zap,
      },
      {
        title: "Chi phí tối ưu",
        body: "Chọn đúng gói Retail / Home — không trả thừa.",
        Icon: CreditCard,
      },
      {
        title: "An tâm sử dụng",
        body: "License chính hãng, hỗ trợ tiếng Việt khi cần.",
        Icon: ShieldCheck,
      },
    ],
    products: [
      {
        name: "Windows 11 Pro",
        price: "2.490.000 đ",
        brand: "windows",
        href: "/products?q=windows",
      },
      {
        name: "Office 2024 Home",
        price: "2.990.000 đ",
        brand: "office",
        href: "/products?cat=office",
      },
      {
        name: "Adobe Creative Cloud",
        price: "Liên hệ",
        brand: "adobe",
        href: "/products?q=adobe",
      },
    ],
    scene: "personal",
  },
  {
    id: "team",
    label: "Đội nhóm",
    Icon: Users,
    benefits: [
      {
        title: "Cộng tác liền mạch",
        body: "Gói Business / Microsoft 365 cho nhóm nhỏ.",
        Icon: Users,
      },
      {
        title: "Quản lý gọn",
        body: "Theo dõi license và gia hạn trong Tài khoản KEYON.",
        Icon: FileText,
      },
      {
        title: "Triển khai nhanh",
        body: "Nhận deliverable sau thanh toán — sẵn sàng làm việc.",
        Icon: Zap,
      },
    ],
    products: [
      {
        name: "Microsoft 365 Business",
        price: "Từ 2.399.000 đ",
        brand: "m365",
        href: "/products?q=microsoft+365",
      },
      {
        name: "Office 2024 Pro",
        price: "Từ 3.490.000 đ",
        brand: "office",
        href: "/products?cat=office",
      },
      {
        name: "Adobe Creative Cloud",
        price: "Liên hệ",
        brand: "adobe",
        href: "/products?q=adobe",
      },
    ],
    scene: "team",
  },
  {
    id: "business",
    label: "Doanh nghiệp",
    Icon: Building2,
    benefits: [
      {
        title: "Volume & Subscription",
        body: "Báo giá theo số lượng, chu kỳ và điều kiện vendor.",
        Icon: Package,
      },
      {
        title: "Quản trị tập trung",
        body: "Theo dõi hạn, gia hạn và bàn giao nội bộ rõ ràng.",
        Icon: ShieldCheck,
      },
      {
        title: "Tư vấn chuyên sâu",
        body: "KEYON hỗ trợ chọn gói phù hợp từng phòng ban.",
        Icon: Headphones,
      },
    ],
    products: [
      {
        name: "Microsoft 365 Business",
        price: "Báo giá",
        brand: "m365",
        href: "/contact/quote",
      },
      {
        name: "Windows 11 Pro Volume",
        price: "Báo giá",
        brand: "windows",
        href: "/business/volume-licensing",
      },
      {
        name: "Autodesk / Adobe",
        price: "Liên hệ",
        brand: "autodesk",
        href: "/contact/quote",
      },
    ],
    scene: "business",
  },
  {
    id: "org",
    label: "Tổ chức",
    Icon: Building2,
    benefits: [
      {
        title: "Hợp đồng dài hạn",
        body: "Triển khai theo dự án, SLA và hóa đơn VAT đầy đủ.",
        Icon: FileText,
      },
      {
        title: "Đa thương hiệu",
        body: "Microsoft, Adobe, Autodesk và hệ sinh thái liên quan.",
        Icon: Package,
      },
      {
        title: "Đồng hành vận hành",
        body: "Gia hạn, chuyển đổi gói và hỗ trợ sau mua.",
        Icon: Headphones,
      },
    ],
    products: [
      {
        name: "Volume Licensing",
        price: "Báo giá",
        brand: "windows",
        href: "/business/volume-licensing",
      },
      {
        name: "Microsoft 365 Enterprise",
        price: "Liên hệ",
        brand: "m365",
        href: "/contact/quote",
      },
      {
        name: "Adobe / Autodesk",
        price: "Liên hệ",
        brand: "adobe",
        href: "/contact/quote",
      },
    ],
    scene: "org",
  },
];

const STEPS: { n: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    title: "Chọn sản phẩm",
    body: "Tìm kiếm và lựa chọn sản phẩm phù hợp.",
    Icon: ShoppingCart,
  },
  {
    n: "02",
    title: "Thanh toán",
    body: "Thanh toán an toàn qua nhiều phương thức.",
    Icon: CreditCard,
  },
  {
    n: "03",
    title: "Nhận license",
    body: "Nhận license ngay và kích hoạt sử dụng.",
    Icon: KeyRound,
  },
];

const TRUST_BAR: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Thanh toán an toàn",
    body: "Bảo mật theo tiêu chuẩn phổ biến",
    Icon: ShieldCheck,
  },
  {
    title: "Hóa đơn VAT đầy đủ",
    body: "Xuất hóa đơn khi yêu cầu",
    Icon: FileText,
  },
  {
    title: "Giao license tự động",
    body: "Nhận trong Tài khoản sau thanh toán",
    Icon: Zap,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Kênh hỗ trợ tiếng Việt",
    Icon: Headphones,
  },
  {
    title: "Chính sách rõ ràng",
    body: "Điều kiện gói minh bạch trước khi mua",
    Icon: Package,
  },
];

export function SoftwareLicensingSolutionLanding({
  featured,
}: Props) {
  const products = featured.slice(0, 6);
  const showFeatured = products.length > 0;

  return (
    <div className="bg-white">
      {/* ── Hero (dark) ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#071a2b] text-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_18%,rgba(14,165,164,0.22),transparent_42%),radial-gradient(ellipse_at_12%_88%,rgba(14,165,233,0.12),transparent_48%),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,auto,28px_28px,28px_28px]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-11">
          <nav
            className={`mb-6 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-slate-400`}
          >
            <Link href="/" className="transition hover:text-accent">
              Trang chủ
            </Link>
            <span aria-hidden>›</span>
            <Link href="/solutions" className="transition hover:text-accent">
              Giải pháp
            </Link>
            <span aria-hidden>›</span>
            <span className="text-slate-200">Bản quyền phần mềm</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10">
            <div className="min-w-0">
              <h1 className={`max-w-[18ch] ${HERO_TITLE_CLASS} text-white`}>
                Bản quyền phần mềm{" "}
                <span className="text-accent">đúng nhu cầu, đúng giá trị</span>
              </h1>
              <p className={`mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-base`}>
                Cung cấp bản quyền phần mềm chính hãng cho cá nhân, đội nhóm và
                doanh nghiệp — linh hoạt theo hình thức cấp phép và quy mô sử dụng.
              </p>

              <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-3">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex gap-3 sm:flex-col sm:gap-2">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent"
                      aria-hidden
                    >
                      <p.Icon {...ICON_SM} />
                    </span>
                    <div>
                      <p className={`${CARD_TITLE_CLASS} text-white`}>{p.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                        {p.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá sản phẩm →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/30 bg-transparent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn bản quyền
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[480px] lg:max-w-none">
              <LicensingHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── License forms ────────────────────────────────────── */}
      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Đa dạng hình thức cấp phép</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Chọn Perpetual, Subscription hoặc Volume theo nhu cầu thực tế — KEYON
              hỗ trợ tư vấn trước khi mua.
            </p>
          </header>

          <ul className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {LICENSE_FORMS.map((f) => (
              <li key={f.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full ${f.tone}`}
                    aria-hidden
                  >
                    <f.Icon size={22} strokeWidth={1.75} />
                  </span>
                  <h3 className={`mt-4 ${SUBSECTION_TITLE_CLASS}`}>{f.title}</h3>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{f.subtitle}</p>
                  <ul className="mt-4 space-y-2.5">
                    {f.items.map((item) => (
                      <li key={item} className="flex gap-2.5">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                          aria-hidden
                        >
                          <Check size={11} strokeWidth={3} />
                        </span>
                        <span className={CARD_TITLE_CLASS}>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={f.href}
                    className={`mt-auto pt-5 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
                  >
                    Xem chi tiết →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Audience tabs ────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Dành cho mọi đối tượng</h2>
          </header>
          <div className="mt-6">
            <AudiencePanel />
          </div>
        </div>
      </section>

      {/* ── Popular products ─────────────────────────────────── */}
      {showFeatured ? (
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm bản quyền phổ biến</h2>
            </div>
            <Link href="/products" className={LINK_ACCENT_CLASS}>
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="relative">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-3.5">
              {products.map((p) => (
                <li key={p.id} className="min-w-0">
                  <article
                    className={`flex h-full flex-col rounded-2xl border border-border bg-white p-3.5 sm:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <span className="shrink-0" aria-hidden>
                      <BrandMark brand={p.brand} size={36} />
                    </span>
                    <h3 className={`mt-3 ${CARD_TITLE_CLASS} line-clamp-2`}>{p.title}</h3>
                    <p className={`mt-1 ${CARD_META_CLASS}`}>{p.meta}</p>
                    <p className={`mt-2 ${CARD_PRICE_CLASS} text-navy`}>{p.priceLabel}</p>
                    {p.priceHint ? (
                      <p className={`mt-0.5 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                    ) : null}
                    <Link
                      href={p.href}
                      className={`mt-auto pt-3 inline-flex h-9 items-center justify-center rounded-xl bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                    >
                      Mua ngay →
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className={`absolute -right-1 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white lg:flex ${ELEVATION_FLOAT} ${TRANSITION_UI} hover:bg-accent-hover`}
              aria-label="Xem thêm sản phẩm"
            >
              <ChevronRight size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {/* ── 3 steps ──────────────────────────────────────────── */}
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-[#062033] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-11">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_50%,rgba(14,165,164,0.28),transparent_42%)]"
              aria-hidden
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(140px,180px)] lg:gap-6 xl:gap-8">
              <div className="min-w-0">
                <h2 className={`${SECTION_TITLE_CLASS} text-center text-white lg:text-left`}>
                  Mua và nhận license chỉ trong 3 bước
                </h2>

                <ol className="mt-8 grid gap-6 sm:grid-cols-3 sm:gap-2 md:gap-3">
                  {STEPS.map((s, i) => (
                    <li key={s.n} className="relative flex gap-3 sm:flex-col sm:items-start sm:pr-3">
                      {i < STEPS.length - 1 ? (
                        <span
                          className="pointer-events-none absolute left-5 top-12 h-[calc(100%-2.75rem)] w-px border-l border-dashed border-accent/50 sm:left-[3.25rem] sm:right-0 sm:top-[1.35rem] sm:h-0 sm:w-[calc(100%-2.5rem)] sm:border-l-0 sm:border-t"
                          aria-hidden
                        />
                      ) : null}
                      <div className="relative z-[1] flex shrink-0 items-center gap-2.5">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-[#0a2a3a] font-display text-sm font-bold tabular-nums text-accent`}
                        >
                          {s.n}
                        </span>
                        <span
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-accent/45 bg-accent/10 text-accent"
                          aria-hidden
                        >
                          <s.Icon size={20} strokeWidth={1.8} />
                        </span>
                      </div>
                      <div className="min-w-0 pt-0.5 sm:pt-3">
                        <p className={`${CARD_TITLE_CLASS} text-[15px] text-white`}>{s.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="relative mx-auto flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40" aria-hidden>
                <span className="absolute inset-0 rounded-full border border-dashed border-accent/35" />
                <span className="absolute inset-3 rounded-full border border-accent/25" />
                <span className="absolute inset-6 rounded-full bg-accent/15 blur-sm" />
                <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_48px_rgba(14,165,164,0.55)] sm:h-28 sm:w-28">
                  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" aria-hidden>
                    <path
                      d="M24 4 8 10v12c0 11.2 7.2 21.6 16 24 8.8-2.4 16-12.8 16-24V10L24 4Z"
                      fill="currentColor"
                      fillOpacity="0.15"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinejoin="round"
                    />
                    <circle cx="24" cy="22" r="4.5" stroke="currentColor" strokeWidth="2.2" />
                    <path
                      d="M24 26.5v8"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ────────────────────────────────────────── */}
      <section className="border-t border-border py-7 md:py-8">
        <div className="home-container">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            {TRUST_BAR.map((t) => (
              <li key={t.title} className="flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                  aria-hidden
                >
                  <t.Icon {...ICON_SM} />
                </span>
                <div className="min-w-0">
                  <p className={CARD_TITLE_CLASS}>{t.title}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{t.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SolutionFinalCta />
    </div>
  );
}

function AudiencePanel() {
  const [active, setActive] = useState<AudienceId>("personal");
  const audience = AUDIENCES.find((a) => a.id === active) ?? AUDIENCES[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Đối tượng"
        className="mx-auto flex max-w-2xl flex-wrap justify-center gap-1.5 rounded-2xl border border-border bg-surface p-1.5"
      >
        {AUDIENCES.map((a) => {
          const selected = a.id === active;
          return (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(a.id)}
              className={`inline-flex min-w-[7.5rem] flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                selected
                  ? "bg-accent text-white shadow-sm"
                  : "bg-transparent text-navy hover:bg-white"
              }`}
            >
              <a.Icon size={16} strokeWidth={1.9} aria-hidden />
              {a.label}
            </button>
          );
        })}
      </div>

      <article
        role="tabpanel"
        className={`mt-5 overflow-hidden rounded-2xl border border-border bg-surface ${ELEVATION_HAIRLINE}`}
      >
        <div className="grid items-stretch gap-0 lg:grid-cols-[0.95fr_1.05fr_0.95fr]">
          <div className="relative min-h-[220px] overflow-hidden p-4 sm:p-5 lg:min-h-[280px]">
            <div
              className={`absolute inset-[8%_10%_10%_8%] overflow-hidden bg-gradient-to-br from-[#cfecea] via-[#d9eef5] to-[#c5d4e8] ${ELEVATION_FLOAT}`}
              style={{ borderRadius: "46% 54% 48% 52% / 40% 42% 58% 60%" }}
            >
              <AudienceScene kind={audience.scene} />
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 bg-white px-5 py-6 sm:px-6 sm:py-7">
            {audience.benefits.map((b) => (
              <div key={b.title} className="flex gap-3">
                <span
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                  aria-hidden
                >
                  <b.Icon size={17} strokeWidth={1.85} />
                </span>
                <div>
                  <p className={CARD_TITLE_CLASS}>{b.title}</p>
                  <p className={`mt-0.5 ${BODY_MUTED_CLASS}`}>{b.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border bg-white p-5 sm:p-6 lg:border-l lg:border-t-0">
            <p className={`${OVERLINE_CLASS} tracking-wide text-muted`}>
              Sản phẩm phổ biến
            </p>
            <ul className="mt-3.5 space-y-2">
              {audience.products.map((p) => (
                <li key={p.name}>
                  <Link
                    href={p.href}
                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2 ${TRANSITION_UI} hover:bg-surface`}
                  >
                    <span className="shrink-0" aria-hidden>
                      <BrandMark brand={p.brand} size={28} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block ${CARD_TITLE_CLASS} line-clamp-1`}>
                        {p.name}
                      </span>
                      <span className={`block ${CARD_META_CLASS}`}>{p.price}</span>
                    </span>
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-accent"
                      strokeWidth={2}
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/products"
              className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
            >
              Xem tất cả sản phẩm →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}

function AudienceScene({ kind }: { kind: "personal" | "team" | "business" | "org" }) {
  const tones = {
    personal: "#0ea5a4",
    team: "#0ea5e9",
    business: "#6366f1",
    org: "#64748b",
  } as const;
  return (
    <svg viewBox="0 0 320 360" className="h-full w-full" aria-hidden>
      <ellipse cx="160" cy="310" rx="110" ry="18" fill="#0f172a" opacity="0.1" />
      <rect x="90" y="210" width="140" height="88" rx="8" fill="#1e293b" />
      <rect x="100" y="220" width="120" height="60" rx="4" fill={tones[kind]} opacity="0.35" />
      <circle cx="160" cy="120" r="42" fill="#e2e8f0" />
      <circle cx="160" cy="112" r="34" fill="#cbd5e1" />
      <path d="M110 300c14-70 30-100 50-100s36 30 50 100" fill="#94a3b8" opacity="0.7" />
    </svg>
  );
}

function LicensingHeroArt() {
  const recent = [
    { name: "Windows 11 Pro", meta: "Retail · 1 PC", status: "Đang dùng", tone: "active" as const, brand: "windows" as const },
    { name: "Office 2024 Home", meta: "Perpetual", status: "Đang dùng", tone: "active" as const, brand: "office" as const },
    { name: "Adobe Creative Cloud", meta: "Subscription", status: "Cần gia hạn", tone: "warn" as const, brand: "adobe" as const },
  ];

  return (
    <div className="relative mx-auto aspect-[5/4.1] w-full max-w-[520px] lg:max-w-none">
      {/* Ambient glow under laptop */}
      <div
        className="pointer-events-none absolute bottom-[6%] left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-accent/35 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[8%] top-[28%] h-40 w-40 rounded-full bg-accent/20 blur-3xl"
        aria-hidden
      />

      {/* Floating brand chips — mockup positions */}
      <span
        className="absolute left-[2%] top-[10%] z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2.5 sm:h-16 sm:w-16"
        style={{ boxShadow: "0 14px 32px rgba(0,0,0,0.28)" }}
        aria-hidden
      >
        <BrandMark brand="windows" size={40} />
      </span>
      <span
        className="absolute right-[0%] top-[8%] z-20 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2.5 sm:h-16 sm:w-16"
        style={{ boxShadow: "0 14px 32px rgba(0,0,0,0.28)" }}
        aria-hidden
      >
        <BrandMark brand="adobe" size={40} />
      </span>
      <span
        className="absolute bottom-[28%] left-[-2%] z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 sm:h-14 sm:w-14"
        style={{ boxShadow: "0 14px 32px rgba(0,0,0,0.28)" }}
        aria-hidden
      >
        <BrandMark brand="office" size={34} />
      </span>
      <span
        className="absolute right-[-2%] top-[42%] z-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2 sm:h-14 sm:w-14"
        style={{ boxShadow: "0 14px 32px rgba(0,0,0,0.28)" }}
        aria-hidden
      >
        <BrandMark brand="autodesk" size={34} />
      </span>

      {/* Laptop body */}
      <div className="absolute inset-[10%_8%_14%_10%] z-10 flex flex-col">
        <div
          className={`relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[14px] border border-white/15 bg-[#f4f7fb] ${ELEVATION_FLOAT}`}
        >
          {/* Bezel / chrome */}
          <div className="flex items-center justify-between border-b border-slate-200/90 bg-white px-3 py-2 sm:px-3.5">
            <p className={`${BADGE_CLASS} font-semibold tracking-wide text-navy`}>
              Quản lý bản quyền
            </p>
            <div className="flex items-center gap-2 text-slate-400" aria-hidden>
              <Search size={13} strokeWidth={2} />
              <Settings2 size={13} strokeWidth={2} />
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden p-2.5 sm:gap-2.5 sm:p-3">
            {/* Stat cards — white like mockup */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { label: "Tổng license", value: "128", sub: "Active: 98" },
                { label: "Sắp hết hạn", value: "15", sub: "< 30 ngày" },
                { label: "Hết hạn", value: "2", sub: "Cần gia hạn" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-slate-200/80 bg-white px-1.5 py-2 text-center sm:px-2 sm:py-2.5"
                  style={{ boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}
                >
                  <p className="font-display text-base font-bold tabular-nums leading-none text-navy sm:text-lg">
                    {s.value}
                  </p>
                  <p className="mt-1 text-[9px] font-semibold leading-tight text-slate-500 sm:text-[10px]">
                    {s.label}
                  </p>
                  <p className="mt-0.5 hidden text-[9px] text-slate-400 sm:block">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent licenses */}
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200/80 bg-white px-2 py-2 sm:px-2.5">
              <p className={`${BADGE_CLASS} mb-1.5 font-semibold text-slate-500`}>
                License gần đây
              </p>
              <ul className="space-y-1.5">
                {recent.map((r) => (
                  <li key={r.name} className="flex items-center gap-2">
                    <span className="shrink-0" aria-hidden>
                      <BrandMark brand={r.brand} size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold leading-tight text-navy sm:text-xs">
                        {r.name}
                      </span>
                      <span className="block truncate text-[9px] text-slate-400 sm:text-[10px]">
                        {r.meta}
                      </span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold sm:text-[10px] ${
                        r.tone === "active"
                          ? "bg-accent/15 text-accent"
                          : "border border-amber-300/80 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Laptop base */}
        <div className="relative mx-auto h-2.5 w-[104%] max-w-none rounded-b-md bg-gradient-to-b from-[#2a3544] to-[#1a222e]">
          <div className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-sm bg-[#0f172a]/50" />
        </div>
        <div className="mx-auto h-1.5 w-[78%] rounded-b-[10px] bg-[#334155]" />
      </div>

      {/* Shield badge — bottom-right of laptop */}
      <span
        className="absolute bottom-[6%] right-[10%] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white sm:h-16 sm:w-16"
        style={{ boxShadow: "0 0 36px rgba(14,165,164,0.55)" }}
        aria-hidden
      >
        <ShieldCheck size={28} strokeWidth={1.85} />
      </span>
    </div>
  );
}

function BrandMark({ brand, size = 40 }: { brand: LicensingBrand; size?: number }) {
  if (brand === "windows") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          fill="#0078D4"
          d="M3 5.5 11 4.3v7.2H3V5.5Zm9-.9 9-1.3v9.4h-9V4.6ZM3 13.5h8V21l-8-1.2v-6.3Zm9 0h9v8.7l-9-1.3v-7.4Z"
        />
      </svg>
    );
  }
  if (brand === "office" || brand === "m365") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path fill="#D83B01" d="M3 4.5 14 2v20L3 19.5V4.5Z" />
        <path fill="#A4262C" d="M14 2h7v20h-7V2Z" opacity="0.85" />
        <path fill="#fff" d="M6.2 8.2h5.2v1.4H8.1v1.6h3v1.3H8.1v1.8h3.4v1.4H6.2V8.2Z" />
      </svg>
    );
  }
  if (brand === "adobe") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#EB1000" />
        <path fill="#fff" d="M8.2 17.5 12 6.5l3.8 11H14l-.7-2.1H10.7l-.7 2.1H8.2Zm3-7.8-.95 2.9h1.9L11.2 9.7Z" />
      </svg>
    );
  }
  if (brand === "autodesk") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="5" fill="#0696D7" />
        <path fill="#fff" d="M5 17.5 10.2 6.5h3.2L18.6 17.5h-3.1l-.9-2.2H9l-.9 2.2H5Zm4.8-4.4h3.8l-1.9-4.6-1.9 4.6Z" />
      </svg>
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-lg bg-accent-soft text-accent"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <KeyRound size={Math.round(size * 0.45)} strokeWidth={1.8} />
    </span>
  );
}
