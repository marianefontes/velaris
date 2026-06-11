# CODEX Accessibility Remediation Report

Data da execução: 10 de junho de 2026

Esta execução implementou correções concretas no frontend. Não representa uma certificação WCAG completa.

## Resumo

Foram corrigidos os problemas críticos de nome acessível, labels de formulário, movimento reduzido, contraste recorrente, navegação por teclado, landmarks duplicados e overflow raiz. Também foram reforçados skip link, focus ring, alvos de toque, source disclosures, menus, dialogs e estados anunciáveis.

O reteste final com Axe Core 4.10.3 não encontrou violações `critical` ou `serious` nas rotas amostradas. Os testes de viewport não encontraram overflow horizontal raiz em 320, 390, 768, 1280 e 1440 px.

## Arquivos alterados

- `src/index.css`
- `tailwind.config.ts`
- `src/i18n/translations.ts`
- `src/components/AppShell.tsx`
- `src/components/AppTopBar.tsx`
- `src/components/GlobalSearch.tsx`
- `src/components/FoundationsHubPage.tsx`
- `src/components/FoundationsPage.tsx`
- `src/components/GuidelinesPage.tsx`
- `src/components/PatternsPage.tsx`
- `src/components/TokensPage.tsx`
- `src/components/DevelopersPage.tsx`
- `src/components/LaboratoryPage.tsx`
- `src/components/OracleHomePage.tsx`
- `src/components/ResearchAdminPage.tsx`
- `src/components/comparison/AnswerPanel.tsx`
- `src/beatrice/components/persona/PersonaProfileMenu.tsx`
- `src/beatrice/components/chat/ChatInput.tsx`
- `src/beatrice/components/chat/ChatLoadingState.tsx`
- `src/beatrice/components/chat/ChatMessage.tsx`
- `src/beatrice/components/chat/ChatToolbar.tsx`
- `src/beatrice/components/chat/HistoryPanel.tsx`
- `src/beatrice/components/chat/SettingsPanel.tsx`
- `src/beatrice/pages/PerspectivesPage.tsx`
- `src/components/AppShell.test.tsx`
- `src/beatrice/components/persona/PersonaProfileMenu.test.tsx`
- `src/beatrice/components/chat/ChatInput.test.tsx`
- `src/beatrice/components/chat/ChatMessage.test.tsx`
- `src/beatrice/pages/PerspectivesPage.test.tsx`
- `scripts/test_accessibility_remediation.py`
- `docs/superpowers/specs/2026-06-10-accessibility-remediation-design.md`
- `CODEX_ACCESSIBILITY_REMEDIATION_REPORT.md`

## Problemas críticos corrigidos

- O trigger mobile de perfil agora possui nome acessível dinâmico, `aria-expanded`, `aria-haspopup`, `aria-controls`, foco visível, fechamento por Escape e retorno de foco.
- Os sliders de Perspectives agora possuem labels programáticos únicos associados às dimensões controladas, mantendo valor e limites anunciáveis.
- O composer da Beatrice agora possui label persistente. O placeholder permanece apenas como exemplo e o envio vazio fica programática e visualmente desabilitado.
- Movimento decorativo contínuo é interrompido com `prefers-reduced-motion: reduce`, incluindo mesh, pulse, spin, ping e transições não essenciais.
- O contraste recorrente de textos auxiliares essenciais foi elevado para remover as violações sérias encontradas nas rotas amostradas.

## Contraste

- Os tokens globais `slate-500`, `slate-600` e `slate-700` foram recalibrados para superfícies escuras.
- Navegação inativa, eyebrows, labels, metadados, rail da Beatrice, chips e textos auxiliares receberam contraste maior.
- Cores fixas problemáticas em Guidelines foram substituídas por valores com melhor legibilidade.
- O foco usa cor e espessura visíveis em fundos escuros e violetas.
- O Axe final não reportou violações `critical` ou `serious` de contraste nas rotas amostradas.

## Labels e nomes acessíveis

- O textarea da Beatrice recebeu label persistente traduzido em `pt-BR`, `pt-PT` e `en-US`.
- Sliders receberam `id` e associação por `aria-labelledby`.
- Triggers de perfil e locale anunciam ação, estado e relação com o menu.
- Botões apenas com ícone receberam nomes acessíveis; ícones decorativos internos foram ocultados da árvore de acessibilidade.
- Imagens revisadas receberam dimensões HTML explícitas para reduzir layout shift.

## Focus e teclado

