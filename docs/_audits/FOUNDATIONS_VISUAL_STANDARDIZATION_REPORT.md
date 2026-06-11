# Foundations Visual Standardization Report

## Resumo

As quatro abas internas de Fundamentos foram reorganizadas como variações de uma mesma família visual editorial:

- Diretrizes
- Acessibilidade
- Padrões
- Tokens

A solução usa uma estrutura comum de hero, métricas, nota editorial, largura, divisores, espaçamento e ritmo de seção. A personalidade de cada conteúdo foi preservada, mas a troca de aba agora mantém a mesma linguagem de documentação premium, escura e controlada.

A direção aprovada foi a alternativa D, ledger editorial sem imagens.

## Problema encontrado

As abas compartilhavam a rota e a navegação, mas cada conteúdo tinha uma composição própria:

- Diretrizes usava uma imagem de portal como protagonista.
- Acessibilidade usava uma ilustração orbital.
- Padrões usava uma composição arquitetônica.
- Tokens usava um hero abstrato com proporções e métricas próprias.
- Escala de títulos, largura de texto, densidade, divisores e ritmo vertical variavam sem necessidade.
- O markup de hero e métricas era duplicado ou especializado em cada arquivo.
- As tabs tinham comportamento visual de botões, sem o contrato completo de tabs acessíveis.

O risco principal era preservar o conteúdo e os links com `focus` sem introduzir landmarks ou headings duplicados.

## Template criado ou consolidado

Foi criado `src/components/ui/FoundationPrimitives.tsx` com quatro primitivas:

- `FoundationSectionHero`
- `FoundationMetricRow`
- `FoundationSection`
- `FoundationSectionHeader`

`FoundationSectionHero` controla:

- eyebrow e ícone decorativo
- título com destaque lilás
- descrição
- nota editorial lateral
- métricas
- nota complementar das métricas
- largura, grid, divisores e responsividade

`FoundationMetricRow` usa `dl`, `dt` e `dd`, aceita quantidade variável de itens e mantém uma grade equilibrada.

`FoundationSection` e `FoundationSectionHeader` definem o ritmo das áreas abaixo do hero e oferecem uma base reutilizável para futuras abas.

## Abas atualizadas

### Diretrizes

- Removeu o hero baseado em `manifesto-portal.webp`.
- Passou a usar o hero editorial comum.
- Preservou pilares, regras, exemplos e encerramento.
- Normalizou largura, divisores e ritmo das seções.

### Acessibilidade

- Removeu o hero baseado em `accessibility-hero.png`.
- Passou a usar o hero e as métricas comuns.
- Organizou o resumo como ledger semântico.
- Corrigiu a estrutura da lista de definições.
- Preservou contratos, checklist e conteúdo técnico.

### Padrões

- Removeu o hero baseado em `patterns-architecture.webp`.
- Passou a usar o hero comum e uma introdução com `FoundationSectionHeader`.
- Preservou os capítulos e seus campos especializados.
- Elevou contraste e tamanho de labels técnicas.
- Ajustou linguagem em português para “modelos estruturais” e “decisões de equilíbrio”.

### Tokens

- Substituiu o hero específico pelo template compartilhado.
- Preservou as sete métricas atuais e a nota de contagem.
- Padronizou o guia introdutório e o início da taxonomia.
- Elevou contraste e legibilidade de metadados, valores, tabelas e aliases.
- Padronizou o título em português como “Tokens de Design”.

## Ilustrações

A alternativa escolhida não usa imagem lateral.

Os três assets visuais antigos deixaram de participar dos heroes internos. A atmosfera agora é criada por:

- gradientes radiais discretos
- linha de acento lilás
- nota editorial lateral
- contraste entre superfícies
- tipografia e métricas como elementos principais

Isso elimina a diferença de linguagem entre portal, órbita e placas geométricas. O conteúdo não depende de imagem e futuras abas podem aderir ao mesmo sistema sem produzir um novo asset.

## Métricas

As métricas foram consolidadas em `FoundationMetricRow`.

O padrão comum inclui:

- valor em destaque
- label curto com contraste AA verificado pelo Axe
- descrição opcional
- divisores consistentes
- numerais tabulares
- duas colunas em mobile
- expansão controlada para quantidades maiores
- semântica `dl`, `dt` e `dd`

A grade aceita três métricas em Acessibilidade, quatro em outras composições e sete em Tokens sem trocar de linguagem visual.

## Seções internas

O conteúdo abaixo do hero continua especializado, mas passa a compartilhar:

- largura máxima de 1280 px
- padding horizontal comum
- divisores de seção
- espaçamento vertical previsível
- eyebrow, título e descrição com a mesma hierarquia
- superfícies e bordas da mesma família
- labels técnicas com tamanho mínimo mais legível

Diretrizes mantém pilares, Acessibilidade mantém contratos, Padrões mantém capítulos e Tokens mantém ledgers e tabelas. A padronização atua na arquitetura visual, não na homogeneização do conteúdo.

