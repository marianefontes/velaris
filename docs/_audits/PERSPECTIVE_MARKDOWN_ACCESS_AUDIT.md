# Auditoria: Acesso às Bases Markdown por Perspectiva

Data: 2026-06-10 (revisão nomenclatura e saúde)  
Escopo: contratos `.md` em `prompts/perspectives/` e uso real no Abraxos (Beatrice).

---

## Resumo executivo

| Critério | Status |
|----------|--------|
| Todos os `.md` esperados existem | OK (8/8) |
| Arquivos carregados em runtime | OK (8/8 via `load_prompt`) |
| Indexados no RAG (ChromaDB) | `not_applicable` por decisão arquitetural |
| Perspectiva altera estrutura da resposta | OK (hybrid prompt contract strategy) |
| Perspectiva é só label visual | Não |
| Catálogo/evidência têm prioridade | OK |
| Endpoint de saúde | OK (`GET /api/knowledge/perspectives/health`) |
| Testes automatizados | OK (`scripts/test_perspective_contracts.py`) |
| Smoke E2E com Groq | Planejado (`scripts/test_perspective_smoke_e2e.py`) |

**Estratégia de runtime:** `hybrid_prompt_contract`  
Composição controlada de prompt por contrato de perspectiva (`controlled perspective contract injection`) + registry cognitivo + filtro/peso de retrieval por perfil + validação observável pós-geração. Os `.md` de perspectiva **não** entram como chunks RAG.

---

## 1. Inventário de arquivos

### Esperados (8 contratos canônicos)

| perspective_id | Arquivo | contract_id | registry_version |
|----------------|---------|-------------|------------------|
| `dev` | `prompts/perspectives/developer.md` | `developer-response-v1` | 1.2 |
| `a11y` | `prompts/perspectives/accessibility.md` | `accessibility-response-v1` | 1.2 |
| `designer` | `prompts/perspectives/designer.md` | `designer-response-v3` | 3.0 |
| `product_designer` | `prompts/perspectives/product-designer.md` | `product-designer-response-v3` | 3.0 |
| `qa` | `prompts/perspectives/qa.md` | `qa-response-v3` | 3.0 |
| `tech_writer` | `prompts/perspectives/tech-writer.md` | `tech-writer-response-v3` | 3.0 |
| `maintainer` | `prompts/perspectives/maintainer.md` | `maintainer-response-v3` | 3.0 |
| `design_system_manager` | `prompts/perspectives/design-system-manager.md` | `design-system-manager-response-v3` | 3.0 |

### Ignorados pelo pipeline de contrato

| Arquivo | Motivo |
|---------|--------|
| `prompts/perspectives/MANUAL_EVALUATION.md` | Guia de avaliação manual, fora do registry |

---

## 2. Leitura e uso em runtime

| Camada | Momento | Influencia estrutura? |
|--------|---------|----------------------|
| Contrato `.md` no system prompt | Antes | Sim (seções obrigatórias) |
| Cognitive profile registry | Antes | Sim (vocabulário, foco, anti-convergência) |
| Retrieval filter por `profile` | Antes | Sim (evidência recuperada) |
| `validate_perspective_response` | Depois | Sim (auditoria e warnings) |

O `rag/extract_docs.py` indexa apenas TSX/componentes.

---

## 3. Chunks RAG por perspectiva

`rag_indexing: not_applicable`  
Todos os perfis reportam 0 chunks de contrato no ChromaDB. Isso é esperado e **não** gera warning no health check.

---

## 4. Endpoint de saúde

```
GET /api/knowledge/perspectives/health
```

Campos principais:

- `status`: `healthy` ou `warning`
- `rag_indexing`: `not_applicable`
- `runtime_strategy`: `hybrid_prompt_contract`
- `contracts[]`: `perspective_id`, `file_path`, `bytes`, `mtime`, `sha256`, `loaded_at`, `registry_version`

Warnings emitidos apenas quando:

- contrato esperado ausente
- contrato falha ao carregar
- `profileId` canônico sem contrato aplicável
- validação pós-geração inativa
- registry e arquivo divergem

---

## 5. Smoke E2E com Groq

Script: `scripts/test_perspective_smoke_e2e.py`

Pergunta fixa: *"Qual componente uso para uma ação destrutiva?"*

Executa as 8 perspectivas quando `GROQ_API_KEY` estiver disponível e registra:

- `profile_id`
- `contract_applied` / `contract_id`
- resposta final
- sinais obrigatórios encontrados e ausentes
- violações
- similaridade lexical entre perfis

```bash
python3 scripts/test_perspective_smoke_e2e.py
```

Sem API key: status `skipped`, exit code 0.

---

## 6. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `prompts/perspective_health.py` | Nomenclatura, `healthy`, hash, warnings condicionais |
| `scripts/test_perspective_contracts.py` | Testes atualizados |
| `scripts/test_perspective_smoke_e2e.py` | Smoke E2E com Groq |
| `PERSPECTIVE_MARKDOWN_ACCESS_AUDIT.md` | Este relatório |
