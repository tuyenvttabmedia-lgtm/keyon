import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  CreditCard,
  FileText,
  FolderLock,
  Headphones,
  Lock,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
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
const ICON_LG = { size: 26, strokeWidth: 1.65, "aria-hidden": true as const };

const FEATURES: {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Giao tiếp & Họp trực tuyến",
    description: "Họp, chat và cộng tác thời gian thực trên mọi thiết bị.",
    href: "/products?q=teams",
    Icon: Video,
  },
  {
    title: "Soạn thảo & Làm việc nhóm",
    description: "Word, Excel, PowerPoint — đồng biên tập và chia sẻ dễ dàng.",
    href: "/products?cat=office",
    Icon: FileText,
  },
  {
    title: "Lưu trữ & Chia sẻ",
    description: "Cloud storage an toàn, đồng bộ file và quyền truy cập rõ ràng.",
    href: "/products?q=onedrive",
    Icon: FolderLock,
  },
  {
    title: "Quản lý & Bảo mật",
    description: "Kiểm soát danh tính, thiết bị và dữ liệu theo chuẩn doanh nghiệp.",
    href: "/solutions/security",
    Icon: ShieldCheck,
  },
  {
    title: "Nâng cao hiệu suất",
    description: "Công cụ AI và tự động hóa giúp làm việc nhanh hơn mỗi ngày.",
    href: "/products?cat=office",
    Icon: Sparkles,
  },
];

const TRUST_ROW: { label: string; Icon: LucideIcon }[] = [
  { label: "License chính hãng", Icon: BadgeCheck },
  { label: "Giao License tức thì", Icon: Zap },
  { label: "Hóa đơn VAT đầy đủ", Icon: FileText },
  { label: "Thanh toán an toàn", Icon: Lock },
  { label: "Hỗ trợ 24/7", Icon: Headphones },
];

const AUDIENCES: {
  title: string;
  description: string;
  href: string;
  cta: string;
  Icon: LucideIcon;
  tone: "teal" | "sky" | "navy";
}[] = [
  {
    title: "Cá nhân",
    description: "Gói Office / Microsoft 365 cho học tập và làm việc cá nhân.",
    href: "/products?cat=office",
    cta: "Khám phá giải pháp →",
    Icon: Users,
    tone: "teal",
  },
  {
    title: "Đội nhóm",
    description: "Cộng tác, họp trực tuyến và chia sẻ tài liệu trong team.",
    href: "/products?q=microsoft+365",
    cta: "Khám phá giải pháp →",
    Icon: MessageSquare,
    tone: "sky",
  },
  {
    title: "Doanh nghiệp",
    description: "Volume licensing, quản trị tập trung và tư vấn chọn gói.",
    href: "/contact/sales",
    cta: "Liên hệ tư vấn →",
    Icon: Building2,
    tone: "navy",
  },
];

const WHY: { title: string; Icon: LucideIcon }[] = [
  { title: "Sản phẩm chính hãng", Icon: BadgeCheck },
  { title: "Giá tốt & Minh bạch", Icon: Sparkles },
  { title: "Kích hoạt nhanh chóng", Icon: Zap },
  { title: "Hỗ trợ tận tâm", Icon: Headphones },
  { title: "An toàn & Bảo mật", Icon: ShieldCheck },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Chọn sản phẩm", body: "Chọn gói Office / Microsoft 365 phù hợp.", Icon: ShoppingCart },
  { title: "Thanh toán", body: "VietQR / chuyển khoản — rõ ràng, an toàn.", Icon: CreditCard },
  { title: "Nhận license", body: "Nhận key / hướng dẫn kích hoạt ngay.", Icon: BadgeCheck },
];

const HERO_TRUST: { title: string; Icon: LucideIcon }[] = [
  { title: "Công cụ chính hãng", Icon: BadgeCheck },
  { title: "Kích hoạt nhanh chóng", Icon: Zap },
  { title: "Hỗ trợ tiếng Việt", Icon: Headphones },
];

