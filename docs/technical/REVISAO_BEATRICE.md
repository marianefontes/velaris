# REVISAO_BEATRICE.md

Resumo do trabalho noturno para revisão antes do PR manual.

> Data: 2026-06-10. Nenhum deploy, nenhum push, nenhum PR. Tudo pronto para você revisar.

---

## 0. Diagnóstico (o que já estava bom)

O backend já estava em ótimo estado e a maior parte dos riscos da Fase 0 já estavam resolvidos:

- `server.py` usa `BGEM3FlagModel` com `return_dense=True, return_sparse=False, return_colbert_vecs=False`.
- O modelo carrega uma vez no `lifespan` (startup), não a cada request.
- ChromaDB é consultado em runtime; intent filtering por `page_type` está conectado.
- Erros do Groq (401, 429, 5xx, timeout, sem conexão) já eram tratados com mensagens claras.
- `/health` e `/api/health` já refletem dados reais (modelo, chunks, embedder, etc.).

Os problemas reais estavam em: bootstrap do índice em produção, busca decorativa, mensagem
offline imprópria para produção, reconciliação de variáveis de ambiente e um aria-label faltando.

---

## 1. Inteligência da Beatrice

- Adicionado bootstrap automático do índice vetorial: se a coleção do ChromaDB estiver vazia
  no startup, ela é reconstruída a partir do corpus versionado `rag/aetheris-docs-dump.json`
  (182 chunks), usando o mesmo encoding dense do `setup_vectordb.py`. Isso garante que o RAG
  funcione de verdade após o deploy, onde `rag/chroma_db/` não é versionado.
- Não houve reescrita do pipeline de prompts nem do roteamento de intenção: já cobrem PT-BR,
  PT-PT e EN e são medidos pelo laboratório. Mudanças amplas ali poderiam deslocar a qualidade
  medida, então foram deixadas como estão (decisão conservadora).

## 2. RAG / XAI

- `rag/bootstrap.py` (novo): função `bootstrap_collection(collection, embedder)` idempotente,
  testada contra uma coleção temporária (indexa 182 chunks, não duplica na segunda execução,
  metadados round-trip OK).
- `CHROMA_DB_PATH` agora é configurável para apontar para um disco persistente, evitando
  reconstruir o índice a cada reinício.
- Atribuição de fontes via SSE (`sources`, `intent`) continua intacta.

## 3. Busca

- A busca do topo era decorativa (`searchQuery` ficava no estado e nunca era usado).
  Agora é uma busca global real e acessível.
- Índice canônico gerado do corpus (`scripts/build_search_index.py` -> `src/search/searchEntries.generated.ts`),
  com aliases bilíngues embutidos (ex.: "botão" acha Button, "confiança" acha Confidence Badge,
  "espaçamento" acha tokens de spacing).
- Motor de busca puro (`src/search/searchEngine.ts`): normaliza acentos, tolera plural/singular,
  ranqueia (título exato > início > alias > palavra-chave > descrição), agrupa por tipo e
  despriva resultados legados.
- UI (`src/components/GlobalSearch.tsx`): dropdown com grupos (Páginas, Componentes, Padrões,
  Tokens, Decisões, Diretrizes, Raciocínio, Integração), navegação por teclado (setas, Enter,
  Esc), atalho ⌘K/Ctrl+K, estado vazio útil, `?q=` na URL, roles ARIA (combobox/listbox/option).
- Verificado no preview: "botão" -> Button no topo; "modal" + Enter navega para /components;
  "banana cósmica" -> estado vazio. 14 testes unitários passam.

## 4. Chat

- `offlineMessage` não mostra mais "rode uvicorn" em produção. Em dev mantém a dica técnica;
  em produção mostra "A Beatrice está temporariamente indisponível. Tente novamente em instantes."
- Endpoint do chat unificado: usa `VITE_ORACLE_API_URL` se definido, senão deriva de
  `VITE_API_BASE_URL` via `getApiBaseUrl()` (mesma fonte dos outros serviços). Isso conserta o
  caso em que produção definia só `VITE_API_BASE_URL` e o chat caía para `/api/chat` sem backend.
- Botão de envio do chat ganhou `aria-label` (faltava). Enter envia, Shift+Enter quebra linha.

## 5. i18n

- Novas chaves em pt-BR, pt-PT e en-US: bloco `search` (labels de grupo, labels de tipo,
  descrições, estado vazio, dicas de teclado) e `beatrice.chat.send`.
- `scripts/check_i18n.mjs` ganhou fallback em Node quando `rg` não está instalado.
- Resultado do check: nenhuma chave usada e indefinida (sem labels quebrados).
- Travessões (em dash) removidos de todos os arquivos novos criados aqui.

## 6. Preparação de deploy (sem publicar)

- `render.yaml`: adicionadas variáveis `ALLOWED_ORIGINS` (default `*`), `CHROMA_DB_PATH`
  (`/var/data/chroma_db`) e `HF_HOME` (`/var/data/hf_cache`) no serviço de backend.
