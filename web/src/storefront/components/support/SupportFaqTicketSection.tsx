import { SupportFAQ, type SupportFaqItem } from "./SupportFAQ";
import { SECTION_PAD } from "./shared";

/** Common questions only. Ticket lives once, at the bottom of the page. */
export function SupportFaqTicketSection({ items }: { items: SupportFaqItem[] }) {
  return (
    <section className={`border-t border-border bg-[#F4F8FB] ${SECTION_PAD}`}>
      <div className="home-container">
        <SupportFAQ items={items} />
      </div>
    </section>
  );
}
