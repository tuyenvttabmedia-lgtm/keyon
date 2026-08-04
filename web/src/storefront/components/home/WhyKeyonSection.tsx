import Image from "next/image";
import Link from "next/link";
import type { HomeContent, WhyItem } from "@/storefront/content/types";
import {
  BADGE_CLASS,
  CARD_META_CLASS,
  CARD_TITLE_CLASS,
  CTA_COMPACT_CLASS,
  CTA_LABEL_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_FLOAT,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";

type Why = HomeContent["why"];

export function WhyKeyonSection({ data }: { data: Why }) {
  if (!data.visible) return null;

  const items = data.items.slice(0, 6);

  return (
    <section className="py-5 md:py-4 lg:py-7">
      <div className="home-container">
        <div className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1.55fr)_280px] lg:items-stretch lg:gap-5">
          <div className="lg:self-start">
            <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS} sm:mt-3`}>{data.subtitle}</p>
            <Link
              href={data.ctaHref}
              className={`mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border px-5 ${CTA_LABEL_CLASS} text-navy ${TRANSITION_UI} hover:border-accent hover:text-accent sm:w-auto`}
            >
              {data.ctaLabel}
            </Link>
          </div>

          {/* Match shield column height (280) on desktop: 2×3 compact cards */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:h-[280px] lg:grid-rows-3 lg:gap-2.5">
            {items.map((item) => (
              <WhyCard key={item.id} item={item} />
            ))}
          </div>

          <div className="hidden lg:block">
            <WhySideBanner banner={data.sideBanner} />
          </div>
        </div>
      </div>
    </section>
  );
}

function WhySideBanner({ banner }: { banner: Why["sideBanner"] }) {
  const showImage = Boolean(banner?.visible && banner.imageUrl?.trim());

  if (showImage && banner) {
    const href = banner.ctaHref?.trim() || "/products";
    const content = (
      <>
        <Image
          src={banner.imageUrl}
          alt={banner.title || "Banner KEYON"}
          fill
          className="object-cover"
          sizes="280px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[1] p-4">
          {banner.title ? (
            <p className={`${CARD_TITLE_CLASS} leading-snug !text-white`}>{banner.title}</p>
          ) : null}
          {banner.ctaLabel ? (
            <span className={`mt-2 inline-flex items-center gap-1 ${CTA_COMPACT_CLASS} text-teal-200`}>
              {banner.ctaLabel}
              <span aria-hidden>→</span>
            </span>
          ) : null}
        </div>
      </>
    );

    return (
      <Link
        href={href}
        className={`relative mx-auto block aspect-square w-full max-w-[280px] overflow-hidden rounded-[18px] border border-border ${ELEVATION_FLOAT} lg:mx-0 lg:h-[280px] lg:w-[280px] lg:max-w-none`}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[18px] border border-border bg-gradient-to-br from-accent-soft via-sky-50 to-surface lg:mx-0 lg:h-[280px] lg:w-[280px] lg:max-w-none lg:shrink-0"
      aria-hidden
    >
      <span className={`absolute left-4 top-6 rounded-full border border-border bg-white px-2.5 py-1 ${BADGE_CLASS} text-muted-soft shadow-sm`}>
        API
      </span>
      <span className={`absolute right-5 top-14 rounded-full border border-border bg-white px-2.5 py-1 ${BADGE_CLASS} text-muted-soft shadow-sm`}>
        SSL
      </span>
      <span className={`absolute bottom-10 left-8 rounded-full border border-border bg-white px-2.5 py-1 ${BADGE_CLASS} text-muted-soft shadow-sm`}>
        ISO
      </span>
      <svg className="h-[120px] w-auto drop-shadow-[0_12px_24px_rgba(14,165,164,0.25)]" viewBox="0 0 120 140" fill="none">
        <path d="M60 8 12 28v36c0 36 26 58 48 66 22-8 48-30 48-66V28L60 8Z" fill="#0EA5A4" />
        <path d="M60 22 28 36v26c0 26 18 42 32 48 14-6 32-22 32-48V36L60 22Z" fill="#14B8A6" />
        <text x="60" y="88" textAnchor="middle" fill="#fff" fontSize="42" fontWeight="800" fontFamily="Inter,sans-serif">
          K
        </text>
      </svg>
    </div>
  );
}

function WhyCard({ item }: { item: WhyItem }) {
  return (
    <div
      className={`flex h-full min-h-0 overflow-hidden rounded-xl border border-border/80 bg-white px-2.5 py-2 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/35 ${ELEVATION_CARD_HOVER} sm:px-3 sm:py-2`}
    >
      <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent sm:mr-2.5 sm:h-9 sm:w-9">
        <WhyIcon icon={item.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className={`${CARD_TITLE_CLASS} leading-snug`}>{item.title}</h4>
        <p className={`mt-0.5 line-clamp-2 leading-snug ${CARD_META_CLASS}`}>
          {item.description}
        </p>
      </div>
    </div>
  );
}

function WhyIcon({ icon }: { icon: WhyItem["icon"] }) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    "aria-hidden": true as const,
  };
  switch (icon) {
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.8 7.5 9 4.3-1.2 7.5-4.5 7.5-9V6L12 3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "bolt":
      return (
        <svg {...props}>
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
        </svg>
      );
    case "price":
      return (
        <svg {...props}>
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "card":
      return (
        <svg {...props}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 10h18" />
        </svg>
      );
    case "support":
      return (
        <svg {...props}>
          <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" />
          <path d="M4.5 13.5a2 2 0 0 0 2 2H8v-5H6.5a2 2 0 0 0-2 2v1Z" />
          <path d="M19.5 13.5a2 2 0 0 1-2 2H16v-5h1.5a2 2 0 0 1 2 2v1Z" />
        </svg>
      );
    case "refund":
      return (
        <svg {...props}>
          <path d="M3 12a9 9 0 1 0 9-9" />
          <path d="M3 4v8h8" />
        </svg>
      );
  }
}
