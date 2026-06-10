import { Accessibility, Layers3, MessageSquareMore, Palette, Sparkles, Waypoints } from "lucide-react";
import type { Locale } from "../../i18n/translations";
import { toDisplayTitle } from "../domain/displayTitle";
import type { ChatContent, PersonaStrategy, PromptStats, SuggestedPrompt } from "../types/beatrice";

export function getChatContent(locale: Locale): ChatContent {
  if (locale === "en-US") {
    return {
      suggestedPrompts: [
        { title: "Component Guidance", body: "What component should I use for a multi-step form?", icon: Layers3 },
        { title: "Design Decisions", body: "Why did we choose glassmorphism over solid panels?", icon: Waypoints },
        { title: "Token Reference", body: "What are the primary color tokens and their use cases?", icon: Palette },
        { title: "Accessibility", body: "How do I ensure my layout meets accessibility standards?", icon: Accessibility },
      ],
      initialMessages: [
        {
          id: "user-1",
          role: "user",
          content: "When should I use a side drawer vs a modal overlay for forms?",
        },
        {
          id: "assistant-1",
          role: "assistant",
          decisionId: "Design Decision 04",
          content:
            "Great question. This is one of the most important spatial choices in interface design because it affects focus, continuity and cognitive load.",
          responseCards: [
            {
              title: "Side Drawer : use when",
              text: "The form is contextually related to the current view and the user needs to keep referencing content behind it. It preserves spatial continuity.",
              accent: "primary",
            },
            {
              title: "Modal Overlay : use when",
              text: "The action needs full focus: confirmations, creation flows, critical alerts or moments where the background should temporarily disappear.",
              accent: "secondary",
            },
          ],
          conclusion:
            "If the user needs page context, use a drawer. If the task needs undivided attention, use a modal.",
        },
      ],
      activeContext: [
        "Full token system loaded",
        "22 components indexed",
        "17 design decisions",
        "11 pattern scenarios",
        "Reasoning engine active",
      ],
      recentTopics: ["Modal vs. Drawer", "Color token usage", "WCAG compliance"],
      quickLinks: [
        { label: "Components", to: "/components", icon: Layers3 },
        { label: "Tokens", to: "/tokens", icon: Palette },
        { label: "Decisions", to: "/design-decisions", icon: Waypoints },
        { label: "Patterns", to: "/patterns", icon: Sparkles },
        { label: "Reasoning", to: "/reasoning", icon: MessageSquareMore },
      ],
      justNow: "Just now",
      coreRule: "Core rule",
    };
  }

  const isPtPt = locale === "pt-PT";
  return {
    suggestedPrompts: [
      {
        title: "Orientação de componentes",
        body: isPtPt
          ? "Que componente devo utilizar para um formulário multi-etapas?"
          : "Que componente devo usar para um formulário multi-etapas?",
        icon: Layers3,
      },
      {
        title: "Decisões de design",
        body: isPtPt
          ? "Porque escolhemos glassmorphism em vez de painéis sólidos?"
          : "Por que escolhemos glassmorphism em vez de painéis sólidos?",
        icon: Waypoints,
      },
      {
        title: "Referência de tokens",
        body: "Quais são os tokens de cor primários e em que casos devem ser usados?",
        icon: Palette,
      },
      {
        title: "Acessibilidade",
        body: isPtPt
          ? "Como garanto que o meu layout cumpre os padrões de acessibilidade?"
          : "Como garanto que meu layout atende aos padrões de acessibilidade?",
        icon: Accessibility,
      },
    ],
    initialMessages: [
      {
        id: "user-1",
        role: "user",
        content: "Quando devo usar uma side drawer versus uma modal overlay em formulários?",
      },
      {
        id: "assistant-1",
        role: "assistant",
        decisionId: "Decisão de Design 04",
        content: isPtPt
          ? "Boa pergunta. Esta é uma das escolhas espaciais mais importantes no design de interfaces porque afeta foco, continuidade e carga cognitiva."
          : "Ótima pergunta. Essa é uma das escolhas espaciais mais importantes no design de interfaces porque afeta foco, continuidade e carga cognitiva.",
        responseCards: [
          {
            title: "Side Drawer : usar quando",
            text: isPtPt
              ? "O formulário está relacionado com a vista atual e a pessoa precisa de continuar a consultar o conteúdo por trás. Preserva continuidade espacial."
              : "O formulário está contextualizado com a tela atual e a pessoa precisa continuar consultando o conteúdo por trás. Isso preserva continuidade espacial.",
            accent: "primary",
          },
          {
            title: "Modal Overlay : usar quando",
            text: "A ação precisa de foco total: confirmações, fluxos de criação, alertas críticos ou momentos em que o fundo deve desaparecer temporariamente.",
            accent: "secondary",
          },
        ],
        conclusion: isPtPt
          ? "Se o utilizador precisa do contexto da página, use uma drawer. Se a tarefa exige atenção indivisa, use um modal."
          : "Se a pessoa precisa do contexto da página, use uma drawer. Se a tarefa exige atenção indivisa, use um modal.",
      },
    ],
    activeContext: [
      "Sistema completo de tokens carregado",
      "22 componentes indexados",
      "17 decisões de design",
      "11 cenários de padrões",
      "Motor de raciocínio ativo",
    ],
    recentTopics: isPtPt
      ? ["Modal vs. Drawer", "Utilização de tokens de cor", "Conformidade WCAG"]
      : ["Modal vs. Drawer", "Uso de tokens de cor", "Conformidade WCAG"],
    quickLinks: [
      { label: "Componentes", to: "/components", icon: Layers3 },
      { label: "Tokens", to: "/tokens", icon: Palette },
      { label: "Decisões", to: "/design-decisions", icon: Waypoints },
      { label: "Padrões", to: "/patterns", icon: Sparkles },
      { label: "Raciocínio", to: "/reasoning", icon: MessageSquareMore },
    ],
    justNow: isPtPt ? "Agora mesmo" : "Agora mesmo",
    coreRule: isPtPt ? "Regra-base" : "Regra central",
  };
}

