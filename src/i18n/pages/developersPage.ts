import type { Locale } from "../translations";
import { localizeContent } from "../localizedContent";

const text = (locale: Locale, ptBr: string, en: string, ptPt?: string) =>
  localizeContent(locale, ptBr, en, ptPt);

export function getDevelopersPageContent(locale: Locale) {
  const t = (ptBr: string, en: string, ptPt?: string) => text(locale, ptBr, en, ptPt);

  return {
    architecture: {
      stack: {
        eyebrow: t("Três camadas", "Three tiers"),
        title: t("Visão geral da stack", "Stack overview"),
        caption: t(
          "O navegador mantém estado e renderiza. O servidor orquestra. Armazenamento e inferência são os externos que sustentam a carga. Cada camada roda de forma independente em dev.",
          "The browser holds state and renders. The server orchestrates. Storage and inference are the load-bearing externals. Each tier is independently runnable in dev.",
        ),
        tierLabel: (level: number) => t(`Camada ${level}`, `Tier ${level}`),
      },
      tiers: [
        {
          label: t("Navegador", "Browser"),
          responsibility: t("Superfícies, estado de perspectiva, UI em streaming", "Surfaces, perspective state, streaming UI"),
          components: [
            { name: "React 18 + TypeScript", detail: t("SPA com Vite, code-split por rota", "Vite-powered SPA, code-split per route") },
            { name: "Tailwind CSS v3", detail: t("Estilo orientado a tokens, dark-first", "Token-driven styling, dark-first") },
            { name: "React Router v6", detail: t("8 superfícies cognitivas + redirects legados", "8 cognitive surfaces + legacy redirects") },
            { name: "PerspectiveProvider", detail: t("Lente ativa + overrides de calibração, persistidos por perfil", "Active lens + calibration overrides, persisted per profile") },
            { name: "WorkspaceProvider", detail: t("Estado do chat, histórico, configurações", "Chat state, history, settings") },
          ],
        },
        {
          label: "FastAPI server",
          responsibility: t("Orquestração, montagem de prompt, proxy Groq", "Orchestration, prompt assembly, Groq proxy"),
          components: [
            { name: "server.py", detail: t("FastAPI com lifespan; carrega BGE-M3 + Chroma uma vez no startup", "Lifespan-aware FastAPI; loads BGE-M3 + Chroma once at startup") },
            { name: "prompts/intent_router.py", detail: t("Detecção de catálogo · roteamento de comandos · classificação de intent por voto de keywords", "Catalog detection · command routing · keyword-vote intent classification") },
            { name: "prompts/prompt_builder.py", detail: t("Empilha 8 camadas de prompt no system prompt", "Stacks 8 prompt layers into the system prompt") },
            { name: "prompts/cognitive_profiles.py", detail: t("7 lentes cognitivas + resolução de override de calibração", "7 cognitive lenses + calibration override resolution") },
            { name: "rag/retrieval.py", detail: t("Retrieval vetorial ponderado por perspectiva com vocabulary boost", "Perspective-weighted vector retrieval with vocabulary boost") },
            { name: "rag/context_builder.py", detail: t("Compõe chunks recuperados no bloco de contexto RAG", "Composes retrieved chunks into the RAG context block") },
          ],
        },
        {
          label: t("Armazenamento e inferência", "Storage & inference"),
          responsibility: t("Corpus, embeddings, LLM", "Corpus, embeddings, LLM"),
          components: [
            { name: "ChromaDB (persistent, cosine HNSW)", detail: t("Vector store local-first em rag/chroma_db/", "Local-first vector store at rag/chroma_db/") },
            { name: "BAAI/bge-m3 (FlagEmbedding)", detail: "Multilingual dense vectors, 1024 dim, fp16",
            },
            { name: "Groq · llama-3.3-70b-versatile", detail: t("Completions de chat em streaming via SSE", "Streaming chat completions via SSE") },
          ],
        },
      ],
      dataFlows: {
        eyebrow: t("Fluxos de dados", "Data flows"),
        title: t("Cinco arestas entre as camadas", "Five edges between the tiers"),
        caption: t(
          "Toda interação no Velaris se reduz a estas cinco arestas. O evento SSE de fontes é especial: é emitido antes de qualquer delta de texto, para que a atribuição chegue primeiro.",
          "Every interaction in Velaris reduces to these five edges. The SSE source event is special: it is emitted before any text delta, so attribution lands first.",
        ),
        columns: {
          from: t("Origem", "From"),
          to: t("Destino", "To"),
          payload: t("Formato do payload", "Payload shape"),
        },
        rows: [
          { from: t("Navegador", "Browser"), to: "FastAPI", payload: "POST /api/chat { messages, profile, command_mode, calibration }" },
          { from: "FastAPI", to: "BGE-M3", payload: "embed(query) → 1024-dim dense vector" },
          { from: "FastAPI", to: "ChromaDB", payload: "query_embeddings + where: page_type filter → top_k·4 candidates" },
          { from: "FastAPI", to: "Groq", payload: "messages: [system_prompt, …history], stream: true" },
          { from: "FastAPI", to: t("Navegador", "Browser"), payload: "SSE: sources event → delta events → [DONE]" },
        ],
      },
      devCommands: {
        eyebrow: t("Comandos de dev", "Dev commands"),
        title: t("Três comandos para rodar o sistema localmente", "Three commands to run the system locally"),
        panels: [
          {
            label: "Frontend",
            command: "npm run dev",
            detail: t("Dev server Vite na porta 5173 com HMR; /api proxied para :3333", "Vite dev server on port 5173 with HMR; /api proxied to :3333"),
          },
          {
            label: "Backend",
            command: "GROQ_API_KEY=gsk_… npm start",
            detail: t("FastAPI + ChromaDB + BGE-M3 na porta 3333; lifespan carrega o modelo no startup", "FastAPI + ChromaDB + BGE-M3 on port 3333; lifespan loads model at startup"),
          },
          {
            label: t("Indexação", "Indexing"),
            command: "npm run index",
            detail: t("Reindexação completa: TSX → JSON chunks → ChromaDB. Ou npm run watch-rag para incremental", "Full reindex: TSX → JSON chunks → ChromaDB. Or npm run watch-rag for incremental"),
          },
        ],
      },
      infrastructure: {
        eyebrow: t("Dependências externas", "External dependencies"),
        title: t("Infraestrutura de IA", "AI infrastructure"),
        caption: t(
          "Cinco externos nomeados, cada um com responsabilidade única. Versões e config são explícitas: sem suposições implícitas sobre qual modelo ou índice está por trás de cada camada.",
          "Five named externals, each with a single responsibility. Versions and config are explicit: no implicit assumptions about which model or which index sits behind a layer.",
        ),
        components: [
          {
            name: "Groq",
            version: "llama-3.3-70b-versatile",
            role: t("Inferência LLM. Completions de chat em streaming, API compatível com OpenAI, TTFT baixo.", "LLM inference. Streaming chat completions, OpenAI-compatible API surface, low TTFT."),
            config: [
              { key: "endpoint", value: "https://api.groq.com/openai/v1/chat/completions" },
              { key: "stream", value: "true" },
              { key: "max_tokens", value: "1800-3500 depending on mode" },
              { key: "timeout", value: "60s (httpx.AsyncClient)" },
            ],
          },
          {
            name: "BAAI/bge-m3",
            version: "via FlagEmbedding",
            role: t("Embedding denso multilíngue. Vetores 1024-dim; suporta dense/sparse/colbert; usamos apenas dense.", "Multilingual dense embedding. 1024-dim vectors, supports dense / sparse / colbert; we use dense only."),
            config: [
              { key: "precision", value: "fp16" },
              { key: "dim", value: "1024" },
              { key: "load", value: t("startup do lifespan FastAPI (uma vez)", "FastAPI lifespan startup (once)") },
              { key: "languages", value: "100+ via shared multilingual model" },
            ],
          },
          {
            name: "ChromaDB",
            version: "PersistentClient",
            role: t("Vector store local. Índice cosine HNSW, filtro por metadata, scan completo para modo catálogo.", "Local vector store. Cosine HNSW index, metadata filtering, full-collection scan for catalog mode."),
            config: [
              { key: "path", value: "rag/chroma_db/" },
              { key: "collection", value: "aetheris_design_system" },
              { key: "space", value: "cosine" },
              { key: "index", value: "hnsw" },
            ],
          },
          {
            name: "FastAPI",
            version: "lifespan-aware",
            role: t("Backend ASGI. /api/chat para streaming, /api/health para diagnóstico, CORS aberto em dev.", "ASGI backend. /api/chat for streaming, /api/health for diagnostics, CORS open for dev."),
            config: [
              { key: "port", value: "3333" },
              { key: "runner", value: "uvicorn server:app --port 3333 --reload" },
              { key: "lifespan", value: t("carrega BGE-M3 + Chroma uma vez no startup", "loads BGE-M3 + Chroma once at startup") },
            ],
          },
          {
            name: "SSE",
            version: "text/event-stream",
            role: t("Stream de server-sent events. Evento de atribuição de fontes antes do primeiro delta, depois deltas incrementais, depois [DONE].", "Server-sent events stream. Source attribution event before first delta, then incremental text deltas, then [DONE]."),
            config: [
              { key: "events", value: "{ sources, intent, catalog_mode } · { delta } · [DONE]" },
              { key: "errors", value: "401 / 429 / 5xx wrapped as { error } event" },
              { key: "client", value: "src/beatrice/orchestrators/chat.orchestrator.ts · parseEventStream" },
            ],
          },
        ],
      },
    },
    rag: {
      pipeline: {
        eyebrow: t("De TSX a chunk recuperável", "From TSX to retrievable chunk"),
        title: t("O pipeline RAG, em quatro estágios", "The RAG pipeline, in four stages"),
        caption: t(
          "Extração acontece em build time. Indexação em deploy time. Watch em dev. Serve a cada request. Cada estágio tem um script nomeado.",
          "Extraction happens at build time. Indexing happens at deploy time. Watch happens in dev. Serve happens per request. Each stage has a single named script.",
        ),
        phaseLabel: (phase: string) => t(`Fase · ${phase}`, `Phase · ${phase}`),
        outputLabel: "output",
      },
      stages: [
        {
          phase: "extraction",
          artefact: "rag/extract_docs.py",
          command: "python rag/extract_docs.py",
          description: t(
            "Percorre a árvore TSX (ComponentsPage, PatternsPage, TokensPage, …), parseia cada superfície em busca de blocos documentados e produz uma lista JSON de chunks tipados. Cada chunk carrega title, text, page_type, source path.",
            "Walks the TSX source tree (ComponentsPage, PatternsPage, TokensPage, …), parses each surface for documented blocks, and produces a JSON list of typed chunks. Each chunk carries title, text, page_type, source path.",
          ),
          output: "rag/chunks.json : 54 chunks at v2.1.0",
        },
        {
          phase: "indexing",
          artefact: "rag/setup_vectordb.py",
          command: "python rag/setup_vectordb.py",
          description: t(
            "Carrega chunks.json, embeda cada chunk com BAAI/bge-m3 em modo dense, grava no ChromaDB com metadata. Idempotente: reexecutar reindexa o corpus inteiro.",
            "Loads chunks.json, embeds each chunk with BAAI/bge-m3 dense mode, writes to ChromaDB with metadata. Idempotent: re-running reindexes the full corpus.",
          ),
          output: "rag/chroma_db/ : persistent Chroma collection 'aetheris_design_system'",
        },
        {
          phase: "watch",
          artefact: "rag/watch.py",
          command: "npm run watch-rag",
          description: t(
            "Watchdog em src/components/*Page.tsx : debounce 3s : reexecuta extract + embed seletivo ao salvar uma superfície TSX. Usado em dev para manter o corpus alinhado ao código.",
            "Watchdog observer on src/components/*Page.tsx : debounced 3s : re-runs extract + selective embed when a TSX surface saves. Used in dev to keep the corpus tracking the code.",
          ),
          output: t("reindex incremental ao vivo; logs em stdout", "live incremental reindex; logs to stdout"),
        },
        {
          phase: "serve",
          artefact: "rag/retrieval.py · retrieve_chunks",
          description: t(
            "Em tempo de query: embed da query → lookup cosine HNSW no ChromaDB filtrado por page_type da intent → peso por perspectiva → vocabulary boost → ordena por weighted_score → corta em top_k. Retorna chunks com os 6 campos de atribuição.",
            "At query time: embed query → ChromaDB cosine HNSW lookup filtered by intent page_type → apply per-perspective weight → apply vocabulary boost → sort by weighted_score → cut to top_k. Returns a list of chunks with the 6 attribution fields.",
          ),
          output: "chunks[]: { text, title, source, page_type, similarity, retrieval_weight, vocabulary_boost, weighted_score, retrieval_mode }",
        },
      ],
      crossRef: {
        title: t("O mesmo pipeline, por outro ângulo", "Same pipeline, another angle"),
        link: t("Raciocínio · Pipeline : visão conceitual", "Reasoning · Pipeline : conceptual overview"),
      },
    },
    integration: {
      guides: {
        eyebrow: t("Guias de integração", "Integration guides"),
        title: t("Quatro formas de falar com o sistema", "Four ways to talk to the system"),
        caption: t(
          "O mesmo endpoint /api/chat sustenta todas as superfícies: do chat ao trial de perspectiva até um curl no terminal. Calibração e perspectiva fluem como campos do payload, não como headers de auth.",
          "The same /api/chat endpoint underpins every surface: from the chat to the perspective trial to a curl from your terminal. Calibration and perspective flow as payload fields, not auth headers.",
        ),
      },
      snippets: [
        {
          label: "POST /api/chat (curl)",
          body: `curl -N -X POST http://localhost:3333/api/chat \\
  -H 'Content-Type: application/json' \\
  -d '{
    "messages": [{ "role": "user", "content": "Which component for inline form validation?" }],
    "profile": "a11y",
    "command_mode": null,
    "calibration": { "depth": "high", "technicality": 0.7, "risk_sensitivity": 0.8 }
  }'`,
        },
        {
          label: t("Lendo o stream SSE (frontend)", "Reading the SSE stream (frontend)"),
          body: `import { runPerspectiveTrial } from "@/beatrice/services/perspectiveTrial.service";

const result = await runPerspectiveTrial({
  query: "Which component for inline form validation?",
  profileId: "a11y",
  onDelta: (text) => console.log("partial:", text),
  onSources: (sources, intent) => console.log("evidence:", { sources, intent }),
});

console.log("final:", result.text);`,
        },
        {
          label: t("Usando o contexto de perspectiva", "Using the perspective context"),
          body: `import { usePersonaContext } from "@/beatrice/hooks/usePersonaContext";

function Component() {
  const { profileId, activePersonaContext, setProfileId } = usePersonaContext();
  // activePersonaContext is the localized PersonaStrategy for the active lens
  // setProfileId persists and updates retrieval weighting + prompt adaptation
}`,
        },
        {
          label: t("Override de calibração (persistido por lente)", "Calibration override (persisted per lens)"),
          body: `import { writeCalibration, readCalibration } from "@/beatrice/domain/perspective";

writeCalibration("a11y", { depth: "high", technicality: 0.7, risk_sensitivity: 0.85 });
// All subsequent /api/chat calls under the a11y lens send this calibration.

const current = readCalibration("a11y");
// returns null if the lens is using defaults, else the persisted override.`,
        },
      ],
    },
    corpus: {
      health: {
        eyebrow: t("Diagnóstico ao vivo", "Live diagnostics"),
        title: t("Saúde do corpus", "Corpus health"),
        caption: t(
          "Total de chunks e status do embedder vêm de /api/health em tempo real. O breakdown por page_type é o perfil esperado do extractor em v2.1.0: se a contagem ao vivo divergir, o corpus driftou da fonte.",
          "Total chunks and embedder status come from /api/health in real time. Per-page-type breakdown is the expected profile from the extractor at v2.1.0: if the live count diverges, the corpus has drifted from the source.",
        ),
        metrics: {
          live: t("ao vivo", "live"),
          fromProfile: t("do perfil do extractor", "from extractor profile"),
          loading: t("carregando…", "loading…"),
          expectedChunks: (count: number) => t(`esperados ${count} chunks`, `expected ${count} chunks`),
          pageTypes: (count: number) => `${count} page_types`,
        },
        healthError: {
          title: t("/api/health inacessível.", "/api/health unreachable."),
          body: t(
            "Os números abaixo são o perfil esperado do extractor, não ao vivo. Inicie o backend para ver contagens reais.",
            "The numbers below are the extractor's expected profile, not live. Start the backend to see real counts.",
          ),
        },
        table: {
          pageType: "page_type",
          source: "source",
          expected: "expected",
          cognitiveRole: t("papel cognitivo", "cognitive role"),
        },
        pageTypes: [
          { page_type: "component", source: "ComponentsPage.tsx", expected: 22, role: t("primitivos implementáveis", "implementable primitives") },
          { page_type: "xai_component", source: "ComponentsPage.tsx (XAI components)", expected: 3, role: t("variantes com explicação", "explanation-aware variants") },
          { page_type: "pattern", source: "PatternsPage.tsx", expected: 11, role: t("lógica de interação", "interaction logic") },
          { page_type: "token", source: "TokensPage.tsx", expected: 88, role: t("contratos canônicos de design", "canonical design contracts") },
          { page_type: "token_alias", source: "TokensPage.tsx", expected: 16, role: t("contratos de reuso semântico", "semantic reuse contracts") },
          { page_type: "design_decision", source: "DesignDecisionsPage.tsx", expected: 4, role: t("memória de governança", "governance memory") },
          { page_type: "dev_integration", source: "DevIntegrationPage.tsx", expected: 2, role: t("entrada para desenvolvedores", "developer entry") },
        ],
        backendErrors: {
          noPayload: t("Backend acessível mas sem payload", "Backend reachable but returned no payload"),
          unreachable: t("Backend inacessível : inicie uvicorn na :3333", "Backend unreachable : start uvicorn on :3333"),
        },
      },
      gaps: {
        eyebrow: t("Detecção de lacunas", "Gap detection"),
        title: t("O que a ausência no corpus significa", "What absence in the corpus means"),
        caption: t(
          "Um page_type ausente é uma família de conhecimento ausente. O pipeline de retrieval filtra silenciosamente para nenhum resultado, o que aparece como baixa confiança ou recusa na camada de raciocínio.",
          "A missing page_type is a missing knowledge family. The retrieval pipeline silently filters to none, which surfaces as low-confidence or refusal at the reasoning layer.",
        ),
        items: [
          {
            strong: t("Sem chunks de um page_type ≠ sem fonte.", "No chunks of a page_type ≠ no source."),
            body: t(
              "O extractor pode ter pulado uma superfície TSX; execute npm run index após adicionar blocos documentados.",
              "The extractor may have skipped a TSX surface; run npm run index after adding documented blocks.",
            ),
          },
          {
            strong: t("Health diz rag_active=false.", "Health says rag_active=false."),
            body: t(
              "FlagEmbedding falhou ao importar. Instale: pip install FlagEmbedding",
              "FlagEmbedding failed to import. Install: pip install FlagEmbedding",
            ),
          },
          {
            strong: t("Contagem ao vivo diverge do perfil esperado.", "Live count drifts from expected profile."),
            body: t(
              "O código-fonte adicionou ou removeu blocos documentados. Reindexe ou atualize a constante PAGE_TYPE_PROFILE neste arquivo.",
              "The source code added or removed documented blocks. Either reindex or update the PAGE_TYPE_PROFILE constant in this file.",
            ),
          },
        ],
      },
      inspector: {
        eyebrow: t("Debug de retrieval ao vivo", "Live retrieval debug"),
        title: "Inspector",
        caption: t(
          "Chama /api/chat com a perspectiva ativa, coleta o evento SSE de fontes e renderiza a atribuição completa de chunks. O mesmo payload que as superfícies de chat consomem.",
          "Hits /api/chat with the active perspective, collects the SSE sources event, and renders the full chunk attribution. The same payload your chat surfaces consume.",
        ),
        defaultQuery: t(
          "Qual componente usar para validação inline em formulário?",
          "Which component for inline form validation?",
          "Qual componente usar para validação inline num formulário?",
        ),
        placeholder: t("Digite uma query para inspecionar o retrieval", "Type a query to inspect retrieval"),
        queryAria: t("Query do inspector", "Inspector query"),
        stop: t("Parar", "Stop"),
        inspect: t("Inspecionar", "Inspect"),
        requestState: t("Estado da requisição", "Request state"),
        sourceChunks: t("Chunks de fonte", "Source chunks"),
        untitled: "(untitled)",
        waitingSources: t("aguardando evento de fontes…", "waiting for source event…"),
        emptySources: t("execute uma inspeção para ver chunks recuperados", "run an inspection to see retrieved chunks"),
        responseRaw: t("Resposta (bruta)", "Response (raw)"),
        crossRef: {
          title: t("Para comparação com perspectiva", "For perspective-aware comparison instead"),
          link: t("Perspectivas · trial ao vivo (duas lentes em paralelo)", "Perspectives · live trial (two lenses in parallel)"),
        },
      },
      liveTrace: {
        eyebrow: t("Trilha ao vivo", "Live trace"),
        title: t("Trilha de auditoria de execução", "Execution audit trail"),
        caption: t(
          "Preenchida pela execução do Inspector acima. Expõe o mesmo payload audit_metadata que o AuditTrail do chat consome — workflow, etapas, ferramentas, evidence tier e seleção estruturada.",
          "Populated by the Inspector run above. Surfaces the same audit_metadata payload the chat AuditTrail consumes — workflow, steps, tools, evidence tier and structured selection.",
        ),
      },
      trace: {
        idle: t(
          "Execute uma inspeção acima para preencher a trilha de execução com metadados de auditoria ao vivo do /api/chat.",
          "Run an inspection above to populate the execution trace with live audit metadata from /api/chat.",
        ),
        streaming: t(
          "Transmitindo metadados de auditoria — etapas e sinais atualizam conforme o oráculo responde.",
          "Streaming audit metadata — steps and signals update as the oracle responds.",
        ),
        failed: t("Falha na trilha.", "Trace failed."),
        executionSteps: t("Etapas de execução", "Execution steps"),
        auditSummary: t("Resumo de auditoria", "Audit summary"),
        evidenceSimilarity: t("Similaridade da evidência", "Evidence similarity"),
        perspectiveQuality: t("Qualidade da perspectiva", "Perspective quality"),
        selectionScore: t("Score de seleção", "Selection score"),
        toolsInvoked: t("Ferramentas invocadas", "Tools invoked"),
        activeSkills: t("Habilidades ativas", "Active skills"),
        structuredSelection: t("Seleção estruturada", "Structured selection"),
        alternativeCandidates: t("Candidatos alternativos", "Alternative candidates"),
        rejectedCandidates: t("Candidatos rejeitados", "Rejected candidates"),
        limitations: t("Limitações", "Limitations"),
      },
    },
    agentRuntime: {
      flow: {
        eyebrow: t("Fluxo cognitivo", "Cognitive flow", "Fluxo cognitivo"),
        title: t("Como o Abraxos transforma evidência em raciocínio", "How Abraxos turns evidence into reasoning", "Como o Abraxos transforma evidência em raciocínio"),
        caption: t(
          "Cada resposta passa por uma sequência explícita de estágios. O fluxo não é decorativo — é o contrato cognitivo do agente.",
          "Every answer passes through an explicit sequence of stages. The flow is not decorative — it is the agent's cognitive contract.",
          "Cada resposta passa por uma sequência explícita de etapas. O fluxo não é decorativo — é o contrato cognitivo do agente.",
        ),
        steps: [
          { label: t("Pergunta", "Question", "Pergunta"), detail: t("Entrada do usuário com contexto de perspectiva e modo de comando", "User input with perspective context and command mode", "Entrada do utilizador com contexto de perspetiva e modo de comando") },
          { label: t("Detecção de intent", "Intent detection", "Detecção de intent"), detail: t("Classificação da intenção, entidades citadas e roteamento de workflow", "Intent classification, cited entities and workflow routing", "Classificação da intenção, entidades citadas e encaminhamento de workflow") },
          { label: "Planner", detail: t("Montagem do plano de execução: ferramentas, estratégias e políticas aplicáveis", "Execution plan assembly: tools, strategies and applicable policies", "Montagem do plano de execução: ferramentas, estratégias e políticas aplicáveis") },
          { label: t("Recuperação de evidência", "Evidence retrieval", "Recuperação de evidência"), detail: t("Busca no corpus oficial com filtro por intent e perspectiva ativa", "Search in the official corpus with intent and active perspective filter", "Pesquisa no corpus oficial com filtro por intent e perspetiva ativa") },
          { label: t("Validação", "Validation", "Validação"), detail: t("Verificação de entidades, integridade de evidência e bloqueio anti-alucinação", "Entity verification, evidence integrity and anti-hallucination blocking", "Verificação de entidades, integridade de evidência e bloqueio anti-alucinação") },
          { label: t("Camada de perspectiva", "Perspective layer", "Camada de perspetiva"), detail: t("Recalibração de prioridades, vocabulário e critérios de decisão pela lente ativa", "Recalibration of priorities, vocabulary and decision criteria by the active lens", "Recalibração de prioridades, vocabulário e critérios de decisão pela lente ativa") },
          { label: t("Conselho do Oráculo", "Oracle Council", "Conselho do Oráculo"), detail: t("Deliberação multi-perspectiva quando o workflow exige análise de decisão ou consenso", "Multi-perspective deliberation when the workflow requires decision analysis or consensus", "Deliberação multi-perspetiva quando o workflow exige análise de decisão ou consenso") },
          { label: t("Calibração de confiança", "Confidence calibration", "Calibração de confiança"), detail: t("Rótulo de confiança derivado da força da evidência — separado da similaridade de recuperação", "Confidence label derived from evidence strength — separate from retrieval similarity", "Rótulo de confiança derivado da força da evidência — separado da similaridade de recuperação") },
          { label: t("Montagem da resposta", "Response assembly", "Montagem da resposta"), detail: t("Síntese final com atribuição de fontes, explicabilidade e limitações declaradas", "Final synthesis with source attribution, explainability and declared limitations", "Síntese final com atribuição de fontes, explicabilidade e limitações declaradas") },
          { label: t("Resposta", "Response", "Resposta"), detail: t("Entrega ao usuário via streaming, com evento de fontes precedendo o texto", "Delivery to the user via streaming, with a sources event preceding the text", "Entrega ao utilizador via streaming, com evento de fontes precedendo o texto") },
        ],
      },
      layers: {
        eyebrow: t("Arquitetura interna", "Internal architecture", "Arquitetura interna"),
        title: t("Camadas do agente", "Agent layers", "Camadas do agente"),
        caption: t(
          "Quatro camadas com responsabilidades distintas. Cada uma opera sobre a anterior sem colapsar recuperação, raciocínio e validação.",
          "Four layers with distinct responsibilities. Each operates on the previous without collapsing retrieval, reasoning and validation.",
          "Quatro camadas com responsabilidades distintas. Cada uma opera sobre a anterior sem colapsar recuperação, raciocínio e validação.",
        ),
        items: [
          {
            label: t("Knowledge Layer", "Knowledge Layer", "Knowledge Layer"),
            responsibilities: [
              t("Corpus oficial do Velaris", "Official Velaris corpus", "Corpus oficial do Velaris"),
              t("Recuperação contextual por intent", "Intent-aware contextual retrieval", "Recuperação contextual por intent"),
              t("Chunks indexados como evidência", "Chunks indexed as evidence", "Chunks indexados como evidência"),
              t("Catálogo canônico de componentes e tokens", "Canonical component and token catalog", "Catálogo canónico de componentes e tokens"),
            ],
          },
          {
            label: t("Reasoning Layer", "Reasoning Layer", "Reasoning Layer"),
            responsibilities: [
              t("Classificação de intent e planejamento", "Intent classification and planning", "Classificação de intent e planeamento"),
              t("Estratégias cognitivas automáticas", "Automatic cognitive strategies", "Estratégias cognitivas automáticas"),
              t("Perspectivas profissionais e calibração", "Professional perspectives and calibration", "Perspetivas profissionais e calibração"),
              t("Conselho multi-agente em análises de decisão", "Multi-agent council in decision analyses", "Conselho multi-agente em análises de decisão"),
            ],
          },
          {
            label: t("Validation Layer", "Validation Layer", "Validation Layer"),
            responsibilities: [
              t("Validação de entidades no catálogo", "Catalog entity validation", "Validação de entidades no catálogo"),
              t("Integridade de evidência antes da entrega", "Evidence integrity before delivery", "Integridade de evidência antes da entrega"),
              t("Calibração de confiança e bloqueio de alucinação", "Confidence calibration and hallucination blocking", "Calibração de confiança e bloqueio de alucinação"),
              t("Gates de confiabilidade para novas capacidades", "Reliability gates for new capabilities", "Gates de confiabilidade para novas capacidades"),
            ],
          },
          {
            label: t("Response Layer", "Response Layer", "Response Layer"),
            responsibilities: [
              t("Síntese da resposta com contrato de formato", "Response synthesis with format contract", "Síntese da resposta com contrato de formato"),
              t("Atribuição de fontes e explicabilidade", "Source attribution and explainability", "Atribuição de fontes e explicabilidade"),
              t("Declaração de limitações e lacunas", "Limitation and gap declaration", "Declaração de limitações e lacunas"),
              t("Apresentação calibrada à perspectiva ativa", "Presentation calibrated to the active perspective", "Apresentação calibrada à perspetiva ativa"),
            ],
          },
        ],
      },
      capabilities: {
        eyebrow: t("Capacidades cognitivas", "Cognitive capabilities", "Capacidades cognitivas"),
        title: t("Motores e módulos de raciocínio", "Reasoning engines and modules", "Motores e módulos de raciocínio"),
        caption: t(
          "Capacidades especializadas acionadas por workflow ou comando explícito. Cada uma define entrada, processamento e saída sem expor implementação.",
          "Specialized capabilities triggered by workflow or explicit command. Each defines input, processing and output without exposing implementation.",
          "Capacidades especializadas acionadas por workflow ou comando explícito. Cada uma define entrada, processamento e saída sem expor implementação.",
        ),
        columns: {
          name: t("Capacidade", "Capability", "Capacidade"),
          input: t("Entrada", "Input", "Entrada"),
          output: t("Saída", "Output", "Saída"),
        },
        rows: [
          {
            name: t("Governance Agent", "Governance Agent", "Governance Agent"),
            input: t("Catálogo Velaris e alertas de governança pré-computados", "Velaris catalog and pre-computed governance alerts", "Catálogo Velaris e alertas de governança pré-computados"),
            output: t("Scan de governança, alertas priorizados e plano de ação", "Governance scan, prioritized alerts and action plan", "Scan de governança, alertas priorizados e plano de ação"),
          },
          {
            name: t("Simulation Engine", "Simulation Engine", "Simulation Engine"),
            input: t("Proposta de mudança ou cenário hipotético", "Proposed change or hypothetical scenario", "Proposta de mudança ou cenário hipotético"),
            output: t("Consequências previstas, cenários e efeitos de segunda ordem", "Predicted consequences, scenarios and second-order effects", "Consequências previstas, cenários e efeitos de segunda ordem"),
          },
          {
            name: t("Oracle Council", "Oracle Council", "Oracle Council"),
            input: t("Questão de decisão com evidência recuperada", "Decision question with retrieved evidence", "Questão de decisão com evidência recuperada"),
            output: t("Posições por perspectiva, conflitos nomeados e recomendação final", "Positions per perspective, named conflicts and final recommendation", "Posições por perspetiva, conflitos nomeados e recomendação final"),
          },
          {
            name: t("Organizational Memory", "Organizational Memory", "Organizational Memory"),
            input: t("Consulta sobre histórico de decisões do sistema", "Query about the system's decision history", "Consulta sobre histórico de decisões do sistema"),
            output: t("Decisões registradas (DEC), contexto e rationale documentado", "Recorded decisions (DEC), context and documented rationale", "Decisões registadas (DEC), contexto e rationale documentado"),
          },
          {
            name: t("Decision Archaeology", "Decision Archaeology", "Decision Archaeology"),
            input: t("Componente, padrão ou decisão específica", "Specific component, pattern or decision", "Componente, padrão ou decisão específica"),
            output: t("Linha do tempo evolutiva e rationale histórico", "Evolutionary timeline and historical rationale", "Linha do tempo evolutiva e rationale histórico"),
          },
          {
            name: t("Governance Impact", "Governance Impact", "Governance Impact"),
            input: t("Mudança proposta no design system", "Proposed design system change", "Mudança proposta no design system"),
            output: t("Impactos diretos e indiretos em documentação, adoção e testes", "Direct and indirect impacts on documentation, adoption and tests", "Impactos diretos e indiretos em documentação, adoção e testes"),
          },
          {
            name: t("Principle Conflict", "Principle Conflict", "Principle Conflict"),
            input: t("Proposta que tensiona princípios do Velaris", "Proposal that tensions Velaris principles", "Proposta que tensiona princípios do Velaris"),
            output: t("Conflitos nomeados entre princípios e trade-offs explícitos", "Named conflicts between principles and explicit trade-offs", "Conflitos nomeados entre princípios e trade-offs explícitos"),
          },
          {
            name: t("Knowledge Gap Detection", "Knowledge Gap Detection", "Knowledge Gap Detection"),
            input: t("Consulta ou entidade com cobertura insuficiente", "Query or entity with insufficient coverage", "Consulta ou entidade com cobertura insuficiente"),
            output: t("Lacunas documentadas: exemplos, edge cases, acessibilidade ou referências ausentes", "Documented gaps: missing examples, edge cases, accessibility or references", "Lacunas documentadas: exemplos, edge cases, acessibilidade ou referências ausentes"),
          },
        ],
      },
      ragVsAgent: {
        eyebrow: t("De recuperação a agente", "From retrieval to agent", "De recuperação a agente"),
        title: t("RAG recupera. O agente decide.", "RAG retrieves. The agent decides.", "RAG recupera. O agente decide."),
        caption: t(
          "A diferença não é volume de conteúdo — é a presença de planejamento, validação e governança entre a evidência e a resposta.",
          "The difference is not content volume — it is the presence of planning, validation and governance between evidence and the answer.",
          "A diferença não é volume de conteúdo — é a presença de planeamento, validação e governança entre a evidência e a resposta.",
        ),
        rag: {
          label: "RAG",
          body: t(
            "Recupera conhecimento do corpus. Filtra por intent. Entrega chunks relevantes como contexto.",
            "Retrieves knowledge from the corpus. Filters by intent. Delivers relevant chunks as context.",
            "Recupera conhecimento do corpus. Filtra por intent. Entrega chunks relevantes como contexto.",
          ),
        },
        agent: {
          label: t("Agente cognitivo", "Cognitive agent", "Agente cognitivo"),
          body: t(
            "Recupera, interpreta, valida e decide. Aplica perspectiva, calibra confiança e monta uma resposta com contrato explícito.",
            "Retrieves, interprets, validates and decides. Applies perspective, calibrates confidence and assembles a response with an explicit contract.",
            "Recupera, interpreta, valida e decide. Aplica perspetiva, calibra confiança e monta uma resposta com contrato explícito.",
          ),
        },
      },
      contract: {
        eyebrow: t("Contrato cognitivo", "Cognitive contract", "Contrato cognitivo"),
        title: t("Por que o Abraxos é um agente cognitivo", "Why Abraxos is a cognitive agent", "Por que o Abraxos é um agente cognitivo"),
        caption: t(
          "Não é um mecanismo de busca com interface conversacional. Opera como agente porque possui capacidades explícitas de raciocínio, validação e incerteza.",
          "Not a search mechanism with a conversational interface. It operates as an agent because it has explicit reasoning, validation and uncertainty capabilities.",
          "Não é um mecanismo de busca com interface conversacional. Opera como agente porque possui capacidades explícitas de raciocínio, validação e incerteza.",
        ),
        reasons: [
          t("Possui recuperação contextual orientada a intent", "Has intent-oriented contextual retrieval", "Possui recuperação contextual orientada a intent"),
          t("Possui planejamento de execução por workflow", "Has workflow execution planning", "Possui planeamento de execução por workflow"),
          t("Possui validação de entidades e integridade de evidência", "Has entity validation and evidence integrity", "Possui validação de entidades e integridade de evidência"),
          t("Possui governança proativa do catálogo", "Has proactive catalog governance", "Possui governança proativa do catálogo"),
          t("Possui raciocínio multi-perspectiva com síntese de consenso", "Has multi-perspective reasoning with consensus synthesis", "Possui raciocínio multi-perspetiva com síntese de consenso"),
          t("Possui mecanismos explícitos de incerteza e admissão de desconhecimento", "Has explicit uncertainty mechanisms and admission of ignorance", "Possui mecanismos explícitos de incerteza e admissão de desconhecimento"),
        ],
      },
      crossRef: {
        title: t("Documentação relacionada", "Related documentation", "Documentação relacionada"),
        links: [
          { to: "/foundations?focus=evidence", label: t("Fundamentos · Evidências", "Foundations · Evidence", "Fundamentos · Evidências") },
          { to: "/reasoning?focus=weaver", label: t("Raciocínio · Tecelã de Evidências", "Reasoning · Evidence Weaver", "Raciocínio · Tecelã de Evidências") },
          { to: "/reasoning?focus=commands", label: t("Raciocínio · Comandos do Oráculo", "Reasoning · Oracle Commands", "Raciocínio · Comandos do Oráculo") },
        ],
      },
    },
  };
}
