import { PERSONA_STRATEGIES } from "./strategies";
import type { PersonaStrategy, ProfileId } from "./types";

export function getPersonaStrategy(profileId: ProfileId): PersonaStrategy {
  return PERSONA_STRATEGIES[profileId] ?? PERSONA_STRATEGIES.general;
}

export function getPersonaOptions(): PersonaStrategy[] {
  return Object.values(PERSONA_STRATEGIES).filter((strategy) => strategy.id !== "general");
}
