# Foundations Visual Standardization

Data: 10 de junho de 2026

Status: aprovado para planejamento de implementação

## Objetivo

Padronizar Diretrizes, Acessibilidade, Padrões e Tokens como variações de uma
mesma família visual dentro de Fundamentos.

A experiência deve preservar a identidade escura, premium e editorial do
Velaris, mas substituir as composições independentes por uma arquitetura
governada. A troca de aba deve parecer uma mudança de conteúdo dentro do mesmo
sistema, não uma mudança de página ou identidade.

## Escopo

A padronização cobre:

- hero interno de cada aba;
- eyebrow, título, destaque, descrição e nota de apoio;
- métricas;
- ritmo e largura das seções abaixo do hero;
- tratamento de cards, ledgers, capítulos e divisores;
- tabs de Fundamentos;
- responsividade entre 320 e 1440 pixels;
- semântica, foco, contraste e operação por teclado;
- testes e relatório da execução.

Ficam fora do escopo:

- backend;
- RAG;
- Beatrice;
- API;
- busca;
- deploy;
- mudanças de rota;
- reconstrução integral do conteúdo;
- criação de uma nova identidade visual;
- alterações amplas de i18n que não sejam exigidas pelo conteúdo visível de
  Fundamentos.

## Diagnóstico

`src/components/FoundationsHubPage.tsx` controla a rota, o hero global, as tabs
e o carregamento das quatro subpáginas. Os identificadores internos atuais são:

- `manifesto`, exibido como Diretrizes;
- `foundations`, exibido como Acessibilidade;
- `patterns`, exibido como Padrões;
- `tokens`, exibido como Tokens.

Esses identificadores e os parâmetros de URL serão preservados.

As subpáginas possuem dados próprios e composição majoritariamente hardcoded:

- `GuidelinesPage.tsx` contém pilares, princípios, regras e casos práticos;
- `FoundationsPage.tsx` contém contratos e checklist de acessibilidade;
- `PatternsPage.tsx` contém a biblioteca editorial de padrões;
- `TokensPage.tsx` contém taxonomia, ledgers, aliases e cobertura.

O conteúdo é adequado, mas a camada visual diverge:

- Diretrizes e Acessibilidade usam heroes imersivos full-bleed com imagens;
- Padrões usa hero contido com imagem lateral;
- Tokens usa hero contido com atmosfera abstrata e sete métricas;
- títulos, alturas, larguras, densidade e posição de métricas variam;
- Diretrizes e Acessibilidade usam containers diferentes de Padrões e Tokens;
- os blocos abaixo do hero alternam entre capítulos editoriais, cards glass,
  painéis técnicos e ledgers sem uma gramática comum explícita.

Os assets atuais são:

- `public/manifesto-portal.webp`;
- `public/accessibility-hero.png`;
- `public/patterns-architecture.webp`.

Tokens não possui asset lateral equivalente. Para eliminar essa assimetria sem
criar novas ilustrações, o design aprovado remove imagens dos quatro heroes.

## Direção Aprovada

A direção aprovada é o **ledger editorial sem imagens**.

O hero combina:

1. eyebrow;
2. título em duas partes, com destaque lilás controlado;
3. descrição;
4. nota editorial curta;
5. régua de métricas;
6. divisor de encerramento.

A personalidade de cada aba será expressa por conteúdo, dados, ícone discreto e
nota editorial. A estrutura, a escala e a atmosfera permanecerão constantes.

## Arquitetura de Componentes

### FoundationSectionHero

Será criado um componente reutilizável, preferencialmente em um módulo focado
de Fundamentos, com uma API semelhante a:

```tsx
interface FoundationSectionHeroProps {
  eyebrow: ReactNode;
  titleLead: ReactNode;
  titleAccent: ReactNode;
  description: ReactNode;
  noteLabel?: ReactNode;
  note?: ReactNode;
  metrics: FoundationMetricItem[];
  icon?: LucideIcon;
}
```

O componente será responsável por:

- container e largura;
- grid entre texto e nota;
- escala e largura máxima do título;
- posição e contraste do eyebrow;
- largura e line-height da descrição;
- divisor e espaçamento;
- renderização de métricas;
- comportamento responsivo;
- semântica do heading interno.

