import { Sparkles } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";

export function ChatEmptyState() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-4 pt-8 text-center">
      <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-signature shadow-[0_0_48px_rgba(169,153,198,0.2)]">
        <Sparkles className="h-9 w-9 text-on-primary" />
      </div>
      <h2 className="text-2xl font-black text-white">{t("chat.title")}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{t("chat.description")}</p>
    </div>
  );
}

