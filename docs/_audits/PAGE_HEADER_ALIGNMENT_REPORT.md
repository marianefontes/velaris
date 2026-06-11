# Page Header Alignment Report

## Resumo

Os cabeçalhos de Componentes e Perspectivas foram alinhados ao mesmo eixo visual usado por Raciocínio, Fundamentos, Arquitetura e Avaliação.

O ajuste reutiliza `PageShell` e `PageHero`. Nenhuma nova identidade visual ou abstração de layout foi criada.

## Problema encontrado

As duas páginas já usavam as primitivas compartilhadas, mas aplicavam variantes de largura diferentes ao início inteiro da página:

- Componentes usava `PageShell width="wide"`, com largura máxima de `1400px`.
- Perspectivas usava `PageShell width="compact"`, com largura máxima de `1120px`.
- As páginas principais de referência usam a largura `standard`, com máximo de `1280px`.

Como os containers são centralizados, essas diferenças alteravam o ponto inicial do eyebrow, título e conteúdo introdutório em desktop. Componentes começava mais à esquerda e Perspectivas mais à direita.

## Padrão adotado

O hero textual usa `PageShell` na largura padrão e `PageHero` para controlar:

- largura máxima de `1280px`;
- centralização horizontal;
- padding responsivo compartilhado;
- espaçamento superior após a navegação;
- ritmo entre eyebrow, título, descrição, ações e divisor;
- um único `h1`.

Conteúdo especializado pode usar outra largura somente depois do hero. Esse padrão já existe em Fundamentos e foi reutilizado sem alterar as primitivas globais.

## Páginas ajustadas

- `ComponentsPage`
- `PerspectivesPage`

Em Componentes, o hero foi isolado em um `PageShell` padrão. Categorias, sidebar, preview e workbench permanecem em um segundo `PageShell width="wide"`.

Em Perspectivas, o shell compacto foi substituído pelo shell padrão. Hero, preâmbulo, perspectiva ativa e lista agora compartilham o mesmo eixo das páginas principais.

## O que foi preservado

- conteúdo textual;
- badges e chips informativos;
- elemento visual do hero de Componentes;
- categorias e catálogo;
- sidebar e preview interativo;
- states e intents;
- seleção e comparação de perspectivas;
- calibração e persona ativa;
- dados, rotas e lógica funcional;
- identidade visual existente.

## Responsividade

Em desktop, os títulos das páginas verificadas começam no mesmo eixo horizontal.

Em tablet e mobile, o padding continua vindo de `PageShell`: `20px` na base, `24px` a partir de `sm` e `40px` a partir de `lg`.

O workbench de Componentes expande apenas depois do hero. Em Perspectivas, as colunas introdutórias continuam empilhando em mobile. Foram verificados os viewports de `320`, `390`, `768` e `1440px` sem overflow horizontal.

## Acessibilidade

- Cada página mantém um único `h1`.
- O eyebrow continua separado semanticamente do título.
- A ordem existente de headings foi preservada.
- Nenhum conteúdo foi ocultado ou removido da árvore de acessibilidade.
- Estados de foco e controles existentes não foram alterados.

## Pendências

Nenhuma pendência identificada neste escopo.
