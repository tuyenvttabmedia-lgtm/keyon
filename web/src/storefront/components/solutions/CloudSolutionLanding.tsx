import Link from "next/link";
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

export type CloudFeaturedProduct = {
  id: string;
  title: string;
  href: string;
  specs: string[];
  priceLabel: string;
  priceHint?: string;
};

type Props = {
  featured: CloudFeaturedProduct[];
};

const SERVICES = [
  {
    title: "Cloud Infrastructure",
    description: "Máy chủ ảo, tài nguyên tính toán linh hoạt theo nhu cầu vận hành.",
    href: "/products?cat=cloud",
    icon: "infra" as const,
  },
  {
    title: "Cloud Storage",
    description: "Lưu trữ đối tượng và file với khả năng mở rộng theo dung lượng.",
    href: "/products?q=storage",
    icon: "storage" as const,
  },
  {
    title: "Cloud Database",
    description: "Cơ sở dữ liệu managed — triển khai nhanh, vận hành ổn định.",
    href: "/contact/sales",
    icon: "database" as const,
  },
  {
    title: "Cloud Backup",
    description: "Sao lưu và khôi phục endpoint, cloud và máy chủ.",
    href: "/solutions/backup",
    icon: "backup" as const,
  },
  {
    title: "Cloud Network",
    description: "Kết nối, bảo vệ cạnh biên và tối ưu băng thông cho dịch vụ cloud.",
    href: "/contact/sales",
    icon: "network" as const,
  },
];

const PLATFORMS = [
  "Microsoft Azure",
  "AWS",
  "Google Cloud",
  "Acronis",
  "Cloudflare",
  "Veeam",
];

const TRUST = [
  {
    title: "Hạ tầng toàn cầu",
    body: "Định hướng triển khai với đối tác datacenter đa vùng.",
  },
  {
    title: "Hiệu năng vượt trội",
    body: "SSD NVMe · băng thông cao khi chọn đúng cấu hình.",
  },
  {
    title: "Bảo mật đa lớp",
    body: "Firewall, DDoS protection, mã hóa dữ liệu theo gói.",
  },
  {
    title: "Giám sát 24/7",
    body: "Hỗ trợ kỹ thuật tiếng Việt sau khi mua / triển khai.",
  },
  {
    title: "Cam kết rõ ràng",
    body: "Điều kiện SLA / uptime theo từng nhà cung cấp & gói.",
  },
];

const SEGMENTS = [
  {
    title: "Doanh nghiệp vừa & nhỏ",
    description: "Khởi đầu cloud gọn, chi phí kiểm soát, triển khai nhanh.",
    items: ["Cloud Server / Storage cơ bản", "Backup endpoint", "Hỗ trợ kích hoạt & bàn giao"],
    href: "/products?cat=cloud",
    cta: "Khám phá giải pháp →",
    highlight: false,
  },
  {
    title: "Doanh nghiệp phát triển",
    description: "Mở rộng tài nguyên theo giai đoạn tăng trưởng.",
    items: ["Scale CPU / RAM / SSD", "Backup & bảo mật bổ sung", "Tư vấn chọn gói theo workload"],
    href: "/business",
    cta: "Khám phá giải pháp →",
    highlight: true,
  },
  {
    title: "Doanh nghiệp lớn",
    description: "Triển khai có tư vấn, volume và quản lý tập trung.",
    items: [
      "Báo giá theo dự án",
      "Volume / multi-seat liên quan",
      "Quản lý bản quyền trên KEYON",
      "Đồng hành CS kỹ thuật",
    ],
    href: "/contact/sales",
    cta: "Liên hệ tư vấn →",
    highlight: false,
  },
];

const STEPS = [
  { title: "Chọn dịch vụ", body: "Chọn gói cloud / license phù hợp nhu cầu." },
  { title: "Thanh toán", body: "Thanh toán rõ ràng — VietQR / chuyển khoản." },
  { title: "Triển khai", body: "Nhận deliverable hoặc được hỗ trợ bàn giao." },
  { title: "Sử dụng", body: "Theo dõi trong Tài khoản KEYON khi cần." },
];

