# Beatrice Agent Layer v1

**Data:** 2026-06-07
**Status:** Concluído e documentado para o TCC
**Escopo:** Camada agentic governada inicial da Beatrice

## 1. Objetivo

Evoluir a Beatrice de um copiloto conversacional especializado em design
systems para uma camada agentic governada inicial, com:

- planejamento baseado em regras;
- ferramentas internas com schemas e políticas explícitas;
- execução controlada;
- retrieval RAG reutilizando a infraestrutura atual;
- persistência local de decisões;
- memória server-side por sessão e projeto;
- registro auditável de execuções;
- composição final pelo LLM somente depois das tools;
- interface com fontes, evidence similarity, evidence tier e Execution Trace.

Esta versão é um pipeline governado com etapas determinísticas e uma etapa
generativa controlada. Ela não é um loop autônomo aberto e não deve ser
apresentada como agente autônomo enterprise.

## 2. Princípios obrigatórios

1. O LLM não escolhe tools.
2. O LLM não executa ações.
3. O LLM só compõe a resposta final a partir de contexto estruturado.
4. `out_of_scope` não chama o LLM.
5. Tools `read_only` podem executar automaticamente.
6. Uma `write_action` exige confirmação ou salva somente como `draft`.
7. Nenhuma ação destrutiva é permitida.
8. Fontes e excertos devem vir de chunks reais do corpus.
9. Evidence similarity nunca deve ser apresentada como confiança da resposta.
10. `audit_metadata.steps` é a única fonte da Execution Trace.
11. O frontend não cria, completa ou infere steps.
12. Não existe timeline cognitiva fixa, mockada ou simulada.
13. Chain-of-thought não é armazenado, transmitido ou renderizado.
14. O sistema registra apenas eventos operacionais do pipeline.
15. Testes unitários não carregam BGE-M3.

## 3. Terminologia

### 3.1 Pipeline governado

O fluxo completo é governado por planner, policies, tool permissions, schemas,
confirmação e limites de escopo.

### 3.2 Etapas determinísticas

São determinísticos na v1:

- classificação e seleção de workflow por regras;
- seleção de tools;
- validação de schemas;
- verificação de tool permissions;
- bloqueio de `out_of_scope`;
- cálculo de evidence tier;
- criação de audit metadata;
- persistência e transição de status.

### 3.3 LLM Composer

O LLM Composer é generativo. Sua responsabilidade é somente a composição final
da resposta. Ele não faz orquestração, planejamento, seleção de tools,
execução, confirmação ou persistência.

### 3.4 Execution Trace

Execution Trace, ou Trilha de execução, representa eventos operacionais reais
emitidos pelo backend. O rótulo legado da timeline cognitiva não deve
permanecer na experiência da Beatrice.

## 4. Abordagem selecionada

A Agent Layer será um módulo Python próprio, separado de `server.py`, com
registry, planner, policies, executor, evidence builder e stores locais.

Alternativas rejeitadas:

- concentrar tudo em `server.py`, pois misturaria transporte HTTP, domínio,
  execução e persistência;
- adotar um framework externo de agentes, pois aumentaria dependências,
  abstrações e risco de overclaiming nesta fase;
- permitir que o LLM selecione tools, pois reduziria previsibilidade,
  segurança e auditabilidade.

## 5. Arquitetura

```text
Chat Request
  -> Rule-based Planner
  -> Policy Guardrails
  -> Tool Executor
  -> Evidence Builder
  -> LLM Composer
  -> Decision Draft, quando aplicável
  -> Session Memory + Project Memory
  -> Agent Run finalization
  -> SSE audit metadata + response
```

### 5.1 Infraestrutura de evidência

As tools de busca reutilizam:

- ChromaDB;
- BGE-M3;
- filtros por intent;
- weighting por profile;
- funções atuais de `rag/retrieval.py`;
- serialização semântica atual de `rag/context_builder.py`.

### 5.2 Estrutura de módulos proposta

```text
agent/
  __init__.py
  models.py
  planner.py
  policies.py
  registry.py
  executor.py
  evidence.py
  runtime.py
  store.py
  tools/
    __init__.py
    retrieval_tools.py
    comparison_tool.py
    validation_tool.py
    decision_tool.py
```

Responsabilidades:

| Módulo | Responsabilidade |
|---|---|
| `models.py` | Schemas Pydantic e tipos compartilhados |
| `planner.py` | Classificação por regras e criação do plano |
| `policies.py` | Escopo, evidence threshold, tool permissions e confirmação |
| `registry.py` | Registro e descoberta controlada das tools |
| `executor.py` | Execução sequencial, validação e coleta de resultados |
| `evidence.py` | Deduplicação, excertos, similarity e evidence tier |
| `runtime.py` | Coordenação do fluxo e ciclo SSE |
| `store.py` | SQLite para decisions, memory e agent runs |
| `tools/` | Implementações isoladas das tools |

`server.py` continua responsável pelo transporte HTTP, inicialização das
dependências e integração com o runtime.

## 6. Contrato de entrada do chat

O `POST /api/chat` passa a usar um schema Pydantic aditivo:

```python
class AgentChatRequest(BaseModel):
    messages: list[ChatRequestMessage]
    profile: str = "general"
    command_mode: str | None = None
    calibration: dict | None = None
    session_id: str
    project_id: str = "default"
    preferred_detail_level: str = "balanced"
```

Regras:

- `session_id` usa o identificador da conversa ativa no frontend;
- `project_id` é explícito e estável;
- a v1 envia `default` quando não existe seleção de projeto;
- não existe multi-tenancy;
- mensagens `system` enviadas pelo cliente deixam de ser aceitas como
  instruções confiáveis;
- preferências passam por campos próprios e sanitizados.

## 7. Rule-based Planner

O planner reutiliza sinais do intent router atual, mas a decisão final de
workflow é feita por regras explícitas e testáveis.

### 7.1 Workflows

```text
component_decision
pattern_guidance
token_lookup
design_audit
compare_options
documentation_help
out_of_scope
```

### 7.2 Prioridade de classificação

