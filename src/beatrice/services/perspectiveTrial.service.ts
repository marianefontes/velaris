// ||| Phase R · Live perspective comparison
// Standalone chat client for the /perspectives trial-query input.
// Fires a single /api/chat call with a specific lens + calibration and
// streams the response into a caller-provided onDelta callback.
//
// This is separate from useChatStream because:
// - It does not maintain conversation history
// - It does not write to the global workspace state
// - It can be invoked twice in parallel (active lens vs comparison lens)
// - It does not need the BeatriceSettings response-preferences layer

import { readCalibration } from "../domain/perspective/calibration";
import type { ProfileId, ResponseAuditMetadata, StreamChunk } from "../types/beatrice";

const ORACLE_API = import.meta.env.VITE_ORACLE_API_URL ?? "/api/chat";

export interface TrialChatOptions {
  query: string;
  profileId: ProfileId;
  signal?: AbortSignal;
  onDelta?: (textSoFar: string) => void;
  onSources?: (sources: StreamChunk["sources"], intent: StreamChunk["intent"]) => void;
  onAuditMetadata?: (auditMetadata: ResponseAuditMetadata) => void;
}

export interface TrialChatResult {
  text: string;
  sources?: StreamChunk["sources"];
  intent?: StreamChunk["intent"];
  auditMetadata?: ResponseAuditMetadata;
}

/** Run one streaming chat request for a perspective trial. Throws on network / API failure. */
export async function runPerspectiveTrial(options: TrialChatOptions): Promise<TrialChatResult> {
  const { query, profileId, signal, onDelta, onSources, onAuditMetadata } = options;
  const calibration = readCalibration(profileId);

  const response = await fetch(ORACLE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: query }],
      profile: profileId,
      command_mode: null,
      ...(calibration ? { calibration } : {}),
    }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`backend_error:${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  const result: TrialChatResult = { text: "" };

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice(6).trim();
      if (payload === "[DONE]") {
        result.text = text;
        return result;
      }

      let parsed: StreamChunk;
      try {
        parsed = JSON.parse(payload) as StreamChunk;
      } catch {
        continue;
      }

      if (parsed.error) {
        throw new Error(`backend_error:${parsed.error}`);
      }
      if (parsed.sources !== undefined || parsed.intent !== undefined) {
        result.sources = parsed.sources;
        result.intent = parsed.intent;
        onSources?.(parsed.sources, parsed.intent);
      }
      if (parsed.audit_metadata !== undefined) {
        result.auditMetadata = parsed.audit_metadata;
        onAuditMetadata?.(parsed.audit_metadata);
      }
      if (parsed.delta) {
        text += parsed.delta;
        onDelta?.(text);
      }
    }
  }

  result.text = text;
  return result;
}
