# Relatório de Progresso — TCC
**Oráculo Inteligente baseado em XAI e UX para consumidores de Design Systems**
**Autora:** Mariane B. S. Fontes
**Data:** Abril de 2026
**Destinatária:** Orientadora

---

## 1. Visão Geral do Que Foi Construído

O projeto está organizado em duas camadas complementares que, juntas, compõem o protótipo funcional do Oráculo Inteligente:

1. **Aetheris Design System** — o design system propriamente dito, implementado como uma aplicação React/TypeScript com 13 páginas funcionais. É a base de conhecimento que o oráculo consulta.
2. **Pipeline RAG** — o conjunto de scripts e documentação técnica que transforma o conteúdo do design system em um sistema de recuperação semântica, permitindo que o oráculo responda perguntas em linguagem natural.

A seguir, cada página e cada componente do pipeline são explicados com seus respectivos propósitos e justificativas de decisão.

---

## 2. O Design System Aetheris — Páginas e Justificativas

O Aetheris foi desenvolvido em React 18 + TypeScript + Vite + Tailwind CSS. A escolha por TypeScript foi deliberada: diferentemente de HTML estático, o código TypeScript permite que os dados (componentes, padrões, tokens) vivam em estruturas de dados tipadas, o que facilita a extração semântica automática pelo pipeline RAG. Esta foi uma decisão arquitetural importante — discutida mais adiante.

A estética adotada é **glassmorphism dark-first**: fundo `#0e0e10`, superfícies com `backdrop-filter: blur`, bordas translúcidas e gradiente de marca em roxo (`#deccfd → #c2a0fc`). A escolha do glassmorphism não é decorativa — ela comunica o posicionamento "AI-native" do sistema, criando hierarquia de profundidade sem sombras sólidas, adequada para interfaces densas onde múltiplas camadas de informação coexistem.

---

### 2.1 Página: Main (`/main`)
**O que é:** Página de entrada do sistema. Apresenta o Aetheris com headline, proposta de valor e acesso rápido às principais seções.

**Por que existe:** É o ponto de orientação inicial para qualquer consumidor do DS — seja designer, dev ou PM. Sem uma página de entrada clara, o usuário não sabe por onde começar, o que gera a fricção inicial que o oráculo pretende eliminar. A literatura de onboarding (Mangold et al., 2025) aponta que a primeira impressão de um sistema complexo define se o usuário irá explorar ou abandonar.

**Decisão de design:** A página foi mantida simples e direcional, sem densidade de informação, para servir como antessala antes das páginas especializadas.

---

### 2.2 Página: Oracle Dashboard (`/dashboard`)
**O que é:** Dashboard operacional com métricas de sprint, gráficos de velocidade, burndown, saúde de tarefas e painéis de XAI — incluindo OracleGuidancePanel, XAIExplanationPanel e SourceAttributionPanel.

**Por que existe:** Esta é a tela mais próxima do contexto de uso real da persona (Francisco Soares, Product Manager em ciclos de sprint). O PM não quer navegar por documentação — ele quer enxergar o estado do projeto e ter as recomendações do oráculo surfaceadas diretamente no contexto de trabalho.

**Decisão de design:** O dashboard integra os componentes de XAI diretamente no fluxo de trabalho, não como uma aba separada. Isso é intencional: a literatura de XAI centrada no usuário (Mohseni et al., 2021; Liao & Varshney, 2021) indica que explicações só têm valor quando aparecem no momento em que a decisão está sendo tomada — não depois, não numa página separada.

**Decisão técnica:** Os dados são carregados via hook `useDashboardData()` com mock data centralizada em `src/data/mockDashboard.ts`. Isso simula a camada de API que, nas semanas 7-8, será substituída por chamadas reais ao backend RAG.

---

### 2.3 Página: Components (`/components`)
**O que é:** Catálogo de todos os componentes do Aetheris, organizados em 5 grupos: Actions (4), Feedback (3), Data Visualization (5), Inputs (6) e Intelligence/XAI (4). Total: 22 componentes.

