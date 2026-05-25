"""
test_e2e.py — Aetheris RAG End-to-End Test Suite
-------------------------------------------------
Validates the full retrieval pipeline: intent classification → ChromaDB query
→ similarity scores → page_type filter correctness.

Does NOT require GROQ_API_KEY — tests everything up to (but not including)
LLM generation, which is covered by manual smoke testing.

Usage:
  python3 rag/test_e2e.py            # run all tests, human-readable output
  python3 rag/test_e2e.py --json     # output results as JSON
  python3 rag/test_e2e.py --verbose  # show retrieved chunks per test
"""

import argparse
import json
import sys
import time
from pathlib import Path

# ── Args ──────────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Aetheris RAG E2E Test Suite")
parser.add_argument("--json",    action="store_true", help="JSON output")
parser.add_argument("--verbose", action="store_true", help="Show chunks per test")
args = parser.parse_args()

# ── Paths ──────────────────────────────────────────────────────────────────────
RAG_DIR    = Path(__file__).parent
DB_PATH    = RAG_DIR / "chroma_db"
COLLECTION = "aetheris_design_system"

# ── Intent classifier (mirror of server.py) ────────────────────────────────────
_INTENT_KEYWORDS = {
    "component_guidance": ["componente", "component", "qual usar", "which component",
                           "que componente", "usar para mostrar", "usar para capturar"],
    "pattern_guidance":   ["padrão", "pattern", "tela de", "fluxo de", "como estruturar",
                           "como montar", "layout de", "estrutura de", "how to structure"],
    "token_lookup":       ["token", "tipografia", "typography", "espaçamento", "spacing",
                           "fonte", "cor de", "color", "paleta", "palette"],
    "design_decision":    ["por que", "why", "decisão", "decision", "escolheu", "chose",
                           "regra", "rule", "motivo", "razão"],
    "when_not_to_use":    ["quando não", "when not", "evitar", "avoid",
                           "não devo usar", "should not", "não usar"],
    "xai_explanation":    ["confiança", "confidence", "explicar por que", "explain why",
                           "ia recomendou", "por que a ia", "como a ia decidiu"],
}

_INTENT_FILTER = {
    "component_guidance": ["component", "xai_component"],
    "pattern_guidance":   ["pattern"],
    "token_lookup":       ["token"],
    "design_decision":    ["design_decision"],
    "when_not_to_use":    ["component", "guideline", "xai_component"],
    "xai_explanation":    ["xai_component", "foundation", "reasoning"],
    "general":            [],
}

def classify_intent(query: str) -> str:
    q = query.lower()
    scores = {i: sum(1 for kw in kws if kw in q) for i, kws in _INTENT_KEYWORDS.items()}
    best = max(scores, key=lambda k: scores[k])
    return best if scores[best] > 0 else "general"

# ── Test cases ─────────────────────────────────────────────────────────────────
# Each case: query, expected_intent, expected_page_types (at least one result from these)
TEST_CASES = [
    # Component guidance
    {
        "id": "C-01",
        "query": "qual componente usar para mostrar uma predição da IA com explicação?",
        "expected_intent": "component_guidance",
        "expected_page_types": ["component", "xai_component"],
        "min_score": 0.40,
    },
    {
        "id": "C-02",
        "query": "which component should I use to capture user input in a form?",
        "expected_intent": "component_guidance",
        "expected_page_types": ["component"],
        "min_score": 0.35,
    },
    # Pattern guidance
    {
        "id": "P-01",
        "query": "como estruturar uma tela de onboarding?",
        "expected_intent": "pattern_guidance",
        "expected_page_types": ["pattern"],
        "min_score": 0.35,
    },
    {
        "id": "P-02",
        "query": "what layout pattern should I use for a data dashboard?",
        "expected_intent": "pattern_guidance",
        "expected_page_types": ["pattern"],
        "min_score": 0.30,
    },
    # Token lookup
    {
        "id": "T-01",
        "query": "qual token de cor usar para uma ação primária?",
        "expected_intent": "token_lookup",
        "expected_page_types": ["token"],
        "min_score": 0.45,
    },
    {
        "id": "T-02",
        "query": "what are the spacing tokens and their use cases?",
        "expected_intent": "token_lookup",
        "expected_page_types": ["token"],
        "min_score": 0.40,
    },
    # Design decision
    {
        "id": "D-01",
        "query": "por que o Aetheris escolheu glassmorphism?",
        "expected_intent": "design_decision",
        "expected_page_types": ["design_decision"],
        "min_score": 0.35,
    },
    {
        "id": "D-02",
        "query": "why use a side drawer instead of a modal?",
        "expected_intent": "design_decision",
        "expected_page_types": ["design_decision"],
        "min_score": 0.45,
    },
    # When not to use
    {
        "id": "W-01",
        "query": "quando não devo usar um modal?",
        "expected_intent": "when_not_to_use",
        "expected_page_types": ["component", "guideline", "xai_component"],
        "min_score": 0.30,
    },
    # XAI explanation
    {
        "id": "X-01",
        "query": "como a ia decidiu essa recomendação? explica a confiança",
        "expected_intent": "xai_explanation",
        "expected_page_types": ["xai_component", "foundation", "reasoning"],
        "min_score": 0.30,
    },
    # General fallback
    {
        "id": "G-01",
        "query": "what is aetheris?",
        "expected_intent": "general",
        "expected_page_types": [],   # no filter — any page_type is valid
        "min_score": 0.20,
    },
]

