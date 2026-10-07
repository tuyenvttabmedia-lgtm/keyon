import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Check,
  ClipboardList,
  Headphones,
  HardDrive,
  Landmark,
  Mail,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";
import { LANDING_CRUMB_GAP, LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import {
  BACKUP_DR_SERVICE_SLUG,
  CLOUD_SERVER_SERVICE_SLUG,
  EMAIL_MIGRATION_SERVICE_SLUG,
  M365_EMAIL_SERVICE_SLUG,
  SERVICE_TOPICS,
} from "@/storefront/nav/ia";
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
import {
  BADGE_CLASS,
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

const FEATURED_SLUGS = [
  M365_EMAIL_SERVICE_SLUG,
  EMAIL_MIGRATION_SERVICE_SLUG,
  CLOUD_SERVER_SERVICE_SLUG,
  BACKUP_DR_SERVICE_SLUG,
  "security-deployment",
] as const;

const FEATURED_ICONS: Record<(typeof FEATURED_SLUGS)[number], LucideIcon> = {
  [M365_EMAIL_SERVICE_SLUG]: Mail,
  [EMAIL_MIGRATION_SERVICE_SLUG]: Waypoints,
  [CLOUD_SERVER_SERVICE_SLUG]: Server,
  [BACKUP_DR_SERVICE_SLUG]: HardDrive,
  "security-deployment": ShieldCheck,
};

const FEATURED_POINTS: Record<(typeof FEATURED_SLUGS)[number], string[]> = {
  [M365_EMAIL_SERVICE_SLUG]: [
    "Email, domain, DNS và tài khoản",
    "Outlook, Teams, OneDrive",
    "Bàn giao cho người phụ trách",
  ],
  [EMAIL_MIGRATION_SERVICE_SLUG]: [
    "Google Workspace, Exchange, IMAP",
    "Cắt chuyển theo lịch đã chốt",
    "Đối soát sau khi chuyển",
  ],
  [CLOUD_SERVER_SERVICE_SLUG]: [
    "Cloud Server, VPS, Dedicated",
    "Cấu hình theo phạm vi",
    "DNS, SSL khi đã chốt",
  ],
  [BACKUP_DR_SERVICE_SLUG]: [
    "Máy tính, máy chủ, Microsoft 365",
    "Chính sách sao lưu và khôi phục",
    "Hỗ trợ trong thời hạn dịch vụ",
  ],
  "security-deployment": [
    "Cài đặt theo phạm vi đã chốt",
    "Endpoint và lớp bảo mật đã chọn",
    "Hướng dẫn vận hành sau triển khai",
  ],
};

const MANAGE_SLUGS = ["microsoft-365-management", "managed-it"] as const;

const HERO_CHECKS = [
  "Triển khai theo phạm vi doanh nghiệp đã chốt",
  "Quy trình rõ, từ khảo sát đến bàn giao",
  "Hỗ trợ kỹ thuật trong thời hạn dịch vụ",
];

const HERO_CHIPS: { label: string; body: string; href: string; Icon: LucideIcon; place: string }[] = [
  {
    label: "Bảo mật",
    body: "Theo phạm vi đã chốt",
    href: "/services/security-deployment",
    Icon: ShieldCheck,
    place: "right-3 top-4",
  },
  {
    label: "Triển khai Email & Dữ liệu",
    body: "Microsoft 365, hộp thư",
    href: `/services/${M365_EMAIL_SERVICE_SLUG}`,
    Icon: Mail,
    place: "left-3 top-[18%]",
  },
  {
    label: "Di chuyển dữ liệu",
    body: "Nguồn và đích đã chốt",
    href: `/services/${EMAIL_MIGRATION_SERVICE_SLUG}`,
    Icon: Waypoints,
    place: "left-[28%] top-[42%]",
  },
  {
    label: "Sao lưu & Khôi phục",
    body: "Chính sách backup",
    href: `/services/${BACKUP_DR_SERVICE_SLUG}`,
    Icon: HardDrive,
    place: "left-3 bottom-6",
  },
  {
    label: "Hỗ trợ vận hành",
    body: "Trong thời hạn dịch vụ",
    href: "/services/managed-it",
    Icon: Headphones,
    place: "right-3 bottom-[18%]",
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn & khảo sát", body: "Nhu cầu, hệ thống hiện có và đầu mối phụ trách.", Icon: Search },
  { title: "Lên kế hoạch chi tiết", body: "Phạm vi, lịch và hạng mục được xác nhận.", Icon: ClipboardList },
  { title: "Triển khai & cấu hình", body: "Thực hiện đúng danh sách đã chốt.", Icon: Settings },
  { title: "Kiểm tra & bàn giao", body: "Đối soát và hướng dẫn cho người phụ trách.", Icon: ShieldCheck },
  { title: "Hỗ trợ & đồng hành", body: "Kênh kỹ thuật trong thời hạn dịch vụ.", Icon: Headphones },
];

const GROUPS: { title: string; points: string[]; Icon: LucideIcon }[] = [
  {
    title: "Doanh nghiệp nhỏ",
    Icon: Users,
    points: ["Email và công cụ làm việc", "Thiết lập theo số người dùng", "Sao lưu trong phạm vi đã chốt"],
  },
  {
    title: "Doanh nghiệp vừa",
    Icon: Building2,
    points: ["Triển khai theo từng giai đoạn", "Nhiều hệ thống trong một phạm vi", "Bảo mật và sao lưu đã chọn"],
  },
  {
    title: "Doanh nghiệp lớn",
    Icon: Server,
    points: ["Phạm vi theo sơ đồ đã chốt", "Nhiều bộ phận hoặc chi nhánh", "Hỗ trợ trong thời hạn dịch vụ"],
  },
  {
    title: "Tổ chức, cơ quan nhà nước",
    Icon: Landmark,
    points: ["Theo quy định nội bộ đã nêu", "Triển khai đúng hạng mục đã chốt", "Bàn giao cho đầu mối phụ trách"],
  },
];

const PLATFORMS: { name: string; logo?: string; mark?: string }[] = [
  { name: "Microsoft", logo: "/brand/microsoft.svg" },
  { name: "Google Cloud", mark: "font-semibold tracking-tight" },
  { name: "VMware", mark: "font-bold tracking-tight" },
  { name: "Acronis", logo: "/brand/acronis.svg" },
  { name: "veeam", logo: "/brand/veeam.svg" },
  { name: "Synology", logo: "/brand/synology.svg" },
  { name: "DELL", mark: "font-bold tracking-[0.14em]" },
  { name: "Lenovo", mark: "font-semibold tracking-tight" },
];

const HANDOFF = [
  {
    title: "Phạm vi đã chốt",
    body: "Hạng mục, thời hạn và đầu mối phụ trách được xác nhận trước khi bắt đầu.",
  },
  {
    title: "Bàn giao rõ người nhận",
    body: "Checklist, quyền truy cập và hướng dẫn được giao cho người phụ trách.",
  },
  {
    title: "Hỗ trợ sau triển khai",
    body: "Kênh kỹ thuật KEYON trong thời hạn dịch vụ đã thống nhất.",
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

function topicBySlug(slug: string) {
  return SERVICE_TOPICS.find((topic) => topic.slug === slug);
}

export function ServicesHub() {
  const featured = FEATURED_SLUGS.map((slug) => topicBySlug(slug)).filter((topic) => topic != null);
  const manage = MANAGE_SLUGS.map((slug) => topicBySlug(slug)).filter((topic) => topic != null);

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="border-b border-border bg-white">
        <div className={`home-container ${LANDING_HERO_PAD}`}>
          <nav aria-label="Breadcrumb" className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Dịch vụ</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] lg:gap-8">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Dịch vụ triển khai và hỗ trợ doanh nghiệp</p>
              <h1 className={`mt-3 max-w-xl ${HERO_TITLE_CLASS}`}>Dịch vụ triển khai và quản lý giải pháp số</h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Từ triển khai, di chuyển dữ liệu đến cấu hình và vận hành. KEYON đưa phần mềm, cloud và hạ tầng vào hoạt động theo phạm vi đã chốt.
              </p>
              <ul className="mt-6 max-w-xl space-y-3">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </span>
                    <span className={`min-w-0 break-words ${BODY_CLASS}`}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link
                  href={IMPLEMENTATION_QUOTE_HREF}
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-white sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Tư vấn dịch vụ
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/products"
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Xem sản phẩm liên quan
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
            <HeroArt />
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Các dịch vụ triển khai của KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi dịch vụ là một phạm vi. KEYON xác nhận lại hạng mục trước khi thực hiện.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {featured.map((topic) => {
              const Icon = FEATURED_ICONS[topic.slug as (typeof FEATURED_SLUGS)[number]];
              const points = FEATURED_POINTS[topic.slug as (typeof FEATURED_SLUGS)[number]];
              return (
                <li key={topic.slug} className="min-w-0">
                  <article className={`${card} p-4 sm:p-5`}>
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-10 sm:w-10 ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                        <Icon size={18} strokeWidth={1.8} aria-hidden />
                      </span>
                      <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{topic.label}</h3>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {points.map((point) => (
                        <li key={point} className={`flex min-w-0 items-start gap-2 ${BODY_MUTED_CLASS}`}>
                          <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                          <span className="min-w-0 break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href={`/services/${topic.slug}`} className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
                      Tìm hiểu thêm
                      <ArrowRight size={14} aria-hidden />
                    </Link>
                  </article>
                </li>
              );
            })}
          </ul>

          <h3 className={`mt-8 ${CARD_TITLE_CLASS}`}>Quản lý và vận hành</h3>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {manage.map((topic) => (
              <li key={topic.slug} className="min-w-0">
                <article className={`${card} p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5`}>
                  <div className="min-w-0">
                    <h3 className={`break-words ${CARD_TITLE_CLASS}`}>{topic.label}</h3>
                    <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{topic.description}</p>
                  </div>
                  <Link href={`/services/${topic.slug}`} className={`mt-3 inline-flex shrink-0 items-center gap-1 sm:mt-0 ${LINK_ACCENT_CLASS}`}>
                    Tìm hiểu thêm
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai dịch vụ</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước, từ tiếp nhận nhu cầu đến bàn giao và hỗ trợ sau triển khai.
            </p>
          </header>
          <ol className="relative mt-7 flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-x-4">
            <li aria-hidden className="pointer-events-none absolute left-[10%] right-[10%] top-9 hidden border-t border-dashed border-border lg:block" />
            {STEPS.map((step, index) => (
              <li key={step.title} className="group relative flex min-w-0 items-start gap-3 text-left lg:block lg:text-center">
                <span className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent lg:mx-auto lg:mt-3 lg:h-12 lg:w-12 lg:ring-8 lg:ring-white ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                  <step.Icon size={18} strokeWidth={1.8} aria-hidden />
                </span>
                <div className="min-w-0 lg:mt-3">
                  <span className={`${BADGE_CLASS} text-accent`}>{String(index + 1).padStart(2, "0")}</span>
                  <h3 className={`mt-1 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Giải pháp dịch vụ theo nhóm nhu cầu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON chọn hạng mục theo quy mô và hệ thống đang dùng, rồi chốt phạm vi trước khi làm.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GROUPS.map((group) => (
              <li key={group.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-10 sm:w-10 ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                      <group.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{group.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {group.points.map((point) => (
                      <li key={point} className={`flex min-w-0 items-start gap-2 ${BODY_CLASS}`}>
                        <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                        <span className="min-w-0 break-words">{point}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Nền tảng và công nghệ triển khai" className="border-y border-border bg-[#F8FAFC]">
        <div className="home-container py-8 lg:py-10">
          <header className="max-w-2xl lg:pt-8">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng và công nghệ thường triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON triển khai trên các nền tảng này khi hạng mục đã nằm trong phạm vi.
            </p>
          </header>
          <ul className="mt-4 grid grid-cols-4 lg:mt-2 lg:grid-cols-8">
            {PLATFORMS.map((item) => (
              <li key={item.name} className="min-w-0">
                <span className={`flex h-14 items-center justify-center px-1 text-center font-display text-sm text-muted-soft lg:h-[4.25rem] lg:px-2 ${item.mark ?? ""} ${TRANSITION_UI} hover:text-navy`}>
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="h-6 w-auto max-w-[4.5rem] object-contain sm:h-7" />
                  ) : (
                    item.name
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Sau khi KEYON triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kết quả bàn giao gắn với phạm vi đã chốt cùng người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 md:grid-cols-3">
            {HANDOFF.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <h3 className={`break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-2xl">
              <p className={`${OVERLINE_CLASS} text-accent`}>Sẵn sàng triển khai giải pháp phù hợp</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Liên hệ KEYON để được tư vấn dịch vụ và nhận phạm vi phù hợp cho doanh nghiệp của bạn.
              </h2>
            </div>
            <Link
              href={IMPLEMENTATION_QUOTE_HREF}
              className={`inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-accent px-6 text-white md:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Liên hệ ngay
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroArt() {
  return (
    <div className="relative hidden min-h-[460px] lg:block">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <Image
          src="/services/cloud-hero.jpg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 560px, 0px"
          className="object-cover object-center"
        />
      </div>
      {HERO_CHIPS.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className={`group absolute ${chip.place} flex max-w-[220px] items-center gap-2.5 rounded-2xl border border-white/80 bg-white/95 px-3 py-2.5 backdrop-blur-sm ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_FLOAT_HOVER} ${HOVER_LIFT_CARD}`}
        >
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
            <chip.Icon size={16} strokeWidth={1.8} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className={`block break-words ${CARD_TITLE_CLASS}`}>{chip.label}</span>
            <span className={`block ${CARD_META_CLASS}`}>{chip.body}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
