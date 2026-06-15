# Auditoria e avaliação manual dos contratos de perspectiva

Data: 2026-06-07

## Objetivo

Este documento registra a auditoria dos oito contratos, os testes comparativos
manuais e a matriz de diferenciação. A avaliação verifica se a mesma pergunta
produz decisões substantivamente diferentes conforme a perspectiva ativa.

## Segunda revisão crítica

Critérios aplicados:

- possibilidade de resposta genérica;
- ausência ou insuficiência do critério de não conformidade;
- ausência de evidência e limitação;
- lente profissional pouco coercitiva;
- convergência provável com outra perspectiva;
- ausência de termos técnicos próprios da função;
- ausência de checklist binário antes da resposta.

| Perspectiva | Estado encontrado | Diagnóstico crítico | Correção aplicada | Estado final |
|---|---|---|---|---|
| Developer | Forte, com inconsistência | O corpo exigia cinco edge cases, mas o gate final aceitava três. O checklist final não era binário. | Gate alinhado para cinco casos, checklist binário e invalidação por ausência de ownership, boundaries, estados, reuso, acessibilidade ou evidência. | Forte |
| Accessibility Specialist | Forte, com gate incompleto | O contrato era técnico, mas o gate final não invalidava explicitamente a ausência de barreira concreta e impacto no usuário. | Checklist binário e invalidação por ausência de barreira, impacto, foco, teclado, semântica, tecnologia assistiva, estados, prevenção de erro ou limitação. | Forte |
| Design System Manager | Fraca | A classificação era obrigatória, mas uma resposta genérica podia classificar sem owner, gates, adoção ou consequência de fragmentação. | Registro obrigatório de governança com classificação, owner, times, gate de aprovação, gate de promoção, sinal de adoção e consequência de fragmentação. | Forte |
| Designer | Fraca | O gate exigia causa e efeito, mas não obrigava elemento analisado, correção controlável, dependência de token ou fronteira com usabilidade. | Finding visual obrigatório com região, causa, efeito, correção sistêmica, dependência de token ou estado e fronteira de usabilidade. | Forte |
| Maintainer | Fraca | Ownership e ponto de mudança ainda podiam produzir uma resposta quase igual à de Developer. Não havia disposição explícita de manutenção. | Disposição obrigatória entre manter explícito, abstrair, consolidar, dividir, remover ou adiar, acompanhada de change trigger e evidência visível. | Forte |
| Product Designer | Fraca | Evidência, hipótese e validação existiam, mas não havia um único registro que conectasse ação, necessidade, risco, mudança e sinais de suporte ou refutação. | Registro obrigatório de hipótese comportamental e validation oracle qualitativo e quantitativo. | Forte |
| QA | Fraca | O gate aceitava qualquer critério chamado pass/fail, mesmo sem precondição, ação ou superfície de observação. | Test oracle obrigatório com precondição, ação, passa se, falha se e observação, além de técnicas específicas de QA. | Forte |
| Tech Writer | Fraca | O critério de invalidez dependia de existir ambiguidade. Sem ambiguidade aparente, uma resposta genérica de documentação podia passar. | Registro editorial obrigatório com audiência, termo canônico, ambiguidade, interpretação errada, redação recomendada, redação a evitar e próxima ação documental. | Forte |

Depois das correções, todas as perspectivas possuem:

- estrutura obrigatória;
- artefato profissional exclusivo;
- termos técnicos específicos;
- evidência e limitação;
- critério composto de não conformidade;
- checklist binário;
- fronteira explícita contra perspectivas adjacentes.

## Auditoria dos contratos

### Developer

- Preservado: contrato de componente, API proposta, ownership de estado, fluxo
  assíncrono, edge cases, integração, reuso e acessibilidade técnica.
- Antes estava forte: a estrutura já impedia uma resposta puramente conceitual
  e exigia termos verificáveis.
- Critério que faltava: regra global explícita para evidência fornecida pelo
  usuário, inferência, evidência insuficiente e proibição de atribuir pensamento
  interno ao modelo.
- Resposta ruim antes permitida: uma resposta podia declarar limitação de API,
  mas ainda não precisava separar de modo explícito recomendação evidenciada de
  recomendação inferida.
- Fronteira: Developer pode tratar acessibilidade técnica de implementação, mas
  não substitui a avaliação completa de barreiras da Accessibility Specialist.
- Lacuna de evidência: não havia a lista completa de API, token, regra,
  comportamento de browser, teste, guideline, decisão oficial e WCAG.