**Por que existe:** É a documentação canônica dos componentes. Cada item documenta: nome, status (Stable/Beta), descrição, quando usar, quando não usar e Aetheris Insight. Esta estrutura de 5 campos é a espinha dorsal do que o oráculo recupera quando um usuário pergunta "qual componente devo usar para X?".

**Por que 5 grupos e não outro número:** Os grupos refletem funções cognitivas distintas na interface:
- **Actions** — o usuário age sobre o sistema
- **Feedback** — o sistema age sobre o usuário
- **Data Visualization** — dados são apresentados visualmente
- **Inputs** — o usuário fornece dados estruturados
- **Intelligence/XAI** — o sistema explica seu raciocínio

O grupo **Intelligence/XAI** é o diferencial deste DS em relação a qualquer outro: nenhum design system convencional (Material Design, Ant Design, Carbon) documenta componentes para explicabilidade de IA. Esta seção justifica diretamente o objetivo de pesquisa do TCC.

**Decisão técnica crítica:** Os dados de cada componente vivem em arrays TypeScript tipados (`sections: SectionData[]`, `xaiItems: ComponentItem[]`). Isso foi uma decisão intencional para permitir extração automática pelo `extract_docs.py` — o parser lê diretamente esses arrays e gera o corpus do RAG. Se os dados estivessem em HTML estático, qualquer mudança no DS exigiria sincronização manual com o corpus. Com TypeScript, o corpus é sempre uma derivação direta da fonte de verdade.

---

### 2.4 Página: Patterns (`/patterns`)
**O que é:** Biblioteca de 11 padrões de interação de alto nível, divididos em padrões primários (com estrutura completa) e padrões compactos. Cada padrão documenta: estrutura, lógica, contexto de uso, quando não usar, trade-offs e insight do Aetheris.

**Por que existe:** Padrões respondem perguntas diferentes dos componentes. Um componente responde "o que colocar aqui?". Um padrão responde "como estruturar essa tela/fluxo/módulo?". A persona Francisco, ao iniciar um produto novo do zero, precisa de padrões — não de componentes isolados.

**Por que 11 padrões:** Os 11 padrões foram selecionados para cobrir os fluxos mais frequentes em produtos digitais B2B: Dashboard, Multi-step Form, Onboarding, Data Explorer, Empty States, Settings & Config, Command Center, Focus Mode, Collaboration, Timeline e Entity Picker. São padrões independentes de domínio — aplicam-se tanto a ferramentas de gestão ágil quanto a qualquer outro SaaS.

**Decisão de documentação:** O padrão **Entity Picker** merece destaque especial porque é a distinção mais crítica do sistema: a diferença entre "criar um relacionamento entre entidades" (Entity Picker) e "inserir texto livre" (Neural Input). Esta distinção é invisível em padrões visuais mas fundamental para integridade de dados — e o oráculo precisa explicá-la corretamente quando perguntado.

---

### 2.5 Página: Foundations (`/foundations`)
**O que é:** Princípios fundamentais do Aetheris — o "porquê" filosófico por trás de todas as decisões do sistema. Cobre os valores que guiam escolhas de design quando não há regra explícita.

**Por que existe:** Sem foundations, o DS é uma lista de regras sem razão. O oráculo não pode apenas ditar "use isso aqui" — ele precisa explicar o raciocínio de design subjacente. As foundations fornecem os princípios de UX que o LLM usa para justificar recomendações. Zhang (2023) documenta que usuários de DS têm maior adoção quando entendem a intenção por trás das diretrizes, não apenas as diretrizes em si.

---

### 2.6 Página: Tokens (`/tokens`)
**O que é:** Sistema de design tokens: escala de cores primárias, escala de superfícies, cores semânticas, tipografia e espaçamento — todos com valores concretos.

**Por que existe:** Tokens são a camada atômica do DS — o nível mais baixo ao qual qualquer decisão visual pode ser rastreada. Um dev que pergunta "qual é o hex do background?" ou "qual o espaçamento padrão entre cards?" deve encontrar a resposta aqui, com o oráculo capaz de citar o token correto e explicar quando usá-lo.

