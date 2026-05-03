# Linha do Tempo — Desenvolvimento do Aetheris e Treinamento do Oráculo

> Narrativa detalhada do processo de construção do Aetheris Design System e do desenvolvimento da Beatrice, o Oráculo Inteligente com IA Explicável.  
> **Autora:** Mariane B. S. Fontes  
> **Projeto:** TCC — Design System com IA Explicável para Apoio à Gestão Ágil de Projetos  
> **Período documentado:** Março 2026 – atual

---

## Propósito deste documento

Este documento narra o processo real de desenvolvimento do projeto em ordem cronológica, com nível de detalhe suficiente para embasar a seção metodológica e os relatos de processo do TCC. Registra não apenas o que foi feito, mas como as decisões foram tomadas, quais problemas surgiram, e o raciocínio por trás de cada escolha técnica e arquitetural.

---

## Fase 1 — Concepção e Estrutura do Produto (Março 2026)

### O ponto de partida

O projeto nasce da pergunta central do TCC: *como um design system pode apoiar ativamente gestores de projetos ágeis no uso de IA?* A hipótese inicial era que a documentação tradicional de design systems — estática, fragmentada, difícil de navegar — não era suficiente para contextos de decisão rápida que gestores enfrentam em sprints.

A ideia de um "oráculo" surge como solução: em vez de o gestor navegar por páginas de documentação para encontrar qual componente usar, ele pergunta em linguagem natural e recebe uma resposta fundamentada, com fonte e raciocínio explícito.

### Definição da stack

A primeira decisão técnica foi a stack frontend. O critério principal era: a ferramenta precisa ser capaz de demonstrar um design system completo com estado interativo, componentes reutilizáveis e navegação fluida. React 18 com TypeScript foi escolhido por ser o padrão de mercado para esse tipo de produto. Vite substituiu Create React App pela velocidade de build e experiência de desenvolvimento superior. Tailwind CSS foi adotado para manter o design consistente sem criar um sistema de CSS paralelo ao próprio design system que estava sendo documentado.

### Construção das páginas do design system

O dashboard é construído como uma SPA com 13 rotas, cada uma correspondendo a uma área do design system:

- **Components:** catálogo de 18 componentes com descrição, uso, contra-indicações e insights do Aetheris
- **Patterns:** 11 padrões de interface com granularidade maior (ex: Dashboard, Multi-step Form, Onboarding)
- **Tokens:** paleta de cores, tipografia, espaçamento e semântica de cores
- **Guidelines e Foundations:** princípios de design e bases teóricas
- **Reasoning e XAI:** explicações sobre como o sistema raciocina
- **Design Decisions:** log de decisões de design com justificativas
- **Oracle Dashboard:** métricas de sprint, velocity, saúde do projeto
- **Beatrice Chat:** interface de chat com o oráculo

A rota `src/routes.tsx` é criada como arquivo centralizado de configuração de navegação, com suporte a i18n desde o início via provider customizado.

---

## Fase 2 — Arquitetura RAG (Abril 2026, Semanas 1–3)

### O problema da documentação como dado

O primeiro grande desafio técnico da fase de RAG foi: *como transformar páginas React em dados que uma IA possa consultar?*

A abordagem inicial tentou extrair informação de arquivos HTML estáticos gerados pelo build. Isso produziu um corpus com health score de apenas 43% — muitos campos semânticos (como `trade_offs` e `aetheris_insight`) estavam vazios ou misturados com marcação HTML irrelevante.

### A virada: TSX como fonte de verdade (v2.0.0-tsx)

A decisão de migrar a extração para os próprios arquivos `.tsx` foi um ponto de inflexão do projeto. Os componentes React usam arrays TypeScript tipados (`SectionData[]`, `PatternItem[]`) com até 8 campos semânticos bem definidos por item. O extrator `extract_docs.py` foi reescrito para usar regex sobre esses arrays, em vez de parsear HTML.

O impacto foi imediato: o health score do corpus saltou de 43% para 87%, depois para 95% após refinamentos. Isso demonstra um princípio importante: *a qualidade do RAG começa na qualidade da fonte de dados*, não no modelo de embedding.

### Escolha do modelo de embedding

A seleção do modelo de embedding foi documentada formalmente em `rag/embedding-model-justification.md`. O critério eliminatório principal foi o suporte multilingual: o corpus está em inglês técnico, mas os gestores consultam a Beatrice em português. Um modelo monolíngue produziria embeddings em espaços vetoriais desalinhados entre query e corpus, degradando o recall.

O `BAAI/bge-m3` foi escolhido por: (1) suporte nativo a 100+ idiomas com alinhamento cross-lingual, (2) contexto máximo de 8192 tokens sem truncamento, (3) suporte a três modos de retrieval (dense, sparse, ColBERT) — o que permite evoluir o pipeline sem trocar de modelo. Modelos como `all-MiniLM-L6-v2` foram descartados por serem monolíngues e terem limite de 256 tokens.

