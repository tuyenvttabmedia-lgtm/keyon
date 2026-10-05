import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Cloud,
  FileSpreadsheet,
  FileText,
  FolderSync,
  Headphones,
  LifeBuoy,
  ListChecks,
  Mail,
  Rocket,
  Search,
  Settings,
  ShieldCheck,
  Video,
} from "lucide-react";
import {
  LANDING_CRUMB_GAP,
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  ELEVATION_HERO_HOVER,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  MOTION_NORMAL,
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
} from "@/storefront/typography";

export const M365_EMAIL_PATH = "/services/microsoft-365-email";

export const M365_EMAIL_SEO = {
  title: "Thiết lập Microsoft 365 và email doanh nghiệp | KEYON",
  description:
    "Thiết lập Microsoft 365, email, domain, DNS và tài khoản người dùng. KEYON chốt phạm vi với doanh nghiệp trước khi triển khai.",
} as const;

export const M365_EMAIL_FAQ = [
  {
    question: "Dịch vụ gồm những hạng mục nào?",
    answer:
      "Thiết lập Microsoft 365, email doanh nghiệp, domain, DNS và tài khoản người dùng theo phạm vi đã chốt.",
  },
  {
    question: "Doanh nghiệp cần chuẩn bị gì?",
    answer:
      "Domain, số người dùng, danh sách hộp thư cần tạo và đầu mối phụ trách. Nếu đã có tenant, cấp quyền quản trị để KEYON làm việc trên tenant đó.",
  },
  {
    question: "License Microsoft 365 được xử lý thế nào?",
    answer:
      "License mua riêng trên KEYON hoặc doanh nghiệp đã có sẵn. Dịch vụ này thực hiện thiết lập sau khi license và phạm vi đã rõ.",
  },
  {
    question: "Sau bàn giao ai vận hành tenant?",
    answer:
      "Người phụ trách của doanh nghiệp tiếp nhận tenant, hộp thư và hướng dẫn đăng nhập. Quản trị tiếp theo thuộc dịch vụ Quản lý Microsoft 365.",
  },
  {
    question: "Email đang ở hệ thống khác thì xử lý ra sao?",
    answer:
      "Chuyển hộp thư và dữ liệu thuộc dịch vụ Di chuyển Email & Dữ liệu, thực hiện khi tenant và domain mới đã sẵn sàng.",
  },
] as const;

export type M365PlanCard = {
  id: string;
  title: string;
  href: string;
  priceLabel: string;
  imageUrl?: string;
};

export type M365BrandChip = {
  name: string;
  href: string;
  logoUrl?: string;
};

const HERO_CHECKS = [
  "Thiết lập Microsoft 365 cho doanh nghiệp",
  "Gắn email doanh nghiệp với domain riêng",
  "Tạo người dùng, nhóm và quyền truy cập",
  "Đưa Outlook, Teams, OneDrive và hộp thư vào vận hành",
  "Chốt phạm vi theo số người dùng trước khi triển khai",
];

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Email theo tên miền doanh nghiệp",
    body: "Hộp thư, bí danh và bản ghi DNS để thư gửi nhận đúng địa chỉ công ty.",
    Icon: Mail,
  },
  {
    title: "Bảo mật và phân quyền",
    body: "Tài khoản, nhóm và vai trò cơ bản được cấu hình theo danh sách đã chốt.",
    Icon: ShieldCheck,
  },
  {
    title: "Làm việc trên Microsoft 365",
    body: "Outlook, Teams, OneDrive và các ứng dụng trong gói license doanh nghiệp đang dùng.",
    Icon: Cloud,
  },
  {
    title: "Bàn giao để tự vận hành",
    body: "Checklist, thông tin đăng nhập và hướng dẫn cho đầu mối phụ trách.",
    Icon: ListChecks,
  },
];

