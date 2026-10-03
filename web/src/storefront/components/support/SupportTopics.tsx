import Link from "next/link";
import {
  AppWindow,
  Cloud,
  CreditCard,
  Package,
  Search,
  Shield,
  Monitor,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";
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
    href: "/kien-thuc/huong-dan?chu-de=windows",
    Icon: Monitor,
  },
  {
    title: "Microsoft 365",
    hints: "Thiết lập · Subscription · Tài khoản",
    href: "/kien-thuc/huong-dan?chu-de=m365",
    Icon: Cloud,
  },
  {
    title: "Office",
    hints: "Cài đặt · Kích hoạt · Sử dụng",
    href: "/categories/office",
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
    href: "/faq?cat=payment",
    Icon: CreditCard,
  },
  {
    title: "Tra cứu đơn hàng",
    hints: "Mã đơn · Đăng nhập · Tài khoản",
    href: "/account/orders",
    Icon: Search,
  },
  {
    title: "Cách KEYON hoạt động",
    hints: "Chọn gói · Thanh toán · Tài khoản",
    href: "/how-it-works",
    Icon: Package,
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

        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:mt-9 lg:grid-cols-12 lg:gap-4">
          {TOPICS.map(({ title, hints, href, Icon }, index) => (
            <li
              key={title}
              className={index < 4 ? "lg:col-span-3" : "lg:col-span-4"}
            >
              <Link
                href={href}
                className={`flex h-full items-center gap-3.5 p-4 ${SURFACE_MUTED} ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40 hover:bg-white`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
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
