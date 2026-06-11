import { describe, expect, it } from "vitest";
import type { ResponseAuditMetadata } from "../types/beatrice";
import { mergeAuditMetadata, removeOfflineMessages, sanitizePersistedMessages } from "./workspace.store";

function metadata(
  overrides: Partial<ResponseAuditMetadata> = {},
): ResponseAuditMetadata {
  return {
    request_id: "req_test",
    intent: "component_question",
    workflow: "component_decision",
    tools_used: [],
    steps: [],
    sources: [],
    evidence_similarity: 0,
    evidence_tier: "insufficient",
    limitations: [],
    execution_status: "running",
    ...overrides,
  };
}

describe("mergeAuditMetadata", () => {
  it("updates steps by id and keeps the backend order", () => {
    const current = metadata({
      steps: [
        {
          id: "request_received",
          label: "Request received",
          status: "completed",
        },
        {
          id: "llm_composition_started",
          label: "LLM composition started",
          status: "running",
        },
      ],
    });
    const incoming = metadata({
      execution_status: "completed",
      steps: [
        {
          id: "llm_composition_started",
          label: "LLM composition started",
          status: "completed",
        },
        {
          id: "response_completed",
          label: "Response completed",
          status: "completed",
        },
      ],
    });

    const merged = mergeAuditMetadata(current, incoming);

    expect(merged.steps?.map((step) => step.id)).toEqual([
      "request_received",
      "llm_composition_started",
      "response_completed",
    ]);
    expect(merged.steps?.[1].status).toBe("completed");
  });

  it("does not invent steps when the backend sends none", () => {
    const merged = mergeAuditMetadata(undefined, metadata());

    expect(merged.steps).toEqual([]);
  });
});

describe("removeOfflineMessages", () => {
  it("removes current and legacy offline errors without hiding other failures", () => {
    const messages = [
      {
        id: "legacy-offline",
        role: "assistant" as const,
        content: "Abraxos está offline. Inicie o servidor da API.",
        isError: true,
      },
      {
        id: "current-offline",
        role: "assistant" as const,
        content: "Abraxos está temporariamente indisponível.",
        isError: true,
        errorKind: "offline" as const,
      },
      {
        id: "technical",
        role: "assistant" as const,
        content: "O Abraxos está online, mas a resposta falhou.",
        isError: true,
        errorKind: "technical" as const,
      },
    ];

    expect(removeOfflineMessages(messages).map((message) => message.id)).toEqual([
      "technical",
    ]);
  });
});

describe("sanitizePersistedMessages", () => {
  it("removes stuck streaming placeholders and only the final orphaned user turn", () => {
    const interruptedTurn = [
      {
        id: "user-1",
        role: "user" as const,
        content: "Qual componente usar?",
      },
      {
        id: "assistant-1",
        role: "assistant" as const,
        content: "Pensando...",
        isStreaming: true,
      },
    ];

    expect(sanitizePersistedMessages(interruptedTurn).map((message) => message.id)).toEqual([]);

    const followUpWithoutAnswer = [
      {
        id: "user-1",
        role: "user" as const,
        content: "Primeira pergunta",
      },
      {
        id: "assistant-1",
        role: "assistant" as const,
        content: "Resposta completa",
      },
      {
        id: "user-2",
        role: "user" as const,
        content: "Segunda pergunta sem resposta",
      },
      {
        id: "assistant-2",
        role: "assistant" as const,
        content: "",
        isStreaming: true,
      },
    ];

    expect(sanitizePersistedMessages(followUpWithoutAnswer).map((message) => message.id)).toEqual([
      "user-1",
      "assistant-1",
    ]);
  });
});
