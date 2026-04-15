import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  ArrowUp,
  Clipboard,
  History,
  Layers3,
  Link2,
  MessageSquareMore,
  Palette,
  Paperclip,
  Settings2,
  Sparkles,
  ThumbsUp,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

interface SuggestedPrompt {
  title: string;
  body: string;
  icon: typeof Layers3;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  decisionId?: string;
  responseCards?: {
    title: string;
    text: string;
    accent: "primary" | "secondary";
  }[];
  conclusion?: string;
  isStreaming?: boolean;
  isError?: boolean;
}

interface HistoryEntry {
  role: "user" | "assistant";
  content: string;
}

// ── Markdown renderer simples (sem lib externa) ──────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList(key: string) {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="mb-3 flex flex-col gap-1 pl-4">
          {listItems.map((item, i) => (
            <li key={i} className="flex gap-2 text-xs leading-6 text-slate-300">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{inlineFormat(item)}</span>
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  }

  function inlineFormat(raw: string): React.ReactNode[] {
    const parts = raw.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={i} className="rounded bg-white/10 px-1 py-0.5 font-mono text-[11px] text-primary">{part.slice(1, -1)}</code>;
      return part;
    });
  }

  lines.forEach((line, idx) => {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("- ") || trimmed.startsWith("• ")) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList(String(idx));
      if (trimmed === "") {
        if (idx > 0) elements.push(<div key={`br-${idx}`} className="h-2" />);
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <p key={idx} className="mb-1 text-[11px] font-bold uppercase tracking-widest text-primary">
            {trimmed.slice(4)}
          </p>,
        );
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <p key={idx} className="mb-2 text-sm font-black text-white">
            {trimmed.slice(3)}
          </p>,
        );
      } else {
        elements.push(
          <p key={idx} className="text-sm leading-7 text-slate-300">
            {inlineFormat(trimmed)}
          </p>,
        );
      }
    }
  });
  flushList("end");
  return <div className="flex flex-col gap-0.5">{elements}</div>;
}