1. Detectar `out_of_scope`.
2. Detectar auditoria ou validação de descrição, componente ou código.
3. Detectar comparação entre opções.
4. Detectar busca de token.
5. Detectar decisão de componente.
6. Detectar orientação de pattern.
7. Detectar ajuda de documentação dentro do domínio.
8. Bloquear como `out_of_scope` quando não houver sinal de domínio suficiente.

Commands e engines existentes podem contribuir com sinais, mas não podem
permitir que o LLM escolha o workflow.

### 7.3 Saída do planner

```python
class AgentPlan(BaseModel):
    intent: str
    workflow: WorkflowName
    tools: list[str]
    steps: list[str]
    needs_confirmation: bool
    rationale: str
    creates_decision_draft: bool
```

Os `steps` do plano descrevem operações esperadas. Eles não são a Execution
Trace. A UI renderiza somente `audit_metadata.steps`, que contém eventos
efetivamente executados.

### 7.4 Mapa inicial de workflows e tools

| Workflow | Tools |
|---|---|
| `component_decision` | `search_component`, `search_pattern` |
| `pattern_guidance` | `search_pattern` |
| `token_lookup` | `search_token` |
| `design_audit` | `validate_against_design_system` |
| `compare_options` | `compare_design_options` |
| `documentation_help` | Tools read-only conforme entidade detectada |
| `out_of_scope` | Nenhuma |

### 7.5 Criação automática de draft

O planner define `creates_decision_draft=true` somente quando o workflow
produz recomendação:

- `component_decision`;
- `pattern_guidance`;
- `design_audit`;
- `compare_options`.

`token_lookup`, `documentation_help` e `out_of_scope` não criam draft
automaticamente.

## 8. Policy Guardrails

Policies são executadas depois do plano e antes de qualquer tool.

### 8.1 Verificações

- workflow permitido;
- tool registrada;
- schema de entrada válido;
- tool permission compatível;
- confirmação quando exigida;
- exceção de draft automático válida;
- ausência de ação destrutiva;
- escopo de design systems;
- evidence threshold para composição;
- limites de tamanho de entrada.

### 8.2 Tool permissions

Valores permitidos:

```text
read_only
write_action
```

Regras:

- `read_only` executa automaticamente;
- `write_action` exige confirmação, exceto criação de `draft`;
- criação automática só aceita `status=draft`;
- uma tool não pode confirmar ou rejeitar uma decisão automaticamente;
- nenhuma tool pode excluir dados;
- tools desconhecidas são bloqueadas.

### 8.3 Out of scope

Quando o planner seleciona `out_of_scope`:

- nenhuma tool é executada;
- nenhum request ao LLM é feito;
- o backend emite `out_of_scope_blocked`;
- a resposta é determinística e explica o limite;
- `limitations` registra o motivo;
- o `agent_run` termina com status `blocked`.

## 9. Tool Registry

### 9.1 Contrato comum

```python
@dataclass(frozen=True)
class ToolDefinition:
    name: str
    description: str
    input_schema: type[BaseModel]
    output_schema: type[BaseModel]
    status: Literal["read_only", "write_action"]
    requires_confirmation: bool
    executor: Callable
```

O registry rejeita nomes duplicados e executores sem schemas válidos.

### 9.2 `search_component`

Entrada:

```python
class SearchComponentInput(BaseModel):
    query: str
    profile: str = "general"
```

Saída:

```python
class SearchResult(BaseModel):
    items: list[EvidenceItem]
    top_similarity: float
    evidence_tier: EvidenceTier
    limitations: list[str]
```

Comportamento:

- usa intent `component_guidance`;
- limita resultados ao corpus de componentes e XAI components;
- preserva título, tipo, fonte, excerto e similarity reais.

### 9.3 `search_pattern`

Entrada:

```python
class SearchPatternInput(BaseModel):
    query: str
    profile: str = "general"
```

Comportamento:

- usa intent `pattern_guidance`;
- limita resultados a patterns;
- retorna `SearchResult`.

### 9.4 `search_token`

Entrada:

```python
class SearchTokenInput(BaseModel):
    query: str
    category: str | None = None
    profile: str = "general"
```

Comportamento:

- usa intent `token_lookup`;
- limita resultados a tokens;
- a categoria é adicionada ao contexto de busca, sem inventar taxonomia.

### 9.5 `compare_design_options`

Entrada:

```python
class CompareDesignOptionsInput(BaseModel):
    option_a: str
    option_b: str
    context: str
    profile: str = "general"
```

Saída:

```python
class CompareDesignOptionsOutput(BaseModel):
    option_a_evidence: list[EvidenceItem]
    option_b_evidence: list[EvidenceItem]
    shared_evidence: list[EvidenceItem]
    tradeoff_signals: list[EvidenceStatement]
    top_similarity: float
    evidence_tier: EvidenceTier
    limitations: list[str]
```

Trade-off signals são campos semânticos extraídos dos chunks recuperados. A
tool não usa um LLM e não cria fatos ausentes.

### 9.6 `validate_against_design_system`

Entrada:

```python
class ValidateDesignSystemInput(BaseModel):
    subject: str
    profile: str = "general"
```

Saída:

```python
class ValidateDesignSystemOutput(BaseModel):
    relevant_components: list[EvidenceItem]
    relevant_patterns: list[EvidenceItem]
    relevant_tokens: list[EvidenceItem]
    relevant_guidelines: list[EvidenceItem]
    possible_violations: list[EvidenceStatement]
    recommendations: list[EvidenceStatement]
    top_similarity: float
    evidence_tier: EvidenceTier
    limitations: list[str]
```

Possible violations e recommendations são candidatas fundamentadas em regras
ou campos semânticos dos chunks. Elas devem manter referência à evidência que
as originou. A ausência de regra aplicável produz limitação, não invenção.

### 9.7 `create_decision_record`

Entrada:

```python
class CreateDecisionRecordInput(BaseModel):
    user_query: str
    profile: str
    workflow: str
    recommendation: str
    alternatives_considered: list[str]
    tradeoffs: list[str]
    evidence_sources: list[EvidenceSource]
    top_similarity: float
    evidence_tier: EvidenceTier
    model: str
    status: Literal["draft"] = "draft"
```

Saída:

```python
class CreateDecisionRecordOutput(BaseModel):
    decision_id: str
    status: Literal["draft"]
    created_at: str
```

