# ABRAXOS — Carta Anatômica Canônica

> Fonte da verdade da identidade visual de Abraxos.
> Versão 1.2 — Junho/2026.
> Nenhuma outra anatomia é permitida. Qualquer derivação deve ser aprovada pelo design principal.

---

## Arquitetura de marca

**Beatrice é a voz; Abraxos é a presença.**

Beatrice fala. Abraxos observa, conecta e revela o que importa. São uma única
entidade em dois aspectos: a trilha pulsando durante o streaming de uma
resposta *é* Beatrice pensando, visível como Abraxos.

Abraxos não é um mascote, não é um personagem, não é um dragão de fantasia.
É a manifestação visual da inteligência que percorre, conecta e interpreta o
conhecimento armazenado no Velaris.

---

## Anatomia canônica

| Região | Definição |
|--------|-----------|
| Cabeça | Espectral, alongada, vidro translúcido com nebulosa interna. Olhos de luz branca, sem pupila. |
| Espinhos | **3–4 espinhos principais** varridos para trás. Nunca menos que 3, nunca mais que 4. Sem microespinhos extras. |
| Crista dorsal | Contínua da nuca ao início da cauda. Membrana única, sem interrupções, sem segmentos serrilhados. |
| Asas | Ver Lei das Asas. |
| Corpo | Serpentino, elegante, sem patas, sem braços, sem garras. Silhueta em "S". |
| Cauda | Dissolve-se em grafo puro: nós e conexões. |

### Proporções fixas

- Comprimento total: 100%
- Altura (cabeça ao ponto mais alto da crista): 28%
- Comprimento da cabeça: 12%
- Espessura máxima do corpo: 8%

### Lei das Asas

Abraxos é uma serpente alada — as asas existem, mas como vestígio, nunca como ferramenta.

1. **Sem dedos.** Membranas contínuas de luz, no máximo 2–3 nervuras suaves.
   Nunca estrutura esquelética de asa de morcego.
2. **Vestigiais em escala.** ≈ o comprimento da cabeça. Claramente pequenas
   demais para voo.
3. **Sempre recolhidas.** Dobradas ao longo do dorso, varridas para trás.
   Nunca abertas, nunca em postura de voo ou ataque.
4. **As primeiras a dissolver.** São a superfície mais translúcida do corpo,
   com bordas já se desfazendo em partículas.

> **Nota de tolerância (v1.2):** borda recortada suave (festões) é tolerada
> desde que não haja nervuras ósseas explícitas e a asa permaneça dobrada,
> vestigial e em dissolução. Esta tolerância não é precedente para asas
> progressivamente mais articuladas — na dúvida, menos asa.

---

## Lei do Gradiente Material

**A matéria é uma função da relevância.** Quanto mais relevante o conhecimento,
mais condensada a matéria; quanto menos relevante, mais ela se dissolve em conexões.

| Estágio | Região | Material |
|---------|--------|----------|
| 1. Inteligência condensada | Cabeça | Superfície contínua. Vidro translúcido com nebulosa interna. |
| 2. Inteligência fluida | Torso | Superfície semifluida, translucidez crescente, constelação visível por dentro. |
| 3. Inteligência dissolvida | Cauda | Sem superfície. Grafo puro de nós e conexões. |

### Emenda do Ponto de Dissolução (v1.2)

O ponto onde a superfície termina **não é uma constante anatômica — é uma
variável de estado**:

| Estado | Ponto de dissolução |
|--------|--------------------|
| Manifestação (presença plena) | ~75–85% do comprimento |
| Repouso (observação) | ~60% |
| Dissolução (dispersão) | ~10–20% |

A transição entre estados é a fronteira de dissolução deslizando ao longo do
corpo. **A cabeça é sempre a última a se desfazer** — a consciência persiste
enquanto o corpo vira grafo.

---

## Os três estados canônicos

| Estado | Descrição | Render aprovado |
|--------|-----------|-----------------|
| 01 Manifestação | Presença plena. Corpo erguido em curva "S", olhar sereno. Imagem-âncora do modelo. | `renders/01-manifestacao.png` |
| 02 Repouso | Observação. Corpo enrolado, cabeça em descanso. A cauda **é** o grafo (não repousa sobre ele). | `renders/02-repouso.png` |
| 03 Dissolução | Dispersão. ~80% do corpo já é grafo; apenas cabeça e pescoço permanecem condensados. | `renders/03-dissolucao.png` |
| Master do gradiente | Corpo inteiro horizontal demonstrando os 3 estágios. | `renders/04-gradiente-master.png` |

