import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  ClipboardList,
  Headphones,
  KeyRound,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { LANDING_CRUMB_GAP, LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
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
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

export const M365_MANAGEMENT_SLUG = "microsoft-365-management";
export const M365_MANAGEMENT_LABEL = "Quản lý Microsoft 365";
export const M365_MANAGEMENT_PATH = `/services/${M365_MANAGEMENT_SLUG}`;

export const M365_MANAGEMENT_SEO = {
  title: "Quản lý Microsoft 365 cho doanh nghiệp | KEYON",
  description:
    "KEYON quản trị người dùng, license, bảo mật và các dịch vụ trong tenant Microsoft 365 theo phạm vi đã chốt.",
} as const;

export const M365_MANAGEMENT_FAQ = [
  {
    question: "Dịch vụ quản lý Microsoft 365 gồm những gì?",
    answer:
      "Người dùng, nhóm, license, chính sách bảo mật và các dịch vụ trong tenant đã nằm trong phạm vi. License mua riêng trên KEYON hoặc doanh nghiệp đã có sẵn.",
  },
  {
    question: "Doanh nghiệp có cần cấp quyền quản trị không?",
    answer:
      "Có. KEYON làm việc trên tenant của doanh nghiệp, với quyền đúng hạng mục đã chốt. Không cần chuyển sang tenant mới nếu tenant hiện tại còn dùng.",
  },
  {
    question: "Chi phí dịch vụ được tính như thế nào?",
    answer:
      "Theo số người dùng và hạng mục đã chốt. KEYON xác nhận báo giá trước khi bắt đầu.",
  },
  {
    question: "KEYON có hỗ trợ ngoài giờ hành chính không?",
    answer:
      "Khung giờ và kênh tiếp nhận nằm trong phạm vi đã thống nhất. Dịch vụ không mặc định là hỗ trợ xuyên suốt 24 giờ.",
  },
] as const;

const HERO_CHECKS = [
  "Quản trị người dùng, nhóm, license và tenant",
  "Cấu hình bảo mật theo chính sách đã chốt",
  "Rà soát license và dịch vụ đang dùng",
  "Hỗ trợ kỹ thuật trong thời hạn dịch vụ",
];

const HERO_CHIPS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Quản lý người dùng", href: "#nguoi-dung", Icon: Users },
  { label: "Quản lý license", href: "#license", Icon: KeyRound },
  { label: "Bảo mật", href: "#bao-mat", Icon: ShieldCheck },
  { label: "Giám sát", href: "#theo-doi", Icon: BarChart3 },
];

const WORKLOADS = [
  { name: "Microsoft 365", logo: "/brand/microsoft.svg" },
  { name: "Exchange", logo: "/brand/exchange.svg" },
  { name: "SharePoint", logo: "/brand/sharepoint.svg" },
  { name: "OneDrive", logo: "/brand/onedrive.svg" },
  { name: "Teams", logo: "/brand/teams.svg" },
  { name: "Intune", logo: "/brand/intune.svg" },
  { name: "Entra ID", logo: "/brand/entra.svg" },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Vận hành ổn định",
    body: "Theo dõi đúng hạng mục đã chốt để tenant chạy đều trong thời hạn dịch vụ.",
    Icon: Settings,
  },
  {
    title: "Bảo mật trong phạm vi",
    body: "Quyền truy cập và chính sách bảo mật của gói license doanh nghiệp đang dùng.",
    Icon: ShieldCheck,
  },
  {
    title: "Rà soát license",
    body: "Đối chiếu người dùng và license trước khi gia hạn hoặc điều chỉnh.",
    Icon: KeyRound,
  },
  {
    title: "Tập trung vận hành",
    body: "Phần quản trị đã chốt do KEYON đảm nhận, doanh nghiệp giữ đầu mối phụ trách.",
    Icon: ClipboardList,
  },
];

