# Beatrice Baseline Pré-Agente

> Snapshot técnico do estado da Beatrice antes da evolução para uma arquitetura agentic.
>
> Data do snapshot: 7 de junho de 2026  
> Identificador: `BEATRICE-PRE-AGENT-2026-06-07`  
> Git HEAD: `b3893d4`  
> Escopo: implementação presente no repositório, corpus local e banco local do laboratório  
> Finalidade: servir como linha de base para comparação futura "antes x depois"

## 1. Regra de leitura

Este documento registra o que a Beatrice faz no estado atual. Ele não descreve a
arquitetura agentic planejada como se já estivesse implementada.

As classificações utilizadas são:

| Status | Significado |
|---|---|
| Implementado e funcional | Existe ligação completa entre interface, lógica e runtime verificável |
| Parcialmente implementado | Existe implementação real, mas faltam partes necessárias para completar a capacidade |
| Mockado/apenas visual | Existe representação na interface sem comportamento equivalente no backend |
| Documentado mas ausente | A capacidade aparece em markdowns, prompts ou textos, mas não existe no runtime |
| Ausente e necessário | Não existe e será necessária para a futura fase agentic |
| Não aplicável | Não pertence ao recorte atual |

## 2. Condição de reprodutibilidade

O snapshot foi produzido sobre o `HEAD b3893d4`, mas o worktree não estava limpo.
Na captura, havia 68 arquivos modificados, 18 deletados, 8 renomeados e 83 não
versionados.

Portanto:

- O hash do commit não reproduz sozinho todo o estado descrito.
- Este documento representa o conteúdo real disponível no worktree em 7 de junho de 2026.
- Uma tag ou commit específico deverá ser criado futuramente caso seja necessário reproduzir o baseline de forma exata.
- O documento não altera nem corrige as capacidades registradas. Ele apenas congela o diagnóstico.

## 3. Definição honesta do estado atual

### Classificação principal

**A Beatrice é um copiloto conversacional especializado em design systems, com
postura de oráculo, RAG real, adaptação por perspectiva e explicabilidade parcial
baseada em evidências.**

### O que ela ainda não é

A Beatrice ainda não é um agente operacional porque não possui:

- goal state persistente;
- planner com etapas e estado;
- seleção e chamada de ferramentas executáveis;
- execução de ações em sistemas internos ou externos;
- workflow multi-etapa com recuperação de falhas;
- confirmação humana antes de ações de escrita;
- memória organizacional dinâmica;
- permissões por usuário ou fonte;
- escalonamento humano;
- registro imutável de execuções e decisões.

### Fluxo real atual

```text
mensagem do usuário
  -> classificação heurística de intent e command
  -> análise heurística de complexidade e ambiguidade
  -> seleção de estratégias cognitivas
  -> retrieval no ChromaDB
  -> composição de um único prompt
  -> uma chamada de geração ao Groq
  -> streaming SSE da resposta
  -> armazenamento local da conversa
```

Esse fluxo é uma pipeline de resposta. Ele não contém um loop autônomo de
planejar, agir, observar o resultado e replanejar.

## 4. Stack técnica congelada

| Camada | Estado no baseline |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend principal | FastAPI e uvicorn em `server.py` |
| Backend legado | Node.js em `server.cjs`, mantido como `start:legacy` |
| LLM do chat | Groq, `llama-3.3-70b-versatile` |
| LLM do laboratório | Groq, `meta-llama/llama-4-scout-17b-16e-instruct` por padrão |
| Embeddings | `BAAI/bge-m3` via FlagEmbedding |
| Vector database | ChromaDB persistente local |
| Retrieval | Dense cosine, sem hybrid search e sem reranker |
| Histórico do chat | `localStorage` |
| Laboratório | SQLite local |
| Streaming | Server-Sent Events |

Evidências principais:

- `server.py:49-68`
- `server.py:300-356`
- `server.py:939-1042`
- `package.json:7-16`
- `requirements.txt:1-9`

## 5. Interface atual

### 5.1 Inventário

