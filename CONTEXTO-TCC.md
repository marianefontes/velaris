# CONTEXTO TCC — Aetheris / Oráculo Beatrice

> Documento de contexto completo para uso por IA auxiliar no desenvolvimento.  
> Sintetiza o projeto de pesquisa acadêmico (proposta TCC) + estado atual de implementação + lacunas restantes.  
> **Autora:** Mariane Beatriz Soares Fontes  
> **Co-autora:** Gabrielle Canalle  
> **Instituição:** CESAR — Centro de Estudos e Sistemas Avançados do Recife  
> **Curso:** Graduação em Ciência da Computação  
> **Período:** Fev–Jun 2026

---

## 1. Título e Essência da Pesquisa

**Título oficial:**  
*"Desenvolvimento de um Oráculo Inteligente Baseado em IA Explicável e Princípios de UX para Apoio a Consumidores de Design System"*

**Em uma frase:** construir, documentar e validar com usuários reais um assistente conversacional (Beatrice) que responde perguntas sobre um design system com rastreabilidade de fonte, score de confiança e explicação do raciocínio — combinando RAG + XAI + UX.

---

## 2. Problema de Pesquisa

Consumidores de design systems (designers, devs front-end, PMs, stakeholders) enfrentam:
- Documentação extensa e difícil de navegar
- Ausência de contexto: o sistema diz *o que* usar, não *por que* nem *quando não usar*
- Sobrecarga cognitiva em decisões de alta pressão (sprints, entregas rápidas)
- Soluções ad hoc que geram inconsistência visual e afastamento do design system

**Pergunta central:**  
> *Como desenvolver um oráculo inteligente, baseado em XAI e UX, que apoie consumidores de design systems na compreensão e utilização eficaz de componentes e padrões?*

---

## 3. Quatro Pilares da Solução

A arquitetura do oráculo integra quatro dimensões indissociáveis:

| Pilar | Papel | Sem os outros |
|-------|-------|---------------|
| **RAG** — Recuperação Aumentada por Geração | Base factual: busca documentação do design system para embasar respostas | Documentação estática sem explicação |
| **XAI** — IA Explicável | Justificativa: transforma dados recuperados em explicações contextualizadas com raciocínio e confiança | Genérico, sem fundamentação |
| **Agente Conversacional** | Orquestrador: interpreta intenção, mantém contexto de diálogo, articula RAG+XAI em fluxo natural | Superficial, sem contexto |
| **UX** | Amálgama: estrutura respostas em hierarquia visual (resposta → contexto → explicação → alternativas → fontes), adapta profundidade ao perfil do usuário | Cosmético, não acessível |

**Por que juntos:** RAG sem XAI é documentação. XAI sem RAG é genérica. Agente sem ambos é chatbot. UX sem os três é interface vazia. Juntos transformam informação em compreensão e confiança calibrada.

---

## 4. Objetivos Formais da Pesquisa

### Objetivo Geral
Desenvolver e validar um oráculo inteligente baseado em XAI, RAG e UX para apoiar consumidores de design systems na compreensão, contextualização e utilização eficaz de componentes e padrões de design.

### Objetivos Específicos

| ID | Descrição | Status no projeto |
|----|-----------|-------------------|
| **OE1** | Analisar estudos, frameworks e soluções existentes sobre XAI, agentes conversacionais e design centrado no usuário aplicados a sistemas de suporte e design systems | ✅ Revisão bibliográfica feita (6 papers no projeto) |
| **OE2** | Identificar boas práticas de design conversacional, princípios de UX e técnicas de explicabilidade relevantes para oráculos | ✅ Intent map, wireframes, pipeline XAI documentados |
| **OE3** | Projetar arquitetura, fluxos de diálogo e funcionalidades do oráculo | ✅ Arquitetura RAG/XAI implementada; wireframes WF-01 a WF-05 |
| **OE4** | Implementar protótipo funcional integrando RAG, XAI e interface conversacional | ✅ Implementado (com bugs críticos a corrigir — ver seção 7) |
| **OE5** | Avaliar o protótipo com usuários consumidores de design systems | ❌ **Não iniciado — etapa mais crítica para defesa** |

