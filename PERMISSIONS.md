# PERMISSIONS.md — Regras de Permissão para o Agente

> Este arquivo define quando o agente DEVE pedir confirmação explícita antes de agir
> e quando pode agir livremente. O objetivo é prevenir perdas irreversíveis de trabalho
> e preservar decisões arquiteturais intencionais.
> Atualizado: 2026-06-06.

---

## Regra geral

**Antes de qualquer ação destrutiva ou de alto impacto: perguntar primeiro, agir depois.**

A pergunta deve incluir:
1. O que será alterado/excluído/renomeado
2. Por que o agente acredita que a ação é segura
3. O que pode quebrar se a hipótese estiver errada

---

## Ações que EXIGEM confirmação explícita

### Excluir arquivos

| Situação | Exemplo |
|----------|---------|
| Qualquer arquivo em `src/components/` | Mesmo que pareça morto — pode ser hub ou sub-página |
| Qualquer arquivo em `src/beatrice/` | Módulo com dependências internas complexas |
| Arquivos de serviço (`src/services/`, `src/beatrice/services/`) | Podem ser usados por múltiplos consumidores |
| Arquivos de domínio (`src/beatrice/domain/`) | Contratos de tipo podem ter dependentes não óbvios |
| Qualquer arquivo Python em `rag/`, `cognition/`, `prompts/`, `laboratory/` | Pipeline interdependente |
| Markdowns de contexto do agente (`cognition/strategies/*.md`, `prompts/**/*.md`) | Alteram comportamento do Beatrice em produção |
| `rag/aetheris-docs-dump.json` | Snapshot do corpus — reindexação necessária após exclusão |

### Renomear componentes ou funções exportadas

| Situação | Motivo |
|----------|--------|
| Renomear export de componente | Quebra todos os imports sem rename global |
| Renomear hook (`use*`) | Pode quebrar providers e páginas |
| Renomear tipo TypeScript exportado | Pode quebrar consumers em `src/types/` e `src/beatrice/types/` |
| Renomear arquivo de serviço | Import paths hardcoded em múltiplos arquivos |

### Alterar rotas

| Situação | Motivo |
|----------|--------|
| Adicionar rota primária (ao menu) | Requer mudança em `routes.tsx` E `App.tsx` — dois arquivos |
| Remover rota primária | Requer adicionar redirect legado em `App.tsx` |
| Alterar path de rota existente | Quebra bookmarks e qualquer link externo |
| Remover redirect legado | Pode quebrar links em documentação externa, e-mails, etc. |

### Alterar APIs e contratos

| Situação | Motivo |
|----------|--------|
| Alterar props obrigatórias de componente | Quebra todos os usos sem atualização simultânea |
| Alterar formato de resposta do `POST /api/chat` | Quebra o frontend SSE parser |
| Alterar schema do SQLite do laboratório | Invalida dados existentes de pesquisa |
| Alterar formato de chunks RAG | Invalida o vector store — reindexação obrigatória |
| Alterar `tsconfig.json` (root) | Afeta todo o pipeline de build |

### Alterar tokens de design

| Situação | Motivo |
|----------|--------|
| Remover token de `tailwind.config.ts` | Quebra classes em uso no codebase |
| Renomear token existente | Quebra silenciosamente — Tailwind não avisa sobre classes inexistentes |
| Alterar valor de cor primária (`primary`, `secondary`) | Impacto visual global em todos os componentes |

### Operações no vector store

| Situação | Motivo |
|----------|--------|
| `setup_vectordb.py --reset` | Apaga e recria todos os embeddings |
| Alterar `extract_docs.py` (lógica de chunking) | Muda o corpus de forma irreversível |
| Alterar modelo de embedding em `server.py` | Invalida todos os embeddings existentes |

---

## Ações SEGURAS sem confirmação

