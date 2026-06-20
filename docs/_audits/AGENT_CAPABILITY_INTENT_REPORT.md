# Agent Capability Intent — Relatório Final

> Melhoria do comportamento do Abraxos para perguntas sobre capacidades, limitações e roadmap.
> Data: 2026-06-17. Sem commit.

---

## Resumo

Perguntas meta sobre o próprio Abraxos (imagens, Figma, limitações, capacidades) deixaram de cair em `out_of_scope` com a resposta genérica *"Não encontrei isso no escopo do Velaris"*.

Foram adicionadas duas novas intents determinísticas — `agent_capability` e `roadmap_capability` — seguindo o mesmo padrão já usado por `agent_identity` e `help_request`, **sem alterar a arquitetura principal** (RAG, planner, runtime, evidence policy).

---

## Arquivos alterados

| Arquivo | Mudança |
|---------|---------|
| `agent/capability_responses.py` | **Novo** — respostas determinísticas por tópico |
| `agent/intelligence_intents.py` | Detecção de `agent_capability` e `roadmap_capability` |
| `agent/models.py` | Novos valores em `UserIntent`, `OperationalIntent`, `WorkflowName`, `AnswerStrategy` |
| `agent/understanding.py` | Goals `explain_agent_capabilities` / `explain_roadmap_capabilities` |
| `agent/planner.py` | Roteamento para workflows `agent_capability` e `roadmap_capability` |
| `agent/runtime.py` | Respostas determinísticas; `_capabilities_response` delega ao novo módulo |
| `agent/professional_intent.py` | Categoria `KNOWLEDGE_EXPLANATION` para as novas intents |
| `agent/comprehension.py` | Intents adicionadas a `NON_RAG_INTENTS` |
| `agent/knowledge_taxonomy.py` | Estado de conhecimento `canonical` para meta-perguntas |
| `prompts/intent_router.py` | Mapeamento retrieval `general` |
| `rag/institutional-knowledge.md` | Seção **Agent Capabilities and Limitations** |
| `tests/agent/test_agent_capability.py` | **Novo** — testes obrigatórios |
| `tests/agent/test_intelligence_intents.py` | Casos para as novas intents |
| `tests/agent/test_chat_recovery.py` | Ajuste de asserções em `help_request` |

---

## Novas intents

| Intent | Workflow | Quando dispara | RAG |
|--------|----------|----------------|-----|
| `roadmap_capability` | `roadmap_capability` | Imagem, screenshot, tela, Figma, multimodal, integrações futuras | Não |
| `agent_capability` | `agent_capability` | Limitações, restrições, escopo operacional do agente | Não |
| `help_request` *(existente, aprimorado)* | `documentation_help` | "O que você sabe fazer?", capacidades gerais | Não |

Sinais de detecção em `agent/intelligence_intents.py`:

- Regex `_ROADMAP_CAPABILITY_RE` para frases como *aceita imagens*, *analisa screenshot*, *ler figma*
- Marcadores em `agent/capability_responses.py` para termos de limitação e roadmap

---

## Novos chunks institucionais

Adicionados ao final de `rag/institutional-knowledge.md`:

1. **Capabilities** — o que o Abraxos faz hoje
2. **Limitations** — o que não faz (código, imagens, ferramentas externas)
3. **Future Opportunities** — multimodalidade, screenshots, Figma (explicitamente como roadmap, não feature atual)

> Nota: o chunk vive no markdown institucional. Reindexação RAG (`npm run index`) incorporará ao corpus na próxima execução do pipeline.

---

## Exemplos antes / depois

### Roteamento

| Pergunta | Antes | Depois |
|----------|-------|--------|
| você aceita imagens? | `out_of_scope` | `roadmap_capability` |
| você analisa screenshot? | `out_of_scope` | `roadmap_capability` |
| você consegue ler figma? | `out_of_scope` | `roadmap_capability` |
| você consegue analisar uma tela? | `out_of_scope` | `roadmap_capability` |
| quais são suas limitações? | `out_of_scope` | `agent_capability` |
| o que você sabe fazer? | `help_request` | `help_request` *(resposta enriquecida)* |

