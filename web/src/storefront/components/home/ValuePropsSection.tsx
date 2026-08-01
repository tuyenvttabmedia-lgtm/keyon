import type { HomeContent } from "@/storefront/content/types";
import {
  IconFolder,
  IconReceipt,
  IconShuffle,
} from "@/storefront/components/icons/StoreIcons";
import { SECTION_LEAD_CLASS, SUBSECTION_TITLE_CLASS } from "@/storefront/typography";

const ICONS = [IconReceipt, IconShuffle, IconFolder] as const;

/** HOME.spec Value Bar — h92 · 3 cols · divider · icon 48 · title20 · body15 */
export function ValuePropsSection({ data }: { data: HomeContent["valueProps"] }) {
  if (!data.visible || data.items.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="home-container">
        <div className="overflow-hidden rounded-2xl border border-border bg-[#F7F9FB]">
          <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {data.items.map((item, i) => {
              const Icon = ICONS[i] ?? IconReceipt;
              return (
                <div
                  key={item.id}
                  className="flex min-h-[92px] items-center gap-4 px-5 py-5 md:px-6 md:py-6"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className={SUBSECTION_TITLE_CLASS}>{item.title}</p>
                    <p className={`mt-1 ${SECTION_LEAD_CLASS}`}>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