function getChatContent(locale: Locale) {
  if (locale === "en-US") {
    return {
      suggestedPrompts: [
        {
          title: "Component Guidance",
          body: "What component should I use for a multi-step form?",
          icon: Layers3,
        },
        {
          title: "Design Decisions",
          body: "Why did we choose glassmorphism over solid panels?",
          icon: Waypoints,
        },
        {
          title: "Token Reference",
          body: "What are the primary color tokens and their use cases?",
          icon: Palette,
        },
        {
          title: "Accessibility",
          body: "How do I ensure my layout meets accessibility standards?",
          icon: Accessibility,
        },
      ] satisfies SuggestedPrompt[],
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
              title: "Side Drawer — use when",
              text: "The form is contextually related to the current view and the user needs to keep referencing content behind it. It preserves spatial continuity.",
              accent: "primary",
            },
            {
              title: "Modal Overlay — use when",
              text: "The action needs full focus: confirmations, creation flows, critical alerts or moments where the background should temporarily disappear.",
              accent: "secondary",
            },
          ],
          conclusion:
            "If the user needs page context, use a drawer. If the task needs undivided attention, use a modal.",
        },
      ] satisfies ChatMessage[],
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
      replies: {
        tokenDecisionId: "Token Guidance",
        tokenContent:
          "The primary scale should anchor hierarchy, not decorate every surface. Use it to signal intent, emphasis and active system state.",
        tokenCardOneTitle: "Use primary tokens for",
        tokenCardOneText:
          "Primary actions, focus states, key highlights and explanatory cues that need deliberate emphasis.",
        tokenCardTwoTitle: "Avoid primary overload when",
        tokenCardTwoText:
          "Large surfaces, long-form reading areas or dense data regions would become visually noisy or lose contrast discipline.",
        tokenConclusion:
          "The token system works best when emphasis is scarce. Use strong color to guide attention, not to fill space.",
        accessibilityDecisionId: "Accessibility Guidance",
        accessibilityContent:
          "Start with readable contrast, focus visibility and spacing before layering atmosphere on top of the interface.",
        accessibilityCardOneTitle: "Check first",
        accessibilityCardOneText:
          "Contrast, keyboard flow, target size and semantic labels. These are the foundation of trust in a complex system.",
        accessibilityCardTwoTitle: "Then refine",
        accessibilityCardTwoText:
          "Motion, blur, glow and dense metadata should be tuned only after the base interaction remains readable and operable.",
        accessibilityConclusion:
          "Accessibility should shape the system from the first layout choice, not as a late-stage patch.",
        glassDecisionId: "Design Decision 07",
        glassContent:
          "Glassmorphism was chosen because it supports the product's ethereal identity while still allowing layered depth and contextual grouping.",
        glassCardOneTitle: "Why it works here",
        glassCardOneText:
          "Blur and translucent borders help separate layers without heavy dividers, preserving the atmospheric quality of Aetheris.",
        glassCardTwoTitle: "What to watch",
        glassCardTwoText:
          "If blur or opacity reduce readability, the style stops being supportive and becomes purely decorative.",
        glassConclusion:
          "The style is justified when it reinforces hierarchy and identity together. If it harms clarity, the decision should be revisited.",
        oracleDecisionId: "Oracle Guidance",
        oracleContent:
          "I would answer this by combining retrieved system evidence with a direct recommendation, the reasoning behind it and the UX principle that explains the trade-off.",
        oracleCardOneTitle: "How to start",
        oracleCardOneText:
          "Identify the user's goal, current context and whether they need exploration, confirmation or structured guidance.",
        oracleCardTwoTitle: "How to justify",
        oracleCardTwoText:
          "Explain what to use, when to use it, when not to use it and why the recommendation fits the design system.",
        oracleConclusion:
          "Beatrice should not just dictate rules. It should make the decision understandable and reusable.",
      },
    };
  }

  if (locale === "pt-PT") {
    return {
      suggestedPrompts: [
        {
          title: "Orientação de componentes",
          body: "Que componente devo utilizar para um formulário multi-etapas?",
          icon: Layers3,
        },
        {
          title: "Decisões de design",
          body: "Porque escolhemos glassmorphism em vez de painéis sólidos?",
          icon: Waypoints,
        },
        {
          title: "Referência de tokens",
          body: "Quais são os tokens de cor primários e em que casos devem ser usados?",
          icon: Palette,
        },
        {
          title: "Acessibilidade",
          body: "Como garanto que o meu layout cumpre os padrões de acessibilidade?",
          icon: Accessibility,
        },
      ] satisfies SuggestedPrompt[],
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
          content:
            "Boa pergunta. Esta é uma das escolhas espaciais mais importantes no design de interfaces porque afeta foco, continuidade e carga cognitiva.",
          responseCards: [
            {
              title: "Side Drawer — usar quando",
              text: "O formulário está relacionado com a vista atual e a pessoa precisa de continuar a consultar o conteúdo por trás. Preserva continuidade espacial.",
              accent: "primary",
            },
            {
              title: "Modal Overlay — usar quando",
              text: "A ação precisa de foco total: confirmações, fluxos de criação, alertas críticos ou momentos em que o fundo deve desaparecer temporariamente.",
              accent: "secondary",
            },
          ],
          conclusion:
            "Se o utilizador precisa do contexto da página, use uma drawer. Se a tarefa exige atenção indivisa, use um modal.",
        },
      ] satisfies ChatMessage[],
      activeContext: [
        "Sistema completo de tokens carregado",
        "22 componentes indexados",
        "17 decisões de design",
        "11 cenários de padrões",
        "Motor de raciocínio ativo",
      ],
      recentTopics: ["Modal vs. Drawer", "Utilização de tokens de cor", "Conformidade WCAG"],
      quickLinks: [
        { label: "Componentes", to: "/components", icon: Layers3 },
        { label: "Tokens", to: "/tokens", icon: Palette },
        { label: "Decisões", to: "/design-decisions", icon: Waypoints },
        { label: "Padrões", to: "/patterns", icon: Sparkles },
        { label: "Raciocínio", to: "/reasoning", icon: MessageSquareMore },
      ],
      justNow: "Agora mesmo",
      coreRule: "Regra-base",
      replies: {
        tokenDecisionId: "Orientação de Tokens",
        tokenContent:
          "A escala primária deve ancorar a hierarquia, não decorar todas as superfícies. Use-a para sinalizar intenção, ênfase e estado ativo do sistema.",
        tokenCardOneTitle: "Use tokens primários para",
        tokenCardOneText:
          "Ações primárias, estados de foco, destaques-chave e pistas explicativas que exijam ênfase deliberada.",
        tokenCardTwoTitle: "Evite excesso de primário quando",
        tokenCardTwoText:
          "Superfícies grandes, áreas de leitura longa ou regiões densas de dados ficariam visualmente ruidosas ou perderiam disciplina de contraste.",
        tokenConclusion:
          "O sistema de tokens funciona melhor quando a ênfase é escassa. Use cor forte para guiar a atenção, não para preencher espaço.",
        accessibilityDecisionId: "Orientação de Acessibilidade",
        accessibilityContent:
          "Comece por contraste legível, visibilidade de foco e espaçamento antes de acrescentar atmosfera sobre a interface.",
        accessibilityCardOneTitle: "Verifique primeiro",
        accessibilityCardOneText:
          "Contraste, fluxo de teclado, tamanho do alvo e rótulos semânticos. Esta é a base da confiança num sistema complexo.",
        accessibilityCardTwoTitle: "Depois refine",
        accessibilityCardTwoText:
          "Movimento, blur, glow e metadados densos só devem ser afinados depois de a interação base permanecer legível e operável.",
        accessibilityConclusion:
          "A acessibilidade deve moldar o sistema desde a primeira escolha de layout, e não como um remendo tardio.",
        glassDecisionId: "Decisão de Design 07",
        glassContent:
          "Glassmorphism foi escolhido porque sustenta a identidade etérea do produto, ao mesmo tempo que permite profundidade em camadas e agrupamento contextual.",
        glassCardOneTitle: "Porque funciona aqui",
        glassCardOneText:
          "Blur e contornos translúcidos ajudam a separar camadas sem divisores pesados, preservando a qualidade atmosférica do Aetheris.",
        glassCardTwoTitle: "O que vigiar",
        glassCardTwoText:
          "Se o blur ou a opacidade reduzirem a legibilidade, o estilo deixa de ser suporte e passa a ser apenas decorativo.",
        glassConclusion:
          "O estilo justifica-se quando reforça hierarquia e identidade em conjunto. Se prejudicar a clareza, a decisão deve ser revista.",
        oracleDecisionId: "Orientação do Oráculo",
        oracleContent:
          "Eu responderia a isto combinando evidência recuperada do sistema com uma recomendação direta, o raciocínio por trás dela e o princípio de UX que explica o trade-off.",
        oracleCardOneTitle: "Como começar",
        oracleCardOneText:
          "Identifique o objetivo do utilizador, o contexto atual e se ele precisa de exploração, confirmação ou orientação estruturada.",
        oracleCardTwoTitle: "Como justificar",
        oracleCardTwoText:
          "Explique o que usar, quando usar, quando não usar e porque a recomendação se adequa ao design system.",
        oracleConclusion:
          "A Beatrice não deve apenas ditar regras. Deve tornar a decisão compreensível e reutilizável.",
      },
    };
  }

  return {
    suggestedPrompts: [
      {
        title: "Orientação de componentes",
        body: "Que componente devo usar para um formulário multi-etapas?",
        icon: Layers3,
      },
      {
        title: "Decisões de design",
        body: "Por que escolhemos glassmorphism em vez de painéis sólidos?",
        icon: Waypoints,
      },
      {
        title: "Referência de tokens",
        body: "Quais são os tokens de cor primários e em que casos devem ser usados?",
        icon: Palette,
      },
      {
        title: "Acessibilidade",
        body: "Como garanto que meu layout atende aos padrões de acessibilidade?",
        icon: Accessibility,
      },
    ] satisfies SuggestedPrompt[],
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
        content:
          "Ótima pergunta. Essa é uma das escolhas espaciais mais importantes no design de interfaces porque afeta foco, continuidade e carga cognitiva.",
        responseCards: [
          {
            title: "Side Drawer — usar quando",
            text: "O formulário está contextualizado com a tela atual e a pessoa precisa continuar consultando o conteúdo por trás. Isso preserva continuidade espacial.",
            accent: "primary",
          },
          {
            title: "Modal Overlay — usar quando",
            text: "A ação precisa de foco total: confirmações, fluxos de criação, alertas críticos ou momentos em que o fundo deve desaparecer temporariamente.",
            accent: "secondary",
          },
        ],
        conclusion:
          "Se a pessoa precisa do contexto da página, use uma drawer. Se a tarefa exige atenção indivisa, use um modal.",
      },
    ] satisfies ChatMessage[],
    activeContext: [
      "Sistema completo de tokens carregado",
      "22 componentes indexados",
      "17 decisões de design",
      "11 cenários de padrões",
      "Motor de raciocínio ativo",
    ],
    recentTopics: ["Modal vs. Drawer", "Uso de tokens de cor", "Conformidade WCAG"],
    quickLinks: [
      { label: "Componentes", to: "/components", icon: Layers3 },
      { label: "Tokens", to: "/tokens", icon: Palette },
      { label: "Decisões", to: "/design-decisions", icon: Waypoints },
      { label: "Padrões", to: "/patterns", icon: Sparkles },
      { label: "Raciocínio", to: "/reasoning", icon: MessageSquareMore },
    ],
    justNow: "Agora mesmo",
    coreRule: "Regra central",
    replies: {
      tokenDecisionId: "Orientação de Tokens",
      tokenContent:
        "A escala primária deve ancorar a hierarquia, não decorar todas as superfícies. Use-a para sinalizar intenção, ênfase e estado ativo do sistema.",
      tokenCardOneTitle: "Use tokens primários para",
      tokenCardOneText:
        "Ações primárias, estados de foco, destaques-chave e pistas explicativas que precisem de ênfase deliberada.",
      tokenCardTwoTitle: "Evite excesso de primário quando",
      tokenCardTwoText:
        "Superfícies grandes, áreas de leitura longa ou regiões densas de dados ficariam visualmente ruidosas ou perderiam disciplina de contraste.",
      tokenConclusion:
        "O sistema de tokens funciona melhor quando a ênfase é escassa. Use cor forte para guiar a atenção, não para preencher espaço.",
      accessibilityDecisionId: "Orientação de Acessibilidade",
      accessibilityContent:
        "Comece por contraste legível, visibilidade de foco e espaçamento antes de adicionar atmosfera sobre a interface.",
      accessibilityCardOneTitle: "Verifique primeiro",
      accessibilityCardOneText:
        "Contraste, fluxo de teclado, tamanho do alvo e rótulos semânticos. Essa é a base da confiança em um sistema complexo.",
      accessibilityCardTwoTitle: "Depois refine",
      accessibilityCardTwoText:
        "Movimento, blur, glow e metadados densos só devem ser ajustados depois que a interação base permanecer legível e operável.",
      accessibilityConclusion:
        "A acessibilidade deve moldar o sistema desde a primeira escolha de layout, e não como um remendo tardio.",
      glassDecisionId: "Decisão de Design 07",
      glassContent:
        "Glassmorphism foi escolhido porque sustenta a identidade etérea do produto, ao mesmo tempo que permite profundidade em camadas e agrupamento contextual.",
      glassCardOneTitle: "Por que funciona aqui",
      glassCardOneText:
        "Blur e bordas translúcidas ajudam a separar camadas sem divisores pesados, preservando a qualidade atmosférica do Aetheris.",
      glassCardTwoTitle: "O que observar",
      glassCardTwoText:
        "Se o blur ou a opacidade reduzirem a legibilidade, o estilo deixa de apoiar e passa a ser apenas decorativo.",
      glassConclusion:
        "O estilo se justifica quando reforça hierarquia e identidade ao mesmo tempo. Se prejudicar a clareza, a decisão deve ser revisitada.",
      oracleDecisionId: "Orientação do Oráculo",
      oracleContent:
        "Eu responderia isso combinando evidência recuperada do sistema com uma recomendação direta, o raciocínio por trás dela e o princípio de UX que explica o trade-off.",
      oracleCardOneTitle: "Como começar",
      oracleCardOneText:
        "Identifique o objetivo da pessoa, o contexto atual e se ela precisa de exploração, confirmação ou orientação estruturada.",
      oracleCardTwoTitle: "Como justificar",
      oracleCardTwoText:
        "Explique o que usar, quando usar, quando não usar e por que a recomendação se encaixa no design system.",
      oracleConclusion:
        "A Beatrice não deve apenas ditar regras. Ela deve tornar a decisão compreensível e reutilizável.",
    },
  };
}

