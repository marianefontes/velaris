import type { ReactNode } from "react";
import { useI18n } from "../../i18n/I18nProvider";
import { PageShell } from "../ui/VisualPrimitives";

export function BeatriceVisualFrame({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <PageShell width="wide" className="beatrice-page-frame flex flex-col pb-4 pt-3 sm:pb-6 sm:pt-4">
      <header className="sr-only">
        <h1>{t("chat.title")}</h1>
        <p>{t("chat.description")}</p>
        <p>{t("chat.online")}</p>
      </header>
      {children}
    </PageShell>
  );
}
