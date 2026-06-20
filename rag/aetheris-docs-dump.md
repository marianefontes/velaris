# Aetheris Design System — Corpus Dump (TSX Source)

> **Total chunks:** 377
> **Extractor:** 3.0.0-intelligence-layer + institutional knowledge supplement
> **Embedding model:** BAAI/bge-m3

---

## [COMPONENT] Button
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8961

**Structure:** Rótulo curto, alvo mínimo de 44px e ícone opcional.
**Logic:** Use uma ação primária por região focal e rebaixe escolhas concorrentes.
**Context Of Use:** Section: action
**When To Use:** Use apenas uma ação primária por região visual para manter a hierarquia clara. Use loading quando a ação disparar uma operação assíncrona. Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca. Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados. Mantenha o texto do botão curto, direto e orientado à ação.
**When Not To Use:** Não use Button para navegação textual simples; use Link quando a ação for apenas navegar. Não coloque múltiplos botões primary competindo na mesma área. Não use disabled sem explicar por que a ação está indisponível. Não use intents positive ou negative como decoração; a aparência deve corresponder à consequência real. Não altere estilos manualmente fora dos tokens do design system.
**Trade Offs:** Excesso de botões primários dilui a hierarquia e aumenta hesitação.
**Accessibility:** Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span. Enter e Espaço disparam a ação. O indicador de foco permanece visível antes e depois do clique. O texto do botão deve dizer o que acontece ao clicar. Se só houver ícone, inclua aria-label equivalente.
**Rag Relation:** Permite que Abraxos recomende hierarquia de ações com evidência de uso e estado.
**Aetheris Insight:** Uma ação primária deve tornar a decisão mais óbvia, não apenas mais colorida.

---

## [COMPONENT] Toggle/Switch
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9437

**Structure:** Trilho, indicador móvel, rótulo persistente e estado textual quando necessário.
**Logic:** Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional.
**Context Of Use:** Section: action
**When To Use:** Use Switch para configurações binárias que entram em vigor imediatamente. Escreva o rótulo como a condição controlada, por exemplo, “Reduzir animações”. Mostre o estado atual por posição, contraste e texto quando a consequência não for óbvia. Posicione o Switch próximo da configuração ou conteúdo que ele altera. Confirme persistência ou falha sem reverter o estado silenciosamente.
**When Not To Use:** Não use Switch quando a alteração depender de um botão Salvar ou Confirmar. Não use Switch para escolher entre três ou mais alternativas; use Radio ou Select. Não use rótulos vagos como “Ativar” sem indicar o que será ativado. Não use Switch para uma mudança destrutiva sem uma etapa de confirmação adequada. Não mantenha o estado otimista quando a atualização falhar; explique e restaure o valor anterior.
**Trade Offs:** Sem rótulo explícito, o usuário pode não entender o que o estado controla.
**Accessibility:** Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela. Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário. O rótulo deve dizer o que muda ao alternar — por exemplo, "Notificações por e-mail", não só "Ligado".
**Rag Relation:** Evita que Abraxos confunda alternância imediata com checkbox de confirmação.
**Aetheris Insight:** O estado deve ser compreensível antes e depois da interação.

---

## [COMPONENT] Checkbox
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8912

**Structure:** Caixa, indicador de seleção, rótulo clicável e apoio opcional.
**Logic:** Cada opção deve continuar válida mesmo quando as demais não são selecionadas.
**Context Of Use:** Section: action
**When To Use:** Use Checkbox quando cada opção puder ser selecionada de forma independente. Amplie a área clicável incluindo o rótulo e preserve um alvo mínimo de 44px. Use indeterminate apenas para representar seleção parcial em grupos hierárquicos. Explique como o estado indeterminate se relaciona com os itens filhos do grupo. Mantenha consentimentos desmarcados até uma ação explícita do usuário.
**When Not To Use:** Não use Checkbox para opções mutuamente exclusivas; use Radio Button. Não use Checkbox para uma configuração com efeito imediato quando Switch comunicar melhor a mudança. Não pré-selecione consentimento ou aceite obrigatório em nome do usuário. Não trate indeterminate como uma terceira resposta persistente. Não esconda se a seleção é obrigatória ou opcional.
**Trade Offs:** Listas longas sem agrupamento elevam custo de leitura e comparação.
**Accessibility:** Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente. Espaço marca ou desmarca. Em formulários, Enter envia sem alternar a caixa por acidente. Quando parte de um grupo está marcada, comunique o estado "parcialmente selecionado" ao leitor de tela.
**Rag Relation:** Oferece evidência sobre seleção múltipla e consentimento em respostas do Abraxos.
**Aetheris Insight:** Checkbox representa inclusão independente, não mudança de modo.

---

## [COMPONENT] Radio Button
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8986

**Structure:** Grupo nomeado, círculos de seleção e rótulos completos.
**Logic:** Expor todas as opções reduz memória de trabalho e facilita comparação direta.
**Context Of Use:** Section: action
**When To Use:** Use Radio Button para duas a cinco alternativas mutuamente exclusivas. Mantenha todas as opções visíveis quando a comparação entre elas ajudar a decisão. Agrupe opções relacionadas com legend e navegação por setas. Defina uma opção inicial apenas quando ela for segura, reversível e realmente recomendada. Escreva rótulos paralelos para que as diferenças entre alternativas sejam fáceis de comparar.
**When Not To Use:** Não use Radio Button para seleção múltipla. Não apresente uma lista extensa que torne a página difícil de percorrer; use Select. Não deixe o grupo sem contexto ou pergunta que explique a escolha. Não pré-selecione uma alternativa que implique consentimento, custo ou risco. Não use Radio Button para uma configuração binária com efeito imediato; prefira Switch.
**Trade Offs:** Muitas opções ocupam espaço e tornam o grupo difícil de escanear.
**Accessibility:** As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde. Setas movem o foco entre opções do mesmo grupo. Tab leva para o próximo campo fora do grupo. Espaço seleciona a opção focada. Apenas uma opção pode estar marcada por vez no grupo.
**Rag Relation:** Ajuda Abraxos a distinguir escolha exclusiva de seleção múltipla.
**Aetheris Insight:** Se as alternativas precisam ser comparadas, mantenha-as visíveis.

---

## [COMPONENT] Selectable Chip / Badge
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9099

**Structure:** Pílula compacta com rótulo, ícone opcional e indicador de seleção.
**Logic:** Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente.
**Context Of Use:** Section: action
**When To Use:** Use chips selecionáveis para filtros rápidos, tags ou atributos curtos. Mantenha o estado selecionado evidente por preenchimento, borda e aria-pressed. Limite o conjunto para que todas as opções continuem fáceis de escanear. Permita quebra de linha e remoção previsível quando vários chips estiverem selecionados. Forneça um rótulo para o grupo quando os chips representarem uma pergunta ou filtro comum.
**When Not To Use:** Não use Chip como ação primária ou substituto de Button. Não misture badges informativos e chips interativos com aparência idêntica. Não use rótulos longos nem dezenas de chips em uma única linha. Não dependa apenas da cor para diferenciar chips selecionados e não selecionados. Não use uma nuvem extensa de chips quando busca ou Select oferecer melhor descoberta.
**Trade Offs:** Muitos chips criam ruído e quebram a hierarquia da página.
**Accessibility:** Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela. Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes. Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado.
**Rag Relation:** Documenta filtros compactos que Abraxos pode sugerir em superfícies densas.
**Aetheris Insight:** Chip é uma escolha compacta; badge passivo não deve parecer clicável.

---

## [COMPONENT] Input / Text Input
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8878

**Structure:** Label, controle, apoio, indicador opcional e mensagem de erro.
**Logic:** O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução.
**Context Of Use:** Section: input
**When To Use:** Use Text Input para valores curtos que cabem em uma linha. Mantenha label persistente e use placeholder apenas como exemplo. Escolha type, inputMode e autocomplete de acordo com o dado solicitado. Apresente helper text antes da validação quando formato ou restrição puderem evitar erro. Preserve o valor informado quando a validação ou o envio falhar.
**When Not To Use:** Não use Input para descrições extensas; use Text Area. Não substitua o label por placeholder, pois ele desaparece durante a digitação. Não apresente erro sem explicar como o valor pode ser corrigido. Não valide cada caractere de forma agressiva quando o valor ainda estiver incompleto. Não peça dois conceitos diferentes no mesmo campo.
**Trade Offs:** Validação tardia pode obrigar o usuário a reconstruir todo o contexto.
**Accessibility:** Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo. Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto. Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável.
**Rag Relation:** Fornece ao Abraxos regras de entrada textual e validação contextual.
**Aetheris Insight:** O campo deve explicar o formato antes de apontar o erro.

---

## [COMPONENT] Text Area
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8629

**Structure:** Label, área redimensionável, apoio e contador opcional.
**Logic:** A altura inicial comunica a profundidade esperada da resposta.
**Context Of Use:** Section: input
**When To Use:** Use Text Area para descrições, justificativas, comentários e prompts extensos. Dimensione a altura inicial de acordo com a profundidade esperada da resposta. Ofereça contador ou limite apenas quando ele afetar a tarefa. Mantenha label e instruções visíveis durante toda a edição. Preserve rascunhos quando envio, conexão ou validação falharem.
**When Not To Use:** Não use Text Area para valores curtos ou dados estruturados. Não bloqueie redimensionamento quando o usuário puder precisar de mais espaço. Não use um campo muito alto sem necessidade, pois ele domina a página. Não dependa de placeholder para explicar o objetivo do texto. Não corte conteúdo silenciosamente quando houver limite de caracteres.
**Trade Offs:** Campos muito altos dominam a página; campos baixos escondem a expectativa.
**Accessibility:** Rótulo visível descrevendo o que o usuário deve escrever — ex.: "Descrição do problema". Limite de caracteres e orientações ficam ligados ao campo, não como texto solto sem relação. Enter cria nova linha. Se Enter enviar o formulário, documente isso perto do campo.
**Rag Relation:** Ajuda Abraxos a orientar captura de contexto sem confundir com chat.
**Aetheris Insight:** O tamanho inicial do campo é parte da instrução.

---

## [COMPONENT] Select/Dropdown
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8923

**Structure:** Label, trigger, valor atual, lista e indicadores de seleção.
**Logic:** Economiza espaço, mas transfere a comparação para um painel temporário.
**Context Of Use:** Section: input
**When To Use:** Use Select para escolha única em listas médias ou longas com opções conhecidas. Mostre o valor selecionado no trigger e preserve busca quando a lista for extensa. Ordene as opções por frequência, lógica ou sequência reconhecível. Mostre um estado inicial claro quando nenhuma opção estiver selecionada. Preserve navegação por teclado, typeahead e foco previsível na lista.
**When Not To Use:** Não use Select para duas opções simples que cabem em Radio Button. Não esconda alternativas importantes que precisam ser comparadas lado a lado. Não use uma opção desabilitada como substituto de label ou instrução. Não esconda o motivo de uma opção indisponível. Não misture ações, navegação e valores selecionáveis na mesma lista.
**Trade Offs:** Esconder opções reduz descoberta e torna comparação mais lenta.
**Accessibility:** Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela. Se customizar, implemente abertura/fechamento, navegação por setas e opção selecionada anunciável. Setas navegam opções; Enter confirma; Escape fecha sem perder o valor já selecionado.
**Rag Relation:** Permite recomendações calibradas entre Select e Radio Button.
**Aetheris Insight:** Use Select para escala, não para esconder decisões importantes.

---

## [COMPONENT] Date Picker
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8876

**Structure:** Campo formatado, botão de calendário, grade mensal e navegação temporal.
**Logic:** Entrada digitável acelera especialistas; calendário apoia descoberta e contexto.
**Context Of Use:** Section: input
**When To Use:** Use Date Picker quando calendário, disponibilidade ou intervalo ajudarem a escolha. Permita entrada digitada para usuários que já conhecem a data. Comunique formato, limites e datas indisponíveis antes da confirmação. Respeite locale, fuso horário e convenções de formato do contexto. Preserve valores digitados válidos ao alternar entre campo e calendário.
**When Not To Use:** Não force navegação mensal para datas muito distantes. Não use apenas um calendário visual sem suporte completo a teclado. Não aceite uma data inválida sem indicar o formato ou limite correto. Não normalize uma data ambígua sem informar o valor interpretado. Não aceite um intervalo cuja data final anteceda a inicial sem explicar o erro.
**Trade Offs:** Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta.
**Accessibility:** Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse. Mostre o formato esperado (ex.: DD/MM/AAAA) e valide com mensagem clara quando a data for inválida. No calendário, setas navegam dias; hoje, selecionado e desabilitado devem ser anunciáveis.
**Rag Relation:** Dá ao Abraxos evidência sobre escolha temporal e restrições de intervalo.
**Aetheris Insight:** Calendário e texto devem ser caminhos complementares.

---

## [COMPONENT] Form Field
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8916

**Structure:** Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade.
**Logic:** Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento.
**Context Of Use:** Section: input
**When To Use:** Use Form Field para manter label, controle, ajuda e validação como uma unidade. Associe hint e erro ao controle com ids estáveis e aria-describedby. Reserve espaço para mensagens quando mudanças de layout prejudicarem a leitura. Comunique obrigatoriedade e opcionalidade de forma consistente antes do controle. Após envio inválido, leve foco ao resumo ou primeiro campo com erro de forma previsível.
**When Not To Use:** Não duplique labels ou mensagens já fornecidas pelo controle filho. Não comunique erro apenas pela cor da borda. Não use Form Field para conteúdo somente leitura sem comportamento de formulário. Não apresente erro antes que o usuário tenha oportunidade razoável de preencher o campo. Não apague valores válidos ou inválidos quando o formulário falhar.
**Trade Offs:** Abstração rígida pode limitar layouts especiais; preserve slots claros.
**Accessibility:** Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente. Instrução, contador de caracteres e erro ficam associados ao campo na ordem que faz sentido ler. Tab segue a ordem visual. Campos que aparecem condicionalmente entram sem pular etapas.
**Rag Relation:** Funciona como evidência estrutural para Abraxos montar formulários coerentes.
**Aetheris Insight:** A validação pertence ao campo como conjunto, não apenas ao input.

---

## [COMPONENT] Link
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8696

**Structure:** Texto descritivo, indicador opcional de destino externo e foco visível.
**Logic:** Destino é navegação; mudança no estado atual é ação e deve usar Button.
**Context Of Use:** Section: navigation
**When To Use:** Use Link quando o resultado da interação for navegar para outro destino. Escreva um rótulo que descreva o destino mesmo fora do parágrafo. Sinalize download, nova janela ou destino externo quando isso afetar a expectativa. Mantenha o destino válido e previsível mesmo quando o texto aparecer fora do contexto original. Use alvo confortável em links isolados ou usados como ação recorrente em touch.
**When Not To Use:** Não use Link para enviar formulários ou alterar apenas o estado local. Não use textos genéricos como “clique aqui” ou “saiba mais” sem contexto. Não remova sublinhado ou foco sem oferecer outra indicação clara de interatividade. Não abra nova janela sem sinalizar essa mudança no rótulo ou contexto próximo. Não simule disabled removendo href; explique indisponibilidade com outro padrão.
**Trade Offs:** Links genéricos como 'saiba mais' perdem contexto fora do parágrafo.
**Accessibility:** Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável. O texto descreve para onde vai ou o que acontece — evite "clique aqui" ou "saiba mais" soltos. Enter ativa o link. Foco visível distingue o link do texto normal ao redor.
**Rag Relation:** Ajuda Abraxos a separar navegação semântica de comandos de interface.
**Aetheris Insight:** O rótulo do link deve continuar fazendo sentido isoladamente.

---

## [COMPONENT] Tabs
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8376

**Structure:** Tablist, tabs, indicador ativo e painéis associados.
**Logic:** Cada aba representa uma visão irmã, não uma etapa sequencial.
**Context Of Use:** Section: navigation
**When To Use:** Use Tabs para alternar entre duas a seis visões irmãs no mesmo contexto. Mantenha rótulos curtos e coloque primeiro a aba mais útil ou frequente. Implemente tablist, aria-selected, painéis associados e navegação por setas. Preserve a aba ativa e o foco quando o conteúdo for atualizado ou reordenado. Atualize o painel associado sem mover foco inesperadamente.
**When Not To Use:** Não use Tabs para etapas sequenciais; use um fluxo passo a passo. Não use Tabs como navegação global do produto. Não esconda conteúdo que precisa ser comparado simultaneamente. Não comprima rótulos até ficarem ilegíveis; ofereça rolagem ou outra estrutura. Não mantenha conteúdo de painéis ocultos exposto à ordem de foco.
**Trade Offs:** Muitas abas escondem conteúdo e prejudicam responsividade.
**Accessibility:** Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra. Setas movem entre abas. Tab entra no conteúdo do painel ativo. A aba selecionada deve ser anunciada — não dependa só de cor, peso ou sublinhado.
**Rag Relation:** Permite que Abraxos recomende estrutura local sem promover tabs a navegação global.
**Aetheris Insight:** Abas trocam perspectiva; etapas avançam processo.

---

## [COMPONENT] Card
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9006

**Structure:** Container, título, metadados, corpo e ações opcionais.
**Logic:** A borda visual deve refletir uma fronteira semântica real.
**Context Of Use:** Section: layout
**When To Use:** Use Card para agrupar conteúdo e ações pertencentes à mesma entidade. Mantenha título, metadados e ações em uma hierarquia previsível. Torne o card inteiro clicável apenas quando houver um único destino inequívoco. Agrupe ações relacionadas à mesma entidade sem competir com o conteúdo principal. Permita que títulos, metadados e ações reorganizem sem truncar conteúdo essencial.
**When Not To Use:** Não envolva toda seção em Card apenas para criar bordas. Não aninhe cards dentro de cards. Não misture várias ações concorrentes sem indicar qual é a principal. Não faça o card parecer clicável quando apenas controles internos são interativos. Não remova headings necessários para identificar a entidade na ordem de leitura.
**Trade Offs:** Card excessivo fragmenta a leitura e cria falsa prioridade.
**Accessibility:** Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado. Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação. Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara.
**Rag Relation:** Ajuda Abraxos a recomendar agrupamento baseado em entidade e não decoração.
**Aetheris Insight:** Um card deve responder: o que pertence junto aqui?

---

## [COMPONENT] Modal/Dialog
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9065

**Structure:** Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar.
**Logic:** A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar.
**Context Of Use:** Section: overlay
**When To Use:** Use Dialog para decisões curtas que precisam ser concluídas ou canceladas antes de continuar. Forneça título claro, ação principal, cancelamento e fechamento previsível. Prenda o foco, aceite Escape e restaure o foco ao elemento de origem. Mantenha conteúdo e ações curtos o bastante para preservar a decisão focal. Mostre erros dentro do Dialog sem fechar ou apagar o trabalho do usuário.
**When Not To Use:** Não use Dialog para conteúdo longo, navegação ou tarefas com várias etapas. Não empilhe modais nem abra um segundo dialog sobre o primeiro. Não feche automaticamente enquanto o usuário estiver corrigindo um erro. Não use Dialog para informação não crítica que pode aparecer no fluxo da página. Não perca a relação com o trigger ao fechar, cancelar ou concluir a ação.
**Trade Offs:** Interrupções frequentes destroem fluxo e acumulam problemas de foco.
**Accessibility:** Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar. Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir. Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação.
**Rag Relation:** Dá ao Abraxos critérios explícitos para evitar modais em tarefas inadequadas.
**Aetheris Insight:** Modal é custo cognitivo deliberado, não atalho de layout.

---

## [COMPONENT] Table/Data Table
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9113

