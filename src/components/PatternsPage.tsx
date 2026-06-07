import type { LucideIcon } from "lucide-react";
import {
  ArrowRightLeft,
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
}

interface HeroInsight {
  eyebrow: string;
  text: string;
}

interface PatternDefinition {
  title: string;
  summary: string;
  category?: string;
  tag?: string;
  structure?: string;
  logic?: string;
  context?: string;
  whenNotToUse?: string;
  tradeOffs?: string;
  insight: string;
  icon: LucideIcon;
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
        { label: "Patterns", value: "11" },
        { label: "Foundational", value: "2" },
        { label: "Complementary", value: "9" },
        { label: "Decision Fields", value: "6" },
        { label: "Cognitive Goal", value: "Clarity" },
      ] satisfies HighlightStat[],
      thesisEyebrow: "Pattern thesis",
      thesisText:
        "The best patterns externalize mental models. They reduce ambiguity, sequence decisions and create enough structure for people to think clearly inside complex systems.",
      guideEyebrow: "Reading model",
      guideTitle: "How to read this library",
      guideText:
        "Structure describes arrangement. Logic explains the cognitive mechanism. Context identifies fit, while contraindications and trade-offs expose the boundaries of the decision. Each insight closes the pattern with an Aetheris principle.",
      foundationalLabel: "Foundational pattern",
      complementaryLabel: "Complementary pattern",
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
          summary:
            "A monitoring environment that turns distributed signals into one legible operational picture.",
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
          summary:
            "A sequenced decision flow that protects momentum while progressively collecting complex information.",
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
      ] satisfies PatternDefinition[],
      supportingTitle: "Supporting Patterns",
      supportingBadge: "9 blueprints",
      compactPatterns: [
        {
          title: "Onboarding",
          summary:
            "A contextual learning path that introduces capability at the moment it becomes useful.",
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
          summary:
            "A hypothesis-driven workspace for narrowing, comparing, and interpreting complex datasets.",
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
          summary:
            "A first-use state that turns absence into orientation and a clear next step.",
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
          summary:
            "A durable control surface for preferences, permissions, and system-level behavior.",
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
          summary:
            "A language-led shortcut layer that compresses expert navigation into one searchable surface.",
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
          summary:
            "An attention-preserving environment that removes peripheral choices around one artifact.",
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
          summary:
            "A multiplayer layer that makes presence, authorship, and concurrent change visible.",
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
          summary:
            "A navigable history that connects system state to actors, events, and recovery.",
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
          summary:
            "A search-led selector that creates reliable references to shared entities instead of copying data.",
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
      ] satisfies PatternDefinition[],
      footerEyebrow: "Aetheris Architecture v4.2",
      footerText:
        "The best interface is a mental model made visible. We do not build buttons; we build environments for thought.",
      footerAccent: "environments for thought",
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
      { label: "Padrões", value: "11" },
      { label: "Fundamentais", value: "2" },
      { label: "Complementares", value: "9" },
      { label: isPtPt ? "Campos de decisão" : "Campos de decisão", value: "6" },
      { label: "Meta cognitiva", value: "Clareza" },
    ] satisfies HighlightStat[],
    thesisEyebrow: isPtPt ? "Tese do padrão" : "Tese do padrão",
    thesisText: isPtPt
      ? "Os melhores padrões externalizam modelos mentais. Reduzem ambiguidade, sequenciam decisões e criam estrutura suficiente para as pessoas pensarem com clareza em sistemas complexos."
      : "Os melhores padrões externalizam modelos mentais. Reduzem ambiguidade, sequenciam decisões e criam estrutura suficiente para as pessoas pensarem com clareza em sistemas complexos.",
    guideEyebrow: "Modelo de leitura",
    guideTitle: isPtPt ? "Como ler esta biblioteca" : "Como ler esta biblioteca",
    guideText: isPtPt
      ? "A estrutura descreve a composição. A lógica explica o mecanismo cognitivo. O contexto identifica a adequação, enquanto contraindicações e trade-offs expõem os limites da decisão. Cada insight encerra o padrão com um princípio Aetheris."
      : "A estrutura descreve a composição. A lógica explica o mecanismo cognitivo. O contexto identifica a adequação, enquanto contraindicações e trade-offs expõem os limites da decisão. Cada insight encerra o padrão com um princípio Aetheris.",
    foundationalLabel: "Padrão fundamental",
    complementaryLabel: "Padrão complementar",
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
          summary: isPtPt
            ? "Um ambiente de monitorização que transforma sinais distribuídos num retrato operacional legível."
            : "Um ambiente de monitoramento que transforma sinais distribuídos em um retrato operacional legível.",
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
          summary: isPtPt
            ? "Um fluxo de decisão sequenciado que preserva o ritmo enquanto recolhe informação complexa de forma progressiva."
            : "Um fluxo de decisão sequenciado que preserva o ritmo enquanto coleta informações complexas progressivamente.",
          category: isPtPt ? "Padrão de fluxo" : "Padrão de fluxo",
          structure:
            isPtPt
              ? "Campos de entrada distribuídos por blocos lógicos temáticos, cada um focado numa decisão ou grupo de dados, com indicação persistente de progresso."
              : "Campos de entrada distribuídos em blocos lógicos temáticos, cada um focado em uma decisão ou grupo de dados, com indicação persistente de progresso.",
          logic: isPtPt
            ? "Reduz a sobrecarga ao sequenciar decisões e manter o impulso até à conclusão."
            : "Reduz a sobrecarga ao sequenciar decisões e manter o ritmo até a conclusão.",
          context: isPtPt
            ? "Registo de conta, checkout, assistentes de configuração complexos e onboarding com lógica ramificada."
            : "Cadastro de conta, checkout, assistentes de configuração complexos e onboarding com lógica ramificada.",
          whenNotToUse: isPtPt
            ? "Formulários simples com menos de cinco campos, entradas relacionadas que beneficiam de visibilidade simultânea ou ações móveis rápidas."
            : "Formulários simples com menos de cinco campos, entradas relacionadas que se beneficiam de visibilidade simultânea ou ações móveis rápidas.",
          insight: isPtPt
            ? "Preserve o ritmo. Use preenchimento preditivo e validação inline para eliminar atrito cognitivo entre etapas."
            : "Preserve o ritmo. Use preenchimento preditivo e validação inline para eliminar atrito cognitivo entre etapas.",
          icon: ListTree,
        },
    ] satisfies PatternDefinition[],
    supportingTitle: isPtPt ? "Padrões de apoio" : "Padrões de apoio",
    supportingBadge: "9 blueprints",
    compactPatterns: [
      {
        title: "Onboarding",
        summary: isPtPt
          ? "Um percurso de aprendizagem contextual que apresenta capacidades no momento em que se tornam úteis."
          : "Uma jornada de aprendizagem contextual que apresenta capacidades quando elas se tornam úteis.",
        structure: isPtPt
          ? "Sequência de divulgação progressiva que apresenta funcionalidades-chave através de educação contextual sem interromper o fluxo principal."
          : "Sequência de divulgação progressiva que apresenta funcionalidades-chave por meio de educação contextual sem interromper o fluxo principal.",
        context: isPtPt
          ? "Primeira utilização, ativação pós-registo, descoberta de funcionalidades após grandes atualizações e revelação de capacidades por perfil."
          : "Primeiro uso, ativação após cadastro, descoberta de funcionalidades depois de grandes atualizações e revelação de capacidades por perfil.",
        whenNotToUse: isPtPt
          ? "Interfaces já autoexplicativas, fluxos transacionais ou utilizadores recorrentes que já concluíram a configuração."
          : "Interfaces já autoexplicativas, fluxos transacionais ou usuários recorrentes que já concluíram a configuração.",
        tradeOffs: isPtPt
          ? "Aumenta a ativação e a adoção, mas torna-se fácil de ignorar se parecer genérico ou desligado da intenção do utilizador."
          : "Aumenta ativação e adoção, mas se torna fácil de ignorar quando parece genérico ou desconectado da intenção do usuário.",
        insight: isPtPt
          ? "Personalize o percurso. Mostre primeiro o que importa para a pessoa em vez de repetir um tour genérico."
          : "Personalize a jornada. Mostre primeiro o que importa para a pessoa em vez de repetir um tour genérico.",
        icon: Rocket,
      },
      {
        title: isPtPt ? "Explorador de Dados" : "Explorador de Dados",
        summary: isPtPt
          ? "Um espaço guiado por hipóteses para restringir, comparar e interpretar conjuntos de dados complexos."
          : "Um espaço guiado por hipóteses para filtrar, comparar e interpretar conjuntos de dados complexos.",
        structure: isPtPt
          ? "Interface dinâmica de filtragem com pesquisa facetada, drill-down e controlos de análise multidimensional sobre grandes conjuntos de dados."
          : "Interface dinâmica de filtragem com pesquisa facetada, drill-down e controles de análise multidimensional sobre grandes conjuntos de dados.",
        logic: isPtPt
          ? "Exploração guiada por hipóteses em que as pessoas definem consultas e o sistema revela subconjuntos relevantes."
          : "Exploração guiada por hipóteses em que as pessoas definem consultas e o sistema revela subconjuntos relevantes.",
        context:
          "Plataformas analíticas, ferramentas de pesquisa, sistemas de inventário e dashboards BI com dados multidimensionais.",
        tradeOffs: isPtPt
          ? "Extremamente poderoso para especialistas, mas precisa de affordances claras, valores predefinidos sólidos e vistas guardadas para evitar sobrecarga em iniciantes."
          : "Extremamente poderoso para especialistas, mas precisa de affordances claras, padrões iniciais sólidos e visualizações salvas para evitar sobrecarga em iniciantes.",
        insight: isPtPt
          ? "Use pesquisa semântica como ponto de entrada principal. Uma consulta em linguagem natural substitui muitas vezes uma cadeia de filtros manuais."
          : "Use pesquisa semântica como ponto de entrada principal. Uma consulta em linguagem natural muitas vezes substitui uma cadeia de filtros manuais.",
        icon: Database,
      },
      {
        title: isPtPt ? "Estados Vazios" : "Estados Vazios",
        summary: isPtPt
          ? "Um estado de primeira utilização que transforma ausência em orientação e num próximo passo claro."
          : "Um estado de primeiro uso que transforma ausência em orientação e em um próximo passo claro.",
        structure: isPtPt
          ? "Vista vazia intencional que combina explicação, hierarquia e uma ação principal focada no contentor."
          : "Estado vazio intencional que combina explicação, hierarquia e uma ação principal focada no contêiner.",
        logic:
          "Transforma ausência em orientação, convertendo a primeira interação com uma funcionalidade num momento de ativação.",
        context:
          "Novas contas, tabelas limpas, pesquisas sem resultados, integrações desligadas e projetos recém-criados.",
        whenNotToUse: isPtPt
          ? "Carregamento transitório ou processamento em segundo plano, onde skeleton screens preservam melhor a continuidade espacial."
          : "Carregamento transitório ou processamento em segundo plano, em que skeleton screens preservam melhor a continuidade espacial.",
        tradeOffs: isPtPt
          ? "Excelente para orientação e ativação, mas enfraquece a confiança se parecer decorativo em vez de acionável."
          : "Excelente para orientação e ativação, mas enfraquece a confiança quando parece decorativo em vez de acionável.",
        insight:
          "Trate o vazio como oportunidade. Um próximo passo claro transforma incompletude em ponto de partida, não em falha.",
        icon: SearchCheck,
      },
      {
        title: isPtPt ? "Definições e Configuração" : "Configurações",
        summary: isPtPt
          ? "Uma superfície de controlo duradoura para preferências, permissões e comportamento do sistema."
          : "Uma superfície de controle duradoura para preferências, permissões e comportamento do sistema.",
        logic: isPtPt
          ? "Organização hierárquica de variáveis do sistema e preferências do utilizador."
          : "Organização hierárquica de variáveis do sistema e preferências do usuário.",
        context: isPtPt
          ? "Controlo global da aplicação, preferências, permissões e afinação ao nível do ambiente."
          : "Controle global da aplicação, preferências, permissões e ajustes no nível do ambiente.",
        tradeOffs: isPtPt
          ? "Poderoso e esperado, mas rapidamente se torna hostil quando controlos de alto impacto ficam demasiado escondidos."
          : "Poderoso e esperado, mas rapidamente se torna hostil quando controles de alto impacto ficam escondidos demais.",
        insight: isPtPt
          ? "A configuração é o manifesto do utilizador. Nunca esconda controlos de alto impacto atrás de mais de duas camadas de navegação."
          : "A configuração é o manifesto do usuário. Nunca esconda controles de alto impacto atrás de mais de duas camadas de navegação.",
        icon: Settings2,
      },
      {
        title: "Centro de Comando",
        summary: isPtPt
          ? "Uma camada de atalhos orientada pela linguagem que concentra a navegação especializada numa superfície pesquisável."
          : "Uma camada de atalhos orientada pela linguagem que concentra a navegação especializada em uma superfície pesquisável.",
        structure:
          "Superfície modal de comandos com uma única entrada, apoiada por atalhos de teclado e correspondência semântica.",
        tradeOffs:
          "O padrão mais rápido para especialistas, mas quase invisível para quem chega sem onboarding ou sinais claros de descoberta.",
        insight: isPtPt
          ? "A linguagem é a interface mais eficiente. Toda a aplicação complexa beneficia de um sistema de atalhos baseado em texto."
          : "A linguagem é a interface mais eficiente. Todo aplicativo complexo se beneficia de um sistema de atalhos baseado em texto.",
        icon: TerminalSquare,
      },
      {
        title: "Modo de Foco",
        summary: isPtPt
          ? "Um ambiente que preserva a atenção ao remover escolhas periféricas em torno de um artefacto."
          : "Um ambiente que preserva a atenção ao remover escolhas periféricas ao redor de um artefato.",
        tag: "Padrão de atenção",
        structure: isPtPt
          ? "Overlay modal ou em ecrã inteiro que isola um único artefacto ao recolher barras laterais, notificações e navegação periférica."
          : "Overlay modal ou em tela cheia que isola um único artefato ao recolher barras laterais, notificações e navegação periférica.",
        logic: isPtPt
          ? "Elimina o custo da troca de contexto e reduz o esforço cognitivo de manter a atenção num objetivo."
          : "Elimina o custo da troca de contexto e reduz o esforço cognitivo de manter a atenção em um objetivo.",
        context:
          "Editores de texto longo, revisões de código, redação de documentos e telas de design que exigem imersão prolongada.",
        whenNotToUse:
          "Fluxos que dependem de referências simultâneas, consciência de vários painéis ou contexto colaborativo em tempo real.",
        tradeOffs: isPtPt
          ? "Maximiza a concentração e a qualidade, mas pode desorientar quando regressar à interface geral exige demasiado esforço."
          : "Maximiza concentração e qualidade, mas pode desorientar quando retornar à interface geral exige esforço demais.",
        insight: isPtPt
          ? "O silêncio é uma decisão de design. Um bom Modo de Foco orienta a atenção em vez de apenas esconder controlos."
          : "O silêncio é uma decisão de design. Um bom Modo de Foco orienta a atenção em vez de apenas esconder controles.",
        icon: Focus,
      },
      {
        title: "Colaboração",
        summary: isPtPt
          ? "Uma camada multijogador que torna visíveis a presença, a autoria e as alterações simultâneas."
          : "Uma camada multiusuário que torna visíveis a presença, a autoria e as alterações simultâneas.",
        tag: "Padrão multiplayer",
        structure:
          "Indicadores de presença em tempo real, interface de resolução de conflitos e elementos de coedição sobre uma interface originalmente individual.",
        logic: isPtPt
          ? "A sincronização baseada em OT ou CRDT transforma a presença num dado de primeira classe da interface."
          : "A sincronização baseada em OT ou CRDT transforma a presença em um dado de primeira classe da interface.",
        context: isPtPt
          ? "Documentos colaborativos, telas partilhadas, sessões de revisão de código e fluxos de quadro branco."
          : "Documentos colaborativos, telas compartilhadas, sessões de revisão de código e fluxos de quadro branco.",
        whenNotToUse:
          "Fluxos de responsabilidade estritamente sequenciais, ambientes com restrições severas de latência ou superfícies pessoais individuais.",
        tradeOffs: isPtPt
          ? "Aumenta a velocidade da equipa, mas acrescenta complexidade sistémica e pode introduzir ruído visual em tarefas individuais."
          : "Aumenta a velocidade da equipe, mas adiciona complexidade sistêmica e pode introduzir ruído visual em tarefas individuais.",
        insight: isPtPt
          ? "A presença é um dado. Mostre o que os outros estão a editar, não apenas onde estão."
          : "A presença é um dado. Mostre o que as outras pessoas estão editando, não apenas onde estão.",
        icon: Users,
      },
      {
        title: isPtPt ? "Linha Temporal" : "Linha do Tempo",
        summary: isPtPt
          ? "Um histórico navegável que liga o estado do sistema a atores, eventos e recuperação."
          : "Um histórico navegável que conecta o estado do sistema a pessoas, eventos e recuperação.",
        tag: "Padrão de auditoria",
        structure: isPtPt
          ? "Registo cronológico de alterações de estado, ações do utilizador ou eventos do sistema com identidade do autor, timestamps e opções de restauro."
          : "Registro cronológico de alterações de estado, ações do usuário ou eventos do sistema com identidade do autor, timestamps e opções de restauração.",
        logic: isPtPt
          ? "Trata cada mudança significativa como um evento imutável, transformando o tempo num eixo navegável."
          : "Trata cada mudança significativa como um evento imutável, transformando o tempo em um eixo navegável.",
        context: isPtPt
          ? "Editores versionados, registos de auditoria, fluxos editoriais e superfícies de histórico de configuração."
          : "Editores versionados, registros de auditoria, fluxos editoriais e superfícies de histórico de configuração.",
        whenNotToUse: isPtPt
          ? "Feeds efémeros em tempo real, interações triviais ou cenários em que o custo de guardar eventos supera o valor para a pessoa."
          : "Feeds efêmeros em tempo real, interações triviais ou cenários em que o custo de armazenar eventos supera o valor para a pessoa.",
        tradeOffs: isPtPt
          ? "Constrói confiança na recuperação, mas exige abstração cuidadosa para não sobrecarregar utilizadores não técnicos."
          : "Constrói confiança na recuperação, mas exige abstração cuidadosa para não sobrecarregar usuários não técnicos.",
        insight: isPtPt
          ? "Um histórico permanente é mais do que desfazer. Dá às pessoas permissão para assumir riscos criativos."
          : "Um histórico permanente é mais do que desfazer. Dá às pessoas permissão para assumir riscos criativos.",
        icon: FileClock,
      },
      {
        title: "Seletor de Entidades",
        summary: isPtPt
          ? "Um seletor orientado pela pesquisa que cria referências fiáveis em vez de copiar dados."
          : "Um seletor orientado pela pesquisa que cria referências confiáveis em vez de copiar dados.",
        tag: "Padrão de seleção",
        structure:
          "Seletor inline ou popover guiado por pesquisa para entidades relacionais com preenchimento antecipado, seleção múltipla e pré-visualização.",
        logic:
          "Cria referências tipadas em vez de duplicar dados, preservando a autoridade no contexto de origem.",
        context:
          "Responsáveis, tags, menções, anexos, campos relacionais e seleção de escopo de permissões.",
        whenNotToUse:
          "Conjuntos estáticos pequenos ou valores simples como booleanos, enumerações e cores.",
        tradeOffs: isPtPt
          ? "Preserva a integridade relacional e reduz a duplicação, mas depende de pesquisa rápida no backend e resposta imediata durante a escrita."
          : "Preserva a integridade relacional e reduz a duplicação, mas depende de pesquisa rápida no backend e resposta imediata durante a digitação.",
        insight: isPtPt
          ? "Ligue, não copie. As referências preservam autoridade e permitem ao sistema raciocinar sobre relações."
          : "Conecte, não copie. As referências preservam autoridade e permitem ao sistema raciocinar sobre relações.",
        icon: ArrowRightLeft,
      },
    ] satisfies PatternDefinition[],
    footerEyebrow: "Aetheris Architecture v4.2",
    footerText: isPtPt
      ? "A melhor interface é um modelo mental tornado visível. Não construímos botões; construímos ambientes para pensar."
      : "A melhor interface é um modelo mental tornado visível. Não construímos botões; construímos ambientes para pensar.",
    footerAccent: isPtPt ? "ambientes para pensar" : "ambientes para pensar",
  };
}

