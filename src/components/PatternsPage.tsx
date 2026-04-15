import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
  Bot,
  BrainCircuit,
  CircleDot,
  Database,
  FileClock,
  Filter,
  Focus,
  LayoutDashboard,
  ListTree,
  Rocket,
  SearchCheck,
  Settings2,
  TerminalSquare,
  Users,
} from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface HighlightStat {
  label: string;
  value: string;
  tone: "primary" | "secondary" | "default";
}

interface HeroInsight {
  eyebrow: string;
  text: string;
}

interface PrimaryPattern {
  title: string;
  category: string;
  structure: string;
  logic: string;
  context: string;
  whenNotToUse: string;
  insight: string;
  icon: LucideIcon;
}

interface CompactPattern {
  title: string;
  structure?: string;
  logic?: string;
  context?: string;
  whenNotToUse?: string;
  tradeOffs: string;
  insight: string;
  icon: LucideIcon;
  tag?: string;
}

function getPatternsContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      heroLabel: "The Logic of Interaction",
      heroTitle: "Patterns",
      heroAccent: "Library",
      heroInsight: {
        eyebrow: "Aetheris framing",
        text: "High-level interaction blueprints designed for complex workflows. Every pattern is optimized for assisted navigation and human cognitive load reduction.",
      } satisfies HeroInsight,
      stats: [
        { label: "Blueprints", value: "11", tone: "primary" },
        { label: "Core Flows", value: "6", tone: "secondary" },
        { label: "Cognitive Goal", value: "Clarity", tone: "default" },
      ] satisfies HighlightStat[],
      thesisEyebrow: "Pattern thesis",
      thesisText:
        "The best patterns externalize mental models. They reduce ambiguity, sequence decisions and create enough structure for people to think clearly inside complex systems.",
      labels: {
        structure: "Structure",
        logic: "Logic",
        context: "Context of Use",
        whenNotToUse: "When Not to Use",
        tradeOffs: "Trade-offs",
        insight: "Aetheris Insight",
      },
      primaryPatterns: [
        {
          title: "Dashboard",
          category: "Core Framework",
          structure:
            "Centralized telemetry hub with high-density data visualization and contextual action bars.",
          logic: "Aggregation of disparate data sources into a unified cognitive plane.",
          context: "Monitoring systems, complex SaaS management, and resource oversight.",
          whenNotToUse:
            "Simple task-focused tools or mobile-first consumer apps where focus is singular.",
          insight:
            "Dashboards should breathe. In complex environments, prioritize temporal data: what is happening now over what has happened.",
          icon: LayoutDashboard,
        },
        {
          title: "Multi-step Form",
          category: "Flow Pattern",
          structure:
            "Input fields fragmented into thematic logical blocks, each scoped to a single decision or data group, with persistent progress indication.",
          logic:
            "Reduces overwhelm by sequencing decisions and maintaining momentum through completion.",
          context:
            "Account registration, checkout flows, complex configuration wizards and onboarding sequences with branching logic.",
          whenNotToUse:
            "Simple forms under five fields, related inputs that benefit from simultaneous visibility or quick mobile actions.",
          insight:
            "Focus on momentum. Use predictive pre-fills and inline validation to eliminate cognitive drag between steps.",
          icon: ListTree,
        },
      ] satisfies PrimaryPattern[],
      supportingTitle: "Supporting Patterns",
      supportingBadge: "9 blueprints",
      compactPatterns: [
        {
          title: "Onboarding",
          structure:
            "Progressive disclosure sequence that introduces key features through contextual education without interrupting the primary workflow.",
          context:
            "First-run experiences, post-signup activation, feature discovery after major updates and role-based capability reveals.",
          whenNotToUse:
            "Interfaces that are already self-evident, transactional flows or returning users who already completed setup.",
          tradeOffs:
            "Increases activation and adoption, but becomes easy to skip if it feels generic or detached from user intent.",
          insight:
            "Personalize the path. Show users what they care about first instead of replaying a generic tour.",
          icon: Rocket,
        },
        {
          title: "Data Explorer",
          structure:
            "Dynamic filtering interface with faceted search, drill-down capabilities and cross-dimensional analysis controls over large datasets.",
          logic:
            "Hypothesis-driven exploration where users define queries and the system surfaces relevant subsets.",
          context:
            "Analytics platforms, research tools, inventory systems and BI dashboards with multi-dimensional data.",
          tradeOffs:
            "Extremely powerful for experts, but needs clear affordances, sane defaults and saved views to avoid novice overload.",
          insight:
            "Use semantic search as the primary entry point. A single natural-language query often replaces a chain of manual filters.",
          icon: Database,
        },
        {
          title: "Empty States",
          structure:
            "Intentional placeholder view combining explanation, hierarchy and one primary action scoped to the empty container.",
          logic:
            "Transforms absence into guidance, turning the first interaction with a feature into a conversion moment.",
          context:
            "New accounts, cleared tables, zero-result searches, unconnected integrations and fresh projects.",
          whenNotToUse:
            "Transient loading or background processing, where skeleton screens preserve spatial continuity better.",
          tradeOffs:
            "Excellent for orientation and activation, but weakens trust if it feels decorative instead of actionable.",
          insight:
            "Treat void as opportunity. A clear next step reframes incompleteness as a starting point, not a failure.",
          icon: SearchCheck,
        },
        {
          title: "Settings & Config",
          logic: "Hierarchical nesting of system variables and user preferences.",
          context: "Global application control, preferences, permissions and environment-level tuning.",
          tradeOffs:
            "Powerful and expected, but quickly becomes hostile when high-impact toggles are buried too deep.",
          insight:
            "Configuration is the user's manifesto. Never hide high-impact toggles behind more than two layers of navigation.",
          icon: Settings2,
        },
        {
          title: "Command Center",
          structure:
            "Single-input, modal-driven command surface backed by keyboard shortcuts and semantic matching.",
          tradeOffs:
            "Fastest pattern for experts, but almost invisible to new users without clear onboarding or discoverability cues.",
          insight:
            "Language is the most efficient interface. Every complex app benefits from a text-based shortcut system.",
          icon: TerminalSquare,
        },
        {
          title: "Focus Mode",
          tag: "Attention Pattern",
          structure:
            "A modal or full-screen overlay that isolates a single artifact by collapsing sidebars, notifications and peripheral navigation.",
          logic:
            "Eliminates context switching cost and lowers the cognitive price of sustaining attention on one objective.",
          context:
            "Long-form editors, code reviews, document drafting and design canvases that need prolonged immersion.",
          whenNotToUse:
            "Workflows that depend on simultaneous references, multi-pane awareness or live collaborative context.",
          tradeOffs:
            "Maximizes concentration and quality, but can disorient users if returning to the broader interface is high-friction.",
          insight:
            "Silence is a design decision. A good Focus Mode curates attention instead of merely hiding controls.",
          icon: Focus,
        },
        {
          title: "Collaboration",
          tag: "Multiplayer Pattern",
          structure:
            "Real-time presence indicators, conflict-resolution UI and co-editing primitives layered onto an existing single-user interface.",
          logic:
            "Operational transformation or CRDT-based synchronization turns presence into first-class interface data.",
          context:
            "Collaborative documents, shared canvases, code review sessions and whiteboarding workflows.",
          whenNotToUse:
            "Strict sequential ownership flows, low-latency environments with tight constraints or single-user personal surfaces.",
          tradeOffs:
            "Increases team velocity, but adds significant system complexity and can introduce visual noise in solo tasks.",
          insight:
            "Presence is data. Show what others are editing, not only where they are.",
          icon: Users,
        },
        {
          title: "Timeline",
          tag: "Audit Pattern",
          structure:
            "Chronological log of state mutations, user actions or system events with actor identity, timestamps and restore affordances.",
          logic:
            "Treats every meaningful change as an immutable event, turning time into a navigable axis.",
          context:
            "Version-controlled editors, audit logs, publishing workflows and configuration history surfaces.",
          whenNotToUse:
            "Ephemeral live feeds, trivial interactions or cases where event storage costs outweigh user value.",
          tradeOffs:
            "Builds recovery confidence and trust, but needs careful abstraction to avoid overwhelming non-technical users.",
          insight:
            "Permanent history is more than undo. It gives users permission to take creative risks.",
          icon: FileClock,
        },
        {
          title: "Entity Picker",
          tag: "Selection Pattern",
          structure:
            "Inline or popover search-driven selector for relational entities with type-ahead, multi-select and preview chips.",
          logic:
            "Creates typed references instead of duplicating data, preserving authority in the source context.",
          context:
            "Assignees, tags, mentions, attachments, relationship fields and permission scope selectors.",
          whenNotToUse:
            "Small static option sets or flat values such as booleans, enums and simple colors.",
          tradeOffs:
            "Preserves relational integrity and reduces duplication, but relies on fast backend search and responsive type-ahead UX.",
          insight:
            "Link, don't copy. References preserve authority and allow the system to reason about relationships.",
          icon: ArrowRightLeft,
        },
      ] satisfies CompactPattern[],
      footerEyebrow: "Aetheris Architecture v4.2",
      footerText:
        "The best interface is a mental model made visible. We do not build buttons; we build environments for thought.",
      footerAccent: "environments for thought",
      footerPrimary: "Download Spec",
      footerSecondary: "View Prototypes",
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    heroLabel: isPtPt ? "A lógica da interação" : "A lógica da interação",
    heroTitle: isPtPt ? "Biblioteca de" : "Biblioteca de",
    heroAccent: isPtPt ? "Padrões" : "Padrões",
    heroInsight: {
      eyebrow: "Enquadramento Aetheris",
      text: isPtPt
        ? "Blueprints de interação de alto nível concebidos para workflows complexos. Cada padrão é otimizado para navegação assistida e redução da carga cognitiva humana."
        : "Blueprints de interação de alto nível pensados para fluxos complexos. Cada padrão é otimizado para navegação assistida e redução da carga cognitiva humana.",
    } satisfies HeroInsight,
    stats: [
      { label: "Blueprints", value: "11", tone: "primary" },
      { label: isPtPt ? "Fluxos centrais" : "Fluxos centrais", value: "6", tone: "secondary" },
      { label: isPtPt ? "Meta cognitiva" : "Meta cognitiva", value: "Clareza", tone: "default" },
    ] satisfies HighlightStat[],
    thesisEyebrow: isPtPt ? "Tese do padrão" : "Tese do padrão",
    thesisText: isPtPt
      ? "Os melhores padrões externalizam modelos mentais. Reduzem ambiguidade, sequenciam decisões e criam estrutura suficiente para as pessoas pensarem com clareza em sistemas complexos."
      : "Os melhores padrões externalizam modelos mentais. Reduzem ambiguidade, sequenciam decisões e criam estrutura suficiente para as pessoas pensarem com clareza em sistemas complexos.",
    labels: {
      structure: isPtPt ? "Estrutura" : "Estrutura",
      logic: isPtPt ? "Lógica" : "Lógica",
      context: isPtPt ? "Contexto de uso" : "Contexto de uso",
      whenNotToUse: isPtPt ? "Quando não usar" : "Quando não usar",
      tradeOffs: isPtPt ? "Trade-offs" : "Trade-offs",
      insight: "Aetheris Insight",
    },
    primaryPatterns: [
      {
        title: "Dashboard",
        category: isPtPt ? "Framework central" : "Framework central",
        structure:
          "Hub centralizado de telemetria com visualização de dados de alta densidade e barras de ação contextuais.",
        logic: "Agregação de fontes de dados dispersas num plano cognitivo unificado.",
        context: isPtPt
          ? "Monitorização de sistemas, gestão complexa de SaaS e supervisão de recursos."
          : "Monitoramento de sistemas, gestão complexa de SaaS e supervisão de recursos.",
        whenNotToUse:
          "Ferramentas simples focadas em tarefa ou apps mobile-first de consumo onde o foco é singular.",
        insight:
          "Dashboards precisam respirar. Em ambientes complexos, priorize dados temporais: o que está acontecendo agora acima do que já aconteceu.",
        icon: LayoutDashboard,
      },
      {
        title: isPtPt ? "Formulário multi-etapas" : "Formulário multi-etapas",
        category: isPtPt ? "Padrão de fluxo" : "Padrão de fluxo",
        structure:
          "Campos de input fragmentados em blocos lógicos temáticos, cada um focado numa decisão ou grupo de dados, com progresso persistente.",
        logic:
          "Reduz a sobrecarga ao sequenciar decisões e manter o impulso até à conclusão.",
        context:
          "Registo de conta, checkout, assistentes de configuração complexos e onboarding com lógica ramificada.",
        whenNotToUse:
          "Formulários simples com menos de cinco campos, inputs relacionados que beneficiam de visibilidade simultânea ou ações mobile rápidas.",
        insight:
          "Foque-se no ritmo. Use prefill preditivo e validação inline para eliminar arrasto cognitivo entre etapas.",
        icon: ListTree,
      },
    ] satisfies PrimaryPattern[],
    supportingTitle: isPtPt ? "Padrões de apoio" : "Padrões de apoio",
    supportingBadge: "9 blueprints",
    compactPatterns: [
      {
        title: "Onboarding",
        structure:
          "Sequência de divulgação progressiva que apresenta funcionalidades-chave através de educação contextual sem interromper o workflow principal.",
        context:
          "Primeira utilização, ativação pós-registo, descoberta de funcionalidades após grandes atualizações e revelação de capacidades por perfil.",
        whenNotToUse:
          "Interfaces já autoexplicativas, fluxos transacionais ou utilizadores recorrentes que já concluíram a configuração.",
        tradeOffs:
          "Aumenta ativação e adoção, mas torna-se fácil de ignorar se parecer genérico ou desligado da intenção do utilizador.",
        insight:
          "Personalize o caminho. Mostre primeiro o que importa para a pessoa em vez de repetir um tour genérico.",
        icon: Rocket,
      },
      {
        title: isPtPt ? "Explorador de Dados" : "Explorador de Dados",
        structure:
          "Interface dinâmica de filtragem com pesquisa facetada, drill-down e controlos de análise multidimensional sobre grandes datasets.",
        logic:
          "Exploração guiada por hipótese em que as pessoas definem queries e o sistema revela subconjuntos relevantes.",
        context:
          "Plataformas analíticas, ferramentas de pesquisa, sistemas de inventário e dashboards BI com dados multidimensionais.",
        tradeOffs:
          "Extremamente poderoso para especialistas, mas precisa de affordances claras, defaults sólidos e views guardadas para evitar sobrecarga em iniciantes.",
        insight:
          "Use pesquisa semântica como ponto de entrada principal. Uma query em linguagem natural substitui muitas vezes uma cadeia de filtros manuais.",
        icon: Database,
      },
      {
        title: isPtPt ? "Estados Vazios" : "Estados Vazios",
        structure:
          "Vista placeholder intencional que combina explicação, hierarquia e uma ação principal focada no contentor vazio.",
        logic:
          "Transforma ausência em orientação, convertendo a primeira interação com uma funcionalidade num momento de ativação.",
        context:
          "Novas contas, tabelas limpas, pesquisas sem resultados, integrações desligadas e projetos recém-criados.",
        whenNotToUse:
          "Loading transitório ou processamento em background, onde skeleton screens preservam melhor a continuidade espacial.",
        tradeOffs:
          "Excelente para orientação e ativação, mas enfraquece a confiança se parecer decorativo em vez de acionável.",
        insight:
          "Trate o vazio como oportunidade. Um próximo passo claro transforma incompletude em ponto de partida, não falha.",
        icon: SearchCheck,
      },
        {
          title: isPtPt ? "Definições e Configuração" : "Configurações e Configuração",
          logic: "Organização hierárquica de variáveis do sistema e preferências do utilizador.",
          context: "Controlo global da aplicação, preferências, permissões e afinação ao nível do ambiente.",
          tradeOffs:
            "Poderoso e esperado, mas rapidamente se torna hostil quando toggles de alto impacto ficam enterrados demais.",
          insight:
            "Configuração é manifesto do utilizador. Nunca esconda toggles de alto impacto atrás de mais de duas camadas de navegação.",
          icon: Settings2,
        },
        {
          title: isPtPt ? "Centro de Comando" : "Centro de Comando",
        structure:
          "Superfície de comando modal com input único, apoiada por atalhos de teclado e matching semântico.",
        tradeOffs:
          "O padrão mais rápido para especialistas, mas quase invisível para quem chega sem onboarding ou sinais de descoberta.",
        insight:
          "Linguagem é a interface mais eficiente. Toda app complexa beneficia de um sistema de atalhos baseado em texto.",
        icon: TerminalSquare,
      },
      {
        title: isPtPt ? "Modo de Foco" : "Modo de Foco",
        tag: isPtPt ? "Padrão de atenção" : "Padrão de atenção",
        structure:
          "Overlay modal ou full-screen que isola um único artefacto ao colapsar sidebars, notificações e navegação periférica.",
        logic:
          "Elimina o custo de troca de contexto e reduz o preço cognitivo de manter atenção num objetivo.",
        context:
          "Editores long-form, code reviews, redação de documentos e canvases de design que exigem imersão prolongada.",
        whenNotToUse:
          "Workflows que dependem de referências simultâneas, awareness multi-pane ou contexto colaborativo ao vivo.",
        tradeOffs:
          "Maximiza concentração e qualidade, mas pode desorientar se regressar à interface mais ampla tiver demasiado atrito.",
        insight:
          "Silêncio é uma decisão de design. Um bom Focus Mode curadoria a atenção em vez de apenas esconder controlos.",
        icon: Focus,
      },
      {
        title: isPtPt ? "Colaboração" : "Colaboração",
        tag: isPtPt ? "Padrão multiplayer" : "Padrão multiplayer",
        structure:
          "Indicadores de presença em tempo real, UI de resolução de conflitos e primitives de coedição sobre uma interface originalmente single-user.",
        logic:
          "Sincronização baseada em OT ou CRDT transforma presença em dado de primeira classe da interface.",
        context:
          "Documentos colaborativos, canvases partilhados, sessões de code review e fluxos de whiteboarding.",
        whenNotToUse:
          "Fluxos de posse estritamente sequenciais, ambientes de baixa latência com restrições apertadas ou superfícies pessoais single-user.",
        tradeOffs:
          "Aumenta velocidade da equipa, mas adiciona complexidade sistémica e pode introduzir ruído visual em tarefas individuais.",
        insight:
          "Presença é dado. Mostre o que os outros estão a editar, não apenas onde estão.",
        icon: Users,
      },
      {
        title: isPtPt ? "Linha Temporal" : "Linha Temporal",
        tag: isPtPt ? "Padrão de auditoria" : "Padrão de auditoria",
        structure:
          "Log cronológico de mutações de estado, ações de utilizador ou eventos de sistema com identidade do ator, timestamps e affordances de restauro.",
        logic:
          "Trata cada mudança significativa como evento imutável, transformando o tempo num eixo navegável.",
        context:
          "Editores versionados, logs de auditoria, workflows editoriais e superfícies de histórico de configuração.",
        whenNotToUse:
          "Feeds efémeros ao vivo, interações triviais ou cenários em que o custo de guardar eventos supera o valor para a pessoa.",
        tradeOffs:
          "Constrói confiança de recuperação, mas precisa de abstração cuidadosa para não sobrecarregar utilizadores não técnicos.",
        insight:
          "Histórico permanente é mais do que undo. Dá às pessoas permissão para correr riscos criativos.",
        icon: FileClock,
      },
      {
        title: isPtPt ? "Seletor de Entidades" : "Seletor de Entidades",
        tag: isPtPt ? "Padrão de seleção" : "Padrão de seleção",
        structure:
          "Seletor inline ou popover guiado por pesquisa para entidades relacionais com type-ahead, multi-select e chips de preview.",
        logic:
          "Cria referências tipadas em vez de duplicar dados, preservando autoridade no contexto de origem.",
        context:
          "Responsáveis, tags, menções, anexos, campos relacionais e seleção de escopo de permissões.",
        whenNotToUse:
          "Conjuntos estáticos pequenos ou valores planos como booleanos, enums e cores simples.",
        tradeOffs:
          "Preserva integridade relacional e reduz duplicação, mas depende de pesquisa rápida no backend e UX responsiva de type-ahead.",
        insight:
          "Ligue, não copie. Referências preservam autoridade e permitem ao sistema raciocinar sobre relações.",
        icon: ArrowRightLeft,
      },
    ] satisfies CompactPattern[],
    footerEyebrow: "Aetheris Architecture v4.2",
    footerText: isPtPt
      ? "A melhor interface é um modelo mental tornado visível. Não construímos botões; construímos ambientes para pensar."
      : "A melhor interface é um modelo mental tornado visível. Não construímos botões; construímos ambientes para pensar.",
    footerAccent: isPtPt ? "ambientes para pensar" : "ambientes para pensar",
    footerPrimary: isPtPt ? "Descarregar spec" : "Baixar spec",
    footerSecondary: isPtPt ? "Ver protótipos" : "Ver protótipos",
  };
}

