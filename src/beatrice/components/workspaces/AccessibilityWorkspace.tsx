import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaComponentFocus } from "../contextual/PersonaComponentFocus";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaDecisionCriteria } from "../contextual/PersonaDecisionCriteria";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaThinkingModel } from "../contextual/PersonaThinkingModel";

// a11y information hierarchy: modality at risk → semantic gap → AT impact →
// inclusive recommendation. Surface the lens's risk model and criteria first,
// then the inclusive recommendations, then component/decision context.
export function AccessibilityWorkspace() {
  return (
    <section className="space-y-4">
      <PersonaMetrics />
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <PersonaThinkingModel />
          <PersonaDecisionCriteria />
        </div>
        <div className="space-y-4">
          <PersonaRecommendations />
          <ContextualInsights />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <PersonaComponentFocus />
        <PersonaDecisionFeed />
      </div>
    </section>
  );
}