function PatternMetric({ label, value }: HighlightStat) {
  return (
    <div className="min-w-0 border-l border-white/[0.09] px-4 py-4 first:border-l-0 sm:px-5">
      <dd className="text-2xl font-semibold tracking-[-0.04em] text-[#f5f1f7]">{value}</dd>
      <dt className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#77717d]">
        {label}
      </dt>
    </div>
  );
}

function PatternField({
  label,
  text,
  tone = "default",
}: {
  label: string;
  text: string;
  tone?: "default" | "context" | "boundary" | "tradeoff";
}) {
  const toneClasses = {
    default: "border-white/[0.075] bg-transparent",
    context: "border-white/[0.08] bg-white/[0.018]",
    boundary: "border-error/[0.16] bg-error/[0.035]",
    tradeoff: "border-warning/[0.14] bg-warning/[0.025]",
  };
  const labelClasses = {
    default: "text-[#716a77]",
    context: "text-[#82798a]",
    boundary: "text-[#c78491]",
    tradeoff: "text-[#aa8467]",
  };

  return (
    <section className={`border p-5 sm:p-6 ${toneClasses[tone]}`}>
      <h3
        className={`text-[9px] font-semibold uppercase tracking-[0.22em] ${labelClasses[tone]}`}
      >
        {label}
      </h3>
      <p className="mt-3 max-w-[680px] text-sm leading-7 text-[#aaa2af]">{text}</p>
    </section>
  );
}

