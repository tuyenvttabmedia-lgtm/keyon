"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Handshake,
  Headphones,
  KeyRound,
  ListChecks,
  MessageCircle,
  Rocket,
  ShieldCheck,
  Users,
  X,
  Check,
} from "lucide-react";
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
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_CTA_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import { SERVICE_HANDOVER_HREF } from "@/storefront/lib/service-sku";
import {
  LANDING_CRUMB_GAP,
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";

const HERO_POINTS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bàn giao đúng phạm vi",
    body: "License, key và tài khoản được bàn giao theo đơn hàng và phạm vi đã thống nhất.",
    Icon: KeyRound,
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Hướng dẫn kích hoạt và xử lý các bước cần thiết sau khi nhận license.",
    Icon: Rocket,
  },
  {
    title: "Checklist cho IT",
    body: "Chuẩn hóa thông tin bàn giao, số lượng và phạm vi sử dụng cho đội IT.",
    Icon: ListChecks,
  },
  {
    title: "Theo dõi sau bàn giao",
    body: "Hỗ trợ kiểm tra và xử lý các vấn đề phát sinh liên quan đến license đã mua.",
    Icon: ShieldCheck,
  },
];

const IN_SCOPE: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bàn giao license",
    body: "Key, tài khoản hoặc license được bàn giao theo đơn hàng, đúng loại và số lượng đã xác nhận.",
    Icon: KeyRound,
  },
  {
    title: "Onboarding đội IT",
    body: "Hướng dẫn các bước kích hoạt, kiểm tra và quản lý license theo phạm vi người dùng.",
    Icon: Users,
  },
  {
    title: "Gắn quản lý trên KEYON",
    body: "Theo dõi license, thời hạn và thông tin bàn giao trong Tài khoản KEYON khi được hỗ trợ.",
    Icon: ListChecks,
  },
  {
    title: "Phối hợp khi có vấn đề",
    body: "Hỗ trợ kiểm tra thông tin license và phối hợp xử lý khi gặp vấn đề trong quá trình kích hoạt.",
    Icon: Handshake,
  },
];

const OUT_OF_SCOPE = [
  "Thiết kế và vận hành hạ tầng cloud, máy chủ hoặc endpoint ngoài phạm vi license.",
  "Thay thế đội IT hoặc đơn vị quản trị hệ thống thuê ngoài.",
  "Cài đặt, cấu hình hệ thống on-premise hoặc triển khai hạ tầng chuyên sâu.",
];

const PROCESS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận phạm vi",
    body: "Xác nhận sản phẩm, số lượng người dùng và đầu mối IT phụ trách.",
    Icon: ClipboardList,
  },
  {
    title: "Rà soát license",
    body: "Kiểm tra loại license, key hoặc tài khoản và phạm vi sử dụng thực tế.",
    Icon: MessageCircle,
  },
  {
    title: "Lên kế hoạch bàn giao",
    body: "Thống nhất thời gian, người nhận và các bước cần thực hiện.",
    Icon: ListChecks,
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Hướng dẫn kích hoạt và phối hợp xử lý các lỗi thường gặp.",
    Icon: Rocket,
  },
  {
    title: "Hoàn tất bàn giao",
    body: "Xác nhận thông tin bàn giao và cập nhật license để tiếp tục quản lý khi cần.",
    Icon: Headphones,
  },
];

