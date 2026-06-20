# ABRAXOS NIGHT INTELLIGENCE REPORT

Data: 2026-06-13 (trabalho autônomo noturno)
Autor da execução: agente de IA (Claude)
Escopo: deixar o Abraxos mais inteligente, robusto e pronto para testes reais com
usuários de perfis, países e idiomas diferentes.

Importante: nenhum commit foi feito. Nenhuma funcionalidade existente foi
removida. Nenhuma identidade visual foi alterada. Nenhuma chave, variável de
ambiente real, deploy ou contrato de API foi tocado. Tudo está pronto para
revisão manual antes de subir.

---

## 1. Resumo executivo

O Abraxos já tinha uma arquitetura forte de compreensão de intenção, RAG, XAI,
perspectivas e validação anti alucinação. O risco principal apontado era o
comportamento com perguntas fora de domínio, mal formuladas, em outro idioma ou
sobre algo não canônico. As melhorias da madrugada atacam exatamente isso, sem
reescrever a arquitetura.

Principais ganhos:
1. Suporte multilíngue real de detecção: além de pt-BR, pt-PT e inglês, agora o
   sistema reconhece espanhol, francês, árabe e marca outros scripts como
   "other", sempre instruindo o LLM a responder no idioma do usuário.
2. Política multilíngue explícita no prompt: o agente nunca recusa só porque a
   pergunta está em espanhol, árabe ou outro idioma, e mantém nomes canônicos.
3. Comportamento fora de escopo mais inteligente: deixou de ser "não encontrei" e
   passou a reconhecer, separar conhecimento geral de canônico, oferecer
   alternativa e sugerir documentação futura.
4. Taxonomia anti alucinação explícita: existe no Velaris, não está no catálogo,
   conceito externo, possível extensão futura, precisa validação humana, fora de
   escopo.
5. Identidade consistente: a voz do agente agora fala Velaris e Abraxos de forma
   uniforme nos prompts, alinhada ao que o código já fazia.
6. Aliases multilíngues: termos comuns de design system em espanhol e francês
   resolvem para os componentes canônicos e para as lacunas conhecidas.
7. Economia de tokens: regras de profundidade e brevidade adicionadas.
8. Testes de comportamento: 16 novos testes cobrindo idiomas, escopo e aliases.

Resultado dos testes: 271 testes do agente passam (eram 255, mais 16 novos), 6 de
metadados de componente passam, contratos de perspectiva passam, capacidades do
Abraxos passam. Uma falha pré existente, não relacionada a este trabalho, foi
encontrada e está documentada na seção 7.

---

## 2. Mapa da inteligência do Abraxos (auditoria)

Onde a inteligência vive hoje:

- Compreensão de intenção e idioma: `agent/understanding.py`
  (classificador determinístico de intenção, extração de entidades, detecção de
  idioma).
- Roteamento: `prompts/intent_router.py` (mapeia intenção para filtros de
  retrieval, top_k e modo catálogo).
- Modelos e tipos: `agent/models.py` (UserLanguage, intents, evidência, etc.).
- Aliases de entidades: `agent/entity_alias_registry.py` (componentes canônicos),
  `agent/unsupported_entities_registry.py` (lacunas conhecidas),
  `agent/external_reference_registry.py` (referências externas confiáveis).
- Conceitos de identidade: `agent/concept_map.py` e `agent/concept_registry.py`
  (já usavam Velaris e Abraxos, com explicação do nome legado).
- Montagem de prompt: `prompts/prompt_builder.py` e camadas em `prompts/system/`,
  `prompts/intents/`, `prompts/responses/`, `prompts/retrieval/`.
- Perfis cognitivos e contratos de perspectiva: `prompts/cognitive_profiles.py`,
  `prompts/perspective_contracts.py`.
- Camada cognitiva: `cognition/` (estratégias, heurísticas, overrides).
- Runtime e geração: `agent/runtime.py`, `server.py` (proxy RAG para Groq, monta o
  system prompt e injeta required_language).
- Validação anti alucinação: `agent/response_validation.py`,
  `agent/evidence_integrity.py`, `agent/reliability_gates.py`,
  `agent/unsupported_entity_detection.py`.
- Testes: `tests/agent/` (unittest), `scripts/` (validações), `evals/cases`.

Fluxo de idioma confirmado: a pergunta passa por `analyze_query`, que define
`understanding.language`. Esse valor vira `required_language` no runtime frame e o
LLM é instruído a responder no idioma do usuário. Respostas determinísticas
(saudação, navegação) usam um sinal binário inglês ou português.

---

