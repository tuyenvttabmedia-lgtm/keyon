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
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  HOVER_LINK_ACCENT,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { IMPLEMENTATION_QUOTE_HREF } from "@/storefront/lib/cta";
import { SERVICE_HANDOVER_HREF } from "@/storefront/lib/service-sku";

const ICON_SM = { size: 16, strokeWidth: 1.85 } as const;
const ICON_MD = { size: 20, strokeWidth: 1.75 } as const;

const HERO_POINTS: { title: string; Icon: LucideIcon }[] = [
  { title: "Bàn giao sau mua", Icon: KeyRound },
  { title: "Kích hoạt theo quy mô", Icon: Users },
  { title: "Checklist cho IT", Icon: ListChecks },
  { title: "Không giả MSP cloud", Icon: ShieldCheck },
];

const IN_SCOPE: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Bàn giao license",
    body: "Key, tài khoản vendor hoặc gói đã mua — rõ loại nhận trước khi kích hoạt.",
    Icon: KeyRound,
  },
  {
    title: "Onboarding đội IT",
    body: "Hướng dẫn kích hoạt, gán seat và checklist rollout cho số lượng lớn.",
    Icon: Users,
  },
  {
    title: "Gắn quản lý trên KEYON",
    body: "Đưa license vào Tài khoản để theo dõi hạn và gia hạn sau khi bàn giao.",
    Icon: ListChecks,
  },
  {
    title: "Phối hợp khi kẹt vendor",
    body: "Hỗ trợ kênh với nhà cung cấp khi kích hoạt hoặc gán bản quyền bị chặn.",
    Icon: Handshake,
  },
];

const OUT_OF_SCOPE = [
  "Thiết kế Azure landing zone, Intune, Purview hay SOC Defender",
  "Thay thế đối tác MSP / triển khai hạ tầng cloud",
  "Cài đặt on-prem tùy chỉnh ngoài phạm vi kích hoạt bản quyền",
];

const PROCESS: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Tiếp nhận phạm vi",
    body: "Sản phẩm đã mua hoặc sẽ mua, số máy / người dùng, đội IT phụ trách.",
    Icon: ClipboardList,
  },
  {
    title: "Rà soát license",
    body: "Khớp loại nhận (key / tài khoản / gói) với quy mô thực tế.",
    Icon: MessageCircle,
  },
  {
    title: "Kế hoạch bàn giao",
    body: "Thứ tự kích hoạt, người nhận, và kênh hỗ trợ trong quá trình rollout.",
    Icon: ListChecks,
  },
  {
    title: "Hỗ trợ kích hoạt",
    body: "Đồng hành IT khi gán seat và xử lý lỗi kích hoạt thường gặp.",
    Icon: Rocket,
  },
  {
    title: "Checklist bàn giao",
    body: "Xác nhận đã nhận đủ, đã vào Tài khoản KEYON khi khách muốn quản lý tập trung.",
    Icon: Headphones,
  },
];

export function ImplementationLanding() {
  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_20%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className="home-container relative py-8 md:py-10 lg:py-11">
          <nav className={`mb-6 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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

          <div className="max-w-[640px]">
            <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
              Dịch vụ triển khai
            </p>
            <h1 className={`mt-3 max-w-[20ch] ${HERO_TITLE_CLASS}`}>
              Bàn giao và kích hoạt bản quyền theo quy mô tổ chức
            </h1>
            <p className={`mt-4 max-w-[540px] ${PAGE_LEAD_CLASS}`}>
              KEYON hỗ trợ onboarding sau khi mua — không bán catalog MSP kiểu Pax8
              (Azure, Intune, Defender) nếu chưa giao dịch vụ đó.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {HERO_POINTS.map((p) => (
                <li key={p.title} className="flex items-center gap-2.5">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <p.Icon {...ICON_SM} />
                  </span>
                  <span className={`${BODY_CLASS} font-medium`}>{p.title}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={SERVICE_HANDOVER_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Mua gói bàn giao →
              </Link>
              <Link
                href={IMPLEMENTATION_QUOTE_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Gửi yêu cầu tùy chỉnh
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Phạm vi KEYON làm</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Triển khai = bàn giao và kích hoạt bản quyền. Tư vấn bản quyền = chọn gói
              trước khi mua.
            </p>
          </header>
          <ul className="mt-9 grid gap-4 sm:grid-cols-2">
            {IN_SCOPE.map((item) => (
              <li key={item.title}>
                <article
                  className={`flex h-full gap-3.5 rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <item.Icon {...ICON_MD} />
                  </span>
                  <div className="min-w-0">
                    <h3 className={CARD_TITLE_CLASS}>{item.title}</h3>
                    <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F4F8FB] py-10 md:py-12 lg:py-14">
        <div className="home-container grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Không nằm trong phạm vi này</h2>
            <p className={`mt-2.5 max-w-xl ${SECTION_LEAD_CLASS}`}>
              Tránh nhầm với professional services hạ tầng. Nếu cần MSP cloud, KEYON
              giới thiệu hướng — không ghi catalog giả.
            </p>
            <ul className="mt-6 space-y-3">
              {OUT_OF_SCOPE.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600"
                    aria-hidden
                  >
                    <X size={12} strokeWidth={2.5} />
                  </span>
                  <span className={BODY_CLASS}>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside
            className={`rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
          >
            <p className={`${OVERLINE_CLASS} text-accent`}>Khác tư vấn bản quyền</p>
            <p className={`mt-3 ${CARD_TITLE_CLASS}`}>
              Tư vấn chọn gói trước khi mua. Triển khai sau khi đã có (hoặc sắp có) license.
            </p>
            <p className={`mt-2 ${CARD_META_CLASS}`}>
              Yêu cầu đi form báo giá loại triển khai — KEYON tiếp nhận qua email/ticket,
              không tự tạo đơn trên giỏ hàng.
            </p>
            <Link
              href="/business/licensing-consulting"
              className={`mt-4 inline-flex ${CARD_META_CLASS} font-medium ${HOVER_LINK_ACCENT}`}
            >
              Sang trang tư vấn bản quyền →
            </Link>
          </aside>
        </div>
      </section>

      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Quy trình</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Năm bước — từ yêu cầu đến checklist bàn giao.
            </p>
          </header>
          <ol className="relative mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {PROCESS.map((step, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={step.title} className="flex flex-col items-center text-center">
                  <span className={`${BADGE_CLASS} mb-2 font-semibold text-muted`}>{n}</span>
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 border-accent/40 bg-white text-accent ${ELEVATION_HAIRLINE}`}
                    aria-hidden
                  >
                    <step.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-3.5 ${CARD_TITLE_CLASS}`}>{step.title}</h3>
                  <p className={`mt-1.5 max-w-[16rem] ${BODY_MUTED_CLASS}`}>{step.body}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="pb-10 pt-2 md:pb-12 lg:pb-14">
        <div className="home-container">
          <div className="flex flex-col items-stretch gap-5 rounded-2xl bg-navy px-5 py-7 sm:px-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-9">
            <div className="min-w-0 max-w-xl">
              <h2 className={`${SECTION_TITLE_CLASS} !text-white`}>
                Cần hỗ trợ bàn giao hoặc kích hoạt?
              </h2>
              <p className={`mt-2 ${SECTION_LEAD_CLASS} !text-slate-300`}>
                Mô tả sản phẩm, số người dùng và stack hiện tại — KEYON tiếp nhận như yêu
                cầu báo giá, gắn loại triển khai.
              </p>
            </div>
            <Link
              href={IMPLEMENTATION_QUOTE_HREF}
              className={`inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
            >
              Gửi yêu cầu →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
