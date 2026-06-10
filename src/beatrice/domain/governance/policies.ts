import type { CommandMode } from "./types";
import type { Locale } from "../../../i18n/translations";
import {
  commandHintForLocale,
  commandPlaceholderForLocale,
} from "../../../i18n/commandMessages";

const COMMAND_PATTERN =
  /^\/(memory|decision|perspectives|audit|organizational-memory|decision-archaeology|perspective-synthesis|explainability-audit|knowledge-gap|governance-impact|principle-conflict|adoption-friction|oracle-council|enforce|migrate|token-impact|contract-check|feedback-review|capture|document|history|why|tradeoff|score|simulate|learn)\b/;

export function detectCommandMode(input: string): CommandMode | null {
  const match = input.match(COMMAND_PATTERN);
  return (match?.[1] as CommandMode | undefined) ?? null;
}

export function commandPlaceholder(command: CommandMode | null, locale: Locale): string | null {
  return command ? commandPlaceholderForLocale(command, locale) : null;
}

export function commandHint(command: CommandMode, locale: Locale): string {
  return commandHintForLocale(command, locale);
}