const SCOPE = [
  "Tư vấn phạm vi Microsoft 365 phù hợp số người dùng",
  "Thiết lập tenant, domain, DNS và hộp thư",
  "Tạo tài khoản cho Outlook, Teams, OneDrive và SharePoint khi nằm trong phạm vi",
  "Cấu hình nhóm, bí danh và quyền cơ bản",
  "Kiểm tra gửi và nhận email",
  "Bàn giao hướng dẫn cho người phụ trách",
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận",
    body: "Số người dùng, domain và đầu mối phụ trách.",
    Icon: ClipboardList,
  },
  {
    title: "Khảo sát",
    body: "Kiểm tra domain, DNS và tenant hiện có.",
    Icon: Search,
  },
  {
    title: "Chốt phạm vi",
    body: "Thống nhất hạng mục và thời hạn thực hiện.",
    Icon: ListChecks,
  },
  {
    title: "Triển khai",
    body: "Thiết lập email, tài khoản và quyền truy cập.",
    Icon: Settings,
  },
  {
    title: "Bàn giao",
    body: "Checklist, đăng nhập và hướng dẫn vận hành.",
    Icon: Rocket,
  },
];

const PACKAGES: {
  title: string;
  fit: string;
  points: string[];
  featured?: boolean;
}[] = [
  {
    title: "Gói Cơ bản",
    fit: "Nhóm nhỏ, mới đưa email lên Microsoft 365",
    points: ["Gắn domain và DNS email", "Tạo hộp thư ban đầu", "Hướng dẫn đăng nhập"],
  },
  {
    title: "Gói Tiêu chuẩn",
    fit: "Doanh nghiệp cần người dùng, nhóm và ứng dụng chính",
    points: [
      "Toàn bộ hạng mục gói Cơ bản",
      "Tài khoản Outlook, Teams, OneDrive",
      "Nhóm và bí danh email",
    ],
    featured: true,
  },
  {
    title: "Gói Nâng cao",
    fit: "Cần thêm SharePoint và cấu hình bảo mật cơ bản",
    points: [
      "Toàn bộ hạng mục gói Tiêu chuẩn",
      "SharePoint trong phạm vi đã chốt",
      "Rà quyền truy cập và hướng dẫn nội bộ",
    ],
  },
  {
    title: "Gói Doanh nghiệp",
    fit: "Nhiều bộ phận, cần lịch triển khai và hỗ trợ sau bàn giao",
    points: [
      "Thiết lập theo sơ đồ người dùng đã chốt",
      "Phối hợp bảo mật và phân quyền",
      "Kênh hỗ trợ trong thời hạn dịch vụ",
    ],
  },
];

const REASONS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Phạm vi chốt trước",
    body: "Hạng mục, domain và số người dùng được xác nhận trước khi bắt đầu.",
    Icon: ListChecks,
  },
  {
    title: "Bàn giao rõ người nhận",
    body: "Đầu mối phụ trách nhận checklist, tài khoản và hướng dẫn đăng nhập.",
    Icon: ClipboardList,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Trao đổi, triển khai và hướng dẫn bằng tiếng Việt trong suốt dịch vụ.",
    Icon: Headphones,
  },
  {
    title: "Nối với dịch vụ liền kề",
    body: "Chuyển dữ liệu cũ hoặc quản trị tenant sau bàn giao đi theo dịch vụ riêng.",
    Icon: LifeBuoy,
  },
];

const HANDOVER_NOTES = [
  {
    title: "Tenant và domain sẵn sàng",
    body: "Domain đã gắn, DNS email đã cập nhật, hộp thư gửi và nhận được kiểm tra.",
  },
  {
    title: "Người dùng đăng nhập được",
    body: "Danh sách tài khoản, nhóm và hướng dẫn đăng nhập lần đầu giao cho người phụ trách.",
  },
  {
    title: "Việc tiếp theo được tách riêng",
    body: "Di chuyển hộp thư cũ và quản trị định kỳ không gộp vào lần thiết lập nếu chưa chốt.",
  },
];