- Foi consolidada a classe reutilizável `.focus-ring`.
- O primeiro Tab revela um skip link global que move o foco para `#main-content`.
- Menus de perfil e locale fecham com Escape, fecham ao clicar fora e devolvem foco ao trigger.
- Itens selecionáveis de menu usam semântica de `menuitemradio` com estado anunciado.
- Source disclosures usam botões nativos, abrem por Enter ou Espaço e fecham com Escape.
- Ações de mensagem e histórico permanecem visíveis em touch e também aparecem com `focus-within`.
- Controles prioritários receberam área mínima de 44 por 44 px ou espaçamento equivalente.

## Reduced motion

- A regra global de redução de movimento desativa animações e transições não essenciais.
- Mesh blobs assumem estado estático.
- Pulse, spin, ping, shimmer e deslocamentos contínuos deixam de animar.
- History e Settings respeitam a preferência também nas animações Framer Motion.
- Feedback de loading e estado continua presente de forma estática e textual.

## Mobile e overflow

- Containers flex e grid críticos receberam `min-width: 0`.
- Conteúdo técnico usa quebra segura, enquanto blocos de código mantêm scroll horizontal interno.
- O formulário de Perspectives, Global Search e conteúdo de Architecture foram ajustados para 320 px.
- Elementos decorativos de Patterns e Tokens deixaram de ampliar a largura raiz em telas estreitas.
- A navegação horizontal possui indicação visual de continuidade, alvos maiores e mantém o item ativo visível sem deslocar o documento.
- Não houve overflow horizontal raiz nas rotas testadas em 320, 390, 768, 1280 e 1440 px.

## Landmarks e headings

- O AppShell fornece um único `main` com destino estável de skip link nas rotas regulares.
- Rotas que já possuem `main` próprio ficam isentas do wrapper semântico duplicado.
- Wrappers internos indevidos em Foundations, Guidelines e Laboratory foram convertidos para `div`.
- Títulos internos de Foundations, Patterns e Tokens foram rebaixados para preservar um único `h1`.
- O reteste confirmou exatamente um `main` e um `h1` nas rotas amostradas.

## Estados dinâmicos

- Loading relevante usa `role="status"` e `aria-live="polite"`.
- O anúncio de resposta da Beatrice permanece textual quando animações são reduzidas.
- O botão de envio vazio usa `disabled` real e aparência coerente.
- A entrada digitada continua preservada quando o envio não pode ser executado.
- Os fluxos existentes de dialog mantêm trap de foco, Escape e retorno ao trigger.

## Validação

- `npm run build`: passou, incluindo navegação primária, TypeScript e Vite.
- `npx tsc -b --pretty false`: passou.
- `npx vitest run`: 13 arquivos e 42 testes passaram.
- `npm run check:i18n`: passou com warnings informativos já existentes.
- `git diff --check`: passou.
- `python3 scripts/test_foundations_accessibility.py`: passou.
- `python3 scripts/verify_perspectives_ui.py`: passou.
- `AETHERIS_BASE_URL=http://127.0.0.1:4173 python3 scripts/smoke_frontend.py`: passou em 10 rotas, 3 locales e 2 viewports.
- `python3 scripts/test_accessibility_remediation.py`: passou com `ACCESSIBILITY_REMEDIATION_OK`.
- Axe Core 4.10.3: zero violações `critical` ou `serious` em home, Components, Foundations, Architecture, Beatrice e Perspectives.
- Viewports automatizados: 320, 390, 768, 1280 e 1440 px sem overflow raiz.
- O projeto não possui script genérico `lint` nem script genérico `test`; as verificações disponíveis foram executadas diretamente.

## Pendências

- Fazer leitura manual completa com VoiceOver e NVDA em hardware e navegador reais.
- Validar zoom real de 200% em navegadores, pois o teste automatizado cobriu reflow por viewport, não o controle nativo de zoom.
- Revalidar erro, retry e streaming com backend real para confirmar anúncios em falhas integradas.
- Executar uma certificação WCAG completa caso seja necessária. Esta execução filtrou Axe para impactos `critical` e `serious` nas rotas prioritárias.

## Áreas alteradas

- Shell global: skip link, landmark principal, foco e navegação.
- Topbar: locale menu, navegação mobile, alvos de toque e imagens.
- Beatrice: composer, loading, toolbar, mensagens, sources, histórico, settings e perfil.
- Perspectives: sliders, seletor de perspectivas, formulário e responsividade.
- Foundations: landmarks, headings e estados de loading.
- Architecture e páginas técnicas: wrapping, tabelas, código e overflow.
- Design system: contraste global, focus ring e reduced motion.
- Comparação: source disclosures operáveis por teclado e touch.
- Testes: cobertura unitária, Axe, landmarks, viewports, labels e movimento reduzido.

Não houve alteração intencional de backend, infraestrutura, deploy, contratos de API, RAG ou integrações externas nesta remediação.