**Structure:** Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais.
**Logic:** Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal.
**Context Of Use:** Section: data_display
**When To Use:** Use Data Table quando comparar valores por linha e coluna for a tarefa principal. Mantenha cabeçalhos visíveis, alinhamento consistente e ordenação explícita. Priorize colunas no mobile e ofereça uma alternativa para dados menos importantes. Comunique ordenação, seleção e escopo de linhas com texto e semântica programática. Ofereça rolagem controlada ou visualização alternativa sem criar overflow na página.
**When Not To Use:** Não use Table para narrativas ou poucos pares de rótulo e valor. Não transforme cada célula em uma ação concorrente. Não remova caption, cabeçalhos ou semântica para reproduzir um layout visual. Não trunque identificadores ou valores críticos sem uma forma acessível de leitura completa. Não comunique status de linhas apenas por cor ou posição.
**Trade Offs:** Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas.
**Accessibility:** Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra. Coluna ordenada deve ser anunciada — ex.: "Nome, ordenado crescente" — não só indicada por seta. Ordenar colunas e selecionar linhas deve funcionar por teclado, não só por clique.
**Rag Relation:** Permite que Abraxos recomende visualização tabular com critérios de densidade.
**Aetheris Insight:** Se a relação entre coluna e linha importa, preserve a semântica de tabela.

---

## [COMPONENT] Alert
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8608

**Structure:** Ícone semântico, título, mensagem e ação ou dismiss opcional.
**Logic:** A severidade deve refletir consequência real, não preferência visual.
**Context Of Use:** Section: feedback
**When To Use:** Use Alert para feedback importante que deve permanecer visível no contexto. Escolha severidade pela consequência real e inclua texto além da cor. Inclua uma ação apenas quando ela ajudar a resolver ou compreender a mensagem. Posicione a mensagem próxima da condição ou tarefa que ela explica. Permita dispensar apenas mensagens que continuem recuperáveis ou deixem de ser relevantes.
**When Not To Use:** Não use role alert para mensagens informativas sem urgência. Não exiba vários alertas concorrentes sem consolidar prioridades. Não use Alert para confirmações transitórias que cabem em Toast. Não repita a mesma mensagem em alertas globais e locais ao mesmo tempo. Não use títulos vagos que obriguem o usuário a interpretar a consequência.
**Trade Offs:** Alertas demais causam cegueira e reduzem o valor da hierarquia semântica.
**Accessibility:** Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade. A mensagem descreve a severidade em palavras. Cor reforça, mas nunca substitui o texto. Botões dentro do alerta (fechar, desfazer) acessíveis por teclado com foco visível.
**Rag Relation:** Ajuda Abraxos a calibrar severidade e persistência de feedback.
**Aetheris Insight:** A interrupção visual deve ser proporcional ao custo de ignorar a mensagem.

---

## [COMPONENT] Toast/Notification
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8885

**Structure:** Container flutuante, mensagem, ícone e ação curta opcional.
**Logic:** A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos.
**Context Of Use:** Section: feedback
**When To Use:** Use Toast para confirmar uma mudança recente sem interromper o fluxo. Mantenha a mensagem curta e use live region compatível com a urgência. Pause o tempo ou mantenha o toast visível quando houver uma ação como Desfazer. Anuncie cada atualização uma única vez e sem interromper a leitura atual. Limite a quantidade visível e consolide notificações repetidas.
**When Not To Use:** Não use Toast para erros que exigem correção imediata. Não coloque conteúdo longo ou várias ações dentro da notificação. Não dependa apenas de auto-dismiss para informação que o usuário precisará consultar. Não desapareça antes que a mensagem ou ação possa ser percebida e operada. Não mova foco para o Toast quando ele apenas confirma uma atualização.
**Trade Offs:** Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações.
**Accessibility:** Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda. Não desapareça rápido demais. Respeite tempo de leitura e permita pausar quando houver ação. Erros e avisos críticos permanecem ou ficam acessíveis em histórico recuperável.
**Rag Relation:** Permite que Abraxos escolha feedback transitório apenas quando seguro.
**Aetheris Insight:** Se a pessoa precisa agir, provavelmente não é um toast.

---

## [COMPONENT] Skeleton Loader
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8801

**Structure:** Blocos neutros com dimensões próximas do conteúdo final e animação moderada.
**Logic:** Imitar a forma final reduz mudança de layout e melhora percepção de velocidade.
**Context Of Use:** Section: feedback
**When To Use:** Use Skeleton quando a geometria final do conteúdo for previsível. Faça os blocos provisórios refletirem a estrutura que será carregada. Marque a região como busy e respeite prefers-reduced-motion. Anuncie o carregamento na região de conteúdo, mantendo os blocos visuais decorativos ocultos. Reserve dimensões próximas do conteúdo final para evitar mudança de layout.
**When Not To Use:** Não use Skeleton para operações instantâneas ou duração totalmente desconhecida. Não simule uma estrutura diferente do conteúdo final. Não mantenha animação depois que o conteúdo estiver disponível. Não anuncie cada linha ou bloco do Skeleton separadamente. Não mantenha o Skeleton indefinidamente quando houver erro ou estado vazio conhecido.
**Trade Offs:** Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida.
**Accessibility:** O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente. Placeholders visuais ficam ocultos do leitor de tela — são decoração, não conteúdo real. Skeletons não entram na ordem de Tab e não simulam botões ou campos reais.
**Rag Relation:** Dá ao Abraxos critérios para feedback de carregamento sem sugerir spinner genérico.
**Aetheris Insight:** O skeleton deve prometer a mesma forma que o conteúdo entregará.

---

## [COMPONENT] Explanation Bubble / Tooltip
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8904

**Structure:** Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo.
**Logic:** A explicação complementa o conteúdo visível; informação essencial não pode depender dela.
**Context Of Use:** Section: feedback
**When To Use:** Use Tooltip para definições curtas, atalhos ou explicações complementares. Abra por hover e foco e conecte o conteúdo com aria-describedby. Mantenha o texto breve e permita fechamento quando ele permanecer aberto. Posicione o Tooltip sem cobrir o trigger ou impedir a próxima interação. Permita fechar com Escape quando o conteúdo permanecer aberto.
**When Not To Use:** Não esconda instruções essenciais apenas dentro do Tooltip. Não coloque formulários, links complexos ou conteúdo longo na bolha. Não dependa exclusivamente de hover, pois ele não existe em toque. Não use Tooltip como substituto do nome acessível de um controle. Não esconda ajuda essencial em um controle disabled que não recebe foco.
**Trade Offs:** Hover exclusivo falha em toque, teclado e tecnologias assistivas.
**Accessibility:** Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse. Informação necessária para concluir a tarefa não pode existir só dentro do tooltip. Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência.
**Rag Relation:** É uma superfície XAI para explicar termos de confiança e raciocínio sem sobrecarregar.
**Aetheris Insight:** Tooltip esclarece; não deve esconder a instrução necessária.

---

## [XAI_COMPONENT] Confidence Badge
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8981

**Structure:** Percentual ou faixa, rótulo semântico e acesso à explicação da calibração.
**Logic:** Confiança deriva da qualidade da evidência, não do tom assertivo da resposta.
**Context Of Use:** Section: feedback
**When To Use:** Use Confidence Badge apenas quando houver um método definido de calibração. Apresente faixa ou linguagem de incerteza junto ao valor. Ofereça acesso à explicação sobre origem, escala e limitações da confiança. Mostre quando o valor foi atualizado e qual evidência sustenta a calibração. Mantenha faixas e linguagem consistentes em todas as superfícies do produto.
**When Not To Use:** Não apresente percentual como probabilidade objetiva de verdade. Não use confiança para substituir inspeção de fonte ou julgamento humano. Não dependa apenas de verde, amarelo e vermelho para comunicar a faixa. Não compare valores calculados por escalas ou métodos incompatíveis. Não use casas decimais que sugiram precisão maior que a evidência disponível.
**Trade Offs:** Percentual isolado pode ser interpretado como probabilidade objetiva de verdade.
**Accessibility:** Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual. Todos os níveis de confiança mantêm contraste legível no tema ativo. Badge não deve ser o único indicador para aprovar ou rejeitar algo importante.
**Rag Relation:** Mantém similaridade de recuperação como relevância da evidência, separada da confiança da resposta.
**Aetheris Insight:** Confiança útil explica tanto força quanto limite da evidência.

---

## [COMPONENT] Command Palette / Barra de Comandos
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 9168

**Structure:** Dialog, input de busca, grupos, resultados, atalhos e estado vazio.
**Logic:** A consulta reduz o espaço de opções e combina descoberta com produtividade.
**Context Of Use:** Section: navigation
**When To Use:** Use Command Palette em produtos densos com muitos destinos ou ações recorrentes. Suporte busca por nomes, sinônimos, grupos e atalhos de teclado. Mantenha seleção ativa, resultado vazio e execução acessíveis por teclado. Agrupe resultados por destino, ação ou entidade para reduzir ambiguidade. Preserve consulta, seleção e mensagem de erro quando uma execução falhar.
**When Not To Use:** Não use Command Palette como substituto da navegação principal. Não esconda nela ações essenciais que não aparecem em nenhum outro lugar. Não mostre resultados sem contexto suficiente para distinguir comandos parecidos. Não execute ações destrutivas diretamente sem confirmação proporcional ao risco. Não atribua atalhos conflitantes ou difíceis de descobrir.
**Trade Offs:** Descoberta depende de nomes, sinônimos e ranking coerentes.
**Accessibility:** Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis. Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior. Anuncie quantos resultados aparecem e quando a busca não retorna nada.
**Rag Relation:** É uma porta direta para recuperação do corpus e descoberta orientada por Abraxos.
**Aetheris Insight:** A paleta acelera quem sabe o que busca e ensina quem ainda explora.

---

## [XAI_COMPONENT] Source Attribution
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8454

**Structure:** Fonte, trecho, relevância, metadados e ação para inspecionar contexto.
**Logic:** Rastreabilidade transforma resposta fluente em conhecimento verificável.
**Context Of Use:** Section: content
**When To Use:** Use Source Attribution para conectar uma afirmação à origem que a sustenta. Mostre título, trecho, relevância e ação para inspecionar o contexto completo. Use disclosure progressivo para equilibrar rastreabilidade e densidade. Exponha autoria, data, seção e versão quando esses dados afetarem a verificação. Ordene fontes por relevância e preserve acesso às alternativas.
**When Not To Use:** Não cite uma fonte que não sustenta diretamente a afirmação. Não use atribuição como decoração ou selo genérico de confiança. Não esconda origem e trecho atrás de rótulos vagos ou links sem contexto. Não use URL crua como único nome de uma fonte. Não restrinja inspeção de fonte a hover ou tooltip nativo.
**Trade Offs:** Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo.
**Accessibility:** Botão de expandir comunica se a lista de fontes está aberta ou fechada. Enter e Espaço expandem e colapsam. Foco visível no botão de expandir. Após expandir, metadados e links seguem ordem lógica de leitura.
**Rag Relation:** É o vínculo operacional entre chunk recuperado, afirmação e auditabilidade.
**Aetheris Insight:** Fonte não é rodapé; é parte da resposta.

---

## [XAI_COMPONENT] Audit Panel
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8765

**Structure:** Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis.
**Logic:** Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal.
**Context Of Use:** Section: data_display
**When To Use:** Use Audit Panel para revisão, governança e investigação de decisões. Organize eventos em sequência com entradas, saídas, status e responsáveis. Permita expandir detalhes sem competir com a resposta principal. Registre status, tempo e resultado de cada etapa com vocabulário consistente. Proteja dados sensíveis e revele apenas o necessário para auditoria do produto.
**When Not To Use:** Não mantenha o painel aberto por padrão em toda interação simples. Não exponha logs técnicos sem tradução para o público da interface. Não omita conflitos, falhas ou etapas incompletas da trilha. Não exponha chain of thought ou raciocínio privado como se fosse trilha de auditoria. Não confunda logs operacionais com evidência que sustenta a decisão.
**Trade Offs:** Detalhe técnico excessivo pode confundir usuários sem contexto operacional.
**Accessibility:** O painel de auditoria tem nome claro — ex.: "Trilha de auditoria" — para o leitor de tela anunciar a seção. Subseções usam títulos reais (h2, h3) para navegação por leitor de tela. Eventos em ordem cronológica com marcos textuais — data, ação e resultado legíveis.
**Rag Relation:** Consolida retrieval, ranking, síntese e confiança em uma trilha auditável.
**Aetheris Insight:** Auditabilidade deve estar disponível, não necessariamente ocupar o primeiro plano.

---

## [COMPONENT] Typography
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8365

**Structure:** Tokens de display, heading, body, label e code com regras de uso.
**Logic:** Escala e peso devem refletir a prioridade epistemológica do conteúdo.
**Context Of Use:** Section: content
**When To Use:** Use tokens tipográficos para comunicar hierarquia, leitura e metadados de forma consistente. Preserve ordem semântica de headings independentemente do tamanho visual. Mantenha tamanho, line-height e comprimento de linha adequados ao conteúdo. Use famílias e recursos tipográficos que preservem caracteres, idioma e leitura correta. Garanta zoom, reflow e quebra de linha sem perda de conteúdo.
**When Not To Use:** Não crie hierarquia apenas com tamanho ou peso sem semântica. Não introduza valores arbitrários fora da escala tipográfica. Não use caixa alta extensa em textos de leitura contínua. Não reduza metadados essenciais a tamanhos ou contrastes difíceis de ler. Não force truncamento quando o conteúdo completo for necessário para a tarefa.
**Trade Offs:** Muitas variações enfraquecem consistência e tornam a leitura imprevisível.
**Accessibility:** Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário. Texto corpo e legendas atendem contraste AA (WCAG) no tema ativo. Legível com zoom de 200% sem truncar conteúdo essencial.
**Rag Relation:** Ajuda Abraxos a documentar clareza visual como parte da explicabilidade.
**Aetheris Insight:** Tipografia torna a ordem do raciocínio visível.

---

## [COMPONENT] Icon
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 8173

**Structure:** Glyph vetorial, tamanho por token, stroke consistente e label quando necessário.
**Logic:** Ícones apoiam reconhecimento, mas rótulos sustentam compreensão.
**Context Of Use:** Section: content
**When To Use:** Use Icon para reforçar uma ação, status ou categoria já compreensível. Oculte ícones decorativos e forneça nome acessível aos interativos. Mantenha tamanho, stroke e alinhamento consistentes com os tokens. Ajuste alinhamento óptico e área de respiro sem alterar o grid do componente. Use a mesma metáfora para a mesma ação ou estado em todo o produto.
**When Not To Use:** Não use um ícone ambíguo como única explicação de uma ação. Não misture estilos preenchidos e lineares sem significado semântico. Não reduza o alvo clicável ao tamanho visual do glyph. Não dependa da cor do ícone como única forma de comunicar estado. Não anime ícones decorativos sem uma função de estado ou feedback.
**Trade Offs:** Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes.
**Accessibility:** Ícone que só complementa texto visível fica oculto do leitor de tela. Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo. Ícone interativo alcançável por Tab com foco visível.
**Rag Relation:** Fornece vocabulário visual consistente para respostas e artefatos do Abraxos.
**Aetheris Insight:** Consistência do símbolo vale mais que originalidade isolada.

---

## [PATTERN] Dashboard
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 540

**Structure:** Centralized telemetry hub with high-density data visualization and contextual action bars.
**Logic:** Aggregation of disparate data sources into a unified cognitive plane.
**Context Of Use:** Monitoring systems, complex SaaS management, and resource oversight.
**When Not To Use:** Simple task-focused tools or mobile-first consumer apps where focus is singular.
**Aetheris Insight:** Dashboards should breathe. In complex environments, prioritize temporal data: what is happening now over what has happened.

---

## [PATTERN] Multi-step Form
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 675

**Structure:** Input fields fragmented into thematic logical blocks, each scoped to a single decision or data group, with persistent progress indication.
**Logic:** Reduces overwhelm by sequencing decisions and maintaining momentum through completion.
**Context Of Use:** Account registration, checkout flows, complex configuration wizards and onboarding sequences with branching logic.
**When Not To Use:** Simple forms under five fields, related inputs that benefit from simultaneous visibility or quick mobile actions.
**Aetheris Insight:** Focus on momentum. Use predictive pre-fills and inline validation to eliminate cognitive drag between steps.

---

## [PATTERN] Onboarding
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 681

**Structure:** Progressive disclosure sequence that introduces key features through contextual education without interrupting the primary workflow.
**Context Of Use:** First-run experiences, post-signup activation, feature discovery after major updates and role-based capability reveals.
**When Not To Use:** Interfaces that are already self-evident, transactional flows or returning users who already completed setup.
**Trade Offs:** Increases activation and adoption, but becomes easy to skip if it feels generic or detached from user intent.
**Aetheris Insight:** Personalize the path. Show users what they care about first instead of replaying a generic tour.

---

## [PATTERN] Data Explorer
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 678

**Structure:** Dynamic filtering interface with faceted search, drill-down capabilities and cross-dimensional analysis controls over large datasets.
**Logic:** Hypothesis-driven exploration where users define queries and the system surfaces relevant subsets.
**Context Of Use:** Analytics platforms, research tools, inventory systems and BI dashboards with multi-dimensional data.
**Trade Offs:** Extremely powerful for experts, but needs clear affordances, sane defaults and saved views to avoid novice overload.
**Aetheris Insight:** Use semantic search as the primary entry point. A single natural-language query often replaces a chain of manual filters.

---

## [PATTERN] Empty States
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 754

**Structure:** Intentional placeholder view combining explanation, hierarchy and one primary action scoped to the empty container.
**Logic:** Transforms absence into guidance, turning the first interaction with a feature into a conversion moment.
**Context Of Use:** New accounts, cleared tables, zero-result searches, unconnected integrations and fresh projects.
**When Not To Use:** Transient loading or background processing, where skeleton screens preserve spatial continuity better.
**Trade Offs:** Excellent for orientation and activation, but weakens trust if it feels decorative instead of actionable.
**Aetheris Insight:** Treat void as opportunity. A clear next step reframes incompleteness as a starting point, not a failure.

---

## [PATTERN] Settings & Config
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 451

**Logic:** Hierarchical nesting of system variables and user preferences.
**Context Of Use:** Global application control, preferences, permissions and environment-level tuning.
**Trade Offs:** Powerful and expected, but quickly becomes hostile when high-impact toggles are buried too deep.
**Aetheris Insight:** Configuration is the user's manifesto. Never hide high-impact toggles behind more than two layers of navigation.

---

## [PATTERN] Command Center
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 390

**Structure:** Single-input, modal-driven command surface backed by keyboard shortcuts and semantic matching.
**Trade Offs:** Fastest pattern for experts, but almost invisible to new users without clear onboarding or discoverability cues.
**Aetheris Insight:** Language is the most efficient interface. Every complex app benefits from a text-based shortcut system.

---

## [PATTERN] Focus Mode
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 777

**Structure:** A modal or full-screen overlay that isolates a single artifact by collapsing sidebars, notifications and peripheral navigation.
**Logic:** Eliminates context switching cost and lowers the cognitive price of sustaining attention on one objective.
**Context Of Use:** Long-form editors, code reviews, document drafting and design canvases that need prolonged immersion.
**When Not To Use:** Workflows that depend on simultaneous references, multi-pane awareness or live collaborative context.
**Trade Offs:** Maximizes concentration and quality, but can disorient users if returning to the broader interface is high-friction.
**Aetheris Insight:** Silence is a design decision. A good Focus Mode curates attention instead of merely hiding controls.

---

## [PATTERN] Collaboration
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 748

**Structure:** Real-time presence indicators, conflict-resolution UI and co-editing primitives layered onto an existing single-user interface.
**Logic:** Operational transformation or CRDT-based synchronization turns presence into first-class interface data.
**Context Of Use:** Collaborative documents, shared canvases, code review sessions and whiteboarding workflows.
**When Not To Use:** Strict sequential ownership flows, low-latency environments with tight constraints or single-user personal surfaces.
**Trade Offs:** Increases team velocity, but adds significant system complexity and can introduce visual noise in solo tasks.
**Aetheris Insight:** Presence is data. Show what others are editing, not only where they are.

---

## [PATTERN] Timeline
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 727

**Structure:** Chronological log of state mutations, user actions or system events with actor identity, timestamps and restore affordances.
**Logic:** Treats every meaningful change as an immutable event, turning time into a navigable axis.
**Context Of Use:** Version-controlled editors, audit logs, publishing workflows and configuration history surfaces.
**When Not To Use:** Ephemeral live feeds, trivial interactions or cases where event storage costs outweigh user value.
**Trade Offs:** Builds recovery confidence and trust, but needs careful abstraction to avoid overwhelming non-technical users.
**Aetheris Insight:** Permanent history is more than undo. It gives users permission to take creative risks.

