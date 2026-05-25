import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import type { PersonaRecommendation } from "../types/beatrice";
import { usePersonaContext } from "../hooks/usePersonaContext";

export interface RecommendationContextValue {
  recommendations: PersonaRecommendation[];
}

const RecommendationContext = createContext<RecommendationContextValue | null>(null);

export function RecommendationProvider({ children }: { children: ReactNode }) {
  const { activePersonaContext } = usePersonaContext();
  const recommendations = useMemo(
    () => activePersonaContext.recommendations,
    [activePersonaContext],
  );

  return (
    <RecommendationContext.Provider value={{ recommendations }}>
      {children}
    </RecommendationContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error("useRecommendations must be used within RecommendationProvider");
  }
  return context;
}
