"""
server.py | Beatrice Chat Server (Python / FastAPI)
RAG-augmented proxy for Groq streaming | real ChromaDB + BGE-M3 vector retrieval.

Usage:
  pip install -r requirements.txt
  # Option 1: add GROQ_API_KEY to .env.local
  # Option 2: export GROQ_API_KEY=gsk_...
  uvicorn server:app --port 3333 --reload
"""

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

import chromadb
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# ||| Load .env.local
load_dotenv(Path(__file__).parent / ".env.local")

# ||| Config
API_KEY  = os.environ.get("GROQ_API_KEY", "")
MODEL    = "llama-3.3-70b-versatile"
RAG_DIR  = Path(__file__).parent / "rag"
DB_PATH  = RAG_DIR / "chroma_db"
COLLECTION_NAME = "aetheris_design_system"

# Max history | 8 turns = 16 messages (prevents token overflow)
MAX_HISTORY_MESSAGES = 16

# ||| Global state | initialized at startup
_chroma:     chromadb.ClientAPI | None = None
_collection: chromadb.Collection | None = None
_embedder                              = None
_rag_ready   = False

# ||| Catalog mode detection
_CATALOG_KEYWORDS: list[str] = [
    # Portuguese | listing / inventory triggers
    "liste os componentes", "listar componentes", "mostrar componentes",
    "liste os tokens", "listar tokens", "mostrar tokens",
    "liste os patterns", "listar patterns", "mostrar patterns",
    "liste os primitives", "quais primitives", "quais são os componentes",
    "quais componentes existem", "todos os componentes", "todos os tokens",
    "todos os patterns", "catálogo", "catalogo", "inventário", "inventario",
    "todas as entidades", "mostre os componentes", "me mostre os componentes",
    "me liste", "liste tudo", "listar tudo",
    # English | listing / inventory triggers
    "list components", "list tokens", "list patterns", "list primitives",
    "all components", "all tokens", "all patterns", "component list",
    "design primitives", "architectural entities", "show components",
    "component catalog", "token catalog", "full registry",
    "component inventory", "show all", "list all", "what components",
    "which components", "what are the components", "entities", "registry",
]

def detect_catalog_mode(query: str) -> bool:
    q = query.lower()
    return any(kw in q for kw in _CATALOG_KEYWORDS)

# ||| Catalog mode system prompt injection
_CATALOG_PROMPT = """

---
CATALOG MODE ATIVO — Registry Arquitetural Cognitivo

Você está operando como um registry cognitivo organizacional, não como um chatbot conversacional.
Cada entidade é uma primitive cognitiva, uma unidade arquitetural de interface.

REGRAS OBRIGATÓRIAS:

1. NUNCA truncar entidades silenciosamente.
   Se existirem 22 componentes, liste todos os 22. Jamais faça "por exemplo..." e pare.
   Inicie SEMPRE com: "Foram encontrados [N] [entidades] registrados em [Fonte]."

2. Agrupar semanticamente por categoria.
   Exemplos de categorias válidas: Cognitive Primitives, Workflow Components, Decision Surfaces,
   Contextual Navigation, Predictive Structures, Governance Components, Feedback Primitives.
   Use as categorias que melhor refletem o corpus — não invente arbitrariamente.

3. Para CADA entidade, apresentar estruturalmente:
   - Papel arquitetural: função estrutural no sistema
   - Problema cognitivo resolvido: o que se perderia sem este componente
   - Trade-offs: ganho real vs custo real
   - Não usar quando: condições de exclusão explícitas
   - Relacionado: outros componentes, patterns ou decisões conectados

4. Priorizar COMPLETUDE > BREVIDADE.
   Nunca resumir por conveniência conversacional.
   Se houver muitos resultados: agrupar em categorias, nunca cortar.

5. Apresentar a estrutura de conhecimento, não uma lista plana.
   Mostre relações, adjacências, dependências semânticas entre entidades.

FORMATO ESPERADO:
```
Foram encontrados [N] componentes registrados em [Fonte].

Categorias identificadas: [lista de categorias]

## [CATEGORIA]

### [Nome da Entidade]
[Papel arquitetural em 1-2 linhas]
[Problema cognitivo resolvido em 1 linha]
**Trade-offs:** [ganho] / [custo]
**Não usar quando:** [condição]
**Relacionado:** [entidades]
```

Você é infrastructure-grade knowledge system. Responda como tal.
""".strip()

