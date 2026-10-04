import Link from "next/link";
import {
  AppWindow,
  Cloud,
  Monitor,
  Shield,
} from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { AREAS_ID, SECTION_PAD, SURFACE_MUTED } from "./shared";

const AREAS = [
  {
    title: "Microsoft 365",
    body: "Tư vấn lựa chọn gói phù hợp với nhu cầu làm việc và cộng tác.",
    href: "/solutions/microsoft-365-office",
    cta: "Microsoft 365 & Office",
    Icon: Cloud,
  },
  {
    title: "Microsoft Office",
    body: "So sánh phiên bản và hình thức cấp phép trước khi mua.",
    href: "/categories/office",
    cta: "Tìm hiểu",
    Icon: AppWindow,
  },
  {
    title: "Windows",
    body: "Xác định phiên bản phù hợp với thiết bị và nhu cầu sử dụng.",
    href: "/categories/windows",
    cta: "Tìm hiểu",
    Icon: Monitor,
  },
  {
    title: "Security",
    body: "Lựa chọn giải pháp bảo vệ thiết bị, dữ liệu và tài khoản.",
    href: "/solutions/security",
    cta: "Giải pháp bảo mật",
    Icon: Shield,
  },
] as const;

export function ConsultingAreas() {
  return (
    <section id={AREAS_ID} className={`scroll-mt-24 bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>KEYON tư vấn những sản phẩm nào?</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Khám phá các nhóm sản phẩm phổ biến hoặc gửi yêu cầu nếu bạn chưa xác định được lựa
            chọn phù hợp.
          </p>
        </header>

        <ul className="mt-8 grid min-w-0 grid-cols-2 gap-2.5 sm:gap-3.5 md:mt-9 lg:grid-cols-4">
          {AREAS.map(({ title, body, href, cta, Icon }) => (
            <li key={title} className="min-w-0">
              <Link
                href={href}
                className={`flex h-full min-w-0 flex-col overflow-hidden p-3.5 sm:p-5 ${SURFACE_MUTED} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-accent">
                    <Icon size={16} strokeWidth={1.75} aria-hidden />
                  </span>
                  <h3 className={`min-w-0 break-words ${CARD_TITLE_CLASS}`}>{title}</h3>
                </span>
                <p className={`mt-2 flex-1 break-words ${BODY_MUTED_CLASS}`}>{body}</p>
                <span className={`mt-3 ${CARD_TITLE_CLASS} text-accent`}>
                  {cta} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