### Setup do ChromaDB e ingestão

O `setup_vectordb.py` realiza a ingestão dos chunks em uma coleção ChromaDB com métrica cosine (HNSW). O resultado da v1 é 37 chunks persistidos, com metadados estruturados por chunk: `title`, `type`, `source`, `context_of_use`, `aetheris_insight`, `when_to_use`, `when_not_to_use`, `trade_offs`.

A pasta `rag/chroma_db/` foi adicionada ao `.gitignore` deliberadamente — embeddings são grandes, determinísticos e reproduzíveis via script, portanto não pertencem ao versionamento.

### Análise de gaps do corpus

Após a ingestão, `generate_map.py` gerou o `component-map.md` com análise de cobertura por campo semântico. Os resultados revelaram:

- `context_of_use`: 97% de cobertura — excelente
- `aetheris_insight`: 92% — muito bom
- `trade_offs`: 27% — **lacuna crítica para XAI**
- `logic` e `structure`: 41–46% — cobertura média

A baixa cobertura de `trade_offs` é o principal gap para a qualidade das explicações da Beatrice: sem trade-offs documentados, o oráculo não consegue responder "quando *não* usar este componente" — que é metade do valor de um oracle de design system.

---

## Fase 3 — Diálogo, XAI e Design do Oráculo (Abril 2026, Semana 4)

### Mapeamento de intents

O `intent-map.md` define os 7 intents principais da Beatrice, cada um com exemplos de queries bilíngues (PT-BR e EN), entidades extraíveis, página RAG alvo e tipo de resposta XAI associada:

1. `component_guidance` — "qual componente usar para X?"
2. `pattern_guidance` — "como estruturar uma tela de Y?"
3. `token_lookup` — "qual token de cor/tipografia/espaçamento para Z?"
4. `design_decision` — "por que foi decidido usar X em vez de Y?"
5. `xai_explanation` — "por que a IA recomendou isso?"
6. `when_not_to_use` — "quando *não* usar X?"
7. `out_of_scope` — query fora do domínio do design system

O mapeamento de intents é a base teórica para a classificação de retrieval — em produção, o intent determina qual subconjunto do corpus é priorizado no retrieval, reduzindo ruído e aumentando precisão.

### Decisão sobre a técnica XAI: por que não SHAP nem LIME

Uma das decisões mais rigorosas do projeto foi a escolha da técnica de explicabilidade. SHAP e LIME, as técnicas mais citadas na literatura de XAI, foram avaliadas e descartadas.

SHAP requer um espaço de features discreto e controlável — inaplicável a LLMs generativos onde a "entrada" é texto de comprimento arbitrário. LIME requer múltiplas inferências com perturbações da entrada para construir um modelo linear substituto — com LLMs via API, isso significa centenas de chamadas por query, com custo financeiro e latência de segundos por explicação.

A técnica escolhida foi a **RAG-native attribution**: usar os scores de similaridade coseno já produzidos pelo ChromaDB como mecanismo de explicação. Esses dados — quais chunks foram recuperados, com que similaridade — são subproduto natural do retrieval e têm custo marginal zero. A Beatrice então produz um reasoning trace explícito via instrução no system prompt.

Isso foi documentado em `rag/xai-architecture.md` com referências bibliográficas a Lundberg & Lee (2017), Ribeiro et al. (2016) e Jain & Wallace (2019).

### Especificação do pipeline completo

O `pipeline-specs.md` documenta o pipeline RAG de ponta a ponta com diagrama Mermaid, especificações por componente, e decisões de chunking. A decisão de usar *um chunk por componente/padrão* (em vez de chunking por tamanho fixo) foi baseada no fato de que os itens do Aetheris já possuem granularidade natural adequada para retrieval — um chunk = uma unidade de conhecimento de design.

---

## Fase 4 — Implementação do Backend da Beatrice (Abril–Maio 2026)

### O servidor: Node.js puro sem framework

O `server.cjs` foi implementado como um servidor HTTP Node.js puro (sem Express, Fastify ou similar), por três razões: (1) o único endpoint necessário é `/api/chat` + `/health`; (2) sem framework, não há `node_modules` adicionais para uma função tão simples; (3) o arquivo único é mais fácil de auditar e modificar para contextos acadêmicos.

### Streaming de respostas

A implementação usa Server-Sent Events (SSE) para streaming em tempo real das respostas da Beatrice. O servidor age como proxy entre o frontend React e a API do LLM, normalizando o formato de eventos para `{ delta: "texto" }`, que o frontend consome incrementalmente.

O streaming foi uma decisão deliberada de UX: respostas da Beatrice podem ter 300–800 palavras. Exibir o texto progressivamente reduz a percepção de latência e cria a sensação de que a Beatrice está "pensando" — coerente com a persona de um oráculo.

### Gap identificado: Beatrice não usa o ChromaDB em runtime

