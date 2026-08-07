import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Check,
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
  features: string[];
  brand: SecurityBrand;
};

type Props = {
  featured: SecurityFeaturedProduct[];
  usingFallback?: boolean;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bảo vệ nhiều lớp",
    body: "Endpoint, email, dữ liệu và danh tính trên một hướng giải pháp.",
    Icon: ShieldCheck,
  },
  {
    title: "Cập nhật liên tục",
    body: "Định nghĩa mối đe dọa và bản vá theo chu kỳ vendor.",
    Icon: Zap,
  },
  {
    title: "Dễ triển khai",
    body: "Mua trên KEYON — nhận license rõ ràng, hỗ trợ tiếng Việt.",
    Icon: Rocket,
  },
];

const TRUST_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "License chính hãng",
    body: "Nguồn cung rõ ràng — đúng loại nhận trước khi mua.",
    Icon: BadgeCheck,
  },
  {
    title: "Bảo vệ theo lớp",
    body: "Endpoint, email, dữ liệu và danh tính theo từng gói.",
    Icon: Shield,
  },
  {
    title: "Triển khai trên KEYON",
    body: "Nhận deliverable sau thanh toán — hỗ trợ tiếng Việt.",
    Icon: Monitor,
  },
  {
    title: "Gói theo quy mô",
    body: "Cá nhân đến tổ chức — chọn đúng nhu cầu thực tế.",
    Icon: Lock,
  },
];

const PILLARS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bảo vệ thiết bị",
    body: "Antivirus / endpoint cho PC và máy trạm — chống malware, ransomware.",
    Icon: Monitor,
  },
  {
    title: "Bảo vệ email",
    body: "Ngăn phishing, spam và đính kèm độc hại trước khi đến hộp thư.",
    Icon: Mail,
  },
  {
    title: "Bảo vệ dữ liệu",
    body: "Mã hóa, kiểm soát truy cập và giảm rủi ro rò rỉ thông tin.",
    Icon: Cloud,
  },
  {
    title: "Bảo vệ danh tính",
    body: "Xác thực, kiểm soát tài khoản và giảm chiếm quyền đăng nhập.",
    Icon: Fingerprint,
  },
  {
    title: "Bảo vệ mạng",
    body: "Tường lửa, lọc web và giám sát lưu lượng theo từng gói.",
    Icon: Network,
  },
];

const WHY: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "License chính hãng",
    body: "Nguồn cung rõ ràng — đúng loại nhận trước khi mua.",
    Icon: ShieldCheck,
  },
  {
    title: "Giá minh bạch",
    body: "Giá và chu kỳ hiển thị rõ trên từng gói.",
    Icon: BadgeCheck,
  },
  {
    title: "Triển khai nhanh",
    body: "Nhận deliverable sau thanh toán — kích hoạt theo hướng dẫn.",
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
    body: "Chọn gói bảo mật phù hợp thiết bị / quy mô.",
    Icon: ShoppingCart,
  },
  {
    n: "2",
    title: "Thanh toán",
    body: "Thanh toán an toàn qua các phương thức trên KEYON.",
    Icon: CreditCard,
  },
  {
    n: "3",
    title: "Nhận license",
    body: "Nhận key / tài khoản trong Tài khoản KEYON.",
    Icon: KeyRound,
  },
  {
    n: "4",
    title: "Kích hoạt & sử dụng",
    body: "Cài đặt, kích hoạt và bắt đầu bảo vệ.",
    Icon: ShieldCheck,
  },
];

