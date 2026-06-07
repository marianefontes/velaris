import { PersonaHeader } from "./PersonaHeader";
import { PersonaInsights } from "./PersonaInsights";
import { PersonaMetrics } from "./PersonaMetrics";
export function PersonaSidebarPanel() {
  return (
    <aside className="hidden min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high/45 shadow-panel backdrop-blur-3xl xl:flex">
      <PersonaHeader />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <PersonaInsights />
        <PersonaMetrics />
      </div>
    </aside>
  );
}