Metadata:

```text
status: write_action
requires_confirmation: false
```

Esta configuração é permitida porque o schema aceita somente `draft`. A
confirmação e rejeição não são operações desta tool e exigem endpoints
acionados explicitamente pelo usuário.

## 10. Executor

O executor recebe `AgentPlan` e executa tools em ordem.

### 10.1 Responsabilidades

1. Validar o plano.
2. Resolver tools no registry.
3. Construir e validar inputs.
4. Aplicar policies.
5. Executar cada tool.
6. Validar outputs.
7. Registrar steps reais.
8. Coletar resultados.
9. Construir contexto estruturado.
10. Autorizar ou bloquear a composição final.

### 10.2 Falha de tool

Quando uma tool necessária falha:

- registrar `tool_execution_failed`;
- não inventar output;
- não chamar o LLM sem base confiável;
- retornar resposta determinística de limitação;
- persistir o `agent_run` como `failed` ou `limited`;
- não criar decision draft.

## 11. Evidence Builder

### 11.1 Evidence item

```python
class EvidenceItem(BaseModel):
    title: str
    source: str
    page_type: str
    excerpt: str
    similarity: float
    retrieval_weight: float
    weighted_score: float
```

O excerto é derivado diretamente de `chunk["text"]`, com limite de tamanho e
sem paráfrase pelo LLM.

### 11.2 Deduplicação

Itens são deduplicados por combinação de `source`, `title` e conteúdo
normalizado do excerto. A ordenação usa weighted score e similarity já
calculados pelo retrieval.

### 11.3 Evidence tier

```text
strong: top similarity >= 0.75
partial: top similarity >= 0.50
weak: top similarity < 0.50
insufficient: nenhum resultado
```

Evidence tier é uma classificação da força da evidência recuperada. Não é
confiança da resposta.

### 11.4 Limitação por evidência

- `insufficient`: não chamar o LLM e responder com limitação determinística;
- `weak`: o LLM pode compor somente uma resposta explicitamente limitada,
  sem recomendação forte e sem draft automático;
- `partial`: permitir composição com ressalvas;
- `strong`: permitir composição normal.

## 12. LLM Composer

### 12.1 Entrada permitida

- query sanitizada;
- profile;
- workflow;
- plano aprovado;
- memória resumida;
- resultados estruturados das tools;
- fontes e excertos reais;
- evidence tier;
- limitations;
- preferências de detalhe sanitizadas.

### 12.2 Entrada proibida

- tool definitions executáveis;
- permissão para selecionar tools;
- credenciais;
- chain-of-thought anterior;
- mensagens `system` fornecidas pelo cliente;
- fontes não recuperadas.

### 12.3 Saída

O composer gera apenas o texto final para streaming. O backend acumula os
deltas em memória para:

- finalizar o `agent_run`;
- criar um decision draft quando aplicável;
- persistir a recomendação como texto integral;
- emitir o evento SSE final.

Alternativas e trade-offs do decision record vêm dos resultados estruturados
das tools. Eles não são extraídos por parsing livre da resposta.

### 12.4 Falha de LLM

- emitir erro seguro;
- registrar `tool_results_built` quando as tools concluíram;
- não registrar `response_completed`;
- não criar decision draft;
- não atualizar memória de sucesso;
- finalizar `agent_run` como `failed`;
- preservar audit metadata já produzida.

## 13. Execution Trace

### 13.1 Fonte única

`audit_metadata.steps` é a única fonte da UI.

O frontend:

- renderiza os steps recebidos;
- atualiza steps pelo mesmo `id` entre eventos SSE;
- preserva a ordem recebida;
- não cria labels, status ou detalhes operacionais;
- não infere steps ausentes;
- não usa fallback sintético.

Quando `audit_metadata.steps` está ausente ou vazio, a UI mostra:

```text
Trilha de execução indisponível para esta resposta
```

### 13.2 Schema

```python
class ExecutionStep(BaseModel):
    id: str
    label: str
    status: Literal["pending", "running", "completed", "failed", "blocked", "skipped"]
    details: str | None = None
    timestamp: str | None = None
```

### 13.3 IDs permitidos

```text
request_received
intent_detected
workflow_selected
tools_selected
policy_checked
retrieval_executed
sources_selected
evidence_scored
tool_results_built
llm_composition_started
response_completed
decision_draft_created
memory_updated
out_of_scope_blocked
tool_execution_failed
```

Nem todos os steps aparecem em todos os workflows. Somente eventos realmente
executados são emitidos.

### 13.4 Migração do frontend

- remover a timeline fixa atual;
- usar somente o título Execution Trace ou Trilha de execução;
- remover transformações que criam uma sequência estática;
- manter respostas legadas legíveis;
- respostas legadas não recebem Execution Trace sintética;
- textos editoriais fora do chat que descrevem a timeline cognitiva legada
  devem ser revisados quando tratarem desta capacidade operacional.

Arquivos atuais que exigem revisão:

- `src/beatrice/components/reasoning/ReasoningTimeline.tsx`;
- `src/beatrice/components/reasoning/DecisionCard.tsx`;
- `src/beatrice/domain/reasoning/transformers.ts`;
- referências de UI e documentação encontradas por busca textual.

## 14. Audit Metadata

```python
class AuditMetadata(BaseModel):
    request_id: str
    intent: str
    workflow: str
    tools_used: list[ToolExecutionSummary]
    steps: list[ExecutionStep]
    sources: list[EvidenceItem]
    evidence_similarity: float
    evidence_tier: EvidenceTier
    limitations: list[str]
    decision_id: str | None = None
    execution_status: str
```

`tools_used` informa nome, tool permission e execution status. Não inclui
argumentos sensíveis ou objetos executáveis.

## 15. Decision Store

### 15.1 Persistência

SQLite local:

```text
data/aetheris-agent.sqlite3
```

Configuração opcional:

```text
AGENT_DB_PATH
```

### 15.2 Schema lógico

Campos mínimos de `decisions`:

