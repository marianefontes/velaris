import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Locale } from "../../i18n/translations";
import { trackStudyEvent } from "../../services/studyTracking";
import type { PersonaStrategy, ProfileId } from "../types/beatrice";
import { personaService } from "../services/persona.service";

const PERSONA_SESSION_KEY = "beatrice.activePersona";

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
  initialProfileId = "designer",
  locale,
}: {
  children: ReactNode;
  initialProfileId?: ProfileId;
  locale: Locale;
}) {
  const [profileId, setProfileState] = useState<ProfileId>(() => {
    if (typeof window === "undefined") return initialProfileId;

    const storedProfileId = window.localStorage.getItem(PERSONA_SESSION_KEY);
    const normalizedProfileId = personaService.normalizeProfileId(storedProfileId);
    if (normalizedProfileId && normalizedProfileId !== "general") {
      if (storedProfileId !== normalizedProfileId) {
        window.localStorage.setItem(PERSONA_SESSION_KEY, normalizedProfileId);
      }
      return normalizedProfileId;
    }

    return initialProfileId === "general" ? "designer" : initialProfileId;
  });

  useEffect(() => {
    if (profileId === "general") return;
    window.localStorage.setItem(PERSONA_SESSION_KEY, profileId);
  }, [profileId]);

  const setProfileId = useCallback((nextProfileId: ProfileId) => {
    setProfileState(nextProfileId);
    void trackStudyEvent("perspective_changed", { profile: nextProfileId });
  }, []);

  const toggleProfile = useCallback((nextProfileId: ProfileId) => {
    setProfileState((currentProfileId) => {
      const resolved = personaService.togglePersona(currentProfileId, nextProfileId);
      void trackStudyEvent("perspective_changed", { profile: resolved });
      return resolved;
    });
  }, []);

  const value = useMemo<PersonaContextValue>(() => ({
    activePersonaContext: personaService.getPersonaStrategy(profileId, locale),
    locale,
    options: personaService.getPersonaOptions(locale),
    profileId,
    strategy: personaService.getPersonaStrategy(profileId, locale),
    setProfileId,
    toggleProfile,
  }), [locale, profileId, setProfileId, toggleProfile]);

  return <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>;
}