function toneClass(tone: HighlightStat["tone"]) {
  if (tone === "primary") return "text-primary";
  if (tone === "secondary") return "text-secondary";
  return "text-white";
}

function DetailBlock({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="text-sm leading-7 text-slate-300">{text}</p>
    </div>
  );
}

function InsightCard({ text, label }: { text: string; label: string }) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-primary/5 p-5">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary">
        <Bot className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-sm italic leading-7 text-primary/85">{`"${text}"`}</p>
    </div>
  );
}

export function PatternsPage() {
  const { locale } = useI18n();
  const content = getPatternsContent(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="grid gap-8 md:grid-cols-[1.12fr_0.88fr]">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-primary">
            {content.heroLabel}
          </p>
          <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-7xl">
            {content.heroTitle} <br />
            <span className="signature-text">{content.heroAccent}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400">
            {content.heroInsight.text}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-6 shadow-glow">
          <div className="mb-6 flex items-center gap-2">
            <CircleDot className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {content.heroInsight.eyebrow}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {content.stats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-white/5 p-4">
                <p className={`text-2xl font-black tracking-tight ${toneClass(item.tone)}`}>
                  {item.value}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/5 bg-surface-container/70 p-5">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <BrainCircuit className="h-3.5 w-3.5 text-secondary" />
              {content.thesisEyebrow}
            </div>
            <p className="text-sm leading-7 text-slate-300">{content.thesisText}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.55fr_1fr]">
        {content.primaryPatterns.map((pattern, index) => {
          const Icon = pattern.icon;
          return (
            <article
              key={pattern.title}
              className={`glass-panel rounded-[28px] p-8 shadow-glow ${
                index === 0 ? "xl:min-h-[40rem]" : ""
              }`}
            >
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    {pattern.category}
                  </p>
                  <h2 className="text-4xl font-black tracking-tight text-white">{pattern.title}</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <DetailBlock label={content.labels.structure} text={pattern.structure} />
                <DetailBlock label={content.labels.logic} text={pattern.logic} />
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {content.labels.context}
                  </p>
                  <p className="text-sm leading-7 text-slate-300">{pattern.context}</p>
                </div>
                <div className="rounded-2xl border border-error/20 bg-error/10 p-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-error">
                    {content.labels.whenNotToUse}
                  </p>
                  <p className="text-sm leading-7 text-slate-300">{pattern.whenNotToUse}</p>
                </div>
              </div>

              <div className="mt-8">
                <InsightCard text={pattern.insight} label={content.labels.insight} />
              </div>
            </article>
          );
        })}
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">{content.supportingTitle}</h2>
          <span className="signature-pill">{content.supportingBadge}</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {content.compactPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <article key={pattern.title} className="glass-panel rounded-3xl p-7">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-white">
                          {pattern.title}
                        </h3>
                        {pattern.tag ? (
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {pattern.tag}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {pattern.structure ? (
                    <DetailBlock label={content.labels.structure} text={pattern.structure} />
                  ) : null}
                  {pattern.logic ? (
                    <DetailBlock label={content.labels.logic} text={pattern.logic} />
                  ) : null}
                  {pattern.context ? (
                    <DetailBlock label={content.labels.context} text={pattern.context} />
                  ) : null}
                  {pattern.whenNotToUse ? (
                    <DetailBlock label={content.labels.whenNotToUse} text={pattern.whenNotToUse} />
                  ) : null}
                  <div
                    className={
                      pattern.structure || pattern.logic || pattern.context || pattern.whenNotToUse
                        ? "md:col-span-2"
                        : ""
                    }
                  >
                    <DetailBlock label={content.labels.tradeOffs} text={pattern.tradeOffs} />
                  </div>
                </div>

                <div className="mt-6">
                  <InsightCard text={pattern.insight} label={content.labels.insight} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="glass-panel rounded-[32px] px-8 py-10 text-center shadow-glow">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
            <Filter className="h-3.5 w-3.5 text-primary" />
            {content.footerEyebrow}
          </div>
          <p className="text-3xl font-light italic leading-relaxed text-white md:text-4xl">
            {content.footerText.split(content.footerAccent)[0]}
            <span className="signature-text">{content.footerAccent}</span>
            {content.footerText.split(content.footerAccent)[1]}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-signature px-8 py-3 text-sm font-bold tracking-tight text-on-primary shadow-glow transition-transform duration-200 hover:scale-[1.02]">
              {content.footerPrimary}
            </button>
            <button className="rounded-full border border-white/10 px-8 py-3 text-sm font-bold tracking-tight text-white transition-colors duration-200 hover:bg-white/5">
              {content.footerSecondary}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
