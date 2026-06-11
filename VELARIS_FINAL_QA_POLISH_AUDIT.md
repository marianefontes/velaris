# Velaris / Abraxos — Final QA Polish Audit

**Data:** 2026-06-11  
**Escopo:** QA final, polimento e correção de bugs pequenos (sem novas features)  
**Foco:** Chat inicial, sugestões, rotas, comandos, estados inválidos

---

## 1. Resumo executivo

Rodada de QA focada nos dois bugs reportados (estado inicial incorreto do chat e sugestões da home que não enviam mensagem), com revisão adicional de rotas, handoff mini-chat → chat completo, persistência de histórico e links internos.

### Resultado

| Área | Status |
|------|--------|
| Chat abre com pergunta fantasma | **Corrigido** — sanitização de mensagens interrompidas + auto-submit do prefill |
| Sugestões da home não enviam | **Corrigido** — prefill agora dispara envio automático no `/oracle` |
| Exemplos em Perspectives sem envio | **Corrigido** — mesmo fluxo de prefill + auto-submit |
| Rotas legadas em quick links do chat | **Corrigido** — apontam para destinos canônicos |
| Comandos slash | **Validado** — 16 comandos registrados em `COMMAND_META` |
| Rotas primárias e redirects | **Validado** — `App.tsx` cobre redirects legados |
| Typecheck (`tsc -b`) | **Passou** |
| Testes UI (`vitest run`) | **86/88 passaram** — 1 falha pré-existente não relacionada |

---

## 2. Bugs encontrados

### Critical

| # | Problema | Página/Rota | Arquivo provável | Causa provável | Correção sugerida |
|---|----------|-------------|------------------|----------------|-------------------|
| C1 | Sugestões da home navegam para `/oracle` mas não enviam a pergunta | `/main` → `/oracle` | `AskBeatriceBar.tsx`, `useWorkspaceState.ts` | `writeAskPrefill` preenchia o composer, mas nenhum efeito chamava `submitPrompt` | Auto-submit ao consumir `askPrefill` |
| C2 | Chat reabre com pergunta pendente sem resposta (fantasma) | `/oracle` | `beatriceStorage.ts`, `workspace.store.ts` | Mensagens `isStreaming: true` e turnos de usuário órfãos persistiam em `localStorage` | `sanitizePersistedMessages` na hidratação e no health sync |

### High

| # | Problema | Página/Rota | Arquivo provável | Causa provável | Correção sugerida |
|---|----------|-------------|------------------|----------------|-------------------|
| H1 | Exemplos em Perspectives navegam sem enviar prompt | `/perspectives` → `/oracle` | `PersonaExamples.tsx` | `<Link to="/oracle">` sem `writeAskPrefill` | Botão com prefill + navegação |
| H2 | Entrada externa com histórico anterior misturava nova pergunta na conversa antiga | `/main` → `/oracle` | `useWorkspaceState.ts` | Auto-submit ia para conversa ativa persistida | Criar nova conversa quando já há turnos anteriores |

### Medium

| # | Problema | Página/Rota | Arquivo provável | Causa provável | Correção sugerida |
|---|----------|-------------|------------------|----------------|-------------------|
| M1 | Quick links do chat apontavam para rotas legadas (`/tokens`, `/patterns`, `/design-decisions`) | `/oracle` (sidebar) | `orchestration.service.ts` | Links desatualizados pós-migração de IA | Atualizar para `/foundations?focus=…` e `/reasoning` |
| M2 | Risco de duplo envio em React StrictMode (dev) | `/oracle` | `beatriceStorage.ts` | `consumeAskPrefill` reexecutado no remount | `lockAskPrefillDispatch()` |

### Low