- `decision_id`;
- `request_id`;
- `session_id`;
- `project_id`;
- `timestamp`;
- `user_query`;
- `profile`;
- `workflow`;
- `recommendation`;
- `alternatives_considered_json`;
- `tradeoffs_json`;
- `evidence_sources_json`;
- `top_similarity`;
- `evidence_tier`;
- `model`;
- `status`;
- `created_by`;
- `confirmed_by_user`;
- `updated_at`.

Valores:

```text
status: draft | confirmed | rejected
created_by: beatrice
```

### 15.3 Ciclo de vida

Transições permitidas:

```text
draft -> confirmed
draft -> rejected
```

`confirmed` e `rejected` são terminais na v1. Reabrir, editar ou excluir uma
decisão fica fora do escopo.

### 15.4 Endpoints

#### `POST /api/decisions`

- cria somente `draft`;
- valida o schema;
- retorna o registro criado;
- não aceita `confirmed` ou `rejected`.

#### `GET /api/decisions`

Filtros opcionais:

- `status`;
- `workflow`;
- `profile`;
- `project_id`;
- paginação simples.

#### `GET /api/decisions/{id}`

- retorna o registro completo;
- responde `404` quando ausente.

#### `PATCH /api/decisions/{id}`

Entrada:

```python
class DecisionPatch(BaseModel):
    status: Literal["confirmed", "rejected"]
```

Regras:

- exige ação explícita da UI;
- aceita somente decisão em `draft`;
- confirmação define `confirmed_by_user=true`;
- rejeição mantém `confirmed_by_user=false`;
- transição repetida pode ser idempotente;
- transição conflitante retorna `409`.

## 16. Session Memory e Project Memory

### 16.1 Limite conceitual

Esta capacidade se chama session/project memory. Ela não é memória
organizacional enterprise.

### 16.2 `session_memory`

Campos:

- `session_id`;
- `project_id`;
- `profile`;
- `last_intents_json`;
- `recent_decisions_json`;
- `preferred_detail_level`;
- `recurring_topics_json`;
- `created_at`;
- `updated_at`.

### 16.3 `project_memory`

Campos:

- `project_id`;
- `last_profile`;
- `last_intents_json`;
- `recent_decisions_json`;
- `preferred_detail_level`;
- `recurring_topics_json`;
- `created_at`;
- `updated_at`.

### 16.4 Atualização

A memória é atualizada por regras e contadores:

- manter os últimos intents em janela limitada;
- manter referências das decisões recentes;
- incrementar tópicos normalizados detectados pelo planner;
- guardar o último detail level explícito;
- atualizar timestamps.

Não existe uma segunda chamada ao LLM para resumir memória. Não são
armazenados prompts internos, tokens do modelo ou chain-of-thought.

### 16.5 Uso

- session memory preserva continuidade da conversa;
- project memory fornece resumo agregado do projeto ativo;
- o contexto enviado ao composer é limitado e estruturado;
- o projeto `default` agrega as conversas da v1;
- gestão visual de múltiplos projetos fica fora do escopo.

## 17. Agent Runs

Cada request cria um registro em `agent_runs`.

Campos:

- `request_id`;
- `session_id`;
- `project_id`;
- `user_query`;
- `profile`;
- `intent`;
- `workflow`;
- `plan_json`;
- `tools_used_json`;
- `steps_json`;
- `sources_json`;
- `top_similarity`;
- `evidence_tier`;
- `limitations_json`;
- `decision_id`;
- `model`;
- `status`;
- `created_at`;
- `completed_at`;
- `duration_ms`.

Status permitidos:

```text
running
completed
limited
failed
blocked
```

O registro é auditável, mas não é imutável ou assinado criptograficamente na
v1. A linha é criada no início e finalizada ao término da execução.

## 18. Contrato SSE

O protocolo atual permanece compatível por adição de campos.

### 18.1 Evento inicial

Emitido depois de planner, policies e tools, antes dos deltas do LLM:

```json
{
  "intent": "component_guidance",
  "workflow": "component_decision",
  "tools_used": [],
  "audit_metadata": {
    "request_id": "req_...",
    "steps": [],
    "sources": [],
    "evidence_similarity": 0.82,
    "evidence_tier": "strong",
    "limitations": [],
    "execution_status": "running"
  }
}
```

O exemplo abrevia listas. A resposta real inclui summaries de tools, steps e
sources.

### 18.2 Deltas

```json
{"delta": "texto incremental"}
```

### 18.3 Evento final

```json
{
  "final": true,
  "audit_metadata": {
    "request_id": "req_...",
    "steps": [],
    "decision_id": "dec_...",
    "limitations": [],
    "execution_status": "completed"
  }
}
```

O evento final contém a versão completa dos steps. O frontend substitui ou
mescla por `id`, sem inventar conteúdo.

### 18.4 Erros

Erros SSE incluem:

- mensagem segura;
- `request_id`;
- audit metadata disponível;
- limitations;
- execution status.

Erros de retrieval não chamam o LLM. Erros de LLM preservam a evidência e os
steps concluídos.

### 18.5 Compatibilidade legada

O parser continua aceitando:

- `sources`;
- `intent`;
- `catalog_mode`;
- `cognitive_skills`;
- `engine`;
- `delta`;
- `error`.

Mensagens sem `audit_metadata` são renderizadas normalmente. O drawer mostra
o fallback de Execution Trace sem criar uma timeline.

## 19. Interface de chat

Direção aprovada:

```text
Compact Summary + Audit Drawer
```

### 19.1 Resumo na mensagem

Exibir de forma discreta:

- workflow;
- quantidade ou nomes das tools;
- evidence tier;
- decision status quando aplicável.

### 19.2 Fontes

Exibir:

- título;
- origem semântica;
- excerto real;
- evidence similarity;
- page type quando útil.

Não usar o rótulo confidence para similarity.

### 19.3 Audit Drawer

Exibir:

- request ID;
- workflow;
- tools used;
- sources e excerpts;
- top evidence similarity;
- evidence tier;
- limitations;
- decision ID e status;
- Execution Trace.

### 19.4 Decision actions

Quando existe decision draft:

- mostrar `Confirm decision`;
- mostrar `Reject decision`;
- chamar `PATCH /api/decisions/{id}`;
- atualizar o status exibido com a resposta persistida;
- bloquear cliques repetidos durante a requisição;
- mostrar erro sem alterar o status local quando o backend falhar.