const ORACLE_API = import.meta.env.VITE_ORACLE_API_URL ?? "/api/chat";

function getPromptStats(messageCount: number) {
  return {
    messages: messageCount,
    decisions: Math.max(1, Math.floor(messageCount / 2)),
    confidence: "97%",
  };
}

export function BeatriceChatPage() {
  const { t, locale } = useI18n();
  const content = useMemo(() => getChatContent(locale), [locale]);
  const [messages, setMessages] = useState<ChatMessage[]>(content.initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(content.initialMessages);
    setInput("");
    setHistory([]);
  }, [content]);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stats = useMemo(() => getPromptStats(messages.length), [messages.length]);

  async function submitPrompt(promptText?: string) {
    const text = (promptText ?? input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
    };
    const streamId = `assistant-${Date.now()}`;
    const streamMsg: ChatMessage = {
      id: streamId,
      role: "assistant",
      content: "",
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, streamMsg]);
    setInput("");
    setIsLoading(true);

    const nextHistory: HistoryEntry[] = [...history, { role: "user", content: text }];
    setHistory(nextHistory);

    try {
      const res = await fetch(ORACLE_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });

      if (!res.ok || !res.body) throw new Error("no_server");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") break;
          try {
            const parsed = JSON.parse(payload) as { delta?: string };
            if (parsed.delta) {
              full += parsed.delta;
              setMessages((prev) =>
                prev.map((m) => (m.id === streamId ? { ...m, content: full } : m)),
              );
            }
          } catch {
            // skip malformed chunk
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === streamId ? { ...m, isStreaming: false } : m)),
      );
      setHistory((prev) => [...prev, { role: "assistant", content: full }]);
    } catch {
      const errorMsg =
        locale === "en-US"
          ? "⚠️ Beatrice is offline. Start the API server:\n\nANTHROPIC_API_KEY=sk-ant-... node server.cjs"
          : "⚠️ Beatrice está offline. Inicie o servidor da API:\n\nANTHROPIC_API_KEY=sk-ant-... node server.cjs";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === streamId ? { ...m, content: errorMsg, isStreaming: false, isError: true } : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-9rem)] gap-6 xl:grid-cols-[1fr_18rem]">
      <section className="flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-surface-container-high/40 backdrop-blur-3xl">
        <header className="flex items-center justify-between border-b border-white/10 bg-background/40 px-8 py-5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-signature">
              <Sparkles className="h-5 w-5 text-on-primary" />
            </div>
            <div>
              <p className="text-sm font-black tracking-tight text-white">Beatrice</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                <p className="text-[10px] uppercase tracking-[0.12em] text-slate-400">
                  {t("chat.online")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400">
              <History className="h-4 w-4" />
              {t("chat.history")}
            </button>
            <button className="glass-panel flex items-center gap-2 rounded-xl px-4 py-2 text-xs text-slate-400">
              <Settings2 className="h-4 w-4" />
              {t("chat.settings")}
            </button>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div className="mx-auto flex max-w-4xl flex-col gap-6">
              <div className="flex flex-col items-center justify-center px-4 pb-4 pt-8 text-center">
                <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-signature shadow-[0_0_48px_rgba(169,153,198,0.2)]">
                  <Sparkles className="h-9 w-9 text-on-primary" />
                </div>
                <h2 className="text-2xl font-black text-white">{t("chat.title")}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                  {t("chat.description")}
                </p>
              </div>

              <div className="mx-auto grid w-full max-w-3xl gap-3 md:grid-cols-2">
                {content.suggestedPrompts.map((prompt) => {
                  const Icon = prompt.icon;

                  return (
                    <button
                      key={prompt.title}
                      type="button"
                      onClick={() => {
                        setInput(prompt.body);
                        void submitPrompt(prompt.body);
                      }}
                      className="glass-panel rounded-2xl p-4 text-left transition-colors hover:border-primary/30"
                    >
                      <Icon className="mb-2 h-4 w-4 text-primary" />
                      <p className="mb-1 text-sm font-bold text-white">{prompt.title}</p>
                      <p className="text-xs leading-5 text-slate-400">{prompt.body}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-6 pt-2">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-end">
                      <div className="max-w-[32rem] rounded-[16px_16px_4px_16px] border border-primary/20 bg-[linear-gradient(45deg,rgba(222,204,253,0.15),rgba(194,160,252,0.15))] px-5 py-4">
                        <p className="text-sm leading-6 text-white">{message.content}</p>
                        <p className="mt-2 text-right text-[10px] text-slate-500">{content.justNow}</p>
                      </div>
                    </div>
                  ) : (
                    <div key={message.id} className="flex gap-4">
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-signature">
                        <Sparkles className="h-4 w-4 text-on-primary" />
                      </div>
                      <div className="flex-1">
                        <div
                          className={`max-w-[38rem] rounded-[4px_16px_16px_16px] border p-5 ${
                            message.isError
                              ? "border-red-500/20 bg-red-950/30"
                              : "border-white/10 bg-surface-container-highest/70"
                          }`}
                        >
                          {message.decisionId ? (
                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
                              Beatrice · {message.decisionId}
                            </p>
                          ) : null}

                          {/* Streaming typing indicator */}
                          {message.isStreaming && message.content === "" ? (
                            <div className="flex items-center gap-1.5 py-1">
                              {[0, 1, 2].map((i) => (
                                <span
                                  key={i}
                                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                                  style={{ animationDelay: `${i * 120}ms` }}
                                />
                              ))}
                            </div>
                          ) : message.responseCards ? (
                            /* Pre-canned structured messages */
                            <>
                              <p className="mb-4 text-sm leading-7 text-slate-300">{message.content}</p>
                              <div className="mb-4 flex flex-col gap-3">
                                {message.responseCards.map((card) => (
                                  <div
                                    key={card.title}
                                    className={`rounded-xl border p-3 ${
                                      card.accent === "primary"
                                        ? "border-primary/10 bg-primary/5"
                                        : "border-secondary/10 bg-secondary/5"
                                    }`}
                                  >
                                    <p className="mb-1 text-xs font-bold text-white">{card.title}</p>
                                    <p className="text-xs leading-6 text-slate-400">{card.text}</p>
                                  </div>
                                ))}
                              </div>
                              {message.conclusion ? (
                                <p className="text-xs leading-6 text-slate-400">
                                  {content.coreRule}:{" "}
                                  <span className="font-medium text-white">{message.conclusion}</span>
                                </p>
                              ) : null}
                            </>
                          ) : (
                            /* AI streaming / completed response */
                            <>
                              {renderMarkdown(message.content)}
                              {message.isStreaming ? (
                                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
                              ) : null}
                            </>
                          )}
                        </div>

                        {!message.isStreaming && !message.isError ? (
                          <div className="mt-2 flex gap-4 pl-1 text-[10px] text-slate-500">
                            <button className="flex items-center gap-1 transition-colors hover:text-primary">
                              <ThumbsUp className="h-3.5 w-3.5" />
                              {t("chat.helpful")}
                            </button>
                            <button
                              className="flex items-center gap-1 transition-colors hover:text-primary"
                              onClick={() => {
                                void navigator.clipboard.writeText(message.content);
                              }}
                            >
                              <Clipboard className="h-3.5 w-3.5" />
                              {t("chat.copy")}
                            </button>
                            <Link
                              to="/design-decisions"
                              className="flex items-center gap-1 transition-colors hover:text-primary"
                            >
                              <Link2 className="h-3.5 w-3.5" />
                              {t("chat.viewDecision")}
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t border-white/10 bg-background/60 px-8 py-5 backdrop-blur-xl">
            <div className="mx-auto max-w-3xl">
              <div className="glass-panel flex items-end gap-3 rounded-2xl px-4 py-4 shadow-[0_0_48px_rgba(169,153,198,0.1)]">
                <textarea
                  rows={1}
                  value={input}
                  disabled={isLoading}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submitPrompt();
                    }
                  }}
                  placeholder={isLoading ? "Beatrice está respondendo..." : t("chat.promptPlaceholder")}
                  className="max-h-[120px] flex-1 resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-500 disabled:opacity-50"
                />
                <div className="flex items-center gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/10 hover:text-white">
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => void submitPrompt()}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-signature text-on-primary transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isLoading ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <ArrowUp className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <p className="mt-3 text-center text-[10px] text-slate-700">
                {t("chat.grounded")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <aside className="glass-panel hidden min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-[28px] xl:flex">
        <div className="border-b border-white/10 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
            {t("chat.context")}
          </p>
        </div>

        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          <div className="glass-panel rounded-xl p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t("chat.activeContext")}
            </p>
            <div className="flex flex-col gap-2">
              {content.activeContext.map((item, index) => (
                <div key={item} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      index === content.activeContext.length - 1 ? "animate-pulse bg-primary" : "bg-green-400"
                    }`}
                  />
                  <p className="text-xs text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t("chat.recentTopics")}
            </p>
            <div className="flex flex-col gap-1">
              {content.recentTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => void submitPrompt(topic)}
                  className="flex items-center gap-2 py-1 text-left text-xs text-slate-400 transition-colors hover:text-primary"
                >
                  <MessageSquareMore className="h-4 w-4" />
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t("chat.quickLinks")}
            </p>
            <div className="flex flex-col gap-1">
              {content.quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="flex items-center gap-2 py-1 text-xs text-slate-400 transition-colors hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {t("chat.sessionStats")}
            </p>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-500">{t("chat.messages")}</span>
                <span className="font-bold text-white">{stats.messages}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t("chat.decisionsCited")}</span>
                <span className="font-bold text-primary">{stats.decisions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t("chat.avgConfidence")}</span>
                <span className="font-bold text-green-400">{stats.confidence}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
