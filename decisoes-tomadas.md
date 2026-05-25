# Decisões Tomadas — Aetheris

> Registro cronológico de decisões técnicas, arquiteturais e de produto tomadas ao longo do desenvolvimento do projeto.  
> **Autora:** Mariane B. S. Fontes  
> **Atualizado em:** Maio 2026

---

## Formato de cada entrada

Cada decisão segue o padrão:
- **O que:** descrição da decisão
- **Por que:** motivação / problema que resolve
- **Alternativas consideradas:** o que foi descartado e por quê
- **Consequências:** o que essa decisão implica no futuro

---

## D-01 — Stack Frontend: React + TypeScript + Vite + Tailwind

**Data:** Início do projeto (Março 2026)  
**Categoria:** Arquitetura

**O que:** Frontend construído com React 18, TypeScript, Vite e Tailwind CSS v3.

**Por que:** React é o padrão de mercado para dashboards interativos com estado complexo. TypeScript garante segurança de tipos nos dados do design system (componentes, tokens, patterns têm schemas bem definidos). Vite oferece HMR instantâneo e build rápido. Tailwind elimina a necessidade de sistema de CSS externo.

**Alternativas consideradas:**
- Next.js: descartado — SSR desnecessário para um dashboard SPA sem SEO crítico; adicionaria complexidade de deploy.
- Vue 3: descartado — ecossistema menor de componentes UI e menos familiar ao contexto do projeto.
- CSS Modules: descartado — Tailwind integra melhor com design tokens utilitários e acelera prototipação.

**Consequências:** Aplicação é um SPA puro. Deploy em qualquer CDN/hosting estático (Hostinger, Vercel, Render). Sem SSR — não adequado para uso com SEO público no futuro sem migração.

---

## D-02 — Modelo de Embedding: BAAI/bge-m3

**Data:** Abril 2026 (Semana 3 — RAG Foundation)  
**Categoria:** ML / RAG

**O que:** Modelo de embedding escolhido para vetorizar o corpus do design system é o `BAAI/bge-m3` com dimensão 1024, executado em FP16.

**Por que:** Suporte nativo a mais de 100 idiomas (corpus em inglês técnico, queries em português), contexto máximo de 8192 tokens (sem truncamento de chunks longos), e multi-funcionalidade (dense + sparse + ColBERT) que permite evolução do pipeline sem trocar de modelo. Supera alternativas em benchmarks MTEB nas tarefas de retrieval e multilingual.

**Alternativas consideradas:**
- `all-MiniLM-L6-v2`: descartado — monolíngue, limite de 256 tokens truncaria chunks importantes, qualidade inferior.
- `intfloat/multilingual-e5-large`: viável como segunda opção, mas BGE-M3 supera em qualidade e extensibilidade.
- `BAAI/bge-large-en-v1.5`: descartado — monolíngue, incompatível com queries em português.

**Consequências:** Modo dense (cosine similarity) usado na v1. Hybrid retrieval (dense + sparse) é upgrade direto sem re-indexação de modelo. Requer ~1.5GB de RAM para carregar o modelo localmente.

**Referência:** `rag/embedding-model-justification.md`

---

## D-03 — Vector Store: ChromaDB (persistente local)

**Data:** Abril 2026 (Semana 3 — RAG Foundation)  
**Categoria:** Infraestrutura / RAG

**O que:** Banco de dados vetorial é o ChromaDB em modo persistente local, armazenado em `rag/chroma_db/`. Coleção: `aetheris_design_system`. Métrica: cosine similarity (HNSW).

**Por que:** ChromaDB é open source, sem custo, fácil de configurar localmente em Python, e persiste os embeddings em disco (SQLite + arquivos HNSW). Adequado para o escopo do TCC sem necessidade de infraestrutura de nuvem.

**Alternativas consideradas:**
- Pinecone: descartado — custo em produção, complexidade de conta/API desnecessária para v1.
- Weaviate: descartado — overhead operacional maior, requer Docker para self-host.
- FAISS: descartado — não persiste nativamente, menos ergonômico para retrieval com metadados.
- pgvector (PostgreSQL): alternativa forte para produção futura; descartado na v1 por adicionar dependência de banco relacional.

**Consequências:** `chroma_db/` está no `.gitignore` — embeddings não versionados no git. Re-indexação necessária em qualquer novo ambiente via `python rag/setup_vectordb.py`. Em produção futura, migrar para ChromaDB Server mode ou pgvector.

---

## D-04 — Técnica XAI: RAG-native Attribution

**Data:** Abril 2026 (Semana 4 — Diálogo & UX)  
**Categoria:** IA / Explicabilidade

**O que:** Técnica de explicabilidade adotada é a atribuição nativa do pipeline RAG: expor quais chunks foram recuperados, com que score de similaridade, e instruir o LLM a produzir um reasoning trace explícito.

