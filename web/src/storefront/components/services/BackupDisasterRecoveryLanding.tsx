import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Check,
  Cloud,
  Database,
  HardDrive,
  Headphones,
  Monitor,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { LANDING_HERO_PAD } from "@/storefront/components/marketing/hero-shell";
import { BACKUP_DR_SERVICE_SLUG } from "@/storefront/nav/ia";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import { BrandLogo } from "@/storefront/brand-logo";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  ELEVATION_HERO_HOVER,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  HOVER_OUTLINE_FILL,
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

export const BACKUP_DR_LABEL = "Backup & Disaster Recovery";
export const BACKUP_DR_PATH = `/services/${BACKUP_DR_SERVICE_SLUG}`;

export const BACKUP_DR_SEO = {
  title: `${BACKUP_DR_LABEL} | KEYON`,
  description:
    "Triển khai sao lưu và khôi phục dữ liệu cho máy tính, máy chủ, Microsoft 365 và cloud. KEYON chốt phạm vi trước khi làm.",
} as const;

export const BACKUP_DR_FAQ = [
  {
    question: "KEYON hỗ trợ backup những loại dữ liệu nào?",
    answer:
      "Máy tính, máy chủ, máy ảo, Microsoft 365 và dữ liệu cloud nằm trong phạm vi đã chốt. Mỗi sản phẩm có giới hạn riêng của hãng.",
  },
  {
    question: "Thời gian triển khai giải pháp backup và DR mất bao lâu?",
    answer:
      "Phụ thuộc số hệ thống và phạm vi. KEYON xác nhận lịch trước khi triển khai.",
  },
  {
    question: "Dữ liệu được sao lưu ở đâu? Có an toàn không?",
    answer:
      "Bản sao nằm trên hạ tầng của doanh nghiệp hoặc nhà cung cấp phần mềm. KEYON không lưu bản sao dữ liệu. Mã hóa và quyền truy cập theo cấu hình của sản phẩm đã chọn.",
  },
  {
    question: "Chi phí triển khai backup và DR được tính như thế nào?",
    answer:
      "Theo phạm vi: số máy, sản phẩm, nơi lưu bản sao và hạng mục triển khai. KEYON báo giá sau khi khảo sát.",
  },
  {
    question: "Sau khi triển khai, KEYON có hỗ trợ kỹ thuật không?",
    answer:
      "Có, trong thời hạn dịch vụ đã chốt: hướng dẫn vận hành, rà lại chính sách sao lưu và hỗ trợ khi cần khôi phục.",
  },
] as const;

const HERO_CHECKS = [
  "Sao lưu dữ liệu máy tính, máy chủ, Microsoft 365 và cloud",
  "Thiết lập chính sách backup tự động trong phạm vi đã chốt",
  "Hỗ trợ mô hình on-premise, cloud hoặc hybrid",
  "Khôi phục khi sự cố, theo khả năng của phần mềm đã triển khai",
  "Tư vấn, triển khai và hỗ trợ kỹ thuật trong thời hạn dịch vụ",
];

const HERO_MENU: { title: string; body: string; Icon: LucideIcon; logo?: string }[] = [
  { title: "Máy tính & Máy chủ", body: "Windows, Linux", Icon: Monitor },
  { title: "Microsoft 365", body: "Exchange, OneDrive, SharePoint, Teams", Icon: Cloud, logo: "m365" },
  { title: "Cloud & Ứng dụng", body: "Azure, AWS, Google Cloud", Icon: Database },
  { title: "Máy ảo & Hệ thống", body: "VMware, Hyper-V", Icon: Server },
  { title: "Khôi phục thảm họa", body: "Off-site, snapshot, replication", Icon: ShieldCheck },
];

