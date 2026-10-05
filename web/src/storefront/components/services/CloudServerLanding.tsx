import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
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
  "Tư vấn cấu hình phù hợp nhu cầu đã nêu",
  "Triển khai Cloud Server, VPS và Dedicated Server",
  "Cấu hình hệ điều hành và phần mềm trong phạm vi",
  "Hỗ trợ DNS, SSL và sao lưu khi đã chốt",
  "Bàn giao quyền truy cập và hướng dẫn vận hành",
];

const HERO_MENU: { label: string; hint: string; href: string; Icon: LucideIcon }[] = [
  { label: "Cloud Server", hint: "Môi trường máy chủ", href: "#cloud-server", Icon: Cloud },
  { label: "VPS Linux", hint: "Theo cấu hình đã chốt", href: "#vps-linux", Icon: Terminal },
  { label: "VPS Windows", hint: "Theo cấu hình đã chốt", href: "#vps-windows", Icon: Monitor },
  { label: "Dedicated Server", hint: "Máy chủ riêng", href: "#dedicated-server", Icon: Server },
  { label: "Lưu trữ & Backup", hint: "Dịch vụ sao lưu", href: "/services/backup-disaster-recovery", Icon: HardDrive },
];

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Triển khai theo lịch",
    body: "Cấu hình và thời điểm bàn giao được chốt trước khi dựng máy chủ.",
    Icon: Settings,
  },
  {
    title: "Phạm vi rõ ràng",
    body: "Hệ điều hành, mạng và phần mềm nằm trong danh sách đã thống nhất.",
    Icon: ShieldCheck,
  },
  {
    title: "Mở rộng khi cần",
    body: "Đổi cấu hình hoặc thêm máy chủ bằng một phạm vi mới, không gộp vào lần đã chốt.",
    Icon: Network,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Trao đổi, triển khai và hướng dẫn vận hành bằng tiếng Việt.",
    Icon: Headphones,
  },
];

const SCOPE = [
  "Tư vấn cấu hình máy chủ theo nhu cầu đã nêu",
  "Triển khai Cloud Server",
  "Cấu hình VPS Linux hoặc VPS Windows",
  "Cấu hình Dedicated Server",
  "Cài hệ điều hành và phần mềm trong phạm vi",
  "Gắn tên miền, DNS và SSL khi đã có chứng chỉ",
  "Thiết lập sao lưu khi đã chốt cùng dịch vụ backup",
  "Bàn giao quyền truy cập và hướng dẫn vận hành",
];