O heading do hero interno será `h2`, pois o hub já fornece o único `h1` da
página.

### FoundationMetricRow

`FoundationMetricRow` renderizará um `dl` com itens tipados:

```tsx
interface FoundationMetricItem {
  label: ReactNode;
  value: ReactNode;
  description?: ReactNode;
}
```

Regras:

- valor antes do label na hierarquia visual;
- `dt` e `dd` corretos na semântica;
- números tabulares;
- divisores uniformes;
- altura mínima comum;
- conteúdo longo com quebra segura;
- até três colunas no mobile quando houver espaço;
- duas colunas ou uma lista compacta em 320 pixels;
- suporte a diferentes quantidades sem criar células vazias.

Tokens continuará exibindo mais métricas que as outras abas, mas dentro da
mesma régua responsiva. A densidade será controlada pela largura mínima de cada
item, não por um grid exclusivo da página.

### FoundationSectionHeader

Uma primitiva de cabeçalho editorial será criada ou consolidada para os blocos
abaixo do hero.

Ela controlará:

- eyebrow opcional;
- título;
- descrição;
- badge ou metadado opcional;
- alinhamento;
- largura de leitura;
- espaçamento inferior.

O componente não imporá o conteúdo interno. Diretrizes poderá manter pilares,
Acessibilidade manter contratos, Padrões manter capítulos e Tokens manter
ledgers técnicos.

### FoundationSection

Uma primitiva leve de seção controlará:

- largura máxima;
- padding vertical;
- divisor superior ou inferior;
- `min-width: 0`;
- ritmo comum entre capítulos;
- heading associado quando aplicável.

Não será criada uma abstração genérica para cada card ou linha técnica. Os
componentes específicos existentes serão mantidos quando expressarem conteúdo
realmente diferente.

## Hero Por Aba

### Diretrizes

- Eyebrow: Guia de Diretrizes do Velaris.
- Título: Guia de Diretrizes.
- Descrição: conteúdo atual, encurtado apenas se necessário para equilíbrio.
- Nota: frase curta sobre transformar intenção em decisões observáveis.
- Métricas: 6 pilares, 12 princípios e 48 regras.

### Acessibilidade

- Eyebrow: Guia de Acessibilidade do Velaris.
- Título: Guia de Acessibilidade.
- Descrição: conteúdo atual.
- Nota: qualidade que atravessa todas as superfícies.
- Métricas: 7 contratos, 10 verificações e AA como base.

### Padrões

- Eyebrow: Biblioteca de Padrões do Velaris ou equivalente localizado.
- Título: Biblioteca de Padrões.
- Descrição: substituir inglês desnecessário em português, sem mudar o sentido.
- Nota: padrões externalizam modelos mentais e reduzem ambiguidade.
- Métricas prioritárias: 11 padrões, 2 fundamentais, 9 complementares, 6 campos
  de decisão e clareza como meta cognitiva.

### Tokens

- Eyebrow: Taxonomia da Linguagem Visual.
- Título: Tokens de Design em português e Design Tokens em inglês.
- Descrição: conteúdo atual.
- Nota: valores tornam-se contratos reutilizáveis por meio da taxonomia.
- Métricas: contagens atuais derivadas dos arrays existentes.

## Tratamento Visual

Nenhum hero interno usará imagem.

O tratamento compartilhado será composto por:

- fundo `surface-immersive`;
- gradiente radial lilás de baixa opacidade;
- bordas brancas sutis;
- uma linha de acento curta ou divisor com fade;
- tipografia clara, sem glow;
- contraste elevado para labels essenciais;
- profundidade obtida por superfície e espaçamento, não por ilustração.

O gradiente será decorativo e implementado em CSS. Ele não carregará conteúdo
nem precisará de alternativa textual.

Os assets atuais não serão apagados, pois podem ser usados por outras superfícies
ou trabalhos futuros. Eles apenas deixarão de ser renderizados nos heroes de
Fundamentos.

## Tabs

As tabs representam navegação interna refletida na URL. A implementação deve
adotar o padrão ARIA de tabs somente se o comportamento completo for
implementado.

A solução preferida é:

