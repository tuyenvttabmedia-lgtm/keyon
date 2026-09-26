import type { HomeContent, SolutionItem } from "@/storefront/content/types";
import { SolutionsShowcase } from "./SolutionsShowcase";

type Solutions = HomeContent["solutions"];

/**
 * Home Giải pháp — mockup tabs + visual panel (`SolutionsShowcase`).
 */
export function SolutionsSection({ data }: { data: Solutions }) {
  if (!data.visible || data.items.length === 0) return null;

  return (
    <SolutionsShowcase
      items={data.items}
      title={data.title}
      subtitle={data.subtitle}
      secondaryCtaLabel={data.secondaryCtaLabel}
      secondaryCtaHref={data.secondaryCtaHref}
    />
  );
}

/** Compact list fallback for other surfaces that still need a simple grid. */
export function SolutionTopicGrid({ items }: { items: SolutionItem[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={item.href}
            className="block rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-navy hover:border-accent hover:text-accent"
          >
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}
