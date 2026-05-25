import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaArtifacts } from "../contextual/PersonaArtifacts";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaRecentActivity } from "../contextual/PersonaRecentActivity";

export function TechWriterWorkspace() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <div className="space-y-5">
        <PersonaMetrics />
        <PersonaRecommendations />
        <PersonaArtifacts />
      </div>
      <div className="space-y-5">
        <ContextualInsights />
        <PersonaDecisionFeed />
        <PersonaRecentActivity />
      </div>
    </section>
  );
}
