# DECISION_LOG.md — Registro de Decisões do Agente

> Log cronológico de decisões técnicas não-triviais. Complementa `docs/adrs.md` (ADRs de arquitetura)
> e `decisoes-tomadas.md` (histórico em PT do produto). Memória operacional auditável.
> Formato: data · decisão · motivo · evidência · risco · reversibilidade.
> Atualizado: 2026-06-07.

---

## Como registrar

Toda decisão de Risco ≥ Medium (ver `RISK_MODEL.md`) ou que afete espelhamento (`AGENT.md` §3) entra aqui.

```
### YYYY-MM-DD — <título curto>
- **Decisão:** ...
- **Motivo:** ...
- **Evidência:** arquivo:linha
- **Risco:** None|Low|Medium|High
- **Reversibilidade:** como reverter
```

---

## 2026-06-07 — Auditoria de comitê + Fase 1 (markdowns operacionais)

- **Decisão:** Criar camada de memória operacional do agente de código: `AGENT.md`, `RESPONSE_QUALITY_GUIDE.md`, `RISK_MODEL.md`, `EXECUTION_MODES.md`, `PERSPECTIVES.md`, `DECISION_LOG.md`.
- **Motivo:** Elevar o agente a padrão "elite" com respostas auditáveis, governança explícita e perspectivas mapeadas, sem reescrever o sistema existente.
- **Evidência:** Auditoria mapeou 7 perspectivas reais em `prompts/cognitive_profiles.py`; gargalo de render em `MarkdownRenderer.tsx` + `useChatStream.ts:108-111`; governança madura no laboratório (`laboratory/store.py`).
- **Risco:** None (apenas criação de `.md`, nenhum código de runtime tocado).
- **Reversibilidade:** deletar os arquivos novos.

## 2026-06-07 — Estratégia de perspectivas (D1–D5)

- **Decisão vigente em 2026-06-07:** usar oito IDs canônicos profissionais. `designer` permanece Designer, `product_designer` é uma perspectiva independente de interface, experiência e pesquisa, e `design_system_manager` absorve estratégia, governança, adoção e roadmap. `pm` e `writer` existem somente como aliases de entrada para `design_system_manager` e `tech_writer`.
- **Motivo:** Atender o pedido de evolução das perspectivas mantendo segurança de dados persistidos.
- **Evidência:** `ProfileId` em `beatrice.ts:199`; espelhamento em `lenses.ts`/`LENS_INSTRUMENTATION`/`evals`/`ALLOWED_LABORATORY_PROFILES`. UX Researcher inexistente; blueprint §2.1 o adiou.
- **Risco:** D5 = Low (aditivo). D1–D3 = Medium quando executados (Fase 5), graças a D4 (sem rename de chave → sem migração).
- **Reversibilidade:** D5 reverte removendo 2 arquivos + entrada no registry. D1–D3 (quando feitos) revertem por git, sem migração de dados.
- **Pendência:** reconciliar `docs/PERSPECTIVES-BLUEPRINT.md` antes de executar D1–D3 (conflito de governança DSM×maintainer — ver `PERSPECTIVES.md` §5–6).

## 2026-06-07 — Fase 2 completa (workspaces + raciocínio visível + reduced-motion)

- **Decisão:** (a) Criar `AccessibilityWorkspace.tsx` e `MaintainerWorkspace.tsx` + registrá-los em `PersonaWorkspace.tsx`. (b) Criar `ReasoningBanner.tsx` e renderizá-lo em `ChatMessage` para respostas normais. (c) Gatear animações do chat com `motion-safe:` (cursor de streaming, `ChatLoadingState`, spinner do banner).
- **Motivo:** a11y/maintainer eram perfis completos sem UI dedicada; o `intent` já trafegava no SSE mas era invisível na resposta; o chat não respeitava `prefers-reduced-motion`.
- **Evidência:** `PersonaWorkspace.tsx:20-22` (fallback); `useChatStream.ts:94` (intent capturado, nunca exibido); `ChatLoadingState.tsx`/`ChatMessage.tsx:106` (animações sem guarda); auditoria: reduced-motion só em 2 arquivos, nenhum no chat.
- **Risco:** Low. Aditivo; nenhum perfil existente alterado; sem dados persistidos tocados. Banner só lê campos já presentes na mensagem.
- **Reversibilidade:** remover os 3 arquivos novos + reverter 4 edits (registry, ChatMessage import/render/cursor, ChatLoadingState).
- **Validação:** `npm run build` ✓ (tsc -b + vite + navigation check), 2.35s.
- **Pendência (i18n):** `ReasoningBanner` usa rótulos PT hardcoded ("Raciocinando"/"fontes"), seguindo o precedente dos badges de command/catalog no mesmo arquivo. Migrar para `t()` quando tocar `translations.ts`.

