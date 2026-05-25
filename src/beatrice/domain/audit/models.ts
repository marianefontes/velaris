import type { Locale } from "../../../i18n/translations";
import type { AuditLabels } from "./types";

export function getAuditLabels(locale: Locale): AuditLabels {
  const isEn = locale === "en-US";
  return {
    badge: isEn ? "Audit Trail" : "Trilha",
    title: isEn ? "Decision Audit Trail" : "Trilha de Decisão",
    entries: isEn ? "entries" : "entradas",
    empty: isEn
      ? "No decisions recorded yet. Ask Beatrice something to start the trail."
      : "Nenhuma decisão registrada ainda. Pergunte à Beatrice para iniciar a trilha.",
    exportMd: isEn ? "Export .md" : "Exportar .md",
    exportJson: isEn ? "Export .json" : "Exportar .json",
    close: isEn ? "Close" : "Fechar",
    viewAll: isEn ? "View full trail" : "Ver trilha completa",
    tabDecisions: isEn ? "Decisions" : "Decisões",
    tabTimeline: isEn ? "Timeline" : "Linha do tempo",
    confidence: isEn ? "Confidence" : "Confiança",
    evidence: isEn ? "Evidence" : "Evidências",
    tradeOffs: "Trade-offs",
    gains: isEn ? "Gains" : "Ganhos",
    losses: isEn ? "Losses" : "Perdas",
    risks: isEn ? "Risks" : "Riscos",
    lifecycle: isEn ? "Lifecycle" : "Ciclo de vida",
    created: isEn ? "Created" : "Criado",
    review: isEn ? "Review" : "Revisão",
    active: isEn ? "ACTIVE" : "ATIVO",
    related: isEn ? "Related decisions" : "Decisões relacionadas",
    reasoning: isEn ? "Reasoning chain" : "Cadeia de raciocínio",
    uxConf: "UX",
    a11yConf: isEn ? "Accessibility" : "Acessibilidade",
    archConf: isEn ? "Architecture" : "Arquitetura",
    consConf: isEn ? "Consistency" : "Consistência",
    perfConf: "Performance",
  };
}

