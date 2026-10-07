import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  ClipboardList,
  Cloud,
  Headphones,
  Inbox,
  ListChecks,
  Mail,
  Search,
  Server,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import {
  LANDING_CRUMB_GAP,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
import { EMAIL_MIGRATION_SERVICE_SLUG, M365_EMAIL_SERVICE_SLUG } from "@/storefront/nav/ia";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import { BrandLogo } from "@/storefront/brand-logo";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
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
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";

export const EMAIL_MIGRATION_LABEL = "Di chuyển Email & Dữ liệu doanh nghiệp";
export const EMAIL_MIGRATION_PATH = `/services/${EMAIL_MIGRATION_SERVICE_SLUG}`;

export const EMAIL_MIGRATION_SEO = {
  title: `${EMAIL_MIGRATION_LABEL} | KEYON`,
  description:
    "Chuyển hộp thư và dữ liệu từ Google Workspace, Exchange hoặc IMAP sang Microsoft 365. KEYON chốt phạm vi trước khi di chuyển.",
} as const;

export const EMAIL_MIGRATION_FAQ = [
  {
    question: "Thời gian di chuyển email và dữ liệu mất bao lâu?",
    answer:
      "Phụ thuộc số hộp thư, dung lượng và nền tảng nguồn. KEYON chốt lịch sau khi khảo sát xong.",
  },
  {
    question: "Dữ liệu có bị mất trong quá trình di chuyển không?",
    answer:
      "Phạm vi hộp thư được chốt trước. KEYON kiểm tra mẫu sau khi chuyển và liệt kê mục chưa sang được.",
  },
  {
    question: "Có chuyển được email từ Google Workspace sang Microsoft 365 không?",
    answer:
      "Có, khi hai phía đã cấp quyền truy cập và danh sách hộp thư cần chuyển đã rõ.",
  },
  {
    question: "Sau khi di chuyển, KEYON có hỗ trợ kỹ thuật không?",
    answer:
      "Người phụ trách nhận checklist và danh sách đã chuyển. Quản trị tiếp theo thuộc dịch vụ Quản lý Microsoft 365 nếu doanh nghiệp chốt thêm.",
  },
] as const;

const HERO_CHECKS = [
  "Giảm gián đoạn, lịch cắt chuyển được thống nhất trước",
  "Giữ hộp thư, thư mục và quyền trong phạm vi đã chốt",
  "Hỗ trợ di chuyển từ nhiều nền tảng nguồn",
  "Kỹ thuật KEYON theo dõi và hỗ trợ đến khi bàn giao",
];

const TECHS = [
  { name: "Microsoft", mark: "font-semibold tracking-tight" },
  { name: "Google Workspace", mark: "font-semibold tracking-tight" },
  { name: "Adobe", mark: "font-bold tracking-tight" },
  { name: "Autodesk", mark: "font-semibold tracking-tight" },
  { name: "Acronis", mark: "font-semibold tracking-tight" },
  { name: "Bitdefender", mark: "font-semibold tracking-tight" },
  { name: "ESET", mark: "font-bold tracking-[0.14em]" },
  { name: "VMware", mark: "font-bold tracking-tight" },
] as const;

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "An toàn dữ liệu",
    body: "Danh sách hộp thư được chốt trước. Mục chưa chuyển được báo lại cho người phụ trách.",
    Icon: ShieldCheck,
  },
  {
    title: "Giảm gián đoạn công việc",
    body: "Lịch cắt chuyển thống nhất để người dùng vẫn gửi và nhận thư theo kế hoạch.",
    Icon: CalendarClock,
  },
  {
    title: "Giữ nguyên cấu trúc",
    body: "Thư mục, danh bạ và lịch được ánh xạ theo sơ đồ nguồn và đích đã thống nhất.",
    Icon: Waypoints,
  },
  {
    title: "Hỗ trợ trọn gói",
    body: "Từ khảo sát, chuyển dữ liệu đến checklist bàn giao cho đầu mối phụ trách.",
    Icon: Headphones,
  },
];

const PLATFORMS: { title: string; body: string; logo?: string; Icon: LucideIcon; tone: string }[] = [
  {
    title: "Microsoft 365",
    body: "Điểm đến, hoặc nguồn khi doanh nghiệp chuyển giữa hai tenant.",
    logo: "m365",
    Icon: Cloud,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Google Workspace",
    body: "Gmail, danh bạ và lịch khi tài khoản quản trị đã cấp quyền.",
    logo: "google",
    Icon: Mail,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Exchange Server",
    body: "Hộp thư Exchange nội bộ hoặc Exchange Online trong phạm vi đã chốt.",
    logo: "exchange",
    Icon: Server,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    title: "IMAP / POP3",
    body: "Hộp thư email thường, khi máy chủ cho phép kết nối để đọc thư.",
    Icon: Inbox,
    tone: "bg-teal-50 text-teal-700",
  },
];