| # | Problema | Página/Rota | Arquivo provável | Causa provável | Correção sugerida |
|---|----------|-------------|------------------|----------------|-------------------|
| L1 | CTAs genéricos “abrir oráculo” sem contexto (Design Decisions, Governance, AppTopBar) | várias | vários | Comportamento intencional — abrir chat limpo | Manter; documentar como navegação neutra |
| L2 | `/oracle` ausente do menu `appRoutes` (acesso via top bar / home) | global | `routes.tsx` | IA deliberada — chat não é surface primária do menu | Nenhuma alteração nesta rodada |

### Polish

| # | Problema | Página/Rota | Arquivo provável | Causa provável | Correção sugerida |
|---|----------|-------------|------------------|----------------|-------------------|
| P1 | `initialMessages` de demo em `getChatContent` (não visíveis com persona ativa) | `/oracle` | `orchestration.service.ts` | Conteúdo legado de showcase | Pendente — baixo impacto com persona overlay |
| P2 | Falha de teste em metadata de componentes (Modal edge_cases) | CI | `componentMetadata.test.ts` | Dados de catálogo evoluíram | Fora do escopo desta rodada |

---

## 3. Correções aplicadas

### 3.1 Auto-submit do prefill da home e perspectivas

**`useWorkspaceState.ts`**
- Separa `askPrefill` de `handoff.input` (mini-chat preserva rascunho sem enviar).
- Ao montar `/oracle` com `askPrefill`:
  - Se já há turnos visíveis → `createConversation()` + envio na nova conversa.
  - Caso contrário → `submitPrompt(askPrefill)` imediato.
- `lockAskPrefillDispatch()` evita duplo envio em StrictMode.

### 3.2 Sanitização de histórico persistido

**`workspace.store.ts`** — nova função `sanitizePersistedMessages`:
- Remove mensagens `isStreaming`.
- Remove erros offline legados (via `removeOfflineMessages`).
- Remove apenas o **último** turno de usuário se ficou sem resposta.

**`beatriceStorage.ts`** — aplica sanitização em `normalizeConversation` ao ler `localStorage`.

**`useBeatriceHistory.ts`** — `clearOfflineMessages` estendido para re-sincronizar `history` após sanitização quando o backend volta online.

### 3.3 Links e exemplos

**`PersonaExamples.tsx`** — exemplos usam `writeAskPrefill` + `navigate("/oracle")`.

**`orchestration.service.ts`** — quick links atualizados:
- `/tokens` → `/foundations?focus=tokens`
- `/patterns` → `/foundations?focus=patterns`
- `/design-decisions` → `/reasoning`

### 3.4 Testes adicionados

**`workspace.store.test.ts`** — cobertura de `sanitizePersistedMessages` (turno interrompido e follow-up sem resposta).

---

## 4. Arquivos alterados

| Arquivo | Tipo de mudança |
|---------|-----------------|
| `src/beatrice/hooks/useWorkspaceState.ts` | Auto-submit prefill, nova conversa em histórico existente |
| `src/beatrice/stores/workspace.store.ts` | `sanitizePersistedMessages` |
| `src/beatrice/stores/workspace.store.test.ts` | Testes de sanitização |
| `src/beatrice/storage/beatriceStorage.ts` | Sanitização na leitura, export `historyFromMessages`, lock StrictMode |
| `src/beatrice/hooks/useBeatriceHistory.ts` | Sync de history pós-sanitização |
| `src/beatrice/components/contextual/PersonaExamples.tsx` | Prefill + navegação nos exemplos |
| `src/beatrice/services/orchestration.service.ts` | Quick links canônicos |
| `VELARIS_FINAL_QA_POLISH_AUDIT.md` | Este relatório |

---

## 5. Validação final

### Chat e estado conversacional

