import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaArtifacts } from "../contextual/PersonaArtifacts";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaRecentActivity } from "../contextual/PersonaRecentActivity";

export function ProductManagerWorkspace() {
  return (
    <section className="space-y-5">
      <PersonaMetrics />
      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-5">
          <PersonaRecommendations />
          <PersonaArtifacts />
        </div>
        <ContextualInsights />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <PersonaDecisionFeed />
        <PersonaRecentActivity />
      </div>
    </section>
  );
}