---

## 5. Metodologia

- **Natureza:** pesquisa aplicada — gera artefato tecnológico concreto
- **Abordagem:** método misto (predominância qualitativa + quantitativa na avaliação)
- **Caráter:** exploratório-descritivo
- **Framework:** Design Science Research (DSR) — ciclo iterativo: análise → requisitos → concepção → implementação → avaliação

### Métricas de Avaliação com Usuários (OE5)
A avaliação empírica deve medir:
1. **Clareza das explicações** — usuário entende o raciocínio da Beatrice?
2. **Utilidade percebida** — a resposta resolve o problema do usuário?
3. **Satisfação** — experiência geral com o oráculo
4. **Confiança** — usuário confia nas recomendações?
5. **Eficácia no apoio à decisão** — a decisão de design foi melhorada?

**Instrumentos sugeridos pela literatura:**
- SUS (System Usability Scale) para usabilidade geral
- Escala customizada de clareza XAI (inspirada em Mangold et al., 2025)
- Escala de confiança calibrada (Hoffman et al., 2023)
- Tarefas de design com cenários reais (escolher componente, justificar padrão)
- Coleta de dados de uso: tempo, número de interações, taxa de sucesso em tarefa

**Perfil dos participantes:** consumidores reais de design systems — designers, devs front-end, PMs, UX writers — com experiência variada no uso de design systems.

---

## 6. Cronograma Original vs. Realidade

| Mês | Planejado | Status Real |
|-----|-----------|-------------|
| Fev 2026 | Revisão bibliográfica | ✅ Feito |
| Mar 2026 | Levantamento de requisitos | ✅ Feito (intent map, wireframes spec) |
| Abr 2026 | Arquitetura RAG/XAI + fluxos UX + protótipos | ✅ Feito (Aetheris v1 + RAG pipeline) |
| Mai 2026 | Implementação protótipo (RAG + XAI + interface) | ✅ ~85% — bugs críticos pendentes |
| Jun 2026 | Avaliação com usuários + análise + escrita final | ❌ Não iniciado |

---

## 7. Estado Atual da Implementação

### Stack Técnica Real

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v3, React Router v6, Recharts |
| Backend | Python/FastAPI, uvicorn |
| LLM | Groq API — `llama-3.3-70b-versatile` (tier gratuito) |
| Embeddings | `BAAI/bge-m3` via FlagEmbedding — multilingual 100+ idiomas, 8192 tokens |
| Vector DB | ChromaDB (persistente local, cosine HNSW) |
| Pipeline RAG | Python scripts: extract_docs.py → setup_vectordb.py |
| Auto-reindex | rag/watch.py (watchdog, debounce 3s) |

### O Que Está Implementado

| Componente | Arquivo | Status |
|-----------|---------|--------|
| Design system (13 rotas completas) | `src/components/*.tsx` | ✅ Completo |
| Corpus extraído dos TSX | `rag/extract_docs.py` | ✅ 37 chunks |
| Embeddings no ChromaDB | `rag/setup_vectordb.py` | ✅ Indexados |
| Servidor RAG real (FastAPI) | `server.py` | ⚠️ Bug crítico B-1 |
| Classificador de intent | `server.py` linhas 49–83 | ✅ 6 intents + general |
| XAI: source attribution SSE | `server.py` linhas 188–194 | ✅ |
| XAI: chips de fonte no frontend | `BeatriceChatPage.tsx` | ✅ |
| Auto-reindexação | `rag/watch.py` | ✅ |
| Wireframes de resposta (5 padrões) | `wireframes/wf-01 a wf-05` | ✅ |
| Documentação de decisões | `decisoes-tomadas.md` | ✅ D-01 a D-15 |
| Linha do tempo | `linha-do-tempo.md` | ✅ Fases 1–6 |

### Bugs Críticos Pendentes (bloqueiam RAG real)

