import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ClipboardList,
  Headphones,
  Search,
  Settings,
  ShieldCheck,
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

export const SECURITY_DEPLOYMENT_SLUG = "security-deployment";
export const SECURITY_DEPLOYMENT_LABEL = "Triển khai bảo mật";
export const SECURITY_DEPLOYMENT_PATH = `/services/${SECURITY_DEPLOYMENT_SLUG}`;

export const SECURITY_DEPLOYMENT_SEO = {
  title: "Triển khai bảo mật cho doanh nghiệp | KEYON",
  description:
    "KEYON cài đặt và cấu hình phần mềm bảo mật cho thiết bị, email, dữ liệu và mạng theo phạm vi đã chốt.",
} as const;

export const SECURITY_DEPLOYMENT_FAQ = [
  {
    question: "KEYON triển khai những hạng mục bảo mật nào?",
    answer:
      "Thiết bị, email, dữ liệu và mạng, theo sản phẩm doanh nghiệp đã chọn. KEYON xác nhận lại danh sách trước khi làm.",
  },
  {
    question: "Thời gian triển khai bảo mật mất bao lâu?",
    answer: "Phụ thuộc số thiết bị và phạm vi. KEYON xác nhận lịch trước khi triển khai.",
  },
  {
    question: "Doanh nghiệp có cần thay đổi hệ thống đang dùng không?",
    answer:
      "Chỉ các hạng mục nằm trong phạm vi đã chốt. KEYON khảo sát hệ thống hiện có trước khi cấu hình.",
  },
  {
    question: "Sau khi triển khai, KEYON có hỗ trợ kỹ thuật không?",
    answer: "Có, trong thời hạn dịch vụ đã chốt: hướng dẫn vận hành và hỗ trợ các hạng mục đã bàn giao.",
  },
] as const;

const HERO_CHECKS = [
  "Tư vấn và triển khai theo phạm vi đã chốt",
  "Bảo vệ thiết bị, email, dữ liệu và mạng",
  "Cấu hình theo sản phẩm doanh nghiệp đã chọn",
  "Hỗ trợ kỹ thuật trong thời hạn dịch vụ",
];

const HERO_CHIPS: { label: string; href: string; logo: string; place: string }[] = [
  { label: "Endpoint Security", href: "#endpoint", logo: "/brand/bitdefender.svg", place: "left-[8%] top-[12%]" },
  { label: "Email Security", href: "#email", logo: "/brand/microsoft.svg", place: "right-[6%] top-[16%]" },
  { label: "Data Protection", href: "#data", logo: "/brand/acronis.svg", place: "left-[6%] bottom-[18%]" },
  { label: "Network Security", href: "#network", logo: "/brand/fortinet.svg", place: "right-[8%] bottom-[14%]" },
];

const PLATFORMS = [
  { name: "Bitdefender", logo: "/brand/bitdefender.svg" },
  { name: "Kaspersky", logo: "/brand/kaspersky.svg" },
  { name: "ESET", logo: "/brand/eset.svg" },
  { name: "Microsoft", logo: "/brand/microsoft.svg" },
  { name: "Acronis", logo: "/brand/acronis.svg" },
  { name: "Sophos", logo: "/brand/sophos.svg" },
  { name: "Fortinet", logo: "/brand/fortinet.svg" },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bảo vệ theo phạm vi",
    body: "Thiết bị, email, dữ liệu và mạng nằm trong hạng mục đã chốt.",
    Icon: ShieldCheck,
  },
  {
    title: "Khảo sát trước khi làm",
    body: "KEYON xem hệ thống hiện có và xác nhận lại danh sách cần cấu hình.",
    Icon: Search,
  },
  {
    title: "Cấu hình theo sản phẩm",
    body: "Triển khai đúng phần mềm đã chọn, theo tài liệu của hãng.",
    Icon: Settings,
  },
  {
    title: "Báo giá theo hạng mục",
    body: "Chi phí theo số thiết bị và sản phẩm, sau khi phạm vi được chốt.",
    Icon: ClipboardList,
  },
];

const SOLUTIONS: { id: string; title: string; points: string[]; logo: string }[] = [
  {
    id: "endpoint",
    title: "Bảo mật thiết bị",
    logo: "/brand/bitdefender.svg",
    points: ["Máy tính, laptop và máy chủ", "Cài đặt sản phẩm đã chọn", "Bàn giao cho người phụ trách"],
  },
  {
    id: "email",
    title: "Bảo mật email",
    logo: "/brand/microsoft.svg",
    points: ["Lọc thư theo khả năng của sản phẩm", "Áp dụng cho hộp thư trong phạm vi", "Hướng dẫn vận hành sau cấu hình"],
  },
  {
    id: "data",
    title: "Bảo vệ dữ liệu",
    logo: "/brand/acronis.svg",
    points: ["Mã hóa hoặc phân quyền khi sản phẩm hỗ trợ", "Chỉ dữ liệu nằm trong phạm vi", "KEYON không lưu dữ liệu doanh nghiệp"],
  },
  {
    id: "network",
    title: "Bảo mật mạng",
    logo: "/brand/fortinet.svg",
    points: ["Tường lửa hoặc VPN khi đã chốt", "Phân đoạn theo sơ đồ đã thống nhất", "Kiểm tra sau khi cấu hình"],
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn và đánh giá", body: "Nhu cầu, hệ thống hiện có và đầu mối phụ trách.", Icon: Search },
  { title: "Đề xuất giải pháp", body: "Sản phẩm và hạng mục được xác nhận trước khi làm.", Icon: ClipboardList },
  { title: "Triển khai và cấu hình", body: "Cài đặt đúng danh sách đã chốt.", Icon: Settings },
  { title: "Kiểm tra và bàn giao", body: "Đối soát và hướng dẫn cho người phụ trách.", Icon: ShieldCheck },
  { title: "Hỗ trợ sau triển khai", body: "Kênh kỹ thuật trong thời hạn dịch vụ.", Icon: Headphones },
];

const REASONS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Phạm vi rõ trước khi làm",
    body: "Hạng mục, số thiết bị và sản phẩm được xác nhận cùng người phụ trách.",
    Icon: ClipboardList,
  },
  {
    title: "Bàn giao cho đúng người",
    body: "Checklist, quyền truy cập và hướng dẫn được giao sau khi cấu hình xong.",
    Icon: ShieldCheck,
  },
  {
    title: "Chọn hạng mục theo quy mô",
    body: "Doanh nghiệp có thể triển khai một lớp hoặc nhiều lớp trong cùng một phạm vi.",
    Icon: Settings,
  },
  {
    title: "Hỗ trợ trong thời hạn dịch vụ",
    body: "Kênh kỹ thuật KEYON cho các hạng mục đã bàn giao.",
    Icon: Headphones,
  },
];

