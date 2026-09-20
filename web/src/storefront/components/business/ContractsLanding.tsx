"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  FileText,
  KeyRound,
  Lock,
  RefreshCw,
  ShoppingBag,
  Check,
} from "lucide-react";
import {
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
import {
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";

const ICON_MD = { size: 20, strokeWidth: 1.75 } as const;

const WHAT_YOU_SEE: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Đơn hàng sau đăng nhập",
    body: "Xem giao dịch KEYON đã ghi nhận trên tài khoản tổ chức.",
    Icon: ShoppingBag,
  },
  {
    title: "License trong Tài khoản",
    body: "Key / tài khoản đã bàn giao nằm ở mục tài sản — theo dõi hạn và gia hạn.",
    Icon: KeyRound,
  },
  {
    title: "Gia hạn & PO qua sales",
    body: "Nhu cầu kỳ hạn, báo giá volume hoặc subscription: gửi yêu cầu kinh doanh, không tự tạo HĐ pháp lý trên web.",
    Icon: RefreshCw,
  },
];

const NOT_YET = [
  "Cổng ký số / số hợp đồng pháp lý riêng",
  "Hồ sơ HĐ tách khỏi đơn hàng trên web",
  "Xem đơn khi chưa đăng nhập — portal chỉ mở sau khi có tài khoản",
];

export function ContractsLanding() {
  return (
    <div className="bg-white">
      <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_20%,rgba(14,165,164,0.08),transparent_42%),radial-gradient(ellipse_at_10%_90%,rgba(14,165,233,0.05),transparent_48%)]"
          aria-hidden
        />
        <div className={`home-container relative ${LANDING_HERO_PAD}`}>
          <nav className={`mb-5 flex flex-wrap items-center gap-1.5 ${BREADCRUMB_CLASS}`}>
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Hợp đồng & đơn hàng</span>
          </nav>

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 max-w-[540px]">
              <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
                Doanh nghiệp
              </p>
              <h1 className={`mt-3 max-w-[20ch] ${HERO_TITLE_CLASS}`}>
                Theo dõi đơn hàng và giao dịch tổ chức trên KEYON
              </h1>
              <p className={`mt-4 max-w-[540px] ${PAGE_LEAD_CLASS}`}>
                Đây chưa phải cổng hợp đồng pháp lý. Sau đăng nhập, tổ chức xem đơn và
                license đã mua; PO / gia hạn tập trung qua đội kinh doanh.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/account/orders"
                  className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Đăng nhập xem đơn hàng →
                </Link>
                <Link
                  href="/contact/quote?intent=business"
                  className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Liên hệ kinh doanh
                </Link>
              </div>
            </div>

            <div className="relative min-w-0">
              <ContractsHeroArt />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-12 lg:py-14">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Bạn theo dõi được gì hôm nay</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Đọc từ đơn hàng và tài sản đã có trên Tài khoản. Admin có thể tìm
              đơn bằng gợi ý domain/tên lead — không cấp quyền xem chéo cho khách.
            </p>
          </header>
          <ul className="mt-9 grid gap-4 md:grid-cols-3">
            {WHAT_YOU_SEE.map((item) => (
              <li key={item.title}>
                <article
                  className={`flex h-full flex-col rounded-2xl border border-border bg-white p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER}`}
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent"
                    aria-hidden
                  >
                    <item.Icon {...ICON_MD} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  <p className={`mt-1.5 ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F4F8FB] py-10 md:py-12 lg:py-14">
        <div className="home-container grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className={SECTION_TITLE_CLASS}>Chưa có trên trang này</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Pha sau: lọc đơn theo công ty khi sales cần. Số hợp đồng pháp lý chỉ khi
              nghiệp vụ và hồ sơ pháp lý yêu cầu.
            </p>
            <ul className="mt-6 space-y-3">
              {NOT_YET.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-navy"
                    aria-hidden
                  >
                    <Lock size={11} strokeWidth={2.4} />
                  </span>
                  <span className={BODY_CLASS}>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside
            className={`rounded-2xl border border-border bg-white p-5 sm:p-6 ${ELEVATION_HAIRLINE}`}
          >
            <FileText className="text-accent" size={22} strokeWidth={1.7} aria-hidden />
            <p className={`mt-3 ${CARD_TITLE_CLASS}`}>Cần báo giá hoặc PO?</p>
            <p className={`mt-1.5 ${CARD_META_CLASS}`}>
              Gửi yêu cầu báo giá — không dùng giỏ hàng cho giao dịch doanh nghiệp lớn.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <Link
                href="/contact/quote?intent=volume-quote"
                className={`inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Báo giá volume
              </Link>
              <Link
                href="/business/subscriptions"
                className={`inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent`}
              >
                Subscription
              </Link>
            </div>
            <p className={`mt-4 inline-flex items-center gap-1.5 ${CARD_META_CLASS}`}>
              <ClipboardList size={14} strokeWidth={1.8} aria-hidden />
              Đơn lẻ sau login: Tài khoản → Đơn hàng
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ContractsHeroArt() {
  const rows = [
    { label: "Đơn hàng tổ chức", hint: "Sau đăng nhập", Icon: ShoppingBag, tone: "bg-sky-100 text-sky-800" },
    { label: "License đã bàn giao", hint: "Trong Tài khoản", Icon: KeyRound, tone: "bg-accent/15 text-accent" },
    { label: "Gia hạn / PO", hint: "Qua đội kinh doanh", Icon: RefreshCw, tone: "bg-amber-100 text-amber-800" },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
      <div
        className={`relative rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy text-accent">
              <ClipboardList size={18} strokeWidth={1.8} />
            </span>
            <div>
              <p className={CARD_TITLE_CLASS}>Portal đơn hàng</p>
              <p className={CARD_META_CLASS}>Sau đăng nhập tài khoản</p>
            </div>
          </div>
          <span className="rounded-md bg-accent-soft px-2 py-1 text-[11px] font-semibold text-accent">
            KEYON
          </span>
        </div>

        <ul className="mt-4 space-y-2">
          {rows.map((r) => (
            <li
              key={r.label}
              className="flex items-center gap-3 rounded-xl border border-border/80 bg-[#F7FAFC] px-3 py-2.5"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${r.tone}`}
              >
                <r.Icon size={15} strokeWidth={1.85} />
              </span>
              <div className="min-w-0 flex-1">
                <p className={`${CARD_TITLE_CLASS} truncate`}>{r.label}</p>
                <p className={CARD_META_CLASS}>{r.hint}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-3 rounded-xl border border-dashed border-border bg-surface/60 px-3 py-2.5">
          <p className={CARD_META_CLASS}>
            Chưa phải cổng hợp đồng pháp lý — xem đơn và license trong Tài khoản.
          </p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {["Cần đăng nhập", "Đơn & license", "PO qua sales"].map((t) => (
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