export function ProductivitySolutionLanding({ featured, usingFallback }: Props) {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,164,0.09),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(56,189,248,0.06),_transparent_50%)]"
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

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>Giải pháp</p>
              <h1 className={`mt-2.5 max-w-xl ${HERO_TITLE_CLASS}`}>Năng suất & Cộng tác</h1>
              <p className={`mt-4 max-w-lg ${PAGE_LEAD_CLASS}`}>
                Công cụ và dịch vụ hiện đại giúp cá nhân, đội nhóm và doanh nghiệp làm việc thông
                minh hơn, cộng tác mượt hơn và tối ưu hiệu suất mỗi ngày.
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                {HERO_TRUST.map((item) => (
                  <li key={item.title} className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <item.Icon size={16} strokeWidth={1.9} />
                    </span>
                    <span className={CARD_TITLE_CLASS}>{item.title}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=office"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá sản phẩm →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn giải pháp
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <ProductivityHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Công cụ cho mọi nhu cầu làm việc</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ giao tiếp đến soạn thảo, lưu trữ và bảo mật — một hệ sinh thái đồng bộ.
            </p>
          </header>
          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
            {FEATURES.map((f) => (
              <li key={f.title}>
                <article
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <f.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS} text-[15px]`}>{f.title}</h3>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{f.description}</p>
                  <Link
                    href={f.href}
                    className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS} group-hover:gap-1.5 ${TRANSITION_UI}`}
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

      {/* ── Featured products ────────────────────────────────── */}
      <section className="border-y border-border bg-surface py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm tiêu biểu</h2>
              <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>
                {usingFallback
                  ? "Gói tham khảo phổ biến — xác nhận giá và tồn kho khi xem chi tiết hoặc tư vấn."
                  : "Các gói đang có trên catalog KEYON — xem chi tiết trước khi mua."}
              </p>
            </div>
            <Link href="/products?cat=office" className={`shrink-0 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
            {featured.map((p) => (
              <li key={p.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-white"
                    aria-hidden
                  >
                    <ProductBrandMark brand={p.brand} />
                  </span>
                  <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  <p className={`mt-1.5 line-clamp-2 ${CARD_META_CLASS}`}>{p.description}</p>
                  <p className={`mt-3 ${CARD_PRICE_CLASS} text-accent`}>{p.priceLabel}</p>
                  {p.priceHint ? (
                    <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                  ) : null}
                  <Link
                    href={p.href}
                    className={`mt-auto pt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                  >
                    Mua ngay
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <ul
            className={`mt-7 grid gap-3 rounded-2xl border border-border bg-white px-4 py-4 sm:grid-cols-2 sm:px-5 md:grid-cols-5 md:gap-2 md:py-3.5 ${ELEVATION_HAIRLINE}`}
          >
            {TRUST_ROW.map((t) => (
              <li key={t.label} className="flex items-center gap-2.5 md:justify-center">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                  aria-hidden
                >
                  <t.Icon size={15} strokeWidth={1.9} />
                </span>
                <span className={`${BADGE_CLASS} font-semibold text-navy`}>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Audiences ────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo đối tượng</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn hướng phù hợp — từ cá nhân đến đội nhóm và doanh nghiệp.
            </p>
          </header>
          <ul className="mt-7 grid gap-4 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <li key={a.title}>
                <article
                  className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <div
                    className={`relative flex h-36 items-end p-5 ${
                      a.tone === "navy"
                        ? "bg-gradient-to-br from-navy via-slate-800 to-slate-700"
                        : a.tone === "sky"
                          ? "bg-gradient-to-br from-sky-500/90 via-cyan-600/85 to-teal-700"
                          : "bg-gradient-to-br from-accent via-teal-600 to-cyan-800"
                    }`}
                  >
                    <div
                      className="pointer-events-none absolute inset-0 opacity-30"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 40%)",
                      }}
                      aria-hidden
                    />
                    <span
                      className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm"
                      aria-hidden
                    >
                      <a.Icon {...ICON_MD} />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <h3 className={SUBSECTION_TITLE_CLASS}>{a.title}</h3>
                    <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{a.description}</p>
                    <Link
                      href={a.href}
                      className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}
                    >
                      {a.cta}
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Why KEYON ────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface py-9 md:py-10">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mua license chính hãng — giao nhanh, hỗ trợ rõ ràng, giá minh bạch.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {WHY.map((w) => (
              <li key={w.title} className="flex flex-col items-center gap-2.5 text-center">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/20 bg-white text-accent"
                  aria-hidden
                >
                  <w.Icon {...ICON_MD} />
                </span>
                <p className={CARD_TITLE_CLASS}>{w.title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình mua hàng đơn giản</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Ba bước rõ ràng — hoặc liên hệ nếu cần tư vấn chọn gói.
            </p>
          </header>

          <div className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            <div
              className="pointer-events-none absolute left-[8%] right-[32%] top-9 z-0 hidden border-t border-dashed border-accent/35 lg:block"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <div key={step.title} className="relative z-[1] text-center">
                <div className="relative mx-auto w-fit">
                  <span
                    className={`flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border-2 border-accent/25 bg-white text-accent ${ELEVATION_HAIRLINE}`}
                  >
                    <step.Icon {...ICON_LG} />
                  </span>
                  <span
                    className={`absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white ${ELEVATION_HAIRLINE}`}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className={`mt-4 ${CARD_TITLE_CLASS}`}>{step.title}</p>
                <p className={`mt-1 px-2 ${CARD_META_CLASS}`}>{step.body}</p>
              </div>
            ))}

            <div
              className={`relative z-[1] flex flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent-soft/60 px-5 py-6 text-center ${ELEVATION_HAIRLINE}`}
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white"
                aria-hidden
              >
                <Headphones {...ICON_MD} />
              </span>
              <p className={`mt-3 ${CARD_TITLE_CLASS}`}>Cần tư vấn giải pháp?</p>
              <Link href="/contact/sales" className={`mt-2 ${LINK_ACCENT_CLASS}`}>
                Liên hệ tư vấn →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-10 md:pb-12">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-8 sm:px-10 sm:py-10 lg:px-12">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-xl">
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Sẵn sàng nâng cao hiệu suất làm việc của bạn?
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300 md:text-[15px]">
                  Chọn gói phù hợp hoặc nhận tư vấn từ đội ngũ KEYON — chính hãng, giao nhanh, hỗ trợ
                  tiếng Việt.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/products?cat=office"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá sản phẩm
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
    id: "fb-outlook",
    title: "Outlook",
    href: "/products?q=outlook",
    description: "Email chuyên nghiệp, lịch và liên hệ.",
    priceLabel: "Từ 890.000 đ / năm",
    priceHint: "Giá tham khảo",
    brand: "outlook",
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

/* ── Brand marks ────────────────────────────────────────────────────────── */

function ProductBrandMark({ brand }: { brand: ProductivityFeaturedProduct["brand"] }) {
  switch (brand) {
    case "m365":
      return <M365Mark />;
    case "teams":
      return <TeamsMark />;
    case "office":
      return <OfficeMark />;
    case "outlook":
      return <OutlookMark />;
    case "onedrive":
      return <OneDriveMark />;
    default:
      return <M365Mark />;
  }
}

function M365Mark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#EB3C00" />
      <path
        fill="#fff"
        d="M11 12h7.2v7.2H11V12Zm10.8 0H29v7.2h-7.2V12ZM11 22.8h7.2V30H11v-7.2Zm10.8 0H29V30h-7.2v-7.2Z"
      />
    </svg>
  );
}

function TeamsMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#5059C9" />
      <circle cx="27.5" cy="13.5" r="3.2" fill="#fff" opacity="0.95" />
      <rect x="9" y="14" width="14" height="15" rx="2.5" fill="#fff" />
      <rect x="21" y="17" width="10" height="12" rx="2" fill="#B6BAF0" />
      <path fill="#6264A7" d="M12.2 18.5h7.6v1.6h-7.6zm0 3.2h7.6v1.6h-7.6zm0 3.2h5.2v1.6h-5.2z" />
    </svg>
  );
}

function OfficeMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#D83B01" />
      <path
        fill="#fff"
        d="M22.5 10.5 12 13.2v13.6l10.5 2.7 10-2.5V13l-10-2.5Zm0 2.2 7.2 1.8v11l-7.2 1.8V12.7Zm-1.6 1.1v12.4L13.6 24.5V15.5l7.3-1.7Z"
      />
    </svg>
  );
}

function OutlookMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#0078D4" />
      <path
        fill="#fff"
        d="M10 13.5h11.5c.8 0 1.5.7 1.5 1.5v10c0 .8-.7 1.5-1.5 1.5H10c-.8 0-1.5-.7-1.5-1.5v-10c0-.8.7-1.5 1.5-1.5Zm1.8 2.2v8.6l5.2-3.6 5.2 3.6v-8.6H11.8Zm14.2-.2h5.5c.7 0 1.2.5 1.2 1.2v9.6c0 .7-.5 1.2-1.2 1.2h-5.5v-12Z"
      />
      <circle cx="31" cy="20" r="2.2" fill="#50E6FF" />
    </svg>
  );
}

function OneDriveMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="9" fill="#0078D4" />
      <path
        fill="#fff"
        d="M24.2 15.2c-1.1-2.2-3.4-3.6-5.9-3.6-2.8 0-5.2 1.7-6.2 4.2-2.4.3-4.3 2.4-4.3 4.9 0 2.7 2.2 4.9 4.9 4.9h15.4c2.5 0 4.5-2 4.5-4.5 0-2.3-1.7-4.2-3.9-4.5-.6-2.2-2.5-3.9-4.5-1.4Z"
        opacity="0.95"
      />
      <path fill="#50E6FF" d="M14.5 22.8c-.9-1.6-.7-3.6.6-4.9 1.2-1.2 3-1.5 4.5-.9.7-1.8 2.5-3 4.5-3 2.1 0 3.9 1.4 4.5 3.3 1.8.3 3.2 1.9 3.2 3.8 0 .3 0 .5-.1.8H14.5Z" />
    </svg>
  );
}

