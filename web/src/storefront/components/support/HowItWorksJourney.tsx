import type { ReactNode } from "react";
import Link from "next/link";
import {
  BADGE_CLASS,
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  FIELD_VALUE_CLASS,
  FORM_LABEL_CLASS,
  MONO_VALUE_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
  SUBSECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  CARD_MARKETING,
  ELEVATION_CTA_HOVER,
  ELEVATION_HAIRLINE,
  TRANSITION_UI,
} from "@/storefront/effects";

const STEPS = [
  {
    tab: "Chọn gói",
    hint: "Chọn sản phẩm phù hợp",
    eyebrow: "Bước 01 · Catalog",
    title: "Chọn gói đúng nhu cầu",
    desc: "Xem loại nhận (key / tài khoản) và giá trước khi đặt — không ẩn phí, không đổi SKU sau thanh toán.",
    chips: ["Key retail", "Tài khoản sẵn", "Giá VNĐ rõ"],
  },
  {
    tab: "Thanh toán",
    hint: "Thanh toán an toàn, tiện lợi",
    eyebrow: "Bước 02 · Payment",
    title: "Thanh toán một lần, an toàn và tiện lợi",
    desc: "Chuyển khoản / VietQR / SePay theo hướng dẫn trên trang thanh toán. Thanh toán thành công chưa phải đã giao — KEYON tách hai trạng thái.",
    chips: ["VietQR", "SePay", "Chuyển khoản"],
  },
  {
    tab: "Nhận trong Tài khoản",
    hint: "Nhận license và kích hoạt ngay",
    eyebrow: "Bước 03 · Fulfillment",
    title: "Nhận trong Tài khoản",
    desc: "Sau khi hệ thống xác nhận thanh toán, mở Đơn hàng / Tài sản để lấy deliverable — lưu lại, mở lại khi cần.",
    chips: ["Đơn hàng", "Tài sản", "Copy key"],
  },
] as const;