## 2026-06-07 — Fase 3 (performance do streaming do chat)

- **Decisão:** Atacar o gargalo O(n²) no caminho de streaming do Abraxos com 3 mudanças + 1 correção de dívida:
  1. `MarkdownRenderer` → parsing movido para `useMemo(parseMarkdown, [text])` + `React.memo`. Re-parseava o texto inteiro a cada render; agora parseia só quando `text` muda.
  2. `ChatMessage` → `React.memo` **+ lift do `useWorkspace()` para props** (`content`/`settings` vêm de `ChatStream`). Sem o lift o memo seria inócuo: o `value` do `WorkspaceContext` troca de identidade a cada frame e contexto fura `React.memo`. Agora mensagens estáticas pulam o re-render; só a bolha ativa atualiza.
  3. `useChatStream` → append do streaming agora é batched por `requestAnimationFrame` com janela de ~40ms (coalesce de deltas), em vez de `setMessages` por token. Cancelamento do frame pendente em todos os caminhos de saída (erro/catch/fim/finally).
  4. Dívida do `MarkdownRenderer`: cores hardcoded → tokens (`text-slate-300`/`text-white` → `text-on-surface`, header de tabela → `text-on-surface/80`); bug `hover:bg-white/3` → `hover:bg-white/[0.03]`; novo suporte a **links** `[txt](url)`, **listas ordenadas** e **code blocks** fenced (com render parcial de fence não-terminado durante o stream).
- **Motivo:** Custo combinado O(n²) no comprimento da resposta durante o streaming — confirmado em `useChatStream.ts:108-111` (setState por token) + `ChatMessage` não-memoizado (todas as mensagens re-renderizavam por token) + `MarkdownRenderer` re-parseando tudo a cada render.
- **Evidência:** `useWorkspaceState.ts:76-99` retorna objeto literal novo por render → `WorkspaceProvider.tsx:22` emite `value` novo por frame (raiz do "memo inócuo"); `workspace.store.ts:3-5` (`patchMessage` preserva identidade dos estáticos → habilita o memo); `ChatStream.tsx:10` é o único call site de `<ChatMessage>`; filhos `ReasoningBanner`/`ChatLoadingState` não assinam o contexto (não furam o memo).
- **Medição (commits/s durante stream):** **Bound analítico**, não captura de Profiler ao vivo — o stream real exige `GROQ_API_KEY npm start` + ChromaDB/BGE-M3 + sessão de browser, indisponível neste ambiente.
  - *Antes:* ~1 commit React por token (taxa de delta do Groq, na casa de 10²/s), cada commit re-renderizando **todas** as mensagens e re-parseando o conteúdo inteiro e crescente → O(n²).
  - *Depois:* commits limitados a **≤25/s** (janela de 40ms via rAF), cada um re-renderizando **só** a bolha ativa (memo) e parseando uma vez (useMemo) → O(n).
  - *Procedimento para captura ao vivo:* React DevTools → Profiler → gravar um stream → ler nº de commits ÷ duração; comparar `main` vs esta branch.
- **Risco:** Medium · Impact: Module (`beatrice/chat`) · Confidence: High. Toca o caminho ativo do chat, mas é aditivo/type-safe e a saída renderizada é idêntica (memoização pura); o throttle só muda a cadência de pintura do stream (lotes por frame).
- **Reversibilidade:** reverter por git os 4 arquivos (`MarkdownRenderer.tsx`, `ChatMessage.tsx`, `ChatStream.tsx`, `useChatStream.ts`). Sem migração de dados, sem mudança de contrato SSE.
- **Validação:** `npm run build` ✓ (check de navegação 9/9 + tsc -b + vite), 2.56s.
- **Pendência:** captura de Profiler ao vivo quando o backend estiver disponível; avaliar memoizar o `value` de `useWorkspaceState` / split de contexto (`messages` vs estáveis) se outros consumidores de `useWorkspace` virarem gargalo.

---

## Decisões anteriores (referência cruzada)

- ADRs de arquitetura: `docs/adrs.md` (ADR-01 a ADR-12).
- Histórico de produto/limpeza (fases 1–3 da auditoria anterior): `decisoes-tomadas.md`, `GENERATED_FILES.md`, `TOKENS.md`, `evals/README.md`.
