import { PersonaHeader } from "./PersonaHeader";
import { PersonaInsights } from "./PersonaInsights";
import { PersonaMetrics } from "./PersonaMetrics";
import { useI18n } from "../../../i18n/I18nProvider";

export function PersonaSidebarPanel() {
  const { t } = useI18n();

  return (
    <aside
      aria-label={t("chat.context")}
      className="beatrice-rail hidden min-h-0 flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-surface-container-low/40 min-[1360px]:flex"
    >
      <PersonaHeader />
      <div className="beatrice-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2.5">
        <PersonaInsights />
        <PersonaMetrics />
      </div>
    </aside>
  );
}
