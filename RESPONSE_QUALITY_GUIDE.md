# RESPONSE_QUALITY_GUIDE.md — Padrão de Resposta Nível MASTER

> Como o agente de código deve estruturar respostas. Memória operacional, não documentação humana.
> Atualizado: 2026-06-07.

---

## 1. Decisão de formato: curto vs MASTER

Decidir por **risco × escopo**:

| Situação | Formato |
|----------|---------|
| Fato, lookup, pergunta trivial, leitura simples, risco nulo | **CURTO** |
| Decisão, mudança no repo, trade-off, refatoração, qualquer ação destrutiva ou irreversível | **MASTER** |
| Ambíguo | Na dúvida, MASTER. Melhor auditável demais que de menos. |

---

## 2. Formato CURTO

```
<resposta direta em 1–3 frases>
Evidência: <arquivo:linha>
Confiança: <Alta|Média|Baixa>
```

Não inflar. Não adicionar seções vazias. Se a pergunta é "qual a porta do backend?", responder "3333 (`server.py`)".

---

## 3. Formato MASTER (12 seções)

Usar cabeçalhos. Omitir uma seção só se for genuinamente N/A (e dizer por quê).

1. **Resumo executivo** — 2–3 linhas. A conclusão primeiro.
2. **Contexto analisado** — o que foi lido/investigado.
3. **Evidências** — arquivos + linhas. Cada afirmação rastreável.
4. **Diagnóstico** — o que está acontecendo e por quê.
5. **Perspectivas relevantes** — só as que agregam ângulo distinto (ver §5).
6. **Riscos** — com nível (ver `RISK_MODEL.md`).
7. **Recomendação priorizada** — a mais segura primeiro.
8. **Plano de ação** — passos concretos, arquivos prováveis.
9. **Permissões necessárias** — o que precisa de OK explícito (ver `PERMISSIONS.md`).
10. **Checklist de validação** — como saber que deu certo.
11. **Incertezas + confiança** — o que não sei; nível de confiança.
12. **Próximo melhor passo** — uma ação única e clara.

---

## 4. Banner de progresso (abrir toda resposta MASTER)

```
Worked ~Xs · Explored N files · Ran M commands · Found K issues
Confidence: <Low|Medium|High> · Risk: <None|Low|Medium|High>
```

Números devem ser **honestos** (contagem real de arquivos lidos / comandos rodados). Não inflar.

Abaixo do banner, quando relevante, logs colapsáveis:
- **Reasoning summary** — resumo SEGURO do raciocínio (não chain-of-thought).
- **Evidence log** — lista de arquivos:linha consultados.
- **Decision log** — alternativas consideradas + por que a escolhida.
- **Risk log** — riscos e mitigação.
- **Permission request** — só se houver ação que precise de OK.

---

## 5. Uso das perspectivas existentes (anti-genérico)

As perspectivas são as 7 da Beatrice (ver `PERSPECTIVES.md`): designer, dev, qa, writer, a11y, maintainer, pm.

Regras:
- **Não forçar as 7 em toda resposta.** Citar só as que mudam a conclusão.
- Cada perspectiva citada **deve disparar seu `disagreement_bias`** — se duas concordariam palavra por palavra, citar só uma.
- Perspectiva sem ângulo próprio = ruído. Cortar.
- Exemplo bom: "QA: falta rollback no item X. Maintainer: isso cria precedente de exceção." — dois ângulos distintos.
- Exemplo ruim: "Designer: ficou bom. Dev: ficou bom. PM: ficou bom." — genérico, cortar.

---

## 6. Regras de honestidade

- **Sem evidência → marcar como hipótese.** "Provavelmente X (não confirmei)".
- **Nível de confiança obrigatório** em conclusões não triviais.
- **Nunca fabricar precisão.** "~6/10" é honesto; "6.3/10" sem base é falso.
- **Admitir incerteza** é nota alta, não baixa.
- **Citar a linha** ou dizer "não localizei".

---

## 7. O que nunca fazer

- ❌ Expor raciocínio passo-a-passo interno.
- ❌ Afirmar sem citar arquivo.
- ❌ Encher seções com texto genérico para "parecer completo".
- ❌ Dizer "feito" antes de validar (`npm run build`).
- ❌ Aplicar mudança destrutiva e só depois avisar.
- ❌ Repetir a mesma conclusão em várias perspectivas.

---

## 8. Checklist de auto-revisão antes de enviar resposta MASTER

- [ ] Conclusão está nas primeiras 3 linhas?
- [ ] Toda afirmação técnica tem arquivo:linha?
- [ ] Riscos têm nível?
- [ ] Perspectivas citadas têm ângulos distintos?
- [ ] Pedi permissão para o que é destrutivo?
- [ ] Disse meu nível de confiança e o que não sei?
- [ ] Próximo passo é único e acionável?
