# CODEX Visual QA Checklist

Data planejada para reteste: 11 de junho de 2026

## Preparação

- [ ] Revisar e integrar o diff final do Claude.
- [ ] Confirmar que não há conflitos ou arquivos parcialmente resolvidos.
- [ ] Rodar build de produção.
- [ ] Testar console sem erros.
- [ ] Testar em 1440 x 1000, 1280 x 800, 768 x 1024, 390 x 844 e 320 x 568.
- [ ] Testar português e inglês; incluir português de Portugal se disponível.
- [ ] Testar mouse, teclado e touch.
- [ ] Testar `prefers-reduced-motion: reduce`.
- [ ] Testar zoom de 200%.

## 1. Página inicial

- [ ] Proposta principal aparece antes de conteúdo secundário em mobile.
- [ ] Existe um único foco dominante acima da dobra.
- [ ] Faixa do Design System não compete com o hero.
- [ ] Visual orbital não encobre texto nem ações.
- [ ] Rail contextual não pesa mais que o conteúdo principal.
- [ ] Métricas e labels passam contraste.
- [ ] Não há animação persistente com reduced motion.

## 2. Components

- [ ] Workbench começa alinhado ao shell padrão.
- [ ] Categorias têm estado ativo claro.
- [ ] Tabs podem ser usadas por teclado.
- [ ] Navegação horizontal indica conteúdo adicional em mobile.
- [ ] Exemplos mostram hover, focus, disabled, loading, empty e error.
- [ ] Metadados não ficam abaixo do tamanho mínimo legível.
- [ ] Nenhum controle é apenas demonstrativo sem indicação.

## 3. Patterns

- [ ] Existe apenas um `h1`.
- [ ] O hero de Foundations não é repetido.
- [ ] Cards de padrão seguem a mesma superfície.
- [ ] Textos longos mantêm largura de leitura.
- [ ] Código e exemplos quebram corretamente em mobile.
- [ ] Links e ações têm foco visível.

## 4. Tokens

- [ ] Existe apenas um `h1`.
- [ ] Tokens exibidos correspondem aos usados no produto.
- [ ] Cores apresentam nome semântico, valor e uso.
- [ ] Contraste de pares principais está documentado e validado.
- [ ] Radius, spacing e shadow não apresentam variantes órfãs.
- [ ] Exemplos não introduzem novos hardcodes.

## 5. Guidelines/Principles

- [ ] Existe apenas um `main` e um `h1`.
- [ ] Hierarquia de headings é sequencial.
- [ ] O conteúdo não começa com dois heros.
- [ ] Navegação local mantém item ativo visível.
- [ ] Princípios têm largura de leitura confortável.
- [ ] Exemplos de acessibilidade refletem o runtime atual.

## 6. Reasoning

- [ ] Título e descrição seguem a escala padrão.
- [ ] Blocos de raciocínio são escaneáveis.
- [ ] Tipografia editorial tem papel consistente.
- [ ] Etapas não dependem apenas de cor.
- [ ] Conteúdo expansível funciona com teclado.
- [ ] Mobile preserva ordem e relações entre etapas.

## 7. Dashboard

- [ ] Rota de dashboard resolve para a tela correta.
- [ ] Cards prioritários aparecem antes de métricas secundárias.
- [ ] Grid não produz colunas estreitas demais.
- [ ] Estados sem dados explicam a próxima ação.
- [ ] Métricas têm labels legíveis.
- [ ] Filtros preservam seleção e foco.

## 8. Beatrice Chat

- [ ] Existe heading principal acessível.
- [ ] Textarea tem label acessível.
- [ ] Envio vazio está disabled visual e logicamente.
- [ ] Botão de anexo funciona ou não aparece.
- [ ] Mensagens de usuário e Beatrice têm hierarquia clara.
- [ ] Ações de mensagem aparecem em hover e foco.
- [ ] Ações têm alvo adequado em touch.
- [ ] Fontes abrem por mouse, Enter, Espaço e touch.
- [ ] Confiança não depende apenas de cor.
- [ ] Loading é calmo e anunciado.
- [ ] Erro preserva mensagem e oferece retry.
- [ ] Scroll inicial não oculta orientação importante.
- [ ] Composer respeita safe area em mobile.
- [ ] Rail pode ser ignorado ou recolhido sem perda da conversa.
- [ ] Reduced motion remove pulse e deslocamentos.

## 9. Busca

