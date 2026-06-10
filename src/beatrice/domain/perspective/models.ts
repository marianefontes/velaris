import { PERSONA_STRATEGIES } from "./lenses";
import { isCanonicalProfileId, PROFESSIONAL_PROFILE_IDS } from "./profileIds";
import type { PersonaStrategy, ProfileId } from "./types";

export function isProfileId(value: string): value is ProfileId {
  return isCanonicalProfileId(value);
}

export function getPersonaStrategy(profileId: ProfileId): PersonaStrategy {
  return PERSONA_STRATEGIES[profileId] ?? PERSONA_STRATEGIES.general;
}

export function getPersonaOptions(): PersonaStrategy[] {
  return PROFESSIONAL_PROFILE_IDS.map((profileId) => PERSONA_STRATEGIES[profileId]);
}
