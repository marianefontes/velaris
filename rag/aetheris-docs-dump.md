# Aetheris Design System — Corpus Dump (TSX Source)

> **Total chunks:** 581
> **Extractor:** 3.1.0-component-section-chunking + institutional knowledge supplement
> **Embedding model:** BAAI/bge-m3

---

## [COMPONENT] Button — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 715

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Button — Overview | Name: Button | Status: stable | Section: action | Description: Aciona uma tarefa clara e comunica a prioridade da próxima ação. | About: O Button representa uma ação que o usuário pode executar para alcançar um objetivo direto. Ele comunica intenção, prioridade e estado por meio de rótulos claros, estilo visual e feedback imediato. | About Features: Ação direta: Aciona uma tarefa clara no contexto atual.; Hierarquia: Diferencia ações principais, secundárias...
```

---

## [COMPONENT] Button — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 335

**Structure:** Rótulo curto, alvo mínimo de 44px e ícone opcional.

**Logic:** Use uma ação primária por região focal e rebaixe escolhas concorrentes.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Button — Structure | Logic: Use uma ação primária por região focal e rebaixe escolhas concorrentes. | Structure: Rótulo curto, alvo mínimo de 44px e ícone opcional. | Intents: Primary; Secondary; Positive; Negative | Variants: Primary; Secondary; Positive; Negative | States: Default; Hover; Focus; Loading; Disabled
```

---

## [COMPONENT] Button — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1400

**Context Of Use:** Component section: usage_1

**When To Use:** Use apenas uma ação primária por região visual para manter a hierarquia clara. Use loading quando a ação disparar uma operação assíncrona. Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca. Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados. Mantenha o texto do botão curto, direto e orientado à ação.

```
VELARIS COMPONENT: Button — Usage 1 | Do: Use apenas uma ação primária por região visual para manter a hierarquia clara.; Use loading quando a ação disparar uma operação assíncrona.; Use positive para confirmar conclusão, aprovação, restauração ou uma ação benéfica inequívoca.; Use negative apenas para ações críticas, como excluir, cancelar definitivamente ou remover dados.; Mantenha o rótulo textual, curto e orientado à ação; preserve indicador de foco visível para quem navega por teclado ou te...
```

---

## [COMPONENT] Button — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 440

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Button para navegação textual simples; use Link quando a ação for apenas navegar. Não coloque múltiplos botões primary competindo na mesma área. Não use disabled sem explicar por que a ação está indisponível. Não use intents positive ou negative como decoração; a aparência deve corresponder à consequência real. Não altere estilos manualmente fora dos tokens do design system.

```
VELARIS COMPONENT: Button — Usage 2 | When Not To Use: Não use Button para navegação textual simples; use Link quando a ação for apenas navegar. Não coloque múltiplos botões primary competindo na mesma área. Não use disabled sem explicar por que a ação está indisponível. Não use intents positive ou negative como decoração; a aparência deve corresponder à consequência real. Não altere estilos manualmente fora dos tokens do design system.
```

---

## [COMPONENT] Button — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1383

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Button — Accessibility | Accessibility: Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span. Enter e Espaço disparam a ação. O indicador de foco permanece visível antes e depois do clique. O texto do botão deve dizer o que acontece ao clicar. Se só houver ícone, inclua aria-label equivalente. | Accessibility Items: Elemento correto: Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span.; Teclado: Enter e Espaço disp...
```

---

## [COMPONENT] Button — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 881

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Button — Governance 1 | Edge Cases: Falha comum: usar Button para resolver um problema que pertence a Link, Icon, Form Field, Modal/Dialog, Command Palette / Barra de Comandos. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Button para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico...
```

---

## [COMPONENT] Button — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 840

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Button — Governance 2 | Content Guidelines (1): Design Rationale: Button existe porque aciona uma tarefa clara e comunica a prioridade da próxima ação. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Excesso de botões primários dilui a hierarquia e aumenta hesitação.; Architectural Impact: alterações em Button afetam Link, Icon...
```

---

## [COMPONENT] Button — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1495

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Button — Governance 3 | Content Guidelines (2): UX Consequences: Button orienta o usuário a interpretar use uma ação primária por região focal e rebaixe escolhas concorrentes. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.; Accessibility Rationale: Use o botão nativo do HTML (<button>) para ações. Não simule clique com div ou span. Enter e Espaço disparam a açã...
```

---

## [COMPONENT] Button — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1136

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Button — Governance 4 | Governance Notes: Risco organizacional: se Button variar por squad, o Velaris perde uma fonte única para action. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Button deve manter vocabulário, estado e relação com Link, Icon, Form Field, Modal/Dialog, Command Palette / Barra de Comandos sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergência: qualquer ...
```

---

## [COMPONENT] Button — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 774

**Context Of Use:** Component section: reference

**Trade Offs:** Excesso de botões primários dilui a hierarquia e aumenta hesitação.

**Aetheris Insight:** Uma ação primária deve tornar a decisão mais óbvia, não apenas mais colorida.

```
VELARIS COMPONENT: Button — Reference | Related Components: link; icon; form-field; modal-dialog; command-palette | Examples: Exemplo positivo: Button aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Button usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Button em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Button como decoração ou substituto de componente mais adequado. | ...
```

---

## [COMPONENT] Toggle/Switch — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 728

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Toggle/Switch — Overview | Name: Toggle/Switch | Status: stable | Section: action | Description: Alterna imediatamente uma configuração binária entre ligada e desligada. | About: O Toggle/Switch alterna uma configuração binária com efeito imediato. Ele deixa explícito se uma preferência, visibilidade ou modo está ativo, sem exigir uma etapa adicional de confirmação. | About Features: Estado persistente: Mantém a condição ligada ou desligada visível durante o uso.; Mudança imed...
```

---

## [COMPONENT] Toggle/Switch — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 464

**Structure:** Trilho, indicador móvel, rótulo persistente e estado textual quando necessário.

**Logic:** Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Toggle/Switch — Structure | Logic: Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional. | Structure: Trilho, indicador móvel, rótulo persistente e estado textual quando necessário. | Intents: Preference; Visibility; Mode | Variants: Preference; Visibility; Mode | States: Off; On; Focus; Disabled
```

---

## [COMPONENT] Toggle/Switch — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1301

**Context Of Use:** Component section: usage_1

**When To Use:** Use Switch para configurações binárias que entram em vigor imediatamente. Escreva o rótulo como a condição controlada, por exemplo, “Reduzir animações”. Mostre o estado atual por posição, contraste e texto quando a consequência não for óbvia. Posicione o Switch próximo da configuração ou conteúdo que ele altera. Confirme persistência ou falha sem reverter o estado silenciosamente.

```
VELARIS COMPONENT: Toggle/Switch — Usage 1 | Do: Use Switch para configurações binárias reversíveis que entram em vigor imediatamente, sem exigir confirmação posterior.; Escreva o rótulo como a condição controlada, por exemplo, “Reduzir animações”.; Mostre o estado atual por posição, contraste e texto quando a consequência não for óbvia.; Posicione o Switch próximo da configuração ou conteúdo que ele altera.; Confirme persistência ou falha sem reverter o estado silenciosamente. | Don't: Não use ...
```

---

## [COMPONENT] Toggle/Switch — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 468

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Switch quando a alteração depender de um botão Salvar ou Confirmar. Não use Switch para escolher entre três ou mais alternativas; use Radio ou Select. Não use rótulos vagos como “Ativar” sem indicar o que será ativado. Não use Switch para uma mudança destrutiva sem uma etapa de confirmação adequada. Não mantenha o estado otimista quando a atualização falhar; explique e restaure o valor anterior.

```
VELARIS COMPONENT: Toggle/Switch — Usage 2 | When Not To Use: Não use Switch quando a alteração depender de um botão Salvar ou Confirmar. Não use Switch para escolher entre três ou mais alternativas; use Radio ou Select. Não use rótulos vagos como “Ativar” sem indicar o que será ativado. Não use Switch para uma mudança destrutiva sem uma etapa de confirmação adequada. Não mantenha o estado otimista quando a atualização falhar; explique e restaure o valor anterior.
```

---

## [COMPONENT] Toggle/Switch — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1411

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Toggle/Switch — Accessibility | Accessibility: Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela. Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário. O rótulo deve dizer o que muda ao alternar — por exemplo, "Notificações por e-mail", não só "Ligado". | Accessibility Items: Controle de alternância: Use o controle nativo de switch ou equivalente com estado ligado/desligado an...
```

---

## [COMPONENT] Toggle/Switch — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1324

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Toggle/Switch — Governance 1 | Edge Cases: Falha comum: usar Toggle/Switch para resolver um problema que pertence a Checkbox, Radio Button, Form Field, Alert, Source Attribution. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Toggle/Switch para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern ...
```

---

## [COMPONENT] Toggle/Switch — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1083

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Toggle/Switch — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Toggle/Switch afetam Checkbox, Radio Button, Form Field, Alert, Source Attribution. Os contratos frágeis são estrutura (Trilho, indicador móvel, rótulo persistente e estado textual quando necessário), lógica (Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o compor...
```

---

## [COMPONENT] Toggle/Switch — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1240

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Toggle/Switch — Governance 3 | Content Guidelines (4): Accessibility Rationale: Use o controle nativo de switch ou equivalente com estado ligado/desligado anunciável ao leitor de tela. Espaço alterna entre ligado e desligado. Enter confirma quando o switch está dentro de um formulário. O rótulo deve dizer o que muda ao alternar — por exemplo, "Notificações por e-mail", não só "Ligado". Se essa decisão for removida, Toggle/Switch ainda pode parecer correto visualmente, mas perd...
```

---

## [COMPONENT] Toggle/Switch — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1173

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Toggle/Switch — Governance 4 | Governance Notes: Risco organizacional: se Toggle/Switch variar por squad, o Velaris perde uma fonte única para action. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Toggle/Switch deve manter vocabulário, estado e relação com Checkbox, Radio Button, Form Field, Alert, Source Attribution sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergência: ...
```

---

## [COMPONENT] Toggle/Switch — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 803

**Context Of Use:** Component section: reference

**Trade Offs:** Sem rótulo explícito, o usuário pode não entender o que o estado controla.

**Aetheris Insight:** O estado deve ser compreensível antes e depois da interação.

```
VELARIS COMPONENT: Toggle/Switch — Reference | Related Components: checkbox; radio-button; form-field; alert; source-attribution | Examples: Exemplo positivo: Toggle/Switch aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Toggle/Switch usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Toggle/Switch em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Toggle/Switch como decoração ou...
```

---

## [COMPONENT] Checkbox — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 745

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Checkbox — Overview | Name: Checkbox | Status: stable | Section: action | Description: Permite selecionar zero, uma ou várias opções independentes. | About: O Checkbox permite selecionar opções independentes ou confirmar uma condição. Ele suporta múltiplas escolhas, consentimento e estados parciais sem transformar alternativas relacionadas em uma decisão exclusiva. | About Features: Seleção múltipla: Permite combinar opções sem exclusão entre elas.; Estado parcial: Representa ...
```

---

## [COMPONENT] Checkbox — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 336

**Structure:** Caixa, indicador de seleção, rótulo clicável e apoio opcional.

**Logic:** Cada opção deve continuar válida mesmo quando as demais não são selecionadas.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Checkbox — Structure | Logic: Cada opção deve continuar válida mesmo quando as demais não são selecionadas. | Structure: Caixa, indicador de seleção, rótulo clicável e apoio opcional. | Intents: Selection; Consent; Bulk | Variants: Selection; Consent; Bulk | States: Unchecked; Checked; Indeterminate; Focus; Disabled
```

---

## [COMPONENT] Checkbox — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1257

**Context Of Use:** Component section: usage_1

**When To Use:** Use Checkbox quando cada opção puder ser selecionada de forma independente. Amplie a área clicável incluindo o rótulo e preserve um alvo mínimo de 44px. Use indeterminate apenas para representar seleção parcial em grupos hierárquicos. Explique como o estado indeterminate se relaciona com os itens filhos do grupo. Mantenha consentimentos desmarcados até uma ação explícita do usuário.

```
VELARIS COMPONENT: Checkbox — Usage 1 | Do: Use Checkbox quando cada opção puder ser selecionada de forma independente.; Associe o rótulo ao controle via htmlFor; inclua-o na área clicável e preserve um alvo mínimo de 44px para conforto em toque.; Use indeterminate apenas para representar seleção parcial em grupos hierárquicos.; Explique como o estado indeterminate se relaciona com os itens filhos do grupo.; Mantenha consentimentos desmarcados até uma ação explícita do usuário. | Don't: Não use ...
```

---

## [COMPONENT] Checkbox — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 417

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Checkbox para opções mutuamente exclusivas; use Radio Button. Não use Checkbox para uma configuração com efeito imediato quando Switch comunicar melhor a mudança. Não pré-selecione consentimento ou aceite obrigatório em nome do usuário. Não trate indeterminate como uma terceira resposta persistente. Não esconda se a seleção é obrigatória ou opcional.

```
VELARIS COMPONENT: Checkbox — Usage 2 | When Not To Use: Não use Checkbox para opções mutuamente exclusivas; use Radio Button. Não use Checkbox para uma configuração com efeito imediato quando Switch comunicar melhor a mudança. Não pré-selecione consentimento ou aceite obrigatório em nome do usuário. Não trate indeterminate como uma terceira resposta persistente. Não esconda se a seleção é obrigatória ou opcional.
```

---

## [COMPONENT] Checkbox — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1390

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Checkbox — Accessibility | Accessibility: Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente. Espaço marca ou desmarca. Em formulários, Enter envia sem alternar a caixa por acidente. Quando parte de um grupo está marcada, comunique o estado "parcialmente selecionado" ao leitor de tela. | Accessibility Items: Caixa de seleção: Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente.; Teclado: Espaço marca ou desmarca....
```

---

## [COMPONENT] Checkbox — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 900

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Checkbox — Governance 1 | Edge Cases: Falha comum: usar Checkbox para resolver um problema que pertence a Radio Button, Selectable Chip / Badge, Form Field, Table/Data Table, Toggle/Switch. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Checkbox para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pa...
```

---

## [COMPONENT] Checkbox — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 868

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Checkbox — Governance 2 | Content Guidelines (1): Design Rationale: Checkbox existe porque permite selecionar zero, uma ou várias opções independentes. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Listas longas sem agrupamento elevam custo de leitura e comparação.; Architectural Impact: alterações em Checkbox afetam Radio Bu...
```

---

## [COMPONENT] Checkbox — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1512

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Checkbox — Governance 3 | Content Guidelines (2): UX Consequences: Checkbox orienta o usuário a interpretar cada opção deve continuar válida mesmo quando as demais não são selecionadas. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.; Accessibility Rationale: Use o checkbox nativo do HTML ou equivalente com estado marcado/desmarcado coerente. Espaço marca ou des...
```

---

## [COMPONENT] Checkbox — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1159

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Checkbox — Governance 4 | Governance Notes: Risco organizacional: se Checkbox variar por squad, o Velaris perde uma fonte única para action. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Checkbox deve manter vocabulário, estado e relação com Radio Button, Selectable Chip / Badge, Form Field, Table/Data Table, Toggle/Switch sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergê...
```

---

## [COMPONENT] Checkbox — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 786

**Context Of Use:** Component section: reference

**Trade Offs:** Listas longas sem agrupamento elevam custo de leitura e comparação.

**Aetheris Insight:** Checkbox representa inclusão independente, não mudança de modo.

```
VELARIS COMPONENT: Checkbox — Reference | Related Components: radio-button; selectable-chip; form-field; data-table; toggle-switch | Examples: Exemplo positivo: Checkbox aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Checkbox usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Checkbox em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Checkbox como decoração ou substituto de com...
```

---

## [COMPONENT] Radio Button — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 746

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Radio Button — Overview | Name: Radio Button | Status: stable | Section: action | Description: Seleciona exatamente uma opção visível dentro de um conjunto relacionado. | About: O Radio Button apresenta opções mutuamente exclusivas dentro de um grupo. Ele ajuda o usuário a comparar alternativas visíveis e escolher uma única resposta sem esconder o conjunto disponível. | About Features: Escolha única: Garante apenas uma opção ativa por grupo relacionado.; Comparação visível: Ma...
```

---

## [COMPONENT] Radio Button — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 339

**Structure:** Grupo nomeado, círculos de seleção e rótulos completos.

**Logic:** Expor todas as opções reduz memória de trabalho e facilita comparação direta.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Radio Button — Structure | Logic: Expor todas as opções reduz memória de trabalho e facilita comparação direta. | Structure: Grupo nomeado, círculos de seleção e rótulos completos. | Intents: Single choice; Plan; Preference | Variants: Single choice; Plan; Preference | States: Unchecked; Checked; Focus; Disabled; Error
```

---

## [COMPONENT] Radio Button — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1241

**Context Of Use:** Component section: usage_1

**When To Use:** Use Radio Button para duas a cinco alternativas mutuamente exclusivas. Mantenha todas as opções visíveis quando a comparação entre elas ajudar a decisão. Agrupe opções relacionadas com legend e navegação por setas. Defina uma opção inicial apenas quando ela for segura, reversível e realmente recomendada. Escreva rótulos paralelos para que as diferenças entre alternativas sejam fáceis de comparar.

```
VELARIS COMPONENT: Radio Button — Usage 1 | Do: Use Radio Button para duas a cinco alternativas mutuamente exclusivas.; Mantenha todas as opções visíveis quando a comparação entre elas ajudar a decisão.; Agrupe opções relacionadas com legend e navegação por setas.; Defina uma opção inicial apenas quando ela for segura, reversível e realmente recomendada.; Escreva rótulos paralelos para que as diferenças entre alternativas sejam fáceis de comparar. | Don't: Não use Radio Button para seleção múlti...
```

---

## [COMPONENT] Radio Button — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 422

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Radio Button para seleção múltipla. Não apresente uma lista extensa que torne a página difícil de percorrer; use Select. Não deixe o grupo sem contexto ou pergunta que explique a escolha. Não pré-selecione uma alternativa que implique consentimento, custo ou risco. Não use Radio Button para uma configuração binária com efeito imediato; prefira Switch.

```
VELARIS COMPONENT: Radio Button — Usage 2 | When Not To Use: Não use Radio Button para seleção múltipla. Não apresente uma lista extensa que torne a página difícil de percorrer; use Select. Não deixe o grupo sem contexto ou pergunta que explique a escolha. Não pré-selecione uma alternativa que implique consentimento, custo ou risco. Não use Radio Button para uma configuração binária com efeito imediato; prefira Switch.
```

---

## [COMPONENT] Radio Button — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1485

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Radio Button — Accessibility | Accessibility: As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde. Setas movem o foco entre opções do mesmo grupo. Tab leva para o próximo campo fora do grupo. Espaço seleciona a opção focada. Apenas uma opção pode estar marcada por vez no grupo. | Accessibility Items: Pergunta do grupo: As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário responde.; Navegação: S...
```

---

## [COMPONENT] Radio Button — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 906

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Radio Button — Governance 1 | Edge Cases: Falha comum: usar Radio Button para resolver um problema que pertence a Checkbox, Select/Dropdown, Tabs, Form Field, Selectable Chip / Badge. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Radio Button para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-patt...
```

---

## [COMPONENT] Radio Button — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 870

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Radio Button — Governance 2 | Content Guidelines (1): Design Rationale: Radio Button existe porque seleciona exatamente uma opção visível dentro de um conjunto relacionado. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas opções ocupam espaço e tornam o grupo difícil de escanear.; Architectural Impact: alterações em Radio...
```

---

## [COMPONENT] Radio Button — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1520

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Radio Button — Governance 3 | Content Guidelines (2): UX Consequences: Radio Button orienta o usuário a interpretar expor todas as opções reduz memória de trabalho e facilita comparação direta. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.; Accessibility Rationale: As opções devem estar dentro de um grupo com título visível — a pergunta à qual o usuário respon...
```

---

## [COMPONENT] Radio Button — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1173

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Radio Button — Governance 4 | Governance Notes: Risco organizacional: se Radio Button variar por squad, o Velaris perde uma fonte única para action. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Radio Button deve manter vocabulário, estado e relação com Checkbox, Select/Dropdown, Tabs, Form Field, Selectable Chip / Badge sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergênc...
```

---

## [COMPONENT] Radio Button — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 782

**Context Of Use:** Component section: reference

**Trade Offs:** Muitas opções ocupam espaço e tornam o grupo difícil de escanear.

**Aetheris Insight:** Se as alternativas precisam ser comparadas, mantenha-as visíveis.

```
VELARIS COMPONENT: Radio Button — Reference | Related Components: checkbox; select-dropdown; tabs; form-field; selectable-chip | Examples: Exemplo positivo: Radio Button aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Radio Button usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Radio Button em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Radio Button como decoração ou subst...
```

---

## [COMPONENT] Selectable Chip / Badge — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 803

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Selectable Chip / Badge — Overview | Name: Selectable Chip / Badge | Status: stable | Section: action | Description: Representa filtros ou atributos compactos que podem ser ativados individualmente. | About: O Selectable Chip / Badge permite exibir, filtrar e alternar opções, estados ou intenções de forma compacta e clara. É ideal para representar categorias, filtros ativos, prioridades e ações rápidas em interfaces densas. | About Features: Composição compacta: Combina rótulo...
```

---

## [COMPONENT] Selectable Chip / Badge — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 355

**Structure:** Pílula compacta com rótulo, ícone opcional e indicador de seleção.

**Logic:** Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Selectable Chip / Badge — Structure | Logic: Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente. | Structure: Pílula compacta com rótulo, ícone opcional e indicador de seleção. | Intents: Filter; Tag; Attribute | Variants: Filter; Tag; Attribute | States: Default; Selected; Hover; Focus; Disabled
```

---

## [COMPONENT] Selectable Chip / Badge — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1265

**Context Of Use:** Component section: usage_1

**When To Use:** Use chips selecionáveis para filtros rápidos, tags ou atributos curtos. Mantenha o estado selecionado evidente por preenchimento, borda e aria-pressed. Limite o conjunto para que todas as opções continuem fáceis de escanear. Permita quebra de linha e remoção previsível quando vários chips estiverem selecionados. Forneça um rótulo para o grupo quando os chips representarem uma pergunta ou filtro comum.

```
VELARIS COMPONENT: Selectable Chip / Badge — Usage 1 | Do: Use chips selecionáveis para filtros rápidos, tags ou atributos curtos.; Mantenha o estado selecionado evidente por preenchimento, borda e aria-pressed.; Limite o conjunto para que todas as opções continuem fáceis de escanear.; Permita quebra de linha e remoção previsível quando vários chips estiverem selecionados.; Forneça um rótulo para o grupo quando os chips representarem uma pergunta ou filtro comum. | Don't: Não use Chip como ação ...
```

---

## [COMPONENT] Selectable Chip / Badge — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 436

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Chip como ação primária ou substituto de Button. Não misture badges informativos e chips interativos com aparência idêntica. Não use rótulos longos nem dezenas de chips em uma única linha. Não dependa apenas da cor para diferenciar chips selecionados e não selecionados. Não use uma nuvem extensa de chips quando busca ou Select oferecer melhor descoberta.

```
VELARIS COMPONENT: Selectable Chip / Badge — Usage 2 | When Not To Use: Não use Chip como ação primária ou substituto de Button. Não misture badges informativos e chips interativos com aparência idêntica. Não use rótulos longos nem dezenas de chips em uma única linha. Não dependa apenas da cor para diferenciar chips selecionados e não selecionados. Não use uma nuvem extensa de chips quando busca ou Select oferecer melhor descoberta.
```

---

## [COMPONENT] Selectable Chip / Badge — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1381

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Selectable Chip / Badge — Accessibility | Accessibility: Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela. Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes. Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado. | Accessibility Items: Chip alternável: Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela.; E...
```

---

## [COMPONENT] Selectable Chip / Badge — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1361

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Selectable Chip / Badge — Governance 1 | Edge Cases: Falha comum: usar Selectable Chip / Badge para resolver um problema que pertence a Checkbox, Select/Dropdown, Button, Tabs, Card. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Selectable Chip / Badge para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.;...
```

---

