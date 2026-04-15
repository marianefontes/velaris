import type { Locale } from "../i18n/translations";
import type { DashboardData } from "../types/dashboard";

export function getMockDashboardData(locale: Locale): DashboardData {
  if (locale === "en-US") {
    return {
      metrics: [
        {
          id: "clarity",
          label: "Answer clarity",
          value: "91%",
          delta: "+6.4%",
          trend: "up",
          hint: "Users interpret recommendations better with direct answer plus context.",
        },
        {
          id: "trust",
          label: "Oracle trust",
          value: "84%",
          delta: "+9.1%",
          trend: "up",
          hint: "Transparent explanations increase adoption of system recommendations.",
        },
        {
          id: "rag",
          label: "RAG coverage",
          value: "126 docs",
          delta: "+18 sources",
          trend: "steady",
          hint: "Factual base ready to retrieve guidelines, components and examples.",
        },
        {
          id: "cognitive-load",
          label: "Cognitive load",
          value: "Low",
          delta: "-12%",
          trend: "up",
          hint: "Conversational UX reduced ambiguity in consultation journeys.",
        },
      ],
      velocity: [
        { sprint: "P1", committed: 42, delivered: 36, predicted: 40 },
        { sprint: "P2", committed: 48, delivered: 43, predicted: 46 },
        { sprint: "P3", committed: 57, delivered: 52, predicted: 55 },
        { sprint: "P4", committed: 63, delivered: 58, predicted: 60 },
        { sprint: "P5", committed: 69, delivered: 64, predicted: 67 },
      ],
      taskStatus: [
        { name: "Components", value: 38, color: "#deccfd" },
        { name: "Guidelines", value: 24, color: "#c2a0fc" },
        { name: "Accessibility", value: 16, color: "#b78efe" },
        { name: "Usage patterns", value: 11, color: "#ff6e84" },
      ],
      burndown: [
        { day: "Q1", ideal: 90, actual: 90 },
        { day: "Q2", ideal: 78, actual: 86 },
        { day: "Q3", ideal: 66, actual: 74 },
        { day: "Q4", ideal: 54, actual: 61 },
        { day: "Q5", ideal: 42, actual: 47 },
        { day: "Q6", ideal: 30, actual: 36 },
        { day: "Q7", ideal: 18, actual: 22 },
        { day: "Q8", ideal: 8, actual: 12 },
      ],
      sprintHealth: [
        {
          label: "Perceived clarity",
          value: 92,
          tone: "good",
          detail: "Responses with visual hierarchy improved immediate understanding.",
        },
        {
          label: "Perceived usefulness",
          value: 81,
          tone: "warning",
          detail: "There is still room for answers more adapted to the user profile.",
        },
        {
          label: "Recommendation trust",
          value: 76,
          tone: "good",
          detail: "Sources and justification make the oracle more credible.",
        },
      ],
      predictions: [
        {
          id: "component-recommendation",
          title: "Contextual component recommendation",
          risk: "medium",
          summary:
            "For destructive actions, the oracle recommends `Button Destructive` instead of a generic primary button, because its visual semantics communicate risk more clearly and reduce ambiguity in the flow.",
          confidence: 88,
          timeframe: "Real-time consultation",
          sources: [
            { id: "src-1", label: "Component Guidelines", kind: "document" },
            { id: "src-2", label: "Usage Patterns", kind: "document" },
          ],
        },
        {
          id: "handoff",
          title: "Profile-oriented explanation",
          risk: "low",
          summary:
            "The system tends to increase adoption when it responds in layers: direct answer, context, rationale, alternatives and sources. This format reduces cognitive effort and improves trust.",
          confidence: 93,
          timeframe: "Conversational flow",
          sources: [
            { id: "src-3", label: "UX Evaluation Notes", kind: "survey" },
            { id: "src-4", label: "Conversation Design Heuristics", kind: "document" },
          ],
        },
      ],
      explanation: {
        title: "Integrated architecture",
        explanation:
          "The oracle articulates four inseparable pillars from the project: RAG as the factual base for retrieving official documentation, XAI as the justification layer, the conversational agent as context orchestrator, and UX as the structure that turns technical output into clear, accessible and trustworthy guidance.",
        recommendation:
          "Structure each response in layers: direct answer, context, explanation, alternatives and sources. Adapt depth to the user profile and make limits explicit when the system lacks sufficient evidence.",
      },
      guidance: {
        start:
          "Start with user intent and task context. Before recommending a component, the oracle needs to understand the goal, risk, usage context and experience level of the person asking.",
        structure:
          "Structure the answer in layers: direct answer, context, why behind the recommendation, possible alternatives, when to use, when not to use and sources. This turns a rule into actionable guidance.",
        bestCombination:
          "The best combination is RAG to retrieve the factual base, XAI to justify the recommendation, a conversational agent to maintain context and UX to organize everything with clarity and low cognitive load.",
        whenToUse:
          "Use this format when someone needs to choose components, understand patterns, compare alternatives or make decisions that affect consistency, accessibility and design-system governance.",
        whenNotToUse:
          "Do not answer with a dry rule in ambiguous scenarios, and avoid overly long explanations for trivial questions. Also do not invent rationales when the factual base does not support the recommendation.",
        why:
          "The why is the core of the Oracle. Without it, the answer becomes summarized documentation; with it, people understand the logic of the recommendation, gain confidence and can reuse the reasoning in other contexts.",
        uxPrinciples: [
          {
            id: "clarity",
            title: "Communication clarity",
            description:
              "The answer should use accessible language, reduce ambiguity and make the main recommendation explicit from the start.",
          },
          {
            id: "hierarchy",
            title: "Visual hierarchy",
            description:
              "The most important information comes first; context, explanation, alternatives and sources come afterward in scannable layers.",
          },
          {
            id: "consistency",
            title: "Consistency in responses",
            description:
              "The oracle should repeat the same explanatory pattern to build predictability and strengthen trust.",
          },
          {
            id: "feedback",
            title: "Contextualized feedback",
            description:
              "The explanation should vary according to the scenario and the user's profile instead of repeating generic justifications.",
          },
          {
            id: "ambiguity",
            title: "Ambiguity prevention",
            description:
              "When uncertainty exists, the system should expose limits, ask for more context or escalate to a human specialist.",
          },
        ],
      },
    };
  }

  const isPtPt = locale === "pt-PT";

  return {
    metrics: [
      {
        id: "clarity",
        label: "Clareza das respostas",
        value: "91%",
        delta: "+6.4%",
        trend: "up",
        hint: isPtPt
          ? "Os utilizadores interpretam melhor recomendações com resposta direta + contexto."
          : "Usuários interpretam melhor recomendações com resposta direta + contexto.",
      },
      {
        id: "trust",
        label: isPtPt ? "Confiança no oráculo" : "Confiança no oráculo",
        value: "84%",
        delta: "+9.1%",
        trend: "up",
        hint: isPtPt
          ? "Explicações transparentes aumentam a adesão às recomendações do sistema."
          : "Explicações transparentes aumentam adesão às recomendações do sistema.",
      },
      {
        id: "rag",
        label: "Cobertura RAG",
        value: "126 docs",
        delta: isPtPt ? "+18 fontes" : "+18 fontes",
        trend: "steady",
        hint: isPtPt
          ? "Base factual pronta para recuperar guidelines, componentes e exemplos."
          : "Base factual pronta para recuperar guidelines, componentes e exemplos.",
      },
      {
        id: "cognitive-load",
        label: isPtPt ? "Carga cognitiva" : "Carga cognitiva",
        value: isPtPt ? "Baixa" : "Baixa",
        delta: "-12%",
        trend: "up",
        hint: isPtPt
          ? "UX conversacional reduziu a ambiguidade em jornadas de consulta."
          : "UX conversacional reduziu ambiguidade em jornadas de consulta.",
      },
    ],
    velocity: [
      { sprint: "F1", committed: 42, delivered: 36, predicted: 40 },
      { sprint: "F2", committed: 48, delivered: 43, predicted: 46 },
      { sprint: "F3", committed: 57, delivered: 52, predicted: 55 },
      { sprint: "F4", committed: 63, delivered: 58, predicted: 60 },
      { sprint: "F5", committed: 69, delivered: 64, predicted: 67 },
    ],
    taskStatus: [
      { name: "Componentes", value: 38, color: "#deccfd" },
      { name: "Guidelines", value: 24, color: "#c2a0fc" },
      { name: isPtPt ? "Acessibilidade" : "Acessibilidade", value: 16, color: "#b78efe" },
      { name: "Padrões de uso", value: 11, color: "#ff6e84" },
    ],
    burndown: [
      { day: "Q1", ideal: 90, actual: 90 },
      { day: "Q2", ideal: 78, actual: 86 },
      { day: "Q3", ideal: 66, actual: 74 },
      { day: "Q4", ideal: 54, actual: 61 },
      { day: "Q5", ideal: 42, actual: 47 },
      { day: "Q6", ideal: 30, actual: 36 },
      { day: "Q7", ideal: 18, actual: 22 },
      { day: "Q8", ideal: 8, actual: 12 },
    ],
    sprintHealth: [
      {
        label: isPtPt ? "Clareza percebida" : "Clareza percebida",
        value: 92,
        tone: "good",
        detail: isPtPt
          ? "Explicações com hierarquia visual melhoraram a compreensão imediata."
          : "Explicações com hierarquia visual melhoraram compreensão imediata.",
      },
      {
        label: isPtPt ? "Utilidade percebida" : "Utilidade percebida",
        value: 81,
        tone: "warning",
        detail: isPtPt
          ? "Ainda há espaço para respostas mais adaptadas ao perfil do utilizador."
          : "Ainda há espaço para respostas mais adaptadas ao perfil do usuário.",
      },
      {
        label: isPtPt ? "Confiança nas recomendações" : "Confiança nas recomendações",
        value: 76,
        tone: "good",
        detail: isPtPt
          ? "A presença de fontes e justificações torna o oráculo mais credível."
          : "A presença de fontes e justificativas torna o oráculo mais crível.",
      },
    ],
    predictions: [
      {
        id: "component-recommendation",
        title: "Recomendação contextual de componente",
        risk: "medium",
        summary:
          "Para ações destrutivas, o oráculo recomenda `Button Destructive` em vez de um botão primário genérico, pois a sua semântica visual comunica risco com mais clareza e reduz ambiguidades no fluxo.",
        confidence: 88,
        timeframe: isPtPt ? "Consulta em tempo real" : "Consulta em tempo real",
        sources: [
          { id: "src-1", label: "Component Guidelines", kind: "document" },
          { id: "src-2", label: "Usage Patterns", kind: "document" },
        ],
      },
      {
        id: "handoff",
        title: isPtPt ? "Explicação orientada por perfil" : "Explicação orientada por perfil",
        risk: "low",
        summary:
          "O sistema tende a aumentar a adoção quando responde em camadas: resposta direta, contexto, justificativa, alternativas e fontes. Esse formato reduz esforço cognitivo e melhora a confiança.",
        confidence: 93,
        timeframe: isPtPt ? "Fluxo conversacional" : "Fluxo conversacional",
        sources: [
          { id: "src-3", label: "UX Evaluation Notes", kind: "survey" },
          { id: "src-4", label: "Conversation Design Heuristics", kind: "document" },
        ],
      },
    ],
    explanation: {
      title: "Arquitetura integrada",
      explanation:
        "O oráculo articula quatro pilares indissociáveis descritos no projeto: RAG como base factual para recuperar documentação oficial, XAI como camada de justificativa, agente conversacional como orquestrador do contexto e UX como estrutura que transforma resposta técnica em orientação clara, acessível e confiável.",
      recommendation:
        "Estruture cada resposta em camadas: resposta direta, contexto, explicação, alternativas e fontes. Adapte a profundidade ao perfil do utilizador e explicite limites quando o sistema não tiver evidência suficiente.",
    },
    guidance: {
      start:
        "Comece pela intenção do utilizador e pelo contexto da tarefa. Antes de recomendar um componente, o oráculo precisa de entender objetivo, risco, contexto de uso e nível de experiência de quem pergunta.",
      structure:
        "Estruture a resposta em camadas: resposta direta, contexto, porquê da recomendação, alternativas possíveis, quando usar, quando não usar e fontes. Isto transforma regra em orientação acionável.",
      bestCombination:
        "A melhor combinação é RAG para recuperar a base factual, XAI para justificar a recomendação, agente conversacional para manter contexto e UX para organizar tudo com clareza e baixa carga cognitiva.",
      whenToUse:
        "Use este formato quando a pessoa precisar de escolher componentes, entender padrões, comparar alternativas ou tomar decisões com impacto em consistência, acessibilidade e governação do design system.",
      whenNotToUse:
        "Não responda apenas com regra seca em cenários ambíguos, nem use explicações longas demais para dúvidas triviais. Também não invente justificações quando a base factual não sustentar a recomendação.",
      why:
        "O porquê é o núcleo do Oráculo. Sem ele, a resposta vira documentação resumida; com ele, a pessoa entende a lógica da recomendação, ganha confiança e consegue reaplicar o raciocínio noutros contextos.",
      uxPrinciples: [
        {
          id: "clarity",
          title: "Clareza na comunicação",
          description:
            "A resposta deve usar linguagem acessível, reduzir ambiguidade e deixar explícita a recomendação principal logo no início.",
        },
        {
          id: "hierarchy",
          title: "Hierarquia visual",
          description:
            "A informação mais importante vem primeiro; contexto, explicação, alternativas e fontes entram depois, em camadas fáceis de percorrer.",
        },
        {
          id: "consistency",
          title: "Consistência nas respostas",
          description:
            "O oráculo precisa de repetir o mesmo padrão de explicação para construir previsibilidade e fortalecer a confiança.",
        },
        {
          id: "feedback",
          title: "Feedback contextualizado",
          description:
            "A explicação deve variar conforme o cenário e o perfil do utilizador, em vez de repetir justificações genéricas.",
        },
        {
          id: "ambiguity",
          title: "Prevenção de ambiguidades",
          description:
            "Quando houver incerteza, o sistema deve explicitar limites, pedir contexto extra ou encaminhar para um especialista humano.",
        },
      ],
    },
  };
}
