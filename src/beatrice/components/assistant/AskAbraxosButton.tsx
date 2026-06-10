import { Sparkles } from "lucide-react";
import type { AbraxosOpenContext } from "../../domain/assistant/types";
import { useAbraxosAssistant } from "../../hooks/useAbraxosAssistant";
import { useI18n } from "../../../i18n/I18nProvider";

export function AskAbraxosButton({
  context,
  variant = "pill",
  className = "",
}: {
  context: AbraxosOpenContext;
  variant?: "pill" | "icon";
  className?: string;
}) {
  const { t } = useI18n();
  const { openAbraxos } = useAbraxosAssistant();
  const label = t("assistant.askAboutItem");

  if (variant === "icon") {
    return (
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => openAbraxos(context)}
        className={`focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-primary transition-colors hover:border-primary/30 hover:bg-primary/[0.08] ${className}`}
      >
        <Sparkles aria-hidden="true" className="h-4 w-4" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => openAbraxos(context)}
      className={`focus-ring inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-[11px] font-medium text-primary transition-colors hover:border-primary/35 hover:bg-primary/[0.1] ${className}`}
    >
      <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
