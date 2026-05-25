import { ActivePersonaHeader } from "../components/persona/ActivePersonaHeader";
import { PersonaContextBanner } from "../components/persona/PersonaContextBanner";
import { PersonaStatusBar } from "../components/persona/PersonaStatusBar";
import { PersonaSwitcher } from "../components/persona/PersonaSwitcher";
import { PersonaWorkspaceShell } from "../components/persona/PersonaWorkspaceShell";
import { PersonaWorkspace } from "../components/workspaces/PersonaWorkspace";
import { useI18n } from "../../i18n/I18nProvider";
import { InsightProvider } from "../providers/InsightProvider";
import { PersonaProvider } from "../providers/PersonaProvider";
import { RecommendationProvider } from "../providers/RecommendationProvider";

export function PersonaPage() {
  const { locale } = useI18n();

  return (
    <PersonaProvider locale={locale} initialProfileId="designer">
      <InsightProvider>
        <RecommendationProvider>
          <PersonaWorkspaceShell
            header={<ActivePersonaHeader />}
            switcher={<PersonaSwitcher />}
            banner={<PersonaContextBanner variant="full" />}
            status={<PersonaStatusBar />}
            workspace={<PersonaWorkspace />}
          />
        </RecommendationProvider>
      </InsightProvider>
    </PersonaProvider>
  );
}
