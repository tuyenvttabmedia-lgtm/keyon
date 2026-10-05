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
    question: "Sau khi di chuyển, ai tiếp nhận hộp thư?",
    answer:
      "Người phụ trách nhận checklist và danh sách đã chuyển. Quản trị tiếp theo thuộc dịch vụ Quản lý Microsoft 365 nếu doanh nghiệp chốt thêm.",
  },
] as const;

const HERO_CHECKS = [
  "Giảm gián đoạn, lịch cắt chuyển được thống nhất trước",
  "Giữ hộp thư, danh bạ và lịch trong phạm vi đã chốt",
  "Hỗ trợ Google Workspace, Exchange và IMAP",
  "Đối soát sau khi chuyển và bàn giao cho người phụ trách",
];

const BENEFITS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "An toàn dữ liệu",
    body: "Danh sách hộp thư được chốt trước. Mục chưa chuyển được báo lại cho người phụ trách.",
    Icon: ShieldCheck,
  },
  {
    title: "Giảm gián đoạn",
    body: "Lịch cắt chuyển thống nhất để người dùng vẫn gửi và nhận thư theo kế hoạch.",
    Icon: CalendarClock,
  },
  {
    title: "Giữ cấu trúc hộp thư",
    body: "Ánh xạ địa chỉ, nhóm và hộp thư theo sơ đồ nguồn và đích đã thống nhất.",
    Icon: Waypoints,
  },
  {
    title: "Hỗ trợ trọn gói",
    body: "Từ khảo sát, chuyển dữ liệu đến checklist bàn giao cho đầu mối phụ trách.",
    Icon: Headphones,
  },
];

