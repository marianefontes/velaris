"""
query_test.py
-------------
Interface de linha de comando para testar o pipeline RAG
com o ChromaDB populado pelo setup_vectordb.py.

Uso:
  python3 rag/query_test.py "qual componente uso para explicar uma predição da IA?"
  python3 rag/query_test.py --top 5 "sprint progress tracking"
  python3 rag/query_test.py --filter component "form input"
  python3 rag/query_test.py --interactive
"""

import argparse
import json
import sys
import time
from pathlib import Path

RAG_DIR    = Path(__file__).parent
DB_PATH    = RAG_DIR / "chroma_db"
COLLECTION = "aetheris_design_system"
PRODUCT_NAME = "Aetheris"

# ─── Argparse ─────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Aetheris RAG Query Tester")
parser.add_argument("query",         nargs="?",       help="Query de busca")
parser.add_argument("--top",         type=int, default=3, help="Número de resultados (default: 3)")
parser.add_argument("--filter",      type=str, default=None,
                    help="Filtrar por page_type: component | pattern | guideline | token | ...")
parser.add_argument("--interactive", action="store_true", help="Modo interativo (loop)")
parser.add_argument("--json",        action="store_true", help="Output em JSON")
args = parser.parse_args()

if not args.query and not args.interactive:
    parser.print_help()
    sys.exit(0)


# ─── Dependências ─────────────────────────────────────────────────────────────
def require(pkg):
    try:
        return __import__(pkg)
    except ImportError:
        print(f"[ERRO] '{pkg}' não instalado. Execute: pip install {pkg}")
        sys.exit(1)


chromadb = require("chromadb")

# ─── Conecta ao DB ────────────────────────────────────────────────────────────
if not DB_PATH.exists():
    print(f"[ERRO] ChromaDB não encontrado em {DB_PATH}")
    print("  Execute primeiro: python3 rag/setup_vectordb.py")
    sys.exit(1)

client     = chromadb.PersistentClient(path=str(DB_PATH))
collection = client.get_collection(COLLECTION)
total      = collection.count()


# ─── Carrega modelo ───────────────────────────────────────────────────────────
print(f"\n── Aetheris RAG Query ──────────────────────────")
print(f"  Coleção: '{COLLECTION}' | {total} documentos indexados")
print("  Carregando BAAI/bge-m3 para encoding de query…")

FlagEmbedding = require("FlagEmbedding")
model = FlagEmbedding.BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
print("  Modelo pronto.\n")


# ─── Função de busca ──────────────────────────────────────────────────────────
def search(query: str, top_k: int = 3, page_type_filter: str = None) -> list[dict]:
    t0 = time.time()

    # Embed query
    q_embed = model.encode(
        [query],
        batch_size=1,
        max_length=256,
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )["dense_vecs"].tolist()

    # Filtro opcional por tipo de página
    where = {"page_type": page_type_filter} if page_type_filter else None

    results = collection.query(
        query_embeddings=q_embed,
        n_results=min(top_k, total),
        include=["documents", "metadatas", "distances"],
        where=where,
    )

    elapsed = (time.time() - t0) * 1000

    hits = []
    for doc, meta, dist in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0],
    ):
        hits.append({
            "score":         round(1 - dist, 4),
            "title":         meta.get("title", ""),
            "source":        meta.get("source", ""),
            "page_type":     meta.get("page_type", ""),
            "status":        meta.get("status", ""),
            "when_to_use":   meta.get("when_to_use", ""),
            "when_not_to_use": meta.get("when_not_to_use", ""),
            "aetheris_insight": meta.get("aetheris_insight", ""),
            "excerpt":       doc[:300],
            "latency_ms":    round(elapsed, 1),
        })

    return hits


def print_hits(query: str, hits: list[dict]):
    print(f"Query: \"{query}\"")
    print(f"{'─' * 60}")
    for i, h in enumerate(hits, 1):
        bar = "█" * int(h["score"] * 10)
        print(f"  [{i}] {h['score']:.4f} {bar}")
        print(f"       {h['title']}  ({h['source']} · {h['page_type']})")
        if h["when_to_use"]:
            print(f"       ✅ Use when: {h['when_to_use'][:120]}")
        if h["when_not_to_use"]:
            print(f"       ❌ Avoid:    {h['when_not_to_use'][:120]}")
        if h["aetheris_insight"]:
            print(f"       💡 Insight:  {h['aetheris_insight'][:120]}")
        print()
    print(f"  Latência: {hits[0]['latency_ms']:.0f} ms\n")


# ─── Execução ─────────────────────────────────────────────────────────────────
if args.interactive:
    print("Modo interativo. Digite 'sair' para encerrar.")
    print("Comandos extras: ':filter component' | ':filter pattern' | ':filter none'\n")
    current_filter = args.filter
    while True:
        try:
            user_input = input("Query > ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nEncerrando.")
            break

        if not user_input:
            continue
        if user_input.lower() in ("sair", "exit", "quit"):
            break
        if user_input.startswith(":filter "):
            val = user_input.split(" ", 1)[1].strip()
            current_filter = None if val == "none" else val
            print(f"  Filtro: {current_filter or 'nenhum'}\n")
            continue

        hits = search(user_input, top_k=args.top, page_type_filter=current_filter)
        if args.json:
            print(json.dumps(hits, ensure_ascii=False, indent=2))
        else:
            print_hits(user_input, hits)

else:
    hits = search(args.query, top_k=args.top, page_type_filter=args.filter)
    if args.json:
        print(json.dumps(hits, ensure_ascii=False, indent=2))
    else:
        print_hits(args.query, hits)
