import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  Cloud,
  Database,
  HardDrive,
  Headphones,
  Lock,
  Monitor,
  Network,
  Search,
  Server,
  Settings,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import {
  LANDING_CRUMB_GAP,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import { CLOUD_SERVER_SERVICE_SLUG } from "@/storefront/nav/ia";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  ELEVATION_HERO_HOVER,
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

export const CLOUD_SERVER_LABEL = "Cloud & Server Deployment";
export const CLOUD_SERVER_PATH = `/services/${CLOUD_SERVER_SERVICE_SLUG}`;

export const CLOUD_SERVER_SEO = {
  title: `${CLOUD_SERVER_LABEL} | KEYON`,
  description:
    "Triển khai Cloud Server, VPS Linux, VPS Windows và Dedicated Server theo phạm vi đã chốt. KEYON bàn giao quyền truy cập cho người phụ trách.",
} as const;

const HERO_CHECKS = [
  "Tư vấn giải pháp hạ tầng phù hợp với nhu cầu",
  "Triển khai Cloud Server, VPS, Dedicated Server",
  "Cấu hình hệ điều hành, bảo mật và tối ưu hiệu suất",
  "Hỗ trợ DNS, SSL, lưu trữ và sao lưu dữ liệu",
  "Đồng hành vận hành và hỗ trợ kỹ thuật sau triển khai",
];

const HERO_MENU: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Cloud Server", href: "#cloud-server", Icon: Cloud },
  { label: "VPS Linux", href: "#vps-linux", Icon: Terminal },
  { label: "VPS Windows", href: "#vps-windows", Icon: Monitor },
  { label: "Dedicated Server", href: "#dedicated-server", Icon: Server },
  { label: "Lưu trữ & Backup", href: "/services/backup-disaster-recovery", Icon: HardDrive },
];

const PLATFORMS = ["Microsoft", "VMware", "Dell", "HPE", "Lenovo", "Ubuntu", "CentOS", "Acronis"];

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Triển khai nhanh chóng",
    body: "Lịch triển khai được chốt trước. Máy chủ bàn giao theo phạm vi đã thống nhất.",
    Icon: Settings,
  },
  {
    title: "Bảo mật và ổn định",
    body: "Hệ điều hành, mạng và phân quyền nằm trong danh sách đã thống nhất trước khi dựng.",
    Icon: ShieldCheck,
  },
  {
    title: "Linh hoạt mở rộng",
    body: "Nâng cấu hình hoặc thêm máy chủ bằng một phạm vi mới khi nhu cầu tăng.",
    Icon: Network,
  },
  {
    title: "Hỗ trợ kỹ thuật chuyên sâu",
    body: "Kỹ thuật KEYON trao đổi, triển khai và hướng dẫn vận hành bằng tiếng Việt.",
    Icon: Headphones,
  },
];

const SCOPE = [
  "Tư vấn và thiết kế giải pháp hạ tầng",
  "Triển khai Cloud Server theo nền tảng đã chốt",
  "Cấu hình VPS Linux / VPS Windows",
  "Cấu hình Dedicated Server",
  "Cài đặt hệ điều hành và phần mềm trong phạm vi",
  "Thiết lập mạng, DNS và cân bằng tải khi đã chốt",
  "Thiết lập SSL và lớp bảo mật trong phạm vi",
  "Thiết lập sao lưu khi đi cùng dịch vụ backup",
  "Hướng dẫn vận hành và chuyển giao hệ thống",
];

const SCOPE_PANEL: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Cấu hình hệ điều hành", body: "Windows Server, Linux", Icon: Monitor },
  { title: "Thiết lập mạng và bảo mật", body: "DNS, SSL và tường lửa trong phạm vi", Icon: Network },
  { title: "Cài đặt phần mềm", body: "Web, cơ sở dữ liệu, email", Icon: Database },
  { title: "Thiết lập sao lưu", body: "Khi đi cùng dịch vụ backup", Icon: HardDrive },
  { title: "Hướng dẫn và bàn giao", body: "Quyền truy cập cho người phụ trách", Icon: Lock },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn & khảo sát", body: "Nhu cầu, hạ tầng hiện có và đầu mối phụ trách.", Icon: Search },
  { title: "Thiết kế & báo giá", body: "Cấu hình và phạm vi được xác nhận trước khi làm.", Icon: Settings },
  { title: "Triển khai & cấu hình", body: "Dựng máy chủ và cài phần trong danh sách đã chốt.", Icon: Server },
  { title: "Kiểm tra & bàn giao", body: "Đăng nhập, dịch vụ chính và hướng dẫn bàn giao.", Icon: ShieldCheck },
  { title: "Hỗ trợ sau triển khai", body: "Kênh hỗ trợ kỹ thuật trong thời hạn dịch vụ.", Icon: Headphones },
];