**Por que:** SHAP e LIME são inaplicáveis a LLMs proprietários via API (requerem acesso a gradientes/logits ou múltiplas inferências controladas). Attention-based XAI requer acesso aos pesos internos do modelo. RAG-native attribution é o único método compatível com LLMs black-box via API, tem custo marginal zero (dados já produzidos pelo retrieval), e produz explicações verificáveis pelo usuário (link direto para o trecho da documentação).

**Alternativas consideradas:**
- SHAP: inaplicável — não funciona com LLMs generativos via API fechada.
- LIME: inaplicável — requer centenas de inferências por query; custo e latência proibitivos.
- Attention weights: inaplicável — API da Anthropic/Groq não expõe pesos de atenção.

**Consequências:** Explicabilidade opera em dois níveis: (1) retrieval-level: quais chunks, qual score; (2) generation-level: reasoning trace instrído via system prompt. Confidence calibration usa score cosine do ChromaDB convertido em tiers (Alta ≥ 0.75, Média 0.50–0.74, Baixa < 0.50).

**Referência:** `rag/xai-architecture.md`

---

## D-05 — Fonte de Verdade do Corpus: TSX em vez de HTML

**Data:** Abril 2026 (migração v2.0.0-tsx)  
**Categoria:** RAG / Arquitetura de dados

**O que:** O corpus do RAG passou a ser extraído diretamente dos componentes TypeScript/React (`.tsx`) em vez de arquivos HTML estáticos.

**Por que:** Os arrays tipados (`SectionData[]`, `PatternItem[]`) nos arquivos `.tsx` possuem 8 campos semânticos estruturados por definição — superiores ao HTML, que dependia de convenções de marcação frágeis. A migração elevou o health score do corpus de 43% para 87% (e depois para 95%).

**Consequências:** O extrator (`extract_docs.py`) usa regex sobre arrays TypeScript tipados. Qualquer alteração nos componentes React é automaticamente refletida no corpus após re-indexação. Acoplamento entre UI e RAG é intencional — a documentação é a fonte única de verdade.

---

## D-06 — LLM da Beatrice: Anthropic Claude Haiku → Groq Llama 3.3 70B

**Data:** Maio 2026  
**Categoria:** Infraestrutura / LLM

**O que:** O LLM usado pela Beatrice foi trocado de `claude-haiku-4-5` (Anthropic, pago) para `llama-3.3-70b-versatile` (Groq, gratuito).

**Por que:** Anthropic não oferece tier gratuito. Groq oferece acesso gratuito com rate limits generosos para uso individual e de desenvolvimento. A API do Groq é compatível com o formato OpenAI (mensagens, streaming SSE, `choices[0].delta.content`), o que minimizou o esforço de migração no `server.cjs`. O modelo Llama 3.3 70B tem qualidade comparável ao Claude Haiku em tarefas de Q&A sobre documentação estruturada.

**Alternativas consideradas:**
- Google Gemini Flash (gratuito): viável, mas a API tem formato próprio (diferente de OpenAI), o que exigiria mais refatoração no servidor.
- Ollama (local, gratuito): sem custo e sem rate limit, mas requer hardware local (8GB+ RAM) e setup adicional — inadequado para demonstração em outras máquinas.
- Manter Anthropic com créditos de TCC: possível, mas cria dependência de custo que limita testes prolongados.

**Consequências:** `server.cjs` agora usa `api.groq.com/openai/v1/chat/completions`. Variável de ambiente trocada de `ANTHROPIC_API_KEY` para `GROQ_API_KEY`. Formato da mensagem mudou: system prompt é o primeiro item do array `messages` (padrão OpenAI) em vez de campo separado (padrão Anthropic). O parsing do SSE mudou de `content_block_delta.delta.text` para `choices[0].delta.content`.

**Para obter a GROQ_API_KEY:**
1. Criar conta em https://console.groq.com
2. Acessar "API Keys" → "Create API Key"
3. Iniciar servidor: `GROQ_API_KEY=gsk_... node server.cjs`

---

## D-07 — Roteamento: React Router v6 (client-side SPA)

**Data:** Início do projeto (Março 2026)  
**Categoria:** Arquitetura Frontend

**O que:** Navegação entre páginas feita via React Router v6 em modo SPA. Arquivo de rotas centralizado em `src/routes.tsx`.

**Por que:** Permite navegação sem reload de página, mantém estado da aplicação entre rotas, e segue o padrão de dashboards interativos. Centralizar rotas em `routes.tsx` facilita adicionar novas páginas e manter consistência de labels/ícones/i18n.

**Consequências:** Deploy em servidor estático requer configuração de rewrite de URLs (`.htaccess` para Apache/Hostinger, `_redirects` para Netlify, `render.yaml` para Render). Sem isso, acessar `/dashboard` diretamente retorna 404.

