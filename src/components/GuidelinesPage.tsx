import { Compass } from "lucide-react";
import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";
import {
  FoundationSection,
  FoundationSectionHero,
} from "./ui/FoundationPrimitives";

interface RuleItem {
  id: string;
  text: string;
}

interface Principle {
  id: string;
  title: string;
  description: string;
  rules: RuleItem[];
}

interface Pillar {
  id: string;
  title: string;
  summary: string;
  principles: Principle[];
}

interface ToneExample {
  category: string;
  bad: string;
  good: string;
}

interface CaseStudy {
  beforeTitle: string;
  beforeBody: string;
  afterTitle: string;
  afterBody: string;
}

function buildRules(prefix: string, rules: string[]): RuleItem[] {
  return rules.map((text, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    text,
  }));
}

function getGuidelinesContent(locale: Locale) {
  if (locale === "en-US") {
    const pillars: Pillar[] = [
      {
        id: "clarity",
        title: "Clarity & Hierarchy",
        summary: "Make the primary message unmistakable before users parse supporting detail.",
        principles: [
          {
            id: "radical-clarity",
            title: "Radical Clarity",
            description:
              "Every interface element should earn its place through utility, comprehension and narrative precision.",
            rules: buildRules("C1", [
              "Expose one primary action per surface.",
              "Let the visual hierarchy answer what matters first.",
              "Reduce simultaneous emphasis signals competing for attention.",
              "Write labels that remove ambiguity instead of sounding clever.",
            ]),
          },
          {
            id: "information-layers",
            title: "Layered Information",
            description:
              "Interfaces should unfold in this hierarchy: signal for attention, context to guide action, and depth for value.",
            rules: buildRules("C2", [
              "Start with the answer before the explanation.",
              "Group related information into scannable blocks.",
              "Delay advanced detail until the user asks for it.",
              "Use section titles that communicate intent, not decoration.",
            ]),
          },
        ],
      },
      {
        id: "empathy",
        title: "Cognitive Empathy",
        summary: "Design around the user's mental model instead of the system's internal structure.",
        principles: [
          {
            id: "mental-models",
            title: "Mental Model Alignment",
            description:
              "Translate system complexity into concepts users already understand and can act on quickly.",
            rules: buildRules("E1", [
              "Prefer user-facing language over internal terminology.",
              "Mirror the order in which people naturally make decisions.",
              "Explain consequences in human outcomes, not system events.",
              "Match navigation labels to the task users think they are performing.",
            ]),
          },
          {
            id: "decision-support",
            title: "Decision Support",
            description:
              "The interface should lower decision cost by surfacing context, recommendations and trade-offs.",
            rules: buildRules("E2", [
              "State the recommendation before listing alternatives.",
              "Show why a suggested path is credible.",
              "Expose trade-offs when there is no perfect option.",
              "Help users move forward without requiring exhaustive reading.",
            ]),
          },
        ],
      },
      {
        id: "feedback",
        title: "Feedback & Trust",
        summary: "Fast, contextual feedback builds confidence and keeps intent connected to response.",
        principles: [
          {
            id: "immediate-feedback",
            title: "Immediate Feedback",
            description:
              "Every interaction demands immediate confirmation feedback and a visual or informational scale proportional to the task's critical relevance.",
            rules: buildRules("F1", [
              "Confirm successful actions without interrupting momentum.",
              "Escalate alerts only when inaction is costly.",
              "Preserve layout stability during async loading states.",
              "Make state changes visible where the action happened.",
            ]),
          },
          {
            id: "trust-calibration",
            title: "Trust Calibration",
            description:
              "Good systems reveal certainty, limits and provenance instead of pretending to be infallible.",
            rules: buildRules("F2", [
              "Communicate uncertainty when confidence is limited.",
              "Attach evidence to consequential recommendations.",
              "Separate deterministic rules from probabilistic guidance.",
              "Never overstate confidence to appear authoritative.",
            ]),
          },
        ],
      },
      {
        id: "language",
        title: "Language & Tone",
        summary: "Language should be direct, human and sensitive to context.",
        principles: [
          {
            id: "voice-tone",
            title: "Direct Human Voice",
            description:
              "Copy should sound clear, useful and calm, not bureaucratic or robotic.",
            rules: buildRules("L1", [
              "Lead with the action or outcome.",
              "Use active voice whenever possible.",
              "Prefer short, concrete sentences over abstract phrasing.",
              "Replace jargon unless precision truly demands it.",
            ]),
          },
          {
            id: "context-aware-tone",
            title: "Context-Aware Tone",
            description:
              "Tone should adapt to the moment so the system feels credible and supportive.",
            rules: buildRules("L2", [
              "Use empathy in error and recovery states.",
              "Keep confirmations brief and confident.",
              "Use warmth during onboarding, not everywhere.",
              "Avoid humor when users are blocked or stressed.",
            ]),
          },
        ],
      },
      {
        id: "inclusion",
        title: "Inclusion & Resilience",
        summary: "Accessible, forgiving systems should support broad human needs from the start.",
        principles: [
          {
            id: "inclusive-default",
            title: "Inclusive by Default",
            description:
              "Accessibility is the baseline, not a late-stage audit or compliance checkbox.",
            rules: buildRules("I1", [
              "Maintain strong contrast in all core surfaces.",
              "Support keyboard navigation across interactive flows.",
              "Use semantic labels that survive visual styling changes.",
              "Preserve readability at compact sizes and dense layouts.",
            ]),
          },
          {
            id: "forgiving-flows",
            title: "Forgiving Flows",
            description:
              "Good experiences reduce error likelihood and make recovery fast when mistakes happen.",
            rules: buildRules("I2", [
              "Prevent destructive errors before confirmation is needed.",
              "Offer recovery paths close to the point of failure.",
              "Preserve user input during validation or submission problems.",
              "Turn empty and error states into actionable next steps.",
            ]),
          },
        ],
      },
      {
        id: "systems",
        title: "Systems & Performance",
        summary: "Consistency, motion and performance make the product feel learnable and alive.",
        principles: [
          {
            id: "consistent-patterns",
            title: "Consistent Patterns",
            description:
              "Reusable interaction logic reduces cognitive cost and creates a learnable system.",
            rules: buildRules("S1", [
              "Reuse the same interaction shape for the same decision type.",
              "Keep spacing, elevation and feedback rules coherent across pages.",
              "Preserve naming consistency between docs, components and UI.",
              "Prefer evolution of existing patterns over new exceptions.",
            ]),
          },
          {
            id: "performance-motion",
            title: "Performance as UX",
            description:
              "Responsive systems and meaningful motion reinforce trust, orientation and quality.",
            rules: buildRules("S2", [
              "Use motion to explain change, not decorate transitions.",
              "Keep interface feedback within a believable response window.",
              "Avoid animations that delay comprehension or control.",
              "Treat perceived speed as part of the product design, not just engineering.",
            ]),
          },
        ],
      },
    ];

    return {
      heroTitle: "Design",
      heroAccent: "Guidelines",
      heroEyebrow: "Complete matrix for explainable product design",
      version: "Guidelines v3.0",
      versionText:
        "This page now formalizes the full guideline architecture: 6 strategic pillars, 12 design principles and 48 operational rules for trustworthy, explainable and human-centered product experiences.",
      stats: [
        ["Pillars", "6"],
        ["Principles", "12"],
        ["Rules", "48"],
      ] as const,
      pillarsTitle: "Guideline Architecture",
      pillarsBadge: "Oracle-ready framework",
      principleLabel: "Principle",
      rulesLabel: "Rules",
      voiceTitle: "Tone Calibration",
      toneExamplesTitle: "Writing Examples",
      reviewEyebrow: "Velaris review",
      reviewTitle: "Guideline Compliance Report",
      reviewBadge: "92% aligned",
      reviewStats: [
        ["Clarity", "96%"],
        ["Accessibility", "94%"],
        ["Tone", "89%"],
        ["Consistency", "91%"],
      ] as const,
      toneExamples: [
        {
          category: "Error Messages",
          bad: "Error 403: Access denied.",
          good: "You do not have access to this page. Contact your admin to request permission.",
        },
        {
          category: "Empty States",
          bad: "No data found.",
          good: "Nothing here yet. Create your first project to get started.",
        },
        {
          category: "Confirmations",
          bad: "Operation successful.",
          good: "Changes saved. Your tokens are now available across the system.",
        },
      ] satisfies ToneExample[],
      pillars,
    };
  }

  const isPtPt = locale === "pt-PT";

  const pillars: Pillar[] = [
    {
      id: "clarity",
      title: "Clareza e Hierarquia",
      summary: isPtPt
        ? "Torne a mensagem principal inequívoca antes de a pessoa processar o detalhe."
        : "Torne a mensagem principal inequívoca antes de a pessoa processar o detalhe.",
      principles: [
        {
          id: "radical-clarity",
          title: isPtPt ? "Clareza Radical" : "Clareza Radical",
          description:
            "Cada elemento da interface deve justificar a sua existência por utilidade, compreensão e precisão narrativa.",
          rules: buildRules("C1", [
            "Exponha uma ação principal por superfície.",
            "Deixe a hierarquia visual responder primeiro ao que importa.",
            "Reduza sinais simultâneos de ênfase que competem pela atenção.",
            "Escreva rótulos que removam ambiguidade em vez de soar inteligentes.",
          ]),
        },
        {
          id: "information-layers",
          title: isPtPt ? "Informação em Camadas" : "Informação em Camadas",
          description:
            "A interface deve desvendar-se na seguinte hierarquia: sinal para atenção, contexto para orientar a ação e profundidade para valor.",
          rules: buildRules("C2", [
            isPtPt ? "Comece pela resposta antes da explicação." : "Comece pela resposta antes da explicação.",
            isPtPt ? "Agrupe informação relacionada em blocos escaneáveis." : "Agrupe informação relacionada em blocos escaneáveis.",
            isPtPt ? "Atrase detalhe avançado até a pessoa o pedir." : "Atrase detalhe avançado até a pessoa pedir.",
            "Use títulos de secção que comuniquem intenção, não decoração.",
          ]),
        },
      ],
    },
    {
      id: "empathy",
      title: isPtPt ? "Empatia Cognitiva" : "Empatia Cognitiva",
      summary: isPtPt
        ? "Desenhe à volta do modelo mental da pessoa, não da estrutura interna do sistema."
        : "Desenhe em torno do modelo mental da pessoa, não da estrutura interna do sistema.",
      principles: [
        {
          id: "mental-models",
          title: isPtPt ? "Alinhamento com o Modelo Mental" : "Alinhamento com o Modelo Mental",
          description:
            "Traduza complexidade sistémica em conceitos que as pessoas já entendem e conseguem usar rapidamente.",
          rules: buildRules("E1", [
            "Prefira linguagem de utilizador em vez de terminologia interna.",
            isPtPt ? "Espelhe a ordem em que as pessoas naturalmente decidem." : "Espelhe a ordem em que as pessoas naturalmente decidem.",
            isPtPt ? "Explique consequências em resultados humanos, não em eventos de sistema." : "Explique consequências em resultados humanos, não em eventos de sistema.",
            "Faça labels de navegação refletirem a tarefa que a pessoa acredita estar a executar.",
          ]),
        },
        {
          id: "decision-support",
          title: isPtPt ? "Suporte à Decisão" : "Suporte à Decisão",
          description:
            "A interface deve reduzir o custo de decisão ao expor contexto, recomendação e trade-offs.",
          rules: buildRules("E2", [
            "Declare a recomendação antes de listar alternativas.",
            "Mostre por que o caminho sugerido é credível.",
            "Exponha trade-offs quando não existir opção perfeita.",
            "Ajude a pessoa a avançar sem exigir leitura exaustiva.",
          ]),
        },
      ],
    },
    {
      id: "feedback",
      title: isPtPt ? "Feedback e Confiança" : "Feedback e Confiança",
      summary: isPtPt
        ? "Feedback rápido e contextualizado constrói confiança e mantém intenção ligada à resposta."
        : "Feedback rápido e contextualizado constrói confiança e mantém intenção ligada à resposta.",
      principles: [
        {
          id: "immediate-feedback",
          title: isPtPt ? "Feedback Imediato" : "Feedback Imediato",
          description:
            "Cada interação exige um feedback imediato na sua confirmação e uma escala visual ou informativa que seja proporcional à relevância crítica da tarefa.",
          rules: buildRules("F1", [
            isPtPt ? "Confirme sucesso sem interromper o ritmo." : "Confirme sucesso sem interromper o ritmo.",
            isPtPt ? "Escalone alertas apenas quando a inação for cara." : "Escalone alertas apenas quando a inação for cara.",
            isPtPt ? "Preserve estabilidade de layout durante loading assíncrono." : "Preserve estabilidade de layout durante loading assíncrono.",
            "Torne mudanças de estado visíveis perto do ponto da ação.",
          ]),
        },
        {
          id: "trust-calibration",
          title: isPtPt ? "Calibração de Confiança" : "Calibração de Confiança",
          description:
            "Bons sistemas revelam certeza, limites e proveniência em vez de fingir infalibilidade.",
          rules: buildRules("F2", [
            "Comunique incerteza quando a confiança for limitada.",
            "Associe evidência a recomendações consequentes.",
            "Separe regras determinísticas de guidance probabilístico.",
            "Nunca infle confiança para parecer mais autoritário.",
          ]),
        },
      ],
    },
    {
      id: "language",
      title: isPtPt ? "Linguagem e Tom" : "Linguagem e Tom",
      summary: isPtPt
        ? "A linguagem deve ser direta, humana e sensível ao contexto."
        : "A linguagem deve ser direta, humana e sensível ao contexto.",
      principles: [
        {
          id: "voice",
          title: isPtPt ? "Voz Humana Direta" : "Voz Humana Direta",
          description:
            "O texto deve soar claro, útil e calmo, nunca burocrático ou robótico.",
          rules: buildRules("L1", [
            "Comece pela ação ou pelo resultado.",
            "Use voz ativa sempre que possível.",
            "Prefira frases curtas e concretas em vez de abstrações.",
            "Substitua jargão salvo quando precisão o exigir.",
          ]),
        },
        {
          id: "tone",
          title: isPtPt ? "Tom Sensível ao Contexto" : "Tom Sensível ao Contexto",
          description:
            "O tom deve adaptar-se ao momento para que o sistema pareça credível e apoiador.",
          rules: buildRules("L2", [
            isPtPt ? "Use empatia em erros e recuperação." : "Use empatia em erros e recuperação.",
            isPtPt ? "Mantenha confirmações breves e confiantes." : "Mantenha confirmações breves e confiantes.",
            isPtPt ? "Use calor humano no onboarding, não em todo lado." : "Use calor humano no onboarding, não em toda parte.",
            isPtPt ? "Evite humor quando a pessoa está bloqueada ou sob stress." : "Evite humor quando a pessoa está bloqueada ou sob estresse.",
          ]),
        },
      ],
    },
    {
      id: "inclusion",
      title: isPtPt ? "Inclusão e Resiliência" : "Inclusão e Resiliência",
      summary: isPtPt
        ? "Sistemas acessíveis e tolerantes devem suportar uma ampla gama de necessidades humanas desde o início."
        : "Sistemas acessíveis e tolerantes devem suportar uma ampla gama de necessidades humanas desde o início.",
      principles: [
        {
          id: "inclusive-default",
          title: isPtPt ? "Inclusivo por Defeito" : "Inclusivo por Padrão",
          description:
            "Acessibilidade é a base, não uma auditoria tardia ou checklist de conformidade.",
          rules: buildRules("I1", [
            "Mantenha contraste forte em superfícies centrais.",
            "Suporte navegação por teclado em fluxos interativos.",
            "Use labels semânticos que sobrevivam a mudanças visuais.",
            "Preserve legibilidade em tamanhos compactos e layouts densos.",
          ]),
        },
        {
          id: "forgiving-flows",
          title: isPtPt ? "Fluxos Tolerantes" : "Fluxos Tolerantes",
          description:
            "Boas experiências reduzem a probabilidade de erro e tornam a recuperação rápida quando ele acontece.",
          rules: buildRules("I2", [
            "Previna erros destrutivos antes de pedir confirmação.",
            "Ofereça caminhos de recuperação perto do ponto de falha.",
            "Preserve input do utilizador durante problemas de validação ou envio.",
            "Transforme estados vazios e de erro em próximos passos acionáveis.",
          ]),
        },
      ],
    },
    {
      id: "systems",
      title: isPtPt ? "Sistemas e Performance" : "Sistemas e Performance",
      summary: isPtPt
        ? "Consistência, movimento e desempenho fazem o produto parecer aprendível e vivo."
        : "Consistência, movimento e desempenho fazem o produto parecer aprendível e vivo.",
      principles: [
        {
          id: "patterns",
          title: isPtPt ? "Padrões Consistentes" : "Padrões Consistentes",
          description:
            "Lógica de interação reutilizável reduz custo cognitivo e cria um sistema aprendível.",
          rules: buildRules("S1", [
            "Reutilize a mesma forma de interação para o mesmo tipo de decisão.",
            "Mantenha espaçamento, elevação e feedback coerentes entre páginas.",
            "Preserve consistência de naming entre docs, componentes e UI.",
            "Prefira evoluir padrões existentes em vez de criar novas exceções.",
          ]),
        },
        {
          id: "performance",
          title: "Performance é UX",
          description:
            "Sistemas responsivos e movimento com propósito reforçam confiança, orientação e qualidade.",
          rules: buildRules("S2", [
            "Use movimento para explicar mudança, não para decorar transição.",
            "Mantenha feedback da interface dentro de uma janela de resposta crível.",
            "Evite animações que atrasem compreensão ou controlo.",
            "Trate velocidade percebida como parte do design do produto.",
          ]),
        },
      ],
    },
  ];

  return {
    heroTitle: isPtPt ? "Guia de" : "Guia de",
    heroAccent: isPtPt ? "Diretrizes" : "Diretrizes",
    heroEyebrow: isPtPt
      ? "Matriz completa com 6 pilares, 12 princípios e 48 regras para design explicável de produto"
      : "Matriz completa com 6 pilares, 12 princípios e 48 regras para design explicável de produto",
    version: "Guidelines v3.0",
    versionText: isPtPt
      ? "Esta página formaliza agora a arquitetura completa das diretrizes: 6 pilares estratégicos, 12 princípios de design e 48 regras operacionais para experiências de produto confiáveis, explicáveis e centradas no humano."
      : "Esta página formaliza agora a arquitetura completa das diretrizes: 6 pilares estratégicos, 12 princípios de design e 48 regras operacionais para experiências de produto confiáveis, explicáveis e centradas no humano.",
    stats: [
      [isPtPt ? "Pilares" : "Pilares", "6"],
      [isPtPt ? "Princípios" : "Princípios", "12"],
      [isPtPt ? "Regras" : "Regras", "48"],
    ] as const,
    pillarsTitle: isPtPt ? "Arquitetura das Diretrizes" : "Arquitetura das Diretrizes",
    pillarsBadge: isPtPt ? "Framework pronto para oráculo" : "Framework pronto para oráculo",
    principleLabel: isPtPt ? "Princípio" : "Princípio",
    rulesLabel: isPtPt ? "Regras" : "Regras",
    voiceTitle: isPtPt ? "Calibração de Tom" : "Calibração de Tom",
    toneExamplesTitle: isPtPt ? "Exemplos de Escrita" : "Exemplos de Escrita",
    reviewEyebrow: "Velaris review",
    reviewTitle: isPtPt ? "Relatório de Conformidade" : "Relatório de Conformidade",
    reviewBadge: isPtPt ? "92% alinhado" : "92% alinhado",
    reviewStats: [
      [isPtPt ? "Clareza" : "Clareza", "96%"],
      [isPtPt ? "Acessibilidade" : "Acessibilidade", "94%"],
      [isPtPt ? "Tom" : "Tom", "89%"],
      [isPtPt ? "Consistência" : "Consistência", "91%"],
    ] as const,
    toneExamples: [
      {
        category: isPtPt ? "Mensagens de Erro" : "Mensagens de Erro",
        bad: "Erro 403: acesso negado.",
        good: isPtPt
          ? "Não tem acesso a esta página. Contacte o admin para pedir permissão."
          : "Você não tem acesso a esta página. Fale com o admin para pedir permissão.",
      },
      {
        category: isPtPt ? "Estados Vazios" : "Estados Vazios",
        bad: "Nenhum dado encontrado.",
        good: isPtPt
          ? "Ainda não há nada aqui. Crie o seu primeiro projeto para começar."
          : "Ainda não há nada aqui. Crie seu primeiro projeto para começar.",
      },
      {
        category: isPtPt ? "Confirmações" : "Confirmações",
        bad: "Operação concluída com sucesso.",
        good: isPtPt
          ? "Alterações guardadas. Os seus tokens já estão disponíveis em todo o sistema."
          : "Alterações salvas. Seus tokens já estão disponíveis em todo o sistema.",
      },
    ] satisfies ToneExample[],
    pillars,
  };
}

