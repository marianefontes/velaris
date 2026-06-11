# CODEX UI Audit

Data da auditoria: 10 de junho de 2026

Escopo observado:

- Página inicial.
- Components.
- Patterns.
- Tokens.
- Guidelines/Principles.
- Reasoning.
- Perspectives.
- Architecture.
- Laboratory.
- Evaluation.
- Results.
- Beatrice Chat.
- Comportamento responsivo em 1440 x 1000 e 390 x 844.

Esta auditoria é um retrato do estado local durante trabalho paralelo do Claude. Vários arquivos estavam modificados enquanto a análise era feita. Nenhuma recomendação abaixo deve ser aplicada sem revisar primeiro o diff mais recente.

## Resumo executivo

A interface já possui uma base visual forte: tipografia clara, superfícies escuras controladas, identidade violeta reconhecível e boa intenção de produto. Ela não precisa de um redesenho. O ganho mais importante virá de consolidar largura, hierarquia, densidade, estados e acessibilidade em um sistema comum.

Hoje, as páginas centrais parecem pertencer à mesma família, mas não à mesma versão do sistema. A home e o chat acumulam muitos focos simultâneos; Foundations repete estruturas de hero; Laboratory fica excessivamente vazio; e algumas páginas adotam escalas, larguras e estilos editoriais próprios. Em mobile, a maior parte responde bem, mas há compressão do topo, controles pequenos e overflow real em Architecture.

A direção recomendada é reduzir variação, não reduzir conteúdo: um page shell comum, menos níveis concorrentes, superfícies mais previsíveis e metadados legíveis.

## Problemas críticos

### 1. Foundations cria hierarquia duplicada

`FoundationsHubPage` já introduz a seção com hero e `h1`, enquanto páginas internas como Patterns, Tokens, Guidelines e Accessibility introduzem outro hero e outro `h1`. Guidelines e Accessibility também inserem um segundo elemento `main` dentro do `main` do `AppShell`.

Impacto:

- A página começa duas vezes.
- O conteúdo principal é empurrado para baixo, especialmente em mobile.
- A hierarquia semântica fica ambígua.
- A sensação é de documentação encaixada dentro de outra documentação.

Evidências:

- `src/components/FoundationsHubPage.tsx`
- `src/components/GuidelinesPage.tsx`
- `src/components/FoundationsPage.tsx`
- `src/components/PatternsPage.tsx`
- `src/components/TokensPage.tsx`
- `src/components/AppShell.tsx`

### 2. A home apresenta focos demais acima da dobra

Em desktop, topbar, faixa do Design System, hero, visual orbital, rail contextual e fluxo RAG competem pela atenção. Em mobile, a faixa do Design System ocupa parte expressiva da primeira tela antes da proposta principal.

Impacto:

- A mensagem de produto perde prioridade.
- O usuário precisa interpretar estrutura antes de entender valor.
- A percepção fica mais próxima de um painel demonstrativo do que de uma entrada calma e premium.

Recomendação futura:

- Definir um único foco primário na primeira dobra.
- Rebaixar a faixa do Design System a contexto secundário ou navegação local.
- Manter o visual orbital, mas reduzir a competição ao redor dele.

### 3. Contraste baixo aparece em elementos recorrentes

O teste automatizado encontrou falhas de contraste em todas as rotas desktop amostradas. O padrão mais recorrente é texto entre 8 e 11 px usando `text-slate-500`, `text-slate-600` ou equivalentes sobre superfícies escuras.

Impacto:

- Metadados, labels e navegação parecem mais apagados que refinados.
- A interface perde confiança e legibilidade.
- O problema se repete em componentes globais, então afeta a percepção do produto inteiro.

Áreas recorrentes:

- Navegação inativa e labels da topbar.
- Eyebrows globais.
- Metadados de cards.
- Labels de confiança, fonte e estado.
- Rail da Beatrice.

### 4. Architecture apresenta overflow horizontal em mobile

Em viewport de 390 px, o documento chegou a aproximadamente 443 px de largura. Trechos de código e estruturas de tiers não quebram adequadamente.

Impacto:

- A página pode ser arrastada lateralmente.
- A navegação e o conteúdo parecem desalinhados.
- O problema quebra a expectativa de acabamento em uma página técnica central.

Evidência principal:

- `src/components/DevelopersPage.tsx`, especialmente linhas com nomes técnicos dentro de `code`, `dl` e linhas de tier.

### 5. Beatrice parece capaz, mas excessivamente instrumentada

O chat combina comandos, prompts sugeridos, mensagens, ações, fontes, rail de contexto, status e composer. Os elementos são individualmente úteis, mas o conjunto cria alta densidade e múltiplas decisões antes da conversa.

Impacto:

- O primeiro uso exige mais leitura que ação.
- A confiança é comunicada por quantidade de instrumentação, não por clareza.
- Em mobile, parte do contexto inicial desaparece quando o fluxo leva o usuário diretamente à mensagem atual.

