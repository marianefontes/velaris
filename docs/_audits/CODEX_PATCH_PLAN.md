# CODEX Patch Plan

## Objetivo

Elevar a interface para um padrão premium, calmo e consistente sem redesenhar o produto, sem apagar sua identidade e sem criar conflito com o trabalho atual do Claude.

## Ordem recomendada de aplicação

1. Esperar Claude terminar.
2. Revisar diff do Claude.
3. Aplicar ajustes visuais sem conflito.
4. Testar chat.
5. Testar busca.
6. Testar i18n.
7. Testar build.
8. Subir PR manualmente.

Antes de iniciar os patches, registrar o estado final de tokens, componentes compartilhados, rotas e nomenclatura. Se o Claude já tiver resolvido um item, remover o patch correspondente em vez de criar uma solução paralela.

## Patches recomendados

### Patch 1 | Padronização de Page Shell

Arquivos prováveis:

- `src/components/AppShell.tsx`
- `src/index.css`
- Páginas com `max-width` e paddings locais

Objetivo:

- Criar variantes `standard`, `reading` e `wide`.
- Unificar paddings laterais e espaçamento superior.
- Remover `main` e `h1` duplicados em Foundations.

Risco:

- Alto enquanto o diff do Claude estiver aberto; médio depois da revisão.

Prioridade:

- P0.

Critério de aceite:

- Um `main` e um `h1` por rota.
- Páginas equivalentes começam na mesma linha visual.
- Exceções de largura são explícitas.
- Nenhum conteúdo quebra em 320 px.

### Patch 2 | Cards e superfícies

Arquivos prováveis:

- `src/index.css`
- `tailwind.config.ts`
- Páginas com cards locais
- Primitivas compartilhadas a definir após o diff

Objetivo:

- Consolidar superfícies `base`, `raised`, `interactive` e `hero`.
- Reduzir variações de radius, borda, blur e sombra.

Risco:

- Médio.

Prioridade:

- P1.

Critério de aceite:

- Cards com a mesma função têm a mesma receita.
- Hero surfaces são raras e intencionais.
- Hover não causa salto de layout.
- Contraste de borda e superfície permanece perceptível.

### Patch 3 | Tipografia e hierarquia

Arquivos prováveis:

- `tailwind.config.ts`
- `src/index.css`
- Foundations, Perspectives, Components, Home e Beatrice

Objetivo:

- Definir papéis de display, page title, section title, body e metadata.
- Formalizar ou remover o uso ad hoc de serif.
- Reduzir texto essencial abaixo de 11 px.

Risco:

- Médio.

Prioridade:

- P0.

Critério de aceite:

- Títulos equivalentes usam a mesma escala.
- Texto corrido mantém largura legível.
- Metadados essenciais passam contraste AA.
- Serif, quando usada, possui papel documentado.

### Patch 4 | Estados de UI

Arquivos prováveis:

- Componentes compartilhados de botão, input, menu e card
- `src/index.css`
- Estados locais de loading, empty, error e disabled

Objetivo:

- Unificar hover, focus, active, disabled, loading, empty e error.
- Substituir `transition-all` por propriedades específicas.

Risco:

- Médio.

Prioridade:

- P0.

Critério de aceite:

- Estados são reconhecíveis sem depender de cor.
- Focus é sempre visível.
- Disabled visual corresponde à lógica.
- Loading e erro não alteram abruptamente o layout.

### Patch 5 | Chat da Beatrice

Arquivos prováveis:

- `src/components/BeatriceChatPage.tsx`
- `src/beatrice/components/chat/ChatInput.tsx`
- `src/beatrice/components/chat/ChatMessage.tsx`
- `src/beatrice/components/chat/ChatSuggestions.tsx`
- `src/beatrice/components/chat/ChatToolbar.tsx`
- Componentes de contexto e rail

Objetivo:

- Reduzir densidade inicial.
- Melhorar hierarquia de conversa, composer e contexto.
- Corrigir affordances inertes e estados divergentes.

