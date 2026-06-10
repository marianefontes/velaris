// ||| Comparison data layer : fetches the two sides of /comparison.
// Abraxos reuses the live /api/chat SSE endpoint (same contract as the chat,
// without touching BeatriceChatPage). The generic LLM side is a clearly-isolated
// local mock until a dedicated endpoint exists.

import type {
  BeatriceComparisonResult,
  ComparisonSource,
  GenericComparisonResult,
} from "../types/comparison";

const ORACLE_API = import.meta.env.VITE_ORACLE_API_URL ?? "/api/chat";

interface BeatriceStreamMeta {
  sources?: Array<{ title?: string; source?: string; similarity?: number }>;
  intent?: string;
  engine?: string | null;
}

function evidenceSimilarityFromSources(sources: ComparisonSource[]): number | null {
  if (sources.length === 0) return null;
  // Mean retrieval relevance. This is not answer confidence.
  const mean = sources.reduce((sum, source) => sum + source.similarity, 0) / sources.length;
  return Math.round(mean * 100);
}

// ||| Abraxos: contextual, source-grounded answer via the real RAG+XAI pipeline.
export async function getBeatriceComparisonAnswer(
  question: string,
  options: { onDelta?: (full: string) => void; signal?: AbortSignal } = {},
): Promise<BeatriceComparisonResult> {
  const response = await fetch(ORACLE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
    body: JSON.stringify({
      messages: [{ role: "user", content: question }],
      profile: "general",
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error("beatrice_unavailable");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let answer = "";
  const meta: BeatriceStreamMeta = {};

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") break;

      try {
        const parsed = JSON.parse(payload) as {
          delta?: string;
          error?: string;
          sources?: BeatriceStreamMeta["sources"];
          intent?: string;
          engine?: string | null;
        };
        if (parsed.error) throw new Error(parsed.error);
        if (parsed.sources !== undefined) meta.sources = parsed.sources;
        if (parsed.intent !== undefined) meta.intent = parsed.intent;
        if (parsed.engine !== undefined) meta.engine = parsed.engine;
        if (parsed.delta) {
          answer += parsed.delta;
          options.onDelta?.(answer);
        }
      } catch (error) {
        // A thrown stream error must propagate; malformed lines are skipped.
        if (error instanceof Error && error.message && !error.message.startsWith("Unexpected")) {
          throw error;
        }
      }
    }
  }

  const sources: ComparisonSource[] = (meta.sources ?? []).map((source) => ({
    title: source.title ?? "",
    source: source.source ?? "",
    similarity: typeof source.similarity === "number" ? source.similarity : 0,
  }));

  return {
    answer: answer.trim(),
    intent: meta.intent,
    sources,
    evidenceSimilarity: evidenceSimilarityFromSources(sources),
    engine: meta.engine ?? null,
  };
}

// ||| Generic LLM : broad parametric answer, no retrieval, no sources.
// TODO | replace mock generic answer with dedicated generic LLM endpoint.
// The shape already matches a future async endpoint so the page does not change.
export async function getGenericLLMComparisonAnswer(
  question: string,
): Promise<GenericComparisonResult> {
  // Small artificial latency so the loading state is exercised realistically.
  await new Promise((resolve) => setTimeout(resolve, 550));

  const trimmed = question.trim().replace(/\s+/g, " ");
  const answer = [
    `In general, ${lowerFirst(trimmed) || "this"} depends on common UI conventions and best practices.`,
    "A typical approach is to follow widely-used design patterns: keep the interface consistent, prioritize clarity, and choose components that most products use for similar situations.",
    "Without knowledge of your specific design system, the safest recommendation is to apply standard guidelines and adjust based on your own documentation and team conventions.",
  ].join("\n\n");

  return { answer, isMock: true };
}

function lowerFirst(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
}
