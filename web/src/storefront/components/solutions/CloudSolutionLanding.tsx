import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Cloud,
  CloudUpload,
  CreditCard,
  HardDrive,
  Headphones,
  Monitor,
  Server,
  ShieldCheck,
  ShoppingCart,
  Store,
  TrendingUp,
  Check,
} from "lucide-react";
import { LANDING_CRUMB_GAP, LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import { BrandLogo } from "@/storefront/brand-logo";
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
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { SolutionFinalCta } from "./SolutionFinalCta";

export type CloudFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  specs: string[];
  priceLabel: string;
  priceHint?: string;
  imageUrl?: string;
  icon?: "server" | "storage" | "backup" | "database" | "pro";
};

type Props = {
  featured: CloudFeaturedProduct[];
  /** Desktop hero photo. Empty → built-in photo until CMS has an upload. */
  heroImageUrl?: string;
};

const CLOUD_HERO_FALLBACK = "/services/cloud-solution-photo.jpg";

const ICON_SM = { size: 18, strokeWidth: 1.85, "aria-hidden": true as const };
const ICON_MD = { size: 22, strokeWidth: 1.75, "aria-hidden": true as const };

const SERVICES: {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
  tone: string;
}[] = [
  {
    title: "Cloud Infrastructure",
    description: "VPS Linux, VPS Windows và Dedicated Server trên catalog KEYON. Khách tự quản trị.",
    href: "/categories/cloud",
    Icon: Cloud,
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Cloud Storage & Backup",
    description: "Gói lưu trữ và license sao lưu — kích hoạt trên hạ tầng của bạn.",
    href: "/solutions/backup",
    Icon: HardDrive,
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Cloud Security",
    description: "License bảo mật trên catalog, theo điều kiện của từng nhà cung cấp.",
    href: "/categories/security",
    Icon: ShieldCheck,
    tone: "bg-teal-100 text-teal-800",
  },
];

const PLATFORMS: { name: string; logo: string; wide?: boolean }[] = [
  { name: "Microsoft Azure", logo: "azure" },
  { name: "AWS", logo: "aws", wide: true },
  { name: "Google Cloud", logo: "googlecloud" },
  { name: "Acronis", logo: "acronis" },
  { name: "Cloudflare", logo: "cloudflare" },
  { name: "Veeam", logo: "veeam", wide: true },
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
    description: "Chọn gói catalog theo ngân sách — mua ngay hoặc gửi báo giá.",
    items: [
      "VPS Linux, VPS Windows và Dedicated Server theo cấu hình trên catalog",
      "Thời hạn rõ trước khi đăng ký",
      "Hỗ trợ kỹ thuật từ KEYON",
    ],
    href: "/categories/cloud",
    cta: "Xem VPS →",
    highlight: false,
    Icon: Store,
  },
  {
    title: "Doanh nghiệp phát triển",
    description: "Tăng số lượng seat / gói theo giai đoạn — báo giá theo quy mô.",
    items: [
      "Báo giá theo số người dùng",
      "Gói liên quan trên catalog",
      "Theo dõi đơn trong Tài khoản",
    ],
    href: "/business",
    cta: "Xem dành cho DN →",
    highlight: true,
    Icon: TrendingUp,
  },
  {
    title: "Doanh nghiệp lớn",
    description: "Volume / báo giá dự án — bàn giao checklist; không vận hành tenant thuê ngoài.",
    items: [
      "Báo giá theo dự án / số lượng",
      "Bàn giao & checklist kích hoạt",
      "Hỗ trợ tiếng Việt qua ticket / kinh doanh",
      "Phối hợp khi cần MSP hạ tầng",
    ],
    href: "/contact/quote",
    cta: "Gửi yêu cầu báo giá →",
    highlight: false,
    Icon: Building2,
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Chọn gói", body: "Chọn sản phẩm Cloud hoặc hạ tầng phù hợp.", Icon: ShoppingCart },
  { title: "Thanh toán", body: "Thanh toán theo phương thức được hỗ trợ trên KEYON.", Icon: CreditCard },
  { title: "Nhận bàn giao", body: "Nhận thông tin truy cập VPS sau khi KEYON xử lý provisioning.", Icon: CloudUpload },
  { title: "Theo dõi", body: "Theo dõi thông tin sản phẩm và hỗ trợ trong Tài khoản KEYON.", Icon: Monitor },
];

