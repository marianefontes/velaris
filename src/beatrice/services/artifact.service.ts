import type { Locale } from "../../i18n/translations";
import type { AuditEntry } from "../types/beatrice";
import { intentLabel } from "../domain/decision";

export function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportAuditTrailMd(entries: AuditEntry[], locale: Locale): void {
  const isEn = locale === "en-US";
  const now = new Date();
  const dateStr = now.toLocaleDateString(isEn ? "en-US" : "pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const heading = isEn
    ? `# Decision Audit Trail — Beatrice\n\n> Generator: Aetheris Oracle · ${dateStr}\n> Entries: ${entries.length}\n`
    : `# Trilha de Decisão — Beatrice\n\n> Gerado por: Oráculo Aetheris · ${dateStr}\n> Entradas: ${entries.length}\n`;

  const body = entries.map((entry) => {
    const confidence = entry.confidence;
    const tradeOffs = entry.tradeOffs;
    const sourceLines = entry.evidence
      .map(
        (evidence) =>
          `  - [${evidence.weight.toUpperCase()}] ${evidence.source} — "${evidence.title}" (${Math.round(evidence.similarity * 100)}%) · ${evidence.authorityLabel}`,
      )
      .join("\n");
    const gainLines = tradeOffs.gains.map((gain) => `  + ${gain}`).join("\n");
    const lossLines = tradeOffs.losses.map((loss) => `  - ${loss}`).join("\n");
    const riskLines = tradeOffs.risks.map((risk) => `  ! ${risk}`).join("\n");

    return [
      "\n---\n",
      `## ${entry.decisionId} — ${intentLabel(entry.intent, locale)}`,
      `**Status:** ${entry.lifecycle.status.toUpperCase()}  `,
      `**Created:** ${entry.lifecycle.createdAt}  `,
      `**Review by:** ${entry.lifecycle.reviewDate}`,
      "",
      isEn ? `**Query:** ${entry.userQuery}` : `**Pergunta:** ${entry.userQuery}`,
      "",
      `> ${entry.summaryLine}`,
      "",
      isEn ? "### Confidence Breakdown" : "### Breakdown de Confiança",
      "| Dimension | Score |",
      "|-----------|-------|",
      `| UX | ${confidence.ux}% |`,
      `| Accessibility | ${confidence.accessibility}% |`,
      `| Architecture | ${confidence.architecture}% |`,
      `| Consistency | ${confidence.consistency}% |`,
      `| Performance | ${confidence.performance}% |`,
      "",
      isEn ? "### Evidence (weighted)" : "### Evidências (ponderadas)",
      sourceLines,
      "",
      "### Trade-offs",
      gainLines,
      lossLines,
      riskLines,
      entry.relatedDecisions.length > 0
        ? `\n${isEn ? "**Related:**" : "**Relacionadas:**"} ${entry.relatedDecisions.join(", ")}`
        : "",
    ].join("\n");
  }).join("\n");

  downloadBlob(heading + body + "\n", `beatrice-audit-${now.toISOString().slice(0, 10)}.md`, "text/markdown;charset=utf-8");
}

export function exportAuditTrailJson(entries: AuditEntry[], locale: Locale): void {
  const payload = {
    generator: "Beatrice — Aetheris Oracle",
    version: "3.0.0",
    locale,
    exportedAt: new Date().toISOString(),
    totalEntries: entries.length,
    entries: entries.map((entry) => ({
      decisionId: entry.decisionId,
      intent: entry.intent,
      query: entry.userQuery,
      summary: entry.summaryLine,
      confidence: entry.confidence,
      evidence: entry.evidence,
      tradeOffs: entry.tradeOffs,
      lifecycle: entry.lifecycle,
      relatedDecisions: entry.relatedDecisions,
    })),
  };

  downloadBlob(
    JSON.stringify(payload, null, 2),
    `beatrice-audit-${new Date().toISOString().slice(0, 10)}.json`,
    "application/json;charset=utf-8",
  );
}

