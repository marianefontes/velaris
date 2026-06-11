# TOKENS.md — Guia de Design Tokens

> Mapa autoritativo de `tailwind.config.ts` → classe Tailwind → uso correto.
> Use este guia ao criar ou revisar componentes para evitar hex hardcoded.
> Atualizado: 2026-06-06.

---

## Regra fundamental

**Nunca usar hex literal em className.** Sempre usar uma classe Tailwind com token semântico.

```tsx
// ❌ Errado
<div className="bg-[#19191c] text-[#f9f5f8]" />

// ✓ Correto
<div className="bg-surface-container text-on-surface" />
```

Exceções documentadas ao final deste guia.

---

## Tokens de Superfície (background / container)

Use a hierarquia correta para criar profundidade visual:

| Token | Valor | Classe | Quando usar |
|-------|-------|--------|-------------|
| `surface-immersive` | `#09090d` | `bg-surface-immersive` | Hero sections e páginas com layout editorial imersivo (FoundationsPage, GuidelinesPage) |
| `background` | `#0e0e10` | `bg-background` | Canvas raiz da aplicação — `<body>`, `AppShell` |
| `surface` | `#0e0e10` | `bg-surface` | Alias semântico de `background`. Usar quando o contexto é "a superfície principal do conteúdo" |
| `surface-container-lowest` | `#000000` | `bg-surface-container-lowest` | Backdrop de modal, código inline, separadores visuais profundos |
| `surface-container-low` | `#131315` | `bg-surface-container-low` | Painéis de dados densos, células de tabela, fundos de laboratório |
| `surface-container` | `#19191c` | `bg-surface-container` | Cards, inputs, painéis principais, container padrão de conteúdo |
| `surface-container-high` | `#1f1f22` | `bg-surface-container-high` | Sidebar, header, painéis elevados |
| `surface-container-highest` | `#262528` | `bg-surface-container-highest` | Overlays, tooltips, dropdowns, painéis flutuantes |
| `surface-bright` | `#2c2c2f` | `bg-surface-bright` | Hover state de cards e linhas interativas |
| `surface-variant` | `#262528` | `bg-surface-variant` | Variante alternativa de superfície (mesmo valor de highest) |

### Hierarquia visual (mais fundo → mais elevado)

```
surface-immersive (#09090d)
  ↓ background (#0e0e10)
    ↓ surface-container-lowest (#000)
      ↓ surface-container-low (#131315)
        ↓ surface-container (#19191c)  ← padrão para cards e inputs
          ↓ surface-container-high (#1f1f22)
            ↓ surface-container-highest (#262528)
              ↓ surface-bright (#2c2c2f)  ← hover state
```

---

## Tokens de Cor de Texto (on-*)

| Token | Valor | Classe | Quando usar |
|-------|-------|--------|-------------|
| `on-surface` | `#f9f5f8` | `text-on-surface` | Texto primário — corpo, títulos, labels de campo |
| `on-surface-variant` | `#adaaad` | `text-on-surface-variant` | Texto secundário — captions, metadados, placeholders |
| `on-primary` | `#50426a` | `text-on-primary` | Texto sobre background `primary` |
| `on-primary-container` | `#281c41` | `text-on-primary-container` | Texto sobre `primary-container` |
| `on-secondary-container` | `#dcc7ff` | `text-on-secondary-container` | Texto sobre `secondary-container` |
| `on-error` | `#490013` | `text-on-error` | Texto sobre background `error` |

---

## Tokens de Marca / Acento

| Token | Valor | Classe | Quando usar |
|-------|-------|--------|-------------|
| `primary` | `#deccfd` | `text-primary`, `bg-primary`, `border-primary` | Acento principal — foco, CTA, ícones ativos, chips selecionados |
| `primary-dim` | `#d0bfee` | `text-primary-dim` | Variante atenuada do primário — estados de hover, texto menos ênfase |
| `primary-container` | `#a999c6` | `bg-primary-container` | Container de destaque primário — badges, pílulas de categoria |
| `secondary` | `#c2a0fc` | `text-secondary`, `bg-secondary` | Acento secundário — links, source chips, destaques alternativos |
| `secondary-dim` | `#b493ed` | `text-secondary-dim` | Variante atenuada do secundário |
| `secondary-container` | `#543589` | `bg-secondary-container` | Backgrounds de badge de acento |
| `tertiary` | `#c29fff` | `text-tertiary` | Acento terciário — highlights sutis |