const HANDOFF = [
  {
    title: "Phạm vi đã chốt",
    body: "Sản phẩm, số thiết bị và thời hạn được xác nhận trước khi bắt đầu.",
  },
  {
    title: "Bàn giao rõ người nhận",
    body: "Checklist và hướng dẫn vận hành được giao cho người phụ trách.",
  },
  {
    title: "Hỗ trợ sau cấu hình",
    body: "KEYON tiếp nhận yêu cầu trong thời hạn dịch vụ đã thống nhất.",
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function SecurityDeploymentLanding({ heroImageUrl }: { heroImageUrl?: string }) {
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Triển khai bảo mật</span>
          </nav>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-8">
            <div className="flex min-w-0 flex-col">
              <h1 className={`max-w-xl ${HERO_TITLE_CLASS}`}>Triển khai bảo mật cho doanh nghiệp</h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                KEYON cài đặt và cấu hình phần mềm bảo mật cho thiết bị, email, dữ liệu và mạng. Phạm vi được chốt trước khi triển khai.
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
                  Tư vấn triển khai
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/categories/security"
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Xem các sản phẩm bảo mật
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
            <HeroArt src={heroSrc} />
          </div>
        </div>
      </section>

      <section aria-label="Nền tảng thường triển khai" className="border-b border-border bg-[#F8FAFC]">
        <div className="home-container py-6 lg:py-8">
          <p className={`text-center ${SECTION_LEAD_CLASS}`}>Nền tảng thường triển khai</p>
          <ul className="mt-4 flex flex-wrap items-center justify-center">
            {PLATFORMS.map((item) => (
              <li key={item.name} className="flex h-16 w-1/4 min-w-0 items-center justify-center px-2 lg:h-[4.5rem] lg:w-auto lg:flex-1">
                <img src={item.logo} alt={item.name} className="h-8 w-auto max-w-full object-contain sm:h-9" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi triển khai bảo mật cùng KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON làm đúng hạng mục đã chốt, từ khảo sát đến bàn giao cho người phụ trách.
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

      <section id="giai-phap" className="home-section scroll-mt-24 bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Các giải pháp bảo mật được triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi hạng mục chỉ được làm khi đã nằm trong phạm vi. Sản phẩm do doanh nghiệp chọn trên KEYON.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {SOLUTIONS.map((item) => (
              <li key={item.id} id={item.id} className="min-w-0 scroll-mt-24">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white sm:h-10 sm:w-10">
                      <img src={item.logo} alt="" className="h-6 w-6 object-contain sm:h-7 sm:w-7" />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {item.points.map((point) => (
                      <li key={point} className={`flex min-w-0 items-start gap-2 ${BODY_MUTED_CLASS}`}>
                        <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                        <span className="min-w-0 break-words">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/categories/security" className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
                    Tìm hiểu thêm
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai bảo mật</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước, từ khảo sát đến bàn giao và hỗ trợ sau khi cấu hình xong.
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
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Phạm vi, người nhận bàn giao và kênh hỗ trợ được nói rõ trước khi triển khai.
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
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Sau khi KEYON triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kết quả bàn giao gắn với phạm vi đã chốt cùng người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
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

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
            <Link href="/faq" className={`inline-flex shrink-0 items-center gap-1 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả câu hỏi
              <ArrowRight size={14} aria-hidden />
            </Link>
          </header>
          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {SECURITY_DEPLOYMENT_FAQ.map((item) => (
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
              <p className={`${OVERLINE_CLASS} text-accent`}>Bảo vệ hệ thống · An tâm vận hành</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Liên hệ KEYON để được tư vấn giải pháp bảo mật phù hợp cho doanh nghiệp của bạn.
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
      {HERO_CHIPS.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href}
          className={`group absolute ${chip.place} flex items-center gap-2 rounded-2xl border border-white/80 bg-white/95 px-3 py-2 backdrop-blur-sm ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_FLOAT_HOVER} ${HOVER_LIFT_CARD}`}
        >
          <img src={chip.logo} alt="" className="h-6 w-6 shrink-0 object-contain" />
          <span className={`whitespace-nowrap ${CARD_TITLE_CLASS}`}>{chip.label}</span>
        </Link>
      ))}
    </div>
  );
}
