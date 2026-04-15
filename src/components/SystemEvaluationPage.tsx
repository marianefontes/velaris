import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  CircleGauge,
  FileCheck2,
  LayoutTemplate,
  ListChecks,
  Shield,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface EvaluationMetric {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
}

interface ActionItem {
  id: string;
  title: string;
  description: string;
}

function getSystemEvaluationContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroEyebrow: "System Performance Matrix",
      heroTitle: "Oracle System",
      heroAccent: "Evaluation",
      heroText:
        "An objective assessment of how the product supports design system consumers through clarity, trust, explainability and UX coherence.",
      totalLabel: "Total resonance score",
      totalText:
        "Strong alignment with Oracle-first principles of explanation, confidence and guided decision-making.",
      whyTitle: "Why this score?",
      actionsTitle: "Actions",
      exportLabel: "Export Full Audit",
      surfaceTitle: "Explainability Surface",
      surfaceEyebrow: "Active audit layer",
      evidenceQuality: "Evidence quality",
      evidenceText:
        "Recommendations are grounded in retrievable system knowledge instead of hidden heuristic jumps.",
      uxImpact: "UX impact",
      uxImpactText:
        "The interface reduces cognitive load by staging explanation in layers instead of forcing users to parse dense documentation.",
      consistencyTitle: "Ethereal Consistency",
      consistencyText:
        "The visual identity still performs as one of the product's strongest assets. Blur, translucency and low-contrast depth cues help the system feel intentional rather than mechanical, as long as those effects continue to serve readability and hierarchy.",
      metrics: [
        {
          title: "Clarity",
          value: "96%",
          description:
            "Layered responses and explicit hierarchy help consumers understand the answer before exploring supporting detail.",
          icon: LayoutTemplate,
        },
        {
          title: "Trust",
          value: "91%",
          description:
            "Explanations, rationale and evidence framing reinforce confidence that recommendations are not arbitrary.",
          icon: Shield,
        },
        {
          title: "Accessibility",
          value: "87%",
          description:
            "High-contrast surfaces and readable scale perform well, though compact metadata still needs stricter spacing audits.",
          icon: Activity,
        },
        {
          title: "Consistency",
          value: "98%",
          description:
            "Unified shell, token discipline and recurring interaction patterns create a strong sense of systemic coherence.",
          icon: SwatchBook,
        },
      ] satisfies EvaluationMetric[],
      whyParagraphs: [
        "The system is strongest when it turns fragmented documentation into guided decisions. Its current architecture balances fast retrieval with explainable output, which is exactly what design system consumers need when they are unsure how to proceed.",
        "The current score reflects strong system consistency, good atmospheric clarity and a promising XAI layer. The remaining gap is mostly about scaling that quality across all pages, especially the surfaces that are still being transitioned from legacy HTML.",
      ] as const,
      quote:
        '"The product performs best when explanation is treated as part of the answer, not a postscript. Trust rises when users can see what led to the recommendation."',
      actions: [
        {
          id: "01",
          title: "Increase explanation cues",
          description:
            "Expose recommendation, why, trade-offs and source evidence more consistently across all remaining legacy surfaces.",
        },
        {
          id: "02",
          title: "Audit compact labels",
          description:
            "Review dense metadata and chip treatments to ensure readability survives on smaller widths and lower-contrast contexts.",
        },
        {
          id: "03",
          title: "Strengthen evidence visibility",
          description:
            "Bring RAG retrieval and explanation provenance closer to the first answer instead of leaving it as a secondary layer.",
        },
        {
          id: "04",
          title: "Validate mobile depth cues",
          description:
            "Tune glow, blur and glass layers so atmospheric styling still communicates structure on small screens.",
        },
      ] satisfies ActionItem[],
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    heroEyebrow: isPtPt ? "Matriz de Performance do Sistema" : "Matriz de Performance do Sistema",
    heroTitle: isPtPt ? "Avaliação do" : "Avaliação do",
    heroAccent: isPtPt ? "Sistema Oráculo" : "Sistema Oráculo",
    heroText: isPtPt
      ? "Uma avaliação objetiva de como o produto apoia consumidores de design systems através de clareza, confiança, explicabilidade e coerência de UX."
      : "Uma avaliação objetiva de como o produto apoia consumidores de design systems através de clareza, confiança, explicabilidade e coerência de UX.",
    totalLabel: isPtPt ? "Score total de ressonância" : "Score total de ressonância",
    totalText: isPtPt
      ? "Alinhamento forte com princípios Oracle-first de explicação, confiança e decisão guiada."
      : "Alinhamento forte com princípios Oracle-first de explicação, confiança e tomada de decisão guiada.",
    whyTitle: isPtPt ? "Por que esta pontuação?" : "Por que esta pontuação?",
    actionsTitle: isPtPt ? "Ações" : "Ações",
    exportLabel: isPtPt ? "Exportar Auditoria Completa" : "Exportar Auditoria Completa",
    surfaceTitle: isPtPt ? "Superfície de Explicabilidade" : "Superfície de Explicabilidade",
    surfaceEyebrow: isPtPt ? "Camada de auditoria ativa" : "Camada de auditoria ativa",
    evidenceQuality: isPtPt ? "Qualidade da evidência" : "Qualidade da evidência",
    evidenceText: isPtPt
      ? "As recomendações estão ancoradas em conhecimento recuperável do sistema em vez de saltos heurísticos escondidos."
      : "As recomendações estão ancoradas em conhecimento recuperável do sistema em vez de saltos heurísticos ocultos.",
    uxImpact: isPtPt ? "Impacto em UX" : "Impacto em UX",
    uxImpactText: isPtPt
      ? "A interface reduz carga cognitiva ao encadear a explicação em camadas, em vez de obrigar a pessoa a decifrar documentação densa."
      : "A interface reduz carga cognitiva ao encadear a explicação em camadas, em vez de obrigar o usuário a decifrar documentação densa.",
    consistencyTitle: isPtPt ? "Consistência Etérea" : "Consistência Etérea",
    consistencyText: isPtPt
      ? "A identidade visual continua a ser um dos ativos mais fortes do produto. Blur, translucidez e pistas de profundidade de baixo contraste ajudam o sistema a parecer intencional e não mecânico, desde que esses efeitos continuem ao serviço da legibilidade e da hierarquia."
      : "A identidade visual continua sendo um dos ativos mais fortes do produto. Blur, translucidez e pistas de profundidade de baixo contraste ajudam o sistema a parecer intencional em vez de mecânico, desde que esses efeitos continuem a serviço da legibilidade e da hierarquia.",
    metrics: [
      {
        title: isPtPt ? "Clareza" : "Clareza",
        value: "96%",
        description:
          "Respostas em camadas e hierarquia explícita ajudam consumidores a entender a resposta antes de explorar detalhe de apoio.",
        icon: LayoutTemplate,
      },
      {
        title: isPtPt ? "Confiança" : "Confiança",
        value: "91%",
        description:
          "Explicações, rationale e enquadramento da evidência reforçam que as recomendações não são arbitrárias.",
        icon: Shield,
      },
      {
        title: isPtPt ? "Acessibilidade" : "Acessibilidade",
        value: "87%",
        description:
          "Superfícies de alto contraste e escala legível funcionam bem, embora metadata compacta ainda precise de auditorias mais rigorosas de spacing.",
        icon: Activity,
      },
      {
        title: isPtPt ? "Consistência" : "Consistência",
        value: "98%",
        description:
          "Shell unificado, disciplina de tokens e padrões recorrentes de interação criam forte coerência sistémica.",
        icon: SwatchBook,
      },
    ] satisfies EvaluationMetric[],
    whyParagraphs: [
      isPtPt
        ? "O sistema é mais forte quando transforma documentação fragmentada em decisões guiadas. A arquitetura atual equilibra recuperação rápida com output explicável, que é exatamente o que consumidores de design systems precisam quando não sabem como avançar."
        : "O sistema é mais forte quando transforma documentação fragmentada em decisões guiadas. A arquitetura atual equilibra recuperação rápida com output explicável, que é exatamente o que consumidores de design systems precisam quando não sabem como prosseguir.",
      isPtPt
        ? "A pontuação atual reflete forte consistência sistémica, boa clareza atmosférica e uma camada XAI promissora. A lacuna remanescente está sobretudo em escalar essa qualidade a todas as páginas, especialmente superfícies ainda em transição do HTML legado."
        : "A pontuação atual reflete forte consistência sistêmica, boa clareza atmosférica e uma camada XAI promissora. A lacuna remanescente está sobretudo em escalar essa qualidade para todas as páginas, especialmente nas superfícies ainda em transição do HTML legado.",
    ] as const,
    quote: isPtPt
      ? '"O produto tem melhor desempenho quando a explicação é tratada como parte da resposta, e não como pós-escrito. A confiança sobe quando as pessoas conseguem ver o que levou à recomendação."'
      : '"O produto performa melhor quando a explicação é tratada como parte da resposta, e não como pós-escrito. A confiança cresce quando as pessoas conseguem ver o que levou à recomendação."',
    actions: [
      {
        id: "01",
        title: isPtPt ? "Aumentar pistas de explicação" : "Aumentar pistas de explicação",
        description:
          "Expor recomendação, porquê, trade-offs e evidência de origem com mais consistência nas superfícies remanescentes.",
      },
      {
        id: "02",
        title: isPtPt ? "Auditar labels compactas" : "Auditar labels compactas",
        description:
          "Rever metadata densa e tratamento de chips para garantir legibilidade em larguras menores e contextos de menor contraste.",
      },
      {
        id: "03",
        title: isPtPt ? "Reforçar visibilidade da evidência" : "Reforçar visibilidade da evidência",
        description:
          "Trazer retrieval RAG e proveniência da explicação para mais perto da primeira resposta em vez de deixá-los como camada secundária.",
      },
      {
        id: "04",
        title: isPtPt ? "Validar pistas de profundidade no mobile" : "Validar pistas de profundidade no mobile",
        description:
          "Afinar glow, blur e camadas glass para que a estética continue a comunicar estrutura em ecrãs pequenos.",
      },
    ] satisfies ActionItem[],
  };
}