| Capacidade | Status | Comportamento atual | Evidência |
|---|---|---|---|
| Chat | Implementado e funcional | Envia mensagens ao endpoint real e renderiza resposta Markdown | `src/beatrice/hooks/useChatStream.ts:41-150` |
| Streaming | Implementado e funcional | Processa eventos SSE e atualiza a resposta incrementalmente | `src/beatrice/orchestrators/chat.orchestrator.ts:83-109` |
| Sugestões de prompt | Implementado e funcional | Cards e sugestões disparam prompts reais | `src/beatrice/components/chat/ChatSuggestions.tsx:35-90` |
| Loading | Implementado e funcional | Exibe estado durante a geração | `src/beatrice/components/chat/ChatMessage.tsx:96-98` |
| Erro | Implementado e funcional | Exibe erros recebidos no stream | `src/beatrice/hooks/useChatStream.ts:100-115` |
| Histórico | Implementado e funcional | Cria, abre, renomeia, remove e exporta conversas | `src/beatrice/hooks/useBeatriceHistory.ts:182-360` |
| Persistência do histórico | Parcialmente implementado | Persistência somente no navegador e no dispositivo atual | `src/beatrice/storage/beatriceStorage.ts:11-53` |
| Configurações | Implementado e funcional | Streaming visual, auto-scroll, fontes, densidade, verbosidade e profundidade XAI | `src/beatrice/components/chat/SettingsPanel.tsx:71-277` |
| Perspectivas | Implementado e funcional | Perfil e calibração são enviados ao backend | `src/beatrice/orchestrators/chat.orchestrator.ts:64-80` |
| Comparação de perspectivas | Parcialmente implementado | Executa duas respostas, mas não cria deliberação ou memória compartilhada | `src/beatrice/services/perspectiveTrial.service.ts` |
| Chips de fonte | Parcialmente implementado | Mostram título e similaridade, sem link, excerto ou claim associado | `src/beatrice/components/chat/ChatMessage.tsx:123-139` |
| Confidence score | Parcialmente implementado | A interface chama similaridade da fonte de confidence | `src/beatrice/components/chat/ChatMessage.tsx:129-135` |
| Reasoning banner | Parcialmente implementado | Mostra intent, fontes e skills selecionadas | `src/beatrice/components/chat/ReasoningBanner.tsx:25-76` |
| Reasoning trace | Mockado/apenas visual | Usa sempre a sequência Evidence, Inference, Decision, Trade-offs, Outcome | `src/beatrice/domain/reasoning/transformers.ts:3-5` |
| Helpful feedback | Mockado/apenas visual | Botão não possui handler | `src/beatrice/components/chat/ChatMessage.tsx:163-168` |
| Anexo de contexto | Mockado/apenas visual | Botão de paperclip não possui handler | `src/beatrice/components/chat/ChatInput.tsx:60-66` |
| Workspaces de persona | Mockado/apenas visual | Métricas, atividades, artefatos e recomendações vêm de dados estáticos | `src/beatrice/domain/perspective/lenses.ts` |
| Estatísticas de decisões | Mockado/apenas visual | Decisões derivadas da contagem de mensagens e confidence fixo em 97% | `src/beatrice/services/orchestration.service.ts:146-151` |
| Commands visíveis | Parcialmente implementado | Alteram o contrato de resposta, mas não executam operações | `src/beatrice/domain/governance/capabilities.ts` |
| Skills visíveis | Parcialmente implementado | Expõem estratégias cognitivas escolhidas pelo backend | `src/beatrice/components/chat/ChatMessage.tsx:144-160` |

### 5.2 Limites de interface

- Não há botão para interromper uma geração.
- Não há retomada de stream interrompido.
- Fontes não são navegáveis.
- O usuário não consegue inspecionar o trecho recuperado.
- Não existe feedback negativo estruturado.
- Não existe aprovação de ação porque nenhuma ação é executada.
- Métricas de persona não são telemetria real.
- A configuração `showConfidence` exibe similaridade de retrieval, não
  probabilidade de a resposta estar correta.

## 6. Backend atual

### 6.1 Servidor principal

O servidor efetivamente utilizado é `server.py`, baseado em FastAPI. O
`server.cjs` permanece no repositório como implementação legada e pode ser
iniciado por `npm run start:legacy`.

### 6.2 Endpoints reais

#### Chat e saúde

- `GET /health`
- `GET /api/health`
- `POST /api/chat`

#### Laboratório

- autenticação administrativa;
- consulta de case sets;
- criação, listagem, consulta, cancelamento e baseline de runs;
- revisão humana de itens;
- resultados, snapshot e revisão;
- status, pausa e retomada da automação;
- recomendações, leitura e decisão;
- rollback de calibração;
- notificações.

As rotas estão entre `server.py:523-824`.

#### Pesquisa e estudo

- criação e consulta de convites;
- consulta de sessões;
- resultados do estudo;
- inscrição por token;
- registro de eventos.

As rotas estão entre `server.py:827-935`.

### 6.3 Matriz do backend