Um gap crítico identificado na revisão da v1: o `server.cjs` tem um system prompt estático que descreve o Aetheris em termos gerais, mas **não realiza nenhuma consulta ao ChromaDB em tempo de execução**. Os 37 embeddings existem e estão indexados, mas a Beatrice responde sem retrieval — usando apenas o conhecimento paramétrico do LLM + o system prompt fixo.

Isso significa que a Beatrice da v1 não é tecnicamente um sistema RAG — é um chatbot com system prompt contextualizado. O RAG real (query → embed → retrieve → augment → generate) ainda não está implementado no servidor. Este é o próximo passo técnico mais crítico do projeto.

### Troca de LLM: Anthropic → Groq

O primeiro LLM usado foi o `claude-haiku-4-5` da Anthropic. A troca para o Groq (`llama-3.3-70b-versatile`) foi motivada exclusivamente pela necessidade de um tier gratuito para desenvolvimento e demonstração prolongada.

A migração foi facilitada pelo fato de a API do Groq ser compatível com o formato OpenAI — a diferença no `server.cjs` foi trocar o hostname (`api.anthropic.com` → `api.groq.com`), o path, os headers de autenticação, e o parsing do SSE (`content_block_delta.delta.text` → `choices[0].delta.content`). A mudança mais estrutural foi no formato do body: Anthropic separa o system prompt em campo próprio; OpenAI/Groq o inclui como primeiro item do array `messages` com `role: "system"`.

---

## Fase 5 — Documentação e Estratégia de Produto (Maio 2026)

### CLAUDE.md — documentação para colaboração com IA

O arquivo `CLAUDE.md` foi criado na raiz do projeto para documentar a arquitetura, stack, rotas, comandos e convenções do projeto. O objetivo é servir como contexto para ferramentas de IA (como Claude Code) que auxiliem no desenvolvimento — prática emergente de "documentação para agentes".

### Análise de viabilidade como produto real

Uma sessão de brainstorming estruturado explorou o potencial do Aetheris além do TCC. As conclusões:

- **Direção:** consultoria/serviço gerenciado (não SaaS imediato)
- **Mercado-alvo:** empresas de 50–500 pessoas com design system existente mas caótico
- **Diferencial vs. concorrentes** (Zeroheight, Supernova, Storybook): essas ferramentas documentam, o Aetheris explica com XAI — fonte, raciocínio e confiança calibrada
- **Diferencial vs. ChatGPT/Gemini genérico:** Beatrice é treinada nos documentos específicos do cliente via RAG; não alucina sobre componentes que não existem no sistema
- **Go-to-market:** "case zero" (um cliente gratuito para validar) + visibilidade via narrativa acadêmica em eventos e comunidades de design/produto

### Decisoes-tomadas.md e Linha do Tempo

Criação deste documento e do `decisoes-tomadas.md` como prática de rastreabilidade de decisões — útil tanto para a escrita do TCC quanto para onboarding de futuros colaboradores.

---

## Estado atual do projeto (Maio 2026)

### O que está completo

| Componente | Status |
|-----------|--------|
| Frontend React (13 rotas, todos os componentes) | ✅ Completo |
| Corpus extraído (37 chunks estruturados) | ✅ Completo |
| Embeddings no ChromaDB | ✅ Completo |
| Modelo de embedding selecionado e documentado | ✅ Completo |
| Pipeline RAG especificado (diagrama + specs) | ✅ Completo |
| 7 intents mapeados com fluxogramas | ✅ Completo |
| Técnica XAI documentada (RAG-native attribution) | ✅ Completo |
| Backend Beatrice com streaming (Groq) | ✅ Completo |

### O que está em andamento

| Componente | Status | Próximo passo |
|-----------|--------|--------------|
| RAG em runtime (ChromaDB → server) | ❌ Não implementado | Integrar ChromaDB ao server.cjs ou criar microserviço Python |
| XAI em runtime (confidence, source attribution) | ❌ Não implementado | Depende do RAG em runtime |
| Wireframes de resposta (Figma, 3–5 mockups) | ❌ Não iniciado | Criar wireframes para 5 padrões de resposta da Beatrice |
| Chunks com `trade_offs` completos | ⚠️ 27% de cobertura | Enriquecer os 27 chunks sem trade_offs nos arquivos `.tsx` |

---

## Próximos marcos planejados

1. **Integração RAG em runtime** — conectar ChromaDB ao servidor da Beatrice para retrieval real em tempo de execução
2. **XAI layer** — implementar confidence score e source attribution nas respostas
3. **Wireframes de resposta** — 3–5 mockups dos padrões de resposta da Beatrice (componente simples, padrão complexo, token lookup, decision log, out-of-scope)
4. **Enriquecimento do corpus** — preencher `trade_offs` nos 27 chunks deficientes
5. **Testes de qualidade do RAG** — queries de benchmark para medir recall e precisão do retrieval

---

*Este documento é atualizado continuamente ao longo do desenvolvimento. Cada sessão significativa de trabalho deve ser registrada aqui.*
