import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  Check,
  ChevronDown,
  ChevronRight,
  Globe,
  Mail,
  ShieldCheck,
  UserRound,
  Users,
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
import { SERVICE_TOPICS } from "@/storefront/nav/ia";
import {
  BADGE_CLASS,
  BODY_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
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

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tenant Microsoft 365",
    body: "Chuẩn bị tenant và các thiết lập nền trước khi tạo người dùng.",
    Icon: ShieldCheck,
  },
  {
    title: "Domain và DNS",
    body: "Gắn domain doanh nghiệp, bản ghi MX, SPF và DKIM.",
    Icon: Globe,
  },
  {
    title: "Hộp thư",
    body: "Tạo email, bí danh và luồng gửi nhận trên Microsoft 365.",
    Icon: Mail,
  },
  {
    title: "Tài khoản người dùng",
    body: "Tạo tài khoản, gán quyền cơ bản và hướng dẫn đăng nhập.",
    Icon: Users,
  },
];

const SCOPE: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tenant",
    body: "Tạo tenant mới hoặc tiếp nhận tenant doanh nghiệp đã có. Kiểm tra tên miền mặc định và thiết lập nền.",
    Icon: ShieldCheck,
  },
  {
    title: "Domain và DNS",
    body: "Xác minh quyền sở hữu domain. Cập nhật MX, SPF, DKIM để thư gửi và nhận đúng địa chỉ doanh nghiệp.",
    Icon: Globe,
  },
  {
    title: "Email doanh nghiệp",
    body: "Tạo hộp thư, bí danh và nhóm thư theo danh sách đã chốt. Kiểm tra gửi và nhận trước khi bàn giao.",
    Icon: Mail,
  },
  {
    title: "Tài khoản",
    body: "Tạo tài khoản người dùng, gán vai trò cơ bản và gửi hướng dẫn đăng nhập lần đầu cho đầu mối phụ trách.",
    Icon: UserRound,
  },
];

const STEPS: { title: string; body: string }[] = [
  {
    title: "Tiếp nhận",
    body: "Số người dùng, domain, danh sách hộp thư và đầu mối phụ trách.",
  },
  {
    title: "Kiểm tra domain",
    body: "Xác nhận domain đang dùng và các bản ghi DNS hiện có.",
  },
  {
    title: "Thiết lập",
    body: "Tenant, email, DNS và tài khoản theo phạm vi đã chốt.",
  },
  {
    title: "Bàn giao",
    body: "Checklist, thông tin đăng nhập và hướng dẫn cho người phụ trách.",
  },
];

const HANDOVER = [
  "Tenant đã sẵn sàng hoặc xác nhận tenant hiện có",
  "Domain đã gắn và bản ghi DNS đã cập nhật",
  "Danh sách hộp thư và tài khoản đã tạo",
  "Hướng dẫn đăng nhập cho người phụ trách",
];

const ADJACENT = [
  {
    title: "Di chuyển Email & Dữ liệu",
    body: "Chuyển hộp thư, dữ liệu và người dùng từ hệ thống cũ sang tenant mới.",
    href: "/services/email-data-migration",
  },
  {
    title: "Quản lý Microsoft 365",
    body: "Quản trị người dùng, license, tenant và cấu hình sau khi bàn giao.",
    href: "/services/microsoft-365-management",
  },
  {
    title: "Microsoft 365 trên KEYON",
    body: "Chọn gói license trước khi thiết lập, hoặc khi doanh nghiệp chưa có bản quyền.",
    href: "/solutions/microsoft-365-office",
  },
];

const serviceCard = `group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`;

const iconChip = `flex shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`;

const PANEL_ROWS = [
  { label: "Domain", value: "Gắn và xác minh" },
  { label: "DNS", value: "MX, SPF, DKIM" },
  { label: "Hộp thư", value: "Theo danh sách đã chốt" },
  { label: "Tài khoản", value: "Tạo và hướng dẫn đăng nhập" },
];