const PLATFORMS = [
  { name: "Acronis", mark: "font-semibold tracking-tight" },
  { name: "Microsoft", mark: "font-semibold tracking-tight" },
  { name: "veeam", mark: "font-bold lowercase tracking-tight" },
  { name: "Synology", mark: "font-semibold tracking-tight" },
  { name: "DELL", mark: "font-bold tracking-[0.14em]" },
  { name: "vmware", mark: "font-bold lowercase tracking-tight" },
  { name: "QNAP", mark: "font-bold tracking-[0.12em]" },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bảo vệ dữ liệu quan trọng",
    body: "Có bản sao cho dữ liệu cần giữ khi xóa nhầm, hỏng thiết bị hoặc sự cố hệ thống.",
    Icon: ShieldCheck,
  },
  {
    title: "Giảm thời gian gián đoạn",
    body: "Khôi phục theo điểm sao lưu của phần mềm đã triển khai, để hệ thống hoạt động lại.",
    Icon: RefreshCw,
  },
  {
    title: "Tuân thủ và an toàn",
    body: "Lịch sao lưu, nơi lưu và quyền truy cập được ghi trong phạm vi đã thống nhất.",
    Icon: HardDrive,
  },
  {
    title: "Tối ưu chi phí",
    body: "Chọn số máy, dung lượng và sản phẩm theo quy mô, không mua dư phần không dùng.",
    Icon: Settings,
  },
];

const SCOPE = [
  "Máy tính và máy chủ (Windows, Linux)",
  "Microsoft 365: Exchange, OneDrive, SharePoint, Teams",
  "Máy ảo VMware và Hyper-V",
  "Cloud Server trên Azure, AWS hoặc Google Cloud khi đã chốt",
  "Ứng dụng và cơ sở dữ liệu (SQL, MySQL) trong phạm vi",
  "Mô hình on-premise, cloud hoặc hybrid",
  "Phương án khôi phục khi sự cố",
  "Giám sát, cảnh báo và báo cáo theo sản phẩm đã triển khai",
  "Tư vấn và hỗ trợ kỹ thuật trong thời hạn dịch vụ",
];

const PROTECT_ROWS: { label: string; Icon?: LucideIcon; logo?: string }[] = [
  { label: "Servers", Icon: Server },
  { label: "Endpoints", Icon: Monitor },
  { label: "Microsoft 365", logo: "/brand/microsoft.svg" },
  { label: "Cloud VMs", Icon: Cloud },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn & khảo sát", body: "Nhu cầu, dữ liệu cần giữ và hạ tầng hiện có.", Icon: Search },
  { title: "Thiết kế giải pháp", body: "Phạm vi sao lưu, lịch chạy và nơi lưu bản sao.", Icon: Settings },
  { title: "Triển khai & cấu hình", body: "Cài phần mềm và chính sách đã chốt.", Icon: Server },
  { title: "Kiểm tra & bàn giao", body: "Chạy thử khôi phục trong phạm vi và hướng dẫn.", Icon: ShieldCheck },
  { title: "Hỗ trợ & giám sát", body: "Kênh hỗ trợ kỹ thuật trong thời hạn dịch vụ.", Icon: Headphones },
];

