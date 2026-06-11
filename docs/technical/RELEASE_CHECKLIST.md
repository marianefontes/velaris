# RELEASE_CHECKLIST.md

Checklist interno de release para o teste público da Beatrice.
Marque cada item antes de subir o PR e antes de publicar.

> Atualizado em 2026-06-10 (preparação noturna automatizada).
> Nada foi publicado, nenhum push, nenhum PR aberto.

## Verificações já executadas nesta preparação

- [x] `npm run build` passou (check de navegação + `tsc -b` + `vite build`).
- [x] `npx tsc -b` sem erros de tipo.
- [x] Testes de busca passaram (`npx vitest run src/search/searchEngine.test.ts`, 14/14).
- [x] Backend sobe localmente via `TestClient` e `/api/health` responde 200.
- [x] Busca verificada no preview: ranking, agrupamento, estado vazio, teclado e navegação.
- [x] i18n: nenhuma chave usada e indefinida (sem labels quebrados). Chaves novas em pt-BR, pt-PT e en-US.
- [x] CORS configurável por `ALLOWED_ORIGINS` (default `*`).
- [x] Sem `uvicorn`/`npm start` exibido ao usuário final em produção (mensagem amigável).
- [x] Sem segredos no bundle do frontend (`GROQ_API_KEY` só no backend).
- [x] Sem mock no chat real (a resposta vem do RAG + Groq de verdade).
- [x] Sem travessão (em dash) nos arquivos novos criados nesta preparação.
- [x] Deploy NÃO executado. Push NÃO executado. PR NÃO aberto.

## Verificar manualmente amanhã (após configurar credenciais)

- [ ] `GROQ_API_KEY` configurada no serviço de backend (Render).
- [ ] Backend subiu no Render e `/api/health` mostra `rag_active: true` e `corpus_chunks > 0`.
- [ ] `/api/chat` responde via SSE com `sources`, `intent` e texto real.
- [ ] Frontend publicado abre `/beatrice-chat` e `/oracle` direto (SPA rewrite OK).
- [ ] Chat real responde a uma pergunta de ponta a ponta no domínio publicado.
- [ ] Busca global funciona no domínio publicado (PT e EN).
- [ ] Refresh direto em rotas internas (`/components`, `/foundations`, `/reasoning`) não dá 404.
- [ ] Source chips aparecem nas respostas.
- [ ] Erros (429, 500, offline) exibem mensagem humana, sem detalhe técnico.
- [ ] Mobile: chat e busca utilizáveis em tela pequena.

## Notas

- Primeiro start do backend é lento: baixa o modelo BGE-M3 (~2.5 GB) e reconstrói o
  índice a partir de `rag/aetheris-docs-dump.json`. Com `CHROMA_DB_PATH` e `HF_HOME`
  no disco persistente, isso acontece uma vez; reinícios seguintes são rápidos.
- Render free/starter pode hibernar. O primeiro request após hibernar acorda o serviço
  e pode levar alguns segundos; a UI mostra mensagem amigável se a API não responder.