function PatternInsight({ label, text }: { label: string; text: string }) {
  return (
    <section className="border-y border-[#b28af2]/[0.14] bg-[#b28af2]/[0.025] px-5 py-5 sm:px-6">
      <h3 className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#a98ad8]">
        {label}
      </h3>
      <p className="mt-3 max-w-[880px] text-sm font-medium italic leading-7 text-[#d1c2df]">
        “{text}”
      </p>
    </section>
  );
}

function PatternChapter({
  pattern,
  number,
  foundational,
  labels,
  foundationalLabel,
  complementaryLabel,
}: {
  pattern: PatternDefinition;
  number: number;
  foundational: boolean;
  labels: ReturnType<typeof getPatternsContent>["labels"];
  foundationalLabel: string;
  complementaryLabel: string;
}) {
  const Icon = pattern.icon;
  const formattedNumber = String(number).padStart(2, "0");
  const primaryFields = [
    pattern.structure ? { label: labels.structure, text: pattern.structure } : null,
    pattern.logic ? { label: labels.logic, text: pattern.logic } : null,
  ].filter((field): field is { label: string; text: string } => field !== null);

  return (
    <article
      data-pattern-number={formattedNumber}
      data-pattern-priority={foundational ? "foundational" : "complementary"}
      className={`relative border-t border-white/[0.09] ${
        foundational ? "py-14 sm:py-16" : "py-11 sm:py-12"
      }`}
    >
      {foundational ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 inset-y-4 -z-10 rounded-[24px] bg-[radial-gradient(circle_at_86%_8%,rgba(178,138,242,0.075),transparent_32%),rgba(255,255,255,0.008)] sm:-inset-x-8"
        />
      ) : null}

      <div className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-4 sm:grid-cols-[56px_minmax(0,1fr)] sm:gap-x-6">
        <p className="pt-0.5 text-3xl font-semibold tracking-[-0.05em] text-[#a983e4]">
          {formattedNumber}
        </p>

        <div className="min-w-0">
          <header className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#85768f]">
                {pattern.category ?? pattern.tag ?? (foundational ? foundationalLabel : complementaryLabel)}
              </p>
              <h2 className="mt-2 text-[1.625rem] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f5f1f7] sm:text-[2rem]">
                {pattern.title}
              </h2>
              <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#a59daa] sm:text-[15px]">
                {pattern.summary}
              </p>
            </div>
            <Icon
              className="hidden h-5 w-5 text-[#88749f] sm:block"
              strokeWidth={1.6}
              aria-hidden
            />
          </header>

          {primaryFields.length > 0 ? (
            <div
              className={`mt-8 grid border-y border-white/[0.08] ${
                primaryFields.length > 1 ? "md:grid-cols-2" : ""
              }`}
            >
              {primaryFields.map((field, index) => (
                <div
                  key={field.label}
                  className={`py-5 ${
                    index > 0
                      ? "border-t border-white/[0.08] md:border-l md:border-t-0 md:pl-7"
                      : primaryFields.length > 1
                        ? "md:pr-7"
                        : ""
                  }`}
                >
                  <h3 className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#716a77]">
                    {field.label}
                  </h3>
                  <p className="mt-3 max-w-[650px] text-sm leading-7 text-[#aaa2af]">
                    {field.text}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {pattern.context || pattern.whenNotToUse ? (
            <div
              className={`mt-6 grid gap-3 ${
                pattern.context && pattern.whenNotToUse ? "md:grid-cols-2" : ""
              }`}
            >
              {pattern.context ? (
                <PatternField label={labels.context} text={pattern.context} tone="context" />
              ) : null}
              {pattern.whenNotToUse ? (
                <PatternField
                  label={labels.whenNotToUse}
                  text={pattern.whenNotToUse}
                  tone="boundary"
                />
              ) : null}
            </div>
          ) : null}

          {pattern.tradeOffs ? (
            <div className="mt-3">
              <PatternField
                label={labels.tradeOffs}
                text={pattern.tradeOffs}
                tone="tradeoff"
              />
            </div>
          ) : null}

          <div className="mt-6">
            <PatternInsight label={labels.insight} text={pattern.insight} />
          </div>
        </div>
      </div>
    </article>
  );
}

function PatternClosing({
  eyebrow,
  text,
  accent,
}: {
  eyebrow: string;
  text: string;
  accent: string;
}) {
  const [before, after = ""] = text.split(accent);

  return (
    <footer className="border-t border-white/[0.09] py-16 sm:py-20">
      <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#756c7c]">
        {eyebrow}
      </p>
      <p className="mt-5 max-w-[900px] text-[2rem] font-light leading-[1.18] tracking-[-0.035em] text-[#eee9f1] sm:text-[2.5rem]">
        {before}
        <span className="text-[#c8a7ff]">{accent}</span>
        {after}
      </p>
    </footer>
  );
}

export function PatternsPage() {
  const { locale } = useI18n();
  const content = getPatternsContent(locale);
  const patterns = [...content.primaryPatterns, ...content.compactPatterns];

  return (
    <article className="pb-20">
      <header className="relative isolate overflow-hidden border-b border-white/[0.09] pb-10 pt-1">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 -z-20 hidden w-[62%] sm:block"
        >
          <img
            src="/patterns-architecture.webp"
            alt=""
            className="h-full w-full object-cover object-right opacity-55"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(9,9,13,1)_0%,rgba(9,9,13,0.98)_48%,rgba(9,9,13,0.72)_72%,rgba(9,9,13,0.48)_100%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-20 bg-gradient-to-b from-[#09090d] to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 bg-gradient-to-t from-[#09090d] to-transparent"
        />
        <div className="relative max-w-[820px]">
          <div className="page-eyebrow">
            <Filter className="h-3.5 w-3.5" aria-hidden />
            {content.heroLabel}
          </div>
          <h1 className="text-[2.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[#f5f1f7] sm:text-[3rem] lg:text-[3.5rem]">
            {content.heroTitle}{" "}
            <span className="text-[#c8a7ff]">{content.heroAccent}</span>
          </h1>
          <p className="mt-4 max-w-[700px] text-sm leading-6 text-[#aaa2af] sm:text-[15px]">
            {content.heroInsight.text}
          </p>
        </div>

        <dl className="relative mt-8 grid grid-cols-2 border-y border-white/[0.09] sm:grid-cols-3 lg:grid-cols-5">
          {content.stats.map((item) => (
            <PatternMetric key={item.label} {...item} />
          ))}
        </dl>

        <section className="relative mt-7 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
          <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#85768f]">
            {content.thesisEyebrow}
          </p>
          <p className="max-w-[780px] text-sm leading-7 text-[#aaa2af]">{content.thesisText}</p>
        </section>
      </header>

      <section className="grid gap-5 border-b border-white/[0.09] py-9 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8e779e]">
            {content.guideEyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#eee9f1]">
            {content.guideTitle}
          </h2>
        </div>
        <p className="max-w-[780px] text-sm leading-7 text-[#aaa2af]">{content.guideText}</p>
      </section>

      <div>
        {patterns.map((pattern, index) => (
          <PatternChapter
            key={`${index}-${pattern.title}`}
            pattern={pattern}
            number={index + 1}
            foundational={index < content.primaryPatterns.length}
            labels={content.labels}
            foundationalLabel={content.foundationalLabel}
            complementaryLabel={content.complementaryLabel}
          />
        ))}
      </div>

      <PatternClosing
        eyebrow={content.footerEyebrow}
        text={content.footerText}
        accent={content.footerAccent}
      />
    </article>
  );
}
