import type { Locale } from "../../../i18n/translations";
import type { AbraxosSurfaceContext } from "./types";

function hasSpecificContext(context: AbraxosSurfaceContext): boolean {
  return Boolean(context.section || context.entity_name || context.entity_type);
}

function contextPath(context: AbraxosSurfaceContext): string {
  const page = context.page ?? context.page_title ?? "";
  const section = context.section ?? context.entity_name ?? "";
  if (page && section) return `${page} > ${section}`;
  return page || section;
}

export function buildWelcomeMessage(context: AbraxosSurfaceContext, locale: Locale): string {
  if (hasSpecificContext(context)) {
    const path = contextPath(context);
    if (locale === "en-US") {
      return `I see ${path}. I can help with usage, states, accessibility, dos/don'ts, or alternatives.`;
    }
    if (locale === "pt-PT") {
      return `Estou a ver ${path}. Posso ajudar com uso, estados, acessibilidade, dos/don'ts ou alternativas.`;
    }
    return `Estou vendo ${path}. Posso ajudar com uso, estados, acessibilidade, dos/don'ts ou alternativas.`;
  }

  if (locale === "en-US") {
    return "I can help with components, tokens, patterns, accessibility, audits, and documented Velaris decisions.";
  }
  if (locale === "pt-PT") {
    return "Posso ajudar com componentes, tokens, padrões, acessibilidade, auditorias e decisões documentadas do Velaris.";
  }
  return "Posso ajudar com componentes, tokens, patterns, acessibilidade, auditorias e decisões documentadas do Velaris.";
}
