# Component About Card Refinement Report

Data: 10 de junho de 2026

## Resumo

O card simples Sobre este componente foi substituído por um painel reutilizável com texto editorial, três atributos específicos e uma lista de usos comuns. A mesma estrutura é renderizada para os 25 componentes do catálogo canônico.

O novo painel permanece abaixo do Preview Interativo, usa altura automática e distribui o conteúdo em camadas curtas. Isso elimina a sensação de área incompleta sem aumentar o peso visual da página.

## Problema

O card anterior exibia somente um parágrafo montado pela concatenação de `description`, `logic` e `structure`. Em componentes com textos curtos, especialmente Button, o bloco tinha pouca densidade informacional e criava uma diferença visual acentuada em relação à coluna lateral.

Também não existiam campos próprios para atributos ou usos comuns. O frontend precisava inferir o conteúdo, e o RAG não possuía essas informações em formato estruturado.

## Nova estrutura

`ComponentAboutCard` implementa:

- ícone informativo decorativo;
- heading Sobre este componente;
- texto editorial vindo de `about`;
- divisor sutil;
- três atributos com ícone, título e descrição;
- seção Usos comuns;
- quatro a cinco chips informativos por componente.

Os chips são itens de lista sem comportamento interativo. O painel não usa altura mínima, `h-full`, glow intenso ou controles decorativos.

## Fonte de dados

`data/component-metadata.json` continua sendo a fonte canônica.

O contrato compartilhado recebeu:

- `about: LocalizedText`;
- `about_features: ComponentAboutFeature[]`;
- `common_uses: LocalizedText[]`.

Cada `ComponentAboutFeature` possui `icon`, `title` e `description`. Os validadores TypeScript e Python exigem de três a quatro atributos e de quatro a seis usos comuns.

O adaptador de apresentação expõe os campos localizados como `aboutFeatures` e `commonUses` para a interface React.

## Componentes atualizados

Button, Toggle/Switch, Checkbox, Radio Button, Selectable Chip / Badge, Input / Text Input, Text Area, Select/Dropdown, Date Picker, Form Field, Link, Tabs, Card, Modal/Dialog, Table/Data Table, Alert, Toast/Notification, Skeleton Loader, Explanation Bubble / Tooltip, Confidence Badge, Command Palette / Barra de Comandos, Source Attribution, Audit Panel, Typography e Icon.

Todos possuem texto editorial próprio, três atributos específicos e usos comuns coerentes com seu papel.

## Integração com Beatrice/RAG

`component_metadata.py` inclui os novos campos no registro canônico e em `component_document_text`. Com isso, `ComponentEvidence` recebe `about`, `about_features` e `common_uses` no metadata completo resolvido por `component_id`.

`rag/extract_docs.py` inclui os campos estruturados em cada chunk de componente. Os arquivos `rag/aetheris-docs-dump.json` e `rag/aetheris-docs-dump.md` foram regenerados.

O código de retrieval, a seleção de componentes, os prompts, os endpoints e os contratos da API não foram alterados.

## Responsividade

- Desktop: três atributos na mesma linha.
- Tablet: dois atributos na primeira linha e o terceiro ocupando a largura disponível.
- Mobile: atributos empilhados em uma coluna.
- Chips usam `flex-wrap` e não geram overflow horizontal.
- O painel mantém altura natural em todas as larguras.

Foram validados 1440, 768 e 390 px.

## Acessibilidade

- O título do painel usa `h3`.
- Os títulos dos atributos e de Usos comuns usam `h4`.
- Ícones são decorativos e possuem `aria-hidden`.
- Atributos e usos comuns são listas semânticas.
- Chips são itens informativos, não buttons ou links.
- O texto essencial usa tamanho e line-height compatíveis com a leitura da página.
- Contraste, ordem de leitura e reflow foram preservados.

## Arquivos alterados

- `data/component-metadata.json`
- `component_metadata.py`
- `src/components/ComponentAboutCard.tsx`
- `src/components/ComponentsPage.tsx`
- `src/components/componentMetadata.ts`
- `src/components/componentPresentation.ts`
- `rag/extract_docs.py`
- `rag/aetheris-docs-dump.json`
- `rag/aetheris-docs-dump.md`
- `src/components/componentMetadata.test.ts`
- `src/components/componentDocumentation.test.ts`
- `tests/test_component_metadata.py`
- `tests/agent/test_component_intelligence.py`
- `scripts/test_component_workbench.py`
- `scripts/test_component_about_card.py`
- `scripts/test_button_documentation.py`
- `COMPONENT_ABOUT_CARD_REFINEMENT_REPORT.md`

## Validação técnica

Comandos executados:

```text
npm run build
npm run check:i18n
npm run test:agent-ui
npm run test:agent-contracts
python3 -m unittest tests.test_component_metadata tests.agent.test_component_intelligence -v
python3 rag/extract_docs.py
python3 scripts/test_component_workbench.py
python3 scripts/test_button_documentation.py
python3 scripts/test_component_about_card.py
python3 scripts/test_accessibility_remediation.py
git diff --check
```

Resultados:

- build de produção concluído;
- 13 arquivos e 43 testes Vitest passaram;
- 15 testes Python do catálogo e do ComponentEvidence passaram;
- contratos do Agent Layer alinhados;
- 25 componentes validados no workbench;
- Button validado sem layout exclusivo;
- cinco componentes prioritários validados visualmente;
- auditoria de acessibilidade sem violações críticas ou sérias;
- check de i18n concluído com avisos preexistentes.

## Pendências

- Recriar o índice vetorial persistido no fluxo normal de release para recalcular embeddings com o novo texto. O dump e o bootstrap para coleções vazias já estão atualizados. `npm run index` não foi executado porque reseta a coleção local e carrega o modelo BGE-M3.
