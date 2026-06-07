# PLANO_MIGRACAO.md — Aetheris nav refactor

> Status: **PLANEJAMENTO + EXTRAÇÃO SEGURA**. Nada foi deletado, movido ou fundido.
> Única alteração de código: extração isolada do passo 5 (`CurrentContextPanel.tsx`).
> Base: `aetheris-spec-implementacao.md`. Branch atual: `main`.

---

## 0. Achados de topo (ler antes da tabela)

1. **Config de navegação JÁ é única e centralizada.** Vive em `src/routes.tsx`
   (`appRoutes: AppRouteItem[]`). Consumida por `src/components/Sidebar.tsx:4` e
   `src/components/AppTopBar.tsx`. As **rotas** vivem em `src/App.tsx` (`<Routes>`).
   → Spec seção 0.2 ("centralizar nav") já está 80% feito. Falta: o menu hoje tem
   **9 itens**, o spec quer **6**. E rota ≠ menu (App.tsx e routes.tsx são 2 lugares).

2. **Codebase está ADIANTE do que CLAUDE.md descreve.** Já existem `OraclePage`,
   `SystemPage`, `DevelopersPage`, `EvaluationPage`, `PrinciplesPage`,
   `IntelligencePage`, `ComparisonPage`, `PerspectivesPage` (beatrice). Uma migração
   IA anterior ("Phase IA") já rodou. O spec é a **2ª passada** de consolidação.

3. **"Current Context" NÃO é um componente.** É uma *filter chip* inline em
   `DashboardPage.tsx:48-95`. Não há painel dedicado. Ver Conflitos (§6) e Extração (§5).

4. **Componentes XAI já estão isolados** em arquivos próprios e prop-driven. Não
   precisam de extração — só inventário. Ver §5.

---

## 1. Tabela de mapeamento spec → código

Tags: `[FIX] [MERGE] [MOVE] [INTERNAL] [DELETE] [REDIRECT] [EXPORT-DOCS] [KEEP]`

### 1a. Páginas / rotas

| item do spec | tag | arquivo atual | dependências (quem importa) | risco |
|---|---|---|---|---|
| Oracle `/oracle` | KEEP | `components/OraclePage.tsx` (só envolve `BeatriceChatPage`) | `App.tsx`, `routes.tsx` | baixo |
| Reasoning `/reasoning` | KEEP/MERGE | `components/ReasoningPage.tsx` | `App.tsx`, `routes.tsx` | médio — recebe Intelligence |
| Perspectives `/perspectives` | KEEP | `beatrice/pages/PerspectivesPage.tsx` | `App.tsx`, `routes.tsx` | médio — i18n separado |
| System `/system` | KEEP/MERGE | `components/SystemPage.tsx` | `App.tsx`, `routes.tsx` | médio — recebe manifesto |
| Developers `/developers` | KEEP/MERGE | `components/DevelopersPage.tsx` | `App.tsx`, `routes.tsx` | médio |
| Evaluation `/evaluation` | KEEP/MERGE | `components/EvaluationPage.tsx` | `App.tsx`, `routes.tsx` | médio — recebe Comparison |
| `/intelligence` (página) | REDIRECT→`/reasoning` + DELETE página | `components/IntelligencePage.tsx` | `App.tsx:11`, `routes.tsx` (item menu) | **alto** — conteúdo (skills/engines) deve migrar p/ Reasoning antes |
| `/principles` (página) | REDIRECT→`/system` + MERGE manifesto | `components/PrinciplesPage.tsx` | `App.tsx`, `routes.tsx` | alto |
| `/dashboard` (página) | DELETE + REDIRECT→`/oracle` | `components/DashboardPage.tsx` | `App.tsx`, `routes.tsx` | **alto** — extrair antes (§5) |
| `/comparison` (página) | REDIRECT→`/evaluation#baseline` | `components/ComparisonPage.tsx` | `App.tsx:16`, CTAs em Intelligence/Oracle | alto |
| `/dashboard` no menu | DELETE item | `routes.tsx` (item `LayoutDashboard`) | `Sidebar`, `AppTopBar` | baixo |
| `/intelligence` no menu | DELETE item (vira interno de Reasoning) | `routes.tsx` | `Sidebar`, `AppTopBar` | baixo |
| `/principles` no menu | DELETE item | `routes.tsx` | `Sidebar`, `AppTopBar` | baixo |
| Persona Profile + seletor idioma | KEEP (todas telas) | `AppTopBar.tsx` / `I18nProvider` | global | baixo |