---

## Tokens de Borda (outline)

| Token | Valor | Classe | Quando usar |
|-------|-------|--------|-------------|
| `outline` | `#767577` | `border-outline` | Bordas de inputs, cards com definição forte |
| `outline-variant` | `#48474a` | `border-outline-variant` | Bordas sutis — separadores, divisores de seção |

Na prática, `border-white/10` e `border-white/[0.07]` são mais comuns para bordas muito sutis em dark mode — isso é aceitável como utilitário de opacidade.

---

## Tokens de Estado / Feedback

| Token | Valor | Classe | Quando usar |
|-------|-------|--------|-------------|
| `error` | `#ff6e84` | `text-error`, `bg-error`, `border-error` | Erros, estados de falha, alertas críticos |
| `error-dim` | `#d73357` | `text-error-dim` | Erro menos intenso, hover de elementos de erro |
| `warning` | `#ffa657` | `text-warning`, `bg-warning`, `border-warning` | Avisos, trade-offs, estados de caution |

---

## Tokens de Sombra

| Token | Classe | Quando usar |
|-------|--------|-------------|
| `cognitive-sm` | `shadow-cognitive-sm` | Cards pequenos com presença sutil |
| `cognitive-md` | `shadow-cognitive-md` | Painéis, drawers, componentes de destaque |
| `cognitive-lg` | `shadow-cognitive-lg` | Modais, overlays principais |
| `oracle` | `shadow-oracle` | Identidade do Oracle — hero sections, landing |
| `glow` | `shadow-glow` | Glow genérico — usar com moderação |
| `panel` | `shadow-panel` | Painéis de contexto lateral |
| `chip-active` | `shadow-chip-active` | Estado ativo de chips de filtro |

---

## Tokens de Background Gradient / Imagem

| Token | Classe | Quando usar |
|-------|--------|-------------|
| `signature` | `bg-signature` | Gradiente identitário primary→secondary (135°) — botões primários, logos |
| `haze` | `bg-haze` | Névoa radial sutil no topo — seções hero, landing |
| `oracle-ambient` | `bg-oracle-ambient` | Glow atmosférico da identidade Oracle — seções de identidade |
| `cognitive-fade` | `bg-cognitive-fade` | Fade descendente sutil para headers de seção |

---

## Mapeamento Componente → Token

| Componente | Background | Texto | Borda | Sombra |
|-----------|-----------|-------|-------|--------|
| Card padrão | `bg-surface-container` | `text-on-surface` | `border-white/10` | `shadow-cognitive-sm` |
| Card elevado | `bg-surface-container-high` | `text-on-surface` | `border-white/10` | `shadow-cognitive-md` |
| Input / Select | `bg-surface-container` | `text-on-surface` | `border-white/10` (focus: `border-primary/40`) | — |
| Sidebar | `bg-surface-container-high` | — | `border-outline-variant` | `shadow-panel` |
| Modal / Overlay | `bg-surface-container-highest` | `text-on-surface` | `border-white/10` | `shadow-cognitive-lg` |
| Chip ativo | `bg-primary/10` | `text-primary` | `border-primary/20` | `shadow-chip-active` |
| Chip inativo | `bg-white/5` | `text-on-surface-variant` | `border-white/10` | — |
| Badge de categoria | `bg-primary-container/20` | `text-primary` | — | — |
| Tooltip | `bg-surface-container-highest` | `text-on-surface` | `border-outline-variant` | `shadow-cognitive-sm` |
| Painel de laboratório | `bg-surface-container-low` | `text-on-surface` | `border-white/[0.09]` | — |
| Hero imersivo | `bg-surface-immersive` | `text-on-surface` | — | `shadow-oracle` |
| Painel de audit | `bg-background/[0.97]` | `text-on-surface` | `border-white/8` | — (backdrop-blur) |
| Error state | `bg-error/10` | `text-error` | `border-error/30` | — |
| Warning / Tradeoff | `bg-warning/[0.025]` | `text-warning` | `border-warning/[0.14]` | — |