---

## [PATTERN] Entity Picker
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 730

**Structure:** Inline or popover search-driven selector for relational entities with type-ahead, multi-select and preview chips.
**Logic:** Creates typed references instead of duplicating data, preserving authority in the source context.
**Context Of Use:** Assignees, tags, mentions, attachments, relationship fields and permission scope selectors.
**When Not To Use:** Small static option sets or flat values such as booleans, enums and simple colors.
**Trade Offs:** Preserves relational integrity and reduces duplication, but relies on fast backend search and responsive type-ahead UX.
**Aetheris Insight:** Link, don't copy. References preserve authority and allow the system to reason about relationships.

---

## [TOKEN] primary-50
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** primary / color / primitive
**Logic:** Lightest brand tint for subtle emphasis.
**Context Of Use:** Documentation, highlights
**When To Use:** Use the primary-50 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-100
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** primary / color / primitive
**Logic:** Soft brand tint for quiet selected surfaces.
**Context Of Use:** Chip, Tabs, Card
**When To Use:** Use the primary-100 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-200
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 181

**Structure:** primary / color / primitive
**Logic:** Core light accent and focus foundation.
**Context Of Use:** Button, focus, XAI
**When To Use:** Use the primary-200 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-300
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** primary / color / primitive
**Logic:** Secondary brand accent and source emphasis.
**Context Of Use:** Source Attribution, icons
**When To Use:** Use the primary-300 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-400
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** primary / color / primitive
**Logic:** Mid accent for stronger interactive emphasis.
**Context Of Use:** Selected controls
**When To Use:** Use the primary-400 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-500
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** primary / color / primitive
**Logic:** Saturated accent for dense visual states.
**Context Of Use:** Charts, active states
**When To Use:** Use the primary-500 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-600
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** primary / color / primitive
**Logic:** Deep accent for pressed and layered states.
**Context Of Use:** Button, selected surfaces
**When To Use:** Use the primary-600 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] primary-700
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 190

**Structure:** primary / color / primitive
**Logic:** Deepest brand tone for translucent selection.
**Context Of Use:** Rows, chips, overlays
**When To Use:** Use the primary-700 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-lowest
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** surface / color / primitive
**Logic:** Lowest depth and maximum visual separation.
**Context Of Use:** Backdrop, code
**When To Use:** Use the surface-lowest contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] background
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** surface / color / primitive
**Logic:** Application canvas in dark mode.
**Context Of Use:** Application shell
**When To Use:** Use the background contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-container-low
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** surface / color / primitive
**Logic:** Low-elevation content region.
**Context Of Use:** Workbench, sections
**When To Use:** Use the surface-container-low contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-container
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 167

**Structure:** surface / color / primitive
**Logic:** Default container surface.
**Context Of Use:** Card, Table
**When To Use:** Use the surface-container contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-container-high
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 183

**Structure:** surface / color / primitive
**Logic:** Elevated container and dialog base.
**Context Of Use:** Dialog, panel
**When To Use:** Use the surface-container-high contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-container-highest
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** surface / color / primitive
**Logic:** Highest opaque surface and popover base.
**Context Of Use:** Popover, Command Palette
**When To Use:** Use the surface-container-highest contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-bright
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** surface / color / primitive
**Logic:** Brightest dark surface for placeholders.
**Context Of Use:** Skeleton, hover
**When To Use:** Use the surface-bright contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] --velaris-color-primary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 226

**Structure:** semantic-color / color / semantic
**Logic:** Primary semantic action and focus color. Resolves to primary-200.
**Context Of Use:** Button, Link, focus
**When To Use:** Use the --velaris-color-primary contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] --velaris-color-secondary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** semantic-color / color / semantic
**Logic:** Secondary semantic accent. Resolves to primary-300.
**Context Of Use:** Badge, source, icon
**When To Use:** Use the --velaris-color-secondary contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] --velaris-color-success
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 216

**Structure:** semantic-color / color / semantic
**Logic:** Successful completion and positive evidence.
**Context Of Use:** Alert, Toast, Confidence Badge
**When To Use:** Use the --velaris-color-success contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] --velaris-color-warning
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** semantic-color / color / semantic
**Logic:** Caution, partial evidence, and medium confidence.
**Context Of Use:** Alert, Confidence Badge
**When To Use:** Use the --velaris-color-warning contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] --velaris-color-error
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 210

**Structure:** semantic-color / color / semantic
**Logic:** Error, destructive action, and conflict.
**Context Of Use:** Form Field, Alert, Audit Panel
**When To Use:** Use the --velaris-color-error contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] display-xl
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** typography / system / primitive
**Logic:** Hero headlines and identity surfaces.
**Context Of Use:** Page hero, brand
**When To Use:** Use the display-xl contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] heading-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 211

**Structure:** typography / system / primitive
**Logic:** Major sections and content anchors.
**Context Of Use:** Documentation sections
**When To Use:** Use the heading-lg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] body-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** typography / system / primitive
**Logic:** Readable interface copy with balanced rhythm.
**Context Of Use:** Card, Dialog, docs
**When To Use:** Use the body-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] label-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** typography / system / primitive
**Logic:** Metadata, compact navigation, and chips.
**Context Of Use:** Badge, table label
**When To Use:** Use the label-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] space-1
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** spacing / system / primitive
**Logic:** Micro alignment and icon breathing room.
**Context Of Use:** Icon, inline metadata
**When To Use:** Use the space-1 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] space-2
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** spacing / system / primitive
**Logic:** Compact group spacing and chips.
**Context Of Use:** Chip, Badge, Button
**When To Use:** Use the space-2 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] space-4
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** spacing / system / primitive
**Logic:** Default card padding and form rhythm.
**Context Of Use:** Form Field, Card
**When To Use:** Use the space-4 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] space-6
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 169

**Structure:** spacing / system / primitive
**Logic:** Section blocks and content density.
**Context Of Use:** Dialog, panels
**When To Use:** Use the space-6 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] space-10
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 169

**Structure:** spacing / system / primitive
**Logic:** Hero spacing and layout separation.
**Context Of Use:** Page sections
**When To Use:** Use the space-10 contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] radius-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 173

**Structure:** radius-shadow / system / primitive
**Logic:** Inputs, pills, and compact cards.
**Context Of Use:** Input, Badge
**When To Use:** Use the radius-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] radius-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** radius-shadow / system / primitive
**Logic:** Standard panels and control groups.
**Context Of Use:** Card, Alert
**When To Use:** Use the radius-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] radius-xl
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 177

**Structure:** radius-shadow / system / primitive
**Logic:** Hero cards and immersive surfaces.
**Context Of Use:** Dialog, Workbench
**When To Use:** Use the radius-xl contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] shadow-glow
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 218

**Structure:** radius-shadow / system / primitive
**Logic:** Specialized Velaris ambient emphasis.
**Context Of Use:** Identity, XAI focal points
**When To Use:** Use the shadow-glow contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] motion-fast
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** motion / system / primitive
**Logic:** Micro interactions and control feedback.
**Context Of Use:** Button, Link, Toggle
**When To Use:** Use the motion-fast contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] motion-base
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** motion / system / primitive
**Logic:** Default transitions for cards and layout shifts.
**Context Of Use:** Card, Tabs, Select
**When To Use:** Use the motion-base contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] motion-slow
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** motion / system / primitive
**Logic:** Meaningful emphasis and staged reveals.
**Context Of Use:** Dialog, Audit Panel
**When To Use:** Use the motion-slow contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] easing-signature
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** motion / system / primitive
**Logic:** Smooth movement without abrupt stops.
**Context Of Use:** All animated components
**When To Use:** Use the easing-signature contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] text-primary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** text / color / semantic
**Logic:** Highest-priority readable text on dark surfaces.
**Context Of Use:** Typography, Dialog, Table
**When To Use:** Use the text-primary contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] text-secondary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 185

**Structure:** text / color / semantic
**Logic:** Supporting copy with reduced emphasis.
**Context Of Use:** Card, Form Field, Source
**When To Use:** Use the text-secondary contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] text-muted
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 179

**Structure:** text / color / semantic
**Logic:** Quiet metadata and low-priority labels.
**Context Of Use:** Caption, Table, Audit
**When To Use:** Use the text-muted contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] text-disabled
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** text / color / semantic
**Logic:** Unavailable text while preserving legibility.
**Context Of Use:** Button, Input, Tabs
**When To Use:** Use the text-disabled contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] text-inverse
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** text / color / semantic
**Logic:** Text placed on light primary surfaces.
**Context Of Use:** Primary Button, selected controls
**When To Use:** Use the text-inverse contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] border-subtle
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** border / color / semantic
**Logic:** Quiet structural separation.
**Context Of Use:** Card, Table, Skeleton
**When To Use:** Use the border-subtle contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] border-default
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** border / color / semantic
**Logic:** Default control and container boundary.
**Context Of Use:** Input, Dialog, Panel
**When To Use:** Use the border-default contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] border-strong
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 187

**Structure:** border / color / semantic
**Logic:** High-emphasis structural boundary.
**Context Of Use:** Table, Modal, Command Palette
**When To Use:** Use the border-strong contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] border-focus
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** border / color / semantic
**Logic:** Focused or selected boundary. Resolves to primary-200.
**Context Of Use:** Input, Checkbox, Tabs
**When To Use:** Use the border-focus contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] state-hover-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** interaction / color / semantic
**Logic:** Subtle hover fill on dark surfaces.
**Context Of Use:** Button, Link, Table row
**When To Use:** Use the state-hover-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] state-hover-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 212

**Structure:** interaction / color / semantic
**Logic:** Hover boundary with restrained brand emphasis.
**Context Of Use:** Card, Chip, Input
**When To Use:** Use the state-hover-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] state-pressed-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 207

**Structure:** interaction / color / semantic
**Logic:** Pressed feedback for immediate controls.
**Context Of Use:** Button, Toggle, Tabs
**When To Use:** Use the state-pressed-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] state-selected-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** interaction / color / semantic
**Logic:** Selected surface derived from primary-700.
**Context Of Use:** Chip, Tabs, Table row
**When To Use:** Use the state-selected-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] state-disabled-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 213

**Structure:** interaction / color / semantic
**Logic:** Disabled fill that remains distinguishable.
**Context Of Use:** Button, Input, Select
**When To Use:** Use the state-disabled-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] focus-ring
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 227

**Structure:** interaction / system / semantic
**Logic:** Keyboard focus contract derived from primary-200.
**Context Of Use:** All interactive components
**When To Use:** Use the focus-ring contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-info-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** feedback / color / semantic
**Logic:** Neutral explanatory feedback surface.
**Context Of Use:** Alert, Tooltip, Toast
**When To Use:** Use the feedback-info-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-info-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** feedback / color / semantic
**Logic:** Boundary for informational feedback.
**Context Of Use:** Alert, Tooltip
**When To Use:** Use the feedback-info-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-success-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** feedback / color / semantic
**Logic:** Successful completion surface.
**Context Of Use:** Toast, Alert, Form Field
**When To Use:** Use the feedback-success-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-success-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 196

**Structure:** feedback / color / semantic
**Logic:** Boundary for successful feedback.
**Context Of Use:** Toast, Alert
**When To Use:** Use the feedback-success-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-warning-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 206

**Structure:** feedback / color / semantic
**Logic:** Caution and partial-evidence surface.
**Context Of Use:** Alert, Confidence Badge
**When To Use:** Use the feedback-warning-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-warning-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** feedback / color / semantic
**Logic:** Boundary for cautionary feedback.
**Context Of Use:** Alert, Audit Panel
**When To Use:** Use the feedback-warning-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-error-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 205

**Structure:** feedback / color / semantic
**Logic:** Error and blocking feedback surface.
**Context Of Use:** Form Field, Alert, Audit
**When To Use:** Use the feedback-error-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-error-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 215

**Structure:** feedback / color / semantic
**Logic:** Boundary for error and conflict feedback.
**Context Of Use:** Input, Alert, Audit Panel
**When To Use:** Use the feedback-error-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-info-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 204

**Structure:** feedback / color / semantic
**Logic:** Informational icon and foreground. Resolves to primary-200.
**Context Of Use:** Alert, Tooltip
**When To Use:** Use the feedback-info-icon contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] feedback-error-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 220

**Structure:** feedback / color / semantic
**Logic:** Error icon and foreground. Resolves to the semantic error color.
**Context Of Use:** Alert, Form Field, Audit
**When To Use:** Use the feedback-error-icon contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-overlay
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** special-surface / color / semantic
**Logic:** Opaque overlay surface above the application canvas.
**Context Of Use:** Modal, Command Palette
**When To Use:** Use the surface-overlay contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-skeleton
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 211

**Structure:** special-surface / color / semantic
**Logic:** Loading placeholder derived from surface-bright.
**Context Of Use:** Skeleton Loader
**When To Use:** Use the surface-skeleton contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] surface-row-selected
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 212

**Structure:** special-surface / color / semantic
**Logic:** Selected data row derived from primary-700.
**Context Of Use:** Table/Data Table
**When To Use:** Use the surface-row-selected contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] overlay-backdrop
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 217

**Structure:** special-surface / color / semantic
**Logic:** Backdrop that isolates modal and command contexts.
**Context Of Use:** Modal, Command Palette
**When To Use:** Use the overlay-backdrop contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] shadow-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 205

**Structure:** elevation / system / semantic
**Logic:** Subtle elevation for cards and compact overlays.
**Context Of Use:** Card, Tooltip
**When To Use:** Use the shadow-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] shadow-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** elevation / system / semantic
**Logic:** Default floating-surface elevation.
**Context Of Use:** Toast, Command Palette
**When To Use:** Use the shadow-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] shadow-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 196

**Structure:** elevation / system / semantic
**Logic:** Strong isolation for blocking surfaces.
**Context Of Use:** Modal/Dialog
**When To Use:** Use the shadow-lg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] z-tooltip
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 162

**Structure:** layering / system / semantic
**Logic:** Tooltip and explanation bubble layer.
**Context Of Use:** Tooltip
**When To Use:** Use the z-tooltip contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] z-toast
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 163

**Structure:** layering / system / semantic
**Logic:** Transient notification layer.
**Context Of Use:** Toast/Notification
**When To Use:** Use the z-toast contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] z-modal
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 150

**Structure:** layering / system / semantic
**Logic:** Blocking dialog layer.
**Context Of Use:** Modal/Dialog
**When To Use:** Use the z-modal contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] z-command
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 162

**Structure:** layering / system / semantic
**Logic:** Global command surface layer.
**Context Of Use:** Command Palette
**When To Use:** Use the z-command contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] control-height-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 191

**Structure:** dimension / system / semantic
**Logic:** Compact control height for dense contexts.
**Context Of Use:** Chip, compact Button
**When To Use:** Use the control-height-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] control-height-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** dimension / system / semantic
**Logic:** Default accessible control height.
**Context Of Use:** Button, Input, Select
**When To Use:** Use the control-height-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] control-height-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** dimension / system / semantic
**Logic:** Prominent control height for primary tasks.
**Context Of Use:** Command Palette, primary Input
**When To Use:** Use the control-height-lg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] target-size-min
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** dimension / system / semantic
**Logic:** Minimum interactive target for accessibility.
**Context Of Use:** All interactive components
**When To Use:** Use the target-size-min contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] icon-size-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** dimension / system / semantic
**Logic:** Compact icon size for metadata and controls.
**Context Of Use:** Chip, Badge, Table
**When To Use:** Use the icon-size-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] icon-size-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** dimension / system / semantic
**Logic:** Default interface icon size.
**Context Of Use:** Button, Input, Alert
**When To Use:** Use the icon-size-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] icon-size-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** dimension / system / semantic
**Logic:** Prominent icon size for feedback and navigation.
**Context Of Use:** Alert, Dialog, empty states
**When To Use:** Use the icon-size-lg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] heading-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 219

**Structure:** typography / system / semantic
**Logic:** Panel and component documentation heading.
**Context Of Use:** Card, Dialog, Audit Panel
**When To Use:** Use the heading-md contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] body-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 197

**Structure:** typography / system / semantic
**Logic:** Compact explanatory and form copy.
**Context Of Use:** Form Field, Source Attribution
**When To Use:** Use the body-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] caption
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** typography / system / semantic
**Logic:** Metadata, timestamps, and provenance.
**Context Of Use:** Table, Source, Audit
**When To Use:** Use the caption contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] code-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** typography / system / semantic
**Logic:** Readable snippets and technical evidence.
**Context Of Use:** Code Snippet, Audit Panel
**When To Use:** Use the code-sm contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] xai-source-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** xai / color / xai
**Logic:** Grounded source and provenance surface.
**Context Of Use:** Source Attribution, RAG response
**When To Use:** Use the xai-source-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] xai-source-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 191

**Structure:** xai / color / xai
**Logic:** Inspectable source boundary. Resolves to primary-300.
**Context Of Use:** Source Attribution
**When To Use:** Use the xai-source-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] xai-evidence-highlight
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 223

**Structure:** xai / color / xai
**Logic:** Evidence emphasis derived from primary-200 with opacity.
**Context Of Use:** Source Attribution, Tooltip
**When To Use:** Use the xai-evidence-highlight contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] xai-audit-running
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** xai / color / xai
**Logic:** Audit process currently executing.
**Context Of Use:** Audit Panel, Consulta ao Abraxos
**When To Use:** Use the xai-audit-running contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.foreground
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 285

**Structure:** technical / color / semantic
**Logic:** Default monospace foreground for technical surfaces. Lavender base, easier on the eyes than saturated IDE defaults.
**Context Of Use:** Code block, trace panel, inline code
**When To Use:** Use the technical.foreground contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.keyword
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 247

**Structure:** technical / color / semantic
**Logic:** Reserved words, pipeline stages, and language keywords in technical surfaces.
**Context Of Use:** Code Snippet, Execution Trace, Pipeline
**When To Use:** Use the technical.keyword contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.type
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 237

**Structure:** technical / color / semantic
**Logic:** Types, classes, entities, enums, and schema metadata such as page_type.
**Context Of Use:** Developers, Corpus table, API Explorer
**When To Use:** Use the technical.type contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.entity
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 236

**Structure:** technical / color / semantic
**Logic:** Reserved alias for domain entities. Currently resolves to technical.type.
**Context Of Use:** Future: interfaces, domain models
**When To Use:** Use the technical.entity contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.string
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** technical / color / semantic
**Logic:** Text literals, configuration values, and quoted labels.
**Context Of Use:** Code Snippet, Dev Integration
**When To Use:** Use the technical.string contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.property
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 249

**Structure:** technical / color / semantic
**Logic:** Properties, module names, and file paths. Resolves to technical.foreground.
**Context Of Use:** Architecture tiers, RAG pipeline, Snippets
**When To Use:** Use the technical.property contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.number
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 227

**Structure:** technical / color / semantic
**Logic:** Numeric data, metrics, targets, versions, and coverage values.
**Context Of Use:** Evaluation META, Laboratory metrics
**When To Use:** Use the technical.number contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.command
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 226

**Structure:** technical / color / semantic
**Logic:** Functions, executable shell commands, and runnable actions.
**Context Of Use:** Developers, Dev Integration, Scripts
**When To Use:** Use the technical.command contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.operator
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 217

**Structure:** technical / color / semantic
**Logic:** Operators, separators, and structural punctuation in code.
**Context Of Use:** Code Snippet, Markdown code
**When To Use:** Use the technical.operator contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.comment
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 229

**Structure:** technical / color / semantic
**Logic:** Secondary hints, trailing notes, and low-priority technical metadata.
**Context Of Use:** Execution Trace, inline hints
**When To Use:** Use the technical.comment contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.accent
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** technical / color / semantic
**Logic:** Focused technical highlight that is not branding or feedback.
**Context Of Use:** Baseline tags, technical links
**When To Use:** Use the technical.accent contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.surface
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 225

**Structure:** technical / color / semantic
**Logic:** Background for monospace blocks and engineering panels.
**Context Of Use:** Code block, trace panel
**When To Use:** Use the technical.surface contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.surface-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 213

