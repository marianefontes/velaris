import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaDecisionCriteria } from "../contextual/PersonaDecisionCriteria";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaThinkingModel } from "../contextual/PersonaThinkingModel";

export function DesignSystemManagerWorkspace() {
  return (
    <section className="space-y-4">
      <PersonaMetrics />
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <PersonaRecommendations />
          <PersonaDecisionCriteria />
        </div>
        <div className="space-y-4">
          <PersonaThinkingModel />
          <ContextualInsights />
        </div>
      </div>
      <PersonaDecisionFeed />
    </section>
  );
}