export function CloudSolutionLanding({ featured }: Props) {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-surface via-white to-white">
        <div className="home-container py-8 md:py-10 lg:py-14">
          <nav className={`mb-6 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden>/</span>
            <Link href="/solutions" className={HOVER_LINK_ACCENT}>
              Giải pháp
            </Link>
            <span aria-hidden>/</span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Cloud</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
            <div>
              <p className={`${OVERLINE_CLASS} text-accent`}>Giải pháp Cloud</p>
              <h1 className={`mt-3 ${HERO_TITLE_CLASS}`}>
                Cloud linh hoạt
                <span className="block">Cho doanh nghiệp hiện đại</span>
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Khai thác sức mạnh của cloud để triển khai nhanh hơn, vận hành ổn định
                và mở rộng linh hoạt — tối ưu chi phí và bảo mật cho doanh nghiệp.
              </p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { title: "Triển khai nhanh chóng", body: "Sẵn sàng trong vài phút" },
                  { title: "Bảo mật & tin cậy", body: "Tiêu chuẩn bảo mật quốc tế" },
                  { title: "Linh hoạt & mở rộng", body: "Mở rộng theo nhu cầu" },
                ].map((item) => (
                  <li key={item.title} className="flex gap-2.5">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <HeroMiniIcon kind={item.title} />
                    </span>
                    <span>
                      <span className={`block ${CARD_TITLE_CLASS}`}>{item.title}</span>
                      <span className={`mt-0.5 block ${CARD_META_CLASS}`}>{item.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/products?cat=cloud"
                  className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Khám phá dịch vụ cloud →
                </Link>
                <Link
                  href="/contact/sales"
                  className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-white px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  <HeadsetIcon />
                  Tư vấn giải pháp
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <CloudHeroArt />
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 md:py-16">
        <div className="home-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ cloud toàn diện</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Đáp ứng nhu cầu từ hạ tầng đến ứng dụng — chọn đúng hướng trước khi mua.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <ServiceIcon kind={s.icon} />
                  </span>
                  <h3 className={`mt-4 ${SUBSECTION_TITLE_CLASS} !text-lg`}>{s.title}</h3>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{s.description}</p>
                  <Link href={s.href} className={`mt-4 ${LINK_ACCENT_CLASS}`}>
                    Tìm hiểu thêm →
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Platforms + trust */}
      <section className="border-y border-border bg-surface py-12 md:py-16">
        <div className="home-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng & công nghệ</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Định hướng giải pháp cloud với hệ sinh thái đối tác và công nghệ phổ biến.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {PLATFORMS.map((name) => (
              <li
                key={name}
                className={`rounded-xl border border-border bg-white px-4 py-2.5 ${CARD_TITLE_CLASS} text-muted ${ELEVATION_HAIRLINE}`}
              >
                {name}
              </li>
            ))}
          </ul>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST.map((t) => (
              <li key={t.title} className="rounded-2xl border border-border/80 bg-white/70 p-4">
                <p className={CARD_TITLE_CLASS}>{t.title}</p>
                <p className={`mt-1.5 ${CARD_META_CLASS}`}>{t.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Segments */}
      <section className="py-12 md:py-16">
        <div className="home-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp theo nhu cầu</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Chọn hướng phù hợp quy mô — từ SME đến doanh nghiệp lớn.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {SEGMENTS.map((seg) => (
              <li key={seg.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border p-6 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} ${
                    seg.highlight
                      ? "border-accent/30 bg-accent-soft/40"
                      : `border-border bg-white ${ELEVATION_HAIRLINE}`
                  }`}
                >
                  <h3 className={SUBSECTION_TITLE_CLASS}>{seg.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{seg.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {seg.items.map((item) => (
                      <li key={item} className={`flex gap-2 ${BODY_MUTED_CLASS}`}>
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={seg.href}
                    className={`mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-4 ${CTA_COMPACT_CLASS} text-accent ${TRANSITION_UI} hover:border-accent`}
                  >
                    {seg.cta}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured */}
      <section className="border-t border-border bg-surface/60 py-12 md:py-16">
        <div className="home-container">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className={SECTION_TITLE_CLASS}>Sản phẩm & dịch vụ nổi bật</h2>
              <p className={`mt-2 max-w-xl ${SECTION_LEAD_CLASS}`}>
                {featured.length
                  ? "Một số gói đang có trên catalog KEYON — xem chi tiết trước khi mua."
                  : "Catalog cloud đang mở rộng. Liên hệ tư vấn để nhận cấu hình & báo giá phù hợp."}
              </p>
            </div>
            <Link href="/products?cat=cloud" className={LINK_ACCENT_CLASS}>
              Xem tất cả dịch vụ →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {featured.map((p) => (
              <li key={p.id}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white"
                    aria-hidden
                  >
                    K
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{p.title}</h3>
                  <ul className="mt-2 space-y-1">
                    {p.specs.map((spec) => (
                      <li key={spec} className={CARD_META_CLASS}>
                        {spec}
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-4 ${CARD_PRICE_CLASS}`}>{p.priceLabel}</p>
                  {p.priceHint ? (
                    <p className={`mt-1 ${CARD_META_CLASS}`}>{p.priceHint}</p>
                  ) : null}
                  <Link
                    href={p.href}
                    className={`mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-accent px-3 ${CTA_COMPACT_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover`}
                  >
                    {p.href.startsWith("/products/") ? "Xem chi tiết" : "Tư vấn cấu hình"}
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process */}
      <section className="py-12 md:py-16">
        <div className="home-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai đơn giản</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
              Bốn bước rõ ràng từ chọn gói đến sử dụng trên KEYON.
            </p>
          </div>
          <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-8 hidden border-t border-dashed border-border lg:block"
              aria-hidden
            />
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative text-center">
                <span
                  className={`relative z-[1] mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/30 bg-white text-lg font-bold text-accent ${ELEVATION_HAIRLINE}`}
                >
                  {i + 1}
                </span>
                <p className={`mt-4 ${CARD_TITLE_CLASS}`}>{step.title}</p>
                <p className={`mt-1.5 ${CARD_META_CLASS}`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA banner */}
      <section className="pb-14 md:pb-16">
        <div className="home-container">
          <div className="flex flex-col gap-6 rounded-2xl bg-navy px-6 py-8 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div className="max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} text-white`}>
                Sẵn sàng đưa doanh nghiệp lên cloud?
              </h2>
              <p className={`mt-2 text-sm leading-relaxed text-slate-300 md:text-[15px]`}>
                Đội ngũ KEYON hỗ trợ chọn gói, báo giá và theo dõi deliverable trong Tài khoản.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/products?cat=cloud"
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Khám phá dịch vụ cloud
              </Link>
              <Link
                href="/contact/sales"
                className={`inline-flex h-11 items-center justify-center rounded-xl border border-white/25 bg-transparent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Placeholder featured cards when catalog has no cloud SKUs yet. */
export const CLOUD_FALLBACK_FEATURED: CloudFeaturedProduct[] = [
  {
    id: "fb-1",
    title: "Cloud Server",
    href: "/contact/sales",
    specs: ["Ví dụ: 2 vCPU · 4GB RAM", "SSD theo cấu hình"],
    priceLabel: "Báo giá theo cấu hình",
    priceHint: "Catalog đang mở rộng",
  },
  {
    id: "fb-2",
    title: "Cloud Server Pro",
    href: "/contact/sales",
    specs: ["Ví dụ: 4 vCPU · 8GB RAM", "Phù hợp workload vừa"],
    priceLabel: "Báo giá theo cấu hình",
  },
  {
    id: "fb-3",
    title: "Cloud Storage",
    href: "/products?q=storage",
    specs: ["Object / file storage", "Mở rộng theo dung lượng"],
    priceLabel: "Xem catalog / tư vấn",
  },
  {
    id: "fb-4",
    title: "Cloud Backup",
    href: "/solutions/backup",
    specs: ["Endpoint · cloud · server", "Theo sản phẩm backup"],
    priceLabel: "Xem giải pháp Backup",
  },
  {
    id: "fb-5",
    title: "Cloud Database",
    href: "/contact/sales",
    specs: ["Managed DB theo nhu cầu", "Tư vấn trước khi triển khai"],
    priceLabel: "Liên hệ tư vấn",
  },
];

function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
      <path d="M4 14v3a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0v3a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Z" strokeLinecap="round" />
    </svg>
  );
}

function HeroMiniIcon({ kind }: { kind: string }) {
  if (kind.includes("Bảo mật")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind.includes("Linh hoạt")) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
  const common = {
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
        <svg {...common}>
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      );
    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" />
        </svg>
      );
    case "backup":
      return (
        <svg {...common}>
          <path d="M12 3v10" strokeLinecap="round" />
          <path d="m8 9 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 17h14" strokeLinecap="round" />
          <path d="M7 21h10" strokeLinecap="round" />
        </svg>
      );
    case "network":
      return (
        <svg {...common}>
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
        <svg {...common}>
          <rect x="4" y="8" width="16" height="10" rx="2" />
          <path d="M8 8V6a4 4 0 0 1 8 0v2" />
        </svg>
      );
  }
}

function CloudHeroArt() {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-sky-50 via-cyan-50/80 to-teal-50 p-6 sm:p-8 ${ELEVATION_FLOAT}`}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-sky-300/20 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto aspect-square max-w-[420px]">
        <svg viewBox="0 0 420 420" className="h-full w-full" role="img" aria-label="Minh họa giải pháp cloud KEYON">
          <defs>
            <linearGradient id="cloudFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e0f7f6" />
              <stop offset="100%" stopColor="#0ea5a4" stopOpacity="0.35" />
            </linearGradient>
            <linearGradient id="nodeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
          </defs>
          {/* soft base */}
          <ellipse cx="210" cy="340" rx="120" ry="18" fill="#0f172a" opacity="0.06" />
          {/* cloud body */}
          <path
            d="M120 230c0-40 32-72 72-72 12-34 46-56 82-56 48 0 86 36 90 82 34 4 60 32 60 66 0 38-30 68-68 68H148c-40 0-72-30-72-68 0-10 2-20 6-28z"
            fill="url(#cloudFill)"
            stroke="#0ea5a4"
            strokeWidth="2"
            opacity="0.95"
          />
          {/* K badge */}
          <circle cx="210" cy="230" r="36" fill="#0f172a" />
          <text
            x="210"
            y="242"
            textAnchor="middle"
            fill="#fff"
            fontSize="34"
            fontWeight="700"
            fontFamily="system-ui,sans-serif"
          >
            K
          </text>
          {/* floating nodes */}
          <rect x="48" y="150" width="56" height="40" rx="8" fill="url(#nodeFill)" stroke="#cbd5e1" />
          <rect x="318" y="130" width="52" height="36" rx="8" fill="url(#nodeFill)" stroke="#cbd5e1" />
          <rect x="300" y="280" width="64" height="44" rx="8" fill="url(#nodeFill)" stroke="#cbd5e1" />
          <rect x="70" y="280" width="48" height="36" rx="8" fill="url(#nodeFill)" stroke="#cbd5e1" />
          {/* connectors */}
          <path d="M104 190c20 10 40 20 70 28" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          <path d="M318 160c-20 12-40 28-70 40" stroke="#94a3b8" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
        </svg>

        <div
          className={`absolute left-0 top-[18%] max-w-[9.5rem] rounded-xl border border-border bg-white px-3 py-2 ${ELEVATION_HAIRLINE} sm:max-w-[10.5rem]`}
        >
          <p className={`${BADGE_CLASS} text-accent`}>Hiệu suất cao</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>SSD · băng thông tối ưu</p>
        </div>
        <div
          className={`absolute right-0 top-[12%] max-w-[9.5rem] rounded-xl border border-border bg-white px-3 py-2 ${ELEVATION_HAIRLINE} sm:max-w-[10.5rem]`}
        >
          <p className={`${BADGE_CLASS} text-accent`}>Bảo mật đa lớp</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>Firewall · mã hóa</p>
        </div>
        <div
          className={`absolute bottom-[8%] left-1/2 max-w-[11rem] -translate-x-1/2 rounded-xl border border-border bg-white px-3 py-2 ${ELEVATION_HAIRLINE}`}
        >
          <p className={`${BADGE_CLASS} text-accent`}>Linh hoạt mở rộng</p>
          <p className={`mt-0.5 ${CARD_META_CLASS}`}>Scale theo nhu cầu</p>
        </div>
      </div>
    </div>
  );
}
