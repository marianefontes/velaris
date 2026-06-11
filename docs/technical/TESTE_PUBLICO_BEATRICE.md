# TESTE_PUBLICO_BEATRICE.md

Guia para o teste público da Beatrice, o oráculo do Aetheris/Velaris.
Use este documento para testar você mesmo e para orientar testadores externos.

> Preparado em 2026-06-10. Os links abaixo são placeholders até o deploy manual.

## 1. Links

- Frontend (app): `https://aetheris-app.onrender.com`  _(placeholder, confirmar após deploy)_
- Backend (API): `https://beatrice-chat-server.onrender.com`  _(placeholder, confirmar após deploy)_
- Chat direto: `https://aetheris-app.onrender.com/oracle`

## 2. Status do backend

- Health: `GET https://beatrice-chat-server.onrender.com/api/health`
- Esperado quando saudável:
  - `status: ok`
  - `rag_active: true`
  - `corpus_chunks` maior que 0 (deve ficar em torno de 182)
  - `model: llama-3.3-70b-versatile`
  - `embedder: BAAI/bge-m3`

Se `rag_active` estiver `false` ou `corpus_chunks` for 0, o backend ainda está
carregando o modelo e reconstruindo o índice (primeiro start é lento). Aguarde e
recarregue o health.

## 3. Como testar

1. Abra o app pelo link do frontend.
2. Vá em Chat da Beatrice (`/oracle`) ou clique no botão no topo.
3. Envie uma das perguntas sugeridas abaixo.
4. Observe a resposta, as fontes e o comportamento (lista no item 7).
5. Teste a busca global no campo do topo (atalho ⌘K ou Ctrl+K).

Se a Beatrice estiver indisponível, a interface mostra uma mensagem amigável e
você pode tentar de novo em instantes. Nenhum comando local é necessário.

## 4. Perguntas sugeridas (chat)

Português:
- Qual componente devo usar para mostrar a confiança de uma recomendação de IA?
- Quando eu não devo usar um modal?
- Explique uma decisão de design do Aetheris e o racional por trás dela.
- Qual padrão devo usar para um onboarding?
- Qual a diferença entre botão primário e secundário?
- Quais tokens de cor existem no design system?

Inglês:
- Which component should I use to show AI confidence?
- When should I avoid using a modal?
- Explain a design decision and its trade-offs.
- What pattern should I use for onboarding?

## 5. Termos para testar a busca global

Devem retornar resultados e navegar para a página certa:
- `button` e `botão`
- `modal`
- `confiança` e `confidence`
- `tokens`, `cor`, `spacing`, `espaçamento`
- `onboarding`
- `decisão`
- `reasoning` e `raciocínio`
- `beatrice` e `oráculo`
- `acessibilidade`

E um termo sem sentido para ver o estado vazio:
- `banana cósmica` (deve mostrar "Nenhum resultado encontrado")

## 6. Idiomas

A interface tem pt-BR, pt-PT e en-US (seletor de idioma no topo). A Beatrice
responde no idioma da pergunta. Vale testar em português e inglês.

## 7. O que observar e reportar

Para cada resposta da Beatrice:
- A resposta foi clara e estruturada?
- Citou fontes (chips de origem)?
- Mostrou nível de confiança quando fazia sentido?
- Respondeu no idioma certo?
- Inventou algum componente, token ou decisão que não existe?
- Houve erro, travamento ou resposta vazia?

Para a busca:
- O item certo apareceu no topo?
- Clicar no resultado levou para a página correta?
- Funcionou em português e inglês?

## 8. Feedback

Anote: pergunta usada, idioma, o que esperava, o que aconteceu e um print se
possível. _(Inserir aqui o link do formulário de feedback, se houver.)_

## 9. Limitações conhecidas

- O corpus cobre o design system documentado (componentes, padrões, tokens,
  decisões, diretrizes de acessibilidade). Perguntas fora desse escopo podem
  receber uma resposta honesta de limitação em vez de um palpite.
- O primeiro acesso após hibernação do servidor pode demorar alguns segundos.
- A busca global cobre o catálogo e as páginas; ela não gera respostas, apenas
  leva você ao conteúdo. Para respostas use a Beatrice.
- Há dívida de i18n pré-existente em telas administrativas e de estudo (não
  fazem parte do fluxo público principal).