const RULE_NOTES: Record<string, { en: string; pt: string }> = {
  "C1-01": {
    en: "A single dominant action keeps priority visible without requiring interpretation.",
    pt: "Uma única ação dominante mantém a prioridade visível sem exigir interpretação.",
  },
  "C1-02": {
    en: "Scale, position and contrast should reveal the reading order before copy is processed.",
    pt: "Escala, posição e contraste devem revelar a ordem de leitura antes do texto ser processado.",
  },
  "C1-03": {
    en: "When everything asks for attention, the interface stops communicating priority.",
    pt: "Quando tudo pede atenção, a interface deixa de comunicar prioridade.",
  },
  "C1-04": {
    en: "Labels should name the outcome directly and remove the need for inference.",
    pt: "Os rótulos devem nomear o resultado diretamente e eliminar a necessidade de inferência.",
  },
  "C2-01": {
    en: "Lead with the conclusion so detail becomes support rather than an obstacle.",
    pt: "Comece pela conclusão para que o detalhe funcione como apoio, não como obstáculo.",
  },
  "C2-02": {
    en: "Related information becomes easier to compare when it shares a clear visual region.",
    pt: "Informações relacionadas tornam-se mais fáceis de comparar quando ocupam uma região visual clara.",
  },
  "C2-03": {
    en: "Advanced detail should appear only when it improves the decision at hand.",
    pt: "O detalhe avançado deve aparecer apenas quando melhora a decisão em curso.",
  },
  "C2-04": {
    en: "A section title should explain the purpose of what follows, not merely label it.",
    pt: "O título de uma seção deve explicar o propósito do conteúdo seguinte, não apenas nomeá-lo.",
  },
  "E1-01": {
    en: "Use the vocabulary of the task, not the vocabulary of the implementation.",
    pt: "Use o vocabulário da tarefa, não o vocabulário da implementação.",
  },
  "E1-02": {
    en: "The sequence of information should follow the way people evaluate and decide.",
    pt: "A sequência da informação deve acompanhar a forma como as pessoas avaliam e decidem.",
  },
  "E1-03": {
    en: "Consequences become useful when they are described through their human impact.",
    pt: "As consequências tornam-se úteis quando são descritas pelo seu impacto humano.",
  },
  "E1-04": {
    en: "Navigation should reflect the intent a person recognizes, not the system module.",
    pt: "A navegação deve refletir a intenção reconhecida pela pessoa, não o módulo do sistema.",
  },
  "E2-01": {
    en: "A recommendation gives the comparison a clear point of departure.",
    pt: "Uma recomendação oferece à comparação um ponto de partida claro.",
  },
  "E2-02": {
    en: "Evidence turns a suggested path into a decision someone can defend.",
    pt: "A evidência transforma um caminho sugerido numa decisão que pode ser defendida.",
  },
  "E2-03": {
    en: "Trade-offs should remain visible whenever the decision has meaningful costs.",
    pt: "Os trade-offs devem permanecer visíveis sempre que a decisão tiver custos relevantes.",
  },
  "E2-04": {
    en: "The interface should support progress before demanding exhaustive comprehension.",
    pt: "A interface deve apoiar o avanço antes de exigir compreensão exaustiva.",
  },
  "F1-01": {
    en: "Confirmation should close the interaction without becoming a new interruption.",
    pt: "A confirmação deve concluir a interação sem se transformar numa nova interrupção.",
  },
  "F1-02": {
    en: "Alert intensity should match the cost of ignoring the message.",
    pt: "A intensidade do alerta deve corresponder ao custo de ignorar a mensagem.",
  },
  "F1-03": {
    en: "Stable geometry preserves orientation while the system is still responding.",
    pt: "Uma geometria estável preserva a orientação enquanto o sistema responde.",
  },
  "F1-04": {
    en: "Feedback belongs beside the action so cause and effect remain connected.",
    pt: "O feedback pertence junto da ação para manter causa e efeito conectados.",
  },
  "F2-01": {
    en: "Visible uncertainty lets people calibrate how much weight to give the answer.",
    pt: "A incerteza visível permite calibrar o peso que deve ser dado à resposta.",
  },
  "F2-02": {
    en: "Consequential guidance should carry the evidence that makes it credible.",
    pt: "Orientações consequentes devem trazer a evidência que as torna credíveis.",
  },
  "F2-03": {
    en: "Rules and predictions require different language, treatment and expectations.",
    pt: "Regras e previsões exigem linguagem, tratamento e expectativas diferentes.",
  },
  "F2-04": {
    en: "Authority should come from traceability, never from exaggerated certainty.",
    pt: "A autoridade deve vir da rastreabilidade, nunca de uma certeza exagerada.",
  },
  "L1-01": {
    en: "Put the useful outcome first so the sentence can be understood at a glance.",
    pt: "Coloque primeiro o resultado útil para que a frase seja compreendida de imediato.",
  },
  "L1-02": {
    en: "Active voice makes responsibility and next action easier to identify.",
    pt: "A voz ativa torna a responsabilidade e a próxima ação mais fáceis de identificar.",
  },
  "L1-03": {
    en: "Concrete language reduces interpretation cost and improves recall.",
    pt: "A linguagem concreta reduz o custo de interpretação e melhora a memorização.",
  },
  "L1-04": {
    en: "Specialized terms should remain only when they add precision the user needs.",
    pt: "Termos especializados devem permanecer apenas quando acrescentam precisão necessária.",
  },
  "L2-01": {
    en: "Recovery language should acknowledge the problem and make the next step clear.",
    pt: "A linguagem de recuperação deve reconhecer o problema e tornar claro o próximo passo.",
  },
  "L2-02": {
    en: "A confirmation works best when it is brief, specific and final.",
    pt: "Uma confirmação funciona melhor quando é breve, específica e conclusiva.",
  },
  "L2-03": {
    en: "Warmth is most useful when someone is learning, not as a constant performance.",
    pt: "O calor humano é mais útil durante a aprendizagem, não como atuação constante.",
  },
  "L2-04": {
    en: "Stressful moments require clarity and respect rather than personality.",
    pt: "Momentos de stress exigem clareza e respeito, não demonstrações de personalidade.",
  },
  "I1-01": {
    en: "Core information must remain legible across themes, displays and visual conditions.",
    pt: "A informação central deve permanecer legível entre temas, ecrãs e condições visuais.",
  },
  "I1-02": {
    en: "Every essential action should be reachable and understandable without a pointer.",
    pt: "Toda ação essencial deve ser alcançável e compreensível sem um dispositivo apontador.",
  },
  "I1-03": {
    en: "Meaning should survive when visual styling is removed or interpreted differently.",
    pt: "O significado deve sobreviver quando o estilo visual é removido ou interpretado de outra forma.",
  },
  "I1-04": {
    en: "Compact layouts still need sufficient type size, spacing and reading rhythm.",
    pt: "Layouts compactos continuam a exigir tamanho, espaçamento e ritmo de leitura adequados.",
  },
  "I2-01": {
    en: "The safest flow removes avoidable mistakes before confirmation becomes necessary.",
    pt: "O fluxo mais seguro elimina erros evitáveis antes de ser necessária uma confirmação.",
  },
  "I2-02": {
    en: "Recovery should appear where the failure occurred and preserve the user's context.",
    pt: "A recuperação deve surgir onde a falha ocorreu e preservar o contexto da pessoa.",
  },
  "I2-03": {
    en: "Input represents effort and should not disappear because the system failed.",
    pt: "O conteúdo introduzido representa esforço e não deve desaparecer por falha do sistema.",
  },
  "I2-04": {
    en: "A blocked state should explain what happened and provide a viable next move.",
    pt: "Um estado bloqueado deve explicar o que aconteceu e oferecer um próximo passo viável.",
  },
  "S1-01": {
    en: "Repeated decisions should reuse the same interaction grammar.",
    pt: "Decisões repetidas devem reutilizar a mesma gramática de interação.",
  },
  "S1-02": {
    en: "Coherent spatial and feedback rules make separate pages feel like one system.",
    pt: "Regras espaciais e de feedback coerentes fazem páginas distintas parecerem um único sistema.",
  },
  "S1-03": {
    en: "Shared naming keeps implementation, documentation and interface aligned.",
    pt: "Uma nomenclatura partilhada mantém implementação, documentação e interface alinhadas.",
  },
  "S1-04": {
    en: "An existing pattern should evolve before a new exception is introduced.",
    pt: "Um padrão existente deve evoluir antes de ser introduzida uma nova exceção.",
  },
  "S2-01": {
    en: "Motion should clarify where content came from, changed or moved.",
    pt: "O movimento deve esclarecer de onde o conteúdo veio, como mudou ou para onde foi.",
  },
  "S2-02": {
    en: "Feedback must arrive quickly enough to preserve the sense of direct manipulation.",
    pt: "O feedback deve chegar cedo o suficiente para preservar a sensação de manipulação direta.",
  },
  "S2-03": {
    en: "Animation should never hold comprehension or control hostage.",
    pt: "A animação nunca deve atrasar a compreensão nem o controlo.",
  },
  "S2-04": {
    en: "Perceived speed is shaped by sequence, feedback and stability, not latency alone.",
    pt: "A velocidade percebida depende de sequência, feedback e estabilidade, não apenas de latência.",
  },
};