---

## D-08 — Internacionalização: Provider customizado (sem lib externa)

**Data:** Março 2026  
**Categoria:** Frontend

**O que:** Sistema de i18n implementado como provider React customizado (`src/i18n/I18nProvider.tsx`) com arquivo de traduções (`src/i18n/translations.ts`), sem dependência de bibliotecas como `react-i18next` ou `i18next`.

**Por que:** O escopo de tradução é limitado (labels de navegação e badges). Adicionar uma lib de i18n completa adicionaria ~30KB ao bundle para um problema simples. A solução customizada é suficiente e mantém o bundle leve.

**Consequências:** Para adicionar novos textos traduzíveis, editar `translations.ts` e usar o hook `useI18n()`. Se o escopo de i18n crescer significativamente (ex: conteúdo das páginas em múltiplos idiomas), migrar para `react-i18next`.

---

## D-09 — Renderização de Markdown: implementação customizada (sem lib externa)

**Data:** Março–Abril 2026  
**Categoria:** Frontend

**O que:** O markdown das respostas da Beatrice é renderizado por um renderer customizado dentro de `BeatriceChatPage.tsx`, sem uso de `react-markdown`, `marked` ou similar.

**Por que:** O subset de markdown necessário (bold, listas, cabeçalhos, blocos de código) é pequeno. Adicionar `react-markdown` traria ~50KB de dependências para funcionalidade que pode ser coberta com ~80 linhas de código.

**Consequências:** O renderer suporta apenas o subset implementado. Se a Beatrice começar a retornar markdown complexo (tabelas, links aninhados, HTML inline), será necessário migrar para `react-markdown`.

---

## D-10 — Dados do Dashboard: mock com delay simulado

**Data:** Março 2026  
**Categoria:** Frontend / Dados

**O que:** Os dados do Oracle Dashboard são servidos por um mock (`src/data/mockDashboard.ts`) com delay artificial de 850ms via `dashboardService.ts`.

**Por que:** A integração com dados reais de projetos ágeis (Jira, Linear, GitHub Projects) está fora do escopo da v1 do TCC. O mock permite desenvolver e demonstrar a interface completa sem dependência de API externa.

**Consequências:** Para conectar a dados reais, substituir a implementação de `dashboardService.ts` mantendo a mesma interface de retorno (`DashboardData`). Nenhuma mudança nos componentes é necessária.

---

## D-11 — Direção de Produto: Consultoria/Serviço Gerenciado para Empresas Médias

**Data:** Maio 2026  
**Categoria:** Produto / Estratégia

**O que:** A direção de comercialização do Aetheris é como consultoria/serviço gerenciado (não SaaS), com foco em empresas de 50–500 pessoas que já possuem design system mas com documentação caótica e baixa adoção.

**Por que:** Permite validar o produto com clientes reais sem a complexidade técnica de uma plataforma multi-tenant (auth, billing, isolamento de dados). O diferencial competitivo — XAI + design system — é único e não está sendo endereçado por ferramentas como Zeroheight, Supernova ou Storybook, que documentam mas não explicam. A narrativa acadêmica (TCC + pesquisa em XAI) é um ativo de credibilidade para abertura de portas.

**Go-to-market:**
- Curto prazo: "case zero" — entregar para uma empresa gratuitamente para validar tech e pitch.
- Paralelo: visibilidade via narrativa XAI em eventos, artigos e comunidades de design/produto.
- Médio prazo: serviço produtizado com escopo e preço fixos.

**Diferencial vs. ChatGPT/Gemini genérico:** Beatrice é treinada nos documentos do cliente via RAG. Responde com fonte citada, explica o raciocínio e sabe o que existe (e o que não existe) no design system específico — não um chatbot genérico chutando.

---

## D-12 — Migração do servidor para Python/FastAPI com RAG vetorial real

**Data:** Maio 2026  
**Categoria:** Arquitetura / Backend

**O que:** O servidor da Beatrice foi migrado de `server.cjs` (Node.js puro, RAG via TF-IDF) para `server.py` (Python/FastAPI), com retrieval vetorial real usando ChromaDB + BGE-M3.

**Por que:** ChromaDB é uma biblioteca Python — não existe binding estável para Node.js. O TF-IDF implementado em `server.cjs` era uma solução interim que não usava os embeddings já gerados. A migração para Python elimina a fricção de linguagem e viabiliza o pipeline RAG completo: query → embed (BGE-M3) → retrieve (ChromaDB cosine) → augment (system prompt) → generate (Groq streaming).

**Alternativas consideradas:**
- Manter Node.js com microserviço Python separado para retrieval: descartado — adiciona latência de rede e complexidade operacional desnecessária para um projeto acadêmico.
- Usar Pinecone ou outro vector store cloud: descartado — dependência de serviço externo pago; ChromaDB persiste localmente e é reproduzível.