**B-1 — CRÍTICO: classe de embedding errada**  
`server.py` usa `FlagModel` mas deve usar `BGEM3FlagModel` (igual ao `setup_vectordb.py`).  
APIs diferentes — `FlagModel.encode()` retorna numpy array, não dict com `dense_vecs`.  
**Resultado:** `TypeError` em todo query com RAG ativo — Beatrice nunca usa o ChromaDB de verdade.

```python
# ERRADO (server.py linha 39)
from FlagEmbedding import FlagModel
_embedder = FlagModel("BAAI/bge-m3", use_fp16=True)
vec = _embedder.encode([query], batch_size=1)["dense_vecs"][0].tolist()  # explode aqui

# CORRETO
from FlagEmbedding import BGEM3FlagModel
_embedder = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
vec = _embedder.encode([query], return_dense=True, return_sparse=False, return_colbert_vecs=False)["dense_vecs"][0].tolist()
```

**B-2 — CRÍTICO: BGE-M3 carrega na importação (bloqueia startup 20–60s)**  
Mover para `@app.on_event("startup")` ou lifespan handler.

**B-4 — MÉDIO: erros HTTP do Groq (429, 401) engolidos silenciosamente**  
Cliente vê Beatrice responder com mensagem vazia sem indicação de erro.

### Gaps de Implementação

| ID | Descrição | Impacto |
|----|-----------|---------|
| **G-1** | Intent-based ChromaDB filtering não conectado (intent-map.md define filtro por `page_type`, server.py não usa) | Alto — qualidade de retrieval |
| **G-5** | `ReasoningPage`, `DevIntegrationPage`, `PersonaPage` sem extrator em `extract_docs.py` | Médio — corpus incompleto |
| **G-6** | Sidebar de Beatrice mostra stats hardcoded ("22 components indexed") em vez de dados reais do `/health` | Baixo — visual inconsistente |

### Inconsistências de Documentação

| Arquivo | Problema |
|---------|---------|
| `CLAUDE.md` | Descreve stack antiga (Node.js, Anthropic, claude-haiku) — real é Python/Groq/llama-3.3 |
| `.env.local.example` | Referencia `ANTHROPIC_API_KEY` — deveria ser `GROQ_API_KEY` |
| `package.json` | `"start"` aponta para `server.cjs` (antigo) — `"start:py"` é o servidor real |
| `pipeline-specs.md` | File tree ainda mostra `server.cjs` como backend ativo |
| `intent-map.md` | Define `token_reference`; server.py implementa `token_lookup` |

---

## 8. XAI: Escolha Técnica e Justificativa Acadêmica

### Por que não SHAP nem LIME

O projeto de pesquisa cita SHAP e LIME como técnicas XAI comuns (Abbas, Jeong & Lee, 2025). Foram avaliadas e descartadas para este contexto:

- **SHAP:** requer espaço de features discreto e controlável — inaplicável a LLMs generativos onde a "entrada" é texto arbitrário
- **LIME:** requer múltiplas inferências com perturbações para construir modelo linear substituto — com LLMs via API = centenas de chamadas por query, latência e custo inviáveis

### Técnica adotada: RAG-Native Attribution

Utiliza os scores de similaridade coseno do ChromaDB como mecanismo de explicação:
- **Custo zero:** subproduto natural do retrieval já realizado
- **Rastreabilidade real:** mostra exatamente quais trechos da documentação embasaram a resposta
- **Calibração:** similaridade coseno entre query e chunk = proxy de confiança da resposta
- **Auditável:** o gestor pode verificar a fonte citada no design system

**Formato da explicação na Beatrice:**
```
[Fonte 1: ComponentsPage — Confidence Meter (similaridade: 87%)]
context_of_use: ...
when_to_use: ...
trade_offs: ...
```

**Mapeamento para literatura:**  
Alinha-se com Mangold et al. (2025) — explicações devem manter fidelidade técnica E produzir ganhos concretos na compreensão. A RAG-native attribution é ao mesmo tempo tecnicamente fiel (scores reais do vetor) e comunicativamente útil (fonte + percentual).

