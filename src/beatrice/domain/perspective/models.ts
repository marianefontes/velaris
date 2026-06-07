import { PERSONA_STRATEGIES } from "./lenses";
import type { PersonaStrategy, ProfileId } from "./types";

export function isProfileId(value: string): value is ProfileId {
  return value in PERSONA_STRATEGIES;
}

export function getPersonaStrategy(profileId: ProfileId): PersonaStrategy {
  return PERSONA_STRATEGIES[profileId] ?? PERSONA_STRATEGIES.general;
}

export function getPersonaOptions(): PersonaStrategy[] {
  return Object.values(PERSONA_STRATEGIES).filter((strategy) => strategy.id !== "general");
}
