import { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, Download, Eye, RotateCcw, SlidersHorizontal, Sparkles, Trash2, X } from "lucide-react";
import { useI18n } from "../../../i18n/I18nProvider";
import { usePanelFocusTrap } from "../../hooks/usePanelFocusTrap";
import { usePersonaContext } from "../../hooks/usePersonaContext";
import { useWorkspace } from "../../providers/WorkspaceProvider";

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
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-3 text-left transition-colors hover:border-primary/20 hover:bg-white/[0.055]"
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
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="grid rounded-xl border border-white/8 bg-black/20 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={option.value === value}
            onClick={() => onChange(option.value)}
            className={`rounded-lg px-2 py-2 text-[10px] font-bold transition-colors ${
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
  const { locale } = useI18n();
  const { activePersonaContext: strategy } = usePersonaContext();
  const {
    clearConversations,
    exportConversations,
    resetSettings,
    settings,
    updateSettings,
  } = useWorkspace();
  const panelRef = useRef<HTMLElement>(null);
  usePanelFocusTrap(isOpen, panelRef, onClose);

  const labels = locale === "en-US"
    ? {
        title: "Beatrice Settings",
        subtitle: "Chat behavior and explainability",
        close: "Close settings",
        chat: "Chat",
        appearance: "Appearance",
        ai: "AI",
        data: "Data",
        streaming: "Streaming response",
        autoScroll: "Auto scroll",
        sources: "Show source chips",
        confidence: "Show confidence score",
        density: "Density",
        blur: "Blur intensity",
        verbosity: "Verbosity",
        xaiDepth: "XAI depth",
        clearHistory: "Clear history",
        exportJson: "Export conversations JSON",
        resetPrefs: "Reset preferences",
      }
    : {
        title: "Configurações da Beatrice",
        subtitle: "Comportamento do chat e explicabilidade",
        close: "Fechar configurações",
        chat: "Chat",
        appearance: "Aparência",
        ai: "IA",
        data: "Dados",
        streaming: "Streaming response",
        autoScroll: "Auto scroll",
        sources: "Mostrar source chips",
        confidence: "Mostrar confidence score",
        density: "Densidade",
        blur: "Intensidade de blur",
        verbosity: "Verbosidade",
        xaiDepth: "Profundidade XAI",
        clearHistory: "Limpar histórico",
        exportJson: "Exportar conversas JSON",
        resetPrefs: "Resetar preferências",
      };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onMouseDown={onClose}
        >
          <motion.section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="beatrice-settings-title"
            tabIndex={-1}
            className="flex h-full w-full max-w-[30rem] flex-col overflow-hidden border-l border-white/10 bg-[linear-gradient(145deg,rgba(31,31,34,0.96),rgba(10,10,12,0.98))] shadow-[0_0_90px_rgba(222,204,253,0.14)] outline-none backdrop-blur-3xl sm:rounded-l-[28px]"
            initial={{ x: 440 }}
            animate={{ x: 0 }}
            exit={{ x: 440 }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${strategy.theme.accentBorder} ${strategy.theme.accentBg}`}>
                    <SlidersHorizontal className={`h-5 w-5 ${strategy.theme.accentText}`} />
                  </div>
                  <div>
                    <h2 id="beatrice-settings-title" className="text-sm font-black text-white">
                      {labels.title}
                    </h2>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                      {labels.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={labels.close}
                  className="glass-panel flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            <div className="beatrice-scrollbar flex-1 space-y-5 overflow-y-auto px-5 py-5">
              <section className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Eye className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]">{labels.chat}</p>
                </div>
                <ToggleControl checked={settings.streaming} label={labels.streaming} onChange={(streaming) => updateSettings({ streaming })} />
                <ToggleControl checked={settings.autoScroll} label={labels.autoScroll} onChange={(autoScroll) => updateSettings({ autoScroll })} />
                <ToggleControl checked={settings.showSources} label={labels.sources} onChange={(showSources) => updateSettings({ showSources })} />
                <ToggleControl checked={settings.showConfidence} label={labels.confidence} onChange={(showConfidence) => updateSettings({ showConfidence })} />
              </section>

              <section className="space-y-4 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <SlidersHorizontal className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]">{labels.appearance}</p>
                </div>
                <SegmentGroup
                  label={labels.density}
                  value={settings.density}
                  onChange={(density) => updateSettings({ density })}
                  options={[
                    { label: locale === "en-US" ? "Compact" : "Compacto", value: "compact" },
                    { label: locale === "en-US" ? "Comfort" : "Conforto", value: "comfortable" },
                    { label: locale === "en-US" ? "Dense" : "Denso", value: "dense" },
                  ]}
                />
                <SegmentGroup
                  label={labels.blur}
                  value={settings.blurIntensity}
                  onChange={(blurIntensity) => updateSettings({ blurIntensity })}
                  options={[
                    { label: "Low", value: "low" },
                    { label: "Medium", value: "medium" },
                    { label: "High", value: "high" },
                  ]}
                />
              </section>

              <section className="space-y-4 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]">{labels.ai}</p>
                </div>
                <SegmentGroup
                  label={labels.verbosity}
                  value={settings.verbosity}
                  onChange={(verbosity) => updateSettings({ verbosity })}
                  options={[
                    { label: "Concise", value: "concise" },
                    { label: "Balanced", value: "balanced" },
                    { label: "Detailed", value: "detailed" },
                  ]}
                />
                <SegmentGroup
                  label={labels.xaiDepth}
                  value={settings.xaiDepth}
                  onChange={(xaiDepth) => updateSettings({ xaiDepth })}
                  options={[
                    { label: "Basic", value: "basic" },
                    { label: "Standard", value: "standard" },
                    { label: "Advanced", value: "advanced" },
                  ]}
                />
              </section>

              <section className="space-y-3 border-t border-white/8 pt-5">
                <div className="flex items-center gap-2 text-primary">
                  <Database className="h-4 w-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.18em]">{labels.data}</p>
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