const PRODUCTS: { title: string; body: string; logo: string }[] = [
  {
    title: "Acronis Cyber Protect",
    body: "Sao lưu máy tính, máy chủ, máy ảo và Microsoft 365 theo gói đã chọn.",
    logo: "/brand/acronis.svg",
  },
  {
    title: "Veeam Backup",
    body: "Sao lưu máy ảo, máy chủ và hạ tầng đã chốt.",
    logo: "/brand/veeam.svg",
  },
  {
    title: "Synology",
    body: "Sao lưu về NAS và lưu trữ gắn với hệ thống doanh nghiệp.",
    logo: "/brand/synology.svg",
  },
  {
    title: "Microsoft 365 Backup",
    body: "Exchange, OneDrive, SharePoint và Teams theo sản phẩm hỗ trợ.",
    logo: "/brand/microsoft.svg",
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function BackupDisasterRecoveryLanding({ heroImageUrl }: { heroImageUrl?: string }) {
  const heroSrc = heroImageUrl?.trim() || "";
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="border-b border-border bg-white">
        <div className={`home-container ${LANDING_HERO_PAD}`}>
          <nav
            aria-label="Breadcrumb"
            className={`mb-3 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}
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
            <span className={BREADCRUMB_CURRENT_CLASS}>{BACKUP_DR_LABEL}</span>
          </nav>

          <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-6">
            <div className="flex h-full min-w-0 flex-col">
              <h1 className={HERO_TITLE_CLASS}>
                Backup & Disaster Recovery
              </h1>
              <p className={`mt-4 max-w-xl ${PAGE_LEAD_CLASS}`}>
                Triển khai sao lưu và khôi phục dữ liệu cho doanh nghiệp. KEYON thiết lập chính sách backup và quy trình khôi phục theo phạm vi đã chốt.
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
              <div className="mt-auto flex w-full min-w-0 flex-col items-stretch gap-3 pt-8 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href={IMPLEMENTATION_QUOTE_HREF}
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 text-white sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Yêu cầu tư vấn triển khai
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href="/solutions/backup"
                  className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-6 text-navy sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} ${HOVER_OUTLINE_FILL}`}
                >
                  Xem các giải pháp Backup
                </Link>
              </div>
            </div>
            <HeroStage src={heroSrc} />
          </div>
        </div>
      </section>

      <section aria-label="Nền tảng thường triển khai" className="border-y border-border bg-[#F8FAFC]">
        <div className="home-container flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex items-center py-4 lg:w-56 lg:shrink-0 lg:border-r lg:border-border lg:py-0 lg:pr-6">
            <p className={`${OVERLINE_CLASS} text-muted`}>Nền tảng thường triển khai</p>
          </div>
          <ul className="flex flex-wrap justify-center lg:grid lg:flex-1 lg:grid-cols-7">
            {PLATFORMS.map((item) => (
              <li key={item.name} className="w-1/4 min-w-0 lg:w-auto">
                <span
                  className={`flex h-12 items-center justify-center px-2 text-center font-display text-sm text-muted-soft ${item.mark} ${TRANSITION_UI} hover:text-navy lg:h-[4.25rem]`}
                >
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10">
            <h2 className={SECTION_TITLE_CLASS}>
              Vì sao doanh nghiệp cần Backup & Disaster Recovery?
            </h2>
            <p className={SECTION_LEAD_CLASS}>
              Dữ liệu vận hành cần bản sao và cách khôi phục khi sự cố. KEYON thiết kế phương án sao lưu theo hệ thống đang dùng, rồi triển khai trong phạm vi đã thống nhất.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {BENEFITS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}>
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
        <div className="home-container grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0">
            <h2 className={SECTION_TITLE_CLASS}>Các giải pháp Backup & DR</h2>
            <p className={`mt-2.5 max-w-xl ${SECTION_LEAD_CLASS}`}>
              KEYON triển khai các hạng mục dưới đây khi doanh nghiệp cần sao lưu và phương án khôi phục. Bản sao không lưu trên KEYON.
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
          <ProtectPanel />
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
          <ol className="relative mt-7 flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:gap-x-4 lg:gap-y-0">
            <li
              aria-hidden
              className="pointer-events-none absolute left-[8%] right-[8%] top-[3.35rem] hidden h-px bg-border lg:block"
            />
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

      <section id="nen-tang" className="home-section scroll-mt-24 bg-[#F7FAFC]">
        <div className="home-container">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className={SECTION_TITLE_CLASS}>Các nền tảng & sản phẩm hỗ trợ</h2>
              <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
                KEYON triển khai backup trên các nền tảng này, theo gói và phạm vi doanh nghiệp đã chọn.
              </p>
            </div>
            <Link href="/categories/backup" className={`inline-flex shrink-0 items-center gap-1 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả sản phẩm
              <ArrowRight size={14} aria-hidden />
            </Link>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PRODUCTS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <img src={item.logo} alt="" className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8" />
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </div>
                  <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  <Link href="/categories/backup" className={`mt-4 inline-flex items-center gap-1 ${LINK_ACCENT_CLASS}`}>
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
          <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
            <Link href="/faq" className={`inline-flex shrink-0 items-center gap-1 ${LINK_ACCENT_CLASS}`}>
              Xem tất cả câu hỏi
              <ArrowRight size={14} aria-hidden />
            </Link>
          </header>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {BACKUP_DR_FAQ.map((item) => (
              <li key={item.question} className="min-w-0">
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border/80 bg-white px-3 py-4 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  <p className={`break-words ${CARD_TITLE_CLASS}`}>{item.question}</p>
                  <p className={`mt-2 line-clamp-3 ${CARD_META_CLASS} ${BODY_CLASS}`}>{item.answer}</p>
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
              <p className={`${OVERLINE_CLASS} text-accent`}>Bảo vệ dữ liệu · Giảm rủi ro mất dữ liệu</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Liên hệ KEYON để được tư vấn giải pháp Backup & Disaster Recovery phù hợp cho doanh nghiệp của bạn.
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

function HeroStage({ src }: { src?: string }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      {src ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden rounded-[28px] lg:block">
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 560px, 0px"
            className="object-cover object-center"
          />
        </div>
      ) : null}
      <ul
        className={`relative z-10 flex h-full w-full flex-col justify-between rounded-2xl border border-white/80 bg-white/95 p-2.5 backdrop-blur-sm lg:ml-auto lg:max-w-[360px] ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}
      >
        {HERO_MENU.map((item) => (
          <li key={item.title}>
            <Link
              href="#giai-phap"
              className={`group flex items-center gap-2.5 rounded-xl px-2 py-2 ${TRANSITION_UI} hover:bg-accent-soft`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.logo ? "" : `bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}`}
              >
                {item.logo ? (
                  <BrandLogo name={item.logo} size={22} />
                ) : (
                  <item.Icon size={16} strokeWidth={1.8} aria-hidden />
                )}
              </span>
              <span className="min-w-0">
                <span className={`block break-words ${CARD_TITLE_CLASS}`}>{item.title}</span>
                <span className={`block ${CARD_META_CLASS}`}>{item.body}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProtectPanel() {
  return (
    <div className="relative mx-auto w-full max-w-[380px] pt-3 lg:mx-0 lg:max-w-none" aria-hidden>
      <span className={`absolute right-2 top-0 z-10 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-2.5 py-1 text-white ${BADGE_CLASS}`}>
        <Check size={12} strokeWidth={3} />
        All systems protected
      </span>
      <div className={`overflow-hidden rounded-2xl bg-navy ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}>
        <div className="flex items-center gap-2.5 px-4 pt-4 sm:px-5">
          <img src="/brand/acronis.svg" alt="" className="h-8 w-8 shrink-0" />
          <p className={`${CARD_TITLE_CLASS} !text-white`}>Acronis Cyber Protect</p>
        </div>
        <p className={`mt-4 px-4 sm:px-5 ${OVERLINE_CLASS} text-slate-400`}>Backups</p>
        <ul className="mt-1 px-2 pb-2 sm:px-3">
          {PROTECT_ROWS.map((row) => (
            <li
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sky-200">
                  {row.logo ? (
                    <img src={row.logo} alt="" className="h-4 w-4 object-contain" />
                  ) : row.Icon ? (
                    <row.Icon size={15} strokeWidth={1.8} />
                  ) : null}
                </span>
                <span className={`${BODY_CLASS} !text-white`}>{row.label}</span>
              </span>
              <span className={`inline-flex shrink-0 items-center gap-1.5 ${CARD_META_CLASS} !text-emerald-300`}>
                <Check size={14} strokeWidth={2.5} />
                Protected
              </span>
            </li>
          ))}
        </ul>
        <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl bg-sky-400/15 px-3 py-2.5 sm:mx-4">
          <Cloud size={16} className="shrink-0 text-sky-200" />
          <span className={`${CARD_META_CLASS} !text-slate-200`}>Next backup in 2 hours</span>
        </div>
      </div>
    </div>
  );
}
