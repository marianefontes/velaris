# PERSPECTIVES.md — Mapa Operacional das Perspectivas da Beatrice

> Fonte de verdade operacional para as perspectivas cognitivas. Resume o que já existe no código,
> registra as decisões travadas e reconcilia com `docs/PERSPECTIVES-BLUEPRINT.md`.
> Atualizado: 2026-06-07.

---

## 1. Fonte de verdade (onde as perspectivas vivem)

| Camada | Arquivo | Conteúdo |
|--------|---------|----------|
| Backend (lógica real) | `prompts/cognitive_profiles.py` | `COGNITIVE_PROFILES` — 7 perfis com heurísticas, vocabulário, fears, disagreement_bias, anti_convergence, calibração |
| Tipo (frontend) | `src/beatrice/types/beatrice.ts:199` | `ProfileId` = 8 (`general` + 7) |
| Estratégias (frontend) | `src/beatrice/domain/perspective/lenses.ts` | `PERSONA_STRATEGIES` — espelha os perfis para a UI |
| Instrumentação UI | `src/beatrice/pages/PerspectivesPage.tsx` | `LENS_INSTRUMENTATION` — espelha os números de calibração |
| Calibração | `laboratory/calibration.py` | deriva de `COGNITIVE_PROFILES` automaticamente |
| Evals | `evals/cases/*.jsonl` | `perspective_expectations` por chave |
| Lab allow-list | `server.py` (`ALLOWED_LABORATORY_PROFILES`), `laboratory/automation.py` (`AUTOMATED_PROFILES`) | 7 chaves |
| Blueprint estratégico | `docs/PERSPECTIVES-BLUEPRINT.md` | visão "persona→perspective" (já ~implementada) |

**As perspectivas NÃO são labels visuais.** São injetadas no system prompt via `build_cognitive_profile_prompt` e dirigem o raciocínio. Confirmado em `cognitive_profiles.py:272-358`.

---

## 2. As 7 perspectivas ativas (estado atual)

| Chave | Nome atual | Persona | technicality | risk_sens. | depth | Foco (anti-convergência) |
|-------|------------|---------|:------------:|:----------:|:-----:|--------------------------|
| `designer` | Design Architect | Elena Voss | 0.35 | 0.55 | medium | Percepção, hierarquia, fluxo cognitivo |
| `dev` | Engineering Strategist | Adrian Vale | 0.90 | 0.65 | high | Contratos, composição, custo de migração |
| `qa` | Quality Intelligence | Maya Sterling | 0.70 | 0.95 | high | Falhas, edge cases, regressão |
| `writer` | Documentation Oracle | Lucien Ward | 0.45 | 0.40 | high | Clareza semântica, descoberta, modelo mental |
| `a11y` | Accessibility Specialist | Iris Holloway | 0.75 | 0.90 | high | Cognição inclusiva, AT, HTML semântico |
| `maintainer` | Design System Steward | Kai Renner | 0.55 | 0.80 | high | Trajetória do sistema, precedente, drift |
| `pm` | Product Intelligence | Sofia Mercer | 0.30 | 0.50 | medium | Outcomes, adoção, eficiência de workflow |

`general` é fallback neutro (não selecionável na UI; filtrado por `getPersonaOptions` em `models.ts`).

---

## 3. Calibração (3 knobs, fixos vs ajustáveis)

Ajustável pelo usuário em `/perspectives` (persistido em localStorage `beatrice.calibration.{chave}` e SQLite):
- `depth` (low/medium/high)
- `technicality` (0..1)
- `risk_sensitivity` (0..1)

**Imutáveis** (definem a identidade da lente): vocabulary, fears, heuristics, disagreement_bias, anti_convergence.
Drift máximo da calibração automática: **±0.15** (`laboratory/calibration.py:MAX_DEFAULT_DRIFT`).

---

## 4. Decisões travadas (sessão 2026-06-07)

| # | Decisão | Detalhe |
|---|---------|---------|
| D1 | `designer` → **Product Designer** | Evoluir a lente existente (não criar 8ª). Total continua 7. |
| D2 | Adicionar dimensão de **pesquisa** ao Product Designer | Hipóteses, evidência qualitativa/quantitativa, formas de validação. |
| D3 | `pm` → **Design System Manager** | Evoluir identidade (adoção, roadmap, governança, critérios de contribuição). |
| D4 | **Manter chaves internas estáveis** | `pm` e `designer` permanecem como chaves. Muda só label/identidade. **Zero migração de dados.** |
| D5 | Workspaces faltantes | Criar `AccessibilityWorkspace` e `MaintainerWorkspace` (a11y/maintainer não tinham UI dedicada). |

