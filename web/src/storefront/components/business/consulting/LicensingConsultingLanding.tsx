import { ConsultingHero } from "./ConsultingHero";
import { ConsultingQuestionBoard } from "./ConsultingQuestionBoard";
import { ConsultingWorkspace } from "./ConsultingWorkspace";
import { ConsultingAreas } from "./ConsultingAreas";
import { ConsultingConversationFlow } from "./ConsultingConversationFlow";
import { ConsultationForm } from "./ConsultationForm";
import { ConsultingFinalCTA } from "./ConsultingFinalCTA";

export function LicensingConsultingLanding() {
  return (
    <div className="overflow-x-hidden bg-white">
      <ConsultingHero />
      <ConsultingQuestionBoard />
      <ConsultingWorkspace />
      <ConsultingAreas />
      <ConsultingConversationFlow />
      <ConsultationForm />
      <ConsultingFinalCTA />
    </div>
  );
}
