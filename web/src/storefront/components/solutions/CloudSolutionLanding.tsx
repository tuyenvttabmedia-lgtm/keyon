import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgePercent,
  Building2,
  Cloud,
  CloudUpload,
  CreditCard,
  Database,
  Eye,
  Globe2,
  HardDrive,
  Headphones,
  Maximize2,
  Monitor,
  Network,
  Rocket,
  Server,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Zap,
  Check,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
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

export type CloudFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  specs: string[];
  priceLabel: string;
  priceHint?: string;
  icon?: "server" | "storage" | "backup" | "database" | "pro";
};

type Props = {
  featured: CloudFeaturedProduct[];
  /** True when showing illustrative fallback cards (no catalog SKUs). */
  usingFallback?: boolean;
};

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };
const ICON_MD = { size: 22, strokeWidth: 1.75, "aria-hidden": true as const };
const ICON_LG = { size: 28, strokeWidth: 1.65, "aria-hidden": true as const };

const SERVICES: {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: "Cloud Infrastructure",
    description: "Máy chủ ảo linh hoạt — CPU, RAM, SSD theo nhu cầu vận hành.",
    href: "/products?cat=cloud",
    Icon: Cloud,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Cloud Storage",
    description: "Lưu trữ đối tượng / file, mở rộng dung lượng khi cần.",
    href: "/products?q=storage",
    Icon: HardDrive,
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Cloud Database",
    description: "Cơ sở dữ liệu managed — triển khai nhanh, vận hành ổn định.",
    href: "/contact/quote",
    Icon: Database,
    tone: "bg-teal-100 text-teal-800",
  },
  {
    title: "Cloud Backup",
    description: "Sao lưu endpoint, cloud và máy chủ — khôi phục khi sự cố.",
    href: "/solutions/backup",
    Icon: CloudUpload,
    tone: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Cloud Network",
    description: "Kết nối, bảo vệ cạnh biên và tối ưu băng thông dịch vụ.",
    href: "/contact/quote",
    Icon: Network,
    tone: "bg-violet-100 text-violet-700",
  },
];

const PLATFORMS: { name: string; tint: string; Logo: () => ReactNode }[] = [
  { name: "Microsoft Azure", tint: "bg-[#0078D4]/10 text-[#0078D4]", Logo: AzureMark },
  { name: "AWS", tint: "bg-[#FF9900]/10 text-[#FF9900]", Logo: AwsMark },
  { name: "Google Cloud", tint: "bg-[#4285F4]/10 text-[#4285F4]", Logo: GcpMark },
  { name: "Acronis", tint: "bg-[#1A73E8]/10 text-[#1A73E8]", Logo: AcronisMark },
  { name: "Cloudflare", tint: "bg-[#F6821F]/10 text-[#F6821F]", Logo: CloudflareMark },
  { name: "Veeam", tint: "bg-[#00B336]/10 text-[#00B336]", Logo: VeeamMark },
];

const TRUST: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Hạ tầng toàn cầu",
    body: "Datacenter tại nhiều quốc gia qua hệ sinh thái đối tác.",
    Icon: Globe2,
  },
  {
    title: "Hiệu năng vượt trội",
    body: "SSD NVMe · băng thông cao khi chọn đúng cấu hình.",
    Icon: Zap,
  },
  {
    title: "Bảo mật đa lớp",
    body: "Firewall, DDoS, mã hóa dữ liệu theo từng gói.",
    Icon: ShieldCheck,
  },
  {
    title: "Theo dõi vận hành",
    body: "Đội ngũ kỹ thuật hỗ trợ tiếng Việt sau triển khai.",
    Icon: Eye,
  },
  {
    title: "SLA 99.9%",
    body: "Cam kết uptime theo điều kiện nhà cung cấp & gói.",
    Icon: BadgePercent,
  },
];

