# Beatrice Agentic Intelligence Report

> Relatório da arquitetura agentic-lite da Beatrice e das correções de evidência governada.
> Última atualização: 2026-06-11 (execução agendada "refinamentos").

## Resumo

Esta rodada auditou todo o pipeline de inteligência da Beatrice contra o comportamento
esperado de uma agentic design system advisor e aplicou correções pontuais. O achado
central: a maior parte da arquitetura agentic-lite já existia no pacote `agent/` e o
bloqueio indevido por "evidência insuficiente" para a pergunta crítica sobre Button já
não se reproduz no código atual com retrieval vazio nem com retrieval fraco. As
melhorias desta rodada foram: vocabulário explícito de base de evidência (direta,
parcial, inferida, ausente) exposto ao composer, regra dedicada de comparação Checkbox
vs Radio com critério real de decisão, comparação genérica fundamentada no catálogo em
vez de frase vaga, contrato de exemplos de código para a persona Developer, memória de
sessão registrando o componente recomendado mesmo sem evidência de retrieval, correção
da coleta de testes Python e um conjunto de testes de regressão para o cenário crítico.

## Problema corrigido

A pergunta "Como eu implemento o componente Button usando os intents primary,
secondary, positive e negative sem quebrar acessibilidade?" era reportada como
bloqueada com evidência insuficiente. As causas estruturais desse tipo de bloqueio:

1. O tier de evidência era derivado apenas da similaridade do retrieval semântico.
   Perguntas longas com vocabulário técnico misto (intents, acessibilidade) produzem
   similaridade baixa mesmo quando o componente é canônico.
2. O fluxo tratava similaridade baixa como ausência de evidência, sem consultar o
   catálogo canônico do componente nomeado.

O código atual já resolve isso em três camadas (verificado por simulação direta do
runtime e agora travado por testes de regressão):

- `agent/evidence.py::build_component_selection` injeta evidência do catálogo
  canônico no início da seleção quando há exact entity match (similaridade 1.0,
  tier strong, source canonical_catalog).
- `agent/runtime.py::_catalog_selection_for_named` recupera componentes nomeados do
  catálogo quando o retrieval volta vazio ou insuficiente, mantendo a resposta
  composável com limitação declarada.
- `agent/runtime.py::_recover_from_catalog` cobre falha técnica de retrieval
  (Caso C) usando o catálogo como fonte.

O bloqueio agora só ocorre quando: o componente não existe no catálogo (Caso A), há
falha técnica sem fallback possível (Caso C), ou a pergunta está fora do escopo do
design system (Caso B).

## Fluxo agentic-lite

Pipeline interno por requisição (`AgentRuntime.prepare` em `agent/runtime.py`):

1. Intenção: `agent/understanding.py::analyze_query` classifica `user_intent` e
   `answer_strategy` (PT-BR, PT-PT e EN, com normalização de acentos e typos).
2. Entidades: componentes, padrões, comparações, idioma e exact entity matches via
   `agent/entity_resolution.py` e `agent/entity_alias_registry.py`.
3. Estratégia: `agent/planner.py::build_agent_plan` escolhe o workflow
   (component_decision, comparison_rule, decision_analysis, design_audit,
   entity_lookup, token_lookup, navegação, out_of_scope etc).
4. Ferramentas internas: o planner seleciona tools do `ToolRegistry`.
5. Evidência: execução das tools, scoring por similaridade, seleção de componente
   com política determinística e injeção de catálogo.
6. Avaliação de força: tiers strong, partial, weak, insufficient, mapeados para a
   base de evidência direct, partial, inferred, absent.
7. Contexto estruturado: `structured_context` entrega ao LLM o componente
   recomendado, regras do/dont selecionadas, limitações, confiança e contratos de
   resposta por workflow.
8. Composição: Groq via SSE, com buffer para workflows validados.
9. Validação: `agent/response_validation.py`, `agent/evidence_integrity.py`,
   `agent/ui_leak_guard.py` e validadores específicos selam a resposta.
10. Entrega: fontes, confiança textual, limitações e ações de navegação.

A Beatrice não edita arquivos, não executa comandos e não acessa a internet. As
ferramentas só consultam dados internos.

## Tool registry

`agent/registry.py::ToolRegistry` com tools em `agent/tools/`:

- search_component (retrieval_tools.py)
- search_design_decision (retrieval_tools.py)
- search_explainability (retrieval_tools.py)
- search_pattern (retrieval_tools.py)
- search_token (retrieval_tools.py)
- compare_design_options (comparison_tool.py)
- validate_against_design_system (validation_tool.py)
- create_decision_record (decision_tool.py, escrita apenas no SQLite interno de decisões)

Todas recebem um retriever injetado pelo servidor; nenhuma tem acesso a arquivos,
comandos ou rede externa.

## Intents

Reconhecidas por `analyze_query` e roteadas por `prompts/intent_router.py`:
component_recommendation, component_comparison, pattern_guidance, token_lookup,
accessibility_guidance, design_decision, when_not_to_use, xai_explanation,
entity_lookup, direct_entity_guidance, unsupported_entity_lookup, catalog,
navigation_query, semantic_navigation_query, system_health, governance_analysis,
simulation, multi_agent_reasoning, greeting, small_talk, help_request,
language_followup, agent_identity, general_design_system, out_of_scope.

## Entidades

Extraídas em `QueryUnderstanding.entities`: componentes citados (com aliases e
nomes legados), componentes comparados, padrões, idioma da pergunta, contexto e
objetivo, além de exact entity matches com o id canônico do catálogo. Estados e
intents citados são resolvidos contra os campos `states` e `intents` do componente
recomendado no contexto estruturado.

## Estratégias de resposta