**Decisão técnica:** Todos os tokens vivem em arrays TypeScript (`primaryScale`, `surfaceScale`, `semanticColors`, `typographyTokens`, `spacingTokens`), extraídos automaticamente pelo pipeline RAG. Os chunks resultantes incluem tanto os valores quanto os contextos de uso — por exemplo: "`primary-200 (#deccfd)`: use para brand accent e elementos interativos; não usar em áreas de texto extenso".

---

### 2.7 Página: Guidelines (`/guidelines`)
**O que é:** Diretrizes de comportamento e linguagem do DS: princípios de design (Radical Clarity, Cognitive Empathy, Motion as Language, Inclusive by Default), regras de voz e tom, e princípios de interação.

**Por que existe:** Guidelines respondem perguntas do tipo "como o sistema deve se comunicar?" e "qual o princípio por trás desta decisão de hierarquia?". Sem guidelines, o oráculo responderia apenas sobre estrutura visual — sem capacidade de justificar decisões de linguagem, acessibilidade ou comportamento. A persona PM pergunta coisas como "por que o botão primário não pode ser usado duas vezes na mesma tela?" — a resposta está nas guidelines (princípio de hierarquia de ação), não nos componentes.

---

### 2.8 Página: Design Decisions (`/design-decisions`)
**O que é:** Registro das decisões de design mais importantes do Aetheris, com a decisão principal (Side Drawer vs Modal Overlay) detalhada com sinais de contexto, trade-offs e notas de inferência, além de decisões de suporte (Primary vs Secondary Button Logic, List vs Bento, etc.).

**Por que existe:** Esta é a página mais diretamente alinhada ao objetivo de XAI do projeto. Voigt et al. (2021) demonstram que quando as razões por trás de uma diretriz são documentadas, a conformidade dos consumidores aumenta significativamente. O oráculo não cita apenas o que fazer — cita o registro de decisão que justifica por quê. Isso diferencia uma resposta de IA de um chatbot genérico de uma resposta rastreável e auditável.

**Por que "Side Drawer vs Modal" como decisão principal:** Foi escolhida por ser uma das dúvidas mais recorrentes em design de interfaces complexas — a resposta correta depende de contexto, não de regra absoluta, o que é exatamente o tipo de situação onde o oráculo agrega mais valor do que documentação estática.

---

### 2.9 Página: Reasoning (`/reasoning`)
**O que é:** Visualização do processo de raciocínio do oráculo — três etapas (Context Ingestion → Constraint Application → Synthesis Engine), métricas de confiança e caminhos alternativos considerados.

**Por que existe:** Esta página é uma implementação direta do princípio de **transparência de processo** em XAI (Adadi & Berrada, 2018). O usuário não vê apenas a resposta final — vê como o oráculo chegou a ela. O painel de "Caminhos Alternativos" (Alternative Paths) é particularmente importante: mostra quais opções foram consideradas e descartadas, dando ao usuário base para questionar ou validar a recomendação. Isso combate diretamente o "viés de automação" — a tendência de aceitar uma resposta de IA sem questionamento.

---

### 2.10 Página: System Evaluation (`/system-evaluation`)
**O que é:** Painel de avaliação do próprio oráculo com métricas de Clarity (96%), Trust (91%), Accessibility (87%) e Consistency (98%).

**Por que existe:** O OE5 do TCC ("Avaliar empiricamente a eficácia do oráculo") exige instrumentos de medição. Esta página serve a dois propósitos: (1) como mock das métricas que serão preenchidas com dados reais dos testes com usuários (Semanas 11-12), e (2) como componente de interface que demonstra como o sistema reporta sua própria performance — outro aspecto de XAI, o sistema sendo transparente sobre suas limitações.

---