## [COMPONENT] Selectable Chip / Badge — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 837

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Selectable Chip / Badge — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Selectable Chip / Badge afetam Checkbox, Select/Dropdown, Button, Tabs, Card. Os contratos frágeis são estrutura (Pílula compacta com rótulo, ícone opcional e indicador de seleção), lógica (Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transv...
```

---

## [COMPONENT] Selectable Chip / Badge — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1238

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Selectable Chip / Badge — Governance 3 | Content Guidelines (3): Accessibility Rationale: Chips que ligam/desligam um filtro devem comunicar se estão selecionados ou não ao leitor de tela. Quando só uma opção pode ser escolhida, prefira radio buttons em vez de chips independentes. Enter e Espaço alternam seleção. Foco visível deve ser distinto de hover e de selecionado. Se essa decisão for removida, Selectable Chip / Badge ainda pode parecer correto visualmente, mas perde oper...
```

---

## [COMPONENT] Selectable Chip / Badge — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1227

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Selectable Chip / Badge — Governance 4 | Governance Notes: Risco organizacional: se Selectable Chip / Badge variar por squad, o Velaris perde uma fonte única para action. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Selectable Chip / Badge deve manter vocabulário, estado e relação com Checkbox, Select/Dropdown, Button, Tabs, Card sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de...
```

---

## [COMPONENT] Selectable Chip / Badge — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 829

**Context Of Use:** Component section: reference

**Trade Offs:** Muitos chips criam ruído e quebram a hierarquia da página.

**Aetheris Insight:** Chip é uma escolha compacta; badge passivo não deve parecer clicável.

```
VELARIS COMPONENT: Selectable Chip / Badge — Reference | Related Components: checkbox; select-dropdown; button; tabs; card | Examples: Exemplo positivo: Selectable Chip / Badge aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Selectable Chip / Badge usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Selectable Chip / Badge em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Selecta...
```

---

## [COMPONENT] Input / Text Input — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 707

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Input / Text Input — Overview | Name: Input / Text Input | Status: stable | Section: input | Description: Captura uma linha curta de texto, busca ou valor identificável. | About: O Input / Text Input captura dados curtos e previsíveis em uma única linha. Ele combina rótulo, valor, orientação e validação para reduzir ambiguidade durante busca, identificação e preenchimento. | About Features: Entrada objetiva: Recebe valores curtos com formato e propósito reconhecíveis.; Validaç...
```

---

## [COMPONENT] Input / Text Input — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 334

**Structure:** Label, controle, apoio, indicador opcional e mensagem de erro.

**Logic:** O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Input / Text Input — Structure | Logic: O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução. | Structure: Label, controle, apoio, indicador opcional e mensagem de erro. | Intents: Text; Search; Email | Variants: Text; Search; Email | States: Empty; Filled; Focus; Error; Disabled
```

---

## [COMPONENT] Input / Text Input — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1480

**Context Of Use:** Component section: usage

**When To Use:** Use Text Input para valores curtos que cabem em uma linha. Mantenha label persistente e use placeholder apenas como exemplo. Escolha type, inputMode e autocomplete de acordo com o dado solicitado. Apresente helper text antes da validação quando formato ou restrição puderem evitar erro. Preserve o valor informado quando a validação ou o envio falhar.

**When Not To Use:** Não use Input para descrições extensas; use Text Area. Não substitua o label por placeholder, pois ele desaparece durante a digitação. Não apresente erro sem explicar como o valor pode ser corrigido. Não valide cada caractere de forma agressiva quando o valor ainda estiver incompleto. Não peça dois conceitos diferentes no mesmo campo.

```
VELARIS COMPONENT: Input / Text Input — Usage | Do: Use Text Input para valores curtos que cabem em uma linha.; Mantenha label persistente e use placeholder apenas como exemplo.; Escolha type, inputMode e autocomplete de acordo com o dado solicitado.; Apresente helper text antes da validação quando formato ou restrição puderem evitar erro.; Preserve o valor informado quando a validação ou o envio falhar. | Don't: Não use Input para descrições extensas; use Text Area.; Não substitua o label por p...
```

---

## [COMPONENT] Input / Text Input — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1403

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Input / Text Input — Accessibility | Accessibility: Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo. Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto. Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável. | Accessibility Items: Rótulo do campo: Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo.; Instrução e err...
```

---

## [COMPONENT] Input / Text Input — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 949

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Input / Text Input — Governance 1 | Edge Cases: Falha comum: usar Input / Text Input para resolver um problema que pertence a Text Area, Form Field, Select/Dropdown, Date Picker, Explanation Bubble / Tooltip. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Input / Text Input para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fic...
```

---

## [COMPONENT] Input / Text Input — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1261

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Input / Text Input — Governance 2 | Content Guidelines (1): Design Rationale: Input / Text Input existe porque captura uma linha curta de texto, busca ou valor identificável. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Validação tardia pode obrigar o usuário a reconstruir todo o contexto.; Architectural Impact: alterações em...
```

---

## [COMPONENT] Input / Text Input — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1228

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Input / Text Input — Governance 3 | Content Guidelines (3): Accessibility Rationale: Todo campo precisa de rótulo visível acima ou ao lado. Placeholder não substitui rótulo. Texto de ajuda e mensagem de erro ficam ligados ao campo para o leitor de tela anunciar junto. Indique obrigatoriedade no rótulo (ex.: asterisco + texto) e no atributo required quando aplicável. Se essa decisão for removida, Input / Text Input ainda pode parecer correto visualmente, mas perde operação por ...
```

---

## [COMPONENT] Input / Text Input — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1227

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Input / Text Input — Governance 4 | Governance Notes: Risco organizacional: se Input / Text Input variar por squad, o Velaris perde uma fonte única para input. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Input / Text Input deve manter vocabulário, estado e relação com Text Area, Form Field, Select/Dropdown, Date Picker, Explanation Bubble / Tooltip sincronizados entre design, código, documentação e exemplos do ca...
```

---

## [COMPONENT] Input / Text Input — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 823

**Context Of Use:** Component section: reference

**Trade Offs:** Validação tardia pode obrigar o usuário a reconstruir todo o contexto.

**Aetheris Insight:** O campo deve explicar o formato antes de apontar o erro.

```
VELARIS COMPONENT: Input / Text Input — Reference | Related Components: text-area; form-field; select-dropdown; date-picker; explanation-tooltip | Examples: Exemplo positivo: Input / Text Input aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Input / Text Input usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Input / Text Input em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: ...
```

---

## [COMPONENT] Text Area — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 739

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Text Area — Overview | Name: Text Area | Status: stable | Section: input | Description: Captura texto livre de várias linhas com espaço para contexto e revisão. | About: O Text Area recebe conteúdo longo ou aberto quando uma única linha não é suficiente. Ele oferece espaço para contexto, comentários e instruções, mantendo orientação de tamanho e validação próximas ao campo. | About Features: Texto extenso: Acomoda múltiplas linhas sem ocultar a estrutura do conteúdo.; Altura a...
```

---

## [COMPONENT] Text Area — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 310

**Structure:** Label, área redimensionável, apoio e contador opcional.

**Logic:** A altura inicial comunica a profundidade esperada da resposta.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Text Area — Structure | Logic: A altura inicial comunica a profundidade esperada da resposta. | Structure: Label, área redimensionável, apoio e contador opcional. | Intents: Description; Prompt; Comment | Variants: Description; Prompt; Comment | States: Empty; Filled; Focus; Error; Disabled
```

---

## [COMPONENT] Text Area — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1469

**Context Of Use:** Component section: usage

**When To Use:** Use Text Area para descrições, justificativas, comentários e prompts extensos. Dimensione a altura inicial de acordo com a profundidade esperada da resposta. Ofereça contador ou limite apenas quando ele afetar a tarefa. Mantenha label e instruções visíveis durante toda a edição. Preserve rascunhos quando envio, conexão ou validação falharem.

**When Not To Use:** Não use Text Area para valores curtos ou dados estruturados. Não bloqueie redimensionamento quando o usuário puder precisar de mais espaço. Não use um campo muito alto sem necessidade, pois ele domina a página. Não dependa de placeholder para explicar o objetivo do texto. Não corte conteúdo silenciosamente quando houver limite de caracteres.

```
VELARIS COMPONENT: Text Area — Usage | Do: Use Text Area para descrições, justificativas, comentários e prompts extensos.; Dimensione a altura inicial de acordo com a profundidade esperada da resposta.; Ofereça contador ou limite apenas quando ele afetar a tarefa.; Mantenha label e instruções visíveis durante toda a edição.; Preserve rascunhos quando envio, conexão ou validação falharem. | Don't: Não use Text Area para valores curtos ou dados estruturados.; Não bloqueie redimensionamento quando ...
```

---

## [COMPONENT] Text Area — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1317

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Text Area — Accessibility | Accessibility: Rótulo visível descrevendo o que o usuário deve escrever — ex.: "Descrição do problema". Limite de caracteres e orientações ficam ligados ao campo, não como texto solto sem relação. Enter cria nova linha. Se Enter enviar o formulário, documente isso perto do campo. | Accessibility Items: Rótulo do campo: Rótulo visível descrevendo o que o usuário deve escrever — ex.: "Descrição do problema".; Instruções e limite: Limite de caracteres ...
```

---

## [COMPONENT] Text Area — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1331

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Text Area — Governance 1 | Edge Cases: Falha comum: usar Text Area para resolver um problema que pertence a Input / Text Input, Form Field, Audit Panel, Source Attribution, Explanation Bubble / Tooltip. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Text Area para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de te...
```

---

## [COMPONENT] Text Area — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1524

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Text Area — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Text Area afetam Input / Text Input, Form Field, Audit Panel, Source Attribution, Explanation Bubble / Tooltip. Os contratos frágeis são estrutura (Label, área redimensionável, apoio e contador opcional), lógica (A altura inicial comunica a profundidade esperada da resposta) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.; UX Consequ...
```

---

## [COMPONENT] Text Area — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1571

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Text Area — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Text Area são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Form Field, Audit Panel, Source Attribution, Explanation Bubble / Tooltip e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Text Area variar...
```

---

## [COMPONENT] Text Area — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 778

**Context Of Use:** Component section: reference

**Trade Offs:** Campos muito altos dominam a página; campos baixos escondem a expectativa.

**Aetheris Insight:** O tamanho inicial do campo é parte da instrução.

```
VELARIS COMPONENT: Text Area — Reference | Related Components: text-input; form-field; audit-panel; source-attribution; explanation-tooltip | Examples: Exemplo positivo: Text Area aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Text Area usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Text Area em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Text Area como decoração ou subs...
```

---

## [COMPONENT] Select/Dropdown — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 758

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Select/Dropdown — Overview | Name: Select/Dropdown | Status: stable | Section: input | Description: Escolhe uma opção de uma lista compacta sem manter todas visíveis. | About: O Select/Dropdown permite escolher um valor em uma lista quando exibir todas as opções ocuparia espaço demais. Ele preserva o valor selecionado, organiza alternativas e deve tornar a abertura e a navegação previsíveis. | About Features: Lista controlada: Apresenta opções válidas sem exigir entrada livre....
```

---

## [COMPONENT] Select/Dropdown — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 348

**Structure:** Label, trigger, valor atual, lista e indicadores de seleção.

**Logic:** Economiza espaço, mas transfere a comparação para um painel temporário.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Select/Dropdown — Structure | Logic: Economiza espaço, mas transfere a comparação para um painel temporário. | Structure: Label, trigger, valor atual, lista e indicadores de seleção. | Intents: Single choice; Filter; Configuration | Variants: Single choice; Filter; Configuration | States: Closed; Open; Selected; Error; Disabled
```

---

## [COMPONENT] Select/Dropdown — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1572

**Context Of Use:** Component section: usage

**When To Use:** Use Select para escolha única em listas médias ou longas com opções conhecidas. Mostre o valor selecionado no trigger e preserve busca quando a lista for extensa. Ordene as opções por frequência, lógica ou sequência reconhecível. Mostre um estado inicial claro quando nenhuma opção estiver selecionada. Preserve navegação por teclado, typeahead e foco previsível na lista.

**When Not To Use:** Não use Select para duas opções simples que cabem em Radio Button. Não esconda alternativas importantes que precisam ser comparadas lado a lado. Não use uma opção desabilitada como substituto de label ou instrução. Não esconda o motivo de uma opção indisponível. Não misture ações, navegação e valores selecionáveis na mesma lista.

```
VELARIS COMPONENT: Select/Dropdown — Usage | Do: Use Select para escolha única em listas médias ou longas com opções conhecidas.; Mostre o valor selecionado no trigger e preserve busca quando a lista for extensa.; Ordene as opções por frequência, lógica ou sequência reconhecível.; Mostre um estado inicial claro quando nenhuma opção estiver selecionada.; Preserve navegação por teclado, typeahead e foco previsível na lista. | Don't: Não use Select para duas opções simples que cabem em Radio Button...
```

---

## [COMPONENT] Select/Dropdown — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1371

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Select/Dropdown — Accessibility | Accessibility: Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela. Se customizar, implemente abertura/fechamento, navegação por setas e opção selecionada anunciável. Setas navegam opções; Enter confirma; Escape fecha sem perder o valor já selecionado. | Accessibility Items: Lista nativa: Para listas simples, prefira o select nativo do HTML — já funciona com teclado e leitor de tela.; Lista customiza...
```

---

## [COMPONENT] Select/Dropdown — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1344

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Select/Dropdown — Governance 1 | Edge Cases: Falha comum: usar Select/Dropdown para resolver um problema que pertence a Radio Button, Input / Text Input, Selectable Chip / Badge, Form Field, Table/Data Table. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Select/Dropdown para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica d...
```

---

## [COMPONENT] Select/Dropdown — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1587

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Select/Dropdown — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Select/Dropdown afetam Radio Button, Input / Text Input, Selectable Chip / Badge, Form Field, Table/Data Table. Os contratos frágeis são estrutura (Label, trigger, valor atual, lista e indicadores de seleção), lógica (Economiza espaço, mas transfere a comparação para um painel temporário) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões trans...
```

---

## [COMPONENT] Select/Dropdown — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1078

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Select/Dropdown — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Select/Dropdown são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Radio Button, Input / Text Input, Selectable Chip / Badge, Form Field, Table/Data Table e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Select/Dro...
```

---

## [COMPONENT] Select/Dropdown — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 578

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Select/Dropdown — Governance 4 | Anti Patterns: Tratar Select/Dropdown como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Select/Dropdown para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Select/Dropdown para mascarar decisão de produto indefinida. Consequência: o compon...
```

---

## [COMPONENT] Select/Dropdown — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 794

**Context Of Use:** Component section: reference

**Trade Offs:** Esconder opções reduz descoberta e torna comparação mais lenta.

**Aetheris Insight:** Use Select para escala, não para esconder decisões importantes.

```
VELARIS COMPONENT: Select/Dropdown — Reference | Related Components: radio-button; text-input; selectable-chip; form-field; data-table | Examples: Exemplo positivo: Select/Dropdown aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Select/Dropdown usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Select/Dropdown em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Select/Dropdown com...
```

---

## [COMPONENT] Date Picker — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 729

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Date Picker — Overview | Name: Date Picker | Status: stable | Section: input | Description: Permite inserir ou selecionar datas com formato e limites previsíveis. | About: O Date Picker apoia a seleção de datas e períodos com regras temporais explícitas. Ele combina entrada legível, calendário e validação para evitar valores impossíveis ou fora do intervalo permitido. | About Features: Contexto temporal: Mostra mês, dia e relações de intervalo durante a escolha.; Restrições vi...
```

---

## [COMPONENT] Date Picker — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 350

**Structure:** Campo formatado, botão de calendário, grade mensal e navegação temporal.

**Logic:** Entrada digitável acelera especialistas; calendário apoia descoberta e contexto.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Date Picker — Structure | Logic: Entrada digitável acelera especialistas; calendário apoia descoberta e contexto. | Structure: Campo formatado, botão de calendário, grade mensal e navegação temporal. | Intents: Single date; Range; Deadline | Variants: Single date; Range; Deadline | States: Empty; Selected; Open; Invalid; Disabled
```

---

## [COMPONENT] Date Picker — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1489

**Context Of Use:** Component section: usage

**When To Use:** Use Date Picker quando calendário, disponibilidade ou intervalo ajudarem a escolha. Permita entrada digitada para usuários que já conhecem a data. Comunique formato, limites e datas indisponíveis antes da confirmação. Respeite locale, fuso horário e convenções de formato do contexto. Preserve valores digitados válidos ao alternar entre campo e calendário.

**When Not To Use:** Não force navegação mensal para datas muito distantes. Não use apenas um calendário visual sem suporte completo a teclado. Não aceite uma data inválida sem indicar o formato ou limite correto. Não normalize uma data ambígua sem informar o valor interpretado. Não aceite um intervalo cuja data final anteceda a inicial sem explicar o erro.

```
VELARIS COMPONENT: Date Picker — Usage | Do: Use Date Picker quando calendário, disponibilidade ou intervalo ajudarem a escolha.; Permita entrada digitada para usuários que já conhecem a data.; Comunique formato, limites e datas indisponíveis antes da confirmação.; Respeite locale, fuso horário e convenções de formato do contexto.; Preserve valores digitados válidos ao alternar entre campo e calendário. | Don't: Não force navegação mensal para datas muito distantes.; Não use apenas um calendário...
```

---

## [COMPONENT] Date Picker — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1492

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Date Picker — Accessibility | Accessibility: Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse. Mostre o formato esperado (ex.: DD/MM/AAAA) e valide com mensagem clara quando a data for inválida. No calendário, setas navegam dias; hoje, selecionado e desabilitado devem ser anunciáveis. | Accessibility Items: Digitação manual: Permita digitar a data diretamente no campo — não force uso exclusivo do calendário ou mouse.; Formato esperad...
```

---

## [COMPONENT] Date Picker — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 905

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Date Picker — Governance 1 | Edge Cases: Falha comum: usar Date Picker para resolver um problema que pertence a Input / Text Input, Form Field, Select/Dropdown, Alert, Table/Data Table. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Date Picker para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pat...
```

---

## [COMPONENT] Date Picker — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1489

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Date Picker — Governance 2 | Content Guidelines (1): Design Rationale: Date Picker existe porque permite inserir ou selecionar datas com formato e limites previsíveis. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta.; Architectural Impact: alterações...
```

---

## [COMPONENT] Date Picker — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1545

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Date Picker — Governance 3 | Content Guidelines (3): hoje, selecionado e desabilitado devem ser anunciáveis. Se essa decisão for removida, Date Picker ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programático.; Governance Perspective: Date Picker resolve o risco organizacional de validação, rotulagem e recuperação divergirem de formulário para formulário. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz div...
```

---

## [COMPONENT] Date Picker — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 562

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Date Picker — Governance 4 | Anti Patterns: Tratar Date Picker como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Date Picker para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Date Picker para mascarar decisão de produto indefinida. Consequência: o componente vira workar...
```

---

## [COMPONENT] Date Picker — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 786

**Context Of Use:** Component section: reference

**Trade Offs:** Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta.

**Aetheris Insight:** Calendário e texto devem ser caminhos complementares.

```
VELARIS COMPONENT: Date Picker — Reference | Related Components: text-input; form-field; select-dropdown; alert; data-table | Examples: Exemplo positivo: Date Picker aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Date Picker usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Date Picker em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Date Picker como decoração ou substituto d...
```

---

## [COMPONENT] Form Field — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 757

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Form Field — Overview | Name: Form Field | Status: stable | Section: input | Description: Orquestra label, controle, ajuda, validação e mensagem em um contrato único. | About: O Form Field organiza rótulo, controle, ajuda e validação como uma unidade semântica. Ele cria consistência entre diferentes entradas e mantém as mensagens necessárias próximas ao ponto de decisão. | About Features: Estrutura comum: Padroniza rótulo, descrição, controle e mensagem de estado.; Erro relaci...
```

---

## [COMPONENT] Form Field — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 370

**Structure:** Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade.

**Logic:** Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Form Field — Structure | Logic: Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento. | Structure: Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade. | Intents: Data entry; Validation; Guidance | Variants: Data entry; Validation; Guidance | States: Default; Required; Valid; Error; Disabled
```

---

## [COMPONENT] Form Field — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1598

**Context Of Use:** Component section: usage

**When To Use:** Use Form Field para manter label, controle, ajuda e validação como uma unidade. Associe hint e erro ao controle com ids estáveis e aria-describedby. Reserve espaço para mensagens quando mudanças de layout prejudicarem a leitura. Comunique obrigatoriedade e opcionalidade de forma consistente antes do controle. Após envio inválido, leve foco ao resumo ou primeiro campo com erro de forma previsível.

**When Not To Use:** Não duplique labels ou mensagens já fornecidas pelo controle filho. Não comunique erro apenas pela cor da borda. Não use Form Field para conteúdo somente leitura sem comportamento de formulário. Não apresente erro antes que o usuário tenha oportunidade razoável de preencher o campo. Não apague valores válidos ou inválidos quando o formulário falhar.

```
VELARIS COMPONENT: Form Field — Usage | Do: Use Form Field para manter label, controle, ajuda e validação como uma unidade.; Associe hint e erro ao controle com ids estáveis e aria-describedby.; Reserve espaço para mensagens quando mudanças de layout prejudicarem a leitura.; Comunique obrigatoriedade e opcionalidade de forma consistente antes do controle.; Após envio inválido, leve foco ao resumo ou primeiro campo com erro de forma previsível. | Don't: Não duplique labels ou mensagens já forneci...
```

---

## [COMPONENT] Form Field — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1316

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Form Field — Accessibility | Accessibility: Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente. Instrução, contador de caracteres e erro ficam associados ao campo na ordem que faz sentido ler. Tab segue a ordem visual. Campos que aparecem condicionalmente entram sem pular etapas. | Accessibility Items: Rótulo e campo: Rótulo e input devem estar ligados — clicar no rótulo foca o campo correspondente.; Textos auxiliares: Instrução, contador de cara...
```

---

## [COMPONENT] Form Field — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1331

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Form Field — Governance 1 | Edge Cases: Falha comum: usar Form Field para resolver um problema que pertence a Input / Text Input, Text Area, Select/Dropdown, Checkbox, Explanation Bubble / Tooltip. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Form Field para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar...
```

---

## [COMPONENT] Form Field — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1598

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Form Field — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Form Field afetam Input / Text Input, Text Area, Select/Dropdown, Checkbox, Explanation Bubble / Tooltip. Os contratos frágeis são estrutura (Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade), lógica (Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a ...
```

---

## [COMPONENT] Form Field — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1565

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Form Field — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Form Field são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Input / Text Input, Text Area, Select/Dropdown, Checkbox, Explanation Bubble / Tooltip e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Form Field variar por...
```

---

## [COMPONENT] Form Field — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 799

**Context Of Use:** Component section: reference

**Trade Offs:** Abstração rígida pode limitar layouts especiais; preserve slots claros.

**Aetheris Insight:** A validação pertence ao campo como conjunto, não apenas ao input.

```
VELARIS COMPONENT: Form Field — Reference | Related Components: text-input; text-area; select-dropdown; checkbox; explanation-tooltip | Examples: Exemplo positivo: Form Field aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Form Field usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Form Field em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Form Field como decoração ou substi...
```

---

## [COMPONENT] Link — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 727

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Link — Overview | Name: Link | Status: stable | Section: navigation | Description: Leva o usuário a outro destino ou recurso sem simular uma ação local. | About: O Link leva o usuário a outro destino, recurso ou documento. Ele comunica navegação em vez de execução e mantém o endereço, o contexto de abertura e o estado de foco reconhecíveis. | About Features: Destino explícito: Indica mudança de página, seção, arquivo ou origem externa.; Rótulo descritivo: Explica o destino sem...
```

---

## [COMPONENT] Link — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 337

**Structure:** Texto descritivo, indicador opcional de destino externo e foco visível.

**Logic:** Destino é navegação; mudança no estado atual é ação e deve usar Button.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Link — Structure | Logic: Destino é navegação; mudança no estado atual é ação e deve usar Button. | Structure: Texto descritivo, indicador opcional de destino externo e foco visível. | Intents: Navigation; External; Download | Variants: Navigation; External; Download | States: Default; Hover; Focus; Visited; Disabled
```

---

## [COMPONENT] Link — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1258

**Context Of Use:** Component section: usage_1

**When To Use:** Use Link quando o resultado da interação for navegar para outro destino. Escreva um rótulo que descreva o destino mesmo fora do parágrafo. Sinalize download, nova janela ou destino externo quando isso afetar a expectativa. Mantenha o destino válido e previsível mesmo quando o texto aparecer fora do contexto original. Use alvo confortável em links isolados ou usados como ação recorrente em touch.

```
VELARIS COMPONENT: Link — Usage 1 | Do: Use Link quando o resultado da interação for navegar para outro destino.; Escreva um rótulo que descreva o destino mesmo fora do parágrafo.; Sinalize download, nova janela ou destino externo quando isso afetar a expectativa.; Mantenha o destino válido e previsível mesmo quando o texto aparecer fora do contexto original.; Use alvo confortável em links isolados ou usados como ação recorrente em touch. | Don't: Não use Link para enviar formulários ou alterar ...
```

---

## [COMPONENT] Link — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 441

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Link para enviar formulários ou alterar apenas o estado local. Não use textos genéricos como “clique aqui” ou “saiba mais” sem contexto. Não remova sublinhado ou foco sem oferecer outra indicação clara de interatividade. Não abra nova janela sem sinalizar essa mudança no rótulo ou contexto próximo. Não simule disabled removendo href; explique indisponibilidade com outro padrão.

```
VELARIS COMPONENT: Link — Usage 2 | When Not To Use: Não use Link para enviar formulários ou alterar apenas o estado local. Não use textos genéricos como “clique aqui” ou “saiba mais” sem contexto. Não remova sublinhado ou foco sem oferecer outra indicação clara de interatividade. Não abra nova janela sem sinalizar essa mudança no rótulo ou contexto próximo. Não simule disabled removendo href; explique indisponibilidade com outro padrão.
```

---

## [COMPONENT] Link — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1265

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Link — Accessibility | Accessibility: Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável. O texto descreve para onde vai ou o que acontece — evite "clique aqui" ou "saiba mais" soltos. Enter ativa o link. Foco visível distingue o link do texto normal ao redor. | Accessibility Items: Link nativo: Use o link nativo do HTML (<a href>). Não simule navegação com botão ou span clicável.; Texto do link: O texto descreve para onde vai ou o que aconte...
```

---

## [COMPONENT] Link — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1561

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Link — Governance 1 | Edge Cases: Falha comum: usar Link para resolver um problema que pertence a Button, Tabs, Command Palette / Barra de Comandos, Source Attribution, Typography. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Link para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmi...
```

---

## [COMPONENT] Link — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1254

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Link — Governance 2 | Content Guidelines (2): mudança no estado atual é ação e deve usar Button) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.; UX Consequences: Link orienta o usuário a interpretar destino é navegação; mudança no estado atual é ação e deve usar button. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do pon...
```

---

## [COMPONENT] Link — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1512

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Link — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Link são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Button, Tabs, Command Palette / Barra de Comandos, Source Attribution, Typography e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Link variar por squad, o Velaris perde...
```

---

## [COMPONENT] Link — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 746

**Context Of Use:** Component section: reference

**Trade Offs:** Links genéricos como 'saiba mais' perdem contexto fora do parágrafo.

**Aetheris Insight:** O rótulo do link deve continuar fazendo sentido isoladamente.

```
VELARIS COMPONENT: Link — Reference | Related Components: button; tabs; command-palette; source-attribution; typography | Examples: Exemplo positivo: Link aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Link usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Link em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Link como decoração ou substituto de componente mais adequado. | Tr...
```

---

## [COMPONENT] Tabs — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 718

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Tabs — Overview | Name: Tabs | Status: stable | Section: navigation | Description: Alterna entre painéis relacionados dentro do mesmo contexto. | About: Tabs alterna entre painéis relacionados no mesmo contexto sem iniciar uma nova navegação global. O componente mantém uma opção ativa, associa cada aba ao seu painel e preserva a orientação do usuário. | About Features: Conteúdo relacionado: Agrupa visões equivalentes sob uma mesma área de trabalho.; Aba ativa: Mostra seleção e...
```

---

## [COMPONENT] Tabs — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 285

**Structure:** Tablist, tabs, indicador ativo e painéis associados.

**Logic:** Cada aba representa uma visão irmã, não uma etapa sequencial.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Tabs — Structure | Logic: Cada aba representa uma visão irmã, não uma etapa sequencial. | Structure: Tablist, tabs, indicador ativo e painéis associados. | Intents: Section; View; Mode | Variants: Section; View; Mode | States: Default; Active; Hover; Focus; Disabled
```

---

## [COMPONENT] Tabs — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1456

**Context Of Use:** Component section: usage

**When To Use:** Use Tabs para alternar entre duas a seis visões irmãs no mesmo contexto. Mantenha rótulos curtos e coloque primeiro a aba mais útil ou frequente. Implemente tablist, aria-selected, painéis associados e navegação por setas. Preserve a aba ativa e o foco quando o conteúdo for atualizado ou reordenado. Atualize o painel associado sem mover foco inesperadamente.

**When Not To Use:** Não use Tabs para etapas sequenciais; use um fluxo passo a passo. Não use Tabs como navegação global do produto. Não esconda conteúdo que precisa ser comparado simultaneamente. Não comprima rótulos até ficarem ilegíveis; ofereça rolagem ou outra estrutura. Não mantenha conteúdo de painéis ocultos exposto à ordem de foco.

```
VELARIS COMPONENT: Tabs — Usage | Do: Use Tabs para alternar entre duas a seis visões irmãs no mesmo contexto.; Mantenha rótulos curtos e coloque primeiro a aba mais útil ou frequente.; Implemente tablist, aria-selected, painéis associados e navegação por setas.; Preserve a aba ativa e o foco quando o conteúdo for atualizado ou reordenado.; Atualize o painel associado sem mover foco inesperadamente. | Don't: Não use Tabs para etapas sequenciais; use um fluxo passo a passo.; Não use Tabs como nav...
```

---

## [COMPONENT] Tabs — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1301

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Tabs — Accessibility | Accessibility: Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra. Setas movem entre abas. Tab entra no conteúdo do painel ativo. A aba selecionada deve ser anunciada — não dependa só de cor, peso ou sublinhado. | Accessibility Items: Abas e painéis: Cada aba controla um painel de conteúdo. O leitor de tela precisa saber qual aba está ativa e qual painel ela mostra.; Navegação: Setas movem...
```

---

## [COMPONENT] Tabs — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 875

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Tabs — Governance 1 | Edge Cases: Falha comum: usar Tabs para resolver um problema que pertence a Link, Card, Table/Data Table, Command Palette / Barra de Comandos, Typography. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Tabs para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico: ...
```

---

## [COMPONENT] Tabs — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1568

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Tabs — Governance 2 | Content Guidelines (1): Design Rationale: Tabs existe porque alterna entre painéis relacionados dentro do mesmo contexto. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas abas escondem conteúdo e prejudicam responsividade.; Architectural Impact: alterações em Tabs afetam Link, Card, Table/...
```

---

## [COMPONENT] Tabs — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1294

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Tabs — Governance 3 | Content Guidelines (3): Governance Perspective: Tabs resolve o risco organizacional de rotas, ações e superfícies de descoberta competirem pela mesma linguagem de interação. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.; Maintenance Perspective: as partes mais frágeis de Tabs são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quand...
```

---

## [COMPONENT] Tabs — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 534

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Tabs — Governance 4 | Anti Patterns: Tratar Tabs como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Tabs para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Tabs para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade...
```

---

## [COMPONENT] Tabs — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 728

**Context Of Use:** Component section: reference

**Trade Offs:** Muitas abas escondem conteúdo e prejudicam responsividade.

**Aetheris Insight:** Abas trocam perspectiva; etapas avançam processo.

```
VELARIS COMPONENT: Tabs — Reference | Related Components: link; card; data-table; command-palette; typography | Examples: Exemplo positivo: Tabs aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Tabs usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Tabs em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Tabs como decoração ou substituto de componente mais adequado. | Trade Offs: ...
```

---

## [COMPONENT] Card — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 787

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Card — Overview | Name: Card | Status: stable | Section: layout | Description: Agrupa conteúdo e ações que pertencem à mesma entidade ou decisão. | About: O Card agrupa informações e ações que pertencem à mesma entidade ou decisão. Ele cria uma fronteira visual útil sem fragmentar a página em caixas desnecessárias e pode assumir seleção quando o conjunto exigir escolha. | About Features: Agrupamento semântico: Mantém título, conteúdo e ações da mesma entidade juntos.; Leitura ...
```

---

## [COMPONENT] Card — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 296

**Structure:** Container, título, metadados, corpo e ações opcionais.

**Logic:** A borda visual deve refletir uma fronteira semântica real.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Card — Structure | Logic: A borda visual deve refletir uma fronteira semântica real. | Structure: Container, título, metadados, corpo e ações opcionais. | Intents: Entity; Summary; Choice | Variants: Entity; Summary; Choice | States: Default; Hover; Selected; Loading; Disabled
```

---

## [COMPONENT] Card — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1498

**Context Of Use:** Component section: usage

**When To Use:** Use Card para agrupar conteúdo e ações pertencentes à mesma entidade. Mantenha título, metadados e ações em uma hierarquia previsível. Torne o card inteiro clicável apenas quando houver um único destino inequívoco. Agrupe ações relacionadas à mesma entidade sem competir com o conteúdo principal. Permita que títulos, metadados e ações reorganizem sem truncar conteúdo essencial.

**When Not To Use:** Não envolva toda seção em Card apenas para criar bordas. Não aninhe cards dentro de cards. Não misture várias ações concorrentes sem indicar qual é a principal. Não faça o card parecer clicável quando apenas controles internos são interativos. Não remova headings necessários para identificar a entidade na ordem de leitura.

```
VELARIS COMPONENT: Card — Usage | Do: Use Card para agrupar conteúdo e ações pertencentes à mesma entidade.; Mantenha título, metadados e ações em uma hierarquia previsível.; Torne o card inteiro clicável apenas quando houver um único destino inequívoco.; Agrupe ações relacionadas à mesma entidade sem competir com o conteúdo principal.; Permita que títulos, metadados e ações reorganizem sem truncar conteúdo essencial. | Don't: Não envolva toda seção em Card apenas para criar bordas.; Não aninhe ...
```

---

## [COMPONENT] Card — Accessibility 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1477

**Context Of Use:** Component section: accessibility_1

```
VELARIS COMPONENT: Card — Accessibility 1 | Accessibility: Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado. Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação. Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara. | Accessibility Items: Título do bloco: Cada card precisa de um títu...
```

---

## [COMPONENT] Card — Accessibility 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 364

**Context Of Use:** Component section: accessibility_2

```
VELARIS COMPONENT: Card — Accessibility 2 | ARIA: Título do bloco: Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado.; Ordem dos títulos: Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara.
```

---

## [COMPONENT] Card — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 860

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Card — Governance 1 | Edge Cases: Falha comum: usar Card para resolver um problema que pertence a Typography, Button, Link, Table/Data Table, Source Attribution. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Card para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico: duplicar Card e...
```

---

## [COMPONENT] Card — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1103

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Card — Governance 2 | Content Guidelines (1): Design Rationale: Card existe porque agrupa conteúdo e ações que pertencem à mesma entidade ou decisão. A alternativa rejeitada foi depender de containers visuais usados apenas como decoração; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Card excessivo fragmenta a leitura e cria falsa prioridade.; Architectural Impact: alterações em Card afetam Typography, Button, Link, Tabl...
```

---

## [COMPONENT] Card — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1234

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Card — Governance 3 | Content Guidelines (3): Accessibility Rationale: Cada card precisa de um título real (heading h2–h4), não só texto grande ou negrito. Assim quem usa leitor de tela entende do que se trata o conteúdo agrupado. Se o card inteiro for clicável, transforme-o em um único link ou botão com nome claro da ação. Respeite a hierarquia de títulos da página (h2 antes de h3). Evite vários botões ou links competindo sem ordem clara. Se essa decisão for removida, Card ai...
```

---

## [COMPONENT] Card — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1111

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Card — Governance 4 | Governance Notes: Risco organizacional: se Card variar por squad, o Velaris perde uma fonte única para layout. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Card deve manter vocabulário, estado e relação com Typography, Button, Link, Table/Data Table, Source Attribution sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergência: qualquer extensão de Card ...
```

---

## [COMPONENT] Card — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 727

**Context Of Use:** Component section: reference

**Trade Offs:** Card excessivo fragmenta a leitura e cria falsa prioridade.

**Aetheris Insight:** Um card deve responder: o que pertence junto aqui?

```
VELARIS COMPONENT: Card — Reference | Related Components: typography; button; link; data-table; source-attribution | Examples: Exemplo positivo: Card aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Card usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Card em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Card como decoração ou substituto de componente mais adequado. | Trade O...
```

---

## [COMPONENT] Modal/Dialog — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 796

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Modal/Dialog — Overview | Name: Modal/Dialog | Status: stable | Section: overlay | Description: Interrompe o contexto atual para uma decisão curta que exige foco. | About: O Modal/Dialog interrompe o fluxo para uma decisão ou tarefa que exige atenção concentrada. Ele isola o conteúdo temporário, controla o foco e oferece uma saída clara antes de devolver o usuário ao contexto anterior. | About Features: Foco temporário: Eleva uma decisão sem transformar o restante da página em...
```

---

## [COMPONENT] Modal/Dialog — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 371

**Structure:** Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar.

**Logic:** A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Modal/Dialog — Structure | Logic: A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar. | Structure: Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar. | Intents: Confirm; Edit; Critical decision | Variants: Confirm; Edit; Critical decision | States: Closed; Open; Submitting; Error; Disabled
```

---

## [COMPONENT] Modal/Dialog — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1227

**Context Of Use:** Component section: usage_1

**When To Use:** Use Dialog para decisões curtas que precisam ser concluídas ou canceladas antes de continuar. Forneça título claro, ação principal, cancelamento e fechamento previsível. Prenda o foco, aceite Escape e restaure o foco ao elemento de origem. Mantenha conteúdo e ações curtos o bastante para preservar a decisão focal. Mostre erros dentro do Dialog sem fechar ou apagar o trabalho do usuário.

```
VELARIS COMPONENT: Modal/Dialog — Usage 1 | Do: Use Dialog para decisões curtas que precisam ser concluídas ou canceladas antes de continuar.; Forneça título claro, ação principal, cancelamento e fechamento previsível.; Prenda o foco, aceite Escape e restaure o foco ao elemento de origem.; Mantenha conteúdo e ações curtos o bastante para preservar a decisão focal.; Mostre erros dentro do Dialog sem fechar ou apagar o trabalho do usuário. | Don't: Não use Dialog para conteúdo longo, navegação ou ...
```

---

## [COMPONENT] Modal/Dialog — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 428

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Dialog para conteúdo longo, navegação ou tarefas com várias etapas. Não empilhe modais nem abra um segundo dialog sobre o primeiro. Não feche automaticamente enquanto o usuário estiver corrigindo um erro. Não use Dialog para informação não crítica que pode aparecer no fluxo da página. Não perca a relação com o trigger ao fechar, cancelar ou concluir a ação.

```
VELARIS COMPONENT: Modal/Dialog — Usage 2 | When Not To Use: Não use Dialog para conteúdo longo, navegação ou tarefas com várias etapas. Não empilhe modais nem abra um segundo dialog sobre o primeiro. Não feche automaticamente enquanto o usuário estiver corrigindo um erro. Não use Dialog para informação não crítica que pode aparecer no fluxo da página. Não perca a relação com o trigger ao fechar, cancelar ou concluir a ação.
```

---

## [COMPONENT] Modal/Dialog — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1461

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Modal/Dialog — Accessibility | Accessibility: Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar. Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir. Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação. | Accessibility Items: Tipo de modal: Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar.; Título visíve...
```

---

## [COMPONENT] Modal/Dialog — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1317

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Modal/Dialog — Governance 1 | Edge Cases: Falha comum: usar Modal/Dialog para resolver um problema que pertence a Button, Form Field, Alert, Explanation Bubble / Tooltip, Audit Panel. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Modal/Dialog para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-patt...
```

---

## [COMPONENT] Modal/Dialog — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 834

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Modal/Dialog — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Modal/Dialog afetam Button, Form Field, Alert, Explanation Bubble / Tooltip, Audit Panel. Os contratos frágeis são estrutura (Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar), lógica (A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressõe...
```

---

## [COMPONENT] Modal/Dialog — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1192

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Modal/Dialog — Governance 3 | Content Guidelines (3): Accessibility Rationale: Modal informativo usa dialog padrão; avisos urgentes usam alertdialog para o leitor de tela priorizar. Exiba um título claro no topo do modal — é como o leitor de tela anuncia a janela ao abrir. Enquanto aberto, o foco fica dentro do modal. O conteúdo atrás não recebe interação. Se essa decisão for removida, Modal/Dialog ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio...
```

---

## [COMPONENT] Modal/Dialog — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1174

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Modal/Dialog — Governance 4 | Governance Notes: Risco organizacional: se Modal/Dialog variar por squad, o Velaris perde uma fonte única para overlay. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Modal/Dialog deve manter vocabulário, estado e relação com Button, Form Field, Alert, Explanation Bubble / Tooltip, Audit Panel sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergên...
```

---

## [COMPONENT] Modal/Dialog — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 788

**Context Of Use:** Component section: reference

**Trade Offs:** Interrupções frequentes destroem fluxo e acumulam problemas de foco.

**Aetheris Insight:** Modal é custo cognitivo deliberado, não atalho de layout.

```
VELARIS COMPONENT: Modal/Dialog — Reference | Related Components: button; form-field; alert; explanation-tooltip; audit-panel | Examples: Exemplo positivo: Modal/Dialog aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Modal/Dialog usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Modal/Dialog em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Modal/Dialog como decoração ou substi...
```

---

## [COMPONENT] Table/Data Table — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 816

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Table/Data Table — Overview | Name: Table/Data Table | Status: stable | Section: data_display | Description: Apresenta dados comparáveis em linhas e colunas com relações explícitas. | About: Table/Data Table organiza conjuntos de dados comparáveis em linhas e colunas. Ela favorece inspeção, ordenação e ação sobre registros, mantendo cabeçalhos, estados e relacionamentos legíveis em diferentes densidades. | About Features: Comparação tabular: Alinha atributos equivalentes para ...
```

---

## [COMPONENT] Table/Data Table — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 337

**Structure:** Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais.

**Logic:** Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Table/Data Table — Structure | Logic: Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal. | Structure: Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais. | Intents: Compare; Inspect; Manage | Variants: Compare; Inspect; Manage | States: Default; Sorted; Selected row; Empty; Loading
```

---

## [COMPONENT] Table/Data Table — Usage 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1251

**Context Of Use:** Component section: usage_1

**When To Use:** Use Data Table quando comparar valores por linha e coluna for a tarefa principal. Mantenha cabeçalhos visíveis, alinhamento consistente e ordenação explícita. Priorize colunas no mobile e ofereça uma alternativa para dados menos importantes. Comunique ordenação, seleção e escopo de linhas com texto e semântica programática. Ofereça rolagem controlada ou visualização alternativa sem criar overflow na página.

```
VELARIS COMPONENT: Table/Data Table — Usage 1 | Do: Use Data Table quando comparar valores por linha e coluna for a tarefa principal.; Mantenha cabeçalhos visíveis, alinhamento consistente e ordenação explícita.; Priorize colunas no mobile e ofereça uma alternativa para dados menos importantes.; Comunique ordenação, seleção e escopo de linhas com texto e semântica programática.; Ofereça rolagem controlada ou visualização alternativa sem criar overflow na página. | Don't: Não use Table para narra...
```

---

## [COMPONENT] Table/Data Table — Usage 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 410

**Context Of Use:** Component section: usage_2

**When Not To Use:** Não use Table para narrativas ou poucos pares de rótulo e valor. Não transforme cada célula em uma ação concorrente. Não remova caption, cabeçalhos ou semântica para reproduzir um layout visual. Não trunque identificadores ou valores críticos sem uma forma acessível de leitura completa. Não comunique status de linhas apenas por cor ou posição.

```
VELARIS COMPONENT: Table/Data Table — Usage 2 | When Not To Use: Não use Table para narrativas ou poucos pares de rótulo e valor. Não transforme cada célula em uma ação concorrente. Não remova caption, cabeçalhos ou semântica para reproduzir um layout visual. Não trunque identificadores ou valores críticos sem uma forma acessível de leitura completa. Não comunique status de linhas apenas por cor ou posição.
```

---

## [COMPONENT] Table/Data Table — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1392

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Table/Data Table — Accessibility | Accessibility: Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra. Coluna ordenada deve ser anunciada — ex.: "Nome, ordenado crescente" — não só indicada por seta. Ordenar colunas e selecionar linhas deve funcionar por teclado, não só por clique. | Accessibility Items: Tabela semântica: Use tabela HTML com cabeçalhos de coluna marcados. Inclua título ou descrição do que a tabela mostra.; Orden...
```

---

## [COMPONENT] Table/Data Table — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1365

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Table/Data Table — Governance 1 | Edge Cases: Falha comum: usar Table/Data Table para resolver um problema que pertence a Typography, Checkbox, Selectable Chip / Badge, Source Attribution, Audit Panel. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Table/Data Table para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil...
```

---

## [COMPONENT] Table/Data Table — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1598

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Table/Data Table — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Table/Data Table afetam Typography, Checkbox, Selectable Chip / Badge, Source Attribution, Audit Panel. Os contratos frágeis são estrutura (Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais), lógica (Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transv...
```

---

## [COMPONENT] Table/Data Table — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1072

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Table/Data Table — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Table/Data Table são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Typography, Checkbox, Selectable Chip / Badge, Source Attribution, Audit Panel e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Table/Data Table ...
```

---

## [COMPONENT] Table/Data Table — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 582

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Table/Data Table — Governance 4 | Anti Patterns: Tratar Table/Data Table como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Table/Data Table para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Table/Data Table para mascarar decisão de produto indefinida. Consequência: o co...
```

---

## [COMPONENT] Table/Data Table — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 853

**Context Of Use:** Component section: reference

**Trade Offs:** Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas.

**Aetheris Insight:** Se a relação entre coluna e linha importa, preserve a semântica de tabela.

```
VELARIS COMPONENT: Table/Data Table — Reference | Related Components: typography; checkbox; selectable-chip; source-attribution; audit-panel | Examples: Exemplo positivo: Table/Data Table aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Table/Data Table usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Table/Data Table em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Table/Data...
```

---

## [COMPONENT] Alert — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 756

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Alert — Overview | Name: Alert | Status: stable | Section: feedback | Description: Comunica um estado persistente que precisa permanecer no contexto. | About: O Alert comunica uma condição importante dentro do fluxo de leitura. Ele explica status, risco ou bloqueio com semântica clara e permanece visível enquanto a informação for necessária para a decisão. | About Features: Severidade explícita: Diferencia informação, sucesso, aviso e erro por mais de um sinal.; Mensagem acion...
```

---

## [COMPONENT] Alert — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 304

**Structure:** Ícone semântico, título, mensagem e ação ou dismiss opcional.

**Logic:** A severidade deve refletir consequência real, não preferência visual.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Alert — Structure | Logic: A severidade deve refletir consequência real, não preferência visual. | Structure: Ícone semântico, título, mensagem e ação ou dismiss opcional. | Intents: Inform; Warn; Block | Variants: Inform; Warn; Block | States: Info; Success; Warning; Error; Dismissed
```

---

## [COMPONENT] Alert — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1535

**Context Of Use:** Component section: usage

**When To Use:** Use Alert para feedback importante que deve permanecer visível no contexto. Escolha severidade pela consequência real e inclua texto além da cor. Inclua uma ação apenas quando ela ajudar a resolver ou compreender a mensagem. Posicione a mensagem próxima da condição ou tarefa que ela explica. Permita dispensar apenas mensagens que continuem recuperáveis ou deixem de ser relevantes.

**When Not To Use:** Não use role alert para mensagens informativas sem urgência. Não exiba vários alertas concorrentes sem consolidar prioridades. Não use Alert para confirmações transitórias que cabem em Toast. Não repita a mesma mensagem em alertas globais e locais ao mesmo tempo. Não use títulos vagos que obriguem o usuário a interpretar a consequência.

```
VELARIS COMPONENT: Alert — Usage | Do: Use Alert para feedback importante que deve permanecer visível no contexto.; Escolha severidade pela consequência real e inclua texto além da cor.; Inclua uma ação apenas quando ela ajudar a resolver ou compreender a mensagem.; Posicione a mensagem próxima da condição ou tarefa que ela explica.; Permita dispensar apenas mensagens que continuem recuperáveis ou deixem de ser relevantes. | Don't: Não use role alert para mensagens informativas sem urgência.; Nã...
```

---

## [COMPONENT] Alert — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1325

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Alert — Accessibility | Accessibility: Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade. A mensagem descreve a severidade em palavras. Cor reforça, mas nunca substitui o texto. Botões dentro do alerta (fechar, desfazer) acessíveis por teclado com foco visível. | Accessibility Items: Nível de urgência: Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade.; Texto e cor: A ...
```

---

## [COMPONENT] Alert — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 874

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Alert — Governance 1 | Edge Cases: Falha comum: usar Alert para resolver um problema que pertence a Toast/Notification, Form Field, Button, Source Attribution, Audit Panel. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Alert para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico: dup...
```

---

## [COMPONENT] Alert — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 842

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Alert — Governance 2 | Content Guidelines (1): Design Rationale: Alert existe porque comunica um estado persistente que precisa permanecer no contexto. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Alertas demais causam cegueira e reduzem o valor da hierarquia semântica.; Architectural Impact: alterações em Alert afetam Toast/Notifica...
```

---

## [COMPONENT] Alert — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1475

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Alert — Governance 3 | Content Guidelines (2): UX Consequences: Alert orienta o usuário a interpretar a severidade deve refletir consequência real, não preferência visual. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.; Accessibility Rationale: Alertas urgentes interrompem leitura; informativos aguardam pausa natural — escolha conforme criticidade. A mensagem d...
```

---

## [COMPONENT] Alert — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1129

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Alert — Governance 4 | Governance Notes: Risco organizacional: se Alert variar por squad, o Velaris perde uma fonte única para feedback. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Alert deve manter vocabulário, estado e relação com Toast/Notification, Form Field, Button, Source Attribution, Audit Panel sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de divergência: qualquer ext...
```

---

## [COMPONENT] Alert — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 760

**Context Of Use:** Component section: reference

**Trade Offs:** Alertas demais causam cegueira e reduzem o valor da hierarquia semântica.

**Aetheris Insight:** A interrupção visual deve ser proporcional ao custo de ignorar a mensagem.

```
VELARIS COMPONENT: Alert — Reference | Related Components: toast; form-field; button; source-attribution; audit-panel | Examples: Exemplo positivo: Alert aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Alert usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Alert em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Alert como decoração ou substituto de componente mais adequado. | ...
```

---

## [COMPONENT] Toast/Notification — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 795

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Toast/Notification — Overview | Name: Toast/Notification | Status: stable | Section: feedback | Description: Confirma uma mudança recente sem bloquear o fluxo principal. | About: Toast/Notification confirma eventos breves sem retirar o usuário da tarefa atual. Ele aparece por tempo controlado, prioriza mensagens concisas e oferece ação complementar apenas quando ela puder ser compreendida rapidamente. | About Features: Feedback transitório: Confirma eventos recentes sem ocupar...
```

---

## [COMPONENT] Toast/Notification — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 330

**Structure:** Container flutuante, mensagem, ícone e ação curta opcional.

**Logic:** A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Toast/Notification — Structure | Logic: A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos. | Structure: Container flutuante, mensagem, ícone e ação curta opcional. | Intents: Success; Info; Undo | Variants: Success; Info; Undo | States: Entering; Visible; Actionable; Leaving; Paused
```

---

## [COMPONENT] Toast/Notification — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1526

**Context Of Use:** Component section: usage

**When To Use:** Use Toast para confirmar uma mudança recente sem interromper o fluxo. Mantenha a mensagem curta e use live region compatível com a urgência. Pause o tempo ou mantenha o toast visível quando houver uma ação como Desfazer. Anuncie cada atualização uma única vez e sem interromper a leitura atual. Limite a quantidade visível e consolide notificações repetidas.

**When Not To Use:** Não use Toast para erros que exigem correção imediata. Não coloque conteúdo longo ou várias ações dentro da notificação. Não dependa apenas de auto-dismiss para informação que o usuário precisará consultar. Não desapareça antes que a mensagem ou ação possa ser percebida e operada. Não mova foco para o Toast quando ele apenas confirma uma atualização.

```
VELARIS COMPONENT: Toast/Notification — Usage | Do: Use Toast para confirmar uma mudança recente sem interromper o fluxo.; Mantenha a mensagem curta e use live region compatível com a urgência.; Pause o tempo ou mantenha o toast visível quando houver uma ação como Desfazer.; Anuncie cada atualização uma única vez e sem interromper a leitura atual.; Limite a quantidade visível e consolide notificações repetidas. | Don't: Não use Toast para erros que exigem correção imediata.; Não coloque conteúdo...
```

---

## [COMPONENT] Toast/Notification — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1407

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Toast/Notification — Accessibility | Accessibility: Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda. Não desapareça rápido demais. Respeite tempo de leitura e permita pausar quando houver ação. Erros e avisos críticos permanecem ou ficam acessíveis em histórico recuperável. | Accessibility Items: Anúncio automático: Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interrompe, informativo aguarda...
```

---

## [COMPONENT] Toast/Notification — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 920

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Toast/Notification — Governance 1 | Edge Cases: Falha comum: usar Toast/Notification para resolver um problema que pertence a Alert, Button, Source Attribution, Audit Panel, Icon. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Toast/Notification para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pa...
```

---

## [COMPONENT] Toast/Notification — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 869

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Toast/Notification — Governance 2 | Content Guidelines (1): Design Rationale: Toast/Notification existe porque confirma uma mudança recente sem bloquear o fluxo principal. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações.; Architectural Impact: alterações em T...
```

---

## [COMPONENT] Toast/Notification — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1533

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Toast/Notification — Governance 3 | Content Guidelines (2): UX Consequences: Toast/Notification orienta o usuário a interpretar a mensagem deve ser curta, autossuficiente e dispensável após poucos segundos. Ele reduz hesitação quando a consequência é visível antes da interação e evita erro quando estado, prioridade e recuperação permanecem próximos do ponto de decisão.; Accessibility Rationale: Mensagens importantes são lidas pelo leitor de tela ao aparecer — urgente interromp...
```

---

## [COMPONENT] Toast/Notification — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1201

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Toast/Notification — Governance 4 | Governance Notes: Risco organizacional: se Toast/Notification variar por squad, o Velaris perde uma fonte única para feedback. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Toast/Notification deve manter vocabulário, estado e relação com Alert, Button, Source Attribution, Audit Panel, Icon sincronizados entre design, código, documentação e exemplos do catálogo.; Controle de diver...
```

---

## [COMPONENT] Toast/Notification — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 813

**Context Of Use:** Component section: reference

**Trade Offs:** Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações.

**Aetheris Insight:** Se a pessoa precisa agir, provavelmente não é um toast.

```
VELARIS COMPONENT: Toast/Notification — Reference | Related Components: alert; button; source-attribution; audit-panel; icon | Examples: Exemplo positivo: Toast/Notification aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Toast/Notification usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Toast/Notification em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Toast/Notification c...
```

---

## [COMPONENT] Skeleton Loader — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 758

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Skeleton Loader — Overview | Name: Skeleton Loader | Status: stable | Section: feedback | Description: Reserva a geometria do conteúdo enquanto dados assíncronos carregam. | About: Skeleton Loader representa a estrutura esperada enquanto conteúdo real está sendo carregado. Ele reduz saltos de layout e comunica progresso sem simular dados ou manter animação desnecessária. | About Features: Estrutura antecipada: Reserva o espaço aproximado do conteúdo que será exibido.; Layout e...
```

---

## [COMPONENT] Skeleton Loader — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 333

**Structure:** Blocos neutros com dimensões próximas do conteúdo final e animação moderada.

**Logic:** Imitar a forma final reduz mudança de layout e melhora percepção de velocidade.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Skeleton Loader — Structure | Logic: Imitar a forma final reduz mudança de layout e melhora percepção de velocidade. | Structure: Blocos neutros com dimensões próximas do conteúdo final e animação moderada. | Intents: Card; List; Table | Variants: Card; List; Table | States: Loading; Reduced motion; Loaded; Error
```

---

## [COMPONENT] Skeleton Loader — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1521

**Context Of Use:** Component section: usage

**When To Use:** Use Skeleton quando a geometria final do conteúdo for previsível. Faça os blocos provisórios refletirem a estrutura que será carregada. Marque a região como busy e respeite prefers-reduced-motion. Anuncie o carregamento na região de conteúdo, mantendo os blocos visuais decorativos ocultos. Reserve dimensões próximas do conteúdo final para evitar mudança de layout.

**When Not To Use:** Não use Skeleton para operações instantâneas ou duração totalmente desconhecida. Não simule uma estrutura diferente do conteúdo final. Não mantenha animação depois que o conteúdo estiver disponível. Não anuncie cada linha ou bloco do Skeleton separadamente. Não mantenha o Skeleton indefinidamente quando houver erro ou estado vazio conhecido.

```
VELARIS COMPONENT: Skeleton Loader — Usage | Do: Use Skeleton quando a geometria final do conteúdo for previsível.; Faça os blocos provisórios refletirem a estrutura que será carregada.; Marque a região como busy e respeite prefers-reduced-motion.; Anuncie o carregamento na região de conteúdo, mantendo os blocos visuais decorativos ocultos.; Reserve dimensões próximas do conteúdo final para evitar mudança de layout. | Don't: Não use Skeleton para operações instantâneas ou duração totalmente desc...
```

---

## [COMPONENT] Skeleton Loader — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1345

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Skeleton Loader — Accessibility | Accessibility: O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente. Placeholders visuais ficam ocultos do leitor de tela — são decoração, não conteúdo real. Skeletons não entram na ordem de Tab e não simulam botões ou campos reais. | Accessibility Items: Carregando: O container pai informa que o conteúdo ainda está carregando — não cada bloco cinza individualmente.; Oculto do leitor: Placeholders...
```

---

## [COMPONENT] Skeleton Loader — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1331

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Skeleton Loader — Governance 1 | Edge Cases: Falha comum: usar Skeleton Loader para resolver um problema que pertence a Card, Table/Data Table, Typography, Alert, Toast/Notification. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Skeleton Loader para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pa...
```

---

## [COMPONENT] Skeleton Loader — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1600

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Skeleton Loader — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Skeleton Loader afetam Card, Table/Data Table, Typography, Alert, Toast/Notification. Os contratos frágeis são estrutura (Blocos neutros com dimensões próximas do conteúdo final e animação moderada), lógica (Imitar a forma final reduz mudança de layout e melhora percepção de velocidade) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transve...
```

---

## [COMPONENT] Skeleton Loader — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1558

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Skeleton Loader — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Skeleton Loader são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Card, Table/Data Table, Typography, Alert, Toast/Notification e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Skeleton Loader variar por squad, o ...
```

---

## [COMPONENT] Skeleton Loader — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 813

**Context Of Use:** Component section: reference

**Trade Offs:** Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida.

**Aetheris Insight:** O skeleton deve prometer a mesma forma que o conteúdo entregará.

```
VELARIS COMPONENT: Skeleton Loader — Reference | Related Components: card; data-table; typography; alert; toast | Examples: Exemplo positivo: Skeleton Loader aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Skeleton Loader usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Skeleton Loader em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Skeleton Loader como decoração ou substitu...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 817

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Overview | Name: Explanation Bubble / Tooltip | Status: stable | Section: feedback | Description: Explica um termo ou controle de forma breve e contextual. | About: Explanation Bubble / Tooltip oferece uma explicação curta associada a um termo ou controle. Ele complementa o conteúdo principal sem esconder instruções essenciais e permanece disponível por hover, foco e interação equivalente. | About Features: Ajuda contextual: Explica o elemento no...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 383

**Structure:** Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo.

**Logic:** A explicação complementa o conteúdo visível; informação essencial não pode depender dela.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Structure | Logic: A explicação complementa o conteúdo visível; informação essencial não pode depender dela. | Structure: Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo. | Intents: Definition; Shortcut; Explanation | Variants: Definition; Shortcut; Explanation | States: Closed; Hover; Focus; Open; Dismissed
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1482

**Context Of Use:** Component section: usage

**When To Use:** Use Tooltip para definições curtas, atalhos ou explicações complementares. Abra por hover e foco e conecte o conteúdo com aria-describedby. Mantenha o texto breve e permita fechamento quando ele permanecer aberto. Posicione o Tooltip sem cobrir o trigger ou impedir a próxima interação. Permita fechar com Escape quando o conteúdo permanecer aberto.

**When Not To Use:** Não esconda instruções essenciais apenas dentro do Tooltip. Não coloque formulários, links complexos ou conteúdo longo na bolha. Não dependa exclusivamente de hover, pois ele não existe em toque. Não use Tooltip como substituto do nome acessível de um controle. Não esconda ajuda essencial em um controle disabled que não recebe foco.

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Usage | Do: Use Tooltip para definições curtas, atalhos ou explicações complementares.; Abra por hover e foco e conecte o conteúdo com aria-describedby.; Mantenha o texto breve e permita fechamento quando ele permanecer aberto.; Posicione o Tooltip sem cobrir o trigger ou impedir a próxima interação.; Permita fechar com Escape quando o conteúdo permanecer aberto. | Don't: Não esconda instruções essenciais apenas dentro do Tooltip.; Não coloque fo...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1223

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Accessibility | Accessibility: Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse. Informação necessária para concluir a tarefa não pode existir só dentro do tooltip. Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência. | Accessibility Items: Além do hover: Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse.; Conteúdo essencial: Informação necessária para ...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 973

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Governance 1 | Edge Cases: Falha comum: usar Explanation Bubble / Tooltip para resolver um problema que pertence a Form Field, Icon, Typography, Source Attribution, Alert. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Explanation Bubble / Tooltip para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1268

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Governance 2 | Content Guidelines (1): Design Rationale: Explanation Bubble / Tooltip existe porque explica um termo ou controle de forma breve e contextual. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Hover exclusivo falha em toque, teclado e tecnologias assistivas.; Architectural Impact: alterações e...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1235

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Governance 3 | Content Guidelines (3): Accessibility Rationale: Tooltip aparece também ao focar por teclado — não dependa só de passar o mouse. Informação necessária para concluir a tarefa não pode existir só dentro do tooltip. Tooltip fica ligado ao ícone ou botão que o abre para o leitor de tela ler em sequência. Se essa decisão for removida, Explanation Bubble / Tooltip ainda pode parecer correto visualmente, mas perde operação por teclado, an...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1274

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Governance 4 | Governance Notes: Risco organizacional: se Explanation Bubble / Tooltip variar por squad, o Velaris perde uma fonte única para feedback. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Explanation Bubble / Tooltip deve manter vocabulário, estado e relação com Form Field, Icon, Typography, Source Attribution, Alert sincronizados entre design, código, documentação e exemplo...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 873

**Context Of Use:** Component section: reference

**Trade Offs:** Hover exclusivo falha em toque, teclado e tecnologias assistivas.

**Aetheris Insight:** Tooltip esclarece; não deve esconder a instrução necessária.

```
VELARIS COMPONENT: Explanation Bubble / Tooltip — Reference | Related Components: form-field; icon; typography; source-attribution; alert | Examples: Exemplo positivo: Explanation Bubble / Tooltip aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Explanation Bubble / Tooltip usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Explanation Bubble / Tooltip em fluxo principal com tokens oficiais e acessibilidade verificada.; Ex...
```

---

## [XAI_COMPONENT] Confidence Badge — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 796

**Context Of Use:** Component section: overview

```
VELARIS XAI_COMPONENT: Confidence Badge — Overview | Name: Confidence Badge | Status: stable | Section: feedback | Description: Expressa confiança calibrada com valor, faixa e linguagem de incerteza. | About: Confidence Badge comunica o nível de sustentação de uma recomendação ou resultado. Ele ajuda a calibrar confiança sem transformar um valor em certeza e deve sempre permanecer ligado à origem e ao significado da medida. | About Features: Calibração: Diferencia evidência forte, parcial, fraca...
```

---

## [XAI_COMPONENT] Confidence Badge — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 364

**Structure:** Percentual ou faixa, rótulo semântico e acesso à explicação da calibração.

**Logic:** Confiança deriva da qualidade da evidência, não do tom assertivo da resposta.

**Context Of Use:** Component section: structure

```
VELARIS XAI_COMPONENT: Confidence Badge — Structure | Logic: Confiança deriva da qualidade da evidência, não do tom assertivo da resposta. | Structure: Percentual ou faixa, rótulo semântico e acesso à explicação da calibração. | Intents: Calibrate; Warn; Support trust | Variants: Calibrate; Warn; Support trust | States: Low; Medium; High; Unavailable; Inspecting
```

---

## [XAI_COMPONENT] Confidence Badge — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1548

**Context Of Use:** Component section: usage

**When To Use:** Use Confidence Badge apenas quando houver um método definido de calibração. Apresente faixa ou linguagem de incerteza junto ao valor. Ofereça acesso à explicação sobre origem, escala e limitações da confiança. Mostre quando o valor foi atualizado e qual evidência sustenta a calibração. Mantenha faixas e linguagem consistentes em todas as superfícies do produto.

**When Not To Use:** Não apresente percentual como probabilidade objetiva de verdade. Não use confiança para substituir inspeção de fonte ou julgamento humano. Não dependa apenas de verde, amarelo e vermelho para comunicar a faixa. Não compare valores calculados por escalas ou métodos incompatíveis. Não use casas decimais que sugiram precisão maior que a evidência disponível.

```
VELARIS XAI_COMPONENT: Confidence Badge — Usage | Do: Use Confidence Badge apenas quando houver um método definido de calibração.; Apresente faixa ou linguagem de incerteza junto ao valor.; Ofereça acesso à explicação sobre origem, escala e limitações da confiança.; Mostre quando o valor foi atualizado e qual evidência sustenta a calibração.; Mantenha faixas e linguagem consistentes em todas as superfícies do produto. | Don't: Não apresente percentual como probabilidade objetiva de verdade.; Não...
```

---

## [XAI_COMPONENT] Confidence Badge — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1318

**Context Of Use:** Component section: accessibility

```
VELARIS XAI_COMPONENT: Confidence Badge — Accessibility | Accessibility: Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual. Todos os níveis de confiança mantêm contraste legível no tema ativo. Badge não deve ser o único indicador para aprovar ou rejeitar algo importante. | Accessibility Items: Nível em texto: Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual.; Contraste: Todos os níveis de confiança mantêm contrast...
```

---

## [XAI_COMPONENT] Confidence Badge — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1367

**Context Of Use:** Component section: governance_1

```
VELARIS XAI_COMPONENT: Confidence Badge — Governance 1 | Edge Cases: Falha comum: usar Confidence Badge para resolver um problema que pertence a Source Attribution, Audit Panel, Explanation Bubble / Tooltip, Alert, Table/Data Table. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Confidence Badge para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e ...
```

---

## [XAI_COMPONENT] Confidence Badge — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 843

**Context Of Use:** Component section: governance_2

```
VELARIS XAI_COMPONENT: Confidence Badge — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Confidence Badge afetam Source Attribution, Audit Panel, Explanation Bubble / Tooltip, Alert, Table/Data Table. Os contratos frágeis são estrutura (Percentual ou faixa, rótulo semântico e acesso à explicação da calibração), lógica (Confiança deriva da qualidade da evidência, não do tom assertivo da resposta) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem...
```

---

## [XAI_COMPONENT] Confidence Badge — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1209

**Context Of Use:** Component section: governance_3

```
VELARIS XAI_COMPONENT: Confidence Badge — Governance 3 | Content Guidelines (3): Accessibility Rationale: Confiança aparece em palavras (ex.: "Alta", "Média") — não só em cor ou intensidade visual. Todos os níveis de confiança mantêm contraste legível no tema ativo. Badge não deve ser o único indicador para aprovar ou rejeitar algo importante. Se essa decisão for removida, Confidence Badge ainda pode parecer correto visualmente, mas perde operação por teclado, anúncio ou entendimento programátic...
```

---

## [XAI_COMPONENT] Confidence Badge — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1225

**Context Of Use:** Component section: governance_4

```
VELARIS XAI_COMPONENT: Confidence Badge — Governance 4 | Governance Notes: Risco organizacional: se Confidence Badge variar por squad, o Velaris perde uma fonte única para feedback. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Confidence Badge deve manter vocabulário, estado e relação com Source Attribution, Audit Panel, Explanation Bubble / Tooltip, Alert, Table/Data Table sincronizados entre design, código, documentação e exemplos...
```

---

## [XAI_COMPONENT] Confidence Badge — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 863

**Context Of Use:** Component section: reference

**Trade Offs:** Percentual isolado pode ser interpretado como probabilidade objetiva de verdade.

**Aetheris Insight:** Confiança útil explica tanto força quanto limite da evidência.

```
VELARIS XAI_COMPONENT: Confidence Badge — Reference | Related Components: source-attribution; audit-panel; explanation-tooltip; alert; data-table | Examples: Exemplo positivo: Confidence Badge aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Confidence Badge usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Confidence Badge em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Confi...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 817

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Overview | Name: Command Palette / Barra de Comandos | Status: stable | Section: navigation | Description: Centraliza busca e execução rápida de destinos, componentes e ações. | About: Command Palette / Barra de Comandos centraliza navegação, busca e execução para usuários que precisam agir rapidamente. Ela combina consulta textual, resultados priorizados e atalhos sem substituir os caminhos visíveis da interface. | About Features: Acesso ...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 362

**Structure:** Dialog, input de busca, grupos, resultados, atalhos e estado vazio.

**Logic:** A consulta reduz o espaço de opções e combina descoberta com produtividade.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Structure | Logic: A consulta reduz o espaço de opções e combina descoberta com produtividade. | Structure: Dialog, input de busca, grupos, resultados, atalhos e estado vazio. | Intents: Navigate; Search; Execute | Variants: Navigate; Search; Execute | States: Closed; Searching; Results; Empty; Executing
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1577

**Context Of Use:** Component section: usage

**When To Use:** Use Command Palette em produtos densos com muitos destinos ou ações recorrentes. Suporte busca por nomes, sinônimos, grupos e atalhos de teclado. Mantenha seleção ativa, resultado vazio e execução acessíveis por teclado. Agrupe resultados por destino, ação ou entidade para reduzir ambiguidade. Preserve consulta, seleção e mensagem de erro quando uma execução falhar.

**When Not To Use:** Não use Command Palette como substituto da navegação principal. Não esconda nela ações essenciais que não aparecem em nenhum outro lugar. Não mostre resultados sem contexto suficiente para distinguir comandos parecidos. Não execute ações destrutivas diretamente sem confirmação proporcional ao risco. Não atribua atalhos conflitantes ou difíceis de descobrir.

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Usage | Do: Use Command Palette em produtos densos com muitos destinos ou ações recorrentes.; Suporte busca por nomes, sinônimos, grupos e atalhos de teclado.; Mantenha seleção ativa, resultado vazio e execução acessíveis por teclado.; Agrupe resultados por destino, ação ou entidade para reduzir ambiguidade.; Preserve consulta, seleção e mensagem de erro quando uma execução falhar. | Don't: Não use Command Palette como substituto da navega...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1391

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Accessibility | Accessibility: Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis. Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior. Anuncie quantos resultados aparecem e quando a busca não retorna nada. | Accessibility Items: Campo de busca: Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis.; Teclado completo: Setas naveg...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1431

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Governance 1 | Edge Cases: Falha comum: usar Command Palette / Barra de Comandos para resolver um problema que pertence a Input / Text Input, Link, Button, Tabs, Icon. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Command Palette / Barra de Comandos para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio i...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 843

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Command Palette / Barra de Comandos afetam Input / Text Input, Link, Button, Tabs, Icon. Os contratos frágeis são estrutura (Dialog, input de busca, grupos, resultados, atalhos e estado vazio), lógica (A consulta reduz o espaço de opções e combina descoberta com produtividade) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressõ...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1235

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Governance 3 | Content Guidelines (3): Accessibility Rationale: Campo de busca com lista de resultados: abertura, navegação e seleção devem ser anunciáveis. Setas navegam resultados; Enter executa; Escape fecha e restaura o contexto anterior. Anuncie quantos resultados aparecem e quando a busca não retorna nada. Se essa decisão for removida, Command Palette / Barra de Comandos ainda pode parecer correto visualmente, mas perde operação por ...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1314

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Governance 4 | Governance Notes: Risco organizacional: se Command Palette / Barra de Comandos variar por squad, o Velaris perde uma fonte única para navigation. A revisão deve confirmar se a necessidade é exceção documentada ou novo componente candidato.; Consistência: Command Palette / Barra de Comandos deve manter vocabulário, estado e relação com Input / Text Input, Link, Button, Tabs, Icon sincronizados entre design, código, documentaç...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 885

**Context Of Use:** Component section: reference

**Trade Offs:** Descoberta depende de nomes, sinônimos e ranking coerentes.

**Aetheris Insight:** A paleta acelera quem sabe o que busca e ensina quem ainda explora.

```
VELARIS COMPONENT: Command Palette / Barra de Comandos — Reference | Related Components: text-input; link; button; tabs; icon | Examples: Exemplo positivo: Command Palette / Barra de Comandos aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Command Palette / Barra de Comandos usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Command Palette / Barra de Comandos em fluxo principal com tokens oficiais e acessibilidade verifi...
```

---

## [XAI_COMPONENT] Source Attribution — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 826

**Context Of Use:** Component section: overview

```
VELARIS XAI_COMPONENT: Source Attribution — Overview | Name: Source Attribution | Status: stable | Section: content | Description: Liga uma afirmação do Abraxos à evidência recuperada que a sustenta. | About: Source Attribution apresenta a origem documental usada em uma afirmação, recomendação ou análise. Ela permite verificar proveniência, correspondência e contexto sem confundir fonte recuperada com certeza da resposta. | About Features: Proveniência: Identifica documento, seção e referência q...
```

---

## [XAI_COMPONENT] Source Attribution — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 358

**Structure:** Fonte, trecho, relevância, metadados e ação para inspecionar contexto.

**Logic:** Rastreabilidade transforma resposta fluente em conhecimento verificável.

**Context Of Use:** Component section: structure

```
VELARIS XAI_COMPONENT: Source Attribution — Structure | Logic: Rastreabilidade transforma resposta fluente em conhecimento verificável. | Structure: Fonte, trecho, relevância, metadados e ação para inspecionar contexto. | Intents: Trace; Verify; Inspect | Variants: Trace; Verify; Inspect | States: Collapsed; Expanded; High match; Partial match; Unavailable
```

---

## [XAI_COMPONENT] Source Attribution — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1462

**Context Of Use:** Component section: usage

**When To Use:** Use Source Attribution para conectar uma afirmação à origem que a sustenta. Mostre título, trecho, relevância e ação para inspecionar o contexto completo. Use disclosure progressivo para equilibrar rastreabilidade e densidade. Exponha autoria, data, seção e versão quando esses dados afetarem a verificação. Ordene fontes por relevância e preserve acesso às alternativas.

**When Not To Use:** Não cite uma fonte que não sustenta diretamente a afirmação. Não use atribuição como decoração ou selo genérico de confiança. Não esconda origem e trecho atrás de rótulos vagos ou links sem contexto. Não use URL crua como único nome de uma fonte. Não restrinja inspeção de fonte a hover ou tooltip nativo.

```
VELARIS XAI_COMPONENT: Source Attribution — Usage | Do: Use Source Attribution para conectar uma afirmação à origem que a sustenta.; Mostre título, trecho, relevância e ação para inspecionar o contexto completo.; Use disclosure progressivo para equilibrar rastreabilidade e densidade.; Exponha autoria, data, seção e versão quando esses dados afetarem a verificação.; Ordene fontes por relevância e preserve acesso às alternativas. | Don't: Não cite uma fonte que não sustenta diretamente a afirmação...
```

---

## [XAI_COMPONENT] Source Attribution — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1085

**Context Of Use:** Component section: accessibility

```
VELARIS XAI_COMPONENT: Source Attribution — Accessibility | Accessibility: Botão de expandir comunica se a lista de fontes está aberta ou fechada. Enter e Espaço expandem e colapsam. Foco visível no botão de expandir. Após expandir, metadados e links seguem ordem lógica de leitura. | Accessibility Items: Expandir fontes: Botão de expandir comunica se a lista de fontes está aberta ou fechada.; Teclado: Enter e Espaço expandem e colapsam. Foco visível no botão de expandir.; Ordem de leitura: Após ...
```

---

## [XAI_COMPONENT] Source Attribution — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1343

**Context Of Use:** Component section: governance_1

```
VELARIS XAI_COMPONENT: Source Attribution — Governance 1 | Edge Cases: Falha comum: usar Source Attribution para resolver um problema que pertence a Confidence Badge, Audit Panel, Card, Link, Typography. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Source Attribution para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; An...
```

---

## [XAI_COMPONENT] Source Attribution — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1516

**Context Of Use:** Component section: governance_2

```
VELARIS XAI_COMPONENT: Source Attribution — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Source Attribution afetam Confidence Badge, Audit Panel, Card, Link, Typography. Os contratos frágeis são estrutura (Fonte, trecho, relevância, metadados e ação para inspecionar contexto), lógica (Rastreabilidade transforma resposta fluente em conhecimento verificável) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar regressões transversais.; UX ...
```

---

## [XAI_COMPONENT] Source Attribution — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1569

**Context Of Use:** Component section: governance_3

```
VELARIS XAI_COMPONENT: Source Attribution — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Source Attribution são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Confidence Badge, Audit Panel, Card, Link, Typography e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Source Attribution variar por squa...
```

---

## [XAI_COMPONENT] Source Attribution — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 809

**Context Of Use:** Component section: reference

**Trade Offs:** Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo.

**Aetheris Insight:** Fonte não é rodapé; é parte da resposta.

```
VELARIS XAI_COMPONENT: Source Attribution — Reference | Related Components: confidence-badge; audit-panel; card; link; typography | Examples: Exemplo positivo: Source Attribution aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Source Attribution usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Source Attribution em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Source Attribut...
```

---

## [XAI_COMPONENT] Audit Panel — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 781

**Context Of Use:** Component section: overview

```
VELARIS XAI_COMPONENT: Audit Panel — Overview | Name: Audit Panel | Status: stable | Section: data_display | Description: Expõe etapas, fontes, políticas e calibração que produziram uma decisão. | About: Audit Panel reúne eventos, evidências e decisões que explicam como um resultado foi produzido. Ele favorece inspeção e governança com estados claros, ordem temporal e distinção entre execução, evidência e interpretação. | About Features: Rastro operacional: Organiza etapas, responsáveis e result...
```

---

## [XAI_COMPONENT] Audit Panel — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 357

**Structure:** Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis.

**Logic:** Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal.

**Context Of Use:** Component section: structure

```
VELARIS XAI_COMPONENT: Audit Panel — Structure | Logic: Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal. | Structure: Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis. | Intents: Audit; Govern; Debug | Variants: Audit; Govern; Debug | States: Collapsed; Expanded; Running; Complete; Conflict
```

---

## [XAI_COMPONENT] Audit Panel — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1535

**Context Of Use:** Component section: usage

**When To Use:** Use Audit Panel para revisão, governança e investigação de decisões. Organize eventos em sequência com entradas, saídas, status e responsáveis. Permita expandir detalhes sem competir com a resposta principal. Registre status, tempo e resultado de cada etapa com vocabulário consistente. Proteja dados sensíveis e revele apenas o necessário para auditoria do produto.

**When Not To Use:** Não mantenha o painel aberto por padrão em toda interação simples. Não exponha logs técnicos sem tradução para o público da interface. Não omita conflitos, falhas ou etapas incompletas da trilha. Não exponha chain of thought ou raciocínio privado como se fosse trilha de auditoria. Não confunda logs operacionais com evidência que sustenta a decisão.

```
VELARIS XAI_COMPONENT: Audit Panel — Usage | Do: Use Audit Panel para revisão, governança e investigação de decisões.; Organize eventos em sequência com entradas, saídas, status e responsáveis.; Permita expandir detalhes sem competir com a resposta principal.; Registre status, tempo e resultado de cada etapa com vocabulário consistente.; Proteja dados sensíveis e revele apenas o necessário para auditoria do produto. | Don't: Não mantenha o painel aberto por padrão em toda interação simples.; Não...
```

---

## [XAI_COMPONENT] Audit Panel — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1235

**Context Of Use:** Component section: accessibility

```
VELARIS XAI_COMPONENT: Audit Panel — Accessibility | Accessibility: O painel de auditoria tem nome claro — ex.: "Trilha de auditoria" — para o leitor de tela anunciar a seção. Subseções usam títulos reais (h2, h3) para navegação por leitor de tela. Eventos em ordem cronológica com marcos textuais — data, ação e resultado legíveis. | Accessibility Items: Identificação do painel: O painel de auditoria tem nome claro — ex.: "Trilha de auditoria" — para o leitor de tela anunciar a seção.; Títulos in...
```

---

## [XAI_COMPONENT] Audit Panel — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1327

**Context Of Use:** Component section: governance_1

```
VELARIS XAI_COMPONENT: Audit Panel — Governance 1 | Edge Cases: Falha comum: usar Audit Panel para resolver um problema que pertence a Source Attribution, Confidence Badge, Table/Data Table, Modal/Dialog, Alert. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Audit Panel para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; A...
```

---

## [XAI_COMPONENT] Audit Panel — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1600

**Context Of Use:** Component section: governance_2

```
VELARIS XAI_COMPONENT: Audit Panel — Governance 2 | Content Guidelines (2): Architectural Impact: alterações em Audit Panel afetam Source Attribution, Confidence Badge, Table/Data Table, Modal/Dialog, Alert. Os contratos frágeis são estrutura (Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis), lógica (Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal) e estados acessíveis. Mudanças visuais sem revisar esses contratos tendem a criar ...
```

---

## [XAI_COMPONENT] Audit Panel — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1562

**Context Of Use:** Component section: governance_3

```
VELARIS XAI_COMPONENT: Audit Panel — Governance 3 | Content Guidelines (4): Maintenance Perspective: as partes mais frágeis de Audit Panel são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o componente é ajustado para um fluxo local sem atualizar exemplos, testes, relação com Source Attribution, Confidence Badge, Table/Data Table, Modal/Dialog, Alert e critérios de acessibilidade. | Governance Notes: Risco organizacional: se Audit Panel variar por squ...
```

---

## [XAI_COMPONENT] Audit Panel — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 826

**Context Of Use:** Component section: reference

**Trade Offs:** Detalhe técnico excessivo pode confundir usuários sem contexto operacional.

**Aetheris Insight:** Auditabilidade deve estar disponível, não necessariamente ocupar o primeiro plano.

```
VELARIS XAI_COMPONENT: Audit Panel — Reference | Related Components: source-attribution; confidence-badge; data-table; modal-dialog; alert | Examples: Exemplo positivo: Audit Panel aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Audit Panel usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Audit Panel em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Audit Panel como decoração ...
```

---

## [COMPONENT] Typography — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 770

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Typography — Overview | Name: Typography | Status: stable | Section: content | Description: Define hierarquia, ritmo e legibilidade para conteúdo operacional e explicações. | About: Typography organiza a voz visual do sistema por meio de escalas, pesos e ritmos consistentes. Ela diferencia leitura, hierarquia, metadados e código sem depender de estilos decorativos ou tamanhos excessivos. | About Features: Hierarquia legível: Diferencia títulos, corpo, rótulos e legendas com re...
```

---

## [COMPONENT] Typography — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 326

**Structure:** Tokens de display, heading, body, label e code com regras de uso.

**Logic:** Escala e peso devem refletir a prioridade epistemológica do conteúdo.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Typography — Structure | Logic: Escala e peso devem refletir a prioridade epistemológica do conteúdo. | Structure: Tokens de display, heading, body, label e code com regras de uso. | Intents: Hierarchy; Reading; Metadata | Variants: Hierarchy; Reading; Metadata | States: Display; Heading; Body; Label; Code
```

---

## [COMPONENT] Typography — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1552

**Context Of Use:** Component section: usage

**When To Use:** Use tokens tipográficos para comunicar hierarquia, leitura e metadados de forma consistente. Preserve ordem semântica de headings independentemente do tamanho visual. Mantenha tamanho, line-height e comprimento de linha adequados ao conteúdo. Use famílias e recursos tipográficos que preservem caracteres, idioma e leitura correta. Garanta zoom, reflow e quebra de linha sem perda de conteúdo.

**When Not To Use:** Não crie hierarquia apenas com tamanho ou peso sem semântica. Não introduza valores arbitrários fora da escala tipográfica. Não use caixa alta extensa em textos de leitura contínua. Não reduza metadados essenciais a tamanhos ou contrastes difíceis de ler. Não force truncamento quando o conteúdo completo for necessário para a tarefa.

```
VELARIS COMPONENT: Typography — Usage | Do: Use tokens tipográficos para comunicar hierarquia, leitura e metadados de forma consistente.; Preserve ordem semântica de headings independentemente do tamanho visual.; Mantenha tamanho, line-height e comprimento de linha adequados ao conteúdo.; Use famílias e recursos tipográficos que preservem caracteres, idioma e leitura correta.; Garanta zoom, reflow e quebra de linha sem perda de conteúdo. | Don't: Não crie hierarquia apenas com tamanho ou peso se...
```

---

## [COMPONENT] Typography — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1130

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Typography — Accessibility | Accessibility: Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário. Texto corpo e legendas atendem contraste AA (WCAG) no tema ativo. Legível com zoom de 200% sem truncar conteúdo essencial. | Accessibility Items: Hierarquia de títulos: Use níveis de título em ordem (h1, h2, h3…) sem pular — o estilo visual segue a hierarquia, não o contrário.; Contraste: Texto corpo e legendas atendem contras...
```

---

## [COMPONENT] Typography — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 874

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Typography — Governance 1 | Edge Cases: Falha comum: usar Typography para resolver um problema que pertence a Card, Link, Icon, Table/Data Table, Form Field. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Typography para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico: duplicar Typo...
```

---

## [COMPONENT] Typography — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1581

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Typography — Governance 2 | Content Guidelines (1): Design Rationale: Typography existe porque define hierarquia, ritmo e legibilidade para conteúdo operacional e explicações. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas variações enfraquecem consistência e tornam a leitura imprevisível.; Architectural Impact: alterações em Ty...
```

---

## [COMPONENT] Typography — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1261

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Typography — Governance 3 | Content Guidelines (3): Governance Perspective: Typography resolve o risco organizacional de documentação, evidência e copy de interface derivarem para vocabulários separados. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.; Maintenance Perspective: as partes mais frágeis de Typography são tokens, estados, semântica, foco e mensagens associadas. Regressões costuma...
```

---

## [COMPONENT] Typography — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 558

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Typography — Governance 4 | Anti Patterns: Tratar Typography como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Typography para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Typography para mascarar decisão de produto indefinida. Consequência: o componente vira workaround...
```

---

## [COMPONENT] Typography — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 750

**Context Of Use:** Component section: reference

**Trade Offs:** Muitas variações enfraquecem consistência e tornam a leitura imprevisível.

**Aetheris Insight:** Tipografia torna a ordem do raciocínio visível.

```
VELARIS COMPONENT: Typography — Reference | Related Components: card; link; icon; data-table; form-field | Examples: Exemplo positivo: Typography aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Typography usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Typography em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Typography como decoração ou substituto de componente mais adequ...
```

---

## [COMPONENT] Icon — Overview
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 751

**Context Of Use:** Component section: overview

```
VELARIS COMPONENT: Icon — Overview | Name: Icon | Status: stable | Section: content | Description: Reforça significado, estado ou ação com uma forma visual consistente. | About: Icon comunica uma ação, estado ou categoria por meio de uma forma visual reconhecível. Ele deve reforçar o significado do texto, receber nome quando carrega informação e permanecer oculto quando for apenas decorativo. | About Features: Significado concentrado: Representa conceitos conhecidos com forma simples e consisten...
```

---

## [COMPONENT] Icon — Structure
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 337

**Structure:** Glyph vetorial, tamanho por token, stroke consistente e label quando necessário.

**Logic:** Ícones apoiam reconhecimento, mas rótulos sustentam compreensão.

**Context Of Use:** Component section: structure

```
VELARIS COMPONENT: Icon — Structure | Logic: Ícones apoiam reconhecimento, mas rótulos sustentam compreensão. | Structure: Glyph vetorial, tamanho por token, stroke consistente e label quando necessário. | Intents: Action; Status; Category | Variants: Action; Status; Category | States: Decorative; Labeled; Interactive; Active; Disabled
```

---

## [COMPONENT] Icon — Usage
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1428

**Context Of Use:** Component section: usage

**When To Use:** Use Icon para reforçar uma ação, status ou categoria já compreensível. Oculte ícones decorativos e forneça nome acessível aos interativos. Mantenha tamanho, stroke e alinhamento consistentes com os tokens. Ajuste alinhamento óptico e área de respiro sem alterar o grid do componente. Use a mesma metáfora para a mesma ação ou estado em todo o produto.

**When Not To Use:** Não use um ícone ambíguo como única explicação de uma ação. Não misture estilos preenchidos e lineares sem significado semântico. Não reduza o alvo clicável ao tamanho visual do glyph. Não dependa da cor do ícone como única forma de comunicar estado. Não anime ícones decorativos sem uma função de estado ou feedback.

```
VELARIS COMPONENT: Icon — Usage | Do: Use Icon para reforçar uma ação, status ou categoria já compreensível.; Oculte ícones decorativos e forneça nome acessível aos interativos.; Mantenha tamanho, stroke e alinhamento consistentes com os tokens.; Ajuste alinhamento óptico e área de respiro sem alterar o grid do componente.; Use a mesma metáfora para a mesma ação ou estado em todo o produto. | Don't: Não use um ícone ambíguo como única explicação de uma ação.; Não misture estilos preenchidos e li...
```

---

## [COMPONENT] Icon — Accessibility
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1061

**Context Of Use:** Component section: accessibility

```
VELARIS COMPONENT: Icon — Accessibility | Accessibility: Ícone que só complementa texto visível fica oculto do leitor de tela. Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo. Ícone interativo alcançável por Tab com foco visível. | Accessibility Items: Ícone decorativo: Ícone que só complementa texto visível fica oculto do leitor de tela.; Ícone funcional: Ícone clicável sem texto precisa de nome — aria-label ou botão wrapper com rótulo.; Teclado: Ícone interati...
```

---

## [COMPONENT] Icon — Governance 1
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 872

**Context Of Use:** Component section: governance_1

```
VELARIS COMPONENT: Icon — Governance 1 | Edge Cases: Falha comum: usar Icon para resolver um problema que pertence a Button, Link, Explanation Bubble / Tooltip, Toast/Notification, Typography. Consequência: a UI funciona no caso feliz, mas o modelo mental fica errado em comparação, erro ou auditoria.; Mau uso observado: customizar Icon para esconder uma lacuna de produto. Consequência: o componente passa a carregar regra de negócio implícita e fica difícil de testar.; Anti-pattern sistêmico: dup...
```

---

## [COMPONENT] Icon — Governance 2
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1545

**Context Of Use:** Component section: governance_2

```
VELARIS COMPONENT: Icon — Governance 2 | Content Guidelines (1): Design Rationale: Icon existe porque reforça significado, estado ou ação com uma forma visual consistente. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes.; Architectural Impact: alterações em Icon afetam Button, Link, Ex...
```

---

## [COMPONENT] Icon — Governance 3
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 1281

**Context Of Use:** Component section: governance_3

```
VELARIS COMPONENT: Icon — Governance 3 | Content Guidelines (3): Governance Perspective: Icon resolve o risco organizacional de documentação, evidência e copy de interface derivarem para vocabulários separados. Ao centralizar nomenclatura, estados, relações e exceções, ele reduz divergência entre produto, design, engenharia, QA e documentação.; Maintenance Perspective: as partes mais frágeis de Icon são tokens, estados, semântica, foco e mensagens associadas. Regressões costumam surgir quando o ...
```

---

## [COMPONENT] Icon — Governance 4
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 534

**Context Of Use:** Component section: governance_4

```
VELARIS COMPONENT: Icon — Governance 4 | Anti Patterns: Tratar Icon como decoração. Consequência: a superfície parece consistente, mas o usuário não recebe sinal confiável de ação, estado, navegação ou evidência.; Remover semântica ou foco de Icon para encaixar uma composição visual. Consequência: acessibilidade e automação de testes deixam de representar a experiência real.; Usar Icon para mascarar decisão de produto indefinida. Consequência: o componente vira workaround e transfere ambiguidade...
```

---

## [COMPONENT] Icon — Reference
**Source:** `data/component-metadata.json`  **Status:** stable  **Chars:** 747

**Context Of Use:** Component section: reference

**Trade Offs:** Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes.

**Aetheris Insight:** Consistência do símbolo vale mais que originalidade isolada.

```
VELARIS COMPONENT: Icon — Reference | Related Components: button; link; explanation-tooltip; toast; typography | Examples: Exemplo positivo: Icon aplicado conforme guideline, com rótulo claro e feedback adequado.; Exemplo negativo: Icon usado sem hierarquia, sem estado ou sem contexto de consequência.; Exemplo recomendado: Icon em fluxo principal com tokens oficiais e acessibilidade verificada.; Exemplo não recomendado: Icon como decoração ou substituto de componente mais adequado. | Trade Offs:...
```

---

## [PATTERN] Dashboard
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 540

**Structure:** Centralized telemetry hub with high-density data visualization and contextual action bars.

**Logic:** Aggregation of disparate data sources into a unified cognitive plane.

**Context Of Use:** Monitoring systems, complex SaaS management, and resource oversight.

**When Not To Use:** Simple task-focused tools or mobile-first consumer apps where focus is singular.

**Aetheris Insight:** Dashboards should breathe. In complex environments, prioritize temporal data: what is happening now over what has happened.

```
VELARIS PATTERN: Dashboard | Structure: Centralized telemetry hub with high-density data visualization and contextual action bars. | Logic: Aggregation of disparate data sources into a unified cognitive plane. | Context Of Use: Monitoring systems, complex SaaS management, and resource oversight. | When Not To Use: Simple task-focused tools or mobile-first consumer apps where focus is singular. | Aetheris Insight: Dashboards should breathe. In complex environments, prioritize temporal data: what ...
```

---

## [PATTERN] Multi-step Form
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 675

**Structure:** Input fields fragmented into thematic logical blocks, each scoped to a single decision or data group, with persistent progress indication.

**Logic:** Reduces overwhelm by sequencing decisions and maintaining momentum through completion.

**Context Of Use:** Account registration, checkout flows, complex configuration wizards and onboarding sequences with branching logic.

**When Not To Use:** Simple forms under five fields, related inputs that benefit from simultaneous visibility or quick mobile actions.

**Aetheris Insight:** Focus on momentum. Use predictive pre-fills and inline validation to eliminate cognitive drag between steps.

```
VELARIS PATTERN: Multi-step Form | Structure: Input fields fragmented into thematic logical blocks, each scoped to a single decision or data group, with persistent progress indication. | Logic: Reduces overwhelm by sequencing decisions and maintaining momentum through completion. | Context Of Use: Account registration, checkout flows, complex configuration wizards and onboarding sequences with branching logic. | When Not To Use: Simple forms under five fields, related inputs that benefit from si...
```

---

## [PATTERN] Onboarding
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 681

**Structure:** Progressive disclosure sequence that introduces key features through contextual education without interrupting the primary workflow.

**Context Of Use:** First-run experiences, post-signup activation, feature discovery after major updates and role-based capability reveals.

**When Not To Use:** Interfaces that are already self-evident, transactional flows or returning users who already completed setup.

**Trade Offs:** Increases activation and adoption, but becomes easy to skip if it feels generic or detached from user intent.

**Aetheris Insight:** Personalize the path. Show users what they care about first instead of replaying a generic tour.

```
VELARIS PATTERN: Onboarding | Structure: Progressive disclosure sequence that introduces key features through contextual education without interrupting the primary workflow. | Context Of Use: First-run experiences, post-signup activation, feature discovery after major updates and role-based capability reveals. | When Not To Use: Interfaces that are already self-evident, transactional flows or returning users who already completed setup. | Trade Offs: Increases activation and adoption, but become...
```

---

## [PATTERN] Data Explorer
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 678

**Structure:** Dynamic filtering interface with faceted search, drill-down capabilities and cross-dimensional analysis controls over large datasets.

**Logic:** Hypothesis-driven exploration where users define queries and the system surfaces relevant subsets.

**Context Of Use:** Analytics platforms, research tools, inventory systems and BI dashboards with multi-dimensional data.

**Trade Offs:** Extremely powerful for experts, but needs clear affordances, sane defaults and saved views to avoid novice overload.

**Aetheris Insight:** Use semantic search as the primary entry point. A single natural-language query often replaces a chain of manual filters.

```
VELARIS PATTERN: Data Explorer | Structure: Dynamic filtering interface with faceted search, drill-down capabilities and cross-dimensional analysis controls over large datasets. | Logic: Hypothesis-driven exploration where users define queries and the system surfaces relevant subsets. | Context Of Use: Analytics platforms, research tools, inventory systems and BI dashboards with multi-dimensional data. | Trade Offs: Extremely powerful for experts, but needs clear affordances, sane defaults and s...
```

---

## [PATTERN] Empty States
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 754

**Structure:** Intentional placeholder view combining explanation, hierarchy and one primary action scoped to the empty container.

**Logic:** Transforms absence into guidance, turning the first interaction with a feature into a conversion moment.

**Context Of Use:** New accounts, cleared tables, zero-result searches, unconnected integrations and fresh projects.

**When Not To Use:** Transient loading or background processing, where skeleton screens preserve spatial continuity better.

**Trade Offs:** Excellent for orientation and activation, but weakens trust if it feels decorative instead of actionable.

**Aetheris Insight:** Treat void as opportunity. A clear next step reframes incompleteness as a starting point, not a failure.

```
VELARIS PATTERN: Empty States | Structure: Intentional placeholder view combining explanation, hierarchy and one primary action scoped to the empty container. | Logic: Transforms absence into guidance, turning the first interaction with a feature into a conversion moment. | Context Of Use: New accounts, cleared tables, zero-result searches, unconnected integrations and fresh projects. | When Not To Use: Transient loading or background processing, where skeleton screens preserve spatial continuit...
```

---

## [PATTERN] Settings & Config
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 451

**Logic:** Hierarchical nesting of system variables and user preferences.

**Context Of Use:** Global application control, preferences, permissions and environment-level tuning.

**Trade Offs:** Powerful and expected, but quickly becomes hostile when high-impact toggles are buried too deep.

**Aetheris Insight:** Configuration is the user's manifesto. Never hide high-impact toggles behind more than two layers of navigation.

```
VELARIS PATTERN: Settings & Config | Logic: Hierarchical nesting of system variables and user preferences. | Context Of Use: Global application control, preferences, permissions and environment-level tuning. | Trade Offs: Powerful and expected, but quickly becomes hostile when high-impact toggles are buried too deep. | Aetheris Insight: Configuration is the user's manifesto. Never hide high-impact toggles behind more than two layers of navigation.
```

---

## [PATTERN] Command Center
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 390

**Structure:** Single-input, modal-driven command surface backed by keyboard shortcuts and semantic matching.

**Trade Offs:** Fastest pattern for experts, but almost invisible to new users without clear onboarding or discoverability cues.

**Aetheris Insight:** Language is the most efficient interface. Every complex app benefits from a text-based shortcut system.

```
VELARIS PATTERN: Command Center | Structure: Single-input, modal-driven command surface backed by keyboard shortcuts and semantic matching. | Trade Offs: Fastest pattern for experts, but almost invisible to new users without clear onboarding or discoverability cues. | Aetheris Insight: Language is the most efficient interface. Every complex app benefits from a text-based shortcut system.
```

---

## [PATTERN] Focus Mode
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 777

**Structure:** A modal or full-screen overlay that isolates a single artifact by collapsing sidebars, notifications and peripheral navigation.

**Logic:** Eliminates context switching cost and lowers the cognitive price of sustaining attention on one objective.

**Context Of Use:** Long-form editors, code reviews, document drafting and design canvases that need prolonged immersion.

**When Not To Use:** Workflows that depend on simultaneous references, multi-pane awareness or live collaborative context.

**Trade Offs:** Maximizes concentration and quality, but can disorient users if returning to the broader interface is high-friction.

**Aetheris Insight:** Silence is a design decision. A good Focus Mode curates attention instead of merely hiding controls.

```
VELARIS PATTERN: Focus Mode | Structure: A modal or full-screen overlay that isolates a single artifact by collapsing sidebars, notifications and peripheral navigation. | Logic: Eliminates context switching cost and lowers the cognitive price of sustaining attention on one objective. | Context Of Use: Long-form editors, code reviews, document drafting and design canvases that need prolonged immersion. | When Not To Use: Workflows that depend on simultaneous references, multi-pane awareness or li...
```

---

## [PATTERN] Collaboration
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 748

**Structure:** Real-time presence indicators, conflict-resolution UI and co-editing primitives layered onto an existing single-user interface.

**Logic:** Operational transformation or CRDT-based synchronization turns presence into first-class interface data.

**Context Of Use:** Collaborative documents, shared canvases, code review sessions and whiteboarding workflows.

**When Not To Use:** Strict sequential ownership flows, low-latency environments with tight constraints or single-user personal surfaces.

**Trade Offs:** Increases team velocity, but adds significant system complexity and can introduce visual noise in solo tasks.

**Aetheris Insight:** Presence is data. Show what others are editing, not only where they are.

```
VELARIS PATTERN: Collaboration | Structure: Real-time presence indicators, conflict-resolution UI and co-editing primitives layered onto an existing single-user interface. | Logic: Operational transformation or CRDT-based synchronization turns presence into first-class interface data. | Context Of Use: Collaborative documents, shared canvases, code review sessions and whiteboarding workflows. | When Not To Use: Strict sequential ownership flows, low-latency environments with tight constraints or...
```

---

## [PATTERN] Timeline
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 727

**Structure:** Chronological log of state mutations, user actions or system events with actor identity, timestamps and restore affordances.

**Logic:** Treats every meaningful change as an immutable event, turning time into a navigable axis.

**Context Of Use:** Version-controlled editors, audit logs, publishing workflows and configuration history surfaces.

**When Not To Use:** Ephemeral live feeds, trivial interactions or cases where event storage costs outweigh user value.

**Trade Offs:** Builds recovery confidence and trust, but needs careful abstraction to avoid overwhelming non-technical users.

**Aetheris Insight:** Permanent history is more than undo. It gives users permission to take creative risks.

```
VELARIS PATTERN: Timeline | Structure: Chronological log of state mutations, user actions or system events with actor identity, timestamps and restore affordances. | Logic: Treats every meaningful change as an immutable event, turning time into a navigable axis. | Context Of Use: Version-controlled editors, audit logs, publishing workflows and configuration history surfaces. | When Not To Use: Ephemeral live feeds, trivial interactions or cases where event storage costs outweigh user value. | Tr...
```

---

## [PATTERN] Entity Picker
**Source:** `PatternsPage.tsx`  **Status:** Stable  **Chars:** 730

**Structure:** Inline or popover search-driven selector for relational entities with type-ahead, multi-select and preview chips.

**Logic:** Creates typed references instead of duplicating data, preserving authority in the source context.

**Context Of Use:** Assignees, tags, mentions, attachments, relationship fields and permission scope selectors.

**When Not To Use:** Small static option sets or flat values such as booleans, enums and simple colors.

**Trade Offs:** Preserves relational integrity and reduces duplication, but relies on fast backend search and responsive type-ahead UX.

**Aetheris Insight:** Link, don't copy. References preserve authority and allow the system to reason about relationships.

```
VELARIS PATTERN: Entity Picker | Structure: Inline or popover search-driven selector for relational entities with type-ahead, multi-select and preview chips. | Logic: Creates typed references instead of duplicating data, preserving authority in the source context. | Context Of Use: Assignees, tags, mentions, attachments, relationship fields and permission scope selectors. | When Not To Use: Small static option sets or flat values such as booleans, enums and simple colors. | Trade Offs: Preserves...
```

---

## [TOKEN] primary-50
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** primary / color / primitive

**Logic:** Lightest brand tint for subtle emphasis.

**Context Of Use:** Documentation, highlights

**When To Use:** Use the primary-50 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-50 | Value: #f5f0ff | Group: primary | Kind: color | Layer: primitive | Description: Lightest brand tint for subtle emphasis. | Components: Documentation, highlights
```

---

## [TOKEN] primary-100
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** primary / color / primitive

**Logic:** Soft brand tint for quiet selected surfaces.

**Context Of Use:** Chip, Tabs, Card

**When To Use:** Use the primary-100 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-100 | Value: #ede2ff | Group: primary | Kind: color | Layer: primitive | Description: Soft brand tint for quiet selected surfaces. | Components: Chip, Tabs, Card
```

---

## [TOKEN] primary-200
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 181

**Structure:** primary / color / primitive

**Logic:** Core light accent and focus foundation.

**Context Of Use:** Button, focus, XAI

**When To Use:** Use the primary-200 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-200 | Value: #deccfd | Group: primary | Kind: color | Layer: primitive | Description: Core light accent and focus foundation. | Components: Button, focus, XAI
```

---

## [TOKEN] primary-300
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** primary / color / primitive

**Logic:** Secondary brand accent and source emphasis.

**Context Of Use:** Source Attribution, icons

**When To Use:** Use the primary-300 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-300 | Value: #c2a0fc | Group: primary | Kind: color | Layer: primitive | Description: Secondary brand accent and source emphasis. | Components: Source Attribution, icons
```

---

## [TOKEN] primary-400
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** primary / color / primitive

**Logic:** Mid accent for stronger interactive emphasis.

**Context Of Use:** Selected controls

**When To Use:** Use the primary-400 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-400 | Value: #a777f9 | Group: primary | Kind: color | Layer: primitive | Description: Mid accent for stronger interactive emphasis. | Components: Selected controls
```

---

## [TOKEN] primary-500
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** primary / color / primitive

**Logic:** Saturated accent for dense visual states.

**Context Of Use:** Charts, active states

**When To Use:** Use the primary-500 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-500 | Value: #8b4ff5 | Group: primary | Kind: color | Layer: primitive | Description: Saturated accent for dense visual states. | Components: Charts, active states
```

---

## [TOKEN] primary-600
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** primary / color / primitive

**Logic:** Deep accent for pressed and layered states.

**Context Of Use:** Button, selected surfaces

**When To Use:** Use the primary-600 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-600 | Value: #6a30d4 | Group: primary | Kind: color | Layer: primitive | Description: Deep accent for pressed and layered states. | Components: Button, selected surfaces
```

---

## [TOKEN] primary-700
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 190

**Structure:** primary / color / primitive

**Logic:** Deepest brand tone for translucent selection.

**Context Of Use:** Rows, chips, overlays

**When To Use:** Use the primary-700 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: primary-700 | Value: #4a1aa0 | Group: primary | Kind: color | Layer: primitive | Description: Deepest brand tone for translucent selection. | Components: Rows, chips, overlays
```

---

## [TOKEN] surface-lowest
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** surface / color / primitive

**Logic:** Lowest depth and maximum visual separation.

**Context Of Use:** Backdrop, code

**When To Use:** Use the surface-lowest contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-lowest | Value: #000000 | Group: surface | Kind: color | Layer: primitive | Description: Lowest depth and maximum visual separation. | Components: Backdrop, code
```

---

## [TOKEN] background
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** surface / color / primitive

**Logic:** Application canvas in dark mode.

**Context Of Use:** Application shell

**When To Use:** Use the background contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: background | Value: #0e0e10 | Group: surface | Kind: color | Layer: primitive | Description: Application canvas in dark mode. | Components: Application shell
```

---

## [TOKEN] surface-container-low
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** surface / color / primitive

**Logic:** Low-elevation content region.

**Context Of Use:** Workbench, sections

**When To Use:** Use the surface-container-low contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-container-low | Value: #131315 | Group: surface | Kind: color | Layer: primitive | Description: Low-elevation content region. | Components: Workbench, sections
```

---

## [TOKEN] surface-container
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 167

**Structure:** surface / color / primitive

**Logic:** Default container surface.

**Context Of Use:** Card, Table

**When To Use:** Use the surface-container contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-container | Value: #19191c | Group: surface | Kind: color | Layer: primitive | Description: Default container surface. | Components: Card, Table
```

---

## [TOKEN] surface-container-high
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 183

**Structure:** surface / color / primitive

**Logic:** Elevated container and dialog base.

**Context Of Use:** Dialog, panel

**When To Use:** Use the surface-container-high contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-container-high | Value: #1f1f22 | Group: surface | Kind: color | Layer: primitive | Description: Elevated container and dialog base. | Components: Dialog, panel
```

---

## [TOKEN] surface-container-highest
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** surface / color / primitive

**Logic:** Highest opaque surface and popover base.

**Context Of Use:** Popover, Command Palette

**When To Use:** Use the surface-container-highest contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-container-highest | Value: #262528 | Group: surface | Kind: color | Layer: primitive | Description: Highest opaque surface and popover base. | Components: Popover, Command Palette
```

---

## [TOKEN] surface-bright
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** surface / color / primitive

**Logic:** Brightest dark surface for placeholders.

**Context Of Use:** Skeleton, hover

**When To Use:** Use the surface-bright contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-bright | Value: #2c2c2f | Group: surface | Kind: color | Layer: primitive | Description: Brightest dark surface for placeholders. | Components: Skeleton, hover
```

---

## [TOKEN] --velaris-color-primary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 226

**Structure:** semantic-color / color / semantic

**Logic:** Primary semantic action and focus color. Resolves to primary-200.

**Context Of Use:** Button, Link, focus

**When To Use:** Use the --velaris-color-primary contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: --velaris-color-primary | Value: #deccfd | Group: semantic-color | Kind: color | Layer: semantic | Description: Primary semantic action and focus color. Resolves to primary-200. | Components: Button, Link, focus
```

---

## [TOKEN] --velaris-color-secondary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** semantic-color / color / semantic

**Logic:** Secondary semantic accent. Resolves to primary-300.

**Context Of Use:** Badge, source, icon

**When To Use:** Use the --velaris-color-secondary contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: --velaris-color-secondary | Value: #c2a0fc | Group: semantic-color | Kind: color | Layer: semantic | Description: Secondary semantic accent. Resolves to primary-300. | Components: Badge, source, icon
```

---

## [TOKEN] --velaris-color-success
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 216

**Structure:** semantic-color / color / semantic

**Logic:** Successful completion and positive evidence.

**Context Of Use:** Alert, Toast, Confidence Badge

**When To Use:** Use the --velaris-color-success contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: --velaris-color-success | Value: #7ee787 | Group: semantic-color | Kind: color | Layer: semantic | Description: Successful completion and positive evidence. | Components: Alert, Toast, Confidence Badge
```

---

## [TOKEN] --velaris-color-warning
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** semantic-color / color / semantic

**Logic:** Caution, partial evidence, and medium confidence.

**Context Of Use:** Alert, Confidence Badge

**When To Use:** Use the --velaris-color-warning contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: --velaris-color-warning | Value: #ffa657 | Group: semantic-color | Kind: color | Layer: semantic | Description: Caution, partial evidence, and medium confidence. | Components: Alert, Confidence Badge
```

---

## [TOKEN] --velaris-color-error
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 210

**Structure:** semantic-color / color / semantic

**Logic:** Error, destructive action, and conflict.

**Context Of Use:** Form Field, Alert, Audit Panel

**When To Use:** Use the --velaris-color-error contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: --velaris-color-error | Value: #ff6e84 | Group: semantic-color | Kind: color | Layer: semantic | Description: Error, destructive action, and conflict. | Components: Form Field, Alert, Audit Panel
```

---

## [TOKEN] display-xl
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** typography / system / primitive

**Logic:** Hero headlines and identity surfaces.

**Context Of Use:** Page hero, brand

**When To Use:** Use the display-xl contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: display-xl | Value: text-6xl font-black tracking-tighter | Group: typography | Kind: system | Layer: primitive | Description: Hero headlines and identity surfaces. | Components: Page hero, brand
```

---

## [TOKEN] heading-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 211

**Structure:** typography / system / primitive

**Logic:** Major sections and content anchors.

**Context Of Use:** Documentation sections

**When To Use:** Use the heading-lg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: heading-lg | Value: text-3xl font-black tracking-tight | Group: typography | Kind: system | Layer: primitive | Description: Major sections and content anchors. | Components: Documentation sections
```

---

## [TOKEN] body-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** typography / system / primitive

**Logic:** Readable interface copy with balanced rhythm.

**Context Of Use:** Card, Dialog, docs

**When To Use:** Use the body-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: body-md | Value: text-base leading-7 | Group: typography | Kind: system | Layer: primitive | Description: Readable interface copy with balanced rhythm. | Components: Card, Dialog, docs
```

---

## [TOKEN] label-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** typography / system / primitive

**Logic:** Metadata, compact navigation, and chips.

**Context Of Use:** Badge, table label

**When To Use:** Use the label-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: label-sm | Value: text-xs font-bold uppercase tracking-[0.24em] | Group: typography | Kind: system | Layer: primitive | Description: Metadata, compact navigation, and chips. | Components: Badge, table label
```

---

## [TOKEN] space-1
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** spacing / system / primitive

**Logic:** Micro alignment and icon breathing room.

**Context Of Use:** Icon, inline metadata

**When To Use:** Use the space-1 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: space-1 | Value: 0.25rem | Group: spacing | Kind: system | Layer: primitive | Description: Micro alignment and icon breathing room. | Components: Icon, inline metadata
```

---

## [TOKEN] space-2
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** spacing / system / primitive

**Logic:** Compact group spacing and chips.

**Context Of Use:** Chip, Badge, Button

**When To Use:** Use the space-2 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: space-2 | Value: 0.5rem | Group: spacing | Kind: system | Layer: primitive | Description: Compact group spacing and chips. | Components: Chip, Badge, Button
```

---

## [TOKEN] space-4
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 171

**Structure:** spacing / system / primitive

**Logic:** Default card padding and form rhythm.

**Context Of Use:** Form Field, Card

**When To Use:** Use the space-4 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: space-4 | Value: 1rem | Group: spacing | Kind: system | Layer: primitive | Description: Default card padding and form rhythm. | Components: Form Field, Card
```

---

## [TOKEN] space-6
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 169

**Structure:** spacing / system / primitive

**Logic:** Section blocks and content density.

**Context Of Use:** Dialog, panels

**When To Use:** Use the space-6 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: space-6 | Value: 1.5rem | Group: spacing | Kind: system | Layer: primitive | Description: Section blocks and content density. | Components: Dialog, panels
```

---

## [TOKEN] space-10
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 169

**Structure:** spacing / system / primitive

**Logic:** Hero spacing and layout separation.

**Context Of Use:** Page sections

**When To Use:** Use the space-10 contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: space-10 | Value: 2.5rem | Group: spacing | Kind: system | Layer: primitive | Description: Hero spacing and layout separation. | Components: Page sections
```

---

## [TOKEN] radius-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 173

**Structure:** radius-shadow / system / primitive

**Logic:** Inputs, pills, and compact cards.

**Context Of Use:** Input, Badge

**When To Use:** Use the radius-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: radius-sm | Value: 0.5rem | Group: radius-shadow | Kind: system | Layer: primitive | Description: Inputs, pills, and compact cards. | Components: Input, Badge
```

---

## [TOKEN] radius-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** radius-shadow / system / primitive

**Logic:** Standard panels and control groups.

**Context Of Use:** Card, Alert

**When To Use:** Use the radius-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: radius-md | Value: 1rem | Group: radius-shadow | Kind: system | Layer: primitive | Description: Standard panels and control groups. | Components: Card, Alert
```

---

## [TOKEN] radius-xl
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 177

**Structure:** radius-shadow / system / primitive

**Logic:** Hero cards and immersive surfaces.

**Context Of Use:** Dialog, Workbench

**When To Use:** Use the radius-xl contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: radius-xl | Value: 2rem | Group: radius-shadow | Kind: system | Layer: primitive | Description: Hero cards and immersive surfaces. | Components: Dialog, Workbench
```

---

## [TOKEN] shadow-glow
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 218

**Structure:** radius-shadow / system / primitive

**Logic:** Specialized Velaris ambient emphasis.

**Context Of Use:** Identity, XAI focal points

**When To Use:** Use the shadow-glow contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: shadow-glow | Value: 0 0 64px rgba(179,157,219,0.12) | Group: radius-shadow | Kind: system | Layer: primitive | Description: Specialized Velaris ambient emphasis. | Components: Identity, XAI focal points
```

---

## [TOKEN] motion-fast
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 182

**Structure:** motion / system / primitive

**Logic:** Micro interactions and control feedback.

**Context Of Use:** Button, Link, Toggle

**When To Use:** Use the motion-fast contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: motion-fast | Value: 160ms | Group: motion | Kind: system | Layer: primitive | Description: Micro interactions and control feedback. | Components: Button, Link, Toggle
```

---

## [TOKEN] motion-base
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** motion / system / primitive

**Logic:** Default transitions for cards and layout shifts.

**Context Of Use:** Card, Tabs, Select

**When To Use:** Use the motion-base contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: motion-base | Value: 240ms | Group: motion | Kind: system | Layer: primitive | Description: Default transitions for cards and layout shifts. | Components: Card, Tabs, Select
```

---

## [TOKEN] motion-slow
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 180

**Structure:** motion / system / primitive

**Logic:** Meaningful emphasis and staged reveals.

**Context Of Use:** Dialog, Audit Panel

**When To Use:** Use the motion-slow contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: motion-slow | Value: 420ms | Group: motion | Kind: system | Layer: primitive | Description: Meaningful emphasis and staged reveals. | Components: Dialog, Audit Panel
```

---

## [TOKEN] easing-signature
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** motion / system / primitive

**Logic:** Smooth movement without abrupt stops.

**Context Of Use:** All animated components

**When To Use:** Use the easing-signature contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: easing-signature | Value: cubic-bezier(0.22,1,0.36,1) | Group: motion | Kind: system | Layer: primitive | Description: Smooth movement without abrupt stops. | Components: All animated components
```

---

## [TOKEN] text-primary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** text / color / semantic

**Logic:** Highest-priority readable text on dark surfaces.

**Context Of Use:** Typography, Dialog, Table

**When To Use:** Use the text-primary contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: text-primary | Value: #f9f5f8 | Group: text | Kind: color | Layer: semantic | Description: Highest-priority readable text on dark surfaces. | Components: Typography, Dialog, Table
```

---

## [TOKEN] text-secondary
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 185

**Structure:** text / color / semantic

**Logic:** Supporting copy with reduced emphasis.

**Context Of Use:** Card, Form Field, Source

**When To Use:** Use the text-secondary contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: text-secondary | Value: #adaaad | Group: text | Kind: color | Layer: semantic | Description: Supporting copy with reduced emphasis. | Components: Card, Form Field, Source
```

---

## [TOKEN] text-muted
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 179

**Structure:** text / color / semantic

**Logic:** Quiet metadata and low-priority labels.

**Context Of Use:** Caption, Table, Audit

**When To Use:** Use the text-muted contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: text-muted | Value: #767577 | Group: text | Kind: color | Layer: semantic | Description: Quiet metadata and low-priority labels. | Components: Caption, Table, Audit
```

---

## [TOKEN] text-disabled
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** text / color / semantic

**Logic:** Unavailable text while preserving legibility.

**Context Of Use:** Button, Input, Tabs

**When To Use:** Use the text-disabled contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: text-disabled | Value: rgba(173,170,173,0.45) | Group: text | Kind: color | Layer: semantic | Description: Unavailable text while preserving legibility. | Components: Button, Input, Tabs
```

---

## [TOKEN] text-inverse
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 192

**Structure:** text / color / semantic

**Logic:** Text placed on light primary surfaces.

**Context Of Use:** Primary Button, selected controls

**When To Use:** Use the text-inverse contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: text-inverse | Value: #50426a | Group: text | Kind: color | Layer: semantic | Description: Text placed on light primary surfaces. | Components: Primary Button, selected controls
```

---

## [TOKEN] border-subtle
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 188

**Structure:** border / color / semantic

**Logic:** Quiet structural separation.

**Context Of Use:** Card, Table, Skeleton

**When To Use:** Use the border-subtle contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: border-subtle | Value: rgba(255,255,255,0.07) | Group: border | Kind: color | Layer: semantic | Description: Quiet structural separation. | Components: Card, Table, Skeleton
```

---

## [TOKEN] border-default
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** border / color / semantic

**Logic:** Default control and container boundary.

**Context Of Use:** Input, Dialog, Panel

**When To Use:** Use the border-default contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: border-default | Value: rgba(255,255,255,0.10) | Group: border | Kind: color | Layer: semantic | Description: Default control and container boundary. | Components: Input, Dialog, Panel
```

---

## [TOKEN] border-strong
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 187

**Structure:** border / color / semantic

**Logic:** High-emphasis structural boundary.

**Context Of Use:** Table, Modal, Command Palette

**When To Use:** Use the border-strong contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: border-strong | Value: #48474a | Group: border | Kind: color | Layer: semantic | Description: High-emphasis structural boundary. | Components: Table, Modal, Command Palette
```

---

## [TOKEN] border-focus
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** border / color / semantic

**Logic:** Focused or selected boundary. Resolves to primary-200.

**Context Of Use:** Input, Checkbox, Tabs

**When To Use:** Use the border-focus contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: border-focus | Value: #deccfd | Group: border | Kind: color | Layer: semantic | Description: Focused or selected boundary. Resolves to primary-200. | Components: Input, Checkbox, Tabs
```

---

## [TOKEN] state-hover-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** interaction / color / semantic

**Logic:** Subtle hover fill on dark surfaces.

**Context Of Use:** Button, Link, Table row

**When To Use:** Use the state-hover-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: state-hover-bg | Value: rgba(255,255,255,0.04) | Group: interaction | Kind: color | Layer: semantic | Description: Subtle hover fill on dark surfaces. | Components: Button, Link, Table row
```

---

## [TOKEN] state-hover-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 212

**Structure:** interaction / color / semantic

**Logic:** Hover boundary with restrained brand emphasis.

**Context Of Use:** Card, Chip, Input

**When To Use:** Use the state-hover-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: state-hover-border | Value: rgba(222,204,253,0.16) | Group: interaction | Kind: color | Layer: semantic | Description: Hover boundary with restrained brand emphasis. | Components: Card, Chip, Input
```

---

## [TOKEN] state-pressed-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 207

**Structure:** interaction / color / semantic

**Logic:** Pressed feedback for immediate controls.

**Context Of Use:** Button, Toggle, Tabs

**When To Use:** Use the state-pressed-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: state-pressed-bg | Value: rgba(222,204,253,0.14) | Group: interaction | Kind: color | Layer: semantic | Description: Pressed feedback for immediate controls. | Components: Button, Toggle, Tabs
```

---

## [TOKEN] state-selected-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** interaction / color / semantic

**Logic:** Selected surface derived from primary-700.

**Context Of Use:** Chip, Tabs, Table row

**When To Use:** Use the state-selected-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: state-selected-bg | Value: rgba(74,26,160,0.22) | Group: interaction | Kind: color | Layer: semantic | Description: Selected surface derived from primary-700. | Components: Chip, Tabs, Table row
```

---

## [TOKEN] state-disabled-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 213

**Structure:** interaction / color / semantic

**Logic:** Disabled fill that remains distinguishable.

**Context Of Use:** Button, Input, Select

**When To Use:** Use the state-disabled-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: state-disabled-bg | Value: rgba(255,255,255,0.025) | Group: interaction | Kind: color | Layer: semantic | Description: Disabled fill that remains distinguishable. | Components: Button, Input, Select
```

---

## [TOKEN] focus-ring
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 227

**Structure:** interaction / system / semantic

**Logic:** Keyboard focus contract derived from primary-200.

**Context Of Use:** All interactive components

**When To Use:** Use the focus-ring contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: focus-ring | Value: 0 0 0 3px rgba(222,204,253,0.35) | Group: interaction | Kind: system | Layer: semantic | Description: Keyboard focus contract derived from primary-200. | Components: All interactive components
```

---

## [TOKEN] feedback-info-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** feedback / color / semantic

**Logic:** Neutral explanatory feedback surface.

**Context Of Use:** Alert, Tooltip, Toast

**When To Use:** Use the feedback-info-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-info-bg | Value: rgba(222,204,253,0.08) | Group: feedback | Kind: color | Layer: semantic | Description: Neutral explanatory feedback surface. | Components: Alert, Tooltip, Toast
```

---

## [TOKEN] feedback-info-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** feedback / color / semantic

**Logic:** Boundary for informational feedback.

**Context Of Use:** Alert, Tooltip

**When To Use:** Use the feedback-info-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-info-border | Value: rgba(222,204,253,0.24) | Group: feedback | Kind: color | Layer: semantic | Description: Boundary for informational feedback. | Components: Alert, Tooltip
```

---

## [TOKEN] feedback-success-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** feedback / color / semantic

**Logic:** Successful completion surface.

**Context Of Use:** Toast, Alert, Form Field

**When To Use:** Use the feedback-success-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-success-bg | Value: rgba(126,231,135,0.08) | Group: feedback | Kind: color | Layer: semantic | Description: Successful completion surface. | Components: Toast, Alert, Form Field
```

---

## [TOKEN] feedback-success-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 196

**Structure:** feedback / color / semantic

**Logic:** Boundary for successful feedback.

**Context Of Use:** Toast, Alert

**When To Use:** Use the feedback-success-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-success-border | Value: rgba(126,231,135,0.28) | Group: feedback | Kind: color | Layer: semantic | Description: Boundary for successful feedback. | Components: Toast, Alert
```

---

## [TOKEN] feedback-warning-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 206

**Structure:** feedback / color / semantic

**Logic:** Caution and partial-evidence surface.

**Context Of Use:** Alert, Confidence Badge

**When To Use:** Use the feedback-warning-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-warning-bg | Value: rgba(255,166,87,0.08) | Group: feedback | Kind: color | Layer: semantic | Description: Caution and partial-evidence surface. | Components: Alert, Confidence Badge
```

---

## [TOKEN] feedback-warning-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 201

**Structure:** feedback / color / semantic

**Logic:** Boundary for cautionary feedback.

**Context Of Use:** Alert, Audit Panel

**When To Use:** Use the feedback-warning-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-warning-border | Value: rgba(255,166,87,0.28) | Group: feedback | Kind: color | Layer: semantic | Description: Boundary for cautionary feedback. | Components: Alert, Audit Panel
```

---

## [TOKEN] feedback-error-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 205

**Structure:** feedback / color / semantic

**Logic:** Error and blocking feedback surface.

**Context Of Use:** Form Field, Alert, Audit

**When To Use:** Use the feedback-error-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-error-bg | Value: rgba(255,110,132,0.08) | Group: feedback | Kind: color | Layer: semantic | Description: Error and blocking feedback surface. | Components: Form Field, Alert, Audit
```

---

## [TOKEN] feedback-error-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 215

**Structure:** feedback / color / semantic

**Logic:** Boundary for error and conflict feedback.

**Context Of Use:** Input, Alert, Audit Panel

**When To Use:** Use the feedback-error-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-error-border | Value: rgba(255,110,132,0.28) | Group: feedback | Kind: color | Layer: semantic | Description: Boundary for error and conflict feedback. | Components: Input, Alert, Audit Panel
```

---

## [TOKEN] feedback-info-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 204

**Structure:** feedback / color / semantic

**Logic:** Informational icon and foreground. Resolves to primary-200.

**Context Of Use:** Alert, Tooltip

**When To Use:** Use the feedback-info-icon contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-info-icon | Value: #deccfd | Group: feedback | Kind: color | Layer: semantic | Description: Informational icon and foreground. Resolves to primary-200. | Components: Alert, Tooltip
```

---

## [TOKEN] feedback-error-icon
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 220

**Structure:** feedback / color / semantic

**Logic:** Error icon and foreground. Resolves to the semantic error color.

**Context Of Use:** Alert, Form Field, Audit

**When To Use:** Use the feedback-error-icon contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: feedback-error-icon | Value: #ff6e84 | Group: feedback | Kind: color | Layer: semantic | Description: Error icon and foreground. Resolves to the semantic error color. | Components: Alert, Form Field, Audit
```

---

## [TOKEN] surface-overlay
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** special-surface / color / semantic

**Logic:** Opaque overlay surface above the application canvas.

**Context Of Use:** Modal, Command Palette

**When To Use:** Use the surface-overlay contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-overlay | Value: rgba(14,14,16,0.92) | Group: special-surface | Kind: color | Layer: semantic | Description: Opaque overlay surface above the application canvas. | Components: Modal, Command Palette
```

---

## [TOKEN] surface-skeleton
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 211

**Structure:** special-surface / color / semantic

**Logic:** Loading placeholder derived from surface-bright.

**Context Of Use:** Skeleton Loader

**When To Use:** Use the surface-skeleton contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-skeleton | Value: rgba(44,44,47,0.72) | Group: special-surface | Kind: color | Layer: semantic | Description: Loading placeholder derived from surface-bright. | Components: Skeleton Loader
```

---

## [TOKEN] surface-row-selected
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 212

**Structure:** special-surface / color / semantic

**Logic:** Selected data row derived from primary-700.

**Context Of Use:** Table/Data Table

**When To Use:** Use the surface-row-selected contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: surface-row-selected | Value: rgba(74,26,160,0.18) | Group: special-surface | Kind: color | Layer: semantic | Description: Selected data row derived from primary-700. | Components: Table/Data Table
```

---

## [TOKEN] overlay-backdrop
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 217

**Structure:** special-surface / color / semantic

**Logic:** Backdrop that isolates modal and command contexts.

**Context Of Use:** Modal, Command Palette

**When To Use:** Use the overlay-backdrop contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: overlay-backdrop | Value: rgba(0,0,0,0.72) | Group: special-surface | Kind: color | Layer: semantic | Description: Backdrop that isolates modal and command contexts. | Components: Modal, Command Palette
```

---

## [TOKEN] shadow-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 205

**Structure:** elevation / system / semantic

**Logic:** Subtle elevation for cards and compact overlays.

**Context Of Use:** Card, Tooltip

**When To Use:** Use the shadow-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: shadow-sm | Value: 0 8px 24px rgba(0,0,0,0.18) | Group: elevation | Kind: system | Layer: semantic | Description: Subtle elevation for cards and compact overlays. | Components: Card, Tooltip
```

---

## [TOKEN] shadow-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** elevation / system / semantic

**Logic:** Default floating-surface elevation.

**Context Of Use:** Toast, Command Palette

**When To Use:** Use the shadow-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: shadow-md | Value: 0 16px 40px rgba(0,0,0,0.28) | Group: elevation | Kind: system | Layer: semantic | Description: Default floating-surface elevation. | Components: Toast, Command Palette
```

---

## [TOKEN] shadow-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 196

**Structure:** elevation / system / semantic

**Logic:** Strong isolation for blocking surfaces.

**Context Of Use:** Modal/Dialog

**When To Use:** Use the shadow-lg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: shadow-lg | Value: 0 24px 72px rgba(0,0,0,0.38) | Group: elevation | Kind: system | Layer: semantic | Description: Strong isolation for blocking surfaces. | Components: Modal/Dialog
```

---

## [TOKEN] z-tooltip
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 162

**Structure:** layering / system / semantic

**Logic:** Tooltip and explanation bubble layer.

**Context Of Use:** Tooltip

**When To Use:** Use the z-tooltip contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: z-tooltip | Value: 40 | Group: layering | Kind: system | Layer: semantic | Description: Tooltip and explanation bubble layer. | Components: Tooltip
```

---

## [TOKEN] z-toast
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 163

**Structure:** layering / system / semantic

**Logic:** Transient notification layer.

**Context Of Use:** Toast/Notification

**When To Use:** Use the z-toast contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: z-toast | Value: 50 | Group: layering | Kind: system | Layer: semantic | Description: Transient notification layer. | Components: Toast/Notification
```

---

## [TOKEN] z-modal
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 150

**Structure:** layering / system / semantic

**Logic:** Blocking dialog layer.

**Context Of Use:** Modal/Dialog

**When To Use:** Use the z-modal contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: z-modal | Value: 60 | Group: layering | Kind: system | Layer: semantic | Description: Blocking dialog layer. | Components: Modal/Dialog
```

---

## [TOKEN] z-command
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 162

**Structure:** layering / system / semantic

**Logic:** Global command surface layer.

**Context Of Use:** Command Palette

**When To Use:** Use the z-command contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: z-command | Value: 70 | Group: layering | Kind: system | Layer: semantic | Description: Global command surface layer. | Components: Command Palette
```

---

## [TOKEN] control-height-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 191

**Structure:** dimension / system / semantic

**Logic:** Compact control height for dense contexts.

**Context Of Use:** Chip, compact Button

**When To Use:** Use the control-height-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: control-height-sm | Value: 32px | Group: dimension | Kind: system | Layer: semantic | Description: Compact control height for dense contexts. | Components: Chip, compact Button
```

---

## [TOKEN] control-height-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 184

**Structure:** dimension / system / semantic

**Logic:** Default accessible control height.

**Context Of Use:** Button, Input, Select

**When To Use:** Use the control-height-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: control-height-md | Value: 44px | Group: dimension | Kind: system | Layer: semantic | Description: Default accessible control height. | Components: Button, Input, Select
```

---

## [TOKEN] control-height-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** dimension / system / semantic

**Logic:** Prominent control height for primary tasks.

**Context Of Use:** Command Palette, primary Input

**When To Use:** Use the control-height-lg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: control-height-lg | Value: 52px | Group: dimension | Kind: system | Layer: semantic | Description: Prominent control height for primary tasks. | Components: Command Palette, primary Input
```

---

## [TOKEN] target-size-min
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 198

**Structure:** dimension / system / semantic

**Logic:** Minimum interactive target for accessibility.

**Context Of Use:** All interactive components

**When To Use:** Use the target-size-min contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: target-size-min | Value: 44px | Group: dimension | Kind: system | Layer: semantic | Description: Minimum interactive target for accessibility. | Components: All interactive components
```

---

## [TOKEN] icon-size-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** dimension / system / semantic

**Logic:** Compact icon size for metadata and controls.

**Context Of Use:** Chip, Badge, Table

**When To Use:** Use the icon-size-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: icon-size-sm | Value: 16px | Group: dimension | Kind: system | Layer: semantic | Description: Compact icon size for metadata and controls. | Components: Chip, Badge, Table
```

---

## [TOKEN] icon-size-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 172

**Structure:** dimension / system / semantic

**Logic:** Default interface icon size.

**Context Of Use:** Button, Input, Alert

**When To Use:** Use the icon-size-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: icon-size-md | Value: 20px | Group: dimension | Kind: system | Layer: semantic | Description: Default interface icon size. | Components: Button, Input, Alert
```

---

## [TOKEN] icon-size-lg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 199

**Structure:** dimension / system / semantic

**Logic:** Prominent icon size for feedback and navigation.

**Context Of Use:** Alert, Dialog, empty states

**When To Use:** Use the icon-size-lg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: icon-size-lg | Value: 24px | Group: dimension | Kind: system | Layer: semantic | Description: Prominent icon size for feedback and navigation. | Components: Alert, Dialog, empty states
```

---

## [TOKEN] heading-md
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 219

**Structure:** typography / system / semantic

**Logic:** Panel and component documentation heading.

**Context Of Use:** Card, Dialog, Audit Panel

**When To Use:** Use the heading-md contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: heading-md | Value: text-2xl font-bold tracking-tight | Group: typography | Kind: system | Layer: semantic | Description: Panel and component documentation heading. | Components: Card, Dialog, Audit Panel
```

---

## [TOKEN] body-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 197

**Structure:** typography / system / semantic

**Logic:** Compact explanatory and form copy.

**Context Of Use:** Form Field, Source Attribution

**When To Use:** Use the body-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: body-sm | Value: text-sm leading-6 | Group: typography | Kind: system | Layer: semantic | Description: Compact explanatory and form copy. | Components: Form Field, Source Attribution
```

---

## [TOKEN] caption
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 194

**Structure:** typography / system / semantic

**Logic:** Metadata, timestamps, and provenance.

**Context Of Use:** Table, Source, Audit

**When To Use:** Use the caption contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: caption | Value: text-[11px] leading-4 | Group: typography | Kind: system | Layer: semantic | Description: Metadata, timestamps, and provenance. | Components: Table, Source, Audit
```

---

## [TOKEN] code-sm
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 209

**Structure:** typography / system / semantic

**Logic:** Readable snippets and technical evidence.

**Context Of Use:** Code Snippet, Audit Panel

**When To Use:** Use the code-sm contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: code-sm | Value: font-mono text-xs leading-6 | Group: typography | Kind: system | Layer: semantic | Description: Readable snippets and technical evidence. | Components: Code Snippet, Audit Panel
```

---

## [TOKEN] xai-source-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 202

**Structure:** xai / color / xai

**Logic:** Grounded source and provenance surface.

**Context Of Use:** Source Attribution, RAG response

**When To Use:** Use the xai-source-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: xai-source-bg | Value: rgba(222,204,253,0.06) | Group: xai | Kind: color | Layer: xai | Description: Grounded source and provenance surface. | Components: Source Attribution, RAG response
```

---

## [TOKEN] xai-source-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 191

**Structure:** xai / color / xai

**Logic:** Inspectable source boundary. Resolves to primary-300.

**Context Of Use:** Source Attribution

**When To Use:** Use the xai-source-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: xai-source-border | Value: #c2a0fc | Group: xai | Kind: color | Layer: xai | Description: Inspectable source boundary. Resolves to primary-300. | Components: Source Attribution
```

---

## [TOKEN] xai-evidence-highlight
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 223

**Structure:** xai / color / xai

**Logic:** Evidence emphasis derived from primary-200 with opacity.

**Context Of Use:** Source Attribution, Tooltip

**When To Use:** Use the xai-evidence-highlight contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: xai-evidence-highlight | Value: rgba(222,204,253,0.16) | Group: xai | Kind: color | Layer: xai | Description: Evidence emphasis derived from primary-200 with opacity. | Components: Source Attribution, Tooltip
```

---

## [TOKEN] xai-audit-running
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 186

**Structure:** xai / color / xai

**Logic:** Audit process currently executing.

**Context Of Use:** Audit Panel, Consulta ao Abraxos

**When To Use:** Use the xai-audit-running contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: xai-audit-running | Value: #c2a0fc | Group: xai | Kind: color | Layer: xai | Description: Audit process currently executing. | Components: Audit Panel, Consulta ao Abraxos
```

---

## [TOKEN] technical.foreground
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 285

**Structure:** technical / color / semantic

**Logic:** Default monospace foreground for technical surfaces. Lavender base, easier on the eyes than saturated IDE defaults.

**Context Of Use:** Code block, trace panel, inline code

**When To Use:** Use the technical.foreground contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.foreground | Value: #e8e1f5 | Group: technical | Kind: color | Layer: semantic | Description: Default monospace foreground for technical surfaces. Lavender base, easier on the eyes than saturated IDE defaults. | Components: Code block, trace panel, inline code
```

---

## [TOKEN] technical.keyword
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 247

**Structure:** technical / color / semantic

**Logic:** Reserved words, pipeline stages, and language keywords in technical surfaces.

**Context Of Use:** Code Snippet, Execution Trace, Pipeline

**When To Use:** Use the technical.keyword contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.keyword | Value: #c4a7e7 | Group: technical | Kind: color | Layer: semantic | Description: Reserved words, pipeline stages, and language keywords in technical surfaces. | Components: Code Snippet, Execution Trace, Pipeline
```

---

## [TOKEN] technical.type
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 237

**Structure:** technical / color / semantic

**Logic:** Types, classes, entities, enums, and schema metadata such as page_type.

**Context Of Use:** Developers, Corpus table, API Explorer

**When To Use:** Use the technical.type contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.type | Value: #9ccfd8 | Group: technical | Kind: color | Layer: semantic | Description: Types, classes, entities, enums, and schema metadata such as page_type. | Components: Developers, Corpus table, API Explorer
```

---

## [TOKEN] technical.entity
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 236

**Structure:** technical / color / semantic

**Logic:** Reserved alias for domain entities. Currently resolves to technical.type.

**Context Of Use:** Future: interfaces, domain models

**When To Use:** Use the technical.entity contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.entity | Value: #9ccfd8 | Group: technical | Kind: color | Layer: semantic | Description: Reserved alias for domain entities. Currently resolves to technical.type. | Components: Future: interfaces, domain models
```

---

## [TOKEN] technical.string
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 214

**Structure:** technical / color / semantic

**Logic:** Text literals, configuration values, and quoted labels.

**Context Of Use:** Code Snippet, Dev Integration

**When To Use:** Use the technical.string contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.string | Value: #31748f | Group: technical | Kind: color | Layer: semantic | Description: Text literals, configuration values, and quoted labels. | Components: Code Snippet, Dev Integration
```

---

## [TOKEN] technical.property
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 249

**Structure:** technical / color / semantic

**Logic:** Properties, module names, and file paths. Resolves to technical.foreground.

**Context Of Use:** Architecture tiers, RAG pipeline, Snippets

**When To Use:** Use the technical.property contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.property | Value: #e8e1f5 | Group: technical | Kind: color | Layer: semantic | Description: Properties, module names, and file paths. Resolves to technical.foreground. | Components: Architecture tiers, RAG pipeline, Snippets
```

---

## [TOKEN] technical.number
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 227

**Structure:** technical / color / semantic

**Logic:** Numeric data, metrics, targets, versions, and coverage values.

**Context Of Use:** Evaluation META, Laboratory metrics

**When To Use:** Use the technical.number contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.number | Value: #eb6f92 | Group: technical | Kind: color | Layer: semantic | Description: Numeric data, metrics, targets, versions, and coverage values. | Components: Evaluation META, Laboratory metrics
```

---

## [TOKEN] technical.command
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 226

**Structure:** technical / color / semantic

**Logic:** Functions, executable shell commands, and runnable actions.

**Context Of Use:** Developers, Dev Integration, Scripts

**When To Use:** Use the technical.command contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.command | Value: #f6c177 | Group: technical | Kind: color | Layer: semantic | Description: Functions, executable shell commands, and runnable actions. | Components: Developers, Dev Integration, Scripts
```

---

## [TOKEN] technical.operator
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 217

**Structure:** technical / color / semantic

**Logic:** Operators, separators, and structural punctuation in code.

**Context Of Use:** Code Snippet, Markdown code

**When To Use:** Use the technical.operator contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.operator | Value: #b0a8bc | Group: technical | Kind: color | Layer: semantic | Description: Operators, separators, and structural punctuation in code. | Components: Code Snippet, Markdown code
```

---

## [TOKEN] technical.comment
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 229

**Structure:** technical / color / semantic

**Logic:** Secondary hints, trailing notes, and low-priority technical metadata.

**Context Of Use:** Execution Trace, inline hints

**When To Use:** Use the technical.comment contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.comment | Value: #6e6a78 | Group: technical | Kind: color | Layer: semantic | Description: Secondary hints, trailing notes, and low-priority technical metadata. | Components: Execution Trace, inline hints
```

---

## [TOKEN] technical.accent
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 221

**Structure:** technical / color / semantic

**Logic:** Focused technical highlight that is not branding or feedback.

**Context Of Use:** Baseline tags, technical links

**When To Use:** Use the technical.accent contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.accent | Value: #9d7fe6 | Group: technical | Kind: color | Layer: semantic | Description: Focused technical highlight that is not branding or feedback. | Components: Baseline tags, technical links
```

---

## [TOKEN] technical.surface
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 225

**Structure:** technical / color / semantic

**Logic:** Background for monospace blocks and engineering panels.

**Context Of Use:** Code block, trace panel

**When To Use:** Use the technical.surface contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.surface | Value: rgba(255,255,255,0.022) | Group: technical | Kind: color | Layer: semantic | Description: Background for monospace blocks and engineering panels. | Components: Code block, trace panel
```

---

## [TOKEN] technical.surface-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 213

**Structure:** technical / color / semantic

**Logic:** Structural border for technical blocks.

**Context Of Use:** Code block, API panel

**When To Use:** Use the technical.surface-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.surface-border | Value: rgba(255,255,255,0.10) | Group: technical | Kind: color | Layer: semantic | Description: Structural border for technical blocks. | Components: Code block, API panel
```

---

## [TOKEN] technical.chip-bg
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** technical / color / semantic

**Logic:** Inline technical chip background.

**Context Of Use:** Path chip, artefact chip

**When To Use:** Use the technical.chip-bg contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.chip-bg | Value: rgba(194,160,252,0.05) | Group: technical | Kind: color | Layer: semantic | Description: Inline technical chip background. | Components: Path chip, artefact chip
```

---

## [TOKEN] technical.chip-border
**Source:** `TokensPage.tsx`  **Status:** Stable  **Chars:** 203

**Structure:** technical / color / semantic

**Logic:** Inline technical chip border.

**Context Of Use:** Path chip, artefact chip

**When To Use:** Use the technical.chip-border contract wherever the documented component context applies.

**When Not To Use:** Do not replace this contract with an unrelated raw value or one-off state token.

**Aetheris Insight:** Canonical tokens centralize values while semantic layers preserve explicit usage intent.

```
VELARIS TOKEN: technical.chip-border | Value: rgba(158,180,204,0.18) | Group: technical | Kind: color | Layer: semantic | Description: Inline technical chip border. | Components: Path chip, artefact chip
```

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

```
VELARIS TOKEN ALIAS: state-selected-border | Target: border-focus | Resolved value: #deccfd | Group: Interaction | Description: Selected controls reuse the focus boundary contract.
```

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

```
VELARIS TOKEN ALIAS: state-disabled-text | Target: text-disabled | Resolved value: rgba(173,170,173,0.45) | Group: Interaction | Description: Disabled foreground is governed by the text contract.
```

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

```
VELARIS TOKEN ALIAS: state-disabled-border | Target: border-subtle | Resolved value: rgba(255,255,255,0.07) | Group: Interaction | Description: Disabled boundaries remain quiet without a duplicate value.
```

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

```
VELARIS TOKEN ALIAS: feedback-info-text | Target: feedback-info-icon | Resolved value: #deccfd | Group: Feedback | Description: Info text and icon share the same foreground contract.
```

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

```
VELARIS TOKEN ALIAS: feedback-success-text | Target: --velaris-color-success | Resolved value: #7ee787 | Group: Feedback | Description: Success foreground resolves to the semantic success color.
```

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

```
VELARIS TOKEN ALIAS: feedback-success-icon | Target: --velaris-color-success | Resolved value: #7ee787 | Group: Feedback | Description: Success icon resolves to the semantic success color.
```

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

```
VELARIS TOKEN ALIAS: feedback-warning-text | Target: --velaris-color-warning | Resolved value: #ffa657 | Group: Feedback | Description: Warning foreground resolves to the semantic warning color.
```

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

```
VELARIS TOKEN ALIAS: feedback-warning-icon | Target: --velaris-color-warning | Resolved value: #ffa657 | Group: Feedback | Description: Warning icon resolves to the semantic warning color.
```

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

```
VELARIS TOKEN ALIAS: feedback-error-text | Target: feedback-error-icon | Resolved value: #ff6e84 | Group: Feedback | Description: Error text and icon share one foreground contract.
```

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

```
VELARIS TOKEN ALIAS: xai-confidence-high | Target: --velaris-color-success | Resolved value: #7ee787 | Group: XAI | Description: High calibrated confidence reuses semantic success.
```

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

```
VELARIS TOKEN ALIAS: xai-confidence-medium | Target: --velaris-color-warning | Resolved value: #ffa657 | Group: XAI | Description: Medium confidence communicates caution without a new hue.
```

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

```
VELARIS TOKEN ALIAS: xai-confidence-low | Target: --velaris-color-error | Resolved value: #ff6e84 | Group: XAI | Description: Low confidence reuses the semantic error signal.
```

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

```
VELARIS TOKEN ALIAS: xai-audit-complete | Target: --velaris-color-success | Resolved value: #7ee787 | Group: XAI | Description: Completed audits reuse semantic success.
```

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

```
VELARIS TOKEN ALIAS: xai-audit-conflict | Target: --velaris-color-error | Resolved value: #ff6e84 | Group: XAI | Description: Policy or evidence conflicts reuse semantic error.
```

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

```
VELARIS TOKEN ALIAS: surface-dialog | Target: surface-container-high | Resolved value: #1f1f22 | Group: Surface | Description: Dialog is a semantic usage contract over the high container.
```

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

```
VELARIS TOKEN ALIAS: surface-popover | Target: surface-container-highest | Resolved value: #262528 | Group: Surface | Description: Popover is a semantic usage contract over the highest container.
```

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

```
VELARIS TOKEN ALIAS: technical.path | Target: technical.property | Resolved value: #e8e1f5 | Group: Technical | Description: File and module paths reuse the property role.
```

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

```
VELARIS TOKEN ALIAS: technical.metadata | Target: technical.type | Resolved value: #9ccfd8 | Group: Technical | Description: Schema metadata and enums reuse the type role.
```

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

```
VELARIS TOKEN ALIAS: technical.link | Target: technical.accent | Resolved value: #9d7fe6 | Group: Technical | Description: Technical documentation links reuse the accent role.
```

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

```
VELARIS DESIGN DECISION: Side Drawer vs Modal Overlay | Logic: Side Drawer preserves spatial context — use when user needs to reference content behind. Modal Overlay demands full attention — use for confirmations, creation flows, critical alerts. | When to Use Side Drawer: High density content, persistent context, form step integration. | When to Use Modal: Actions requiring undivided focus, confirmations, blocking decisions. | Trade-offs: Visual occlusion (drawer), contextual drift (modal blind...
```

---

## [DESIGN_DECISION] Primary vs. Secondary Button Logic
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 204

**Logic:** When to use the signature gradient versus restrained secondary treatments for terminal actions.

**Context Of Use:** Rule 08: Action Hierarchy

```
VELARIS DESIGN DECISION: Primary vs. Secondary Button Logic | Rule: Rule 08: Action Hierarchy | Description: When to use the signature gradient versus restrained secondary treatments for terminal actions.
```

---

## [DESIGN_DECISION] List vs. Bento
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 499

**Logic:** List layout excels for scannable, sequential data with consistent row density. Bento grid excels for heterogeneous content where size encodes priority : larger cells signal higher importance. Use List when users compare items row by row. Use Bento when visual hierarchy and content variety matter more than strict alignment. Trade-off: Bento requires more design effort per item; List is faster to implement but less expressive.

**Context Of Use:** Rule 12

```
VELARIS DESIGN DECISION: List vs. Bento | Rule: Rule 12 | Description: List layout excels for scannable, sequential data with consistent row density. Bento grid excels for heterogeneous content where size encodes priority : larger cells signal higher importance. Use List when users compare items row by row. Use Bento when visual hierarchy and content variety matter more than strict alignment. Trade-off: Bento requires more design effort per item; List is faster to implement but less expressive.
```

---

## [DESIGN_DECISION] Haptic Feedback
**Source:** `DesignDecisionsPage.tsx`  **Status:** Stable  **Chars:** 541

**Logic:** Haptic feedback confirms high-stakes or irreversible actions on mobile : deletes, confirmations and state toggles. Reserve for moments where tactile confirmation reduces user anxiety about permanence. When to use: destructive actions, form submissions, binary state changes. When not to use: passive events, informational toasts, decorative interactions. Trade-off: overuse degrades trust and drains battery; underuse leaves users uncertain after consequential actions.

**Context Of Use:** Rule 15

```
VELARIS DESIGN DECISION: Haptic Feedback | Rule: Rule 15 | Description: Haptic feedback confirms high-stakes or irreversible actions on mobile : deletes, confirmations and state toggles. Reserve for moments where tactile confirmation reduces user anxiety about permanence. When to use: destructive actions, form submissions, binary state changes. When not to use: passive events, informational toasts, decorative interactions. Trade-off: overuse degrades trust and drains battery; underuse leaves use...
```

---

## [GUIDELINE] Velaris Guideline Architecture
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 336

**Logic:** Formal guideline architecture for the Velaris design system.

**Context Of Use:** Foundations hub, governance analysis, principle conflict mode.

```
VELARIS GUIDELINE: Velaris Guideline Architecture | Six strategic pillars, twelve design principles and forty-eight operational rules for trustworthy, explainable and human-centered product experiences. Route: /foundations?focus=manifesto. Abraxos uses these guidelines for principle conflict resolution and governance readiness checks.
```

---

## [GUIDELINE] Clarity & Hierarchy
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 236

**Logic:** Make the primary message unmistakable before users parse supporting detail.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Clarity & Hierarchy | Summary: Make the primary message unmistakable before users parse supporting detail. | Pillar ID: clarity | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [GUIDELINE] Cognitive Empathy
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 240

**Logic:** Design around the user's mental model instead of the system's internal structure.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Cognitive Empathy | Summary: Design around the user's mental model instead of the system's internal structure. | Pillar ID: empathy | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [GUIDELINE] Feedback & Trust
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 242

**Logic:** Fast, contextual feedback builds confidence and keeps intent connected to response.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Feedback & Trust | Summary: Fast, contextual feedback builds confidence and keeps intent connected to response. | Pillar ID: feedback | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [GUIDELINE] Language & Tone
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 216

**Logic:** Language should be direct, human and sensitive to context.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Language & Tone | Summary: Language should be direct, human and sensitive to context. | Pillar ID: language | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [GUIDELINE] Inclusion & Resilience
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 244

**Logic:** Accessible, forgiving systems should support broad human needs from the start.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Inclusion & Resilience | Summary: Accessible, forgiving systems should support broad human needs from the start. | Pillar ID: inclusion | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [GUIDELINE] Systems & Performance
**Source:** `GuidelinesPage.tsx`  **Status:** Stable  **Chars:** 241

**Logic:** Consistency, motion and performance make the product feel learnable and alive.

**Context Of Use:** Design principles, governance and explainable recommendations.

```
VELARIS GUIDELINE PILLAR: Systems & Performance | Summary: Consistency, motion and performance make the product feel learnable and alive. | Pillar ID: systems | Part of the Velaris guideline architecture used by Abraxos for design decisions.
```

---

## [ACCESSIBILITY] Contraste e legibilidade
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1186

**Structure:** Transversal accessibility contract

**Logic:** Manter contraste AA como base; distinguir text-primary, text-secondary, text-muted e text-disabled; validar texto sobre glass surfaces; combinar feedback com texto e ícone

**Context Of Use:** Alert, Toast, Tooltip, Confidence Badge, Source Attribution e Audit Panel

**When To Use:** Apply before approving any affected component or pattern. Related tokens: text-primary, text-secondary, text-muted, text-disabled, feedback-error

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Contraste e legibilidade | Description: O Velaris deve garantir leitura clara em superfícies escuras, translúcidas ou elevadas. Estados semânticos e níveis de confiança não dependem apenas da cor. | Structure: Transversal accessibility contract | Logic: Manter contraste AA como base; distinguir text-primary, text-secondary, text-muted e text-disabled; validar texto sobre glass surfaces; combinar feedback com texto e ícone | Context Of Use: Alert, Toast, Tooltip, Confidence...
```

---

## [ACCESSIBILITY] Foco e navegação por teclado
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1176

**Structure:** Transversal accessibility contract

**Logic:** Tornar todo controle alcançável por teclado; aplicar focus-ring e border-focus de forma consistente; alinhar a ordem de tabulação à estrutura visual; restaurar o foco após overlays

**Context Of Use:** Command Palette, Modal/Dialog, Tabs, Form Field, Button, Input e Select

**When To Use:** Apply before approving any affected component or pattern. Related tokens: focus-ring, border-focus, state-selected

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Foco e navegação por teclado | Description: A navegação por teclado é um requisito de base. Elementos interativos precisam de foco visível, ordem previsível e estados que não dependam exclusivamente de hover. | Structure: Transversal accessibility contract | Logic: Tornar todo controle alcançável por teclado; aplicar focus-ring e border-focus de forma consistente; alinhar a ordem de tabulação à estrutura visual; restaurar o foco após overlays | Context Of Use: Command Pale...
```

---

## [ACCESSIBILITY] Alvo mínimo e densidade
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1104

**Structure:** Transversal accessibility contract

**Logic:** Usar target-size-min; manter 44px em controles principais; ampliar a área clicável de ícones compactos; separar ações adjacentes; testar densidade em telas menores

**Context Of Use:** Button, Input, Select, Toggle, chips, badges e botões de ícone

**When To Use:** Apply before approving any affected component or pattern. Related tokens: target-size-min, space-2, space-3, space-4

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Alvo mínimo e densidade | Description: Componentes interativos preservam uma área de acionamento confortável. Densidade visual não pode comprometer precisão, leitura ou previsibilidade. | Structure: Transversal accessibility contract | Logic: Usar target-size-min; manter 44px em controles principais; ampliar a área clicável de ícones compactos; separar ações adjacentes; testar densidade em telas menores | Context Of Use: Button, Input, Select, Toggle, chips, badges e botõe...
```

---

## [ACCESSIBILITY] Estados acessíveis
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1125

**Structure:** Transversal accessibility contract

**Logic:** Documentar hover, focus, pressed, selected, disabled, loading, error, expanded e collapsed; evitar mudanças apenas por opacidade; expor aria attributes quando aplicável

**Context Of Use:** Todos os componentes interativos e superfícies com disclosure

**When To Use:** Apply before approving any affected component or pattern. Related tokens: state-disabled, state-selected, border-focus, feedback-error

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Estados acessíveis | Description: Estados de interface precisam ser distinguíveis e previsíveis, tanto visualmente quanto semanticamente quando a mudança afeta tecnologias assistivas. | Structure: Transversal accessibility contract | Logic: Documentar hover, focus, pressed, selected, disabled, loading, error, expanded e collapsed; evitar mudanças apenas por opacidade; expor aria attributes quando aplicável | Context Of Use: Todos os componentes interativos e superfícies co...
```

---

## [ACCESSIBILITY] Leitores de tela e semântica
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1109

**Structure:** Transversal accessibility contract

**Logic:** Usar labels visíveis; associar aria-describedby e mensagens de erro; aplicar aria-expanded e aria-invalid; nomear botões de ícone; usar role apenas quando necessário

**Context Of Use:** Formulários, tabelas, navegação, componentes de disclosure e superfícies XAI

**When To Use:** Apply before approving any affected component or pattern. Related tokens: text-primary, text-muted, feedback-error

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Leitores de tela e semântica | Description: Componentes expõem nomes, papéis, relações e estados compreensíveis para tecnologias assistivas, sem depender da aparência visual. | Structure: Transversal accessibility contract | Logic: Usar labels visíveis; associar aria-describedby e mensagens de erro; aplicar aria-expanded e aria-invalid; nomear botões de ícone; usar role apenas quando necessário | Context Of Use: Formulários, tabelas, navegação, componentes de disclosure e ...
```

---

## [ACCESSIBILITY] Feedback não apenas por cor
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1156

**Structure:** Transversal accessibility contract

**Logic:** Combinar success, warning, error e info com rótulo ou ícone; nomear o nível de confiança; identificar a origem da evidência; indicar conflitos e lacunas de auditoria

**Context Of Use:** Alert, Toast, Confidence Badge, Source Attribution e Audit Panel

**When To Use:** Apply before approving any affected component or pattern. Related tokens: feedback-success, feedback-warning, feedback-error, feedback-info

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Feedback não apenas por cor | Description: O Velaris não comunica significado crítico apenas por verde, amarelo ou vermelho. Cor reforça uma mensagem que também existe em texto, ícone ou estrutura. | Structure: Transversal accessibility contract | Logic: Combinar success, warning, error e info com rótulo ou ícone; nomear o nível de confiança; identificar a origem da evidência; indicar conflitos e lacunas de auditoria | Context Of Use: Alert, Toast, Confidence Badge, Source...
```

---

## [ACCESSIBILITY] Movimento seguro
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1100

**Structure:** Transversal accessibility contract

**Logic:** Usar transições curtas; respeitar prefers-reduced-motion; evitar animações bloqueantes; preservar foco durante mudanças; usar motion para explicar continuidade espacial

**Context Of Use:** Modal/Dialog, Toast, Tooltip, Skeleton Loader, Command Palette e Audit Panel

**When To Use:** Apply before approving any affected component or pattern. Related tokens: motion-fast, motion-standard, motion-reduced

**When Not To Use:** Accessibility is never optional or deferred as post-release polish.

**Aetheris Insight:** Accessibility is a system-wide quality contract, not a component-specific add-on.

```
VELARIS ACCESSIBILITY: Movimento seguro | Description: Movimento apoia orientação, feedback e continuidade. Animações são discretas, previsíveis e não atrasam leitura, foco ou tomada de decisão. | Structure: Transversal accessibility contract | Logic: Usar transições curtas; respeitar prefers-reduced-motion; evitar animações bloqueantes; preservar foco durante mudanças; usar motion para explicar continuidade espacial | Context Of Use: Modal/Dialog, Toast, Tooltip, Skeleton Loader, Command Palett...
```

---

## [ACCESSIBILITY] Checklist de prontidão acessível
**Source:** `FoundationsPage.tsx`  **Status:** Stable  **Chars:** 1493

**Structure:** 10 verificações de prontidão acessível

**Logic:** 1. Possui foco visível. 2. Pode ser usado por teclado. 3. Tem label ou nome acessível. 4. Não comunica estado apenas por cor. 5. Mantém contraste adequado em dark mode. 6. Expõe estados disabled, loading, error e selected quando aplicável. 7. Usa tokens semânticos de texto, borda, foco e feedback. 8. Respeita alvo mínimo de interação. 9. Possui documentação de acessibilidade. 10. Possui exemplo de uso correto e incorreto.

**Context Of Use:** Component review, pattern review, documentation and Beatrice guidance.

**When To Use:** Use during design, implementation, QA and corpus review.

**When Not To Use:** Do not approve a component with undocumented or failed checks.

**Aetheris Insight:** Prontidão acessível exige evidência reproduzível, não apenas intenção.

```
VELARIS ACCESSIBILITY: Checklist de prontidão acessível | Description: Gate obrigatório antes de um componente entrar no Aetheris. | Structure: 10 verificações de prontidão acessível | Logic: 1. Possui foco visível. 2. Pode ser usado por teclado. 3. Tem label ou nome acessível. 4. Não comunica estado apenas por cor. 5. Mantém contraste adequado em dark mode. 6. Expõe estados disabled, loading, error e selected quando aplicável. 7. Usa tokens semânticos de texto, borda, foco e feedback. 8. Respei...
```

---

## [REASONING] Abraxos Explainable Reasoning
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 350

**Logic:** Central surface for Abraxos cognitive architecture documentation.

**Context Of Use:** Users learning how Abraxos reasons differently from a generic LLM.

```
VELARIS REASONING: Abraxos Explainable Reasoning | Abraxos combines internal capabilities, actionable Oracle commands, and the Evidence Weaver to turn questions into grounded answers with sources, confidence, and explicit limits. Route: /reasoning. Five sections: overview, Evidence Weaver, automatic skills, Oracle commands, and verifiable pipeline.
```

---

## [REASONING] Cognitive Flow — Question ingestion
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 172

**Logic:** User query enters the Abraxos pipeline.

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Question ingestion | Detail: User query enters the Abraxos pipeline. | Step ID: question | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Intent classification
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 183

**Logic:** Abraxos classifies retrieval and response intent.

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Intent classification | Detail: Abraxos classifies retrieval and response intent. | Step ID: intent | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Skill activation
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 181

**Logic:** Automatic cognitive skills activate based on context.

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Skill activation | Detail: Automatic cognitive skills activate based on context. | Step ID: skill | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Retrieval
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Pipeline step: retrieval

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Retrieval | Detail: Pipeline step: retrieval | Step ID: retrieval | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Attribution
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Pipeline step: attribution

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Attribution | Detail: Pipeline step: attribution | Step ID: attribution | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Calibration
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Pipeline step: calibration

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Calibration | Detail: Pipeline step: calibration | Step ID: calibration | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Synthesis
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Pipeline step: synthesis

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Synthesis | Detail: Pipeline step: synthesis | Step ID: synthesis | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Cognitive Flow — Answer
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 140

**Logic:** Pipeline step: answer

**Context Of Use:** Beatrice/Abraxos XAI reasoning pipeline.

```
VELARIS REASONING STEP: Answer | Detail: Pipeline step: answer | Step ID: answer | Part of the Abraxos cognitive flow on the Reasoning page.
```

---

## [REASONING] Reasoning Section — Overview
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Abraxos cognition — how questions become explainable answers.

```
VELARIS REASONING SECTION: Overview | Description: Abraxos cognition — how questions become explainable answers. | Route: /reasoning?focus=overview
```

---

## [REASONING] Reasoning Section — Evidence Weaver
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 169

**Logic:** Evidence orchestration layer organizing intent, entities, sources and catalog.

```
VELARIS REASONING SECTION: Evidence Weaver | Description: Evidence orchestration layer organizing intent, entities, sources and catalog. | Route: /reasoning?focus=weaver
```

---

## [REASONING] Reasoning Section — Abraxos Skills
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Fifteen automatic skills activated without manual slash commands.

```
VELARIS REASONING SECTION: Abraxos Skills | Description: Fifteen automatic skills activated without manual slash commands. | Route: /reasoning?focus=skills
```

---

## [REASONING] Reasoning Section — Oracle Commands
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 160

**Logic:** Twelve user-triggered operational and investigative slash commands.

```
VELARIS REASONING SECTION: Oracle Commands | Description: Twelve user-triggered operational and investigative slash commands. | Route: /reasoning?focus=commands
```

---

## [REASONING] Reasoning Section — Verifiable Pipeline
**Source:** `ReasoningPage.tsx`  **Status:** Stable  **Chars:** 167

**Logic:** Nine verifiable stages from query ingestion to confidence calibration.

```
VELARIS REASONING SECTION: Verifiable Pipeline | Description: Nine verifiable stages from query ingestion to confidence calibration. | Route: /reasoning?focus=pipeline
```

---

## [REASONING] Evidence Weaver
**Source:** `src/i18n/pages/reasoningPage.ts`  **Status:** Stable  **Chars:** 372

**Logic:** Evidence orchestration before LLM composition.

**Aetheris Insight:** The Weaver organizes available knowledge; Abraxos interprets it; the Pipeline proves the path.

```
VELARIS REASONING: Evidence Weaver (Tecelã de Evidências) | The cognitive layer that organizes intent, entities, sources, catalog, patterns, tokens and decisions before the final answer. It does not retrieve knowledge or produce the answer: it structures context, assesses evidence quality and coverage, and prepares the foundation for Abraxos to reason with traceability.
```

---

## [AUTOMATIC_SKILL] Component Fit Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 810

**Structure:** Ativação automática

**Logic:** Analisa se um componente é adequado para o contexto descrito pelo usuário.

**Context Of Use:** O usuário pergunta qual componente usar, compara padrões ou descreve um cenário de interface.

**When To Use:** Devo usar Alert ou Toast para este feedback?

**Trade Offs:** Component Misuse Detection, Accessibility & Interaction Guardrail, Component Trade-off Analysis

**Aetheris Insight:** Exibida como habilidade aplicada por Abraxos, com motivo, confiança e intensidade.

```
VELARIS BEATRICE CAPABILITY: Component Fit Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Analisa se um componente é adequado para o contexto descrito pelo usuário. | Activation: O usuário pergunta qual componente usar, compara padrões ou descreve um cenário de interface. | Example: Devo usar Alert ou Toast para este feedback? | Expected output: Recomendação do componente, justificativa, estados necessários e riscos de uso inadequado. | Can com...
```

---

## [AUTOMATIC_SKILL] Component Misuse Detection
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 796

**Structure:** Ativação automática

**Logic:** Detecta usos que quebram a finalidade, a persistência ou o contrato de interação de um componente.

**Context Of Use:** O usuário propõe usar um componente fora de sua função ou em um contexto de risco.

**When To Use:** Vou usar Toast para um erro que bloqueia o fluxo.

**Trade Offs:** Component Fit Analysis, Accessibility & Interaction Guardrail, Governance Readiness Check

**Aetheris Insight:** Registrada como guardrail automático; não existe comando manual equivalente.

```
VELARIS BEATRICE CAPABILITY: Component Misuse Detection | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Detecta usos que quebram a finalidade, a persistência ou o contrato de interação de um componente. | Activation: O usuário propõe usar um componente fora de sua função ou em um contexto de risco. | Example: Vou usar Toast para um erro que bloqueia o fluxo. | Expected output: Risco identificado, explicação do mau uso, alternativa segura e confiança cali...
```

---

## [AUTOMATIC_SKILL] Design-to-Code Contract Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 843

**Structure:** Ativação automática

**Logic:** Verifica coerência entre design, documentação, props, snippets, estados, tokens e implementação.

**Context Of Use:** A pergunta compara documentação e código ou questiona se uma variação ou estado realmente existe.

**When To Use:** O estado disabled do Button está coerente com a documentação?

**Trade Offs:** Governance Readiness Check, Design System Architecture Analysis, Implementation & Migration Planning

**Aetheris Insight:** A evidência ausente e as divergências encontradas aparecem explicitamente.

```
VELARIS BEATRICE CAPABILITY: Design-to-Code Contract Check | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Verifica coerência entre design, documentação, props, snippets, estados, tokens e implementação. | Activation: A pergunta compara documentação e código ou questiona se uma variação ou estado realmente existe. | Example: O estado disabled do Button está coerente com a documentação? | Expected output: Gaps de contrato, estados ausentes, divergências e...
```

---

## [AUTOMATIC_SKILL] Token Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 770

**Structure:** Ativação automática

**Logic:** Rastreia como uma alteração de token afeta aliases, componentes, estados e acessibilidade.

**Context Of Use:** O usuário pergunta o que muda ao alterar um token ou quais superfícies dependem dele.

**When To Use:** O que acontece se eu mudar primary-200?

**Trade Offs:** Cross-System Impact Analysis, Design System Risk Assessment, Governance Readiness Check

**Aetheris Insight:** Separa dependências observadas de impactos inferidos e calibra a confiança.

```
VELARIS BEATRICE CAPABILITY: Token Impact Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Rastreia como uma alteração de token afeta aliases, componentes, estados e acessibilidade. | Activation: O usuário pergunta o que muda ao alterar um token ou quais superfícies dependem dele. | Example: O que acontece se eu mudar primary-200? | Expected output: Dependências, componentes e estados afetados, riscos e validações necessárias. | Can combine with:...
```

---

## [AUTOMATIC_SKILL] Accessibility & Interaction Guardrail
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 841

**Structure:** Ativação automática

**Logic:** Aplica guardrails de clareza, foco, teclado, contraste, estados e prevenção de erro.

**Context Of Use:** A pergunta envolve interação, acessibilidade, conteúdo obrigatório, erro, loading ou disabled.

**When To Use:** Posso colocar informação obrigatória dentro de um Tooltip?

**Trade Offs:** Component Misuse Detection, Component Fit Analysis, Design System Risk Assessment

**Aetheris Insight:** Aparece como habilidade aplicada automaticamente por sinais de interação ou acessibilidade.

```
VELARIS BEATRICE CAPABILITY: Accessibility & Interaction Guardrail | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Aplica guardrails de clareza, foco, teclado, contraste, estados e prevenção de erro. | Activation: A pergunta envolve interação, acessibilidade, conteúdo obrigatório, erro, loading ou disabled. | Example: Posso colocar informação obrigatória dentro de um Tooltip? | Expected output: Riscos de interação e acessibilidade, guardrails violados e ...
```

---

## [AUTOMATIC_SKILL] Governance Readiness Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 795

**Structure:** Ativação automática

**Logic:** Avalia se uma proposta está pronta para entrar, evoluir ou divergir do design system.

**Context Of Use:** O usuário propõe uma nova variação, padrão, token ou mudança com impacto de governança.

**When To Use:** Essa variação está pronta para entrar no Velaris?

**Trade Offs:** Design-to-Code Contract Check, Cross-System Impact Analysis, Design System Risk Assessment

**Aetheris Insight:** O motivo de ativação e as condições de aprovação ficam registrados.

```
VELARIS BEATRICE CAPABILITY: Governance Readiness Check | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Avalia se uma proposta está pronta para entrar, evoluir ou divergir do design system. | Activation: O usuário propõe uma nova variação, padrão, token ou mudança com impacto de governança. | Example: Essa variação está pronta para entrar no Velaris? | Expected output: Veredito de prontidão, gaps de consistência, documentação, ownership e versionamento. ...
```

---

## [AUTOMATIC_SKILL] Pattern & State Exploration
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 785

**Structure:** Ativação automática

**Logic:** Transforma uma necessidade ambígua em opções concretas de componente, estado ou padrão.

**Context Of Use:** O usuário descreve um problema de interface sem saber qual abordagem do design system aplicar.

**When To Use:** Como mostrar uma decisão que ainda está em revisão?

**Trade Offs:** Component Fit Analysis, Component Trade-off Analysis, Cross-System Impact Analysis

**Aetheris Insight:** Exibe a ambiguidade detectada, as opções consideradas e a confiança da recomendação.

```
VELARIS BEATRICE CAPABILITY: Pattern & State Exploration | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Transforma uma necessidade ambígua em opções concretas de componente, estado ou padrão. | Activation: O usuário descreve um problema de interface sem saber qual abordagem do design system aplicar. | Example: Como mostrar uma decisão que ainda está em revisão? | Expected output: Duas ou três opções fundamentadas, condições de uso e recomendação inicial...
```

---

## [AUTOMATIC_SKILL] Design System Architecture Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 824

**Structure:** Ativação automática

**Logic:** Avalia camadas, contratos, acoplamento e efeitos estruturais de uma mudança no design system.

**Context Of Use:** A pergunta envolve arquitetura, refatoração, pacotes, dependências ou limites entre camadas.

**When To Use:** Como separar o contrato deste componente entre core e adapters?

**Trade Offs:** Implementation & Migration Planning, Cross-System Impact Analysis, Design System Risk Assessment

**Aetheris Insight:** Registra os sinais estruturais que levaram à ativação automática.

```
VELARIS BEATRICE CAPABILITY: Design System Architecture Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Avalia camadas, contratos, acoplamento e efeitos estruturais de uma mudança no design system. | Activation: A pergunta envolve arquitetura, refatoração, pacotes, dependências ou limites entre camadas. | Example: Como separar o contrato deste componente entre core e adapters? | Expected output: Fronteiras afetadas, dependências, riscos estrutur...
```

---

## [AUTOMATIC_SKILL] Implementation & Migration Planning
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 727

**Structure:** Ativação automática

**Logic:** Organiza implementação, migração e rollout em etapas verificáveis.

**Context Of Use:** O usuário pede para implementar, migrar, integrar ou planejar uma mudança.

**When To Use:** Planeje a migração do LegacyDrawer.

**Trade Offs:** Design System Architecture Analysis, Governance Readiness Check, Design System Risk Assessment

**Aetheris Insight:** Expõe dependências, premissas e riscos que orientaram o plano.

```
VELARIS BEATRICE CAPABILITY: Implementation & Migration Planning | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Organiza implementação, migração e rollout em etapas verificáveis. | Activation: O usuário pede para implementar, migrar, integrar ou planejar uma mudança. | Example: Planeje a migração do LegacyDrawer. | Expected output: Etapas ordenadas, dependências, critérios de validação e rollback. | Can combine with: Design System Architecture Analysis,...
```

---

## [AUTOMATIC_SKILL] Component & Pattern Trade-off Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 766

**Structure:** Ativação automática

**Logic:** Compara alternativas de componente ou padrão usando critérios de UX, código e governança.

**Context Of Use:** O usuário compara soluções ou descreve uma decisão com custos relevantes.

**When To Use:** Compare Tabs e Accordion para esta tela densa.

**Trade Offs:** Component Fit Analysis, Cross-System Impact Analysis, Design System Risk Assessment

**Aetheris Insight:** Mantém visíveis os critérios e a condição que mudaria a recomendação.

```
VELARIS BEATRICE CAPABILITY: Component & Pattern Trade-off Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Compara alternativas de componente ou padrão usando critérios de UX, código e governança. | Activation: O usuário compara soluções ou descreve uma decisão com custos relevantes. | Example: Compare Tabs e Accordion para esta tela densa. | Expected output: Critérios, benefícios, riscos, condições de escolha e recomendação diretiva. | Can comb...
```

---

## [AUTOMATIC_SKILL] Cross-System Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 772

**Structure:** Ativação automática

**Logic:** Mapeia efeitos indiretos entre componentes, tokens, documentação, fluxos e governança.

**Context Of Use:** Uma mudança local pode se propagar por várias entidades ou camadas do sistema.

**When To Use:** Como a mudança no token de focus se propaga pelo Velaris?

**Trade Offs:** Token Impact Analysis, Governance Readiness Check, Design System Risk Assessment

**Aetheris Insight:** Indica quais relações foram observadas e quais impactos são inferências.

```
VELARIS BEATRICE CAPABILITY: Cross-System Impact Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Mapeia efeitos indiretos entre componentes, tokens, documentação, fluxos e governança. | Activation: Uma mudança local pode se propagar por várias entidades ou camadas do sistema. | Example: Como a mudança no token de focus se propaga pelo Velaris? | Expected output: Mapa de dependências, impactos de segunda ordem e superfícies que exigem revisão. | ...
```

---

## [AUTOMATIC_SKILL] Design System Risk Assessment
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 778

**Structure:** Ativação automática

**Logic:** Identifica regressões, dívida, edge cases e riscos de acessibilidade ou governança.

**Context Of Use:** A decisão pode quebrar contratos, reduzir segurança ou introduzir incerteza relevante.

**When To Use:** O que pode quebrar se removermos este estado de confirmação?

**Trade Offs:** Qualquer habilidade automática, especialmente guardrails, arquitetura e governança

**Aetheris Insight:** Exibe os sinais de risco, a confiança e os critérios usados na priorização.

```
VELARIS BEATRICE CAPABILITY: Design System Risk Assessment | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Identifica regressões, dívida, edge cases e riscos de acessibilidade ou governança. | Activation: A decisão pode quebrar contratos, reduzir segurança ou introduzir incerteza relevante. | Example: O que pode quebrar se removermos este estado de confirmação? | Expected output: Riscos priorizados, severidade, mitigação e critérios de teste. | Can combi...
```

---

## [AUTOMATIC_SKILL] Feedback Insight Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 888

**Structure:** Ativação automática

**Logic:** Analisa feedbacks, outcomes e sinais qualitativos de uso sem prometer treinamento automático.

**Context Of Use:** O usuário cola feedbacks, comentários de PR, mensagens de Slack, notas de reunião ou pergunta como transformar feedback em melhoria.

**When To Use:** O time reclama que o Form Field é confuso em fluxos multi etapa. O que melhorar?

**Trade Offs:** Governance Readiness Check, Adoption Friction Detection, Design-to-Code Contract Check

**Aetheris Insight:** Hipóteses são rotuladas e nenhuma atualização automática do agente é prometida.

```
VELARIS BEATRICE CAPABILITY: Feedback Insight Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Analisa feedbacks, outcomes e sinais qualitativos de uso sem prometer treinamento automático. | Activation: O usuário cola feedbacks, comentários de PR, mensagens de Slack, notas de reunião ou pergunta como transformar feedback em melhoria. | Example: O time reclama que o Form Field é confuso em fluxos multi etapa. O que melhorar? | Expected output: Pad...
```

---

## [AUTOMATIC_SKILL] Adoption Friction Detection
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 839

**Structure:** Ativação automática

**Logic:** Diagnostica por que um componente, token ou padrão não está sendo adotado corretamente.

**Context Of Use:** O usuário menciona baixa adoção, resistência do time, uso incorreto recorrente, workarounds ou abandono de padrões.

**When To Use:** Por que os times evitam o componente Table e criam tabelas próprias?

**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check, Feedback Insight Analysis

**Aetheris Insight:** Separa sinais observados de hipóteses e apresenta o nível de confiança.

```
VELARIS BEATRICE CAPABILITY: Adoption Friction Detection | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Diagnostica por que um componente, token ou padrão não está sendo adotado corretamente. | Activation: O usuário menciona baixa adoção, resistência do time, uso incorreto recorrente, workarounds ou abandono de padrões. | Example: Por que os times evitam o componente Table e criam tabelas próprias? | Expected output: Fricção de descoberta, documentação,...
```

---

## [AUTOMATIC_SKILL] Governance Impact Analysis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 821

**Structure:** Ativação automática

**Logic:** Avalia impacto sistêmico e organizacional de mudanças propostas no design system.

**Context Of Use:** O usuário propõe alterar, remover, unir, renomear, substituir ou deprecar componentes, tokens, padrões ou documentação canónica.

**When To Use:** Qual o impacto de substituir todos os Modals por Drawers?

**Trade Offs:** Cross-System Impact Analysis, Token Impact Analysis, Implementation & Migration Planning

**Aetheris Insight:** Diferencia impactos diretos de efeitos em cascata inferidos.

```
VELARIS BEATRICE CAPABILITY: Governance Impact Analysis | Type: Ativação automática | Command: automatic | Canonical command: none | Description: Avalia impacto sistêmico e organizacional de mudanças propostas no design system. | Activation: O usuário propõe alterar, remover, unir, renomear, substituir ou deprecar componentes, tokens, padrões ou documentação canónica. | Example: Qual o impacto de substituir todos os Modals por Drawers? | Expected output: Dependências, riscos de breaking change, ...
```

---

## [ORACLE_COMMAND] Enforce
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 742

**Structure:** Ação operacional

**Logic:** Valida JSX/TSX contra o Velaris: contrato de componente, tokens, acessibilidade, estados e violações de uso.

**Context Of Use:** Quando o usuário quer verificar se um trecho de código respeita o Velaris.

**When To Use:** /enforce <Button intent="negative">Excluir análise</Button>

**Trade Offs:** Design-to-Code Contract Check, Accessibility & Interaction Guardrail

**Aetheris Insight:** Relaciona cada violação ao código observado, à evidência e à confiança.

```
VELARIS BEATRICE CAPABILITY: Enforce | Type: Ação operacional | Command: /enforce | Canonical command: /enforce | Description: Valida JSX/TSX contra o Velaris: contrato de componente, tokens, acessibilidade, estados e violações de uso. | Activation: Quando o usuário quer verificar se um trecho de código respeita o Velaris. | Example: /enforce <Button intent="negative">Excluir análise</Button> | Expected output: Violações, correções sugeridas, gaps de contrato e etapas de validação. | Can combine...
```

---

## [ORACLE_COMMAND] Migrate
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 734

**Structure:** Ação operacional

**Logic:** Orienta migração de componente ou padrão legado: destino recomendado, before/after, etapas, riscos e testes.

**Context Of Use:** Quando o usuário precisa de before/after, riscos, etapas e validações de migração.

**When To Use:** /migrate notification → Toast/Notification

**Trade Offs:** Implementation & Migration Planning, Design System Architecture Analysis

**Aetheris Insight:** Expõe premissas, dependências, fontes e confiança da migração.

```
VELARIS BEATRICE CAPABILITY: Migrate | Type: Ação operacional | Command: /migrate | Canonical command: /migrate | Description: Orienta migração de componente ou padrão legado: destino recomendado, before/after, etapas, riscos e testes. | Activation: Quando o usuário precisa de before/after, riscos, etapas e validações de migração. | Example: /migrate notification → Toast/Notification | Expected output: Destino recomendado, antes/depois, sequência de migração, riscos e testes. | Can combine with:...
```

---

## [ORACLE_COMMAND] Capture
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 749

**Structure:** Ação operacional

**Logic:** Converte discussões informais em conhecimento estruturado: decisões, trade-offs, exceções, gaps e próximos passos.

**Context Of Use:** Quando há conteúdo de PR, Slack, RFC, reunião ou decisão de produto para capturar.

**When To Use:** /capture [cole discussão de PR sobre Form Field em fluxos multi-etapa]

**Trade Offs:** Governance Readiness Check, Organizational Memory

**Aetheris Insight:** Preserva o tipo de fonte, o conteúdo bruto e o status de validação.

```
VELARIS BEATRICE CAPABILITY: Capture | Type: Ação operacional | Command: /capture | Canonical command: /capture | Description: Converte discussões informais em conhecimento estruturado: decisões, trade-offs, exceções, gaps e próximos passos. | Activation: Quando há conteúdo de PR, Slack, RFC, reunião ou decisão de produto para capturar. | Example: /capture [cole discussão de PR sobre Form Field em fluxos multi-etapa] | Expected output: Decisões, padrões, trade-offs, exceções, conexões e gaps de ...
```

---

## [ORACLE_COMMAND] Organizational Memory
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 817

**Structure:** Modo investigativo

**Logic:** Recupera memória institucional ampla: decisões passadas, padrões recorrentes, exceções, usos anteriores e contexto acumulado.

**Context Of Use:** Quando o usuário precisa saber o que o Velaris já decidiu ou aprendeu sobre um tema.

**When To Use:** /memory O que já foi decidido sobre Modal/Dialog em ações destrutivas?

**Trade Offs:** Pattern & State Exploration, Governance Readiness Check

**Aetheris Insight:** O alias, o engine canônico, as fontes e o contrato de resposta ficam registrados.

```
VELARIS BEATRICE CAPABILITY: Organizational Memory | Type: Modo investigativo | Command: /memory | Canonical command: /organizational-memory | Description: Recupera memória institucional ampla: decisões passadas, padrões recorrentes, exceções, usos anteriores e contexto acumulado. | Activation: Quando o usuário precisa saber o que o Velaris já decidiu ou aprendeu sobre um tema. | Example: /memory O que já foi decidido sobre Modal/Dialog em ações destrutivas? | Expected output: Abordagens recorre...
```

---

## [ORACLE_COMMAND] Decision Archaeology
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 836

**Structure:** Modo investigativo

**Logic:** Reconstrói uma decisão específica: problema, alternativas consideradas, critério escolhido, trade-offs e consequências.

**Context Of Use:** Quando o usuário precisa entender por que um componente, padrão ou token foi escolhido.

**When To Use:** /decision Por que usamos Toast em vez de Alert para confirmação de salvamento?

**Trade Offs:** Component & Pattern Trade-off Analysis, Design System Architecture Analysis

**Aetheris Insight:** Separa fatos registrados de inferências e explicita evidências ausentes.

```
VELARIS BEATRICE CAPABILITY: Decision Archaeology | Type: Modo investigativo | Command: /decision | Canonical command: /decision-archaeology | Description: Reconstrói uma decisão específica: problema, alternativas consideradas, critério escolhido, trade-offs e consequências. | Activation: Quando o usuário precisa entender por que um componente, padrão ou token foi escolhido. | Example: /decision Por que usamos Toast em vez de Alert para confirmação de salvamento? | Expected output: Problema, alt...
```

---

## [ORACLE_COMMAND] Perspective Synthesis
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 826

**Structure:** Modo investigativo

**Logic:** Analisa a questão por múltiplas perspectivas profissionais, expondo consensos, conflitos e recomendação final.

**Context Of Use:** Quando a decisão exige conciliar objetivos e riscos de diferentes perfis profissionais.

**When To Use:** /perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA.

**Trade Offs:** Component & Pattern Trade-off Analysis, Design System Risk Assessment

**Aetheris Insight:** Mantém visíveis as divergências e o critério usado para consolidar a decisão.

```
VELARIS BEATRICE CAPABILITY: Perspective Synthesis | Type: Modo investigativo | Command: /perspectives | Canonical command: /perspective-synthesis | Description: Analisa a questão por múltiplas perspectivas profissionais, expondo consensos, conflitos e recomendação final. | Activation: Quando a decisão exige conciliar objetivos e riscos de diferentes perfis profissionais. | Example: /perspectives Tabs ou Card para organizar o catálogo? Compare design, frontend e QA. | Expected output: Perspectiv...
```

---

## [ORACLE_COMMAND] Document
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 704

**Structure:** Ação operacional

**Logic:** Gera documentação publicável a partir de conhecimento validado: uso, não uso, contrato, exemplos, acessibilidade e histórico.

**Context Of Use:** Quando o usuário quer documentar um componente, padrão, token ou decisão.

**When To Use:** /document ConfidenceMeter

**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check

**Aetheris Insight:** Seções sem suporte são marcadas para revisão manual.

```
VELARIS BEATRICE CAPABILITY: Document | Type: Ação operacional | Command: /document | Canonical command: /document | Description: Gera documentação publicável a partir de conhecimento validado: uso, não uso, contrato, exemplos, acessibilidade e histórico. | Activation: Quando o usuário quer documentar um componente, padrão, token ou decisão. | Example: /document ConfidenceMeter | Expected output: Uso, não uso, contrato, exemplos, trade-offs, histórico e status de evidência. | Can combine with: G...
```

---

## [ORACLE_COMMAND] Token Impact Report
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 709

**Structure:** Ação operacional

**Logic:** Analisa impacto de alteração de token: aliases, consumidores, contraste, temas, riscos e plano de migração.

**Context Of Use:** Quando o usuário precisa de aliases, consumidores, riscos e plano de migração.

**When To Use:** /token-impact radius-md

**Trade Offs:** Token Impact Analysis, Cross-System Impact Analysis

**Aetheris Insight:** Distingue dependências observadas de propagação inferida.

```
VELARIS BEATRICE CAPABILITY: Token Impact Report | Type: Ação operacional | Command: /token-impact | Canonical command: /token-impact | Description: Analisa impacto de alteração de token: aliases, consumidores, contraste, temas, riscos e plano de migração. | Activation: Quando o usuário precisa de aliases, consumidores, riscos e plano de migração. | Example: /token-impact radius-md | Expected output: Aliases, componentes, estados, acessibilidade, impacto visual e migração. | Can combine with: To...
```

---

## [ORACLE_COMMAND] Contract Check
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 747

**Structure:** Ação operacional

**Logic:** Verifica paridade entre design, documentação e implementação: props, estados, tokens, acessibilidade e divergências.

**Context Of Use:** Quando o usuário precisa validar um componente ou estado sem fornecer código completo.

**When To Use:** /contract-check Input disabled state

**Trade Offs:** Design-to-Code Contract Check, Governance Readiness Check

**Aetheris Insight:** A ausência de evidência de implementação é reportada explicitamente.

```
VELARIS BEATRICE CAPABILITY: Contract Check | Type: Ação operacional | Command: /contract-check | Canonical command: /contract-check | Description: Verifica paridade entre design, documentação e implementação: props, estados, tokens, acessibilidade e divergências. | Activation: Quando o usuário precisa validar um componente ou estado sem fornecer código completo. | Example: /contract-check Input disabled state | Expected output: Props, estados, tokens, gaps de documentação, divergências e correç...
```

---

## [ORACLE_COMMAND] Knowledge Gap
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 736

**Structure:** Modo investigativo

**Logic:** Mapeia documentação ausente, cobertura fraca, inconsistências e prioridades de melhoria do corpus ou catálogo.

**Context Of Use:** Quando o usuário precisa descobrir o que ainda não está documentado.

**When To Use:** /knowledge-gap acessibilidade em formulários

**Trade Offs:** Governance Readiness Check, Design-to-Code Contract Check

**Aetheris Insight:** Usa métricas de cobertura e consistência para sustentar o diagnóstico.

```
VELARIS BEATRICE CAPABILITY: Knowledge Gap | Type: Modo investigativo | Command: /knowledge-gap | Canonical command: /knowledge-gap | Description: Mapeia documentação ausente, cobertura fraca, inconsistências e prioridades de melhoria do corpus ou catálogo. | Activation: Quando o usuário precisa descobrir o que ainda não está documentado. | Example: /knowledge-gap acessibilidade em formulários | Expected output: Cobertura atual, lacunas, impacto e backlog priorizado de documentação. | Can combin...
```

---

## [ORACLE_COMMAND] Explainability Audit
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 789

**Structure:** Modo investigativo

**Logic:** Audita uma recomendação do Abraxos: fontes, evidências, lacunas, suposições, confiança e risco de alucinação.

**Context Of Use:** Quando o usuário quer verificar a sustentação e os limites de uma recomendação.

**When To Use:** /audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge.

**Trade Offs:** Qualquer habilidade automática aplicada à recomendação auditada

**Aetheris Insight:** Scores e limites são derivados de métricas registradas, nunca inventados.

```
VELARIS BEATRICE CAPABILITY: Explainability Audit | Type: Modo investigativo | Command: /audit | Canonical command: /explainability-audit | Description: Audita uma recomendação do Abraxos: fontes, evidências, lacunas, suposições, confiança e risco de alucinação. | Activation: Quando o usuário quer verificar a sustentação e os limites de uma recomendação. | Example: /audit Audite fontes, lacunas e confiança desta recomendação de Confidence Badge. | Expected output: Scores, fontes, evidências, lac...
```

---

## [ORACLE_COMMAND] Simulate
**Source:** `beatrice/domain/governance/capabilities.ts`  **Status:** Stable  **Chars:** 950

**Structure:** Modo investigativo

**Logic:** Projeta consequências antes de implementar: dependências, riscos, impacto sistêmico, cenários, conflito entre princípios e veredito.

**Context Of Use:** Quando o usuário precisa entender o impacto potencial antes de remover, substituir, descontinuar ou migrar algo.

**When To Use:** /simulate trocar Alert por Toast em erros de Form Field

**Trade Offs:** Governance Impact Analysis, Decision Archaeology, Token Impact Report, Contract Check, Knowledge Gap

**Aetheris Insight:** Não executa mudanças nem cria decisões; diferencia evidência recuperada de projeções inferidas.

```
VELARIS BEATRICE CAPABILITY: Simulate | Type: Modo investigativo | Command: /simulate | Canonical command: /simulate | Description: Projeta consequências antes de implementar: dependências, riscos, impacto sistêmico, cenários, conflito entre princípios e veredito. | Activation: Quando o usuário precisa entender o impacto potencial antes de remover, substituir, descontinuar ou migrar algo. | Example: /simulate trocar Alert por Toast em erros de Form Field | Expected output: Entidades afetadas, de...
```

---

## [PERSPECTIVE] Velaris Professional Perspectives
**Source:** `PerspectivesPage.tsx`  **Status:** Stable  **Chars:** 335

**Logic:** Multi-stakeholder analysis through calibrated professional lenses.

**Context Of Use:** Perspective synthesis, Oracle Council, retrieval weighting.

```
VELARIS PERSPECTIVE: Professional Perspectives | Abraxos adapts depth, vocabulary and risk sensitivity through professional lenses. Route: /perspectives. Sections: identity gallery and cognition instrumentation. Eight professional perspectives: dev, designer, product_designer, design_system_manager, qa, tech_writer, a11y, maintainer.
```

---

## [PERSPECTIVE] Perspective — Developer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 502

**Logic:** Keep implementation patterns modular, scalable, testable and isolated across product surfaces.

**Context Of Use:** Implementation, code architecture, TypeScript, components, state, integration, performance and reuse.

**When To Use:** Use the dev perspective for implementation, architecture and contracts.

```
VELARIS PERSPECTIVE: Developer (dev) | Specialty: Implementation, code architecture, TypeScript, components, state, integration, performance and reuse. | Primary responsibility: Keep implementation patterns modular, scalable, testable and isolated across product surfaces. | Primary pain: Fragile, coupled systems that cannot scale without regression chains. | Use the dev perspective for implementation, architecture and contracts. | Abraxos adjusts retrieval weights and response depth for this len...
```

---

## [PERSPECTIVE] Perspective — Designer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 488

**Logic:** Protect visual quality and aesthetic consistency across product interfaces.

**Context Of Use:** Visual composition, hierarchy, tokens, spacing, typography, color and interface consistency.

**When To Use:** Use the designer perspective for visual hierarchy, tokens and composition.

```
VELARIS PERSPECTIVE: Designer (designer) | Specialty: Visual composition, hierarchy, tokens, spacing, typography, color and interface consistency. | Primary responsibility: Protect visual quality and aesthetic consistency across product interfaces. | Primary pain: Inconsistent interfaces and visual overload destroying cognitive efficiency. | Use the designer perspective for visual hierarchy, tokens and composition. | Abraxos adjusts retrieval weights and response depth for this lens.
```

---

## [PERSPECTIVE] Perspective — Product Designer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 506

**Logic:** Evaluate whether interface solutions are coherent, usable and supported by evidence about user needs.

**Context Of Use:** Interface design, user experience and research-informed validation.

**When To Use:** Use the product_designer perspective for usability and flow validation.

```
VELARIS PERSPECTIVE: Product Designer (product_designer) | Specialty: Interface design, user experience and research-informed validation. | Primary responsibility: Evaluate whether interface solutions are coherent, usable and supported by evidence about user needs. | Primary pain: Polished interface decisions that ignore context of use, friction or validation. | Use the product_designer perspective for usability and flow validation. | Abraxos adjusts retrieval weights and response depth for this...
```

---

## [PERSPECTIVE] Perspective — Design System Manager
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 509

**Logic:** Decide what the design system should prioritize, govern and scale across teams.

**Context Of Use:** Design-system strategy, governance, adoption, roadmap and organizational impact.

**When To Use:** Use the design_system_manager perspective for governance and adoption.

```
VELARIS PERSPECTIVE: Design System Manager (design_system_manager) | Specialty: Design-system strategy, governance, adoption, roadmap and organizational impact. | Primary responsibility: Decide what the design system should prioritize, govern and scale across teams. | Primary pain: A design system without adoption, roadmap clarity or consistent exception criteria. | Use the design_system_manager perspective for governance and adoption. | Abraxos adjusts retrieval weights and response depth for t...
```

---

## [PERSPECTIVE] Perspective — QA
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 456

**Logic:** Expose failure states, edge cases and release risks before they reach production.

**Context Of Use:** Acceptance criteria, test scenarios, regression, edge cases, error states and validation.

**When To Use:** Use the qa perspective for edge cases, regression and release risk.

```
VELARIS PERSPECTIVE: QA (qa) | Specialty: Acceptance criteria, test scenarios, regression, edge cases, error states and validation. | Primary responsibility: Expose failure states, edge cases and release risks before they reach production. | Primary pain: Invisible failures reaching production without traceability. | Use the qa perspective for edge cases, regression and release risk. | Abraxos adjusts retrieval weights and response depth for this lens.
```

---

## [PERSPECTIVE] Perspective — Tech Writer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 509

**Logic:** Turn design-system rationale into discoverable, teachable and canonical knowledge.

**Context Of Use:** Documentation, naming, examples, microcopy, terminology and actionable instructions.

**When To Use:** Use the tech_writer perspective for technical documentation, naming and microcopy.

```
VELARIS PERSPECTIVE: Tech Writer (tech_writer) | Specialty: Documentation, naming, examples, microcopy, terminology and actionable instructions. | Primary responsibility: Turn design-system rationale into discoverable, teachable and canonical knowledge. | Primary pain: Users not understanding the system and depending on other people for interpretation. | Use the tech_writer perspective for technical documentation, naming and microcopy. | Abraxos adjusts retrieval weights and response depth for t...
```

---

## [PERSPECTIVE] Perspective — Accessibility Specialist
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 531

**Logic:** Ensure the system is usable through every input modality and every cognitive load profile.

**Context Of Use:** WCAG, focus, keyboard, ARIA, screen readers, contrast, accessible states and inclusion.

**When To Use:** Use the a11y perspective to review accessibility, WCAG, keyboard, focus and contrast.

```
VELARIS PERSPECTIVE: Accessibility Specialist (a11y) | Specialty: WCAG, focus, keyboard, ARIA, screen readers, contrast, accessible states and inclusion. | Primary responsibility: Ensure the system is usable through every input modality and every cognitive load profile. | Primary pain: Accessibility bolted on after design, treated as a checklist rather than a foundation. | Use the a11y perspective to review accessibility, WCAG, keyboard, focus and contrast. | Abraxos adjusts retrieval weights an...
```

---

## [PERSPECTIVE] Perspective — Maintainer
**Source:** `src/beatrice/domain/perspective/lenses.ts`  **Status:** Stable  **Chars:** 486

**Logic:** Keep implementation simple to change, reuse and operate over time.

**Context Of Use:** Maintenance, simplicity, reuse, technical debt, coupling, duplication and evolution cost.

**When To Use:** Use the maintainer perspective for maintenance cost and technical debt.

```
VELARIS PERSPECTIVE: Maintainer (maintainer) | Specialty: Maintenance, simplicity, reuse, technical debt, coupling, duplication and evolution cost. | Primary responsibility: Keep implementation simple to change, reuse and operate over time. | Primary pain: Local complexity accumulating into coupling, duplication and expensive future change. | Use the maintainer perspective for maintenance cost and technical debt. | Abraxos adjusts retrieval weights and response depth for this lens.
```

---

## [COGNITION] Perspective Cognition Instrumentation
**Source:** `PerspectivesCognitionSection.tsx`  **Status:** Stable  **Chars:** 352

**Logic:** Lens instrumentation controls how Abraxos thinks per perspective.

**Context Of Use:** Perspective trials, cognitive radar, calibration sliders.

```
VELARIS COGNITION: Perspective Cognition Instrumentation | The cognition section on /perspectives?focus=cognition lets maintainers calibrate depth, technicality and risk sensitivity per professional lens. Calibration persists per lens and flows to /api/chat as payload fields. Abraxos uses calibration to adapt response depth and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — designer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 209

**Logic:** Default calibration for the designer lens.

```
VELARIS COGNITION: designer calibration | Depth: medium | Technicality: 0.35 | Risk sensitivity: 0.55 | Trust style: qualitative | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — product_designer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 216

**Logic:** Default calibration for the product_designer lens.

```
VELARIS COGNITION: product_designer calibration | Depth: medium | Technicality: 0.4 | Risk sensitivity: 0.65 | Trust style: qualitative | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — dev
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 200

**Logic:** Default calibration for the dev lens.

```
VELARIS COGNITION: dev calibration | Depth: high | Technicality: 0.9 | Risk sensitivity: 0.65 | Trust style: quantified | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — design_system_manager
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 220

**Logic:** Default calibration for the design_system_manager lens.

```
VELARIS COGNITION: design_system_manager calibration | Depth: medium | Technicality: 0.3 | Risk sensitivity: 0.5 | Trust style: comparative | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — qa
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 199

**Logic:** Default calibration for the qa lens.

```
VELARIS COGNITION: qa calibration | Depth: high | Technicality: 0.7 | Risk sensitivity: 0.95 | Trust style: quantified | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — tech_writer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 209

**Logic:** Default calibration for the tech_writer lens.

```
VELARIS COGNITION: tech_writer calibration | Depth: high | Technicality: 0.45 | Risk sensitivity: 0.4 | Trust style: qualitative | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — a11y
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 201

**Logic:** Default calibration for the a11y lens.

```
VELARIS COGNITION: a11y calibration | Depth: high | Technicality: 0.75 | Risk sensitivity: 0.9 | Trust style: quantified | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [COGNITION] Cognition Calibration — maintainer
**Source:** `src/beatrice/domain/perspective/lensInstrumentation.ts`  **Status:** Stable  **Chars:** 208

**Logic:** Default calibration for the maintainer lens.

```
VELARIS COGNITION: maintainer calibration | Depth: high | Technicality: 0.55 | Risk sensitivity: 0.8 | Trust style: comparative | How this lens influences Abraxos response structure and evidence presentation.
```

---

## [SYSTEM_HEALTH] Overall Design System Health
**Source:** `SystemHealthSection.tsx`  **Status:** Mock UI data — not live API  **Chars:** 452

**Logic:** Consolidated maturity view across knowledge, catalog, RAG and governance dimensions.

**Aetheris Insight:** Mock scores pending integration with knowledge_health.py and reliability gates.

```
VELARIS SYSTEM HEALTH: Overall Design System Health | Reliability diagnostics for the Velaris ecosystem and the Abraxos agent. Route: /evaluation?focus=health (fifth section in Evaluation, not a primary menu item). Command: /health directs maintainers to this section. Overall mock score: 84% (evolving, improving). NOTE: Scores in the Evaluation UI are mock data; live diagnostics live at /knowledge-health (admin) and /api/health (RAG corpus status).
```

---

## [SYSTEM_HEALTH] RAG Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 88% — healthy  **Chars:** 345

**Logic:** Semantic retrieval, page_type relevance and indexed corpus coverage.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: RAG Health | What it measures: Semantic retrieval, page_type relevance and indexed corpus coverage. | Mock score: 88% (healthy) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Catalog Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 79% — attention  **Chars:** 369

**Logic:** Consistency between canonical catalog, metadata and component surface in the frontend.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Catalog Health | What it measures: Consistency between canonical catalog, metadata and component surface in the frontend. | Mock score: 79% (attention) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Source Attribution Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 91% — healthy  **Chars:** 362

**Logic:** Traceability between claims, retrieved chunks and explained decisions.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Source Attribution Health | What it measures: Traceability between claims, retrieved chunks and explained decisions. | Mock score: 91% (healthy) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Perspective Coverage
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 72% — attention  **Chars:** 351

**Logic:** Depth and parity of Abraxos's seven professional perspectives.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Perspective Coverage | What it measures: Depth and parity of Abraxos's seven professional perspectives. | Mock score: 72% (attention) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Response Validation
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 68% — evolving  **Chars:** 359

**Logic:** Validation gates, deduplication and integrity before the final response.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Response Validation | What it measures: Validation gates, deduplication and integrity before the final response. | Mock score: 68% (evolving) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Unknown Component Handling
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 86% — healthy  **Chars:** 381

**Logic:** Detection and containment of recommendations for nonexistent or uncatalogued components.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Unknown Component Handling | What it measures: Detection and containment of recommendations for nonexistent or uncatalogued components. | Mock score: 86% (healthy) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Confidence Calibration
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 74% — attention  **Chars:** 369

**Logic:** Alignment between displayed confidence and actual retrieved evidence strength.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Confidence Calibration | What it measures: Alignment between displayed confidence and actual retrieved evidence strength. | Mock score: 74% (attention) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Evidence Gaps
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 65% — critical  **Chars:** 348

**Logic:** Strong evidence gaps, undocumented trade-offs and orphan decisions.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Evidence Gaps | What it measures: Strong evidence gaps, undocumented trade-offs and orphan decisions. | Mock score: 65% (critical) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Governance Health
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 82% — evolving  **Chars:** 355

**Logic:** Governance alerts, duplications, orphan tokens and adoption readiness.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Governance Health | What it measures: Governance alerts, duplications, orphan tokens and adoption readiness. | Mock score: 82% (evolving) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] Accessibility Checks
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Mock 77% — attention  **Chars:** 362

**Logic:** Coverage of accessibility rules, focus states and contrast in components.

**Context Of Use:** Abraxos system reliability diagnostics for maintainers.

```
VELARIS SYSTEM HEALTH METRIC: Accessibility Checks | What it measures: Coverage of accessibility rules, focus states and contrast in components. | Mock score: 77% (attention) | Location: Evaluation page, section 5 — Health do Sistema (/evaluation?focus=health). Related command: /health. Data note: UI scores are mock; not wired to live Knowledge Health API yet.
```

---

## [SYSTEM_HEALTH] What Health Measures — knowledge
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 207

**Logic:** Whether design system knowledge is covered sufficiently to answer safely.

```
VELARIS SYSTEM HEALTH MEASURE: knowledge | Question answered: Whether design system knowledge is covered sufficiently to answer safely. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — rag
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 205

**Logic:** Whether RAG retrieves relevant sources for the intent and active perspective.

```
VELARIS SYSTEM HEALTH MEASURE: rag | Question answered: Whether RAG retrieves relevant sources for the intent and active perspective. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — catalog
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 214

**Logic:** Whether the canonical catalog is consistent with documentation and implementation.

```
VELARIS SYSTEM HEALTH MEASURE: catalog | Question answered: Whether the canonical catalog is consistent with documentation and implementation. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — hallucination
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 212

**Logic:** Whether Abraxos avoids recommending nonexistent or off-catalog components.

```
VELARIS SYSTEM HEALTH MEASURE: hallucination | Question answered: Whether Abraxos avoids recommending nonexistent or off-catalog components. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — perspectives
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 206

**Logic:** Whether professional perspectives have sufficient coverage and depth.

```
VELARIS SYSTEM HEALTH MEASURE: perspectives | Question answered: Whether professional perspectives have sufficient coverage and depth. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — traceability
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 214

**Logic:** Whether there is traceability between response, source and recorded decision.

```
VELARIS SYSTEM HEALTH MEASURE: traceability | Question answered: Whether there is traceability between response, source and recorded decision. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [SYSTEM_HEALTH] What Health Measures — confidence
**Source:** `src/i18n/pages/evaluationHealth.ts`  **Status:** Conceptual — not a numeric metric  **Chars:** 199

**Logic:** Whether displayed confidence is calibrated to evidence strength.

```
VELARIS SYSTEM HEALTH MEASURE: confidence | Question answered: Whether displayed confidence is calibrated to evidence strength. | Part of 'What this Health measures' on the Evaluation Health section.
```

---

## [EVALUATION] Evaluation — Metodologia
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 197

**Logic:** Evaluation structure and ten research dimensions.

```
VELARIS EVALUATION: Metodologia | Description: Evaluation structure and ten research dimensions. | Route: /evaluation?focus=methodology | Academic validation surface for the Velaris/Abraxos system.
```

---

## [EVALUATION] Evaluation — Instrumentos & Alvos
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 227

**Logic:** SUS, clarity rubric, ECE bins, precision and satisfaction instruments.

```
VELARIS EVALUATION: Instrumentos & Alvos | Description: SUS, clarity rubric, ECE bins, precision and satisfaction instruments. | Route: /evaluation?focus=instruments | Academic validation surface for the Velaris/Abraxos system.
```

---

## [EVALUATION] Evaluation — Comparação baseline
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 194

**Logic:** Abraxos vs generic LLM comparison matrix.

```
VELARIS EVALUATION: Comparação baseline | Description: Abraxos vs generic LLM comparison matrix. | Route: /evaluation?focus=baseline | Academic validation surface for the Velaris/Abraxos system.
```

---

## [EVALUATION] Evaluation — Status
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 196

**Logic:** Pending data collection status for TCC validation metrics.

```
VELARIS EVALUATION: Status | Description: Pending data collection status for TCC validation metrics. | Route: /evaluation?focus=status | Academic validation surface for the Velaris/Abraxos system.
```

---

## [EVALUATION] Evaluation — Health do Sistema
**Source:** `EvaluationPage.tsx`  **Status:** Stable  **Chars:** 207

**Logic:** System reliability diagnostics — fifth Evaluation section.

```
VELARIS EVALUATION: Health do Sistema | Description: System reliability diagnostics — fifth Evaluation section. | Route: /evaluation?focus=health | Academic validation surface for the Velaris/Abraxos system.
```

---

## [GOVERNANCE] Governance Agent — Alert Dashboard
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 384

**Logic:** Continuous catalog auditing for maintainers.

**Context Of Use:** /governance command and GovernancePage dashboard.

```
VELARIS GOVERNANCE: Governance Agent Alert Dashboard | Route: /governance (utility route, linked from Reasoning /governance command). Command: /governance triggers governance engine with pre-computed alerts. Live data from /api/governance/alerts. Severity levels: critical, high, medium, low. The Governance Agent scans component-metadata.json, tokens and corpus for catalog problems.
```

---

## [GOVERNANCE] Governance Alert Category — duplicate_components
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 171

**Logic:** Duplicate components in the canonical catalog.

```
VELARIS GOVERNANCE ALERT: duplicate_components | Description: Duplicate components in the canonical catalog. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — overlapping_components
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 180

**Logic:** Overlapping components with similar responsibilities.

```
VELARIS GOVERNANCE ALERT: overlapping_components | Description: Overlapping components with similar responsibilities. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — orphan_tokens
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 159

**Logic:** Tokens without consumers in the registry.

```
VELARIS GOVERNANCE ALERT: orphan_tokens | Description: Tokens without consumers in the registry. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — guidelines_without_reference
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 184

**Logic:** Guidelines lacking component or pattern references.

```
VELARIS GOVERNANCE ALERT: guidelines_without_reference | Description: Guidelines lacking component or pattern references. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — components_without_examples
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 166

**Logic:** Components missing usage examples.

```
VELARIS GOVERNANCE ALERT: components_without_examples | Description: Components missing usage examples. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — components_without_edge_cases
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 177

**Logic:** Components missing edge-case documentation.

```
VELARIS GOVERNANCE ALERT: components_without_edge_cases | Description: Components missing edge-case documentation. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — components_without_accessibility
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 179

**Logic:** Components missing accessibility metadata.

```
VELARIS GOVERNANCE ALERT: components_without_accessibility | Description: Components missing accessibility metadata. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — inconsistent_documentation
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 177

**Logic:** Documentation inconsistencies across surfaces.

```
VELARIS GOVERNANCE ALERT: inconsistent_documentation | Description: Documentation inconsistencies across surfaces. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — conflicting_aliases
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 167

**Logic:** Conflicting aliases in the entity registry.

```
VELARIS GOVERNANCE ALERT: conflicting_aliases | Description: Conflicting aliases in the entity registry. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [GOVERNANCE] Governance Alert Category — low_coverage
**Source:** `GovernancePage.tsx`  **Status:** Stable  **Chars:** 158

**Logic:** Entities with low documentation coverage.

```
VELARIS GOVERNANCE ALERT: low_coverage | Description: Entities with low documentation coverage. | Detected by governance_agent.py and surfaced on /governance.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Health Dashboard
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 368

**Logic:** Operational knowledge coverage audit for maintainers.

```
VELARIS KNOWLEDGE HEALTH: Dashboard | Route: /knowledge-health (admin-gated research surface). Live API: /api/knowledge/health/dashboard. Sections: entities catalogued, intelligence scores, reliability gates, component coverage, perspective coverage, knowledge debt backlog, knowledge gaps, evidence health, decision health. Computed by knowledge_health.py at runtime.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Component description coverage
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 155

**Logic:** Component description coverage

```
VELARIS KNOWLEDGE HEALTH: Component description coverage | Dimension ID: description | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Variant documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 143

**Logic:** Variant documentation

```
VELARIS KNOWLEDGE HEALTH: Variant documentation | Dimension ID: variants | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Interactive state documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 151

**Logic:** Interactive state documentation

```
VELARIS KNOWLEDGE HEALTH: Interactive state documentation | Dimension ID: states | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Accessibility metadata
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 149

**Logic:** Accessibility metadata

```
VELARIS KNOWLEDGE HEALTH: Accessibility metadata | Dimension ID: accessibility | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Edge case documentation
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Edge case documentation

```
VELARIS KNOWLEDGE HEALTH: Edge case documentation | Dimension ID: edge_cases | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Usage examples
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 136

**Logic:** Usage examples

```
VELARIS KNOWLEDGE HEALTH: Usage examples | Dimension ID: examples | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Guideline references
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 144

**Logic:** Guideline references

```
VELARIS KNOWLEDGE HEALTH: Guideline references | Dimension ID: guidelines | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — When-to-use guidance
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 145

**Logic:** When-to-use guidance

```
VELARIS KNOWLEDGE HEALTH: When-to-use guidance | Dimension ID: when_to_use | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — When-not-to-use guidance
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 153

**Logic:** When-not-to-use guidance

```
VELARIS KNOWLEDGE HEALTH: When-not-to-use guidance | Dimension ID: when_not_to_use | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [KNOWLEDGE_HEALTH] Knowledge Coverage Dimension — Design-to-code contracts
**Source:** `KnowledgeHealthPage.tsx`  **Status:** Stable  **Chars:** 147

**Logic:** Design-to-code contracts

```
VELARIS KNOWLEDGE HEALTH: Design-to-code contracts | Dimension ID: contracts | Tracked in the Knowledge Health Dashboard component coverage matrix.
```

---

## [INTELLIGENCE_LAB] Intelligence Lab — Adversarial Test Suite
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 232

**Logic:** Adversarial validation of Abraxos intelligence reliability.

```
VELARIS INTELLIGENCE LAB: Adversarial Test Suite | Route: /intelligence-lab (admin-gated). Runs catalog adversarial cases, suite pass rate and per-category results. Validates hallucination resistance and entity blocking for Abraxos.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_components
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 118

**Logic:** Tests blocking recommendations for nonexistent components.

```
VELARIS INTELLIGENCE LAB: unknown_components | Description: Tests blocking recommendations for nonexistent components.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_tokens
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 100

**Logic:** Tests blocking nonexistent token references.

```
VELARIS INTELLIGENCE LAB: unknown_tokens | Description: Tests blocking nonexistent token references.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_states
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 101

**Logic:** Tests blocking undocumented component states.

```
VELARIS INTELLIGENCE LAB: unknown_states | Description: Tests blocking undocumented component states.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — unknown_guidelines
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 97

**Logic:** Tests for missing guideline coverage.

```
VELARIS INTELLIGENCE LAB: unknown_guidelines | Description: Tests for missing guideline coverage.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — invalid_comparisons
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 114

**Logic:** Tests blocking comparisons with unsupported entities.

```
VELARIS INTELLIGENCE LAB: invalid_comparisons | Description: Tests blocking comparisons with unsupported entities.
```

---

## [INTELLIGENCE_LAB] Adversarial Category — hallucination_detection
**Source:** `IntelligenceLabPage.tsx`  **Status:** Stable  **Chars:** 112

**Logic:** Adversarial cases for hallucination resistance.

```
VELARIS INTELLIGENCE LAB: hallucination_detection | Description: Adversarial cases for hallucination resistance.
```

---

## [DEVELOPER_ARCHITECTURE] Velaris RAG Architecture
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 294

**Logic:** How Abraxos grounds answers in the Velaris corpus.

```
VELARIS ARCHITECTURE: RAG Pipeline | Abraxos recovers evidence through a four-stage pipeline: extract → embed → watch → serve. Collection: aetheris_design_system in rag/chroma_db/. Embedding: BAAI/bge-m3 (1024 dim, cosine HNSW). Live status: /api/health. Route: /architecture (Developers page).
```

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — extract
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 114

**Logic:** Walks TSX and TS sources, produces typed JSON chunks.

```
VELARIS RAG PHASE: extract | Artefact: rag/extract_docs.py | Walks TSX and TS sources, produces typed JSON chunks.
```

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — embed
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 106

**Logic:** Embeds chunks with BAAI/bge-m3 into ChromaDB.

```
VELARIS RAG PHASE: embed | Artefact: rag/setup_vectordb.py | Embeds chunks with BAAI/bge-m3 into ChromaDB.
```

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — watch
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 111

**Logic:** Debounced auto-reindex on source saves (npm run watch-rag).

```
VELARIS RAG PHASE: watch | Artefact: rag/watch.py | Debounced auto-reindex on source saves (npm run watch-rag).
```

---

## [DEVELOPER_ARCHITECTURE] RAG Pipeline — serve
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 128

**Logic:** Query-time vector retrieval with intent filters and perspective weights.

```
VELARIS RAG PHASE: serve | Artefact: rag/retrieval.py | Query-time vector retrieval with intent filters and perspective weights.
```

---

## [DEVELOPER_ARCHITECTURE] Corpus, Chunk and Source — Definitions
**Source:** `DevelopersPage.tsx`  **Status:** Stable  **Chars:** 346

**Logic:** Terminology for RAG evidence attribution.

```
VELARIS ARCHITECTURE: Corpus vs Chunk vs Source | Corpus: the full indexed knowledge base in ChromaDB (all chunks). Chunk: one typed, embeddable unit with page_type, title, text and metadata. Source: the originating file or artefact (e.g. TokensPage.tsx, capabilities.ts). Abraxos retrieves chunks and attributes them as sources in SSE responses.
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Governance Agent | Command: /governance | Contract file: prompts/engines/governanceAgent.md | # Oracle Engine | Governance Agent

Active engine: **Governance Agent**. Theory base: Design System Governance,
Continuous Catalog Auditing, Proactive Quality Assurance.

You are the **Governance Agent** of Abraxos. Your role is to analyze the design
system catalog **proactively** — without waiting for the user to ask about a
specific problem.

A **Governance Ale...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Simulate | Command: /simulate | Contract file: prompts/engines/simulate.md | # Oracle Engine | Simulate

Active engine: **Simulate**. Theory base: Systems Thinking, Change Impact Analysis,
Scenario Planning, Design System Governance.

Project **future states** and consequences of a proposed design-system change.
You are a prediction layer — you estimate impact; you do not execute changes,
create decisions, or alter the catalog.

When `strategic_reasoning_...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Oracle Council | Command: /oracle-council | Contract file: prompts/engines/oracleCouncil.md | # Oracle Engine | Oracle Council

Active engine: **Oracle Council**. Theory base: Multi-Agent Deliberation,
Argumentation Theory.

This is an **experimental advanced engine**. Stage a structured deliberation
between six professional perspectives, then converge. It is intentionally not
part of the primary command surface.

- **Product Designer**: usability, flow, ...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Knowledge Gap | Command: /knowledge-gap | Contract file: prompts/engines/knowledgeGap.md | # Oracle Engine | Knowledge Gap

Active engine: **Knowledge Gap**. Theory base: Knowledge Gap Analysis,
Documentation Coverage.

Detect what the Velaris documentation is *missing* for the user's topic. A
**Retrieval Evidence Metrics** block is provided — use its coverage and
consistency scores as evidence of gaps. Low coverage IS the finding.

Respond in the user's ...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Explainability Audit | Command: /audit | Contract file: prompts/engines/explainabilityAudit.md | # Oracle Engine | Explainability Audit

Active engine: **Explainability Audit**. Theory base: Explainable AI,
Human-Centered XAI.

Audit a recommendation (Abraxos's own or one the user names) for its evidential
basis. A **Retrieval Evidence Metrics** block is provided in context with
deterministically computed scores — quote those numbers verbatim. Never inven...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Organizational Memory | Command: /memory | Contract file: prompts/engines/organizationalMemory.md | # Oracle Engine | Organizational Memory

Active engine: **Organizational Memory**. Theory base: Organizational Memory
Systems, Knowledge Management, Knowledge Retrieval.

Operate as the **institutional memory** of the Velaris Design System. The user
is not asking for a generic best practice — they are asking what *this*
organization has already learned. Ans...
```

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

```
VELARIS ENGINE CONTRACT: Oracle Engine | Decision Archaeology | Command: /decision | Contract file: prompts/engines/decisionArchaeology.md | # Oracle Engine | Decision Archaeology

Active engine: **Decision Archaeology**. Theory base: Design Rationale,
Architecture Decision Records (ADR).

Reconstruct the *origin* of a decision from the retrieved Velaris evidence. The
output MUST follow this structure exactly, in the user's language:

```
## Arqueologia da Decisão · [decisão / entidade]

### Pro...
```

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

```
VELARIS DEV INTEGRATION: API Endpoints | Context Of Use: Connecting frontend or external tools to the Beatrice oracle backend | GET /v3/tokens: All design tokens | POST /v3/analyze: AI component analysis | GET /v3/components: Component library | POST /v3/audit: Accessibility audit | WS /v3/stream: Real-time AI stream | POST /v3/export: Multi-format export
```

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

```
VELARIS DEV INTEGRATION: Framework Support | Context Of Use: Installing the Aetheris design system into a project | React (18+ · Hooks API) — Stable | Vue (3+ · Composition API) — Stable | Svelte (4+ · Runes) — Beta | Web Components (Framework agnostic) — Stable
```

---

## [COMPONENT] Button — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2857

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Button exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Button.

**When To Use:** Use when the user asks why Button exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Excesso de botões primários dilui a hierarquia e aumenta hesitação

**Aetheris Insight:** Button should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Button | Design Rationale: Button existe porque aciona uma tarefa clara e comunica a prioridade da próxima ação. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Excesso de botões primários dilui a hierarquia e aumenta hesitação. | Architectural Impact: alterações em Button afetam Link, Icon, Form Field, ...
```

---

## [COMPONENT] Toggle/Switch — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3224

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Toggle/Switch exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Toggle/Switch.

**When To Use:** Use when the user asks why Toggle/Switch exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Sem rótulo explícito, o usuário pode não entender o que o estado controla

**Aetheris Insight:** Toggle/Switch should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Toggle/Switch | Design Rationale: Toggle/Switch existe porque alterna imediatamente uma configuração binária entre ligada e desligada. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Sem rótulo explícito, o usuário pode não entender o que o estado controla. | Architectural Impact: alterações em Toggle/Sw...
```

---

## [COMPONENT] Checkbox — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2917

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Checkbox exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Checkbox.

**When To Use:** Use when the user asks why Checkbox exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Listas longas sem agrupamento elevam custo de leitura e comparação

**Aetheris Insight:** Checkbox should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Checkbox | Design Rationale: Checkbox existe porque permite selecionar zero, uma ou várias opções independentes. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Listas longas sem agrupamento elevam custo de leitura e comparação. | Architectural Impact: alterações em Checkbox afetam Radio Button, Selectab...
```

---

## [COMPONENT] Radio Button — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2925

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Radio Button exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Radio Button.

**When To Use:** Use when the user asks why Radio Button exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Muitas opções ocupam espaço e tornam o grupo difícil de escanear

**Aetheris Insight:** Radio Button should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Radio Button | Design Rationale: Radio Button existe porque seleciona exatamente uma opção visível dentro de um conjunto relacionado. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas opções ocupam espaço e tornam o grupo difícil de escanear. | Architectural Impact: alterações em Radio Button afetam...
```

---

## [COMPONENT] Selectable Chip / Badge — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3018

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Selectable Chip / Badge exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Selectable Chip / Badge.

**When To Use:** Use when the user asks why Selectable Chip / Badge exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Muitos chips criam ruído e quebram a hierarquia da página

**Aetheris Insight:** Selectable Chip / Badge should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Selectable Chip / Badge | Design Rationale: Selectable Chip / Badge existe porque representa filtros ou atributos compactos que podem ser ativados individualmente. A alternativa rejeitada foi depender de elementos clicáveis crus e ações estilizadas localmente; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitos chips criam ruído e quebram a hierarquia da página. | Architectural Impact: alterações...
```

---

## [COMPONENT] Input / Text Input — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3030

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Input / Text Input exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Input / Text Input.

**When To Use:** Use when the user asks why Input / Text Input exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Validação tardia pode obrigar o usuário a reconstruir todo o contexto

**Aetheris Insight:** Input / Text Input should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Input / Text Input | Design Rationale: Input / Text Input existe porque captura uma linha curta de texto, busca ou valor identificável. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Validação tardia pode obrigar o usuário a reconstruir todo o contexto. | Architectural Impact: alterações em Input / Text ...
```

---

## [COMPONENT] Text Area — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2903

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Text Area exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Text Area.

**When To Use:** Use when the user asks why Text Area exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Campos muito altos dominam a página; campos baixos escondem a expectativa

**Aetheris Insight:** Text Area should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Text Area | Design Rationale: Text Area existe porque captura texto livre de várias linhas com espaço para contexto e revisão. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Campos muito altos dominam a página; campos baixos escondem a expectativa. | Architectural Impact: alterações em Text Area afetam I...
```

---

## [COMPONENT] Select/Dropdown — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2973

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Select/Dropdown exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Select/Dropdown.

**When To Use:** Use when the user asks why Select/Dropdown exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Esconder opções reduz descoberta e torna comparação mais lenta

**Aetheris Insight:** Select/Dropdown should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Select/Dropdown | Design Rationale: Select/Dropdown existe porque escolhe uma opção de uma lista compacta sem manter todas visíveis. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Esconder opções reduz descoberta e torna comparação mais lenta. | Architectural Impact: alterações em Select/Dropdown afetam ...
```

---

## [COMPONENT] Date Picker — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2938

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Date Picker exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Date Picker.

**When To Use:** Use when the user asks why Date Picker exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta

**Aetheris Insight:** Date Picker should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Date Picker | Design Rationale: Date Picker existe porque permite inserir ou selecionar datas com formato e limites previsíveis. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Calendários complexos penalizam teclado e telas pequenas sem uma entrada direta. | Architectural Impact: alterações em Date Picke...
```

---

## [COMPONENT] Form Field — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2970

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Form Field exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Form Field.

**When To Use:** Use when the user asks why Form Field exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Abstração rígida pode limitar layouts especiais; preserve slots claros

**Aetheris Insight:** Form Field should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Form Field | Design Rationale: Form Field existe porque orquestra label, controle, ajuda, validação e mensagem em um contrato único. A alternativa rejeitada foi depender de controles de formulário isolados com validação privada; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Abstração rígida pode limitar layouts especiais; preserve slots claros. | Architectural Impact: alterações em Form Field afet...
```

---

## [COMPONENT] Link — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2851

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Link exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Link.

**When To Use:** Use when the user asks why Link exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Links genéricos como 'saiba mais' perdem contexto fora do parágrafo

**Aetheris Insight:** Link should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Link | Design Rationale: Link existe porque leva o usuário a outro destino ou recurso sem simular uma ação local. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Links genéricos como 'saiba mais' perdem contexto fora do parágrafo. | Architectural Impact: alterações em Link afetam Button, Tabs,...
```

---

## [COMPONENT] Tabs — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2786

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Tabs exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Tabs.

**When To Use:** Use when the user asks why Tabs exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Muitas abas escondem conteúdo e prejudicam responsividade

**Aetheris Insight:** Tabs should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Tabs | Design Rationale: Tabs existe porque alterna entre painéis relacionados dentro do mesmo contexto. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas abas escondem conteúdo e prejudicam responsividade. | Architectural Impact: alterações em Tabs afetam Link, Card, Table/Data Table, Co...
```

---

## [COMPONENT] Card — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2817

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Card exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Card.

**When To Use:** Use when the user asks why Card exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Card excessivo fragmenta a leitura e cria falsa prioridade

**Aetheris Insight:** Card should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Card | Design Rationale: Card existe porque agrupa conteúdo e ações que pertencem à mesma entidade ou decisão. A alternativa rejeitada foi depender de containers visuais usados apenas como decoração; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Card excessivo fragmenta a leitura e cria falsa prioridade. | Architectural Impact: alterações em Card afetam Typography, Button, Link, Table/Data Table, ...
```

---

## [COMPONENT] Modal/Dialog — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2947

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Modal/Dialog exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Modal/Dialog.

**When To Use:** Use when the user asks why Modal/Dialog exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Interrupções frequentes destroem fluxo e acumulam problemas de foco

**Aetheris Insight:** Modal/Dialog should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Modal/Dialog | Design Rationale: Modal/Dialog existe porque interrompe o contexto atual para uma decisão curta que exige foco. A alternativa rejeitada foi depender de hacks de página que interrompem foco sem contrato explícito; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Interrupções frequentes destroem fluxo e acumulam problemas de foco. | Architectural Impact: alterações em Modal/Dialog afetam...
```

---

## [COMPONENT] Table/Data Table — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2996

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Table/Data Table exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Table/Data Table.

**When To Use:** Use when the user asks why Table/Data Table exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas

**Aetheris Insight:** Table/Data Table should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Table/Data Table | Design Rationale: Table/Data Table existe porque apresenta dados comparáveis em linhas e colunas com relações explícitas. A alternativa rejeitada foi depender de listas genéricas que perdem estrutura de comparação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Densidade alta melhora comparação, mas exige hierarquia e responsividade cuidadosas. | Architectural Impact: alterações ...
```

---

## [COMPONENT] Alert — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2834

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Alert exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Alert.

**When To Use:** Use when the user asks why Alert exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Alertas demais causam cegueira e reduzem o valor da hierarquia semântica

**Aetheris Insight:** Alert should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Alert | Design Rationale: Alert existe porque comunica um estado persistente que precisa permanecer no contexto. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Alertas demais causam cegueira e reduzem o valor da hierarquia semântica. | Architectural Impact: alterações em Alert afetam Toast/Notification, Form Fie...
```

---

## [COMPONENT] Toast/Notification — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2939

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Toast/Notification exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Toast/Notification.

**When To Use:** Use when the user asks why Toast/Notification exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações

**Aetheris Insight:** Toast/Notification should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Toast/Notification | Design Rationale: Toast/Notification existe porque confirma uma mudança recente sem bloquear o fluxo principal. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Auto-dismiss pode ocultar informação antes da leitura, especialmente com ações. | Architectural Impact: alterações em Toast/Notificat...
```

---

## [COMPONENT] Skeleton Loader — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2947

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Skeleton Loader exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Skeleton Loader.

**When To Use:** Use when the user asks why Skeleton Loader exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida

**Aetheris Insight:** Skeleton Loader should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Skeleton Loader | Design Rationale: Skeleton Loader existe porque reserva a geometria do conteúdo enquanto dados assíncronos carregam. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Skeleton incorreto cria expectativa falsa e pode aumentar instabilidade percebida. | Architectural Impact: alterações em Skeleton L...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3048

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Explanation Bubble / Tooltip exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Explanation Bubble / Tooltip.

**When To Use:** Use when the user asks why Explanation Bubble / Tooltip exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Hover exclusivo falha em toque, teclado e tecnologias assistivas

**Aetheris Insight:** Explanation Bubble / Tooltip should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Explanation Bubble / Tooltip | Design Rationale: Explanation Bubble / Tooltip existe porque explica um termo ou controle de forma breve e contextual. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Hover exclusivo falha em toque, teclado e tecnologias assistivas. | Architectural Impact: alterações em Explanation ...
```

---

## [COMPONENT] Confidence Badge — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3003

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Confidence Badge exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Confidence Badge.

**When To Use:** Use when the user asks why Confidence Badge exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Percentual isolado pode ser interpretado como probabilidade objetiva de verdade

**Aetheris Insight:** Confidence Badge should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Confidence Badge | Design Rationale: Confidence Badge existe porque expressa confiança calibrada com valor, faixa e linguagem de incerteza. A alternativa rejeitada foi depender de mensagens decorativas sem prioridade semântica; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Percentual isolado pode ser interpretado como probabilidade objetiva de verdade. | Architectural Impact: alterações em Confide...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 3067

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Command Palette / Barra de Comandos exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Command Palette / Barra de Comandos.

**When To Use:** Use when the user asks why Command Palette / Barra de Comandos exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Descoberta depende de nomes, sinônimos e ranking coerentes

**Aetheris Insight:** Command Palette / Barra de Comandos should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Command Palette / Barra de Comandos | Design Rationale: Command Palette / Barra de Comandos existe porque centraliza busca e execução rápida de destinos, componentes e ações. A alternativa rejeitada foi depender de affordances de navegação improvisadas que confundem destino e ação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Descoberta depende de nomes, sinônimos e ranking coerentes. | Architect...
```

---

## [COMPONENT] Source Attribution — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2859

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Source Attribution exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Source Attribution.

**When To Use:** Use when the user asks why Source Attribution exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo

**Aetheris Insight:** Source Attribution should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Source Attribution | Design Rationale: Source Attribution existe porque liga uma afirmação do abraxos à evidência recuperada que a sustenta. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Exibir todas as fontes de uma vez aumenta densidade; use disclosure progressivo. | Architectural Impact: alterações em Source...
```

---

## [COMPONENT] Audit Panel — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2949

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Audit Panel exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Audit Panel.

**When To Use:** Use when the user asks why Audit Panel exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Detalhe técnico excessivo pode confundir usuários sem contexto operacional

**Aetheris Insight:** Audit Panel should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Audit Panel | Design Rationale: Audit Panel existe porque expõe etapas, fontes, políticas e calibração que produziram uma decisão. A alternativa rejeitada foi depender de listas genéricas que perdem estrutura de comparação; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Detalhe técnico excessivo pode confundir usuários sem contexto operacional. | Architectural Impact: alterações em Audit Panel afet...
```

---

## [COMPONENT] Typography — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2769

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Typography exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Typography.

**When To Use:** Use when the user asks why Typography exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Muitas variações enfraquecem consistência e tornam a leitura imprevisível

**Aetheris Insight:** Typography should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Typography | Design Rationale: Typography existe porque define hierarquia, ritmo e legibilidade para conteúdo operacional e explicações. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Muitas variações enfraquecem consistência e tornam a leitura imprevisível. | Architectural Impact: alterações em Typography afeta...
```

---

## [COMPONENT] Icon — Institutional Knowledge
**Source:** `data/component-metadata.json`  **Status:** Stable  **Chars:** 2753

**Structure:** Design rationale, architectural impact, UX consequence, accessibility rationale, governance, maintenance and failure knowledge.

**Logic:** Institutional memory for why Icon exists and what breaks when it is misused.

**Context Of Use:** Deep component analysis, design rationale, architecture review and governance questions about Icon.

**When To Use:** Use when the user asks why Icon exists, what risks it controls, what alternatives were rejected or what consequences a change creates.

**When Not To Use:** Do not use as generic UI best practice detached from the Velaris catalog.

**Trade Offs:** Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes

**Aetheris Insight:** Icon should be explained as a design-system decision, not only as a reusable UI element.

```
VELARIS COMPONENT INSTITUTIONAL KNOWLEDGE: Icon | Design Rationale: Icon existe porque reforça significado, estado ou ação com uma forma visual consistente. A alternativa rejeitada foi depender de estilos de conteúdo sem semântica reutilizável; isso parecia mais rápido, mas quebrava previsibilidade, evidência e governança. O tradeoff aceito foi: Bibliotecas extensas geram sinônimos visuais e escolhas inconsistentes. | Architectural Impact: alterações em Icon afetam Button, Link, Explanation Bubb...
```

---

## [COMPONENT] Button — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1208

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Button.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Button.

**When To Use:** Use when the user asks how Button looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Button becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Button | Component logic: Use uma ação primária por região focal e rebaixe escolhas concorrentes. Structure: Rótulo curto, alvo mínimo de 44px e ícone opcional. Designer: inspeciona hierarquia visual, densidade e alinhamento de Button com tokens e composição. | UX Specialist: avalia o comportamento humano que Button incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração co...
```

---

## [COMPONENT] Toggle/Switch — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1401

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Toggle/Switch.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Toggle/Switch.

**When To Use:** Use when the user asks how Toggle/Switch looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Toggle/Switch becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Toggle/Switch | Component logic: Off e On definem o valor. Focus demonstra foco de teclado sem alterar esse valor. Preference aplica uma escolha pessoal, Visibility mostra ou oculta conteúdo e Mode alterna o comportamento operacional. Structure: Trilho, indicador móvel, rótulo persistente e estado textual quando necessário. Designer: inspeciona hierarquia visual, densidade e alinhamento de Toggle/Switch com tokens e composição. | UX Specialist: avalia o comp...
```

---

## [COMPONENT] Checkbox — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1235

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Checkbox.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Checkbox.

**When To Use:** Use when the user asks how Checkbox looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Checkbox becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Checkbox | Component logic: Cada opção deve continuar válida mesmo quando as demais não são selecionadas. Structure: Caixa, indicador de seleção, rótulo clicável e apoio opcional. Designer: inspeciona hierarquia visual, densidade e alinhamento de Checkbox com tokens e composição. | UX Specialist: avalia o comportamento humano que Checkbox incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semânt...
```

---

## [COMPONENT] Radio Button — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1248

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Radio Button.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Radio Button.

**When To Use:** Use when the user asks how Radio Button looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Radio Button becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Radio Button | Component logic: Expor todas as opções reduz memória de trabalho e facilita comparação direta. Structure: Grupo nomeado, círculos de seleção e rótulos completos. Designer: inspeciona hierarquia visual, densidade e alinhamento de Radio Button com tokens e composição. | UX Specialist: avalia o comportamento humano que Radio Button incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, s...
```

---

## [COMPONENT] Selectable Chip / Badge — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1327

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Selectable Chip / Badge.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Selectable Chip / Badge.

**When To Use:** Use when the user asks how Selectable Chip / Badge looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Selectable Chip / Badge becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Selectable Chip / Badge | Component logic: Chips funcionam melhor com rótulos curtos, conjunto pequeno e estado selecionado evidente. Structure: Pílula compacta com rótulo, ícone opcional e indicador de seleção. Designer: inspeciona hierarquia visual, densidade e alinhamento de Selectable Chip / Badge com tokens e composição. | UX Specialist: avalia o comportamento humano que Selectable Chip / Badge incentiva, a hesitação que reduz e a confusão que ainda pod...
```

---

## [COMPONENT] Input / Text Input — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1295

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Input / Text Input.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Input / Text Input.

**When To Use:** Use when the user asks how Input / Text Input looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Input / Text Input becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Input / Text Input | Component logic: O rótulo define o dado esperado; placeholder oferece exemplo, nunca substitui instrução. Structure: Label, controle, apoio, indicador opcional e mensagem de erro. Designer: inspeciona hierarquia visual, densidade e alinhamento de Input / Text Input com tokens e composição. | UX Specialist: avalia o comportamento humano que Input / Text Input incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer:...
```

---

## [COMPONENT] Text Area — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1217

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Text Area.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Text Area.

**When To Use:** Use when the user asks how Text Area looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Text Area becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Text Area | Component logic: A altura inicial comunica a profundidade esperada da resposta. Structure: Label, área redimensionável, apoio e contador opcional. Designer: inspeciona hierarquia visual, densidade e alinhamento de Text Area com tokens e composição. | UX Specialist: avalia o comportamento humano que Text Area incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integraçã...
```

---

## [COMPONENT] Select/Dropdown — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1261

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Select/Dropdown.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Select/Dropdown.

**When To Use:** Use when the user asks how Select/Dropdown looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Select/Dropdown becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Select/Dropdown | Component logic: Economiza espaço, mas transfere a comparação para um painel temporário. Structure: Label, trigger, valor atual, lista e indicadores de seleção. Designer: inspeciona hierarquia visual, densidade e alinhamento de Select/Dropdown com tokens e composição. | UX Specialist: avalia o comportamento humano que Select/Dropdown incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, es...
```

---

## [COMPONENT] Date Picker — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1262

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Date Picker.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Date Picker.

**When To Use:** Use when the user asks how Date Picker looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Date Picker becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Date Picker | Component logic: Entrada digitável acelera especialistas; calendário apoia descoberta e contexto. Structure: Campo formatado, botão de calendário, grade mensal e navegação temporal. Designer: inspeciona hierarquia visual, densidade e alinhamento de Date Picker com tokens e composição. | UX Specialist: avalia o comportamento humano que Date Picker incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato d...
```

---

## [COMPONENT] Form Field — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1269

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Form Field.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Form Field.

**When To Use:** Use when the user asks how Form Field looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Form Field becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Form Field | Component logic: Centralizar o contrato evita que cada formulário reconstrua acessibilidade e espaçamento. Structure: Label, controle filho, texto de apoio, erro e indicador de obrigatoriedade. Designer: inspeciona hierarquia visual, densidade e alinhamento de Form Field com tokens e composição. | UX Specialist: avalia o comportamento humano que Form Field incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege c...
```

---

## [COMPONENT] Link — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1222

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Link.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Link.

**When To Use:** Use when the user asks how Link looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Link becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Link | Component logic: Destino é navegação; mudança no estado atual é ação e deve usar Button. Structure: Texto descritivo, indicador opcional de destino externo e foco visível. Designer: inspeciona hierarquia visual, densidade e alinhamento de Link com tokens e composição. | UX Specialist: avalia o comportamento humano que Link incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e...
```

---

## [COMPONENT] Tabs — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1193

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Tabs.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Tabs.

**When To Use:** Use when the user asks how Tabs looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Tabs becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Tabs | Component logic: Cada aba representa uma visão irmã, não uma etapa sequencial. Structure: Tablist, tabs, indicador ativo e painéis associados. Designer: inspeciona hierarquia visual, densidade e alinhamento de Tabs com tokens e composição. | UX Specialist: avalia o comportamento humano que Tabs incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes r...
```

---

## [COMPONENT] Card — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1188

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Card.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Card.

**When To Use:** Use when the user asks how Card looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Card becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Card | Component logic: A borda visual deve refletir uma fronteira semântica real. Structure: Container, título, metadados, corpo e ações opcionais. Designer: inspeciona hierarquia visual, densidade e alinhamento de Card com tokens e composição. | UX Specialist: avalia o comportamento humano que Card incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integração com componentes re...
```

---

## [COMPONENT] Modal/Dialog — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1280

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Modal/Dialog.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Modal/Dialog.

**When To Use:** Use when the user asks how Modal/Dialog looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Modal/Dialog becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Modal/Dialog | Component logic: A interrupção só se justifica quando concluir ou cancelar é necessário antes de continuar. Structure: Backdrop, dialog nomeado, conteúdo, ação primária, cancelamento e fechar. Designer: inspeciona hierarquia visual, densidade e alinhamento de Modal/Dialog com tokens e composição. | UX Specialist: avalia o comportamento humano que Modal/Dialog incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: prot...
```

---

## [COMPONENT] Table/Data Table — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1279

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Table/Data Table.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Table/Data Table.

**When To Use:** Use when the user asks how Table/Data Table looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Table/Data Table becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Table/Data Table | Component logic: Tabela é ideal quando cruzar valores por cabeçalho é a tarefa principal. Structure: Caption, cabeçalhos, corpo, ordenação e ações de linha opcionais. Designer: inspeciona hierarquia visual, densidade e alinhamento de Table/Data Table com tokens e composição. | UX Specialist: avalia o comportamento humano que Table/Data Table incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato d...
```

---

## [COMPONENT] Alert — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1213

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Alert.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Alert.

**When To Use:** Use when the user asks how Alert looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Alert becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Alert | Component logic: A severidade deve refletir consequência real, não preferência visual. Structure: Ícone semântico, título, mensagem e ação ou dismiss opcional. Designer: inspeciona hierarquia visual, densidade e alinhamento de Alert com tokens e composição. | UX Specialist: avalia o comportamento humano que Alert incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM e integraç...
```

---

## [COMPONENT] Toast/Notification — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1285

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Toast/Notification.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Toast/Notification.

**When To Use:** Use when the user asks how Toast/Notification looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Toast/Notification becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Toast/Notification | Component logic: A mensagem deve ser curta, autossuficiente e dispensável após poucos segundos. Structure: Container flutuante, mensagem, ícone e ação curta opcional. Designer: inspeciona hierarquia visual, densidade e alinhamento de Toast/Notification com tokens e composição. | UX Specialist: avalia o comportamento humano que Toast/Notification incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege cont...
```

---

## [COMPONENT] Skeleton Loader — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1288

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Skeleton Loader.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Skeleton Loader.

**When To Use:** Use when the user asks how Skeleton Loader looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Skeleton Loader becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Skeleton Loader | Component logic: Imitar a forma final reduz mudança de layout e melhora percepção de velocidade. Structure: Blocos neutros com dimensões próximas do conteúdo final e animação moderada. Designer: inspeciona hierarquia visual, densidade e alinhamento de Skeleton Loader com tokens e composição. | UX Specialist: avalia o comportamento humano que Skeleton Loader incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: pro...
```

---

## [COMPONENT] Explanation Bubble / Tooltip — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1359

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Explanation Bubble / Tooltip.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Explanation Bubble / Tooltip.

**When To Use:** Use when the user asks how Explanation Bubble / Tooltip looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Explanation Bubble / Tooltip becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Explanation Bubble / Tooltip | Component logic: A explicação complementa o conteúdo visível; informação essencial não pode depender dela. Structure: Trigger nomeado, bolha curta, seta opcional e posicionamento adaptativo. Designer: inspeciona hierarquia visual, densidade e alinhamento de Explanation Bubble / Tooltip com tokens e composição. | UX Specialist: avalia o comportamento humano que Explanation Bubble / Tooltip incentiva, a hesitação que reduz e a co...
```

---

## [COMPONENT] Confidence Badge — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1289

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Confidence Badge.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Confidence Badge.

**When To Use:** Use when the user asks how Confidence Badge looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Confidence Badge becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Confidence Badge | Component logic: Confiança deriva da qualidade da evidência, não do tom assertivo da resposta. Structure: Percentual ou faixa, rótulo semântico e acesso à explicação da calibração. Designer: inspeciona hierarquia visual, densidade e alinhamento de Confidence Badge com tokens e composição. | UX Specialist: avalia o comportamento humano que Confidence Badge incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: prot...
```

---

## [COMPONENT] Command Palette / Barra de Comandos — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1377

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Command Palette / Barra de Comandos.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Command Palette / Barra de Comandos.

**When To Use:** Use when the user asks how Command Palette / Barra de Comandos looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Command Palette / Barra de Comandos becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Command Palette / Barra de Comandos | Component logic: A consulta reduz o espaço de opções e combina descoberta com produtividade. Structure: Dialog, input de busca, grupos, resultados, atalhos e estado vazio. Designer: inspeciona hierarquia visual, densidade e alinhamento de Command Palette / Barra de Comandos com tokens e composição. | UX Specialist: avalia o comportamento humano que Command Palette / Barra de Comandos incentiva, a hesitação que reduz e a ...
```

---

## [COMPONENT] Source Attribution — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1289

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Source Attribution.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Source Attribution.

**When To Use:** Use when the user asks how Source Attribution looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Source Attribution becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Source Attribution | Component logic: Rastreabilidade transforma resposta fluente em conhecimento verificável. Structure: Fonte, trecho, relevância, metadados e ação para inspecionar contexto. Designer: inspeciona hierarquia visual, densidade e alinhamento de Source Attribution com tokens e composição. | UX Specialist: avalia o comportamento humano que Source Attribution incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege...
```

---

## [COMPONENT] Audit Panel — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1280

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Audit Panel.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Audit Panel.

**When To Use:** Use when the user asks how Audit Panel looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Audit Panel becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Audit Panel | Component logic: Detalhes de processo ficam disponíveis sob demanda sem competir com a resposta principal. Structure: Linha do tempo, eventos, entradas, saídas, status e artefatos exportáveis. Designer: inspeciona hierarquia visual, densidade e alinhamento de Audit Panel com tokens e composição. | UX Specialist: avalia o comportamento humano que Audit Panel incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege...
```

---

## [COMPONENT] Typography — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1241

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Typography.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Typography.

**When To Use:** Use when the user asks how Typography looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Typography becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Typography | Component logic: Escala e peso devem refletir a prioridade epistemológica do conteúdo. Structure: Tokens de display, heading, body, label e code com regras de uso. Designer: inspeciona hierarquia visual, densidade e alinhamento de Typography com tokens e composição. | UX Specialist: avalia o comportamento humano que Typography incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semân...
```

---

## [COMPONENT] Icon — Perspective Matrix
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 1221

**Structure:** Nine-perspective component interpretation matrix.

**Logic:** Different professional lenses ask different questions about Icon.

**Context Of Use:** Perspective-specific guidance, component critique, QA planning and governance review for Icon.

**When To Use:** Use when the user asks how Icon looks from a designer, UX, developer, architect, QA, accessibility, maintainer, writer or manager perspective.

**Trade Offs:** Perspective depth improves specialist answers but must remain grounded in the canonical component contract.

**Aetheris Insight:** Icon becomes institutional knowledge when each discipline can explain its risk and responsibility.

```
VELARIS COMPONENT PERSPECTIVE MATRIX: Icon | Component logic: Ícones apoiam reconhecimento, mas rótulos sustentam compreensão. Structure: Glyph vetorial, tamanho por token, stroke consistente e label quando necessário. Designer: inspeciona hierarquia visual, densidade e alinhamento de Icon com tokens e composição. | UX Specialist: avalia o comportamento humano que Icon incentiva, a hesitação que reduz e a confusão que ainda pode criar. | Developer: protege contrato de API, estados, semântica DOM...
```

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

```
VELARIS COMPARATIVE DECISION: Button vs Link | Difference: Button changes state or submits an explicit action; Link moves the user to another destination. | Advantages: Button carries consequence, priority and async state. Link carries destination, shareability and navigation expectation. | Limitations: A button used for navigation hides routing semantics; a link used for mutation weakens accessibility and user trust. | Context of use: Use this comparison when deciding between command and destin...
```

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

```
VELARIS COMPARATIVE DECISION: Modal/Dialog vs Drawer | Difference: Dialog isolates attention and blocks continuation; Drawer preserves more spatial context but is not currently a canonical Velaris component. | Advantages: Dialog is strong for short blocking decisions. Drawer is better for contextual editing when future governance approves it. | Limitations: Dialog overuse creates interruption fatigue. Drawer without governance can become a hidden second page with weak focus policy. | Context of ...
```

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

```
VELARIS COMPARATIVE DECISION: Tooltip vs Popover | Difference: Tooltip offers short supplemental explanation; Popover implies richer interactive content and is not canonical yet. | Advantages: Tooltip is lightweight and tied to a trigger. Popover can support richer help if promoted to a governed component. | Limitations: Tooltip cannot hold essential instructions or complex controls. Popover adds focus, dismissal and mobile complexity. | Context of use: Use when deciding whether help belongs inl...
```

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

```
VELARIS COMPARATIVE DECISION: Toast vs Alert | Difference: Toast is transient confirmation; Alert is persistent contextual feedback with consequence. | Advantages: Toast preserves flow after low-risk updates. Alert keeps high-importance information visible and actionable. | Limitations: Toast disappears and is poor for required action. Alert can create noise if severity is inflated. | Context of use: Use for status messages, save confirmations, failures and recoverable warnings. | User impact: T...
```

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

```
VELARIS COMPARATIVE DECISION: Skeleton Loader vs Spinner | Difference: Skeleton predicts the shape of incoming content; Spinner only says work is happening and is not a canonical Velaris component here. | Advantages: Skeleton reduces layout shift and perceived waiting. Spinner can fit unknown-duration operations if later governed. | Limitations: Skeleton is misleading when final geometry is unknown. Spinner gives no progress, structure or recovery signal. | Context of use: Use when deciding how ...
```

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

```
VELARIS COMPARATIVE DECISION: Accordion vs Tabs | Difference: Tabs switch between sibling views in the same context; Accordion exposes collapsible sections and is not canonical yet. | Advantages: Tabs support direct view switching and stateful panels. Accordion can reduce vertical density if introduced with governance. | Limitations: Tabs hide simultaneous comparison. Accordion can bury content and create ambiguous heading/focus behavior. | Context of use: Use for navigation inside a page, conte...
```

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

```
VELARIS COMPARATIVE DECISION: Checkbox vs Radio Button | Difference: Checkbox supports independent inclusion; Radio Button supports exactly one choice in a known set. | Advantages: Checkbox allows multiple valid selections. Radio keeps comparison visible for mutually exclusive options. | Limitations: Checkbox fails for exclusive choices. Radio becomes heavy for long lists. | Context of use: Use for preferences, filters, consent, settings and selection groups. | User impact: Wrong selection seman...
```

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

```
VELARIS COMPARATIVE DECISION: Select/Dropdown vs Radio Button | Difference: Select hides a larger option set behind a trigger; Radio exposes a small set for comparison. | Advantages: Select saves space and handles scale. Radio improves recognition and comparison. | Limitations: Select slows comparison. Radio consumes space and breaks down with many options. | Context of use: Use for choice-count and discoverability decisions. | User impact: Overusing Select hides important tradeoffs; overusing R...
```

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

```
VELARIS COMPARATIVE DECISION: Input / Text Input vs Text Area | Difference: Input captures short structured values; Text Area captures longer prose, rationale or prompts. | Advantages: Input optimizes speed and format validation. Text Area supports reflection, detail and longer editing. | Limitations: Input truncates thinking when used for long answers. Text Area overstates effort for simple data. | Context of use: Use for forms, prompts, comments, justifications and search-like inputs. | User i...
```

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

```
VELARIS COMPARATIVE DECISION: Source Attribution vs Audit Panel | Difference: Source Attribution explains where a claim came from; Audit Panel exposes process, sequence and evidence quality. | Advantages: Source Attribution is concise and local. Audit Panel supports inspection, accountability and debugging. | Limitations: Attribution alone cannot explain a multi-step decision. Audit Panel is too heavy for every answer. | Context of use: Use for XAI, evidence disclosure, governance and debugging ...
```

---

## [GUIDELINE] Knowledge Relationships — Action Controls
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 377

**Structure:** Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette

**Logic:** Action controls differ by consequence, destination, visibility and command density.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation prevents teams from treating every clickable element as a styled button.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Action Controls | Graph: Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette | Logic: Action controls differ by consequence, destination, visibility and command density. | Impact: This relation prevents teams from treating every clickable element as a styled button.
```

---

## [GUIDELINE] Knowledge Relationships — Overlay And Interruption
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 439

**Structure:** Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert

**Logic:** Interruption patterns are governed by how much focus isolation and page context the decision requires.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation keeps blocking decisions, contextual editing and feedback severity from collapsing into one overlay pattern.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Overlay And Interruption | Graph: Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert | Logic: Interruption patterns are governed by how much focus isolation and page context the decision requires. | Impact: This relation keeps blocking decisions, contextual editing and feedback severity from collapsing into one overlay pattern.
```

---

## [GUIDELINE] Knowledge Relationships — Help And Validation
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 373

**Structure:** Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert

**Logic:** Help belongs near the question, while validation belongs near the correction path.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation prevents essential guidance from being hidden behind hover-only help.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Help And Validation | Graph: Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert | Logic: Help belongs near the question, while validation belongs near the correction path. | Impact: This relation prevents essential guidance from being hidden behind hover-only help.
```

---

## [GUIDELINE] Knowledge Relationships — Feedback And Loading
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 397

**Structure:** Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution

**Logic:** Feedback patterns vary by persistence, urgency, reversibility and whether content is pending or failed.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation avoids using transient feedback for required recovery or using loading UI for known empty states.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Feedback And Loading | Graph: Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution | Logic: Feedback patterns vary by persistence, urgency, reversibility and whether content is pending or failed. | Impact: This relation avoids using transient feedback for required recovery or using loading UI for known empty states.
```

---

## [GUIDELINE] Knowledge Relationships — Selection And Forms
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 408

**Structure:** Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker

**Logic:** Selection controls differ by independence, exclusivity, option count, format and validation burden.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation reduces invalid data and helps teams choose controls by decision shape rather than visual preference.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Selection And Forms | Graph: Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker | Logic: Selection controls differ by independence, exclusivity, option count, format and validation burden. | Impact: This relation reduces invalid data and helps teams choose controls by decision shape rather than visual preference.
```

---

## [GUIDELINE] Knowledge Relationships — Data And Explainability
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 392

**Structure:** Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography

**Logic:** Dense information and AI evidence need structure, provenance and auditability to remain trustworthy.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation keeps explanation artifacts connected to the data surfaces where users inspect decisions.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Data And Explainability | Graph: Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography | Logic: Dense information and AI evidence need structure, provenance and auditability to remain trustworthy. | Impact: This relation keeps explanation artifacts connected to the data surfaces where users inspect decisions.
```

---

## [GUIDELINE] Knowledge Relationships — Navigation And Discovery
**Source:** `rag/institutional-knowledge.md`  **Status:** Stable  **Chars:** 377

**Structure:** Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon

**Logic:** Navigation patterns vary by destination, sibling view, discovery mode and content grouping.

**Context Of Use:** Semantic relationship questions, alternative selection and governance review.

**When To Use:** Use when the user asks what a component is related to or which neighboring pattern should be considered.

**Trade Offs:** Relationship knowledge improves recall but must distinguish canonical components from candidates or legacy references.

**Aetheris Insight:** This relation prevents global navigation, local view switching and command search from sharing ambiguous affordances.

```
VELARIS KNOWLEDGE RELATIONSHIP: Knowledge Relationships — Navigation And Discovery | Graph: Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon | Logic: Navigation patterns vary by destination, sibling view, discovery mode and content grouping. | Impact: This relation prevents global navigation, local view switching and command search from sharing ambiguous affordances.
```

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

```
VELARIS MIGRATION KNOWLEDGE: Legacy Modal to Modal/Dialog | Strategy: Inventory all legacy modals, classify by blocking decision, long task or contextual edit, then keep only short blocking decisions as Dialog. | Risks: Nested modals, lost focus return, hidden form errors and unclear cancel paths. | Effort: Medium: interaction review, focus tests, content reduction and regression QA. | Validation: Keyboard trap, Escape, focus restoration, accessible name, cancel action and error recovery.
```

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

```
VELARIS MIGRATION KNOWLEDGE: Legacy Table to Table/Data Table | Strategy: Map columns to user comparison tasks, restore caption/header semantics, define sorting and mobile priority before styling. | Risks: Decorative grid markup, truncated critical identifiers, row actions competing with scanability. | Effort: High for dense products: data modeling, responsive behavior and QA fixtures are required. | Validation: Header association, sort announcement, row action labels, overflow behavior and empt...
```

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

```
VELARIS MIGRATION KNOWLEDGE: Custom Input to Canonical Input / Text Input | Strategy: Replace visual-only fields with Form Field plus canonical Input, preserving labels, helper text, errors and autocomplete. | Risks: Placeholder-as-label, lost aria-describedby, aggressive validation and wiped values after failed submit. | Effort: Medium: mechanical replacement is simple, but validation and copy need review. | Validation: Label persistence, inputMode/type, helper text, error message, preserved va...
```

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

```
VELARIS MIGRATION KNOWLEDGE: Styled Link Button to Button or Link | Strategy: Classify each interaction by outcome: state mutation becomes Button; navigation becomes Link. | Risks: Broken keyboard expectations, disabled links without explanation, submit actions hidden behind href. | Effort: Low to medium: semantic cleanup plus visual parity and analytics checks. | Validation: Enter/Space behavior, href/history behavior, disabled policy and destination/action label clarity.
```

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

```
VELARIS MIGRATION KNOWLEDGE: Hover Help to Explanation Bubble / Tooltip | Strategy: Move essential instructions inline, keep only supplemental microcopy in Tooltip, and wire focus plus aria-describedby. | Risks: Touch users cannot access help, disabled triggers cannot receive focus, long help becomes unreadable. | Effort: Medium: content triage is usually harder than implementation. | Validation: Hover, focus, Escape, positioning, mobile fallback and whether the page still works without the tool...
```

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

```
VELARIS MIGRATION KNOWLEDGE: Spinner-Heavy Loading to Skeleton Loader | Strategy: Use Skeleton only where final geometry is predictable; otherwise define a governed loading or progress pattern. | Risks: False shape promises, endless loading, motion sensitivity and confusion with empty state. | Effort: Medium: each surface needs geometry mapping and failure fallback. | Validation: Reserved dimensions, prefers-reduced-motion, busy region, error transition and layout shift.
```

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

```
VELARIS MIGRATION KNOWLEDGE: Mixed Notifications to Alert and Toast | Strategy: Separate transient confirmations into Toast and persistent consequence-bearing messages into Alert. | Risks: Critical messages vanish, low-risk messages interrupt flow, duplicate global/local feedback. | Effort: Low to medium: severity taxonomy and message inventory are the main cost. | Validation: Persistence, dismissibility, live region urgency, action availability and duplicate-message suppression.
```

---