- container com `role="tablist"`;
- cada controle com `role="tab"`;
- `aria-selected`;
- `aria-controls`;
- painel ativo com `role="tabpanel"`;
- IDs estáveis;
- setas esquerda e direita para mover foco;
- Home e End para primeiro e último item;
- Enter e Espaço para ativação quando o foco não ativar automaticamente;
- foco visível;
- URL atualizada sem perder deep links existentes.

Em mobile:

- uma única linha horizontal;
- alvos mínimos de 44 pixels;
- `overflow-x: auto`;
- fade de continuidade;
- item ativo rolado para a área visível;
- labels sem truncar a ação essencial;
- subtítulos podem ser ocultados em telas estreitas.

Se o padrão completo de tabs não puder ser implementado com segurança, a
alternativa será manter botões pressionáveis com `aria-pressed`, sem aplicar
roles parciais. Não será criada uma implementação ARIA incompleta.

## Seções Abaixo Do Hero

O conteúdo continuará diferente, mas obedecerá a um ritmo compartilhado.

### Diretrizes

- manter pilares, princípios, regras e estudos de caso;
- alinhar cabeçalhos de pilares à primitiva editorial;
- normalizar divisores, metadata e largura de leitura;
- reduzir o fechamento para a escala dos demais capítulos.

### Acessibilidade

- manter resumo, contratos e checklist;
- converter o resumo para a gramática editorial comum;
- reduzir diferenças entre glass cards e capítulos;
- preservar contratos e referências de token;
- manter checklist como bloco de conclusão, sem glow dominante.

### Padrões

- manter a sequência 01 a 11;
- preservar campos específicos e profundidade dos padrões fundamentais;
- alinhar hero, modelo de leitura e fechamento às primitivas comuns;
- revisar labels de 9 pixels e baixo contraste.

### Tokens

- manter taxonomia, dados, aliases, tabelas e cobertura;
- alinhar hero, modelo de leitura e capítulos às primitivas comuns;
- manter rolagem interna para tabelas;
- preservar nomes canônicos de tokens;
- não alterar valores nem contagens.

## Linguagem Editorial

Português permanece o idioma principal.

Pequenos ajustes são permitidos quando necessários para coerência:

- Design Tokens pode virar Tokens de Design;
- blueprints pode virar modelos estruturais ou mapas de interação;
- trade-offs pode virar decisões de equilíbrio ou compensações quando a frase
  continuar tecnicamente clara.

Termos canônicos, nomes de componentes, tokens e identificadores não serão
traduzidos.

O texto deve permanecer técnico, preciso e explicável. Nenhuma aba deve assumir
tom de landing page.

## Responsividade

### Desktop largo e comum

- hero em duas colunas, com texto principal e nota editorial;
- métricas em régua fluida;
- container comum de 1280 pixels;
- mesma linha inicial e mesma altura visual aproximada.

### Tablet

- nota editorial reduzida;
- grid preservado enquanto houver largura;
- métricas reorganizadas sem células estreitas;
- capítulos técnicos mantêm `min-width: 0`.

### Mobile

- hero em uma coluna;
- nota abaixo da descrição, com divisor lateral removido;
- título entre 36 e 44 pixels, conforme largura;
- descrição com largura total e line-height confortável;
- métricas em duas colunas ou lista;
- tabs horizontais;
- sem imagens, overlays ou elementos absolutos competindo com o texto;
- sem overflow horizontal raiz.

Os viewports mínimos de validação são 320, 390, 768, 1280 e 1440 pixels.

## Acessibilidade

A implementação deve garantir:

- um único `main`, fornecido pelo AppShell;
- um único `h1`, fornecido pelo hub;
- heroes internos com `h2`;
- ordem lógica de headings;
- tabs ou botões com estado programático completo;
- navegação por teclado;
- foco visível;
- alvos de 44 por 44 pixels em mobile;
- ícones decorativos com `aria-hidden="true"`;
- métricas com `dl`, `dt` e `dd`;
- texto normal com contraste mínimo de 4.5:1;
- componentes e indicadores visuais com contraste mínimo de 3:1;
- nenhum estado comunicado apenas por cor;
- reduced motion preservado;
- nenhum conteúdo essencial em background ou elemento decorativo.

## Dados E Fluxo

Não haverá nova fonte de dados global.

