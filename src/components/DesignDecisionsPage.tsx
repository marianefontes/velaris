import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  LayoutPanelLeft,
  ListFilter,
  MessageSquareQuote,
  RectangleEllipsis,
  Sparkles,
  SquareMousePointer,
  Vibrate,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface DecisionSignal {
  text: string;
  tone: "primary" | "error";
}

interface SupportingDecision {
  rule: string;
  title: string;
  description: string;
  tags: string[];
}

interface SmallRuleCard {
  id: string;
  title: string;
}

interface InferenceNote {
  title: string;
  text: string;
  accent: "primary" | "secondary";
}

function getDesignDecisionsContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroTitle: "Architectural",
      heroAccent: "Truths.",
      heroSubtitle: "Systemic resolution of foundational interface trade-offs",
      live: "AETHERIS LIVE",
      liveText:
        "I am currently analyzing the intersection of task density and user focus for Rule 04: Modal vs. Drawer. Recommendation: favor Drawer for complex configurations that require persistent context.",
      ruleTag: "Rule 04",
      ruleEyebrow: "Navigation Architecture",
      ruleTitle: "Modal Overlay vs. Side Drawer",
      contextSignalsTitle: "Context Signals",
      tradeOffsTitle: "Trade-offs",
      viewMatrix: "VIEW FULL MATRIX",
      inferenceCore: "Aetheris Inference Core",
      analysisTitle: "Neural Architecture Analysis",
      analysisText:
        "The decision engine resolves design conflicts by weighting cognitive load, aesthetic integrity and interaction friction. Each recommendation exists to make a trade-off explicit, not to hide it.",
      primaryAction: "Audit Decision History",
      secondaryAction: "View Bias Report",
      whyTitle: "Why this page matters",
      whyText:
        "Design decisions turn the system from a static catalog into an explainable product. They capture not only what was chosen, but the reasoning, constraints and UX trade-offs behind each choice, which is exactly what the Oracle needs to communicate with trust.",
      connectedText: "Connected to Beatrice Chat, Reasoning and System Evaluation",
      contextSignals: [
        { text: "High Density Content", tone: "primary" },
        { text: "Persistent Context", tone: "primary" },
        { text: "Form Step Integration", tone: "primary" },
      ] satisfies DecisionSignal[],
      tradeOffSignals: [
        { text: "Visual Occlusion", tone: "error" },
        { text: "Contextual Drift", tone: "error" },
        { text: "Modal Blindness", tone: "error" },
      ] satisfies DecisionSignal[],
      supportingDecisions: [
        {
          rule: "Rule 08: Action Hierarchy",
          title: "Primary vs. Secondary Button Logic",
          description:
            "When to use the signature gradient versus restrained secondary treatments for terminal actions.",
          tags: ["Context: Transactional", "Context: Discovery"],
        },
        {
          rule: "Rule 12",
          title: "List vs. Bento",
          description:
            "List layout excels for scannable, sequential data with consistent row density. Bento grid excels for heterogeneous content where size encodes priority — larger cells signal higher importance. Use List when users compare items row by row. Use Bento when visual hierarchy and content variety matter more than strict alignment. Trade-off: Bento requires more design effort per item; List is faster to implement but less expressive.",
          tags: ["Context: Data-heavy", "Context: Editorial"],
        },
        {
          rule: "Rule 15",
          title: "Haptic Feedback",
          description:
            "Haptic feedback confirms high-stakes or irreversible actions on mobile — deletes, confirmations and state toggles. Reserve for moments where tactile confirmation reduces user anxiety about permanence. When to use: destructive actions, form submissions, binary state changes. When not to use: passive events, informational toasts, decorative interactions. Trade-off: overuse degrades trust and drains battery; underuse leaves users uncertain after consequential actions.",
          tags: ["Context: Mobile", "Context: Confirmation"],
        },
      ] satisfies SupportingDecision[],
      inferenceNotes: [
        {
          title: "Active Inference",
          text: 'System currently favors "Ambient Glow" over "Sharp Dividers" to reduce visual fatigue in dense surfaces.',
          accent: "primary",
        },
        {
          title: "Aesthetic Lock",
          text: 'Applying "Soft Precision" rounding across the decision tree to preserve visual continuity.',
          accent: "secondary",
        },
      ] satisfies InferenceNote[],
      smallRules: [
        { id: "01", title: "Shadow Logic" },
        { id: "02", title: "Grid Snap" },
        { id: "03", title: "Type Scale" },
        { id: "05", title: "Micro-interact" },
        { id: "06", title: "Dark Ratio" },
      ] satisfies SmallRuleCard[],
    };
  }

  if (locale === "pt-PT") {
    return {
      heroTitle: "Verdades",
      heroAccent: "Arquitecturais.",
      heroSubtitle: "Resolução sistémica de trade-offs fundacionais de interface",
      live: "AETHERIS LIVE",
      liveText:
        "Estou neste momento a analisar a intersecção entre densidade de tarefa e foco do utilizador para a Regra 04: Modal vs. Drawer. Recomendação: favorecer Drawer para configurações complexas que exigem contexto persistente.",
      ruleTag: "Regra 04",
      ruleEyebrow: "Arquitectura de navegação",
      ruleTitle: "Modal Overlay vs. Side Drawer",
      contextSignalsTitle: "Sinais de contexto",
      tradeOffsTitle: "Trade-offs",
      viewMatrix: "VER MATRIZ COMPLETA",
      inferenceCore: "Núcleo de inferência Aetheris",
      analysisTitle: "Análise da arquitectura neural",
      analysisText:
        "O motor de decisão resolve conflitos de design ponderando carga cognitiva, integridade estética e fricção de interação. Cada recomendação existe para tornar um trade-off explícito, não para o esconder.",
      primaryAction: "Auditar histórico de decisões",
      secondaryAction: "Ver relatório de enviesamento",
      whyTitle: "Porque esta página importa",
      whyText:
        "As decisões de design transformam o sistema de um catálogo estático num produto explicável. Capturam não apenas o que foi escolhido, mas o raciocínio, as restrições e os trade-offs de UX por trás de cada escolha, que é exactamente o que o Oráculo precisa de comunicar com confiança.",
      connectedText: "Ligado ao Chat da Beatrice, Raciocínio e Avaliação do Sistema",
      contextSignals: [
        { text: "Conteúdo de alta densidade", tone: "primary" },
        { text: "Contexto persistente", tone: "primary" },
        { text: "Integração por etapas de formulário", tone: "primary" },
      ] satisfies DecisionSignal[],
      tradeOffSignals: [
        { text: "Oclusão visual", tone: "error" },
        { text: "Deriva contextual", tone: "error" },
        { text: "Cegueira ao modal", tone: "error" },
      ] satisfies DecisionSignal[],
      supportingDecisions: [
        {
          rule: "Regra 08: Hierarquia de ação",
          title: "Lógica de botão primário vs. secundário",
          description:
            "Quando utilizar o gradiente signature versus tratamentos secundários mais contidos para ações terminais.",
          tags: ["Contexto: Transacional", "Contexto: Descoberta"],
        },
        {
          rule: "Regra 12",
          title: "Lista vs. Bento",
          description:
            "Estratégias de densidade de visualização de dados e quando o agrupamento melhora a compreensão.",
          tags: [],
        },
        {
          rule: "Regra 15",
          title: "Feedback háptico",
          description:
            "Gatilhos sensoriais para paradigmas mobile-first e ações com forte necessidade de confirmação.",
          tags: [],
        },
      ] satisfies SupportingDecision[],
      inferenceNotes: [
        {
          title: "Inferência ativa",
          text: 'O sistema favorece actualmente "Ambient Glow" em vez de "Sharp Dividers" para reduzir fadiga visual em superfícies densas.',
          accent: "primary",
        },
        {
          title: "Bloqueio estético",
          text: 'Aplicação de arredondamento "Soft Precision" em toda a árvore de decisão para preservar continuidade visual.',
          accent: "secondary",
        },
      ] satisfies InferenceNote[],
      smallRules: [
        { id: "01", title: "Lógica de sombra" },
        { id: "02", title: "Encaixe na grelha" },
        { id: "03", title: "Escala tipográfica" },
        { id: "05", title: "Micro-interação" },
        { id: "06", title: "Rácio de escuro" },
      ] satisfies SmallRuleCard[],
    };
  }

  return {
    heroTitle: "Verdades",
    heroAccent: "Arquiteturais.",
    heroSubtitle: "Resolução sistêmica de trade-offs fundacionais de interface",
    live: "AETHERIS LIVE",
    liveText:
      "Estou analisando neste momento a interseção entre densidade de tarefa e foco do usuário para a Regra 04: Modal vs. Drawer. Recomendação: favorecer Drawer para configurações complexas que exigem contexto persistente.",
    ruleTag: "Regra 04",
    ruleEyebrow: "Arquitetura de navegação",
    ruleTitle: "Modal Overlay vs. Side Drawer",
    contextSignalsTitle: "Sinais de contexto",
    tradeOffsTitle: "Trade-offs",
    viewMatrix: "VER MATRIZ COMPLETA",
    inferenceCore: "Núcleo de inferência Aetheris",
    analysisTitle: "Análise da arquitetura neural",
    analysisText:
      "O motor de decisão resolve conflitos de design ponderando carga cognitiva, integridade estética e fricção de interação. Cada recomendação existe para tornar um trade-off explícito, não para escondê-lo.",
    primaryAction: "Auditar histórico de decisões",
    secondaryAction: "Ver relatório de viés",
    whyTitle: "Por que esta página importa",
    whyText:
      "As decisões de design transformam o sistema de um catálogo estático em um produto explicável. Elas capturam não apenas o que foi escolhido, mas o raciocínio, as restrições e os trade-offs de UX por trás de cada escolha, que é exatamente o que o Oráculo precisa comunicar com confiança.",
    connectedText: "Conectado ao Chat da Beatrice, Raciocínio e Avaliação do Sistema",
    contextSignals: [
      { text: "Conteúdo de alta densidade", tone: "primary" },
      { text: "Contexto persistente", tone: "primary" },
      { text: "Integração por etapas de formulário", tone: "primary" },
    ] satisfies DecisionSignal[],
    tradeOffSignals: [
      { text: "Oclusão visual", tone: "error" },
      { text: "Deriva contextual", tone: "error" },
      { text: "Cegueira ao modal", tone: "error" },
    ] satisfies DecisionSignal[],
    supportingDecisions: [
      {
        rule: "Regra 08: Hierarquia de ação",
        title: "Lógica de botão primário vs. secundário",
        description:
          "Quando usar o gradiente signature versus tratamentos secundários mais contidos para ações finais.",
        tags: ["Contexto: Transacional", "Contexto: Descoberta"],
      },
      {
        rule: "Regra 12",
        title: "Lista vs. Bento",
        description:
          "Estratégias de densidade de visualização de dados e quando o agrupamento melhora a compreensão.",
        tags: [],
      },
      {
        rule: "Regra 15",
        title: "Feedback háptico",
        description:
          "Gatilhos sensoriais para paradigmas mobile-first e ações com forte necessidade de confirmação.",
        tags: [],
      },
    ] satisfies SupportingDecision[],
    inferenceNotes: [
      {
        title: "Inferência ativa",
        text: 'O sistema atualmente favorece "Ambient Glow" em vez de "Sharp Dividers" para reduzir fadiga visual em superfícies densas.',
        accent: "primary",
      },
      {
        title: "Travamento estético",
        text: 'Aplicando arredondamento "Soft Precision" em toda a árvore de decisão para preservar continuidade visual.',
        accent: "secondary",
      },
    ] satisfies InferenceNote[],
    smallRules: [
      { id: "01", title: "Lógica de sombra" },
      { id: "02", title: "Encaixe em grid" },
      { id: "03", title: "Escala tipográfica" },
      { id: "05", title: "Microinteração" },
      { id: "06", title: "Proporção de escuro" },
    ] satisfies SmallRuleCard[],
  };
}