export function SystemEvaluationPage() {
  const { locale } = useI18n();
  const content = getSystemEvaluationContent(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="max-w-4xl">
        <span className="mb-4 block text-xs uppercase tracking-[0.2em] text-primary">
          {content.heroEyebrow}
        </span>
        <h1 className="text-6xl font-extrabold leading-none tracking-tight text-white md:text-7xl">
          {content.heroTitle} <br />
          <span className="signature-text">{content.heroAccent}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl font-light leading-relaxed text-on-surface-variant">
          {content.heroText}
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-low p-10 shadow-glow">
          <div className="absolute right-0 top-0 p-8 opacity-10">
            <CircleGauge className="h-32 w-32 text-primary" />
          </div>
          <div className="relative">
            <h2 className="mb-12 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {content.totalLabel}
            </h2>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black tracking-tighter text-white md:text-9xl">93</span>
              <span className="text-3xl font-bold text-primary">/100</span>
            </div>
            <div className="mt-12">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full w-[93%] bg-signature" />
              </div>
              <p className="mt-4 text-sm text-on-surface-variant">{content.totalText}</p>
            </div>
          </div>
        </article>

        <div className="grid gap-6 sm:grid-cols-2">
          {content.metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <article
                key={metric.title}
                className="rounded-[24px] border border-white/10 bg-surface-container-high p-8 transition-all duration-500 hover:border-primary/30"
              >
                <div className="mb-6 flex items-start justify-between">
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold text-white">{metric.value}</span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{metric.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{metric.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[28px] border border-white/10 bg-surface-container-low p-10">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
            <Bot className="h-6 w-6 text-primary" />
            {content.whyTitle}
          </h2>
          <div className="space-y-6 text-on-surface-variant">
            <p className="text-lg leading-relaxed">{content.whyParagraphs[0]}</p>
            <div className="rounded-2xl border-l-4 border-primary bg-surface-container-highest p-6">
              <p className="font-medium italic text-white">{content.quote}</p>
            </div>
            <p className="text-lg leading-relaxed">{content.whyParagraphs[1]}</p>
          </div>
        </article>

        <article className="rounded-[28px] border border-white/10 bg-surface-container-low p-10">
          <h2 className="mb-8 flex items-center gap-3 text-2xl font-bold text-white">
            <ListChecks className="h-6 w-6 text-primary" />
            {content.actionsTitle}
          </h2>
          <div className="space-y-6">
            {content.actions.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-bold text-primary">
                  {item.id}
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-white">{item.title}</h3>
                  <p className="text-xs leading-6 text-on-surface-variant">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-12 w-full rounded-full bg-signature py-4 font-bold text-on-primary transition-all hover:shadow-[0_0_30px_rgba(222,204,253,0.3)]">
            {content.exportLabel}
          </button>
        </article>
      </section>

      <section className="glass-panel relative overflow-hidden rounded-[40px] border-white/5 p-12">
        <div className="absolute left-8 top-8 h-40 w-40 bg-primary/20 blur-[80px]" />
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative min-h-[18rem] rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(222,204,253,0.16),transparent_18%),radial-gradient(circle_at_70%_35%,rgba(194,160,252,0.14),transparent_22%),linear-gradient(180deg,rgba(31,31,34,0.95),rgba(19,19,21,0.85))] p-8 shadow-2xl">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{content.surfaceTitle}</p>
                <p className="text-xs uppercase tracking-widest text-slate-500">{content.surfaceEyebrow}</p>
              </div>
              <Sparkles className="h-7 w-7 text-primary" />
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <FileCheck2 className="h-3.5 w-3.5" />
                  {content.evidenceQuality}
                </div>
                <p className="text-sm leading-6 text-slate-300">{content.evidenceText}</p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-secondary">
                  <Activity className="h-3.5 w-3.5" />
                  {content.uxImpact}
                </div>
                <p className="text-sm leading-6 text-slate-300">{content.uxImpactText}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold tracking-tight text-white">{content.consistencyTitle}</h2>
            <p className="text-lg font-light leading-relaxed text-on-surface-variant">
              {content.consistencyText}
            </p>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface">
                <SwatchBook className="h-5 w-5 text-primary" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface">
                <CircleGauge className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
