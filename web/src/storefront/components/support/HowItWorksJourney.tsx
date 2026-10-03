import Link from "next/link";
import {
  BODY_MUTED_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
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
    tab: "Chọn sản phẩm",
    hint: "License, subscription hoặc dịch vụ",
    eyebrow: "01",
    title: "Chọn sản phẩm",
    desc: "License, subscription hoặc dịch vụ phù hợp nhu cầu.",
  },
  {
    tab: "Đặt hàng & thanh toán",
    hint: "Trực tuyến hoặc yêu cầu doanh nghiệp",
    eyebrow: "02",
    title: "Đặt hàng & thanh toán",
    desc: "Thanh toán trực tuyến hoặc gửi yêu cầu dành cho doanh nghiệp.",
  },
  {
    tab: "Nhận & kích hoạt",
    hint: "License và hướng dẫn kích hoạt",
    eyebrow: "03",
    title: "Nhận & kích hoạt",
    desc: "Nhận license và hướng dẫn kích hoạt theo từng sản phẩm.",
  },
  {
    tab: "Quản lý & gia hạn",
    hint: "Trong Tài khoản",
    eyebrow: "04",
    title: "Quản lý & gia hạn",
    desc: "Theo dõi license, thời hạn và subscription trong tài khoản.",
  },
] as const;

const COMMITMENTS = [
  "Nguồn gốc & thông tin license rõ ràng",
  "Fulfillment số theo từng sản phẩm",
  "Quản lý license tập trung",
  "Hỗ trợ bằng tiếng Việt",
  "Thanh toán minh bạch",
  "Gia hạn & subscription rõ ràng",
] as const;

type Props = {
  heading?: "h1" | "h2";
  kicker?: string;
  title?: string;
  lead?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

/** Purchase lifecycle — same section on Home and /how-it-works. */
export function HowItWorksJourney({
  heading = "h1",
  kicker,
  title = "Cách KEYON hoạt động",
  lead = "Chọn sản phẩm, thanh toán hoặc báo giá, nhận bàn giao, rồi quản lý và gia hạn trong Tài khoản.",
  ctaHref = "/how-it-works",
  ctaLabel = "Quản lý license & hỗ trợ →",
}: Props) {
  const TitleTag = heading === "h1" ? "h1" : "h2";
  const CardHeading = heading === "h1" ? "h2" : "h3";

  return (
    <section aria-label="Cách KEYON hoạt động" className="flex flex-col gap-6 md:gap-8">
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
        <header>
          {kicker ? (
            <p className={`${OVERLINE_CLASS} text-accent`}>{kicker}</p>
          ) : null}
          <TitleTag className={`${kicker ? "mt-2" : ""} ${SECTION_TITLE_CLASS}`}>
            {title}
          </TitleTag>
          <p className={`mt-3 max-w-[46ch] ${SECTION_LEAD_CLASS}`}>{lead}</p>
        </header>

        <ol className="relative grid grid-cols-1 gap-3 sm:grid-cols-4">
          <span
            className="pointer-events-none absolute left-[12%] right-[12%] top-5 hidden border-t border-dashed border-border sm:block"
            aria-hidden
          />
          {STEPS.map((s) => (
            <li key={s.tab} className="relative z-[1] flex items-center gap-3 text-left sm:flex-col sm:items-center sm:gap-0 sm:text-center">
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white ${CTA_COMPACT_CLASS}`}
              >
                {s.eyebrow}
              </span>
              <div className="min-w-0 sm:mt-3">
                <p className={CARD_TITLE_CLASS}>{s.tab}</p>
                <p className={`mt-0.5 sm:max-w-[18ch] ${CARD_META_CLASS}`}>{s.hint}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STEPS.map((step) => (
          <StepCard key={step.tab} heading={CardHeading} step={step} />
        ))}
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
            <ul className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${CARD_META_CLASS}`}>
              {COMMITMENTS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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

function StepCard({
  heading: Heading,
  step,
}: {
  heading: "h2" | "h3";
  step: (typeof STEPS)[number];
}) {
  return (
    <article className={`relative flex h-full flex-col p-5 md:p-6 ${CARD_MARKETING}`}>
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-navy via-navy to-accent"
        aria-hidden
      />
      <p className={`${OVERLINE_CLASS} text-accent`}>{step.eyebrow}</p>
      <Heading className={`mt-2 ${SUBSECTION_TITLE_CLASS}`}>{step.title}</Heading>
      <p className={`mt-2 flex-1 ${BODY_MUTED_CLASS}`}>{step.desc}</p>
    </article>
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
