import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, ChevronLeft, GitCompare, Layers3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../../../i18n/I18nProvider";
import { toDisplayTitle } from "../../domain/displayTitle";
import { useAuditTrail } from "../../hooks/useAuditTrail";
import { usePanelFocusTrap } from "../../hooks/usePanelFocusTrap";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceComposer,
  useWorkspaceMessages,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";

function ContextSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-white/[0.06] py-4 last:border-b-0">
      <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function ContextRow({ label, value, dotClass }: { label: string; value: string; dotClass?: string }) {
  return (
    <div className="flex items-start gap-2.5">
      {dotClass ? (
        <span aria-hidden="true" className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
      ) : null}
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">{label}</p>
        <p className="text-[12px] leading-5 text-slate-300">{value}</p>
      </div>
    </div>
  );
}

function ContextPanelBody({ onClose }: { onClose?: () => void }) {
  const { locale, t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { submitPrompt } = useWorkspaceComposer();
  const { messages } = useWorkspaceMessages();
  const { content } = useWorkspacePreferences();
  const { open: openAuditTrail } = useAuditTrail();
  const profile = strategy.operationalProfile;

  const discussedTopics = useMemo(
    () =>
      messages
        .filter((message) => message.role === "user" && !message.id.startsWith("assistant-persona-"))
        .map((message) => message.content.replace(/\s+/g, " ").trim())
        .filter(Boolean)
        .slice(-5)
        .reverse(),
    [messages],
  );

  const analyzedComponents = useMemo(() => {
    const names = new Set<string>();
    for (const message of messages) {
      for (const source of message.sources ?? []) {
        if (source.title) names.add(source.title);
      }
    }
    return [...names].slice(0, 6);
  }, [messages]);

  const sourceLinks = content.quickLinks.slice(0, 4);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-white/[0.06] px-4 py-3.5">
        <p className="text-[12px] font-semibold text-slate-200">{t("chat.contextPanel")}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-500">{profile.specialty}</p>
      </header>

      <div className="beatrice-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4">
        <ContextSection title={t("chat.activeContext")}>
          <div className="space-y-3.5">
            <ContextRow label={t("chat.perspective")} value={strategy.sessionTitle} dotClass={strategy.theme.signal} />
            <ContextRow label={t("chat.workspace.domain")} value={profile.specialty} dotClass="bg-primary/60" />
            <ContextRow label={t("chat.mainProblem")} value={profile.primaryPain} dotClass="bg-rose-400/70" />
          </div>
        </ContextSection>

        <ContextSection title={t("chat.sessionMemory")}>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                {t("chat.recentTopics")}
              </p>
              {discussedTopics.length > 0 ? (
                <ul className="space-y-0.5">
                  {discussedTopics.map((topic) => (
                    <li key={topic}>
                      <button
                        type="button"
                        onClick={() => void submitPrompt(topic)}
                        className="focus-ring w-full rounded-lg px-2 py-1.5 text-left text-[12px] leading-5 text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-primary"
                      >
                        {toDisplayTitle(topic, locale)}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] leading-5 text-slate-500">{t("chat.noSessionTopics")}</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                {t("chat.analyzedComponents")}
              </p>
              {analyzedComponents.length > 0 ? (
                <ul className="space-y-1">
                  {analyzedComponents.map((name) => (
                    <li key={name} className="text-[12px] text-slate-400">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[12px] leading-5 text-slate-500">{t("chat.noComponentsAnalyzed")}</p>
              )}
            </div>
          </div>
        </ContextSection>

        <ContextSection title={t("chat.sources")}>
          <ul className="space-y-0.5">
            {sourceLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="focus-ring flex min-h-11 w-full items-center gap-2 rounded-lg px-2 text-left text-[12px] text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-primary"
                  >
                    <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </ContextSection>

        <ContextSection title={t("chat.quickActions")}>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={openAuditTrail}
              className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-2 text-left text-[12px] text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-200"
            >
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              {t("chat.newTrail")}
            </button>
            <Link
              to="/components"
              className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-200"
            >
              <BookOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              {t("chat.openDocs")}
            </Link>
            <button
              type="button"
              onClick={() => void submitPrompt(content.suggestedPrompts[0]?.body ?? t("chat.compareComponents"))}
              className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-2 text-left text-[12px] text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-200"
            >
              <GitCompare aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              {t("chat.compareComponents")}
            </button>
            <Link
              to="/evaluation?focus=baseline"
              className="focus-ring flex min-h-11 items-center gap-2 rounded-lg px-2 text-[12px] text-slate-400 transition-colors hover:bg-white/[0.03] hover:text-slate-200"
            >
              <Layers3 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              {t("chat.quickLinks")}
            </Link>
          </div>
        </ContextSection>
      </div>

      {onClose ? (
        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            onClick={onClose}
            className="focus-ring flex w-full min-h-11 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] text-[11px] font-medium text-slate-400 transition-colors hover:border-white/12 hover:text-slate-200"
          >
            <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" />
            {t("chat.workspace.collapsePanel")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function ContextPanelRail({
  onClose,
}: {
  onClose: () => void;
}) {
  const { t } = useI18n();

  return (
    <aside
      aria-label={t("chat.contextPanel")}
      className="beatrice-rail hidden min-h-0 flex-col overflow-hidden border-l border-white/[0.06] bg-surface-container-low/20 lg:flex"
    >
      <ContextPanelBody onClose={onClose} />
    </aside>
  );
}

export function ContextPanelDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useI18n();
  const panelRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  usePanelFocusTrap(isOpen, panelRef, onClose);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="beatrice-overlay-scrim fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[6px] lg:hidden"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("chat.contextPanel")}
            tabIndex={-1}
            className="beatrice-rail flex h-full w-full max-w-[min(20rem,100vw)] flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(145deg,rgba(31,31,34,0.96),rgba(10,10,12,0.98))] pb-[env(safe-area-inset-bottom,0px)] shadow-[0_0_90px_rgba(222,204,253,0.14)] outline-none backdrop-blur-3xl sm:max-w-[22rem] sm:rounded-l-[22px]"
            initial={shouldReduceMotion ? false : { x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 32, stiffness: 280 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <ContextPanelBody onClose={onClose} />
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