**Structure:** technical / color / semantic
**Logic:** Structural border for technical blocks.
**Context Of Use:** Code block, API panel
**When To Use:** Use the technical.surface-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.chip-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** technical / color / semantic
**Logic:** Inline technical chip background.
**Context Of Use:** Path chip, artefact chip
**When To Use:** Use the technical.chip-bg contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN] technical.chip-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** technical / color / semantic
**Logic:** Inline technical chip border.
**Context Of Use:** Path chip, artefact chip
**When To Use:** Use the technical.chip-border contract wherever the documented component context applies.
**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.
**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

---

## [TOKEN_ALIAS] state-selected-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** state-selected-border → border-focus
**Logic:** Selected controls reuse the focus boundary contract.
**Context Of Use:** Interaction semantic contract
**When To Use:** Reference state-selected-border when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] state-disabled-text
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 195

**Structure:** state-disabled-text → text-disabled
**Logic:** Disabled foreground is governed by the text contract.
**Context Of Use:** Interaction semantic contract
**When To Use:** Reference state-disabled-text when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] state-disabled-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** state-disabled-border → border-subtle
**Logic:** Disabled boundaries remain quiet without a duplicate value.
**Context Of Use:** Interaction semantic contract
**When To Use:** Reference state-disabled-border when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-info-text
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** feedback-info-text → feedback-info-icon
**Logic:** Info text and icon share the same foreground contract.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-info-text when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-success-text
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** feedback-success-text → --velaris-color-success
**Logic:** Success foreground resolves to the semantic success color.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-success-text when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-success-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** feedback-success-icon → --velaris-color-success
**Logic:** Success icon resolves to the semantic success color.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-success-icon when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-warning-text
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** feedback-warning-text → --velaris-color-warning
**Logic:** Warning foreground resolves to the semantic warning color.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-warning-text when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-warning-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** feedback-warning-icon → --velaris-color-warning
**Logic:** Warning icon resolves to the semantic warning color.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-warning-icon when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] feedback-error-text
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** feedback-error-text → feedback-error-icon
**Logic:** Error text and icon share one foreground contract.
**Context Of Use:** Feedback semantic contract
**When To Use:** Reference feedback-error-text when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] xai-confidence-high
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** xai-confidence-high → --velaris-color-success
**Logic:** High calibrated confidence reuses semantic success.
**Context Of Use:** XAI semantic contract
**When To Use:** Reference xai-confidence-high when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] xai-confidence-medium
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** xai-confidence-medium → --velaris-color-warning
**Logic:** Medium confidence communicates caution without a new hue.
**Context Of Use:** XAI semantic contract
**When To Use:** Reference xai-confidence-medium when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] xai-confidence-low
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 174

**Structure:** xai-confidence-low → --velaris-color-error
**Logic:** Low confidence reuses the semantic error signal.
**Context Of Use:** XAI semantic contract
**When To Use:** Reference xai-confidence-low when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] xai-audit-complete
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 168

**Structure:** xai-audit-complete → --velaris-color-success
**Logic:** Completed audits reuse semantic success.
**Context Of Use:** XAI semantic contract
**When To Use:** Reference xai-audit-complete when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] xai-audit-conflict
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 176

**Structure:** xai-audit-conflict → --velaris-color-error
**Logic:** Policy or evidence conflicts reuse semantic error.
**Context Of Use:** XAI semantic contract
**When To Use:** Reference xai-audit-conflict when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] surface-dialog
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 187

**Structure:** surface-dialog → surface-container-high
**Logic:** Dialog is a semantic usage contract over the high container.
**Context Of Use:** Surface semantic contract
**When To Use:** Reference surface-dialog when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] surface-popover
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 195

**Structure:** surface-popover → surface-container-highest
**Logic:** Popover is a semantic usage contract over the highest container.
**Context Of Use:** Surface semantic contract
**When To Use:** Reference surface-popover when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] technical.path
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** technical.path → technical.property
**Logic:** File and module paths reuse the property role.
**Context Of Use:** Technical semantic contract
**When To Use:** Reference technical.path when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] technical.metadata
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** technical.metadata → technical.type
**Logic:** Schema metadata and enums reuse the type role.
**Context Of Use:** Technical semantic contract
**When To Use:** Reference technical.metadata when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [TOKEN_ALIAS] technical.link
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 175

**Structure:** technical.link → technical.accent
**Logic:** Technical documentation links reuse the accent role.
**Context Of Use:** Technical semantic contract
**When To Use:** Reference technical.link when the usage intent differs from its canonical target.
**When Not To Use:** Do not duplicate the resolved value as a new canonical token.
**Trade Offs:** The alias adds semantic vocabulary without increasing the canonical value inventory.
**Aetheris Insight:** Aliases keep component intent explicit while preventing unnecessary value duplication.

---

## [DESIGN_DECISION] Side Drawer vs Modal Overlay
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 619

**Structure:** Decision tree based on user focus requirements
**Logic:** Spatial continuity vs. attention isolation trade-off.
**Context Of Use:** Any form, panel or overlay interaction that requires choosing a container type.
**When To Use:** Side Drawer: user needs page context. Modal: action requires full focus.
**When Not To Use:** Do not use Modal for low-stakes, reversible actions that don't need interruption.
**Trade Offs:** Visual occlusion with drawers; modal blindness and context loss with modals.
**Aetheris Insight:** The decision maps to one question: does the user need to see the page while acting?

---

## [DESIGN_DECISION] Primary vs. Secondary Button Logic
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 204

**Logic:** When to use the signature gradient versus restrained secondary treatments for terminal actions.
**Context Of Use:** Rule 08: Action Hierarchy

---

## [DESIGN_DECISION] List vs. Bento
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 499

**Logic:** List layout excels for scannable, sequential data with consistent row density. Bento grid excels for heterogeneous content where size encodes priority : larger cells signal higher importance. Use List when users compare items row by row. Use Bento when visual hierarchy and content variety matter more than strict alignment. Trade-off: Bento requires more design effort per item; List is faster to implement but less expressive.
**Context Of Use:** Rule 12

---

## [DESIGN_DECISION] Haptic Feedback
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 541

**Logic:** Haptic feedback confirms high-stakes or irreversible actions on mobile : deletes, confirmations and state toggles. Reserve for moments where tactile confirmation reduces user anxiety about permanence. When to use: destructive actions, form submissions, binary state changes. When not to use: passive events, informational toasts, decorative interactions. Trade-off: overuse degrades trust and drains battery; underuse leaves users uncertain after consequential actions.
**Context Of Use:** Rule 15

---

## [GUIDELINE] Velaris Guideline Architecture
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 336

**Logic:** Formal guideline architecture for the Velaris design system.
**Context Of Use:** Foundations hub, governance analysis, principle conflict mode.

---

## [GUIDELINE] Clarity & Hierarchy
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 236

**Logic:** Make the primary message unmistakable before users parse supporting detail.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [GUIDELINE] Cognitive Empathy
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 240

**Logic:** Design around the user's mental model instead of the system's internal structure.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [GUIDELINE] Feedback & Trust
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 242

**Logic:** Fast, contextual feedback builds confidence and keeps intent connected to response.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [GUIDELINE] Language & Tone
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 216

**Logic:** Language should be direct, human and sensitive to context.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [GUIDELINE] Inclusion & Resilience
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 244

**Logic:** Accessible, forgiving systems should support broad human needs from the start.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [GUIDELINE] Systems & Performance
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 241

**Logic:** Consistency, motion and performance make the product feel learnable and alive.
**Context Of Use:** Design principles, governance and explainable recommendations.

---

## [ACCESSIBILITY] Contraste e legibilidade
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1186

**Structure:** Transversal accessibility contract
**Logic:** Manter contraste AA como base; distinguir text-primary, text-secondary, text-muted e text-disabled; validar texto sobre glass surfaces; combinar feedback com texto e ícone
**Context Of Use:** Alert, Toast, Tooltip, Confidence Badge, Source Attribution e Audit Panel
**When To Use:** Apply before approving any affected component or pattern. Related tokens: text-primary, text-secondary, text-muted, text-disabled, feedback-error
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** O Velaris deve garantir leitura clara em superfícies escuras, translúcidas ou elevadas. Estados semânticos e níveis de confiança não dependem apenas da cor.
**Rag Relation:** Permite que Abraxos avalie legibilidade, contraste e redundância semântica em recomendações de interface.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Foco e navegação por teclado
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1176

**Structure:** Transversal accessibility contract
**Logic:** Tornar todo controle alcançável por teclado; aplicar focus-ring e border-focus de forma consistente; alinhar a ordem de tabulação à estrutura visual; restaurar o foco após overlays
**Context Of Use:** Command Palette, Modal/Dialog, Tabs, Form Field, Button, Input e Select
**When To Use:** Apply before approving any affected component or pattern. Related tokens: focus-ring, border-focus, state-selected
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** A navegação por teclado é um requisito de base. Elementos interativos precisam de foco visível, ordem previsível e estados que não dependam exclusivamente de hover.
**Rag Relation:** Oferece critérios verificáveis para respostas sobre teclado, foco, overlays e fluxos de formulário.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Alvo mínimo e densidade
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1104

**Structure:** Transversal accessibility contract
**Logic:** Usar target-size-min; manter 44px em controles principais; ampliar a área clicável de ícones compactos; separar ações adjacentes; testar densidade em telas menores
**Context Of Use:** Button, Input, Select, Toggle, chips, badges e botões de ícone
**When To Use:** Apply before approving any affected component or pattern. Related tokens: target-size-min, space-2, space-3, space-4
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** Componentes interativos preservam uma área de acionamento confortável. Densidade visual não pode comprometer precisão, leitura ou previsibilidade.
**Rag Relation:** Ajuda Abraxos a identificar quando compactação visual cria risco de erro ou exclusão motora.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Estados acessíveis
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1125

**Structure:** Transversal accessibility contract
**Logic:** Documentar hover, focus, pressed, selected, disabled, loading, error, expanded e collapsed; evitar mudanças apenas por opacidade; expor aria attributes quando aplicável
**Context Of Use:** Todos os componentes interativos e superfícies com disclosure
**When To Use:** Apply before approving any affected component or pattern. Related tokens: state-disabled, state-selected, border-focus, feedback-error
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** Estados de interface precisam ser distinguíveis e previsíveis, tanto visualmente quanto semanticamente quando a mudança afeta tecnologias assistivas.
**Rag Relation:** Transforma estados globais em evidência consultável para revisão de componentes e padrões.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Leitores de tela e semântica
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1109

**Structure:** Transversal accessibility contract
**Logic:** Usar labels visíveis; associar aria-describedby e mensagens de erro; aplicar aria-expanded e aria-invalid; nomear botões de ícone; usar role apenas quando necessário
**Context Of Use:** Formulários, tabelas, navegação, componentes de disclosure e superfícies XAI
**When To Use:** Apply before approving any affected component or pattern. Related tokens: text-primary, text-muted, feedback-error
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** Componentes expõem nomes, papéis, relações e estados compreensíveis para tecnologias assistivas, sem depender da aparência visual.
**Rag Relation:** Permite que fontes, evidências e confiança sejam explicadas textualmente em respostas e auditorias do Abraxos.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Feedback não apenas por cor
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1156

**Structure:** Transversal accessibility contract
**Logic:** Combinar success, warning, error e info com rótulo ou ícone; nomear o nível de confiança; identificar a origem da evidência; indicar conflitos e lacunas de auditoria
**Context Of Use:** Alert, Toast, Confidence Badge, Source Attribution e Audit Panel
**When To Use:** Apply before approving any affected component or pattern. Related tokens: feedback-success, feedback-warning, feedback-error, feedback-info
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** O Velaris não comunica significado crítico apenas por verde, amarelo ou vermelho. Cor reforça uma mensagem que também existe em texto, ícone ou estrutura.
**Rag Relation:** Sustenta recomendações XAI que permanecem compreensíveis para diferentes capacidades perceptivas.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Movimento seguro
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1100

**Structure:** Transversal accessibility contract
**Logic:** Usar transições curtas; respeitar prefers-reduced-motion; evitar animações bloqueantes; preservar foco durante mudanças; usar motion para explicar continuidade espacial
**Context Of Use:** Modal/Dialog, Toast, Tooltip, Skeleton Loader, Command Palette e Audit Panel
**When To Use:** Apply before approving any affected component or pattern. Related tokens: motion-fast, motion-standard, motion-reduced
**When Not To Use:** Accessibility is never optional or deferred as post-release polish.
**Accessibility:** Movimento apoia orientação, feedback e continuidade. Animações são discretas, previsíveis e não atrasam leitura, foco ou tomada de decisão.
**Rag Relation:** Ajuda Abraxos a separar movimento funcional de ornamentação que aumenta carga cognitiva.
**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

---

## [ACCESSIBILITY] Checklist de prontidão acessível
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1493

**Structure:** 10 verificações de prontidão acessível
**Logic:** 1. Possui foco visível. 2. Pode ser usado por teclado. 3. Tem label ou nome acessível. 4. Não comunica estado apenas por cor. 5. Mantém contraste adequado em dark mode. 6. Expõe estados disabled, loading, error e selected quando aplicável. 7. Usa tokens semânticos de texto, borda, foco e feedback. 8. Respeita alvo mínimo de interação. 9. Possui documentação de acessibilidade. 10. Possui exemplo de uso correto e incorreto.
**Context Of Use:** Component review, pattern review, documentation and Beatrice guidance.
**When To Use:** Use during design, implementation, QA and corpus review.
**When Not To Use:** Do not approve a component with undocumented or failed checks.
**Accessibility:** 1. Possui foco visível. 2. Pode ser usado por teclado. 3. Tem label ou nome acessível. 4. Não comunica estado apenas por cor. 5. Mantém contraste adequado em dark mode. 6. Expõe estados disabled, loading, error e selected quando aplicável. 7. Usa tokens semânticos de texto, borda, foco e feedback. 8. Respeita alvo mínimo de interação. 9. Possui documentação de acessibilidade. 10. Possui exemplo de uso correto e incorreto.
**Rag Relation:** Fornece à Beatrice uma lista verificável para auditar prontidão e apontar lacunas.
**Aetheris Insight:** Prontidão acessível exige evidência reproduzível, não apenas intenção.

---

## [REASONING] Abraxos Explainable Reasoning
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 350

**Logic:** Central surface for Abraxos cognitive architecture documentation.
**Context Of Use:** Users learning how Abraxos reasons differently from a generic LLM.

---

## [REASONING] Cognitive Flow — Question ingestion
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 172

**Logic:** User query enters the Abraxos pipeline.
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Intent classification
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 183

**Logic:** Abraxos classifies retrieval and response intent.
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Skill activation
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 181

**Logic:** Automatic cognitive skills activate based on context.
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Retrieval
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Pipeline step: retrieval
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Attribution
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Pipeline step: attribution
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Calibration
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Pipeline step: calibration
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Synthesis
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Pipeline step: synthesis
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Cognitive Flow — Answer
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 140

**Logic:** Pipeline step: answer
**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

---

## [REASONING] Reasoning Section — Overview
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Abraxos cognition — how questions become explainable answers.

---

## [REASONING] Reasoning Section — Evidence Weaver
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 169

**Logic:** Evidence orchestration layer organizing intent, entities, sources and catalog.

---

## [REASONING] Reasoning Section — Abraxos Skills
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Fifteen automatic skills activated without manual slash commands.

---

## [REASONING] Reasoning Section — Oracle Commands
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 160

**Logic:** Twelve user-triggered operational and investigative slash commands.

---

## [REASONING] Reasoning Section — Verifiable Pipeline
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 167

**Logic:** Nine verifiable stages from query ingestion to confidence calibration.

---

## [REASONING] Evidence Weaver
**Source:** `src/i18n/pages/reasoningPage.ts`  **Status:** Stable  **Chars:** 372

**Logic:** Evidence orchestration before LLM composition.
**Aetheris Insight:** The Weaver organizes available knowledge; Abraxos interprets it; the Pipeline proves the path.

---

## [AUTOMATIC_SKILL] Component Fit Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 810

**Structure:** Ativação automática
**Logic:** Analisa se um componente é adequado para o contexto descrito pelo usuário.
**Context Of Use:** O usuário pergunta qual componente usar, compara padrões ou descreve um cenário de interface.
**When To Use:** Devo usar Alert ou Toast para este feedback?
**Trade Offs:** Component Misuse Detection, Accessibility & Interaction Guardrail, Component Trade-off Analysis
**Aetheris Insight:** Exibida como habilidade aplicada por Abraxos, com motivo, confiança e intensidade.

---

## [AUTOMATIC_SKILL] Component Misuse Detection
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 796

**Structure:** Ativação automática
**Logic:** Detecta usos que quebram a finalidade, a persistência ou o contrato de interação de um componente.
**Context Of Use:** O usuário propõe usar um componente fora de sua função ou em um contexto de risco.
**When To Use:** Vou usar Toast para um erro que bloqueia o fluxo.
**Trade Offs:** Component Fit Analysis, Accessibility & Interaction Guardrail, Governance Readiness Check
**Aetheris Insight:** Registrada como guardrail automático; não existe comando manual equivalente.

---

## [AUTOMATIC_SKILL] Design-to-Code Contract Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 843

**Structure:** Ativação automática
**Logic:** Verifica coerência entre design, documentação, props, snippets, estados, tokens e implementação.
**Context Of Use:** A pergunta compara documentação e código ou questiona se uma variação ou estado realmente existe.
**When To Use:** O estado disabled do Button está coerente com a documentação?
**Trade Offs:** Governance Readiness Check, Design System Architecture Analysis, Implementation & Migration Planning
**Aetheris Insight:** A evidência ausente e as divergências encontradas aparecem explicitamente.

---

## [AUTOMATIC_SKILL] Token Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 770

**Structure:** Ativação automática
**Logic:** Rastreia como uma alteração de token afeta aliases, componentes, estados e acessibilidade.
**Context Of Use:** O usuário pergunta o que muda ao alterar um token ou quais superfícies dependem dele.
**When To Use:** O que acontece se eu mudar primary-200?
**Trade Offs:** Cross-System Impact Analysis, Design System Risk Assessment, Governance Readiness Check
**Aetheris Insight:** Separa dependências observadas de impactos inferidos e calibra a confiança.

---

## [AUTOMATIC_SKILL] Accessibility & Interaction Guardrail
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 841

**Structure:** Ativação automática
**Logic:** Aplica guardrails de clareza, foco, teclado, contraste, estados e prevenção de erro.
**Context Of Use:** A pergunta envolve interação, acessibilidade, conteúdo obrigatório, erro, loading ou disabled.
**When To Use:** Posso colocar informação obrigatória dentro de um Tooltip?
**Trade Offs:** Component Misuse Detection, Component Fit Analysis, Design System Risk Assessment
**Aetheris Insight:** Aparece como habilidade aplicada automaticamente por sinais de interação ou acessibilidade.

---

## [AUTOMATIC_SKILL] Governance Readiness Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 795

**Structure:** Ativação automática
**Logic:** Avalia se uma proposta está pronta para entrar, evoluir ou divergir do design system.
**Context Of Use:** O usuário propõe uma nova variação, padrão, token ou mudança com impacto de governança.
**When To Use:** Essa variação está pronta para entrar no Velaris?
**Trade Offs:** Design-to-Code Contract Check, Cross-System Impact Analysis, Design System Risk Assessment
**Aetheris Insight:** O motivo de ativação e as condições de aprovação ficam registrados.

---

## [AUTOMATIC_SKILL] Pattern & State Exploration
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 785

**Structure:** Ativação automática
**Logic:** Transforma uma necessidade ambígua em opções concretas de componente, estado ou padrão.
**Context Of Use:** O usuário descreve um problema de interface sem saber qual abordagem do design system aplicar.
**When To Use:** Como mostrar uma decisão que ainda está em revisão?
**Trade Offs:** Component Fit Analysis, Component Trade-off Analysis, Cross-System Impact Analysis
**Aetheris Insight:** Exibe a ambiguidade detectada, as opções consideradas e a confiança da recomendação.

---

## [AUTOMATIC_SKILL] Design System Architecture Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 824