const STEPS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Tư vấn & khảo sát", body: "Nền tảng nguồn, số hộp thư và dung lượng.", Icon: Search },
  { title: "Lập kế hoạch", body: "Lịch cắt chuyển và danh sách hộp thư.", Icon: ClipboardList },
  { title: "Chuẩn bị hệ thống", body: "Quyền nguồn, đích và domain cần dùng.", Icon: ListChecks },
  { title: "Di chuyển dữ liệu", body: "Chuyển thư theo phạm vi đã chốt.", Icon: Waypoints },
  { title: "Kiểm tra & bàn giao", body: "Đối soát mẫu và mục chưa sang được.", Icon: ShieldCheck },
  { title: "Hỗ trợ sau chuyển", body: "Checklist và kênh hỗ trợ cho người phụ trách.", Icon: Headphones },
];

const SCENARIOS: { from: string; to: string; points: string[] }[] = [
  {
    from: "Google Workspace",
    to: "Microsoft 365",
    points: ["Thư, danh bạ và lịch trong phạm vi", "Ánh xạ hộp thư nguồn và đích", "Kiểm tra mẫu sau khi chuyển"],
  },
  {
    from: "Exchange Server",
    to: "Microsoft 365",
    points: ["Hộp thư Exchange đã cấp quyền", "Cắt chuyển theo lịch đã thống nhất", "Đối soát thư chưa sang được"],
  },
  {
    from: "IMAP / POP3",
    to: "Microsoft 365",
    points: ["Hộp thư máy chủ cho phép đọc", "Chuyển theo danh sách đã chốt", "Mục ngoài phạm vi được ghi rõ"],
  },
  {
    from: "Microsoft 365",
    to: "Microsoft 365",
    points: ["Hai tenant đã có quyền quản trị", "Giữ địa chỉ theo sơ đồ đã chốt", "Bàn giao danh sách đã chuyển"],
  },
];

const REASONS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Phạm vi chốt trước",
    body: "Nguồn, đích, số hộp thư và hạng mục dữ liệu được xác nhận trước khi bắt đầu.",
    Icon: ListChecks,
  },
  {
    title: "Quy trình rõ ràng",
    body: "Sáu bước từ khảo sát đến bàn giao, lịch cắt chuyển thống nhất với người phụ trách.",
    Icon: ClipboardList,
  },
  {
    title: "Đối soát sau chuyển",
    body: "KEYON kiểm tra mẫu và gửi danh sách mục chưa sang được.",
    Icon: ShieldCheck,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Trao đổi, lịch cắt chuyển và hướng dẫn bàn giao bằng tiếng Việt.",
    Icon: Headphones,
  },
];