---

## 9. Decisão de LLM: Por que Groq

- **Anthropic claude-haiku-4-5** (usado inicialmente): API paga, sem tier gratuito suficiente para desenvolvimento prolongado do TCC
- **Groq llama-3.3-70b-versatile**: tier gratuito, API compatível com formato OpenAI, latência baixa (especializado em inferência rápida), qualidade comparável para este domínio
- A migração foi estrutural mas localizada em `server.py` — o frontend e o protocolo SSE não mudaram

---

## 10. Intents Mapeados

O classificador de intent categoriza cada query antes do retrieval:

| Intent | Exemplos de query (PT + EN) | Página RAG alvo |
|--------|----------------------------|-----------------|
| `component_guidance` | "qual componente usar para X?", "which component for Y?" | ComponentsPage |
| `pattern_guidance` | "como estruturar tela de Z?", "how to structure a flow?" | PatternsPage |
| `token_lookup` | "qual token de cor?", "what spacing token?" | TokensPage |
| `design_decision` | "por que usar drawer em vez de modal?", "why was X chosen?" | DesignDecisionsPage |
| `when_not_to_use` | "quando não usar X?", "should not use?" | ComponentsPage, GuidelinesPage |
| `xai_explanation` | "por que a IA recomendou isso?", "explain confidence" | ReasoningPage |
| `general` | fallback para queries não categorizadas | corpus inteiro |

**Nota:** intent-map.md original define `new_product_scaffolding` e `comparison_query` — não implementados em server.py. Extensão planejada.

---

## 11. Corpus RAG: Estado e Cobertura

### Estatísticas (v1)
- **Total de chunks:** 37
- **Fonte:** TSX files de `src/components/`
- **Modelo de embedding:** BAAI/bge-m3 (1024 dim, dense mode)
- **Vector store:** ChromaDB, HNSW, cosine similarity

### Cobertura por Campo Semântico
| Campo | Cobertura | Observação |
|-------|-----------|------------|
| `context_of_use` | ~97% | Excelente |
| `aetheris_insight` | ~92% | Muito bom |
| `when_to_use` | ~78% | Bom |
| `when_not_to_use` | ~65% | Aceitável |
| `trade_offs` | ~27% | **Lacuna crítica para XAI** |
| `logic` / `structure` | ~41–46% | Médio |

### Páginas com Extrator
- ✅ ComponentsPage, PatternsPage, TokensPage, DesignDecisionsPage, GuidelinesPage, FoundationsPage
- ❌ **ReasoningPage, DevIntegrationPage, PersonaPage** — sem extrator (G-5)

---

## 12. Wireframes de Resposta (UX)

5 padrões de resposta documentados em HTML estático (`wireframes/`):

| Arquivo | Intent | Padrão de Resposta |
|---------|--------|-------------------|
| `wf-01-component.html` | `component_guidance` | Confidence Meter — barra de confiança, chip de fonte, trade-offs |
| `wf-02-pattern.html` | `pattern_guidance` | Grid de anatomia, bloco de lógica |
| `wf-03-token.html` | `token_lookup` | Swatches de cor, variáveis CSS |
| `wf-04-decision.html` | `design_decision` | Rule tag, signals grid, amber trade-offs |
| `wf-05-outofscope.html` | `out_of_scope` | Declínio elegante, 12% match, sugestões de redirect |

---

## 13. O Que Falta para Completar o TCC

### Técnico (OE4 — completar implementação)

