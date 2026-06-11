import { useEffect, useState } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import type { TranslationKey } from "../../../i18n/translations";

const RETRIEVAL_PHASE_KEYS = [
  "chat.retrievalPhase1",
  "chat.retrievalPhase2",
  "chat.retrievalPhase3",
  "chat.retrievalPhase4",
] as const satisfies readonly TranslationKey[];

const PHASE_INTERVAL_MS = 2800;

export function ChatLoadingState() {
  const { t } = useI18n();
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhaseIndex((current) => (current + 1) % RETRIEVAL_PHASE_KEYS.length);
    }, PHASE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div role="status" aria-live="polite" className="flex min-h-8 flex-col gap-2 py-1 sm:flex-row sm:items-center sm:gap-3">
      <span className="sr-only">{t("chat.responding")}</span>
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <span
            key={index}
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-primary/80 motion-safe:animate-dot-breathe"
            style={{ animationDelay: `${index * 160}ms` }}
          />
        ))}
      </div>
      <p
        key={phaseIndex}
        aria-hidden="true"
        className="text-xs leading-5 text-slate-500 motion-safe:animate-fade-in"
      >
        {t(RETRIEVAL_PHASE_KEYS[phaseIndex])}
      </p>
    </div>
  );
}