## Responsividade

Foram validados os viewports:

- 320 x 720
- 390 x 844
- 768 x 900
- 1280 x 900
- 1440 x 1000

Ajustes principais:

- hero em uma coluna nos tamanhos menores
- nota lateral convertida em bloco superior com divisor
- métricas reorganizadas em duas colunas
- títulos com escala fluida e quebra segura
- tabs com scroll horizontal e indicação de continuidade
- item ativo trazido para a área visível
- tabelas técnicas mantidas em contêineres próprios de rolagem
- ausência de overflow horizontal na raiz

## Acessibilidade

- O `h1` continua pertencendo ao hero geral da página.
- Heroes internos usam `h2`.
- Existe um único `main` por rota.
- Tabs usam `role="tablist"`, `role="tab"` e `role="tabpanel"`.
- O estado ativo usa `aria-selected`.
- As tabs respondem a setas, Home, End, Enter e Espaço.
- O item ativo permanece visível no scroll horizontal.
- Ícones decorativos usam `aria-hidden`.
- Métricas possuem semântica de lista de definições.
- Labels de Padrões e Tokens tiveram contraste e tamanho elevados.
- `prefers-reduced-motion` é respeitado ao posicionar a tab ativa.
- Axe Core 4.10.3 não encontrou violações critical ou serious nas quatro abas.

## Validação visual

As quatro abas foram comparadas em desktop e mobile no bundle de produção.

Resultado:

- mesma anatomia de hero
- mesma escala de títulos
- mesma área de nota editorial
- mesma linguagem de métricas
- mesmo ritmo entre hero, introdução e conteúdo
- nenhuma aba depende de imagem
- Padrões e Tokens continuam mais densas por natureza, sem parecer páginas de outra família
- mobile preserva leitura, tabs e métricas sem overflow raiz

Screenshots locais foram gerados em `/tmp/aetheris-foundations-final`.

## Validação técnica

Comandos concluídos com sucesso:

- `npx tsc -b --pretty false`, antes de alterações externas posteriores em Reasoning
- `npx vite build`
- `npm run check:i18n`
- `python3 scripts/check_primary_navigation.py`
- `python3 scripts/test_foundations_accessibility.py`
- `python3 scripts/test_token_taxonomy.py`
- `git diff --check` restrito aos arquivos desta entrega

O teste específico de Fundamentos cobre:

- quatro abas
- ativação por mouse e teclado
- estado selecionado
- URL com `focus`
- português do Brasil, português de Portugal e inglês
- um `main` e um `h1`
- ausência dos assets antigos
- cinco viewports
- overflow horizontal
- Axe nas quatro abas

Validações com falha externa:

- `npm run build` chega ao TypeScript e falha em `src/components/ReasoningPage.tsx` por `EvidenceWeaverSection` e chaves de tradução `weaver` ausentes. `npx vite build` conclui normalmente.
- `npm run test:agent-ui` conclui 42 de 43 testes. `AppShell.test.tsx` falha porque o JSDOM não fornece `window.matchMedia` aos componentes de presença.
- `python3 scripts/test_accessibility_remediation.py` para antes da matriz por uma expectativa antiga do label do composer da assistente.
- `python3 scripts/test_navigation_components.py` avança por navegação e Fundamentos, mas para em contagens antigas do Workbench de Componentes.
- A checagem global de whitespace aponta trailing whitespace em `CONTEXTO-TCC.md` e `linha-do-tempo.md`, arquivos não alterados por esta execução.
- Não existem scripts `lint` ou `test` genéricos no `package.json`.

## Arquivos alterados

Implementação:

- `src/components/ui/FoundationPrimitives.tsx`
- `src/components/FoundationsHubPage.tsx`
- `src/components/GuidelinesPage.tsx`
- `src/components/FoundationsPage.tsx`
- `src/components/PatternsPage.tsx`
- `src/components/TokensPage.tsx`
- `src/index.css`

Validação:

- `scripts/test_foundations_accessibility.py`
- `scripts/test_accessibility_remediation.py`
- `scripts/test_navigation_components.py`
- `scripts/test_token_taxonomy.py`

Documentação:

- `docs/superpowers/specs/2026-06-10-foundations-visual-standardization-design.md`
- `FOUNDATIONS_VISUAL_STANDARDIZATION_REPORT.md`

## Pendências

- Corrigir os erros independentes de TypeScript em `ReasoningPage.tsx` para restaurar `npm run build`.
- Adicionar um mock global de `window.matchMedia` no ambiente Vitest.
- Atualizar expectativas antigas dos testes globais da assistente e do Workbench.

Nenhuma dessas pendências foi causada pela padronização de Fundamentos.

## Confirmações de escopo

- Não alterei backend.
- Não alterei RAG.
- Não alterei busca.
- Não alterei deploy.
- Não fiz push.
- Não abri PR.
- Não fiz deploy.
