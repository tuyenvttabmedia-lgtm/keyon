"use client";

import { SupportFAQ, type SupportFaqItem } from "./SupportFAQ";
import { SupportTicketPanel } from "./SupportTicketPanel";
import { SECTION_PAD } from "./shared";

/** Desktop ~65/35 FAQ + ticket; mobile stacks FAQ then ticket CTAs. */
export function SupportFaqTicketSection({ items }: { items: SupportFaqItem[] }) {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-8">
            <SupportFAQ items={items} />
          </div>
          <div className="min-w-0 lg:col-span-4">
            <SupportTicketPanel />
          </div>
        </div>
      </div>
    </section>
  );
}
