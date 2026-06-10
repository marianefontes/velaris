import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaComponentFocus } from "../contextual/PersonaComponentFocus";
import { PersonaDecisionCriteria } from "../contextual/PersonaDecisionCriteria";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaExamples } from "../contextual/PersonaExamples";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaThinkingModel } from "../contextual/PersonaThinkingModel";

export function ProductDesignerWorkspace() {
  return (
    <section className="space-y-4">
      <PersonaMetrics />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <PersonaThinkingModel />
          <ContextualInsights />
          <PersonaExamples />
        </div>
        <div className="space-y-4">
          <PersonaRecommendations />
          <PersonaDecisionCriteria />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <PersonaComponentFocus />
        <PersonaDecisionFeed />
      </div>
    </section>
  );
}
