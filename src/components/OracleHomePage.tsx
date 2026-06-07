// ||| /main: Aetheris landing dashboard
// Entry point for the Aetheris system.
// Hero, explainability flow and product entry points.
// Chat: /oracle (BeatriceChatPage).

import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Boxes,
  ChevronRight,
  FileText,
  History,
  Layers,
  Lightbulb,
  MessageSquare,
  Play,
  RefreshCw,
  Accessibility,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

// ─── Locale copy ──────────────────────────────────────────────────────────
const COPY: Record<Locale, {
  greeting: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  ctaAsk: string;
  ctaHow: string;
  institutionalDescription: string;
  valueProps: { title: string; sub: string; icon: React.ElementType }[];
  exampleQuestionsLabel: string;
  exampleQuestions: string[];
  flowTitle: string;
  flowSteps: string[];
  confidenceText: string;
  diagramNodes: { label: string; icon: React.ElementType }[];
  startHereEyebrow: string;
  startHere: string;
  startHereDescription: string;
  cards: { title: string; desc: string; icon: React.ElementType; to: string }[];
  aboutTitle: string;
  aboutDesc: string;
  aboutBullets: string[];
  statusTitle: string;
  statusOk: string;
  surfacesTitle: string;
  surfaces: { label: string; to: string; icon: React.ElementType }[];
}> = {
  "pt-BR": {
    greeting: "Bem-vindo ao Aetheris.",
    title: "Transforme documentação de design system",
    titleAccent: "em decisões explicáveis.",
    subtitle:
      "O Oráculo conecta componentes, padrões, diretrizes e decisões documentadas para gerar respostas contextualizadas, rastreáveis e acessíveis.",
    ctaAsk: "Perguntar à Beatrice",
    ctaHow: "Entender o funcionamento",
    institutionalDescription:
      "Aetheris é o design system que estrutura a base de conhecimento usada pela Beatrice para responder dúvidas sobre componentes, padrões, diretrizes, decisões e acessibilidade.",
    valueProps: [
      { icon: Boxes, title: "Documentação estruturada", sub: "Componentes, padrões e diretrizes" },
      { icon: Shield, title: "Conhecimento rastreável", sub: "Fontes atualizadas e versionadas" },
      { icon: BrainCircuit, title: "Respostas explicáveis", sub: "Contexto, justificativa e confiança" },
    ],
    exampleQuestionsLabel: "Exemplos de perguntas",
    exampleQuestions: [
      "Qual componente devo usar para uma ação destrutiva em um fluxo de pagamento?",
      "Quando usar um drawer em vez de um modal?",
      "Qual padrão ajuda a estruturar um onboarding?",
      "Como justificar uma decisão de acessibilidade?",
    ],
    flowTitle: "Como a Beatrice responde",
    flowSteps: [
      "Pergunta do usuário",
      "Recuperação no Aetheris",
      "Fontes relevantes",
      "Resposta explicável",
      "Confiança e rastreabilidade",
    ],
    confidenceText:
      "Cada resposta pode apresentar fonte, contexto de uso, justificativa e nível de confiança.",
    diagramNodes: [
      { label: "Componentes", icon: Boxes },
      { label: "Padrões", icon: Layers },
      { label: "Diretrizes", icon: Shield },
      { label: "Decisões", icon: BrainCircuit },
    ],
    startHereEyebrow: "Explorar o Aetheris",
    startHere: "Comece por aqui",
    startHereDescription: "Escolha uma entrada para explorar a base ou conversar com a Beatrice.",
    cards: [
      { title: "Buscar componente", desc: "Encontre diretrizes, padrões e componentes acessíveis.", icon: Search, to: "/components" },
      { title: "Explorar diretrizes", desc: "Navegue pelas diretrizes de acessibilidade e boas práticas.", icon: FileText, to: "/foundations?focus=manifesto" },
      { title: "Entender decisões", desc: "Veja como as respostas são construídas e justificadas.", icon: Lightbulb, to: "/reasoning" },
      { title: "Ver histórico", desc: "Acesse suas buscas, análises e decisões anteriores.", icon: History, to: "/oracle" },
    ],
    aboutTitle: "SOBRE O ORÁCULO",
    aboutDesc:
      "A Beatrice consulta a base estruturada do Aetheris para relacionar evidências, contexto de uso e critérios de acessibilidade antes de formular uma resposta.",
    aboutBullets: [
      "Fontes relevantes",
      "Contexto de uso",
      "Justificativa da decisão",
      "Nível de confiança",
      "Critérios de acessibilidade",
    ],
    statusTitle: "STATUS DO SISTEMA",
    statusOk: "Todos os serviços operacionais",
    surfacesTitle: "SUPERFÍCIES COGNITIVAS",
    surfaces: [
      { label: "Raciocínio", to: "/reasoning", icon: BrainCircuit },
      { label: "Foundations", to: "/foundations", icon: Boxes },
      { label: "Avaliação", to: "/evaluation", icon: Activity },
    ],
  },
  "pt-PT": {
    greeting: "Bem-vindo ao Aetheris.",
    title: "Transforme documentação de design system",
    titleAccent: "em decisões explicáveis.",
    subtitle:
      "O Oráculo liga componentes, padrões, diretrizes e decisões documentadas para gerar respostas contextualizadas, rastreáveis e acessíveis.",
    ctaAsk: "Perguntar à Beatrice",
    ctaHow: "Entender o funcionamento",
    institutionalDescription:
      "Aetheris é o design system que estrutura a base de conhecimento utilizada pela Beatrice para responder a questões sobre componentes, padrões, diretrizes, decisões e acessibilidade.",
    valueProps: [
      { icon: Boxes, title: "Documentação estruturada", sub: "Componentes, padrões e diretrizes" },
      { icon: Shield, title: "Conhecimento rastreável", sub: "Fontes atualizadas e versionadas" },
      { icon: BrainCircuit, title: "Respostas explicáveis", sub: "Contexto, justificação e confiança" },
    ],
    exampleQuestionsLabel: "Exemplos de perguntas",
    exampleQuestions: [
      "Que componente devo utilizar para uma ação destrutiva num fluxo de pagamento?",
      "Quando utilizar um drawer em vez de um modal?",
      "Que padrão ajuda a estruturar um onboarding?",
      "Como justificar uma decisão de acessibilidade?",
    ],
    flowTitle: "Como a Beatrice responde",
    flowSteps: [
      "Pergunta do utilizador",
      "Recuperação no Aetheris",
      "Fontes relevantes",
      "Resposta explicável",
      "Confiança e rastreabilidade",
    ],
    confidenceText:
      "Cada resposta pode apresentar fonte, contexto de utilização, justificação e nível de confiança.",
    diagramNodes: [
      { label: "Componentes", icon: Boxes },
      { label: "Padrões", icon: Layers },
      { label: "Diretrizes", icon: Shield },
      { label: "Decisões", icon: BrainCircuit },
    ],
    startHereEyebrow: "Explorar o Aetheris",
    startHere: "Comece por aqui",
    startHereDescription: "Escolha uma entrada para explorar a base ou conversar com a Beatrice.",
    cards: [
      { title: "Procurar componente", desc: "Encontre diretrizes, padrões e componentes acessíveis.", icon: Search, to: "/components" },
      { title: "Explorar diretrizes", desc: "Navegue pelas diretrizes de acessibilidade e boas práticas.", icon: FileText, to: "/foundations?focus=manifesto" },
      { title: "Entender decisões", desc: "Veja como as respostas são construídas e justificadas.", icon: Lightbulb, to: "/reasoning" },
      { title: "Ver histórico", desc: "Aceda às suas pesquisas, análises e decisões anteriores.", icon: History, to: "/oracle" },
    ],
    aboutTitle: "SOBRE O ORÁCULO",
    aboutDesc:
      "A Beatrice consulta a base estruturada do Aetheris para relacionar evidências, contexto de utilização e critérios de acessibilidade antes de formular uma resposta.",
    aboutBullets: [
      "Fontes relevantes",
      "Contexto de utilização",
      "Justificação da decisão",
      "Nível de confiança",
      "Critérios de acessibilidade",
    ],
    statusTitle: "ESTADO DO SISTEMA",
    statusOk: "Todos os serviços operacionais",
    surfacesTitle: "SUPERFÍCIES COGNITIVAS",
    surfaces: [
      { label: "Raciocínio", to: "/reasoning", icon: BrainCircuit },
      { label: "Foundations", to: "/foundations", icon: Boxes },
      { label: "Avaliação", to: "/evaluation", icon: Activity },
    ],
  },
  "en-US": {
    greeting: "Welcome to Aetheris.",
    title: "Turn design system documentation",
    titleAccent: "into explainable decisions.",
    subtitle:
      "The Oracle connects components, patterns, guidelines and documented decisions to generate contextualized, traceable and accessible answers.",
    ctaAsk: "Ask Beatrice",
    ctaHow: "Understand how it works",
    institutionalDescription:
      "Aetheris is the design system that structures the knowledge base Beatrice uses to answer questions about components, patterns, guidelines, decisions and accessibility.",
    valueProps: [
      { icon: Boxes, title: "Structured documentation", sub: "Components, patterns and guidelines" },
      { icon: Shield, title: "Traceable knowledge", sub: "Current, versioned sources" },
      { icon: BrainCircuit, title: "Explainable answers", sub: "Context, rationale and confidence" },
    ],
    exampleQuestionsLabel: "Example questions",
    exampleQuestions: [
      "Which component should I use for a destructive action in a payment flow?",
      "When should I use a drawer instead of a modal?",
      "Which pattern helps structure an onboarding flow?",
      "How can I justify an accessibility decision?",
    ],
    flowTitle: "How Beatrice answers",
    flowSteps: [
      "User question",
      "Retrieval from Aetheris",
      "Relevant sources",
      "Explainable answer",
      "Confidence and traceability",
    ],
    confidenceText:
      "Each answer can present its source, usage context, rationale and confidence level.",
    diagramNodes: [
      { label: "Components", icon: Boxes },
      { label: "Patterns", icon: Layers },
      { label: "Guidelines", icon: Shield },
      { label: "Decisions", icon: BrainCircuit },
    ],
    startHereEyebrow: "Explore Aetheris",
    startHere: "Get started",
    startHereDescription: "Choose an entry point to explore the knowledge base or talk to Beatrice.",
    cards: [
      { title: "Search component", desc: "Find guidelines, patterns and accessible components.", icon: Search, to: "/components" },
      { title: "Explore guidelines", desc: "Browse accessibility guidelines and best practices.", icon: FileText, to: "/foundations?focus=manifesto" },
      { title: "Understand decisions", desc: "See how answers are constructed and justified.", icon: Lightbulb, to: "/reasoning" },
      { title: "View history", desc: "Access your previous searches, analyses and decisions.", icon: History, to: "/oracle" },
    ],
    aboutTitle: "ABOUT THE ORACLE",
    aboutDesc:
      "Beatrice consults the structured Aetheris knowledge base to connect evidence, usage context and accessibility criteria before composing an answer.",
    aboutBullets: [
      "Relevant sources",
      "Usage context",
      "Decision rationale",
      "Confidence level",
      "Accessibility criteria",
    ],
    statusTitle: "SYSTEM STATUS",
    statusOk: "All services operational",
    surfacesTitle: "COGNITIVE SURFACES",
    surfaces: [
      { label: "Reasoning", to: "/reasoning", icon: BrainCircuit },
      { label: "Foundations", to: "/foundations", icon: Boxes },
      { label: "Evaluation", to: "/evaluation", icon: Activity },
    ],
  },
};

