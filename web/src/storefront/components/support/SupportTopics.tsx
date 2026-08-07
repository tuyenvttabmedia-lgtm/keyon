import Link from "next/link";
import {
  AppWindow,
  Cloud,
  CreditCard,
  Monitor,
  Shield,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
import { SECTION_PAD, SURFACE_MUTED } from "./shared";

const TOPICS: {
  title: string;
  hints: string;
  href: string;
  Icon: LucideIcon;
}[] = [
  {
    title: "Windows",
    hints: "Kích hoạt · Cài đặt · Thiết bị",
    href: "/resources/guides?category=windows",
    Icon: Monitor,
  },
  {
    title: "Microsoft 365",
    hints: "Thiết lập · Subscription · Tài khoản",
    href: "/resources/guides?category=m365",
    Icon: Cloud,
  },
  {
    title: "Office",
    hints: "Cài đặt · Kích hoạt · Sử dụng",
    href: "/products?cat=office",
    Icon: AppWindow,
  },
  {
    title: "Bảo mật",
    hints: "Cài đặt · Thiết bị · Bảo vệ",
    href: "/solutions/security",
    Icon: Shield,
  },
  {
    title: "Thanh toán & Hóa đơn",
    hints: "Thanh toán · Hóa đơn · Giao dịch",
    href: "/faq",
    Icon: CreditCard,
  },
  {
    title: "Tài khoản & Đơn hàng",
    hints: "Tài khoản · Đơn hàng · License",
    href: "/account",
    Icon: UserRound,
  },
];

export function SupportTopics() {
  return (
    <section className={`bg-white ${SECTION_PAD}`}>
      <div className="home-container">
        <header className="max-w-2xl">
          <h2 className={SECTION_TITLE_CLASS}>Tìm hỗ trợ theo chủ đề</h2>
          <p className={`mt-2.5 ${SECTION_LEAD_CLASS}`}>
            Chọn nhóm gần với vấn đề của bạn — dẫn tới FAQ, hướng dẫn hoặc khu vực tài khoản.
          </p>
        </header>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-9 md:gap-4">
          {TOPICS.map(({ title, hints, href, Icon }) => (
            <li key={title}>
              <Link
                href={href}
                className={`flex min-h-[88px] items-start gap-3.5 p-4 md:min-h-0 md:flex-col md:p-5 ${SURFACE_MUTED} ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} ${ELEVATION_CARD_HOVER} hover:border-accent/35`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm md:h-11 md:w-11">
                  <Icon size={18} strokeWidth={1.85} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={`block ${CARD_TITLE_CLASS}`}>{title}</span>
                  <span className={`mt-1 block ${BODY_MUTED_CLASS}`}>{hints}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