### 19.5 Estados obrigatórios

#### Steps ausentes

```text
Trilha de execução indisponível para esta resposta
```

#### Out of scope

- mostrar o bloqueio;
- mostrar limitation;
- renderizar `out_of_scope_blocked` quando recebido;
- não sugerir que houve análise do LLM.

#### Tool failure

- mostrar `tool_execution_failed`;
- identificar a tool quando seguro;
- não renderizar resultado inventado.

#### Evidência insuficiente

- mostrar tier `insufficient`;
- mostrar fontes vazias;
- explicar a limitação;
- não criar draft.

## 20. Matriz de testes

### 20.1 Suítes e nomes

| Suíte | Nome proposto | Tecnologia |
|---|---|---|
| Unitária de planner e policies | `AgentPlannerPolicyTests` | `unittest` |
| Unitária de registry e schemas | `AgentRegistrySchemaTests` | `unittest` |
| Unitária de evidence | `AgentEvidenceTests` | `unittest` |
| Integração de store | `AgentStoreIntegrationTests` | `unittest` + SQLite temporário |
| Contratos de tools | `AgentToolContractTests` | `unittest` + retriever fixture |
| Runtime e SSE | `AgentSSEContractTests` | `unittest` + FastAPI test client |
| UI de Execution Trace | `ExecutionTrace` | Vitest + React Testing Library |
| Merge de audit metadata | `mergeAuditMetadata` | Vitest |
| Fluxos agentic | `AgentFlowEndToEndTests` | `unittest` + fakes controlados |
| Contrato estático de segurança | `test_agent_layer_contracts.py` | script Python |

### 20.2 Testes unitários

| Área | Casos obrigatórios |
|---|---|
| Planner | classificação de cada workflow |
| Planner | prioridade de regras |
| Planner | seleção de tools |
| Planner | `creates_decision_draft` |
| Policies | bloqueio de `out_of_scope` |
| Policies | tool desconhecida |
| Policies | read-only sem confirmação |
| Policies | write action com confirmação |
| Policies | exceção de criação de draft |
| Evidence | thresholds de tiers |
| Evidence | zero resultados |
| Evidence | deduplicação |
| Registry | registro válido |
| Registry | nome duplicado |
| Registry | schema ausente |
| Schemas | inputs válidos e inválidos |
| Schemas | outputs válidos e inválidos |

### 20.3 Testes de integração

Todos usam SQLite temporário.

| Store | Casos obrigatórios |
|---|---|
| Decisions | criar draft |
| Decisions | listar e consultar por ID |
| Decisions | confirmar draft |
| Decisions | rejeitar draft |
| Decisions | bloquear transição conflitante |
| Session memory | criar e atualizar |
| Project memory | agregar entre duas sessions |
| Memory | limitar janelas de intents e decisões |
| Agent runs | criar como running |
| Agent runs | finalizar completed |
| Agent runs | finalizar failed ou blocked |
| Agent runs | preservar steps, sources e limitations |

### 20.4 Testes de tools

O retriever real é substituído por fixture.

Casos:

- BGE-M3 não é importado ou carregado;
- schema de entrada é validado;
- schema de saída é validado;
- filtros de page type são respeitados;
- fontes vêm da fixture;
- excertos vêm da fixture;
- similarity não é alterada;
- tools read-only executam sem confirmação;
- `create_decision_record` aceita somente draft;
- write action não autorizada é bloqueada;
- falha de retrieval produz limitation;
- nenhuma source inexistente aparece.

### 20.5 Testes SSE

Casos:

- metadata inicial;
- deltas;
- evento final;
- `request_id`;
- `workflow`;
- `tools_used`;
- `audit_metadata.steps`;
- `sources`;
- `evidence_similarity`;
- `evidence_tier`;
- `limitations`;
- `decision_id` quando aplicável;
- atualização de steps pelo mesmo ID;
- erro de retrieval sem chamada ao LLM;
- erro de LLM sem decision draft;
- `out_of_scope` sem chamada ao LLM;
- payload legado;
- parser legado do frontend.

### 20.6 Testes frontend

Casos:

- Execution Trace com steps reais;
- ordem dos steps recebidos;
- atualização de status por ID;
- fallback sem steps;
- ausência de timeline mockada;
- ausência de sequence fixa no transformer;
- estado de tool failure;
- estado de out of scope;
- drawer de audit metadata;
- fontes e excerpts;
- evidence tier;
- similarity rotulada como evidence similarity;
- similarity não rotulada como confiança;
- confirmação de draft;
- rejeição de draft;
- falha de PATCH sem mudança otimista incorreta;
- resposta legada sem trace sintética.

### 20.7 Fluxos end-to-end mínimos

#### `component_decision`

Entrada exemplo:

```text
Qual componente devo usar para confirmar uma ação destrutiva?
```

Expectativas:

- workflow `component_decision`;
- tools `search_component` e `search_pattern`;
- retrieval com fixture;
- evidence tier calculado;
- LLM fake recebe contexto estruturado;
- response completed;
- decision draft criado;
- memory atualizada;
- evento final contém decision ID.

#### `design_audit`

Entrada exemplo:

```text
Valide este botão de exclusão com cor hardcoded e sem estado de foco.
```

Expectativas:

- workflow `design_audit`;
- tool `validate_against_design_system`;
- componentes, tokens e guidelines relevantes;
- possible violations com source refs;
- draft criado somente com evidência suficiente;
- steps reais no evento final.

#### `out_of_scope`

Entrada exemplo:

```text
Qual é a previsão do tempo?
```

Expectativas:

- workflow `out_of_scope`;
- zero tools;
- zero chamadas ao LLM;
- step `out_of_scope_blocked`;
- status blocked;
- resposta determinística.

#### Confirmação de draft

Expectativas:

- `PATCH` explícito;
- `draft -> confirmed`;
- `confirmed_by_user=true`;
- UI atualizada pelo registro retornado.

#### Erro de retrieval

Expectativas:

- `tool_execution_failed`;
- zero chamadas ao LLM;
- zero decision drafts;
- status failed ou limited;
- fonte não inventada.

#### Erro de LLM

Expectativas:

- tools concluídas preservadas;
- erro seguro;
- zero decision drafts;
- zero memory updates de sucesso;
- status failed.

## 21. Comandos de teste

Scripts implementados em `package.json`:

```json
{
  "scripts": {
    "test:agent": "python3 -W error::ResourceWarning -m unittest discover -s tests/agent -p 'test_*.py' -v",
    "test:agent-smoke": "python3 -W error::ResourceWarning -m unittest tests.agent.test_sse.AgentSSEContractTests.test_primary_workflow_chat_smoke -v",
    "test:agent-contracts": "python3 scripts/test_agent_layer_contracts.py",
    "test:agent-ui": "vitest run",
    "test:agent-all": "npm run test:agent && npm run test:agent-contracts && npm run test:agent-ui"
  }
}
```

Comandos:

```bash
npm run test:agent
npm run test:agent-smoke
npm run test:agent-contracts
npm run test:agent-ui
npm run test:agent-all
npm run build
npm run test:rag
npm run test:beatrice
```

Testes Python definem:

```text
AETHERIS_SKIP_RAG_STARTUP=1
AGENT_DB_PATH=<temporary path>
```

Vitest, jsdom e React Testing Library foram adicionados como dev dependencies
para os testes de comportamento da UI.

## 22. Teste manual

Iniciar:

```bash
npm run start
npm run dev
```

Executar uma pergunta por workflow principal:

1. `component_decision`
2. `pattern_guidance`
3. `token_lookup`
4. `design_audit`
5. `compare_options`
6. `documentation_help`
7. `out_of_scope`

Verificar em cada resposta:

- workflow;
- tools used;
- fontes e excertos;
- evidence similarity;
- evidence tier;
- Execution Trace real;
- limitations;
- request ID;
- decision ID quando aplicável.

Depois:

- confirmar um draft;
- rejeitar outro draft;
- recarregar a página;
- consultar os registros por endpoint;
- verificar memória compartilhada entre duas conversations do projeto
  `default`.

## 23. Gates finais

A implementação só é considerada concluída quando:

```bash
npm run build
npm run test:rag
npm run test:beatrice
npm run test:agent-all
```

Também são obrigatórios:

- teste manual de um prompt por workflow;
- teste manual de confirmação e rejeição;
- inspeção do SQLite sem edição manual;
- busca textual confirmando ausência do rótulo legado da timeline cognitiva na
  experiência agentic;
- busca textual confirmando ausência de timeline fixa;
- verificação de que similarity não aparece como answer confidence.

## 24. Riscos restantes

### 24.1 Classificação por regras

Consultas ambíguas podem cair no workflow errado. Mitigação:

- regras com prioridade explícita;
- testes bilíngues;
- rationale do planner no audit metadata;
- `out_of_scope` conservador;
- nenhuma seleção por LLM.

### 24.2 Qualidade do corpus

Tools não podem produzir boa orientação quando o corpus é incompleto.
Mitigação:

- tier `insufficient` ou `weak`;
- limitations explícitas;
- nenhum draft com evidência insuficiente;
- fontes reais e inspecionáveis.

### 24.3 Extração de possible violations

A validação determinística cobre apenas regras representadas no corpus e
sinais observáveis. Mitigação:

- usar a expressão possible violation;
- manter source reference;
- não afirmar conformidade completa;
- ampliar regras em fases futuras.

### 24.4 SQLite local

SQLite não fornece distribuição, replicação ou isolamento multi-tenant.
Mitigação:

- escopo single-instance;
- WAL;
- transações curtas;
- timeout;
- caminho configurável para testes e deploy.

### 24.5 Evento final perdido

Uma desconexão após os deltas pode impedir que o cliente receba decision ID ou
steps finais, mesmo que o backend finalize a execução. Mitigação:

- persistir agent run e decision antes do evento final;
- usar request ID para consulta futura em fase posterior;
- não prometer retomada de stream na v1.

### 24.6 Compatibilidade com mudanças locais

O worktree atual contém muitas alterações não commitadas. Mitigação:

- mudanças aditivas;
- leitura cuidadosa antes de editar arquivos existentes;
- nenhuma reversão de trabalho local;
- commits com escopo explícito.

## 25. Fora do escopo

- Figma;
- GitHub;
- Jira;
- Storybook;
- integrações externas;
- multi-tenancy;
- ACL enterprise;
- autenticação e autorização por organização;
- ações destrutivas;
- edição automática de código ou design;
- loops autônomos de replanejamento;
- execução paralela de tools;
- retries autônomos complexos;
- resume de stream;
- memória organizacional enterprise;
- vector memory de conversas;
- aprendizado automático com feedback;
- edição ou exclusão de decisions;
- assinatura criptográfica ou log imutável;
- chain-of-thought;
- timeline fixa ou mockada;
- confiança probabilística da resposta;
- gestão visual de múltiplos projetos.

## 26. O que ainda não torna a Beatrice um agente enterprise

A v1 terá planejamento, tools, policies, execução controlada, memória local e
registro auditável. Ainda faltam:

- identidade e autorização por usuário;
- isolamento por tenant;
- permissionamento granular por recurso;
- durable workflow engine;
- filas e workers distribuídos;
- idempotência entre instâncias;
- observabilidade centralizada;
- métricas operacionais e alertas;
- human escalation;
- approval workflow multiusuário;
- versionamento formal de tool contracts;
- secrets management enterprise;
- disaster recovery;
- retenção e governança de dados;
- integrations marketplace;
- avaliação contínua de segurança.

## 27. Critérios de aceitação

1. O planner seleciona workflow e tools sem LLM.
2. `out_of_scope` bloqueia antes das tools e do LLM.
3. Todas as tools possuem schemas, status e política de confirmação.
4. Inputs e outputs são validados.
5. Resultados contêm somente fontes reais.
6. O executor chama o composer somente depois das tools.
7. Evidence tier é determinístico.
8. Similarity é rotulada como evidence similarity.
9. Decisions são persistidas como draft.
10. Confirmar e rejeitar exige ação explícita.
11. Session memory e project memory são persistidas.
12. Agent runs preservam plano, tools, steps, fontes e limitações.
13. `audit_metadata.steps` é a única fonte da Execution Trace.
14. Steps ausentes usam o fallback aprovado.
15. Não existe timeline fixa ou mockada.
16. Não existe chain-of-thought.
17. O drawer apresenta audit metadata sem competir com a resposta.
18. Todas as suítes e gates finais passam.

