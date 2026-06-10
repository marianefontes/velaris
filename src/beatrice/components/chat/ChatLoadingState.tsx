import { useI18n } from "../../../i18n/I18nProvider";

export function ChatLoadingState() {
  const { t } = useI18n();

  return (
    <div role="status" aria-live="polite" className="flex min-h-8 items-center gap-2 py-1">
      <span className="sr-only">{t("chat.responding")}</span>
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-primary/80 motion-safe:animate-dot-breathe"
          style={{ animationDelay: `${index * 160}ms` }}
        />
      ))}
    </div>
  );
}