export const SECURITY_FALLBACK_FEATURED: SecurityFeaturedProduct[] = [
  {
    id: "fb-bitdefender",
    title: "Bitdefender Total Security",
    href: "/products?q=bitdefender",
    brandLabel: "Bitdefender",
    meta: "1 Device · 1 Year",
    priceLabel: "790.000 đ / năm",
    priceHint: "Giá tham khảo",
    features: ["Bảo vệ đa lớp", "Chống ransomware", "VPN cơ bản (theo gói)"],
    brand: "bitdefender",
  },
  {
    id: "fb-kaspersky",
    title: "Kaspersky Internet Security",
    href: "/products?q=kaspersky",
    brandLabel: "Kaspersky",
    meta: "1 Device · 1 Year",
    priceLabel: "690.000 đ / năm",
    priceHint: "Giá tham khảo",
    features: ["Chống malware", "Bảo vệ ngân hàng", "Kiểm soát phụ huynh"],
    brand: "kaspersky",
  },
  {
    id: "fb-eset",
    title: "ESET NOD32 Antivirus",
    href: "/products?q=eset",
    brandLabel: "ESET",
    meta: "1 Device · 1 Year",
    priceLabel: "590.000 đ / năm",
    priceHint: "Giá tham khảo",
    features: ["Nhẹ tài nguyên", "Phát hiện chủ động", "Cập nhật liên tục"],
    brand: "eset",
  },
  {
    id: "fb-symantec",
    title: "Norton 360 Deluxe",
    href: "/products?q=norton",
    brandLabel: "Symantec / Norton",
    meta: "1 Device · 1 Year",
    priceLabel: "850.000 đ / năm",
    priceHint: "Giá tham khảo",
    features: ["Antivirus + VPN", "Dark Web Monitoring", "Cloud backup (theo gói)"],
    brand: "symantec",
  },
  {
    id: "fb-acronis",
    title: "Acronis Cyber Protect Home",
    href: "/products?q=acronis",
    brandLabel: "Acronis",
    meta: "1 Device · 1 Year",
    priceLabel: "Liên hệ",
    features: ["Antivirus + Backup", "Chống ransomware", "Khôi phục nhanh"],
    brand: "acronis",
  },
];

