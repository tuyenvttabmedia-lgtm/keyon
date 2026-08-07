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
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
} from "@/storefront/effects";
import { AREAS_ID, SECTION_PAD } from "./shared";

const AREAS = [
  {
    title: "Microsoft 365",
    body: "Tìm hiểu các lựa chọn phù hợp với nhu cầu làm việc và cộng tác.",
    href: "/solutions/productivity",
    Icon: Cloud,
  },
  {
    title: "Microsoft Office",
    body: "So sánh phiên bản và hình thức cấp phép.",
    href: "/products?cat=office",
    Icon: AppWindow,
  },
  {
    title: "Windows",
    body: "Xác định phiên bản phù hợp với thiết bị và mục đích sử dụng.",
    href: "/products?cat=windows",
    Icon: Monitor,
  },
  {
    title: "Security",
    body: "Lựa chọn giải pháp bảo vệ phù hợp với thiết bị và dữ liệu.",
    href: "/solutions/security",
    Icon: Shield,
  },
] as const;

export function ConsultingAreas() {
  return (
    <section id={AREAS_ID} className={`scroll-mt-24 bg-white ${SECTION_PAD}`}>
      <div className="home-container px-5 md:px-0">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Các lĩnh vực tư vấn</h2>
        </header>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-9">
          {AREAS.map(({ title, body, href, Icon }) => (
            <li key={title}>
              <Link
                href={href}
                className={`flex h-full flex-col rounded-2xl border border-border bg-[#F7FAFC] p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>{title}</h3>
                <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{body}</p>
                <span className="mt-4 text-[13px] font-semibold text-accent">
                  Tìm hiểu →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
