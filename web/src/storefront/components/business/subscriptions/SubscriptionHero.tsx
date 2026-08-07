import Link from "next/link";
import { Bell, LayoutGrid, RefreshCw } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  OVERLINE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";
import { HOW_IT_WORKS_HREF, SUB_CONSULT_HREF } from "./shared";
import { SubscriptionDesktopPreview } from "./SubscriptionDesktopPreview";
import { SubscriptionMobilePreview } from "./SubscriptionMobilePreview";

const BENEFITS = [
  {
    title: "Theo dõi tập trung",
    body: "Tập trung thông tin subscription tại một nơi.",
    Icon: LayoutGrid,
  },
  {
    title: "Nhắc thời hạn",
    body: "Chủ động theo dõi các mốc cần xử lý.",
    Icon: Bell,
  },
  {
    title: "Quản lý chu kỳ",
    body: "Nắm rõ thời hạn và chu kỳ sử dụng.",
    Icon: RefreshCw,
  },
] as const;

export function SubscriptionHero() {
  return (
    <section className="relative overflow-x-clip border-b border-border bg-[#F7FAFC]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_15%,rgba(14,165,164,0.07),transparent_45%),radial-gradient(ellipse_at_8%_85%,rgba(14,165,233,0.04),transparent_50%)]"
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
          <span className={BREADCRUMB_CURRENT_CLASS}>Subscription &amp; Gia hạn</span>
        </nav>

        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)] lg:gap-10 xl:gap-12">
          <div className="min-w-0 max-w-[540px]">
            <p className={`${OVERLINE_CLASS} tracking-[0.18em] text-accent`}>
              Subscription &amp; Gia hạn
            </p>
            <h1 className={`mt-3 max-w-[20ch] ${HERO_TITLE_CLASS}`}>
              Theo dõi subscription và chủ động mỗi kỳ gia hạn
            </h1>
            <p className={`mt-3.5 ${PAGE_LEAD_CLASS}`}>
              Theo dõi subscription, thời hạn và chu kỳ sử dụng tập trung — giúp doanh nghiệp chủ
              động kế hoạch gia hạn và hạn chế gián đoạn dịch vụ.
            </p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {BENEFITS.map(({ title, body, Icon }) => (
                <li key={title} className="min-w-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon size={17} strokeWidth={1.85} aria-hidden />
                  </span>
                  <p className="mt-2.5 text-[14px] font-bold text-navy">{title}</p>
                  <p className={`mt-1 ${BODY_MUTED_CLASS}`}>{body}</p>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={SUB_CONSULT_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Tư vấn giải pháp →
              </Link>
              <Link
                href={HOW_IT_WORKS_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Tìm hiểu cách hoạt động
              </Link>
            </div>
          </div>

          <div className="relative min-w-0 pb-6 md:pb-8">
            <SubscriptionDesktopPreview />
            <SubscriptionMobilePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