## 28. Registro de implementação

Implementação concluída em 7 de junho de 2026.

### 28.1 Entregas

- pacote `agent/` com planner, policies, registry, executor, tools e runtime;
- SQLite local para `decisions`, `session_memory`, `project_memory` e
  `agent_runs`;
- endpoints para criar, consultar, confirmar e rejeitar decisions;
- SSE aditivo com metadata inicial, deltas e audit metadata final;
- Execution Trace baseada somente em `audit_metadata.steps`;
- drawer de audit metadata com tools, fontes, limitações e decisão;
- remoção da timeline fixa e dos transformers que a sintetizavam;
- testes unitários, integração, tools, SSE, frontend e contrato estático.

### 28.2 Resultado dos gates

| Gate | Resultado |
|---|---|
| `npm run build` | aprovado |
| `npm run test:rag` | 11 de 11 casos aprovados com BGE-M3 |
| `npm run test:beatrice` | aprovado |
| `npm run test:perspectives` | aprovado |
| `npm run test:reasoning-ui` | aprovado |
| `npm run test:agent-all` | 38 testes Python e 8 testes frontend aprovados |
| `npm run test:agent-smoke` | 7 workflows aprovados no endpoint de chat |
| `npm audit --omit=dev` | zero vulnerabilidades de produção |

### 28.3 Limite do smoke

O ambiente de implementação não possuía `GROQ_API_KEY`. Por isso, o smoke dos
sete workflows validou o endpoint, o planner, as policies, as tools, o SSE e o
audit metadata com um composer fixture. A composição externa real permanece
como verificação operacional de deploy.

## 29. Validação objetiva para o TCC

Os exemplos desta seção foram capturados em 7 de junho de 2026 pelo comando:

```bash
npm run validate:agent-examples
```

O validador usa uma base SQLite temporária, o retrieval fixture versionado da
suíte agentic e um composer determinístico. Ele não realiza chamada externa ao
Groq. IDs e timestamps abaixo pertencem a uma execução real do runtime.

### 29.1 Exemplo completo de `audit_metadata`

Fluxo: `component_decision`.

```json
{
  "request_id": "req_ae4db5b2a50349ef",
  "intent": "component_guidance",
  "workflow": "component_decision",
  "tools_used": [
    {
      "name": "search_component",
      "permission": "read_only",
      "status": "completed",
      "details": null
    },
    {
      "name": "search_pattern",
      "permission": "read_only",
      "status": "completed",
      "details": null
    }
  ],
  "steps": [
    {
      "id": "request_received",
      "label": "Request received",
      "status": "completed",
      "details": null,
      "timestamp": "2026-06-07T01:09:12.516+00:00"
    },
    {
      "id": "intent_detected",
      "label": "Intent detected",
      "status": "completed",
      "details": "component_guidance",
      "timestamp": "2026-06-07T01:09:12.516+00:00"
    },
    {
      "id": "workflow_selected",
      "label": "Workflow selected",
      "status": "completed",
      "details": "component_decision",
      "timestamp": "2026-06-07T01:09:12.516+00:00"
    },
    {
      "id": "tools_selected",
      "label": "Tools selected",
      "status": "completed",
      "details": "search_component, search_pattern",
      "timestamp": "2026-06-07T01:09:12.516+00:00"
    },
    {
      "id": "policy_checked",
      "label": "Policy checked",
      "status": "completed",
      "details": "Tool permissions and scope approved.",
      "timestamp": "2026-06-07T01:09:12.517+00:00"
    },
    {
      "id": "retrieval_executed",
      "label": "Retrieval executed",
      "status": "completed",
      "details": "2 evidence item(s) recovered.",
      "timestamp": "2026-06-07T01:09:12.517+00:00"
    },
    {
      "id": "sources_selected",
      "label": "Sources selected",
      "status": "completed",
      "details": "2 source excerpt(s) selected.",
      "timestamp": "2026-06-07T01:09:12.517+00:00"
    },
    {
      "id": "evidence_scored",
      "label": "Evidence scored",
      "status": "completed",
      "details": "strong; top similarity 0.820",
      "timestamp": "2026-06-07T01:09:12.517+00:00"
    },
    {
      "id": "tool_results_built",
      "label": "Tool results built",
      "status": "completed",
      "details": "2 tool result(s) structured.",
      "timestamp": "2026-06-07T01:09:12.517+00:00"
    },
    {
      "id": "llm_composition_started",
      "label": "LLM composition started",
      "status": "completed",
      "details": "Structured composition completed.",
      "timestamp": "2026-06-07T01:09:12.518+00:00"
    },
    {
      "id": "response_completed",
      "label": "Response completed",
      "status": "completed",
      "details": null,
      "timestamp": "2026-06-07T01:09:12.518+00:00"
    },
    {
      "id": "decision_draft_created",
      "label": "Decision draft created",
      "status": "completed",
      "details": "dec_a71a0a5cee324757",
      "timestamp": "2026-06-07T01:09:12.519+00:00"
    },
    {
      "id": "memory_updated",
      "label": "Memory updated",
      "status": "completed",
      "details": "Session session_tcc_validation; project project_tcc_validation.",
      "timestamp": "2026-06-07T01:09:12.521+00:00"
    }
  ],
  "sources": [
    {
      "title": "Dialog",
      "source": "ComponentsPage",
      "page_type": "component",
      "excerpt": "Dialog | Use for blocking decisions that require explicit confirmation. | Avoid for passive feedback.",
      "similarity": 0.82,
      "retrieval_weight": 1.1,
      "weighted_score": 0.902
    },
    {
      "title": "Destructive action confirmation",
      "source": "PatternsPage",
      "page_type": "pattern",
      "excerpt": "Pattern | Prefer explicit consequence text and a clear cancel action. | Risk: ambiguous destructive labels.",
      "similarity": 0.77,
      "retrieval_weight": 1.0,
      "weighted_score": 0.77
    }
  ],
  "evidence_similarity": 0.82,
  "evidence_tier": "strong",
  "limitations": [],
  "decision_id": "dec_a71a0a5cee324757",
  "decision_status": "draft",
  "execution_status": "completed"
}
```

