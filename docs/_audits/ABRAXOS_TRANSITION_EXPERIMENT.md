# Abraxos Route Transition Experiment

> Velaris · Experimento de transição entre páginas · Junho 2026

Objetivo: comparar três abordagens de transição que sugerem a presença de Abraxos durante a navegação — sem espetáculo, sem efeito decorativo gratuito.

---

## Instrumentação

| Rota | Variante | Atributo DOM | Justificativa |
|------|----------|--------------|---------------|
| `/foundations` | A — Escama Etérea | `data-abraxos-transition="ethereal-scale"` | Hub exploratório da biblioteca de conhecimento |
| `/components` | A — Escama Etérea | `data-abraxos-transition="ethereal-scale"` | Catálogo — trilha orgânica sugere passagem recente |
| `/perspectives` | A — Escama Etérea | `data-abraxos-transition="ethereal-scale"` | Lentes profissionais — acompanhamento sutil |
| `/reasoning` | B — Pulso de Conhecimento | `data-abraxos-transition="knowledge-pulse"` | Raciocínio explicável — propagação de informação |
| `/architecture` | B — Pulso de Conhecimento | `data-abraxos-transition="knowledge-pulse"` | Arquitetura — fluxo estruturado de conhecimento |
| `/evaluation` | B — Pulso de Conhecimento | `data-abraxos-transition="knowledge-pulse"` | Avaliação — análise sem espetáculo |
| `/laboratory` | C — Presença no Destino | `data-abraxos-transition="destination-presence"` | Experimento — Abraxos já aguarda no destino |
| `/results` | C — Presença no Destino | `data-abraxos-transition="destination-presence"` | Resultados — chegada antecipada ao título |

Rotas fora do experimento (`/main`, `/oracle`, etc.) mantêm a animação de entrada padrão sem overlay de transição.

Registry central: `src/components/presence/transitionRegistry.ts`

Orquestrador: `src/components/presence/AbraxosRouteTransition.tsx`

Cada página experimentada expõe `data-abraxos-transition-route` no wrapper de conteúdo (`AppShell`).

---

## Variante A — Escama Etérea

### Rotas utilizadas

- `/foundations`
- `/components`
- `/perspectives`

### Implementação

