# CODEX Beatrice UX Audit

Data da auditoria: 10 de junho de 2026

Escopo: auditoria visual e de experiência. Nenhum arquivo, texto, endpoint, fluxo SSE, lógica, i18n ou componente do chat foi alterado.

## Diagnóstico geral

A Beatrice já comunica profundidade, contexto e capacidade. A separação entre usuário e assistente é compreensível, o composer é reconhecível e o produto trata fontes e confiança como partes da resposta. Esses são fundamentos valiosos.

O principal problema é densidade. A interface tenta mostrar comando, estado, contexto, evidência, ações e navegação ao mesmo tempo. Em desktop, isso cria um cockpit competente, porém pouco calmo. Em mobile, o conteúdo central continua utilizável, mas controles e contexto ficam comprimidos ou desaparecem da primeira visão.

A experiência premium desejada não exige mais efeitos. Exige menos competição, melhor priorização e estados mais confiáveis.

## O que preservar

- Distinção visual clara entre mensagem do usuário e resposta da Beatrice.
- Coluna de conversa com largura controlada.
- Divulgação explícita de fonte e confiança.
- Contexto lateral em desktop quando ele realmente ajuda a resposta.
- Composer persistente e visualmente reconhecível.
- Uso de texto junto a estados importantes.
- Animações de mensagem que já usam `motion-safe`.
- `ExecutionSummaryBanner` com `role="status"` e `aria-live`.
- Identidade escura e violeta, sem transformar o chat em uma interface genérica.

## Problemas de UX

### Muitos pontos de entrada antes da conversa

Há aproximadamente 15 comandos e outros prompts sugeridos. O volume ajuda usuários avançados, mas aumenta a carga cognitiva de primeira sessão.

Recomendação:

- Mostrar de 3 a 5 ações contextuais.
- Agrupar o restante em “Mais comandos”.
- Adaptar sugestões ao contexto atual.

### Botão de anexo comunica uma função que não executa

O botão com ícone de clipe em `src/beatrice/components/chat/ChatInput.tsx` aparece como ação disponível, mas não possui comportamento associado.

Impacto:

- Quebra confiança.
- Produz tentativa sem resposta.
- Faz o composer parecer incompleto.

Até a função existir, a melhor opção é remover o affordance ou marcá-lo explicitamente como indisponível, depois do trabalho do Claude.

### Envio vazio parece permitido

O hook bloqueia submissões vazias, porém o botão de envio não fica visualmente disabled apenas porque o campo está vazio.

Impacto:

- Estado visual e estado lógico divergem.
- O usuário descobre a regra por ausência de resposta.

### Campo depende de placeholder

O textarea usa placeholder, mas não possui label visível ou nome acessível explícito. Placeholder não substitui label e desaparece durante a digitação.

### Fontes dependem de hover/title

Source chips são renderizados como elementos não interativos com `title`. Isso impede uma experiência equivalente para teclado e touch.

### Ações de mensagem têm alvos pequenos

Copiar, feedback e outras ações usam ícones compactos, pouco padding e foco pouco evidente. Os alvos ficam abaixo do recomendado para touch.

### Estado mobile perde contexto inicial

O comportamento de scroll leva o usuário à resposta corrente, o que pode ocultar toolbar, comandos e orientação inicial. Isso é útil em conversas longas, mas precisa distinguir primeira entrada de retomada.

### Falta uma hierarquia principal explícita

Na tela com conversa ativa, não foi encontrado um `h1` claro para a página. A experiência visual funciona, mas landmarks e navegação assistiva ficam menos previsíveis.

## Problemas visuais

### Rail lateral acumula superfícies

Vários cards laterais competem com a resposta. O rail deve apoiar, não igualar o peso do conteúdo principal.

### Chips dominam a leitura

Comandos, fontes, confiança, estados e ações usam formas compactas semelhantes. A repetição de pills torna difícil distinguir o que é ação, evidência ou status.

### Metadados muito pequenos

Labels entre 8 e 10 px reduzem legibilidade e fazem a interface parecer tecnicamente densa, não necessariamente sofisticada.

