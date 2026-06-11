# Components Structure Refinement Report

Data: 10 de junho de 2026

## Resumo

A seção Componentes passou a usar uma estrutura única para os 25 componentes do catálogo. O template agora reúne header, preview interativo, Sobre este componente, states, intents, acessibilidade, orientação da Beatrice, snippet e painéis com cinco Boas Práticas e cinco itens de Evitar.

Button não possui uma página, schema ou bloco exclusivo. Todos os componentes passam pelo mesmo adaptador, pela mesma validação e pelos mesmos componentes de apresentação.

## Fonte de dados

`data/component-metadata.json` permanece como fonte canônica dos textos semânticos, IDs, status, seções, states, intents, regras, acessibilidade, relações com RAG e proveniência.

`src/components/componentPresentation.ts` adapta esses dados para a UI sem duplicar regras.

`src/components/componentPracticePresentation.ts` acrescenta os títulos curtos e ícones visuais das práticas. As descrições continuam vindo do JSON canônico.

## Schema

O contrato canônico `schema_version: 1.0.0` foi preservado para não quebrar frontend, Python, agente ou RAG.

O modelo renderizável mapeia:

- `id`: `component_id`.
- `category`: seção canônica convertida para a navegação do workbench.
- `icon`: associação visual TypeScript por `component_id`.
- `status`: status canônico.
- `shortDescription`: `description`.
- `about`: composição editorial de `description`, `logic` e `structure`.
- `states` e `intents`: listas canônicas localizadas.
- `accessibility.summary`: resumo canônico.
- `accessibility.items`: orientações canônicas de teclado e ARIA.
- `beatriceGuidance`: `rag_relation`.
- `codeSnippet`: gerador determinístico do workbench.
- `dos` e `donts`: regras canônicas com título e ícone de apresentação.

## Componentes atualizados

Button, Toggle/Switch, Checkbox, Radio Button, Selectable Chip / Badge, Input / Text Input, Text Area, Select/Dropdown, Date Picker, Form Field, Link, Tabs, Card, Modal/Dialog, Table/Data Table, Alert, Toast/Notification, Skeleton Loader, Explanation Bubble / Tooltip, Confidence Badge, Command Palette / Barra de Comandos, Source Attribution, Audit Panel, Typography e Icon.

## Sobre este componente

Cada componente recebe um texto específico formado pelos campos semânticos já revisados no catálogo. O bloco substitui a antiga seção Uso e explica função, lógica de uso e estrutura sem criar conteúdo genérico paralelo.

## States e intents

States e intents continuam vindo do JSON canônico e controlam preview e snippet pela mesma configuração. Os controles usam botões nativos, `aria-pressed`, foco visível e alvo mínimo de 44px.

O template possui estado explícito para componentes sem intents, sem inventar variações. Os 25 componentes atuais possuem intents documentados.

## Accessibility

Cada componente possui:

- Resumo específico.
- Orientação específica de teclado.
- Orientação específica de semântica ou ARIA.
- Foco visível e controles com nome acessível no workbench.
- Texto de estado além de cor.
- Alvos de 44px nos controles principais.

Axe Core 4.10.3 não encontrou violações `critical` ou `serious` em `/components`.

## Beatrice / RAG / XAI

As cinco regras de `do` e `dont` foram sincronizadas com `when_to_use` e `when_not_to_use`. O extrator existente continua lendo esses campos sem alteração de código.

O agente continua resolvendo o registro completo por `component_id`, com regras, states, intents, acessibilidade e proveniência. Nenhum endpoint, backend, retrieval, índice vetorial ou contrato SSE foi alterado.

## Code snippets

Os snippets continuam sendo gerados por componente, state e intent em `componentWorkbench.ts`. O editor permanece bidirecional: combinações válidas atualizam preview e controles; snippets inválidos preservam a última configuração válida e exibem erro inline.

O card recebeu indicação TSX, ação de copiar com alvo acessível e contraste mais alto.

## Boas Práticas e Evitar

Cada componente possui exatamente cinco `do` e cinco `dont` específicos no JSON canônico.

Cada item renderizado contém:

- Ícone.
- Título curto localizado.
- Descrição localizada vinda da regra canônica.

Os painéis ficam lado a lado no desktop e empilhados em tablet ou mobile. Button usa o mesmo componente de apresentação que os outros 24 itens.

## Responsividade

Foram verificados 320, 390, 768, 1280 e 1440px.

- Sem overflow horizontal raiz.
- Sidebar reorganizada antes do conteúdo em larguras menores.
- Painel lateral empilhado abaixo do preview quando necessário.
- Boas Práticas e Evitar empilhados no mobile.
- Navegação de seções preserva rolagem horizontal.
- Cards e snippets mantêm largura fluida.

## Acessibilidade da página

- Um único `h1`.
- Hierarquia de `h2` e `h3` preservada.
- Controles de state e intent operáveis por teclado.
- Ícones decorativos ocultos da árvore acessível nas áreas novas.
- Copy button e navegação do catálogo com foco visível.
- Contraste de labels essenciais elevado.
- Reduced motion continua coberto pela regra global do produto.

## Validação

Comandos executados:

```text
npm run build
npm run check:i18n
npm run test:agent-ui
npm run test:agent-contracts
npx vitest run src/components/componentMetadata.test.ts src/components/componentDocumentation.test.ts
python3 -m unittest tests.test_component_metadata -v
python3 scripts/test_component_workbench.py
python3 scripts/test_button_documentation.py
git diff --check
```

Resultados:

- Build concluído.
- 13 arquivos Vitest e 42 testes passaram.
- 5 testes Python de metadata passaram.
- Contratos do Agent Layer alinhados.
- Workbench sincronizado para os 25 componentes.
- Teste específico de Button passou sem tratamento exclusivo.
- Check de i18n concluiu com avisos preexistentes fora do escopo.
- Axe sem violações `critical` ou `serious` em Components.

## Arquivos alterados

- `data/component-metadata.json`
- `src/components/ComponentsPage.tsx`
- `src/components/componentMetadata.ts`
- `src/components/componentPresentation.ts`
- `src/components/componentPracticePresentation.ts`
- `src/components/componentDocumentation.test.ts`
- `scripts/test_component_workbench.py`
- `scripts/test_button_documentation.py`
- `tests/test_component_metadata.py`
- `COMPONENTS_STRUCTURE_REFINEMENT_REPORT.md`

## Pendências

- Realizar leitura manual com VoiceOver e NVDA em uma etapa de QA assistiva.
- Reindexar o corpus apenas no fluxo normal de release, caso seja necessário publicar imediatamente as regras ampliadas no índice vetorial. A fonte canônica e o extrator já estão preparados.

## Confirmações

- Todos os componentes têm exatamente 5 dos.
- Todos os componentes têm exatamente 5 donts.
- Button não recebeu tratamento exclusivo.
- Não alterei backend.
- Não alterei deploy.
- Não fiz push.
- Não abri PR.
- Não fiz deploy.
