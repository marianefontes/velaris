import { ContextualInsights } from "../contextual/ContextualInsights";
import { PersonaArtifacts } from "../contextual/PersonaArtifacts";
import { PersonaDecisionFeed } from "../contextual/PersonaDecisionFeed";
import { PersonaMetrics } from "../contextual/PersonaMetrics";
import { PersonaRecommendations } from "../contextual/PersonaRecommendations";
import { PersonaRecentActivity } from "../contextual/PersonaRecentActivity";

export function DeveloperWorkspace() {
  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-5">
        <PersonaMetrics />
        <PersonaArtifacts />
        <PersonaRecommendations />
      </div>
      <div className="space-y-5">
        <ContextualInsights />
        <PersonaDecisionFeed />
        <PersonaRecentActivity />
      </div>
    </section>
  );
}