function ProductivityHeroArt() {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-gradient-to-br from-[#ecfeff] via-[#f0f9ff] to-[#f8fafc] p-4 sm:p-5 ${ELEVATION_FLOAT}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(14,165,164,0.16),transparent_48%)]"
        aria-hidden
      />

      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-navy to-slate-900">
        {/* Abstract collaboration scene — no stock photo dependency */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 30% 40%, rgba(14,165,164,0.45), transparent 50%), radial-gradient(ellipse at 75% 60%, rgba(56,189,248,0.25), transparent 45%)",
          }}
          aria-hidden
        />
        <svg
          viewBox="0 0 480 384"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Minh họa năng suất và cộng tác trên KEYON"
        >
          <defs>
            <linearGradient id="pkDesk" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <filter id="pkSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* desk / workspace silhouette */}
          <rect x="70" y="210" width="340" height="110" rx="16" fill="url(#pkDesk)" opacity="0.85" />
          <rect x="130" y="130" width="220" height="140" rx="12" fill="#0b1220" stroke="#334155" strokeWidth="2" />
          <rect x="145" y="145" width="190" height="100" rx="6" fill="#0ea5a4" opacity="0.25" />
          <rect x="145" y="145" width="190" height="100" rx="6" fill="none" stroke="#14b8a6" strokeWidth="1" opacity="0.4" />
          {/* people dots */}
          <g opacity="0.9">
            <circle cx="175" cy="195" r="14" fill="#94a3b8" />
            <circle cx="215" cy="188" r="16" fill="#cbd5e1" />
            <circle cx="255" cy="192" r="15" fill="#94a3b8" />
            <circle cx="295" cy="198" r="13" fill="#64748b" />
          </g>
          <rect x="160" y="280" width="160" height="10" rx="5" fill="#334155" />
        </svg>

        {/* Floating app icons */}
        <div
          className={`absolute left-3 top-4 rounded-xl bg-white p-1.5 sm:left-4 sm:top-5 ${ELEVATION_HAIRLINE}`}
        >
          <WordChip />
        </div>
        <div
          className={`absolute right-3 top-6 rounded-xl bg-white p-1.5 sm:right-5 sm:top-8 ${ELEVATION_HAIRLINE}`}
        >
          <TeamsChip />
        </div>
        <div
          className={`absolute bottom-5 left-5 rounded-xl bg-white p-1.5 sm:bottom-6 sm:left-7 ${ELEVATION_HAIRLINE}`}
        >
          <ExcelChip />
        </div>
        <div
          className={`absolute bottom-8 right-4 rounded-xl bg-white p-1.5 sm:bottom-10 sm:right-6 ${ELEVATION_HAIRLINE}`}
        >
          <PptChip />
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center justify-center gap-2">
        <span className={`rounded-full bg-white px-3 py-1 ${BADGE_CLASS} font-semibold text-navy ${ELEVATION_HAIRLINE}`}>
          Microsoft 365
        </span>
        <span className={`rounded-full bg-white px-3 py-1 ${BADGE_CLASS} font-semibold text-navy ${ELEVATION_HAIRLINE}`}>
          Teams · Office · OneDrive
        </span>
      </div>
    </div>
  );
}

function WordChip() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="8" fill="#185ABD" />
      <path fill="#fff" d="M10 9h7.5l1.2 10.2L20.8 9H28l-3.4 18h-5.2l-1.5-11.4L16.4 27H11L10 9Z" />
    </svg>
  );
}

function ExcelChip() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="8" fill="#107C41" />
      <path fill="#fff" d="M12 9h5.2l2.6 6.4L22.6 9H28l-4.8 9L28 27h-5.5l-2.8-6.6L16.8 27H11.5l4.9-9L12 9Z" />
    </svg>
  );
}

function PptChip() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="8" fill="#C43E1C" />
      <path fill="#fff" d="M11 9h9.2c3.4 0 5.6 2 5.6 5.1 0 3.2-2.3 5.2-5.8 5.2H15.6V27H11V9Zm4.6 3.4v5.2h3.8c1.7 0 2.7-.9 2.7-2.6s-1-2.6-2.7-2.6h-3.8Z" />
    </svg>
  );
}

function TeamsChip() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="8" fill="#5059C9" />
      <circle cx="25" cy="12" r="3" fill="#fff" />
      <rect x="8" y="12" width="13" height="14" rx="2.2" fill="#fff" />
      <rect x="19" y="15" width="9" height="11" rx="1.8" fill="#B6BAF0" />
    </svg>
  );
}