### 2.11 Página: Persona (`/persona`)
**O que é:** Documentação da persona primária de pesquisa — Francisco Soares, 32 anos, Product Manager, com impaciência acima da média e aversão a perder tempo procurando informação. Inclui: perfil, objetivos, frustrações (com citações de literatura), jornada sem o oráculo, jornada com o oráculo, mapeamento de dores para componentes de XAI e métricas de sucesso.

**Por que existe:** A persona não é um artefato decorativo — ela fundamenta cada decisão de design do projeto. Todo componente criado, toda ordem de prioridade, todo tom de resposta do oráculo pode ser justificado de volta à persona. A jornada "sem o oráculo" (2h30 para resolver uma dúvida de 30 segundos) é o argumento empírico central do TCC: não é ficção, é um padrão documentado em Zhang (2023) e Abbas, Jeong & Lee (2025).

**Por que Francisco é PM, não Designer:** A maioria dos estudos sobre consumidores de DS foca em designers e devs. O PM como persona principal é uma escolha de escopo deliberada: PMs tomam decisões sobre o DS sem a profundidade técnica de designers — e por isso são mais vulneráveis às falhas de documentação estática. Mangold et al. (2025) confirmam que usuários novatos-intermediários beneficiam-se desproporcionalmente de explicações contextualizadas em relação a especialistas.

---

### 2.12 Página: Oracle Chat / Beatrice (`/beatrice-chat`)
**O que é:** Interface conversacional do oráculo — chat em linguagem natural onde o usuário faz perguntas sobre o DS e recebe respostas contextualizadas com XAI (componente recomendado + razão + fonte + confiança).

**Por que existe:** É a interface principal do produto. Toda a arquitetura RAG, todos os componentes de XAI, toda a documentação serve a este ponto de entrada. O usuário não navega no DS — ele pergunta ao oráculo.

**Estado atual:** O chat possui duas camadas complementares:
1. **Interface React** (`BeatriceChatPage.tsx`) — interface completa com histórico, sugestões de prompt e respostas simuladas. Funcional para demonstração visual, testes de fluxo e validação da experiência conversacional.
2. **Camada de API** (`server.cjs`) — serviço Node.js separado, responsável por proxear chamadas para a Anthropic API (Claude Haiku) com streaming de resposta e system prompt alinhado ao ecossistema Aetheris e à persona da Beatrice. Esta camada responde com IA real quando iniciada com `ANTHROPIC_API_KEY`.

**Por que Claude Haiku:** Haiku foi escolhido por custo/benefício para o ciclo de desenvolvimento — latência baixa, custo por token reduzido, capacidade de instrução suficiente para o domínio especializado do DS. Para a versão de produção (MVP), pode ser substituído por qualquer modelo compatível com a Anthropic API.

---

### 2.13 Página: Dev Integration (`/dev-integration`)
**O que é:** Documentação de integração para desenvolvedores — como consumir o Aetheris via código, incluindo exemplos de uso de componentes, suporte a frameworks e integração com a API do oráculo.

**Por que existe:** O DS precisa ter uma camada de implementação além da documentação visual. Devs precisam de instruções concretas (snippets, comandos de instalação, referências de props) — não de mockups. Esta página atende ao perfil de consumidor "Dev Frontend intermediário-avançado" identificado na persona como perfil secundário.

---

## 3. Pipeline RAG — Arquivos e Justificativas

O pipeline RAG é o coração técnico do oráculo. Ele transforma a documentação estática do Aetheris em um sistema de recuperação semântica que permite consultas em linguagem natural.

---

### 3.1 `extract_docs.py` (v2.0.0-tsx)
**O que faz:** Percorre os arquivos `.tsx` do DS (ComponentsPage, PatternsPage, TokensPage, DesignDecisionsPage, GuidelinesPage, FoundationsPage), extrai os arrays de dados tipados e gera o corpus estruturado em JSON e Markdown.

**Por que TypeScript como fonte, não HTML:** Esta foi uma decisão arquitetural tomada após identificar uma inconsistência crítica. A versão anterior do extrator lia arquivos HTML estáticos, que estavam desatualizados em relação ao código React — 8 componentes presentes no app não existiam no corpus. A migração para extração direta do TSX garante que o corpus é sempre derivado da mesma fonte de verdade que o usuário vê na tela. Qualquer atualização no DS é automaticamente refletida no corpus após re-executar o extrator.

