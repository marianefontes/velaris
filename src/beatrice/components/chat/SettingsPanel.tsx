import { useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Database, Download, Eye, RotateCcw, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePanelFocusTrap } from "../../hooks/usePanelFocusTrap";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import {
  useWorkspaceHistory,
  useWorkspacePreferences,
} from "../../providers/WorkspaceProvider";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ToggleControlProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

function ToggleControl({ checked, label, onChange }: ToggleControlProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-ring flex min-h-11 w-full items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3 text-left transition-colors hover:border-primary/20 hover:bg-white/[0.055]"
    >
      <span className="text-xs font-semibold text-slate-200">{label}</span>
      <span className={`flex h-6 w-11 items-center rounded-full border p-0.5 transition-colors ${
        checked ? "border-primary/30 bg-primary/25" : "border-white/10 bg-black/25"
      }`}>
        <span className={`h-[18px] w-[18px] rounded-full transition-transform ${
          checked ? "translate-x-[18px] bg-primary" : "translate-x-0 bg-slate-500"
        }`} />
      </span>
    </button>
  );
}

interface SegmentGroupProps<T extends string> {
  label: string;
  options: Array<{ label: string; value: T }>;
  value: T;
  onChange: (value: T) => void;
}

function SegmentGroup<T extends string>({ label, options, value, onChange }: SegmentGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="grid rounded-xl border border-white/8 bg-black/20 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={`focus-ring min-h-11 rounded-lg px-2 py-2 text-[11px] font-bold transition-colors ${
              option.value === value ? "bg-primary/20 text-primary" : "text-slate-500 hover:text-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { t } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const { clearConversations, exportConversations } = useWorkspaceHistory();
  const { resetSettings, settings, updateSettings } = useWorkspacePreferences();
  const panelRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  usePanelFocusTrap(isOpen, panelRef, onClose);

  const labels = {
    title: t("beatrice.settings.title"),
    subtitle: t("beatrice.settings.subtitle"),
    close: t("beatrice.settings.close"),
    chat: t("beatrice.settings.chat"),
    appearance: t("beatrice.settings.appearance"),
    ai: t("beatrice.settings.ai"),
    data: t("beatrice.settings.data"),
    streaming: t("beatrice.settings.streaming"),
    autoScroll: t("beatrice.settings.autoScroll"),
    sources: t("beatrice.settings.sources"),
    evidenceSimilarity: t("beatrice.settings.evidenceSimilarity"),
    density: t("beatrice.settings.density"),
    blur: t("beatrice.settings.blur"),
    verbosity: t("beatrice.settings.verbosity"),
    xaiDepth: t("beatrice.settings.xaiDepth"),
    clearHistory: t("beatrice.settings.clearHistory"),
    exportJson: t("beatrice.settings.exportJson"),
    resetPrefs: t("beatrice.settings.resetPrefs"),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="beatrice-overlay-scrim fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[6px]"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="beatrice-settings-title"
            tabIndex={-1}
            className="flex h-full w-full max-w-[30rem] flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(145deg,rgba(31,31,34,0.96),rgba(10,10,12,0.98))] shadow-[0_0_90px_rgba(222,204,253,0.14)] outline-none backdrop-blur-3xl sm:rounded-l-[28px]"
            initial={shouldReduceMotion ? false : { x: 440 }}
            animate={{ x: 0 }}
            exit={{ x: 440 }}
            transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", damping: 32, stiffness: 280 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}>
                    <SlidersHorizontal aria-hidden="true" className={`h-5 w-5 ${strategy.theme.accentText}`} />
                  </div>
                  <div>
                    <h2 id="beatrice-settings-title" className="text-sm font-black text-white">
                      {labels.title}
                    </h2>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      {labels.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={labels.close}
                  className="focus-ring glass-panel flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-white"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="beatrice-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]">{labels.chat}</p>
                </div>
                <ToggleControl checked={settings.streaming} label={labels.streaming} onChange={(streaming) => updateSettings({ streaming })} />
                <ToggleControl checked={settings.autoScroll} label={labels.autoScroll} onChange={(autoScroll) => updateSettings({ autoScroll })} />
                <ToggleControl checked={settings.showSources} label={labels.sources} onChange={(showSources) => updateSettings({ showSources })} />
                <ToggleControl
                  checked={settings.showEvidenceSimilarity}
                  label={labels.evidenceSimilarity}
                  onChange={(showEvidenceSimilarity) => updateSettings({ showEvidenceSimilarity })}
                />
              </section>

              <section className="space-y-4 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]">{labels.appearance}</p>
                </div>
                <SegmentGroup
                  label={labels.density}
                  value={settings.density}
                  onChange={(density) => updateSettings({ density })}
                  options={[
                    { label: t("beatrice.settings.compact"), value: "compact" },
                    { label: t("beatrice.settings.comfortable"), value: "comfortable" },
                    { label: t("beatrice.settings.dense"), value: "dense" },
                  ]}
                />
                <SegmentGroup
                  label={labels.blur}
                  value={settings.blurIntensity}
                  onChange={(blurIntensity) => updateSettings({ blurIntensity })}
                  options={[
                    { label: t("beatrice.settings.low"), value: "low" },
                    { label: t("beatrice.settings.medium"), value: "medium" },
                    { label: t("beatrice.settings.high"), value: "high" },
                  ]}
                />
              </section>

              <section className="space-y-4 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]">{labels.ai}</p>
                </div>
                <SegmentGroup
                  label={labels.verbosity}
                  value={settings.verbosity}
                  onChange={(verbosity) => updateSettings({ verbosity })}
                  options={[
                    { label: t("beatrice.settings.concise"), value: "concise" },
                    { label: t("beatrice.settings.balanced"), value: "balanced" },
                    { label: t("beatrice.settings.detailed"), value: "detailed" },
                  ]}
                />
                <SegmentGroup
                  label={labels.xaiDepth}
                  value={settings.xaiDepth}
                  onChange={(xaiDepth) => updateSettings({ xaiDepth })}
                  options={[
                    { label: t("beatrice.settings.basic"), value: "basic" },
                    { label: t("beatrice.settings.standard"), value: "standard" },
                    { label: t("beatrice.settings.advanced"), value: "advanced" },
                  ]}
                />
              </section>

              <section className="space-y-3 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <Database className="h-4 w-4" />
                  <p className="text-[11px] font-black uppercase tracking-[0.16em]">{labels.data}</p>
                </div>
                <button
                  type="button"
                  onClick={exportConversations}
                  className="flex w-full items-center justify-between rounded-xl border border-primary/15 bg-primary/10 px-4 py-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <span>{labels.exportJson}</span>
                  <Download className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={clearConversations}
                  className="flex w-full items-center justify-between rounded-xl border border-red-400/15 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-200 transition-colors hover:bg-red-500/15"
                >
                  <span>{labels.clearHistory}</span>
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={resetSettings}
                  className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-primary/20 hover:text-white"
                >
                  <span>{labels.resetPrefs}</span>
                  <RotateCcw className="h-4 w-4" />
                </button>
              </section>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
