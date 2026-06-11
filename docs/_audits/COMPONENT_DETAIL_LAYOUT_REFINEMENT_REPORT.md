# Component Detail Layout Refinement Report

## Resumo

Refinamos o layout da página Componentes para alinhar hero e conteúdo ao mesmo grid, compactar a lateral de Acessibilidade e Recomendação da IA, sincronizar o encerramento visual das duas colunas principais, inserir uma linha divisória e reposicionar o Code Snippet como faixa inferior ampla. O ícone genérico de brilho no hero foi substituído por uma composição modular de blocos.

## Problemas corrigidos

1. O conteúdo abaixo do hero usava `PageShell` com larguras diferentes (`standard` no hero, `wide` no workbench), deslocando o eixo esquerdo em relação ao título.
2. Os cards de Acessibilidade e Recomendação da IA ocupavam altura excessiva por descrições longas, grid espaçado e texto de recomendação concatenado.
3. O Code Snippet ficava confinado na coluna lateral direita, comprimindo a leitura do código.
4. O ícone `Sparkles` no hero não comunicava catálogo de componentes.

## Alinhamento do hero

Hero e workbench passaram a compartilhar um único `PageShell width="wide"`, com o mesmo `max-w-[1400px]` e padding horizontal (`px-5 sm:px-6 lg:px-10`). Categorias, workbench e detalhe do componente iniciam no mesmo eixo do título "Workbench de Componentes".

## Colunas principais

A área de detalhe usa `component-detail-row` em grid de duas colunas a partir de `lg`:

- Coluna principal: Preview interativo e card "Sobre este componente".
- Coluna lateral: States/Intents e painel compacto de Acessibilidade/Recomendação da IA.

`align-items: start` evita esticamento artificial. A compactação da lateral reduz a altura total para aproximar o encerramento visual das duas colunas.

## Acessibilidade e Recomendação da IA

Os dois blocos foram unificados em um único card (`component-guidance-card`) com:

- Cabeçalhos enxutos, sem parágrafos descritivos redundantes.
- Critérios de acessibilidade em lista vertical compacta com ícones menores.
- Recomendação curta baseada em `beatriceGuidance`, com contexto `intent · state` em linha separada.
- Remoção de métricas artificiais e texto duplicado de `intentExplanation` na área visível (mantido em `sr-only` para leitores de tela).

## Code Snippet

O snippet foi extraído para `ComponentSnippetSection` e posicionado abaixo da linha divisória, ocupando a largura total de `component-detail-body`. O editor ganhou altura ampliada (`component-code-editor-wide`). Conteúdo, syntax highlight, badge TSX e botão "Copiar código" foram preservados.

## Hero visual

O ícone `Sparkles` foi substituído por uma grade 2×2 de blocos modulares dentro de um `premium-card`, representando peças reutilizáveis do catálogo. O elemento é decorativo (`aria-hidden`), discreto e oculto em mobile (`hidden sm:grid`).

## Componentes verificados

- Button
- Toggle/Switch
- Checkbox
- Radio Button
- Selectable Chip / Badge

Validação adicional via workbench cobre os 25 componentes do catálogo.

## Responsividade

- **Desktop:** duas colunas na primeira área; snippet em faixa ampla abaixo da divisória.
- **Tablet:** colunas empilham naturalmente; padding e grid internos preservados.
- **Mobile:** conteúdo empilhado, snippet legível com scroll interno, sem overflow horizontal no body, hero e conteúdo com o mesmo padding lateral do `PageShell`.

## Acessibilidade

- Hierarquia de headings preservada (`h2` do componente, `h3` nos painéis).
- Ícones decorativos com `aria-hidden`.
- Botão copiar com `aria-label` dinâmico e feedback `aria-live`.
- Editor com label `sr-only` e `aria-invalid` em erro.
- Linha divisória com `aria-hidden` para não interromper leitura assistiva.
- Foco visível nos controles existentes mantido.

## Ajuste de sincronização por linhas (2026-06-10)

O detalhe passou a usar grid 2×2 (`component-detail-stage`):

| Linha | Esquerda | Direita |
|-------|----------|---------|
| 1 | Preview interativo | States / Intents |
| 2 | Sobre este componente | Acessibilidade + Recomendação da IA |

Cada par de células compartilha altura de linha via `align-items: stretch` e painéis com `component-detail-panel-fill`. O badge `intent · state` saiu do posicionamento absoluto e passou para uma toolbar no fluxo do documento, evitando sobreposição com o preview. O code snippet foi reduzido para ~9.5rem (mobile) e ~10.5rem (desktop).

## Pendências

- Previews com overlay absoluto interno (ex.: modal) ainda podem ultrapassar a área em estados específicos; o badge não interfere mais nesse comportamento.