- Agora é obrigatório: mostrar apenas evidência recuperada ou fornecida,
  rotular inferência, explicar `evidence similarity` e declarar exatamente o
  que não está documentado.

### Accessibility Specialist

- Preservado: foco, teclado, semântica, ARIA, tecnologia assistiva, contraste,
  estados, prevenção de erro e contrato específico de diálogo.
- Antes estava forte: falha concreta, impacto no usuário e validação manual já
  eram centrais.
- Critério que faltava: contrato global completo para evidência insuficiente e
  separação entre recomendação evidenciada e inferida.
- Resposta ruim antes permitida: uma resposta podia mencionar que um teste
  manual era necessário sem dizer qual resultado de tecnologia assistiva ou
  critério WCAG não estava documentado.
- Fronteira: pode comentar clareza e estados quando criam barreira de acesso,
  mas não substitui Product Designer, Designer ou QA.
- Lacuna de evidência: a proibição de inventar mapeamento WCAG e resultado de
  tecnologia assistiva não estava completa.
- Agora é obrigatório: nomear a fronteira documental, preservar os rótulos de
  evidência e nunca apresentar resultado de browser ou tecnologia assistiva sem
  fonte ou teste.

### Design System Manager

- Preservado: estratégia, governança, adoção, prioridade, roadmap, impacto
  sistêmico, exceção e maturidade.
- Antes estava genérico: o contrato pedia critérios, mas não obrigava uma
  decisão operacional.
- Critérios que faltavam: classificação, times afetados, impacto de adoção,
  custo de padronização, custo de rollout, métrica e pré-condições de promoção.
- Resposta ruim antes permitida: "há valor sistêmico, avalie adoção e
  governança" sem dizer se a proposta deveria ser aprovada.
- Invasão de lente: poderia virar estratégia de produto, análise de fluxo,
  opinião estética ou plano de testes.
- Lacuna de evidência: não exigia distinguir demanda real, preferência e
  inferência.
- Agora é obrigatório: escolher `padrão global`, `padrão experimental`,
  `exceção controlada`, `solução local` ou `proposta rejeitada`.

### Designer

- Preservado: composição, hierarquia, tokens, espaçamento, tipografia, cor,
  estados, densidade e consistência estética.
- Antes estava genérico: não forçava grid, alinhamento, ritmo, respiro, peso
  visual, affordance ou identidade Velaris.
- Critérios que faltavam: causa visual concreta, efeito perceptivo e correção
  ligada ao sistema.
- Resposta ruim antes permitida: "melhore o layout, use mais hierarquia e
  consistência".
- Invasão de lente: poderia substituir diagnóstico visual por estratégia,
  pesquisa, governança ou recomendação de usabilidade.
- Lacuna de evidência: token ou regra visual ausente podia virar sugestão com
  aparência de padrão oficial.
- Agora é obrigatório: nomear a inconsistência, explicar o efeito no usuário,
  separar problema visual de usabilidade e declarar token não documentado.

### Maintainer

- Preservado: manutenção, simplicidade, reuso, dívida, acoplamento, duplicação,
  ownership, risco futuro e custo de evolução.
- Antes estava genérico: não obrigava localizar a lógica, definir ownership ou
  apontar a mudança futura que quebraria a solução.
- Critérios que faltavam: testabilidade, removibilidade, onboarding, helper
  prematuro, componente grande, duplicação aceitável e perigosa.
- Resposta ruim antes permitida: "extraia um helper para reduzir duplicação e
  seguir clean code".
- Invasão de lente: poderia transformar manutenção em governança do design
  system ou justificativa abstrata de arquitetura.
- Lacuna de evidência: ownership podia ser inventado quando a arquitetura não
  o documentasse.
- Agora é obrigatório: indicar onde a lógica mora, quem é dono ou que o dono
  não está documentado, o menor caminho estável e o que não abstrair.

### Product Designer

- Preservado: experiência, fluxo, usabilidade, necessidades, contexto,
  hipóteses, fricção, alternativas e validação.
- Antes estava genérico: não obrigava declarar a ação principal, o maior risco
  comportamental ou a carga cognitiva.
- Critérios que faltavam: separação literal entre evidência, hipótese e risco,
  validação qualitativa e quantitativa e consequência de ações destrutivas.
- Resposta ruim antes permitida: "simplifique o fluxo e valide com usuários".
- Invasão de lente: poderia agir como Product Manager, Designer visual ou
  Accessibility Specialist.