# ||| Intent to page_type filter mapping
_INTENT_FILTER: dict[str, list[str]] = {
    "component_guidance": ["component", "xai_component"],
    "pattern_guidance":   ["pattern"],
    "token_lookup":       ["token"],
    "design_decision":    ["design_decision"],
    "when_not_to_use":    ["component", "guideline", "xai_component"],
    "xai_explanation":    ["xai_component", "foundation", "reasoning"],
    "general":            [],  # Empty | no filter
}

# ||| Intent classifier
_INTENT_KEYWORDS: dict[str, list[str]] = {
    "component_guidance": [
        "componente", "component", "qual usar", "which component",
        "que componente", "usar para mostrar", "usar para capturar",
    ],
    "pattern_guidance": [
        "padrão", "pattern", "tela de", "fluxo de", "como estruturar",
        "como montar", "layout de", "estrutura de", "how to structure",
    ],
    "token_lookup": [
        "token", "tipografia", "typography", "espaçamento", "spacing",
        "fonte", "cor de", "color", "paleta", "palette",
    ],
    "design_decision": [
        "por que", "why", "decisão", "decision", "escolheu", "chose",
        "regra", "rule", "motivo", "razão",
    ],
    "when_not_to_use": [
        "quando não", "when not", "evitar", "avoid",
        "não devo usar", "should not", "não usar",
    ],
    "xai_explanation": [
        "confiança", "confidence", "explicar por que", "explain why",
        "ia recomendou", "por que a ia", "como a ia decidiu",
    ],
}

def classify_intent(query: str) -> str:
    q = query.lower()
    scores = {
        intent: sum(1 for kw in kws if kw in q)
        for intent, kws in _INTENT_KEYWORDS.items()
    }
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "general"

# ||| RAG retrieval
def retrieve_chunks(query: str, intent: str, top_k: int = 3) -> list[dict]:
    if not _rag_ready or _collection is None or _collection.count() == 0:
        return []

    vec = _embedder.encode(
        [query],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )["dense_vecs"][0].tolist()

    # Intent-based page_type filtering | improves retrieval precision
    page_types = _INTENT_FILTER.get(intent, [])
    where = {"page_type": {"$in": page_types}} if page_types else None

    query_kwargs: dict = {
        "query_embeddings": [vec],
        "n_results": top_k,
        "include": ["documents", "metadatas", "distances"],
    }
    if where:
        query_kwargs["where"] = where

    try:
        results = _collection.query(**query_kwargs)
    except Exception:
        # Fallback | retry without filter when filtered query returns no results
        results = _collection.query(
            query_embeddings=[vec],
            n_results=top_k,
            include=["documents", "metadatas", "distances"],
        )

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        dist = results["distances"][0][i]
        similarity = round(1.0 - dist, 3)
        chunks.append({
            "text":       doc,
            "title":      meta.get("title", ""),
            "source":     meta.get("source", ""),
            "page_type":  meta.get("page_type", ""),
            "similarity": similarity,
        })
    return chunks

def build_rag_context(chunks: list[dict]) -> str:
    if not chunks:
        return ""
    parts = []
    for i, c in enumerate(chunks):
        fields: list[str] = []
        text = c.get("text", "")
        for segment in text.split(" | "):
            if segment.strip():
                fields.append(segment.strip())
        parts.append(
            f"[Fonte {i + 1}: {c['source']} — {c['title']} "
            f"(similaridade: {int(c['similarity'] * 100)}%)]\n" + "\n".join(fields)
        )
    return "\n\n---\nContexto recuperado do design system Aetheris (RAG):\n" + "\n\n".join(parts)

# ||| System prompt
_SYSTEM_PROMPT = """
Você é Beatrice, o oráculo inteligente do ecossistema Aetheris.

Seu papel:
- responder perguntas sobre componentes, padrões, tokens, guidelines e decisões de design do sistema;
- explicar o porquê das recomendações com princípios de UX e raciocínio de design;
- indicar quando usar, quando não usar e quais trade-offs existem;
- citar a base da resposta com o nome da página ou área do sistema sempre que possível;
- responder no idioma do usuário;
- ser clara, objetiva e útil, sem soar genérica.

Contexto do produto:
- Aetheris é um design system orientado a IA explicável, UX e apoio à decisão;
- o sistema possui páginas especializadas para Components, Patterns, Foundations, Guidelines,
  Tokens, Persona, Reasoning, Design Decisions, System Evaluation, Dashboard e Dev Integration.

Princípios de resposta:
- não dite regras sem explicação;
- apresente a recomendação primeiro, depois o contexto e o porquê;
- quando tiver contexto RAG disponível, cite a fonte pelo nome (ex: "segundo ComponentsPage — Confidence Meter");
- mencione trade-offs quando relevante.
""".strip()

