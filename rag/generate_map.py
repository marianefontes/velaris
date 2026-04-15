"""
generate_map.py
---------------
Lê aetheris-docs-dump.json e produz component-map.md com:
  - tabela de cobertura por chunk
  - gap analysis (chunks com conteúdo escasso)
  - resumo por tipo de página

Uso:
  python3 rag/generate_map.py
"""

import json
from pathlib import Path

DUMP = Path(__file__).parent / "aetheris-docs-dump.json"
OUT  = Path(__file__).parent / "component-map.md"
PRODUCT_NAME = "Aetheris"

# Limiar de chars abaixo do qual o chunk é considerado "thin"
THIN_THRESHOLD = 200

data   = json.loads(DUMP.read_text(encoding="utf-8"))
meta   = data["meta"]
chunks = data["chunks"]

lines = []

lines += [
    "# Aetheris Design System — Component Map & Gap Analysis",
    "",
    f"> **Total de chunks indexados:** {meta['total_chunks']}  ",
    f"> **Modelo de embedding:** {meta['embedding_model']}  ",
    f"> **Versão:** {meta.get('extractor_version', meta.get('version', '2.0.0-tsx'))}  ",
    f"> **Fontes processadas:** {len(meta['sources'])}  ",
    "",
    "---",
    "",
    "## 1. Mapa Completo de Chunks",
    "",
    "| # | Chunk ID | Tipo | Título | Chars | Campos Preenchidos | Status |",
    "|---|----------|------|--------|-------|--------------------|--------|",
]

SEMANTIC_FIELDS = ["structure", "logic", "context_of_use",
                   "when_to_use", "when_not_to_use", "trade_offs", "aetheris_insight"]

thin_chunks  = []
field_totals = {f: 0 for f in SEMANTIC_FIELDS}

for i, c in enumerate(chunks, 1):
    filled = [f for f in SEMANTIC_FIELDS if c.get(f, "").strip()]
    missing = [f for f in SEMANTIC_FIELDS if not c.get(f, "").strip()]
    fill_count = len(filled)
    fill_label = f"{fill_count}/{len(SEMANTIC_FIELDS)}"

    is_thin = c["char_count"] < THIN_THRESHOLD or fill_count < 2
    flag = "⚠️ thin" if is_thin else "✅"
    if is_thin:
        thin_chunks.append({**c, "filled": filled, "missing": missing})

    for f in filled:
        field_totals[f] += 1

    short_id = c["id"].replace("::", " :: ")
    lines.append(
        f"| {i} | `{short_id}` | {c['page_type']} | {c['title']} "
        f"| {c['char_count']} | {fill_label} | {flag} |"
    )

# ── Seção 2: Cobertura por tipo ────────────────────────────────────────────
by_type: dict[str, list] = {}
for c in chunks:
    by_type.setdefault(c["page_type"], []).append(c)

lines += [
    "",
    "---",
    "",
    "## 2. Cobertura por Tipo de Página",
    "",
    "| Tipo | Chunks | Média de Chars | Thin (⚠️) | Cobertura |",
    "|------|--------|----------------|-----------|-----------|",
]

for ptype, pchunks in sorted(by_type.items(), key=lambda x: -len(x[1])):
    avg   = int(sum(c["char_count"] for c in pchunks) / len(pchunks))
    thin  = sum(1 for c in pchunks if c["char_count"] < THIN_THRESHOLD)
    pct   = round((1 - thin / len(pchunks)) * 100)
    bar   = "█" * (pct // 10) + "░" * (10 - pct // 10)
    lines.append(f"| {ptype} | {len(pchunks)} | {avg} | {thin} | {bar} {pct}% |")

# ── Seção 3: Preenchimento de campos semânticos ────────────────────────────
lines += [
    "",
    "---",
    "",
    "## 3. Preenchimento de Campos Semânticos",
    "",
    "Percentual de chunks que possuem cada campo preenchido:",
    "",
    "| Campo | Chunks com dado | % de cobertura |",
    "|-------|----------------|----------------|",
]

total = len(chunks)
for field, count in sorted(field_totals.items(), key=lambda x: -x[1]):
    pct  = round(count / total * 100)
    bar  = "█" * (pct // 10) + "░" * (10 - pct // 10)
    lines.append(f"| `{field}` | {count}/{total} | {bar} {pct}% |")

# ── Seção 4: Gap Analysis ──────────────────────────────────────────────────
lines += [
    "",
    "---",
    "",
    f"## 4. Gap Analysis — {len(thin_chunks)} Chunks com Conteúdo Escasso",
    "",
    f"> Critério: `char_count < {THIN_THRESHOLD}` **ou** menos de 2 campos semânticos preenchidos.",
    "",
]

if thin_chunks:
    for c in thin_chunks:
        lines += [
            f"### ⚠️ `{c['id']}`",
            f"- **Tipo:** {c['page_type']}  ",
            f"- **Chars:** {c['char_count']}  ",
            f"- **Campos preenchidos:** {', '.join(c['filled']) if c['filled'] else '_nenhum_'}  ",
            f"- **Campos ausentes:** {', '.join(c['missing'])}  ",
            f"- **Recomendação:** Adicionar ao TSX pelo menos `when_to_use`, `when_not_to_use` e `aetheris_insight` para este item.  ",
            "",
        ]
else:
    lines += ["> ✅ Nenhum chunk abaixo do limiar. Cobertura completa.", ""]

# ── Seção 5: Resumo executivo ──────────────────────────────────────────────
rich   = total - len(thin_chunks)
health = round(rich / total * 100)

lines += [
    "---",
    "",
    "## 5. Resumo Executivo",
    "",
    f"| Métrica | Valor |",
    f"|---------|-------|",
    f"| Total de chunks | {total} |",
    f"| Chunks ricos (✅) | {rich} |",
    f"| Chunks thin (⚠️) | {len(thin_chunks)} |",
    f"| Health score do corpus | **{health}%** |",
    f"| Campo mais coberto | `{max(field_totals, key=field_totals.get)}` |",
    f"| Campo menos coberto | `{min(field_totals, key=field_totals.get)}` |",
    "",
    "> Um corpus com health ≥ 80% garante retrieval semântico de qualidade.",
    "> Chunks thin devem ser enriquecidos no TSX antes de re-rodar a indexação.",
    "",
]

OUT.write_text("\n".join(lines), encoding="utf-8")
print(f"✓ component-map.md gravado → {OUT}")
print(f"  {total} chunks mapeados | {len(thin_chunks)} thin | health {health}%")
