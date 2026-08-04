import type { HomeContent } from "@/storefront/content/types";
import {
  IconCard,
  IconPackage,
  IconSearch,
} from "@/storefront/components/icons/StoreIcons";
import {
  BADGE_CLASS,
  CARD_TITLE_CLASS,
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

const ICONS = [IconSearch, IconCard, IconPackage] as const;

/**
 * How KEYON works — full-width title → 3 step cards (HOME.v6).
 * Avoid left-intro + sparse steps (felt unfinished next to Featured / Why).
 */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible || data.steps.length === 0) return null;

  const subtitle =
    data.subtitle ??
    "Ba bước rõ ràng — từ chọn gói đến giữ giấy phép trong Tài khoản.";

  return (
    <section id="how-it-works" className="scroll-mt-20 bg-white py-6 md:py-7 lg:py-9">
      <div className="home-container">
        <div className="mb-5 max-w-2xl lg:mb-6">
          <h2 className={SECTION_TITLE_CLASS}>{data.title}</h2>
          <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>{subtitle}</p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute left-[16.666%] right-[16.666%] top-[2.15rem] z-0 hidden h-px bg-border sm:block"
            aria-hidden
          />

          <Reveal
            stagger
            className="relative z-[1] grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3 lg:gap-4"
          >
            {data.steps.map((step, index) => {
              const Icon = ICONS[index] ?? IconPackage;
              const n = String(index + 1).padStart(2, "0");
              return (
                <article
                  key={step.id}
                  className={`group flex h-full flex-col rounded-2xl border border-border/80 bg-surface/80 p-4 sm:bg-white sm:p-5 ${ELEVATION_HAIRLINE} ${TRANSITION_PANEL} ${HOVER_LIFT_CARD} hover:border-accent/40 ${ELEVATION_CARD_HOVER}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-white sm:h-12 sm:w-12 ${TRANSITION_UI} group-hover:bg-accent-hover group-hover:scale-105`}
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
                    className={`mt-4 ${CARD_TITLE_CLASS} ${TRANSITION_UI} group-hover:text-accent`}
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
