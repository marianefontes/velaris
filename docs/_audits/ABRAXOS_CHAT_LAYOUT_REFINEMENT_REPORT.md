# Abraxos Chat Layout Refinement Report

## Resumo

A página Consultar Abraxos foi refinada para alinhar o header ao grid do Velaris, ampliar a área de conversa, equilibrar o painel lateral, padronizar capitalização editorial dos títulos de perspectiva, adicionar explicações para grupos de comando e atualizar microcopy para um tom mais premium e orientado a evidências.

## Problemas corrigidos

- **Chat curto e comprimido:** o card principal usava altura mínima conservadora e padding duplicado em relação ao shell da página.
- **Desalinhamento do título:** o header usava um wrapper local com largura e margens diferentes das demais páginas.
- **Capitalização inconsistente:** métricas e medos operacionais da perspectiva Designer (por exemplo, "escaneabilidade", "entropia visual") apareciam como títulos de sugestão em minúsculas.
- **Grupos de comando sem contexto:** "Ação operacional" e "Modo investigativo" não ofereciam caminho claro para entender o que cada grupo significa.

## Layout do chat

- Altura do shell e do rail lateral passou a usar `100dvh` com offsets responsivos (mobile, tablet, desktop).
- Desktop: mínimo de `38rem` com `calc(100dvh - 15.5rem)`.
- Tablet: `34rem` com offset de `17rem`.
- Mobile: `28rem` com offset de `19rem`, mantendo composer fixo na base do card.
- Grid do chat removeu padding horizontal conflitante; o `PageShell` passa a definir o eixo.
- Rail lateral reduzido para `14rem`, com padding e densidade menores para não competir com a conversa.

## Alinhamento do header

- `BeatriceVisualFrame` passou a usar `PageShell width="wide"` e `PageHero`, o mesmo padrão de Raciocínio, Perspectivas e Foundations.
- Eyebrow, título (`h1`), descrição e badge Online compartilham o grid e as margens do conteúdo principal.
- O título interno do card de chat virou `h2`, preservando hierarquia semântica.

## Capitalização

Regra aplicada via `toDisplayTitle` em português:

- Primeira letra maiúscula nas palavras principais.
- Artigos e preposições curtas permanecem em minúsculas quando não são a primeira palavra.
- Aplicado em sugestões (`orchestration.service`), cards de sugestão (`ChatSuggestions`) e tópicos recentes (`PersonaInsights`).

Exemplos: `escaneabilidade` → `Escaneabilidade`; `entropia visual` → `Entropia Visual`.

## Comandos do Oráculo

- Cada grupo ("Ação operacional", "Modo investigativo") ganhou link discreto **Ver explicação** com ícone de ajuda.
- Destino: `/reasoning?focus=commands#comandos-operacional` e `#comandos-investigativo`.
- Seção principal em Raciocínio: `#comandos-do-oraculo`.
- Chips de comando com paleta unificada por grupo (primário/secundário suave), sem arco-íris de cores por comando.
- Página Raciocínio atualizada com descrições curtas dos dois grupos e suporte a hash para scroll automático.

## Responsividade

- **Desktop:** chat mais alto, header alinhado, rail mais estreito, comandos em wrap com hierarquia clara.
- **Tablet:** altura intermediária; rail continua oculto abaixo de `1360px`.
- **Mobile:** status no `PageHero` aside empilha com o título; chat ocupa altura confortável; links "Ver explicação" permanecem tocáveis.

## Acessibilidade

- Título da página como `h1` via `PageHero`.
- Sessão ativa do chat como `h2`.
- Links "Ver explicação" com `aria-label` descritivo por grupo.
- Chips e sugestões operáveis por teclado com `focus-ring`.
- Âncoras com `scroll-mt-28` para não ficarem sob a navegação fixa.

## Pendências

- Nenhuma pendência funcional identificada nesta entrega.
- Validação visual manual em múltiplas perspectivas além de Designer continua recomendada em QA contínuo.
