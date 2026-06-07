import { ShieldCheck, Sparkles } from "lucide-react";
import { MarkdownRenderer } from "../../beatrice/components/primitives";
import { useI18n } from "../../i18n/I18nProvider";
import type { BeatriceComparisonResult, GenericComparisonResult } from "../../types/comparison";

// ||| One side of the comparison. The Beatrice variant exposes its XAI surface
// (intent, sources, confidence); the generic variant deliberately shows none of
// it, making the architectural difference visible rather than asserted.

function PanelLoading() {
  return (
    <div className="space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-full animate-pulse rounded bg-white/10" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-white/10" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-white/10" />
    </div>
  );
}

export function BeatriceAnswerPanel({
  result,
  isLoading,
  streamingText,
}: {
  result: BeatriceComparisonResult | null;
  isLoading: boolean;
  streamingText: string;
}) {
  const { t } = useI18n();
  const text = result?.answer || streamingText;

  return (
    <article className="content-card flex h-full flex-col border-primary/15">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signature text-on-primary">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Beatrice</p>
            <p className="text-[10px] uppercase tracking-widest text-primary/70">{t("pages.comparison.beatrice.badge")}</p>
          </div>
        </div>
        {result?.intent && (
          <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
            {t("pages.comparison.beatrice.intentPrefix")} {result.intent}
          </span>
        )}
      </header>

      <div className="flex-1 text-sm leading-relaxed text-slate-300">
        {isLoading && !text ? (
          <PanelLoading />
        ) : text ? (
          <MarkdownRenderer text={text} />
        ) : null}
      </div>

      {/* ||| XAI footer — sources + calibrated confidence, with graceful fallback. */}
      {result && (
        <footer className="mt-4 border-t border-white/[0.06] pt-3">
          {result.confidence !== null && (
            <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-300/80" aria-hidden />
              {t("pages.comparison.beatrice.confidenceLabel")}
              <span className="font-semibold text-emerald-300/90">{result.confidence}%</span>
              <span className="text-slate-600">· {t("pages.comparison.beatrice.confidenceNote")}</span>
            </div>
          )}
          {result.sources.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {result.sources.map((source, index) => (
                <span
                  key={`${source.title}-${index}`}
                  title={`${source.source} · ${Math.round(source.similarity * 100)}% similarity`}
                  className="flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-70" />
                  {source.title || source.source}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">{t("pages.comparison.beatrice.noSources")}</p>
          )}
        </footer>
      )}
    </article>
  );
}

export function GenericAnswerPanel({
  result,
  isLoading,
}: {
  result: GenericComparisonResult | null;
  isLoading: boolean;
}) {
  const { t } = useI18n();
  return (
    <article className="content-card flex h-full flex-col border-white/10">
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-surface-container text-slate-400">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-bold text-white">{t("pages.comparison.generic.name")}</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              {t("pages.comparison.generic.sub")}
            </p>
          </div>
        </div>
        {result?.isMock && (
          <span className="rounded-full border border-white/10 bg-surface-container/60 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            {t("pages.comparison.generic.simulated")}
          </span>
        )}
      </header>

      <div className="flex-1 text-sm leading-relaxed text-slate-400">
        {isLoading && !result ? (
          <PanelLoading />
        ) : result ? (
          <p className="whitespace-pre-line">{result.answer}</p>
        ) : null}
      </div>

      <footer className="mt-4 border-t border-white/[0.06] pt-3">
        <p className="text-[11px] text-slate-600">{t("pages.comparison.generic.footer")}</p>
      </footer>
    </article>
  );
}