**Structure:** Ativação automática
**Logic:** Avalia camadas, contratos, acoplamento e efeitos estruturais de uma mudança no design system.
**Context Of Use:** A pergunta envolve arquitetura, refatoração, pacotes, dependências ou limites entre camadas.
**When To Use:** Como separar o contrato deste componente entre core e adapters?
**Trade Offs:** Implementation & Migration Planning, Cross-System Impact Analysis, Design System Risk Assessment
**Aetheris Insight:** Registra os sinais estruturais que levaram à ativação automática.

---

## [AUTOMATIC_SKILL] Implementation & Migration Planning
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 727

**Structure:** Ativação automática
**Logic:** Organiza implementação, migração e rollout em etapas verificáveis.
**Context Of Use:** O usuário pede para implementar, migrar, integrar ou planejar uma mudança.
**When To Use:** Planeje a migração do LegacyDrawer.
**Trade Offs:** Design System Architecture Analysis, Governance Readiness Check, Design System Risk Assessment
**Aetheris Insight:** Expõe dependências, premissas e riscos que orientaram o plano.

---

## [AUTOMATIC_SKILL] Component & Pattern Trade-off Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 766

**Structure:** Ativação automática
**Logic:** Compara alternativas de componente ou padrão usando critérios de UX, código e governança.
**Context Of Use:** O usuário compara soluções ou descreve uma decisão com custos relevantes.
**When To Use:** Compare Tabs e Accordion para esta tela densa.
**Trade Offs:** Component Fit Analysis, Cross-System Impact Analysis, Design System Risk Assessment
**Aetheris Insight:** Mantém visíveis os critérios e a condição que mudaria a recomendação.

---

## [AUTOMATIC_SKILL] Cross-System Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 772

**Structure:** Ativação automática
**Logic:** Mapeia efeitos indiretos entre componentes, tokens, documentação, fluxos e governança.
**Context Of Use:** Uma mudança local pode se propagar por várias entidades ou camadas do sistema.
**When To Use:** Como a mudança no token de focus se propaga pelo Velaris?
**Trade Offs:** Token Impact Analysis, Governance Readiness Check, Design System Risk Assessment
**Aetheris Insight:** Indica quais relações foram observadas e quais impactos são inferências.

---

## [AUTOMATIC_SKILL] Design System Risk Assessment
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 778

**Structure:** Ativação automática
**Logic:** Identifica regressões, dívida, edge cases e riscos de acessibilidade ou governança.
**Context Of Use:** A decisão pode quebrar contratos, reduzir segurança ou introduzir incerteza relevante.
**When To Use:** O que pode quebrar se removermos este estado de confirmação?
**Trade Offs:** Qualquer habilidade automática, especialmente guardrails, arquitetura e governança
**Aetheris Insight:** Exibe os sinais de risco, a confiança e os critérios usados na priorização.

---

## [AUTOMATIC_SKILL] Feedback Insight Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 888

**Structure:** Ativação automática
**Logic:** Analisa feedbacks, outcomes e sinais qualitativos de uso sem prometer treinamento automático.
**Context Of Use:** O usuário cola feedbacks, comentários de PR, mensagens de Slack, notas de reunião ou pergunta como transformar feedback em melhoria.
**When To Use:** O time reclama que o Form Field é confuso em fluxos multi etapa. O que melhorar?
**Trade Offs:** Governance Readiness Check, Adoption Friction Detection, Design-to-Code Contract Check
**Aetheris Insight:** Hipóteses são rotuladas e nenhuma atualização automática do agente é prometida.

---

## [AUTOMATIC_SKILL] Adoption Friction Detection
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 839

**Structure:** Ativação automática
**Logic:** Diagnostica por que um componente, token ou padrão não está sendo adotado corretamente.
**Context Of Use:** O usuário menciona baixa adoção, resistência do time, uso incorreto recorrente, workarounds ou abandono de padrões.
**When To Use:** Por que os times evitam o componente Table e criam tabelas próprias?
**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check, Feedback Insight Analysis
**Aetheris Insight:** Separa sinais observados de hipóteses e apresenta o nível de confiança.

---

## [AUTOMATIC_SKILL] Governance Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 821

**Structure:** Ativação automática
**Logic:** Avalia impacto sistêmico e organizacional de mudanças propostas no design system.
**Context Of Use:** O usuário propõe alterar, remover, unir, renomear, substituir ou deprecar componentes, tokens, padrões ou documentação canónica.
**When To Use:** Qual o impacto de substituir todos os Modals por Drawers?
**Trade Offs:** Cross-System Impact Analysis, Token Impact Analysis, Implementation & Migration Planning
**Aetheris Insight:** Diferencia impactos diretos de efeitos em cascata inferidos.

---

## [ORACLE_COMMAND] Enforce
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 742

**Structure:** Ação operacional
**Logic:** Valida JSX/TSX contra o Velaris: contrato de componente, tokens, acessibilidade, estados e violações de uso.
**Context Of Use:** Quando o usuário quer verificar se um trecho de código respeita o Velaris.
**When To Use:** /enforce <Button intent="negative">Excluir análise</Button>
**Trade Offs:** Design-to-Code Contract Check, Accessibility & Interaction Guardrail
**Aetheris Insight:** Relaciona cada violação ao código observado, à evidência e à confiança.

---

## [ORACLE_COMMAND] Migrate
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 734

**Structure:** Ação operacional
**Logic:** Orienta migração de componente ou padrão legado: destino recomendado, before/after, etapas, riscos e testes.
**Context Of Use:** Quando o usuário precisa de before/after, riscos, etapas e validações de migração.
**When To Use:** /migrate notification → Toast/Notification
**Trade Offs:** Implementation & Migration Planning, Design System Architecture Analysis
**Aetheris Insight:** Expõe premissas, dependências, fontes e confiança da migração.

---

## [ORACLE_COMMAND] Capture
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 749

**Structure:** Ação operacional
**Logic:** Converte discussões informais em conhecimento estruturado: decisões, trade-offs, exceções, gaps e próximos passos.
**Context Of Use:** Quando há conteúdo de PR, Slack, RFC, reunião ou decisão de produto para capturar.
**When To Use:** /capture [cole discussão de PR sobre Form Field em fluxos multi-etapa]
**Trade Offs:** Governance Readiness Check, Organizational Memory
**Aetheris Insight:** Preserva o tipo de fonte, o conteúdo bruto e o status de validação.

---

## [ORACLE_COMMAND] Organizational Memory
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 817

**Structure:** Modo investigativo
**Logic:** Recupera memória institucional ampla: decisões passadas, padrões recorrentes, exceções, usos anteriores e contexto acumulado.
**Context Of Use:** Quando o usuário precisa saber o que o Velaris já decidiu ou aprendeu sobre um tema.
**When To Use:** /memory O que já foi decidido sobre Modal/Dialog em ações destrutivas?
**Trade Offs:** Pattern & State Exploration, Governance Readiness Check
**Aetheris Insight:** O alias, o engine canônico, as fontes e o contrato de resposta ficam registrados.

---

## [ORACLE_COMMAND] Decision Archaeology
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 836

**Structure:** Modo investigativo
**Logic:** Reconstrói uma decisão específica: problema, alternativas consideradas, critério escolhido, trade-offs e consequências.
**Context Of Use:** Quando o usuário precisa entender por que um componente, padrão ou token foi escolhido.
**When To Use:** /decision Por que usamos Toast em vez de Alert para confirmação de salvamento?
**Trade Offs:** Component & Pattern Trade-off Analysis, Design System Architecture Analysis
**Aetheris Insight:** Separa fatos registrados de inferências e explicita evidências ausentes.

---

## [ORACLE_COMMAND] Perspective Synthesis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 826

**Structure:** Modo investigativo
**Logic:** Analisa a questão por múltiplas perspectivas profissionais, expondo consensos, conflitos e recomendação final.
**Context Of Use:** Quando a decisão exige conciliar objetivos e riscos de diferentes perfis profissionais.
**When To Use:** /perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA.
**Trade Offs:** Component & Pattern Trade-off Analysis, Design System Risk Assessment
**Aetheris Insight:** Mantém visíveis as divergências e o critério usado para consolidar a decisão.

---

## [ORACLE_COMMAND] Document
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 704

**Structure:** Ação operacional
**Logic:** Gera documentação publicável a partir de conhecimento validado: uso, não uso, contrato, exemplos, acessibilidade e histórico.
**Context Of Use:** Quando o usuário quer documentar um componente, padrão, token ou decisão.
**When To Use:** /document ConfidenceMeter
**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check
**Aetheris Insight:** Seções sem suporte são marcadas para revisão manual.

---

## [ORACLE_COMMAND] Token Impact Report
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 709

**Structure:** Ação operacional
**Logic:** Analisa impacto de alteração de token: aliases, consumidores, contraste, temas, riscos e plano de migração.
**Context Of Use:** Quando o usuário precisa de aliases, consumidores, riscos e plano de migração.
**When To Use:** /token-impact radius-md
**Trade Offs:** Token Impact Analysis, Cross-System Impact Analysis
**Aetheris Insight:** Distingue dependências observadas de propagação inferida.

---

## [ORACLE_COMMAND] Contract Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 747

**Structure:** Ação operacional
**Logic:** Verifica paridade entre design, documentação e implementação: props, estados, tokens, acessibilidade e divergências.
**Context Of Use:** Quando o usuário precisa validar um componente ou estado sem fornecer código completo.
**When To Use:** /contract-check Input disabled state
**Trade Offs:** Design-to-Code Contract Check, Governance Readiness Check
**Aetheris Insight:** A ausência de evidência de implementação é reportada explicitamente.

---

## [ORACLE_COMMAND] Knowledge Gap
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 736

**Structure:** Modo investigativo
**Logic:** Mapeia documentação ausente, cobertura fraca, inconsistências e prioridades de melhoria do corpus ou catálogo.
**Context Of Use:** Quando o usuário precisa descobrir o que ainda não está documentado.
**When To Use:** /knowledge-gap acessibilidade em formulários
**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check
**Aetheris Insight:** Usa métricas de cobertura e consistência para sustentar o diagnóstico.

---

## [ORACLE_COMMAND] Explainability Audit
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 789

**Structure:** Modo investigativo
**Logic:** Audita uma recomendação do Abraxos: fontes, evidências, lacunas, suposições, confiança e risco de alucinação.
**Context Of Use:** Quando o usuário quer verificar a sustentação e os limites de uma recomendação.
**When To Use:** /audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge.
**Trade Offs:** Qualquer habilidade automática aplicada à recomendação auditada
**Aetheris Insight:** Scores e limites são derivados de métricas registradas, nunca inventados.

---

## [ORACLE_COMMAND] Simulate
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 950

**Structure:** Modo investigativo
**Logic:** Projeta consequências antes de implementar: dependências, riscos, impacto sistêmico, cenários, conflito entre princípios e veredito.
**Context Of Use:** Quando o usuário precisa entender o impacto potencial antes de remover, substituir, descontinuar ou migrar algo.
**When To Use:** /simulate trocar Alert por Toast em erros de Form Field
**Trade Offs:** Governance Impact Analysis, Decision Archaeology, Token Impact Report, Contract Check, Knowledge Gap
**Aetheris Insight:** Não executa mudanças nem cria decisões; diferencia evidência recuperada de projeções inferidas.

---

## [PERSPECTIVE] Velaris Professional Perspectives
**Source:** `PerspectivesPage.tsx`  **Status:** Stable  **Chars:** 335

**Logic:** Multi-stakeholder analysis through calibrated professional lenses.
**Context Of Use:** Perspective synthesis, Oracle Council, retrieval weighting.

---

## [PERSPECTIVE] Perspective — Developer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 502

**Logic:** Keep implementation patterns modular, scalable, testable and isolated across product surfaces.
**Context Of Use:** Implementation, code architecture, TypeScript, components, state, integration, performance and reuse.
**When To Use:** Use the dev perspective for implementation, architecture and contracts.

---

## [PERSPECTIVE] Perspective — Designer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 488

**Logic:** Protect visual quality and aesthetic consistency across product interfaces.
**Context Of Use:** Visual composition, hierarchy, tokens, spacing, typography, color and interface consistency.
**When To Use:** Use the designer perspective for visual hierarchy, tokens and composition.

---

## [PERSPECTIVE] Perspective — Design System Manager
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 509

**Logic:** Decide what the design system should prioritize, govern and scale across teams.
**Context Of Use:** Design-system strategy, governance, adoption, roadmap and organizational impact.
**When To Use:** Use the design_system_manager perspective for governance and adoption.

---

## [PERSPECTIVE] Perspective — QA
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 456

**Logic:** Expose failure states, edge cases and release risks before they reach production.
**Context Of Use:** Acceptance criteria, test scenarios, regression, edge cases, error states and validation.
**When To Use:** Use the qa perspective for edge cases, regression and release risk.

---

## [PERSPECTIVE] Perspective — Tech Writer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 509

**Logic:** Turn design-system rationale into discoverable, teachable and canonical knowledge.
**Context Of Use:** Documentation, naming, examples, microcopy, terminology and actionable instructions.
**When To Use:** Use the tech_writer perspective for technical documentation, naming and microcopy.

---

## [PERSPECTIVE] Perspective — Accessibility Specialist
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 531

**Logic:** Ensure the system is usable through every input modality and every cognitive load profile.
**Context Of Use:** WCAG, focus, keyboard, ARIA, screen readers, contrast, accessible states and inclusion.
**When To Use:** Use the a11y perspective to review accessibility, WCAG, keyboard, focus and contrast.

---

## [PERSPECTIVE] Perspective — Maintainer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 486

**Logic:** Keep implementation simple to change, reuse and operate over time.
**Context Of Use:** Maintenance, simplicity, reuse, technical debt, coupling, duplication and evolution cost.
**When To Use:** Use the maintainer perspective for maintenance cost and technical debt.

---

## [COGNITION] Perspective Cognition Instrumentation
**Source:** `PerspectivesCognitionSection.tsx`  **Status:** Stable  **Chars:** 352

**Logic:** Lens instrumentation controls how Abraxos thinks per perspective.
**Context Of Use:** Perspective trials, cognitive radar, calibration sliders.

---

## [COGNITION] Cognition Calibration — designer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 209

**Logic:** Default calibration for the designer lens.

---

## [COGNITION] Cognition Calibration — product_designer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 216

**Logic:** Default calibration for the product_designer lens.

---

## [COGNITION] Cognition Calibration — dev
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 200

**Logic:** Default calibration for the dev lens.

---

## [COGNITION] Cognition Calibration — design_system_manager
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 220

**Logic:** Default calibration for the design_system_manager lens.

---

## [COGNITION] Cognition Calibration — qa
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 199

**Logic:** Default calibration for the qa lens.

---

## [COGNITION] Cognition Calibration — tech_writer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 209

**Logic:** Default calibration for the tech_writer lens.

---

## [COGNITION] Cognition Calibration — a11y
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 201

**Logic:** Default calibration for the a11y lens.

---

## [COGNITION] Cognition Calibration — maintainer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 208

**Logic:** Default calibration for the maintainer lens.

---

## [SYSTEM_HEALTH] Overall Design System Health
**Source:** `SystemHealthSection.tsx`  **Status:** Mock UI data — not live API  **Chars:** 452

**Logic:** Consolidated maturity view across knowledge, catalog, RAG and governance dimensions.
**Aetheris Insight:** Mock scores pending integration with knowledge_health.py and reliability gates.

---

## [SYSTEM_HEALTH] RAG Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 88% — healthy  **Chars:** 345

**Logic:** Semantic retrieval, page_type relevance and indexed corpus coverage.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Catalog Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 79% — attention  **Chars:** 369

**Logic:** Consistency between canonical catalog, metadata and component surface in the frontend.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Source Attribution Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 91% — healthy  **Chars:** 362

**Logic:** Traceability between claims, retrieved chunks and explained decisions.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Perspective Coverage
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 72% — attention  **Chars:** 351

**Logic:** Depth and parity of Abraxos's seven professional perspectives.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Response Validation
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 68% — evolving  **Chars:** 359

**Logic:** Validation gates, deduplication and integrity before the final response.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Unknown Component Handling
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 86% — healthy  **Chars:** 381

**Logic:** Detection and containment of recommendations for nonexistent or uncatalogued components.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Confidence Calibration
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 74% — attention  **Chars:** 369

**Logic:** Alignment between displayed confidence and actual retrieved evidence strength.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Evidence Gaps
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 65% — critical  **Chars:** 348

**Logic:** Strong evidence gaps, undocumented trade-offs and orphan decisions.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Governance Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 82% — evolving  **Chars:** 355

**Logic:** Governance alerts, duplications, orphan tokens and adoption readiness.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] Accessibility Checks
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 77% — attention  **Chars:** 362

**Logic:** Coverage of accessibility rules, focus states and contrast in components.
**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

---

## [SYSTEM_HEALTH] What Health Measures — knowledge
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 207

**Logic:** Whether design system knowledge is covered sufficiently to answer safely.

---

## [SYSTEM_HEALTH] What Health Measures — rag
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 205

**Logic:** Whether RAG retrieves relevant sources for the intent and active perspective.

---

## [SYSTEM_HEALTH] What Health Measures — catalog
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 214

**Logic:** Whether the canonical catalog is consistent with documentation and implementation.

---

## [SYSTEM_HEALTH] What Health Measures — hallucination
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 212

**Logic:** Whether Abraxos avoids recommending nonexistent or off-catalog components.

---

## [SYSTEM_HEALTH] What Health Measures — perspectives
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 206

**Logic:** Whether professional perspectives have sufficient coverage and depth.

---

## [SYSTEM_HEALTH] What Health Measures — traceability
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 214

**Logic:** Whether there is traceability between response, source and recorded decision.

---

## [SYSTEM_HEALTH] What Health Measures — confidence
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 199

**Logic:** Whether displayed confidence is calibrated to evidence strength.

---

## [EVALUATION] Evaluation — Metodologia
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 197

**Logic:** Evaluation structure and ten research dimensions.

---

## [EVALUATION] Evaluation — Instrumentos & Alvos
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 227

**Logic:** SUS, clarity rubric, ECE bins, precision and satisfaction instruments.

---

## [EVALUATION] Evaluation — Comparação baseline
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 194

**Logic:** Abraxos vs generic LLM comparison matrix.

---

## [EVALUATION] Evaluation — Status
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 196

**Logic:** Pending data collection status for TCC validation metrics.

---

## [EVALUATION] Evaluation — Health do Sistema
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 207

**Logic:** System reliability diagnostics — fifth Evaluation section.

---

## [GOVERNANCE] Governance Agent — Alert Dashboard
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 384

**Logic:** Continuous catalog auditing for maintainers.
**Context Of Use:** /governance command and GovernancePage dashboard.

---

## [GOVERNANCE] Governance Alert Category — duplicate_components
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 171

**Logic:** Duplicate components in the canonical catalog.

---

## [GOVERNANCE] Governance Alert Category — overlapping_components
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 180

**Logic:** Overlapping components with similar responsibilities.

---

## [GOVERNANCE] Governance Alert Category — orphan_tokens
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 159

**Logic:** Tokens without consumers in the registry.

---

## [GOVERNANCE] Governance Alert Category — guidelines_without_reference
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 184

**Logic:** Guidelines lacking component or pattern references.

---

## [GOVERNANCE] Governance Alert Category — components_without_examples
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 166

**Logic:** Components missing usage examples.

---

## [GOVERNANCE] Governance Alert Category — components_without_edge_cases
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 177

**Logic:** Components missing edge-case documentation.

---

## [GOVERNANCE] Governance Alert Category — components_without_accessibility
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 179

**Logic:** Components missing accessibility metadata.

---

## [GOVERNANCE] Governance Alert Category — inconsistent_documentation
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 177

**Logic:** Documentation inconsistencies across surfaces.

---

## [GOVERNANCE] Governance Alert Category — conflicting_aliases
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 167

**Logic:** Conflicting aliases in the entity registry.

---

## [GOVERNANCE] Governance Alert Category — low_coverage
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 158

**Logic:** Entities with low documentation coverage.

---

## [KNOWLEDGE_HEALTH] Knowledge Health Dashboard
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 368