### 1b. Seções a FUNDIR (spec §3) — ids reais

| item do spec | tag | arquivo atual (id da seção) | dependências | risco |
|---|---|---|---|---|
| `session`+`context_panel`+Current Context → `context` (Oracle) | MERGE | `DashboardPage.tsx:48-95` (chip); Oracle **não tem** seção `context` ainda | OraclePage | **alto** — destino inexistente |
| `pipeline`+`confidence` → `pipeline` (Reasoning) | MERGE/INTERNAL | `ReasoningPage.tsx:54` (`pipeline`), `:60` (`confidence`) | ReasoningPage, i18n `pages.reasoning.sections` | médio |
| `active_lens`+`lens_selector` → `lens` (Perspectives) | MERGE | `beatrice/pages/PerspectivesPage.tsx`; `beatrice/domain/perspective/lenses.ts` | PerspectivesPage | médio |
| `lens_comparison`+`live_trial` → `comparison` (Perspectives) | MERGE | `beatrice/services/perspectiveTrial.service.ts`, PerspectivesPage | PerspectivesPage | médio |
| `architecture`+`infrastructure` → `architecture` (Developers) | MERGE/INTERNAL | `DevelopersPage.tsx:55` (`architecture`), `:57` (`infrastructure`) | DevelopersPage, i18n | médio |
| `corpus`+`inspector`+`live_trace` → `corpus` (Developers) | MERGE | `DevelopersPage.tsx:59` (`corpus`), `:60` (`inspector`); `components/ReasoningLiveTrace.tsx`; `ReasoningPage.tsx:61` (`trace`) | DevelopersPage, ReasoningPage | **alto** — `live_trace` cruza 2 páginas |

### 1c. Seções a MOVER (spec §4)

| item do spec | tag | arquivo atual | dependências | risco |
|---|---|---|---|---|
| Current Context (Dashboard) → Oracle `context` | MOVE | `DashboardPage.tsx:48-95` → **extraído** p/ `components/oracle/context/CurrentContextPanel.tsx` | OraclePage (futuro) | médio |
| `inspector` (Developers) → Developers `corpus` | MOVE/MERGE | `DevelopersPage.tsx:60` | DevelopersPage | médio |
| `live_trace` (Reasoning) → Developers `corpus` | MOVE | `ReasoningPage.tsx:61` (`trace`); `components/ReasoningLiveTrace.tsx` | ReasoningPage, DevelopersPage | alto |
| Conteúdo `Comparison` (matriz/diffs) → Evaluation `baseline` | MOVE | `components/comparison/EvaluationMatrix.tsx`, `AnswerPanel.tsx`, `ComparisonInput.tsx`, `ComparisonEmptyState.tsx`, `ComparisonPage.tsx` | App.tsx, CTAs | alto |
| "Beatrice vs LLM" + CTA (Intelligence) → Evaluation `baseline` | MOVE | `components/IntelligencePage.tsx` (bloco compare, i18n `pages.comparison.*`) | IntelligencePage | alto |

### 1d. Seções → CONTEÚDO INTERNO (spec §5)

| item do spec | tag | arquivo atual | dependências | risco |
|---|---|---|---|---|
| `suggestions` (Oracle) | INTERNAL | `beatrice/components/chat/ChatSuggestions.tsx` | BeatriceChatPage | baixo (já é componente) |
| `composer` (Oracle) | INTERNAL | `beatrice/components/chat/ChatInput.tsx` | ChatLayout | baixo |
| `history` (Oracle) | INTERNAL | `beatrice/components/chat/HistoryPanel.tsx`; `hooks/useBeatriceHistory.ts` | ChatLayout | baixo |
| `settings` (Oracle) | INTERNAL | `beatrice/components/chat/SettingsPanel.tsx`; `hooks/useBeatriceSettings.ts` | ChatLayout | baixo |
| `confidence` (Reasoning→pipeline) | INTERNAL | `ReasoningPage.tsx:60` | ReasoningPage | baixo |
| `controls` (Perspectives→lens) | INTERNAL | `beatrice/domain/perspective/calibration.ts`, PerspectivesPage | PerspectivesPage | baixo |
| `infrastructure` (Developers→architecture) | INTERNAL | `DevelopersPage.tsx:57` | DevelopersPage | baixo |
| `live_trial` (Perspectives→comparison) | INTERNAL | `beatrice/services/perspectiveTrial.service.ts` | PerspectivesPage | baixo |

### 1e. DELETE total (spec §7)

