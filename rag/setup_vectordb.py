"""
setup_vectordb.py
-----------------
Lê aetheris-docs-dump.json, gera embeddings com BAAI/bge-m3
e popula uma coleção ChromaDB persistente em rag/chroma_db/.

Uso:
  pip install FlagEmbedding chromadb
  python3 rag/setup_vectordb.py

Flags opcionais:
  --reset     Apaga a coleção existente antes de reindexar
  --batch N   Tamanho do batch de encoding (default: 8)
"""

import argparse
import json
import sys
import time
from pathlib import Path

# ─── Caminhos ────────────────────────────────────────────────────────────────
RAG_DIR    = Path(__file__).parent
DUMP_PATH  = RAG_DIR / "aetheris-docs-dump.json"
DB_PATH    = RAG_DIR / "chroma_db"
COLLECTION = "aetheris_design_system"
PRODUCT_NAME = "Aetheris"


# ─── Dependências opcionais ───────────────────────────────────────────────────
def require(pkg: str, install: str):
    try:
        return __import__(pkg)
    except ImportError:
        print(f"\n[ERRO] Pacote '{pkg}' não encontrado.")
        print(f"  Execute: pip install {install}")
        sys.exit(1)


# ─── Argparse ─────────────────────────────────────────────────────────────────
parser = argparse.ArgumentParser(description="Setup ChromaDB para Aetheris RAG")
parser.add_argument("--reset",  action="store_true", help="Apaga e recria a coleção")
parser.add_argument("--batch",  type=int, default=8, help="Batch size para encoding")
args = parser.parse_args()


# ─── Carrega dump ─────────────────────────────────────────────────────────────
print("\n── Aetheris Vector DB Setup ────────────────────")
if not DUMP_PATH.exists():
    print(f"[ERRO] {DUMP_PATH} não encontrado.")
    print("  Execute primeiro: python3 rag/extract_docs.py")
    sys.exit(1)

data   = json.loads(DUMP_PATH.read_text(encoding="utf-8"))
chunks = data["chunks"]
meta   = data.get("meta", {})
corpus_version = (
    meta.get("version")
    or meta.get("extractor_version")
    or "unknown"
)
print(f"✓ Dump carregado: {len(chunks)} chunks de {DUMP_PATH.name}")


# ─── Inicializa ChromaDB ──────────────────────────────────────────────────────
chromadb = require("chromadb", "chromadb")
client   = chromadb.PersistentClient(path=str(DB_PATH))

if args.reset:
    try:
        client.delete_collection(COLLECTION)
        print(f"✓ Coleção '{COLLECTION}' apagada (--reset)")
    except Exception:
        pass

collection = client.get_or_create_collection(
    name=COLLECTION,
    metadata={
        "hnsw:space":   "cosine",   # distância cosseno para embeddings BGE
        "description":  "Aetheris Design System — componentes, padrões, tokens, guidelines",
        "model":        "BAAI/bge-m3",
        "version":      corpus_version,
    }
)
print(f"✓ Coleção ChromaDB: '{COLLECTION}' ({DB_PATH})")


# ─── Verifica itens já indexados (evita re-embedding desnecessário) ───────────
existing_ids = set(collection.get(include=[])["ids"])
to_index     = [c for c in chunks if c["id"] not in existing_ids]
print(f"  Já indexados: {len(existing_ids)} | A indexar: {len(to_index)}")

if not to_index:
    print("\n✓ Todos os chunks já estão indexados. Use --reset para reindexar.")
    sys.exit(0)


# ─── Carrega modelo BGE-M3 ────────────────────────────────────────────────────
print("\n── Carregando BAAI/bge-m3 ──────────────────────")
print("  (primeira execução pode demorar ~2-5 min para download ~2.5 GB)")

FlagEmbedding = require("FlagEmbedding", "FlagEmbedding")
BGEM3FlagModel = FlagEmbedding.BGEM3FlagModel

t0 = time.time()
model = BGEM3FlagModel(
    "BAAI/bge-m3",
    use_fp16=True,   # ~50% menos memória, qualidade mantida
)
print(f"✓ Modelo carregado em {time.time() - t0:.1f}s")


# ─── Encoding em batches ──────────────────────────────────────────────────────
print(f"\n── Gerando embeddings (batch={args.batch}) ──────")

texts     = [c["text"] for c in to_index]
ids       = [c["id"]   for c in to_index]
metadatas = [
    {
        "source":          c["source"],
        "page_type":       c["page_type"],
        "title":           c["title"],
        "status":          c["status"],
        "when_to_use":     c["when_to_use"][:500]     if c["when_to_use"]     else "",
        "when_not_to_use": c["when_not_to_use"][:500] if c["when_not_to_use"] else "",
        "aetheris_insight":c["aetheris_insight"][:500] if c["aetheris_insight"] else "",
        "char_count":      c["char_count"],
    }
    for c in to_index
]

all_embeddings = []
total_batches  = (len(texts) + args.batch - 1) // args.batch

t_embed = time.time()
for i in range(0, len(texts), args.batch):
    batch     = texts[i : i + args.batch]
    b_num     = i // args.batch + 1
    result    = model.encode(
        batch,
        batch_size=args.batch,
        max_length=512,
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )
    vecs = result["dense_vecs"].tolist()
    all_embeddings.extend(vecs)
    print(f"  Batch {b_num:>3}/{total_batches} — {len(batch)} chunks encodados")

elapsed = time.time() - t_embed
print(f"✓ {len(all_embeddings)} embeddings gerados em {elapsed:.1f}s "
      f"({elapsed/len(all_embeddings)*1000:.0f} ms/chunk)")


# ─── Upsert no ChromaDB ───────────────────────────────────────────────────────
print("\n── Inserindo no ChromaDB ────────────────────────")

UPSERT_BATCH = 50   # ChromaDB recomenda batches de até 100
for i in range(0, len(ids), UPSERT_BATCH):
    collection.upsert(
        ids        = ids[i : i + UPSERT_BATCH],
        embeddings = all_embeddings[i : i + UPSERT_BATCH],
        documents  = texts[i : i + UPSERT_BATCH],
        metadatas  = metadatas[i : i + UPSERT_BATCH],
    )

total_in_db = collection.count()
print(f"✓ Upsert concluído. Total na coleção: {total_in_db} documentos")


# ─── Teste de sanidade ────────────────────────────────────────────────────────
print("\n── Teste de sanidade (query de validação) ───────")
SANITY_QUERY = "which component should I use to show AI prediction confidence?"

q_embed = model.encode(
    [SANITY_QUERY],
    batch_size=1,
    max_length=256,
    return_dense=True,
    return_sparse=False,
    return_colbert_vecs=False,
)["dense_vecs"].tolist()

results = collection.query(
    query_embeddings=q_embed,
    n_results=3,
    include=["documents", "metadatas", "distances"],
)

print(f"  Query: \"{SANITY_QUERY}\"")
print("  Top-3 resultados:")
for j, (doc, meta, dist) in enumerate(zip(
    results["documents"][0],
    results["metadatas"][0],
    results["distances"][0],
), 1):
    score = round(1 - dist, 4)   # cosine similarity
    print(f"  [{j}] score={score:.4f} | {meta['title']} ({meta['source']})")
    print(f"       {doc[:120]}…")

print("\n✓ Setup completo. Banco de vetores em:", DB_PATH)
print("   Para consultas: python3 rag/query_test.py \"sua query aqui\"")
print("────────────────────────────────────────────────\n")
