import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaArtifacts } from "../contextual/PersonaArtifacts";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaRecentActivity } from "../contextual/PersonaRecentActivity";

export function QAWorkspace() {
  return (
    <section className="space-y-5">
      <PersonaMetrics />
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <ContextualInsights />
        <PersonaRecommendations />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <PersonaDecisionFeed />
        <div className="space-y-5">
          <PersonaArtifacts />
          <PersonaRecentActivity />
        </div>
      </div>
    </section>
  );
}