| item do spec | tag | arquivo atual | dependências | risco |
|---|---|---|---|---|
| Burndown widget | DELETE | `components/BurndownChart.tsx` | `DashboardPage.tsx:19,125` | baixo |
| Velocity widget | DELETE | `components/VelocityChart.tsx` | `DashboardPage.tsx:13,116` | baixo |
| Sprint health | DELETE | `components/SprintHealthList.tsx` | `DashboardPage.tsx:8,127` | baixo |
| Task status (sprint) | DELETE | `components/TaskStatusChart.tsx` | `DashboardPage.tsx:17,119` | baixo |
| Dashboard como layout | DELETE | `components/DashboardPage.tsx` + `hooks/useDashboardData.ts` + `data/mockDashboard.ts` + `services/dashboardService.ts` | `App.tsx:35`, `routes.tsx` | **alto** — extrair Current Context + XAI antes |
| Aba `reference` (Developers) | DELETE | `DevelopersPage.tsx:62` (`reference`) + i18n `pages.developers.sections.reference` | DevelopersPage | baixo |
| Botão `UX Evaluation` | DELETE | `DashboardPage.tsx:51,53` (chip "UX evaluation"/"Avaliação UX") | DashboardPage | baixo |
| Seções XAI/anatomia do Dashboard | DELETE (não recriar) | `DashboardPage.tsx:130,147` | DashboardPage | médio — ver §5 (reuso, não delete cego) |

### 1f. EXPORT-DOCS (spec §8)

| item do spec | tag | arquivo atual | dependências | risco |
|---|---|---|---|---|
| `decisions`/ADRs (Developers) | EXPORT-DOCS | `components/DesignDecisionsPage.tsx`; `DevelopersPage.tsx:61` (`decisions`); `beatrice/domain/decision/*` | DevelopersPage | médio |
| 48 regras + conformidade (Principles) | EXPORT-DOCS | `components/GuidelinesPage.tsx`; `PrinciplesPage.tsx:38` (`guidelines`) | PrinciplesPage | médio |
| Evolution / trajectory (System) | EXPORT-DOCS | `SystemPage.tsx:61` (`timeline`); i18n `pages.system.sections.timeline` | SystemPage | médio |

### 1g. Botões (spec §9)

| item do spec | tag | arquivo atual | dependências | risco |
|---|---|---|---|---|
| `Document Base` → `/developers#corpus`, renomear "Corpus" | FIX | chip em `DashboardPage.tsx:51,53` ("Document base"/"Base documental") | DashboardPage | médio — hoje é filtro, não link |
| `UX Evaluation` | DELETE | `DashboardPage.tsx:51,53` | DashboardPage | baixo |
| CTA "comparar" (Intelligence) → `/evaluation#baseline` | FIX | `IntelligencePage.tsx` (CTA p/ `/comparison`); `App.tsx:16` | IntelligencePage | alto |

---

## 2. Config única de navegação (spec §0.2)

**JÁ EXISTE.** Não criar arquivo novo.

- **Fonte única do menu:** `src/routes.tsx` → `appRoutes`.
- **Consumidores:** `src/components/Sidebar.tsx:4`, `src/components/AppTopBar.tsx`.
- **Definição das rotas (separada):** `src/App.tsx` → `<Routes>` (linhas ~70-110).

**Gap real:** o menu e as rotas estão em **2 arquivos**. `routes.tsx` controla o que
aparece no menu; `App.tsx` controla o que resolve. Para a árvore final de 6 páginas:
1. Reduzir `appRoutes` de 9 → 6 itens (remover dashboard, intelligence, principles).
2. Manter as rotas removidas em `App.tsx` como `<Navigate>` (redirects §6 do spec).
3. Sugestão: mover os redirects para um array declarativo em `routes.tsx`
   (`legacyRedirects`) para a nav ser 100% data-driven de um lugar só.

---

## 3. Chaves i18n quebradas (padrão `pages.*.sections.*.label/.role`)

**Mecânica do bug:** cada página itera um array local de seções e chama
`t(\`pages.<page>.sections.<id>.label\`)`. Se o `id` do array **não tem entrada**
em `translations.ts`, o `t()` devolve a própria chave → texto cru na tela.

Varredura completa (todas as páginas com esse padrão), comparando ids do componente
vs chaves em `translations.ts`:

| Página | id no componente | chave em translations.ts | status |
|---|---|---|---|
| Developers | `rag` (`DevelopersPage.tsx:56`) | tem `pipeline`, **falta `rag`** | ❌ **QUEBRADA** |
| Evaluation | `explanation` (`EvaluationPage.tsx:61`) | tem `rubric`, **falta `explanation`** | ❌ **QUEBRADA** |
| Evaluation | `perspective` (`EvaluationPage.tsx:62`) | tem `perspectives` (plural), **falta `perspective`** | ❌ **QUEBRADA** |
| System | overview/components/patterns/tokens/decisions/retrieval/timeline | todas presentes | ✅ ok |
| Reasoning | pipeline/intent/retrieval/synthesis/alternatives/confidence/adaptation/trace | todas presentes | ✅ ok |
| Principles | manifesto/foundations/guidelines | todas presentes | ✅ ok |

**Resultado:** as **3 quebradas = exatamente as 3 do spec §0.1**. Nenhuma chave
quebrada extra encontrada nesse padrão. ✅

**Atenção (não no spec):**
- O arquivo tem **3 locales**: `pt-BR`, `pt-PT`, `en-US`. As 3 chaves faltam em
  **todos os 3 blocos**. O fix precisa cobrir os 3, não só EN/PT.
- Há **descasamento de nomes id↔chave** que o spec já resolve de forma esperta:
  o spec quer renomear a seção para o id `rag`/`explanation`/`perspective`. Então o
  fix correto não é só "traduzir": é **alinhar** id do componente e chave do i18n
  (renomear `pipeline`→`rag` em Developers? NÃO — Developers já tem outra `pipeline`.
  Criar chave `rag` nova; renomear `rubric`→`explanation` e `perspectives`→`perspective`
  em Evaluation, OU adicionar aliases). Decisão fica para a fase de execução.

**Pendências i18n de seções inexistentes (gap maior que o spec):** Oracle e
Perspectives **não têm** bloco `pages.oracle.sections` nem `pages.perspectives.sections`
em `translations.ts`. As 4 seções de Oracle (`conversation/sources/audit/context`) e as
3 de Perspectives (`lens/radar/comparison`) do spec §2 **ainda não existem** como i18n
nem como nav interna. Ver §6.

---

## 4. Extração segura do Dashboard (passo 5) — FEITO

### 4a. Current Context → extraído ✅
- **Criado:** `src/components/oracle/context/CurrentContextPanel.tsx`
- Extração fiel do bloco de chips inline `DashboardPage.tsx:48-95`, agora
  prop-driven (`locale`, `activeFilter`, `onSelect`, `filters?`) + helper
  `getDefaultContextFilters(locale)`.
- **NÃO** modifiquei `DashboardPage.tsx`. **NÃO** liguei em Oracle. Só isolei.
- **Compila sozinho:** `tsc --noEmit` → `EXIT=0`. ✅

### 4b. Componentes XAI reaproveitáveis → JÁ isolados ✅
Não precisam extração — já são arquivos próprios, prop-driven, sem acoplamento ao
Dashboard (importam só `i18n` + `types/dashboard`):

| componente | arquivo | usa Dashboard? |
|---|---|---|
| XAIExplanationPanel | `components/XAIExplanationPanel.tsx` | só tipo `ExplanationPanelData` |
| SourceAttributionPanel | `components/SourceAttributionPanel.tsx` | só tipo `PredictionSource` |
| OracleGuidancePanel | `components/OracleGuidancePanel.tsx` | só tipo `OracleGuidanceData` |
| AIPredictionCard | `components/AIPredictionCard.tsx` | só tipo `AIPrediction` |
| MetricCard | `components/MetricCard.tsx` | só tipo `Metric` |

**Recomendação para a fase de execução:** ao deletar o Dashboard, mover estes 5
arquivos para `components/oracle/xai/` e desacoplar do `types/dashboard.ts` (os tipos
`ExplanationPanelData`, `PredictionSource` etc. precisam migrar junto, senão o delete
de `mockDashboard`/`dashboardService` quebra os imports). Por isso marquei "DELETE
seções XAI" como risco médio em §1e — não é delete cego.

---

## 5. CONFLITOS spec ↔ código real

1. **Oracle não tem seção `context` (nem `conversation/sources/audit`).**
   `OraclePage.tsx` só renderiza `<BeatriceChatPage />`. As 4 seções do spec §2 para
   Oracle **não existem** como nav/i18n. O MERGE "Current Context → Oracle context"
   tem **destino inexistente** — precisa ser criado, não fundido.