Cada página continuará obtendo conteúdo de suas estruturas e funções atuais.
Ela transformará os dados locais em props para `FoundationSectionHero` e
`FoundationMetricRow`.

O hub continuará controlando o foco pela query string. A mudança de aba não
fará requisições novas, não alterará backend e não modificará contratos
externos.

## Estados De Carregamento E Erro

O carregamento lazy atual será mantido.

O skeleton deverá:

- usar `role="status"`;
- anunciar uma mensagem curta uma única vez;
- respeitar reduced motion;
- ocupar altura suficiente para reduzir mudança brusca de layout;
- usar a mesma largura do painel ativo.

Não será criado um novo sistema de tratamento de erro para imports lazy nesta
entrega. Falhas de carregamento continuarão sob o comportamento global atual.

## Testes

### Testes automatizados

Será atualizado ou criado um teste focado de Fundamentos para validar:

- as quatro tabs;
- estado ativo e URL;
- operação por teclado;
- um único `h1`;
- um único `main`;
- hero compartilhado em todas as abas;
- ausência das imagens antigas no hero;
- métricas acessíveis;
- headings principais;
- ausência de overflow raiz em 320 e 390 pixels;
- renderização em português e inglês;
- ausência de erros de página.

Os testes existentes de Acessibilidade, Padrões e Tokens serão preservados e
ajustados apenas quando a nova estrutura mudar seletores visuais ou headings.

### Validação visual

Serão capturadas comparações das quatro abas em:

- 1440 por 1000;
- 1280 por 900;
- 768 por 1024;
- 390 por 844;
- 320 por 800.

A validação verificará:

- linha inicial comum;
- escala equivalente dos títulos;
- peso semelhante das métricas;
- ritmo das primeiras seções;
- continuidade das tabs;
- ausência de aba visualmente mais antiga, mais vazia ou mais promocional.

### Comandos

Serão executados:

- `npm run build`;
- `npm run check:i18n`;
- `npm run test:agent-ui`, pois é a suíte Vitest disponível;
- testes Playwright focados de Fundamentos;
- Axe Core na rota de Fundamentos, se a infraestrutura local estiver
  disponível.

O projeto não possui script `npm run lint`. Essa ausência será documentada no
relatório em vez de criar uma nova configuração de lint.

## Arquivos Esperados

Arquivos principais:

- `src/components/FoundationsHubPage.tsx`;
- `src/components/GuidelinesPage.tsx`;
- `src/components/FoundationsPage.tsx`;
- `src/components/PatternsPage.tsx`;
- `src/components/TokensPage.tsx`;
- novo módulo de primitivas de Fundamentos em `src/components/ui/` ou diretório
  equivalente alinhado ao projeto;
- `src/index.css`;
- testes focados de Fundamentos;
- `FOUNDATIONS_VISUAL_STANDARDIZATION_REPORT.md`.

`src/i18n/translations.ts` só será alterado se uma string diretamente usada pelo
hub ou pelas tabs precisar de ajuste seguro.

## Compatibilidade E Risco

Os principais riscos são:

- perder mudanças locais existentes nos cinco arquivos principais;
- quebrar deep links ao substituir o controle das tabs;
- alterar contagens ou conteúdo de Tokens;
- reduzir a legibilidade de páginas técnicas longas;
- criar abstração excessiva para conteúdos estruturalmente diferentes.

Mitigações:

- trabalhar sobre o estado atual do worktree;
- preservar query params e IDs;
- mover apenas markup visual compartilhável;
- manter arrays e contratos de dados;
- revisar diffs por arquivo;
- validar cada aba isoladamente e em comparação.

## Relatório

`FOUNDATIONS_VISUAL_STANDARDIZATION_REPORT.md` registrará:

- resumo;
- problema encontrado;
- template criado;
- abas atualizadas;
- tratamento das ilustrações;
- padronização de métricas;
- organização das seções internas;
- responsividade;
- acessibilidade;
- arquivos alterados;
- comandos e resultados;
- pendências reais.

## Restrições De Entrega

A implementação não fará:

- deploy;
- push;
- abertura de pull request;
- alterações em backend;
- alterações em RAG;
- alterações em busca;
- alterações em configuração de deploy.

