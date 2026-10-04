"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  FileText,
  KeyRound,
  RefreshCw,
  ShoppingBag,
  Check,
} from "lucide-react";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
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
  LANDING_CRUMB_GAP,
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";

const WHAT_YOU_SEE: { title: string; body: string; Icon: LucideIcon }[] = [
  {
    title: "Đơn hàng",
    body: "Xem các đơn hàng KEYON đã ghi nhận trong tài khoản.",
    Icon: ShoppingBag,
  },
  {
    title: "License đã bàn giao",
    body: "Theo dõi thông tin license hoặc tài sản số đã được bàn giao.",
    Icon: KeyRound,
  },
  {
    title: "Gia hạn & PO",
    body: "Gửi yêu cầu gia hạn, báo giá volume hoặc subscription đến đội kinh doanh KEYON.",
    Icon: RefreshCw,
  },
];

const SCOPE = [
  {
    title: "Hợp đồng pháp lý riêng",
    body: "Hồ sơ hợp đồng và ký kết được xử lý theo quy trình doanh nghiệp.",
  },
  {
    title: "Đơn hàng và hợp đồng tách biệt",
    body: "Đơn hàng trên KEYON không thay thế hồ sơ hợp đồng pháp lý.",
  },
  {
    title: "Theo dõi sau khi đăng nhập",
    body: "Thông tin đơn hàng và license được hiển thị trong Tài khoản KEYON.",
  },
];

const HERO_POINTS = [
  {
    title: "Đăng nhập để theo dõi",
    body: "Xem đơn hàng và license đã mua trong Tài khoản.",
  },
  {
    title: "License đã bàn giao",
    body: "Theo dõi thông tin license hoặc tài sản số sau khi mua.",
  },
  {
    title: "PO & hợp đồng qua sales",
    body: "Các giao dịch doanh nghiệp được tư vấn và xử lý theo nhu cầu.",
  },
];

