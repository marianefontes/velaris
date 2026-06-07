import { ActivePersonaHeader } from "../components/persona/ActivePersonaHeader";
import { PersonaContextBanner } from "../components/persona/PersonaContextBanner";
import { PersonaStatusBar } from "../components/persona/PersonaStatusBar";
import { PersonaSessionPanel } from "../components/persona/PersonaSessionPanel";
import { PersonaWorkspaceShell } from "../components/persona/PersonaWorkspaceShell";
import { PersonaWorkspace } from "../components/workspaces/PersonaWorkspace";
import { InsightProvider } from "../providers/InsightProvider";
import { RecommendationProvider } from "../providers/RecommendationProvider";

export function PersonaPage() {
  return (
    <InsightProvider>
      <RecommendationProvider>
        <PersonaWorkspaceShell
          header={<ActivePersonaHeader />}
          switcher={<PersonaSessionPanel />}
          banner={<PersonaContextBanner variant="full" />}
          status={<PersonaStatusBar />}
          workspace={<PersonaWorkspace />}
        />
      </RecommendationProvider>
    </InsightProvider>
  );
}