export function ImplementationLanding() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_20%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav className={`${LANDING_CRUMB_GAP} flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
            <Link href="/" className={HOVER_LINK_ACCENT}>
              Trang chủ
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <Link href="/business" className={HOVER_LINK_ACCENT}>
              Doanh nghiệp
            </Link>
            <span aria-hidden className="text-muted-soft">
              ›
            </span>
            <span className={BREADCRUMB_CURRENT_CLASS}>Dịch vụ triển khai</span>
          </nav>

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 max-w-full lg:max-w-[540px]">
              <h1 className={`max-w-full break-words ${HERO_TITLE_CLASS}`}>
                Triển khai và bàn giao bản quyền cho doanh nghiệp
              </h1>
              <p className={`mt-4 max-w-full break-words ${PAGE_LEAD_CLASS}`}>
                KEYON hỗ trợ bàn giao, kích hoạt và hướng dẫn sử dụng bản quyền sau khi mua —
                phù hợp theo số lượng người dùng, loại license và quy mô tổ chức.
              </p>

              <ul className="mt-6 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-4">
                {HERO_POINTS.map((p) => (
                  <li key={p.title} className="flex min-w-0 flex-col">
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                        aria-hidden
                      >
                        <p.Icon size={16} strokeWidth={1.85} />
                      </span>
                      <span className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{p.title}</span>
                    </span>
                    <span className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{p.body}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href={SERVICE_HANDOVER_HREF}
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Mua gói bàn giao →
                </Link>
                <Link
                  href={IMPLEMENTATION_QUOTE_HREF}
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white px-6 sm:w-auto ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Gửi yêu cầu tùy chỉnh
                </Link>
              </div>
            </div>

            <div className="hidden min-w-0 lg:block">
              <ImplementationHeroArt />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>KEYON hỗ trợ những gì?</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Từ bàn giao license đến hỗ trợ kích hoạt, KEYON đồng hành cùng doanh nghiệp sau khi
              hoàn tất đơn hàng.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5">
            {IN_SCOPE.map((item) => (
              <li key={item.title} className="min-w-0">
                <article
                  className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3.5 sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                      aria-hidden
                    >
                      <item.Icon size={16} strokeWidth={1.8} />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </span>
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F4F8FB] home-section">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Không nằm trong phạm vi này</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON tập trung vào bản quyền, bàn giao và hỗ trợ kích hoạt; không thay thế đội ngũ
              IT hoặc đơn vị vận hành hệ thống của doanh nghiệp.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
            {OUT_OF_SCOPE.map((line, index) => (
              <li
                key={line}
                className={`min-w-0 ${index === OUT_OF_SCOPE.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <article
                  className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3.5 sm:p-5 ${ELEVATION_HAIRLINE}`}
                >
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-50 text-rose-600"
                    aria-hidden
                  >
                    <X size={13} strokeWidth={2.5} />
                  </span>
                  <p className={`mt-2 break-words ${BODY_CLASS}`}>{line}</p>
                </article>
              </li>
            ))}
          </ul>
          <aside
            className={`mt-6 min-w-0 overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-6 ${ELEVATION_HAIRLINE}`}
          >
            <p className={`${OVERLINE_CLASS} text-accent`}>Cần tư vấn trước khi mua?</p>
            <p className={`mt-3 break-words ${BODY_CLASS}`}>
              Chưa có license hoặc chưa chắc nên chọn gói nào? KEYON có thể tư vấn theo số lượng
              người dùng, nhu cầu và ngân sách trước khi triển khai.
            </p>
            <Link
              href="/business/licensing-consulting"
              className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Tư vấn chọn bản quyền →
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình triển khai</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước rõ ràng từ tiếp nhận thông tin đến bàn giao và hỗ trợ kích hoạt.
            </p>
          </header>
          <ol className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-5">
            {PROCESS.map((step, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={step.title}
                  className={`min-w-0 ${i === PROCESS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
                >
                  <article
                    className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-[#F7FAFC] p-3.5 sm:p-4 ${ELEVATION_HAIRLINE}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white ${BADGE_CLASS}`}
                      >
                        {n}
                      </span>
                      <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                    </span>
                    <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{step.body}</p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="home-section">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Cần hỗ trợ triển khai bản quyền?
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Cho biết sản phẩm, số lượng người dùng và đầu mối IT — KEYON sẽ tư vấn phạm vi bàn
                giao và hỗ trợ phù hợp.
              </p>
            </div>
            <Link
              href={IMPLEMENTATION_QUOTE_HREF}
              className={`inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-accent px-6 md:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Gửi yêu cầu →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ImplementationHeroArt() {
  const steps = [
    {
      label: "Tiếp nhận phạm vi",
      hint: "Xác nhận sản phẩm, số người dùng và đầu mối IT",
      Icon: ClipboardList,
    },
    {
      label: "Rà soát license",
      hint: "Kiểm tra loại license, key hoặc tài khoản đã mua",
      Icon: KeyRound,
    },
    {
      label: "Bàn giao",
      hint: "Thống nhất người nhận và các bước cần thực hiện",
      Icon: ListChecks,
    },
    {
      label: "Hỗ trợ kích hoạt",
      hint: "Hướng dẫn kích hoạt và xử lý lỗi thường gặp",
      Icon: Rocket,
    },
  ] as const;

  return (
    <div className="mx-auto w-full max-w-[440px] lg:max-w-none">
      <div
        className={`rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-accent">
              <Handshake size={18} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className={CARD_TITLE_CLASS}>Onboarding bản quyền</p>
              <p className={CARD_META_CLASS}>Bàn giao và kích hoạt sau khi mua</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-md bg-accent-soft px-2 py-1 ${BADGE_CLASS} text-accent`}>
            KEYON
          </span>
        </div>

        <ol className="mt-4 space-y-2">
          {steps.map((s, i) => (
            <li
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5"
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 ${BADGE_CLASS} text-accent`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-accent border border-border/70">
                <s.Icon size={15} strokeWidth={1.85} />
              </span>
              <span className="min-w-0">
                <span className={`block truncate ${CARD_TITLE_CLASS}`}>{s.label}</span>
                <span className={`block truncate ${CARD_META_CLASS}`}>{s.hint}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-3 rounded-xl border border-dashed border-border bg-[#F7FAFC] px-3 py-3">
          <p className={CARD_TITLE_CLASS}>Không thay đội IT nội bộ</p>
          <p className={`mt-1 ${CARD_META_CLASS}`}>
            KEYON bàn giao license, checklist và hướng dẫn kích hoạt theo đơn đã mua. Không cài đặt
            hạ tầng, máy chủ hoặc vận hành hệ thống thay doanh nghiệp.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {["Bàn giao license", "Checklist IT", "Hỗ trợ kích hoạt"].map((t) => (
          <li
            key={t}
            className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 ${CARD_META_CLASS} font-medium text-navy ${ELEVATION_HAIRLINE}`}
          >
            <Check size={12} className="text-accent" strokeWidth={2.5} aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
