import Link from "next/link";
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

const SERVICES: {
  title: string;
  description: string;
  href: string;
  icon: "infra" | "storage" | "database" | "backup" | "network";
  tone: string;
}[] = [
  {
    title: "Cloud Infrastructure",
    description: "Máy chủ ảo linh hoạt — CPU, RAM, SSD theo nhu cầu vận hành.",
    href: "/products?cat=cloud",
    icon: "infra",
    tone: "bg-sky-100 text-sky-700",
  },
  {
    title: "Cloud Storage",
    description: "Lưu trữ đối tượng / file, mở rộng dung lượng khi cần.",
    href: "/products?q=storage",
    icon: "storage",
    tone: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Cloud Database",
    description: "Cơ sở dữ liệu managed — triển khai nhanh, vận hành ổn định.",
    href: "/contact/sales",
    icon: "database",
    tone: "bg-teal-100 text-teal-800",
  },
  {
    title: "Cloud Backup",
    description: "Sao lưu endpoint, cloud và máy chủ — khôi phục khi sự cố.",
    href: "/solutions/backup",
    icon: "backup",
    tone: "bg-cyan-100 text-cyan-800",
  },
  {
    title: "Cloud Network",
    description: "Kết nối, bảo vệ cạnh biên và tối ưu băng thông dịch vụ.",
    href: "/contact/sales",
    icon: "network",
    tone: "bg-violet-100 text-violet-700",
  },
];

const PLATFORMS: { name: string; mark: string; tint: string }[] = [
  { name: "Microsoft Azure", mark: "Az", tint: "text-[#0078D4]" },
  { name: "AWS", mark: "aws", tint: "text-[#FF9900]" },
  { name: "Google Cloud", mark: "G", tint: "text-[#4285F4]" },
  { name: "Acronis", mark: "Ac", tint: "text-[#1A73E8]" },
  { name: "Cloudflare", mark: "CF", tint: "text-[#F6821F]" },
  { name: "Veeam", mark: "Ve", tint: "text-[#00B336]" },
];

const TRUST: { title: string; body: string; icon: "globe" | "bolt" | "shield" | "eye" | "sla" }[] = [
  {
    title: "Hạ tầng toàn cầu",
    body: "Datacenter tại nhiều quốc gia qua hệ sinh thái đối tác.",
    icon: "globe",
  },
  {
    title: "Hiệu năng vượt trội",
    body: "SSD NVMe · băng thông cao khi chọn đúng cấu hình.",
    icon: "bolt",
  },
  {
    title: "Bảo mật đa lớp",
    body: "Firewall, DDoS, mã hóa dữ liệu theo từng gói.",
    icon: "shield",
  },
  {
    title: "Giám sát 24/7",
    body: "Đội ngũ kỹ thuật hỗ trợ tiếng Việt sau triển khai.",
    icon: "eye",
  },
  {
    title: "SLA 99.9%",
    body: "Cam kết uptime theo điều kiện nhà cung cấp & gói.",
    icon: "sla",
  },
];

const SEGMENTS: {
  title: string;
  description: string;
  items: string[];
  href: string;
  cta: string;
  highlight: boolean;
  icon: "sme" | "growth" | "enterprise";
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
    icon: "sme",
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
    icon: "growth",
  },
  {
    title: "Doanh nghiệp lớn",
    description: "Kiến trúc đa vùng, bảo mật nghiêm ngặt, đồng hành dài hạn.",
    items: [
      "Kiến trúc đa vùng",
      "Tiêu chuẩn bảo mật nghiêm ngặt",
      "Hỗ trợ 24/7 theo SLA",
      "Tư vấn & báo giá dự án",
    ],
    href: "/contact/sales",
    cta: "Liên hệ tư vấn →",
    highlight: false,
    icon: "enterprise",
  },
];

const STEPS: { title: string; body: string; icon: "cart" | "pay" | "deploy" | "use" }[] = [
  { title: "Chọn dịch vụ", body: "Chọn gói cloud phù hợp nhu cầu.", icon: "cart" },
  { title: "Thanh toán", body: "VietQR / chuyển khoản — rõ ràng.", icon: "pay" },
  { title: "Triển khai", body: "Nhận deliverable hoặc bàn giao hỗ trợ.", icon: "deploy" },
  { title: "Sử dụng", body: "Theo dõi trong Tài khoản KEYON.", icon: "use" },
];