const SEGMENTS: {
  title: string;
  description: string;
  items: string[];
  href: string;
  cta: string;
  highlight: boolean;
  Icon: LucideIcon;
}[] = [
  {
    title: "Doanh nghiệp vừa & nhỏ",
    description: "Khởi đầu gọn, chi phí kiểm soát, triển khai nhanh.",
    items: [
      "Máy chủ ảo cơ bản",
      "Lưu trữ an toàn",
      "Hỗ trợ kỹ thuật chuyên nghiệp",
    ],
    href: "/products?cat=cloud",
    cta: "Khám phá giải pháp →",
    highlight: false,
    Icon: Store,
  },
  {
    title: "Doanh nghiệp phát triển",
    description: "Mở rộng tài nguyên theo từng giai đoạn tăng trưởng.",
    items: [
      "Mở rộng linh hoạt theo nhu cầu",
      "Cơ sở dữ liệu hiệu năng cao",
      "Mạng lưới tối ưu",
    ],
    href: "/business",
    cta: "Khám phá giải pháp →",
    highlight: true,
    Icon: TrendingUp,
  },
  {
    title: "Doanh nghiệp lớn",
    description: "Kiến trúc đa vùng, bảo mật nghiêm ngặt, đồng hành dài hạn.",
    items: [
      "Kiến trúc đa vùng",
      "Tiêu chuẩn bảo mật nghiêm ngặt",
      "Hỗ trợ tiếng Việt theo thỏa thuận",
      "Tư vấn & báo giá dự án",
    ],
    href: "/contact/quote",
    cta: "Liên hệ tư vấn →",
    highlight: false,
    Icon: Building2,
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Chọn dịch vụ", body: "Chọn gói cloud phù hợp nhu cầu.", Icon: ShoppingCart },
  { title: "Thanh toán", body: "VietQR / chuyển khoản — rõ ràng.", Icon: CreditCard },
  { title: "Triển khai", body: "Nhận deliverable hoặc bàn giao hỗ trợ.", Icon: CloudUpload },
  { title: "Sử dụng", body: "Theo dõi trong Tài khoản KEYON.", Icon: Monitor },
];

const HERO_VALUES: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Triển khai nhanh chóng", body: "Sẵn sàng trong vài phút", Icon: Rocket },
  { title: "Bảo mật & tin cậy", body: "Tiêu chuẩn bảo mật quốc tế", Icon: ShieldCheck },
  { title: "Linh hoạt & mở rộng", body: "Mở rộng theo nhu cầu", Icon: Maximize2 },
];

const PRODUCT_ICONS: Record<NonNullable<CloudFeaturedProduct["icon"]>, LucideIcon> = {
  server: Server,
  pro: Activity,
  storage: HardDrive,
  backup: CloudUpload,
  database: Database,
};

