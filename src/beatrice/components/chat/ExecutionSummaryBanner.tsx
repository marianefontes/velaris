import { Check, Loader2 } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import type { ChatMessage as ChatMessageModel } from "../../types/beatrice";

function titleCase(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function ExecutionSummaryBanner({ message }: { message: ChatMessageModel }) {
  const { t } = useI18n();
  const metadata = message.auditMetadata;
  const workflow = metadata?.workflow;
  const userIntent = metadata?.user_intent;
  const tools = metadata?.tools_used ?? [];
  const evidenceTier = metadata?.evidence_tier;
  const displayIntent = userIntent === "greeting"
    || userIntent === "small_talk"
    || userIntent === "help_request"
    ? userIntent
    : workflow;
  const streaming = Boolean(message.isStreaming);

  if (!displayIntent && tools.length === 0 && !evidenceTier) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mb-2 flex min-h-10 flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-white/[0.07] bg-white/[0.018] px-3 py-2 text-[11px] text-slate-400 motion-safe:transition-[border-color,box-shadow] motion-safe:duration-500 ${
        streaming ? "" : "execution-banner-settled"
      }`}
    >
      <span key={streaming ? "running" : "done"} className="motion-safe:animate-fade-in">
        {streaming ? (
          <Loader2 className="h-3 w-3 text-primary motion-safe:animate-spin" aria-hidden />
        ) : (
          <Check className="h-3 w-3 text-primary" aria-hidden />
        )}
      </span>
      <span className="font-semibold text-primary/80">
        {t(streaming ? "beatrice.chat.running" : "beatrice.chat.execution")}
      </span>
      {displayIntent && <span className="font-medium text-slate-200">{titleCase(displayIntent)}</span>}
      {tools.length > 0 && (
        <span>
          {tools.length} {t(tools.length === 1 ? "beatrice.chat.tool" : "beatrice.chat.tools")}
        </span>
      )}
      {evidenceTier && evidenceTier !== "not_required" && (
        <span className="font-medium text-primary/80">
          {t("beatrice.chat.evidence")}: {evidenceTier}
        </span>
      )}
      {metadata?.decision_status && (
        <span className="font-medium text-slate-300">
          {metadata.decision_status}
        </span>
      )}
    </div>
  );
}
