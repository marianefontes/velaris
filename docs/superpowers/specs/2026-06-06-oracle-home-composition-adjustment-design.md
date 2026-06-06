# Ajuste de composição da home do Aetheris

## Objetivo

Reduzir a repetição visual entre a faixa "Como a Beatrice responde" e a seção "Comece por aqui", remover o histórico da home e alinhar a base do painel lateral com a base dos cards de entrada.

## Alterações

### Histórico

A seção "Últimas consultas" será removida por completo da home. A consulta ao armazenamento, o cálculo de tempo relativo e os componentes usados apenas por essa seção também serão removidos.

O card "Ver histórico" permanecerá em "Comece por aqui" como acesso direto ao chat e ao histórico.

### Faixa técnica

"Como a Beatrice responde" terá uma superfície mais atmosférica e técnica:

* fundo com gradiente roxo radial
* blur mais forte
* borda superior iluminada
* título e rótulo com maior contraste
* etapas compactas sobre uma superfície interna escura

Essa faixa continuará horizontal no desktop e responsiva em telas menores.

### Seção de entrada

"Comece por aqui" terá linguagem de produto:

* título visível em sentence case
* frase curta de orientação
* cards maiores e mais sólidos
* ícones com maior presença
* espaçamento mais generoso

A seção não usará o mesmo contêiner externo da faixa técnica.

### Alinhamento lateral

No desktop largo, o conteúdo principal e o painel lateral usarão um grid compartilhado.

O painel lateral terá dois cards distribuídos verticalmente entre o topo da hero e a base da seção "Comece por aqui". A base do card "Aetheris Design System" coincidirá com a base dos quatro cards de entrada.

Em tablet e mobile, o painel lateral continuará oculto.

## Verificação

* ausência da seção "Últimas consultas"
* alinhamento inferior com tolerância de dois pixels no desktop
* diferenciação visual clara entre as duas seções
* ausência de overflow no desktop, tablet e mobile
* build de produção
* foco visível nos cards e CTAs
* ausência de travessões nos arquivos alterados