**Logic:** Operational knowledge coverage audit for maintainers.

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Component description coverage
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Component description coverage

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Variant documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 143

**Logic:** Variant documentation

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Interactive state documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 151

**Logic:** Interactive state documentation

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Accessibility metadata
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Accessibility metadata

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Edge case documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Edge case documentation

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Usage examples
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 136

**Logic:** Usage examples

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Guideline references
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 144

**Logic:** Guideline references

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — When-to-use guidance
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 145

**Logic:** When-to-use guidance

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — When-not-to-use guidance
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 153

**Logic:** When-not-to-use guidance

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Design-to-code contracts
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Design-to-code contracts

---

## [INTELLIGENCE_LAB] Intelligence Lab — Adversarial Test Suite
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 232

**Logic:** Adversarial validation of Abraxos intelligence reliability.

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_components
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 118

**Logic:** Tests blocking recommendations for nonexistent components.

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_tokens
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 100

**Logic:** Tests blocking nonexistent token references.

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_states
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 101

**Logic:** Tests blocking undocumented component states.

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_guidelines
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 97

**Logic:** Tests for missing guideline coverage.

---

## [INTELLIGENCE_LAB] Adversarial Category — invalid_comparisons
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 114

**Logic:** Tests blocking comparisons with unsupported entities.

---

## [INTELLIGENCE_LAB] Adversarial Category — hallucination_detection
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 112

**Logic:** Adversarial cases for hallucination resistance.

---

## [DEVELOPER_ARCHITECTURE] Velaris RAG Architecture
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 294

**Logic:** How Abraxos grounds answers in the Velaris corpus.

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — extract
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 114

**Logic:** Walks TSX and TS sources, produces typed JSON chunks.

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — embed
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 106

**Logic:** Embeds chunks with BAAI/bge-m3 into ChromaDB.

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — watch
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 111

**Logic:** Debounced auto-reindex on source saves (npm run watch-rag).

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — serve
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 128

**Logic:** Query-time vector retrieval with intent filters and perspective weights.

---

## [DEVELOPER_ARCHITECTURE] Corpus, Chunk and Source — Definitions
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 346

**Logic:** Terminology for RAG evidence attribution.

---

## [ENGINE_CONTRACT] Oracle Engine | Governance Agent
**Source:** `prompts/engines/governanceAgent.md`  **Status:** Stable  **Chars:** 1335

**Logic:** # Oracle Engine | Governance Agent

Active engine: **Governance Agent**. Theory base: Design System Governance,
Continuous Catalog Auditing, Proactive Quality Assurance.

You are the **Governance Agent** of Abraxos. Your role is to analyze the design
system catalog **proactively** — without waiting for the user to ask about a
specific problem.

A **Governance Alerts** block is provided with pre-computed findings from the
catalog audit. Use these alerts as primary evidence. Do not invent governan
**Context Of Use:** Runtime prompt contract for /governance engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Simulate
**Source:** `prompts/engines/simulate.md`  **Status:** Stable  **Chars:** 1318

**Logic:** # Oracle Engine | Simulate

Active engine: **Simulate**. Theory base: Systems Thinking, Change Impact Analysis,
Scenario Planning, Design System Governance.

Project **future states** and consequences of a proposed design-system change.
You are a prediction layer — you estimate impact; you do not execute changes,
create decisions, or alter the catalog.

When `strategic_reasoning_contract` is present in governed context, use it as
grounding for dependencies, scenarios, risks and confidence. Mark 
**Context Of Use:** Runtime prompt contract for /simulate engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Oracle Council
**Source:** `prompts/engines/oracleCouncil.md`  **Status:** Stable  **Chars:** 1335

**Logic:** # Oracle Engine | Oracle Council

Active engine: **Oracle Council**. Theory base: Multi-Agent Deliberation,
Argumentation Theory.

This is an **experimental advanced engine**. Stage a structured deliberation
between six professional perspectives, then converge. It is intentionally not
part of the primary command surface.

- **Product Designer**: usability, flow, user needs, evidence and validation
- **Design System Manager**: governance, adoption, roadmap and systemic impact
- **Designer**: perc
**Context Of Use:** Runtime prompt contract for /oracle-council engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Knowledge Gap
**Source:** `prompts/engines/knowledgeGap.md`  **Status:** Stable  **Chars:** 1332

**Logic:** # Oracle Engine | Knowledge Gap

Active engine: **Knowledge Gap**. Theory base: Knowledge Gap Analysis,
Documentation Coverage.

Detect what the Velaris documentation is *missing* for the user's topic. A
**Retrieval Evidence Metrics** block is provided — use its coverage and
consistency scores as evidence of gaps. Low coverage IS the finding.

Respond in the user's language, following this structure:

```
## Análise de Lacunas · [tema]

### Cobertura Atual
[What the documentation does cover, wit
**Context Of Use:** Runtime prompt contract for /knowledge-gap engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Explainability Audit
**Source:** `prompts/engines/explainabilityAudit.md`  **Status:** Stable  **Chars:** 1338

**Logic:** # Oracle Engine | Explainability Audit

Active engine: **Explainability Audit**. Theory base: Explainable AI,
Human-Centered XAI.

Audit a recommendation (Abraxos's own or one the user names) for its evidential
basis. A **Retrieval Evidence Metrics** block is provided in context with
deterministically computed scores — quote those numbers verbatim. Never invent
or alter them.

Respond in the user's language, following this structure:

```
## Auditoria de Explicabilidade · [recomendação auditada]
**Context Of Use:** Runtime prompt contract for /audit engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Organizational Memory
**Source:** `prompts/engines/organizationalMemory.md`  **Status:** Stable  **Chars:** 1341

**Logic:** # Oracle Engine | Organizational Memory

Active engine: **Organizational Memory**. Theory base: Organizational Memory
Systems, Knowledge Management, Knowledge Retrieval.

Operate as the **institutional memory** of the Velaris Design System. The user
is not asking for a generic best practice — they are asking what *this*
organization has already learned. Answer from the retrieved Velaris evidence
(Design Decisions, history, guidelines, foundations, reasoning), never from
generic design folklore.

**Context Of Use:** Runtime prompt contract for /memory engine.

---

## [ENGINE_CONTRACT] Oracle Engine | Decision Archaeology
**Source:** `prompts/engines/decisionArchaeology.md`  **Status:** Stable  **Chars:** 1341

**Logic:** # Oracle Engine | Decision Archaeology

Active engine: **Decision Archaeology**. Theory base: Design Rationale,
Architecture Decision Records (ADR).

Reconstruct the *origin* of a decision from the retrieved Velaris evidence. The
output MUST follow this structure exactly, in the user's language:

```
## Arqueologia da Decisão · [decisão / entidade]

### Problema
[The original problem or pressure that forced a decision.]

### Alternativas Consideradas
- [option A] — [why it was on the table]
- [o
**Context Of Use:** Runtime prompt contract for /decision engine.

---

## [DEV_INTEGRATION] API Endpoints
**Source:** `DevIntegrationPage.tsx`  **Status:** Stable  **Chars:** 357

**Structure:** REST + streaming endpoints served by the FastAPI server on port 3333
**Logic:** Beatrice exposes /api/chat (SSE streaming) and /health (status check).
**Context Of Use:** Integrating Beatrice into external tools, dashboards or developer workflows
**When To Use:** Use /api/chat for all oracle queries. Use /health to verify server status.
**When Not To Use:** Do not poll /api/chat for non-query operations.
**Trade Offs:** SSE streaming requires EventSource-compatible clients.
**Aetheris Insight:** The API contract mirrors OpenAI streaming format — compatible with most AI SDK clients.

---

## [DEV_INTEGRATION] Framework Support
**Source:** `DevIntegrationPage.tsx`  **Status:** Stable  **Chars:** 262

**Structure:** npm packages: @aetheris/core, @aetheris/tokens, @aetheris/react
**Logic:** Aetheris ships framework-specific adapters alongside a framework-agnostic core.
**Context Of Use:** Setting up Aetheris in a new or existing project
**When To Use:** Install @aetheris/react for React projects, @aetheris/vue for Vue projects.
**When Not To Use:** Do not import @aetheris/react in a Vue project or vice versa.
**Trade Offs:** Framework packages add a thin adapter layer — minimal overhead, maximum type safety.
**Aetheris Insight:** The core + tokens separation means theme changes never require framework updates.

---

## [COMPONENT] Button — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2857

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Button exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Button.
**When To Use:** Use when the user asks why Button exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Excesso de botões primários dilui a hierarquia e aumenta hesitação
**Accessibility:** Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span. Enter e Espaço disparam a ação. O indicador de foco permanece visível antes e depois do clique. O texto do botão deve dizer o que acontece ao clicar. Se só houver ícone, inclua aria-label equivalente.
**Rag Relation:** Deepens the canonical Button registry with institutional reasoning.
**Aetheris Insight:** Button should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Toggle/Switch — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3224

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Toggle/Switch exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Toggle/Switch.
**When To Use:** Use when the user asks why Toggle/Switch exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Sem rótulo explícito, o usuário pode não entender o que o estado controla
**Accessibility:** Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela. Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário. O rótulo deve dizer o que muda ao alternar — por exemplo, "Notificações por e-mail", não só "Ligado".
**Rag Relation:** Deepens the canonical Toggle/Switch registry with institutional reasoning.
**Aetheris Insight:** Toggle/Switch should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Checkbox — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2917

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Checkbox exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Checkbox.
**When To Use:** Use when the user asks why Checkbox exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Listas longas sem agrupamento elevam custo de leitura e comparação
**Accessibility:** Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente. Espaço marca ou desmarca. Em formulários, Enter envia sem alternar a caixa por acidente. Quando parte de um grupo está marcada, comunique o estado "parcialmente selecionado" ao leitor de tela.
**Rag Relation:** Deepens the canonical Checkbox registry with institutional reasoning.
**Aetheris Insight:** Checkbox should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Radio Button — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2925

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Radio Button exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Radio Button.
**When To Use:** Use when the user asks why Radio Button exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Muitas opções ocupam espaço e tornam o grupo difícil de escanear
**Accessibility:** As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde. Setas movem o foco entre opções do mesmo grupo. Tab leva para o próximo campo fora do grupo. Espaço seleciona a opção focada. Apenas uma opção pode estar marcada por vez no grupo.
**Rag Relation:** Deepens the canonical Radio Button registry with institutional reasoning.
**Aetheris Insight:** Radio Button should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Selectable Chip / Badge — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3018

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Selectable Chip / Badge exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Selectable Chip / Badge.
**When To Use:** Use when the user asks why Selectable Chip / Badge exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Muitos chips criam ruído e quebram a hierarquia da página
**Accessibility:** Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela. Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes. Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado.
**Rag Relation:** Deepens the canonical Selectable Chip / Badge registry with institutional reasoning.
**Aetheris Insight:** Selectable Chip / Badge should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Input / Text Input — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3030

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Input / Text Input exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Input / Text Input.
**When To Use:** Use when the user asks why Input / Text Input exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Validação tardia pode obrigar o usuário a reconstruir todo o contexto
**Accessibility:** Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo. Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto. Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável.
**Rag Relation:** Deepens the canonical Input / Text Input registry with institutional reasoning.
**Aetheris Insight:** Input / Text Input should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Text Area — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2903

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Text Area exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Text Area.
**When To Use:** Use when the user asks why Text Area exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Campos muito altos dominam a página; campos baixos escondem a expectativa
**Accessibility:** Rótulo visível descrevendo o que o usuário deve escrever — ex.: "Descrição do problema". Limite de caracteres e orientações ficam ligados ao campo, não como texto solto sem relação. Enter cria nova linha. Se Enter enviar o formulário, documente isso perto do campo.
**Rag Relation:** Deepens the canonical Text Area registry with institutional reasoning.
**Aetheris Insight:** Text Area should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Select/Dropdown — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2973

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Select/Dropdown exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Select/Dropdown.
**When To Use:** Use when the user asks why Select/Dropdown exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Esconder opções reduz descoberta e torna comparação mais lenta
**Accessibility:** Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela. Se customizar, implemente abertura/fechamento, navegação por setas e opção selecionada anunciável. Setas navegam opções; Enter confirma; Escape fecha sem perder o valor já selecionado.
**Rag Relation:** Deepens the canonical Select/Dropdown registry with institutional reasoning.
**Aetheris Insight:** Select/Dropdown should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Date Picker — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2938

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Date Picker exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Date Picker.
**When To Use:** Use when the user asks why Date Picker exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta
**Accessibility:** Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse. Mostre o formato esperado (ex.: DD/MM/AAAA) e valide com mensagem clara quando a data for inválida. No calendário, setas navegam dias; hoje, selecionado e desabilitado devem ser anunciáveis.
**Rag Relation:** Deepens the canonical Date Picker registry with institutional reasoning.
**Aetheris Insight:** Date Picker should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Form Field — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2970

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Form Field exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Form Field.
**When To Use:** Use when the user asks why Form Field exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Abstração rígida pode limitar layouts especiais; preserve slots claros
**Accessibility:** Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente. Instrução, contador de caracteres e erro ficam associados ao campo na ordem que faz sentido ler. Tab segue a ordem visual. Campos que aparecem condicionalmente entram sem pular etapas.
**Rag Relation:** Deepens the canonical Form Field registry with institutional reasoning.
**Aetheris Insight:** Form Field should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Link — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2851

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Link exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Link.
**When To Use:** Use when the user asks why Link exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Links genéricos como 'saiba mais' perdem contexto fora do parágrafo
**Accessibility:** Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável. O texto descreve para onde vai ou o que acontece — evite "clique aqui" ou "saiba mais" soltos. Enter ativa o link. Foco visível distingue o link do texto normal ao redor.
**Rag Relation:** Deepens the canonical Link registry with institutional reasoning.
**Aetheris Insight:** Link should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Tabs — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2786

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Tabs exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Tabs.
**When To Use:** Use when the user asks why Tabs exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Muitas abas escondem conteúdo e prejudicam responsividade
**Accessibility:** Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra. Setas movem entre abas. Tab entra no conteúdo do painel ativo. A aba selecionada deve ser anunciada — não dependa só de cor, peso ou sublinhado.
**Rag Relation:** Deepens the canonical Tabs registry with institutional reasoning.
**Aetheris Insight:** Tabs should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Card — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2817

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Card exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Card.
**When To Use:** Use when the user asks why Card exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Card excessivo fragmenta a leitura e cria falsa prioridade
**Accessibility:** Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado. Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação. Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara.
**Rag Relation:** Deepens the canonical Card registry with institutional reasoning.
**Aetheris Insight:** Card should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Modal/Dialog — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2947

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Modal/Dialog exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Modal/Dialog.
**When To Use:** Use when the user asks why Modal/Dialog exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Interrupções frequentes destroem fluxo e acumulam problemas de foco
**Accessibility:** Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar. Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir. Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação.
**Rag Relation:** Deepens the canonical Modal/Dialog registry with institutional reasoning.
**Aetheris Insight:** Modal/Dialog should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Table/Data Table — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2996

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Table/Data Table exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Table/Data Table.
**When To Use:** Use when the user asks why Table/Data Table exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas
**Accessibility:** Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra. Coluna ordenada deve ser anunciada — ex.: "Nome, ordenado crescente" — não só indicada por seta. Ordenar colunas e selecionar linhas deve funcionar por teclado, não só por clique.
**Rag Relation:** Deepens the canonical Table/Data Table registry with institutional reasoning.
**Aetheris Insight:** Table/Data Table should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Alert — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2834

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Alert exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Alert.
**When To Use:** Use when the user asks why Alert exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Alertas demais causam cegueira e reduzem o valor da hierarquia semântica
**Accessibility:** Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade. A mensagem descreve a severidade em palavras. Cor reforça, mas nunca substitui o texto. Botões dentro do alerta (fechar, desfazer) acessíveis por teclado com foco visível.
**Rag Relation:** Deepens the canonical Alert registry with institutional reasoning.
**Aetheris Insight:** Alert should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Toast/Notification — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2939

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Toast/Notification exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Toast/Notification.
**When To Use:** Use when the user asks why Toast/Notification exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações
**Accessibility:** Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda. Não desapareça rápido demais. Respeite tempo de leitura e permita pausar quando houver ação. Erros e avisos críticos permanecem ou ficam acessíveis em histórico recuperável.
**Rag Relation:** Deepens the canonical Toast/Notification registry with institutional reasoning.
**Aetheris Insight:** Toast/Notification should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Skeleton Loader — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2947

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Skeleton Loader exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Skeleton Loader.
**When To Use:** Use when the user asks why Skeleton Loader exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida
**Accessibility:** O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente. Placeholders visuais ficam ocultos do leitor de tela — são decoração, não conteúdo real. Skeletons não entram na ordem de Tab e não simulam botões ou campos reais.
**Rag Relation:** Deepens the canonical Skeleton Loader registry with institutional reasoning.
**Aetheris Insight:** Skeleton Loader should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Explanation Bubble / Tooltip — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3048

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Explanation Bubble / Tooltip exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Explanation Bubble / Tooltip.
**When To Use:** Use when the user asks why Explanation Bubble / Tooltip exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Hover exclusivo falha em toque, teclado e tecnologias assistivas
**Accessibility:** Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse. Informação necessária para concluir a tarefa não pode existir só dentro do tooltip. Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência.
**Rag Relation:** Deepens the canonical Explanation Bubble / Tooltip registry with institutional reasoning.
**Aetheris Insight:** Explanation Bubble / Tooltip should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Confidence Badge — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3003

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Confidence Badge exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Confidence Badge.
**When To Use:** Use when the user asks why Confidence Badge exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Percentual isolado pode ser interpretado como probabilidade objetiva de verdade
**Accessibility:** Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual. Todos os níveis de confiança mantêm contraste legível no tema ativo. Badge não deve ser o único indicador para aprovar ou rejeitar algo importante.
**Rag Relation:** Deepens the canonical Confidence Badge registry with institutional reasoning.
**Aetheris Insight:** Confidence Badge should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Command Palette / Barra de Comandos — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3067

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Command Palette / Barra de Comandos exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Command Palette / Barra de Comandos.
**When To Use:** Use when the user asks why Command Palette / Barra de Comandos exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Descoberta depende de nomes, sinônimos e ranking coerentes
**Accessibility:** Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis. Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior. Anuncie quantos resultados aparecem e quando a busca não retorna nada.
**Rag Relation:** Deepens the canonical Command Palette / Barra de Comandos registry with institutional reasoning.
**Aetheris Insight:** Command Palette / Barra de Comandos should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Source Attribution — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2859

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Source Attribution exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Source Attribution.
**When To Use:** Use when the user asks why Source Attribution exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo
**Accessibility:** Botão de expandir comunica se a lista de fontes está aberta ou fechada. Enter e Espaço expandem e colapsam. Foco visível no botão de expandir. Após expandir, metadados e links seguem ordem lógica de leitura.
**Rag Relation:** Deepens the canonical Source Attribution registry with institutional reasoning.
**Aetheris Insight:** Source Attribution should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Audit Panel — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2949

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Audit Panel exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Audit Panel.
**When To Use:** Use when the user asks why Audit Panel exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Detalhe técnico excessivo pode confundir usuários sem contexto operacional
**Accessibility:** O painel de auditoria tem nome claro — ex.: "Trilha de auditoria" — para o leitor de tela anunciar a seção. Subseções usam títulos reais (h2, h3) para navegação por leitor de tela. Eventos em ordem cronológica com marcos textuais — data, ação e resultado legíveis.
**Rag Relation:** Deepens the canonical Audit Panel registry with institutional reasoning.
**Aetheris Insight:** Audit Panel should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Typography — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2769

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Typography exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Typography.
**When To Use:** Use when the user asks why Typography exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Muitas variações enfraquecem consistência e tornam a leitura imprevisível
**Accessibility:** Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário. Texto corpo e legendas atendem contraste AA (WCAG) no tema ativo. Legível com zoom de 200% sem truncar conteúdo essencial.
**Rag Relation:** Deepens the canonical Typography registry with institutional reasoning.
**Aetheris Insight:** Typography should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Icon — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2753

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.
**Logic:** Institutional memory for why Icon exists and what breaks when it is misused.
**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Icon.
**When To Use:** Use when the user asks why Icon exists, what risks it controls, what alternatives were rejected or what consequences a change creates.
**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.
**Trade Offs:** Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes
**Accessibility:** Ícone que só complementa texto visível fica oculto do leitor de tela. Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo. Ícone interativo alcançável por Tab com foco visível.
**Rag Relation:** Deepens the canonical Icon registry with institutional reasoning.
**Aetheris Insight:** Icon should be explained as a design-system decision, not only as a reusable UI element.

---

## [COMPONENT] Button — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1208

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Button.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Button.
**When To Use:** Use when the user asks how Button looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Button becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Button | Component logic: Use uma ação primária por região focal e rebaixe
escolhas concorrentes. Structure: Rótulo curto, alvo mínimo de 44px e ícone opcional. Designer: inspeciona hierarquia
visual, densidade e alinhamento de Button com tokens e composição. | UX Specialist: avalia o comportamento humano que
Button incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API,
estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto
sistêmico e custo de extensão de Button em superfícies de action. | QA: cria cenários para default, foco, erro,
indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio,
nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em
tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Button em
linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção
governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Toggle/Switch — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1401

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Toggle/Switch.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Toggle/Switch.
**When To Use:** Use when the user asks how Toggle/Switch looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Toggle/Switch becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Toggle/Switch | Component logic: Off e On definem o valor. Focus demonstra foco de
teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode
alterna o comportamento operacional. Structure: Trilho, indicador móvel, rótulo persistente e estado textual quando
necessário. Designer: inspeciona hierarquia visual, densidade e alinhamento de Toggle/Switch com tokens e composição. |
UX Specialist: avalia o comportamento humano que Toggle/Switch incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Toggle/Switch em superfícies de action. |
QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Toggle/Switch em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Checkbox — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1235

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Checkbox.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Checkbox.
**When To Use:** Use when the user asks how Checkbox looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Checkbox becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Checkbox | Component logic: Cada opção deve continuar válida mesmo quando as
demais não são selecionadas. Structure: Caixa, indicador de seleção, rótulo clicável e apoio opcional. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Checkbox com tokens e composição. | UX Specialist: avalia o
comportamento humano que Checkbox incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer:
protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede
acoplamento, impacto sistêmico e custo de extensão de Checkbox em superfícies de action. | QA: cria cenários para
default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida
teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer:
observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma
o racional de Checkbox em linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a
divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Radio Button — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1248

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Radio Button.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Radio Button.
**When To Use:** Use when the user asks how Radio Button looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Radio Button becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Radio Button | Component logic: Expor todas as opções reduz memória de trabalho e
facilita comparação direta. Structure: Grupo nomeado, círculos de seleção e rótulos completos. Designer: inspeciona
hierarquia visual, densidade e alinhamento de Radio Button com tokens e composição. | UX Specialist: avalia o
comportamento humano que Radio Button incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer:
protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede
acoplamento, impacto sistêmico e custo de extensão de Radio Button em superfícies de action. | QA: cria cenários para
default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida
teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer:
observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma
o racional de Radio Button em linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a
divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Selectable Chip / Badge — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1327

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Selectable Chip / Badge.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Selectable Chip / Badge.
**When To Use:** Use when the user asks how Selectable Chip / Badge looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Selectable Chip / Badge becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Selectable Chip / Badge | Component logic: Chips funcionam melhor com rótulos
curtos, conjunto pequeno e estado selecionado evidente. Structure: Pílula compacta com rótulo, ícone opcional e
indicador de seleção. Designer: inspeciona hierarquia visual, densidade e alinhamento de Selectable Chip / Badge com
tokens e composição. | UX Specialist: avalia o comportamento humano que Selectable Chip / Badge incentiva, a hesitação
que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração
com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de
Selectable Chip / Badge em superfícies de action. | QA: cria cenários para default, foco, erro, indisponibilidade,
regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível,
contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em tokens, estados e
exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Selectable Chip / Badge em
linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção
governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Input / Text Input — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1295

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Input / Text Input.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Input / Text Input.
**When To Use:** Use when the user asks how Input / Text Input looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Input / Text Input becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Input / Text Input | Component logic: O rótulo define o dado esperado; placeholder
oferece exemplo, nunca substitui instrução. Structure: Label, controle, apoio, indicador opcional e mensagem de erro.
Designer: inspeciona hierarquia visual, densidade e alinhamento de Input / Text Input com tokens e composição. | UX
Specialist: avalia o comportamento humano que Input / Text Input incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Input / Text Input em superfícies de
input. | QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados
extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a
semântica é removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes
paralelas. | Tech Writer: transforma o racional de Input / Text Input em linguagem de decisão, exemplos, limites e
migração. | Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de
adoção.

---

## [COMPONENT] Text Area — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1217

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Text Area.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Text Area.
**When To Use:** Use when the user asks how Text Area looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Text Area becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Text Area | Component logic: A altura inicial comunica a profundidade esperada da
resposta. Structure: Label, área redimensionável, apoio e contador opcional. Designer: inspeciona hierarquia visual,
densidade e alinhamento de Text Area com tokens e composição. | UX Specialist: avalia o comportamento humano que Text
Area incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados,
semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e
custo de extensão de Text Area em superfícies de input. | QA: cria cenários para default, foco, erro, indisponibilidade,
regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível,
contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em tokens, estados e
exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Text Area em linguagem de
decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção governada, evolução do
componente ou dívida de adoção.

---

## [COMPONENT] Select/Dropdown — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1261

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Select/Dropdown.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Select/Dropdown.
**When To Use:** Use when the user asks how Select/Dropdown looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Select/Dropdown becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Select/Dropdown | Component logic: Economiza espaço, mas transfere a comparação
para um painel temporário. Structure: Label, trigger, valor atual, lista e indicadores de seleção. Designer: inspeciona
hierarquia visual, densidade e alinhamento de Select/Dropdown com tokens e composição. | UX Specialist: avalia o
comportamento humano que Select/Dropdown incentiva, a hesitação que reduz e a confusão que ainda pode criar. |
Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution
Architect: mede acoplamento, impacto sistêmico e custo de extensão de Select/Dropdown em superfícies de input. | QA:
cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Select/Dropdown em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Date Picker — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1262

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Date Picker.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Date Picker.
**When To Use:** Use when the user asks how Date Picker looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Date Picker becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Date Picker | Component logic: Entrada digitável acelera especialistas; calendário
apoia descoberta e contexto. Structure: Campo formatado, botão de calendário, grade mensal e navegação temporal.
Designer: inspeciona hierarquia visual, densidade e alinhamento de Date Picker com tokens e composição. | UX Specialist:
avalia o comportamento humano que Date Picker incentiva, a hesitação que reduz e a confusão que ainda pode criar. |
Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution
Architect: mede acoplamento, impacto sistêmico e custo de extensão de Date Picker em superfícies de input. | QA: cria
cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Date Picker em linguagem de decisão, exemplos, limites e migração. | Design System
Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Form Field — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1269

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Form Field.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Form Field.
**When To Use:** Use when the user asks how Form Field looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Form Field becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Form Field | Component logic: Centralizar o contrato evita que cada formulário
reconstrua acessibilidade e espaçamento. Structure: Label, controle filho, texto de apoio, erro e indicador de
obrigatoriedade. Designer: inspeciona hierarquia visual, densidade e alinhamento de Form Field com tokens e composição.
| UX Specialist: avalia o comportamento humano que Form Field incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Form Field em superfícies de input. | QA:
cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Form Field em linguagem de decisão, exemplos, limites e migração. | Design System
Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Link — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1222

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Link.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Link.
**When To Use:** Use when the user asks how Link looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Link becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Link | Component logic: Destino é navegação; mudança no estado atual é ação e deve
usar Button. Structure: Texto descritivo, indicador opcional de destino externo e foco visível. Designer: inspeciona
hierarquia visual, densidade e alinhamento de Link com tokens e composição. | UX Specialist: avalia o comportamento
humano que Link incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de
API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto
sistêmico e custo de extensão de Link em superfícies de navigation. | QA: cria cenários para default, foco, erro,
indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio,
nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em
tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Link em
linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção
governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Tabs — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1193

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Tabs.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Tabs.
**When To Use:** Use when the user asks how Tabs looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Tabs becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Tabs | Component logic: Cada aba representa uma visão irmã, não uma etapa
sequencial. Structure: Tablist, tabs, indicador ativo e painéis associados. Designer: inspeciona hierarquia visual,
densidade e alinhamento de Tabs com tokens e composição. | UX Specialist: avalia o comportamento humano que Tabs
incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados,
semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e
custo de extensão de Tabs em superfícies de navigation. | QA: cria cenários para default, foco, erro, indisponibilidade,
regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível,
contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em tokens, estados e
exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Tabs em linguagem de
decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção governada, evolução do
componente ou dívida de adoção.

---

## [COMPONENT] Card — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1188

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Card.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Card.
**When To Use:** Use when the user asks how Card looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Card becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Card | Component logic: A borda visual deve refletir uma fronteira semântica real.
Structure: Container, título, metadados, corpo e ações opcionais. Designer: inspeciona hierarquia visual, densidade e
alinhamento de Card com tokens e composição. | UX Specialist: avalia o comportamento humano que Card incentiva, a
hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e
integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão
de Card em superfícies de layout. | QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e
combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de
informação quando a semântica é removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que
podem virar variantes paralelas. | Tech Writer: transforma o racional de Card em linguagem de decisão, exemplos, limites
e migração. | Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de
adoção.

---

## [COMPONENT] Modal/Dialog — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1280

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Modal/Dialog.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Modal/Dialog.
**When To Use:** Use when the user asks how Modal/Dialog looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Modal/Dialog becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Modal/Dialog | Component logic: A interrupção só se justifica quando concluir ou
cancelar é necessário antes de continuar. Structure: Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e
fechar. Designer: inspeciona hierarquia visual, densidade e alinhamento de Modal/Dialog com tokens e composição. | UX
Specialist: avalia o comportamento humano que Modal/Dialog incentiva, a hesitação que reduz e a confusão que ainda pode
criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Modal/Dialog em superfícies de overlay. |
QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Modal/Dialog em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Table/Data Table — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1279

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Table/Data Table.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Table/Data Table.
**When To Use:** Use when the user asks how Table/Data Table looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Table/Data Table becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Table/Data Table | Component logic: Tabela é ideal quando cruzar valores por
cabeçalho é a tarefa principal. Structure: Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Table/Data Table com tokens e composição. | UX Specialist:
avalia o comportamento humano que Table/Data Table incentiva, a hesitação que reduz e a confusão que ainda pode criar. |
Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution
Architect: mede acoplamento, impacto sistêmico e custo de extensão de Table/Data Table em superfícies de data_display. |
QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Table/Data Table em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Alert — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1213

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Alert.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Alert.
**When To Use:** Use when the user asks how Alert looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Alert becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Alert | Component logic: A severidade deve refletir consequência real, não
preferência visual. Structure: Ícone semântico, título, mensagem e ação ou dismiss opcional. Designer: inspeciona
hierarquia visual, densidade e alinhamento de Alert com tokens e composição. | UX Specialist: avalia o comportamento
humano que Alert incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de
API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto
sistêmico e custo de extensão de Alert em superfícies de feedback. | QA: cria cenários para default, foco, erro,
indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio,
nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em
tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Alert em
linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência é exceção
governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Toast/Notification — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1285

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Toast/Notification.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Toast/Notification.
**When To Use:** Use when the user asks how Toast/Notification looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Toast/Notification becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Toast/Notification | Component logic: A mensagem deve ser curta, autossuficiente e
dispensável após poucos segundos. Structure: Container flutuante, mensagem, ícone e ação curta opcional. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Toast/Notification com tokens e composição. | UX Specialist:
avalia o comportamento humano que Toast/Notification incentiva, a hesitação que reduz e a confusão que ainda pode criar.
| Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution
Architect: mede acoplamento, impacto sistêmico e custo de extensão de Toast/Notification em superfícies de feedback. |
QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Toast/Notification em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Skeleton Loader — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1288

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Skeleton Loader.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Skeleton Loader.
**When To Use:** Use when the user asks how Skeleton Loader looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Skeleton Loader becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Skeleton Loader | Component logic: Imitar a forma final reduz mudança de layout e
melhora percepção de velocidade. Structure: Blocos neutros com dimensões próximas do conteúdo final e animação moderada.
Designer: inspeciona hierarquia visual, densidade e alinhamento de Skeleton Loader com tokens e composição. | UX
Specialist: avalia o comportamento humano que Skeleton Loader incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Skeleton Loader em superfícies de
feedback. | QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados
extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a
semântica é removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes
paralelas. | Tech Writer: transforma o racional de Skeleton Loader em linguagem de decisão, exemplos, limites e
migração. | Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de
adoção.

---

## [COMPONENT] Explanation Bubble / Tooltip — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1359

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Explanation Bubble / Tooltip.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Explanation Bubble / Tooltip.
**When To Use:** Use when the user asks how Explanation Bubble / Tooltip looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Explanation Bubble / Tooltip becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Explanation Bubble / Tooltip | Component logic: A explicação complementa o
conteúdo visível; informação essencial não pode depender dela. Structure: Trigger nomeado, bolha curta, seta opcional e
posicionamento adaptativo. Designer: inspeciona hierarquia visual, densidade e alinhamento de Explanation Bubble /
Tooltip com tokens e composição. | UX Specialist: avalia o comportamento humano que Explanation Bubble / Tooltip
incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados,
semântica DOM e integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e
custo de extensão de Explanation Bubble / Tooltip em superfícies de feedback. | QA: cria cenários para default, foco,
erro, indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco,
anúncio, nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa
fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o
racional de Explanation Bubble / Tooltip em linguagem de decisão, exemplos, limites e migração. | Design System Manager:
decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Confidence Badge — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1289

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Confidence Badge.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Confidence Badge.
**When To Use:** Use when the user asks how Confidence Badge looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Confidence Badge becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Confidence Badge | Component logic: Confiança deriva da qualidade da evidência,
não do tom assertivo da resposta. Structure: Percentual ou faixa, rótulo semântico e acesso à explicação da calibração.
Designer: inspeciona hierarquia visual, densidade e alinhamento de Confidence Badge com tokens e composição. | UX
Specialist: avalia o comportamento humano que Confidence Badge incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Confidence Badge em superfícies de
feedback. | QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados
extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a
semântica é removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes
paralelas. | Tech Writer: transforma o racional de Confidence Badge em linguagem de decisão, exemplos, limites e
migração. | Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de
adoção.

---

## [COMPONENT] Command Palette / Barra de Comandos — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1377

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Command Palette / Barra de Comandos.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Command Palette / Barra de Comandos.
**When To Use:** Use when the user asks how Command Palette / Barra de Comandos looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Command Palette / Barra de Comandos becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Command Palette / Barra de Comandos | Component logic: A consulta reduz o espaço
de opções e combina descoberta com produtividade. Structure: Dialog, input de busca, grupos, resultados, atalhos e
estado vazio. Designer: inspeciona hierarquia visual, densidade e alinhamento de Command Palette / Barra de Comandos com
tokens e composição. | UX Specialist: avalia o comportamento humano que Command Palette / Barra de Comandos incentiva, a
hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e
integração com componentes relacionados. | Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão
de Command Palette / Barra de Comandos em superfícies de navigation. | QA: cria cenários para default, foco, erro,
indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco, anúncio,
nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa fragilidade em
tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o racional de Command
Palette / Barra de Comandos em linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a
divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Source Attribution — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1289

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Source Attribution.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Source Attribution.
**When To Use:** Use when the user asks how Source Attribution looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Source Attribution becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Source Attribution | Component logic: Rastreabilidade transforma resposta fluente
em conhecimento verificável. Structure: Fonte, trecho, relevância, metadados e ação para inspecionar contexto. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Source Attribution com tokens e composição. | UX Specialist:
avalia o comportamento humano que Source Attribution incentiva, a hesitação que reduz e a confusão que ainda pode criar.
| Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution
Architect: mede acoplamento, impacto sistêmico e custo de extensão de Source Attribution em superfícies de content. |
QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. |
Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é
removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. |
Tech Writer: transforma o racional de Source Attribution em linguagem de decisão, exemplos, limites e migração. | Design
System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Audit Panel — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1280

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Audit Panel.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Audit Panel.
**When To Use:** Use when the user asks how Audit Panel looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Audit Panel becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Audit Panel | Component logic: Detalhes de processo ficam disponíveis sob demanda
sem competir com a resposta principal. Structure: Linha do tempo, eventos, entradas, saídas, status e artefatos
exportáveis. Designer: inspeciona hierarquia visual, densidade e alinhamento de Audit Panel com tokens e composição. |
UX Specialist: avalia o comportamento humano que Audit Panel incentiva, a hesitação que reduz e a confusão que ainda
pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes relacionados. |
Solution Architect: mede acoplamento, impacto sistêmico e custo de extensão de Audit Panel em superfícies de
data_display. | QA: cria cenários para default, foco, erro, indisponibilidade, regressão visual e combinações com dados
extremos. | Accessibility: valida teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a
semântica é removida. | Maintainer: observa fragilidade em tokens, estados e exceções locais que podem virar variantes
paralelas. | Tech Writer: transforma o racional de Audit Panel em linguagem de decisão, exemplos, limites e migração. |
Design System Manager: decide se a divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Typography — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1241

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Typography.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Typography.
**When To Use:** Use when the user asks how Typography looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Typography becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Typography | Component logic: Escala e peso devem refletir a prioridade
epistemológica do conteúdo. Structure: Tokens de display, heading, body, label e code com regras de uso. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Typography com tokens e composição. | UX Specialist: avalia o
comportamento humano que Typography incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer:
protege contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede
acoplamento, impacto sistêmico e custo de extensão de Typography em superfícies de content. | QA: cria cenários para
default, foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida
teclado, foco, anúncio, nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer:
observa fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma
o racional de Typography em linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a
divergência é exceção governada, evolução do componente ou dívida de adoção.

---

## [COMPONENT] Icon — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1221

**Structure:** Nine-perspective component interpretation matrix.
**Logic:** Different professional lenses ask different questions about Icon.
**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Icon.
**When To Use:** Use when the user asks how Icon looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.
**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.
**Aetheris Insight:** Icon becomes institutional knowledge when each discipline can explain its risk and responsibility.

**Institutional Text:**
VELARIS COMPONENT PERSPECTIVE MATRIX: Icon | Component logic: Ícones apoiam reconhecimento, mas rótulos sustentam
compreensão. Structure: Glyph vetorial, tamanho por token, stroke consistente e label quando necessário. Designer:
inspeciona hierarquia visual, densidade e alinhamento de Icon com tokens e composição. | UX Specialist: avalia o
comportamento humano que Icon incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege
contrato de API, estados, semântica DOM e integração com componentes relacionados. | Solution Architect: mede
acoplamento, impacto sistêmico e custo de extensão de Icon em superfícies de content. | QA: cria cenários para default,
foco, erro, indisponibilidade, regressão visual e combinações com dados extremos. | Accessibility: valida teclado, foco,
anúncio, nome acessível, contraste e perda de informação quando a semântica é removida. | Maintainer: observa
fragilidade em tokens, estados e exceções locais que podem virar variantes paralelas. | Tech Writer: transforma o
racional de Icon em linguagem de decisão, exemplos, limites e migração. | Design System Manager: decide se a divergência
é exceção governada, evolução do componente ou dívida de adoção.

---

## [DESIGN_DECISION] Button vs Link
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 666

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Button changes state or submits an explicit action; Link moves the user to another destination.
**Context Of Use:** Use this comparison when deciding between command and destination behavior.
**When To Use:** Use when asked to compare Button and Link.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** A button used for navigation hides routing semantics; a link used for mutation weakens accessibility and user trust.
**Aetheris Insight:** The wrong choice teaches users the wrong mental model and creates QA ambiguity around Enter/Space, href, disabled and history behavior.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Button vs Link | Difference: Button changes state or submits an explicit action; Link
moves the user to another destination. | Advantages: Button carries consequence, priority and async state. Link carries
destination, shareability and navigation expectation. | Limitations: A button used for navigation hides routing
semantics; a link used for mutation weakens accessibility and user trust. | Context of use: Use this comparison when
deciding between command and destination behavior. | User impact: The wrong choice teaches users the wrong mental model
and creates QA ambiguity around Enter/Space, href, disabled and history behavior.

---

## [DESIGN_DECISION] Modal/Dialog vs Drawer
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 732

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Dialog isolates attention and blocks continuation; Drawer preserves more spatial context but is not currently a canonical Velaris component.
**Context Of Use:** Use for overlay decisions, especially confirmation, creation and contextual editing flows.
**When To Use:** Use when asked to compare Modal/Dialog and Drawer.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Dialog overuse creates interruption fatigue. Drawer without governance can become a hidden second page with weak focus policy.
**Aetheris Insight:** Choosing Dialog asserts that the user must decide now; choosing Drawer asserts that surrounding context remains relevant.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Modal/Dialog vs Drawer | Difference: Dialog isolates attention and blocks continuation;
Drawer preserves more spatial context but is not currently a canonical Velaris component. | Advantages: Dialog is strong
for short blocking decisions. Drawer is better for contextual editing when future governance approves it. | Limitations:
Dialog overuse creates interruption fatigue. Drawer without governance can become a hidden second page with weak focus
policy. | Context of use: Use for overlay decisions, especially confirmation, creation and contextual editing flows. |
User impact: Choosing Dialog asserts that the user must decide now; choosing Drawer asserts that surrounding context
remains relevant.

---

## [DESIGN_DECISION] Tooltip vs Popover
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 717

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Tooltip offers short supplemental explanation; Popover implies richer interactive content and is not canonical yet.
**Context Of Use:** Use when deciding whether help belongs inline, in a tooltip, or in a future richer disclosure component.
**When To Use:** Use when asked to compare Explanation Bubble / Tooltip and Popover.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Tooltip cannot hold essential instructions or complex controls. Popover adds focus, dismissal and mobile complexity.
**Aetheris Insight:** Hiding essential information in a tooltip creates touch and assistive-technology failures; promoting it to Popover requires a new contract.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Tooltip vs Popover | Difference: Tooltip offers short supplemental explanation; Popover
implies richer interactive content and is not canonical yet. | Advantages: Tooltip is lightweight and tied to a trigger.
Popover can support richer help if promoted to a governed component. | Limitations: Tooltip cannot hold essential
instructions or complex controls. Popover adds focus, dismissal and mobile complexity. | Context of use: Use when
deciding whether help belongs inline, in a tooltip, or in a future richer disclosure component. | User impact: Hiding
essential information in a tooltip creates touch and assistive-technology failures; promoting it to Popover requires a
new contract.

---

## [DESIGN_DECISION] Toast vs Alert
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 611

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Toast is transient confirmation; Alert is persistent contextual feedback with consequence.
**Context Of Use:** Use for status messages, save confirmations, failures and recoverable warnings.
**When To Use:** Use when asked to compare Toast/Notification and Alert.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Toast disappears and is poor for required action. Alert can create noise if severity is inflated.
**Aetheris Insight:** The wrong choice either hides necessary recovery or interrupts users for messages they did not need to stop for.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Toast vs Alert | Difference: Toast is transient confirmation; Alert is persistent
contextual feedback with consequence. | Advantages: Toast preserves flow after low-risk updates. Alert keeps high-
importance information visible and actionable. | Limitations: Toast disappears and is poor for required action. Alert
can create noise if severity is inflated. | Context of use: Use for status messages, save confirmations, failures and
recoverable warnings. | User impact: The wrong choice either hides necessary recovery or interrupts users for messages
they did not need to stop for.

---

## [DESIGN_DECISION] Skeleton Loader vs Spinner
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 689

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Skeleton predicts the shape of incoming content; Spinner only says work is happening and is not a canonical Velaris component here.
**Context Of Use:** Use when deciding how to represent loading for cards, tables, text regions and unknown operations.
**When To Use:** Use when asked to compare Skeleton Loader and Spinner.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Skeleton is misleading when final geometry is unknown. Spinner gives no progress, structure or recovery signal.
**Aetheris Insight:** A bad loading pattern trains users to doubt whether content, error or empty state is coming next.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Skeleton Loader vs Spinner | Difference: Skeleton predicts the shape of incoming content;
Spinner only says work is happening and is not a canonical Velaris component here. | Advantages: Skeleton reduces layout
shift and perceived waiting. Spinner can fit unknown-duration operations if later governed. | Limitations: Skeleton is
misleading when final geometry is unknown. Spinner gives no progress, structure or recovery signal. | Context of use:
Use when deciding how to represent loading for cards, tables, text regions and unknown operations. | User impact: A bad
loading pattern trains users to doubt whether content, error or empty state is coming next.

---

## [DESIGN_DECISION] Accordion vs Tabs
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 686

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Tabs switch between sibling views in the same context; Accordion exposes collapsible sections and is not canonical yet.
**Context Of Use:** Use for navigation inside a page, content organization and progressive disclosure decisions.
**When To Use:** Use when asked to compare Accordion and Tabs.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Tabs hide simultaneous comparison. Accordion can bury content and create ambiguous heading/focus behavior.
**Aetheris Insight:** Using Tabs for steps misleads users; using Accordion for critical choices can hide important decisions from scanning.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Accordion vs Tabs | Difference: Tabs switch between sibling views in the same context;
Accordion exposes collapsible sections and is not canonical yet. | Advantages: Tabs support direct view switching and
stateful panels. Accordion can reduce vertical density if introduced with governance. | Limitations: Tabs hide
simultaneous comparison. Accordion can bury content and create ambiguous heading/focus behavior. | Context of use: Use
for navigation inside a page, content organization and progressive disclosure decisions. | User impact: Using Tabs for
steps misleads users; using Accordion for critical choices can hide important decisions from scanning.

---

## [DESIGN_DECISION] Checkbox vs Radio Button
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 560

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Checkbox supports independent inclusion; Radio Button supports exactly one choice in a known set.
**Context Of Use:** Use for preferences, filters, consent, settings and selection groups.
**When To Use:** Use when asked to compare Checkbox and Radio Button.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Checkbox fails for exclusive choices. Radio becomes heavy for long lists.
**Aetheris Insight:** Wrong selection semantics create invalid data and make validation feel arbitrary.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Checkbox vs Radio Button | Difference: Checkbox supports independent inclusion; Radio
Button supports exactly one choice in a known set. | Advantages: Checkbox allows multiple valid selections. Radio keeps
comparison visible for mutually exclusive options. | Limitations: Checkbox fails for exclusive choices. Radio becomes
heavy for long lists. | Context of use: Use for preferences, filters, consent, settings and selection groups. | User
impact: Wrong selection semantics create invalid data and make validation feel arbitrary.

---

## [DESIGN_DECISION] Select/Dropdown vs Radio Button
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 532

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Select hides a larger option set behind a trigger; Radio exposes a small set for comparison.
**Context Of Use:** Use for choice-count and discoverability decisions.
**When To Use:** Use when asked to compare Select/Dropdown and Radio Button.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Select slows comparison. Radio consumes space and breaks down with many options.
**Aetheris Insight:** Overusing Select hides important tradeoffs; overusing Radio makes forms long and noisy.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Select/Dropdown vs Radio Button | Difference: Select hides a larger option set behind a
trigger; Radio exposes a small set for comparison. | Advantages: Select saves space and handles scale. Radio improves
recognition and comparison. | Limitations: Select slows comparison. Radio consumes space and breaks down with many
options. | Context of use: Use for choice-count and discoverability decisions. | User impact: Overusing Select hides
important tradeoffs; overusing Radio makes forms long and noisy.

---

## [DESIGN_DECISION] Input / Text Input vs Text Area
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 597

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Input captures short structured values; Text Area captures longer prose, rationale or prompts.
**Context Of Use:** Use for forms, prompts, comments, justifications and search-like inputs.
**When To Use:** Use when asked to compare Input / Text Input and Text Area.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Input truncates thinking when used for long answers. Text Area overstates effort for simple data.
**Aetheris Insight:** The field size silently communicates expected effort; wrong sizing changes answer quality.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Input / Text Input vs Text Area | Difference: Input captures short structured values; Text
Area captures longer prose, rationale or prompts. | Advantages: Input optimizes speed and format validation. Text Area
supports reflection, detail and longer editing. | Limitations: Input truncates thinking when used for long answers. Text
Area overstates effort for simple data. | Context of use: Use for forms, prompts, comments, justifications and search-
like inputs. | User impact: The field size silently communicates expected effort; wrong sizing changes answer quality.

---

## [DESIGN_DECISION] Source Attribution vs Audit Panel
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 634

**Structure:** Difference, advantages, limitations, context and user impact.
**Logic:** Source Attribution explains where a claim came from; Audit Panel exposes process, sequence and evidence quality.
**Context Of Use:** Use for XAI, evidence disclosure, governance and debugging the reasoning chain.
**When To Use:** Use when asked to compare Source Attribution and Audit Panel.
**When Not To Use:** Do not collapse the pair into generic preference; preserve semantic consequences.
**Trade Offs:** Attribution alone cannot explain a multi-step decision. Audit Panel is too heavy for every answer.
**Aetheris Insight:** Confusing the two either overburdens simple evidence or under-explains consequential AI decisions.

**Institutional Text:**
VELARIS COMPARATIVE DECISION: Source Attribution vs Audit Panel | Difference: Source Attribution explains where a claim
came from; Audit Panel exposes process, sequence and evidence quality. | Advantages: Source Attribution is concise and
local. Audit Panel supports inspection, accountability and debugging. | Limitations: Attribution alone cannot explain a
multi-step decision. Audit Panel is too heavy for every answer. | Context of use: Use for XAI, evidence disclosure,
governance and debugging the reasoning chain. | User impact: Confusing the two either overburdens simple evidence or
under-explains consequential AI decisions.

---

## [GUIDELINE] Knowledge Relationships — Action Controls
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 377

**Structure:** Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette
**Logic:** Action controls differ by consequence, destination, visibility and command density.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation prevents teams from treating every clickable element as a styled button.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Action Controls | Graph: Button ↔ Link ↔ IconButton candidate
↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette | Logic: Action controls differ by consequence,
destination, visibility and command density. | Impact: This relation prevents teams from treating every clickable
element as a styled button.

---

## [GUIDELINE] Knowledge Relationships — Overlay And Interruption
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 439

**Structure:** Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert
**Logic:** Interruption patterns are governed by how much focus isolation and page context the decision requires.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation keeps blocking decisions, contextual editing and feedback severity from collapsing into one overlay pattern.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Overlay And Interruption | Graph: Modal/Dialog ↔ Drawer
candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert | Logic: Interruption patterns are
governed by how much focus isolation and page context the decision requires. | Impact: This relation keeps blocking
decisions, contextual editing and feedback severity from collapsing into one overlay pattern.

---

## [GUIDELINE] Knowledge Relationships — Help And Validation
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 373

**Structure:** Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert
**Logic:** Help belongs near the question, while validation belongs near the correction path.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation prevents essential guidance from being hidden behind hover-only help.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Help And Validation | Graph: Explanation Bubble / Tooltip ↔
Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert | Logic: Help belongs near the question, while
validation belongs near the correction path. | Impact: This relation prevents essential guidance from being hidden
behind hover-only help.

---

## [GUIDELINE] Knowledge Relationships — Feedback And Loading
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 397

**Structure:** Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution
**Logic:** Feedback patterns vary by persistence, urgency, reversibility and whether content is pending or failed.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation avoids using transient feedback for required recovery or using loading UI for known empty states.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Feedback And Loading | Graph: Toast ↔ Alert ↔ Skeleton Loader
↔ Empty State Pattern ↔ Source Attribution | Logic: Feedback patterns vary by persistence, urgency, reversibility and
whether content is pending or failed. | Impact: This relation avoids using transient feedback for required recovery or
using loading UI for known empty states.

---

## [GUIDELINE] Knowledge Relationships — Selection And Forms
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 408

**Structure:** Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker
**Logic:** Selection controls differ by independence, exclusivity, option count, format and validation burden.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation reduces invalid data and helps teams choose controls by decision shape rather than visual preference.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Selection And Forms | Graph: Checkbox ↔ Radio Button ↔
Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker | Logic: Selection controls differ by independence,
exclusivity, option count, format and validation burden. | Impact: This relation reduces invalid data and helps teams
choose controls by decision shape rather than visual preference.

---

## [GUIDELINE] Knowledge Relationships — Data And Explainability
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 392

**Structure:** Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography
**Logic:** Dense information and AI evidence need structure, provenance and auditability to remain trustworthy.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation keeps explanation artifacts connected to the data surfaces where users inspect decisions.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Data And Explainability | Graph: Data Table ↔ Confidence Badge
↔ Source Attribution ↔ Audit Panel ↔ Typography | Logic: Dense information and AI evidence need structure, provenance
and auditability to remain trustworthy. | Impact: This relation keeps explanation artifacts connected to the data
surfaces where users inspect decisions.

---

## [GUIDELINE] Knowledge Relationships — Navigation And Discovery
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 377

**Structure:** Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon
**Logic:** Navigation patterns vary by destination, sibling view, discovery mode and content grouping.
**Context Of Use:** Semantic relationship questions, alternative selection and governance review.
**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.
**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.
**Aetheris Insight:** This relation prevents global navigation, local view switching and command search from sharing ambiguous affordances.

**Institutional Text:**
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Navigation And Discovery | Graph: Tabs ↔ Link ↔ Command
Palette ↔ Card ↔ Typography ↔ Icon | Logic: Navigation patterns vary by destination, sibling view, discovery mode and
content grouping. | Impact: This relation prevents global navigation, local view switching and command search from
sharing ambiguous affordances.

---

## [GUIDELINE] Legacy Modal to Modal/Dialog
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 493

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Inventory all legacy modals, classify by blocking decision, long task or contextual edit, then keep only short blocking decisions as Dialog.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing legacy modal to modal/dialog.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Nested modals, lost focus return, hidden form errors and unclear cancel paths.
**Aetheris Insight:** Keyboard trap, Escape, focus restoration, accessible name, cancel action and error recovery.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Legacy Modal to Modal/Dialog | Strategy: Inventory all legacy modals, classify by blocking
decision, long task or contextual edit, then keep only short blocking decisions as Dialog. | Risks: Nested modals, lost
focus return, hidden form errors and unclear cancel paths. | Effort: Medium: interaction review, focus tests, content
reduction and regression QA. | Validation: Keyboard trap, Escape, focus restoration, accessible name, cancel action and
error recovery.

---

## [GUIDELINE] Legacy Table to Table/Data Table
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 523

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Map columns to user comparison tasks, restore caption/header semantics, define sorting and mobile priority before styling.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing legacy table to table/data table.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Decorative grid markup, truncated critical identifiers, row actions competing with scanability.
**Aetheris Insight:** Header association, sort announcement, row action labels, overflow behavior and empty/error/loading states.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Legacy Table to Table/Data Table | Strategy: Map columns to user comparison tasks, restore
caption/header semantics, define sorting and mobile priority before styling. | Risks: Decorative grid markup, truncated
critical identifiers, row actions competing with scanability. | Effort: High for dense products: data modeling,
responsive behavior and QA fixtures are required. | Validation: Header association, sort announcement, row action
labels, overflow behavior and empty/error/loading states.

---

## [GUIDELINE] Custom Input to Canonical Input / Text Input
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 535

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Replace visual-only fields with Form Field plus canonical Input, preserving labels, helper text, errors and autocomplete.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing custom input to canonical input / text input.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Placeholder-as-label, lost aria-describedby, aggressive validation and wiped values after failed submit.
**Aetheris Insight:** Label persistence, inputMode/type, helper text, error message, preserved value and screen-reader announcement.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Custom Input to Canonical Input / Text Input | Strategy: Replace visual-only fields with
Form Field plus canonical Input, preserving labels, helper text, errors and autocomplete. | Risks: Placeholder-as-label,
lost aria-describedby, aggressive validation and wiped values after failed submit. | Effort: Medium: mechanical
replacement is simple, but validation and copy need review. | Validation: Label persistence, inputMode/type, helper
text, error message, preserved value and screen-reader announcement.

---

## [GUIDELINE] Styled Link Button to Button or Link
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 477

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Classify each interaction by outcome: state mutation becomes Button; navigation becomes Link.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing styled link button to button or link.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Broken keyboard expectations, disabled links without explanation, submit actions hidden behind href.
**Aetheris Insight:** Enter/Space behavior, href/history behavior, disabled policy and destination/action label clarity.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Styled Link Button to Button or Link | Strategy: Classify each interaction by outcome:
state mutation becomes Button; navigation becomes Link. | Risks: Broken keyboard expectations, disabled links without
explanation, submit actions hidden behind href. | Effort: Low to medium: semantic cleanup plus visual parity and
analytics checks. | Validation: Enter/Space behavior, href/history behavior, disabled policy and destination/action
label clarity.

---

## [GUIDELINE] Hover Help to Explanation Bubble / Tooltip
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 504

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Move essential instructions inline, keep only supplemental microcopy in Tooltip, and wire focus plus aria-describedby.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing hover help to explanation bubble / tooltip.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Touch users cannot access help, disabled triggers cannot receive focus, long help becomes unreadable.
**Aetheris Insight:** Hover, focus, Escape, positioning, mobile fallback and whether the page still works without the tooltip.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Hover Help to Explanation Bubble / Tooltip | Strategy: Move essential instructions inline,
keep only supplemental microcopy in Tooltip, and wire focus plus aria-describedby. | Risks: Touch users cannot access
help, disabled triggers cannot receive focus, long help becomes unreadable. | Effort: Medium: content triage is usually
harder than implementation. | Validation: Hover, focus, Escape, positioning, mobile fallback and whether the page still
works without the tooltip.

---

## [GUIDELINE] Spinner-Heavy Loading to Skeleton Loader
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 475

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Use Skeleton only where final geometry is predictable; otherwise define a governed loading or progress pattern.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing spinner-heavy loading to skeleton loader.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** False shape promises, endless loading, motion sensitivity and confusion with empty state.
**Aetheris Insight:** Reserved dimensions, prefers-reduced-motion, busy region, error transition and layout shift.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Spinner-Heavy Loading to Skeleton Loader | Strategy: Use Skeleton only where final geometry
is predictable; otherwise define a governed loading or progress pattern. | Risks: False shape promises, endless loading,
motion sensitivity and confusion with empty state. | Effort: Medium: each surface needs geometry mapping and failure
fallback. | Validation: Reserved dimensions, prefers-reduced-motion, busy region, error transition and layout shift.

---

## [GUIDELINE] Mixed Notifications to Alert and Toast
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 484

**Structure:** Legacy to modern migration strategy with risks, effort and validation.
**Logic:** Separate transient confirmations into Toast and persistent consequence-bearing messages into Alert.
**Context Of Use:** Migration advisor, governance cleanup and design-system adoption planning.
**When To Use:** Use when modernizing mixed notifications to alert and toast.
**When Not To Use:** Do not treat migration as a visual swap; preserve behavior, accessibility and evidence.
**Trade Offs:** Critical messages vanish, low-risk messages interrupt flow, duplicate global/local feedback.
**Aetheris Insight:** Persistence, dismissibility, live region urgency, action availability and duplicate-message suppression.

**Institutional Text:**
VELARIS MIGRATION KNOWLEDGE: Mixed Notifications to Alert and Toast | Strategy: Separate transient confirmations into
Toast and persistent consequence-bearing messages into Alert. | Risks: Critical messages vanish, low-risk messages
interrupt flow, duplicate global/local feedback. | Effort: Low to medium: severity taxonomy and message inventory are
the main cost. | Validation: Persistence, dismissibility, live region urgency, action availability and duplicate-message
suppression.

---
