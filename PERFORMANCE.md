# PERFORMANCE.md — Padrões de Performance e Renderização

> Regras de performance para o agente, aterradas no caminho real do chat da Beatrice. Memória operacional.
> Atualizado: 2026-06-07.

---

## 1. A lição central: contexto fura `React.memo`

Aprendida na Fase 3 (ver `DECISION_LOG.md`). **Um componente que consome um Context re-renderiza sempre que o `value` do Provider troca de identidade — mesmo envolvido em `React.memo`.**

- `useWorkspaceState` retorna objeto literal novo a cada render (`useWorkspaceState.ts`).
- `WorkspaceProvider` repassa esse `value` → identidade nova a cada frame.
- Logo, qualquer `useWorkspace()` no caminho quente do streaming re-renderiza por token.

**Padrão correto (aplicado em `ChatMessage`):** retirar (`lift`) os dados do contexto e passá-los como **props estáveis** a partir do call site (`ChatStream`). Aí `React.memo` passa a valer e mensagens estáticas pulam o re-render.

```tsx
// ❌ Antes — memo inócuo (assina o contexto volátil)
function ChatMessage({ message }) {
  const { content, settings } = useWorkspace(); // re-render por frame
}

// ✓ Depois — props estáveis + memo efetivo
const ChatMessage = memo(function ChatMessage({ message, content, settings }) { ... });
```

---

## 2. Streaming: nunca re-parsear/re-renderizar tudo por token

Gargalo O(n²) corrigido na Fase 3:

| Camada | Regra | Aplicação |
|--------|-------|-----------|
| Parse de markdown | `useMemo(parse, [text])` — parseia só quando o texto muda | `MarkdownRenderer.tsx` |
| Mensagem | `React.memo` + props estáveis | `ChatMessage.tsx` |
| Append do stream | Batch por `requestAnimationFrame` (~40ms), não `setState` por token | `useChatStream.ts` |
| Identidade dos estáticos | `patchMessage` preserva referência das mensagens não-ativas | `workspace.store.ts` |

⚠️ Ao mexer no stream: cancelar o frame pendente em **todos** os caminhos de saída (erro, catch, fim, finally) para não vazar `requestAnimationFrame`.

---

## 3. Regras gerais

- **Memoizar** componentes em listas que re-renderizam com frequência (mensagens, linhas).
- **`useMemo`** para parsing/transformações caras keyadas pela entrada.
- **`useCallback`** para handlers passados a filhos memoizados.
- **Não** alocar objeto/array literal novo como prop de filho memoizado sem `useMemo`.
- Animar só `transform`/`opacity`. Nunca animar `width/height/top/left` (layout/paint).
- Reservar altura de elementos que aparecem (banner, evidência) para evitar **layout shift**.

---

## 4. Dívidas de performance ainda abertas (auditoria §8)

| Item | Evidência | Impacto esperado |
|------|-----------|------------------|
| Virtualização do histórico longo | sem `react-window`/`virtuoso` em `package.json` | menos nós no DOM, scroll mais leve |
| Code-splitting de bundles grandes | `PerspectivesPage` ~387KB, `index` ~396KB no build | TTI/parse menores |
| Lazy de syntax highlighting | inexistente | bundle inicial menor |

---

## 5. Como medir (antes/depois)

- **React DevTools → Profiler:** gravar uma ação (ex: um stream completo), ler nº de commits ÷ duração. Comparar `main` vs branch.
- `why-did-you-render` em dev para flagrar re-renders desnecessários.
- `vite build` imprime tamanhos de chunk (gzip) — comparar antes/depois.
- `performance.mark()`/`measure()` para trechos críticos.

⚠️ Stream real exige backend: `GROQ_API_KEY npm start` + ChromaDB/BGE-M3. Sem ele, a medição é bound analítico, não captura ao vivo — declarar isso (honestidade, ver `RESPONSE_QUALITY_GUIDE.md`).

---

## 6. Checklist de performance

- [ ] Componente em lista quente é `memo`?
- [ ] Consome contexto volátil no caminho quente? → lift para props
- [ ] Parsing caro está em `useMemo`?
- [ ] Animações só em transform/opacity, sem layout shift?
- [ ] rAF/timer cancelado em todos os caminhos de saída?
- [ ] Build: chunks não cresceram inesperadamente?

Relacionados: `ACCESSIBILITY.md` (animação), `COMPONENT_STANDARDS.md`, `RISK_MODEL.md`.