## 3. O que foi melhorado, por área

### 3.1 Detecção de idioma (`agent/understanding.py`, `agent/models.py`)
- `UserLanguage` passou a incluir es, fr, ar e other, além de pt-BR, pt-PT, en e
  unknown.
- `_language()` agora detecta:
  - Árabe por faixa de script Unicode (inequívoco).
  - Outros scripts não latinos (cirílico, grego, hebraico, devanagari, tailandês,
    CJK, hiragana, katakana, hangul) como "other".
  - Espanhol por sinais de alta precisão (ñ, ¿, ¡, cómo, qué, cuál, dónde) ou por
    duas ou mais palavras função espanholas sem colisão com português.
  - Francês por sinais de alta precisão e palavras função francesas.
  - Inglês também por palavras função distintivas, resolvendo casos como
    "Do you have a drawer component?" que antes caíam em unknown.
- Decisão de projeto: viés de precisão. Casos ambíguos continuam unknown, porque o
  prompt instrui o LLM a espelhar o idioma mesmo sem pré classificação. Isso evita
  marcar português como espanhol por engano.

### 3.2 Política multilíngue (`prompts/system/multilingual.md`, novo)
- Nova camada de sistema, sempre carregada.
- Regras: responder no idioma da última mensagem, nunca recusar por causa do
  idioma, manter nomes canônicos sem traduzir, explicar limites do corpus sem
  parecer erro, e cair para inglês com aviso curto só se não houver fluência.
- Reforço no runtime frame em `prompts/prompt_builder.py`: mapeamento dos códigos
  de idioma e instrução de detectar e espelhar quando unknown ou other.

### 3.3 Fora de escopo (`prompts/responses/outOfScope.md`, reescrito)
- Substitui a resposta seca por uma estrutura de consultor: reconhecer, declarar o
  limite em linguagem de produto, separar conhecimento geral de canônico, oferecer
  a alternativa documentada mais próxima, sugerir próximo passo seguro e, quando
  fizer sentido, propor documentar como decisão futura.
- Exemplos prontos em inglês e português dentro do próprio template.

### 3.4 Taxonomia anti alucinação (`prompts/system/scopeBoundaries.md`, novo)
- Nova camada de sistema com seis estados de conhecimento: canônico, não está no
  catálogo, conceito externo, possível extensão futura, precisa validação humana,
  fora de escopo.
- Regras anti invenção: lookup exato antes de busca ampla, baixa relevância não
  vira certeza, sem fonte não inventa fonte, "crie um componente" é tratado como
  sugestão de produto e não como entidade existente.

### 3.5 Identidade consistente (38 arquivos de prompt e cognição)
- Antes: 31 arquivos de prompt diziam Aetheris e 8 diziam Beatrice, enquanto
  `responseRules.md` e `concept_map.py` já usavam Velaris e Abraxos. O LLM recebia
  instruções conflitantes sobre que nome falar com o usuário.
- Agora: a voz do agente fala Velaris e Abraxos de forma uniforme em todas as
  camadas de prompt carregadas, incluindo perfis cognitivos e contratos de
  perspectiva.
- Nada de backend foi renomeado de propósito: coleções, chaves de storage,
  caminhos de arquivo, nome de campo `aetheris_insight`, `/aetheris.png` e o termo
  proibido `page_type` permanecem como estavam. A explicação do nome legado em
  `concept_map.py` foi preservada.

### 3.6 Aliases multilíngues (`agent/entity_alias_registry.py`,
`agent/unsupported_entities_registry.py`)
- Adicionados termos em espanhol e francês para componentes canônicos: botón,
  bouton, ventana modal, boîte de dialogue, casilla, tarjeta, tabla, enlace,
  pestañas, lista desplegable, selector de fecha, icono, entre outros.
- Adicionados termos em espanhol e francês para lacunas conhecidas: cajón lateral,
  cuadro combinado, migas de pan, ventana emergente, asistente de pasos, etc.
- Apenas adições de dados, sem alterar a lógica de resolução.

### 3.7 Economia de tokens (`prompts/system/responseRules.md`)
- Nova seção de economia e escalonamento de profundidade: resposta curta para
  pergunta simples, estrutura completa só quando há decisão, comparação, auditoria
  ou pedido explícito, não repetir contexto a cada turno, não listar fontes em
  excesso, preferir resposta determinística exata quando o catálogo já resolve.

### 3.8 Documento de conhecimento (`prompts/knowledge/abraxos-operating-principles.md`, novo)
- Texto curto e reutilizável sobre o que o Abraxos é e não é, como decide, como
  lida com incerteza e evidência, componentes ausentes, conceitos externos,
  recomendação versus regra versus hipótese, economia de tokens e profundidade.
