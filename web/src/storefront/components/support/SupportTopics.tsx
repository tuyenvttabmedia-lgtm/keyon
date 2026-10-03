import Link from "next/link";
import {
  BODY_MUTED_CLASS,
  CARD_TITLE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import { ELEVATION_HAIRLINE, TRANSITION_UI } from "@/storefront/effects";
import { SECTION_PAD, SURFACE_MUTED } from "./shared";

type TopicMark =
  | "windows"
  | "m365"
  | "office"
  | "security"
  | "billing"
  | "orders"
  | "journey";

const TOPICS: {
  title: string;
  hints: string;
  href: string;
  mark: TopicMark;
}[] = [
  {
    title: "Windows",
    hints: "Kích hoạt · Cài đặt · Thiết bị",
    href: "/kien-thuc/huong-dan?chu-de=windows",
    mark: "windows",
  },
  {
    title: "Microsoft 365",
    hints: "Thiết lập · Subscription · Tài khoản",
    href: "/kien-thuc/huong-dan?chu-de=m365",
    mark: "m365",
  },
  {
    title: "Office",
    hints: "Cài đặt · Kích hoạt · Sử dụng",
    href: "/categories/office",
    mark: "office",
  },
  {
    title: "Bảo mật",
    hints: "Cài đặt · Thiết bị · Bảo vệ",
    href: "/solutions/security",
    mark: "security",
  },
  {
    title: "Thanh toán & Hóa đơn",
    hints: "Thanh toán · Hóa đơn · Giao dịch",
    href: "/faq?cat=payment",
    mark: "billing",
  },
  {
    title: "Tra cứu đơn hàng",
    hints: "Mã đơn · Đăng nhập · Tài khoản",
    href: "/account/orders",
    mark: "orders",
  },
  {
    title: "Cách KEYON hoạt động",
    hints: "Chọn gói · Thanh toán · Tài khoản",
    href: "/how-it-works",
    mark: "journey",
  },
];

function TopicIcon({ name }: { name: TopicMark }) {
  const stroke = {
    className: "h-[22px] w-[22px]",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "windows":
      return (
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M3.2 5.15 10.7 4.05v7.05H3.2V5.15Zm0 7.75h7.5v7.05l-7.5-1.15v-5.9Zm8.7-8.7L20.8 2.8v8.3h-8.9V4.2Zm0 9.55h8.9v8.45l-8.9-1.25v-7.2Z" />
        </svg>
      );
    case "m365":
      return (
        <svg {...stroke}>
          <path d="M12 3.4 4.2 7.6 12 11.8l7.8-4.2L12 3.4Z" />
          <path d="M4.2 12.2 12 16.4l7.8-4.2" />
          <path d="M4.2 16.4 12 20.6l7.8-4.2" />
        </svg>
      );
    case "office":
      return (
        <svg {...stroke}>
          <path d="M7 3.2h7.1L19 8.1V20a1.2 1.2 0 0 1-1.2 1.2H7A1.2 1.2 0 0 1 5.8 20V4.4A1.2 1.2 0 0 1 7 3.2Z" />
          <path d="M14 3.4V8.2h4.8" />
          <path d="M9 12.2h6M9 15.6h4" />
        </svg>
      );
    case "security":
      return (
        <svg {...stroke}>
          <path d="M12 3 5.2 6v5.2c0 4 2.9 7 6.8 8.1 3.9-1.1 6.8-4.1 6.8-8.1V6L12 3Z" />
          <path d="m9 12.1 1.9 1.9 4-4.1" />
        </svg>
      );
    case "billing":
      return (
        <svg {...stroke}>
          <path d="M7 3.2h10v16.4l-1.7-1.15-1.6 1.15-1.7-1.15L10.3 19.6 8.7 18.45 7 19.6V3.2Z" />
          <path d="M9.5 8h5M9.5 11.4h5M9.5 14.8h3" />
        </svg>
      );
    case "orders":
      return (
        <svg {...stroke}>
          <rect x="6.5" y="4.2" width="11" height="16" rx="1.6" />
          <path d="M9.2 4.2h5.6v2.1a.8.8 0 0 1-.8.8h-4a.8.8 0 0 1-.8-.8V4.2Z" />
          <path d="m9.3 12.2 1.5 1.5 2.8-2.9" />
          <path d="M9.4 16.2h5.2" />
        </svg>
      );
    case "journey":
      return (
        <svg {...stroke}>
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
          <path d="M6.8 12h3.3M13.9 12h3.3" />
        </svg>
      );
  }
}

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
          {TOPICS.map(({ title, hints, href, mark }, index) => (
            <li
              key={title}
              className={index < 4 ? "lg:col-span-3" : "lg:col-span-4"}
            >
              <Link
                href={href}
                className={`flex h-full items-center gap-3.5 p-4 ${SURFACE_MUTED} ${ELEVATION_HAIRLINE} ${TRANSITION_UI} hover:border-accent/40 hover:bg-white`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <TopicIcon name={mark} />
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
