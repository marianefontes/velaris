# ACCESSIBILITY.md — Contrato de Acessibilidade

> Regras de a11y para o agente ao criar/editar UI no AETHERIS. Memória operacional.
> A própria Beatrice tem uma lente `a11y` (Iris Holloway) — este doc operacionaliza os mesmos princípios para o código.
> Atualizado: 2026-06-07.

---

## 1. Princípios (da lente a11y — `prompts/cognitive_profiles.py:173`)

1. **HTML semântico é o contrato primário. ARIA é remediação**, não substituição.
2. **Verificar ordem de foco antes de validar layout.**
3. **Testar removendo o mouse, depois removendo a tela.**
4. **Cor nunca é o único sinal** — sempre ter marcador estrutural (ícone, posição, borda) além do acento.

---

## 2. Movimento — `prefers-reduced-motion` (OBRIGATÓRIO)

Toda animação deve degradar sob `prefers-reduced-motion: reduce`.

**Padrão do projeto:** usar a variante Tailwind `motion-safe:` (zero JS, zero bundle).

```tsx
// ✓ Correto — animação só quando o usuário permite movimento
<span className="motion-safe:animate-pulse" />
<span className="motion-safe:animate-bounce" />
<Loader2 className="motion-safe:animate-spin" />

// ❌ Errado — anima sempre, ignora a preferência do SO
<span className="animate-pulse" />
```

Aplicado em (referência): `ChatMessage.tsx` (cursor de streaming), `ChatLoadingState.tsx` (dots), `ReasoningBanner.tsx` (spinner).

**Para Framer Motion:** usar `useReducedMotion()` e desativar `animate`/transition quando `true`.

⚠️ **Dívida conhecida:** fora do chat, vários componentes usam Framer Motion sem guarda (`HistoryPanel`, `SettingsPanel`, páginas com `motion.*`). `prefers-reduced-motion` só é honrado em poucos arquivos. Ao tocar qualquer um deles, adicionar a guarda.

---

## 3. Foco

- Modais/drawers: mover foco para dentro ao abrir; **devolver ao elemento invocador** ao fechar.
- Foco visível sempre (`focus-visible:ring-*`), nunca `outline-none` sem substituto.
- Sem armadilhas de foco (keyboard trap) exceto em modal intencional.
- Ordem de tab segue a ordem visual/lógica.

## 4. Teclado

- Tudo que é clicável é acionável por teclado (`<button>`/`<a>`, não `<div onClick>`).
- `Escape` fecha overlays.
- Sem handlers só de mouse (`onMouseEnter` sem equivalente de foco).

## 5. ARIA e estados dinâmicos

- Conteúdo que muda sozinho (stream, toasts, status) usa `role="status"` + `aria-live="polite"` (ou `assertive` para erro crítico). Ref: `ReasoningBanner.tsx`.
- `aria-label`/`aria-labelledby` em controles sem texto visível.
- Ícones decorativos: `aria-hidden`. Ícones informativos: têm label.
- Sliders de calibração (`/perspectives`): `aria-valuetext` semântico ("technicality média"), não só o número.

## 6. Contraste e tipografia

- Texto via tokens `text-on-surface` / `text-on-surface-variant` (ver `TOKENS.md`) — calibrados para contraste em dark mode.
- Não usar opacidade tão baixa que quebre contraste (cuidado com `text-*/40` em texto pequeno).
- Tamanho mínimo legível; `text-[9px]`/`[10px]` só para metadados não essenciais.

---

## 7. Checklist de a11y antes de finalizar UI

- [ ] Animações sob `motion-safe:` / `useReducedMotion`
- [ ] Navegável 100% por teclado, foco visível
- [ ] Foco devolvido ao fechar overlay
- [ ] Conteúdo dinâmico com `aria-live`
- [ ] Cor não é o único sinal
- [ ] Ícones decorativos `aria-hidden`
- [ ] Texto via tokens (contraste)
- [ ] Testado com Tab + (idealmente) leitor de tela

---

## 8. Como testar

```bash
# Simular reduced-motion: macOS → Ajustes → Acessibilidade → Movimento → Reduzir movimento
# Ou DevTools → Rendering → Emulate CSS prefers-reduced-motion: reduce
```
Ferramentas da lente a11y (referência): axe-core, VoiceOver, NVDA, Storybook a11y, WAVE.

Relacionados: `TOKENS.md` (contraste), `PERFORMANCE.md` (animações sem layout shift), `RESPONSE_QUALITY_GUIDE.md`.
