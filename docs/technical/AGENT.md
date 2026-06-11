# AGENT.md — Memória Operacional do Agente

> Guia de comportamento para o agente de IA que opera **sobre este repositório** (Claude Code).
> NÃO confundir com Abraxos (o oráculo RAG dentro do app). Este arquivo governa o agente de código.
> Fonte de verdade comportamental. Ler no início de cada sessão. Atualizado: 2026-06-07.

---

## 0. Os dois agentes deste projeto

| Agente | O que é | Governado por |
|--------|---------|---------------|
| **Abraxos** | Oráculo RAG dentro do app (perspectivas, raciocínio, calibração, laboratório) | `prompts/`, `cognition/`, `server.py`, `src/beatrice/` |
| **Agente de código** (este) | Claude operando sobre o repo (lê, edita, planeja) | `AGENT.md`, `PERMISSIONS.md`, `RISK_MODEL.md`, `EXECUTION_MODES.md`, `CLAUDE.md` |

Quando o usuário fala em "perspectivas", "raciocínio visível", "calibração" → quase sempre é **Abraxos**.
Quando fala em "modo Plan/Execute/Rollback", "permissão antes de mudar", "diff preview" → é o **agente de código**.

---

## 1. Princípios inegociáveis

1. **Nunca aplicar mudança destrutiva sem permissão explícita.** Ver `PERMISSIONS.md`.
2. **Separar diagnóstico → evidência → recomendação → execução.** Nunca colapsar em "já fiz".
3. **Citar arquivos e linhas** em toda afirmação técnica. Sem evidência, é hipótese — marcar como tal.
4. **Nunca expor chain-of-thought interna.** Mostrar apenas resumo seguro (ver §4 e `RESPONSE_QUALITY_GUIDE.md`).
5. **Não inventar.** Se não foi lido no código, não é fato. Verificar antes de afirmar.
6. **Respeitar a fonte de verdade existente** antes de propor sistemas novos (ex: perspectivas → ler `PERSPECTIVES.md` e `docs/PERSPECTIVES-BLUEPRINT.md` primeiro).
7. **Não editar artefatos gerados.** Ver `GENERATED_FILES.md`.

---

## 2. Mapa de fontes de verdade

| Domínio | Fonte de verdade | NÃO editar |
|---------|------------------|-----------|
| Navegação | `src/routes.tsx` (`appRoutes`) + `src/App.tsx` (`<Route>`) | — |
| Tokens visuais | `tailwind.config.ts` | `tailwind.config.js/.d.ts` |
| Config Vite | `vite.config.ts` | `vite.config.js/.d.ts` |
| Perspectivas (Abraxos) | `prompts/cognitive_profiles.py` + `src/beatrice/types/beatrice.ts` (`ProfileId`) + `domain/perspective/lenses.ts` | — |
| Backend chat | `server.py` | `server.cjs` (deprecated) |
| Tokens → uso | `TOKENS.md` | — |
| Evals | `evals/cases/*.jsonl` + `laboratory/cases.py` | — |
| Arquitetura | `ARCHITECTURE.md` | — |

---

## 3. Espelhamento crítico (sincronizar SEMPRE os dois lados)

Estas estruturas existem em duplicata e precisam ficar consistentes. Mudar uma exige mudar a outra:

| Conceito | Lado A (Python) | Lado B (TypeScript) | Lado C (extra) |
|----------|-----------------|---------------------|----------------|
| Perspectivas | `prompts/cognitive_profiles.py` (`COGNITIVE_PROFILES`, 7) | `lenses.ts` (`PERSONA_STRATEGIES`, 8 c/ general) + `beatrice.ts` (`ProfileId`) | `PerspectivesPage.tsx` (`LENS_INSTRUMENTATION`), `evals/*.jsonl` (`perspective_expectations`), `server.py` (`ALLOWED_LABORATORY_PROFILES`), `automation.py` (`AUTOMATED_PROFILES`) |
| Calibração | `laboratory/calibration.py` (deriva de `COGNITIVE_PROFILES`) | `domain/perspective/calibration.ts` (localStorage) | — |

⚠️ **Renomear uma chave de perspectiva toca ≥9 lugares + dados persistidos (localStorage, SQLite, JSONL).** Tratar como alto risco. Preferir "manter chave, mudar label". Ver `PERSPECTIVES.md`.

---

## 4. Como responder (resumo — detalhe em RESPONSE_QUALITY_GUIDE.md)

- **Pergunta trivial / lookup / risco nulo →** resposta curta: resposta + 1 evidência + confiança.
- **Decisão / mudança / trade-off / qualquer ação no repo →** resposta MASTER (12 seções).
- Sempre abrir ação não-trivial com banner de progresso auditável:
  ```
  Worked Xs · Explored N files · Ran M commands · Confidence: <Low|Med|High> · Risk: <…>
  ```
- Nunca passo-a-passo oculto. Só resumo seguro + evidence log + decision log + risk log.

---

## 5. Antes de qualquer ação (preflight)

- [ ] Li a fonte de verdade relevante? (§2)
- [ ] A ação é destrutiva/irreversível? → exige permissão (`PERMISSIONS.md`)
- [ ] Toca espelhamento? (§3) → planejar os dois lados
- [ ] Toca artefato gerado? (`GENERATED_FILES.md`) → parar
- [ ] Classifiquei risco/impacto/confiança? (`RISK_MODEL.md`)
- [ ] Sei como validar depois? (`npm run build`, testes, etc.)

## 6. Depois de qualquer ação (postflight)

- [ ] `npm run build` passa (type-check + build)
- [ ] Espelhamento sincronizado (§3)
- [ ] Registrei a decisão em `DECISION_LOG.md` se foi não-trivial
- [ ] Resumi o que mudou, por quê, e o próximo passo

---

## 7. Comandos de validação

```bash
npm run build          # tsc -b + vite build — gate principal
npm run test:rag       # pipeline RAG e2e
npm run test:beatrice  # capacidades do Abraxos; nome técnico mantido
python3 -c "from laboratory.cases import load_case_set; print(load_case_set('beatrice-core-v1').public_metadata())"  # valida evals
```

---

## 8. Documentos operacionais relacionados

| Doc | Para quê |
|-----|----------|
| `RESPONSE_QUALITY_GUIDE.md` | Formato de resposta MASTER |
| `RISK_MODEL.md` | Escala de risco/impacto/confiança |
| `EXECUTION_MODES.md` | Modos Audit/Plan/Execute/Review/Rollback |
| `PERMISSIONS.md` | O que exige confirmação |
| `PERSPECTIVES.md` | Mapa das 7 perspectivas + decisões travadas |
| `DECISION_LOG.md` | Histórico de decisões |
| `TOKENS.md` | Tokens → classe correta |
| `GENERATED_FILES.md` | Artefatos que não se edita |
| `ARCHITECTURE.md` | Onde criar cada tipo de arquivo |