Risco:

- Alto. Aplicar apenas depois de integrar e testar o trabalho do Claude.

Prioridade:

- P0.

Critério de aceite:

- O usuário identifica imediatamente onde digitar.
- Envio vazio está visualmente disabled.
- Anexo funciona ou não é apresentado.
- A conversa permanece clara sem o rail.
- Mobile mantém contexto e não salta indevidamente.

### Patch 6 | Source/confidence chips

Arquivos prováveis:

- `src/beatrice/components/chat/ChatMessage.tsx`
- Componentes de XAI, evidência e provenance
- Tokens de badges/chips

Objetivo:

- Criar um padrão único para fonte, confiança e evidência.
- Tornar detalhes acessíveis por teclado e touch.

Risco:

- Alto, por depender de contratos de dados e do chat.

Prioridade:

- P0.

Critério de aceite:

- Fonte não depende de `title`.
- Confiança combina texto, valor e explicação.
- Ações têm alvo adequado.
- Excesso de fontes é agrupado sem esconder as prioritárias.

### Patch 7 | Responsividade

Arquivos prováveis:

- `src/components/DevelopersPage.tsx`
- `src/components/AppTopBar.tsx`
- Home, Components, Foundations, Laboratory e Beatrice

Objetivo:

- Eliminar overflow raiz.
- Ajustar densidade e ordem em 320-768 px.
- Preservar navegação e conteúdo técnico.

Risco:

- Médio; alto na topbar por envolver busca e i18n.

Prioridade:

- P0.

Critério de aceite:

- Sem overflow raiz em 320, 390, 768, 1280 e 1440 px.
- Código e identificadores quebram de forma segura.
- Navegação ativa permanece visível.
- Strings maiores não encobrem ações.

### Patch 8 | Microinterações

Arquivos prováveis:

- `src/index.css`
- Componentes com `animate-*`, `transition-all`, pulse e shimmer
- Chat e home

Objetivo:

- Tornar movimento curto, funcional e compatível com reduced motion.
- Remover animação decorativa persistente quando não agrega estado.

Risco:

- Médio.

Prioridade:

- P1.

Critério de aceite:

- Transições ficam entre 120 e 240 ms, salvo casos justificados.
- Nenhuma ação usa bounce ou glow excessivo.
- Reduced motion elimina deslocamentos, pulse e shimmer.
- Feedback continua legível sem animação.

### Patch 9 | Acessibilidade

Arquivos prováveis:

- `src/components/AppShell.tsx`
- `src/components/AppTopBar.tsx`
- `src/beatrice/components/persona/PersonaProfileMenu.tsx`
- `src/beatrice/pages/PerspectivesPage.tsx`
- Componentes do chat
- Tokens de cor e foco

Objetivo:

- Corrigir nomes acessíveis, labels, foco, contraste, landmarks e alvos.

Risco:

- Médio; alto em arquivos ativos do chat/topbar.

Prioridade:

- P0.

Critério de aceite:

- Axe sem violações critical ou serious nas rotas principais.
- Fluxos essenciais completos apenas por teclado.
- Um `main` e um `h1` por rota.
- Contraste AA.
- Touch targets adequados.

### Patch 10 | Renomeação visual Aetheris/Eteris para Velaris

Arquivos prováveis:

- `public/site.webmanifest`
- Assets públicos e referências
- Exemplos de integração
- Metadados e textos de UI
- Chaves internas apenas após plano de migração

Objetivo:

- Remover nomes antigos da superfície pública sem quebrar storage, eventos, dados ou integrações.

Risco:

- Alto.

Prioridade:

- P1 depois do diff do Claude.

Critério de aceite:

- Manifest, títulos, alt text, documentação visível e exemplos usam Velaris.
- Busca global por Aetheris/Eteris retorna apenas ocorrências internas aprovadas.
- Chaves renomeadas possuem migração e fallback.
- Nenhum dado, preferência ou sessão é perdido.