export function SecuritySolutionLanding({ featured, usingFallback }: Props) {
  const products = featured.slice(0, 5);
  const showFeatured = products.length > 0;

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.06),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-11">
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Bảo mật</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-10">
            <div className="min-w-0">
              <h1 className={`max-w-[16ch] ${HERO_TITLE_CLASS}`}>
                Bảo vệ những gì quan trọng nhất
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Giải pháp bảo mật toàn diện giúp cá nhân và doanh nghiệp chống lại
                mối đe dọa số — endpoint, email, dữ liệu và danh tính.
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
                  href="/products?cat=security"
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

            <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
              <SecurityHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust points ─────────────────────────────────────── */}
      <section className="bg-navy">
        <div className="home-container py-6 md:py-7">
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
      <section className="py-9 md:py-11">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>
              Bảo vệ toàn diện trước mọi mối đe dọa
            </h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>

          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3.5">
            {PILLARS.map((p) => (
              <li key={p.title}>
                <article
                  className={`flex h-full flex-col items-start rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <p.Icon size={22} strokeWidth={1.7} />
                  </span>
                  <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{p.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      {showFeatured ? (
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Giải pháp bảo mật phù hợp với bạn</h2>
              {usingFallback ? (
                <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>
                  Giá tham khảo — xác nhận khi xem chi tiết hoặc tư vấn.
                </p>
              ) : null}
            </div>
            <Link href="/products?cat=security" className={LINK_ACCENT_CLASS}>
              Xem tất cả sản phẩm →
            </Link>
          </div>

          <div className="relative pr-0 lg:pr-12">
            <ul className="grid auto-rows-fr grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              {products.map((p) => (
                <li key={p.id} className="flex min-h-0 min-w-0">
                  <article
                    className={`flex h-full w-full flex-col rounded-2xl border border-border bg-white p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <div className="flex min-h-[52px] items-start gap-2.5">
                      <span className="mt-0.5 shrink-0" aria-hidden>
                        <SecurityBrandMark brand={p.brand} size={36} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`${BADGE_CLASS} font-semibold text-muted`}>
                          {p.brandLabel}
                        </p>
                        <h3 className={`${CARD_TITLE_CLASS} mt-0.5 line-clamp-2 min-h-[2.5rem]`}>
                          {p.title}
                        </h3>
                      </div>
                    </div>
                    <p className={`mt-2 ${CARD_META_CLASS} line-clamp-1`}>{p.meta}</p>
                    <p className={`mt-2 ${CARD_PRICE_CLASS} min-h-[1.5rem] text-navy`}>
                      {p.priceLabel}
                    </p>
                    {p.priceHint ? (
                      <p className={`mt-0.5 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                    ) : (
                      <p className="mt-0.5 h-4" aria-hidden />
                    )}
                    <ul className="mt-3 flex min-h-[4.5rem] flex-col gap-1.5">
                      {p.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex gap-2">
                          <span
                            className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent text-white"
                            aria-hidden
                          >
                            <Check size={10} strokeWidth={3} />
                          </span>
                          <span className="line-clamp-2 text-xs leading-snug text-muted">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={p.href}
                      className={`mt-auto inline-flex h-9 w-full items-center justify-center rounded-xl bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                    >
                      Mua ngay →
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
            <Link
              href="/products?cat=security"
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
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-5 py-8 sm:px-8 sm:py-9 lg:px-10">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(14,165,164,0.18),transparent_45%),radial-gradient(circle_at_12%_80%,rgba(14,165,233,0.1),transparent_40%)]"
              aria-hidden
            />
            <div className="relative grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
              <div>
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Vì sao chọn giải pháp bảo mật từ KEYON?
                </h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-300 md:text-[15px]">
                  Không chỉ bán key — KEYON giúp bạn chọn đúng gói, nhận đúng loại và
                  quản lý trong Tài khoản sau khi mua.
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {WHY.map((w) => (
                  <li key={w.title} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/40 text-accent"
                      aria-hidden
                    >
                      <w.Icon size={18} strokeWidth={1.85} />
                    </span>
                    <div>
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
      <section className="pb-8 md:pb-9">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>4 bước đơn giản để được bảo vệ</h2>
            <div className="mx-auto mt-2.5 h-1 w-14 rounded-full bg-accent" aria-hidden />
          </header>
          <ol className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
            {STEPS.map((s, i) => (
              <li key={s.n} className="relative flex items-start gap-3">
                {i < STEPS.length - 1 ? (
                  <span
                    className="pointer-events-none absolute left-[5.25rem] top-5 hidden h-px w-[calc(100%-4.25rem)] border-t border-dashed border-border lg:block"
                    aria-hidden
                  />
                ) : null}
                <div className="relative z-[1] flex shrink-0 items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
                    {s.n}
                  </span>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <s.Icon size={18} strokeWidth={1.85} />
                  </span>
                </div>
                <div className="min-w-0 pt-1">
                  <p className={CARD_TITLE_CLASS}>{s.title}</p>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="pb-9 md:pb-11">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent via-[#0d9a93] to-[#0a6e6a] px-5 py-6 sm:px-8 sm:py-7">
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <div className="flex items-start gap-3 sm:items-center">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/20 text-white"
                  aria-hidden
                >
                  <Headphones size={20} strokeWidth={1.85} />
                </span>
                <div>
                  <p className={`${SECTION_TITLE_CLASS} text-[1.15rem] text-white sm:text-xl`}>
                    Chưa biết giải pháp nào phù hợp?
                  </p>
                  <p className="mt-1 text-sm text-white/85">
                    Đội ngũ KEYON hỗ trợ chọn gói bảo mật theo thiết bị và ngân sách.
                  </p>
                </div>
              </div>
              <Link
                href="/contact/quote"
                className={`inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-white px-5 ${CTA_LABEL_CLASS} text-accent ${TRANSITION_UI} hover:bg-white/95`}
              >
                Liên hệ tư vấn miễn phí →
              </Link>
            </div>
          </div>
        </div>
      </section>
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
    <div className="relative mx-auto aspect-square w-full max-w-[420px]">
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
