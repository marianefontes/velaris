import { Check, Loader2 } from "lucide-react";
import type { ChatMessage as ChatMessageModel } from "../../types/beatrice";

// Human-readable labels for the intent tags emitted by the backend router
// (prompts/intent_router.py). Falls back to a prettified form for any new intent.
const INTENT_LABELS: Record<string, string> = {
  component_guidance: "Component guidance",
  pattern_guidance: "Pattern guidance",
  token_lookup: "Token lookup",
  design_decision: "Design decision",
  when_not_to_use: "When not to use",
  xai_explanation: "XAI explanation",
  comparison_query: "Comparison",
  new_product_scaffolding: "Product scaffolding",
  general: "General reasoning",
};

function labelForIntent(intent: string): string {
  return (
    INTENT_LABELS[intent] ??
    intent.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

// Auditable reasoning header for a normal assistant answer. Surfaces the
// intent + retrieval + cognitive-skill metadata that already streams from the
// backend (see useChatStream → appendStreamingMetadata) but was previously
// invisible on the standard answer path. Command and catalog modes render their
// own rich headers, so this complements the common case only.
//
// Honesty contract (RESPONSE_QUALITY_GUIDE.md): shows only measured facts —
// intent, source count, skill count, streaming state. No fabricated confidence.
export function ReasoningBanner({ message }: { message: ChatMessageModel }) {
  const intent = message.intent;
  const sourceCount = message.sources?.length ?? 0;
  const skillCount = message.cognitiveSkills?.length ?? 0;
  const streaming = Boolean(message.isStreaming);

  // Nothing to disclose yet — the bubble's loading state covers the wait.
  if (!intent && sourceCount === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-white/10 bg-surface-container/60 px-3 py-1.5 text-[10px] text-on-surface-variant"
    >
      {streaming ? (
        <Loader2 className="h-3 w-3 text-primary motion-safe:animate-spin" aria-hidden />
      ) : (
        <Check className="h-3 w-3 text-primary" aria-hidden />
      )}
      <span className="font-bold uppercase tracking-[0.14em] text-primary/80">
        {streaming ? "Raciocinando" : "Raciocínio"}
      </span>

      {intent && (
        <span className="flex items-center gap-1">
          <span className="opacity-50">intent</span>
          <span className="font-semibold text-on-surface">{labelForIntent(intent)}</span>
        </span>
      )}

      {sourceCount > 0 && (
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-primary/60" aria-hidden />
          {sourceCount} {sourceCount === 1 ? "fonte" : "fontes"}
        </span>
      )}

      {skillCount > 0 && (
        <span className="flex items-center gap-1">
          <span className="h-1 w-1 rounded-full bg-primary/60" aria-hidden />
          {skillCount} {skillCount === 1 ? "competência" : "competências"}
        </span>
      )}
    </div>
  );
}
