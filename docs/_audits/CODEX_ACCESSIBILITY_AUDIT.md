# CODEX Accessibility Audit

Data da auditoria: 10 de junho de 2026

Método:

- Inspeção estática de componentes e estilos.
- Navegação visual em desktop e mobile.
- Axe Core 4.10.3 em amostra de home, Components, Principles, Architecture e Beatrice.
- Verificação com `prefers-reduced-motion: reduce`.

Esta é uma auditoria de produto, não uma certificação WCAG completa.

## Problemas críticos

### Botão de perfil sem nome acessível em mobile

O trigger de `PersonaProfileMenu` esconde o texto abaixo de `sm` e não fornece `aria-label`. Em mobile, resta apenas um ícone sem nome.

Evidência:

- `src/beatrice/components/persona/PersonaProfileMenu.tsx`

Critério de correção:

- O botão deve anunciar ação e estado, por exemplo perfil da persona e expandido/recolhido.

### Contraste insuficiente em componentes globais

Todas as rotas desktop amostradas apresentaram violações sérias de contraste. Os casos recorrentes usam texto muito pequeno em slate 500/600 sobre fundos escuros.

Áreas prioritárias:

- Navegação inativa.
- Eyebrows.
- Labels de cards.
- Metadados de confiança e fontes.
- Labels do rail da Beatrice.

Critério de correção:

- Texto normal deve atingir 4.5:1.
- Texto grande deve atingir 3:1.
- Componentes e indicadores visuais devem atingir 3:1 quando aplicável.

### Sliders de Perspectives não têm label programático

Os ranges possuem `aria-valuetext`, mas os textos visuais adjacentes não estão associados como label.

Evidência:

- `src/beatrice/pages/PerspectivesPage.tsx`

Critério de correção:

- Cada slider deve ter `label`, `aria-label` ou `aria-labelledby` único.
- O nome deve indicar a dimensão controlada, não apenas o valor.

### Composer da Beatrice não tem label persistente

O textarea depende de placeholder e não possui nome acessível explícito.

Evidência:

- `src/beatrice/components/chat/ChatInput.tsx`

Critério de correção:

- O campo deve anunciar sua finalidade mesmo depois de receber conteúdo.

### Reduced motion não é respeitado integralmente

Com preferência de movimento reduzido, blobs da home, pulse e alguns indicadores continuam animados.

Evidências:

- `src/index.css`, animações de mesh.
- `src/components/OracleHomePage.tsx`.
- `src/beatrice/components/chat/ChatToolbar.tsx`.

Critério de correção:

- Toda animação não essencial deve ser removida ou reduzida.
- O feedback de estado deve continuar compreensível sem movimento.

## Problemas médios

### Não há skip link global

Usuários de teclado precisam percorrer a topbar e a navegação em todas as mudanças de página.

### Focus ring não é sistemático

Existe `.focus-ring`, mas a aplicação depende frequentemente do outline padrão do navegador. Alguns controles têm hover refinado e foco pouco perceptível.

### Alvos de toque são pequenos

Exemplos:

- Ações de mensagem.
- Chips de comando.
- Controles da toolbar.
- Links da navegação superior.
- Alguns selects e botões compactos.

O alvo recomendado é 44 x 44 px ou espaçamento equivalente.

### Source chips não são acessíveis por teclado

Informação adicional depende de `title` em elemento não interativo. Tooltips nativos não atendem bem touch e navegação por teclado.

### Architecture tem overflow em mobile

Conteúdo técnico sem quebra aumenta a largura do documento e prejudica leitura, zoom e ordem visual.

### Landmarks e headings duplicados em Foundations

Subpáginas introduzem um segundo `main` e/ou um segundo `h1`.

### Imagens não declaram dimensões HTML

Há dimensões visuais em CSS, mas imagens sem `width` e `height` explícitos podem contribuir para layout shift.

### Ícones decorativos não têm regra uniforme

Revisar `aria-hidden="true"` em ícones puramente decorativos e nome acessível em todos os botões de ícone.

### Navegação mobile depende de scroll horizontal

É funcional, mas precisa indicar continuidade, preservar item ativo visível e funcionar em 320 px, zoom e strings maiores.

### Ações reveladas por hover

Ações de mensagem e alguns controles contextuais precisam permanecer descobríveis com teclado, touch e `focus-within`.

## Melhorias recomendadas

1. Criar uma primitiva única de focus ring e aplicá-la a links, botões, campos, tabs e cards interativos.
2. Adicionar skip link apontando para o `main` do AppShell.
3. Corrigir nome acessível de todos os botões icon-only, começando por perfil mobile.
4. Subir contraste e tamanho de labels essenciais.
5. Associar labels programáticos a textarea, sliders, selects e buscas.
6. Definir alvo mínimo de 44 px para mobile e controles primários.
7. Tornar fontes e confiança operáveis por teclado e touch.
8. Remover landmarks e headings duplicados.
9. Aplicar reduced motion globalmente a keyframes, pulse, shimmer e transições.
10. Corrigir overflow técnico com `min-width: 0`, wrapping e quebra segura de código.
11. Garantir loading com `role="status"` e erro acionável com foco apropriado.
12. Testar menus e dialogs para trap, Escape e retorno de foco.

## Checklist para reteste

- [ ] Tab percorre topbar, navegação e conteúdo em ordem lógica.
- [ ] Skip link aparece no primeiro Tab e move foco ao conteúdo.
- [ ] Todo botão de ícone anuncia um nome claro.
- [ ] Persona menu anuncia nome, estado expandido e item ativo.
- [ ] Textarea da Beatrice possui label acessível.
- [ ] Sliders de Perspectives anunciam dimensão, valor e limites.
- [ ] Focus ring é visível em fundo escuro e superfícies violetas.
- [ ] Nenhum controle essencial depende apenas de hover.
- [ ] Nenhum estado depende apenas de cor.
- [ ] Textos e componentes passam contraste AA.
- [ ] Controles primários possuem alvo de 44 x 44 px.
- [ ] Source chips abrem por Enter e Espaço.
- [ ] Tooltips também aparecem por foco e podem ser dispensados.
- [ ] Menus fecham com Escape e devolvem foco ao trigger.
- [ ] Dialogs mantêm foco dentro e devolvem foco ao fechar.
- [ ] Loading é anunciado uma vez, sem repetição excessiva.
- [ ] Erro preserva dados digitados e oferece retry.
- [ ] Reduced motion interrompe blobs, pulse, shimmer e deslocamentos.
- [ ] Zoom de 200% não corta conteúdo nem cria scroll em dois eixos.
- [ ] Viewports de 320, 390, 768, 1280 e 1440 px não têm overflow raiz.
- [ ] Strings longas em português e inglês não truncam ações essenciais.
- [ ] Headings seguem uma ordem lógica com um único `h1`.
- [ ] Existe apenas um `main` por página.
- [ ] Leitura com VoiceOver/NVDA identifica regiões e estados.
- [ ] Axe não retorna violações critical ou serious nas rotas principais.
