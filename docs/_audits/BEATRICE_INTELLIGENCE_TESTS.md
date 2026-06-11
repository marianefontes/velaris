# Beatrice Intelligence Tests

> Conjunto obrigatório de testes manuais de inteligência da Beatrice.
> Última atualização: 2026-06-11.
> Testes automatizados correspondentes: `tests/agent/test_critical_intelligence.py`,
> `tests/agent/test_decision_rules.py`, `tests/agent/test_runtime.py`,
> `tests/agent/test_understanding.py`, `tests/agent/test_sse.py`.

## Como avaliar cada teste

Para cada pergunta, verificar:

1. Identificou a intenção correta?
2. Extraiu as entidades corretas (componente, intent, state, contexto)?
3. Escolheu a estratégia de resposta correta?
4. Recuperou evidência correta (catálogo canônico antes do RAG genérico)?
5. Respondeu no idioma certo?
6. Citou fonte?
7. Indicou confiança textual (alta, média, baixa, não determinada)?
8. Declarou limite quando a evidência é parcial ou inferida?
9. Deu recomendação prática?
10. Evitou alucinação (componente, prop, intent, token, import inexistente)?
11. Considerou acessibilidade?
12. Diferenciou quando usar e quando não usar?
13. Gerou código quando a persona Developer ou a pergunta técnica pediu?

## Testes

### Implementação de componente (crítico)

1. "Como eu implemento o componente Button usando os intents primary, secondary, positive e negative sem quebrar acessibilidade?"
   - Esperado: resposta útil, nunca bloqueada. Recomendação baseada no catálogo
     canônico do Button (intents, states, accessibility, do, dont). Snippet
     conceitual sem import inventado, com aviso de exemplo conceitual.
   - Automatizado: `test_button_intents_question_is_never_blocked_with_empty_retrieval`,
     `test_button_intents_question_recovers_from_weak_retrieval`.

2. "Como implemento Button com intent negative e loading?"
   - Esperado: intent negative e state loading citados do catálogo, cuidado com
     duplo envio, disabled real durante loading.
   - Automatizado: `test_button_negative_loading_question_is_composable`.

3. "Me dê um exemplo de código para Radio Button acessível."
   - Esperado: snippet conceitual, agrupamento com rótulo de grupo, navegação por teclado.

4. "Como uso Checkbox com estado indeterminate?"
   - Esperado: se o estado constar no catálogo, usar; se não constar, declarar limitação
     sem inventar prop.

5. "Como implemento Selectable Chip para filtros?"
   - Esperado: recomendação do catálogo com estados e acessibilidade.

6. "Como faço um botão só com ícone sem quebrar acessibilidade?"
   - Esperado: aria-label obrigatório, alvo mínimo, foco visível.

7. "Me mostre um exemplo de Switch com label claro."
   - Esperado: snippet conceitual com relação label/control.

### Comparação

8. "Checkbox ou radio para escolher apenas uma opção?"
   - Esperado: recomendar Radio Button, critério de cardinalidade da escolha,
     erro comum e acessibilidade.
   - Automatizado: `test_comparison_question_gives_decision_criterion`,
     `test_checkbox_vs_radio_rule_resolves_both_directions`.

9. "Quando uso switch em vez de checkbox?"
   - Esperado: alternância binária imediata vs seleção múltipla ou consentimento.

10. "Como deixo um botão destrutivo acessível?"
    - Esperado: não depender só de cor, label textual claro, confirmação para destrutivo.

### Recomendação de componente

11. "Qual componente uso para seleção compacta de filtros?"
    - Esperado: Selectable Chip com fonte do catálogo.

12. "O Velaris tem date picker?"
    - Esperado: sim, componente date-picker existe no catálogo; responder com dados canônicos.

13. "Qual componente devo usar para mostrar o nível de confiança de uma resposta da IA?"
    - Esperado: Confidence Badge (componente XAI do catálogo).

### Padrões e limites de uso

14. "Quando eu não devo usar modal?"
    - Esperado: usar when_not_to_use do Modal/Dialog.

15. "Qual padrão devo usar para estruturar um onboarding?"
    - Esperado: padrão documentado do corpus, ou limitação declarada.

### Tokens

16. "Qual token de cor devo usar para destaque da marca?"
    - Esperado: token documentado, valor se existir, uso correto, sem inventar token.

### XAI

17. "Por que a Beatrice recomendou esse componente?"
    - Esperado: fontes usadas, nível de confiança, limitação, evidence_basis.

18. "Qual a diferença entre usar a Beatrice e um ChatGPT genérico?"
    - Esperado: evidência governada do próprio Velaris, fontes citadas, confiança calibrada.

### Anti-alucinação e fora de escopo

19. "Me recomende um componente que não existe no Velaris."
    - Esperado: não inventar; declarar que o componente não está no catálogo e sugerir
      o componente documentado mais próximo.
    - Automatizado: `test_unknown_component_does_not_get_invented_recommendation`.

20. "Tenho três botões primary no mesmo modal. Isso está certo?"
    - Esperado: modo auditor; identificar violação da regra de uma ação primária por
      região, explicar risco, recomendar hierarquia primary, secondary.

### Idioma

21. "Explique em português." | 22. "Explain in English." | 23. "Explica isto em PT-PT."
    - Esperado: resposta no idioma pedido, mantendo o contexto da sessão.

### Controle (não regressão)

24. "Qual é a previsão do tempo para amanhã?"
    - Esperado: fora de escopo, bloqueio educado com sugestão de pergunta relacionada.
    - Automatizado: `test_out_of_scope_question_remains_blocked`.