- Lacuna de evidência: necessidade do usuário e comportamento esperado podiam
  aparecer como fatos sem pesquisa ou dados.
- Agora é obrigatório: declarar ação principal, conectar a uma necessidade,
  separar evidência de hipótese e propor validação prática para o maior risco.

### QA

- Preservado: critérios de aceite, happy path, falhas, regressão, edge cases,
  estados e validação manual e automatizada.
- Antes estava genérico: ainda aceitava critérios sem precondição, ação,
  resultado observável ou limite de falha.
- Critérios que faltavam: pass/fail, negative path, disabled, success, empty,
  dados inválidos, permissão, rede, duplicidade, UI/backend, fallback e audit
  metadata.
- Resposta ruim antes permitida: "testar erros, loading e regressão para
  garantir que funcione bem".
- Invasão de lente: poderia virar opinião de produto ou lista de preocupações
  sem oráculo de teste.
- Lacuna de evidência: resultados de browser, backend e automação podiam ser
  assumidos sem fixture ou execução.
- Agora é obrigatório: critérios `Passa se` e `Falha se`, caso negativo,
  estados aplicáveis e separação entre automação, manual e acessibilidade.

### Tech Writer

- Preservado: documentação, naming, exemplos, microcopy, terminologia,
  consistência e instruções acionáveis.
- Antes estava genérico: não obrigava termo canônico, interpretação errada,
  glossário ou cobertura do texto de UI do Velaris.
- Critérios que faltavam: mensagens de erro, fallback, Audit Drawer, evidência,
  documentação para agentes e onboarding.
- Resposta ruim antes permitida: "use linguagem clara e consistente com bons
  exemplos".
- Invasão de lente: poderia agir como Designer visual ou propor nomenclatura
  nova sem verificar o termo existente.
- Lacuna de evidência: texto proposto podia parecer oficial mesmo sem decisão
  terminológica documentada.
- Agora é obrigatório: tratar ambiguidade como defeito, indicar termo canônico
  ou sua ausência, nomear interpretação errada e propor microcopy quando houver
  texto de interface.

## Contrato comum de evidência

Todos os contratos exigem:

- somente evidências recuperadas ou fornecidas;
- os rótulos literais `evidence similarity` e `evidence tier` quando houver
  valores;
- a explicação de que `evidence similarity` mede relevância da evidência
  recuperada, não confiança interna do modelo;
- limitação visível para API, token, regra, browser, resultado de teste,
  guideline, decisão oficial ou WCAG não cobertos;
- proibição de inventar fonte, componente, prop, token, API, regra ou
  guideline;
- inferência rotulada quando a base documental for incompleta;
- proibição de reasoning trace interno ou afirmação de que o modelo pensou ou
  aplicou internamente uma regra;
- proibição de travessão na resposta;
- separação entre recomendação evidenciada e recomendação inferida;
- recomendação de validação, teste, decisão, guideline ou documentação quando
  a evidência for insuficiente.

## Protocolo dos testes comparativos

Para cada pergunta:

1. Executar a mesma pergunta nas oito perspectivas.
2. Confirmar o idioma do usuário.
3. Confirmar todas as seções obrigatórias da perspectiva.
4. Confirmar critérios observáveis e específicos da lente.
5. Confirmar evidências e limitações.
6. Confirmar ausência de reasoning trace artificial.
7. Confirmar ausência de API, token, fonte, componente ou guideline inventado.
8. Comparar a resposta com ComponentEvidence quando houver.
9. Registrar classificação, decisão, risco ou correção própria da lente.
10. Marcar falha quando duas perspectivas apenas trocarem títulos.

## Perguntas e diferenças esperadas

### 1. Qual componente devo usar para excluir uma conta?

- Developer: decide contrato proposto, estado, integração e edge cases sem
  inventar API oficial.
- Accessibility Specialist: decide barreiras, foco, teclado, semântica,
  tecnologia assistiva e prevenção de erro.
- Designer: decide peso visual, hierarquia da ação destrutiva, tokens e estados.
- Product Designer: decide fluxo de confirmação, consequência, risco de ação
  errada, recuperação e validação.
- Design System Manager: decide se o padrão deve ser global, experimental,
  exceção, local ou rejeitado.
- Maintainer: decide onde mora a lógica de confirmação, ownership, reuso e
  custo futuro.
- QA: define pass/fail, happy path, casos negativos, estados, rede, permissão e
  duplicidade.
