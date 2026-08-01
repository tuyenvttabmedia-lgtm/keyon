import type { HomeContent } from "@/storefront/content/types";
import {
  IconCard,
  IconPackage,
  IconSearch,
} from "@/storefront/components/icons/StoreIcons";
import { CARD_TITLE_CLASS, SECTION_LEAD_CLASS } from "@/storefront/typography";
import { HomeSection } from "./HomeSection";

const ICONS = [IconSearch, IconCard, IconPackage] as const;

/** home-v5 — left intro + right 3 steps */
export function HowItWorksSection({ data }: { data: HomeContent["howItWorks"] }) {
  if (!data.visible || data.steps.length === 0) return null;

  const subtitle =
    data.subtitle ??
    "Ba bước rõ ràng — từ chọn gói đến giữ giấy phép trong Tài khoản.";

  return (
    <HomeSection
      id="how-it-works"
      title={data.title}
      subtitle={subtitle}
      className="scroll-mt-20 py-12 md:py-16 lg:py-[72px]"
    >
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
        {data.steps.map((step, index) => {
          const Icon = ICONS[index] ?? IconPackage;
          const last = index === data.steps.length - 1;
          return (
            <li key={step.id} className="relative">
              {!last ? (
                <span
                  className="pointer-events-none absolute -right-3 top-8 z-10 hidden text-2xl font-light text-navy/25 sm:block lg:-right-4"
                  aria-hidden
                >
                  ›
                </span>
              ) : null}
              <div className="relative pl-1">
                <span
                  className="pointer-events-none absolute -left-0.5 -top-1 select-none text-[56px] font-light leading-none text-step-num"
                  aria-hidden
                >
                  {index + 1}
                </span>
                <div className="relative pt-11">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon size={24} />
                  </span>
                  <h3 className={`mt-4 ${CARD_TITLE_CLASS}`}>
                    {step.title}
                  </h3>
                  <p className={`mt-2 ${SECTION_LEAD_CLASS}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </HomeSection>
  );
}