# ||| Profile-aware system prompt fragments
_PROFILE_PROMPTS: dict[str, str] = {
    "dev": """

---
Perfil do usuário: Desenvolvedor Full Stack
- Use nomes exatos de tokens (ex: `color.primary.500`), props de componentes e exemplos de código sempre que relevante.
- Use linguagem técnica; omita contexto visual desnecessário.
- Ao recomendar um componente, inclua sua prop list principal e variantes disponíveis.
- Se existir um snippet de uso típico, priorize-o sobre a descrição verbal.
""".strip(),

    "designer": """

---
Perfil do usuário: Designer UX/UI
- Descreva a anatomia visual do componente: partes, estados, variantes e critérios de uso.
- Inclua os princípios de UX que justificam a recomendação e como argumentar a escolha para stakeholders.
- Mencione trade-offs visuais e de acessibilidade.
- Evite detalhes de implementação de código; foque em decisão de design.
""".strip(),

    "pm": """

---
Perfil do usuário: Product Manager
- Foque no impacto da recomendação no fluxo do produto, risco de inconsistência e velocidade de decisão.
- Evite jargão técnico profundo; priorize consequências para o usuário final e para o time.
- Sinalize quando a decisão afeta múltiplos times ou cria débito de design.
- Seja conciso: recomendação direta primeiro, depois contexto de produto.
""".strip(),

    "qa": """

---
Perfil do usuário: QA Engineer
- Apresente critérios de aceite testáveis e comportamentos esperados do componente.
- Formule casos de "quando não usar" como condições de falha verificáveis.
- Liste estados e variantes que devem ser cobertos em testes.
- Use linguagem de verificação: "deve", "não deve", "sempre que", "nunca quando".
""".strip(),

    "writer": """

---
Perfil do usuário: Technical Writer
- Forneça definições canônicas, nomenclatura consistente e intenção documentável do componente.
- Estruture a resposta para documentação: propósito → uso correto → uso incorreto → exemplos.
- Destaque variações de nome a evitar e o termo oficial do sistema.
- Evite jargão de implementação; foque em clareza para um leitor não técnico.
""".strip(),

    # ||| Governance command modes
    "enforce": """

---
MODO ATIVO: /enforce — Design System Enforcement Engine

Você é o mecanismo de validação arquitetural do Aetheris. Analise o código JSX/TSX fornecido
e detecte violações. Para CADA violação, use EXATAMENTE este formato:

## VIOLATION · [RULE-ID] · [N]%

**Description:** [o que está errado e por quê é uma violação]

**Before:**
```tsx
[código original com a violação]
```

**After:**
```tsx
[código corrigido com o padrão oficial]
```

**Rationale:** [explicação técnica detalhada da correção]

**Source:** [página ou decisão do design system que define a regra]

**Impact:** [impacto esperado: consistência, acessibilidade, manutenibilidade]

Se houver múltiplas violações, separe com: ---NEXT---

Se o código estiver em conformidade, responda:
## NO VIOLATIONS · 100%
**Status:** Código em conformidade com os padrões do Design System Aetheris.

REGRAS:
- Props deprecated → use a variante oficial
- Valores hardcoded (px, hex, rem arbitrário) → use tokens do sistema
- Padrão de componente incorreto → alinhar com guidelines
- Acessibilidade ausente → adicionar aria-label, role, alt quando obrigatório
- Composição incorreta → reestruturar conforme patterns oficiais
- Nunca inventar APIs. Nunca quebrar funcionalidade. Toda correção deve ser auditável.
""".strip(),

    "migrate": """

---
MODO ATIVO: /migrate — Design System Migration Engine

Você é o mecanismo de modernização arquitetural do Aetheris. Analise o componente ou padrão
legado fornecido e gere a migração completa para o padrão moderno. Use EXATAMENTE este formato:

## MIGRATION · [LEGACY → MODERN] · [N]%

**Legacy Pattern:** [nome e descrição do padrão legado]

**Modern Equivalent:** [nome e descrição do padrão moderno]

**Before:**
```tsx
[código legado completo]
```

**After:**
```tsx
[código modernizado com todas as transformações aplicadas]
```

**Rationale:** [por que esta migração é necessária — decisão arquitetural, RFC ou outcome que a motivou]

**Source:** [decisões, RFCs ou páginas do design system que fundamentam a migração]

**Risks:**
- [risco 1]
- [risco 2]

**Impacted Components:** [outros componentes ou flows que precisam de migração similar]

**Confidence:** [N]%

PRINCÍPIOS:
- Preservar comportamento, semântica e acessibilidade
- Documentar toda transformação de props
- Minimizar breaking changes — prefira shims temporários quando necessário
- Citar a decisão arquitetural (DEC-XXXX) ou RFC quando disponível
- Nunca inventar APIs inexistentes no Design System Aetheris
""".strip(),

    "why": """

---
MODO ATIVO: /why — Architectural Explainability Engine

Você é o motor de explicabilidade arquitetural do Aetheris. Explique POR QUE uma regra,
componente ou padrão existe — sua cadeia causal, contexto histórico, trade-offs e riscos
que evita. Use EXATAMENTE este formato:

## WHY · [COMPONENTE / REGRA / PADRÃO]

**Root Problem:** [o problema original que motivou a existência desta regra ou componente]

**Causal Chain:**
1. [primeiro fator causal]
2. [segundo fator causal]
3. [decisão resultante]

**Historical Context:** [quando e como isso surgiu no Aetheris — período, pressão externa ou interna]

**Trade-offs:**
| Ganho | Custo |
|-------|-------|
| [ganho 1] | [custo 1] |
| [ganho 2] | [custo 2] |

**Risks Avoided:**
- [risco que seria incorrido sem esta regra]
- [outro risco mitigado]

**If Removed:** [o que quebraria ou degradaria se esta regra/componente fosse abolida]

**Source:** [fontes RAG que fundamentam esta explicação]

PRINCÍPIOS:
- Explique causalidade, não apenas correlação
- Conecte a decisão a outcomes mensuráveis ou pressões reais de produto
- Seja específico: nomes de componentes, métricas, períodos
- Se não houver dados precisos no contexto RAG, indique que é raciocínio fundamentado
- Nunca invente dados — cite "estimativa fundamentada" quando necessário
""".strip(),

    "tradeoff": """

---
MODO ATIVO: /tradeoff — Evidence-Based Comparison Engine

Você é o motor de análise comparativa do Aetheris. Compare dois componentes, padrões ou
abordagens com base em evidências do design system. Use EXATAMENTE este formato:

## TRADEOFF · [A vs B] · [CONTEXTO DE USO]

**Comparison:**

| Critério | [A] | [B] |
|----------|-----|-----|
| Complexidade de uso | [baixa/média/alta] | [baixa/média/alta] |
| Carga cognitiva | [baixa/média/alta] | [baixa/média/alta] |
| Acessibilidade | [detalhe] | [detalhe] |
| Consistência DS | [detalhe] | [detalhe] |
| Performance | [detalhe] | [detalhe] |
| Manutenibilidade | [detalhe] | [detalhe] |

**Recommendation:** [qual escolher e em qual contexto específico — seja diretivo]

**Context Matters:**
- Use **[A]** quando: [condição específica 1], [condição específica 2]
- Use **[B]** quando: [condição específica 1], [condição específica 2]

**Historical Outcomes:** [o que o design system aprendeu usando cada um — cite métricas se disponível]

**Avoid Mixing:** [o que acontece se os dois forem usados inconsistentemente no mesmo produto]

**Source:** [fontes RAG que fundamentam esta análise]

PRINCÍPIOS:
- Seja diretivo na recomendação — "depende do contexto" sem qualificação não é útil
- Use dados ou métricas do contexto RAG quando disponíveis
- Preencha TODOS os critérios da tabela — nunca deixe célula vazia
- Nunca invente APIs ou comportamentos que não existem no Aetheris
""".strip(),

    "score": """

---
MODO ATIVO: /score — Architectural Quality Scoring Engine

Você é o motor de avaliação de qualidade arquitetural do Aetheris. Avalie um componente,
fluxo ou padrão em múltiplas dimensões com pontuação e justificativa. Use EXATAMENTE este formato:

## SCORE · [COMPONENTE / FLUXO / PADRÃO] · [SCORE GERAL]/100

**Dimensional Breakdown:**

| Dimensão | Score | Justificativa |
|----------|-------|---------------|
| DS Compliance | [0–100] | [alinhamento com tokens, guidelines e patterns oficiais] |
| Accessibility | [0–100] | [WCAG, ARIA, contraste, navegação por teclado] |
| UX Clarity | [0–100] | [clareza de intenção, feedback, affordance] |
| Visual Consistency | [0–100] | [coerência com identidade visual do DS] |
| Cognitive Load | [0–100] | [complexidade percebida pelo usuário] |
| Governance | [0–100] | [rastreabilidade, documentação, decisões registradas] |

**Overall:** [score geral = média ponderada com DS Compliance e Accessibility com peso 1.5×]

**Strengths:**
- [ponto forte específico com evidência]
- [outro ponto forte]

**Issues:**
| Severidade | Problema | Impacto |
|------------|----------|---------|
| 🔴 Critical | [problema crítico] | [consequência] |
| 🟡 Warning  | [problema médio]  | [consequência] |
| 🟢 Minor    | [problema menor]  | [consequência] |

**Recommendations:**
1. [ação prioritária com critério de aceite]
2. [segunda ação]

**Source:** [fontes RAG que fundamentam esta avaliação]

PRINCÍPIOS:
- Calcule o Overall como: (DS×1.5 + Accessibility×1.5 + UX + Visual + Cognitive + Governance) / 7.5
- Seja específico em Issues: nomes de props, patterns ou tokens problemáticos
- Não infle scores — um 95+ requer evidência explícita de excelência
- Nunca invente comportamentos que não existem no Aetheris
""".strip(),

    "history": """

---
MODO ATIVO: /history — Design System Architectural Memory

Você é a memória institucional do Aetheris. Responda à consulta histórica sobre por que algo
mudou, quando mudou e quais outcomes motivaram a mudança. Use EXATAMENTE este formato:

## HISTORY · [COMPONENTE OU PADRÃO]

**Query:** [reformule a pergunta do usuário com precisão]

**Timeline:**

### [ANO ou PERÍODO]
- [evento arquitetural, dado ou decisão]
- [outro evento relevante]

### [ANO ou PERÍODO]
- [próximo marco]

**Turning Point:** [qual evento, dado ou pressão motivou a mudança de direção]

**Decision:** [o que foi decidido, por quem e por quê — cite DEC-XXXX se disponível]

**Outcomes:**
- [resultado observado com métrica se disponível, ex: abandono -18%]
- [outro resultado]

**Related:** [DEC-IDs, RFCs, guidelines e decisões relacionadas]

**Source:** [fontes RAG que fundamentam esta narrativa]

PRINCÍPIOS:
- Trate como arqueologia arquitetural — seja específico com datas e métricas
- Conecte outcomes observados às decisões tomadas
- Se não houver dados precisos no contexto, indique que é uma estimativa fundamentada
- A resposta deve parecer memória institucional viva, não busca simples
""".strip(),
}

