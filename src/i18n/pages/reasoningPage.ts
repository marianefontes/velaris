import type { Locale } from "../translations";
import { localizeContent } from "../localizedContent";

const text = (locale: Locale, ptBr: string, en: string, ptPt?: string) =>
  localizeContent(locale, ptBr, en, ptPt);

export function getReasoningPageContent(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) => text(locale, ptBr, en, ptPt);

  return {
    hero: {
      eyebrow: t("Raciocínio explicável", "Explainable reasoning"),
      titleLead: t("Como Abraxos", "How Abraxos"),
      titleAccent: t("realmente pensa", "actually thinks"),
      lead: t(
        "Abraxos combina capacidades internas, comandos acionáveis e a Tecelã de Evidências para transformar perguntas em respostas fundamentadas, com fontes, confiança e limites explícitos.",
        "Abraxos combines internal capabilities, actionable commands, and the Evidence Weaver to turn questions into grounded answers with sources, confidence, and explicit limits.",
        "Abraxos combina capacidades internas, comandos acionáveis e a Tecelã de Evidências para transformar perguntas em respostas fundamentadas, com fontes, confiança e limites explícitos.",
      ),
      navAria: t("Secções de raciocínio", "Reasoning sections"),
    },
    overview: {
      flowEyebrow: t("Arquitetura cognitiva", "Cognitive architecture"),
      flowTitle: t(
        "Como uma pergunta se torna uma resposta explicável",
        "How a question becomes an explainable answer",
      ),
      flowCaption: t(
        "O percurso de cada pergunta, desde a interpretação até uma resposta entregue com fontes e confiança. Cada etapa corresponde a um artefacto nomeado no código.",
        "The path every question travels, from interpretation to a response delivered with its sources and confidence. Each step is a named codebase artifact.",
      ),
      differenceEyebrow: t("O que diferencia Abraxos", "What makes Abraxos different"),
      differenceTitle: t("Arquitetura, não magia", "Architecture, not magic"),
      differenceCaption: t(
        "Um LLM genérico responde com conhecimento paramétrico amplo. Abraxos consulta a base do Velaris, explicita as fontes e reconhece quando a evidência é parcial ou insuficiente.",
        "A generic LLM answers from broad parametric knowledge. Abraxos consults the Velaris knowledge base, exposes sources, and acknowledges when evidence is partial or insufficient.",
      ),
      differenceCards: [
        [t("Especificidade do domínio", "Domain specificity"), t("Raciocina dentro do design system Velaris", "Reasons inside the Velaris design system")],
        [t("Documentação recuperada", "Retrieved documentation"), t("Respostas restringidas pelo corpus", "Answers constrained by the corpus")],
        [t("Fontes citadas", "Cited sources"), t("Cada afirmação pode ser rastreada", "Every claim is traceable")],
        [t("Score de confiança", "Confidence score"), t("Incerteza calibrada a partir do retrieval", "Uncertainty calibrated from retrieval")],
        [t("Intent classificada", "Classified intent"), t("A interpretação torna-se explícita", "The interpretation is explicit")],
        [t("Adaptação por perspetiva", "Perspective adaptation"), t("Profundidade e foco adequados à lente ativa", "Depth and focus fit the active lens")],
      ],
      exploreEyebrow: t("O que explorar", "What to explore"),
      exploreTitle: t("Organização, capacidades e comprovação", "Organization, capabilities, and proof"),
      exploreCaption: t(
        "Abraxos raciocina. A Tecelã organiza. O Pipeline comprova. Habilidades e comandos determinam como o agente atua em cada pergunta.",
        "Abraxos reasons. The Evidence Weaver organizes. The Pipeline proves the path. Skills and commands determine how the agent acts on each question.",
      ),
      open: t("Abrir", "Open"),
      exploreCards: {
        weaver: {
          label: t("Tecelã de Evidências", "Evidence Weaver"),
          body: t(
            "Organiza intenção, entidades, fontes, catálogo, padrões, tokens e decisões; estrutura o contexto e avalia a cobertura das evidências.",
            "Organizes intent, entities, sources, catalog, patterns, tokens, and decisions; structures context and assesses evidence coverage.",
          ),
        },
        skills: {
          label: t("Habilidades do Abraxos", "Abraxos Skills"),
          body: t(
            "Capacidades internas, detetadas por intent e aplicadas sem comando manual.",
            "Internal capabilities detected by intent and applied without a manual command.",
          ),
        },
        commands: {
          label: t("Comandos do Oráculo", "Oracle Commands"),
          body: t(
            "Ações operacionais e modos investigativos que o utilizador ativa com / no chat.",
            "Operational actions and investigative modes the user invokes with / in chat.",
          ),
        },
        pipeline: {
          label: "Pipeline",
          body: t(
            "Nove etapas verificáveis, desde a interpretação da pergunta até à resposta com fontes e confiança.",
            "Nine verifiable stages, from interpreting the question to an answer with sources and confidence.",
          ),
        },
      },
    },
    weaver: {
      eyebrow: t("Camada de Orquestração de Evidências", "Evidence Orchestration Layer"),
      title: t("A Tecelã de Evidências", "The Evidence Weaver"),
      caption: t(
        "A Tecelã é a camada cognitiva que organiza intenção, entidades, fontes, catálogo, padrões, tokens e decisões antes da resposta final. Não recupera conhecimento nem produz a resposta: estrutura o contexto, avalia qualidade e cobertura das evidências, e prepara a base para que Abraxos raciocine com rastreabilidade.",
        "The Evidence Weaver is the cognitive layer that organizes intent, entities, sources, catalog, patterns, tokens, and decisions before the final answer. It does not retrieve knowledge or produce the answer: it structures context, assesses evidence quality and coverage, and prepares the foundation for Abraxos to reason with traceability.",
      ),
      architectureFlowLabel: t(
        "Fluxo arquitetural da resposta explicável",
        "Explainable answer architecture flow",
      ),
      architectureFlow: [
        {
          label: t("Pergunta", "Question"),
          detail: t("entrada do utilizador", "user input"),
        },
        {
          label: t("Tecelã de Evidências", "Evidence Weaver"),
          detail: t("organiza e qualifica", "organizes and qualifies"),
        },
        {
          label: "Abraxos",
          detail: t("raciocina e recomenda", "reasons and recommends"),
        },
        {
          label: t("Resposta Explicável", "Explainable Answer"),
          detail: t("com fontes e confiança", "with sources and confidence"),
        },
      ],
      steps: [
        {
          title: t("Interpreta a intenção", "Interprets intent"),
          body: t(
            "Identifica se o utilizador quer recomendar, comparar, auditar, implementar ou validar.",
            "Identifies whether the user wants to recommend, compare, audit, implement, or validate.",
          ),
        },
        {
          title: t("Estrutura o contexto", "Structures context"),
          body: t(
            "Reúne e estrutura componentes, padrões, tokens, decisões, fontes e regras relevantes para o contexto da pergunta.",
            "Gathers and structures components, patterns, tokens, decisions, sources, and rules relevant to the question's context.",
          ),
        },
        {
          title: t("Avalia a força da base", "Assesses evidence strength"),
          body: t(
            "Classifica a evidência como direta, parcial, inferida ou ausente e explicita lacunas de cobertura.",
            "Classifies evidence as direct, partial, inferred, or absent, and surfaces coverage gaps.",
          ),
        },
        {
          title: t("Entrega o fio para Abraxos", "Hands the thread to Abraxos"),
          body: t(
            "Entrega a base estruturada para Abraxos interpretar, com fontes, confiança, limitações e próximo passo sugerido.",
            "Hands Abraxos the structured foundation to interpret, with sources, confidence, limitations, and a suggested next step.",
          ),
        },
      ],
      relationshipTitle: t(
        "Tecelã, Abraxos e Pipeline são complementares",
        "The Weaver, Abraxos, and Pipeline are complementary",
      ),
      relationshipBody: t(
        "A Tecelã organiza as evidências que sustentam a resposta. Abraxos interpreta essa base, raciocina e formula a recomendação. O Pipeline registra o percurso técnico completo e comprova como a resposta foi produzida. São camadas distintas: organização cognitiva, raciocínio e auditoria.",
        "The Evidence Weaver organizes the evidence that supports the answer. Abraxos interprets that foundation, reasons, and forms the recommendation. The Pipeline records the complete technical path and proves how the answer was produced. They are distinct layers: cognitive organization, reasoning, and audit.",
      ),
      closingLines: [
        t(
          "A Tecelã não recupera conhecimento. A Tecelã organiza o conhecimento disponível.",
          "The Weaver does not retrieve knowledge. The Weaver organizes the knowledge already available.",
        ),
        t(
          "A Tecelã não responde. Ela prepara a base que permite ao Abraxos responder com rastreabilidade, confiança e explicabilidade.",
          "The Weaver does not answer. It prepares the foundation that lets Abraxos respond with traceability, confidence, and explainability.",
        ),
      ],
      motto: t(
        "A Tecelã costura a base da resposta. O Abraxos interpreta essa base. O Pipeline comprova o percurso.",
        "The Weaver connects the answer's foundation. Abraxos interprets that foundation. The Pipeline proves the path.",
      ),
    },
    skills: {
      eyebrow: t("Ativação automática", "Automatic activation"),
      title: t("Habilidades do Abraxos", "Abraxos Skills"),
      caption: t(
        "Abraxos ativa estas habilidades automaticamente ao interpretar a intent, o contexto e o tipo de problema apresentado. Funcionam como comportamentos internos de análise para recomendar componentes, detetar uso inadequado, avaliar acessibilidade, verificar o impacto de tokens e identificar riscos de governação sem comandos manuais.",
        "Abraxos activates these skills automatically after interpreting the intent, context, and problem type. They work as internal analysis behaviors that recommend components, detect misuse, assess accessibility, verify token impact, and identify governance risks without manual commands.",
      ),
      appliedBy: t("Aplicadas por Abraxos", "Applied by Abraxos"),
      appliedBody: t(
        "O utilizador não precisa de chamar estas habilidades diretamente. Abraxos combina-as conforme a pergunta exige.",
        "The user does not need to invoke these skills directly. Abraxos combines them as the question requires.",
      ),
      auditLabel: t("Auditabilidade:", "Auditability:"),
      auditBody: t(
        "a interface pode mostrar quais habilidades foram aplicadas, o motivo e a confiança. Retrieval Deep Dive continua a ser um mecanismo interno e não aparece como habilidade pública.",
        "the interface can show which skills were applied, why, and with what confidence. Retrieval Deep Dive remains an internal mechanism and is not exposed as a public skill.",
      ),
    },
    commands: {
      eyebrow: t("Ações e modos acionáveis", "Actionable actions and modes"),
      title: t("Comandos do Oráculo", "Oracle Commands"),
      caption: t(
        "Use comandos do Oráculo quando quiser orientar explicitamente Abraxos. Alguns executam ações operacionais, como validar, migrar ou capturar evidências. Outros ativam modos investigativos, como recuperar memória institucional, reconstruir decisões, sintetizar perspetivas ou auditar fontes, lacunas e confiança.",
        "Use Oracle commands when you want to direct Abraxos explicitly. Some execute operational actions such as validation, migration, or evidence capture. Others activate investigative modes such as institutional memory, decision reconstruction, perspective synthesis, or audits of sources, gaps, and confidence.",
      ),
      manual: t(
        "Ao contrário das habilidades automáticas, os comandos têm de ser ativados manualmente no chat com /.",
        "Unlike automatic skills, commands must be invoked manually in chat with /.",
      ),
      operational: t("Ação operacional", "Operational action"),
      operationalDescription: t(
        "Comandos que orientam Abraxos a executar uma tarefa de produto ou design system, como validar, migrar, capturar, documentar, verificar contrato ou analisar impacto de tokens.",
        "Commands that direct Abraxos to execute a product or design system task, such as validating, migrating, capturing, documenting, checking contracts, or assessing token impact.",
        "Comandos que orientam Abraxos a executar uma tarefa de produto ou design system, como validar, migrar, capturar, documentar, verificar contrato ou analisar impacto de tokens.",
      ),
      investigative: t("Modo investigativo", "Investigative mode"),
      investigativeDescription: t(
        "Comandos que orientam Abraxos a investigar, comparar, auditar ou recuperar contexto antes de recomendar, como memória, decisão, perspetivas, auditoria, lacuna de conhecimento e simulação.",
        "Commands that direct Abraxos to investigate, compare, audit, or recover context before recommending, such as memory, decision, perspectives, audit, knowledge gaps, and simulation.",
        "Comandos que orientam Abraxos a investigar, comparar, auditar ou recuperar contexto antes de recomendar, como memória, decisão, perspetivas, auditoria, lacuna de conhecimento e simulação.",
      ),
      compatibilityLabel: t("Compatibilidade:", "Compatibility:"),
      compatibilityBody: t(
        "os nomes canónicos longos continuam a funcionar. Os aliases antigos /history, /why e /score também permanecem disponíveis como fallback.",
        "long canonical names continue to work. The legacy aliases /history, /why, and /score also remain available as fallback.",
      ),
      howTitle: t("Como ativar um comando", "How to invoke a command"),
      howBody: t(
        "Ao consultar Abraxos, escreva / e escolha um comando disponível. Depois, introduza a pergunta, o contexto ou o artefacto que pretende analisar.",
        "When consulting Abraxos, type / and choose an available command. Then enter the question, context, or artifact you want to analyze.",
      ),
      howHint: t(
        "Os comandos funcionam como atalhos explícitos de raciocínio ou ação. Ajudam quando pretende controlar o tipo de resposta que Abraxos deve produzir.",
        "Commands work as explicit shortcuts for reasoning or action. They help when you want to control the type of response Abraxos should produce.",
      ),
      operationalExamples: [
        t(
          '/enforce <Button intent="negative">Excluir análise</Button>',
          '/enforce <Button intent="negative">Delete analysis</Button>',
          '/enforce <Button intent="negative">Eliminar análise</Button>',
        ),
        t(
          "/migrate notification → Toast/Notification",
          "/migrate notification → Toast/Notification",
        ),
        t(
          "/capture [cole discussão de PR sobre Form Field em fluxos multi-etapa]",
          "/capture [paste a PR thread about Form Field in multi-step flows]",
          "/capture [cole discussão de PR sobre Form Field em fluxos multi-etapa]",
        ),
        t(
          "/document Confidence Badge",
          "/document Confidence Badge",
        ),
      ],
      investigativeExamples: [
        t(
          "/memory O que já foi decidido sobre Modal/Dialog em ações destrutivas?",
          "/memory What has already been decided about Modal/Dialog for destructive actions?",
          "/memory O que já foi decidido sobre Modal/Dialog em ações destrutivas?",
        ),
        t(
          "/decision Por que usamos Toast em vez de Alert para confirmação de salvamento?",
          "/decision Why do we use Toast instead of Alert for save confirmation?",
          "/decision Porque usamos Toast em vez de Alert para confirmação de gravação?",
        ),
        t(
          "/perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA.",
          "/perspectives Tabs or Card to organize the catalog? Compare design, frontend, and QA.",
          "/perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA.",
        ),
        t(
          "/audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge.",
          "/audit Audit sources, gaps, and confidence for this Confidence Badge recommendation.",
          "/audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge.",
        ),
        t(
          "/knowledge-gap o que falta documentar sobre acessibilidade em formulários?",
          "/knowledge-gap what is missing about form accessibility?",
          "/knowledge-gap o que falta documentar sobre acessibilidade em formulários?",
        ),
        t(
          "/simulate trocar Alert por Toast em erros de Form Field",
          "/simulate replace Alert with Toast for Form Field errors",
          "/simulate trocar Alert por Toast em erros de Form Field",
        ),
      ],
    },
    capability: {
      automaticTitle: t(
        "Ativada automaticamente quando Abraxos identifica esta necessidade na pergunta.",
        "Activated automatically when Abraxos identifies this need in the question.",
      ),
      manualTitle: t("Ative manualmente no chat com este comando.", "Invoke manually in chat with this command."),
      automaticBadge: t("Auto: detetada por intent", "Auto: detected by intent"),
      experimental: t("Experimental", "Experimental"),
      activatedWhen: t("Ativada quando", "Activated when"),
      expectedOutput: t("Saída esperada", "Expected output"),
      combinesWith: t("Pode combinar com", "Can combine with"),
      ragEvidence: t("Evidência RAG", "RAG evidence"),
      whenToUse: t("Quando usar", "When to use"),
      exampleInput: t("Entrada de exemplo", "Example input"),
      combinesWithSkills: t("Combina com habilidades", "Combines with skills"),
      canonicalContract: t("Contrato canónico", "Canonical contract"),
    },
    pipeline: {
      eyebrow: t("Pipeline completo", "Full pipeline"),
      title: t("Nove etapas, de ponta a ponta", "Nine stages, end to end"),
      caption: t(
        "Cada etapa recebe uma entrada estruturada, produz uma saída estruturada e corresponde a um artefacto nomeado no código. Selecione uma etapa para ler a sua função. A calibração de confiança, etapa 9, é interna ao pipeline.",
        "Each stage takes a structured input, produces a structured output, and lives in a named codebase artifact. Select a stage to read its role. Confidence calibration, stage 9, is internal to the pipeline.",
      ),
      input: t("entrada:", "in:"),
      output: t("saída:", "out:"),
      groupLabels: {
        ingest: t("entrada", "ingest"),
        retrieve: "retrieval",
        synthesize: t("síntese", "synthesis"),
        explain: t("explicação", "explain"),
      },
      stages: [
        {
          label: t("Ingestão da query", "Query ingestion"),
          input: t("mensagem + histórico + perspetiva ativa + calibração", "user message + conversation history + active perspective + calibration"),
          output: "normalized PromptBuildContext",
          artefact: "server.py: chat handler",
          detail: t(
            "O endpoint /api/chat limita o histórico às últimas 16 mensagens, sanitiza o override de calibração, interpreta o prefixo /command e constrói um PromptBuildContext com o estado completo.",
            "The /api/chat endpoint trims history to the last 16 messages, sanitizes the calibration override, parses any /command prefix, and constructs a PromptBuildContext carrying the full state.",
          ),
          group: "ingest" as const,
        },
        {
          label: t("Classificação de intent", "Intent classification"),
          input: t("query do utilizador", "the user query"),
          output: "{ retrieval_intent, response_intent, top_k, catalog_mode }",
          artefact: "prompts/intent_router.py: route_query",
          detail: t(
            "O catalog mode é detetado primeiro. Depois, command_mode substitui a intent quando existe. Caso contrário, uma votação por frequência de palavras em sete vocabulários escolhe a intent com maior score, ou general quando não há sinal.",
            "Catalog mode is detected first. Then command_mode overrides the intent when present. Otherwise a keyword-frequency vote across seven vocabularies selects the highest-scoring intent, or general when there is no signal.",
          ),
          group: "ingest" as const,
        },
        {
          label: t("Geração de embedding", "Embedding generation"),
          input: t("string da query", "the query string"),
          output: "1024-dim dense vector",
          artefact: "FlagEmbedding: BAAI/bge-m3",
          detail: t(
            "BAAI/bge-m3 produz um embedding denso multilingue com 1024 dimensões e precisão fp16. O modelo é carregado uma vez no arranque do servidor pelo lifespan do FastAPI.",
            "BAAI/bge-m3 produces a multilingual dense embedding with 1024 dimensions at fp16 precision. The model is loaded once at server startup by the FastAPI lifespan handler.",
          ),
          group: "retrieve" as const,
        },
        {
          label: t("Retrieval vetorial", "Vector retrieval"),
          input: "query vector + page_type filter",
          output: "top_k * 4 candidate chunks",
          artefact: "rag/retrieval.py: retrieve_chunks",
          detail: t(
            "A consulta HNSW no ChromaDB pesquisa o corpus persistente e filtra primeiro pelo page_type derivado da intent. Se não houver resultados, uma query sem filtro evita contextos vazios.",
            "The ChromaDB HNSW lookup searches the persistent corpus and first filters by the intent-derived page_type. If there are no results, an unfiltered query avoids empty contexts.",
          ),
          group: "retrieve" as const,
        },
        {
          label: t("Ranking por similaridade", "Similarity ranking"),
          input: t("chunks candidatos + perspetiva + vocabulário", "candidate chunks + perspective + vocabulary"),
          output: "ranked top_k chunks",
          artefact: "PROFILE_RETRIEVAL_WEIGHTS: _vocabulary_boost",
          detail: t(
            "Cada chunk recebe weighted_score = similarity x retrieval_weight x vocabulary_boost. O boost é limitado a 20% para evitar overfit de palavras-chave. A ordenação usa weighted_score e depois similaridade bruta.",
            "Each chunk receives weighted_score = similarity x retrieval_weight x vocabulary_boost. The boost is capped at 20% to prevent keyword overfit. Sorting uses weighted_score and then raw similarity.",
          ),
          group: "retrieve" as const,
        },
        {
          label: t("Montagem de contexto", "Context assembly"),
          input: t("chunks ordenados + intent + estado da perspetiva", "ranked chunks + intent + perspective state"),
          output: "RAG context block (markdown)",
          artefact: "rag/context_builder.py: build_rag_context",
          detail: t(
            "Os chunks selecionados formam um bloco de evidência pronto para o prompt, preservando page_type, source e similarity. Catalog mode produz um registry mais completo e os comandos injetam enquadramento específico.",
            "Selected chunks form a prompt-ready evidence block preserving page_type, source, and similarity. Catalog mode emits a fuller registry and commands inject command-specific framing.",
          ),
          group: "synthesize" as const,
        },
        {
          label: t("Síntese da resposta", "Response synthesis"),
          input: "RAG context + cognitive profile + runtime frame + system layers",
          output: "Groq messages payload",
          artefact: "prompts/prompt_builder.py: build_system_prompt",
          detail: t(
            "O sistema empilha oito camadas de prompt, incluindo regras, contexto cognitivo, intent, template, perfil e evidência RAG. O payload segue para Groq llama-3.3-70b-versatile com streaming ativo.",
            "The system stacks eight prompt layers including rules, cognitive context, intent, template, profile, and RAG evidence. The payload is sent to Groq llama-3.3-70b-versatile with streaming enabled.",
          ),
          group: "synthesize" as const,
        },
        {
          label: t("Atribuição XAI", "XAI attribution"),
          input: t("chunks ordenados antes do LLM", "ranked chunks before the LLM"),
          output: "SSE sources event before text",
          artefact: "server.py: streaming handler",
          detail: t(
            "Os source chips são emitidos no primeiro evento SSE, antes do primeiro delta de texto. O frontend apresenta a atribuição como superfície de auditoria principal, não como nota posterior.",
            "Source chips are emitted in the first SSE event, before the first text delta. The frontend presents attribution as a primary audit surface, not a later footnote.",
          ),
          group: "explain" as const,
        },
        {
          label: t("Calibração de confiança", "Confidence calibration"),
          input: "cognitive profile: trust_calibration_style",
          output: "structured confidence in response body",
          artefact: "prompts/cognitive_profiles.py: _trust_calibration_contract",
          detail: t(
            "A lente ativa aplica um de três estilos de confiança: quantificado, qualitativo ou comparativo. O contrato é injetado no system prompt e vincula a resposta do modelo.",
            "The active lens applies one of three confidence styles: quantified, qualitative, or comparative. The contract is injected into the system prompt and binds the model response.",
          ),
          group: "explain" as const,
        },
      ],
    },
  };
}