const CASE_STUDIES: Record<
  string,
  { en: CaseStudy; "pt-BR": CaseStudy; "pt-PT": CaseStudy }
> = {
  "radical-clarity": {
    en: {
      beforeTitle: "Monthly product performance report",
      beforeBody: "See all data, download CSV, compare periods and explore 22 additional metrics.",
      afterTitle: "Product performance",
      afterBody: "Review this month's three decisive indicators, then open the complete report when needed.",
    },
    "pt-BR": {
      beforeTitle: "Relatório mensal de desempenho do produto",
      beforeBody: "Veja todos os dados, baixe o CSV, compare períodos e explore outras 22 métricas.",
      afterTitle: "Desempenho do produto",
      afterBody: "Consulte os três indicadores decisivos do mês e abra o relatório completo quando necessário.",
    },
    "pt-PT": {
      beforeTitle: "Relatório mensal de desempenho do produto",
      beforeBody: "Consulte todos os dados, descarregue o CSV, compare períodos e explore mais 22 métricas.",
      afterTitle: "Desempenho do produto",
      afterBody: "Consulte os três indicadores decisivos do mês e abra o relatório completo quando necessário.",
    },
  },
  "information-layers": {
    en: {
      beforeTitle: "Everything appears at once",
      beforeBody: "Summary, filters, methodology and raw data compete in the same reading plane.",
      afterTitle: "Answer, context, depth",
      afterBody: "The conclusion leads, supporting context follows, and technical detail remains available below.",
    },
    "pt-BR": {
      beforeTitle: "Tudo aparece ao mesmo tempo",
      beforeBody: "Resumo, filtros, metodologia e dados brutos competem no mesmo plano de leitura.",
      afterTitle: "Resposta, contexto e profundidade",
      afterBody: "A conclusão vem primeiro, o contexto orienta e o detalhe técnico permanece disponível abaixo.",
    },
    "pt-PT": {
      beforeTitle: "Tudo surge ao mesmo tempo",
      beforeBody: "Resumo, filtros, metodologia e dados brutos competem no mesmo plano de leitura.",
      afterTitle: "Resposta, contexto e profundidade",
      afterBody: "A conclusão surge primeiro, o contexto orienta e o detalhe técnico permanece disponível abaixo.",
    },
  },
  "mental-models": {
    en: {
      beforeTitle: "Internal system language",
      beforeBody: "Initiate entity provisioning and configure downstream access policies.",
      afterTitle: "Task language",
      afterBody: "Create the workspace, then choose who can access it.",
    },
    "pt-BR": {
      beforeTitle: "Linguagem interna do sistema",
      beforeBody: "Inicie o provisionamento da entidade e configure as políticas de acesso subsequentes.",
      afterTitle: "Linguagem da tarefa",
      afterBody: "Crie o espaço de trabalho e escolha quem poderá acessá-lo.",
    },
    "pt-PT": {
      beforeTitle: "Linguagem interna do sistema",
      beforeBody: "Inicie o aprovisionamento da entidade e configure as políticas de acesso subsequentes.",
      afterTitle: "Linguagem da tarefa",
      afterBody: "Crie o espaço de trabalho e escolha quem lhe pode aceder.",
    },
  },
  "decision-support": {
    en: {
      beforeTitle: "A list without a position",
      beforeBody: "Three options are presented with equal weight and no explanation of consequences.",
      afterTitle: "A recommendation with boundaries",
      afterBody: "One path is recommended, its evidence is named, and the trade-offs remain visible.",
    },
    "pt-BR": {
      beforeTitle: "Uma lista sem posicionamento",
      beforeBody: "Três opções recebem o mesmo peso, sem explicar suas consequências.",
      afterTitle: "Uma recomendação com limites",
      afterBody: "Um caminho é recomendado, as evidências são apresentadas e os trade-offs continuam visíveis.",
    },
    "pt-PT": {
      beforeTitle: "Uma lista sem posicionamento",
      beforeBody: "Três opções recebem o mesmo peso, sem explicação das respetivas consequências.",
      afterTitle: "Uma recomendação com limites",
      afterBody: "Um caminho é recomendado, a evidência é apresentada e os trade-offs continuam visíveis.",
    },
  },
  "immediate-feedback": {
    en: {
      beforeTitle: "The action disappears into loading",
      beforeBody: "The layout shifts, the button vanishes and the user cannot tell whether the request was received.",
      afterTitle: "The interface answers in place",
      afterBody: "The action remains anchored, progress is visible and completion appears beside the original intent.",
    },
    "pt-BR": {
      beforeTitle: "A ação desaparece no carregamento",
      beforeBody: "O layout muda, o botão some e não fica claro se a solicitação foi recebida.",
      afterTitle: "A interface responde no lugar certo",
      afterBody: "A ação permanece ancorada, o progresso fica visível e a conclusão aparece junto da intenção original.",
    },
    "pt-PT": {
      beforeTitle: "A ação desaparece durante o carregamento",
      beforeBody: "O layout muda, o botão desaparece e não é claro se o pedido foi recebido.",
      afterTitle: "A interface responde no lugar certo",
      afterBody: "A ação permanece ancorada, o progresso fica visível e a conclusão surge junto da intenção original.",
    },
  },
  "trust-calibration": {
    en: {
      beforeTitle: "Absolute confidence",
      beforeBody: "This is the correct component for your flow.",
      afterTitle: "Calibrated confidence",
      afterBody: "This component is the strongest match in the current corpus; two constraints still need validation.",
    },
    "pt-BR": {
      beforeTitle: "Confiança absoluta",
      beforeBody: "Este é o componente correto para o seu fluxo.",
      afterTitle: "Confiança calibrada",
      afterBody: "Este componente é a melhor correspondência no corpus atual; duas restrições ainda precisam de validação.",
    },
    "pt-PT": {
      beforeTitle: "Confiança absoluta",
      beforeBody: "Este é o componente correto para o seu fluxo.",
      afterTitle: "Confiança calibrada",
      afterBody: "Este componente é a correspondência mais forte no corpus atual; duas restrições ainda precisam de validação.",
    },
  },
  voice: {
    en: {
      beforeTitle: "Operation completed successfully",
      beforeBody: "The requested persistence procedure has been executed.",
      afterTitle: "Changes saved",
      afterBody: "Your tokens are now available throughout the system.",
    },
    "pt-BR": {
      beforeTitle: "Operação concluída com sucesso",
      beforeBody: "O procedimento de persistência solicitado foi executado.",
      afterTitle: "Alterações salvas",
      afterBody: "Seus tokens já estão disponíveis em todo o sistema.",
    },
    "pt-PT": {
      beforeTitle: "Operação concluída com sucesso",
      beforeBody: "O procedimento de persistência solicitado foi executado.",
      afterTitle: "Alterações guardadas",
      afterBody: "Os seus tokens já estão disponíveis em todo o sistema.",
    },
  },
  tone: {
    en: {
      beforeTitle: "Error 403: access denied",
      beforeBody: "The system names the failure but offers no understanding or recovery.",
      afterTitle: "You do not have access to this page",
      afterBody: "Contact your administrator to request permission. Your current work has been preserved.",
    },
    "pt-BR": {
      beforeTitle: "Erro 403: acesso negado",
      beforeBody: "O sistema nomeia a falha, mas não oferece entendimento nem recuperação.",
      afterTitle: "Você não tem acesso a esta página",
      afterBody: "Fale com a administração para pedir permissão. Seu trabalho atual foi preservado.",
    },
    "pt-PT": {
      beforeTitle: "Erro 403: acesso negado",
      beforeBody: "O sistema identifica a falha, mas não oferece compreensão nem recuperação.",
      afterTitle: "Não tem acesso a esta página",
      afterBody: "Contacte a administração para pedir permissão. O seu trabalho atual foi preservado.",
    },
  },
  "inclusive-default": {
    en: {
      beforeTitle: "Meaning depends on color",
      beforeBody: "Critical states are distinguished only by red and green inside a low-contrast layout.",
      afterTitle: "Meaning survives every mode",
      afterBody: "State, label, contrast and reading order communicate the same information together.",
    },
    "pt-BR": {
      beforeTitle: "O significado depende da cor",
      beforeBody: "Estados críticos são diferenciados apenas por vermelho e verde em um layout de baixo contraste.",
      afterTitle: "O significado sobrevive em todos os modos",
      afterBody: "Estado, rótulo, contraste e ordem de leitura comunicam juntos a mesma informação.",
    },
    "pt-PT": {
      beforeTitle: "O significado depende da cor",
      beforeBody: "Estados críticos distinguem-se apenas por vermelho e verde num layout de baixo contraste.",
      afterTitle: "O significado sobrevive em todos os modos",
      afterBody: "Estado, rótulo, contraste e ordem de leitura comunicam em conjunto a mesma informação.",
    },
  },
  "forgiving-flows": {
    en: {
      beforeTitle: "One mistake erases the form",
      beforeBody: "Submission fails, all fields reset and recovery starts from zero.",
      afterTitle: "The system protects effort",
      afterBody: "Input remains intact, the affected field is identified and the correction happens in context.",
    },
    "pt-BR": {
      beforeTitle: "Um erro apaga o formulário",
      beforeBody: "O envio falha, todos os campos são redefinidos e a recuperação começa do zero.",
      afterTitle: "O sistema protege o esforço",
      afterBody: "Os dados permanecem, o campo afetado é identificado e a correção acontece no contexto.",
    },
    "pt-PT": {
      beforeTitle: "Um erro apaga o formulário",
      beforeBody: "O envio falha, todos os campos são repostos e a recuperação começa do zero.",
      afterTitle: "O sistema protege o esforço",
      afterBody: "Os dados permanecem, o campo afetado é identificado e a correção acontece no contexto.",
    },
  },
  patterns: {
    en: {
      beforeTitle: "Every page invents a new answer",
      beforeBody: "The same decision uses different labels, spacing and confirmation behavior.",
      afterTitle: "One decision, one grammar",
      afterBody: "The interaction pattern, naming and feedback remain stable across the product.",
    },
    "pt-BR": {
      beforeTitle: "Cada página inventa uma resposta",
      beforeBody: "A mesma decisão usa rótulos, espaçamentos e confirmações diferentes.",
      afterTitle: "Uma decisão, uma gramática",
      afterBody: "O padrão de interação, a nomenclatura e o feedback permanecem estáveis no produto.",
    },
    "pt-PT": {
      beforeTitle: "Cada página inventa uma resposta",
      beforeBody: "A mesma decisão usa rótulos, espaçamentos e confirmações diferentes.",
      afterTitle: "Uma decisão, uma gramática",
      afterBody: "O padrão de interação, a nomenclatura e o feedback permanecem estáveis no produto.",
    },
  },
  performance: {
    en: {
      beforeTitle: "Animation delays understanding",
      beforeBody: "Content waits for decorative transitions while the layout keeps moving.",
      afterTitle: "Motion explains change",
      afterBody: "The response is immediate; restrained movement preserves orientation and confirms state.",
    },
    "pt-BR": {
      beforeTitle: "A animação atrasa a compreensão",
      beforeBody: "O conteúdo espera por transições decorativas enquanto o layout continua se movendo.",
      afterTitle: "O movimento explica a mudança",
      afterBody: "A resposta é imediata; o movimento contido preserva a orientação e confirma o estado.",
    },
    "pt-PT": {
      beforeTitle: "A animação atrasa a compreensão",
      beforeBody: "O conteúdo espera por transições decorativas enquanto o layout continua em movimento.",
      afterTitle: "O movimento explica a mudança",
      afterBody: "A resposta é imediata; o movimento contido preserva a orientação e confirma o estado.",
    },
  },
};

