# Accessibility Remediation Design

Data: 10 de junho de 2026

## Objetivo

Executar correcoes concretas de acessibilidade no frontend do Aetheris/Velaris, priorizando problemas critical e serious identificados no CODEX Accessibility Audit. A implementacao deve preservar contratos de API, comportamento do chat, roteamento e alteracoes locais existentes.

## Escopo

A remediacao cobre:

- Nome acessivel, estado e operacao por teclado do menu de perfil.
- Labels programaticos para composer e sliders.
- Reduced motion global e estados estaticos equivalentes.
- Skip link e destino principal focavel.
- Focus ring reutilizavel e alvos de toque prioritarios.
- Contraste de navegacao, labels, metadados e controles essenciais.
- Source chips operaveis por teclado e touch.
- Acoes de mensagem visiveis em foco e dispositivos sem hover.
- Overflow tecnico na rota Architecture.
- Navegacao mobile horizontal previsivel.
- Landmarks e headings duplicados em Foundations.
- Loading, erro e disabled anunciados de forma coerente.
- Icones decorativos ocultos de tecnologias assistivas nos componentes alterados.

Backend, RAG, infraestrutura, deploy e contratos externos permanecem fora do escopo.

## Abordagem

A implementacao sera feita em camadas.

1. Corrigir os quatro problemas criticos diretamente nos componentes responsaveis.
2. Consolidar primitivas globais para foco, reduced motion, skip link, contraste e wrapping.
3. Aplicar essas primitivas nos fluxos prioritarios do shell, Beatrice, Perspectives, Foundations e Architecture.
4. Adicionar testes focados onde a semantica e o comportamento de teclado puderem ser validados de forma estavel.
5. Executar build e suites existentes sem alterar backend ou ambiente.

## Semantica e foco

O AppShell continuara sendo o unico landmark `main` das rotas normais. Ele recebera `id="main-content"` e `tabIndex={-1}` para servir como destino do skip link.

Subpaginas imersivas carregadas dentro de Foundations usarao `div` ou `section` em vez de `main`. Seus titulos internos serao rebaixados para `h2`, pois o hub ja fornece o `h1` da pagina.

Menus controlados localmente devem:

- Expor `aria-expanded` e `aria-haspopup`.
- Fechar com Escape.
- Fechar ao selecionar um item quando apropriado.
- Devolver foco ao trigger.
- Identificar o item ativo por texto e estado programatico.

## Formularios

O textarea do chat recebera label persistente por `label` visualmente oculto ou `aria-labelledby`. O botao de envio sera desabilitado quando a entrada estiver vazia ou durante carregamento. O controle de anexo sem implementacao sera marcado como indisponivel sem remover o restante do composer.

Os sliders de Perspectives usarao labels visuais associados por `htmlFor` e IDs estaveis. `aria-valuetext` continuara descrevendo a intensidade, enquanto o nome acessivel identificara a dimensao.

## Source chips

Chips que revelam proveniencia serao botoes. Cada chip controlara um detalhe associado, abrira por Enter ou Espaco pelo comportamento nativo de button, funcionara em touch e fechará com Escape. O payload de sources nao sera alterado.

## Movimento

O bloco global de `prefers-reduced-motion: reduce` interrompera animacoes decorativas continuas, inclusive mesh, pulse, shimmer, cursores e loaders. Estados importantes manterao texto, cor, borda ou forma estaticos. Transicoes e scroll suave serao removidos sob a preferencia.

## Contraste e toque

Textos essenciais em slate 500 e 600 serao promovidos seletivamente para tons mais claros. Labels prioritarios nao usarao tamanhos extremamente pequenos quando forem necessarios para compreender ou operar a interface.

Controles prioritarios terao altura ou area interativa minima de 44 px em mobile, especialmente navegacao, toolbar, composer, acoes de mensagem, chips e seletores.

## Mobile e overflow

Containers flex e grid tecnicos receberao `min-width: 0`. Tabelas e blocos de codigo usarao scroll horizontal interno. URLs, caminhos e tokens poderao quebrar com seguranca sem ampliar o documento.

A navegacao primaria continuara horizontal em telas estreitas, mas tera alvos maiores, indicador visual de continuidade e rolagem automatica do item ativo para a area visivel.

## Estados dinamicos

Loading relevante usara `role="status"` e texto acessivel sem anunciar cada frame de streaming. Erros de mensagem serao identificados como alertas apenas quando a interrupcao for relevante. Estados disabled serao programaticos e visuais.

## Testes

A validacao prevista inclui:

- Testes de componentes para nomes acessiveis, labels, estados expandidos e operacao por teclado.
- Build TypeScript e Vite.
- Suites Vitest existentes.
- Checagem de i18n quando aplicavel.
- Inspecao de landmarks, headings, reduced motion e overflow nas rotas prioritarias.
- Axe automatizado apenas se houver infraestrutura local funcional para isso.

## Entrega

O arquivo `CODEX_ACCESSIBILITY_REMEDIATION_REPORT.md` registrara arquivos alterados, problemas corrigidos, comandos executados, resultados e pendencias reais. Nenhum push, PR ou deploy sera realizado.