- **Arquivo:** `src/components/presence/transitions/EtherealScaleTransition.tsx`
- **Técnica:** canvas 2D com `requestAnimationFrame`, duração ~720ms
- **Origem:** ponto do clique no nav (`transitionOrigin.ts`) ou link ativo da rota
- **Trajetória:** curva cúbica de Bézier da origem até o `.page-h1` de destino
- **Forma:** escama com glow radial lilás (#DECCFD / #A855F7), ~16–20px
- **Trilha:** sistema de partículas stardust ao longo do percurso + dissipação final
- **Fases:** surge → trajeto com rastro → aproximação → dissolução

### Resultado visual

Escama luminosa surge ao lado do item de menu clicado, percorre arco orgânico deixando rastro de stardust lilás, aproxima-se do título da nova página e se dissolve. Visível e narrativa — Abraxos guia o caminho.

---

## Variante B — Pulso de Conhecimento

### Rotas utilizadas

- `/reasoning`
- `/architecture`
- `/evaluation`

### Implementação

- **Arquivo:** `src/components/presence/transitions/KnowledgePulseTransition.tsx`
- **Técnica:** canvas 2D, 4 fios senoidais sobrepostos com glow
- **Fases:** formação de energia (0–18%) → propagação de onda (10–72%) → dispersão em stardust (58–100%)
- **Intensidade:** opacidade de pico ~42% nos fios principais — visível mas elegante
- **Duração:** ~920ms

### Resultado visual

Energia lilás se forma discretamente, depois uma onda multi-fio atravessa a interface como fios de seda luminosos. Ao passar, fragmenta-se em partículas mínimas que se dissipam enquanto a página estabiliza.

---

## Variante C — Presença no Destino

### Rotas utilizadas

- `/laboratory`
- `/results`

### Implementação

- **Arquivo:** `src/components/presence/transitions/DestinationPresenceTransition.tsx`
- **Técnica:** canvas 2D posicionado via `getBoundingClientRect` do `.page-h1`
- **Fases:** chegada (ponto luminoso) → pulso starburst com 8 raios → dissipação em stardust + névoa
- **Duração:** ~780ms
- **Nenhum elemento atravessa a tela** durante a navegação

### Resultado visual

Navegação limpa. Após a página renderizar, um ponto lilás aparece junto ao título, expande em starburst com raios radiantes (lens flare), depois dissolve em névoa e partículas mínimas. Sensação clara de “Abraxos chegou antes”.

---

## Reduced Motion

Quando `prefers-reduced-motion: reduce` está ativo:

- Todas as variantes canvas/DOM são suprimidas
- `ReducedMotionFadeTransition` aplica overlay de 150ms (~4% lilás)
- Página entra com `.presence-page-enter-reduced` (opacity 92% → 100%, 150ms)
- Sem movimento espacial em nenhuma variante

---

## Comparação

| Critério | A — Escama Etérea | B — Pulso de Conhecimento | C — Presença no Destino |
|----------|-------------------|---------------------------|-------------------------|
| **Premium** | Alta — forma orgânica refinada, paleta Velaris | Muito alta — quase invisível, sofisticada | Alta — minimalista, mas pode parecer “bug de UI” se notada demais |
| **Inteligência** | Média-alta — sugere agente em movimento | Alta — metáfora de propagação de conhecimento | Alta — “já estava aqui” transmite antecipação |
| **Integração Velaris** | Forte — conecta com serpent/escamas do universo | Forte — alinha com camadas cognitivas (Tecelã, Pipeline) | Moderada — mais utilitária, menos poética |
| **Menos decorativa** | Moderada — ainda há movimento visível | **Melhor** — imperceptível para muitos usuários | Boa — só aparece no destino |
| **Narrativa × discrição** | Bom equilíbrio; levemente mais “show” | **Melhor equilíbrio** — narrativa implícita | Narrativa forte, discrição alta após o pulso |

### Observações por variante

**A** é a mais narrativa e a que mais conecta com a iconografia de Abraxos (serpent/escamas). Risco: em navegação rápida entre rotas A, o efeito pode parecer repetitivo.

**B** é a mais elegante em termos de craft — difícil de criticar por ser “decorativa” porque quase não se vê. Risco: usuários podem nunca perceber que existe, enfraquecendo a narrativa de presença.

**C** é a mais inteligente semanticamente para rotas de pesquisa/experimento. Risco: depende de `.page-h1` estar presente; o posicionamento pode variar entre layouts.

---

## Recomendação Final

### Para produção

**Adotaria a Variante B (Pulso de Conhecimento) como base global**, com **acréscimo pontual da Variante C** em rotas de experimento/pesquisa (`/laboratory`, `/results`).

### Por quê

1. **Discrição:** B respeita a regra “nunca espetáculo” melhor que A. A intensidade (~5% opacidade) garante que o conteúdo permanece protagonista.

2. **Premium:** Efeitos quase imperceptíveis mas intencionais são marca de produtos de alta qualidade (cf. animações Apple, Linear). B está nessa categoria.

3. **Inteligência:** A metáfora de propagação de conhecimento alinha com o posicionamento de Velaris como plataforma de inteligência para Design Systems — mais coerente que uma escama voando.

4. **Exceção C:** Em `/laboratory` e `/results`, o significado de “Abraxos chegou antes” agrega valor narrativo específico que B sozinha não comunica. C complementa sem conflitar.

5. **A como alternativa:** Se o time quiser reforçar a identidade mítica de Abraxos (serpent, escamas), A seria a escolha — especialmente em `/foundations`, `/components`, `/perspectives`. Porém, para uso diário em todas as rotas, A envelhece mais rápido.

### O que não levaria para produção

- A escama global em todas as rotas (repetitiva)
- B sozinha em rotas de experimento (perde a narrativa de destino)
- Intensidade acima de ~8% em qualquer variante (competiria com conteúdo)

---

## Arquivos do experimento

| Arquivo | Papel |
|---------|-------|
| `src/components/presence/transitionRegistry.ts` | Mapeamento rota → variante |
| `src/components/presence/AbraxosRouteTransition.tsx` | Orquestrador + `navTick` |
| `src/components/presence/transitions/EtherealScaleTransition.tsx` | Variante A |
| `src/components/presence/transitions/KnowledgePulseTransition.tsx` | Variante B |
| `src/components/presence/transitions/DestinationPresenceTransition.tsx` | Variante C |
| `src/components/presence/transitions/ReducedMotionFadeTransition.tsx` | Fallback acessível |
| `src/components/AppShell.tsx` | Integração + classe de entrada por variante |
| `src/index.css` | Keyframes e classes de animação |
| `src/components/presence/StarTrailTransition.tsx` | Deprecated — re-export de A |

---

## Como testar

1. `npm run dev` — frontend em `:5173`
2. Navegar entre rotas do menu usando links (não reload)
3. Comparar:
   - `/foundations` ↔ `/components` ↔ `/perspectives` → Variante A
   - `/reasoning` ↔ `/architecture` ↔ `/evaluation` → Variante B
   - `/laboratory` ↔ `/results` → Variante C
4. Inspecionar `data-abraxos-transition` no overlay e `data-abraxos-transition-route` no conteúdo
5. Ativar **Reduce motion** no SO e repetir — deve ver apenas fade de 150ms