const SCOPE_PANEL: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Cấu hình hệ điều hành", body: "Linux hoặc Windows", Icon: Monitor },
  { title: "Thiết lập mạng", body: "DNS và tên miền trong phạm vi", Icon: Network },
  { title: "Cài đặt phần mềm", body: "Theo danh sách đã chốt", Icon: Database },
  { title: "Thiết lập sao lưu", body: "Khi đi cùng dịch vụ backup", Icon: HardDrive },
  { title: "Hướng dẫn và bàn giao", body: "Quyền truy cập cho người phụ trách", Icon: Lock },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn", body: "Nhu cầu, hệ điều hành và đầu mối phụ trách.", Icon: Search },
  { title: "Thiết kế", body: "Cấu hình và phạm vi được xác nhận trước khi làm.", Icon: Settings },
  { title: "Triển khai", body: "Dựng máy chủ và cài phần trong danh sách đã chốt.", Icon: Server },
  { title: "Kiểm tra", body: "Đăng nhập, dịch vụ chính và hướng dẫn bàn giao.", Icon: ShieldCheck },
  { title: "Bàn giao", body: "Quyền truy cập và kênh hỗ trợ trong thời hạn dịch vụ.", Icon: Headphones },
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
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_82%_18%,rgba(14,165,164,0.12),transparent_46%),radial-gradient(ellipse_at_8%_90%,rgba(14,165,233,0.06),transparent_42%)]"
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
            <span className={BREADCRUMB_CURRENT_CLASS}>{CLOUD_SERVER_LABEL}</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Dịch vụ triển khai hạ tầng</p>
              <h1 className={`mt-3 break-words ${HERO_TITLE_CLASS}`}>{CLOUD_SERVER_LABEL}</h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Dựng Cloud Server, VPS và Dedicated Server theo cấu hình đã chốt. KEYON bàn giao quyền truy cập cho người phụ trách.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {HERO_CHECKS.map((item, index) => (
                  <li
                  key={item}
                  className={`flex min-w-0 items-start gap-2.5 ${index === HERO_CHECKS.length - 1 ? "col-span-2" : ""}`}
                >
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
                  Yêu cầu tư vấn triển khai
                </Link>
                <Link
                  href="#ha-tang"
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-white px-6 text-navy sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft hover:text-accent`}
                >
                  Xem các gói Cloud & Server
                </Link>
              </div>
            </div>
            <HeroMenu />
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi triển khai Cloud & Server cùng KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Máy chủ được dựng theo phạm vi đã thống nhất và bàn giao cho người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {BENEFITS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                      <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </div>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-[#F4F8FB]">
        <div className="home-container grid grid-cols-2 items-start gap-3 sm:gap-8 lg:gap-10">
          <div className="min-w-0">
            <h2 className={SECTION_TITLE_CLASS}>Các dịch vụ triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON thực hiện các hạng mục dưới đây khi doanh nghiệp cần máy chủ hoặc VPS.
            </p>
            <ul className="mt-5 space-y-2.5">
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
          <ScopePanel />
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước từ tiếp nhận nhu cầu đến bàn giao quyền truy cập.
            </p>
          </header>
          <ol className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {STEPS.map((step, index) => (
              <li key={step.title} className={`min-w-0 ${index === STEPS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}>
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
                <article className={`${card} p-3 sm:p-5`}>
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                    <item.Icon size={20} strokeWidth={1.8} aria-hidden />
                  </span>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-1.5 flex-1 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  <Link href={IMPLEMENTATION_QUOTE_HREF} className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
                    Yêu cầu triển khai
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <p className={`${BADGE_CLASS} text-accent`}>Sẵn sàng triển khai</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Nhận tư vấn giải pháp Cloud & Server
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Gửi nhu cầu, hệ điều hành và đầu mối phụ trách. KEYON xác nhận cấu hình trước khi triển khai.
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

function HeroMenu() {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-border bg-white p-3 sm:p-4 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}
    >
      <p className={CARD_TITLE_CLASS}>Hạng mục triển khai</p>
      <p className={`mt-1 ${CARD_META_CLASS}`}>Chọn phạm vi để xem mô tả hoặc dịch vụ liền kề.</p>
      <ul className="mt-3 space-y-2">
        {HERO_MENU.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/35 hover:bg-white`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white">
                <item.Icon size={16} strokeWidth={1.8} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={`block break-words ${CARD_TITLE_CLASS}`}>{item.label}</span>
                <span className={`block ${CARD_META_CLASS}`}>{item.hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScopePanel() {
  return (
    <div className={`min-w-0 rounded-2xl border border-border bg-white p-3 sm:p-5 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}>
      <p className={CARD_TITLE_CLASS}>Hạng mục bàn giao</p>
      <p className={`mt-1 ${CARD_META_CLASS}`}>Có trong phiếu khi đã được chốt.</p>
      <ul className="mt-4 space-y-2">
        {SCOPE_PANEL.map((item) => (
          <li
            key={item.title}
            className={`flex items-start gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-3 ${TRANSITION_UI} hover:border-accent/35 hover:bg-white`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent">
              <item.Icon size={16} strokeWidth={1.8} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className={`block break-words ${CARD_TITLE_CLASS}`}>{item.title}</span>
              <span className={`block ${CARD_META_CLASS}`}>{item.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