- [ ] Busca abre por clique e atalho documentado.
- [ ] Campo possui label acessível.
- [ ] Focus entra no campo ao abrir.
- [ ] Escape fecha e devolve foco ao trigger.
- [ ] Resultados podem ser percorridos com setas e Tab conforme o padrão escolhido.
- [ ] Item ativo é anunciado.
- [ ] Empty, loading e error são distintos.
- [ ] Queries longas e sem resultado não quebram layout.
- [ ] Mobile não comprime marca, locale ou perfil.

## 10. Mobile

- [ ] Nenhuma rota cria overflow horizontal raiz.
- [ ] Architecture não excede a largura da viewport.
- [ ] Topbar funciona em 320 px.
- [ ] Item ativo da navegação permanece visível.
- [ ] Alvos principais têm pelo menos 44 x 44 px.
- [ ] Teclado virtual não encobre composer ou campos.
- [ ] Conteúdo não depende de hover.
- [ ] Cards não viram colunas excessivamente longas sem agrupamento.

## 11. Tema visual

- [ ] Fundo, superfícies e elevação seguem tokens.
- [ ] Violeta é usado como acento, não como preenchimento dominante.
- [ ] Não há glow, gradiente ou glass sem função.
- [ ] Bordas são perceptíveis sem parecer pesadas.
- [ ] Radius corresponde ao papel do componente.
- [ ] Páginas editoriais continuam pertencendo ao mesmo produto.
- [ ] Tema parece calmo em uma sessão longa.

## 12. Microinterações

- [ ] Hover não move layout.
- [ ] Focus não depende de hover.
- [ ] Transições usam propriedades específicas.
- [ ] Duração é consistente e curta.
- [ ] Mensagens entram sem bounce ou escala excessiva.
- [ ] Loading não usa movimento contínuo desnecessário.
- [ ] Reduced motion preserva significado sem animação.

## 13. Estados vazios

- [ ] Estado vazio explica contexto.
- [ ] Existe próxima ação ou orientação.
- [ ] Empty não parece erro.
- [ ] Ilustração não domina o conteúdo.
- [ ] Estado é responsivo e acessível.
- [ ] Beatrice, busca, dashboard e resultados têm mensagens coerentes.

## 14. Estados de erro

- [ ] Erro diz o que ocorreu em linguagem útil.
- [ ] Retry está disponível quando aplicável.
- [ ] Dados digitados são preservados.
- [ ] Erro não depende apenas de vermelho.
- [ ] Foco vai ao erro somente quando necessário.
- [ ] Detalhe técnico é progressivo.
- [ ] Chat diferencia rede, serviço e validação.

## 15. Loading

- [ ] Loading reserva espaço e evita layout shift.
- [ ] Processos longos mostram status textual.
- [ ] Regiões atualizadas usam `aria-live` com moderação.
- [ ] Skeleton corresponde à estrutura real.
- [ ] Usuário pode cancelar quando o processo permitir.
- [ ] Reduced motion desativa shimmer e pulse.

## 16. Foco por teclado

- [ ] Skip link é o primeiro elemento útil.
- [ ] Ordem de Tab segue a ordem visual.
- [ ] Todo elemento interativo tem focus visível.
- [ ] Cards clicáveis são semanticamente links ou botões.
- [ ] Menus fecham com Escape.
- [ ] Modais prendem e devolvem foco.
- [ ] Tabs seguem comportamento acessível.
- [ ] Nenhum fluxo essencial exige mouse.

## 17. Renomeação Velaris

- [ ] Título da aplicação usa Velaris.
- [ ] Manifest usa Velaris.
- [ ] Nome curto instalado usa Velaris.
- [ ] Alt text público usa Velaris.
- [ ] Exemplos de integração usam Velaris.
- [ ] Metadados sociais e ícones foram revisados.
- [ ] Assets públicos legados têm plano, sem links quebrados.

## 18. Ausência de Aetheris/Eteris onde não deveria aparecer

- [ ] Busca textual identifica todas as ocorrências restantes.
- [ ] Cada ocorrência está classificada como pública, documentação, compatibilidade ou dado histórico.
- [ ] Nenhuma ocorrência pública não aprovada permanece.
- [ ] Chaves internas não foram renomeadas sem migração.
- [ ] Storage antigo continua carregando preferências.
- [ ] Eventos e integrações preservam compatibilidade.
- [ ] Screenshots e assets não exibem marca antiga.

## Encerramento

- [ ] Rodar Axe nas rotas principais sem violações critical ou serious.
- [ ] Confirmar ausência de erros no console.
- [ ] Confirmar build de produção.
- [ ] Registrar screenshots desktop e mobile para comparação.
- [ ] Revisar checklist com produto, engenharia e acessibilidade.
