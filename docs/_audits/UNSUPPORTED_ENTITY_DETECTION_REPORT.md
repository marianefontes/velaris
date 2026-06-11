# Unsupported Entity Detection Report

## Objetivo

Impedir que o Abraxos trate entidades de UI conhecidas no mercado, mas ausentes do catálogo canônico do Velaris, como se existissem.

## Antes

| Pergunta | Comportamento anterior |
|----------|------------------------|
| tem Side Drawer? | Caía em `out_of_scope` ou resposta genérica de componente não encontrado |
| onde fica Side Drawer? | Sem rota canônica; resposta vaga ou fora de escopo |
| quando usar Side Drawer? | Risco de confusão semântica com Modal/Dialog ou RAG especulativo |
| quero usar um painel lateral | Podia cair em `component_decision` com RAG sem garantia canônica |
| tem Combobox? | Resposta genérica sem reconhecer o termo de mercado |
| existe Breadcrumb? | Sem distinção entre ausência canônica e desconhecido |

## Depois

| Pergunta | Intent | Resposta |
|----------|--------|----------|
| tem Side Drawer? | `unsupported_entity_lookup` | Não existe no catálogo Velaris; sugere Modal/Dialog se aplicável |
| onde fica Side Drawer? | `unsupported_entity_lookup` | Mesma transparência canônica, sem inventar rota interna |
| quando usar Side Drawer? | `unsupported_entity_lookup` | Explica ausência, alternativa real e lacuna para edição lateral |
| quero usar um painel lateral | `unsupported_entity_recommendation` | Mapeia use case e indica lacuna do catálogo |
| tem Combobox? | `unsupported_entity_lookup` | Reconhece termo de mercado; sugere Select Dropdown ou Text Input reais |
| existe Breadcrumb? | `unsupported_entity_lookup` | Reconhece ausência; sugere Link se existir no catálogo |
| tem Tabs? | `entity_lookup` | Continua confirmando entidade existente normalmente |

## Artefatos

- `agent/unsupported_entities_registry.py`
- `agent/external_reference_registry.py`
- `agent/unsupported_entity_detection.py`
- Integração em `understanding`, `planner`, `comprehension`, `runtime`, `action_builder`, `operational_responses`
- Testes em `tests/agent/test_unsupported_entity_detection.py`

## Garantias

- Links externos só vêm do `external_reference_registry`
- Alternativas internas só são sugeridas se existirem no catálogo
- `design_system_gap` entra no `audit_metadata`
- Entidades `unsupported` não recebem `recommended_component`
- Ações internas e externas saem estruturadas via `navigation_action`