- CORS configurável por `ALLOWED_ORIGINS` no `server.py`.
- Frontend já estava com SPA rewrite (`/* -> /index.html`) e `VITE_API_BASE_URL`.
- Criados `TESTE_PUBLICO_BEATRICE.md` e `RELEASE_CHECKLIST.md`.

## 7. Variáveis de ambiente para configurar amanhã

Backend (Render: serviço `beatrice-chat-server`):
- `GROQ_API_KEY` = sua chave Groq (obrigatória, `sync: false`).
- `ALLOWED_ORIGINS` = `*` por enquanto, ou o domínio do frontend depois.
- `CHROMA_DB_PATH` = `/var/data/chroma_db` (já no render.yaml).
- `HF_HOME` = `/var/data/hf_cache` (já no render.yaml).
- `RESEARCH_ADMIN_KEY` = gerada automaticamente.

Frontend (Render: serviço `aetheris-app`):
- `VITE_API_BASE_URL` = `https://beatrice-chat-server.onrender.com` (já no render.yaml).
  Alternativa: `VITE_ORACLE_API_URL` = `https://.../api/chat` se quiser apontar direto.

## 8. Comandos executados

- `python3 scripts/build_search_index.py` (gerou o índice de busca).
- `npx tsc -b` (type check, sem erros).
- `npm run build` (check de navegação + tsc + vite build, passou).
- `npx vitest run src/search/searchEngine.test.ts` (14/14).
- `npm run check:i18n` (sem chaves quebradas).
- Boot do backend via `TestClient` + `GET /api/health` (200).
- Bootstrap testado contra coleção Chroma temporária.

## 9. Testes que passaram

- 14/14 testes de busca.
- Type check limpo.
- Build de produção limpo.
- i18n sem chave faltando.
- Backend sobe e responde health.
- Verificação visual da busca no preview (ranking, vazio, teclado, navegação).

## 10. Limitações ainda existentes

- Dívida de i18n pré-existente: ~253 candidatos a texto hardcoded e ~416 chaves possivelmente
  não usadas, principalmente em telas administrativas e de estudo (`LaboratoryPage`,
  `ResearchAdminPage`, `StudyPage`). Não foram tocadas (fora do escopo e fora do fluxo público).
- 1 travessão pré-existente em `src/components/MeshGradientBg.tsx` e alguns em `src/index.css`
  (comentários), anteriores a este trabalho. Não removidos para não mexer em arquivo não relacionado.
- Primeiro start do backend em produção é lento (download do modelo + bootstrap do índice).
  Mitigado por `CHROMA_DB_PATH`/`HF_HOME` no disco; ainda assim o primeiro deploy pode exigir
  paciência no health check.
- Marca: o app exibe "VELARIS" no header enquanto o código e a documentação usam "Aetheris".
  Não foi feita renomeação em massa (cosmética e arriscada perto do teste). Vale alinhar depois.

## 11. Arquivos alterados

Novos:
- `src/search/types.ts`
- `src/search/pageEntries.ts`
- `src/search/searchEngine.ts`
- `src/search/searchEntries.generated.ts` (gerado)
- `src/search/searchEngine.test.ts`
- `src/components/GlobalSearch.tsx`
- `scripts/build_search_index.py`
- `rag/bootstrap.py`
- `RELEASE_CHECKLIST.md`, `TESTE_PUBLICO_BEATRICE.md`, `REVISAO_BEATRICE.md`

Modificados:
- `server.py` (bootstrap no startup, CORS por env, `CHROMA_DB_PATH`)
- `render.yaml` (env vars de backend)
- `src/beatrice/orchestrators/chat.orchestrator.ts` (endpoint + mensagem offline)
- `src/beatrice/components/chat/ChatInput.tsx` (aria-label no envio)
- `src/components/AppTopBar.tsx` (usa GlobalSearch)
- `src/components/AppShell.tsx` (remove estado de busca morto)
- `src/i18n/translations.ts` (bloco `search` + `beatrice.chat.send` em 3 locales)
- `scripts/check_i18n.mjs` (fallback sem ripgrep)

## 12. O que revisar antes do PR

- Aliases de busca em `scripts/build_search_index.py` (estão no seu vocabulário de produto?).
- Rotas dos resultados de busca: tokens -> `/foundations?focus=tokens`, patterns ->
  `/foundations?focus=patterns`, diretrizes -> `/foundations?focus=manifesto`, decisões ->
  `/foundations` (não há aba dedicada de decisões; segue o redirect legado). Componentes ->
  `/components`. Confirme que esses destinos fazem sentido para o seu fluxo.
- Textos novos de i18n (tom e terminologia em pt-PT e en-US).
- Decisão de manter `ALLOWED_ORIGINS=*` no teste público vs travar no domínio.
- Estratégia de persistência do índice (`CHROMA_DB_PATH`) e do modelo (`HF_HOME`) no disco do Render.

## 13. Confirmação

Não fiz deploy. Não fiz push. Não abri PR. Não publiquei nada. Não alterei produção.
Tudo está no working tree local para você revisar, testar e subir o PR manualmente.
