# GENERATED_FILES.md — Fontes vs. Artefatos TypeScript

> Guia operacional para o agente. Define quais arquivos são **fontes editáveis** e quais são
> **artefatos gerados** que não devem ser editados manualmente.

---

## Regra principal

| Extensão | Natureza | O agente deve editar? |
|----------|----------|----------------------|
| `.ts` / `.tsx` | Fonte TypeScript — autoritativo | **Sim** |
| `.js` gerado de `.ts` | Artefato compilado | **Não** — editar o `.ts` correspondente |
| `.d.ts` gerado | Declaração de tipos emitida | **Não** — gerado automaticamente |
| `.tsbuildinfo` | Cache de build incremental do `tsc` | **Não** — deletável com segurança |
| `.js` nativo (sem `.ts` correspondente) | Fonte JS legítima | **Sim** (ex: `postcss.config.js`) |

---

## Tabela completa de artefatos

| Arquivo gerado | Fonte autoritativa | Por que é gerado | Coberto pelo .gitignore? |
|----------------|--------------------|------------------|--------------------------|
| `vite.config.js` | `vite.config.ts` | `tsconfig.node.json` com `composite: true` compilava o `.ts` | Sim — entry explícita |
| `vite.config.d.ts` | `vite.config.ts` | Emissão de declaração de tipos | Sim — entry explícita |
| `tailwind.config.js` | `tailwind.config.ts` | Mesma causa | Sim — entry explícita |
| `tailwind.config.d.ts` | `tailwind.config.ts` | Emissão de declaração de tipos | Sim — entry explícita |
| `tsconfig.app.tsbuildinfo` | (cache do `tsc -b`) | Build incremental — `tsconfig.app.json` | Sim — padrão `*.tsbuildinfo` |
| `tsconfig.node.tsbuildinfo` | (cache do `tsc -b`) | Build incremental — `tsconfig.node.json` | Sim — padrão `*.tsbuildinfo` |

---

## Por que esses arquivos apareciam?

O `tsconfig.node.json` tinha `"composite": true` sem `"noEmit": true` nem `"outDir"`.
O modo `composite` exige que o TypeScript emita arquivos para suportar builds incrementais entre projetos referenciados.
Sem `noEmit` ou `outDir`, o TypeScript emite os artefatos **ao lado dos fontes** na raiz do projeto.

O script `npm run build` executa `tsc -b`, que processa todas as referências de projeto em
`tsconfig.json` — incluindo `tsconfig.node.json` que compilava `vite.config.ts` e `tailwind.config.ts`.

**Correção aplicada em 2026-06-06:** adicionado `"noEmit": true` ao `tsconfig.node.json`.
Os artefatos na raiz foram removidos. O Vite e o Tailwind leem os `.ts` diretamente via esbuild interno.

---

## O que fazer se os artefatos voltarem a aparecer

Se após um `npm run build` os arquivos `.js` ou `.d.ts` de config reaparecerem na raiz:

1. Verificar se `tsconfig.node.json` ainda tem `"noEmit": true`.
2. Verificar se alguma nova entrada foi adicionada ao `include` do `tsconfig.node.json`.
3. Verificar se o script `build` em `package.json` não foi alterado para chamar `tsc` diretamente
   sem a flag `-b` (que respeita as referências de projeto).
4. Os artefatos podem ser deletados com segurança — eles não são usados por nenhuma ferramenta
   além do próprio TypeScript.

---

## Fontes legítimas em JavaScript (não TypeScript)

Estes arquivos `.js` são **fontes reais**, não artefatos:

| Arquivo | Por que é JS nativo |
|---------|---------------------|
| `postcss.config.js` | PostCSS não tem suporte nativo a configuração em `.ts` |
| `server.cjs` | Backend Node.js legado (DEPRECATED — não usar); formato CJS obrigatório |

---

## Fontes TypeScript de configuração (editar aqui)

| Arquivo | Propósito |
|---------|-----------|
| `vite.config.ts` | Configuração do Vite (plugins, proxy, build) |
| `tailwind.config.ts` | Tokens de design: cores, sombras, tipografia, gradients |
| `tsconfig.json` | Root tsconfig — referencia app e node |
| `tsconfig.app.json` | Compilação do `src/` — `noEmit: true` |
| `tsconfig.node.json` | Validação de `vite.config.ts` e `tailwind.config.ts` — `noEmit: true` |
