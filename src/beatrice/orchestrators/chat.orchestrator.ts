import type { Locale } from "../../i18n/translations";
import type { ChatMessage, CommandMode, HistoryEntry, ProfileId, StreamChunk } from "../types/beatrice";
import { detectCommandMode } from "../domain/governance";
import { resolvePersonaForRequest } from "../domain/persona";

const ORACLE_API = import.meta.env.VITE_ORACLE_API_URL ?? "/api/chat";

export function createUserMessage(content: string): ChatMessage {
  return {
    id: `user-${Date.now()}`,
    role: "user",
    content,
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

export function requestProfile(profileId: ProfileId, commandMode?: CommandMode): string {
  return resolvePersonaForRequest(profileId, commandMode);
}

export function offlineMessage(locale: Locale): string {
  return locale === "en-US"
    ? "⚠️ Beatrice is offline. Start the API server:\n\nGROQ_API_KEY=gsk_... uvicorn server:app --port 3333"
    : "⚠️ Beatrice está offline. Inicie o servidor da API:\n\nGROQ_API_KEY=gsk_... uvicorn server:app --port 3333";
}

export async function submitChatRequest(history: HistoryEntry[], profile: string): Promise<Response> {
  return fetch(ORACLE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: history, profile }),
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