| Capacidade | Status | Comportamento atual | Evidência |
|---|---|---|---|
| Integração Groq | Implementado e funcional | Chamada HTTP server-side com API key | `server.py:993-1007` |
| SSE | Implementado e funcional | Metadata primeiro, deltas depois | `server.py:978-1042` |
| Health check | Implementado e funcional | Reporta modelo, corpus, RAG e automação | `server.py:369-404` |
| Tratamento de 401 | Implementado e funcional | Retorna erro SSE específico | `server.py:1009-1011` |
| Tratamento de 429 | Implementado e funcional | Retorna erro SSE específico | `server.py:1012-1014` |
| Timeout e conexão | Implementado e funcional | Tratamento de timeout e connect error | `server.py:1033-1036` |
| Validação de payload do chat | Ausente e necessário | Payload recebido como `dict` sem schema | `server.py:939-951` |
| Limite de histórico | Implementado e funcional | Últimas 16 mensagens | `server.py:67` |
| Autenticação do chat | Ausente e necessário | Endpoint público | `server.py:939` |
| Autenticação do laboratório | Implementado e funcional | Chave administrativa com comparação constante | `server.py:510-526` |
| Autenticação do estudo | Implementado e funcional | Bearer token por sessão | `server.py:517-520` |
| Rate limiting do chat | Ausente e necessário | Sem controle por usuário ou origem | ausência no `server.py` |
| CORS restrito | Ausente e necessário | `allow_origins=["*"]` | `server.py:359-366` |
| Logs estruturados | Ausente e necessário | Apenas mensagens de startup e shutdown com `print` | `server.py:305-356` |
| Trace ID | Ausente e necessário | Não existe correlação por resposta | ausência no endpoint de chat |
| Métricas de latência e tokens do chat | Ausente e necessário | Não persistidas no fluxo comum | ausência no endpoint de chat |
| Moderação e política de conteúdo | Ausente e necessário | Limites dependem dos prompts | `prompts/system/antiPatterns.md` |

### 6.4 Risco de role injection

O cliente insere uma mensagem com role `system` para preferências de verbosidade
e XAI:

- `src/beatrice/orchestrators/chat.orchestrator.ts:38-61`

O servidor recebe e encaminha as mensagens sem restringir roles:

- `server.py:947-974`

Isso significa que a API aceita mensagens `system` originadas no cliente. O
baseline não possui separação segura entre preferências do usuário e instruções
de sistema confiáveis.

## 7. RAG atual

### 7.1 Estado verificado

| Indicador | Valor no baseline |
|---|---:|
| Chunks no dump | 182 |
| Chunks na coleção Chroma local | 182 |
| Modelo de embedding | `BAAI/bge-m3` |
| Versão do índice | `2.2.0-capability-registry` |
| Espaço vetorial | Cosine |
| Modo de retrieval | Dense |
| Reranker | Não |
| Hybrid search | Não |

### 7.2 Distribuição do corpus

| `page_type` | Quantidade |
|---|---:|
| `token` | 88 |
| `component` | 22 |
| `token_alias` | 16 |
| `oracle_command` | 16 |
| `automatic_skill` | 12 |
| `pattern` | 11 |
| `accessibility` | 8 |
| `design_decision` | 4 |
| `xai_component` | 3 |
| `dev_integration` | 2 |

O corpus não possui chunks dos tipos `guideline`, `foundation`, `reasoning` ou
`persona`, embora filtros e documentação façam referência a esses tipos.

### 7.3 Matriz do RAG

| Capacidade | Status | Comportamento atual | Evidência |
|---|---|---|---|
| ChromaDB em runtime local | Implementado e funcional | PersistentClient carregado no lifespan | `server.py:329-347` |
| Corpus indexado localmente | Implementado e funcional | Dump e coleção possuem 182 registros | `rag/aetheris-docs-dump.json`, `rag/chroma_db/` |
| Retrieval usado no chat | Implementado e funcional | `_build_chunks` executa antes do prompt Groq | `server.py:132-180` |
| Busca semântica | Implementado e funcional | Query embedding e consulta por cosine | `rag/retrieval.py:169-224` |
| Filtro por intent | Parcialmente implementado | Keywords e filtros de `page_type` | `prompts/intent_router.py:33-83` |
| Peso por perspectiva | Implementado e funcional | Multiplicadores por perfil e tipo | `rag/retrieval.py:45-92` |
| Vocabulary boost | Implementado e funcional | Boost por vocabulário do perfil | `rag/retrieval.py:114-166` |
| Score no frontend | Implementado e funcional | Similaridade bruta aparece nos chips | `src/beatrice/components/chat/ChatMessage.tsx:129-135` |
| Threshold de relevância | Ausente e necessário | Qualquer top-k pode ser usado | `rag/retrieval.py:211-224` |
| Busca híbrida | Documentado mas ausente | BGE-M3 usado somente no modo dense | `rag/setup_vectordb.py:7-10` |
| Reranking | Documentado mas ausente | Nenhum segundo estágio | `rag/setup_vectordb.py` |
| Reindexação automática local | Parcialmente implementado | Watcher cobre apenas `src/components/*.tsx` | `rag/watch.py:28-79` |
| Atualização sem reinício | Ausente e necessário | Watcher pede reinício do servidor | `rag/watch.py:70` |
| Indexação garantida no deploy | Ausente e necessário | Build do Render não executa pipeline de índice | `render.yaml:15-20` |