const CASE_STUDY_ALIASES: Record<string, string> = {
  "voice-tone": "voice",
  "context-aware-tone": "tone",
  "consistent-patterns": "patterns",
  "performance-motion": "performance",
};

function getCaseStudy(locale: Locale, principleId: string): CaseStudy {
  const canonicalId = CASE_STUDY_ALIASES[principleId] ?? principleId;
  return locale === "en-US" ? CASE_STUDIES[canonicalId].en : CASE_STUDIES[canonicalId][locale];
}

function getRuleNote(locale: Locale, ruleId: string): string {
  const note = RULE_NOTES[ruleId];
  return locale === "en-US" ? note.en : note.pt;
}

export function GuidelinesPage() {
  const { locale } = useI18n();
  const content = getGuidelinesContent(locale);
  const isEnglish = locale === "en-US";
  const isPtPt = locale === "pt-PT";
  const copy = {
    documentLabel: isEnglish
      ? "Velaris guidelines guide"
      : isPtPt
        ? "Guia de Diretrizes do Velaris"
        : "Guia de Diretrizes do Velaris",
    pillar: isEnglish ? "Pillar" : "Pilar",
    rules: isEnglish ? "rules" : "regras",
    caseStudy: isEnglish ? "In practice" : "Na prática",
    before: isEnglish ? "Before" : "Antes",
    after: isEnglish ? "After" : "Depois",
    noteLabel: isEnglish ? "System criterion" : "Critério do sistema",
    note: isEnglish
      ? "Product intent becomes credible when it produces observable, repeatable decisions."
      : "A intenção do produto ganha credibilidade quando produz decisões observáveis e repetíveis.",
    closingTitle: isEnglish ? "A system is what it repeatedly chooses." : "Um sistema é aquilo que escolhe repetidamente.",
    closingBody: isEnglish
      ? "These guidelines turn product intent into observable decisions. They are not decoration around the system. They are the standard the system must answer to."
      : isPtPt
        ? "Estas diretrizes transformam a intenção do produto em decisões observáveis. Não são decoração em torno do sistema. São o padrão ao qual o sistema deve responder."
        : "Estas diretrizes transformam a intenção do produto em decisões observáveis. Não são decoração ao redor do sistema. São o padrão ao qual o sistema deve responder.",
  };

  return (
    <div className="foundation-page">
      <FoundationSectionHero
        description={content.versionText}
        eyebrow={copy.documentLabel}
        icon={Compass}
        metrics={content.stats.map(([label, value]) => ({ label, value }))}
        note={copy.note}
        noteLabel={copy.noteLabel}
        titleAccent={content.heroAccent}
        titleLead={content.heroTitle}
      />

      <div className="foundation-content-shell">
        {content.pillars.map((pillar, pillarIndex) => {
          const pillarNumber = String(pillarIndex + 1).padStart(2, "0");

          return (
            <FoundationSection
              key={pillar.id}
              aria-labelledby={`pillar-${pillar.id}`}
              className="relative"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-8 select-none text-[clamp(5rem,11vw,9rem)] font-black leading-none tracking-[-0.08em] text-white/[0.018]"
              >
                {pillarNumber}
              </span>

              <header className="relative grid gap-5 pb-8 md:grid-cols-[minmax(0,1fr)_minmax(300px,0.7fr)] md:items-end lg:pb-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b99be9]">
                    {copy.pillar} {pillarNumber}
                  </p>
                  <h2
                    id={`pillar-${pillar.id}`}
                    className="mt-3 max-w-[760px] text-[2rem] font-semibold leading-[1.02] tracking-[-0.035em] text-[#f7f3fa] sm:text-[2.25rem] lg:text-[2.5rem]"
                  >
                    {pillar.title}
                  </h2>
                </div>
                <p className="max-w-[520px] text-sm leading-6 text-[#aaa3b3] sm:text-base sm:leading-7 md:pb-0.5">
                  {pillar.summary}
                </p>
              </header>

              <div>
                {pillar.principles.map((principle, principleIndex) => {
                  const principleNumber = pillarIndex * 2 + principleIndex + 1;
                  const formattedPrinciple = String(principleNumber).padStart(2, "0");
                  const caseStudy = getCaseStudy(locale, principle.id);

                  return (
                    <article
                      key={principle.id}
                      aria-labelledby={`principle-${principle.id}`}
                      className="border-t border-white/[0.1] py-9 sm:py-10 lg:py-12"
                    >
                      <header className="grid gap-4 md:grid-cols-[64px_minmax(0,1fr)_auto] md:items-start">
                        <p className="text-3xl font-semibold tracking-[-0.045em] text-[#b28af2] sm:text-4xl">
                          {formattedPrinciple}
                        </p>
                        <div className="max-w-[800px]">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a59eaa]">
                            {content.principleLabel}
                          </p>
                          <h3
                            id={`principle-${principle.id}`}
                            className="mt-2 text-[1.5rem] font-semibold leading-[1.08] tracking-[-0.025em] text-[#f7f3fa] sm:text-[1.75rem] lg:text-[2rem]"
                          >
                            {principle.title}
                          </h3>
                          <p className="mt-3 max-w-[700px] text-sm leading-6 text-[#aaa3b3] sm:text-base">
                            {principle.description}
                          </p>
                        </div>
                        <p className="pt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a59eaa]">
                          {principle.rules.length} {copy.rules}
                        </p>
                      </header>

                      <ol className="mt-8 border-y border-white/[0.08]">
                        {principle.rules.map((rule, ruleIndex) => (
                          <li
                            key={rule.id}
                            className="grid gap-3 border-b border-white/[0.065] py-4 last:border-b-0 sm:grid-cols-[64px_minmax(0,1fr)] lg:grid-cols-[64px_minmax(0,1fr)_180px] lg:gap-5"
                          >
                            <p className="font-mono text-sm font-semibold tracking-[-0.02em] text-[#b28af2]">
                              {formattedPrinciple}.{ruleIndex + 1}
                            </p>
                            <div className="max-w-[760px]">
                              <h4 className="text-base font-semibold leading-7 text-[#eee9f2] sm:text-lg">
                                {rule.text}
                              </h4>
                              <p className="mt-2 text-sm leading-6 text-[#88818f]">
                                {getRuleNote(locale, rule.id)}
                              </p>
                            </div>
                            <p className="self-start text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b94a1] sm:col-start-2 lg:col-start-auto lg:text-right">
                              {pillar.title}
                            </p>
                          </li>
                        ))}
                      </ol>

                      <section
                        aria-label={`${copy.caseStudy}: ${principle.title}`}
                        className="mt-9 overflow-hidden rounded-[20px] border border-white/[0.1] bg-white/[0.018]"
                      >
                        <header className="border-b border-white/[0.08] px-5 py-3.5 sm:px-6">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9d80c9]">
                            {copy.caseStudy}
                          </p>
                        </header>
                        <div className="grid md:grid-cols-2">
                          <div className="p-5 sm:p-6 md:border-r md:border-white/[0.08]">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#a39ca8]">
                              {copy.before}
                            </p>
                            <h4 className="mt-4 max-w-[520px] text-lg font-semibold leading-tight tracking-[-0.02em] text-[#c7c0cb] sm:text-xl">
                              {caseStudy.beforeTitle}
                            </h4>
                            <p className="mt-3 max-w-[540px] text-sm leading-6 text-[#7f7885]">
                              {caseStudy.beforeBody}
                            </p>
                          </div>
                          <div className="border-t border-white/[0.08] bg-[#c7a4ff]/[0.035] p-5 sm:p-6 md:border-t-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#b99be9]">
                              {copy.after}
                            </p>
                            <h4 className="mt-4 max-w-[520px] text-lg font-semibold leading-tight tracking-[-0.02em] text-[#f4eef9] sm:text-xl">
                              {caseStudy.afterTitle}
                            </h4>
                            <p className="mt-3 max-w-[540px] text-sm leading-6 text-[#b7afbe]">
                              {caseStudy.afterBody}
                            </p>
                          </div>
                        </div>
                      </section>
                    </article>
                  );
                })}
              </div>
            </FoundationSection>
          );
        })}

        <footer className="border-t border-white/[0.08] py-14 sm:py-16 lg:py-20">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#8f75b7]">
            {content.version}
          </p>
          <h2 className="mt-5 max-w-[880px] text-[2.25rem] font-semibold leading-[1.02] tracking-[-0.04em] text-[#f7f3fa] sm:text-[2.75rem] lg:text-[3.25rem]">
            {copy.closingTitle}
          </h2>
          <p className="mt-6 max-w-[700px] text-base leading-7 text-[#aaa3b3]">
            {copy.closingBody}
          </p>
        </footer>
      </div>
    </div>
  );
}