---

## Padrões Corretos

```tsx
// ✓ Card padrão
<div className="rounded-2xl border border-white/10 bg-surface-container p-6 shadow-cognitive-sm">
  <p className="text-on-surface">Conteúdo</p>
  <p className="text-on-surface-variant text-sm">Metadado</p>
</div>

// ✓ Input de formulário
<input className="bg-surface-container border border-white/10 text-on-surface
                   focus:border-primary/40 focus:ring-2 focus:ring-primary/10 rounded-xl" />

// ✓ Chip ativo
<span className="bg-primary/10 border border-primary/20 text-primary shadow-chip-active rounded-full">
  Filtro ativo
</span>

// ✓ Estado de erro
<div className="bg-error/10 border border-error/30 text-error rounded-xl">
  Erro
</div>

// ✓ Aviso / tradeoff
<div className="bg-warning/[0.025] border border-warning/[0.14] rounded-xl">
  Trade-off
</div>

// ✓ Hero imersivo
<main className="bg-surface-immersive text-on-surface">
  Página com layout editorial profundo
</main>
```

---

## Anti-padrões

```tsx
// ❌ Hex literal em className
<div className="bg-[#19191c]" />          // usar bg-surface-container
<div className="bg-[#09090d]" />          // usar bg-surface-immersive
<div className="bg-[#111114]" />          // usar bg-surface-container-low
<div className="text-[#f9f5f8]" />        // usar text-on-surface
<div className="text-[#adaaad]" />        // usar text-on-surface-variant
<div className="border-[#ff6e84]/20" />   // usar border-error/20
<div className="border-[#ffa657]/14" />   // usar border-warning/[0.14]

// ❌ Misturar sem semântica
<div className="bg-slate-900" />  // Tailwind genérico — usar token semântico
<div className="bg-zinc-900" />   // Idem

// ❌ Sombra errada para o contexto
<div className="shadow-oracle" />  // Apenas para identidade do Oracle / hero sections
```

---

## Exceções Documentadas (hex que DEVE permanecer)

| Local | Hex | Motivo |
|-------|-----|--------|
| `PerspectivesPage.tsx` — `hexForId()` | Vários | Cores dinâmicas por ID de lente — geradas em runtime |
| `ReasoningPage.tsx` — `getStepColor()` | `#fcd34d`, `#67e8f9`, `#c4b5fd`, `#86efac` | Cores por tipo de step de raciocínio — retornadas dinamicamente |
| `TokensPage.tsx` — dados da paleta | Todos | Exibindo os VALORES dos tokens como dados documentais |
| `DevIntegrationPage.tsx` — CSS variables | `#deccfd`, etc. | Mostrando exemplos de integração com CSS custom properties |
| `mockDashboard.ts` — props de gráfico | `#deccfd`, `#c2a0fc` | Propriedade `color` de dados Recharts — aceita apenas hex |
| `FoundationsPage.tsx`, `GuidelinesPage.tsx` — texto hero | `#b9a3dc`, `#c8a7ff`, `#f7f3fa` | Art-direction intencional com variações não mapeadas a tokens |

---

## Como adicionar um novo token

1. Adicionar o valor em `tailwind.config.ts` dentro da seção correta (`colors`, `boxShadow`, `backgroundImage`)
2. Adicionar documentação neste arquivo na seção correspondente
3. Adicionar o mapeamento na tabela "Componente → Token" se for um token de componente
4. Nunca remover um token sem verificar se está em uso: `grep -r "token-name" src/`
