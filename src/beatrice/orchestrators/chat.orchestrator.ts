import type { Locale } from "../../i18n/translations";
import type { AbraxosSurfaceContext } from "../domain/assistant/types";
import type { BeatriceSettings, ChatMessage, CommandMode, HistoryEntry, ProfileId, StreamChunk } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { readCalibration } from "../domain/perspective/calibration";
import { getChatApiUrl } from "../../services/apiConfig";
import { checkApiHealth } from "../services/retrieval.service";

// Endpoint resolution order:
//   1. VITE_ORACLE_API_URL  - explicit full chat endpoint override.
//   2. VITE_API_BASE_URL    - shared backend host.
//   3. "/api/chat"          - same-origin dev proxy fallback.
// This keeps the chat aligned with every other service (apiConfig.ts) so a
// single backend variable in production wires the whole frontend at once.
const UI_PROMPT_LEAK_MARKERS = [
  "Pergunta para o Abraxos sobre esta seção",
  "Pergunta para o Abraxos sobre esta secção",
  "Ask Abraxos about this section",
  "Pergunte algo sobre esta seção",
  "Pergunte algo sobre esta secção",
  "Ask something about this section",
  "Pergunte algo sobre esta seção...",
  "Pergunte algo sobre esta secção...",
];

export function containsUiPromptLeak(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;
  return UI_PROMPT_LEAK_MARKERS.some(
    (marker) => trimmed === marker || trimmed.includes(marker),
  );
}

export function sanitizeUserPrompt(content: string): string {
  const trimmed = content.trim();
  if (!trimmed || containsUiPromptLeak(trimmed)) {
    return "";
  }
  return trimmed;
}

export function sanitizeAssistantContent(content: string): string {
  if (!content.trim() || !containsUiPromptLeak(content)) {
    return content;
  }
  return content
    .split("\n")
    .filter((line) => !containsUiPromptLeak(line))
    .join("\n")
    .trim();
}

export function createUserMessage(content: string): ChatMessage {
  return {
    id: `user-${Date.now()}`,
    role: "user",
    content: sanitizeUserPrompt(content),
  };
}

export function createStreamingAssistantMessage(commandMode?: CommandMode): ChatMessage {
  return {
    id: `assistant-${Date.now()}`,
    role: "assistant",
    content: "",
    isStreaming: true,
    commandMode,
  };
}

export function commandModeForPrompt(prompt: string): CommandMode | undefined {
  return detectCommandMode(prompt) ?? undefined;
}

export function offlineMessage(locale: Locale): string {
  // In production the visitor cannot (and must not) start a local server, so we
  // show a calm, human message. The technical hint stays for local development.
  if (import.meta.env.DEV) {
    return locale === "en-US"
      ? "Abraxos is offline. Start the backend with npm start in the project root, then reload this page."
      : "Abraxos está offline. Inicie o backend com npm start na raiz do projeto e recarregue a página.";
  }
  return locale === "en-US"
    ? "Abraxos is temporarily unavailable. Please try again in a few moments."
    : "Abraxos está temporariamente indisponível. Tente novamente em instantes.";
}

export function technicalFailureMessage(locale: Locale): string {
  return locale === "en-US"
    ? "Abraxos is online, but this response could not be completed. Please try again."
    : "O Abraxos está online, mas não foi possível concluir esta resposta. Tente novamente.";
}

export async function resolveChatFailure(
  locale: Locale,
): Promise<Pick<ChatMessage, "content" | "errorKind">> {
  const health = await checkApiHealth();
  return health.healthy
    ? {
        content: technicalFailureMessage(locale),
        errorKind: "technical",
      }
    : {
        content: offlineMessage(locale),
        errorKind: "offline",
      };
}

export async function submitChatRequest(
  history: HistoryEntry[],
  profile: ProfileId,
  commandMode: CommandMode | undefined,
  settings: BeatriceSettings,
  sessionId: string,
  projectId = "default",
  surfaceContext?: AbraxosSurfaceContext | null,
): Promise<Response> {
  const calibration = readCalibration(profile);
  return fetch(getChatApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: history,
      profile,
      command_mode: commandMode,
      session_id: sessionId,
      project_id: projectId,
      preferred_detail_level: settings.verbosity,
      ...(calibration ? { calibration } : {}),
      ...(surfaceContext ? { surface_context: surfaceContext } : {}),
    }),
  });
}

export async function* parseEventStream(response: Response): AsyncGenerator<StreamChunk, void, unknown> {
  if (!response.ok || !response.body) throw new Error("no_server");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") return;

      try {
        yield JSON.parse(payload) as StreamChunk;
      } catch {
        continue;
      }
    }
  }
}