export function CloudSolutionLanding({ featured, usingFallback }: Props) {
  const showFeatured = featured.length > 0;

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,164,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.06),_transparent_50%)]"
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Cloud</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>
                Cloud linh hoạt
                <span className="mt-1 block">Cho doanh nghiệp hiện đại</span>
              </h1>
              <p className={`mt-4 max-w-lg ${PAGE_LEAD_CLASS}`}>
                Khai thác sức mạnh của cloud để triển khai nhanh hơn, vận hành ổn định
                và mở rộng linh hoạt — tối ưu chi phí và bảo mật cho doanh nghiệp.
              </p>

              <ul className="mt-6 grid gap-4 sm:grid-cols-3 sm:gap-3">
                {HERO_VALUES.map((item) => (
                  <li key={item.title} className="flex gap-3 sm:flex-col sm:gap-2">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <item.Icon {...ICON_SM} />
                    </span>
                    <span>
                      <span className={`block ${CARD_TITLE_CLASS}`}>{item.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=cloud"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá dịch vụ cloud →
                </Link>
                <Link
                  href="/contact/quote"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <Headphones {...ICON_SM} />
                  Tư vấn giải pháp
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <CloudHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ cloud toàn diện</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Đáp ứng mọi nhu cầu từ hạ tầng đến ứng dụng cho doanh nghiệp.
            </p>
          </header>
          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <article
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.tone}`}
                    aria-hidden
                  >
                    <s.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS} text-[15px]`}>{s.title}</h3>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{s.description}</p>
                  <Link
                    href={s.href}
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

      {/* ── Platforms ────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface py-9 md:py-10">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng & công nghệ</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Hệ sinh thái đối tác và công nghệ phổ biến cho giải pháp cloud.
            </p>
          </header>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
            {PLATFORMS.map((p) => (
              <li
                key={p.name}
                className={`flex min-w-[7.5rem] items-center gap-2.5 rounded-xl border border-border bg-white px-3.5 py-2.5 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${p.tint}`}
                  aria-hidden
                >
                  <p.Logo />
                </span>
                <span className={`${CARD_TITLE_CLASS} text-muted`}>{p.name}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 rounded-2xl border border-border/70 bg-white px-4 py-5 sm:px-6 md:py-6">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3">
              {TRUST.map((t) => (
                <li
                  key={t.title}
                  className="flex flex-col items-start gap-2 text-left lg:items-center lg:text-center"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <t.Icon {...ICON_SM} />
                  </span>
                  <div>
                    <p className={CARD_TITLE_CLASS}>{t.title}</p>
                    <p className={`mt-1 ${CARD_META_CLASS}`}>{t.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Segments ─────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo nhu cầu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn hướng phù hợp quy mô — từ SME đến doanh nghiệp lớn.
            </p>
          </header>
          <ul className="mt-7 grid gap-4 md:grid-cols-3">
            {SEGMENTS.map((seg) => (
              <li key={seg.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                    seg.highlight
                      ? "border-accent/35 bg-gradient-to-b from-accent-soft/80 to-white"
                      : `border-border bg-white ${ELEVATION_HAIRLINE}`
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      seg.highlight ? "bg-accent text-white" : "bg-navy text-white"
                    }`}
                    aria-hidden
                  >
                    <seg.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${SUBSECTION_TITLE_CLASS}`}>{seg.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{seg.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {seg.items.map((item) => (
                      <li key={item} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
                          aria-hidden
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={seg.href}
                    className={`mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl px-4 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                      seg.highlight
                        ? `bg-accent text-white hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`
                        : "border border-border bg-white text-accent hover:border-accent"
                    }`}
                  >
                    {seg.cta}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Featured products ────────────────────────────────── */}
      {showFeatured ? (
      <section className="border-t border-border bg-surface py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm & dịch vụ nổi bật</h2>
              <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>
                {usingFallback
                  ? "Cấu hình tham khảo — xác nhận giá và tồn kho khi tư vấn hoặc xem catalog."
                  : "Gói đang có trên catalog KEYON — xem chi tiết trước khi mua."}
              </p>
            </div>
            <Link href="/products?cat=cloud" className={`shrink-0 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả dịch vụ →
            </Link>
          </div>
          <ul className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-4">
            {featured.map((p) => {
              const Glyph = PRODUCT_ICONS[p.icon ?? "server"];
              return (
                <li key={p.id}>
                  <article
                    className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-slate-700 text-white"
                      aria-hidden
                    >
                      <Glyph {...ICON_SM} />
                    </span>
                    <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                    <ul className="mt-2 space-y-1 border-b border-border/70 pb-3">
                      {p.specs.map((spec) => (
                        <li key={spec} className={CARD_META_CLASS}>
                          {spec}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 font-display text-[15px] font-bold tabular-nums tracking-tight text-navy">
                      {p.priceLabel}
                    </p>
                    {p.priceHint ? (
                      <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                    ) : null}
                    <Link
                      href={p.href}
                      className={`mt-auto pt-4 inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                    >
                      Xem chi tiết
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      ) : null}

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="py-9 md:py-11 lg:py-12">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai đơn giản</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Bốn bước rõ ràng — từ chọn gói đến sử dụng trên KEYON.
            </p>
          </header>
          <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-9 z-0 hidden border-t border-dashed border-accent/35 lg:block"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative z-[1] text-center">
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
              </li>
            ))}
          </ol>
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
                  Sẵn sàng đưa doanh nghiệp lên cloud?
                </h2>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-300 md:text-[15px]">
                  Nhận tư vấn cấu hình, báo giá và hỗ trợ triển khai từ đội ngũ KEYON.
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/products?cat=cloud"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá dịch vụ cloud
                </Link>
                <Link
                  href="/contact/quote"
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