**Estratégia de chunking:** Um chunk = um item do DS (um componente, um padrão, um token). Não foi usado chunking por tamanho fixo (ex: 256 tokens) porque os itens do Aetheris já possuem granularidade natural — cada componente é uma unidade semântica completa. Chunking por tamanho quebraria unidades de conhecimento no meio, degradando a qualidade do retrieval.

**Resultado:** 45 chunks com 91% de cobertura de campos semânticos (vs. 24% na versão anterior com HTML).

---

### 3.2 `aetheris-docs-dump.json` + `aetheris-docs-dump.md`
**O que são:** O corpus estruturado — 45 chunks com 8 campos semânticos cada: `title`, `page_type`, `structure`, `logic`, `context_of_use`, `when_to_use`, `when_not_to_use`, `trade_offs`, `aetheris_insight`, além de um campo `text` concatenado que é o que o modelo de embedding processa.

**Por que JSON e Markdown:** JSON é o formato de consumo pelo pipeline (indexação no ChromaDB). Markdown é para auditoria humana — permite revisar o corpus sem abrir código, verificar se um componente foi extraído corretamente e identificar lacunas antes da indexação.

**Distribuição por tipo:**
- `component`: 18 chunks (ações, feedback, visualização, inputs)
- `xai_component`: 4 chunks (Explanation Bubble, Confidence Meter, Predictive Progress Card, Source Attribution Link)
- `pattern`: 11 chunks
- `token`: 4 chunks (cores, tokens semânticos, tipografia, espaçamento)
- `design_decision`: 4 chunks
- `guideline`: 4 chunks

---

### 3.3 `embedding-model-justification.md`
**O que é:** Documento acadêmico justificando a escolha do modelo `BAAI/bge-m3` como modelo de embedding para o pipeline RAG.

**Justificativa central:** O corpus do Aetheris está em inglês técnico. As queries da persona (Francisco, PM brasileiro) chegam em português. Modelos monolíngues (MiniLM, MPNet, BGE-large-en) produziriam embeddings em espaços vetoriais desalinhados para queries cross-lingual, degradando o recall. O BGE-M3 foi treinado em 100+ idiomas com alinhamento semântico cross-lingual — uma query em PT-BR ("qual componente uso para mostrar confiança da IA?") recupera corretamente o chunk em inglês sobre Confidence Meter.

**Comparativo:** BGE-M3 (MTEB avg 64.8) supera todas as alternativas avaliadas em qualidade e extensibilidade, com MIT license e execução totalmente local.

---

### 3.4 `component-map.md`
**O que é:** Análise de cobertura e gaps do corpus — tabela completa dos 45 chunks com status de cada campo semântico, cobertura por tipo de página e gap analysis individualizado.

**Health score atual: 87%** (vs. 43% na versão anterior). Os 6 chunks "thin" remanescentes são páginas estruturais (alguns guidelines e foundations) que não têm separação em campos semânticos mas possuem texto completo para retrieval.

**Por que documentar gaps:** Para o TCC, o gap analysis serve como evidência de rigor metodológico — demonstra consciência das limitações do corpus e oferece caminho claro para expansão. Para o projeto, é um roadmap de qualidade: saber quais chunks são frágeis permite priorizar refinamentos antes dos testes com usuários.

---

### 3.5 `setup_vectordb.py`
**O que faz:** Lê o `aetheris-docs-dump.json`, gera embeddings com BGE-M3 (FP16, dense 1024-d) e popula uma coleção ChromaDB persistente (`aetheris_design_system`) com métrica de distância cosseno.

**Por que ChromaDB:** Execução totalmente local (sem servidor externo), API Python simples, suporte nativo a metadados filtráveis por `page_type`, persistência automática em disco. Para o escopo deste projeto (45 chunks), não há necessidade de soluções distribuídas como Pinecone ou Weaviate.

