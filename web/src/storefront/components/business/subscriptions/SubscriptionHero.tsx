import Link from "next/link";
import { Bell, LayoutGrid, RefreshCw } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CTA_LABEL_CLASS,
  HERO_TITLE_CLASS,
  PAGE_LEAD_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CTA_HOVER,
  HOVER_LINK_ACCENT,
  TRANSITION_UI,
} from "@/storefront/effects";
import {
  LANDING_HERO_GRID,
  LANDING_HERO_PAD,
} from "@/storefront/components/marketing/hero-shell";
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
          <span className={BREADCRUMB_CURRENT_CLASS}>Subscription &amp; Gia hạn</span>
        </nav>

        <div className={LANDING_HERO_GRID}>
          <div className="min-w-0 max-w-[540px]">
            <h1 className={`max-w-[20ch] ${HERO_TITLE_CLASS}`}>
              Theo dõi subscription và chủ động mỗi kỳ gia hạn
            </h1>
            <p className={`mt-3.5 ${PAGE_LEAD_CLASS}`}>
              Theo dõi subscription, thời hạn và chu kỳ sử dụng tập trung — giúp doanh nghiệp chủ
              động kế hoạch gia hạn trước khi đến hạn.
            </p>

            <ul className="mt-5 space-y-2.5">
              {BENEFITS.map(({ title, body, Icon }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon size={16} strokeWidth={1.85} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-navy">{title}</p>
                    <p className={BODY_MUTED_CLASS}>{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={SUB_CONSULT_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white shadow-sm ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Tư vấn subscription →
              </Link>
              <Link
                href={HOW_IT_WORKS_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Tìm hiểu cách hoạt động
              </Link>
            </div>
          </div>

          <div className="relative min-w-0">
            <SubscriptionDesktopPreview />
            <SubscriptionMobilePreview />
          </div>
        </div>
      </div>
    </section>
  );
}