- Inclui exemplos de perguntas e respostas em português, inglês e espanhol para
  perguntas simples, vagas, sobre componente existente, componente inexistente,
  nome adversarial, comparação, acessibilidade e fora de escopo.
- É material de referência. Não é carregado em todo prompt, então não adiciona
  custo de token por requisição. Pode ser ligado ao RAG ou ao registro de
  conceitos depois, se você quiser.

### 3.9 Testes de comportamento (novos)
- `tests/agent/test_multilingual_understanding.py`: detecção de idioma para pt, en,
  es, fr, ar e other, regressão das línguas antigas, resolução de componentes em
  espanhol e francês, não recusa para componente real em outro idioma.
- `tests/agent/test_scope_and_aliases.py`: lacunas conhecidas roteadas como
  unsupported e não inventadas, nomes adversariais tratados como inexistentes,
  aliases em espanhol resolvendo lacunas, fora de escopo classificado, e canônicos
  ainda resolvendo após a adição de aliases.

---

## 4. Arquivos alterados

### 4.1 Lógica do agente (Python)
- `agent/models.py`: UserLanguage estendido.
- `agent/understanding.py`: detecção de idioma multilíngue e helpers.
- `agent/entity_alias_registry.py`: aliases es e fr para componentes.
- `agent/unsupported_entities_registry.py`: aliases es e fr para lacunas.

### 4.2 Montagem de prompt (Python)
- `prompts/prompt_builder.py`: novas camadas no pipeline e política de idioma no
  runtime frame.
- `prompts/cognitive_profiles.py`: identidade Beatrice para Abraxos no texto de
  prompt.
- `prompts/perspective_contracts.py`: uma referência Aetheris para Velaris.

### 4.3 Prompts e conhecimento (Markdown)
- Novos: `prompts/system/multilingual.md`, `prompts/system/scopeBoundaries.md`,
  `prompts/knowledge/abraxos-operating-principles.md`.
- Reescrito: `prompts/responses/outOfScope.md`.
- Ampliado: `prompts/system/responseRules.md`.
- Identidade alinhada em 38 arquivos de `prompts/` e `cognition/`
  (Aetheris para Velaris, Beatrice para Abraxos), prosa de identidade apenas.

### 4.4 Testes
- Novos: `tests/agent/test_multilingual_understanding.py`,
  `tests/agent/test_scope_and_aliases.py`.
- Atualizado: `scripts/test_perspective_contracts.py` (uma string esperada para
  acompanhar o rename de identidade em MANUAL_EVALUATION.md).

### 4.5 Não faz parte deste trabalho noturno
Estavam modificados ou presentes antes da madrugada e não foram tocados por esta
tarefa de inteligência:
- `index.html`, `src/components/VelarisLibraryMap.tsx`, `src/index.css` (parte do
  trabalho visual anterior).
- `src/components/MeshGradientBg.tsx` e os estilos de mesh em `src/index.css`
  vieram do trabalho de animação anterior nesta sessão. Apenas um travessão em
  comentário foi corrigido aqui.
- `.env.production`, `data/aetheris-study.sqlite3`, `public/.htaccess` já estavam
  presentes no início da sessão e não foram alterados.

---

## 5. Testes executados

Baseline antes das mudanças:
- `tests/agent`: 255 testes, OK.
- `tests.test_component_metadata`: 6 testes, OK.

Depois das mudanças:
- `tests/agent`: 271 testes, OK (255 antigos mais 16 novos).
- `tests.test_component_metadata`: 6 testes, OK.
- `scripts/test_perspective_contracts.py`: OK.
- `scripts/test_beatrice_capabilities.py`: OK.
- `npx tsc --noEmit`: sem erros.

Comandos para reproduzir:
```
python3 -m unittest discover -s tests/agent -p 'test_*.py'
python3 -m unittest tests.test_component_metadata
python3 scripts/test_perspective_contracts.py
python3 scripts/test_beatrice_capabilities.py
npx tsc --noEmit
```

---

## 6. Riscos e limitações conhecidas

1. Detecção de idioma é por heurística, com viés de precisão. Uma frase espanhola
   curta com acento compartilhado, como "Necesito un cajón lateral", pode ser
   marcada como pt-BR por causa do ó. A resolução de entidade ainda funciona e o
   prompt instrui o LLM a espelhar o idioma real, então o impacto é baixo.