export function Microsoft365EmailLanding() {
  const related = SERVICE_TOPICS.filter(
    (topic) => topic.column === "deploy" && topic.slug !== "microsoft-365-email",
  );

  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_18%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_8%_90%,rgba(14,165,233,0.05),transparent_46%)]"
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
            <div className="min-w-0 max-w-full lg:max-w-[540px]">
              <p className={`${OVERLINE_CLASS} text-accent`}>Triển khai & chuyển đổi</p>
              <h1 className={`mt-3 max-w-full break-words ${HERO_TITLE_CLASS}`}>
                Thiết lập Microsoft 365 và email doanh nghiệp
              </h1>
              <p className={`mt-4 max-w-full break-words ${PAGE_LEAD_CLASS}`}>
                Thiết lập Microsoft 365, email, domain, DNS và tài khoản người dùng. Phạm vi và thời hạn được chốt trước khi triển khai.
              </p>

              <ul className="mt-6 space-y-2.5">
                {HERO_POINTS.map((point) => (
                  <li
                    key={point.title}
                    className={`group flex min-w-0 items-start gap-3 rounded-xl border border-border/80 bg-white px-3 py-3 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                  >
                    <span className={`${iconChip} h-8 w-8`}>
                      <point.Icon size={16} strokeWidth={1.85} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className={`block break-words ${CARD_TITLE_CLASS}`}>{point.title}</span>
                      <span className={`mt-0.5 block break-words ${BODY_MUTED_CLASS}`}>{point.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={IMPLEMENTATION_QUOTE_HREF}
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl bg-accent px-6 text-white sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Gửi yêu cầu thiết lập
                </Link>
                <Link
                  href="/solutions/microsoft-365-office"
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white px-6 text-navy sm:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:border-accent hover:bg-accent-soft hover:text-accent`}
                >
                  Xem Microsoft 365
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <SetupPanel />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Phạm vi thiết lập</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Bốn hạng mục KEYON thực hiện khi doanh nghiệp cần email và tài khoản trên Microsoft 365.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-3.5">
            {SCOPE.map((item) => (
              <li key={item.title} className="min-w-0">
                <article className={`${serviceCard} p-4 sm:p-5`}>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className={`${iconChip} h-9 w-9`}>
                      <item.Icon size={16} strokeWidth={1.8} aria-hidden />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </span>
                  <p className={`mt-2.5 break-words ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-section bg-[#F4F8FB]">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Bốn bước từ tiếp nhận thông tin đến bàn giao cho người phụ trách.
            </p>
          </header>
          <ol className="mt-7 grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="min-w-0">
                <article className={`${serviceCard} p-4`}>
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white ${BADGE_CLASS} ${TRANSITION_UI} group-hover:bg-navy`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  </span>
                  <p className={`mt-2.5 break-words ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-section bg-white">
        <div className="home-container grid min-w-0 gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="min-w-0">
            <h2 className={SECTION_TITLE_CLASS}>Doanh nghiệp nhận lại</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Sau khi hoàn tất, đầu mối phụ trách có đủ thông tin để người dùng bắt đầu dùng email.
            </p>
            <ul className="mt-5 space-y-2">
              {HANDOVER.map((line) => (
                <li
                  key={line}
                  className={`group flex min-w-0 items-start gap-3 rounded-xl border border-border bg-white px-3 py-3 ${BODY_CLASS} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent ${TRANSITION_UI} group-hover:bg-accent group-hover:text-white`}
                  >
                    <Check size={12} strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className="min-w-0 break-words">{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className={SECTION_TITLE_CLASS}>Việc liền kề</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Chuyển dữ liệu cũ, quản trị sau bàn giao và mua license đi theo từng dịch vụ riêng.
            </p>
            <ul className="mt-5 space-y-3">
              {ADJACENT.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${serviceCard} p-4`}>
                    <span className={`block ${CARD_TITLE_CLASS}`}>{item.title}</span>
                    <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{item.body}</span>
                    <span className={`mt-3 inline-flex items-center gap-1 text-accent ${CTA_COMPACT_CLASS}`}>
                      Xem dịch vụ
                      <ChevronRight
                        size={14}
                        strokeWidth={2.25}
                        aria-hidden
                        className={`motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 ${MOTION_NORMAL}`}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section bg-[#F7FAFC]">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Câu hỏi thường gặp</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Phạm vi thiết lập, license và phần việc thuộc dịch vụ khác.
            </p>
          </header>
          <div className="mt-6 max-w-3xl space-y-2.5">
            {M365_EMAIL_FAQ.map((item) => (
              <details
                key={item.question}
                className={`group rounded-2xl border border-border bg-white px-4 py-3 open:border-accent/40 sm:px-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
              >
                <summary
                  className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 ${CARD_TITLE_CLASS} [&::-webkit-details-marker]:hidden`}
                >
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

      {related.length > 0 ? (
        <section className="home-section border-t border-border bg-white">
          <div className="home-container">
            <h2 className={SECTION_TITLE_CLASS}>Dịch vụ cùng nhóm</h2>
            <ul className="mt-5 grid min-w-0 gap-3 md:grid-cols-3">
              {related.map((topic) => (
                <li key={topic.slug} className="min-w-0">
                  <Link href={`/services/${topic.slug}`} className={`${serviceCard} p-4`}>
                    <span className={`block ${CARD_TITLE_CLASS}`}>{topic.label}</span>
                    <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{topic.description}</span>
                    <span className={`mt-3 inline-flex items-center gap-1 text-accent ${CTA_COMPACT_CLASS}`}>
                      Xem dịch vụ
                      <ChevronRight
                        size={14}
                        strokeWidth={2.25}
                        aria-hidden
                        className={`motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 ${MOTION_NORMAL}`}
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Sẵn sàng thiết lập email doanh nghiệp
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Gửi domain, số người dùng và đầu mối phụ trách. KEYON xác nhận phạm vi trước khi triển khai.
              </p>
            </div>
            <Link
              href={IMPLEMENTATION_QUOTE_HREF}
              className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 text-white md:w-auto ${CTA_LABEL_CLASS} ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Gửi yêu cầu thiết lập
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SetupPanel() {
  return (
    <div className="mx-auto w-full max-w-[440px] lg:max-w-none">
      <div
        className={`rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT} ${TRANSITION_PANEL} ${ELEVATION_HERO_HOVER}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-accent">
              <AtSign size={18} strokeWidth={1.8} aria-hidden />
            </span>
            <div className="min-w-0">
              <p className={CARD_TITLE_CLASS}>Phiếu thiết lập</p>
              <p className={CARD_META_CLASS}>Microsoft 365 và email doanh nghiệp</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-md bg-accent-soft px-2 py-1 text-accent ${BADGE_CLASS}`}>
            KEYON
          </span>
        </div>
        <ul className="mt-4 space-y-2">
          {PANEL_ROWS.map((row) => (
            <li
              key={row.label}
              className={`flex items-center justify-between gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5 ${TRANSITION_UI} hover:border-accent/35 hover:bg-accent-soft/50`}
            >
              <span className={CARD_TITLE_CLASS}>{row.label}</span>
              <span className={`text-right ${CARD_META_CLASS}`}>{row.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
