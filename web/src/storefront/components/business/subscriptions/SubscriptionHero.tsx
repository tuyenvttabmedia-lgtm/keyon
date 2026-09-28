import Link from "next/link";
import { Bell, LayoutGrid, RefreshCw } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  BREADCRUMB_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  CARD_TITLE_CLASS,
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
    title: "Subscription rõ ràng",
    body: "Thông tin sản phẩm, thời hạn và hình thức subscription được xác định trước khi mua.",
    Icon: LayoutGrid,
  },
  {
    title: "Theo dõi thời hạn",
    body: "Kiểm tra subscription đang sử dụng và thời điểm cần gia hạn.",
    Icon: Bell,
  },
  {
    title: "Hỗ trợ gia hạn",
    body: "Tư vấn gia hạn theo sản phẩm, số lượng và nhu cầu sử dụng tiếp theo.",
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
            <h1 className={HERO_TITLE_CLASS}>
              Subscription &amp; gia hạn bản quyền phần mềm
            </h1>
            <p className={`mt-3.5 ${PAGE_LEAD_CLASS}`}>
              Mua subscription phần mềm theo thời hạn phù hợp, theo dõi thời gian sử dụng và được hỗ
              trợ khi gia hạn hoặc thay đổi nhu cầu.
            </p>

            <ul className="mt-5 space-y-2.5">
              {BENEFITS.map(({ title, body, Icon }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                    <Icon size={16} strokeWidth={1.85} aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className={CARD_TITLE_CLASS}>{title}</p>
                    <p className={BODY_MUTED_CLASS}>{body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={SUB_CONSULT_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
              >
                Nhận tư vấn →
              </Link>
              <Link
                href={HOW_IT_WORKS_HREF}
                className={`inline-flex h-12 items-center justify-center rounded-xl border border-border bg-white px-6 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent`}
              >
                Xem cách KEYON hoạt động →
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
