import { useI18n } from "../i18n/I18nProvider";
import type { Locale } from "../i18n/translations";

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
      reviewEyebrow: "Aetheris review",
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
    reviewEyebrow: "Aetheris review",
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

export function GuidelinesPage() {
  const { locale } = useI18n();
  const content = getGuidelinesContent(locale);

  return (
    <div className="space-y-16 pb-20">
      <section className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div className="max-w-3xl">
          <h1 className="text-6xl font-black leading-none tracking-tight text-white md:text-7xl">
            {content.heroTitle} <br />
            <span className="signature-text">{content.heroAccent}</span>
          </h1>
          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-primary">
            {content.heroEyebrow}
          </p>
        </div>
        <div className="glass-panel rounded-3xl p-6 shadow-glow">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              {content.version}
            </span>
          </div>
          <p className="text-sm leading-7 text-slate-400">{content.versionText}</p>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {content.stats.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/5 p-4 text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl font-black tracking-tight text-white">{content.pillarsTitle}</h2>
          <span className="signature-pill">{content.pillarsBadge}</span>
        </div>
        <div className="space-y-8">
          {content.pillars.map((pillar) => (
            <article key={pillar.id} className="glass-panel rounded-[28px] p-8 shadow-glow">
              <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-white/5 pb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
                    {pillar.id.toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                    {pillar.title}
                  </h3>
                </div>
                <p className="ml-auto max-w-2xl text-sm leading-7 text-slate-400">{pillar.summary}</p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {pillar.principles.map((principle) => (
                  <div key={principle.id} className="rounded-[24px] border border-white/5 bg-surface-container-low p-6">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {content.principleLabel}
                        </p>
                        <h4 className="mt-2 text-xl font-black text-white">{principle.title}</h4>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {content.rulesLabel} 4
                      </span>
                    </div>
                    <p className="mb-6 text-sm leading-7 text-slate-400">{principle.description}</p>
                    <div className="grid gap-3">
                      {principle.rules.map((rule) => (
                        <div key={rule.id} className="rounded-xl border border-white/5 bg-white/5 p-4">
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {rule.id}
                          </p>
                          <p className="text-sm leading-6 text-slate-300">{rule.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass-panel rounded-2xl p-8 shadow-glow">
          <h2 className="mb-6 text-2xl font-black tracking-tight text-white">{content.voiceTitle}</h2>
          <div className="space-y-5">
            {content.toneExamples.map((example, index) => (
              <div key={example.category} className="rounded-xl border border-white/5 bg-white/5 p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-signature text-xs font-black text-on-primary">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <p className="text-sm font-bold text-white">{example.category}</p>
                </div>
                <div className="space-y-2">
                  <div className="rounded-xl border border-error/20 bg-error/10 p-3 text-xs text-slate-300">
                    {example.bad}
                  </div>
                  <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-3 text-xs text-slate-300">
                    {example.good}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-8 shadow-glow">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {content.reviewEyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
                {content.reviewTitle}
              </h2>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              {content.reviewBadge}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {content.reviewStats.map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white/5 p-4 text-center">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
