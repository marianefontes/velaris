"""
server.py — Beatrice Chat Server (Python / FastAPI)
RAG-augmented proxy for Groq streaming — real ChromaDB + BGE-M3 vector retrieval.

Usage:
  pip install -r requirements.txt
  GROQ_API_KEY=gsk_... uvicorn server:app --port 3333 --reload
"""

import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

import chromadb
import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

# ── Config ───────────────────────────────────────────────────────────────────
API_KEY  = os.environ.get("GROQ_API_KEY", "")
MODEL    = "llama-3.3-70b-versatile"
RAG_DIR  = Path(__file__).parent / "rag"
DB_PATH  = RAG_DIR / "chroma_db"
COLLECTION_NAME = "aetheris_design_system"

# Dialogue management — cap history to avoid token overflow
# Each turn = 1 user + 1 assistant message, so 8 turns = 16 messages max
MAX_HISTORY_MESSAGES = 16

# ── Global state (populated at startup) ──────────────────────────────────────
_chroma:     chromadb.ClientAPI | None = None
_collection: chromadb.Collection | None = None
_embedder                              = None
_rag_ready   = False

# ── Intent → page_type filter map ────────────────────────────────────────────
_INTENT_FILTER: dict[str, list[str]] = {
    "component_guidance": ["component", "xai_component"],
    "pattern_guidance":   ["pattern"],
    "token_lookup":       ["token"],
    "design_decision":    ["design_decision"],
    "when_not_to_use":    ["component", "guideline", "xai_component"],
    "xai_explanation":    ["xai_component", "foundation", "reasoning"],
    "general":            [],  # empty = no filter
}

# ── Intent Classifier ─────────────────────────────────────────────────────────
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

# ── RAG Retrieval ─────────────────────────────────────────────────────────────
def retrieve_chunks(query: str, intent: str, top_k: int = 3) -> list[dict]:
    if not _rag_ready or _collection is None or _collection.count() == 0:
        return []

    vec = _embedder.encode(
        [query],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )["dense_vecs"][0].tolist()

    # Intent-based page_type filtering — improves retrieval precision
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
        # fallback: retry without filter if filtered query returns 0 results
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

# ── System Prompt ────────────────────────────────────────────────────────────
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

# ── Lifespan (startup / shutdown) ─────────────────────────────────────────────
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

    yield  # server runs here

    print("🛑 Shutting down Beatrice server")

# ── FastAPI App ───────────────────────────────────────────────────────────────
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

# Alias under /api so the Vite dev proxy can reach it via /api/health
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

    # Dialogue management: cap history to avoid token overflow
    if len(messages) > MAX_HISTORY_MESSAGES:
        messages = messages[-MAX_HISTORY_MESSAGES:]

    last_user = next((m for m in reversed(messages) if m["role"] == "user"), None)
    query     = last_user["content"] if last_user else ""

    intent      = classify_intent(query)
    chunks      = retrieve_chunks(query, intent)
    rag_context = build_rag_context(chunks)

    # Inject dialogue context when conversation has multiple turns
    dialogue_context = ""
    prior_user_msgs = [m for m in messages if m["role"] == "user"]
    if len(prior_user_msgs) > 1:
        dialogue_context = (
            f"\n\n---\nContexto da conversa: esta é a mensagem {len(prior_user_msgs)} "
            f"do usuário nesta sessão. As mensagens anteriores estão no histórico — "
            f"mantenha coerência com o que já foi recomendado, a menos que o usuário "
            f"peça explicitamente para reconsiderar."
        )

    system_content = _SYSTEM_PROMPT + dialogue_context + rag_context

    groq_messages = [{"role": "system", "content": system_content}] + messages

    async def stream() -> AsyncGenerator[str, None]:
        # XAI attribution — emit sources before text starts
        if chunks:
            sources = [
                {"title": c["title"], "source": c["source"], "similarity": c["similarity"]}
                for c in chunks
            ]
            yield f"data: {json.dumps({'sources': sources, 'intent': intent})}\n\n"

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