- Tech Writer: define termo, labels, consequência, erro, fallback e instrução.

### 2. Como melhorar essa tela de dashboard?

- Developer: analisa composição de componentes, estado, dados, performance e
  integração.
- Accessibility Specialist: analisa navegação, foco, semântica, contraste,
  leitura e estados acessíveis.
- Designer: diagnostica grid, alinhamento, ritmo, densidade, peso visual,
  tipografia, cor e aparência genérica.
- Product Designer: identifica ação principal, compreensão, carga cognitiva,
  fricção, contexto e hipótese de uso.
- Design System Manager: avalia se os problemas indicam lacuna sistêmica ou
  solução local.
- Maintainer: avalia duplicação de widgets, ownership, configuração e custo de
  evolução.
- QA: transforma estados, filtros, responsividade e dados em cenários
  observáveis.
- Tech Writer: corrige labels, títulos, empty states, erros e instruções.

### 3. Esse padrão deve virar parte oficial do design system?

- Developer: avalia estabilidade da API, integração, estado e viabilidade de
  implementação.
- Accessibility Specialist: avalia se o padrão cria ou remove barreiras e
  quais validações faltam.
- Designer: avalia coerência visual, tokens, estados e identidade.
- Product Designer: avalia necessidade, contexto, comportamento e evidência de
  uso.
- Design System Manager: emite a classificação obrigatória e critérios de
  maturidade, adoção e governança.
- Maintainer: avalia ownership, abstração, duplicação e custo de evolução.
- QA: define critérios pass/fail para promoção e regressão.
- Tech Writer: decide termo canônico, documentação, exemplo e comunicação da
  mudança.

### 4. Como documentar Modal versus Drawer?

- Developer: documenta contrato de implementação, estado, integração e limites
  técnicos.
- Accessibility Specialist: documenta semântica, foco, teclado e tecnologia
  assistiva de cada padrão.
- Designer: documenta composição, hierarquia, densidade, tokens e estados.
- Product Designer: documenta necessidade, fluxo, contexto e risco de escolha
  errada.
- Design System Manager: documenta regra de governança, exceções e status do
  padrão.
- Maintainer: documenta ownership, dependências e mudança futura.
- QA: documenta critérios de teste, casos negativos e regressão.
- Tech Writer: decide termos canônicos, diferenças, exemplos e interpretações
  erradas.

### 5. Como testar o fallback do Abraxos?

- Developer: define pontos de integração, contrato técnico e transições de
  estado.
- Accessibility Specialist: valida anúncio, foco, recuperação e compreensão
  acessível.
- Designer: valida distinção visual do fallback e consistência dos estados.
- Product Designer: valida compreensão, confiança operacional, próxima ação e
  risco de abandono.
- Design System Manager: avalia se fallback é padrão sistêmico e como medir
  adoção e incidentes.
- Maintainer: avalia centralização, ownership, removibilidade e divergência.
- QA: injeta falhas, valida pass/fail, audit metadata, UI/backend e estados.
- Tech Writer: corrige a mensagem de fallback, explica a limitação e a próxima
  ação.

### 6. Essa implementação está ficando difícil de manter?

- Developer: avalia arquitetura, estado, integração e edge cases concretos.
- Accessibility Specialist: aponta risco de regressão de barreiras quando a
  implementação muda.
- Designer: limita a resposta à fragmentação de estilo, tokens e estados
  visuais.
- Product Designer: avalia se a complexidade técnica já afeta fluxo, feedback
  ou consistência de interação.
- Design System Manager: avalia impacto sistêmico, adoção e governança, sem
  prescrever refatoração.
- Maintainer: decide ownership, ponto de mudança, abstração mínima e plano de
  simplificação.
- QA: identifica superfície de regressão e cobertura necessária.
- Tech Writer: identifica documentação ambígua que aumenta onboarding e uso
  incorreto.

### 7. Qual token usar para erro crítico?

- Developer: usa apenas token oficial evidenciado ou propõe papel semântico sem
  inventar nome.
- Accessibility Specialist: avalia contraste, redundância não cromática e
  anúncio do erro.
- Designer: decide função visual, contraste perceptivo, hierarquia e estados.
- Product Designer: avalia compreensão, ação de recuperação e carga cognitiva.
- Design System Manager: decide se o papel semântico exige padrão global,
  experimento ou decisão oficial.
