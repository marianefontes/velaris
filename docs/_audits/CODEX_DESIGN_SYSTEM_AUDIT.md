# CODEX Design System Audit

Data da auditoria: 10 de junho de 2026

## Diagnóstico

O design system tem uma boa visão conceitual e uma implementação fragmentada. `TOKENS.md` e `ACCESSIBILITY.md` descrevem uma base coerente, com cores semânticas, superfícies, sombras, foco e movimento. A aplicação, porém, ainda constrói grande parte de seus componentes diretamente dentro das páginas.

O sistema atual pode ser resumido assim:

- Identidade visual: forte e reconhecível.
- Documentação: acima da média.
- Primitivas de runtime: insuficientes.
- Consistência entre páginas: média.
- Consistência de estados: baixa a média.
- Acessibilidade declarada: boa.
- Acessibilidade efetivamente aplicada: irregular.

Não há um `DESIGN.md` central para governar papéis, exceções e critérios de composição. Isso não impede o trabalho, mas aumenta a chance de cada página interpretar os tokens de forma diferente.

## Componentes consistentes

### Paleta e atmosfera

O uso de fundo escuro, superfícies azul-ardósia e acentos violetas cria continuidade entre produto e documentação. O acento principal é memorável sem exigir um redesenho.

### Estruturas compartilhadas existentes

Classes como `page-hero`, `section-tab`, `content-card` e `xai-card` já indicam uma tentativa correta de centralização. Elas devem ser consolidadas, não substituídas.

### Página Results

Results apresenta bom equilíbrio entre densidade, espaço, hierarquia e confiança. É uma referência útil para calibrar outras páginas de conteúdo.

### Workbench de Components

A página de Components documenta intenção, estados e acessibilidade. O modelo de workbench é valioso para validar o sistema depois que as primitivas forem centralizadas.

### Divulgação de fonte e confiança

O produto reconhece que evidência, confiança e explicabilidade são partes da interface. Esse princípio é diferenciador e deve ser preservado.

### Estados com texto

Vários estados importantes combinam cor com texto ou ícone. A direção é correta e evita depender exclusivamente de cor.

## Componentes inconsistentes

### Page shell

As páginas usam muitos `max-width`, paddings e espaçamentos verticais diferentes. Algumas diferenças são funcionais, mas não estão codificadas como variantes.

### Cards

Cards equivalentes combinam:

- `rounded-lg`, `rounded-xl`, `rounded-2xl`.
- Valores arbitrários como 20, 24, 28 e 32 px.
- Bordas com opacidades distintas.
- Blurs de intensidades diferentes.
- Sombras locais.

O problema não é a quantidade absoluta de estilos, mas a ausência de papéis claros como `base`, `raised`, `interactive` e `hero`.

### Botões

Não foi identificada uma primitiva única de botão. Altura, radius, padding, ícone, foco e disabled são compostos localmente. Pills são usadas tanto para ações quanto para filtros e badges.

### Inputs

Campos de busca, selects, textarea do chat e controles de laboratório têm receitas diferentes. Labels, helper text, mensagens de erro e focus ring não seguem um contrato único.

### Badges e chips

Badges, comandos, filtros, fontes e confiança usam formas semelhantes, mas têm comportamentos distintos. Alguns parecem clicáveis sem ser; outros são clicáveis com alvo pequeno.

### Overlays, menus e modais

Menus e painéis têm boas bases visuais, mas precisam de um padrão comum para foco inicial, trap, retorno de foco, dismissal e backdrop.

### Tipografia

Há uso expressivo de textos muito pequenos:

- Aproximadamente 316 ocorrências de `text-[10px]`.
- Aproximadamente 153 ocorrências de `text-[9px]`.
- 13 ocorrências de `text-[8px]`.

Também existe uso editorial de `font-serif` sem papel formal no tema. A diferença pode ser preservada, mas precisa ser intencional e documentada.

### Transições

Foram encontradas 29 ocorrências de `transition-all`. Isso torna animação menos previsível, pode animar propriedades indesejadas e dificulta a manutenção.

## Tokens e estilos

### Fragmentação observada

- Mais de uma dezena de variações de radius.
- Mais de 30 valores de `max-width`.
- Blurs entre `backdrop-blur`, `2xl` e `3xl`.
- Cores hardcoded ainda presentes fora da página de demonstração de tokens.
- Valores locais de borda, sombra e opacidade.

Uma varredura, excluindo `TokensPage`, encontrou aproximadamente 142 ocorrências de hexadecimal e 173 de `rgba`. Parte delas é legítima em visualizações e temas editoriais, mas o volume indica que a regra documentada de usar tokens não está sendo aplicada de forma uniforme.

### Risco principal

O risco não é apenas visual. Quando o mesmo conceito é representado por receitas locais, ajustes de contraste, tema, marca e acessibilidade precisam ser repetidos em dezenas de pontos.

### Nomenclatura

A interface já mostra Velaris em muitos pontos, mas ainda há ocorrências públicas e internas de Aetheris/Eteris:

- `public/site.webmanifest` ainda usa Aetheris em nome e nome curto.
- `/aetheris.png` permanece como nome de asset.
- Exemplos de integração ainda incluem nomes como `aetherisTheme`.
- Chaves de storage, eventos e campos internos preservam o nome anterior.

