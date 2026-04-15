import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bot,
  Brain,
  CheckCircle2,
  Eye,
  FileSearch,
  GitBranch,
  Lightbulb,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface ReasoningStep {
  title: string;
  description: string;
  icon: LucideIcon;
  active?: boolean;
}

interface ConfidenceMetric {
  label: string;
  value: number;
}

interface AlternativePath {
  title: string;
  result: string;
  selected?: boolean;
}

interface CapabilityTag {
  label: string;
}

const pathwayWeights = [42, 58, 84, 100, 73, 35];

function getReasoningContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroTitle: "Cognitive",
      heroAccent: "Decision Trace",
      heroEyebrow: "Transparency through visual introspection",
      liveLabel: "Live reasoning active",
      liveText:
        "Aetheris is tracing how evidence, constraints and UX principles converge before a recommendation reaches the user.",
      mapTitle: "Logic Trace Map",
      traceId: "Trace ID: OR-118-XAI",
      confidenceTitle: "Outcome Confidence",
      memoLabel: "Aetheris memo",
      memoText:
        "The current trace prioritizes explanation quality over compression so the user sees not only the answer, but the reasoning path that supports it.",
      alternativesTitle: "Alternatives",
      pathwayTitle: "Neural Pathway Mapping",
      pathwayEyebrow: "Real-time simulation of evidence weighting",
      pathwayButton: "Expand Simulation",
      awarenessTitle: "Contextual Awareness",
      awarenessText:
        "The reasoning engine does not only score options. It interprets intent, weighs design system semantics against UX principles and surfaces the rationale in a way the user can audit, trust and reuse.",
      deepLayerTitle: "Deep Processing Layer 04",
      deepLayerEyebrow: "Active interpretation mode",
      retrievedEvidence: "Retrieved evidence",
      retrievedText:
        "Components, patterns and guidelines are cross-checked before the answer is composed.",
      explanationLayer: "Explanation layer",
      explanationText:
        "The output is structured to show recommendation, rationale, trade-offs and UX principles behind the decision.",
      oracleObjective: "Oracle objective",
      oracleObjectiveText:
        "Make the system explainable enough that consumers understand not only what to do, but why the recommendation is credible.",
      steps: [
        {
          title: "Context Ingestion",
          description:
            "Scanning tokens, components, patterns, documentation fragments and live user intent before generating guidance.",
          icon: ScanSearch,
        },
        {
          title: "Constraint Application",
          description:
            "Applying design-system rules, UX principles, accessibility constraints and brand language to narrow valid outcomes.",
          icon: ShieldCheck,
        },
        {
          title: "Synthesis Engine",
          description:
            "Resolving tensions between consistency, context, usability and explanatory depth to generate a justified recommendation.",
          icon: Sparkles,
          active: true,
        },
      ] satisfies ReasoningStep[],
      metrics: [
        { label: "Recommendation clarity", value: 98 },
        { label: "Token consistency", value: 94 },
        { label: "UX principle fit", value: 91 },
      ] satisfies ConfidenceMetric[],
      alternatives: [
        {
          title: "Flat rule response",
          result: "Rejected: too prescriptive and low on explanation",
        },
        {
          title: "Documentation dump",
          result: "Rejected: high cognitive load and weak prioritization",
        },
        {
          title: "Layered oracle guidance",
          result: "Selected: best balance of clarity, rationale and trust",
          selected: true,
        },
      ] satisfies AlternativePath[],
      tags: [
        { label: "Semantic Analysis" },
        { label: "Visual Weighting" },
        { label: "Heuristic Audit" },
        { label: "RAG Evidence" },
      ] satisfies CapabilityTag[],
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    heroTitle: isPtPt ? "Rasto Cognitivo" : "Rastro Cognitivo",
    heroAccent: isPtPt ? "de Decisão" : "de Decisão",
    heroEyebrow: isPtPt ? "Transparência através de introspeção visual" : "Transparência através de introspecção visual",
    liveLabel: isPtPt ? "Raciocínio ativo em tempo real" : "Raciocínio ativo em tempo real",
    liveText: isPtPt
      ? "O Aetheris está a rastrear como evidência, constraints e princípios de UX convergem antes de uma recomendação chegar à pessoa."
      : "O Aetheris está rastreando como evidência, constraints e princípios de UX convergem antes de uma recomendação chegar ao usuário.",
    mapTitle: isPtPt ? "Mapa do Rasto Lógico" : "Mapa do Rastro Lógico",
    traceId: "Trace ID: OR-118-XAI",
    confidenceTitle: isPtPt ? "Confiança no Resultado" : "Confiança no Resultado",
    memoLabel: "Aetheris memo",
    memoText: isPtPt
      ? "O rasto atual prioriza qualidade de explicação acima de compressão para que a pessoa veja não só a resposta, mas o caminho de raciocínio que a sustenta."
      : "O rastro atual prioriza qualidade de explicação acima de compressão para que o usuário veja não só a resposta, mas o caminho de raciocínio que a sustenta.",
    alternativesTitle: isPtPt ? "Alternativas" : "Alternativas",
    pathwayTitle: isPtPt ? "Mapeamento de Vias Neurais" : "Mapeamento de Vias Neurais",
    pathwayEyebrow: isPtPt
      ? "Simulação em tempo real da ponderação de evidências"
      : "Simulação em tempo real da ponderação de evidências",
    pathwayButton: isPtPt ? "Expandir Simulação" : "Expandir Simulação",
    awarenessTitle: isPtPt ? "Consciência Contextual" : "Consciência Contextual",
    awarenessText: isPtPt
      ? "O motor de raciocínio não se limita a pontuar opções. Interpreta intenção, pondera semântica do design system face a princípios de UX e expõe o rationale de forma auditável, confiável e reutilizável."
      : "O motor de raciocínio não apenas pontua opções. Ele interpreta intenção, pondera semântica do design system frente a princípios de UX e expõe o rationale de forma auditável, confiável e reutilizável.",
    deepLayerTitle: isPtPt ? "Camada de Processamento Profundo 04" : "Camada de Processamento Profundo 04",
    deepLayerEyebrow: isPtPt ? "Modo de interpretação ativo" : "Modo de interpretação ativo",
    retrievedEvidence: isPtPt ? "Evidência recuperada" : "Evidência recuperada",
    retrievedText: isPtPt
      ? "Componentes, padrões e guidelines são cruzados antes de a resposta ser composta."
      : "Componentes, padrões e guidelines são cruzados antes de a resposta ser composta.",
    explanationLayer: isPtPt ? "Camada de explicação" : "Camada de explicação",
    explanationText: isPtPt
      ? "O output é estruturado para mostrar recomendação, rationale, trade-offs e princípios de UX por trás da decisão."
      : "O output é estruturado para mostrar recomendação, rationale, trade-offs e princípios de UX por trás da decisão.",
    oracleObjective: isPtPt ? "Objetivo do oráculo" : "Objetivo do oráculo",
    oracleObjectiveText: isPtPt
      ? "Tornar o sistema suficientemente explicável para que consumidores entendam não só o que fazer, mas por que a recomendação é credível."
      : "Tornar o sistema explicável o suficiente para que consumidores entendam não só o que fazer, mas por que a recomendação é crível.",
    steps: [
      {
        title: isPtPt ? "Ingestão de Contexto" : "Ingestão de Contexto",
        description:
          "Varredura de tokens, componentes, padrões, fragmentos de documentação e intenção viva do utilizador antes de gerar orientação.",
        icon: ScanSearch,
      },
      {
        title: isPtPt ? "Aplicação de Constraints" : "Aplicação de Constraints",
        description:
          "Aplicação de regras do design system, princípios de UX, constraints de acessibilidade e linguagem de marca para estreitar resultados válidos.",
        icon: ShieldCheck,
      },
      {
        title: isPtPt ? "Motor de Síntese" : "Motor de Síntese",
        description:
          "Resolução de tensões entre consistência, contexto, usabilidade e profundidade explicativa para gerar uma recomendação justificada.",
        icon: Sparkles,
        active: true,
      },
    ] satisfies ReasoningStep[],
    metrics: [
      { label: isPtPt ? "Clareza da recomendação" : "Clareza da recomendação", value: 98 },
      { label: isPtPt ? "Consistência dos tokens" : "Consistência dos tokens", value: 94 },
      { label: isPtPt ? "Aderência a princípios de UX" : "Aderência a princípios de UX", value: 91 },
    ] satisfies ConfidenceMetric[],
    alternatives: [
      {
        title: isPtPt ? "Resposta por regra seca" : "Resposta por regra seca",
        result: isPtPt ? "Rejeitada: prescritiva demais e fraca em explicação" : "Rejeitada: prescritiva demais e fraca em explicação",
      },
      {
        title: isPtPt ? "Dump de documentação" : "Dump de documentação",
        result: isPtPt ? "Rejeitado: alta carga cognitiva e baixa priorização" : "Rejeitado: alta carga cognitiva e baixa priorização",
      },
      {
        title: isPtPt ? "Orientação em camadas do oráculo" : "Orientação em camadas do oráculo",
        result: isPtPt ? "Selecionada: melhor equilíbrio entre clareza, rationale e confiança" : "Selecionada: melhor equilíbrio entre clareza, rationale e confiança",
        selected: true,
      },
    ] satisfies AlternativePath[],
    tags: [
      { label: isPtPt ? "Análise semântica" : "Análise semântica" },
      { label: isPtPt ? "Peso visual" : "Peso visual" },
      { label: isPtPt ? "Auditoria heurística" : "Auditoria heurística" },
      { label: "RAG Evidence" },
    ] satisfies CapabilityTag[],
  };
}

