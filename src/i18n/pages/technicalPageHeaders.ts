import { localizeContent } from "../localizedContent";
import type { Locale } from "../translations";

export function getDevelopersHeader(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) =>
    localizeContent(locale, ptBr, en, ptPt);

  return {
    titleLead: t("A plataforma,", "The platform,"),
    titleAccent: t("explicada enquanto funciona", "explained as it runs"),
    lead: t(
      "O Velaris é uma superfície compacta sobre um backend deliberado. Esta página documenta o sistema como deve ser documentado antes de uma extensão: módulos nomeados, caminhos reais de artefactos, comandos executáveis e um inspector de retrieval ligado ao mesmo /api/chat usado pelo chat.",
      "Velaris is a compact surface over a deliberate backend. This page documents the system as it should be documented before an extension: named modules, real artifact paths, runnable commands, and a live retrieval inspector connected to the same /api/chat used by chat.",
    ),
    navigationAria: t("Secções para developers", "Developer sections"),
  };
}

export function getEvaluationHeader(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) =>
    localizeContent(locale, ptBr, en, ptPt);

  return {
    titleLead: t("Como o Velaris é", "How Velaris is"),
    titleAccent: t("medido", "measured"),
    lead: t(
      "A plataforma é um artefacto de investigação. Esta superfície estrutura a metodologia que o transforma em resultados medidos: o que é medido, como é medido, que intervalos contam como evidência e o que ainda aguarda recolha.",
      "The platform is a research artifact. This surface structures the methodology that turns it into measured results: what is measured, how it is measured, which ranges count as evidence, and what remains pending collection.",
    ),
    navigationAria: t("Secções de avaliação", "Evaluation sections"),
  };
}
