import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaArtifacts } from "../contextual/PersonaArtifacts";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaRecentActivity } from "../contextual/PersonaRecentActivity";

export function DesignerWorkspace() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-5">
        <PersonaMetrics />
        <ContextualInsights />
        <PersonaDecisionFeed />
      </div>
      <div className="space-y-5">
        <PersonaRecommendations />
        <PersonaArtifacts />
        <PersonaRecentActivity />
      </div>
    </section>
  );
}