### 29.2 Exemplo de `agent_run` persistido

Leitura realizada por `AgentStore.get_run()` na base SQLite temporária:

```json
{
  "request_id": "req_ae4db5b2a50349ef",
  "session_id": "session_tcc_validation",
  "project_id": "project_tcc_validation",
  "user_query": "Qual componente usar para confirmação?",
  "profile": "designer",
  "intent": "component_guidance",
  "workflow": "component_decision",
  "plan": {
    "intent": "component_guidance",
    "workflow": "component_decision",
    "tools": ["search_component", "search_pattern"],
    "steps": [
      "detect_intent",
      "select_workflow",
      "select_tools",
      "check_policies",
      "execute_tools",
      "score_evidence",
      "build_tool_results",
      "compose_response"
    ],
    "needs_confirmation": false,
    "creates_decision_draft": true
  },
  "tools_used": [
    {
      "name": "search_component",
      "permission": "read_only",
      "status": "completed"
    },
    {
      "name": "search_pattern",
      "permission": "read_only",
      "status": "completed"
    }
  ],
  "top_similarity": 0.82,
  "evidence_tier": "strong",
  "limitations": [],
  "decision_id": "dec_a71a0a5cee324757",
  "model": "composer-fixture",
  "status": "completed",
  "created_at": "2026-06-07T01:09:12+00:00",
  "completed_at": "2026-06-07T01:09:12+00:00",
  "duration_ms": 0
}
```

O registro persistido também contém os arrays completos `steps` e `sources`
mostrados no `audit_metadata`. O comando de validação imprime a serialização
integral retornada pelo store.

### 29.3 Decision criada como draft e confirmada

Estado inicial persistido:

```json
{
  "decision_id": "dec_a71a0a5cee324757",
  "request_id": "req_ae4db5b2a50349ef",
  "workflow": "component_decision",
  "recommendation": "Use Dialog para uma decisão bloqueante que exige confirmação explícita.",
  "top_similarity": 0.82,
  "evidence_tier": "strong",
  "status": "draft",
  "created_by": "beatrice",
  "confirmed_by_user": false
}
```

Estado depois de `update_decision_status(decision_id, "confirmed")`:

```json
{
  "decision_id": "dec_a71a0a5cee324757",
  "status": "confirmed",
  "created_by": "beatrice",
  "confirmed_by_user": true
}
```

### 29.4 `out_of_scope` bloqueado antes do LLM

Entrada:

```text
Qual é a previsão do tempo?
```

Resultado:

```json
{
  "workflow": "out_of_scope",
  "tools_used": [],
  "steps": [
    {
      "id": "policy_checked",
      "status": "completed",
      "details": "Request blocked by scope policy."
    },
    {
      "id": "out_of_scope_blocked",
      "status": "blocked"
    }
  ],
  "sources": [],
  "evidence_tier": "insufficient",
  "limitations": [
    "The request is outside Beatrice's design-system scope."
  ],
  "execution_status": "blocked",
  "should_compose": false,
  "llm_composition_step_present": false
}
```

Não existe chamada ao composer nesse caminho.

### 29.5 Execution Trace renderizada

A UI recebeu diretamente o array `audit_metadata.steps` do exemplo
`component_decision` e o projetou nesta ordem:

```text
Request received                 Concluído
Intent detected                  Concluído  component_guidance
Workflow selected                Concluído  component_decision
Tools selected                   Concluído  search_component, search_pattern
Policy checked                   Concluído  Tool permissions and scope approved.
Retrieval executed               Concluído  2 evidence item(s) recovered.
Sources selected                 Concluído  2 source excerpt(s) selected.
Evidence scored                  Concluído  strong; top similarity 0.820
Tool results built               Concluído  2 tool result(s) structured.
LLM composition started          Concluído  Structured composition completed.
Response completed               Concluído
Decision draft created           Concluído  dec_a71a0a5cee324757
Memory updated                   Concluído  session e projeto atualizados
```

O frontend não acrescentou steps, não completou lacunas e não inferiu eventos.

### 29.6 Erro registrado no `audit_metadata`

Falha simulada pelo retriever fixture:

```json
{
  "workflow": "component_decision",
  "tools_used": [],
  "steps": [
    {
      "id": "tool_execution_failed",
      "label": "Tool execution failed",
      "status": "failed",
      "details": "search_component: retrieval unavailable"
    }
  ],
  "sources": [],
  "evidence_similarity": 0.0,
  "evidence_tier": "insufficient",
  "limitations": [
    "Tool execution failed for search_component."
  ],
  "decision_id": null,
  "decision_status": null,
  "execution_status": "failed"
}
```

Nenhuma recommendation, source ou decision foi inventada.

### 29.7 Limite operacional do LLM

A execução validou:

```json
{
  "selected_tools_before_composition": [
    "search_component",
    "search_pattern"
  ],
  "tool_results_built_before_composition": true,
  "structured_context_contains_tool_results": true,
  "structured_context_contains_executable_registry": false
}
```

O LLM:

1. não seleciona tools;
2. não recebe o registry executável;
3. não executa ações;
4. recebe apenas resultados estruturados e memórias permitidas;
5. compõe a resposta final depois das tools;
6. não fornece ou expõe chain-of-thought.

### 29.8 Limitações restantes

- a classificação por regras pode errar consultas ambíguas;
- a qualidade depende da cobertura e atualização do corpus;
- o SQLite é local e adequado ao escopo single-instance desta fase;
- o evento SSE final ainda não possui retomada automática;
- a composição externa real depende de `GROQ_API_KEY`;
- não há multi-tenancy;
- não há ACL enterprise;
- não há integrações externas;
- não há loops autônomos;
- não há agent builder nesta fase.

## 30. Encerramento da v1

A Agent Layer v1 está fechada para o TCC como camada agentic governada inicial.
Ela adiciona planejamento controlado, tools governadas, persistência local e
trilha operacional auditável. Ela não constitui um agente autônomo enterprise.
