import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { PersonaInsight } from "../types/beatrice";
import { usePersonaContext } from "../hooks/usePersonaContext";

const priorityRank: Record<PersonaInsight["priority"], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface InsightContextValue {
  insights: PersonaInsight[];
  topInsight: PersonaInsight;
}

const InsightContext = createContext<InsightContextValue | null>(null);

export function InsightProvider({ children }: { children: ReactNode }) {
  const { activePersonaContext } = usePersonaContext();
  const insights = useMemo(
    () => [...activePersonaContext.insights].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]),
    [activePersonaContext],
  );

  return (
    <InsightContext.Provider value={{ insights, topInsight: insights[0] }}>
      {children}
    </InsightContext.Provider>
  );
}

export function useInsights() {
  const context = useContext(InsightContext);
  if (!context) {
    throw new Error("useInsights must be used within InsightProvider");
  }
  return context;
}
