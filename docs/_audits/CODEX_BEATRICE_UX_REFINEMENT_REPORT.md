# CODEX Beatrice UX Refinement Report

## Resumo

O chat da Beatrice foi refinado para priorizar conversa, composer e evidência. A execução reduziu densidade, removeu affordances falsas, melhorou leitura, foco, alvos de interação, disclosure de fontes, estados visuais, comportamento responsivo e suporte a movimento reduzido.

## Arquivos alterados

- `src/beatrice/components/chat/ChatEmptyState.tsx`
- `src/beatrice/components/chat/ChatInput.tsx`
- `src/beatrice/components/chat/ChatLayout.tsx`
- `src/beatrice/components/chat/ChatLoadingState.tsx`
- `src/beatrice/components/chat/ChatMessage.tsx`
- `src/beatrice/components/chat/ChatStream.tsx`
- `src/beatrice/components/chat/ChatSuggestions.tsx`
- `src/beatrice/components/chat/ChatToolbar.tsx`
- `src/beatrice/components/chat/ExecutionSummaryBanner.tsx`
- `src/beatrice/components/chat/HistoryPanel.tsx`
- `src/beatrice/components/chat/SettingsPanel.tsx`
- `src/beatrice/components/persona/PersonaContextBanner.tsx`
- `src/beatrice/components/persona/PersonaHeader.tsx`
- `src/beatrice/components/persona/PersonaInsights.tsx`
- `src/beatrice/components/persona/PersonaMetrics.tsx`
- `src/beatrice/components/persona/PersonaProfileMenu.tsx`
- `src/beatrice/components/persona/PersonaSidebarPanel.tsx`
- `src/beatrice/components/primitives/MarkdownRenderer.tsx`
- `src/index.css`
- `tailwind.config.ts`
- `CODEX_BEATRICE_UX_REFINEMENT_REPORT.md`

## Densidade e priorização

- A conversa recebeu largura de leitura controlada e shell com altura ajustada ao novo frame visual.
- O composer permanece visível enquanto a conversa usa scroll interno.
- O rail foi reduzido para 15.5rem, perdeu glow e passou a usar superfícies mais discretas.
- Contexto principal continua visível; tópicos, links e trilha ficam recolhidos por padrão.
- A mensagem inicial de persona continua no estado da conversa, mas não é repetida visualmente no stream.
- Apenas três sugestões principais aparecem antes da conversa.
- Comandos avançados foram agrupados em disclosure nativo.

## Composer

- O botão de envio fica disabled quando o campo está vazio ou durante loading.
- O estado disabled usa contraste, cursor e superfície coerentes.
- O botão de anexo sem função foi removido.
- O textarea possui `label` programática persistente e `aria-describedby`.
- O botão de envio tem alvo de 44 x 44 px.
- O contexto de perspectiva foi visualmente recuado.
- Safe area inferior foi aplicada ao composer.

## Mensagens

- Mensagens do usuário permanecem à direita, com largura máxima de 32rem e superfície sem glow.
- Respostas da Beatrice usam coluna aberta de até 72 caracteres, com menos dependência de bubble.
- Cards internos de resposta foram substituídos por seções com divisores.
- Corpo, listas e metadados receberam tamanho e line-height mais legíveis.
- Ações ficam visíveis em touch e ganham destaque em hover e `focus-within`.
- A ação sem comportamento de feedback foi removida.
- Erros usam `role="alert"` e superfície distinta sem expor detalhe técnico adicional.

## Fontes e confiança

- Fontes formam uma seção própria abaixo da resposta.
- As duas primeiras fontes aparecem primeiro; excedentes ficam em disclosure.
- Cada fonte abre por clique, Enter ou Espaço e fecha com Escape.
- Título, origem, trecho e similaridade ficam disponíveis sem depender de `title` ou hover.
- Similaridade continua identificada como relevância da evidência, não confiança da resposta.
- Evidence tier existente no payload permanece como status textual.
- O percentual fixo de confiança do rail foi removido da apresentação.

## Acessibilidade

- A experiência possui um único `h1` no estado atual da rota.
- O textarea possui nome acessível persistente.
- Controles relevantes receberam focus ring consistente.
- Ações e disclosures principais possuem alvos ampliados.
- Ícones decorativos receberam `aria-hidden`.
- Botões funcionais possuem texto visível ou `aria-label`.
- Loading usa `role="status"` e `aria-live="polite"`.
- Fontes usam `aria-expanded` e `aria-controls`.
- Labels essenciais foram elevados para 11px ou mais.
- O trigger de perspectiva mantém nome acessível e evita overflow em tablet.

## Mobile

- O rail fica oculto quando não há largura suficiente.
- O shell foi recalibrado para manter o composer visível com o novo frame externo.
- Sugestões viram linhas compactas em telas pequenas.
- A orientação inicial foi encurtada sem remover a proposta da Beatrice.
- Toolbar usa controles icon-only com nomes acessíveis quando o espaço diminui.
- O texto do trigger de perspectiva aparece apenas em `lg`, preservando o ícone e o nome acessível.
- Não houve overflow raiz em 320, 390, 768, 1280 e 1440 px nos cenários testados.

## Microinterações

- Entrada de mensagens usa opacidade e translateY de 4px por 200ms.
- Hover e focus usam mudanças pequenas de fundo, borda e opacidade.
- O botão de envio usa feedback de deslocamento de 1px.
- Loading usa pontos com deslocamento máximo de 1px.
- Disclosures usam rotação curta do chevron.
- `prefers-reduced-motion` reduz animações e transições a mudanças praticamente instantâneas.

## Áreas evitadas por conflito com Claude

- Hooks de envio e streaming.
- Providers e contratos de workspace.
- Endpoint, request e parsing de SSE.
- Payloads de mensagens, fontes, intent e auditoria.
- RAG, busca, backend, i18n, deploy e variáveis de ambiente.
- Lógica de retry, cancelamento e restauração de mensagem.
- Auto-scroll em `useWorkspaceState`.
- Novo frame visual externo da rota, preservado e integrado semanticamente.

## Pendências

- Conectar retry ao estado de erro quando o Claude expuser uma ação segura.
- Revisar cancelamento e interrupção quando houver estado explícito no contrato.
- Trocar evidence tier por label localizada quando existir chave canônica aprovada.
- Revisar auto-scroll com reduced motion depois da estabilização do hook.
- Validar a conversa contra respostas reais longas após estabilização de SSE e payloads.

## Validação

- `npm run build`: passou.
- `npx vite build`: passou.
- `npm run test:agent-ui`: 42 testes passaram.
- Testes direcionados da Beatrice: 15 testes passaram.
- Playwright: chat vazio, resposta longa, fontes, evidência, envio vazio, foco, erro, mobile e reduced motion passaram.
- `git diff --check`: passou.
- Nenhum deploy, push ou PR foi realizado.
