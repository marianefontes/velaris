# Abraxos Orchestration Restore Report

## Diagnóstico curto

O Abraxos se perdeu por **falha de orquestração**, não por falta de prompt.

A evolução para a camada agentic unificou tudo em `component_recommendation -> component_guidance -> RAG`, sem intents operacionais para navegação ou lookup de existência. O lookup canônico só entrava **depois** do Chroma, permitindo que candidatos semânticos errados (ex.: Radio Button) vencessem entidades exatas (Button). `partial` era tratado como base para recomendação firme. O mapa de rotas existia no GlobalSearch, mas o backend do chat não o consumia. `responseRules.md` bloqueava navegação mesmo quando o usuário pedia explicitamente onde encontrar algo.

## Causas por tipo de regressão

| Origem | Problema |
|--------|----------|
| Arquitetura agentic | Perguntas simples viraram recomendação semântica; lookup canônico tardio |
| Renomeação Beatrice/Abraxos | Labels e capabilities ainda citavam Beatrice; regra de resposta citava Beatrice como access layer |
| Renomeação Aetheris/Velaris | Corpus e responseRules ainda usavam Aetheris em exemplos de catálogo |
| Rotas legadas | `/tokens` ainda aparecia em quick links; backend não tinha route map |
| Search index | `keyword_split` em títulos compostos injetava `button` em Radio Button |
| UI/i18n | `assistant.inputLabel` podia vazar se enviado como prompt |

## Nova ordem do pipeline

1. `normalize_query` (`analyze_query`)
2. `detect_operational_intent` (`navigation_query`, `entity_lookup`, `legacy_name_query`, ...)
3. `resolve_entities` (`exact_entity_matches` via catálogo)
4. `greeting` / `help_request` -> resposta determinística, sem RAG
5. `navigation_query` -> `route_map.py`, sem RAG
6. `entity_lookup` + exact match -> catálogo, sem RAG
7. `comparison` / `recommendation` / `token_lookup` -> planner + tools + RAG
8. `build_component_selection` com exact match **antes** da seleção semântica
9. `validate_response` + política de firmeza (`firm` vs `partial_match`)
10. `dedupe_response`
11. render/SSE

## Arquivos alterados

- `agent/route_map.py` (novo)
- `agent/entity_resolution.py` (novo)
- `agent/operational_responses.py` (novo)
- `agent/response_dedup.py` (novo)
- `agent/models.py`
- `agent/understanding.py`
- `agent/evidence.py`
- `agent/planner.py`
- `agent/runtime.py`
- `agent/response_validation.py`
- `prompts/intent_router.py`
- `prompts/system/responseRules.md`
- `scripts/build_search_index.py`
- `src/search/searchEntries.generated.ts` (regenerado)
- `src/beatrice/orchestrators/chat.orchestrator.ts`
- `src/beatrice/hooks/useChatStream.ts`
- `tests/agent/test_operational_orchestration.py` (novo)
- `tests/agent/test_understanding.py`
- `tests/agent/test_component_intelligence.py`

## Testes adicionados

`tests/agent/test_operational_orchestration.py` cobre intents, rotas canônicas, prioridade Button vs Radio Button, política de evidência parcial, deduplicação e aliases de migração Beatrice/Aetheris.

## Antes / depois (comportamento esperado)

| Pergunta | Antes | Depois |
|----------|-------|--------|
| `oi` | greeting, sem RAG | igual, determinístico |
| `onde acho os tokens?` | `token_lookup` + RAG | `navigation_query` -> `/foundations?focus=tokens`, sem RAG |
| `você tem o componente button?` | `component_guidance` + recomendação | `entity_lookup` -> confirma Button no catálogo |
| `tem Radio Button?` | recomendação semântica | `entity_lookup` -> Radio Button |
| `quando usar Radio Button?` | `component_decision` | igual, com guidance |
| `qual componente uso para opções mutuamente exclusivas?` | podia recomendar errado | `component_decision`, pode recomendar Radio Button com política de firmeza |

## Debug em desenvolvimento

Defina `BEATRICE_DEBUG=1` para logs de orquestração em `agent/runtime.py` (intent, exact match, rota, RAG sim/não).
