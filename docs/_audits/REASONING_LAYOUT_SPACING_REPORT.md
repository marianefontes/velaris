# Reasoning Layout Spacing Report

## Resumo

A página Raciocínio e as páginas com `ZoneShell` (Arquitetura, Avaliação) passaram a usar o padrão compartilhado `SectionIntroHeader` com descrições mais largas, `leading-6` entre linhas do texto introdutório e `mb-12` (48px) padronizado antes de cards, timelines e grids. O hero de Raciocínio mantém ajustes via `reasoning-page-hero`.

## Problema encontrado

Subtítulos e descrições usavam classes globais (`section-h2`, `section-lead`) com comportamento inadequado para textos longos da página Raciocínio:

- `text-wrap: balance` em títulos forçava quebras prematuras em frases como "Como uma pergunta se torna uma resposta explicável".
- `section-lead` limitava descrições a `66ch` sem margem inferior, deixando o conteúdo seguinte colado ao texto introdutório.
- O `ZoneShell` local separava o eyebrow do título com `mb-4`, mas não reservava respiro entre descrição e conteúdo operacional.

## Padrão adotado

**Componente:** `SectionIntroHeader` em `src/components/ui/VisualPrimitives.tsx`

| Elemento | Largura | Espaçamento |
|----------|---------|-------------|
| Eyebrow | fluxo natural | `mb-2` antes do título |
| Título | `max-w-3xl`, `text-wrap: pretty` | sem margem inferior própria |
| Descrição | `max-w-none`, até `92ch` só em `xl+` | `mt-2`, `leading-6` entre linhas |
| Conteúdo seguinte | alinhado ao eixo do cabeçalho | `mb-12` (48px) no header |

O corpo de cada seção fica em `.section-intro-body`. Seções só com título (sem descrição) também recebem os 48px antes do conteúdo.

**Hero:** wrapper `.reasoning-page-hero` amplia `.page-h1` para até `38ch` e `.page-lead` para até `80ch` em desktop, mantendo leitura confortável em mobile.

## Seções ajustadas

**Raciocínio:** hero, visão geral, Tecelã, Habilidades, Comandos, Pipeline.

**Arquitetura (`DevelopersPage`):** Stack overview, Data flows, Dev commands e demais `ZoneShell`.

**Avaliação (`EvaluationPage`):** todas as seções com `ZoneShell`.

## Responsividade

- **Desktop largo:** descrições até `80ch`; títulos até `3xl` (~48rem).
- **Tablet:** descrições até `72ch`; espaçamento `mb-10`.
- **Mobile:** largura total do container com padding do `PageShell`; sem overflow horizontal.
- **320px:** `text-wrap: pretty` e `max-w` fluidos evitam linhas longas demais ou quebras estranhas.

## Acessibilidade

- Hierarquia preservada: um `h1` no hero, `h2` por seção, `h3` nos cards internos.
- Contraste e tokens de cor inalterados.
- Espaçamento adicional não interfere em foco por teclado ou ordem de leitura.
- Larguras em `ch` e `max-w` escalam com zoom do navegador.

## Pendências

Nenhuma pendência funcional identificada nesta rodada.