Detalhamento completo em `CODEX_BEATRICE_UX_AUDIT.md`.

## Problemas médios

### Page shells sem regra única

Foram encontrados vários limites principais:

- 1280 px em páginas centrais.
- 1400 px em home e Components.
- 1200 px em Perspectives.
- 1480 px em Laboratory.
- 1180 px em autenticação/estudo.
- 1120 px em Research.

Também variam paddings laterais e espaçamento superior. A variação nem sempre corresponde a uma necessidade de conteúdo.

### Escala de hero varia mais que o necessário

A aplicação combina títulos de página, títulos editoriais e títulos de demonstração com escalas distintas, mas sem papéis formalizados. Foundations amplifica o problema ao empilhar dois heros. Perspectives usa uma voz serifada própria, enquanto o restante se apoia principalmente em sans/headline.

### Laboratory fica subpreenchido em desktop

O estado não autenticado centraliza um card pequeno dentro de uma área alta e larga. A composição funciona em mobile, mas em desktop produz um grande campo vazio sem intenção visual suficiente.

### Densidade de metadados é irregular

Components e Beatrice utilizam muitos labels entre 8 e 10 px, contadores, chips e microdescrições. Results é uma referência melhor de calma e escaneabilidade.

### Cards e superfícies usam muitas receitas

Há variações de radius, borda, blur, sombra e opacidade com diferenças pequenas entre si. Algumas são justificadas por contexto; muitas parecem decisões locais.

### A linguagem editorial não está formalizada

Perspectives e alguns blocos de Reasoning usam `font-serif`, mas não há um papel serifado definido no tema. O resultado é interessante, porém parece uma exceção de página e não uma decisão do sistema.

### Topbar mobile fica comprimida

Em 390 px, marca, busca, seletor de idioma e perfil dividem pouco espaço. O nome da marca desaparece e a navegação primária depende de scroll horizontal. É funcional, mas requer teste cuidadoso em 320 px, zoom e strings maiores.

### Documentação e produto têm níveis diferentes de maturidade

Tokens, acessibilidade e estados estão descritos com boa profundidade, mas a implementação ainda usa muitos estilos locais. A documentação promete mais consistência do que o runtime entrega.

## Refinamentos pequenos

- Limitar texto corrido a aproximadamente 65-72 caracteres por linha.
- Reduzir o uso de labels de 8 e 9 px; reservar 10 px apenas para metadados não essenciais.
- Adotar uma escala curta de radius para superfícies equivalentes.
- Evitar `transition-all`; declarar somente propriedades necessárias.
- Uniformizar distância entre eyebrow, título, descrição e primeira seção.
- Alinhar alturas de botões, selects, busca e campos da topbar.
- Padronizar divisores e opacidade de borda entre cards equivalentes.
- Usar pills apenas para filtros, estados e taxonomia compacta.
- Dar mais separação entre ação primária e ações auxiliares.
- Evitar que ícones decorativos grandes dominem heros em mobile.
- Garantir quebra para identificadores técnicos, URLs e nomes de componentes.
- Revisar imagens para dimensões HTML explícitas e prevenção de layout shift.

## Riscos de conflito com Claude

Não foram alteradas as seguintes áreas, apesar de concentrarem recomendações:

- `src/index.css` e `tailwind.config.ts`, porque centralizam tokens e estavam em evolução.
- `src/components/AppTopBar.tsx` e arquivos de busca global.
- `src/components/BeatriceChatPage.tsx` e toda a árvore ativa do chat.
- `src/i18n/`.
- `src/routes.tsx`.
- Páginas de home, Foundations, Architecture, Components e Laboratory.
- `package.json` e scripts.
- Backend, RAG, SSE, CORS e configuração de API.
- Nomenclatura Aetheris/Eteris/Velaris.

Durante a auditoria, a integração da busca na topbar mudou no worktree. Isso confirma que o relatório deve ser revisado contra o diff final do Claude antes de qualquer patch.

## Recomendações prioritárias

1. Corrigir landmarks, `h1` duplicado e hero duplicado em Foundations.
2. Consolidar um page shell padrão, com exceções explícitas para workbenches e tabelas largas.
3. Executar uma passagem de contraste e tamanho mínimo em labels globais.
4. Corrigir overflow mobile de Architecture e validar 320, 390, 768 e 1280 px.
5. Simplificar a primeira dobra da home sem remover sua identidade.
6. Reduzir a densidade inicial da Beatrice e priorizar conversa, resposta e evidência.
7. Transformar tokens documentados em primitivas compartilhadas de runtime.
8. Unificar estados de foco, hover, disabled, loading, empty e error.
9. Formalizar quando usar tipografia editorial/serifada.
10. Revisar renomeação visual somente após separar nomes públicos de chaves internas de compatibilidade.