type Props = {
  heading?: "h1" | "h2";
  kicker?: string;
  title?: string;
  lead?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

/** Three-step purchase journey — layout from owner mockup (equal-height cards). */
export function HowItWorksJourney({
  heading = "h1",
  kicker = "Hành trình mua hàng",
  title = "Cách KEYON hoạt động",
  lead = "Chỉ với 3 bước đơn giản để sở hữu license chính hãng và kích hoạt nhanh chóng.",
  ctaHref = "/how-it-works",
  ctaLabel = "Quản lý license & hỗ trợ →",
}: Props) {
  const TitleTag = heading === "h1" ? "h1" : "h2";
  const CardHeading = heading === "h1" ? "h2" : "h3";

  return (
    <section aria-label="Cách KEYON hoạt động" className="flex flex-col gap-8 md:gap-10">
      <header className="mx-auto max-w-2xl text-center">
        <p className={`${OVERLINE_CLASS} text-accent`}>{kicker}</p>
        <TitleTag className={`mt-2 ${SECTION_TITLE_CLASS}`}>{title}</TitleTag>
        <p className={`mx-auto mt-3 max-w-[46ch] ${SECTION_LEAD_CLASS}`}>{lead}</p>
      </header>

      <ol className="relative mx-auto grid w-full max-w-3xl grid-cols-3 gap-2">
        <span
          className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-5 border-t border-dashed border-border"
          aria-hidden
        />
        {STEPS.map((s, i) => (
          <li key={s.tab} className="relative z-[1] flex flex-col items-center text-center">
            <span
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white ${CTA_COMPACT_CLASS}`}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className={`mt-3 ${CARD_TITLE_CLASS}`}>{s.tab}</p>
            <p className={`mt-0.5 max-w-[16ch] ${CARD_META_CLASS}`}>{s.hint}</p>
          </li>
        ))}
      </ol>

      <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-0">
        <StepCard heading={CardHeading} step={STEPS[0]} visual="catalog" />
        <StepArrow />
        <StepCard heading={CardHeading} step={STEPS[1]} visual="payment" />
        <StepArrow />
        <StepCard heading={CardHeading} step={STEPS[2]} visual="fulfillment" />
      </div>

      <div
        className={`flex flex-col gap-4 rounded-2xl border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ${ELEVATION_HAIRLINE}`}
      >
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent"
            aria-hidden
          >
            <ShieldIcon />
          </span>
          <div>
            <p className={CARD_TITLE_CLASS}>Cam kết của KEYON</p>
            <p className={`mt-1 ${CARD_META_CLASS}`}>
              Minh bạch giá – Không ẩn phí – Bảo mật tuyệt đối – Hỗ trợ tận tâm
            </p>
          </div>
        </div>
        <Link
          href={ctaHref}
          className={`inline-flex h-12 shrink-0 items-center justify-center rounded-xl bg-accent px-6 ${CTA_LABEL_CLASS} text-white ${TRANSITION_UI} hover:bg-accent-hover ${ELEVATION_CTA_HOVER}`}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}

function StepArrow() {
  return (
    <div className="hidden items-center justify-center px-1 lg:flex" aria-hidden>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-accent">
        <ChevronIcon />
      </span>
    </div>
  );
}

function StepCard({
  heading: Heading,
  step,
  visual,
}: {
  heading: "h2" | "h3";
  step: (typeof STEPS)[number];
  visual: "catalog" | "payment" | "fulfillment";
}) {
  return (
    <article className={`relative flex h-full flex-col p-5 md:p-6 ${CARD_MARKETING}`}>
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-navy via-navy to-accent"
        aria-hidden
      />
      <p className={`${OVERLINE_CLASS} text-accent`}>{step.eyebrow}</p>
      <Heading className={`mt-2 ${SUBSECTION_TITLE_CLASS}`}>{step.title}</Heading>
      <p className={`mt-2 ${BODY_MUTED_CLASS}`}>{step.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {step.chips.map((c) => (
          <span
            key={c}
            className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 ${CARD_META_CLASS} font-semibold text-muted`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {c}
          </span>
        ))}
      </div>
      <div className="mt-5 flex min-h-[148px] flex-col">
        {visual === "catalog" ? <CatalogPreview /> : null}
        {visual === "payment" ? <PaymentPreview /> : null}
        {visual === "fulfillment" ? <FulfillmentPreview /> : null}
      </div>
      <div className="mt-auto pt-5">
        {visual === "catalog" ? <BagMark /> : null}
        {visual === "payment" ? <PaymentFoot /> : null}
        {visual === "fulfillment" ? <FolderMark /> : null}
      </div>
    </article>
  );
}

function CatalogPreview() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className={CARD_TITLE_CLASS}>Gói trên cửa hàng</p>
        <span className={`${BADGE_CLASS} rounded-full bg-accent-soft px-2 py-0.5 text-accent`}>
          Key
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent`}
        >
          WIN
        </span>
        <div className="min-w-0 flex-1">
          <p className={CARD_TITLE_CLASS}>Windows (ví dụ catalog)</p>
          <p className={CARD_META_CLASS}>Giá và loại nhận trên PDP</p>
        </div>
        <span className="text-muted" aria-hidden>
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

function PaymentPreview() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className={CARD_TITLE_CLASS}>Thanh toán đơn hàng</p>
        <span className={`${BADGE_CLASS} rounded-full bg-amber-50 px-2 py-0.5 text-amber-700`}>
          Chờ thanh toán
        </span>
      </div>
      <div className="mt-3 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <div
          className="flex h-[72px] w-[72px] items-center justify-center rounded-lg border border-dashed border-accent/40 bg-accent-soft"
          aria-hidden
        >
          <QrMark />
        </div>
        <div className="min-w-0 space-y-2">
          <div>
            <p className={FORM_LABEL_CLASS}>Số tiền</p>
            <p className={FIELD_VALUE_CLASS}>Hiện trên trang thanh toán</p>
          </div>
          <div>
            <p className={FORM_LABEL_CLASS}>Nội dung CK</p>
            <p className={`${MONO_VALUE_CLASS} truncate`}>Theo mã đơn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FulfillmentPreview() {
  return (
    <div className="rounded-xl border border-border bg-white p-3">
      <div className="flex items-center justify-between gap-2">
        <p className={CARD_TITLE_CLASS}>Tài sản · License</p>
        <span className={`${BADGE_CLASS} rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700`}>
          Đã giao
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft ${CTA_COMPACT_CLASS} text-accent`}
        >
          OFF
        </span>
        <div className="min-w-0">
          <p className={CARD_TITLE_CLASS}>Office (ví dụ catalog)</p>
          <p className={CARD_META_CLASS}>Retail · loại nhận ghi trên gói</p>
        </div>
      </div>
      <p
        className={`mt-3 flex items-center justify-between gap-2 rounded-lg border border-accent/25 bg-accent-soft px-3 py-2 ${MONO_VALUE_CLASS}`}
      >
        <span>••••-••••-••••-••••</span>
        <span className={`${CARD_META_CLASS} font-sans font-semibold text-accent`} aria-hidden>
          Copy
        </span>
      </p>
    </div>
  );
}

