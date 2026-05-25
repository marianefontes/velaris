import type { ChatMessage, SourceChip } from "../types/beatrice";

export function patchMessage(messages: ChatMessage[], id: string, patch: Partial<ChatMessage>): ChatMessage[] {
  return messages.map((message) => (message.id === id ? { ...message, ...patch } : message));
}

export function appendStreamingMetadata(
  messages: ChatMessage[],
  id: string,
  metadata: { sources?: SourceChip[]; intent?: string; catalogMode?: boolean },
): ChatMessage[] {
  return patchMessage(messages, id, metadata);
}

