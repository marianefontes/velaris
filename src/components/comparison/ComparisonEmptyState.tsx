import { ArrowUp, Scale } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

// ||| Shown before the first question. Sets the expectation that the value is
// in the *difference* between the two answers, not in either answer alone.

export function ComparisonEmptyState() {
  const { t } = useI18n();
  return (
    <div className="mx-auto mt-10 max-w-xl text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-container/60 text-primary shadow-cognitive-sm">
        <Scale className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="font-serif text-lg text-white">{t("pages.comparison.empty.title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{t("pages.comparison.empty.body")}</p>
      <p className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-slate-600">
        <ArrowUp className="h-3.5 w-3.5" aria-hidden />
        {t("pages.comparison.empty.hint")}
      </p>
    </div>
  );
}