**Estado atual:** O script está escrito e validado. O banco ainda não foi populado porque o download do modelo BGE-M3 (~2.5 GB) requer conexão estável — deve ser executado na próxima sessão de trabalho.

---

### 3.6 `query_test.py`
**O que faz:** Interface CLI para testar o retrieval semântico — dado uma query em texto, recupera os top-k chunks mais relevantes com score de similaridade, exibe campos semânticos de cada resultado e suporta filtro por `page_type`.

**Por que uma CLI de teste:** Antes de integrar o retrieval ao LLM, é necessário validar a qualidade do retrieval isoladamente. Se o retrieval retornar chunks irrelevantes, o problema está no corpus ou no embedding — não no LLM. Separar as etapas permite debugging preciso.

---

### 3.7 `pipeline-specs.md`
**O que é:** Especificação técnica completa do pipeline RAG com diagrama Mermaid de 4 subgraphs (Ingestão → Indexação → Retrieval → Geração), tabelas de cada componente, template de prompt RAG em PT-BR e tabela de limitações.

**Por que um documento de specs:** Serve como referência única para o capítulo de Metodologia da monografia (Cap 4). Qualquer decisão técnica do pipeline — por que top-k=3, por que cosine e não euclidiana, por que chunking semântico — está documentada aqui com justificativa.

---

### 3.8 `intent-map.md` (Semana 4)
**O que é:** Mapa completo de 7 intents para classificação de queries do usuário: `component_guidance`, `pattern_guidance`, `token_reference`, `design_decision`, `new_product_scaffolding`, `xai_explanation` e `comparison_query`. Cada intent documenta entidades extraídas, filtros ChromaDB, tipo de resposta XAI e exemplos em PT-BR e EN.

**Por que mapear intents:** Nem todas as queries têm o mesmo tipo de resposta esperada. Uma query de `component_guidance` ("qual componente usar para X?") exige Explanation Bubble + Confidence Meter. Uma query de `token_reference` ("qual hex do background?") exige apenas Source Attribution. O mapeamento de intents permite que o sistema calibre a resposta XAI de acordo com o que o usuário realmente precisa — evitando sobrecarga de explicação em queries simples.

---

### 3.9 `xai-architecture.md` (Semana 4)
**O que é:** Especificação da arquitetura de explicabilidade do oráculo — comparação de técnicas (SHAP, LIME, Attention-based, RAG-native), justificativa da abordagem adotada (RAG-native attribution + confidence calibration), implementação em três níveis (Source Attribution → Confidence Score → Explanation Bubble) e código Python de integração.

**Por que RAG-native e não SHAP/LIME:** SHAP e LIME operam sobre os pesos internos de modelos de ML. O LLM utilizado (Claude Haiku via Anthropic API) é um modelo fechado — não há acesso a pesos, ativações ou gradientes. Portanto, SHAP/LIME são tecnicamente inaplicáveis. A XAI neste contexto é implementada através de rastreabilidade de proveniência: o sistema mostra quais chunks do corpus fundamentaram a resposta (Source Attribution), qual foi o score de similaridade desses chunks (Confidence Meter) e instrui o LLM a explicar seu raciocínio em linguagem natural (Explanation Bubble via prompt engineering).

---

## 4. Decisão Arquitetural Central — TypeScript como Fonte de Verdade

Uma decisão crítica tomada nesta fase foi a migração de HTML estático para TypeScript como fonte de verdade do DS.

**O problema identificado:** O extrator original lia 11 arquivos HTML estáticos. O app React, no entanto, era a interface real — e os dois estavam desincronizados: 8 componentes presentes no TSX não existiam nos HTMLs. O corpus do RAG estava incompleto e desatualizado.