export function getPromptStats(messageCount: number): PromptStats {
  return {
    messages: messageCount,
    decisions: Math.max(1, Math.floor(messageCount / 2)),
    confidence: "97%",
  };
}

function personaChatLabels(locale: Locale) {
  if (locale === "en-US") {
    return {
      activeThrough: "is active through",
      operationalPain: "Operational pain",
      thinkingStructure: "Thinking structure",
      operator: "Operator",
      primaryPain: "Primary pain",
      metricsPrioritized: "Metrics prioritized",
      operationalFears: "Operational fears",
      vocabulary: "Vocabulary",
      mentalStructure: "Mental structure",
      retrievalWeighting: "Retrieval weighting",
      active: "active",
    };
  }

  return {
    activeThrough: locale === "pt-PT" ? "está ativa através de" : "está ativa por meio de",
    operationalPain: "Dor operacional",
    thinkingStructure: "Estrutura de pensamento",
    operator: "Operador",
    primaryPain: "Dor principal",
    metricsPrioritized: "Métricas priorizadas",
    operationalFears: "Medos operacionais",
    vocabulary: "Vocabulário",
    mentalStructure: "Estrutura mental",
    retrievalWeighting: "Peso do retrieval",
    active: "ativa",
  };
}

export function getPersonaChatContent(content: ChatContent, strategy: PersonaStrategy, locale: Locale): ChatContent {
  const profile = strategy.cognitiveProfile;
  const operationalProfile = strategy.operationalProfile;
  const labels = personaChatLabels(locale);
  const promptTitles = [
    operationalProfile.title,
    operationalProfile.prioritizedMetrics[0],
    operationalProfile.operationalFears[0],
    profile.decisionCriteria[0],
  ];
  const promptIcons = [strategy.icon, MessageSquareMore, Layers3, Waypoints];

  const suggestedPrompts: SuggestedPrompt[] = strategy.examples.slice(0, 4).map((body, index) => {
    const rawTitle = promptTitles[index] ?? strategy.workspaceTone;
    return {
      title: toDisplayTitle(rawTitle, locale),
      body,
      icon: promptIcons[index] ?? strategy.icon,
    };
  });

  const primaryInsight = strategy.insights[0];
  const secondaryInsight = strategy.insights[1] ?? strategy.insights[0];

  return {
    ...content,
    suggestedPrompts,
    initialMessages: [
      {
        id: `assistant-persona-${strategy.id}`,
        role: "assistant",
        decisionId: strategy.operationalMode,
        content: `${strategy.sessionTitle} ${labels.activeThrough} ${operationalProfile.fullName}, ${operationalProfile.title}. ${operationalProfile.primaryResponsibility}`,
        responseCards: [
          {
            title: labels.operationalPain,
            text: operationalProfile.primaryPain,
            accent: "primary",
          },
          {
            title: labels.thinkingStructure,
            text: operationalProfile.mentalStructure.join(" → "),
            accent: "secondary",
          },
        ],
        conclusion: `${primaryInsight.detail} ${secondaryInsight.detail}`,
      },
    ],
    activeContext: [
      `${strategy.sessionTitle} ${labels.active}`,
      `${labels.operator}: ${operationalProfile.fullName}, ${operationalProfile.title}`,
      `${labels.primaryPain}: ${operationalProfile.primaryPain}`,
      `${labels.metricsPrioritized}: ${operationalProfile.prioritizedMetrics.join(" / ")}`,
      `${labels.operationalFears}: ${operationalProfile.operationalFears.join(" / ")}`,
      `${labels.vocabulary}: ${profile.vocabulary.join(" · ")}`,
      `${labels.mentalStructure}: ${operationalProfile.mentalStructure.join(" → ")}`,
      `${labels.retrievalWeighting}: ${Object.entries(strategy.retrievalWeighting).map(([key, value]) => `${key} ${value.toFixed(2)}`).join(" · ")}`,
      ...content.activeContext.slice(0, 1),
    ],
    recentTopics: strategy.examples.slice(0, 3).map((topic) => toDisplayTitle(topic, locale)),
    coreRule: strategy.operationalMode,
  };
}