### 7.4 Problema de produção registrado

O frontend do chat usa:

```text
VITE_ORACLE_API_URL ?? "/api/chat"
```

O Render configura:

```text
VITE_API_BASE_URL=https://beatrice-chat-server.onrender.com
```

Evidências:

- `src/beatrice/orchestrators/chat.orchestrator.ts:6`
- `src/services/apiConfig.ts:5-19`
- `render.yaml:7-13`

Assim, a variável configurada no deploy não é consumida pelo caminho principal
do chat. Além disso, `rag/chroma_db/` está no `.gitignore` e o build do backend
não executa `rag/setup_vectordb.py`.

Conclusão congelada: **o RAG está operacional no ambiente local inspecionado, mas
não está garantido na configuração de deploy registrada neste baseline.**

## 8. XAI atual

### 8.1 O que é explicável de fato

A explicabilidade real da Beatrice está concentrada no retrieval:

- quais registros foram recuperados;
- título e área semântica de cada fonte;
- similaridade cosseno;
- peso aplicado pela perspectiva;
- weighted score;
- intent selecionado;
- skills cognitivas ativadas.

Esses dados explicam a seleção de evidência. Eles não explicam matematicamente
como o LLM transformou cada evidência na resposta final.

### 8.2 Matriz XAI

| Capacidade | Status | Comportamento atual | Evidência |
|---|---|---|---|
| Source attribution | Parcialmente implementado | Fontes reais por resposta | `rag/context_builder.py:62-74` |
| Citação por afirmação | Ausente e necessário | Não existe relação claim-fonte | ausência no schema da resposta |
| Excerto da fonte | Ausente e necessário | Texto recuperado não é enviado ao frontend | `serialize_sources()` |
| Link para fonte | Documentado mas ausente | Chips são `div`, sem destino | `src/beatrice/components/chat/ChatMessage.tsx:125-137` |
| Similaridade da fonte | Implementado e funcional | `1 - cosine distance` | `rag/retrieval.py:211-218` |
| Evidence confidence | Parcialmente implementado | Composto determinístico para engines específicos | `rag/evidence_metrics.py:21-76` |
| Answer correctness confidence | Ausente e necessário | Não existe probabilidade calibrada de correção | `laboratory/metrics.py:164-177` |
| Explanation bubble | Documentado mas ausente | Não existe componente equivalente ao documento XAI | `rag/xai-architecture.md:141-149` |
| Reasoning trace real | Documentado mas ausente | Não existe trace fiel da geração | `rag/xai-architecture.md:131-139` |
| Reasoning trace visual | Mockado/apenas visual | Etapas fixas no frontend | `src/beatrice/domain/reasoning/transformers.ts:3-5` |
| Alternativas consideradas | Parcialmente implementado | Podem ser solicitadas por prompt | `prompts/` |
| Trade-offs | Parcialmente implementado | Gerados em texto; defaults também são injetados pelo frontend | `src/beatrice/domain/decision/models.ts` |
| Limitações explícitas | Parcialmente implementado | Dependem de prompt e formulação do LLM | `prompts/system/responseRules.md` |
| Audit trail do chat | Parcialmente implementado | Derivado no cliente a partir de mensagens | `src/beatrice/domain/audit/transformers.ts:6-41` |
| Audit trail imutável | Ausente e necessário | Não há registro server-side por resposta | ausência no endpoint de chat |

### 8.3 Confidence no baseline

Existem três conceitos diferentes apresentados ou calculados:

1. `source.similarity`: proximidade semântica entre query e chunk.
2. `evidence_metrics.confidence`: composto de evidência, cobertura e consistência.
3. `computeConfidence()` do frontend: dimensões UX, acessibilidade, arquitetura,
   consistência e performance derivadas da similaridade por coeficientes fixos.

O terceiro conceito não mede essas dimensões de forma independente:

- `src/beatrice/domain/reasoning/policies.ts:4-20`

Também existe um valor visual fixo de `97%`:

- `src/beatrice/services/orchestration.service.ts:146-151`

Conclusão congelada: **o baseline possui confiança da evidência e proxies visuais,
mas não possui confidence score calibrado para a correção da resposta.**

## 9. Comportamento agentic atual

### 9.1 Matriz de agência