Por workflow e por contrato: recomendação de componente (seções obrigatórias
Componente recomendado, Motivo, Limites, Campos ausentes, Evidência), comparação
(regras determinísticas com critério de decisão), implementação (contrato Developer
com snippet conceitual), pattern guidance, token lookup, accessibility guidance,
design decision (decision_analysis com trade-off e conselho multiagente), XAI
explanation, design_audit (modo auditor) e out_of_scope (bloqueio educado).

## Catálogo canônico

`component_metadata.py` carrega 25 componentes com about, intents, states,
variants, do, dont, when_to_use, when_not_to_use, accessibility, edge_cases,
examples, trade_offs e provenance. Para perguntas sobre componentes existentes o
catálogo é fonte primária: exact match injeta evidência canônica antes do RAG
genérico; retrieval vazio ou fraco cai no fallback de catálogo com limitação
declarada, nunca em bloqueio.

## Exemplos de código para Developer

Regras adicionadas em `prompts/perspectives/developer.md` (seção "Code examples
grounded in the canonical catalog") e `prompts/system/responseRules.md`:

- snippet construído apenas com intents, states e regras documentadas;
- prop, intent ou state fora do catálogo vira limitação declarada, nunca invenção;
- import path não documentado é omitido, com o aviso: "Exemplo conceitual baseado
  no catálogo do componente. Ajuste o import conforme a estrutura real do projeto.";
- evidência direta: confiança alta ou média; parcial: snippet seguro com limitação;
  ausente: sem snippet.

O catálogo atual não possui campo codeSnippet; todos os exemplos são conceituais e
derivados dos campos canônicos, com o aviso obrigatório.

## Comparador

`agent/decision_rules.py::resolve_comparison_rule` com regras determinísticas:
button_vs_link, checkbox_vs_radio (novo), radio_vs_select, checkbox_vs_switch e
generic_component_comparison. O checkbox_vs_radio decide pela cardinalidade da
escolha (única recomenda Radio Button, múltipla recomenda Checkbox) e inclui erro
comum e acessibilidade. A comparação genérica agora monta o critério a partir do
primeiro when_to_use de cada componente do catálogo, com confiança média, em vez
de uma frase genérica. Modal vs Drawer permanece sem regra determinística porque
Drawer não está no catálogo; o fluxo segue para comparação com evidência.

## Modo auditor

Workflow design_audit usa a tool validate_against_design_system e o contrato de
auditoria: problema identificado, risco, recomendação, alternativa, acessibilidade
e fonte. Coberto por `tests/agent/test_runtime.py::test_design_audit_uses_validation_tool`.

## Evidência e confiança

- Tiers de retrieval: strong (>= 0.75), partial (>= 0.50), weak (< 0.50),
  insufficient (sem resultados).
- Base de evidência (novo, `agent/evidence.py::evidence_basis`): direct, partial,
  inferred, absent, com orientação de composição por nível, exposta no contexto
  estruturado como `evidence_basis`.
- Confiança: labels textuais alta, média, baixa, não determinada, com justificativa.
  Percentual proibido salvo valor real medido pelo runtime. Similaridade de
  evidência é relevância de retrieval, nunca confiança da resposta.

## Validação anti-alucinação

Antes da entrega: `validate_component_response` (componente recomendado não pode
ser trocado nem campos nulos preenchidos com conhecimento genérico),
`EvidenceIntegrityValidator` (claims sem evidência geram fallback determinístico),
`ui_leak_guard` (nenhum vazamento de raciocínio interno), validadores de
comparação, decisão e raciocínio estratégico. Falha de validação ajusta ou sela a
resposta; bloqueio total só com ausência real de evidência.

## Memória de sessão

`agent/store.py`: session_memory e project_memory em SQLite, por sessão, sem
mistura entre sessões. Guarda últimas intents, tópicos recorrentes e decisões
recentes, com janela limitada. Melhoria desta rodada: o componente recomendado
entra nos tópicos da sessão mesmo quando a recomendação veio do catálogo sem
evidência de retrieval, permitindo resolver referências como "e como testo isso?".
A resolução da anáfora é feita pelo composer com base na memória exposta no
contexto estruturado; não há resolução determinística de pronome. Memória nunca é
usada como evidência.

## Testes

- Novo: `tests/agent/test_critical_intelligence.py` (10 testes) cobrindo: pergunta
  crítica do Button nunca bloqueada (retrieval vazio e fraco), Button negative com
  loading, comparação Checkbox vs Radio com critério, comparação genérica com
  critério de catálogo, evidence_basis no contexto estruturado, fora de escopo
  continua bloqueado, componente inexistente não gera recomendação inventada.
- Manuais: `BEATRICE_INTELLIGENCE_TESTS.md` (24 perguntas com critérios).
- Rubrica: `BEATRICE_RESPONSE_QUALITY_RUBRIC.md`.

## Limitações

- O catálogo não tem campo codeSnippet; exemplos de código são sempre conceituais.
- A resolução de referência anafórica depende do composer, sem fallback
  determinístico de "último componente".
- Tier partial usa similaridade fixa 0.65 para injeção de catálogo; não há
  re-rank semântico do catálogo.
- Não foi possível validar contra o Groq real nesta execução (sem chave em
  ambiente de teste); a validação usou o runtime determinístico e os testes SSE
  com servidor em modo AETHERIS_SKIP_RAG_STARTUP.
- `npm run build` validado nesta rodada; resultado registrado na seção de
  validação técnica do resumo de entrega.

## Pendências

- Avaliar adicionar codeSnippet canônico por componente no catálogo.
- Resolver anáfora de follow-up de forma determinística usando session_memory.
- Rodar a suíte manual completa de 24 perguntas contra o backend real com Groq e
  registrar notas na rubrica.
- Considerar expor evidence_basis também no payload SSE para a UI de XAI.