const BULLET_ICONS: React.ElementType[] = [Search, BrainCircuit, Lightbulb, RefreshCw, Accessibility];
const FLOW_ICONS: React.ElementType[] = [MessageSquare, Search, FileText, BrainCircuit, Shield];

// ─── Orbital Diagram ───────────────────────────────────────────────────────
function OrbitalDiagram({ nodes }: { nodes: { label: string; icon: React.ElementType }[] }) {
  const positions = [
    "absolute top-3 left-1/2 -translate-x-1/2",
    "absolute right-3 top-1/2 -translate-y-1/2",
    "absolute bottom-3 left-1/2 -translate-x-1/2",
    "absolute left-3 top-1/2 -translate-y-1/2",
  ];

  return (
    <div className="relative mx-auto h-[300px] w-[300px] shrink-0 lg:h-[320px] lg:w-[320px]">
      <div className="absolute inset-8 rounded-full border border-primary/10 shadow-[0_0_40px_rgba(194,160,252,0.06)]" />
      <div className="absolute inset-16 rounded-full border border-primary/15" />

      {[0, 90, 180, 270].map((deg) => (
        <div
          key={deg}
          className="absolute h-1.5 w-1.5 rounded-full bg-primary/40"
          style={{
            left: "50%",
            top: "50%",
            transform: `rotate(${deg}deg) translateX(72px) translateY(-50%) rotate(-${deg}deg)`,
          }}
        />
      ))}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-[radial-gradient(ellipse_at_center,rgba(194,160,252,0.25),rgba(194,160,252,0.05))] shadow-[0_0_32px_rgba(194,160,252,0.3),inset_0_0_20px_rgba(194,160,252,0.1)]">
          <img
            src="/aetheris.png"
            alt="Aetheris"
            className="h-10 w-10 object-contain drop-shadow-[0_0_12px_rgba(194,160,252,0.7)]"
          />
          <div
            className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-30"
            style={{ animationDuration: "3s" }}
          />
        </div>
      </div>

      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <div key={node.label} className={`${positions[i]} flex flex-col items-center gap-1.5`}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-surface-container-highest/80 shadow-[0_0_16px_rgba(194,160,252,0.12)] backdrop-blur-sm">
              <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
            </div>
            <span className="whitespace-nowrap rounded-full border border-white/8 bg-background/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 backdrop-blur-sm">
              {node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Quick-start Card ─────────────────────────────────────────────────────
function QuickCard({ icon: Icon, title, desc, to }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group block h-full rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex h-full min-h-44 flex-col justify-between gap-5 rounded-[22px] border border-white/[0.1] bg-surface-container-high/75 p-6 backdrop-blur-xl transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/25 group-hover:bg-surface-container-highest/70 group-hover:shadow-[0_18px_45px_rgba(8,7,12,0.28)]">
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-primary/20 bg-primary/[0.07]">
            <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
          </div>
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 text-slate-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <div>
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{desc}</p>
        </div>
      </div>
    </Link>
  );
}

function BeatriceResponseFlow({
  title,
  steps,
  confidenceText,
}: {
  title: string;
  steps: string[];
  confidenceText: string;
}) {
  return (
    <section
      aria-labelledby="beatrice-response-flow-title"
      className="relative isolate overflow-hidden rounded-[26px] border border-primary/[0.18] bg-surface-container-high/55 p-5 shadow-[0_22px_60px_rgba(9,7,14,0.28),inset_0_1px_0_rgba(222,204,253,0.08)] backdrop-blur-3xl sm:p-6"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_16%_0%,rgba(194,160,252,0.18),transparent_42%),radial-gradient(ellipse_at_88%_100%,rgba(222,204,253,0.07),transparent_42%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
            RAG + XAI
          </p>
          <h2 id="beatrice-response-flow-title" className="mt-1.5 text-xl font-semibold tracking-tight text-white">
            {title}
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-slate-300">{confidenceText}</p>
      </div>

      <ol className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        {steps.map((step, index) => {
          const Icon = FLOW_ICONS[index] ?? BrainCircuit;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step}
              className="relative flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.09] bg-background/35 px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] last:col-span-2 lg:last:col-span-1"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/[0.07]">
                <Icon aria-hidden="true" className="h-3.5 w-3.5 text-primary/80" />
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[9px] text-slate-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-xs font-medium leading-4 text-slate-300">{step}</p>
              </div>
              {!isLast ? (
                <ChevronRight
                  aria-hidden="true"
                  className="absolute -right-2.5 top-1/2 z-10 hidden h-4 w-4 -translate-y-1/2 text-primary/25 lg:block"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export function OracleHomePage() {
  const { locale } = useI18n();
  const copy = COPY[locale];

  return (
    <div className="min-h-[calc(100vh-80px)] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">

        {/* ─── Aetheris Design System banner ───────────────────────── */}
        <div className="glass-card flex flex-col gap-6 rounded-2xl p-5 md:p-6 xl:flex-row xl:items-center xl:gap-8">
          {/* Identity */}
          <div className="flex shrink-0 items-center gap-4">
            <img
              src="/aetheris.png"
              alt="Aetheris"
              className="h-12 w-12 object-contain drop-shadow-[0_0_16px_rgba(194,160,252,0.5)]"
            />
            <div>
              <p className="text-base font-black tracking-[0.28em] text-primary">AETHERIS</p>
              <span className="mt-0.5 inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                DESIGN SYSTEM
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden w-px self-stretch bg-white/[0.07] xl:block" />

          {/* Description */}
          <p className="max-w-2xl flex-1 text-sm leading-6 text-slate-300 xl:max-w-[430px]">
            {copy.institutionalDescription}
          </p>

          {/* Divider */}
          <div className="hidden w-px self-stretch bg-white/[0.07] xl:block" />

          {/* Value props */}
          <div className="grid gap-4 sm:grid-cols-3 xl:flex xl:flex-wrap xl:gap-6">
            {copy.valueProps.map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-primary/15 bg-primary/8">
                  <Icon aria-hidden="true" className="h-3.5 w-3.5 text-primary/80" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{title}</p>
                  <p className="text-[11px] text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Main content and contextual rail ────────────────────── */}
        <div className="grid items-stretch gap-6 xl:grid-cols-[minmax(0,1fr)_18rem] xl:gap-8">

        {/* ─── Main column ─────────────────────────────────────────── */}
        <div className="flex min-w-0 flex-col gap-8">

          {/* Hero */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
            <div className="flex-1">
              <p className="mb-3 text-sm font-semibold text-white">{copy.greeting}</p>
              <h1 className="max-w-2xl text-3xl font-black tracking-tight text-white [text-wrap:balance] md:text-4xl">
                {copy.title}{" "}
                <span className="bg-gradient-to-r from-primary to-violet-300 bg-clip-text text-transparent">
                  {copy.titleAccent}
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">{copy.subtitle}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/oracle"
                  className="inline-flex items-center gap-2 rounded-full bg-signature px-5 py-3 text-xs font-bold uppercase tracking-widest text-on-primary transition-all hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                  {copy.ctaAsk}
                </Link>
                <Link
                  to="/reasoning"
                  className="glass-card inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all hover:border-primary/25 hover:text-white active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Play aria-hidden="true" className="h-3.5 w-3.5" />
                  {copy.ctaHow}
                </Link>
              </div>
              <div className="mt-6 max-w-2xl">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  {copy.exampleQuestionsLabel}
                </p>
                <ul
                  aria-label={copy.exampleQuestionsLabel}
                  className="grid gap-2 sm:grid-cols-2"
                >
                  {copy.exampleQuestions.map((question) => (
                    <li
                      key={question}
                      className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[11px] leading-4 text-slate-400"
                    >
                      {question}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <OrbitalDiagram nodes={copy.diagramNodes} />
          </div>

          <BeatriceResponseFlow
            title={copy.flowTitle}
            steps={copy.flowSteps}
            confidenceText={copy.confidenceText}
          />

          {/* Quick-start cards */}
          <section
            aria-labelledby="start-here-title"
            data-testid="start-here-section"
            className="pt-2"
          >
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  {copy.startHereEyebrow}
                </p>
                <h2
                  id="start-here-title"
                  className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                >
                  {copy.startHere}
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-slate-400">
                {copy.startHereDescription}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {copy.cards.map((card) => (
                <QuickCard key={card.title} icon={card.icon} title={card.title} desc={card.desc} to={card.to} />
              ))}
            </div>
          </section>
        </div>

        {/* ─── Right contextual panel (xl only) ────────────────────── */}
        <aside
          data-testid="home-context-rail"
          className="hidden min-h-0 grid-rows-2 gap-4 xl:grid"
        >
          <div className="glass-card h-full rounded-2xl p-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{copy.aboutTitle}</p>
            <p className="text-xs leading-6 text-slate-400">{copy.aboutDesc}</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {copy.aboutBullets.map((bullet, i) => {
                const BulletIcon = BULLET_ICONS[i] ?? Activity;
                return (
                  <li key={bullet} className="flex items-center gap-2.5 text-xs text-slate-400">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/15 bg-primary/8">
                      <BulletIcon aria-hidden="true" className="h-3 w-3 text-primary/70" />
                    </div>
                    {bullet}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Aetheris Design System stats card */}
          <div className="glass-card flex h-full flex-col rounded-2xl p-5">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                AETHERIS DESIGN SYSTEM
              </p>
              <span className="rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
                v2.4.0
              </span>
            </div>

            {/* Stack illustration */}
            <div className="mb-5 flex justify-center">
              <div className="relative h-14 w-16">
                <div className="absolute bottom-0 left-3 h-8 w-14 rounded-lg border border-primary/12 bg-primary/5" />
                <div className="absolute bottom-2.5 left-1.5 h-8 w-14 rounded-lg border border-primary/18 bg-primary/8" />
                <div className="absolute bottom-5 left-0 flex h-8 w-14 items-center justify-center rounded-lg border border-primary/30 bg-[radial-gradient(ellipse_at_center,rgba(194,160,252,0.18),rgba(194,160,252,0.04))] shadow-[0_0_18px_rgba(194,160,252,0.2)]">
                  <Layers aria-hidden="true" className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="mb-5 grid grid-cols-2 gap-3">
              {[
                { value: "25", label: "Componentes principais" },
                { value: "48",  label: "Padrões" },
                { value: "124", label: "Diretrizes" },
                { value: "12",  label: "Templates" },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/foundations"
              className="group mt-auto flex w-full items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 text-xs font-semibold text-primary transition-all hover:border-primary/30 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <span>Explorar o design system</span>
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </aside>
        </div>{/* end main content grid */}
      </div>
    </div>
  );
}
