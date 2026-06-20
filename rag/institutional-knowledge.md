# Velaris Institutional Knowledge Supplement

Knowledge source for Abraxos RAG enrichment. This file does not change runtime architecture, model selection or prompts.

## Component Institutional Knowledge

### Button
- Design Rationale: Button existe porque aciona uma tarefa clara e comunica a prioridade da próxima ação. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Excesso de botões primários dilui a hierarquia e aumenta hesitação.
- Architectural Impact: alterações em Button afetam Link, Icon, Form Field, Modal/Dialog, Command Palette / Barra de Comandos. Os contratos frágeis são estrutura (Rótulo curto, alvo mínimo de 44px e ícone opcional), lógica (Use uma ação primária por região focal e rebaixe escolhas concorrentes) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Button orienta o usuário a interpretar use uma ação primária por região focal e rebaixe escolhas concorrentes. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span. Enter e Espaço disparam a ação. O indicador de foco permanece visível antes e depois do clique. O texto do botão deve dizer o que acontece ao clicar. Se só houver ícone, inclua aria-label equivalente. Se essa decisão for removida, Button ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Button resolve o risco organizacional de a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Button são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Link, Icon, Form Field, Modal/Dialog, Command Palette / Barra de Comandos e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Button como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Button para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Button para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Toggle/Switch
- Design Rationale: Toggle/Switch existe porque alterna imediatamente uma configuração binária entre ligada e desligada. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Sem rótulo explícito, o usuário pode não entender o que o estado controla.
- Architectural Impact: alterações em Toggle/Switch afetam Checkbox, Radio Button, Form Field, Alert, Source Attribution. Os contratos frágeis são estrutura (Trilho, indicador móvel, rótulo persistente e estado textual quando necessário), lógica (Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Toggle/Switch orienta o usuário a interpretar off e on definem o valor. focus demonstra foco de teclado sem alterar esse valor. preference aplica uma escolha pessoal, visibility mostra ou oculta conteúdo e mode alterna o comportamento operacional. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela. Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário. O rótulo deve dizer o que muda ao alternar — por exemplo, "Notificações por e-mail", não só "Ligado". Se essa decisão for removida, Toggle/Switch ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Toggle/Switch resolve o risco organizacional de a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Toggle/Switch são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Checkbox, Radio Button, Form Field, Alert, Source Attribution e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Toggle/Switch como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Toggle/Switch para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Toggle/Switch para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Checkbox
- Design Rationale: Checkbox existe porque permite selecionar zero, uma ou várias opções independentes. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Listas longas sem agrupamento elevam custo de leitura e comparação.
- Architectural Impact: alterações em Checkbox afetam Radio Button, Selectable Chip / Badge, Form Field, Table/Data Table, Toggle/Switch. Os contratos frágeis são estrutura (Caixa, indicador de seleção, rótulo clicável e apoio opcional), lógica (Cada opção deve continuar válida mesmo quando as demais não são selecionadas) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Checkbox orienta o usuário a interpretar cada opção deve continuar válida mesmo quando as demais não são selecionadas. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente. Espaço marca ou desmarca. Em formulários, Enter envia sem alternar a caixa por acidente. Quando parte de um grupo está marcada, comunique o estado "parcialmente selecionado" ao leitor de tela. Se essa decisão for removida, Checkbox ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Checkbox resolve o risco organizacional de a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Checkbox são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Radio Button, Selectable Chip / Badge, Form Field, Table/Data Table, Toggle/Switch e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Checkbox como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Checkbox para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Checkbox para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Radio Button
- Design Rationale: Radio Button existe porque seleciona exatamente uma opção visível dentro de um conjunto relacionado. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas opções ocupam espaço e tornam o grupo difícil de escanear.
- Architectural Impact: alterações em Radio Button afetam Checkbox, Select/Dropdown, Tabs, Form Field, Selectable Chip / Badge. Os contratos frágeis são estrutura (Grupo nomeado, círculos de seleção e rótulos completos), lógica (Expor todas as opções reduz memória de trabalho e facilita comparação direta) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Radio Button orienta o usuário a interpretar expor todas as opções reduz memória de trabalho e facilita comparação direta. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde. Setas movem o foco entre opções do mesmo grupo. Tab leva para o próximo campo fora do grupo. Espaço seleciona a opção focada. Apenas uma opção pode estar marcada por vez no grupo. Se essa decisão for removida, Radio Button ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Radio Button resolve o risco organizacional de a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Radio Button são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Checkbox, Select/Dropdown, Tabs, Form Field, Selectable Chip / Badge e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Radio Button como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Radio Button para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Radio Button para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Selectable Chip / Badge
- Design Rationale: Selectable Chip / Badge existe porque representa filtros ou atributos compactos que podem ser ativados individualmente. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitos chips criam ruído e quebram a hierarquia da página.
- Architectural Impact: alterações em Selectable Chip / Badge afetam Checkbox, Select/Dropdown, Button, Tabs, Card. Os contratos frágeis são estrutura (Pílula compacta com rótulo, ícone opcional e indicador de seleção), lógica (Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Selectable Chip / Badge orienta o usuário a interpretar chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela. Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes. Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado. Se essa decisão for removida, Selectable Chip / Badge ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Selectable Chip / Badge resolve o risco organizacional de a hierarquia de decisão se fragmentar entre times e ações críticas ficarem visualmente indistinguíveis. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Selectable Chip / Badge são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Checkbox, Select/Dropdown, Button, Tabs, Card e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Selectable Chip / Badge como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Selectable Chip / Badge para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Selectable Chip / Badge para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Input / Text Input
- Design Rationale: Input / Text Input existe porque captura uma linha curta de texto, busca ou valor identificável. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Validação tardia pode obrigar o usuário a reconstruir todo o contexto.
- Architectural Impact: alterações em Input / Text Input afetam Text Area, Form Field, Select/Dropdown, Date Picker, Explanation Bubble / Tooltip. Os contratos frágeis são estrutura (Label, controle, apoio, indicador opcional e mensagem de erro), lógica (O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Input / Text Input orienta o usuário a interpretar o rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo. Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto. Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável. Se essa decisão for removida, Input / Text Input ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Input / Text Input resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Input / Text Input são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Text Area, Form Field, Select/Dropdown, Date Picker, Explanation Bubble / Tooltip e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Input / Text Input como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Input / Text Input para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Input / Text Input para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Text Area
- Design Rationale: Text Area existe porque captura texto livre de várias linhas com espaço para contexto e revisão. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Campos muito altos dominam a página; campos baixos escondem a expectativa.
- Architectural Impact: alterações em Text Area afetam Input / Text Input, Form Field, Audit Panel, Source Attribution, Explanation Bubble / Tooltip. Os contratos frágeis são estrutura (Label, área redimensionável, apoio e contador opcional), lógica (A altura inicial comunica a profundidade esperada da resposta) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Text Area orienta o usuário a interpretar a altura inicial comunica a profundidade esperada da resposta. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Rótulo visível descrevendo o que o usuário deve escrever — ex.: "Descrição do problema". Limite de caracteres e orientações ficam ligados ao campo, não como texto solto sem relação. Enter cria nova linha. Se Enter enviar o formulário, documente isso perto do campo. Se essa decisão for removida, Text Area ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Text Area resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Text Area são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Form Field, Audit Panel, Source Attribution, Explanation Bubble / Tooltip e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Text Area como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Text Area para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Text Area para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Select/Dropdown
- Design Rationale: Select/Dropdown existe porque escolhe uma opção de uma lista compacta sem manter todas visíveis. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Esconder opções reduz descoberta e torna comparação mais lenta.
- Architectural Impact: alterações em Select/Dropdown afetam Radio Button, Input / Text Input, Selectable Chip / Badge, Form Field, Table/Data Table. Os contratos frágeis são estrutura (Label, trigger, valor atual, lista e indicadores de seleção), lógica (Economiza espaço, mas transfere a comparação para um painel temporário) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Select/Dropdown orienta o usuário a interpretar economiza espaço, mas transfere a comparação para um painel temporário. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela. Se customizar, implemente abertura/fechamento, navegação por setas e opção selecionada anunciável. Setas navegam opções; Enter confirma; Escape fecha sem perder o valor já selecionado. Se essa decisão for removida, Select/Dropdown ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Select/Dropdown resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Select/Dropdown são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Radio Button, Input / Text Input, Selectable Chip / Badge, Form Field, Table/Data Table e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Select/Dropdown como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Select/Dropdown para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Select/Dropdown para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Date Picker
- Design Rationale: Date Picker existe porque permite inserir ou selecionar datas com formato e limites previsíveis. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta.
- Architectural Impact: alterações em Date Picker afetam Input / Text Input, Form Field, Select/Dropdown, Alert, Table/Data Table. Os contratos frágeis são estrutura (Campo formatado, botão de calendário, grade mensal e navegação temporal), lógica (Entrada digitável acelera especialistas; calendário apoia descoberta e contexto) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Date Picker orienta o usuário a interpretar entrada digitável acelera especialistas; calendário apoia descoberta e contexto. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse. Mostre o formato esperado (ex.: DD/MM/AAAA) e valide com mensagem clara quando a data for inválida. No calendário, setas navegam dias; hoje, selecionado e desabilitado devem ser anunciáveis. Se essa decisão for removida, Date Picker ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Date Picker resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Date Picker são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Form Field, Select/Dropdown, Alert, Table/Data Table e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Date Picker como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Date Picker para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Date Picker para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Form Field
- Design Rationale: Form Field existe porque orquestra label, controle, ajuda, validação e mensagem em um contrato único. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Abstração rígida pode limitar layouts especiais; preserve slots claros.
- Architectural Impact: alterações em Form Field afetam Input / Text Input, Text Area, Select/Dropdown, Checkbox, Explanation Bubble / Tooltip. Os contratos frágeis são estrutura (Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade), lógica (Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Form Field orienta o usuário a interpretar centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente. Instrução, contador de caracteres e erro ficam associados ao campo na ordem que faz sentido ler. Tab segue a ordem visual. Campos que aparecem condicionalmente entram sem pular etapas. Se essa decisão for removida, Form Field ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Form Field resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Form Field são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Text Area, Select/Dropdown, Checkbox, Explanation Bubble / Tooltip e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Form Field como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Form Field para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Form Field para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Link
- Design Rationale: Link existe porque leva o usuário a outro destino ou recurso sem simular uma ação local. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Links genéricos como 'saiba mais' perdem contexto fora do parágrafo.
- Architectural Impact: alterações em Link afetam Button, Tabs, Command Palette / Barra de Comandos, Source Attribution, Typography. Os contratos frágeis são estrutura (Texto descritivo, indicador opcional de destino externo e foco visível), lógica (Destino é navegação; mudança no estado atual é ação e deve usar Button) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Link orienta o usuário a interpretar destino é navegação; mudança no estado atual é ação e deve usar button. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável. O texto descreve para onde vai ou o que acontece — evite "clique aqui" ou "saiba mais" soltos. Enter ativa o link. Foco visível distingue o link do texto normal ao redor. Se essa decisão for removida, Link ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Link resolve o risco organizacional de rotas, ações e superfícies de descoberta competirem pela mesma linguagem de interação. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Link são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Button, Tabs, Command Palette / Barra de Comandos, Source Attribution, Typography e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Link como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Link para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Link para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Tabs
- Design Rationale: Tabs existe porque alterna entre painéis relacionados dentro do mesmo contexto. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas abas escondem conteúdo e prejudicam responsividade.
- Architectural Impact: alterações em Tabs afetam Link, Card, Table/Data Table, Command Palette / Barra de Comandos, Typography. Os contratos frágeis são estrutura (Tablist, tabs, indicador ativo e painéis associados), lógica (Cada aba representa uma visão irmã, não uma etapa sequencial) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Tabs orienta o usuário a interpretar cada aba representa uma visão irmã, não uma etapa sequencial. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra. Setas movem entre abas. Tab entra no conteúdo do painel ativo. A aba selecionada deve ser anunciada — não dependa só de cor, peso ou sublinhado. Se essa decisão for removida, Tabs ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Tabs resolve o risco organizacional de rotas, ações e superfícies de descoberta competirem pela mesma linguagem de interação. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Tabs são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Link, Card, Table/Data Table, Command Palette / Barra de Comandos, Typography e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Tabs como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Tabs para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Tabs para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Card
- Design Rationale: Card existe porque agrupa conteúdo e ações que pertencem à mesma entidade ou decisão. A alternativa rejeitada foi depender de containers visuais usados apenas como decoração; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Card excessivo fragmenta a leitura e cria falsa prioridade.
- Architectural Impact: alterações em Card afetam Typography, Button, Link, Table/Data Table, Source Attribution. Os contratos frágeis são estrutura (Container, título, metadados, corpo e ações opcionais), lógica (A borda visual deve refletir uma fronteira semântica real) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Card orienta o usuário a interpretar a borda visual deve refletir uma fronteira semântica real. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado. Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação. Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara. Se essa decisão for removida, Card ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Card resolve o risco organizacional de containers virarem ruído decorativo em vez de agrupamento semântico. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Card são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Typography, Button, Link, Table/Data Table, Source Attribution e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Card como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Card para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Card para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Modal/Dialog
- Design Rationale: Modal/Dialog existe porque interrompe o contexto atual para uma decisão curta que exige foco. A alternativa rejeitada foi depender de hacks de página que interrompem foco sem contrato explícito; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Interrupções frequentes destroem fluxo e acumulam problemas de foco.
- Architectural Impact: alterações em Modal/Dialog afetam Button, Form Field, Alert, Explanation Bubble / Tooltip, Audit Panel. Os contratos frágeis são estrutura (Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar), lógica (A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Modal/Dialog orienta o usuário a interpretar a interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar. Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir. Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação. Se essa decisão for removida, Modal/Dialog ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Modal/Dialog resolve o risco organizacional de gestão de foco e política de interrupção virarem improviso específico de produto. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Modal/Dialog são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Button, Form Field, Alert, Explanation Bubble / Tooltip, Audit Panel e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Modal/Dialog como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Modal/Dialog para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Modal/Dialog para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Table/Data Table
- Design Rationale: Table/Data Table existe porque apresenta dados comparáveis em linhas e colunas com relações explícitas. A alternativa rejeitada foi depender de listas genéricas que perdem estrutura de comparação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas.
- Architectural Impact: alterações em Table/Data Table afetam Typography, Checkbox, Selectable Chip / Badge, Source Attribution, Audit Panel. Os contratos frágeis são estrutura (Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais), lógica (Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Table/Data Table orienta o usuário a interpretar tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra. Coluna ordenada deve ser anunciada — ex.: "Nome, ordenado crescente" — não só indicada por seta. Ordenar colunas e selecionar linhas deve funcionar por teclado, não só por clique. Se essa decisão for removida, Table/Data Table ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Table/Data Table resolve o risco organizacional de times perderem um contrato comum para escanear, comparar e auditar informação densa. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Table/Data Table são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Typography, Checkbox, Selectable Chip / Badge, Source Attribution, Audit Panel e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Table/Data Table como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Table/Data Table para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Table/Data Table para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Alert
- Design Rationale: Alert existe porque comunica um estado persistente que precisa permanecer no contexto. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Alertas demais causam cegueira e reduzem o valor da hierarquia semântica.
- Architectural Impact: alterações em Alert afetam Toast/Notification, Form Field, Button, Source Attribution, Audit Panel. Os contratos frágeis são estrutura (Ícone semântico, título, mensagem e ação ou dismiss opcional), lógica (A severidade deve refletir consequência real, não preferência visual) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Alert orienta o usuário a interpretar a severidade deve refletir consequência real, não preferência visual. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade. A mensagem descreve a severidade em palavras. Cor reforça, mas nunca substitui o texto. Botões dentro do alerta (fechar, desfazer) acessíveis por teclado com foco visível. Se essa decisão for removida, Alert ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Alert resolve o risco organizacional de usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Alert são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Toast/Notification, Form Field, Button, Source Attribution, Audit Panel e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Alert como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Alert para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Alert para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Toast/Notification
- Design Rationale: Toast/Notification existe porque confirma uma mudança recente sem bloquear o fluxo principal. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações.
- Architectural Impact: alterações em Toast/Notification afetam Alert, Button, Source Attribution, Audit Panel, Icon. Os contratos frágeis são estrutura (Container flutuante, mensagem, ícone e ação curta opcional), lógica (A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Toast/Notification orienta o usuário a interpretar a mensagem deve ser curta, autossuficiente e dispensável após poucos segundos. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda. Não desapareça rápido demais. Respeite tempo de leitura e permita pausar quando houver ação. Erros e avisos críticos permanecem ou ficam acessíveis em histórico recuperável. Se essa decisão for removida, Toast/Notification ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Toast/Notification resolve o risco organizacional de usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Toast/Notification são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Alert, Button, Source Attribution, Audit Panel, Icon e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Toast/Notification como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Toast/Notification para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Toast/Notification para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Skeleton Loader
- Design Rationale: Skeleton Loader existe porque reserva a geometria do conteúdo enquanto dados assíncronos carregam. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida.
- Architectural Impact: alterações em Skeleton Loader afetam Card, Table/Data Table, Typography, Alert, Toast/Notification. Os contratos frágeis são estrutura (Blocos neutros com dimensões próximas do conteúdo final e animação moderada), lógica (Imitar a forma final reduz mudança de layout e melhora percepção de velocidade) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Skeleton Loader orienta o usuário a interpretar imitar a forma final reduz mudança de layout e melhora percepção de velocidade. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente. Placeholders visuais ficam ocultos do leitor de tela — são decoração, não conteúdo real. Skeletons não entram na ordem de Tab e não simulam botões ou campos reais. Se essa decisão for removida, Skeleton Loader ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Skeleton Loader resolve o risco organizacional de usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Skeleton Loader são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Card, Table/Data Table, Typography, Alert, Toast/Notification e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Skeleton Loader como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Skeleton Loader para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Skeleton Loader para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Explanation Bubble / Tooltip
- Design Rationale: Explanation Bubble / Tooltip existe porque explica um termo ou controle de forma breve e contextual. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Hover exclusivo falha em toque, teclado e tecnologias assistivas.
- Architectural Impact: alterações em Explanation Bubble / Tooltip afetam Form Field, Icon, Typography, Source Attribution, Alert. Os contratos frágeis são estrutura (Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo), lógica (A explicação complementa o conteúdo visível; informação essencial não pode depender dela) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Explanation Bubble / Tooltip orienta o usuário a interpretar a explicação complementa o conteúdo visível; informação essencial não pode depender dela. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse. Informação necessária para concluir a tarefa não pode existir só dentro do tooltip. Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência. Se essa decisão for removida, Explanation Bubble / Tooltip ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Explanation Bubble / Tooltip resolve o risco organizacional de usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Explanation Bubble / Tooltip são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Form Field, Icon, Typography, Source Attribution, Alert e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Explanation Bubble / Tooltip como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Explanation Bubble / Tooltip para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Explanation Bubble / Tooltip para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Confidence Badge
- Design Rationale: Confidence Badge existe porque expressa confiança calibrada com valor, faixa e linguagem de incerteza. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Percentual isolado pode ser interpretado como probabilidade objetiva de verdade.
- Architectural Impact: alterações em Confidence Badge afetam Source Attribution, Audit Panel, Explanation Bubble / Tooltip, Alert, Table/Data Table. Os contratos frágeis são estrutura (Percentual ou faixa, rótulo semântico e acesso à explicação da calibração), lógica (Confiança deriva da qualidade da evidência, não do tom assertivo da resposta) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Confidence Badge orienta o usuário a interpretar confiança deriva da qualidade da evidência, não do tom assertivo da resposta. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual. Todos os níveis de confiança mantêm contraste legível no tema ativo. Badge não deve ser o único indicador para aprovar ou rejeitar algo importante. Se essa decisão for removida, Confidence Badge ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Confidence Badge resolve o risco organizacional de usuários deixarem de confiar no status do sistema porque urgência e consequência são inconsistentes. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Confidence Badge são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Source Attribution, Audit Panel, Explanation Bubble / Tooltip, Alert, Table/Data Table e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Confidence Badge como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Confidence Badge para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Confidence Badge para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Command Palette / Barra de Comandos
- Design Rationale: Command Palette / Barra de Comandos existe porque centraliza busca e execução rápida de destinos, componentes e ações. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Descoberta depende de nomes, sinônimos e ranking coerentes.
- Architectural Impact: alterações em Command Palette / Barra de Comandos afetam Input / Text Input, Link, Button, Tabs, Icon. Os contratos frágeis são estrutura (Dialog, input de busca, grupos, resultados, atalhos e estado vazio), lógica (A consulta reduz o espaço de opções e combina descoberta com produtividade) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Command Palette / Barra de Comandos orienta o usuário a interpretar a consulta reduz o espaço de opções e combina descoberta com produtividade. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis. Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior. Anuncie quantos resultados aparecem e quando a busca não retorna nada. Se essa decisão for removida, Command Palette / Barra de Comandos ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Command Palette / Barra de Comandos resolve o risco organizacional de rotas, ações e superfícies de descoberta competirem pela mesma linguagem de interação. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Command Palette / Barra de Comandos são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Link, Button, Tabs, Icon e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Command Palette / Barra de Comandos como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Command Palette / Barra de Comandos para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Command Palette / Barra de Comandos para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Source Attribution
- Design Rationale: Source Attribution existe porque liga uma afirmação do abraxos à evidência recuperada que a sustenta. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo.
- Architectural Impact: alterações em Source Attribution afetam Confidence Badge, Audit Panel, Card, Link, Typography. Os contratos frágeis são estrutura (Fonte, trecho, relevância, metadados e ação para inspecionar contexto), lógica (Rastreabilidade transforma resposta fluente em conhecimento verificável) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Source Attribution orienta o usuário a interpretar rastreabilidade transforma resposta fluente em conhecimento verificável. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Botão de expandir comunica se a lista de fontes está aberta ou fechada. Enter e Espaço expandem e colapsam. Foco visível no botão de expandir. Após expandir, metadados e links seguem ordem lógica de leitura. Se essa decisão for removida, Source Attribution ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Source Attribution resolve o risco organizacional de documentação, evidência e copy de interface derivarem para vocabulários separados. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Source Attribution são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Confidence Badge, Audit Panel, Card, Link, Typography e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Source Attribution como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Source Attribution para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Source Attribution para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Audit Panel
- Design Rationale: Audit Panel existe porque expõe etapas, fontes, políticas e calibração que produziram uma decisão. A alternativa rejeitada foi depender de listas genéricas que perdem estrutura de comparação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Detalhe técnico excessivo pode confundir usuários sem contexto operacional.
- Architectural Impact: alterações em Audit Panel afetam Source Attribution, Confidence Badge, Table/Data Table, Modal/Dialog, Alert. Os contratos frágeis são estrutura (Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis), lógica (Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Audit Panel orienta o usuário a interpretar detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: O painel de auditoria tem nome claro — ex.: "Trilha de auditoria" — para o leitor de tela anunciar a seção. Subseções usam títulos reais (h2, h3) para navegação por leitor de tela. Eventos em ordem cronológica com marcos textuais — data, ação e resultado legíveis. Se essa decisão for removida, Audit Panel ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Audit Panel resolve o risco organizacional de times perderem um contrato comum para escanear, comparar e auditar informação densa. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Audit Panel são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Source Attribution, Confidence Badge, Table/Data Table, Modal/Dialog, Alert e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Audit Panel como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Audit Panel para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Audit Panel para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Typography
- Design Rationale: Typography existe porque define hierarquia, ritmo e legibilidade para conteúdo operacional e explicações. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas variações enfraquecem consistência e tornam a leitura imprevisível.
- Architectural Impact: alterações em Typography afetam Card, Link, Icon, Table/Data Table, Form Field. Os contratos frágeis são estrutura (Tokens de display, heading, body, label e code com regras de uso), lógica (Escala e peso devem refletir a prioridade epistemológica do conteúdo) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Typography orienta o usuário a interpretar escala e peso devem refletir a prioridade epistemológica do conteúdo. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário. Texto corpo e legendas atendem contraste AA (WCAG) no tema ativo. Legível com zoom de 200% sem truncar conteúdo essencial. Se essa decisão for removida, Typography ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Typography resolve o risco organizacional de documentação, evidência e copy de interface derivarem para vocabulários separados. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Typography são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Card, Link, Icon, Table/Data Table, Form Field e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Typography como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Typography para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Typography para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

### Icon
- Design Rationale: Icon existe porque reforça significado, estado ou ação com uma forma visual consistente. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes.
- Architectural Impact: alterações em Icon afetam Button, Link, Explanation Bubble / Tooltip, Toast/Notification, Typography. Os contratos frágeis são estrutura (Glyph vetorial, tamanho por token, stroke consistente e label quando necessário), lógica (Ícones apoiam reconhecimento, mas rótulos sustentam compreensão) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.
- UX Consequences: Icon orienta o usuário a interpretar ícones apoiam reconhecimento, mas rótulos sustentam compreensão. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.
- Accessibility Rationale: Ícone que só complementa texto visível fica oculto do leitor de tela. Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo. Ícone interativo alcançável por Tab com foco visível. Se essa decisão for removida, Icon ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.
- Governance Perspective: Icon resolve o risco organizacional de documentação, evidência e copy de interface derivarem para vocabulários separados. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.
- Maintenance Perspective: as partes mais frágeis de Icon são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Button, Link, Explanation Bubble / Tooltip, Toast/Notification, Typography e critérios de acessibilidade.
- Failure Knowledge:
  - Tratar Icon como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.
  - Remover semântica ou foco de Icon para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.
  - Usar Icon para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade para usuários, QA e documentação.

## Knowledge Relationships

### Knowledge Relationships — Action Controls
- Graph: Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette
- Logic: Action controls differ by consequence, destination, visibility and command density.
- Impact: This relation prevents teams from treating every clickable element as a styled button.

### Knowledge Relationships — Overlay And Interruption
- Graph: Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert
- Logic: Interruption patterns are governed by how much focus isolation and page context the decision requires.
- Impact: This relation keeps blocking decisions, contextual editing and feedback severity from collapsing into one overlay pattern.

### Knowledge Relationships — Help And Validation
- Graph: Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert
- Logic: Help belongs near the question, while validation belongs near the correction path.
- Impact: This relation prevents essential guidance from being hidden behind hover-only help.

### Knowledge Relationships — Feedback And Loading
- Graph: Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution
- Logic: Feedback patterns vary by persistence, urgency, reversibility and whether content is pending or failed.
- Impact: This relation avoids using transient feedback for required recovery or using loading UI for known empty states.

### Knowledge Relationships — Selection And Forms
- Graph: Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker
- Logic: Selection controls differ by independence, exclusivity, option count, format and validation burden.
- Impact: This relation reduces invalid data and helps teams choose controls by decision shape rather than visual preference.

### Knowledge Relationships — Data And Explainability
- Graph: Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography
- Logic: Dense information and AI evidence need structure, provenance and auditability to remain trustworthy.
- Impact: This relation keeps explanation artifacts connected to the data surfaces where users inspect decisions.

### Knowledge Relationships — Navigation And Discovery
- Graph: Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon
- Logic: Navigation patterns vary by destination, sibling view, discovery mode and content grouping.
- Impact: This relation prevents global navigation, local view switching and command search from sharing ambiguous affordances.

## Comparative Chunks

### Button vs Link
- Difference: Button changes state or submits an explicit action; Link moves the user to another destination.
- Advantages: Button carries consequence, priority and async state. Link carries destination, shareability and navigation expectation.
- Limitations: A button used for navigation hides routing semantics; a link used for mutation weakens accessibility and user trust.
- Context: Use this comparison when deciding between command and destination behavior.
- User impact: The wrong choice teaches users the wrong mental model and creates QA ambiguity around Enter/Space, href, disabled and history behavior.

### Modal/Dialog vs Drawer
- Difference: Dialog isolates attention and blocks continuation; Drawer preserves more spatial context but is not currently a canonical Velaris component.
- Advantages: Dialog is strong for short blocking decisions. Drawer is better for contextual editing when future governance approves it.
- Limitations: Dialog overuse creates interruption fatigue. Drawer without governance can become a hidden second page with weak focus policy.
- Context: Use for overlay decisions, especially confirmation, creation and contextual editing flows.
- User impact: Choosing Dialog asserts that the user must decide now; choosing Drawer asserts that surrounding context remains relevant.

### Tooltip vs Popover
- Difference: Tooltip offers short supplemental explanation; Popover implies richer interactive content and is not canonical yet.
- Advantages: Tooltip is lightweight and tied to a trigger. Popover can support richer help if promoted to a governed component.
- Limitations: Tooltip cannot hold essential instructions or complex controls. Popover adds focus, dismissal and mobile complexity.
- Context: Use when deciding whether help belongs inline, in a tooltip, or in a future richer disclosure component.
- User impact: Hiding essential information in a tooltip creates touch and assistive-technology failures; promoting it to Popover requires a new contract.

### Toast vs Alert
- Difference: Toast is transient confirmation; Alert is persistent contextual feedback with consequence.
- Advantages: Toast preserves flow after low-risk updates. Alert keeps high-importance information visible and actionable.
- Limitations: Toast disappears and is poor for required action. Alert can create noise if severity is inflated.
- Context: Use for status messages, save confirmations, failures and recoverable warnings.
- User impact: The wrong choice either hides necessary recovery or interrupts users for messages they did not need to stop for.

### Skeleton Loader vs Spinner
- Difference: Skeleton predicts the shape of incoming content; Spinner only says work is happening and is not a canonical Velaris component here.
- Advantages: Skeleton reduces layout shift and perceived waiting. Spinner can fit unknown-duration operations if later governed.
- Limitations: Skeleton is misleading when final geometry is unknown. Spinner gives no progress, structure or recovery signal.
- Context: Use when deciding how to represent loading for cards, tables, text regions and unknown operations.
- User impact: A bad loading pattern trains users to doubt whether content, error or empty state is coming next.

### Accordion vs Tabs
- Difference: Tabs switch between sibling views in the same context; Accordion exposes collapsible sections and is not canonical yet.
- Advantages: Tabs support direct view switching and stateful panels. Accordion can reduce vertical density if introduced with governance.
- Limitations: Tabs hide simultaneous comparison. Accordion can bury content and create ambiguous heading/focus behavior.
- Context: Use for navigation inside a page, content organization and progressive disclosure decisions.
- User impact: Using Tabs for steps misleads users; using Accordion for critical choices can hide important decisions from scanning.

### Checkbox vs Radio Button
- Difference: Checkbox supports independent inclusion; Radio Button supports exactly one choice in a known set.
- Advantages: Checkbox allows multiple valid selections. Radio keeps comparison visible for mutually exclusive options.
- Limitations: Checkbox fails for exclusive choices. Radio becomes heavy for long lists.
- Context: Use for preferences, filters, consent, settings and selection groups.
- User impact: Wrong selection semantics create invalid data and make validation feel arbitrary.

### Select/Dropdown vs Radio Button
- Difference: Select hides a larger option set behind a trigger; Radio exposes a small set for comparison.
- Advantages: Select saves space and handles scale. Radio improves recognition and comparison.
- Limitations: Select slows comparison. Radio consumes space and breaks down with many options.
- Context: Use for choice-count and discoverability decisions.
- User impact: Overusing Select hides important tradeoffs; overusing Radio makes forms long and noisy.

### Input / Text Input vs Text Area
- Difference: Input captures short structured values; Text Area captures longer prose, rationale or prompts.
- Advantages: Input optimizes speed and format validation. Text Area supports reflection, detail and longer editing.
- Limitations: Input truncates thinking when used for long answers. Text Area overstates effort for simple data.
- Context: Use for forms, prompts, comments, justifications and search-like inputs.
- User impact: The field size silently communicates expected effort; wrong sizing changes answer quality.

### Source Attribution vs Audit Panel
- Difference: Source Attribution explains where a claim came from; Audit Panel exposes process, sequence and evidence quality.
- Advantages: Source Attribution is concise and local. Audit Panel supports inspection, accountability and debugging.
- Limitations: Attribution alone cannot explain a multi-step decision. Audit Panel is too heavy for every answer.
- Context: Use for XAI, evidence disclosure, governance and debugging the reasoning chain.
- User impact: Confusing the two either overburdens simple evidence or under-explains consequential AI decisions.

## Migration Knowledge

### Legacy Modal to Modal/Dialog
- Strategy: Inventory all legacy modals, classify by blocking decision, long task or contextual edit, then keep only short blocking decisions as Dialog.
- Risks: Nested modals, lost focus return, hidden form errors and unclear cancel paths.
- Effort: Medium: interaction review, focus tests, content reduction and regression QA.
- Validation: Keyboard trap, Escape, focus restoration, accessible name, cancel action and error recovery.

### Legacy Table to Table/Data Table
- Strategy: Map columns to user comparison tasks, restore caption/header semantics, define sorting and mobile priority before styling.
- Risks: Decorative grid markup, truncated critical identifiers, row actions competing with scanability.
- Effort: High for dense products: data modeling, responsive behavior and QA fixtures are required.
- Validation: Header association, sort announcement, row action labels, overflow behavior and empty/error/loading states.

### Custom Input to Canonical Input / Text Input
- Strategy: Replace visual-only fields with Form Field plus canonical Input, preserving labels, helper text, errors and autocomplete.
- Risks: Placeholder-as-label, lost aria-describedby, aggressive validation and wiped values after failed submit.
- Effort: Medium: mechanical replacement is simple, but validation and copy need review.
- Validation: Label persistence, inputMode/type, helper text, error message, preserved value and screen-reader announcement.

### Styled Link Button to Button or Link
- Strategy: Classify each interaction by outcome: state mutation becomes Button; navigation becomes Link.
- Risks: Broken keyboard expectations, disabled links without explanation, submit actions hidden behind href.
- Effort: Low to medium: semantic cleanup plus visual parity and analytics checks.
- Validation: Enter/Space behavior, href/history behavior, disabled policy and destination/action label clarity.

### Hover Help to Explanation Bubble / Tooltip
- Strategy: Move essential instructions inline, keep only supplemental microcopy in Tooltip, and wire focus plus aria-describedby.
- Risks: Touch users cannot access help, disabled triggers cannot receive focus, long help becomes unreadable.
- Effort: Medium: content triage is usually harder than implementation.
- Validation: Hover, focus, Escape, positioning, mobile fallback and whether the page still works without the tooltip.

### Spinner-Heavy Loading to Skeleton Loader
- Strategy: Use Skeleton only where final geometry is predictable; otherwise define a governed loading or progress pattern.
- Risks: False shape promises, endless loading, motion sensitivity and confusion with empty state.
- Effort: Medium: each surface needs geometry mapping and failure fallback.
- Validation: Reserved dimensions, prefers-reduced-motion, busy region, error transition and layout shift.

### Mixed Notifications to Alert and Toast
- Strategy: Separate transient confirmations into Toast and persistent consequence-bearing messages into Alert.
- Risks: Critical messages vanish, low-risk messages interrupt flow, duplicate global/local feedback.
- Effort: Low to medium: severity taxonomy and message inventory are the main cost.
- Validation: Persistence, dismissibility, live region urgency, action availability and duplicate-message suppression.

## Perspective Coverage

| Perspective | Component coverage |
|---|---:|
| Designer | 25 components |
| UX Specialist | 25 components |
| Developer | 25 components |
| Solution Architect | 25 components |
| QA | 25 components |
| Accessibility | 25 components |
| Maintainer | 25 components |
| Tech Writer | 25 components |
| Design System Manager | 25 components |

Supplemental chunks generated: 74.

## Agent Capabilities and Limitations

Institutional knowledge about what Abraxos does, what it does not do, and plausible future evolution. This section supports meta-questions about the agent itself — not catalog entities.

### Capabilities

Abraxos is the Velaris design-system oracle. Today it supports:

- Component guidance: when to use, when not to use, intents, states and usage examples
- Documented design decisions and trade-offs
- Governance, catalog hygiene and operational diagnostics
- Accessibility: WCAG, keyboard, ARIA, focus and interaction guardrails
- Migrations between legacy patterns and canonical Velaris contracts
- Comparisons between documented alternatives
- Interface audits against recorded rules
- Explanations with source attribution and calibrated confidence
- Professional perspectives for designer, developer, QA, product designer, tech writer and design system manager

Supported question types include catalog lookup, usage guidance, decision rationale, token impact, governance analysis, migration planning, accessibility review, comparison and audit requests.

### Limitations

Current operational boundaries:

- Does not execute code or change systems
- Does not interpret images, screenshots or visual interfaces
- Does not access external tools such as Figma, Jira or repositories
- Answers only from institutional knowledge available in Velaris
- Does not invent catalog entities, tokens or undocumented decisions

When evidence is thin, Abraxos lowers confidence and states the boundary instead of pretending certainty.

### Future Opportunities

Plausible future capabilities under evaluation — not available today:

- Multimodal analysis of screenshots and interface captures
- Visual interpretation of UI artifacts and mockups
- Direct integration with design tools such as Figma
- Richer visual audit workflows over uploaded interface evidence

These are roadmap opportunities. Abraxos must not present them as existing features.