**Consequência de D4 (crítica):** como as chaves não mudam, nada em localStorage/SQLite/JSONL quebra. A evolução vira edição de strings de identidade nos espelhos (§1), não rename. Isso rebaixa o risco de **High** para **Medium**.

---

## 5. Reconciliação com o blueprint (CONFLITO a resolver)

`docs/PERSPECTIVES-BLUEPRINT.md` §2.1 **deliberadamente**:
- **Adiou UX Researcher** ("overlaps heavily with `pm` e `designer`; signal-to-noise baixo").
- Atribuiu **governança ao `maintainer`** ("Design System Maintainer" = drift, precedente, contribuição).

As decisões D2 e D3 **divergem do blueprint**:

| Tensão | Blueprint diz | Decisão atual diz | Como resolver |
|--------|---------------|-------------------|---------------|
| Pesquisa no design | UX Researcher adiado (baixo sinal) | D2 adiciona pesquisa ao Product Designer | Adicionar como *dimensão leve* (hipótese + validação), não como perfil cheio. Não recriar UX Researcher. |
| Governança | `maintainer` é a lente de governança | D3 dá governança ao DSM | **Demarcar fronteira** (§6). Não duplicar. |

⚠️ Antes de executar D2/D3 em código (Fase 5), atualizar o blueprint para refletir esta evolução, senão cria drift de documentação (preocupação Tech Writer + Maintainer).

---

## 6. Fronteira DSM × Maintainer (evitar sobreposição)

Como ambos tocam "governança", separar explicitamente:

| Dimensão | **Design System Manager** (`pm`) | **Maintainer** (`maintainer`) |
|----------|----------------------------------|-------------------------------|
| Pergunta central | "Isso vale a pena e deve virar padrão?" | "Isso é saudável para o sistema a longo prazo?" |
| Foco | Valor estratégico, priorização, adoção, roadmap, custo/benefício | Saúde técnica, drift, precedente, dívida, deprecação |
| Horizonte | Próximo trimestre / decisão de produto | Trajetória de 2 anos / lei do sistema |
| Métrica típica | Adoção, completion, ROI da iniciativa | Consistência, drift, fricção de contribuição |
| Quando usar | Decidir o que entra no DS | Decidir o impacto de longo prazo de uma exceção |

---

## 7. Product Designer — escopo da evolução (D1+D2)

Lente evoluída a partir de `designer`, adicionando pesquisa **sem** virar UX Researcher cheio:

- Mantém: percepção, hierarquia, affordance, fluxo cognitivo, microinterações.
- Adiciona: usabilidade, necessidades do usuário, contexto de uso, **hipóteses de usuário**, **formas de validação** (qualitativa/quantitativa), evidência por trás da decisão.
- Perguntas que passa a responder: "A solução está clara?", "Como validar essa hipótese?", "Há evidência suficiente?".

---

## 8. Plano de execução das mudanças de perspectiva (Fase 5 — NÃO executado ainda)

Ordem segura, dado D4 (chaves estáveis):

1. Atualizar identidade de `pm`→DSM e `designer`→Product Designer em `prompts/cognitive_profiles.py` (name, title, specialty, focus, heuristics, vocabulary).
2. Espelhar labels em `lenses.ts` (`PERSONA_STRATEGIES[pm/designer].label/role/...`) e em `localization.ts`.
3. Atualizar `PerspectivesPage.tsx` se exibir nomes hardcoded.
4. Atualizar `docs/PERSPECTIVES-BLUEPRINT.md` (reconciliação §5).
5. **Não** tocar: `ProfileId` (chaves iguais), `ALLOWED_LABORATORY_PROFILES`, `AUTOMATED_PROFILES`, evals JSONL, localStorage, SQLite.
6. Validar: `npm run build` + carregar `/perspectives` + smoke do chat com cada lente.

Risco resultante: **Medium** (edita caminho ativo de prompt, mas reversível e sem migração).

---

## 9. Workspaces (D5) — estado

| Perspectiva | Workspace | Status |
|-------------|-----------|--------|
| designer, dev, pm, qa, writer | existentes em `components/workspaces/` | ✅ |
| a11y, maintainer | — (caíam no fallback designer) | ➕ adicionados nesta sessão |

Registry: `components/workspaces/PersonaWorkspace.tsx`. Workspaces são composições puras sobre `usePersonaContext()` — aditivas, sem efeito nos perfis existentes.