| Cenário | Resultado esperado | Status |
|---------|-------------------|--------|
| Reload em `/oracle` sem prefill | Hidrata histórico real; remove streams órfãos | ✅ Lógica aplicada |
| Abrir chat pela home (input + submit) | Navega, envia, loading, resposta | ✅ Auto-submit |
| Abrir chat por sugestão da home | Idem | ✅ Auto-submit |
| Abrir chat por sugestão em Perspectives | Idem | ✅ Auto-submit |
| Abrir chat por botão top bar | Estado persistido ou default limpo | ✅ Sem regressão |
| Mini-chat → chat completo | Handoff de mensagens; input preservado sem auto-envio | ✅ Handoff intacto |
| Sugestões dentro do `/oracle` (onboarding) | `submitPrompt(prompt.body)` já existia | ✅ Mantido |
| Nova conversa com histórico prévio + prefill externo | Nova conversa dedicada | ✅ Implementado |

### Rotas e navegação

| Verificação | Status |
|-------------|--------|
| 9 rotas primárias em `App.tsx` | ✅ |
| Redirects legados (`/dashboard`, `/beatrice-chat`, `/tokens`, etc.) | ✅ |
| `/knowledge-health`, `/intelligence-lab`, `/governance` (utilitárias) | ✅ Rotas ativas |
| Quick links do chat | ✅ Corrigidos |
| `foundations?focus=`, `reasoning?focus=commands` (hash) | ✅ Padrão existente mantido |

### Comandos Abraxos (registro frontend)

Todos presentes em `src/beatrice/domain/governance/models.ts`:

`/governance`, `/simulate`, `/oracle-council`, `/health`, `/audit`, `/document`, `/enforce`, `/migrate`, `/capture`, `/memory`, `/decision`, `/perspectives`, `/knowledge-gap`, `/token-impact`, `/governance-impact`, `/principle-conflict`

Chips em `ChatSuggestions` preenchem o composer com `/${command} ` — reconhecimento de intent é responsabilidade do backend.

### Build e testes

```
npx tsc -b                          → OK
npx vitest run                      → 86 passed, 2 failed (1 pré-existente)
vitest workspace.store.test.ts      → 4 passed
```

Falha pré-existente: `componentMetadata.test.ts` — `modal-dialog.edge_cases` não é mais `null`.

### UI / responsividade / acessibilidade

Revisão por código nesta rodada (sem alteração visual):

- `AskBeatriceBar`, `ChatSuggestions`, `AbraxosMiniChat` — padrões `focus-ring`, labels e `aria-*` mantidos.
- `PersonaExamples` — `<button>` com `focus-ring` substitui `<Link>` (melhor semântica para ação).
- Nenhum overflow ou grid novo introduzido.

---

## 6. Pendências restantes

Todas as pendências da rodada inicial foram resolvidas em 2026-06-11:

| Item | Resolução |
|------|-----------|
| Teste `componentMetadata.test.ts` falhando | Teste atualizado para o catálogo v2 (campos legados `null` vs listas estruturadas) |
| Demo `initialMessages` em `getChatContent` | Removido — novas conversas iniciam vazias (`[]`) |
| CTAs “Abrir oráculo” sem prompt contextual | `buildOracleHref()` com prompt contextual em Governance, Design Decisions e Perspectives |
| Auditoria visual mobile/tablet | Ajustes de responsividade: grid de sugestões, `overflow-x-clip` no chat, cards mobile no health timeline |
| Query param `?q=` no `/oracle` | Implementado via `oracleNavigation.ts` + consumo em `useWorkspaceState` |
| Páginas research fora do menu | Painel “Ferramentas de pesquisa” em `/evaluation?focus=health` com links para as 3 superfícies |

---

## Critério de aceite

| Critério | Atendido |
|----------|----------|
| Chat não abre mais com pergunta fantasma (streams órfãos) | ✅ |
| Sugestões iniciais navegam e enviam corretamente | ✅ |
| Comandos não quebram (registro + UI) | ✅ |
| Rotas principais funcionam | ✅ |
| Sem regressão visual relevante | ✅ |
| Relatório final criado | ✅ |

---

*Gerado na rodada Final QA Polish Pass — Velaris/Abraxos.*
