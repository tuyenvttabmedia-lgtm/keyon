import { SupportHero } from "./SupportHero";
import { SupportTopics } from "./SupportTopics";
import { SupportFaqTicketSection } from "./SupportFaqTicketSection";
import { SupportChannels } from "./SupportChannels";
import { SupportResolutionPanel } from "./SupportResolutionPanel";
import type { SupportChannel, SupportSearchDoc, SuggestChip } from "./shared";
import type { SupportFaqItem } from "./SupportFAQ";

type Props = {
  docs: SupportSearchDoc[];
  suggestions: SuggestChip[];
  faqItems: SupportFaqItem[];
  channels: SupportChannel[];
};

export function SupportCenterLanding({
  docs,
  suggestions,
  faqItems,
  channels,
}: Props) {
  return (
    <div className="bg-white">
      <SupportHero docs={docs} suggestions={suggestions} />
      <SupportTopics />
      <SupportFaqTicketSection items={faqItems} />
      <SupportChannels channels={channels} />
      <SupportResolutionPanel />
    </div>
  );
}