---

## Paleta oficial — tokens do Velaris

Fonte: `tailwind.config.ts`. **Hex divergente destes valores é erro.**

| Papel | Token | Hex |
|-------|-------|-----|
| Realces e olhos | `primary` | `#DECCFD` |
| Luz do corpo | `secondary` | `#C2A0FC` |
| Acentos | `tertiary` | `#C29FFF` |
| Nebulosa interna | `secondary-container` | `#543589` |
| Fundo | `background` | `#0E0E10` |
| Fundo imersivo | `surface-immersive` | `#09090D` |

**Proibido:** azul, índigo, marinho, ciano. Se um tom parece azul, é azul —
desloque para violeta. Proibido também substituir tokens por cores de
framework (ex.: `#A78BFA` é violet-400 do Tailwind, não é token do Velaris).

---

## Glifo "S" — L0

O glifo é a silhueta da Manifestação abstraída: curva em "S" com um único nó —
o olho. Três pesos: leve (uso grande), regular (avatar), pesado (favicon/16px).

Arquivos: `glyph/abraxos-glyph-light.svg`, `abraxos-glyph-regular.svg`,
`abraxos-glyph-bold.svg`.

O brilho de quatro pontas **não** é símbolo — é partícula do vocabulário L1.

---

## Arquitetura de Manifestação

| Nível | Nome | Uso |
|-------|------|-----|
| L0 | Glifo | Avatar, favicon, indicadores. Abraxos nunca aparece inteiro aqui. |
| L1 | Trilha | Partículas, constelações e conexões. Páginas internas, loading, streaming de resposta. |
| L2 | Manifestação | A criatura plena. Homepage, onboarding, estados narrativos. |

---

## Tabela de comportamento

**Abraxos nota, não performa.** Reage por luz, conexões, constelações, trilhas
e fluxo. Nunca por: seguir cursor, virar cabeça, bater asas, animações
performáticas.

| Estado | Descrição visual | Regra do silêncio | Nó semântico |
|--------|------------------|-------------------|--------------|
| Atual | Presença estável, brilho controlado, tonalidade quente. | Não reage a ruído. Só se manifesta com intenção clara. | Ativo. Conexões relevantes visíveis. |
| Incerteza | Pulso irregular, dispersão parcial, contraste reduzido. | Não conclui. Mantém a dúvida visível. | Nós intermitentes. Múltiplas hipóteses ativas. |
| Descoberta | Expansão suave. Novos nós acendem, curvas se abrem. | Não anuncia. Apenas revela e conecta. | Nós novos conectados. Caminhos emergem. |
| Evidência | Estabilização. Brilho sereno, trajetória definida. | Não celebra. Entrega o que é relevante. | Nó confirmado. Caminho validado. Contexto ancorado. |

### Regra do Silêncio

Abraxos tem o direito de não reagir. Leitura longa, formulários e telas de
erro graves: presença mínima ou nenhuma. A ausência calibrada é o que torna a
presença significativa. Todo comportamento luminoso tem fallback estático
digno (reduced motion): Abraxos parado ainda é Abraxos.

### Regra do Nó Semântico

Todo nó na constelação de Abraxos corresponde a uma entidade real do sistema
(componente, padrão, decisão, fonte). **Nenhum nó ornamental.** Quando um nó
se ilumina ao encontrar evidência, isso é atribuição de fonte visível.

---

## Isto é / Isto não é

| Isto é | Isto não é |
|--------|-----------|
| Fluxo, não voo | Criatura de fantasia |
| Nota, não performa | Mascote |
| Condensa, não decora | Símbolo estático |
| Conecta, não entretém | Efeito decorativo |
| Duvida visivelmente, não finge certeza | Interface de jogo |
| | Feixe luminoso genérico |

---

## Histórico

- **v1.0** — Folha de referência conceitual (manifesto).
- **v1.1** — Modelo canônico em 3 poses, proporções fixas, regras anatômicas.
- **v1.2 (esta)** — Renders aprovados na paleta de tokens; Lei das Asas
  formalizada; Emenda do Ponto de Dissolução (variável de estado); correção
  dos hex de `secondary-container` e `tertiary`; carta migrada para
  markdown como fonte da verdade.