**Consequências:** O servidor Python requer `pip install -r requirements.txt` e é iniciado com `uvicorn server:app --port 3333`. A API é idêntica (`POST /api/chat`, SSE) — o frontend não precisa de mudanças no protocolo, apenas na mensagem de erro (de `node server.cjs` para `uvicorn server:app --port 3333`).

---

## D-13 — Source Attribution no Frontend: chips de fonte com confidence score

**Data:** Maio 2026  
**Categoria:** Frontend / XAI

**O que:** `BeatriceChatPage.tsx` foi modificado para capturar o evento SSE `{ sources, intent }` emitido pelo servidor antes do streaming de texto, e renderizar chips de fonte logo abaixo da resposta concluída.

**Por que:** RAG-native attribution é a técnica XAI escolhida para o projeto — o servidor já gera os dados (chunks recuperados, similaridade coseno), mas sem o frontend capturar e exibir essas informações o XAI não chega ao usuário. Os chips fecham esse ciclo: o gestor vê de onde a Beatrice buscou a informação e com qual confiança.

**Design dos chips:** cada chip exibe o título do chunk (ex: "Confidence Meter") e o percentual de similaridade (ex: "87%"), com estilo `primary/10` background e borda `primary/20` — discreet mas legível.

**Alternativas consideradas:**
- Exibir as fontes em painel lateral separado: descartado — aumenta a complexidade de layout; os chips inline são mais rápidos de escanear.
- Exibir apenas durante o streaming: descartado — fontes aparecem apenas depois que a resposta completa, que é o momento correto para auditoria.

**Consequências:** `ChatMessage` agora tem campos opcionais `sources?: SourceChip[]` e `intent?: string`. O SSE parser trata dois tipos de evento: `{ sources }` (primeiro) e `{ delta }` (restante do streaming).

---

## D-14 — Auto-reindexação do Corpus com watchdog

**Data:** Maio 2026  
**Categoria:** DX (Developer Experience) / Pipeline

**O que:** `rag/watch.py` implementa um watcher de arquivos TSX usando a biblioteca `watchdog`. Qualquer modificação em `src/components/*.tsx` aciona automaticamente o pipeline completo: `extract_docs.py` → `setup_vectordb.py --reset`.

**Por que:** Sem auto-reindexação, cada mudança nos arquivos `.tsx` (que são a fonte primária do corpus) exige rodar dois comandos manualmente para que a Beatrice reflita o conteúdo atualizado. Isso cria atrito no fluxo de desenvolvimento e risco de corpus desatualizado.

**Debounce:** 3 segundos entre triggers — evita múltiplas execuções em sequência rápida (common em editores que salvam em estágios).

**Uso:** `npm run watch-rag` (ou `python3 rag/watch.py`) — roda em paralelo com `npm run dev` e `npm run start:py`.

**Consequências:** O processo watch é stateless e restartável. O ChromaDB é recriado do zero a cada reindexação (`--reset`), garantindo consistência. Reindexação completa leva ~10–30s (dominada pelo tempo de embedding do BGE-M3).

---

## D-15 — Classificador de Intent por Keywords no Servidor

**Data:** Maio 2026  
**Categoria:** Backend / XAI

**O que:** `server.py` implementa um classificador de intent baseado em matching de keywords, que categoriza cada query da Beatrice em um dos 6 intents (+ fallback `general`) antes do retrieval: `component_guidance`, `pattern_guidance`, `token_lookup`, `design_decision`, `when_not_to_use`, `xai_explanation`.

**Por que:** O intent é emitido como metadado na resposta SSE (`{ sources, intent }`) — serve como dado de audit trail para XAI (o gestor vê qual categoria de pergunta a Beatrice detectou) e como base para retrieval especializado em versões futuras do pipeline (ex: priorizar chunks de DesignDecisionsPage para queries `design_decision`).

**Implementação:** Dicionário `_INTENT_KEYWORDS` com listas de keywords bilíngues (PT-BR + EN) por intent. `classify_intent()` conta matches por categoria e retorna o intent com maior score; empate ou score zero → `general`.

**Alternativas consideradas:**
- Classificador ML (ex: fine-tuned BERT): descartado — custo de fine-tuning desproporcional para 6 categorias com vocabulário previsível; keywords bilíngues cobrem 90%+ dos casos de uso.
- Classificação pelo próprio LLM (Groq): descartado — adiciona uma chamada de API por query, dobrando latência e custo.

**Consequências:** O classificador é síncrono e de custo zero (matching de strings). A acurácia depende da cobertura de keywords — queries em outros idiomas (ex: espanhol) seriam classificadas como `general`. Extensível: adicionar keywords ao dicionário não requer restart do servidor.

---

*Documento atualizado em Maio 2026. Última decisão: D-15.*