As ocorrências públicas devem ser revisadas. Chaves internas não devem ser renomeadas sem estratégia de migração e compatibilidade.

## Estados de UI

### Hover

Está amplamente presente, mas intensidade e propriedades variam. Alguns cards levantam, outros mudam borda, outros mudam fundo.

### Focus

Existe uma classe `.focus-ring`, mas não foi encontrada utilização significativa no runtime. Muitos elementos dependem do outline padrão do navegador.

### Active

Tabs e navegação comunicam estado ativo com cor, fundo ou borda. A direção é boa, mas o contraste de estados inativos precisa subir.

### Disabled

Não há uma regra visual única. No chat, o botão de envio pode parecer disponível mesmo quando o campo está vazio, embora a lógica bloqueie a submissão.

### Loading

Há bons exemplos com `role="status"` e `aria-live`, mas o movimento não é consistente. Alguns componentes respeitam reduced motion; outros continuam usando pulse e animações contínuas.

### Empty

Os estados vazios variam entre orientação útil, card decorativo e texto curto. Todos deveriam explicar contexto e próxima ação sem parecer erro.

### Error

Os estados existentes geralmente combinam texto e cor, o que deve ser preservado. Falta uniformidade em estrutura, foco, retry e linguagem.

## Recomendação de padronização

### Page shell

- `standard`: largura máxima de 1280 px.
- `reading`: largura de leitura entre 720 e 880 px dentro do shell.
- `wide`: até 1400 px apenas para workbenches, tabelas e visualizações.
- Padding lateral: 20 px mobile, 24 px tablet, 40 px desktop.
- Espaço superior: uma escala comum por tipo de página.
- Uma página deve ter apenas um `main` e um `h1`.

### Section header

- Eyebrow opcional, mínimo visual de 10-11 px e contraste AA quando essencial.
- `h1` mobile entre 36 e 40 px; desktop entre 48 e 56 px.
- Descrição entre 16 e 18 px, largura máxima aproximada de 70 caracteres.
- Não repetir hero do shell dentro da subpágina.

### Cards

- `base`: surface-1, borda sutil, radius de 16 px.
- `raised`: surface-2, sombra baixa, radius de 20 px.
- `interactive`: base com hover de borda/fundo, sem salto de layout.
- `hero`: radius de 24 px, reservado a blocos principais.
- Evitar valores arbitrários de 28 e 32 px fora de shells especiais.

### Botões

- Altura mínima de 44 px para ações principais e mobile.
- Variantes: primary, secondary, ghost e destructive.
- Radius de 12 px para ações; pill apenas para filtros compactos.
- Ícone sem texto exige nome acessível.
- Focus ring consistente com contraste e offset.

### Inputs

- Altura mínima de 44-48 px.
- Label persistente ou nome acessível explícito.
- Placeholder apenas como exemplo, nunca como label.
- Helper e erro em regiões estáveis.
- Focus, invalid, disabled e loading devem manter o mesmo layout.

### Badges

- Reservar para status, taxonomia e contagem.
- Texto mínimo de 11 px quando carrega informação essencial.
- Não usar aparência de botão em badge não interativo.
- Cor nunca deve ser o único indicador.

### Empty state

- Título direto.
- Uma frase explicando por que está vazio.
- Uma ação primária ou orientação de próxima etapa.
- Ilustração discreta e opcional.

### Error state

- Título orientado à tarefa.
- Explicação curta.
- Retry quando possível.
- Detalhe técnico progressivamente divulgado.
- `role="alert"` apenas quando a interrupção exigir anúncio imediato.

### Loading state

- Reservar espaço para evitar salto.
- Usar skeleton para estrutura conhecida.
- Usar status textual para processos longos.
- Pulse ou shimmer deve parar com `prefers-reduced-motion`.
- Não bloquear toda a página quando apenas uma região está carregando.

### Source/confidence chips

- Fonte deve ser acionável quando houver detalhe disponível.
- Confiança deve combinar texto, valor e contexto.
- Tamanho mínimo de alvo de 44 px em touch ou agrupamento equivalente.
- Tooltip não pode ser a única forma de revelar informação.
- Ordenar fontes por relevância e agrupar excedentes.

### Chat messages

- Mensagem do usuário: compacta, alinhada à direita, largura máxima moderada.
- Mensagem da Beatrice: coluna de leitura mais aberta, sem excesso de bubble.
- Evidência e confiança abaixo da resposta, em divulgação progressiva.
- Ações agrupadas e visíveis por teclado/foco, não apenas por hover.
- Composer deve permanecer o único foco operacional dominante.

## Não alterar agora

- `src/index.css` e `tailwind.config.ts`.
- App shell, topbar e busca global.
- Chat da Beatrice e seus componentes.
- Rotas.
- i18n.
- Backend, RAG, SSE, API e deploy.
- Renomeação de assets, storage keys, eventos ou manifest.
- Páginas atualmente modificadas no diff do Claude.

Depois do trabalho do Claude, revisar primeiro quais padrões já foram consolidados e adaptar este plano ao novo estado, evitando criar uma segunda camada de abstração.
