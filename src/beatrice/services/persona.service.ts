import type { Locale } from "../../i18n/translations";
import {
  getPersonaOptions,
  getPersonaStrategy,
  isProfileId,
  localizePersonaStrategy,
  normalizeProfileId,
  resolvePersonaForRequest,
  togglePersona,
} from "../domain/perspective";
import type { ProfileId } from "../types/beatrice";

function getLocalizedPersonaStrategy(profileId: ProfileId, locale?: Locale) {
  const strategy = getPersonaStrategy(profileId);
  return locale ? localizePersonaStrategy(strategy, locale) : strategy;
}

function getLocalizedPersonaOptions(locale?: Locale) {
  const options = getPersonaOptions();
  return locale ? options.map((strategy) => localizePersonaStrategy(strategy, locale)) : options;
}

export const personaService = {
  getPersonaOptions: getLocalizedPersonaOptions,
  getPersonaStrategy: getLocalizedPersonaStrategy,
  isProfileId,
  normalizeProfileId,
  resolvePersonaForRequest,
  togglePersona,
};
