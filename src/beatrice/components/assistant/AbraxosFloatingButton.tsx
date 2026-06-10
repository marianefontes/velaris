import { Sparkles, X } from "lucide-react";
import { forwardRef } from "react";
import { useI18n } from "../../../i18n/I18nProvider";
import { useAbraxosAssistant } from "../../hooks/useAbraxosAssistant";

export const AbraxosFloatingButton = forwardRef<HTMLButtonElement>(function AbraxosFloatingButton(_props, ref) {
  const { t } = useI18n();
  const { isOpen, isVisible, toggleAbraxos } = useAbraxosAssistant();

  if (!isVisible) return null;

  const label = isOpen ? t("assistant.collapse") : t("assistant.open");

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-expanded={isOpen}
      aria-controls="abraxos-mini-chat"
      onClick={toggleAbraxos}
      className="focus-ring group fixed bottom-4 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-primary-dim/50 bg-primary text-on-primary shadow-[0_12px_36px_rgba(222,204,253,0.35)] transition-[transform,box-shadow,background-color] duration-300 hover:bg-primary-dim hover:shadow-[0_16px_44px_rgba(222,204,253,0.42)] active:scale-95 sm:bottom-6 sm:right-6 sm:h-[3.75rem] sm:w-[3.75rem]"
    >
      {isOpen ? (
        <X aria-hidden="true" className="relative h-5 w-5" />
      ) : (
        <Sparkles aria-hidden="true" className="relative h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
      )}
    </button>
  );
});