function PaymentFoot() {
  const items = [
    { icon: <ShieldIcon />, title: "An toàn", hint: "Đối soát rõ" },
    { icon: <BoltIcon />, title: "Tự động", hint: "Webhook → giao" },
    { icon: <HeadsetIcon />, title: "Hỗ trợ", hint: "Ticket trong TK" },
  ];
  return (
    <ul className="grid min-h-[88px] grid-cols-3 gap-2">
      {items.map((item) => (
        <li key={item.title} className="flex flex-col items-center text-center">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent" aria-hidden>
            {item.icon}
          </span>
          <p className={`mt-1.5 ${CARD_TITLE_CLASS}`}>{item.title}</p>
          <p className={CARD_META_CLASS}>{item.hint}</p>
        </li>
      ))}
    </ul>
  );
}

function Pedestal({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[88px] flex-col items-center justify-end" aria-hidden>
      {children}
      <span className="mt-1 h-2 w-24 rounded-full bg-accent/20 blur-[2px]" />
    </div>
  );
}

function BagMark() {
  return (
    <Pedestal>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <path
          d="M16 20h24l-2.2 22.5a4 4 0 0 1-4 3.5H22.2a4 4 0 0 1-4-3.5L16 20Z"
          fill="#0EA5A4"
        />
        <path d="M22 20c0-4.4 2.7-8 6-8s6 3.6 6 8" stroke="#0B1F33" strokeWidth="2.5" />
      </svg>
    </Pedestal>
  );
}

function FolderMark() {
  return (
    <Pedestal>
      <svg width="64" height="56" viewBox="0 0 64 56" fill="none">
        <path d="M8 18h18l4 4h26v22a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V18Z" fill="#0EA5A4" />
        <path d="M8 22h48v-2H8v2Z" fill="#0B1F33" opacity="0.15" />
        <circle cx="46" cy="36" r="8" fill="#F8FAFC" stroke="#0B1F33" strokeWidth="2" />
        <path d="M46 36h10" stroke="#0B1F33" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </Pedestal>
  );
}

function QrMark() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="#0EA5A4" strokeWidth="2" />
      <rect x="26" y="2" width="12" height="12" rx="1.5" stroke="#0EA5A4" strokeWidth="2" />
      <rect x="2" y="26" width="12" height="12" rx="1.5" stroke="#0EA5A4" strokeWidth="2" />
      <rect x="6" y="6" width="4" height="4" fill="#0EA5A4" />
      <rect x="30" y="6" width="4" height="4" fill="#0EA5A4" />
      <rect x="6" y="30" width="4" height="4" fill="#0EA5A4" />
      <rect x="18" y="18" width="4" height="4" fill="#0EA5A4" />
      <rect x="26" y="18" width="4" height="4" fill="#0EA5A4" />
      <rect x="18" y="26" width="4" height="4" fill="#0EA5A4" />
      <rect x="30" y="30" width="8" height="8" fill="#0EA5A4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M5 2.5 10 7 5 11.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M8 1.5 13 3.5v4.2c0 3.1-2.1 5.2-5 6.3-2.9-1.1-5-3.2-5-6.3V3.5L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M9 1.5 3.5 9h4L7 14.5 12.5 7h-4L9 1.5Z" fill="currentColor" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3 9V8a5 5 0 0 1 10 0v1M3 9a1.5 1.5 0 0 0 0 3h1V9H3Zm10 0h-1v3h1a1.5 1.5 0 0 0 0-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
