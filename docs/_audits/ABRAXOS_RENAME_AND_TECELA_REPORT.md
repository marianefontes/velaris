# Abraxos Rename and Tecelã Report

## Resumo

A identidade visível do oráculo foi atualizada de Beatrice para Abraxos nas
principais superfícies do Velaris, nos textos localizados e na documentação
ativa do produto.

A página de Raciocínio passou a apresentar a narrativa:

* Abraxos fala.
* A Tecelã organiza.
* O Pipeline comprova.

A Tecelã de Evidências foi adicionada como camada de organização cognitiva.
Ela não substitui Abraxos e não substitui o Pipeline.

## Renomeação

Foram atualizados títulos, subtítulos, labels, botões, cards, estados, textos de
apoio, comparações, artefatos gerados e documentação ativa que apresentavam
Beatrice como identidade pública.

As concordâncias em português foram ajustadas para o masculino. Exemplos:

* `Habilidades da Beatrice` passou a `Habilidades do Abraxos`.
* `Cognição da Beatrice` passou a `Cognição do Abraxos`.
* `A Beatrice recomenda` passou a `Abraxos recomenda`.
* `respostas da Beatrice` passou a `respostas do Abraxos`.

As chaves internas de tradução com `beatrice` foram preservadas. Seus valores
visíveis agora apresentam Abraxos.

## Botão Consultar Abraxos

O acesso antes chamado `Chat da Beatrice` agora aparece como
`Consultar Abraxos`.

O CTA recebeu:

* fundo violeta sutilmente mais luminoso;
* borda lilás mais evidente;
* texto e ícone com contraste reforçado;
* brilho interno discreto;
* hover perceptível;
* foco visível;
* estado ativo em `/oracle`;
* versão compacta com nome acessível em mobile.

O botão permanece integrado à linguagem visual do Velaris e não usa glow
exagerado.

## Tecelã de Evidências

A nova aba `Tecelã de Evidências` foi inserida como segunda etapa da navegação
da página de Raciocínio, logo depois de `Visão geral`.

O bloco explica que a Tecelã organiza intenção, entidades, catálogo, fontes e
confiança antes da resposta final. O fluxo possui quatro passos:

1. Interpreta a intenção.
2. Costura evidências.
3. Avalia a força da base.
4. Entrega o fio para Abraxos.

O layout usa quatro colunas no desktop e uma sequência vertical no mobile.

## Diferença entre Abraxos, Tecelã e Pipeline

* Abraxos fala.
* Tecelã organiza.
* Pipeline comprova.

A Tecelã organiza as evidências que sustentam a resposta. O Pipeline descreve
o percurso técnico completo, da pergunta à resposta explicável. A interface
também apresenta a síntese:

`A Tecelã costura a base da resposta. O Pipeline comprova o percurso.`

## Arquivos alterados

### Identidade, navegação e Raciocínio

* `src/components/AppShell.tsx`
* `src/components/AppShell.test.tsx`
* `src/components/AppTopBar.tsx`
* `src/components/OracleHomePage.tsx`
* `src/components/OraclePage.tsx`
* `src/components/ReasoningPage.tsx`
* `src/components/oracle/BeatriceVisualFrame.tsx`
* `src/components/presence/AskBeatriceBar.tsx`
* `src/components/presence/BeatricePresence.tsx`
* `src/components/presence/ConstellationSerpent.tsx`
* `src/components/presence/DragonHero.tsx`
* `src/components/presence/StarTrailTransition.tsx`
* `src/components/presence/stardustEngine.ts`
* `src/components/presence/usePrefersReducedMotion.ts`
* `src/i18n/pages/reasoningPage.ts`
* `src/i18n/translations.ts`
* `src/index.css`

### Textos de produto e superfícies relacionadas

* `src/components/ComponentsPage.tsx`
* `src/components/DesignDecisionsPage.tsx`
* `src/components/DevIntegrationPage.tsx`
* `src/components/EvaluationPage.tsx`
* `src/components/FoundationsPage.tsx`
* `src/components/StudyPage.tsx`
* `src/components/TokensPage.tsx`
* `src/components/comparison/AnswerPanel.tsx`
* `src/components/componentWorkbench.ts`
* `src/i18n/commandMessages.ts`
* `src/i18n/pages/componentSnippets.ts`
* `src/i18n/pages/componentsPreview.ts`
* `src/services/comparisonService.ts`
* `src/types/comparison.ts`
* `src/types/oracle.ts`
* `data/component-metadata.json`

### Textos seguros dentro do módulo técnico existente