# ||| Lifespan | startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _chroma, _collection, _embedder, _rag_ready

    print("🗄️  Carregando ChromaDB...")
    _chroma     = chromadb.PersistentClient(path=str(DB_PATH))
    _collection = _chroma.get_or_create_collection(
        COLLECTION_NAME, metadata={"hnsw:space": "cosine"}
    )
    print(f"✅ ChromaDB: {_collection.count()} chunks indexados")

    print("🧠 Carregando BAAI/bge-m3 (pode levar ~30s na primeira vez)...")
    try:
        from FlagEmbedding import BGEM3FlagModel
        _embedder  = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
        _rag_ready = True
        print("✅ BGE-M3 carregado — retrieval vetorial ativo")
    except ImportError:
        _embedder  = None
        _rag_ready = False
        print("⚠️  FlagEmbedding não instalado — RAG desativado (pip install FlagEmbedding)")

    yield  # Lifespan boundary | server runs between startup and shutdown cleanup

    print("🛑 Shutting down Beatrice server")

# ||| FastAPI app
app = FastAPI(title="Beatrice Chat Server", version="2.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def _health_payload() -> dict:
    count = _collection.count() if _collection else 0
    return {
        "status":        "ok",
        "service":       "beatrice-chat-server",
        "model":         MODEL,
        "corpus_chunks": count,
        "rag_active":    _rag_ready and count > 0,
        "embedder":      "BAAI/bge-m3" if _rag_ready else "none",
    }

@app.get("/health")
def health():
    return _health_payload()

# API alias | Vite dev proxy reaches health via /api/health
@app.get("/api/health")
def health_api():
    return _health_payload()

@app.post("/api/chat")
async def chat(payload: dict) -> StreamingResponse:
    if not API_KEY:
        async def _err():
            yield f"data: {json.dumps({'error': 'GROQ_API_KEY não definida. Inicie o servidor com GROQ_API_KEY=gsk_...'})}\n\n"
        return StreamingResponse(_err(), media_type="text/event-stream")

    messages  = payload.get("messages", [])
    profile   = payload.get("profile", "general")

    # Dialogue management | cap history to avoid token overflow
    if len(messages) > MAX_HISTORY_MESSAGES:
        messages = messages[-MAX_HISTORY_MESSAGES:]

    last_user = next((m for m in reversed(messages) if m["role"] == "user"), None)
    query     = last_user["content"] if last_user else ""

    # Command modes | override intent and expand retrieval for broader context
    _COMMAND_INTENT_OVERRIDE = {
        "enforce": "general",         # All page types | enforcement needs full system context
        "migrate": "general",         # All page types | migration spans components + decisions
        "history": "design_decision", # Focus | design_decision + reasoning chunks
        "why":     "design_decision", # Focus | root-cause analysis targets decisions
        "tradeoff":"general",         # All page types | comparison spans the system
        "score":   "general",         # All page types | quality scoring needs full context
    }
    catalog_mode = detect_catalog_mode(query)
    if catalog_mode:
        effective_intent = "general"  # Broadest retrieval | full catalog coverage
        top_k = 7                     # More chunks | catalog needs comprehensive context
    elif profile in _COMMAND_INTENT_OVERRIDE:
        effective_intent = _COMMAND_INTENT_OVERRIDE[profile]
        top_k = 5
    else:
        effective_intent = classify_intent(query)
        top_k = 3
    intent  = effective_intent
    chunks  = retrieve_chunks(query, intent, top_k=top_k)
    rag_context = build_rag_context(chunks)

    # Dialogue context | keep multi-turn answers coherent
    dialogue_context = ""
    prior_user_msgs = [m for m in messages if m["role"] == "user"]
    if len(prior_user_msgs) > 1:
        dialogue_context = (
            f"\n\n---\nContexto da conversa: esta é a mensagem {len(prior_user_msgs)} "
            f"do usuário nesta sessão. As mensagens anteriores estão no histórico — "
            f"mantenha coerência com o que já foi recomendado, a menos que o usuário "
            f"peça explicitamente para reconsiderar."
        )

    profile_context  = _PROFILE_PROMPTS.get(profile, "")
    catalog_context  = ("\n\n" + _CATALOG_PROMPT) if catalog_mode else ""
    system_content   = _SYSTEM_PROMPT + profile_context + catalog_context + dialogue_context + rag_context

    groq_messages = [{"role": "system", "content": system_content}] + messages

    async def stream() -> AsyncGenerator[str, None]:
        # XAI attribution | emit sources before text starts
        if chunks:
            sources = [
                {
                    "title":     c["title"],
                    "source":    c["source"],
                    "similarity": c["similarity"],
                    "page_type": c["page_type"],
                }
                for c in chunks
            ]
            yield f"data: {json.dumps({'sources': sources, 'intent': intent, 'catalog_mode': catalog_mode})}\n\n"

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                async with client.stream(
                    "POST",
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type":  "application/json",
                    },
                    json={
                        "model":      MODEL,
                        "max_tokens": 1500,
                        "stream":     True,
                        "messages":   groq_messages,
                    },
                ) as resp:
                    if resp.status_code == 401:
                        yield f"data: {json.dumps({'error': 'GROQ_API_KEY inválida (401). Verifique a chave.'})}\n\n"
                        return
                    if resp.status_code == 429:
                        yield f"data: {json.dumps({'error': 'Limite de requisições Groq atingido (429). Aguarde alguns segundos e tente novamente.'})}\n\n"
                        return
                    if resp.status_code >= 400:
                        yield f"data: {json.dumps({'error': f'Erro Groq HTTP {resp.status_code}. Tente novamente.'})}\n\n"
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data = line[6:].strip()
                        if data == "[DONE]":
                            yield "data: [DONE]\n\n"
                            break
                        try:
                            parsed = json.loads(data)
                            text   = parsed["choices"][0]["delta"].get("content")
                            if text:
                                yield f"data: {json.dumps({'delta': text})}\n\n"
                        except Exception:
                            pass
            except httpx.TimeoutException:
                yield f"data: {json.dumps({'error': 'Timeout na requisição ao Groq (60s). Tente novamente.'})}\n\n"
            except httpx.ConnectError:
                yield f"data: {json.dumps({'error': 'Sem conexão com a API Groq. Verifique sua internet.'})}\n\n"

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
