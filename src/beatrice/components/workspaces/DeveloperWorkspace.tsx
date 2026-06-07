import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaComponentFocus } from "../contextual/PersonaComponentFocus";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaDecisionCriteria } from "../contextual/PersonaDecisionCriteria";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaThinkingModel } from "../contextual/PersonaThinkingModel";

export function DeveloperWorkspace() {
  return (
    <section className="space-y-4">
      <PersonaMetrics />
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <PersonaThinkingModel />
          <PersonaDecisionCriteria />
        </div>
        <div className="space-y-4">
          <ContextualInsights />
          <PersonaComponentFocus />
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PersonaRecommendations />
        <PersonaDecisionFeed />
      </div>
    </section>
  );
}
