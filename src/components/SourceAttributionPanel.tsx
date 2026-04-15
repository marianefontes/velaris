import { DatabaseZap, FileText, NotebookTabs, Users } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { PredictionSource } from "../types/dashboard";

interface SourceAttributionPanelProps {
  sources: PredictionSource[];
}

const sourceMeta = {
  document: {
    icon: FileText,
    className: "text-primary border-primary/20 bg-primary/10",
  },
  "sprint-log": {
    icon: NotebookTabs,
    className: "text-secondary border-secondary/20 bg-secondary/10",
  },
  survey: {
    icon: Users,
    className: "text-slate-300 border-white/10 bg-white/5",
  },
  forecast: {
    icon: DatabaseZap,
    className: "text-amber-300 border-amber-400/20 bg-amber-400/10",
  },
} as const;

export function SourceAttributionPanel({ sources }: SourceAttributionPanelProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "RAG provenance",
          title: "Sources and traceability",
          description:
            "Each recommendation can expose the documentation, guideline or evidence used by the oracle to justify the response and sustain user trust.",
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Proveniência RAG",
            title: "Fontes e rastreabilidade",
            description:
              "Cada recomendação pode expor a documentação, guideline ou evidência usada pelo oráculo para justificar a resposta e sustentar a confiança do utilizador.",
          }
        : {
            eyebrow: "Proveniência RAG",
            title: "Fontes e rastreabilidade",
            description:
              "Cada recomendação pode expor a documentação, guideline ou evidência usada pelo oráculo para justificar a resposta e sustentar a confiança do usuário.",
          };
  return (
    <div className="glass-panel rounded-[32px] p-6">
      <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
        {copy.eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-bold text-white">{copy.title}</h4>
      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
        {copy.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        {sources.map((source) => {
          const meta = sourceMeta[source.kind];
          const Icon = meta.icon;

          return (
            <span
              key={source.id}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${meta.className}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {source.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
