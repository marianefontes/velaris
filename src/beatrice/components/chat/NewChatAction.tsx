import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageSquarePlus, X } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePanelFocusTrap } from "../../hooks/usePanelFocusTrap";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspaceHistory,
} from "../../providers/WorkspaceProvider";

export function NewChatAction({
  onAfterStart,
  variant = "toolbar",
}: {
  onAfterStart?: () => void;
  variant?: "toolbar" | "panel" | "primary";
}) {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { isLoading } = useWorkspaceComposer();
  const { activeConversation, startNewConversation } = useWorkspaceHistory();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const dialogRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  usePanelFocusTrap(isConfirmOpen, dialogRef, () => setIsConfirmOpen(false));

  const hasConversation = (activeConversation?.history.length ?? 0) > 0;
  const startFreshConversation = () => {
    startNewConversation();
    setIsConfirmOpen(false);
    onAfterStart?.();
  };
  const requestNewConversation = () => {
    if (isLoading) return;
    if (hasConversation) {
      setIsConfirmOpen(true);
      return;
    }
    startFreshConversation();
  };

  const dialog = (
    <AnimatePresence>
      {isConfirmOpen && (
        <motion.div
          className="fixed inset-0 z-[60] grid place-items-center bg-black/65 px-4 backdrop-blur-[6px]"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.18, ease: "easeOut" }}
          onMouseDown={() => setIsConfirmOpen(false)}
        >
          <motion.section
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="new-chat-dialog-title"
            aria-describedby="new-chat-dialog-description"
            tabIndex={-1}
            className={`relative w-full max-w-[28rem] rounded-[22px] border p-5 shadow-[0_28px_90px_rgba(0,0,0,0.52)] outline-none sm:p-6 ${strategy.theme.panel}`}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsConfirmOpen(false)}
              aria-label={t("chat.closeNewChatDialog")}
              className="focus-ring absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-white/[0.05] hover:text-white"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>

            <div className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}>
              <MessageSquarePlus aria-hidden="true" className={`h-5 w-5 ${strategy.theme.accentText}`} />
            </div>
            <h2 id="new-chat-dialog-title" className="pr-12 text-lg font-bold tracking-tight text-white">
              {t("chat.newChatConfirmTitle")}
            </h2>
            <p id="new-chat-dialog-description" className="mt-2 text-sm leading-6 text-slate-400">
              {t("chat.newChatConfirmMessage")}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                className="focus-ring min-h-11 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 text-xs font-semibold text-slate-300 transition-colors hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
              >
                {t("chat.cancelNewChat")}
              </button>
              <button
                type="button"
                onClick={startFreshConversation}
                className={`focus-ring min-h-11 rounded-xl px-4 text-xs font-bold text-background transition-[opacity,transform] duration-200 hover:opacity-90 active:translate-y-px ${strategy.theme.signal}`}
              >
                {t("chat.startNewChat")}
              </button>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        onClick={requestNewConversation}
        disabled={isLoading}
        aria-disabled={isLoading}
        aria-label={t("chat.newChat")}
        title={isLoading ? t("chat.newChatDisabled") : t("chat.newChat")}
        className={
          variant === "panel"
            ? `focus-ring flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold text-background transition-[opacity,transform] duration-200 hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${strategy.theme.signal}`
            : variant === "primary"
              ? `focus-ring flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-[11px] font-semibold text-background transition-[opacity,transform,background-color] duration-200 ease-luxe hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:min-w-10 sm:px-3 ${strategy.theme.signal}`
              : `focus-ring flex h-11 min-w-11 items-center justify-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-[background-color,border-color,color,opacity] duration-200 ease-luxe hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40 ${strategy.theme.accentBorder} ${strategy.theme.accentBg} ${strategy.theme.accentText}`
        }
      >
        <MessageSquarePlus aria-hidden="true" className="h-4 w-4" />
        <span className={variant === "toolbar" || variant === "primary" ? "hidden lg:inline" : undefined}>
          {variant === "toolbar" ? t("chat.newChatShort") : t("chat.newChat")}
        </span>
      </button>
      {typeof document !== "undefined" ? createPortal(dialog, document.body) : null}
    </>
  );
}
