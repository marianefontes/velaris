import { afterEach, describe, expect, it, vi } from "vitest";
import {
  containsUiPromptLeak,
  createUserMessage,
  resolveChatFailure,
  sanitizeAssistantContent,
  sanitizeUserPrompt,
} from "./chat.orchestrator";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("ui prompt leak guards", () => {
  const leak = "Pergunta para o Abraxos sobre esta seção";

  it("rejects empty and label-only user prompts", () => {
    expect(sanitizeUserPrompt("")).toBe("");
    expect(sanitizeUserPrompt("   ")).toBe("");
    expect(sanitizeUserPrompt(leak)).toBe("");
    expect(sanitizeUserPrompt(`  ${leak}  `)).toBe("");
  });

  it("does not create user messages from assistant labels", () => {
    expect(createUserMessage(leak).content).toBe("");
  });

  it("strips leaked labels from assistant content", () => {
    const polluted = `${leak}\n\nUse Radio Button para poucas opções.`;
    expect(sanitizeAssistantContent(polluted)).toBe("Use Radio Button para poucas opções.");
    expect(containsUiPromptLeak(leak)).toBe(true);
    expect(containsUiPromptLeak("Use Radio Button para poucas opções.")).toBe(false);
  });
});

describe("chat failure fallback", () => {
  it("does not report offline when the API health endpoint is healthy", async () => {
    vi.stubEnv("VITE_ORACLE_API_URL", "");
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.spyOn(console, "debug").mockImplementation(() => undefined);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({
      status: "ok",
      corpus_chunks: 0,
      rag_active: false,
      embedder: "none",
    }), { status: 200 })));

    const fallback = await resolveChatFailure("pt-BR");

    expect(fallback.errorKind).toBe("technical");
    expect(fallback.content).toContain("está online");
    expect(fallback.content).not.toContain("está offline");
  });

  it("reports offline when the API health endpoint is unavailable", async () => {
    vi.stubEnv("VITE_ORACLE_API_URL", "");
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.spyOn(console, "debug").mockImplementation(() => undefined);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    const fallback = await resolveChatFailure("pt-BR");

    expect(fallback.errorKind).toBe("offline");
    expect(fallback.content).toContain("Abraxos está offline");
  });
});
