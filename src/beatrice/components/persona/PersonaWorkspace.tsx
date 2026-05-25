import { PersonaHeader } from "./PersonaHeader";
import { PersonaInsights } from "./PersonaInsights";
import { PersonaMetrics } from "./PersonaMetrics";

export function PersonaWorkspace() {
  return (
    <aside className="glass-panel hidden min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] xl:flex">
      <PersonaHeader />
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <PersonaInsights />
        <PersonaMetrics />
      </div>
    </aside>
  );
}