# ── Load dependencies ──────────────────────────────────────────────────────────
if not DB_PATH.exists():
    print(f"[ERRO] ChromaDB não encontrado em {DB_PATH}")
    print("  Execute: python3 rag/setup_vectordb.py --reset")
    sys.exit(1)

try:
    import chromadb
except ImportError:
    print("[ERRO] chromadb não instalado. Execute: pip install chromadb")
    sys.exit(1)

try:
    from FlagEmbedding import BGEM3FlagModel
except ImportError:
    print("[ERRO] FlagEmbedding não instalado. Execute: pip install FlagEmbedding")
    sys.exit(1)

# ── Connect ────────────────────────────────────────────────────────────────────
if not args.json:
    print("\n── Aetheris RAG E2E Test Suite ─────────────────────────")
    print(f"  Corpus: {DB_PATH}")

client     = chromadb.PersistentClient(path=str(DB_PATH))
collection = client.get_collection(COLLECTION)
total      = collection.count()

if not args.json:
    print(f"  Chunks: {total}")
    print("  Carregando BAAI/bge-m3…")

t_load = time.time()
model  = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
load_ms = round((time.time() - t_load) * 1000)

if not args.json:
    print(f"  Modelo pronto em {load_ms}ms\n")

# ── Run tests ──────────────────────────────────────────────────────────────────
results = []

for tc in TEST_CASES:
    t0 = time.time()

    # 1. Intent classification
    detected_intent = classify_intent(tc["query"])
    intent_ok = detected_intent == tc["expected_intent"]

    # 2. Embed query
    vec = model.encode(
        [tc["query"]],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )["dense_vecs"][0].tolist()

    # 3. ChromaDB query with intent filter
    page_types = _INTENT_FILTER.get(detected_intent, [])
    query_kwargs = {
        "query_embeddings": [vec],
        "n_results": 3,
        "include": ["documents", "metadatas", "distances"],
    }
    if page_types:
        query_kwargs["where"] = {"page_type": {"$in": page_types}}

    try:
        res = collection.query(**query_kwargs)
    except Exception:
        res = collection.query(
            query_embeddings=[vec], n_results=3,
            include=["documents", "metadatas", "distances"],
        )

    latency_ms = round((time.time() - t0) * 1000)

    hits = []
    for doc, meta, dist in zip(res["documents"][0], res["metadatas"][0], res["distances"][0]):
        hits.append({
            "title":     meta.get("title", ""),
            "source":    meta.get("source", ""),
            "page_type": meta.get("page_type", ""),
            "score":     round(1.0 - dist, 4),
            "excerpt":   doc[:200],
        })

    top_score = hits[0]["score"] if hits else 0.0
    top_page_types = [h["page_type"] for h in hits]

    # 4. Assertions
    score_ok = top_score >= tc["min_score"]
    # page_type check: if expected_page_types is empty (general) → always pass
    page_type_ok = (
        not tc["expected_page_types"]
        or any(pt in tc["expected_page_types"] for pt in top_page_types)
    )
    passed = intent_ok and score_ok and page_type_ok

    result = {
        "id":               tc["id"],
        "passed":           passed,
        "query":            tc["query"],
        "intent": {
            "expected": tc["expected_intent"],
            "detected": detected_intent,
            "ok":       intent_ok,
        },
        "retrieval": {
            "top_score":        top_score,
            "min_score":        tc["min_score"],
            "score_ok":         score_ok,
            "page_types_found": top_page_types,
            "page_types_ok":    page_type_ok,
        },
        "latency_ms": latency_ms,
        "hits": hits if args.verbose else [],
    }
    results.append(result)

# ── Output ────────────────────────────────────────────────────────────────────
passed_count = sum(1 for r in results if r["passed"])
total_count  = len(results)
avg_latency  = round(sum(r["latency_ms"] for r in results) / total_count)

if args.json:
    print(json.dumps({
        "summary": {
            "passed": passed_count,
            "total":  total_count,
            "pass_rate": f"{100*passed_count//total_count}%",
            "avg_latency_ms": avg_latency,
            "corpus_chunks":  total,
        },
        "results": results,
    }, ensure_ascii=False, indent=2))
else:
    for r in results:
        icon = "✅" if r["passed"] else "❌"
        intent_icon  = "✓" if r["intent"]["ok"]    else "✗"
        score_icon   = "✓" if r["retrieval"]["score_ok"]    else "✗"
        page_icon    = "✓" if r["retrieval"]["page_types_ok"] else "✗"

        print(f"  {icon} [{r['id']}] {r['query'][:60]}")
        print(f"       intent  {intent_icon}  {r['intent']['detected']}"
              + (f" (expected: {r['intent']['expected']})" if not r["intent"]["ok"] else ""))
        print(f"       score   {score_icon}  {r['retrieval']['top_score']:.4f}"
              + (f" (min: {r['retrieval']['min_score']})" if not r["retrieval"]["score_ok"] else ""))
        print(f"       types   {page_icon}  {r['retrieval']['page_types_found']}")
        print(f"       latency   {r['latency_ms']}ms")

        if args.verbose and r["hits"]:
            for i, h in enumerate(r["hits"], 1):
                print(f"         [{i}] {h['score']:.4f}  {h['title']}  ({h['page_type']})")
        print()

    bar = "█" * passed_count + "░" * (total_count - passed_count)
    print(f"  {bar}  {passed_count}/{total_count} passed  |  avg latency: {avg_latency}ms")
    print(f"  corpus: {total} chunks\n")

sys.exit(0 if passed_count == total_count else 1)