const HERO_VALUES: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Gói trên catalog",
    body: "Đăng ký VPS hoặc thuê Dedicated Server đang được KEYON cung cấp.",
    Icon: ShoppingCart,
  },
  {
    title: "Loại nhận rõ ràng",
    body: "Biết trước cấu hình, thời hạn và thông tin bàn giao.",
    Icon: ShieldCheck,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Hỗ trợ kỹ thuật từ KEYON trong phạm vi gói.",
    Icon: Headphones,
  },
];

const PRODUCT_ICONS: Record<NonNullable<CloudFeaturedProduct["icon"]>, LucideIcon> = {
  server: Server,
  pro: Server,
  storage: HardDrive,
  backup: CloudUpload,
  database: HardDrive,
};

export function CloudSolutionLanding({ featured, heroImageUrl }: Props) {
  const products = featured.slice(0, 4);
  const showFeatured = products.length > 0;
  const heroSrc = heroImageUrl?.trim() || CLOUD_HERO_FALLBACK;

  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-border bg-white">
        <div className={`home-container relative overflow-hidden ${LANDING_HERO_PAD}`}>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[54%] overflow-hidden lg:block">
            <Image
              src={heroSrc}
              alt=""
              fill
              priority
              sizes="(min-width: 1200px) 680px, 54vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative">
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Cloud & Hạ tầng</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
            <div className="flex min-w-0 flex-col">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>
                Cloud & Hạ tầng cho doanh nghiệp
              </h1>
              <p className={`mt-3 max-w-lg sm:mt-4 ${PAGE_LEAD_CLASS}`}>
                VPS Linux, VPS Windows và Dedicated Server trên KEYON. Khách tự quản trị. Cấu hình và thời hạn rõ
                trước khi đăng ký.
              </p>

              <ul className="order-3 mt-5 grid gap-3 sm:order-none sm:mt-7 sm:grid-cols-3 sm:gap-5">
                {HERO_VALUES.map((item) => (
                  <li key={item.title} className="flex items-start gap-3 sm:flex-col sm:gap-2">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <item.Icon {...ICON_SM} />
                    </span>
                    <span className="min-w-0">
                      <span className={`block ${CARD_TITLE_CLASS}`}>{item.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <p className={`order-4 mt-4 max-w-lg sm:order-none sm:mt-5 ${BODY_MUTED_CLASS}`}>
                Lưu ý: VPS và Dedicated Server trên catalog là self-managed. KEYON không quản trị hệ điều hành, ứng dụng
                hay hạ tầng Cloud thuê ngoài của doanh nghiệp.
              </p>

              <div className="order-2 mt-5 flex flex-col gap-3 sm:order-none sm:mt-7 sm:flex-row sm:flex-wrap">
                <Link
                  href="/categories/cloud"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Xem VPS →
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

            <div className="hidden lg:block lg:min-h-[420px]" aria-hidden />
          </div>
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Danh mục Cloud & Hạ tầng</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Khám phá các nhóm sản phẩm Cloud và hạ tầng đang được cung cấp trên KEYON.
            </p>
          </header>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {SERVICES.map((s, index) => (
              <li key={s.title} className={index === SERVICES.length - 1 ? "col-span-2 lg:col-span-1" : undefined}>
                <article
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-3.5 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${s.tone}`}
                      aria-hidden
                    >
                      <s.Icon {...ICON_SM} />
                    </span>
                    <h3 className={`min-w-0 ${CARD_TITLE_CLASS}`}>{s.title}</h3>
                  </div>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{s.description}</p>
                  <Link
                    href={s.href}
                    className={`mt-3 inline-flex items-center gap-1 sm:mt-4 ${LINK_ACCENT_CLASS} group-hover:gap-1.5 ${TRANSITION_UI}`}
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
      <section className="border-y border-border bg-surface home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng & thương hiệu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Khám phá các nền tảng Cloud, Backup và hạ tầng đang có trên catalog KEYON.
            </p>
          </header>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-center md:gap-3">
            {PLATFORMS.map((p) => (
              <li
                key={p.name}
                className={`flex min-w-0 items-center gap-2.5 rounded-xl border border-border bg-white px-3 py-2.5 sm:min-w-[7.5rem] sm:px-3.5 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40`}
              >
                <span className="flex h-8 min-w-8 items-center justify-center" aria-hidden>
                  <BrandLogo name={p.logo} size={28} wide={p.wide} />
                </span>
                <span className={`min-w-0 ${CARD_TITLE_CLASS} text-muted`}>{p.name}</span>
              </li>
            ))}
          </ul>

          <p className={`mx-auto mt-5 max-w-2xl text-center ${BODY_MUTED_CLASS}`}>
            KEYON cung cấp sản phẩm, license hoặc gói theo từng catalog và điều kiện của nhà
            cung cấp.
          </p>
        </div>
      </section>

      {/* ── Segments ─────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo nhu cầu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chọn gói Cloud và hạ tầng phù hợp với quy mô và nhu cầu sử dụng của doanh nghiệp.
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
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${
                        seg.highlight ? "bg-accent text-white" : "bg-navy text-white"
                      }`}
                      aria-hidden
                    >
                      <seg.Icon {...ICON_SM} />
                    </span>
                    <h3 className={`min-w-0 ${SUBSECTION_TITLE_CLASS}`}>{seg.title}</h3>
                  </div>
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
      <section className="border-t border-border bg-surface home-section">
        <div className="home-container">
          <div className="mb-5 flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm & dịch vụ nổi bật</h2>
              <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>
                Sản phẩm Cloud đang được cung cấp trên KEYON — xem chi tiết trước khi mua.
              </p>
            </div>
            <Link href="/categories/cloud" className={`hidden shrink-0 lg:inline ${LINK_ACCENT_CLASS}`}>
              Xem sản phẩm Cloud →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4 lg:gap-4">
            {products.map((p) => {
              const Glyph = PRODUCT_ICONS[p.icon ?? "server"];
              const brand = p.specs[0];
              return (
                <li
                  key={p.id}
                  className={products.length % 2 === 1 ? "last:col-span-2 lg:last:col-span-1" : undefined}
                >
                  <article
                    className={`flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white sm:rounded-2xl ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                  >
                    <Link href={p.href} className="relative block aspect-[5/4] bg-white">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          fill
                          className="object-contain p-1.5"
                          sizes="(max-width: 640px) 45vw, 220px"
                        />
                      ) : (
                        <span
                          className="flex h-full items-center justify-center text-accent"
                          aria-hidden
                        >
                          <Glyph {...ICON_MD} />
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col gap-1.5 px-2.5 pb-2.5 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
                    <h3 className={`line-clamp-2 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                    {brand ? (
                      <p className={`mt-0.5 line-clamp-1 ${CARD_META_CLASS}`}>{brand}</p>
                    ) : null}
                    <p className={`mt-1.5 ${CARD_PRICE_CLASS}`}>
                      {p.priceLabel}
                    </p>
                    {p.priceHint ? (
                      <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                    ) : null}
                    <Link
                      href={p.href}
                      className={`mt-auto inline-flex h-9 w-full items-center justify-center rounded-lg bg-accent px-2 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                    >
                      Xem chi tiết
                    </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <Link
            href="/categories/cloud"
            className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-white px-4 lg:hidden ${CTA_COMPACT_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>
      ) : null}

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình mua & nhận bàn giao</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Bốn bước rõ ràng từ lựa chọn sản phẩm đến nhận thông tin bàn giao.
            </p>
          </header>
          <ol className="relative mt-6 grid gap-3 lg:mt-8 lg:grid-cols-4 lg:gap-5">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-9 z-0 hidden border-t border-dashed border-accent/35 lg:block"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className="relative z-[1] flex items-center gap-3 rounded-2xl border border-border bg-white px-3.5 py-3 text-left lg:flex-col lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:text-center"
              >
                <div className="relative shrink-0 lg:mx-auto">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-accent/25 bg-accent-soft text-accent lg:h-[4.5rem] lg:w-[4.5rem] lg:border-2 lg:bg-white ${ELEVATION_HAIRLINE}`}
                  >
                    <step.Icon size={20} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span
                    className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white lg:h-7 lg:w-7 ${BADGE_CLASS} ${ELEVATION_HAIRLINE}`}
                  >
                    {i + 1}
                  </span>
                </div>
                <div className="min-w-0 lg:mt-4">
                  <p className={CARD_TITLE_CLASS}>{step.title}</p>
                  <p className={`mt-0.5 ${CARD_META_CLASS}`}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SolutionFinalCta
        title="Chưa biết chọn gói Cloud nào phù hợp?"
        subtitle="Gửi yêu cầu cho KEYON để được tư vấn sản phẩm phù hợp với nhu cầu sử dụng và quy mô doanh nghiệp."
        primaryHref="/contact/quote"
        primaryLabel="Gửi yêu cầu tư vấn →"
        secondaryHref="/categories/cloud"
        secondaryLabel="Xem sản phẩm Cloud"
      />
    </div>
  );
}


