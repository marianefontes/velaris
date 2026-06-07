import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaComponentFocus } from "../contextual/PersonaComponentFocus";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaDecisionCriteria } from "../contextual/PersonaDecisionCriteria";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaThinkingModel } from "../contextual/PersonaThinkingModel";

// maintainer information hierarchy: system trajectory → precedent risk → drift
// signal → governance recommendation. Lead with the trajectory/precedent model
// and the decision feed (precedent memory), then governance recommendations.
export function MaintainerWorkspace() {
  return (
    <section className="space-y-4">
      <PersonaMetrics />
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <PersonaThinkingModel />
          <PersonaDecisionFeed />
        </div>
        <div className="space-y-4">
          <PersonaDecisionCriteria />
          <PersonaRecommendations />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ContextualInsights />
        <PersonaComponentFocus />
      </div>
    </section>
  );
}
