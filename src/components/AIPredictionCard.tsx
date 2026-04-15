import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { AIPrediction } from "../types/dashboard";

interface AIPredictionCardProps {
  prediction: AIPrediction;
}

const riskStyles = {
  low: {
    label: "Low risk",
    className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    icon: ShieldCheck,
  },
  medium: {
    label: "Medium risk",
    className: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    icon: AlertTriangle,
  },
  high: {
    label: "High risk",
    className: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    icon: ShieldAlert,
  },
} as const;

export function AIPredictionCard({ prediction }: AIPredictionCardProps) {
  const { locale } = useI18n();
  const config = riskStyles[prediction.risk];
  const Icon = config.icon;
  const copy =
    locale === "en-US"
      ? {
          oracleRecommendation: "Oracle recommendation",
          confidence: "Confidence",
          horizon: "Horizon",
          horizonText:
            "Structure ready for incremental reading powered by the RAG backend and the conversational agent.",
          risk: { low: "Low risk", medium: "Medium risk", high: "High risk" },
        }
      : locale === "pt-PT"
        ? {
            oracleRecommendation: "Recomendação do oráculo",
            confidence: "Confiança",
            horizon: "Horizonte",
            horizonText:
              "Estrutura pronta para leitura incremental vinda do backend RAG e do agente conversacional.",
            risk: { low: "Risco baixo", medium: "Risco médio", high: "Risco elevado" },
          }
        : {
            oracleRecommendation: "Recomendação do oráculo",
            confidence: "Confiança",
            horizon: "Horizonte",
            horizonText:
              "Estrutura pronta para leitura incremental vinda do backend RAG e do agente conversacional.",
            risk: { low: "Baixo risco", medium: "Médio risco", high: "Alto risco" },
          };

  return (
    <article className="glass-panel rounded-[32px] p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-on-surface-variant">
            {copy.oracleRecommendation}
          </p>
          <h4 className="mt-2 text-xl font-bold text-white">{prediction.title}</h4>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${config.className}`}
        >
          <Icon className="h-3.5 w-3.5" />
          {copy.risk[prediction.risk]}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-on-surface-variant">{prediction.summary}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
            {copy.confidence}
          </p>
          <p className="mt-2 text-2xl font-black text-white">{prediction.confidence}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container">
            <div
              className="h-full rounded-full bg-signature"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
            {copy.horizon}
          </p>
          <p className="mt-2 text-lg font-bold text-white">{prediction.timeframe}</p>
          <p className="mt-3 text-xs text-on-surface-variant">
            {copy.horizonText}
          </p>
        </div>
      </div>
    </article>
  );
}