| Capacidade agentic | Status | O que existe hoje | O que falta para agência |
|---|---|---|---|
| Objetivos definidos | Parcialmente implementado | Objetivos e critérios dentro dos perfis cognitivos | Goal object com estado, sucesso e encerramento |
| Memória de curto prazo | Parcialmente implementado | Até 16 mensagens enviadas ao modelo | Estado estruturado e recuperação seletiva |
| Memória persistente | Parcialmente implementado | Conversas em `localStorage` | Memória server-side por usuário, projeto e organização |
| Memória organizacional | Documentado mas ausente | Engine recupera 4 decisões estáticas do corpus | Store dinâmico de decisões e aprendizados aprovados |
| Planejamento | Documentado mas ausente | Skill gera planos em texto | Planner que cria, acompanha e atualiza etapas |
| Uso de ferramentas | Ausente e necessário | Nenhum tool registry executável | Tools tipadas, schemas, permissões e resultados |
| Execução de ações | Ausente e necessário | Nenhuma escrita em repo, docs ou apps | Runtime de ações com confirmação |
| Workflows | Ausente e necessário | Nenhum estado de fluxo no chat | State machine com etapas, condições e falhas |
| Automações da Beatrice | Ausente e necessário | Automação existe somente no laboratório | Triggers e jobs de trabalho do usuário |
| Commands | Parcialmente implementado | Selecionam prompts e formatos de saída | Associação command-tool-action |
| Skills | Parcialmente implementado | Estratégias de raciocínio ativadas por heurísticas | Skills capazes de observar e agir |
| Orquestração cognitiva | Implementado e funcional | Complexidade, ambiguidade, seleção de até cinco estratégias e top-k | Manter como camada cognitiva |
| Orquestração multi-etapa | Ausente e necessário | Uma chamada final ao LLM | Loop plan-act-observe-replan |
| Subagentes | Documentado mas ausente | Oracle Council simula perspectivas em um prompt | Agentes ou workers independentes com contratos |
| Adaptação por persona | Implementado e funcional | Perfil altera prompt, estrutura, risco, vocabulário e retrieval | Governança e configuração administrativa |
| Pedir esclarecimento | Parcialmente implementado | Ambiguidade pode gerar instrução para declarar premissas | Branch obrigatório de clarificação |
| Recusar fora de escopo | Parcialmente implementado | Template e prompt existem | Router, threshold e política determinística |
| Registrar decisões | Mockado/apenas visual | Audit entry derivado e exportável | Decision store canônico e versionado |
| Escalonamento humano | Ausente e necessário | Não existe owner ou handoff | Roteamento para responsável e contexto de escalonamento |
| Recuperação de falhas | Ausente e necessário | Erro encerra a resposta | Retry controlado, compensação e retomada |
| Permissões | Ausente e necessário | Chat e corpus sem ACL | Autorização por usuário, fonte e ferramenta |

### 9.2 Commands não são ações

Os commands atuais carregam contratos Markdown no prompt:

- `prompts/prompt_builder.py:81-93`
- `prompts/commands/*.md`
- `prompts/engines/*.md`

Exemplo: `/enforce` solicita que o LLM produza um relatório de violações e código
corrigido. Não existe parser de AST, execução de testes, leitura automática do
repositório, alteração de arquivo ou validação externa associada.

Consequentemente:

- `/enforce` gera uma análise textual;
- `/token-impact` gera uma análise textual;
- `/contract-check` gera uma análise textual;
- `/capture` não grava uma decisão;
- `/document` não publica documentação;
- `/migrate` não modifica código;
- `/feedback-review` não atualiza modelo ou memória.

O rótulo visual "Ação operacional" excede o comportamento real:

- `src/beatrice/components/chat/ChatMessage.tsx:65-73`

### 9.3 Skills não são ferramentas

As skills atuais são módulos de raciocínio:

- análise arquitetural;
- análise de adequação de componente;
- detecção de mau uso;
- governança;
- planejamento de implementação;
- avaliação de risco;
- systems thinking;
- análise de tokens;
- análise de trade-offs.

O orquestrador seleciona estratégias e compõe instruções para a mesma chamada de
LLM:

- `cognition/orchestration/reasoning_engine.py:64-104`

Não existe uma interface do tipo:

```text
tool.call(name, input) -> result
```

Conclusão congelada: **skills são capacidades de raciocínio orientadas por prompt,
não ferramentas agentic.**

## 10. Laboratório e avaliação

### 10.1 Infraestrutura existente

O laboratório é uma capacidade real e relevante. Ele possui:

- datasets JSONL;
- execução por caso e perspectiva;
- métricas determinísticas;
- métricas relacionais;
- revisão humana;
- automação agendada;
- propostas de calibração;
- guardrails;
- rollback;
- notificações;
- audit events administrativos.

Evidências:

- `evals/cases/beatrice-core-v1.jsonl`
- `laboratory/cases.py`
- `laboratory/metrics.py`
- `laboratory/runner.py`
- `laboratory/store.py`
- `laboratory/automation.py`

### 10.2 Valores congelados do banco local

| Indicador | Valor |
|---|---:|
| Runs | 3 |
| Itens executados | 168 |
| Metric scores | 763 |
| Fontes registradas | 0 |
| Revisões humanas | 0 |
| Versões de calibração | 1 |
| Propostas de calibração | 0 |
| Recomendações | 0 |
| Notificações | 1 |
| Audit events administrativos | 2 |

### 10.3 Run mais recente

| Campo | Valor |
|---|---|
| Label | `candidate3-2026-06-06` |
| Status | `completed` |
| Itens | 56 de 56 |
| Modelo | `meta-llama/llama-4-scout-17b-16e-instruct` |
| Score agregado | `0.505` |
| Intent match | `0.375` |
| Retrieval precision | `0.125` |
| Source coverage | `0.125` |
| Evidence confidence | `0.000` |
| Abstention | `0.875` |
| Required fact coverage | `0.660` |
| Perspective signal | `0.515` |
| Structural adherence | `0.634` |
| Forbidden claim avoidance | `1.000` |
| Observed correctness | `0.838`, provisional |
| ECE | Não calculável, 0 amostras humanas |

O banco possui zero linhas em `laboratory_item_sources`. Assim, o run mais recente
não valida a operação completa da Beatrice com RAG ativo.

O valor `observed_correctness` é um composto determinístico provisório. Correção
factual, fidelidade da fonte e utilidade continuam dependentes de revisão humana:

- `laboratory/metrics.py:159-183`

## 11. Segurança e governança

| Capacidade | Estado no baseline |
|---|---|
| API key do LLM no backend | Presente |
| Proteção do laboratório | Presente |
| Proteção das sessões de estudo | Presente |
| Autenticação do chat | Ausente |
| Rate limiting | Ausente |
| ACL no corpus | Ausente |
| Multi-tenancy | Ausente |
| Separação de organizações | Ausente |
| Permissão por command ou tool | Não aplicável, não há tools |
| Confirmação de escrita | Não aplicável, não há ações de escrita |
| Defesa estrutural contra prompt injection | Ausente |
| Auditoria imutável do chat | Ausente |
| Política determinística de recusa | Ausente |

## 12. Divergências entre documentação e runtime

### 12.1 `rag/xai-architecture.md`

O documento descreve:

- Claude Haiku;
- API Anthropic;
- chain-of-thought;
- citações inline;
- source attribution link;
- confidence meter;
- explanation bubble;
- corpus antigo de 54 chunks.

O runtime possui:

- Groq com Llama 3.3;
- source chips sem links;
- similaridade de retrieval;
- nenhuma explanation bubble equivalente;
- nenhuma cadeia de pensamento verificável;
- corpus de 182 chunks.

### 12.2 `rag/pipeline-specs.md`

O documento descreve:

- corpus de 37 chunks;
- `server.cjs`;
- Anthropic;
- Chroma ainda pendente;
- intent classifier não implementado.

O runtime possui:

- corpus de 182 chunks;
- `server.py`;
- Groq;
- Chroma local populado;
- intent classifier heurístico ativo.

### 12.3 `ARCHITECTURE.md`

O documento afirma que `cognition/` não é código de produção. No runtime atual,
`server.py` importa e executa módulos de `cognition/orchestration` e
`cognition/engines`.

### 12.4 `CONTEXTO-TCC.md`

O documento utiliza "Agente Conversacional" como um dos pilares da solução. No
estado atual, essa expressão deve ser interpretada como enquadramento conceitual
da pesquisa, não como prova de agência operacional.

### 12.5 Prompts e nomenclatura de produto

Prompts e interface usam expressões como:

- ação operacional;
- organizational memory;
- intelligent oracle;
- reasoning transparency;
- confidence calibration.

Essas expressões descrevem intenção de produto ou formato de resposta. Elas não
devem ser usadas como evidência isolada de execução, memória dinâmica,
explicabilidade causal ou confiança de correção.

## 13. Riscos de overclaiming congelados