/** Illustrative cards when catalog has no cloud SKUs — prices are reference only. */
export const CLOUD_FALLBACK_FEATURED: CloudFeaturedProduct[] = [
  {
    id: "fb-1",
    title: "Cloud Server",
    href: "/contact/quote",
    specs: ["CPU 2 vCPU · RAM 4GB", "SSD 80GB"],
    priceLabel: "280.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "server",
  },
  {
    id: "fb-2",
    title: "Cloud Server Pro",
    href: "/contact/quote",
    specs: ["CPU 4 vCPU · RAM 8GB", "SSD 160GB"],
    priceLabel: "520.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "pro",
  },
  {
    id: "fb-3",
    title: "Cloud Storage 500GB",
    href: "/contact/quote",
    specs: ["Object storage", "Mở rộng linh hoạt"],
    priceLabel: "150.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "storage",
  },
  {
    id: "fb-4",
    title: "Cloud Backup",
    href: "/solutions/backup",
    specs: ["Endpoint · cloud · server", "Khôi phục khi sự cố"],
    priceLabel: "190.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "backup",
  },
  {
    id: "fb-5",
    title: "Cloud Database",
    href: "/contact/quote",
    specs: ["Managed database", "Tư vấn trước triển khai"],
    priceLabel: "Liên hệ báo giá",
    icon: "database",
  },
];

/* ── Brand marks (simplified, recognizable) ─────────────────────────────── */

function AzureMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13.05 4.24 6.28 18.81h5.12l6.89-14.57H13.05Zm1.66 4.28L9.9 19.76h8.88L22 8.52h-7.29Z" />
    </svg>
  );
}

function AwsMark() {
  return (
    <svg width="18" height="11" viewBox="0 0 24 14" fill="none" aria-hidden>
      <path
        d="M6.8 5.1c0 .4.1.7.3.9.2.2.6.4 1.1.6l1.5.6c.9.3 1.5.7 1.9 1.2.4.5.6 1.1.6 1.9 0 .8-.2 1.5-.7 2.1-.5.6-1.2 1-2.2 1.1v1.1H7.7V13c-1.1-.1-2-.5-2.6-1.2-.6-.7-.9-1.5-.9-2.5h1.7c0 .5.2.9.5 1.2.3.3.8.5 1.3.5.6 0 1-.1 1.3-.4.3-.3.4-.6.4-1 0-.4-.2-.7-.5-.9-.3-.2-.8-.5-1.4-.7L6.6 7.5C5.8 7.2 5.2 6.7 4.9 6.1c-.3-.6-.5-1.2-.5-1.9 0-.8.3-1.5.8-2 .5-.6 1.3-.9 2.2-1v-1h1.6v1c1 .1 1.7.4 2.3 1 .5.6.8 1.3.8 2.2H10.4c0-.5-.1-.8-.4-1.1-.3-.2-.7-.4-1.2-.4-.5 0-.9.1-1.1.4-.3.2-.4.5-.4.9Z"
        fill="currentColor"
      />
      <path
        d="M18.2 1.2c1.1 0 2 .3 2.7 1 .7.6 1.1 1.5 1.2 2.6h-1.7c-.1-.6-.3-1-.7-1.3-.4-.3-.9-.4-1.5-.4-.9 0-1.6.3-2.1 1-.5.7-.8 1.6-.8 2.8s.3 2.1.8 2.8c.5.7 1.2 1 2.1 1 .6 0 1.1-.1 1.5-.4.4-.3.6-.8.7-1.3h1.7c-.1 1.1-.5 2-1.2 2.6-.7.6-1.6 1-2.7 1-1.5 0-2.7-.5-3.6-1.5-.9-1-1.3-2.3-1.3-4s.4-3 1.3-4c.9-1 2.1-1.5 3.6-1.5Z"
        fill="currentColor"
      />
      <path
        d="M1.2 12.6c2.2 1.3 5.1 2 8 2 3.4 0 6.7-.8 9.3-2.4.3-.2.6.1.4.4-2.1 2.8-5.9 4.4-10 4.4-4.2 0-7.9-1.7-9.8-4.2-.2-.3.2-.6.5-.4.5.3 1 .5 1.6.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GcpMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M12 11.5 7.2 4.2A9.9 9.9 0 0 1 12 3c2.5 0 4.8.9 6.5 2.5L15 9.2A5 5 0 0 0 12 8.5c-.9 0-1.7.2-2.4.6L12 11.5Z" />
      <path fill="#EA4335" d="m12 11.5 2.4-2.4A5 5 0 0 1 17 12c0 1.1-.4 2.2-1 3L12 11.5Z" />
      <path fill="#FBBC04" d="M16 15a5 5 0 0 1-8.3 1.7L4.2 19A9.9 9.9 0 0 0 22 12c0-1.4-.3-2.7-.8-3.9L16 15Z" />
      <path fill="#34A853" d="M7.7 16.7A5 5 0 0 1 7 12c0-1.3.5-2.5 1.4-3.4L4.9 5.1A9.9 9.9 0 0 0 2 12c0 2.7 1.1 5.1 2.8 6.9l2.9-2.2Z" />
    </svg>
  );
}

function AcronisMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3.2 3.5 18.5h3.4L12 8.4l5.1 10.1h3.4L12 3.2Zm0 8.6-2.7 5.3h5.4L12 11.8Z" />
    </svg>
  );
}

function CloudflareMark() {
  return (
    <svg width="18" height="10" viewBox="0 0 24 14" fill="currentColor" aria-hidden>
      <path d="M16.4 10.8H4.2c-.5 0-.9-.2-1.2-.6-.3-.4-.3-.9-.1-1.3l.3-.6c.2-.3.5-.5.9-.5h.2c-.1-.2-.1-.4-.1-.6 0-1.5 1.2-2.7 2.7-2.7.4 0 .8.1 1.2.3C8.7 3.4 10.1 2.2 12 2.2c1.8 0 3.3 1.2 3.7 2.9h.3c1.3 0 2.4 1 2.5 2.3.6.2 1 1 1 1.7 0 1-.8 1.7-1.7 1.7h-1.4Zm-10-2.2h10.7c.3 0 .5-.2.5-.5s-.1-.4-.3-.5c-.1-.3-.5-.6-1-.6h-1.7l-.2-.9c-.2-1.1-1.2-1.9-2.3-1.9-1 0-1.9.6-2.2 1.5l-.2.6-.6-.2c-.2-.1-.5-.1-.7-.1-.8 0-1.5.7-1.5 1.5 0 .1 0 .2.1.3l.3.7H6.4l-.3.5c-.1.1 0 .3.1.3h.2Z" />
    </svg>
  );
}

function VeeamMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.2 5.2h4.1L12 15.4l4.7-10.2h4.1L13.6 19.6h-3.2L3.2 5.2Z" />
    </svg>
  );
}