const OUTCOMES = [
  {
    title: "Hộp thư theo danh sách",
    body: "Các hộp thư trong phạm vi đã chốt được chuyển sang đích và kiểm tra mẫu.",
  },
  {
    title: "Mục chưa xong được liệt kê",
    body: "Thư hoặc hộp thư chưa sang được ghi lại để người phụ trách quyết định bước tiếp.",
  },
  {
    title: "Người nhận checklist",
    body: "Đầu mối phụ trách nhận hướng dẫn đăng nhập và danh sách đã chuyển.",
  },
];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function EmailDataMigrationLanding() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="border-b border-border bg-white">
        <div className={`home-container relative overflow-hidden ${LANDING_HERO_PAD}`}>
          <Image
            src="/services/email-migration-hero.jpg"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 1200px, 0px"
            className="pointer-events-none hidden object-cover object-right lg:block"
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(90deg, #ffffff 0%, #ffffff 34%, rgba(255,255,255,0.9) 48%, rgba(255,255,255,0.3) 64%, rgba(255,255,255,0) 76%)" }} />
          <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 68%, rgba(255,255,255,0.28) 80%, rgba(255,255,255,0.72) 91%, #ffffff 100%)" }} />
          <div className="relative">
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
              <span className={BREADCRUMB_CURRENT_CLASS}>Di chuyển Email & Dữ liệu</span>
            </nav>

            <div className="max-w-xl">
              <h1 className={`break-words ${HERO_TITLE_CLASS}`}>
                Di chuyển Email &
                <span className="block">Dữ liệu doanh nghiệp</span>
              </h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Chuyển hộp thư và dữ liệu từ hệ thống hiện tại sang Microsoft 365. KEYON đồng hành từ khảo sát, lập kế hoạch đến bàn giao.
              </p>
              <ul className="mt-6 space-y-3">
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
                  Yêu cầu di chuyển
                  <ArrowRight size={16} aria-hidden />
                </Link>
                <Link
                  href={`/services/${M365_EMAIL_SERVICE_SLUG}`}
                  className={`inline-flex h-12 w-full items-center justify-center gap-1.5 text-navy sm:w-auto sm:justify-start sm:px-2 ${CTA_LABEL_CLASS} ${HOVER_LINK_ACCENT}`}
                >
                  Xem gói Microsoft 365
                  <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Nền tảng thường gặp khi di chuyển" className="border-y border-border bg-[#F8FAFC]">
        <div className="home-container flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex items-center py-4 lg:w-56 lg:shrink-0 lg:border-r lg:border-border lg:py-0 lg:pr-6">
            <p className={`${OVERLINE_CLASS} text-muted`}>Nền tảng thường gặp</p>
          </div>
          <ul className="grid grid-cols-4 lg:flex-1 lg:grid-cols-8">
            {TECHS.map((item) => (
              <li key={item.name} className="min-w-0">
                <span className={`flex h-12 items-center justify-center px-1 text-center font-display text-sm text-muted-soft lg:px-2 ${item.mark} ${TRANSITION_UI} hover:text-navy lg:h-[4.25rem]`}>
                  {item.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi di chuyển email & dữ liệu cùng KEYON</h2>
            <p className={SECTION_LEAD_CLASS}>
              Hộp thư được chuyển theo phạm vi đã thống nhất. KEYON kiểm tra mẫu và bàn giao cho người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {BENEFITS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white sm:h-10 sm:w-10">
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

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Nền tảng hỗ trợ di chuyển</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON làm việc trên nền tảng nguồn và Microsoft 365 khi doanh nghiệp đã cấp quyền.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {PLATFORMS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={
                        item.logo
                          ? "flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10"
                          : `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10 ${item.tone} transition group-hover:bg-accent group-hover:text-white`
                      }
                    >
                      {item.logo ? (
                        <BrandLogo name={item.logo} size={28} />
                      ) : (
                        <item.Icon size={18} strokeWidth={1.8} aria-hidden />
                      )}
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
            <h2 className={SECTION_TITLE_CLASS}>Quy trình di chuyển dữ liệu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Sáu bước, từ khảo sát đến bàn giao và hỗ trợ sau chuyển.
            </p>
          </header>
          <ol className="relative mt-7 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-6">
            <li aria-hidden className="pointer-events-none absolute left-[6%] right-[6%] top-[3.35rem] hidden h-px bg-border lg:block" />
            {STEPS.map((step, index) => (
              <li key={step.title} className="group relative min-w-0 text-center">
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

      <section id="kich-ban" className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Các kịch bản di chuyển phổ biến</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi kịch bản là một phạm vi. KEYON xác nhận lại nguồn, đích và danh sách hộp thư trước khi làm.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {SCENARIOS.map((item) => (
              <li key={`${item.from}-${item.to}`} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#F4F8FB] text-navy">
                      <Mail size={16} strokeWidth={1.8} aria-hidden />
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-accent" aria-hidden />
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                      <Cloud size={16} strokeWidth={1.8} aria-hidden />
                    </span>
                  </div>
                  <h3 className={`mt-3 ${CARD_TITLE_CLASS}`}>
                    Từ {item.from} sang {item.to}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {item.points.map((point) => (
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

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="grid items-end gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={SECTION_LEAD_CLASS}>
              Di chuyển gắn với phạm vi đã chốt, kiểm tra sau chuyển và bàn giao bằng tiếng Việt.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {REASONS.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent transition group-hover:bg-accent group-hover:text-white sm:h-10 sm:w-10">
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

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp nhận lại sau di chuyển</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kết quả bàn giao theo phạm vi đã chốt với người phụ trách.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {OUTCOMES.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${card} p-4 sm:p-5`}>
                  <h3 className={CARD_TITLE_CLASS}>{item.title}</h3>
                  <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
          </header>
          <ul className="mt-6 grid grid-cols-2 gap-3">
            {EMAIL_MIGRATION_FAQ.map((item) => (
              <li key={item.question} className="min-w-0">
                <article className={`flex h-full flex-col rounded-2xl border border-border/80 bg-white px-3 py-4 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}>
                  <p className={`break-words ${CARD_TITLE_CLASS}`}>{item.question}</p>
                  <p className={`mt-2 break-words ${BODY_CLASS}`}>{item.answer}</p>
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
              <p className={`${OVERLINE_CLASS} text-accent`}>Sẵn sàng chuyển đổi hệ thống email?</p>
              <h2 className={`mt-2 ${SECTION_TITLE_CLASS} !text-white`}>
                Liên hệ KEYON để được tư vấn giải pháp di chuyển phù hợp cho doanh nghiệp của bạn.
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