function ProgressBar({ metric }: { metric: ConfidenceMetric }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span>{metric.label}</span>
        <span className="text-white">{metric.value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-variant">
        <div className="h-full bg-signature" style={{ width: `${metric.value}%` }} />
      </div>
    </div>
  );
}

export function ReasoningPage() {
  const { locale } = useI18n();
  const content = getReasoningContent(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-7xl">
            {content.heroTitle} <br />
            <span className="signature-text">{content.heroAccent}</span>
          </h1>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {content.heroEyebrow}
          </p>
        </div>

        <div className="glass-panel max-w-sm rounded-2xl border-white/5 p-6 shadow-glow">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {content.liveLabel}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">{content.liveText}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="glass-panel relative overflow-hidden rounded-[28px] p-8 shadow-glow">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
          <div className="relative">
            <div className="mb-10 flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 text-lg font-bold text-white">
                <Network className="h-5 w-5 text-primary" />
                {content.mapTitle}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                {content.traceId}
              </span>
            </div>

            <div className="space-y-8">
              {content.steps.map((step, index) => {
                const Icon = step.icon;
                const isLast = index === content.steps.length - 1;
                return (
                  <div key={step.title} className="relative flex items-start gap-6">
                    <div
                      className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${
                        step.active
                          ? "border-primary/20 bg-signature text-on-primary"
                          : "border-primary/20 bg-surface-container-highest text-primary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="pt-1">
                      <h3
                        className={`mb-1 text-sm font-bold uppercase tracking-wider ${
                          step.active ? "text-primary" : "text-white"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`max-w-xl text-xs leading-6 ${
                          step.active ? "font-medium text-slate-200" : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                    {!isLast ? (
                      <div className="absolute bottom-[-2.5rem] left-6 h-12 w-px bg-gradient-to-b from-primary/40 to-transparent" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/5 bg-surface-container-high p-8">
          <h2 className="mb-8 flex items-center gap-3 text-lg font-bold text-white">
            <BarChart3 className="h-5 w-5 text-secondary" />
            {content.confidenceTitle}
          </h2>
          <div className="space-y-6">
            {content.metrics.map((metric) => (
              <ProgressBar key={metric.label} metric={metric} />
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-white/5 bg-white/5 p-5">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-secondary">
              {content.memoLabel}
            </div>
            <p className="text-xs italic leading-6 text-slate-400">{content.memoText}</p>
          </div>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <article className="glass-panel rounded-[28px] p-8">
          <h3 className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white">
            <GitBranch className="h-4 w-4 text-primary" />
            {content.alternativesTitle}
          </h3>
          <div className="space-y-4">
            {content.alternatives.map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border p-4 transition-colors ${
                  item.selected ? "border-primary/20 bg-primary/5" : "border-transparent bg-white/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  {item.selected ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <div className="mt-1 h-3 w-3 shrink-0 rounded-full border border-slate-500" />
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">{item.title}</p>
                    <p
                      className={`mt-1 text-[10px] uppercase tracking-widest ${
                        item.selected ? "text-primary" : "text-slate-500"
                      }`}
                    >
                      {item.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[28px] border border-white/5 bg-surface-container-low p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(222,204,253,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(194,160,252,0.12),transparent_26%)]" />
          <div className="relative">
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-white">
                  {content.pathwayTitle}
                </h3>
                <p className="mt-1 text-[10px] uppercase tracking-tighter text-slate-500">
                  {content.pathwayEyebrow}
                </p>
              </div>
              <button className="rounded-full border border-white/10 bg-surface-variant/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-surface-variant">
                {content.pathwayButton}
              </button>
            </div>

            <div className="flex h-40 items-end gap-4 px-4">
              {pathwayWeights.map((height, index) => (
                <div
                  key={`${height}-${index}`}
                  className={`flex-1 rounded-t-xl ${index === 3 ? "bg-signature" : "bg-primary/30"}`}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-2">
            <Eye className="h-5 w-5 text-secondary" />
          </div>
          <h2 className="mb-6 text-3xl font-black tracking-tight text-white">{content.awarenessTitle}</h2>
          <p className="mb-8 max-w-xl text-sm leading-7 text-slate-400">{content.awarenessText}</p>
          <div className="flex flex-wrap gap-3">
            {content.tags.map((tag) => (
              <span
                key={tag.label}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-300"
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>

        <div className="glass-panel relative overflow-hidden rounded-[32px] p-8 shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(222,204,253,0.18),transparent_20%),radial-gradient(circle_at_70%_40%,rgba(194,160,252,0.14),transparent_24%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="relative min-h-[20rem]">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{content.deepLayerTitle}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">{content.deepLayerEyebrow}</p>
              </div>
              <Brain className="h-8 w-8 text-primary" />
            </div>

            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <FileSearch className="h-3.5 w-3.5" />
                  {content.retrievedEvidence}
                </div>
                <p className="text-sm leading-7 text-slate-300">{content.retrievedText}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary">
                  <Lightbulb className="h-3.5 w-3.5" />
                  {content.explanationLayer}
                </div>
                <p className="text-sm leading-7 text-slate-300">{content.explanationText}</p>
              </div>
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Bot className="h-3.5 w-3.5" />
                  {content.oracleObjective}
                </div>
                <p className="text-sm leading-7 text-slate-200">{content.oracleObjectiveText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