function CloudHeroArt() {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-gradient-to-br from-[#f0f9ff] via-[#ecfeff] to-[#f0fdfa] p-5 sm:p-6 ${ELEVATION_FLOAT}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(14,165,164,0.18),transparent_45%)]"
        aria-hidden
      />

      <div className="relative mx-auto aspect-[5/4] w-full max-w-[460px]">
        <svg
          viewBox="0 0 460 368"
          className="h-full w-full"
          role="img"
          aria-label="Minh họa giải pháp cloud KEYON"
        >
          <defs>
            <linearGradient id="ckCloud" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#ccfbf1" />
              <stop offset="100%" stopColor="#5eead4" stopOpacity="0.55" />
            </linearGradient>
            <linearGradient id="ckNode" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <filter id="ckSoft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0f172a" floodOpacity="0.08" />
            </filter>
          </defs>

          <ellipse cx="230" cy="330" rx="130" ry="14" fill="#0f172a" opacity="0.07" />

          <path
            d="M90 250 L230 190 L370 250 L230 310 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
            opacity="0.9"
          />

          <g filter="url(#ckSoft)">
            <path
              d="M128 200c0-36 28-64 64-64 10-30 40-50 74-50 44 0 78 32 82 74 30 4 54 28 54 58 0 34-28 60-62 60H154c-36 0-66-26-66-58 0-10 2-18 6-26z"
              fill="url(#ckCloud)"
              stroke="#0ea5a4"
              strokeWidth="1.75"
            />
            <circle cx="230" cy="208" r="34" fill="#0b1f3a" />
            <text
              x="230"
              y="220"
              textAnchor="middle"
              fill="#fff"
              fontSize="30"
              fontWeight="700"
              fontFamily="var(--font-display),system-ui,sans-serif"
            >
              K
            </text>
          </g>

          <g filter="url(#ckSoft)">
            <rect x="42" y="120" width="64" height="46" rx="10" fill="url(#ckNode)" stroke="#cbd5e1" />
            <rect x="52" y="132" width="28" height="4" rx="1" fill="#94a3b8" />
            <rect x="52" y="142" width="40" height="4" rx="1" fill="#cbd5e1" />
            <circle cx="92" cy="134" r="3" fill="#0ea5a4" />

            <rect x="352" y="100" width="58" height="42" rx="10" fill="url(#ckNode)" stroke="#cbd5e1" />
            <rect x="362" y="112" width="24" height="4" rx="1" fill="#94a3b8" />
            <rect x="362" y="122" width="34" height="4" rx="1" fill="#cbd5e1" />

            <rect x="340" y="250" width="70" height="48" rx="10" fill="url(#ckNode)" stroke="#cbd5e1" />
            <path d="M354 268h42M354 278h28" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />

            <rect x="56" y="250" width="54" height="40" rx="10" fill="url(#ckNode)" stroke="#cbd5e1" />
            <circle cx="74" cy="270" r="6" fill="#e0f2fe" stroke="#38bdf8" />
          </g>

          <path
            d="M106 150c24 12 48 28 84 40"
            stroke="#94a3b8"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="5 5"
          />
          <path
            d="M352 130c-24 16-48 36-80 48"
            stroke="#94a3b8"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="5 5"
          />
        </svg>

        <div
          className={`absolute left-0 top-[10%] max-w-[10rem] rounded-xl border border-border bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_HAIRLINE} sm:left-1 sm:max-w-[11rem]`}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700"
              aria-hidden
            >
              <Zap size={14} strokeWidth={2} />
            </span>
            <div>
              <p className={`${BADGE_CLASS} font-semibold text-navy`}>Hiệu suất cao</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>SSD · băng thông</p>
            </div>
          </div>
        </div>
        <div
          className={`absolute right-0 top-[6%] max-w-[10rem] rounded-xl border border-border bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_HAIRLINE} sm:right-1 sm:max-w-[11rem]`}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800"
              aria-hidden
            >
              <ShieldCheck size={14} strokeWidth={2} />
            </span>
            <div>
              <p className={`${BADGE_CLASS} font-semibold text-navy`}>Bảo mật đa lớp</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>Firewall · mã hóa</p>
            </div>
          </div>
        </div>
        <div
          className={`absolute bottom-[4%] left-1/2 max-w-[12rem] -translate-x-1/2 rounded-xl border border-border bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_HAIRLINE}`}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700"
              aria-hidden
            >
              <Maximize2 size={14} strokeWidth={2} />
            </span>
            <div>
              <p className={`${BADGE_CLASS} font-semibold text-navy`}>Linh hoạt mở rộng</p>
              <p className={`mt-0.5 ${CARD_META_CLASS}`}>Scale theo nhu cầu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