const OFFERS: { id: string; title: string; body: string; Icon: LucideIcon }[] = [
  {
    id: "cloud-server",
    title: "Cloud Server",
    body: "Máy chủ trên hạ tầng đã chọn, cấu hình theo nhu cầu đã chốt.",
    Icon: Cloud,
  },
  {
    id: "vps-linux",
    title: "VPS Linux",
    body: "VPS chạy Linux cho website, ứng dụng và dịch vụ trong phạm vi.",
    Icon: Terminal,
  },
  {
    id: "vps-windows",
    title: "VPS Windows",
    body: "VPS chạy Windows cho phần mềm và môi trường đã thống nhất.",
    Icon: Monitor,
  },
  {
    id: "dedicated-server",
    title: "Dedicated Server",
    body: "Máy chủ riêng theo cấu hình đã chốt, bàn giao quyền quản trị.",
    Icon: Server,
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function CloudServerLanding() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
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
            <span className={BREADCRUMB_CURRENT_CLASS}>{CLOUD_SERVER_LABEL}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-6">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Dịch vụ triển khai & hạ tầng</p>
              <h1 className={`mt-3 break-words ${HERO_TITLE_CLASS}`}>
                Cloud & Server
                <span className="block">Deployment</span>
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Triển khai hạ tầng cloud và máy chủ theo nhu cầu đã nêu. KEYON đồng hành từ tư vấn, thiết kế, cấu hình đến bàn giao và hỗ trợ vận hành.
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
                  Yêu cầu tư vấn triển khai
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="#ha-tang"
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Xem các gói Cloud & Server
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
            <HeroStage />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-white">
        <div className="home-container flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:gap-8 lg:py-6">
          <p className={`${OVERLINE_CLASS} shrink-0 text-muted`}>Công nghệ thường triển khai</p>
          <ul className="flex min-w-0 flex-1 gap-x-6 gap-y-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-wrap lg:justify-between lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {PLATFORMS.map((name) => (
              <li key={name} className="shrink-0">
                <span className={`font-display text-sm font-semibold tracking-tight text-muted-soft ${TRANSITION_UI} hover:text-navy`}>
                  {name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi triển khai Cloud & Server cùng KEYON</h2>
            <p className={SECTION_LEAD_CLASS}>
              Hạ tầng ổn định, bảo mật và sẵn sàng mở rộng khi nhu cầu doanh nghiệp thay đổi. KEYON bàn giao quyền truy cập cho người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {BENEFITS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <item.Icon size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="overflow-hidden bg-white">
        <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="home-section px-4 sm:px-5 lg:py-14 lg:pl-[max(1.5rem,calc((100vw-1200px)/2+1.5rem))] lg:pr-10">
            <h2 className={SECTION_TITLE_CLASS}>Các dịch vụ triển khai</h2>
            <p className={`mt-2.5 max-w-xl ${SECTION_LEAD_CLASS}`}>
              KEYON thực hiện các hạng mục dưới đây khi doanh nghiệp cần máy chủ hoặc VPS.
            </p>
            <ul className="mt-5 max-w-xl space-y-2.5">
              {SCOPE.map((line) => (
                <li key={line} className={`flex min-w-0 items-start gap-2.5 ${BODY_CLASS}`}>
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                    <Check size={12} strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="min-w-0 break-words">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[460px] lg:min-h-[560px]">
            <ServerAisle />
            <div className="absolute inset-y-6 right-3 flex w-[calc(100%-1.5rem)] max-w-[300px] items-center sm:right-6 lg:right-8">
              <ScopePanel />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước, từ tiếp nhận nhu cầu đến bàn giao và hỗ trợ sau triển khai.
            </p>
          </header>
          <ol className="relative mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-5">
            <li
              aria-hidden
              className="pointer-events-none absolute left-[8%] right-[8%] top-[3.35rem] hidden h-px bg-border lg:block"
            />
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className={`group relative min-w-0 text-center ${index === STEPS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <span className={`${BADGE_CLASS} text-accent`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="relative z-10 mx-auto mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent ring-8 ring-white transition group-hover:bg-accent group-hover:text-white">
                  <step.Icon size={18} strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ha-tang" className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Hạ tầng phổ biến</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Bốn phạm vi triển khai. KEYON xác nhận lại cấu hình trước khi dựng.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {OFFERS.map((item) => (
              <li key={item.id} id={item.id} className="min-w-0 scroll-mt-24">
                <article className={`${card} p-4 sm:p-5`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <item.Icon size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  <Link href={IMPLEMENTATION_QUOTE_HREF} className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
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
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-2xl">
              <p className={`${OVERLINE_CLASS} text-accent`}>Sẵn sàng triển khai hạ tầng cho doanh nghiệp?</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Nhận tư vấn và báo giá giải pháp Cloud & Server phù hợp với nhu cầu của bạn.
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

function HeroStage() {
  return (
    <div className="relative min-h-[300px] sm:min-h-[380px] lg:min-h-[440px]">
      <HeroScene />
      <div className="absolute right-0 top-1/2 w-[min(100%,228px)] -translate-y-1/2 sm:w-[240px]">
        <ul className={`rounded-2xl border border-white/80 bg-white/95 p-2.5 backdrop-blur-sm ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}>
          {HERO_MENU.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`group flex items-center gap-2.5 rounded-xl px-2 py-2 ${TRANSITION_UI} hover:bg-accent-soft`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                  <item.Icon size={15} strokeWidth={1.8} aria-hidden />
                </span>
                <span className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function HeroScene() {
  return (
    <svg viewBox="0 0 560 460" className="h-full w-full" role="img" aria-label="Máy chủ và điện toán đám mây">
      <defs>
        <linearGradient id="cloud-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E7F6F8" />
          <stop offset="100%" stopColor="#F7FAFC" />
        </linearGradient>
        <linearGradient id="rack-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B3A57" />
          <stop offset="100%" stopColor="#0E2438" />
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#2DD4BF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="560" height="460" fill="url(#cloud-sky)" rx="28" />
      <ellipse cx="150" cy="118" rx="78" ry="36" fill="#fff" />
      <ellipse cx="210" cy="104" rx="64" ry="32" fill="#F4FBFC" />
      <ellipse cx="118" cy="128" rx="48" ry="24" fill="#fff" />
      <ellipse cx="188" cy="92" rx="22" ry="22" fill="#D7F3F4" />
      <path d="M168 108h28v16h-8l-6 8-6-8h-8z" fill="#0E7490" opacity="0.85" />
      <ellipse cx="250" cy="392" rx="150" ry="18" fill="url(#glow)" />
      {[0, 1, 2].map((index) => {
        const x = 118 + index * 78;
        const h = index === 1 ? 210 : 176;
        const y = 360 - h;
        return (
          <g key={index}>
            <rect x={x} y={y} width="64" height={h} rx="6" fill="url(#rack-body)" />
            <rect x={x + 6} y={y + 8} width="52" height={h - 16} rx="3" fill="#10283C" />
            {Array.from({ length: index === 1 ? 8 : 6 }).map((_, row) => (
              <g key={row}>
                <rect x={x + 12} y={y + 16 + row * 24} width="40" height="16" rx="2" fill="#17344C" />
                <circle cx={x + 20} cy={y + 24 + row * 24} r="2" fill="#2DD4BF" />
                <circle cx={x + 28} cy={y + 24 + row * 24} r="2" fill="#67E8F9" />
              </g>
            ))}
          </g>
        );
      })}
      <rect x="168" y="348" width="150" height="10" rx="3" fill="#14B8A6" opacity="0.85" />
    </svg>
  );
}

function ServerAisle() {
  const columns = [36, 118, 200, 520, 602, 684];
  return (
    <svg viewBox="0 0 800 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="aisle-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#071422" />
          <stop offset="55%" stopColor="#12304A" />
          <stop offset="100%" stopColor="#07111C" />
        </linearGradient>
        <linearGradient id="aisle-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16344C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#07111C" />
        </linearGradient>
      </defs>
      <rect width="800" height="700" fill="url(#aisle-bg)" />
      <ellipse cx="400" cy="36" rx="220" ry="18" fill="#7DD3FC" opacity="0.18" />
      <polygon points="300,250 500,250 640,700 160,700" fill="#0B1C2E" opacity="0.45" />
      {columns.map((x, index) => (
        <g key={x}>
          <rect x={x} y={70} width="72" height="500" rx="4" fill={index < 3 ? "#0C2236" : "#0A1C2E"} />
          {Array.from({ length: 13 }).map((_, row) => (
            <g key={row}>
              <rect x={x + 8} y={86 + row * 36} width="56" height="26" rx="2" fill="#16344F" />
              <circle cx={x + 18} cy={99 + row * 36} r="2.2" fill={row % 3 === 0 ? "#2DD4BF" : "#38BDF8"} />
              <circle cx={x + 28} cy={99 + row * 36} r="2.2" fill="#34D399" opacity="0.85" />
            </g>
          ))}
        </g>
      ))}
      <rect y="560" width="800" height="140" fill="url(#aisle-floor)" />
    </svg>
  );
}

function ScopePanel() {
  return (
    <ul className={`w-full space-y-2 rounded-2xl border border-white/70 bg-white/95 p-3 backdrop-blur-sm ${ELEVATION_FLOAT}`}>
      {SCOPE_PANEL.map((item) => (
        <li
          key={item.title}
          className={`group flex items-start gap-3 rounded-xl px-2 py-2 ${TRANSITION_UI} hover:bg-accent-soft`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
            <item.Icon size={16} strokeWidth={1.8} aria-hidden />
          </span>
          <span className="min-w-0">
            <span className={`block break-words ${CARD_TITLE_CLASS}`}>{item.title}</span>
            <span className={`block ${CARD_META_CLASS}`}>{item.body}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