function SignalList({
  title,
  items,
}: {
  title: string;
  items: DecisionSignal[];
}) {
  return (
    <div>
      <div className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-2 text-xs text-slate-300">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                item.tone === "primary" ? "bg-primary" : "bg-error"
              }`}
            />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DesignDecisionsPage() {
  const { locale } = useI18n();
  const content = getDesignDecisionsContent(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="grid items-end gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="text-6xl font-black tracking-tight text-white md:text-7xl">
            {content.heroTitle} <span className="signature-text">{content.heroAccent}</span>
          </h1>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {content.heroSubtitle}
          </p>
        </div>

        <div className="glass-panel rounded-[20px] p-6 shadow-glow">
          <div className="mb-6 flex items-start justify-between">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] text-primary">
              {content.live}
            </span>
          </div>
          <p className="text-sm italic leading-7 text-slate-300">{content.liveText}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-4">
        <article className="overflow-hidden rounded-[24px] border border-white/10 bg-surface-container-high xl:col-span-2 xl:row-span-2">
          <div className="relative h-48 overflow-hidden bg-[radial-gradient(circle_at_top,rgba(222,204,253,0.22),transparent_30%),linear-gradient(180deg,rgba(38,37,40,0.15),rgba(31,31,34,0.92))]">
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3 text-slate-300">
              <LayoutPanelLeft className="h-10 w-10 text-primary" />
              <RectangleEllipsis className="h-8 w-8 text-secondary" />
            </div>
          </div>

          <div className="relative -mt-10 p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary">
                {content.ruleTag}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">
                {content.ruleEyebrow}
              </span>
            </div>

            <h2 className="mb-6 text-3xl font-bold tracking-tight text-white">
              {content.ruleTitle}
            </h2>

            <div className="mb-8 grid gap-8 md:grid-cols-2">
              <SignalList title={content.contextSignalsTitle} items={content.contextSignals} />
              <SignalList title={content.tradeOffsTitle} items={content.tradeOffSignals} />
            </div>

            <Link
              to="/beatrice-chat"
              className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-signature py-4 font-bold text-on-primary transition-opacity hover:opacity-90"
            >
              {content.viewMatrix}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </article>

        {content.supportingDecisions.map((decision, index) => {
          const icon: LucideIcon[] = [SquareMousePointer, ListFilter, Vibrate];
          const Icon = icon[index]!;

          return (
            <article
              key={decision.title}
              className={`rounded-[20px] border p-8 ${
                index === 0
                  ? "glass-panel xl:col-span-2"
                  : "border-white/5 bg-surface-container-low hover:border-primary/30"
              } transition-colors`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                  {decision.rule}
                </span>
                <Icon className="h-5 w-5 text-slate-500" />
              </div>
              <h3 className="mb-4 text-2xl font-bold tracking-tight text-white">{decision.title}</h3>
              <p className="text-sm leading-7 text-slate-400">{decision.description}</p>
              {decision.tags.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-4">
                  {decision.tags.map((tag, tagIndex) => (
                    <div
                      key={tag}
                      className={`rounded-full px-6 py-3 text-xs font-bold ${
                        tagIndex === 0
                          ? "border border-secondary/30 bg-secondary/10 text-secondary"
                          : "border border-primary/30 bg-primary/10 text-primary"
                      }`}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
            {content.inferenceCore}
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="grid items-center gap-10 xl:grid-cols-[0.7fr_1.3fr]">
          <div>
            <div className="relative aspect-square rounded-full border border-primary/10 p-8">
              <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle,rgba(222,204,253,0.18),transparent_45%),linear-gradient(180deg,rgba(31,31,34,0.8),rgba(19,19,21,0.9))]">
                <Bot className="h-16 w-16 animate-pulse text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-white">
                {content.analysisTitle}
              </h2>
              <p className="text-lg leading-relaxed text-slate-400">{content.analysisText}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {content.inferenceNotes.map((note) => (
                <div
                  key={note.title}
                  className={`rounded-2xl border-l-4 bg-white/5 p-6 ${
                    note.accent === "primary" ? "border-primary" : "border-secondary"
                  }`}
                >
                  <div
                    className={`mb-2 text-[10px] font-bold uppercase tracking-widest ${
                      note.accent === "primary" ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {note.title}
                  </div>
                  <div className="text-sm font-medium leading-6 text-slate-200">{note.text}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <button className="rounded-full border border-primary/20 bg-primary/10 px-8 py-3 text-xs font-bold uppercase tracking-widest text-primary transition-all hover:bg-primary/20">
                {content.primaryAction}
              </button>
              <button className="rounded-full border border-white/10 px-8 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 transition-all hover:bg-white/5">
                {content.secondaryAction}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-5">
        {content.smallRules.map((rule) => (
          <button
            key={rule.id}
            className="cursor-pointer rounded-2xl border border-white/5 bg-surface-container p-4 text-left transition-colors hover:bg-surface-container-high"
          >
            <div className="mb-1 text-[10px] text-slate-500">{rule.id}</div>
            <div className="text-xs font-bold text-slate-200 transition-colors hover:text-primary">
              {rule.title}
            </div>
          </button>
        ))}
      </section>

      <section className="glass-panel rounded-[28px] p-8">
        <div className="flex items-start gap-4">
          <BrainCircuit className="mt-1 h-6 w-6 text-primary" />
          <div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
              {content.whyTitle}
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-slate-400">{content.whyText}</p>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <MessageSquareQuote className="h-4 w-4 text-secondary" />
              {content.connectedText}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
