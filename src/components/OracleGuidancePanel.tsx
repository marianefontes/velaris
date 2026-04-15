import { Compass, FileQuestion, Layers3, Lightbulb, Sparkles, WandSparkles } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { OracleGuidanceData } from "../types/dashboard";

interface OracleGuidancePanelProps {
  data: OracleGuidanceData;
}

const coreCards = [
  { key: "start", icon: Compass },
  { key: "structure", icon: Layers3 },
  { key: "bestCombination", icon: WandSparkles },
  { key: "why", icon: Lightbulb },
] as const;

export function OracleGuidancePanel({ data }: OracleGuidancePanelProps) {
  const { locale } = useI18n();
  const copy =
    locale === "en-US"
      ? {
          eyebrow: "Decision anatomy",
          title: "How the Oracle should respond",
          badge: "Explainable response",
          layer: "Response layer",
          limits: "Limits and cautions",
          usageTitle: "When to use and when not to use",
          whenToUse: "When to use",
          whenNotToUse: "When not to use",
          uxEyebrow: "UX foundation",
          uxTitle: "Principles behind the guidance",
          labels: {
            start: "Where to start",
            structure: "How to structure it",
            bestCombination: "Best combination",
            why: "Why",
          },
        }
      : locale === "pt-PT"
        ? {
            eyebrow: "Anatomia da decisão",
            title: "Como o Oráculo deve responder",
            badge: "Resposta explicável",
            layer: "Camada da resposta",
            limits: "Limites e cautelas",
            usageTitle: "Quando usar e quando não usar",
            whenToUse: "Quando usar",
            whenNotToUse: "Quando não usar",
            uxEyebrow: "Fundamento de UX",
            uxTitle: "Princípios por trás da orientação",
            labels: {
              start: "Por onde começar",
              structure: "Como estruturar",
              bestCombination: "Melhor combinação",
              why: "Porquê",
            },
          }
        : {
            eyebrow: "Anatomia da decisão",
            title: "Como o Oráculo deve responder",
            badge: "Resposta explicável",
            layer: "Camada da resposta",
            limits: "Limites e cautelas",
            usageTitle: "Quando usar e quando não usar",
            whenToUse: "Quando usar",
            whenNotToUse: "Quando não usar",
            uxEyebrow: "Fundamento de UX",
            uxTitle: "Princípios por trás da orientação",
            labels: {
              start: "Por onde começar",
              structure: "Como estruturar",
              bestCombination: "Melhor combinação",
              why: "Por quê",
            },
          };
  return (
    <section className="space-y-6">
      <div className="mb-2 flex items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-on-surface-variant">
            {copy.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
            {copy.title}
          </h2>
        </div>
        <span className="signature-pill">{copy.badge}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {coreCards.map(({ key, icon: Icon }) => (
          <article key={key} className="glass-panel rounded-[30px] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signature text-on-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                  {copy.layer}
                </p>
                <h3 className="mt-1 text-lg font-bold text-white">{copy.labels[key]}</h3>
              </div>
            </div>
            <p className="text-sm leading-7 text-on-surface-variant">{data[key]}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-panel rounded-[30px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signature text-on-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                {copy.limits}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">{copy.usageTitle}</h3>
            </div>
          </div>
          <div className="space-y-5">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                {copy.whenToUse}
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">{data.whenToUse}</p>
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-error/80">
                {copy.whenNotToUse}
              </p>
              <p className="text-sm leading-7 text-on-surface-variant">{data.whenNotToUse}</p>
            </div>
          </div>
        </article>

        <article className="glass-panel rounded-[30px] p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signature text-on-primary">
              <FileQuestion className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-on-surface-variant">
                {copy.uxEyebrow}
              </p>
              <h3 className="mt-1 text-lg font-bold text-white">{copy.uxTitle}</h3>
            </div>
          </div>
          <div className="space-y-4">
            {data.uxPrinciples.map((principle) => (
              <div key={principle.id} className="glass-card rounded-2xl p-4">
                <p className="text-sm font-bold text-white">{principle.title}</p>
                <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
