"use client";

import { useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  FileText,
  Headphones,
  Infinity,
  KeyRound,
  Package,
  ShieldCheck,
  ShoppingCart,
  Users,
  User,
  Wallet,
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
  usingFallback?: boolean;
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
        Icon: Wallet,
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
        href: "/contact/sales",
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
        href: "/contact/sales",
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
        href: "/contact/sales",
      },
      {
        name: "Adobe / Autodesk",
        price: "Liên hệ",
        brand: "adobe",
        href: "/contact/sales",
      },
    ],
    scene: "org",
  },
];

const STEPS: { n: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    n: "01",
    title: "Chọn sản phẩm",
    body: "Tìm và chọn bản quyền phù hợp nhu cầu.",
    Icon: ShoppingCart,
  },
  {
    n: "02",
    title: "Thanh toán",
    body: "Thanh toán an toàn qua nhiều phương thức.",
    Icon: Wallet,
  },
  {
    n: "03",
    title: "Nhận license",
    body: "Nhận ngay và kích hoạt theo hướng dẫn.",
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
    title: "Hỗ trợ 24/7",
    body: "Kênh hỗ trợ tiếng Việt",
    Icon: Headphones,
  },
  {
    title: "Chính sách rõ ràng",
    body: "Điều kiện gói minh bạch trước khi mua",
    Icon: Package,
  },
];

export const LICENSING_FALLBACK_FEATURED: LicensingFeaturedProduct[] = [
  {
    id: "fb-win11",
    title: "Windows 11 Pro",
    href: "/products?q=windows",
    meta: "Retail · 1 PC",
    priceLabel: "2.490.000 đ",
    priceHint: "Giá tham khảo",
    brand: "windows",
  },
  {
    id: "fb-office",
    title: "Office 2024 Professional",
    href: "/products?cat=office",
    meta: "Perpetual · 1 thiết bị",
    priceLabel: "3.490.000 đ",
    priceHint: "Giá tham khảo",
    brand: "office",
  },
  {
    id: "fb-m365",
    title: "Microsoft 365 Business",
    href: "/products?q=microsoft+365",
    meta: "Subscription · / người dùng / năm",
    priceLabel: "2.399.000 đ",
    priceHint: "Giá tham khảo",
    brand: "m365",
  },
  {
    id: "fb-adobe",
    title: "Adobe Creative Cloud",
    href: "/products?q=adobe",
    meta: "Subscription",
    priceLabel: "Liên hệ",
    brand: "adobe",
  },
  {
    id: "fb-win11h",
    title: "Windows 11 Home",
    href: "/products?q=windows",
    meta: "Retail · 1 PC",
    priceLabel: "1.890.000 đ",
    priceHint: "Giá tham khảo",
    brand: "windows",
  },
  {
    id: "fb-autodesk",
    title: "Autodesk AutoCAD",
    href: "/products?q=autodesk",
    meta: "Subscription",
    priceLabel: "Liên hệ",
    brand: "autodesk",
  },
];

export function SoftwareLicensingSolutionLanding({
  featured,
  usingFallback,
}: Props) {
  const products = featured.slice(0, 6);

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
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Giải pháp
              </p>
              <h1 className={`mt-3 max-w-[18ch] ${HERO_TITLE_CLASS} text-white`}>
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
                  href="/contact/sales"
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
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm bản quyền phổ biến</h2>
              {usingFallback ? (
                <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
                  Giá tham khảo — xác nhận khi xem chi tiết hoặc tư vấn.
                </p>
              ) : null}
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

      {/* ── 3 steps ──────────────────────────────────────────── */}
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#071a2b] via-[#0a2a38] to-[#0a3d42] px-5 py-8 sm:px-8 sm:py-9 lg:px-10">
            <div
              className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-accent/25 blur-3xl"
              aria-hidden
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-10">
              <div>
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Mua và nhận license chỉ trong 3 bước
                </h2>
                <ol className="mt-7 grid gap-6 sm:grid-cols-3 sm:gap-4">
                  {STEPS.map((s, i) => (
                    <li key={s.n} className="relative flex gap-3 sm:flex-col sm:items-start">
                      {i < STEPS.length - 1 ? (
                        <span
                          className="pointer-events-none absolute left-[22px] top-11 hidden h-[calc(100%-2.5rem)] w-px border-l border-dashed border-accent/40 sm:left-auto sm:right-[-12%] sm:top-5 sm:h-px sm:w-[calc(100%+24%)] sm:border-l-0 sm:border-t"
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-[#0b2433] text-accent"
                        aria-hidden
                      >
                        <s.Icon size={18} strokeWidth={1.85} />
                      </span>
                      <div>
                        <p className={`${BADGE_CLASS} font-semibold text-accent`}>{s.n}</p>
                        <p className={`mt-1 ${CARD_TITLE_CLASS} text-white`}>{s.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-300">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-accent/20 ring-1 ring-accent/40 sm:h-32 sm:w-32"
                aria-hidden
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_40px_rgba(14,165,164,0.45)] sm:h-24 sm:w-24">
                  <KeyRound size={36} strokeWidth={1.6} />
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
  return (
    <div className="relative mx-auto aspect-[5/4.2] w-full">
      <span
        className="absolute left-[8%] top-[12%] h-14 w-14 rounded-2xl bg-white p-2.5"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
        aria-hidden
      >
        <BrandMark brand="windows" size={36} />
      </span>
      <span
        className="absolute right-[4%] top-[18%] h-14 w-14 rounded-2xl bg-white p-2.5"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
        aria-hidden
      >
        <BrandMark brand="office" size={36} />
      </span>
      <span
        className="absolute bottom-[22%] left-[2%] h-12 w-12 rounded-2xl bg-white p-2"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
        aria-hidden
      >
        <BrandMark brand="adobe" size={32} />
      </span>
      <span
        className="absolute bottom-[16%] right-[6%] h-12 w-12 rounded-2xl bg-white p-2"
        style={{ boxShadow: "0 12px 28px rgba(0,0,0,0.25)" }}
        aria-hidden
      >
        <BrandMark brand="autodesk" size={32} />
      </span>

      {/* Laptop */}
      <div className="absolute inset-[14%_10%_18%_12%] flex flex-col">
        <div
          className={`relative flex-1 overflow-hidden rounded-t-xl border border-white/10 bg-[#0b1220] ${ELEVATION_FLOAT}`}
        >
          <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            <span className={`ml-2 ${BADGE_CLASS} text-slate-400`}>Quản lý bản quyền</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-3 sm:p-4">
            {[
              { label: "Tổng license", value: "128" },
              { label: "Sắp hết hạn", value: "15" },
              { label: "Hết hạn", value: "2" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-white/10 bg-white/5 px-2 py-2.5 text-center"
              >
                <p className="font-display text-lg font-bold tabular-nums text-accent sm:text-xl">
                  {s.value}
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-1.5 px-3 pb-3 sm:px-4">
            {[72, 54, 88].map((w) => (
              <div key={w} className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent/70" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto h-2.5 w-[92%] rounded-b-md bg-[#1e293b]" />
        <div className="mx-auto h-1.5 w-[70%] rounded-b-full bg-[#334155]" />
      </div>

      <span
        className="absolute bottom-[8%] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-white shadow-[0_0_32px_rgba(14,165,164,0.55)]"
        aria-hidden
      >
        <ShieldCheck size={26} strokeWidth={1.8} />
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