| Prioridade | Tarefa | Arquivo |
|-----------|--------|---------|
| 🔴 Crítico | Corrigir B-1: trocar `FlagModel` → `BGEM3FlagModel` + fix encode API | `server.py` linhas 39–42, 89 |
| 🔴 Crítico | Corrigir B-2: mover load do modelo para startup handler | `server.py` linhas 29–46 |
| 🟡 Alto | Conectar intent-based filtering no ChromaDB query (G-2) | `server.py` `retrieve_chunks()` |
| 🟡 Médio | Adicionar extratores para ReasoningPage, DevIntegrationPage, PersonaPage (G-5) | `rag/extract_docs.py` |
| 🟡 Médio | Enriquecer `trade_offs` nos ~27 componentes sem esse campo | TSX files em `src/components/` |
| 🔵 Baixo | Atualizar CLAUDE.md com stack real (Python/Groq) | `CLAUDE.md` |
| 🔵 Baixo | Corrigir `.env.local.example` (GROQ_API_KEY, não ANTHROPIC_API_KEY) | `.env.local.example` |
| 🔵 Baixo | Atualizar `"start"` no package.json ou deprecar server.cjs | `package.json` |

### Acadêmico (OE5 — avaliação empírica — etapa mais crítica)

Esta é a etapa mais importante para a defesa. Sem ela, o TCC não fecha o ciclo metodológico.

**O que precisa ser feito:**

1. **Protocolo de avaliação** — documento definindo:
   - Perfil dos participantes (n = 5–8 mínimo para estudo qualitativo; 15–20 para análise quantitativa)
   - Cenários de tarefa (ex: "escolha o componente para uma ação destrutiva em um formulário de pagamento")
   - Instrumentos: questionários, escalas, roteiro de observação
   - Métricas: clareza, utilidade percebida, satisfação, confiança, eficácia

2. **Sessões com usuários** — condução das sessões (presencial ou remota)
   - Participantes: designers, devs front-end, PMs com experiência em design systems
   - Cada sessão: briefing → tarefas com o oráculo → questionário → debrief

3. **Coleta de instrumentos sugeridos:**
   - **SUS (System Usability Scale):** 10 questões, padrão acadêmico
   - **Escala de clareza de explicação** (5 itens, Likert 1–7, baseada em Mangold et al., 2025)
   - **Escala de confiança calibrada** (baseada em Hoffman et al., 2023)
   - **Escala de utilidade percebida** (TAM — Technology Acceptance Model)
   - **Questões abertas:** "O que te fez confiar ou desconfiar da resposta?"

4. **Análise dos dados:**
   - Quantitativa: médias, desvios padrão, correlações (satisfação × clareza × confiança)
   - Qualitativa: análise temática dos comentários abertos
   - Triangulação: comparar resultados instrumentos × observação × dados de uso

5. **Refinamento do artefato** com base nos resultados

---

## 14. Literatura de Base (6 Papers Centrais)

| Ref | Autores | Contribuição ao Projeto |
|-----|---------|------------------------|
| Zhang (2023) | Governing an Evolving In-House Design System | Base para entender governança e comunicação em design systems; justifica o problema de pesquisa |
| Abbas, Jeong & Lee (2025) | XAI in Clinical Decision Support — Meta-Analysis | Técnicas XAI (SHAP, LIME, Grad-CAM), argumento de que XAI é imperativo ético; justifica RAG-native attribution |
| Mangold et al. (2025) | Human-Centered XAI: Systematic Review & Taxonomy | Taxonomia de métricas XAI; base para protocolo de avaliação OE5; clareza percebida + confiança calibrada |
| Gupta, Ranjan & Singh (2024) | RAG: Comprehensive Survey | Fundamento técnico do pipeline RAG; justifica redução de alucinações via base factual |
| Allouch, Azaria & Azoulay (2021) | Conversational Agents Survey | Arquitetura do agente conversacional (NLU + dialogue manager + KB + generator); empatia e limites |
| Zhuang, Concannon & Manley (2022) | Framework for Evaluating Dashboards | Framework de avaliação: eficácia de interação + UX + eficácia do sistema; base para protocolo OE5 |
| Hjelle et al. (2024) | Dashboard Visualizations & Organizational Decision Making | Evidência empírica: formato, completude e atualidade da informação → satisfação → qualidade de decisão |

---

## 15. Comandos do Projeto