* `src/beatrice/components/chat/ChatInput.test.tsx`
* `src/beatrice/components/chat/ChatMessage.tsx`
* `src/beatrice/domain/audit/models.ts`
* `src/beatrice/domain/governance/capabilities.ts`
* `src/beatrice/domain/perspective/lenses.ts`
* `src/beatrice/domain/perspective/localization.ts`
* `src/beatrice/domain/perspective/perspectives.test.ts`
* `src/beatrice/hooks/useBeatriceHistory.ts`
* `src/beatrice/orchestrators/chat.orchestrator.ts`
* `src/beatrice/pages/PerspectivesPage.tsx`
* `src/beatrice/services/artifact.service.ts`

### Busca, documentação e testes

* `src/search/pageEntries.ts`
* `src/search/searchEngine.test.ts`
* `scripts/test_beatrice_capabilities.py`
* `scripts/test_oracle_home_refinement.py`
* `scripts/test_reasoning_capabilities_ui.py`
* `ACCESSIBILITY.md`
* `AGENT.md`
* `ARCHITECTURE.md`
* `CONTEXTO-TCC.md`
* `DECISION_LOG.md`
* `PERSPECTIVES.md`
* `PRODUCT.md`
* `RESPONSE_QUALITY_GUIDE.md`
* `linha-do-tempo.md`
* `docs/beatrice-capability-architecture.md`
* `ABRAXOS_RENAME_AND_TECELA_REPORT.md`

## Ocorrências mantidas

As ocorrências abaixo foram preservadas por compatibilidade:

* diretório `src/beatrice/`;
* classes, tipos, hooks e funções com `Beatrice` no identificador;
* chaves de tradução como `beatriceChat`;
* storage keys `aetheris_beatrice_*`;
* rota legada `/beatrice-chat`, que continua redirecionando para `/oracle`;
* nomes de arquivos de artefato `beatrice-audit-*`;
* asset `/beatrice-dragon.png`;
* conjunto de avaliação `beatrice-core-v1`;
* classe pública do exemplo de SDK `Beatrice`;
* palavra `beatrice` como alias de busca legada.

`CONTEXTO-TCC.md` e `linha-do-tempo.md` mantêm ocorrências históricas com uma
nota explícita sobre a mudança de identidade em 10 de junho de 2026.

Relatórios, planos e especificações antigas mantêm Beatrice quando documentam
o estado anterior do projeto. Os dumps em `rag/` também foram preservados,
pois esta execução não alterou nem reindexou o RAG.

## Acessibilidade

* O CTA possui nome acessível em desktop e mobile.
* O ícone decorativo usa `aria-hidden`.
* O foco do CTA e dos cards permanece visível.
* As abas usam `tablist`, `tab`, `tabpanel`, `aria-selected` e
  `aria-controls`.
* As abas respondem a setas, `Home` e `End`.
* O estado ativo do CTA usa `aria-current="page"`.
* O hook de movimento reduzido tolera ambientes sem `matchMedia`.

## Responsividade

* As cinco abas aparecem em grade no desktop.
* Tablet e mobile usam rolagem horizontal controlada para as abas.
* O fluxo da Tecelã vira sequência vertical em telas pequenas.
* O CTA vira botão compacto no mobile, mantendo o nome acessível.
* Os testes em 1440 px, 900 px e 390 px não detectaram overflow horizontal.

## Validação

Comandos executados:

* `npm run build`
* `npm run check:i18n`
* `npm run test:agent-ui`
* `npm run test:beatrice`
* `npm run test:perspectives`
* `python3 scripts/test_reasoning_capabilities_ui.py`
* `python3 scripts/test_oracle_home_refinement.py`
* busca final com `rg` para Beatrice, beatrice e os títulos antigos

Resultados:

* build de produção aprovado;
* navegação primária aprovada em 9 de 9 rotas;
* verificação i18n aprovada com avisos não bloqueantes;
* suíte Vitest aprovada com 43 testes em 13 arquivos;
* contratos e 7 testes de perspectivas aprovados;
* teste visual de Raciocínio aprovado;
* teste visual da Home aprovado em desktop, tablet e mobile;
* verificação isolada da documentação de capacidades aprovada;
* nenhuma ocorrência dos títulos antigos foi encontrada na interface ativa.

`npm run test:beatrice` ainda falha na normalização legada
`profile="learn"`, que retorna `active_command_mode=None` em vez de
`feedback-review`. A falha ocorre antes da verificação documental e não foi
causada pela renomeação. Corrigi-la exigiria alterar comportamento fora do
escopo desta mudança.

Não existe script `lint` nem script genérico `test` no `package.json`.

## Pendências

* Tratar a migração profunda de identificadores `Beatrice` em uma refatoração
  técnica separada, com plano de compatibilidade para storage, rotas, SDK,
  eventos e contratos.
* Investigar separadamente a normalização legada de `profile="learn"` no teste
  de capacidades.

## Limites preservados

Esta execução:

* não alterou backend;
* não alterou RAG;
* não alterou API;
* não alterou SSE;
* não alterou deploy;
* não alterou variáveis de ambiente;
* não fez push;
* não abriu PR;
* não fez deploy.