const APPS: { label: string; Icon: LucideIcon; tone: string }[] = [
  { label: "Outlook", Icon: Mail, tone: "bg-sky-50 text-sky-700" },
  { label: "Teams", Icon: Video, tone: "bg-violet-50 text-violet-700" },
  { label: "Word", Icon: FileText, tone: "bg-blue-50 text-blue-700" },
  { label: "Excel", Icon: FileSpreadsheet, tone: "bg-emerald-50 text-emerald-700" },
  { label: "OneDrive", Icon: FolderSync, tone: "bg-cyan-50 text-cyan-700" },
  { label: "SharePoint", Icon: Cloud, tone: "bg-teal-50 text-teal-700" },
];

const PANEL_ROWS = [
  { label: "Domain", value: "Gắn và xác minh" },
  { label: "DNS", value: "MX, SPF, DKIM" },
  { label: "Hộp thư", value: "Theo danh sách đã chốt" },
  { label: "Tài khoản", value: "Tạo và hướng dẫn đăng nhập" },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function Microsoft365EmailLanding({
  plans,
  brands,
}: {
  plans: M365PlanCard[];
  brands: M365BrandChip[];
}) {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_12%,rgba(14,165,164,0.1),transparent_42%),radial-gradient(ellipse_at_8%_88%,rgba(14,165,233,0.06),transparent_46%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav
            aria-label="Breadcrumb"
            className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
          >
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/services" className={HOVER_LINK_ACCENT}>
              Dịch vụ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Microsoft 365 & Email doanh nghiệp</span>
          </nav>

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 lg:max-w-[540px]">
              <p className={`${OVERLINE_CLASS} text-accent`}>Dịch vụ triển khai</p>
              <h1 className={`mt-3 break-words ${HERO_TITLE_CLASS}`}>
                Microsoft 365 & Email doanh nghiệp
              </h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Thiết lập Microsoft 365, email, domain, DNS và tài khoản người dùng. Phạm vi được chốt trước khi triển khai.
              </p>
              <ul className="mt-6 space-y-3">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={13} strokeWidth={3} aria-hidden />
                    </span>
                    <span className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:flex-row">
                <Link
                  href={IMPLEMENTATION_QUOTE_HREF}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl bg-accent px-6 text-white sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Yêu cầu triển khai
                </Link>
                <Link
                  href={plans.length > 0 ? "#goi-pho-bien" : "/solutions/microsoft-365-office"}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-white px-6 text-navy sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft hover:text-accent`}
                >
                  Xem các gói Microsoft 365
                </Link>
              </div>
            </div>
            <WorkspaceMosaic />
          </div>
        </div>
      </section>

      {brands.length > 0 ? (
        <section className="border-b border-border bg-white">
          <ul className="home-container flex gap-3 overflow-x-auto py-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:overflow-visible sm:py-5 [&::-webkit-scrollbar]:hidden">
            {brands.map((brand) => (
              <li key={brand.href} className="shrink-0">
                <Link
                  href={brand.href}
                  className={`flex h-12 min-w-[7.5rem] items-center justify-center rounded-xl border border-border bg-white px-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  {brand.logoUrl ? (
                    <Image
                      src={brand.logoUrl}
                      alt={brand.name}
                      width={120}
                      height={32}
                      className="h-7 w-auto max-w-[7rem] object-contain"
                    />
                  ) : (
                    <span className={CARD_TITLE_CLASS}>{brand.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi triển khai Microsoft 365 tại KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Email, tài khoản và ứng dụng được thiết lập theo phạm vi doanh nghiệp đã thống nhất.
            </p>
          </header>
          <div className="mt-7 grid items-stretch gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
            <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
              {BENEFITS.map((item) => (
                <li key={item.title} className="min-w-0">
                  <article className={`${card} p-4 sm:p-5`}>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                      <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  </article>
                </li>
              ))}
            </ul>
            <aside className={`${card} p-4 sm:p-5`}>
              <p className={CARD_TITLE_CLASS}>Không gian làm việc sau thiết lập</p>
              <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                Các ứng dụng dưới đây có trong phạm vi khi license và danh sách người dùng đã chốt.
              </p>
              <ul className="mt-4 grid grid-cols-2 gap-2">
                {APPS.map((app) => (
                  <li
                    key={app.label}
                    className={`flex items-center gap-2 rounded-xl border border-border/80 bg-[#F7FAFC] px-2.5 py-2 ${TRANSITION_UI} hover:border-accent/35 hover:bg-white`}
                  >
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${app.tone}`}>
                      <app.Icon size={15} strokeWidth={1.8} aria-hidden />
                    </span>
                    <span className={CARD_TITLE_CLASS}>{app.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-section bg-[#F4F8FB]">
        <div className="home-container grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0">
            <h2 className={SECTION_TITLE_CLASS}>Phạm vi dịch vụ triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON thực hiện các hạng mục dưới đây khi doanh nghiệp cần email và tài khoản trên Microsoft 365.
            </p>
            <ul className="mt-5 space-y-2.5">
              {SCOPE.map((line) => (
                <li key={line} className={`flex min-w-0 items-start gap-3 ${BODY_CLASS}`}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="min-w-0 break-words">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <SetupPanel />
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước từ tiếp nhận đến bàn giao cho người phụ trách.
            </p>
          </header>
          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className="min-w-0">
                <article className={`${card} items-center p-4 text-center`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <step.Icon size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className={`mt-3 ${BADGE_CLASS} text-accent`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`mt-1 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="goi-trien-khai" className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Các gói dịch vụ triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi gói là một phạm vi báo giá. KEYON xác nhận lại theo domain và số người dùng trước khi làm.
            </p>
          </header>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PACKAGES.map((pack) => (
              <li key={pack.title} className="min-w-0">
                <article
                  className={`${card} p-4 sm:p-5 ${pack.featured ? "border-accent ring-1 ring-accent/30" : ""}`}
                >
                  {pack.featured ? (
                    <span className={`mb-2 inline-flex rounded-md bg-accent-soft px-2 py-1 text-accent ${BADGE_CLASS}`}>
                      Phù hợp đa số doanh nghiệp
                    </span>
                  ) : null}
                  <h3 className={CARD_TITLE_CLASS}>{pack.title}</h3>
                  <p className={`mt-1 ${CARD_META_CLASS}`}>{pack.fit}</p>
                  <ul className="mt-4 space-y-2">
                    {pack.points.map((point) => (
                      <li key={point} className={`flex items-start gap-2 ${BODY_MUTED_CLASS}`}>
                        <Check size={14} className="mt-0.5 shrink-0 text-accent" strokeWidth={2.5} aria-hidden />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={IMPLEMENTATION_QUOTE_HREF}
                    className={`mt-5 inline-flex h-10 w-full items-center justify-center rounded-xl px-4 ${CTA_COMPACT_CLASS} ${TRANSITION_UI} ${
                      pack.featured
                        ? `bg-accent text-white hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`
                        : "border border-border bg-white text-navy hover:border-accent hover:bg-accent-soft hover:text-accent"
                    }`}
                  >
                    Liên hệ báo giá
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {plans.length > 0 ? (
        <section id="goi-pho-bien" className="home-section bg-white">
          <div className="home-container">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 max-w-2xl">
                <h2 className={SECTION_TITLE_CLASS}>Các gói Microsoft 365 trên KEYON</h2>
                <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
                  License mua riêng. Giá lấy từ catalog đang bán.
                </p>
              </div>
              <Link href="/solutions/microsoft-365-office" className={`shrink-0 ${LINK_ACCENT_CLASS}`}>
                Xem tất cả các gói Microsoft 365 →
              </Link>
            </header>
            <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-4">
              {plans.map((plan) => (
                <li key={plan.id} className="min-w-0">
                  <article className={`${card} p-3 sm:p-4`}>
                    <Link href={plan.href} className="relative block aspect-[5/4] overflow-hidden rounded-xl bg-[#F7FAFC]">
                      {plan.imageUrl ? (
                        <Image
                          src={plan.imageUrl}
                          alt={plan.title}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 1024px) 45vw, 240px"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-accent">
                          <Cloud size={36} strokeWidth={1.6} aria-hidden />
                        </span>
                      )}
                    </Link>
                    <h3 className={`mt-3 line-clamp-2 ${CARD_TITLE_CLASS}`}>{plan.title}</h3>
                    <p className={`mt-1.5 ${CARD_PRICE_CLASS} text-accent`}>{plan.priceLabel}</p>
                    <Link href={plan.href} className={`mt-3 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
                      Xem chi tiết
                      <ChevronRight size={14} strokeWidth={2.25} aria-hidden className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5" />
                    </Link>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Dịch vụ triển khai tập trung vào phạm vi đã chốt, bàn giao và hỗ trợ tiếng Việt.
            </p>
          </header>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {REASONS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp nhận lại sau triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kết quả bàn giao gắn với phạm vi đã chốt, không gồm số liệu vận hành giả định.
            </p>
          </header>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {HANDOVER_NOTES.map((note) => (
              <li key={note.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <h3 className={CARD_TITLE_CLASS}>{note.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{note.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
          </header>
          <div className="mt-6 max-w-3xl space-y-2.5">
            {M365_EMAIL_FAQ.map((item) => (
              <details
                key={item.question}
                className={`group rounded-2xl border border-border bg-white px-4 py-3 open:border-accent/40 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
              >
                <summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 ${CARD_TITLE_CLASS} [&::-webkit-details-marker]:hidden`}>
                  <span className="min-w-0 break-words">{item.question}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    aria-hidden
                    className={`shrink-0 text-muted motion-safe:transition-transform group-open:rotate-180 group-hover:text-accent ${MOTION_NORMAL}`}
                  />
                </summary>
                <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Nhận tư vấn phạm vi triển khai Microsoft 365
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Gửi domain, số người dùng và đầu mối phụ trách. KEYON xác nhận gói dịch vụ trước khi triển khai.
              </p>
            </div>
            <Link
              href={IMPLEMENTATION_QUOTE_HREF}
              className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 text-white md:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function WorkspaceMosaic() {
  return (
    <div className="min-w-0">
      <div
        className={`rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className={CARD_TITLE_CLASS}>Microsoft 365</p>
            <p className={CARD_META_CLASS}>Email và tài khoản doanh nghiệp</p>
          </div>
          <span className={`rounded-md bg-accent-soft px-2 py-1 text-accent ${BADGE_CLASS}`}>KEYON</span>
        </div>
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {APPS.map((app) => (
            <li
              key={app.label}
              className={`flex items-center gap-2 rounded-xl border border-border/80 bg-[#F7FAFC] px-2.5 py-2.5 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/35 hover:bg-white`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${app.tone}`}>
                <app.Icon size={15} strokeWidth={1.8} aria-hidden />
              </span>
              <span className={CARD_TITLE_CLASS}>{app.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SetupPanel() {
  return (
    <div className={`min-w-0 rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={CARD_TITLE_CLASS}>Phiếu thiết lập</p>
          <p className={CARD_META_CLASS}>Tenant, email và người dùng</p>
        </div>
        <span className={`rounded-md bg-navy px-2 py-1 text-white ${BADGE_CLASS}`}>KEYON</span>
      </div>
      <ul className="mt-4 space-y-2">
        {PANEL_ROWS.map((row) => (
          <li
            key={row.label}
            className={`flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-3 ${TRANSITION_UI} hover:border-accent/35 hover:bg-accent-soft/40`}
          >
            <span className={CARD_TITLE_CLASS}>{row.label}</span>
            <span className={`text-right ${CARD_META_CLASS}`}>{row.value}</span>
          </li>
        ))}
      </ul>
      <p className={`mt-3 ${CARD_META_CLASS}`}>Người phụ trách nhận checklist sau khi các hạng mục đã chốt hoàn tất.</p>
    </div>
  );
}
