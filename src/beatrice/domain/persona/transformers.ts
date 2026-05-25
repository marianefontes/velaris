import type { PersonaStrategy } from "./types";

export function strategyToDashboardSections(strategy: PersonaStrategy): string[] {
  return strategy.dashboardComposition;
}
