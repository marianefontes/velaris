"""
setup_vectordb.py
-----------------
Lê aetheris-docs-dump.json, gera embeddings com o provider configurado
e popula uma coleção ChromaDB persistente.

MODO DE RETRIEVAL: Dense por padrão (`AETHERIS_RETRIEVAL_MODE=dense`).
Hybrid (`AETHERIS_RETRIEVAL_MODE=hybrid`) funde denso + esparso BGE-M3 via RRF
quando o cache lexical local existir. API embedding mode permanece dense-only.

Uso:
  pip install chromadb huggingface_hub
  AETHERIS_EMBEDDING_MODE=api HF_API_TOKEN=hf_... python3 rag/setup_vectordb.py
  python3 rag/setup_vectordb.py

Flags opcionais:
  --reset             Apaga a coleção existente antes de reindexar
  --batch N           Tamanho do batch de encoding (default: 8)
  --no-prune-orphans  Mantém ids no Chroma que não existem mais no dump
"""

import argparse
import sys
import time
from pathlib import Path

RAG_DIR = Path(__file__).parent
ROOT_DIR = RAG_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from rag.chroma_config import chroma_db_path, chroma_db_path_source
from rag.embedding_provider import (
    create_embedding_provider,
    dense_vectors,
    embedder_label,
    embedding_mode,
)
from rag.index_sync import (
    DUMP_PATH,
    corpus_out_of_sync,
    load_corpus_chunks,
    log_sync_result,
    sync_corpus_index,
    validate_chunks,
)
from rag.sparse_index import ensure_sparse_cache

DB_PATH = chroma_db_path()
COLLECTION = "aetheris_design_system"


def require(pkg: str, install: str):
    try:
        return __import__(pkg)
    except ImportError:
        print(f"\n[ERRO] Pacote '{pkg}' não encontrado.")
        print(f"  Execute: pip install {install}")
        sys.exit(1)


parser = argparse.ArgumentParser(description="Setup ChromaDB para Aetheris RAG")
parser.add_argument("--reset", action="store_true", help="Apaga e recria a coleção")
parser.add_argument("--batch", type=int, default=8, help="Batch size para encoding")
parser.add_argument(
    "--no-prune-orphans",
    action="store_true",
    help="Não remove ids órfãos do Chroma (presentes no índice, ausentes no dump)",
)
args = parser.parse_args()


print("\n── Aetheris Vector DB Setup ────────────────────")
if not DUMP_PATH.exists():
    print(f"[ERRO] {DUMP_PATH} não encontrado.")
    print("  Execute primeiro: python3 rag/extract_docs.py")
    sys.exit(1)

chunks, meta = load_corpus_chunks()
corpus_version = (
    meta.get("version")
    or meta.get("extractor_version")
    or "unknown"
)
valid, rejected = validate_chunks(chunks)
print(f"✓ Dump carregado: {len(chunks)} chunks de {DUMP_PATH.name}")
print(f"  Válidos: {len(valid)} | Rejeitados na validação: {len(rejected)}")
if rejected:
    for item in rejected:
        print(
            f"  [rejeitado] {item.chunk_id} | reason={item.reason} "
            f"| title={item.title or '-'} | source={item.source or '-'}"
        )

chromadb = require("chromadb", "chromadb")
DB_PATH.mkdir(parents=True, exist_ok=True)
client = chromadb.PersistentClient(path=str(DB_PATH))

if args.reset:
    try:
        client.delete_collection(COLLECTION)
        print(f"✓ Coleção '{COLLECTION}' apagada (--reset)")
    except Exception:
        pass

collection = client.get_or_create_collection(
    name=COLLECTION,
    metadata={
        "hnsw:space": "cosine",
        "description": "Aetheris Design System — componentes, padrões, tokens, guidelines",
        "model": "BAAI/bge-m3",
        "version": corpus_version,
    },
)
print(f"✓ Coleção ChromaDB: '{COLLECTION}' ({DB_PATH})")
print(f"  Fonte do caminho: {chroma_db_path_source()}")

existing_ids = set(collection.get(include=[])["ids"])
valid_ids = {chunk["id"] for chunk in valid}
missing_ids = valid_ids - existing_ids
orphan_ids = existing_ids - valid_ids
print(
    f"  Já indexados: {len(existing_ids)} | Faltando: {len(missing_ids)} "
    f"| Órfãos: {len(orphan_ids)}"
)

needs_work = bool(missing_ids) or (bool(orphan_ids) and not args.no_prune_orphans)
if not needs_work:
    print("\n✓ Índice já está em sync com o dump.")

print(f"\n── Carregando provider de embeddings ({embedding_mode()}) ─")
if embedding_mode() == "api":
    print("  Usando Hugging Face Inference Providers; PyTorch local não é carregado.")
else:
    print("  Modo local para desenvolvimento; não usar em produção Standard 2 GB.")
t0 = time.time()
model = create_embedding_provider()
print(f"✓ Provider pronto em {time.time() - t0:.1f}s ({embedder_label(model)})")

if needs_work:
    print(f"\n── Sincronizando corpus (batch={args.batch}) ──────")
    t_embed = time.time()
    try:
        result = sync_corpus_index(
            collection,
            model,
            prune_orphans=not args.no_prune_orphans,
            encode_batch=args.batch,
        )
    except RuntimeError as error:
        print(f"\n[ERRO] Falha na sincronização do corpus: {error}")
        sys.exit(1)

    log_sync_result(result, prefix="[setup]")
    elapsed = time.time() - t_embed
    if result.indexed:
        print(
            f"✓ {result.indexed} embeddings gerados em {elapsed:.1f}s "
            f"({elapsed / result.indexed * 1000:.0f} ms/chunk)"
        )

print("\n── Sparse lexical cache (BGE-M3 hybrid retrieval) ─")
ensure_sparse_cache(
    model,
    valid,
    corpus_version=corpus_version,
    batch_size=args.batch,
)

print("\n── Teste de sanidade (query de validação) ───────")
SANITY_QUERY = "which component should I use to show AI prediction confidence?"
q_embed = model.encode(
    [SANITY_QUERY],
    batch_size=1,
    max_length=256,
    return_dense=True,
    return_sparse=False,
    return_colbert_vecs=False,
)
results = collection.query(
    query_embeddings=dense_vectors(q_embed),
    n_results=3,
    include=["documents", "metadatas", "distances"],
)
print(f"  Query: \"{SANITY_QUERY}\"")
print("  Top-3 resultados:")
for j, (doc, meta_row, dist) in enumerate(zip(
    results["documents"][0],
    results["metadatas"][0],
    results["distances"][0],
), 1):
    score = round(1 - dist, 4)
    print(f"  [{j}] score={score:.4f} | {meta_row['title']} ({meta_row['source']})")
    print(f"       {doc[:120]}…")

print("\n✓ Setup completo. Banco de vetores em:", DB_PATH)
print(f"   Total na coleção: {collection.count()} documentos")
print("   Para consultas: python3 rag/query_test.py \"sua query aqui\"")
print("────────────────────────────────────────────────\n")

if corpus_out_of_sync(collection):
    print(
        f"[ERRO] Coleção ({collection.count()}) ainda difere do corpus válido "
        f"({len(valid)}). Verifique rejeitados e órfãos acima.",
        file=sys.stderr,
    )
    sys.exit(1)
