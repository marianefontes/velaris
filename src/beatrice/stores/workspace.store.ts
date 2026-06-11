import type { ChatMessage, CognitiveSkill, NavigationAction, OracleEngineId, ResponseAuditMetadata, SourceChip } from "../types/beatrice";

const LEGACY_OFFLINE_MESSAGE_PREFIXES = [
  "Abraxos está offline.",
  "Abraxos is offline.",
  "Abraxos está temporariamente indisponível.",
  "Abraxos is temporarily unavailable.",
];

export function isOfflineMessage(message: ChatMessage): boolean {
  return message.role === "assistant"
    && message.isError === true
    && (
      message.errorKind === "offline"
      || LEGACY_OFFLINE_MESSAGE_PREFIXES.some((prefix) =>
        message.content.startsWith(prefix)
      )
    );
}

export function removeOfflineMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.filter((message) => !isOfflineMessage(message));
}

/** Drop interrupted stream placeholders and the final orphaned user turn, if any. */
export function sanitizePersistedMessages(messages: ChatMessage[]): ChatMessage[] {
  const withoutStreaming = removeOfflineMessages(
    messages.filter((message) => !message.isStreaming),
  );

  if (withoutStreaming.length === 0) return withoutStreaming;

  const last = withoutStreaming[withoutStreaming.length - 1];
  if (last.role === "user") {
    return withoutStreaming.slice(0, -1);
  }

  return withoutStreaming;
}

export function patchMessage(messages: ChatMessage[], id: string, patch: Partial<ChatMessage>): ChatMessage[] {
  return messages.map((message) => (message.id === id ? { ...message, ...patch } : message));
}

export function appendStreamingMetadata(
  messages: ChatMessage[],
  id: string,
  metadata: {
    sources?: SourceChip[];
    intent?: string;
    catalogMode?: boolean;
    cognitiveSkills?: CognitiveSkill[];
    engine?: OracleEngineId | null;
    auditMetadata?: ResponseAuditMetadata;
    navigationAction?: NavigationAction;
    secondaryNavigationActions?: NavigationAction[];
  },
): ChatMessage[] {
  return messages.map((message) => {
    if (message.id !== id) return message;
    const auditMetadata = metadata.auditMetadata
      ? mergeAuditMetadata(message.auditMetadata, metadata.auditMetadata)
      : message.auditMetadata;
    return {
      ...message,
      ...metadata,
      auditMetadata,
      decisionId: auditMetadata?.decision_id ?? message.decisionId,
      decisionStatus: auditMetadata?.decision_status ?? message.decisionStatus,
    };
  });
}

export function mergeAuditMetadata(
  current: ResponseAuditMetadata | undefined,
  incoming: ResponseAuditMetadata,
): ResponseAuditMetadata {
  const steps = [...(current?.steps ?? [])];
  for (const step of incoming.steps ?? []) {
    const index = steps.findIndex((candidate) => candidate.id === step.id);
    if (index >= 0) steps[index] = step;
    else steps.push(step);
  }

  return {
    ...current,
    ...incoming,
    tools_used: incoming.tools_used ?? current?.tools_used,
    steps,
    sources: incoming.sources ?? current?.sources,
    limitations: incoming.limitations ?? current?.limitations,
    required_signals_found: incoming.required_signals_found ?? current?.required_signals_found,
    required_signals_missing: incoming.required_signals_missing ?? current?.required_signals_missing,
    matched_signals: incoming.matched_signals ?? current?.matched_signals,
    profile_contract_warnings: incoming.profile_contract_warnings ?? current?.profile_contract_warnings,
    selected_skills: incoming.selected_skills ?? current?.selected_skills,
  };
}
