import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  Cloud,
  Headphones,
  Laptop,
  LifeBuoy,
  Monitor,
  Search,
  Server,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
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

export const MANAGED_IT_SLUG = "managed-it";
export const MANAGED_IT_LABEL = "Managed IT / MSP";
export const MANAGED_IT_PATH = `/services/${MANAGED_IT_SLUG}`;

export const MANAGED_IT_SEO = {
  title: "Managed IT / MSP cho doanh nghiệp | KEYON",
  description:
    "KEYON giám sát, hỗ trợ và quản trị hệ thống CNTT theo phạm vi đã chốt: máy trạm, máy chủ, mạng và các dịch vụ đã thống nhất.",
} as const;

export const MANAGED_IT_FAQ = [
  {
    question: "Dịch vụ Managed IT / MSP phù hợp với doanh nghiệp nào?",
    answer:
      "Doanh nghiệp cần người theo dõi và hỗ trợ hệ thống CNTT theo phạm vi đã chốt, chưa muốn tự vận hành toàn bộ.",
  },
  {
    question: "Chi phí dịch vụ được tính như thế nào?",
    answer: "Theo hạng mục và quy mô đã chốt. KEYON xác nhận báo giá trước khi bắt đầu.",
  },
  {
    question: "KEYON hỗ trợ những hệ thống nào?",
    answer:
      "Máy trạm, máy chủ, mạng, Microsoft 365 và các dịch vụ đã nằm trong phạm vi. Danh sách được xác nhận khi khảo sát.",
  },
  {
    question: "Khung giờ hỗ trợ được ghi thế nào?",
    answer:
      "Khung giờ và kênh tiếp nhận nằm trong phạm vi đã thống nhất. Dịch vụ không mặc định là hỗ trợ xuyên suốt 24 giờ.",
  },
] as const;

const HERO_CHECKS = [
  "Giám sát và quản trị theo phạm vi đã chốt",
  "Hỗ trợ người dùng qua kênh đã thống nhất",
  "Xử lý sự cố trong danh sách đã bàn giao",
  "Rà soát hạng mục để vận hành ổn định",
];

const HERO_CHIPS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Giám sát hệ thống", href: "#giam-sat", Icon: Activity },
  { label: "Bảo mật", href: "#bao-mat", Icon: ShieldCheck },
  { label: "Vận hành", href: "#ha-tang", Icon: Server },
  { label: "Rà soát chi phí", href: "#tu-van", Icon: Wallet },
];

const PLATFORMS = [
  { name: "Microsoft", logo: "/brand/microsoft.svg" },
  { name: "Google Cloud", logo: "/brand/googlecloud.svg" },
  { name: "Acronis", logo: "/brand/acronis.svg" },
  { name: "VMware", logo: "/brand/vmware.svg" },
  { name: "Dell", logo: "/brand/dell.svg" },
  { name: "HP", logo: "/brand/hp.svg" },
  { name: "Lenovo", logo: "/brand/lenovo.svg" },
  { name: "Fortinet", logo: "/brand/fortinet.svg" },
] as const;

const PROBLEMS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Hệ thống hay gián đoạn",
    body: "Sự cố lặp lại khi chưa có người theo dõi các hạng mục thường xuyên.",
    Icon: ShieldAlert,
  },
  {
    title: "Chi phí IT khó thấy rõ",
    body: "Hạng mục và chi phí chưa được đối chiếu theo kỳ với người phụ trách.",
    Icon: Wallet,
  },
  {
    title: "Thiếu người phụ trách",
    body: "Doanh nghiệp chưa có đầu mối vận hành hệ thống hằng ngày.",
    Icon: Users,
  },
  {
    title: "Phạm vi bảo mật chưa rõ",
    body: "Quyền truy cập và hạng mục bảo mật chưa được rà soát.",
    Icon: ShieldCheck,
  },
];

