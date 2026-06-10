import { AlertTriangle, Check, Circle, Loader2, Minus, ShieldX } from "lucide-react";
import { translate } from "../../../i18n/I18nProvider";
import type { Locale } from "../../../i18n/translations";
import type { ExecutionStep } from "../../types/beatrice";

const STATUS_META = {
  pending: { icon: Circle, className: "text-slate-500", en: "Pending", pt: "Pendente" },
  running: { icon: Loader2, className: "text-primary", en: "Running", pt: "Em execução" },
  completed: { icon: Check, className: "text-success", en: "Completed", pt: "Concluído" },
  failed: { icon: AlertTriangle, className: "text-red-400", en: "Failed", pt: "Falhou" },
  blocked: { icon: ShieldX, className: "text-warning", en: "Blocked", pt: "Bloqueado" },
  skipped: { icon: Minus, className: "text-slate-500", en: "Skipped", pt: "Ignorado" },
} as const;

export function ExecutionTrace({ steps, locale }: { steps?: ExecutionStep[]; locale: Locale }) {
  const isEn = locale === "en-US";
  if (!steps || steps.length === 0) {
    return (
      <p className="rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3 text-xs leading-5 text-slate-500">
        {isEn
          ? "Execution trace unavailable for this response"
          : "Trilha de execução indisponível para esta resposta"}
      </p>
    );
  }

  return (
    <ol className="space-y-0" aria-label={translate(locale, "beatrice.audit.traceAria")}>
      {steps.map((step, index) => {
        const meta = STATUS_META[step.status];
        const Icon = meta.icon;
        return (
          <li key={step.id} className="relative flex gap-3 pb-4">
            {index < steps.length - 1 && (
              <span className="absolute left-[9px] top-5 h-[calc(100%-0.5rem)] w-px bg-white/8" aria-hidden />
            )}
            <span className={`relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-surface-container-high ${meta.className}`}>
              <Icon className={`h-3 w-3 ${step.status === "running" ? "motion-safe:animate-spin" : ""}`} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-semibold text-slate-200">{step.label}</p>
                <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${meta.className}`}>
                  {isEn ? meta.en : meta.pt}
                </span>
              </div>
              {step.details && <p className="mt-1 text-[10px] leading-4 text-slate-500">{step.details}</p>}
              {step.timestamp && (
                <time className="mt-1 block font-mono text-[9px] text-slate-700" dateTime={step.timestamp}>
                  {new Date(step.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </time>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