const PLATFORMS: { title: string; body: string; Icon: LucideIcon; tone: string }[] = [
  {
    title: "Microsoft 365",
    body: "Điểm đến, hoặc nguồn khi doanh nghiệp chuyển giữa hai tenant.",
    Icon: Cloud,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    title: "Google Workspace",
    body: "Gmail, danh bạ và lịch khi tài khoản quản trị đã cấp quyền.",
    Icon: Mail,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    title: "Exchange Server",
    body: "Hộp thư Exchange nội bộ hoặc Exchange Online trong phạm vi đã chốt.",
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
  { title: "Khảo sát", body: "Nền tảng nguồn, số hộp thư và dung lượng.", Icon: Search },
  { title: "Lập phương án", body: "Lịch cắt chuyển và danh sách hộp thư.", Icon: ClipboardList },
  { title: "Chuẩn bị", body: "Quyền nguồn, đích và domain cần dùng.", Icon: ListChecks },
  { title: "Di chuyển", body: "Chuyển thư theo phạm vi đã chốt.", Icon: Waypoints },
  { title: "Kiểm tra", body: "Đối soát mẫu và mục chưa sang được.", Icon: ShieldCheck },
  { title: "Bàn giao", body: "Checklist cho người phụ trách.", Icon: Mail },
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
    title: "Kiểm tra sau chuyển",
    body: "KEYON đối soát mẫu và gửi danh sách mục chưa sang được.",
    Icon: ShieldCheck,
  },
  {
    title: "Hỗ trợ tiếng Việt",
    body: "Trao đổi, lịch cắt chuyển và hướng dẫn bằng tiếng Việt.",
    Icon: Headphones,
  },
  {
    title: "Nối dịch vụ liền kề",
    body: "Chưa có tenant thì triển khai Microsoft 365 đi trước. Quản trị sau bàn giao là dịch vụ riêng.",
    Icon: Cloud,
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

const SOURCES = ["Google Workspace", "Exchange", "IMAP / POP3"];

const card = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

export function EmailDataMigrationLanding() {
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Di chuyển Email & Dữ liệu</span>
          </nav>

          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
            <div className="min-w-0">
              <p className={`${OVERLINE_CLASS} text-accent`}>Dịch vụ di chuyển</p>
              <h1 className={`mt-3 break-words ${HERO_TITLE_CLASS}`}>{EMAIL_MIGRATION_LABEL}</h1>
              <p className={`mt-4 ${PAGE_LEAD_CLASS}`}>
                Chuyển hộp thư và dữ liệu từ hệ thống hiện tại sang Microsoft 365. Phạm vi và lịch cắt chuyển được chốt trước.
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-3">
                {HERO_CHECKS.map((item) => (
                  <li key={item} className="flex min-w-0 items-start gap-2.5">
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
                  Yêu cầu di chuyển
                </Link>
                <Link
                  href={`/services/${M365_EMAIL_SERVICE_SLUG}`}
                  className={`inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-white px-6 text-navy sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft hover:text-accent`}
                >
                  Xem triển khai Microsoft 365
                </Link>
              </div>
            </div>
            <MigrationBoard />
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Lợi ích khi di chuyển email và dữ liệu với KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Hộp thư được chuyển theo phạm vi đã thống nhất, kèm kiểm tra sau khi sang đích.
            </p>
          </header>
          <div className="mt-7 grid items-stretch gap-4 lg:grid-cols-2 lg:gap-6">
            <ul className="grid min-w-0 grid-cols-2 gap-3">
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
            <aside className={`${card} p-4 sm:p-5`}>
              <p className={CARD_TITLE_CLASS}>Luồng chuyển</p>
              <p className={`mt-1 ${BODY_MUTED_CLASS}`}>
                Nguồn và đích nằm trong phạm vi đã chốt. Quyền truy cập chỉ dùng cho lần di chuyển.
              </p>
              <ul className="mt-4 space-y-2">
                {SOURCES.map((source) => (
                  <li
                    key={source}
                    className={`flex items-center justify-between gap-2 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5 ${TRANSITION_UI} hover:border-accent/35 hover:bg-white`}
                  >
                    <span className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{source}</span>
                    <ArrowRight size={14} className="shrink-0 text-accent" aria-hidden />
                  </li>
                ))}
              </ul>
              <p className={`mt-3 rounded-xl bg-accent-soft px-3 py-2.5 text-accent ${CARD_TITLE_CLASS}`}>
                Đích: Microsoft 365
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="home-section bg-[#F4F8FB]">
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
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tone} transition group-hover:bg-accent group-hover:text-white`}>
                    <item.Icon size={20} strokeWidth={1.8} aria-hidden />
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
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình di chuyển dữ liệu</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Sáu bước từ khảo sát đến bàn giao cho người phụ trách.
            </p>
          </header>
          <ol className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
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

      <section id="kich-ban" className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Các kịch bản di chuyển phổ biến</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Mỗi kịch bản là một phạm vi. KEYON xác nhận lại nguồn, đích và danh sách hộp thư trước khi làm.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {SCENARIOS.map((item) => (
              <li key={item.from} className="min-w-0">
                <article className={`${card} p-3 sm:p-5`}>
                  <p className={`${CARD_META_CLASS} text-accent`}>Từ {item.from}</p>
                  <h3 className={`mt-1 flex items-center gap-1.5 ${CARD_TITLE_CLASS}`}>
                    <ArrowRight size={14} className="shrink-0 text-accent" aria-hidden />
                    <span className="min-w-0 break-words">{item.to}</span>
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
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Vì sao doanh nghiệp chọn KEYON?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Di chuyển gắn với phạm vi đã chốt, kiểm tra sau chuyển và bàn giao tiếng Việt.
            </p>
          </header>
          <ul className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {REASONS.map((item) => (
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

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp nhận lại sau di chuyển</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Kết quả bàn giao theo phạm vi đã chốt với người phụ trách.
            </p>
          </header>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border/80 bg-white px-3 py-4 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  <p className={`break-words ${CARD_TITLE_CLASS}`}>{item.question}</p>
                  <p className={`mt-2 break-words ${CARD_META_CLASS} ${BODY_CLASS}`}>{item.answer}</p>
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
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>Nhận tư vấn phương án di chuyển email</h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Gửi nền tảng nguồn, số hộp thư và đầu mối phụ trách. KEYON xác nhận phạm vi trước khi di chuyển.
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

function MigrationBoard() {
  return (
    <div
      className={`min-w-0 rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={CARD_TITLE_CLASS}>Sang Microsoft 365</p>
          <p className={CARD_META_CLASS}>Hộp thư, danh bạ và lịch trong phạm vi</p>
        </div>
        <span className={`rounded-md bg-accent-soft px-2 py-1 text-accent ${BADGE_CLASS}`}>KEYON</span>
      </div>
      <ul className="mt-4 space-y-2">
        {SOURCES.map((source) => (
          <li
            key={source}
            className={`flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-3 ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/35 hover:bg-white`}
          >
            <span className={CARD_TITLE_CLASS}>{source}</span>
            <span className={`inline-flex items-center gap-1 text-accent ${CARD_META_CLASS}`}>
              Microsoft 365
              <ArrowRight size={14} aria-hidden />
            </span>
          </li>
        ))}
      </ul>
      <p className={`mt-3 ${CARD_META_CLASS}`}>
        Chưa có tenant thì làm dịch vụ triển khai Microsoft 365 trước khi chuyển dữ liệu.
      </p>
    </div>
  );
}