const SERVICES: { id: string; title: string; body: string; href: string; Icon: LucideIcon }[] = [
  {
    id: "giam-sat",
    title: "Giám sát hệ thống",
    body: "Theo dõi các hạng mục đã chốt và báo khi có sự cố trong phạm vi.",
    href: IMPLEMENTATION_QUOTE_HREF,
    Icon: Monitor,
  },
  {
    id: "bao-mat",
    title: "Quản lý bảo mật",
    body: "Rà soát quyền truy cập và hạng mục bảo mật đã thống nhất.",
    href: "/services/security-deployment",
    Icon: ShieldCheck,
  },
  {
    id: "nguoi-dung",
    title: "Hỗ trợ người dùng",
    body: "Tiếp nhận yêu cầu qua kênh đã thống nhất, trong thời hạn dịch vụ.",
    href: IMPLEMENTATION_QUOTE_HREF,
    Icon: Headphones,
  },
  {
    id: "ha-tang",
    title: "Hạ tầng và cloud",
    body: "Máy chủ, mạng và dịch vụ cloud nằm trong danh sách đã chốt.",
    href: "/services/cloud-server",
    Icon: Cloud,
  },
  {
    id: "thiet-bi",
    title: "Thiết bị và phần mềm",
    body: "Máy trạm, phần mềm và bản quyền theo danh sách doanh nghiệp giao.",
    href: "/categories/office",
    Icon: Laptop,
  },
  {
    id: "tu-van",
    title: "Tư vấn hạ tầng IT",
    body: "Đề xuất hạng mục tiếp theo sau khi khảo sát hệ thống hiện có.",
    href: IMPLEMENTATION_QUOTE_HREF,
    Icon: LifeBuoy,
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Khảo sát", body: "Hệ thống hiện có, đầu mối và hạng mục cần giao.", Icon: Search },
  { title: "Đề xuất", body: "Phạm vi, khung giờ và báo giá được xác nhận trước khi làm.", Icon: ClipboardList },
  { title: "Triển khai", body: "Cấu hình đúng danh sách đã chốt.", Icon: Settings },
  { title: "Vận hành", body: "Theo dõi và tiếp nhận yêu cầu trong thời hạn dịch vụ.", Icon: Activity },
  { title: "Báo cáo", body: "Kết quả theo kỳ đã thống nhất với người phụ trách.", Icon: Headphones },
];

const COMMITMENTS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Phản hồi theo kênh đã chốt", body: "Yêu cầu đi qua kênh và khung giờ đã thống nhất.", Icon: Headphones },
  { title: "Phạm vi được ghi trước", body: "Hạng mục, quyền truy cập và thời hạn được xác nhận trước khi làm.", Icon: ClipboardList },
  { title: "Hạng mục theo quy mô", body: "Có thể giao một phần hoặc nhiều hạng mục trong cùng một phạm vi.", Icon: Settings },
  { title: "Bảo mật trong phạm vi", body: "KEYON chỉ rà soát các hạng mục bảo mật đã bàn giao.", Icon: ShieldCheck },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function ManagedItLanding({ heroImageUrl }: { heroImageUrl?: string }) {
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
            <span className={BREADCRUMB_CURRENT_CLASS}>{MANAGED_IT_LABEL}</span>
          </nav>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-8">
            <div className="flex min-w-0 flex-col">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>Đối tác IT đồng hành cùng doanh nghiệp</h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                KEYON giám sát, hỗ trợ và quản trị hệ thống CNTT của doanh nghiệp. Phạm vi, khung giờ và đầu mối được chốt trước khi làm.
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
                  Liên hệ tư vấn MSP
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="#dich-vu"
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Tìm hiểu dịch vụ
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
            <HeroArt src={heroSrc} />
          </div>
        </div>
      </section>

      <section aria-label="Nền tảng thường vận hành" className="border-b border-border bg-[#F8FAFC]">
        <div className="home-container py-6 lg:py-8">
          <ul className="flex flex-wrap items-center justify-center">
            {PLATFORMS.map((item) => (
              <li key={item.name} className="flex h-14 w-1/4 min-w-0 items-center justify-center px-2 lg:h-16 lg:w-auto lg:flex-1">
                <img src={item.logo} alt={item.name} className="h-7 w-auto max-w-full object-contain sm:h-8" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp đang gặp những vấn đề này?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Những điểm thường thấy khi hệ thống chưa có người theo dõi theo phạm vi.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PROBLEMS.map((item) => (
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

      <section id="dich-vu" className="home-section scroll-mt-24 bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ Managed IT / MSP của KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi hạng mục chỉ được làm khi đã nằm trong phạm vi đã chốt với người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {SERVICES.map((item) => (
              <li key={item.id} id={item.id} className="min-w-0 scroll-mt-24">
                <article className={`${card} p-4 sm:p-5`}>
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
                    <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className={`mt-3 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  <Link href={item.href} className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
                    Tìm hiểu thêm
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="quy-trinh" className="home-section scroll-mt-24 bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai dịch vụ</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước, từ khảo sát đến vận hành và báo cáo trong thời hạn dịch vụ.
            </p>
          </header>
          <ol className="relative mt-7 grid grid-cols-2 items-stretch gap-3 lg:grid-cols-5 lg:gap-x-4">
            <li aria-hidden className="pointer-events-none absolute left-[10%] right-[10%] top-9 hidden border-t border-dashed border-border lg:block" />
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`group relative flex min-w-0 flex-col items-center gap-2 rounded-2xl border border-border bg-white p-3 text-center ${ELEVATION_HAIRLINE} lg:block lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${index === STEPS.length - 1 ? "col-span-2 w-[calc(50%-0.375rem)] justify-self-center lg:col-span-1 lg:w-auto lg:justify-self-auto" : ""}`}
              >
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
          <div className="grid items-stretch overflow-hidden rounded-[28px] lg:grid-cols-2">
            <div className="bg-navy px-5 py-7 sm:px-8 sm:py-9">
              <p className={`${OVERLINE_CLASS} text-accent`}>Cam kết dịch vụ</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>Cam kết dịch vụ của KEYON</h2>
              <p className={`mt-2.5 ${SECTION_LEAD_CLASS} !text-white/80`}>
                Phạm vi, kênh hỗ trợ và kỳ báo cáo được nói rõ trước khi bắt đầu.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {COMMITMENTS.map((item) => (
                  <li key={item.title} className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-accent">
                      <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`mt-3 break-words !text-white ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                    <p className={`mt-1 ${BODY_MUTED_CLASS} !text-white/70`}>{item.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center bg-white px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
              <h2 className={SECTION_TITLE_CLASS}>Một hệ thống IT ổn định là nền tảng để vận hành</h2>
              <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
                KEYON nhận các hạng mục đã chốt, để doanh nghiệp giữ đầu mối phụ trách và biết việc nào đang được theo dõi.
              </p>
              <Link
                href={IMPLEMENTATION_QUOTE_HREF}
                className={`mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-white sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Liên hệ tư vấn ngay
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
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
            {MANAGED_IT_FAQ.map((item) => (
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
            <div className="min-w-0 max-w-2xl">
              <p className={`${OVERLINE_CLASS} text-accent`}>Sẵn sàng vận hành</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Liên hệ KEYON để được tư vấn giải pháp Managed IT / MSP phù hợp với nhu cầu của bạn.
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
        <span className="flex h-6 w-6 shrink-0 items-center justify-center text-accent">
          <Monitor size={18} strokeWidth={1.8} aria-hidden />
        </span>
        <span className={`whitespace-nowrap ${CARD_TITLE_CLASS}`}>Managed IT</span>
      </div>
      <div className="absolute right-[4%] top-1/2 flex -translate-y-1/2 flex-col gap-2.5">
        {HERO_CHIPS.map((chip) => (
          <Link
            key={chip.label}
            href={chip.href}
            className={`group flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_FLOAT_HOVER} ${HOVER_LIFT_CARD}`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center text-accent">
              <chip.Icon size={18} strokeWidth={1.8} aria-hidden />
            </span>
            <span className={`whitespace-nowrap ${CARD_TITLE_CLASS}`}>{chip.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