**A solução:** Reescrever o `extract_docs.py` para ler diretamente os arquivos `.tsx`, extraindo os arrays de dados tipados via parsing de texto com regex. Com isso:
- O corpus passa de 54 chunks (HTML, 43% health) para 45 chunks (TSX, 87% health)
- A contagem reduziu porque os HTMLs tinham redundâncias e chunks vazios — o TSX tem dados reais
- A qualidade aumentou drasticamente: de 24% de cobertura do campo `when_to_use` para 91%
- Os HTMLs legados foram deletados — existe apenas uma fonte de verdade

**Por que aceitar 45 em vez de 54 chunks:** Qualidade supera quantidade em RAG. 45 chunks com todos os campos semânticos preenchidos produzem retrieval mais preciso do que 54 chunks com 57% de campos vazios. O oráculo que responde "use Entity Picker porque cria relacionamentos tipados — não cópia de dados" é mais útil do que um que diz apenas "Entity Picker".

---

## 5. Próximos Passos — Semanas 4 a 6

### Semana 4 (14–23/04) — em andamento
- [x] Mapa de intents (`intent-map.md`) — **concluído**
- [x] Arquitetura XAI (`xai-architecture.md`) — **concluído**
- [ ] Wireframes de resposta no Figma (3-5 mockups de como o oráculo apresenta cada tipo de resposta) — **pendente, requer Figma**

### Semana 5 (24–30/04)
- Executar `setup_vectordb.py` para popular o ChromaDB com os 45 chunks
- Validar retrieval com `query_test.py` em 10-15 queries representativas das 7 intents
- Commit: `rag/v1-ingest`

### Semana 6 (01–07/05)
- Testes de retrieval end-to-end (`rag/v2-retrieval`)
- Classificador de intents (zero-shot via LLM, conforme especificado no `intent-map.md`)
- Integração frontend: conectar `BeatriceChatPage.tsx` ao `server.cjs` real (substituindo `buildAssistantReply()` hardcoded por chamada à API)
- Commit: `frontend/v2-api`

---

## 6. O Que Ainda Não Está Feito

Com total transparência, os seguintes itens estão pendentes:

| Item | Motivo | Quando |
|------|--------|--------|
| ChromaDB populado (banco indexado) | Requer rodar `setup_vectordb.py` + download do modelo BGE-M3 (~2.5 GB) | Semana 5 |
| Chat React conectado à API real | `BeatriceChatPage.tsx` usa respostas hardcoded; `server.cjs` concentra a IA real via API | Semana 6 |
| Wireframes Figma | Semana 4, requer Figma | Esta semana |
| Classificador de intents funcional | Documentado, não implementado | Semana 6 |
| Testes com usuários | Semanas 11-12 | Junho |
| Análise quantitativa (SUS, MRR/NDCG) | Após testes | Semana 12 |

---

## 7. Síntese das Justificativas Principais

| Decisão | Justificativa |
|---------|--------------|
| TypeScript/React em vez de HTML estático | Dados tipados permitem extração automática pelo RAG; única fonte de verdade |
| BAAI/bge-m3 como modelo de embedding | Único modelo com alinhamento cross-lingual PT-BR↔EN + contexto longo (8192 tokens) + MIT license |
| ChromaDB como vector store | Execução local, sem servidor externo, filtragem por metadados, escopo adequado (45 chunks) |
| RAG-native XAI em vez de SHAP/LIME | LLM fechado (API) impossibilita acesso a pesos; atribuição de proveniência é tecnicamente viável e suficiente |
| Chunking semântico (1 item = 1 chunk) | Granularidade natural do DS; chunking por tamanho quebraria unidades de conhecimento |
| Persona como PM imPaciente | PMs são consumidores sub-representados em estudos de DS; maior vulnerabilidade à documentação estática |
| Seção Intelligence/XAI no DS | Nenhum DS convencional documenta componentes de XAI; é o diferencial direto do TCC |
| Side Drawer vs Modal como decisão principal | Dúvida recorrente, contexto-dependente — exatamente o tipo de caso onde o oráculo supera documentação estática |

---

*Relatório gerado em 14/04/2026 — Disponível em `/Users/mbsf/AETHERIS/relatorio-orientadora.md`*
