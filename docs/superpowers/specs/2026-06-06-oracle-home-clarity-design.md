# Refinamento da home do Aetheris

## Objetivo

Refinar a página inicial para comunicar com clareza que o Aetheris é o design system que estrutura a base de conhecimento consultada pela Beatrice. A página deve apresentar o produto e, ao mesmo tempo, introduzir o artefato acadêmico, sem alterar sua identidade visual ou sua estrutura principal.

## Escopo

A implementação ficará concentrada em `src/components/OracleHomePage.tsx`.

Serão preservados:

* banner institucional
* hero com diagrama orbital
* cards de entrada
* histórico de consultas
* painel lateral
* dark glassmorphism
* identidade roxa
* proporções e ritmo visual atuais

Não serão criadas novas rotas, dependências ou superfícies de produto.

## Direção aprovada

A faixa "Como a Beatrice responde" será posicionada entre a hero e a área "Comece por aqui".

A sequência de leitura será:

1. O banner define o Aetheris como base de conhecimento.
2. A hero apresenta a transformação de documentação em decisão explicável.
3. Os exemplos mostram perguntas reais que a Beatrice pode responder.
4. A faixa explica o fluxo RAG e XAI em cinco etapas.
5. Os cards atuais indicam os pontos de entrada do produto.

## Conteúdo principal

### Banner institucional

Texto em português:

"Aetheris é o design system que estrutura a base de conhecimento usada pela Beatrice para responder dúvidas sobre componentes, padrões, diretrizes, decisões e acessibilidade."

As três propriedades existentes serão mantidas, com textos ajustados para reforçar documentação estruturada, conhecimento versionado e respostas explicáveis.

### Hero

Título:

"Transforme documentação de design system em decisões explicáveis."

Subtítulo:

"O Oráculo conecta componentes, padrões, diretrizes e decisões documentadas para gerar respostas contextualizadas, rastreáveis e acessíveis."

CTAs:

* "Perguntar à Beatrice", com destino para `/oracle`
* "Entender o funcionamento", com destino para `/reasoning`

### Exemplos de perguntas

Uma área de microcopy aparecerá abaixo dos CTAs, com quatro exemplos em chips não interativos:

* "Qual componente devo usar para uma ação destrutiva em um fluxo de pagamento?"
* "Quando usar um drawer em vez de um modal?"
* "Qual padrão ajuda a estruturar um onboarding?"
* "Como justificar uma decisão de acessibilidade?"

Os chips servirão como exemplos de escopo, sem assumir comportamento de botão.

### Fluxo da Beatrice

A faixa terá o título "Como a Beatrice responde" e usará uma lista ordenada com cinco etapas:

1. Pergunta do usuário
2. Recuperação no Aetheris
3. Fontes relevantes
4. Resposta explicável
5. Confiança e rastreabilidade

A frase de apoio será:

"Cada resposta pode apresentar fonte, contexto de uso, justificativa e nível de confiança."

No desktop, as etapas formarão uma linha horizontal. No tablet, usarão uma grade fluida. No mobile, serão empilhadas ou distribuídas em uma coluna compacta, sem rolagem horizontal obrigatória.

## Responsividade

O banner institucional deixará de usar a composição horizontal em larguras intermediárias nas quais a descrição fica comprimida. A mudança para a disposição horizontal ocorrerá apenas quando houver largura suficiente.

A hero continuará usando o diagrama orbital existente. Os exemplos e a faixa de fluxo usarão quebra automática e espaçamento reduzido em telas pequenas.

O painel contextual continuará visível apenas em telas largas, conforme o comportamento atual.

## Acessibilidade

* links e botões terão foco visível
* ícones decorativos terão `aria-hidden`
* a faixa usará `section`, título associado e lista ordenada
* os chips de exemplo serão texto, não controles falsos
* contraste e tamanhos mínimos seguirão os tokens atuais
* o significado das etapas não dependerá apenas dos ícones

## Internacionalização

O conteúdo será atualizado para `pt-BR`, `pt-PT` e `en-US` dentro da estrutura local `COPY`. A formulação acadêmica será preservada nas três localidades, com adaptações linguísticas naturais.

## Verificação

Serão executados:

* build TypeScript e Vite
* inspeção visual em desktop, tablet e mobile
* teste dos destinos dos dois CTAs
* verificação de overflow horizontal
* verificação de foco por teclado
* busca por travessões nos arquivos alterados

## Limites

Este refinamento não modifica o chat, o mecanismo RAG, o painel de raciocínio, as métricas do design system ou a persistência do histórico.
