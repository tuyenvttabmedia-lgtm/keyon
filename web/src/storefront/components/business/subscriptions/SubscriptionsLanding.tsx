import { SubscriptionHero } from "./SubscriptionHero";
import { LifecycleTimeline } from "./LifecycleTimeline";
import { SubscriptionControlCenter } from "./SubscriptionControlCenter";
import { RenewalInbox } from "./RenewalInbox";
import { RenewalDecision } from "./RenewalDecision";
import { SubscriptionBenefits } from "./SubscriptionBenefits";
import { SubscriptionProcess } from "./SubscriptionProcess";
import { SubscriptionCTA } from "./SubscriptionCTA";

export function SubscriptionsLanding() {
  return (
    <div className="bg-white">
      <SubscriptionHero />
      <LifecycleTimeline />
      <SubscriptionControlCenter />
      <RenewalInbox />
      <RenewalDecision />
      <SubscriptionBenefits />
      <SubscriptionProcess />
      <SubscriptionCTA />
    </div>
  );
}