```bash
# Frontend
npm run dev                  # Vite dev server (porta 5173)
npm run build                # TypeScript check + build → dist/

# Backend Python (servidor real)
GROQ_API_KEY=gsk_... npm run start:py   # FastAPI + ChromaDB + BGE-M3

# RAG pipeline
npm run index                # Reindexação manual completa
npm run watch-rag            # Auto-reindexação ao salvar TSX

# Servidor legado (não usar para RAG real)
npm start                    # node server.cjs — SEM vector retrieval
```

**Variável de ambiente obrigatória:**
```bash
GROQ_API_KEY=gsk_...        # Para server.py (FastAPI)
```

---

## 16. Estrutura de Arquivos Relevantes

```
AETHERIS/
├── server.py                 # Backend principal (FastAPI, RAG, Groq)
├── server.cjs                # Backend legado (Node.js, TF-IDF, Anthropic) — deprecado
├── requirements.txt          # Deps Python
├── package.json              # Scripts npm
├── CLAUDE.md                 # Documentação do projeto para IA (desatualizada — fix pendente)
├── CONTEXTO-TCC.md           # Este arquivo
├── decisoes-tomadas.md       # Log de decisões técnicas D-01 a D-15
├── linha-do-tempo.md         # Narrativa cronológica do desenvolvimento
├── src/
│   ├── components/           # Páginas React (13 rotas) — fonte primária do corpus RAG
│   │   ├── BeatriceChatPage.tsx   # Interface do chat (SSE parsing, source chips)
│   │   ├── ComponentsPage.tsx     # 22 componentes com logic/structure/tradeOffs
│   │   └── ...
│   ├── i18n/                 # Provider + translations PT-BR / EN-US
│   └── routes.tsx            # Definição das 13 rotas
├── rag/
│   ├── extract_docs.py       # Extrator: TSX → JSON chunks
│   ├── setup_vectordb.py     # Ingestão: JSON → ChromaDB (BGEM3FlagModel)
│   ├── watch.py              # Auto-reindexador (watchdog)
│   ├── chroma_db/            # Vector store persistente (gitignored)
│   ├── intent-map.md         # 7 intents com exemplos bilíngues
│   ├── pipeline-specs.md     # Especificação técnica completa do pipeline
│   └── xai-architecture.md  # Decisão técnica XAI com referências bibliográficas
└── wireframes/
    ├── index.html            # Navegador dos wireframes
    ├── wf-01-component.html  # component_guidance
    ├── wf-02-pattern.html    # pattern_guidance
    ├── wf-03-token.html      # token_lookup
    ├── wf-04-decision.html   # design_decision
    └── wf-05-outofscope.html # out_of_scope
```

---

## 17. Glossário Técnico para o TCC

| Termo | Definição no contexto do projeto |
|-------|----------------------------------|
| **Oráculo Inteligente / Beatrice** | Assistente conversacional do Aetheris que responde perguntas sobre o design system com base em RAG + XAI |
| **RAG** | Retrieval-Augmented Generation — pipeline: query → embed → retrieve (ChromaDB) → augment (system prompt) → generate (Groq) |
| **XAI / RAG-native attribution** | Técnica de explicabilidade que usa scores de similaridade coseno do retrieval como proxy de confiança, sem custo adicional |
| **BGE-M3** | BAAI/bge-m3 — modelo de embedding multilingual (100+ idiomas), 1024 dim, 8192 tokens de contexto |
| **ChromaDB** | Banco de vetores local persistente com HNSW e métrica coseno |
| **Intent** | Categoria semântica da query do usuário (component_guidance, token_lookup, etc.) |
| **Chunk** | Unidade de conhecimento no corpus — um item do design system com seus metadados semânticos |
| **Source chip** | Elemento visual na interface que exibe a fonte RAG da resposta (título + percentual de similaridade) |
| **SSE** | Server-Sent Events — protocolo de streaming usado para transmitir respostas da Beatrice em tempo real |
| **Groq** | Plataforma de inferência LLM com tier gratuito; modelo usado: llama-3.3-70b-versatile |

---

*Última atualização: Maio 2026. Este documento deve ser atualizado ao iniciar a etapa de avaliação empírica (OE5).*
