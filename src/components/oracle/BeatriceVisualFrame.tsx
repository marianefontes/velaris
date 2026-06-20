import type { ReactNode } from "react";
import { useI18n } from "../../i18n/I18nProvider";

export function BeatriceVisualFrame({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="beatrice-page-frame flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="sr-only">
        <h1>{t("chat.title")}</h1>
        <p>{t("chat.description")}</p>
        <p>{t("chat.online")}</p>
      </header>
      {children}
    </div>
  );
}