- Maintainer: avalia centralização, ownership e risco de tokens locais.
- QA: define pass/fail visual, semântico, mobile e regressão.
- Tech Writer: decide nomenclatura canônica, significado e documentação do
  token.

### 8. Como explicar evidence similarity no Audit Drawer?

- Developer: explica origem do valor, contrato de dados e renderização sem
  reclassificar como confiança.
- Accessibility Specialist: avalia semântica, leitura, ordem, linguagem e
  tecnologia assistiva.
- Designer: avalia hierarquia, densidade, contraste e relação com `evidence
  tier`.
- Product Designer: avalia compreensão, interpretação errada e efeito na
  decisão do usuário.
- Design System Manager: avalia consistência entre produtos, governança do
  termo e adoção.
- Maintainer: avalia fonte única, ownership e risco de lógica duplicada.
- QA: testa valor, ausência, fallback, audit metadata e proibição de confiança.
- Tech Writer: define explicação canônica, microcopy e diferença entre
  relevância da evidência e confiança interna.

## Matriz de diferenciação

| Perspectiva | O que prioriza | O que nunca deve fazer | Critério de resposta válida | Exemplo de decisão |
|---|---|---|---|---|
| Developer | Implementação, contrato, estado, integração e edge cases | Inventar API oficial ou substituir a lente por UX genérico | Define implementação e fluxo de estado com limites técnicos | Propõe ownership de `open`, `onConfirm`, loading, erro e integração |
| Accessibility Specialist | Barreiras de acesso, foco, teclado, semântica e tecnologia assistiva | Declarar conformidade ou resultado de tecnologia assistiva sem evidência ou teste | Nomeia falha, impacto, remediação e validação acessível | Exige semântica de diálogo, focus trap, retorno de foco e anúncios |
| Designer | Qualidade visual sistêmica, composição, tokens, ritmo e estados | Substituir análise visual por estratégia, pesquisa ou gosto pessoal | Identifica causa visual concreta, efeito perceptivo e correção | Reequilibra hierarquia, densidade, alinhamento e papel cromático |
| Product Designer | Fluxo, fricção, compreensão, necessidade e validação com usuário | Agir como Product Manager ou apresentar hipótese como fato | Declara ação principal, separa evidência de hipótese e propõe validação | Redesenha confirmação para reduzir ação errada e testa a hipótese |
| Design System Manager | Governança, adoção, exceção, maturidade e impacto sistêmico | Decidir por preferência estética ou agir como Designer, Product Designer ou QA | Classifica a proposta e define aprovação, promoção e métrica | Escolhe padrão experimental com owner, escopo e critério de promoção |
| Maintainer | Simplicidade, ownership, abstração mínima e custo futuro | Propor grande refatoração sem ganho concreto ou usar clean code como argumento | Nomeia owner e ponto futuro de mudança | Mantém dois casos explícitos e adia helper até a regra estabilizar |
| QA | Testabilidade, regressão, estados e critérios pass/fail | Escrever resultado vago ou substituir teste por opinião de produto | Critérios permitem marcar passa ou falha | Falha se duplo clique gerar duas requisições ou estados divergentes |
| Tech Writer | Clareza, termo canônico, microcopy e documentação | Criar termo concorrente ou agir como Designer visual | Nomeia ambiguidade, corrige interpretação e fornece texto acionável | Define `evidence similarity` como relevância da evidência recuperada |

## Exemplo comparativo curto

Pergunta: "Esse padrão deve virar parte oficial do design system?"

### Design System Manager

Classificação: `padrão experimental`. Falta demonstrar demanda em múltiplos
times, owner, documentação, QA, acessibilidade e métrica de adoção antes da
promoção para padrão global.

### Maintainer

Mantenha a primeira implementação local e explícita. A lógica deve ter owner no
módulo que controla a regra. Não abstraia até que duas implementações precisem
mudar juntas e tenham contrato testável.

### Product Designer

Evidência observada: não foi fornecida pesquisa ou telemetria de uso. Hipótese:
o padrão reduz fricção no fluxo recorrente. Valide com teste de tarefa e taxa de
conclusão antes de afirmar que atende à necessidade do usuário.

## Registro do teste

Para cada execução, registrar:

- pergunta;
- perspectiva;
- versão do contrato;
- resposta;
- seções presentes;
- sinais obrigatórios encontrados;
- sinais ausentes;
- evidências usadas;
- limitações declaradas;
- invenções ou contradições;
- decisão de aprovação ou falha;
- diferença observável em relação às outras perspectivas.
