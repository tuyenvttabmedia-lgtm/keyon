import Link from "next/link";
import type { HomeContent } from "@/storefront/content/types";
import {
  IconCard,
  IconFolder,
  IconPackage,
  IconSearch,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  CARD_TITLE_CLASS,
  LINK_ACCENT_CLASS,
  OVERLINE_CLASS,
  SECTION_LEAD_CLASS,
  SECTION_TITLE_CLASS,
} from "@/storefront/typography";
import {
  ELEVATION_CARD_HOVER,
  ELEVATION_HAIRLINE,
  HOVER_LIFT_CARD,
  TRANSITION_PANEL,
  TRANSITION_UI,
} from "@/storefront/effects";
import { Reveal } from "./Reveal";

const ICONS = [IconSearch, IconCard, IconPackage, IconFolder] as const;

/**
 * How KEYON works — full-width title → 4 step cards.
 */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible || data.steps.length === 0) return null;

  const subtitle =
    data.subtitle ??
    "Bốn bước rõ ràng — từ chọn gói đến quản lý giấy phép trong Tài khoản.";
  const steps = data.steps.slice(0, 4);

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-6 md:py-7 lg:py-9">
      <div className="home-container">
        <div className="mb-5 flex max-w-2xl flex-col gap-3 lg:mb-6 lg:max-w-none lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
            <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{subtitle}</p>
          </div>
          <Link href="/how-it-works" className={`${LINK_ACCENT_CLASS} shrink-0`}>
            Xem hành trình →
          </Link>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[2.15rem] z-0 hidden h-px bg-border lg:block"
            aria-hidden
          />

          <Reveal
            stagger
            className="relative z-[1] grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3.5"
          >
            {steps.map((step, index) => {
              const Icon = ICONS[index] ?? IconFolder;
              const n = String(index + 1).padStart(2, "0");
              return (
                <article
                  key={step.id}
                  className={`group flex h-full flex-col rounded-2xl border border-border/80 bg-surface/80 p-4 sm:bg-white sm:p-4 lg:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white ${TRANSITION_UI} group-hover:scale-105 group-hover:bg-accent-hover`}
                    >
                      <Icon size={22} />
                      <span
                        className={`absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-navy px-1 ${BADGE_CLASS} font-bold leading-none text-white`}
                      >
                        {index + 1}
                      </span>
                    </span>
                    <span className={`${OVERLINE_CLASS} text-accent`}>Bước {n}</span>
                  </div>

                  <h3
                    className={`mt-3.5 ${CARD_TITLE_CLASS} ${TRANSITION_UI} group-hover:text-accent`}
                  >
                    {step.title}
                  </h3>
                  <p className={`mt-1.5 flex-1 leading-relaxed ${SECTION_LEAD_CLASS}`}>
                    {step.description}
                  </p>
                </article>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
