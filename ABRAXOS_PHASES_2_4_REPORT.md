# Abraxos — Fases 2–4: Relatório de Implementação

**Data:** 2026-06-11  
**Escopo:** Intents cognitivos, engine `/health`, concept map, Drawer, anti-alucinação, filtros RAG, UX chat, nomenclatura, documentação.  
**Veredito:** **APROVADO** (com ressalvas documentadas)

---

## Revalidação pós-Fase 1 (confirmação)

| Verificação | Resultado |
|-------------|-----------|
| Corpus dump `total_chunks` | **308** |
| Extractor version | `3.0.0-intelligence-layer` |
| Testes agent (`tests/agent`) | **243/243 OK** |
| Engine `health` em `registry.py` | ✅ resolvível |
| Comando `/health` no frontend | ✅ `policies.ts`, `commandMessages.ts`, `ORACLE_INVESTIGATION_ORDER` |

---

## Fase 2 — Intents, engine, concept map, Drawer

### Intents semânticos (`agent/intelligence_intents.py` → `understanding.py`)

| Intent | Exemplo NL | Workflow |
|--------|------------|----------|
| `system_health` | "o que mede o health do sistema?" | `system_health` |
| `agent_identity` | "o abraxos é um chatbot?" | `agent_identity` (determinístico) |
| `governance_analysis` | "alertas de governança" | `governance_analysis` |
| `simulation` | "simule remover modal" | `simulation` |
| `multi_agent_reasoning` | "oracle council modal ou drawer" | `multi_agent_reasoning` |

Tipos adicionados em `agent/models.py` (`UserIntent`, `WorkflowName`, `AnswerStrategy`).

### Engine `/health`

- `cognition/engines/registry.py` — engine `health` com `retrieval_intent: system_health`, `needs_evidence_metrics: true`
- `prompts/engines/health.md` — contrato já existente
- `route_query(..., command_mode="health")` → `retrieval_intent=system_health`, `top_k=8`

### Concept map (`agent/concept_map.py`)

- Abraxos redefinido como **agente cognitivo** (não só oráculo contextual)
- Nova função `agent_identity_response()` — chatbot vs oráculo vs agente cognitivo
- Handler determinístico em `agent/runtime.py`

### Drawer / comparação

- `comparison_entity_validator.py` — Modal vs Drawer/SideDrawer **permitido** (gap documentado + entidade canônica)
- `unsupported_entity_detection.py` — comparações com gap conhecido não caem mais em `unsupported_entity_lookup` prematuramente
- Inventados em comparação (DragonButton, MagicPopover) continuam **bloqueados**

---

## Fase 3 — Anti-alucinação e filtros

### Registry (`unsupported_entities_registry.py`)

| Entidade | Intent esperado |
|----------|-----------------|
| DragonButton | `unsupported_entity_lookup` ✅ |
| MagicPopover | `unsupported_entity_lookup` ✅ |
| MegaWizard | `unsupported_entity_lookup` ✅ |

### INTENT_FILTER (`prompts/intent_router.py`)

Novos filtros de retrieval:

- `system_health` — `system_health`, `oracle_command`, `automatic_skill`, `engine_contract`, …
- `governance_analysis` — `governance`, `oracle_command`, `design_decision`, …
- `simulation` — `design_decision`, `oracle_command`, `component`, …
- `multi_agent_reasoning` — `perspective`, `cognition`, `oracle_command`, …
- `accessibility_guidance` — inclui `accessibility`
- `general` — enriquecido com `foundation`, `oracle_command`, `perspective`, `cognition`

---

## Fase 4 — UX, nomenclatura, documentação

### Chat `/health`

| Arquivo | Alteração |
|---------|-----------|
| `src/beatrice/types/beatrice.ts` | `health` em `OracleEngineId` |
| `src/beatrice/domain/governance/models.ts` | `COMMAND_META.health`, chip em `ORACLE_INVESTIGATION_ORDER` |
| `src/beatrice/domain/governance/policies.ts` | `health` no `COMMAND_PATTERN` |
| `src/i18n/commandMessages.ts` | hints + placeholders pt-BR / en-US |
| `ORACLE_INVESTIGATION_ORDER` | `health` + `oracle-council` visíveis nas sugestões |

### Documentação

- `CLAUDE.md` — chunk count **308**, extractor `3.0.0-intelligence-layer`
- Sem rename global Aetheris/Beatrice (fora de escopo); nomenclatura cognitiva atualizada em `concept_map.py`

---

## Testes adicionados / atualizados

- `tests/agent/test_intelligence_intents.py` — intents + engine health + DragonButton
- Comparação Modal/Drawer — expectativa invertida (permite, não bloqueia)
- `243` testes agent passando

---

## Ressalvas (não bloqueantes)

1. **Health UI mock** — `SystemHealthSection` ainda usa scores mock; `/health` no chat recupera corpus mas não executa reliability gates live.
2. **Três superfícies Health** — Evaluation mock, Knowledge Health admin, `/api/health` — não unificadas nesta entrega.
3. **Rename global** — referências legadas Aetheris/Beatrice no código interno permanecem; corpus já indexa identidade Velaris/Abraxos.
4. **i18n admin pages** — Governance/Knowledge Health ainda não migradas para provider (P2 original).

---

## Próximo passo sugerido

Integrar Knowledge Health API com `/health` engine e substituir scores mock na Evaluation quando API estiver estável.
