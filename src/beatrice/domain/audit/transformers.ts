import type { ChatMessage, AuditEntry } from "../../types/beatrice";
import { getIntentTradeOffs, relatedDecisionIds } from "../decision";
import { buildEvidence, computeConfidence } from "../reasoning";
import { makeReviewDate } from "./policies";

export function messagesToAuditEntries(messages: ChatMessage[]): AuditEntry[] {
  const year = new Date().getFullYear();
  const createdAt = new Date().toISOString().slice(0, 10);
  const raw: AuditEntry[] = [];

  for (let index = 1; index < messages.length; index += 1) {
    const message = messages[index];
    if (message.role !== "assistant" || !message.sources?.length || message.isStreaming) continue;

    const previousUser = messages
      .slice(0, index)
      .reverse()
      .find((candidate) => candidate.role === "user");
    const firstLine = message.content.split("\n").find((line) => line.trim().length > 0) ?? "";
    const intent = message.intent ?? "general";

    raw.push({
      id: message.id,
      decisionId: `DEC-${year}-${String(raw.length + 1).padStart(4, "0")}`,
      intent,
      userQuery: previousUser?.content ?? "",
      sources: message.sources,
      summaryLine: firstLine.replace(/\*\*/g, "").trim().slice(0, 180),
      confidence: computeConfidence(message.sources, intent),
      evidence: buildEvidence(message.sources),
      tradeOffs: getIntentTradeOffs(intent),
      lifecycle: { status: "active", createdAt, reviewDate: makeReviewDate(createdAt) },
      relatedDecisions: [],
    });
  }

  return raw.map((entry) => ({
    ...entry,
    relatedDecisions: relatedDecisionIds(entry, raw),
  }));
}

