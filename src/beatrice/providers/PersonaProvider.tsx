import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import type { PersonaStrategy, ProfileId } from "../types/beatrice";
import { personaService } from "../services/persona.service";

export interface PersonaContextValue {
  activePersonaContext: PersonaStrategy;
  locale: Locale;
  options: PersonaStrategy[];
  profileId: ProfileId;
  strategy: PersonaStrategy;
  setProfileId: (profileId: ProfileId) => void;
  toggleProfile: (profileId: ProfileId) => void;
}

export const PersonaContext = createContext<PersonaContextValue | null>(null);

export function PersonaProvider({
  children,
  initialProfileId = "general",
  locale,
}: {
  children: ReactNode;
  initialProfileId?: ProfileId;
  locale: Locale;
}) {
  const [profileId, setProfileId] = useState<ProfileId>(initialProfileId);

  const value = useMemo<PersonaContextValue>(() => ({
    activePersonaContext: personaService.getPersonaStrategy(profileId),
    locale,
    options: personaService.getPersonaOptions(),
    profileId,
    strategy: personaService.getPersonaStrategy(profileId),
    setProfileId,
    toggleProfile: (nextProfileId) => {
      setProfileId((currentProfileId) => personaService.togglePersona(currentProfileId, nextProfileId));
    },
  }), [locale, profileId]);

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}