const SCOPES: { id: string; title: string; body: string; logo: string }[] = [
  {
    id: "nguoi-dung",
    title: "Quản lý người dùng và nhóm",
    body: "Tạo, chỉnh, khóa tài khoản và nhóm trong tenant.",
    logo: "/brand/entra.svg",
  },
  {
    id: "license",
    title: "Quản lý license",
    body: "Gán, thu hồi và đối chiếu license với người dùng.",
    logo: "/brand/microsoft.svg",
  },
  {
    id: "bao-mat",
    title: "Bảo mật và phân quyền",
    body: "Chính sách và vai trò theo phạm vi đã chốt, trong khả năng của gói đang dùng.",
    logo: "/brand/intune.svg",
  },
  {
    id: "ung-dung",
    title: "Ứng dụng và dịch vụ",
    body: "Exchange, SharePoint, OneDrive, Teams, Intune và Entra ID khi nằm trong phạm vi.",
    logo: "/brand/teams.svg",
  },
  {
    id: "theo-doi",
    title: "Theo dõi trong phạm vi",
    body: "Các hạng mục đã bàn giao. KEYON không giám sát ngoài danh sách đã chốt.",
    logo: "/brand/exchange.svg",
  },
  {
    id: "ho-tro",
    title: "Hỗ trợ kỹ thuật",
    body: "Tiếp nhận qua kênh đã thống nhất, trong thời hạn dịch vụ.",
    logo: "/brand/onedrive.svg",
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Khảo sát", body: "Tenant, số người dùng và đầu mối phụ trách.", Icon: Search },
  { title: "Đề xuất", body: "Hạng mục và lịch được xác nhận trước khi làm.", Icon: ClipboardList },
  { title: "Cấu hình", body: "Thực hiện đúng danh sách đã chốt trên tenant.", Icon: Settings },
  { title: "Vận hành", body: "Theo dõi các hạng mục đã bàn giao.", Icon: ShieldCheck },
  { title: "Báo cáo", body: "Kết quả theo kỳ đã thống nhất với người phụ trách.", Icon: Headphones },
];

const REASONS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Làm trên tenant hiện có",
    body: "Không chuyển hệ thống nếu tenant Microsoft 365 còn dùng.",
    Icon: Settings,
  },
  {
    title: "Phạm vi được ghi trước",
    body: "Hạng mục, quyền truy cập và thời hạn được xác nhận trước khi làm.",
    Icon: ClipboardList,
  },
  {
    title: "Kênh hỗ trợ rõ",
    body: "Yêu cầu đi qua kênh đã thống nhất với người phụ trách.",
    Icon: Headphones,
  },
  {
    title: "Theo quy mô",
    body: "Có thể giao một phần hoặc nhiều hạng mục trong cùng một phạm vi.",
    Icon: Users,
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;
const rowCard = `group flex h-full min-w-0 items-start gap-3 overflow-hidden rounded-2xl border border-border bg-white p-3 sm:p-4 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function Microsoft365ManagementLanding({ heroImageUrl }: { heroImageUrl?: string }) {
  const heroSrc = heroImageUrl?.trim() || "";
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
            <Link href="/services" className={HOVER_LINK_ACCENT}>
              Dịch vụ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>{M365_MANAGEMENT_LABEL}</span>
          </nav>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-8">
            <div className="flex min-w-0 flex-col">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>Quản lý Microsoft 365 cho doanh nghiệp</h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                KEYON quản trị người dùng, license, bảo mật và các dịch vụ trong tenant Microsoft 365. Phạm vi được chốt trước khi làm.
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
                  Yêu cầu tư vấn dịch vụ
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/categories/office"
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Xem các gói Microsoft 365
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
            <HeroArt src={heroSrc} />
          </div>
        </div>
      </section>

      <section aria-label="Dịch vụ Microsoft 365 thường quản lý" className="border-b border-border bg-[#F8FAFC]">
        <div className="home-container py-6 lg:py-8">
          <ul className="grid grid-cols-2 gap-y-4 sm:grid-cols-4 lg:flex lg:items-center lg:justify-between">
            {WORKLOADS.map((item) => (
              <li key={item.name} className="flex min-w-0 items-center justify-center gap-2 px-1 lg:flex-1">
                <img src={item.logo} alt="" className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8" />
                <span className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="grid gap-3 lg:grid-cols-2 lg:items-end lg:gap-10">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi quản lý Microsoft 365 cùng KEYON</h2>
            <p className={SECTION_LEAD_CLASS}>
              Dịch vụ quản lý Microsoft 365 giúp vận hành tenant ổn định, trong đúng hạng mục và thời hạn đã chốt.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {BENEFITS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-10 sm:w-10 ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                      <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </div>
                  <p className={`mt-3 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="hang-muc" className="home-section scroll-mt-24 bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Các hạng mục quản lý Microsoft 365</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON chỉ làm các hạng mục đã chốt trên tenant của doanh nghiệp.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {SCOPES.map((item) => (
              <li key={item.id} id={item.id} className="scroll-mt-24">
                <article className={rowCard}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F4F7FB]">
                    <img src={item.logo} alt="" className="h-6 w-6 object-contain" />
                  </span>
                  <div className="min-w-0">
                    <h3 className={`break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                    <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai và quản lý</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước, từ khảo sát tenant đến vận hành và báo cáo trong thời hạn dịch vụ.
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

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Phạm vi, quyền trên tenant và kênh hỗ trợ được nói rõ trước khi bắt đầu.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {REASONS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent sm:h-10 sm:w-10 ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                      <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </div>
                  <p className={`mt-3 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
            <Link href="/faq" className={`inline-flex shrink-0 items-center gap-1 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả câu hỏi
              <ArrowRight size={14} aria-hidden />
            </Link>
          </header>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {M365_MANAGEMENT_FAQ.map((item) => (
              <details
                key={item.question}
                className={`group rounded-2xl border border-border bg-white px-4 py-1 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} open:border-accent/40 hover:border-accent/40`}
              >
                <summary className={`flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 ${CARD_TITLE_CLASS} [&::-webkit-details-marker]:hidden`}>
                  <span className="min-w-0 break-words">{item.question}</span>
                  <ChevronDown size={18} className={`shrink-0 text-muted ${TRANSITION_UI} group-open:rotate-180`} aria-hidden />
                </summary>
                <p className={`pb-4 ${BODY_MUTED_CLASS}`}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="flex min-w-0 max-w-2xl items-start gap-4">
              <img src="/brand/microsoft.svg" alt="" className="mt-1 hidden h-12 w-12 shrink-0 sm:block" />
              <div className="min-w-0">
                <p className={`${OVERLINE_CLASS} text-accent`}>Quản trị Microsoft 365</p>
                <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                  Liên hệ KEYON để được tư vấn giải pháp quản lý Microsoft 365 phù hợp với doanh nghiệp của bạn.
                </h2>
              </div>
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

function HeroArt({ src }: { src?: string }) {
  return (
    <div className="relative hidden h-full lg:block">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] bg-[#F4F7FB]">
        {src ? (
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 560px, 0px"
            className="object-cover object-center"
          />
        ) : null}
      </div>
      <div className={`absolute left-[6%] top-[8%] flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_FLOAT}`}>
        <img src="/brand/microsoft.svg" alt="" className="h-6 w-6 shrink-0 object-contain" />
        <span className={`whitespace-nowrap ${CARD_TITLE_CLASS}`}>Microsoft 365</span>
      </div>
      <div className="absolute right-[4%] top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
      {HERO_CHIPS.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className={`group flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_FLOAT_HOVER} ${HOVER_LIFT_CARD}`}
        >
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center text-accent ${TRANSITION_UI} group-hover:text-accent-hover`}>
            <chip.Icon size={18} strokeWidth={1.8} aria-hidden />
          </span>
          <span className={`whitespace-nowrap ${CARD_TITLE_CLASS}`}>{chip.label}</span>
        </Link>
      ))}
      </div>
    </div>
  );
}