### Resposta — imagens (antes)

```txt
Não encontrei isso no escopo do Velaris. Posso ajudar com componentes, tokens, padrões...
```

### Resposta — imagens (depois)

```txt
A análise de imagens ainda não integra as capacidades atuais do Abraxos.

Neste momento, o agente atua sobre conhecimento institucional estruturado do Velaris,
incluindo componentes, padrões, acessibilidade, governança, migrações, documentação
e decisões registradas.

A interpretação de screenshots, interfaces e artefatos visuais é uma capacidade
considerada para evoluções futuras do sistema.
```

### Resposta — Figma (depois)

```txt
Ainda não.

Hoje o Abraxos consulta conhecimento institucional do Velaris, mas não possui
integração direta com ferramentas de design como Figma.

Esse tipo de integração representa uma oportunidade de evolução futura do sistema.
```

### Resposta — limitações (depois)

```txt
Estas são as limitações operacionais atuais do Abraxos:

- Não executa código nem altera sistemas
- Não interpreta imagens, screenshots ou interfaces visuais
- Não acessa ferramentas externas como Figma, Jira ou repositórios
- Responde apenas com base no conhecimento institucional disponível no Velaris
- Não inventa entidades de catálogo, tokens ou decisões não documentadas
...
```

### Resposta — capacidades (depois, via `help_request`)

Lista estruturada: componentes, padrões, tokens, decisões, governança, acessibilidade, migrações, comparações, auditorias, explicações, perspectivas — com nota explícita de que não processa imagens.

---

## Cobertura de testes

### Arquivo dedicado: `tests/agent/test_agent_capability.py`

| Teste | Valida |
|-------|--------|
| `test_mandatory_queries_are_not_out_of_scope` | 7 perguntas obrigatórias ≠ `out_of_scope` |
| `test_roadmap_queries_use_roadmap_workflow` | 5 perguntas → workflow `roadmap_capability` |
| `test_limitations_query_uses_agent_capability_workflow` | Limitações → `agent_capability` |
| `test_image_question_response` | Sem mensagem de escopo; menciona imagens e futuro |
| `test_screenshot_question_response` | Sem escopo; menciona imagens/interfaces |
| `test_figma_question_response` | Menciona Figma e integração futura |
| `test_capabilities_help_response` | `help_request` lista capacidades reais |
| `test_limitations_response` | Lista limitações operacionais |
| `test_capability_queries_skip_retrieval` | Sem RAG; `evidence_tier=not_required` |

### Atualizações em testes existentes

- `tests/agent/test_intelligence_intents.py` — `test_roadmap_capability_intent`, `test_agent_capability_intent`
- `tests/agent/test_chat_recovery.py` — asserções alinhadas à nova resposta de capacidades

### Execução

```bash
python3 -m unittest tests.agent.test_agent_capability \
  tests.agent.test_intelligence_intents \
  tests.agent.test_chat_recovery.HelpRequestTests -v
# Ran 23 tests — OK
```

Suite completa `tests/agent`: 349 testes, 2 falhas **pré-existentes** não relacionadas (`test_component_intelligence`, `test_knowledge_health`).

---

## Critério de sucesso

| Critério | Status |
|----------|--------|
| Perguntas sobre imagens/Figma não caem em Out Of Scope | ✅ |
| Agente explica limitação atual com transparência | ✅ |
| Agente lista capacidades reais sem inventar features | ✅ |
| Roadmap futuro indicado sem prometer funcionalidade | ✅ |
| Sem alteração da arquitetura principal (RAG/planner/runtime) | ✅ |
| Testes obrigatórios passando | ✅ |

---

## Próximos passos opcionais

1. Reindexar RAG (`npm run index`) para incorporar a seção institucional ao ChromaDB
2. Adicionar casos em `evals/cases/` para regressão contínua no laboratório
3. Expor `agent_capability` / `roadmap_capability` no audit trail da UI (intent label)