export function CloudSolutionLanding({ featured, usingFallback }: Props) {
  return (
    <div className="bg-white">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(14,165,164,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.06),_transparent_50%)]"
          aria-hidden
        />
        <div className="home-container relative py-10 md:py-12 lg:py-16">
          <nav className={`mb-7 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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

          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14 xl:gap-16">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} tracking-[0.16em] text-accent`}>
                Giải pháp Cloud
              </p>
              <h1 className={`mt-3 max-w-xl ${HERO_TITLE_CLASS}`}>
                Cloud linh hoạt
                <span className="mt-1 block">Cho doanh nghiệp hiện đại</span>
              </h1>
              <p className={`mt-5 max-w-lg ${PAGE_LEAD_CLASS}`}>
                Khai thác sức mạnh của cloud để triển khai nhanh hơn, vận hành ổn định
                và mở rộng linh hoạt — tối ưu chi phí và bảo mật cho doanh nghiệp.
              </p>

              <ul className="mt-8 grid gap-5 sm:grid-cols-3 sm:gap-4">
                {[
                  { title: "Triển khai nhanh chóng", body: "Sẵn sàng trong vài phút", kind: "rocket" as const },
                  { title: "Bảo mật & tin cậy", body: "Tiêu chuẩn bảo mật quốc tế", kind: "shield" as const },
                  { title: "Linh hoạt & mở rộng", body: "Mở rộng theo nhu cầu", kind: "expand" as const },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3 sm:flex-col sm:gap-2.5">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <HeroValueIcon kind={item.kind} />
                    </span>
                    <span>
                      <span className={`block ${CARD_TITLE_CLASS}`}>{item.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=cloud"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá dịch vụ cloud →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <HeadsetIcon />
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
      <section className="py-14 md:py-16 lg:py-20">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ cloud toàn diện</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Đáp ứng mọi nhu cầu từ hạ tầng đến ứng dụng cho doanh nghiệp.
            </p>
          </header>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <article
                  className={`group flex h-full flex-col rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.tone}`}
                    aria-hidden
                  >
                    <ServiceIcon kind={s.icon} />
                  </span>
                  <h3 className={`mt-5 ${CARD_TITLE_CLASS} text-[15px]`}>{s.title}</h3>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{s.description}</p>
                  <Link
                    href={s.href}
                    className={`mt-5 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS} group-hover:gap-1.5 ${TRANSITION_UI}`}
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
      <section className="border-y border-border bg-surface py-14 md:py-16">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng & công nghệ</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Hệ sinh thái đối tác và công nghệ phổ biến cho giải pháp cloud.
            </p>
          </header>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {PLATFORMS.map((p) => (
              <li
                key={p.name}
                className={`flex min-w-[7.5rem] items-center gap-2.5 rounded-xl border border-border bg-white px-4 py-3 ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-lg bg-surface text-[11px] font-bold tracking-tight ${p.tint}`}
                  aria-hidden
                >
                  {p.mark}
                </span>
                <span className={`${CARD_TITLE_CLASS} text-muted`}>{p.name}</span>
              </li>
            ))}
          </ul>

          {/* Trust strip — separate visual band like mockup */}
          <div className="mt-10 rounded-2xl border border-border/70 bg-white px-4 py-6 sm:px-6 md:py-7">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {TRUST.map((t) => (
                <li key={t.title} className="flex flex-col items-start gap-2.5 text-left lg:items-center lg:text-center">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <TrustIcon kind={t.icon} />
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
      <section className="py-14 md:py-16 lg:py-20">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo nhu cầu</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Chọn hướng phù hợp quy mô — từ SME đến doanh nghiệp lớn.
            </p>
          </header>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {SEGMENTS.map((seg) => (
              <li key={seg.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border p-6 sm:p-7 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                    seg.highlight
                      ? "border-accent/35 bg-gradient-to-b from-accent-soft/80 to-white"
                      : `border-border bg-white ${ELEVATION_HAIRLINE}`
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      seg.highlight ? "bg-accent text-white" : "bg-navy text-white"
                    }`}
                    aria-hidden
                  >
                    <SegmentIcon kind={seg.icon} />
                  </span>
                  <h3 className={`mt-5 ${SUBSECTION_TITLE_CLASS}`}>{seg.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{seg.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {seg.items.map((item) => (
                      <li key={item} className={`flex gap-2.5 ${BODY_MUTED_CLASS}`}>
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={seg.href}
                    className={`mt-7 inline-flex h-10 w-full items-center justify-center rounded-xl px-4 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
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
      <section className="border-t border-border bg-surface py-14 md:py-16 lg:py-20">
        <div className="home-container">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-5">
            {featured.map((p) => (
              <li key={p.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-slate-700 text-white"
                    aria-hidden
                  >
                    <ProductGlyph kind={p.icon ?? "server"} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  <ul className="mt-2.5 space-y-1 border-b border-border/70 pb-3">
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
            ))}
          </ul>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section className="py-14 md:py-16 lg:py-20">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai đơn giản</h2>
            <p className={`mt-3 ${SECTION_LEAD_CLASS}`}>
              Bốn bước rõ ràng — từ chọn gói đến sử dụng trên KEYON.
            </p>
          </header>
          <ol className="relative mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-10 z-0 hidden border-t border-dashed border-accent/35 lg:block"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative z-[1] text-center">
                <div className="relative mx-auto w-fit">
                  <span
                    className={`flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/25 bg-white text-accent ${ELEVATION_HAIRLINE}`}
                  >
                    <StepIcon kind={step.icon} />
                  </span>
                  <span
                    className={`absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white ${ELEVATION_HAIRLINE}`}
                  >
                    {i + 1}
                  </span>
                </div>
                <p className={`mt-5 ${CARD_TITLE_CLASS}`}>{step.title}</p>
                <p className={`mt-1.5 px-2 ${CARD_META_CLASS}`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-16 md:pb-20">
        <div className="home-container">
          <div className="relative overflow-hidden rounded-2xl bg-navy px-6 py-10 sm:px-10 sm:py-12 lg:px-12">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl"
              aria-hidden
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
              <div className="max-w-xl">
                <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                  Sẵn sàng đưa doanh nghiệp lên cloud?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-[15px]">
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

/** Illustrative cards when catalog has no cloud SKUs — prices are reference only. */
export const CLOUD_FALLBACK_FEATURED: CloudFeaturedProduct[] = [
  {
    id: "fb-1",
    title: "Cloud Server",
    href: "/contact/sales",
    specs: ["CPU 2 vCPU · RAM 4GB", "SSD 80GB"],
    priceLabel: "280.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "server",
  },
  {
    id: "fb-2",
    title: "Cloud Server Pro",
    href: "/contact/sales",
    specs: ["CPU 4 vCPU · RAM 8GB", "SSD 160GB"],
    priceLabel: "520.000 đ / tháng",
    priceHint: "Giá tham khảo",
    icon: "pro",
  },
  {
    id: "fb-3",
    title: "Cloud Storage 500GB",
    href: "/contact/sales",
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
    href: "/contact/sales",
    specs: ["Managed database", "Tư vấn trước triển khai"],
    priceLabel: "Liên hệ báo giá",
    icon: "database",
  },
];

/* ── Icons (inline, marketing-only) ─────────────────────────────────────── */

function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
      <path d="M4 14v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent" aria-hidden>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d="m5 12 5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function HeroValueIcon({ kind }: { kind: "rocket" | "shield" | "expand" }) {
  if (kind === "shield") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "expand") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M5 19 12 5l7 14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 14h7" strokeLinecap="round" />
    </svg>
  );
}

function ServiceIcon({
  kind,
}: {
  kind: "infra" | "storage" | "database" | "backup" | "network";
}) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true as const,
  };
  switch (kind) {
    case "storage":
      return (
        <svg {...p}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "database":
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case "backup":
      return (
        <svg {...p}>
          <path d="M12 3v10" strokeLinecap="round" />
          <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 17h14M7 21h10" strokeLinecap="round" />
        </svg>
      );
    case "network":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="5" cy="6" r="1.8" />
          <circle cx="19" cy="6" r="1.8" />
          <circle cx="5" cy="18" r="1.8" />
          <circle cx="19" cy="18" r="1.8" />
          <path d="m7 7.5 3.2 3M14 10.5l3-3M7 16.5l3.2-3M14 13.5l3 3" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="4" y="9" width="16" height="9" rx="2" />
          <path d="M8 9V7a4 4 0 0 1 8 0v2" />
        </svg>
      );
  }
}

function TrustIcon({ kind }: { kind: "globe" | "bolt" | "shield" | "eye" | "sla" }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true as const,
  };
  if (kind === "bolt") {
    return (
      <svg {...p}>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg {...p}>
        <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" />
      </svg>
    );
  }
  if (kind === "eye") {
    return (
      <svg {...p}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (kind === "sla") {
    return (
      <svg {...p}>
        <path d="M12 3v18M5 8h14M7 16h10" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </svg>
  );
}

function SegmentIcon({ kind }: { kind: "sme" | "growth" | "enterprise" }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    "aria-hidden": true as const,
  };
  if (kind === "growth") {
    return (
      <svg {...p}>
        <path d="M4 19h16" strokeLinecap="round" />
        <path d="m4 15 5-5 4 4 7-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === "enterprise") {
    return (
      <svg {...p}>
        <path d="M4 20V6l8-3 8 3v14" />
        <path d="M9 20v-6h6v6M9 10h.01M15 10h.01M12 10h.01M9 14h.01M15 14h.01" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <path d="M3 10.5 12 4l9 6.5" />
      <path d="M5 10v9h14v-9" />
      <path d="M10 19v-5h4v5" />
    </svg>
  );
}

function StepIcon({ kind }: { kind: "cart" | "pay" | "deploy" | "use" }) {
  const p = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    "aria-hidden": true as const,
  };
  if (kind === "pay") {
    return (
      <svg {...p}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18M7 14h4" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "deploy") {
    return (
      <svg {...p}>
        <path d="M12 3v10" strokeLinecap="round" />
        <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 17h14M7 21h10" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "use") {
    return (
      <svg {...p}>
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 18v3" strokeLinecap="round" />
        <path d="M7 9h4M7 12h10" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <circle cx="9" cy="19" r="1.4" />
      <circle cx="17" cy="19" r="1.4" />
      <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 8H7" />
    </svg>
  );
}

function ProductGlyph({ kind }: { kind: NonNullable<CloudFeaturedProduct["icon"]> }) {
  const p = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    "aria-hidden": true as const,
  };
  if (kind === "storage") {
    return (
      <svg {...p}>
        <ellipse cx="12" cy="7" rx="7" ry="3" />
        <path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7" />
      </svg>
    );
  }
  if (kind === "backup") {
    return (
      <svg {...p}>
        <path d="M12 4v9" strokeLinecap="round" />
        <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 18h14" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "database") {
    return (
      <svg {...p}>
        <ellipse cx="12" cy="6" rx="7" ry="3" />
        <path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      </svg>
    );
  }
  return (
    <svg {...p}>
      <rect x="4" y="9" width="16" height="9" rx="2" />
      <path d="M8 9V7a4 4 0 0 1 8 0v2" />
    </svg>
  );
}

function CloudHeroArt() {
  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-gradient-to-br from-[#f0f9ff] via-[#ecfeff] to-[#f0fdfa] p-5 sm:p-7 ${ELEVATION_FLOAT}`}
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

          {/* isometric-ish platform */}
          <path
            d="M90 250 L230 190 L370 250 L230 310 Z"
            fill="#e0f2fe"
            stroke="#bae6fd"
            strokeWidth="1.5"
            opacity="0.9"
          />

          {/* cloud */}
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

          {/* floating server nodes */}
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

          {/* dashed links */}
          <path d="M106 150c24 12 48 28 84 40" stroke="#94a3b8" strokeWidth="1.4" fill="none" strokeDasharray="5 5" />
          <path d="M352 130c-24 16-48 36-80 48" stroke="#94a3b8" strokeWidth="1.4" fill="none" strokeDasharray="5 5" />
        </svg>

        {/* floating chips — match mockup labels */}
        <div
          className={`absolute left-0 top-[10%] max-w-[10rem] rounded-xl border border-border bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_HAIRLINE} sm:left-1 sm:max-w-[11rem]`}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-100 text-sky-700" aria-hidden>
              <TrustIcon kind="bolt" />
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100 text-teal-800" aria-hidden>
              <TrustIcon kind="shield" />
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
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 text-violet-700" aria-hidden>
              <HeroValueIcon kind="expand" />
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