2. **"Current Context" não é componente.** Spec §4/§5/§7 trata como entidade
   extraível. No código é uma *filter chip* + estado local em `DashboardPage.tsx`. Não
   há painel "session state + lens" para mover — ele precisa ser **construído** no
   Oracle. Minha extração (`CurrentContextPanel.tsx`) preserva o que existe (os chips);
   o resto do conteúdo da seção `context` é trabalho novo, não migração.

3. **Redirects do spec §6 ainda não existem; e há redirects que o spec não previu.**
   `App.tsx` hoje **serve** `/dashboard`, `/intelligence`, `/principles`, `/comparison`
   como páginas reais (não redirects). O spec quer torná-las `<Navigate>`. Além disso
   `App.tsx:88-100` já tem redirects legados (`/main`, `/beatrice-chat`, `/components`,
   etc.) que o spec não menciona — **manter**, não quebrar.

4. **`/comparison` redireciona para `/evaluation#baseline`, mas Evaluation não tem
   seção `baseline`.** `EvaluationPage.tsx` tem ids `overview/sus/clarity/.../audit`.
   **Não existe `baseline`.** O spec §2 lista Evaluation com 4 seções
   (`methodology/instruments/baseline/status`) que **não batem** com as 12 atuais. A
   página inteira de Evaluation precisa ser reescrita para as 4 seções finais — o
   âncora `#baseline` aponta para algo inexistente hoje.

5. **Spec §2 reduz drasticamente as seções, mas as páginas têm o dobro.** Exemplos:
   - Reasoning: spec quer 4 (`overview/skills/engines/pipeline`); código tem 8
     (`pipeline/intent/retrieval/synthesis/alternatives/confidence/adaptation/trace`).
     **`overview/skills/engines` não existem** em `ReasoningPage`; `skills`/`engines`
     vivem hoje em `IntelligencePage` (`CognitiveSkillCard`, `OracleEngineCard` em
     `components/oracle/`). Confirma o MERGE Intelligence→Reasoning.
   - System: spec quer 4 (`manifesto/components/patterns/tokens`); código tem 7.
     `manifesto` não existe em System (está em `PrinciplesPage`). Confirma MERGE.
   - Developers: spec quer 4 (`architecture/rag/integration/corpus`); código tem 8.
   - Evaluation: spec quer 4; código tem 12.

6. **Botões `Document Base` / `UX Evaluation` são filter chips, não botões com rota.**
   Spec §9 trata como botões a religar/remover. No código (`DashboardPage.tsx:51-53`)
   são strings de filtro do dashboard. "Religar Document Base → `/developers#corpus`"
   significa **criar um link novo**, não corrigir um href existente — não há href hoje.

7. **`/comparison` está fora do menu mas dentro do `<Routes>`** (`App.tsx:79`,
   comentário "reachable via CTA"). Os CTAs que apontam para `/comparison` vivem em
   `IntelligencePage` e (segundo comentário) Oracle — precisam virar `/evaluation#baseline`.

8. **Persona/i18n de Perspectives é um subsistema à parte** (`beatrice/`), com i18n
   próprio (`translations.ts:194` bloco `perspectives:`, e `beatrice/domain/perspective/
   localization.ts`). As seções `lens/radar/comparison` do spec não existem ali com
   esses ids. Migração de Perspectives toca 2 sistemas de i18n.

---

## 6. Ordem segura sugerida (não executada)

Alinhada ao spec §10, com os gaps acima:
1. i18n: criar `rag`/`explanation`/`perspective` nos **3 locales** (+ criar blocos
   `pages.oracle.sections` e `pages.perspectives.sections` que faltam).
2. Centralizar redirects em `routes.tsx` (`legacyRedirects`), trocar páginas
   `/dashboard /intelligence /principles /comparison` por `<Navigate>` **depois** de
   migrar conteúdo.
3. Construir seção `context` em Oracle e wire do `CurrentContextPanel` extraído.
4. Migrar conteúdo Intelligence→Reasoning (skills/engines) e Principles→System (manifesto).
5. Mover Comparison/EvaluationMatrix → Evaluation `baseline` (criar a seção).
6. Extrair XAI panels + tipos p/ `components/oracle/xai/` antes de deletar Dashboard.
7. DELETE widgets sprint + DashboardPage + `reference`.
8. Reduzir `appRoutes` 9→6; validar nenhum href órfão p/ rotas removidas.

---

## Arquivos entregues nesta etapa
- `PLANO_MIGRACAO.md` (este)
- `src/components/oracle/context/CurrentContextPanel.tsx` (extração isolada, compila, não religada)