### Contraste insuficiente em labels secundários

O teste automatizado sinalizou contraste em labels do rail, metadados e estados auxiliares.

### Composer tem elementos de importância desigual no mesmo nível

Anexo, campo, modo e envio precisam de uma ordem clara. O envio deve ser dominante; opções auxiliares devem recuar.

### Movimento contínuo não respeita sempre reduced motion

Pulse e indicadores de atividade permanecem animados em alguns componentes mesmo com preferência de movimento reduzido.

## Sugestões de microinterações

### Entrada discreta de mensagens

- Opacidade de 0 para 1.
- Deslocamento vertical máximo de 4 px.
- Duração entre 160 e 220 ms.
- Sem escala, bounce ou glow.

### Feedback sutil em envio

- Botão muda de send para estado de progresso sem alterar tamanho.
- Campo mantém o texto até a submissão ser confirmada.
- Falha restaura o estado e preserva a mensagem.

### Loading calmo

- Indicador textual curto com três pontos ou skeleton estrutural.
- Região com `aria-live="polite"`.
- Sem pulse contínuo quando `prefers-reduced-motion: reduce`.

### Hover/focus refinado

- Hover altera borda e fundo em baixa amplitude.
- Focus usa ring visível com offset.
- Ações de mensagem aparecem também em `focus-within`, não apenas em hover.

### Transição de source chips

- Expansão por opacidade e altura, sem spring.
- Primeiras fontes visíveis; excedentes agrupados.
- Estado expandido persistente durante leitura.

### Respeito a prefers-reduced-motion

- Desativar translate, pulse e shimmer.
- Manter apenas mudanças instantâneas de opacidade/estado.
- Garantir que nenhum feedback dependa exclusivamente de animação.

## Sugestão de estrutura visual ideal

### Mensagem do usuário

- Alinhada à direita.
- Largura máxima entre 28 e 34 rem.
- Surface diferenciada sem brilho.
- Texto entre 15 e 16 px.
- Timestamp e ações somente quando úteis.

### Mensagem da Beatrice

- Alinhada à coluna de leitura.
- Menos dependente de uma grande bubble.
- Corpo com largura aproximada de 65-72 caracteres.
- Hierarquia clara para resposta, listas, citações e raciocínio.
- Ações agrupadas ao final.

### Fontes

- Bloco “Fontes” abaixo da resposta.
- Uma ou duas fontes prioritárias visíveis.
- Ação explícita para ver todas.
- Nome, origem e trecho disponíveis por teclado e touch.

### Confiança

- Label textual: alta, média, baixa ou não determinada.
- Percentual apenas se for metodologicamente defensável.
- Explicação curta do que influenciou a confiança.
- Cor como reforço, nunca como único sinal.

### Input

- Label acessível.
- Área de digitação dominante.
- Envio disabled quando vazio.
- Anexo apenas quando funcional.
- Opções avançadas em divulgação progressiva.
- Altura e safe-area adequadas em mobile.

### Estados

- Empty: proposta, 3 sugestões relevantes e orientação.
- Loading: status calmo e anunciável.
- Streaming: cursor ou indicador discreto, sem deslocar layout.
- Error: mensagem preservada, explicação e retry.
- Offline/indisponível: distinção clara entre problema local e serviço.
- Cancelado: estado explícito com possibilidade de reenviar.

## Recomendações para aplicar depois do Claude

1. Corrigir nome acessível do textarea e a hierarquia de heading.
2. Remover ou implementar o botão de anexo.
3. Sincronizar disabled visual e lógico do envio.
4. Reduzir sugestões iniciais para um conjunto contextual.
5. Tornar fontes acessíveis por clique, teclado e touch.
6. Aumentar alvos e foco das ações de mensagem.
7. Rebaixar visualmente o rail e permitir colapso persistente.
8. Padronizar fonte, confiança e evidência como um único padrão.
9. Corrigir contraste de metadados e evitar texto essencial abaixo de 11 px.
10. Ajustar scroll inicial em mobile e respeitar reduced motion em todos os indicadores.
