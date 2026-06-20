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
      initialMessages: [],
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
        { label: "Tokens", to: "/foundations?focus=tokens", icon: Palette },
        { label: "Decisions", to: "/reasoning", icon: Waypoints },
        { label: "Patterns", to: "/foundations?focus=patterns", icon: Sparkles },
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
    initialMessages: [],
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
      { label: "Tokens", to: "/foundations?focus=tokens", icon: Palette },
      { label: "Decisões", to: "/reasoning", icon: Waypoints },
      { label: "Padrões", to: "/foundations?focus=patterns", icon: Sparkles },
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
      operator: "Operator",
      primaryPain: "Primary pain",
      metricsPrioritized: "Metrics prioritized",
      operationalFears: "Operational fears",
      vocabulary: "Vocabulary",
      mentalStructure: "Mental structure",
      retrievalWeighting: "Retrieval weighting",
      active: "active",
      activated: "activated.",
      context: "Context",
      canHelpWith: "I can help with",
      whatToAnalyze: "What would you like to analyze?",
    };
  }

  return {
    operator: "Operador",
    primaryPain: "Problema principal",
    metricsPrioritized: "Métricas priorizadas",
    operationalFears: "Medos operacionais",
    vocabulary: "Vocabulário",
    mentalStructure: "Estrutura mental",
    retrievalWeighting: "Peso do retrieval",
    active: "ativa",
    activated: locale === "pt-PT" ? "ativada." : "ativada.",
    context: "Contexto",
    canHelpWith: "Posso ajudar com",
    whatToAnalyze: locale === "pt-PT" ? "O que deseja analisar?" : "O que deseja analisar?",
  };
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildPersonaCapabilityBullets(strategy: PersonaStrategy): string[] {
  const profile = strategy.operationalProfile;
  const cognitive = strategy.cognitiveProfile;
  const titles = [
    profile.title,
    profile.prioritizedMetrics[0],
    profile.operationalFears[0],
    cognitive.decisionCriteria[0],
    ...strategy.navigationFocus.map((item) => item.label),
    ...profile.tools.slice(0, 2),
  ]
    .filter(Boolean)
    .map((item) => titleCase(item));

  return [...new Set(titles)].slice(0, 6);
}

export function buildPersonaWelcomeMessage(strategy: PersonaStrategy, locale: Locale): string {
  const labels = personaChatLabels(locale);
  const profile = strategy.operationalProfile;
  const capabilities = buildPersonaCapabilityBullets(strategy)
    .map((item) => `• ${item}`)
    .join("\n");

  return [
    "**Abraxos**",
    "",
    `${strategy.sessionTitle} ${labels.activated}`,
    "",
    `**${labels.context}:**`,
    profile.specialty,
    "",
    `**${labels.canHelpWith}:**`,
    "",
    capabilities,
    "",
    labels.whatToAnalyze,
  ].join("\n");
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

  return {
    ...content,
    suggestedPrompts,
    initialMessages: [
      {
        id: `assistant-persona-${strategy.id}`,
        role: "assistant",
        content: buildPersonaWelcomeMessage(strategy, locale),
        isWelcome: true,
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