export function ContractsLanding() {
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
            <span className={BREADCRUMB_CURRENT_CLASS}>Hợp đồng & đơn hàng</span>
          </nav>

          <div className={LANDING_HERO_GRID}>
            <div className="min-w-0 max-w-full lg:max-w-[540px]">
              <h1 className={`max-w-full break-words ${HERO_TITLE_CLASS}`}>
                Theo dõi đơn hàng và license trên KEYON
              </h1>
              <p className={`mt-4 max-w-full break-words ${PAGE_LEAD_CLASS}`}>
                Sau khi đăng nhập, doanh nghiệp có thể theo dõi đơn hàng, license đã mua và các yêu
                cầu gia hạn trên KEYON. Báo giá volume, PO và hợp đồng được xử lý cùng đội kinh
                doanh.
              </p>

              <ul className="mt-5 space-y-2.5">
                {HERO_POINTS.map((point) => (
                  <li key={point.title} className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <Check size={12} strokeWidth={2.6} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className={`block break-words ${CARD_TITLE_CLASS}`}>{point.title}</span>
                      <span className={`mt-0.5 block break-words ${BODY_MUTED_CLASS}`}>{point.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/account/orders"
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl bg-accent px-6 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
                >
                  Đăng nhập xem đơn hàng →
                </Link>
                <Link
                  href="/contact/quote?intent=business"
                  className={`inline-flex h-12 w-full min-w-0 items-center justify-center rounded-xl border border-border bg-white px-6 sm:w-auto ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
                >
                  Liên hệ kinh doanh →
                </Link>
              </div>
            </div>

            <div className="hidden min-w-0 lg:block">
              <ContractsHeroArt />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white home-section">
        <div className="home-container">
          <header className="mx-auto max-w-2xl text-center">
            <h2 className={SECTION_TITLE_CLASS}>Theo dõi đơn hàng và license</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              Xem các giao dịch đã thực hiện và license đã bàn giao trong Tài khoản KEYON.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:grid-cols-3">
            {WHAT_YOU_SEE.map((item, index) => (
              <li
                key={item.title}
                className={`min-w-0 ${index === WHAT_YOU_SEE.length - 1 ? "col-span-2 md:col-span-1" : ""}`}
              >
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
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>
                    {item.title === "Gia hạn & PO" ? (
                      <>
                        Gửi yêu cầu gia hạn,{" "}
                        <Link href="/business/volume-licensing" className={HOVER_LINK_ACCENT}>
                          báo giá volume
                        </Link>{" "}
                        hoặc{" "}
                        <Link href="/business/subscriptions" className={HOVER_LINK_ACCENT}>
                          subscription
                        </Link>{" "}
                        đến đội kinh doanh KEYON.
                      </>
                    ) : (
                      item.body
                    )}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#F4F8FB] home-section">
        <div className="home-container">
          <header className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>Phạm vi hỗ trợ trên KEYON</h2>
            <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
              KEYON hỗ trợ theo dõi đơn hàng, license và yêu cầu giao dịch doanh nghiệp. Các hồ sơ
              hợp đồng pháp lý được xử lý theo quy trình riêng. Tham khảo{" "}
              <Link href="/solutions" className={HOVER_LINK_ACCENT}>
                Giải pháp
              </Link>{" "}
              và{" "}
              <Link href="/products" className={HOVER_LINK_ACCENT}>
                Sản phẩm
              </Link>{" "}
              trước khi gửi yêu cầu.
            </p>
          </header>
          <ul className="mt-7 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 lg:grid-cols-3">
            {SCOPE.map((item, index) => (
              <li
                key={item.title}
                className={`min-w-0 ${index === SCOPE.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
              >
                <article
                  className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white p-3.5 sm:p-5 ${ELEVATION_HAIRLINE}`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent"
                      aria-hidden
                    >
                      <Check size={13} strokeWidth={2.6} />
                    </span>
                    <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{item.title}</h3>
                  </span>
                  <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>{item.body}</p>
                </article>
              </li>
            ))}
          </ul>
          <aside
            className={`mt-6 min-w-0 overflow-hidden rounded-2xl border border-border bg-white p-4 sm:p-6 ${ELEVATION_HAIRLINE}`}
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileText className="shrink-0 text-accent" size={18} strokeWidth={1.7} aria-hidden />
              <p className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>Cần báo giá hoặc PO?</p>
            </span>
            <p className={`mt-2 break-words ${BODY_MUTED_CLASS}`}>
              Gửi yêu cầu báo giá hoặc nhu cầu mua theo PO. Đội kinh doanh KEYON sẽ tư vấn và xử lý
              theo quy mô giao dịch. Xem{" "}
              <Link href="/business/volume-licensing" className={HOVER_LINK_ACCENT}>
                Mua bản quyền số lượng lớn
              </Link>
              .
            </p>
            <div className="mt-5 flex w-full min-w-0 flex-col gap-2.5 sm:flex-row">
              <Link
                href="/contact/quote?intent=volume-quote"
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 sm:w-auto ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Báo giá volume
              </Link>
              <Link
                href="/business/subscriptions"
                className={`inline-flex h-11 w-full items-center justify-center rounded-xl border border-border px-5 sm:w-auto ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent`}
              >
                Subscription
              </Link>
            </div>
            <p className={`mt-4 inline-flex items-center gap-1.5 ${CARD_META_CLASS}`}>
              <ClipboardList size={14} strokeWidth={1.8} aria-hidden />
              Theo dõi sau khi đăng nhập: Tài khoản → Đơn hàng
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

function ContractsHeroArt() {
  const rows = [
    { label: "Đơn hàng doanh nghiệp", hint: "Sau đăng nhập", Icon: ShoppingBag, tone: "bg-sky-100 text-sky-800" },
    { label: "License đã bàn giao", hint: "Trong Tài khoản", Icon: KeyRound, tone: "bg-accent/15 text-accent" },
    { label: "Gia hạn / PO", hint: "Qua đội kinh doanh", Icon: RefreshCw, tone: "bg-amber-100 text-amber-800" },
    { label: "Hợp đồng pháp lý", hint: "Không thay đơn hàng trên KEYON", Icon: FileText, tone: "bg-slate-100 text-slate-700" },
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-[440px] lg:max-w-none">
      <div
        className={`relative rounded-2xl border border-border bg-white p-4 sm:p-5 ${ELEVATION_FLOAT}`}
        aria-hidden
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-accent">
              <ClipboardList size={18} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className={CARD_TITLE_CLASS}>Tài khoản doanh nghiệp</p>
              <p className={CARD_META_CLASS}>Sau đăng nhập tài khoản</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-md bg-accent-soft px-2 py-1 ${BADGE_CLASS} text-accent`}>
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

        <div className="mt-3 rounded-xl border border-dashed border-border bg-surface/60 px-3 py-3">
          <p className={CARD_TITLE_CLASS}>Đơn hàng không thay hợp đồng</p>
          <p className={`mt-1 ${CARD_META_CLASS}`}>
            Xem đơn hàng và license trong Tài khoản. PO và hợp đồng xử lý cùng đội kinh doanh.
          </p>
        </div>
      </div>
    </div>
  );
}
