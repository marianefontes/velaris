import { ArrowUp } from "lucide-react";
import { useI18n } from "../../i18n/I18nProvider";

// ||| Central question input with quick-example chips. The submit button is
// disabled while a comparison is running to prevent overlapping requests.

const EXAMPLE_KEYS = ["0", "1", "2", "3"] as const;

export function ComparisonInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: {
  value: string;
  isLoading: boolean;
  onChange: (next: string) => void;
  onSubmit: (question?: string) => void;
}) {
  const { t } = useI18n();
  const canSubmit = value.trim().length > 0 && !isLoading;
  const examples = EXAMPLE_KEYS.map((key) => t(`pages.comparison.examples.${key}`));

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="glass-panel flex items-end gap-3 rounded-2xl px-4 py-3">
        <textarea
          rows={1}
          value={value}
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              if (canSubmit) onSubmit();
            }
          }}
          placeholder={t("pages.comparison.input.placeholder")}
          className="max-h-[160px] flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => onSubmit()}
          aria-label={t("pages.comparison.input.aria")}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-signature text-on-primary transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <ArrowUp className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1.5">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            disabled={isLoading}
            onClick={() => onSubmit(example)}
            className="rounded-full border border-white/10 bg-surface-container/50 px-3 py-1 text-[11px] text-slate-400 transition-colors hover:border-primary/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