| Afirmação de risco | Por que não é sustentada no baseline | Formulação segura |
|---|---|---|
| "Beatrice é um agente autônomo" | Não existem tools, planner ou ações | "Beatrice é um copiloto especializado" |
| "Beatrice executa ações operacionais" | Commands geram texto | "Beatrice produz análises e artefatos textuais" |
| "Beatrice possui memória organizacional" | Recupera decisões estáticas e mantém histórico local | "Beatrice consulta registros documentados do corpus" |
| "Beatrice explica seu raciocínio interno" | Não existe trace fiel da geração | "Beatrice expõe evidências, premissas e justificativas textuais" |
| "Confidence indica chance de resposta correta" | Score representa retrieval ou proxy | "Score indica força da evidência recuperada" |
| "Audit trail é imutável" | Entrada é derivada no cliente | "A interface gera um registro exportável da conversa" |
| "Oracle Council é multiagente" | Uma única chamada simula perspectivas | "Oracle Council é uma deliberação estruturada em uma resposta" |
| "RAG funciona em produção" | Deploy não garante API e índice | "RAG foi verificado no ambiente local" |
| "Laboratório valida factualidade" | Não há revisão humana | "Laboratório fornece métricas provisórias e infraestrutura de avaliação" |

## 14. Forças acadêmicas no estado atual

1. Corpus especializado derivado de fontes do próprio design system.
2. Retrieval semântico real com BGE-M3 e ChromaDB.
3. Adaptação por perspectiva no prompt e no ranking de evidências.
4. Separação conceitual entre evidência recuperada e correção factual.
5. Orquestração cognitiva explícita por complexidade, ambiguidade e risco.
6. Laboratório com métricas determinísticas, relacionais e humanas.
7. Infraestrutura de calibração, guardrails, recomendações e rollback.
8. Interface que expõe fontes e sinais de processamento ao usuário.
9. Políticas explícitas contra invenção e vazamento de detalhes internos.
10. Reconhecimento documentado das limitações da atribuição RAG-native.

## 15. Fragilidades acadêmicas no estado atual

1. O run mais recente não contém fontes recuperadas.
2. Não existem revisões humanas no banco local.
3. A métrica de confidence não está calibrada contra ground truth.
4. Intent match e retrieval precision estão baixos no run registrado.
5. O corpus é fortemente concentrado em tokens.
6. O out-of-scope depende principalmente do LLM.
7. Documentação histórica contradiz o runtime atual.
8. Alguns elementos visuais representam capacidades inexistentes.
9. O deploy não garante o mesmo RAG verificado localmente.
10. O termo agente pode ser contestado caso seja usado como capacidade operacional.

## 16. Critério mínimo para a futura classificação como agente

A evolução futura somente deverá ser chamada de "agente especializado" quando
houver evidência conjunta das capacidades abaixo:

| Critério futuro | Estado no baseline | Evidência futura exigida |
|---|---|---|
| Objetivo operacional | Ausente | Goal estruturado com condição de sucesso |
| Plano executável | Ausente | Etapas persistidas e observáveis |
| Tool registry | Ausente | Ferramentas tipadas com schemas |
| Execução de ação | Ausente | Pelo menos uma ação real com resultado verificável |
| Observação de resultado | Ausente | Tool result incorporado ao estado |
| Replanejamento | Ausente | Mudança de plano após resultado ou erro |
| Confirmação humana | Ausente | Approval antes de ação sensível |
| Memória persistente | Parcial | Store server-side governado |
| Permissões | Ausente | ACL por usuário, fonte e ferramenta |
| Audit trail | Parcial | Registro imutável de cada etapa |
| Recuperação de falha | Ausente | Retry, compensação ou retomada |
| Métrica de task success | Ausente | Resultado de tarefa, não apenas qualidade textual |

Uma única tool call isolada não será suficiente para caracterizar a Beatrice como
agente. O comportamento deverá formar um ciclo verificável:

```text
objetivo
  -> plano
  -> ferramenta
  -> ação
  -> observação
  -> validação
  -> replanejamento ou conclusão
```

## 17. Matriz preparada para o comparativo "antes x depois"

Esta tabela deverá ser duplicada e preenchida após a evolução agentic. A coluna
"Depois" permanece marcada como não avaliada porque a fase futura ainda não foi
implementada.

