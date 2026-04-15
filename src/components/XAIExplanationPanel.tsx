import { BrainCircuit, Sparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { ExplanationPanelData } from "../types/dashboard";

interface XAIExplanationPanelProps {
  data: ExplanationPanelData;
}

export function XAIExplanationPanel({ data }: XAIExplanationPanelProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          title: "Intelligent Oracle",
          recommendation: "Actionable recommendation",
          xaiSpace: "XAI space",
          xaiText:
            "This block is already prepared to expand with layered rationale, RAG-retrieved evidence, confidence signals and explanations adapted to the user profile.",
        }
      : locale === "pt-PT"
        ? {
            title: "Oráculo Inteligente",
            recommendation: "Recomendação acionável",
            xaiSpace: "Espaço XAI",
            xaiText:
              "Este bloco já está preparado para expandir com rationale em camadas, evidências recuperadas via RAG, sinais de confiança e explicações ajustadas ao perfil do utilizador.",
          }
        : {
            title: "Oráculo Inteligente",
            recommendation: "Recomendação acionável",
            xaiSpace: "Espaço XAI",
            xaiText:
              "Este bloco já está preparado para expandir com rationale em camadas, evidências recuperadas via RAG, sinais de confiança e explicações ajustadas ao perfil do usuário.",
          };
  return (
    <section className="glass-panel relative overflow-hidden rounded-[40px] p-8 md:p-10">
      <div className="absolute inset-0 bg-haze opacity-90" />
      <div className="relative grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="signature-pill flex items-center gap-2">
              <BrainCircuit className="h-3.5 w-3.5" />
              Explainable AI
            </span>
          </div>
          <h3 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            {copy.title}
          </h3>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-on-surface-variant md:text-base">
            {data.explanation}
          </p>
        </div>

        <div className="glass-card rounded-[28px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-signature text-on-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                {data.title}
              </p>
              <p className="mt-1 text-lg font-bold text-white">{copy.recommendation}</p>
            </div>
          </div>
          <p className="text-sm leading-7 text-primary/90">{data.recommendation}</p>
          <div className="mt-5 rounded-2xl border border-primary/10 bg-primary/5 p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-primary">{copy.xaiSpace}</p>
            <p className="mt-2 text-xs leading-6 text-on-surface-variant">
              {copy.xaiText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