| Ação | Condição de segurança |
|------|----------------------|
| Adicionar prop opcional a componente | Padrão definido, sem quebrar uso atual |
| Criar novo componente em pasta correta | Não sobrescreve arquivo existente |
| Criar novo hook em `src/beatrice/hooks/` | Não altera hooks existentes |
| Criar novo tipo em `src/types/` ou `src/beatrice/types/` | Adição pura |
| Adicionar nova tradução em `translations.ts` | Adição pura, não altera chaves existentes |
| Adicionar novo script Python em `scripts/` | Arquivo isolado, sem side effects |
| Corrigir typo em markdown operacional | Não altera semântica |
| Adicionar comentário ao código | Não altera comportamento |
| Corrigir classe Tailwind em componente | Usando token existente do `tailwind.config.ts` |
| Apagar arquivos `.tsbuildinfo` e artefatos `.js`/`.d.ts` na raiz | Confirmado como artefatos gerados — ver `GENERATED_FILES.md` |
| Apagar `.DS_Store` | Arquivo do macOS, sem impacto |

---

## Ações que exigem VERIFICAÇÃO antes (mas não confirmação)

| Ação | O que verificar antes |
|------|----------------------|
| Editar sub-página carregada por hub | Confirmar que o hub ainda a importa corretamente |
| Editar `server.py` | Confirmar que o protocolo SSE não foi alterado |
| Editar `tailwind.config.ts` | Confirmar que o token modificado não existe em outro nome |
| Editar `src/routes.tsx` | Confirmar que `App.tsx` também reflete a mudança |
| Editar `src/i18n/translations.ts` | Confirmar que a chave alterada não quebra nenhum `t("chave")` existente |
| Editar qualquer arquivo em `beatrice/domain/` | Confirmar que types exportados não têm dependentes não atualizados |

---

## Componentes com nomes ambíguos — verificar caminho completo

Antes de editar qualquer componente abaixo, confirmar o caminho absoluto:

| Nome do arquivo | Caminhos possíveis | Diferença |
|----------------|-------------------|-----------|
| `PersonaSidebarPanel.tsx` | `beatrice/components/persona/` | Sidebar estático com Header+Insights+Stats |
| `PersonaWorkspace.tsx` | `beatrice/components/workspaces/` | Registry dinâmico de workspaces por persona |
| `PersonaMetrics.tsx` | `beatrice/components/persona/` | Stats de sessão (via `useWorkspace`) |
| `PersonaMetrics.tsx` | `beatrice/components/contextual/` | Métricas de estratégia (via `usePersonaContext`) |

---

## Arquivos que nunca devem ser editados manualmente

| Arquivo | Motivo |
|---------|--------|
| `vite.config.js` | Artefato gerado — editar `vite.config.ts` |
| `vite.config.d.ts` | Artefato gerado |
| `tailwind.config.js` | Artefato gerado — editar `tailwind.config.ts` |
| `tailwind.config.d.ts` | Artefato gerado |
| `*.tsbuildinfo` | Cache de build — deletável, não editável |
| `rag/chroma_db/**` | Banco de embeddings binário — gerenciado pelo ChromaDB |
| `data/*.sqlite3*` | Banco de dados binário — gerenciado pelo SQLite |

---

## Checklist de segurança antes de ação destrutiva

Antes de excluir, renomear ou refatorar:

- [ ] Rodou `grep -r "NomeDoArquivo" src/ --include="*.tsx" --include="*.ts"` e confirmou zero ou apenas auto-referências?
- [ ] Verificou se o arquivo aparece em `App.tsx` (lazy import) ou `routes.tsx`?
- [ ] Verificou se o arquivo é importado por um hub page (`FoundationsHubPage.tsx`, `DevelopersPage.tsx`)?
- [ ] Verificou se o arquivo exporta tipos usados por outros módulos?
- [ ] Se for renomear: atualizou **todos** os imports antes de renomear o arquivo?
- [ ] Se for alterar API: atualizou **todos** os consumers antes de alterar a assinatura?