| Dimensão | Antes: 7 jun. 2026 | Depois | Evidência futura |
|---|---|---|---|
| Classificação | Copiloto/oráculo especializado | Não avaliado | Arquitetura e testes |
| Objetivo persistente | Não | Não avaliado | Goal store |
| Planner | Não | Não avaliado | Plano e transições |
| Tools executáveis | 0 | Não avaliado | Tool registry |
| Ações reais | 0 | Não avaliado | Logs e resultados |
| Workflows | 0 | Não avaliado | Workflow definitions |
| Integrações externas | 0 | Não avaliado | Connectors |
| Memória server-side | Não | Não avaliado | Memory store |
| Histórico local | Sim | Não avaliado | Storage |
| Perspectivas | 7 especializadas mais general | Não avaliado | Configuração |
| RAG local | Sim | Não avaliado | Health e retrieval |
| Corpus | 182 chunks | Não avaliado | Index metadata |
| Citações por resposta | Sim | Não avaliado | SSE metadata |
| Citações por afirmação | Não | Não avaliado | Claim-source mapping |
| Confidence de evidência | Parcial | Não avaliado | Métrica calibrada |
| Confidence de correção | Não | Não avaliado | ECE e ground truth |
| Reasoning trace verificável | Não | Não avaliado | Event trace |
| Audit trail imutável | Não | Não avaliado | Backend audit store |
| Recusa determinística | Não | Não avaliado | Policy tests |
| Clarificação determinística | Não | Não avaliado | Dialogue state |
| Auth do chat | Não | Não avaliado | Security tests |
| ACL por fonte | Não | Não avaliado | Permission tests |
| Observabilidade do chat | Não | Não avaliado | Traces e métricas |
| Escalonamento humano | Não | Não avaliado | Handoff records |
| Task success | Não medido | Não avaliado | Outcome metrics |
| Revisões humanas | 0 | Não avaliado | Laboratory DB |
| Score do laboratório | 0.505 | Não avaliado | Run comparável |
| Intent match | 0.375 | Não avaliado | Run comparável |
| Retrieval precision | 0.125 | Não avaliado | Run comparável |
| Source coverage | 0.125 | Não avaliado | Run comparável |
| Abstention | 0.875 | Não avaliado | Run comparável |

## 18. Protocolo para o comparativo futuro

Para evitar uma comparação enviesada, a avaliação "depois" deverá:

1. Usar o mesmo conjunto `beatrice-core-v1` como baseline.
2. Preservar os resultados atuais em vez de sobrescrevê-los.
3. Registrar commit, versão do corpus, modelo e configuração.
4. Garantir RAG ativo nos dois lados da comparação.
5. Executar as mesmas perspectivas e número de repetições.
6. Registrar todas as fontes recuperadas.
7. Incluir pelo menos cinco revisões humanas para calcular ECE.
8. Medir latência, tokens, tool calls, falhas e retries.
9. Medir conclusão de tarefa e não apenas qualidade da resposta.
10. Separar melhora causada pelo RAG, pelo modelo e pela arquitetura agentic.
11. Testar ações em ambiente controlado.
12. Registrar recusas, clarificações e handoffs.

## 19. Frases oficiais para uso antes da evolução

### Definição técnica

> A Beatrice é uma camada cognitiva conversacional especializada sobre o
> Aetheris, que combina recuperação semântica, geração por modelo de linguagem,
> adaptação por perspectiva e atribuição de fontes para apoiar decisões de design
> system.

### Limite técnico

> No baseline de 7 de junho de 2026, a Beatrice orienta, compara, explica e gera
> artefatos textuais, mas não planeja nem executa ações autônomas em ferramentas
> externas.

### Visão futura

> A evolução agentic deverá transformar a Beatrice em um agente especializado em
> design systems, capaz de manter objetivos, planejar etapas, usar ferramentas,
> executar ações governadas e medir resultados em fluxos reais de trabalho.

## 20. Conclusão do baseline

O estado pré-agente da Beatrice já constitui um protótipo funcional de copiloto
especializado. Seus elementos mais sólidos são o chat real, o streaming, o RAG
local, as perspectivas cognitivas e a infraestrutura de avaliação.

Sua principal limitação não é falta de linguagem ou de prompts. É a ausência de
um runtime de agência. Commands e skills alteram como a resposta é produzida,
mas não concedem à Beatrice capacidade de observar sistemas, executar operações,
validar resultados ou conduzir workflows.

Este documento deve permanecer preservado como registro histórico. Mudanças
futuras na Beatrice devem ser documentadas em um novo snapshot e comparadas
contra os critérios da seção 17.

## 21. Verificação executada no snapshot

Os seguintes testes foram executados em 7 de junho de 2026 após a criação deste
documento:

| Verificação | Resultado |
|---|---|
| `npm run test:beatrice` | Aprovado |
| `npm run test:rag` | 11 de 11 casos aprovados |
| Chunks reportados pela suite RAG | 182 |
| Latência média reportada pela suite RAG | 443 ms |
| Referências de arquivos deste documento | 43 caminhos únicos verificados |
| Marcadores de pendência e caractere de travessão | Nenhuma ocorrência |

A suite `rag/test_e2e.py` valida classificação de intent e retrieval semântico.
Ela não chama o Groq e não avalia a qualidade da resposta final gerada pelo LLM.