2. Respostas determinísticas (saudação, small talk, navegação) ainda decidem entre
   inglês e português. Para espanhol, francês ou árabe, essas respostas curtas
   caem em português. As respostas substantivas via LLM são multilíngues. Subir o
   determinístico para mais idiomas é um passo futuro de baixo risco.
3. O documento de conhecimento novo é referência e não está ligado ao RAG nem ao
   registro de conceitos. Ele não muda o comportamento em runtime até ser ligado.
4. A qualidade real das respostas multilíngues depende do modelo Groq
   llama-3.3-70b. As instruções estão corretas, mas a fluência em árabe e outros
   idiomas depende da capacidade do modelo. Recomendo validar com falantes reais.
5. O rename de identidade tocou muitos arquivos de prompt. Está coberto por
   testes, mas vale uma leitura humana das camadas principais
   (`prompts/system/core.md`, `identity.md`, `responseRules.md`,
   `prompts/responses/catalogResponse.md`).

---

## 7. Falha pré existente encontrada (não mascarada)

`scripts/test_agent_layer_contracts.py` falha, e a falha não tem relação com este
trabalho. O teste espera a string
"Trilha de execução indisponível para esta resposta" no arquivo de frontend
`src/beatrice/components/audit/ExecutionTrace.tsx`. O arquivo, que eu não toquei,
hoje usa outra redação: "Sem trilha de execução para esta resposta. Trilhas
aparecem quando o Abraxos executa um fluxo com vários passos."

Ou seja, o texto da interface foi atualizado em algum momento anterior e o teste
não acompanhou. Eu não corrigi de propósito, para não alterar contrato de uma área
não relacionada sem sua decisão. Recomendação na seção 9.

---

## 8. O que precisa de revisão humana amanhã

1. Ler as camadas de prompt principais para confirmar o tom em Velaris e Abraxos.
2. Validar o comportamento multilíngue real com o backend ligado, fazendo
   perguntas em espanhol, francês e árabe e conferindo idioma da resposta e nomes
   canônicos preservados.
3. Decidir se o documento de conhecimento deve entrar no RAG ou no registro de
   conceitos.
4. Decidir o destino da falha pré existente do teste de contrato de camada.
5. Confirmar que a decisão de manter o backend com o termo aetheris continua
   valendo. A voz do usuário agora é Velaris e Abraxos, mas os identificadores
   internos foram preservados.

---

## 9. Recomendações de próximos passos

Baixo risco, alto valor:
- Estender as respostas determinísticas curtas para espanhol e francês, reusando o
  mesmo sinal de idioma já calculado.
- Ligar `prompts/knowledge/abraxos-operating-principles.md` ao corpus, gerando
  chunks, para que perguntas sobre o próprio Abraxos tenham evidência canônica.
- Atualizar `scripts/test_agent_layer_contracts.py` para a redação atual do
  ExecutionTrace, ou alinhar o frontend ao texto esperado, conforme qual dos dois
  for o canônico.

Médio prazo, mais importante para a defesa do TCC:
- Construir o protocolo de avaliação empírica com usuários reais (designers,
  desenvolvedores front end, PMs), incluindo tarefas multilíngues, escalas de
  clareza de XAI, confiança e SUS.
- Rodar sessões com pessoas de Brasil, Portugal e Estados Unidos, e se possível um
  falante de espanhol e um de árabe, para medir exatamente o medo principal: como
  o agente se comporta fora do domínio e em outro idioma.

Decisões grandes não implementadas de propósito:
- Não migrei identificadores de backend de aetheris para velaris, porque há uma
  decisão consciente de manter o backend assim. Fica como recomendação caso você
  queira unificar no futuro, sempre com migração de coleção e storage.

---

## 10. Por que isso deixa o Abraxos mais pronto para usuários internacionais

- Ele reconhece mais idiomas e, mesmo nos que não reconhece, é instruído a
  espelhar o idioma do usuário em vez de recusar.
- Ele explica a ausência de informação canônica com elegância, separando
  conhecimento geral de regra do Velaris, em qualquer idioma.
- Ele diferencia claramente existe no Velaris, não está no catálogo, é conceito
  externo, pode virar extensão futura e precisa validação humana.
- Ele evita alucinar componentes, tokens, rotas, comandos e decisões, com lookup
  exato antes de busca ampla e confiança calibrada.
- Ele fala com uma identidade única e consistente, Velaris e Abraxos, o que reduz
  confusão para qualquer pessoa externa testando o sistema.
- Ele tende a gastar menos tokens, respondendo curto quando a pergunta é simples e
  aprofundando só quando o usuário pede análise.

Fim do relatório.
