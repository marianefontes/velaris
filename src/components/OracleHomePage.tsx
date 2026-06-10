// ||| /main: Velaris landing with Abraxos as the visible oracle.
// Hero centers consultation; the knowledge core orbits Abraxos as convergence point.
// Consultation route: /oracle.

import {
  ArrowRight,
  Boxes,
  BrainCircuit,
  FileText,
  Layers,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import { MeshGradientBg } from "./MeshGradientBg";
import { AbraxosKnowledgeCore } from "./presence/AbraxosKnowledgeCore";
import { AskBeatriceBar } from "./presence/AskBeatriceBar";

// Locale copy — Velaris leads as platform; Abraxos appears as integrated guide.
const COPY: Record<Locale, {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  libraryTitle: string;
  seeAll: string;
  heroStatus: string;
  askLabel: string;
  askPlaceholder: string;
  askSubmit: string;
  refreshSuggestions: string;
  suggestions: string[];
  orbitNodes: { icon: React.ElementType; label: string; to: string }[];
  cards: { title: string; desc: string; icon: React.ElementType; to: string }[];
  flowTitle: string;
  flowSteps: { title: string; desc: string }[];
}> = {
  "pt-BR": {
    eyebrow: "Velaris · Design System Intelligence",
    titleLine1: "Conhecimento que se conecta.",
    titleLine2: "Decisões que fazem sentido.",
    subtitle:
      "Velaris reúne componentes, padrões, diretrizes, decisões e evidências numa biblioteca viva de Design System Intelligence. Abraxos, o oráculo integrado, percorre esse conhecimento para orientar escolhas confiáveis e rastreáveis.",
    libraryTitle: "Explorar a biblioteca",
    seeAll: "Ver tudo",
    heroStatus: "Abraxos conectado · 25 componentes · 48 padrões · 124 diretrizes · 318 decisões",
    askLabel: "Consultar Abraxos",
    askPlaceholder: "Consulte Abraxos sobre componentes, padrões, diretrizes...",
    askSubmit: "Enviar pergunta",
    refreshSuggestions: "Ver outras sugestões",
    suggestions: [
      "Qual componente usar para tabela?",
      "Quando usar um drawer?",
      "Como justificar uma decisão?",
      "Qual padrão para um onboarding?",
      "Como documentar acessibilidade?",
      "Quando usar modal em pagamentos?",
    ],
    orbitNodes: [
      { icon: Boxes, label: "Componentes", to: "/components" },
      { icon: Shield, label: "Diretrizes", to: "/foundations?focus=manifesto" },
      { icon: BrainCircuit, label: "Decisões", to: "/reasoning" },
      { icon: Layers, label: "Padrões", to: "/foundations?focus=patterns" },
    ],
    cards: [
      { title: "Explorar componentes", desc: "Encontre e entenda componentes acessíveis e consistentes.", icon: Boxes, to: "/components" },
      { title: "Explorar padrões", desc: "Boas práticas reutilizáveis e consistentes.", icon: Layers, to: "/foundations?focus=patterns" },
      { title: "Navegar diretrizes", desc: "Acessibilidade, uso e conformidade.", icon: Shield, to: "/foundations?focus=manifesto" },
      { title: "Entender decisões", desc: "Veja como decisões foram tomadas e justificadas.", icon: BrainCircuit, to: "/reasoning" },
    ],
    flowTitle: "Como Abraxos responde",
    flowSteps: [
      { title: "Entendimento", desc: "Interpreta a pergunta dentro do contexto do Velaris." },
      { title: "Recuperação", desc: "Recupera evidências da biblioteca de conhecimento." },
      { title: "Contexto", desc: "Conecta informações e relaciona com boas práticas." },
      { title: "Raciocínio", desc: "Analisa, compara e constrói a melhor orientação." },
      { title: "Resposta", desc: "Entrega uma resposta explicável, justificada e rastreável." },
    ],
  },
  "pt-PT": {
    eyebrow: "Velaris · Design System Intelligence",
    titleLine1: "Conhecimento que se conecta.",
    titleLine2: "Decisões que fazem sentido.",
    subtitle:
      "O Velaris reúne componentes, padrões, diretrizes, decisões e evidências numa biblioteca viva de Design System Intelligence. Abraxos, o oráculo integrado, percorre esse conhecimento para orientar escolhas fiáveis e rastreáveis.",
    libraryTitle: "Explorar a biblioteca",
    seeAll: "Ver tudo",
    heroStatus: "Abraxos conectado · 25 componentes · 48 padrões · 124 diretrizes · 318 decisões",
    askLabel: "Consultar Abraxos",
    askPlaceholder: "Consulte Abraxos sobre componentes, padrões, diretrizes...",
    askSubmit: "Enviar pergunta",
    refreshSuggestions: "Ver outras sugestões",
    suggestions: [
      "Que componente utilizar para tabela?",
      "Quando utilizar um drawer?",
      "Como justificar uma decisão?",
      "Que padrão para um onboarding?",
      "Como documentar acessibilidade?",
      "Quando utilizar modal em pagamentos?",
    ],
    orbitNodes: [
      { icon: Boxes, label: "Componentes", to: "/components" },
      { icon: Shield, label: "Diretrizes", to: "/foundations?focus=manifesto" },
      { icon: BrainCircuit, label: "Decisões", to: "/reasoning" },
      { icon: Layers, label: "Padrões", to: "/foundations?focus=patterns" },
    ],
    cards: [
      { title: "Explorar componentes", desc: "Encontre e entenda componentes acessíveis e consistentes.", icon: Boxes, to: "/components" },
      { title: "Explorar padrões", desc: "Boas práticas reutilizáveis e consistentes.", icon: Layers, to: "/foundations?focus=patterns" },
      { title: "Navegar diretrizes", desc: "Acessibilidade, utilização e conformidade.", icon: Shield, to: "/foundations?focus=manifesto" },
      { title: "Entender decisões", desc: "Veja como as decisões foram tomadas e justificadas.", icon: BrainCircuit, to: "/reasoning" },
    ],
    flowTitle: "Como Abraxos responde",
    flowSteps: [
      { title: "Entendimento", desc: "Interpreta a pergunta dentro do contexto do Velaris." },
      { title: "Recuperação", desc: "Recupera evidências da biblioteca de conhecimento." },
      { title: "Contexto", desc: "Conecta informações e relaciona com boas práticas." },
      { title: "Raciocínio", desc: "Analisa, compara e constrói a melhor orientação." },
      { title: "Resposta", desc: "Entrega uma resposta explicável, justificada e rastreável." },
    ],
  },
  "en-US": {
    eyebrow: "Velaris · Design System Intelligence",
    titleLine1: "Knowledge that connects.",
    titleLine2: "Decisions that make sense.",
    subtitle:
      "Velaris gathers components, patterns, guidelines, decisions and evidence in a living Design System Intelligence library. Abraxos, the integrated oracle, navigates this knowledge to guide reliable, traceable choices.",
    libraryTitle: "Explore the library",
    seeAll: "See all",
    heroStatus: "Abraxos connected · 25 components · 48 patterns · 124 guidelines · 318 decisions",
    askLabel: "Consult Abraxos",
    askPlaceholder: "Ask Abraxos about components, patterns, guidelines...",
    askSubmit: "Send question",
    refreshSuggestions: "Show other suggestions",
    suggestions: [
      "Which component for a table?",
      "When should I use a drawer?",
      "How do I justify a decision?",
      "Which pattern for onboarding?",
      "How do I document accessibility?",
      "When to use a modal in payments?",
    ],
    orbitNodes: [
      { icon: Boxes, label: "Components", to: "/components" },
      { icon: Shield, label: "Guidelines", to: "/foundations?focus=manifesto" },
      { icon: BrainCircuit, label: "Decisions", to: "/reasoning" },
      { icon: Layers, label: "Patterns", to: "/foundations?focus=patterns" },
    ],
    cards: [
      { title: "Explore components", desc: "Find and understand accessible, consistent components.", icon: Boxes, to: "/components" },
      { title: "Explore patterns", desc: "Reusable, consistent best practices.", icon: Layers, to: "/foundations?focus=patterns" },
      { title: "Browse guidelines", desc: "Accessibility, usage and compliance.", icon: Shield, to: "/foundations?focus=manifesto" },
      { title: "Understand decisions", desc: "See how decisions were made and justified.", icon: BrainCircuit, to: "/reasoning" },
    ],
    flowTitle: "How Abraxos answers",
    flowSteps: [
      { title: "Understanding", desc: "Interprets the question within Velaris context." },
      { title: "Retrieval", desc: "Retrieves evidence from the knowledge library." },
      { title: "Context", desc: "Connects information and relates it to best practices." },
      { title: "Reasoning", desc: "Analyzes, compares and builds the best guidance." },
      { title: "Answer", desc: "Delivers an explainable, justified and traceable answer." },
    ],
  },
};

const FLOW_ICONS: React.ElementType[] = [MessageSquare, Search, FileText, BrainCircuit, Sparkles];

// Premium library entry card — secondary navigation, not dashboard tiles
function EntryCard({ icon: Icon, title, desc, to }: {
  icon: React.ElementType;
  title: string;
  desc: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group block h-full rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative flex h-full items-center gap-4 overflow-hidden rounded-[18px] border border-white/[0.05] bg-gradient-to-br from-white/[0.035] via-surface-container-high/30 to-transparent p-4 backdrop-blur-xl transition-all duration-300 group-hover:border-white/[0.09] group-hover:shadow-[0_12px_40px_rgba(8,7,12,0.35),inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <Icon aria-hidden="true" className="h-[17px] w-[17px] text-primary/85" />
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-5 text-white/90">{title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{desc}</p>
        </div>
        <ArrowRight
          aria-hidden="true"
          className="relative h-3.5 w-3.5 shrink-0 text-slate-600 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary/70"
        />
      </div>
    </Link>
  );
}

// Abraxos response flow — explains how the oracle navigates Velaris knowledge
function AbraxosResponseFlow({ title, steps }: {
  title: string;
  steps: { title: string; desc: string }[];
}) {
  return (
    <section
      aria-labelledby="abraxos-response-flow-title"
      className="relative isolate overflow-hidden rounded-[26px] border border-white/[0.08] bg-surface-container-high/40 p-6 backdrop-blur-2xl sm:p-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      />
      <h2
        id="abraxos-response-flow-title"
        className="text-[11px] font-bold uppercase tracking-[0.28em] text-primary/80"
      >
        {title}
      </h2>

      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
        {steps.map((step, index) => {
          const Icon = FLOW_ICONS[index] ?? BrainCircuit;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.title} className="relative flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary/25 bg-primary/[0.06] shadow-[0_0_18px_rgba(194,160,252,0.12)]">
                  <Icon aria-hidden="true" className="h-[18px] w-[18px] text-primary/90" />
                </div>
                {!isLast ? (
                  <div
                    aria-hidden="true"
                    className="absolute left-full top-1/2 hidden h-px w-4 -translate-y-1/2 border-t border-dashed border-primary/25 lg:block"
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <span className="font-mono text-[10px] text-primary/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-semibold leading-5 text-white">{step.title}</p>
                <p className="mt-1.5 text-xs leading-5 text-slate-400">{step.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

// Page
export function OracleHomePage() {
  const { locale } = useI18n();
  const copy = COPY[locale];

  return (
    <div className="relative min-h-[calc(100dvh-80px)] overflow-x-clip px-4 py-8 md:px-8 md:py-12">
      <MeshGradientBg />
      <div className="relative z-[1] mx-auto flex w-full max-w-[1400px] flex-col gap-12 lg:gap-14">

        {/* Hero — consultation first, Abraxos nucleus second */}
        <section aria-label="Velaris" className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="flex flex-col justify-center lg:py-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-primary">
              {copy.eyebrow}
            </p>
            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white [text-wrap:balance] md:text-[2.75rem] md:leading-[1.12]">
              {copy.titleLine1}{" "}
              <span className="block text-primary">{copy.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-slate-400 md:text-[15px] md:leading-7">
              {copy.subtitle}
            </p>

            <div className="mt-10">
              <AskBeatriceBar
                label={copy.askLabel}
                placeholder={copy.askPlaceholder}
                submitLabel={copy.askSubmit}
                suggestions={copy.suggestions}
                refreshLabel={copy.refreshSuggestions}
              />
            </div>

            <p className="mt-6 text-[11px] leading-5 tracking-wide text-slate-500">
              {copy.heroStatus}
            </p>
          </div>

          <div className="flex items-center justify-center lg:justify-end lg:pr-4">
            <AbraxosKnowledgeCore nodes={copy.orbitNodes} />
          </div>
        </section>

        {/* Library — secondary navigation */}
        <section
          aria-labelledby="velaris-library-title"
          data-testid="start-here-section"
          className="border-t border-white/[0.04] pt-10"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2
                id="velaris-library-title"
                className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-600"
              >
                {copy.libraryTitle}
              </h2>
              <div aria-hidden="true" className="mt-2.5 h-px w-7 bg-primary/35" />
            </div>
            <Link
              to="/foundations"
              className="shrink-0 text-xs text-slate-500 transition-colors hover:text-primary/80"
            >
              {copy.seeAll}
              <span aria-hidden="true"> →</span>
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {copy.cards.map((card) => (
              <EntryCard
                key={card.title}
                icon={card.icon}
                title={card.title}
                desc={card.desc}
                to={card.to}
              />
            ))}
          </div>
        </section>

        <AbraxosResponseFlow title={copy.flowTitle} steps={copy.flowSteps} />
      </div>
    </div>
  );
}
