# Auditoria: dados do design system no raciocínio da Beatrice

**Snapshot auditado:** 2026-06-07, após as correções concorrentes de integração do chat
**Escopo:** workspace local atual, incluindo alterações ainda não commitadas.
**Conclusão curta:** a Beatrice possui retrieval e auditoria parcialmente estruturados, mas os metadados de componente solicitados não formam hoje um contrato estruturado de evidência. A maior parte não existe no corpus, parte é achatada em texto e parte é perdida antes do prompt.

**Nota de snapshot:** durante a auditoria foram reproduzidas duas incompatibilidades no frontend: envio de mensagem `system` não aceita pelo backend e `.map()` sobre `profile_contract_warnings` ausente. Alterações concorrentes corrigiram ambas antes do fechamento: o payload agora envia somente `history` e preferências em campos próprios (`chat.orchestrator.ts:36-57`), e o hook usa fallback para warnings opcionais (`useChatStream.ts:124-145`). O diagnóstico abaixo considera o estado corrigido.

## Achados críticos

1. **O Evidence Builder atual não preserva campos de componente.** Ele mantém apenas `title`, `source`, `page_type`, `excerpt`, similaridade e pesos; o `excerpt` é truncado em 360 caracteres (`agent/evidence.py:19-49`).
2. **No caso testado, o truncamento removeu as regras decisivas.** O excerpt de `Modal/Dialog` terminou antes de `when_to_use`; os excerpts de `Modal/Dialog` e `Button` não continham `when_not_to_use`, `accessibility` nem `status`.
3. **`status` está no ChromaDB, mas é descartado pelo retrieval.** O setup salva `status`, `when_to_use` e `when_not_to_use` em metadata (`rag/setup_vectordb.py:123-134`); `_chunk_from_result` retorna somente texto, título, fonte, tipo e scores (`rag/retrieval.py:134-157`).
4. **Chat e laboratório usam pipelines diferentes.** `/api/chat` passa pelo AgentRuntime (`server.py:1120-1329`); o laboratório ainda usa `_build_chunks` + contexto RAG completo, sem AgentRuntime (`server.py:350-425`).
5. **As perspectivas mudam muito mais o prompt do que a evidência.** No teste real, todas mantiveram `Modal/Dialog`, `Button` e `Select/Dropdown` na mesma ordem. Os pesos mudaram, mas não os documentos.
6. **As oito perspectivas agora possuem contratos Markdown registrados.** Developer e Accessibility Specialist mantêm validação detalhada; os outros seis contratos possuem sinais observáveis iniciais, mas ainda dependem de evidência mais estruturada no corpus.
7. **A UI agora expõe o audit operacional, mas não a proveniência por campo.** O `AuditTrail` mostra request, workflow, status, tier, similarity, tools, steps, fontes, excerpts e limitações (`AuditTrail.tsx:61-153`); não pode mostrar intent/status/do/don't usados porque o backend não os registra.

## 1. Fontes reais dos dados

| Campo | Existe hoje? | Onde aparece | Entra na indexação? | Texto ou metadado? | Observação |
|---|---|---|---|---|---|
| `component_name` | Não como campo; equivalente `title`/`id` | `ComponentDoc.title/id`, `ComponentsPage.tsx:72-91` | Sim | `title` estruturado + cabeçalho do texto | É rastreável como entidade, mas não se chama `component_name`. |
| `intent` | Sim como `intents[]`, não como intent canônico singular | `ComponentsPage.tsx:86-87`; explicações em `componentIntentDocumentation.ts:24+` | Não | Só UI TSX | O `intent` do router é outra coisa: intenção da pergunta, não intenção do componente. |
| `status` | Sim | `ComponentsPage.tsx:76,150`; dump e Chroma | Sim | Metadata estruturado no Chroma; fora do documento | Retrieval descarta. Todos os 25 componentes atuais são `Stable`, então não há validação de status diferencial. |
| `do's` | Sim como `do[]` | `componentUsageGuidance.ts:4-21` | Sim, após transformação | Concatenado em `when_to_use` | Perde lista, IDs de regra e proveniência individual. |
| `don'ts` | Sim como `dont[]` | `componentUsageGuidance.ts:4-21` | Sim, após transformação | Concatenado em `when_not_to_use` | Mesma perda estrutural. |
| `when_to_use` | Sim | `ComponentsPage.tsx:80`; dump | Sim | Texto do documento + metadata Chroma | No AgentRuntime chega apenas se couber no excerpt de 360 caracteres. |
| `when_not_to_use` | Sim | `ComponentsPage.tsx:81`; dump | Sim | Texto do documento + metadata Chroma | Quase sempre fica depois do limite do excerpt. |
| `variants` | Não | Nenhum schema canônico | Não | — | `intents[]` funciona visualmente como variantes semânticas, mas não é normalizado como `variants`. |
| `states` | Sim | `ComponentsPage.tsx:86,160+` | Não | Só UI TSX | O extractor ignora o array. |
| `accessibility_requirements` | Não com esse nome | `accessibility` por componente; `requirements` em `FoundationsPage.tsx:30-32,41+` | Parcial | Texto solto | O componente tem uma frase; contratos transversais viram chunks separados de `accessibility`. |
| `keyboard_behavior` | Não como campo | Prosa em `accessibility`, do/don't e contratos | Parcial | Texto solto | Sem estrutura, passos, teclas ou relação por estado. |
| `aria_requirements` | Não como campo | Prosa em componentes e `FoundationsPage.tsx:186-195` | Parcial | Texto solto | Sem lista ARIA estruturada por componente. |
| `edge_cases` | Não no corpus | Contrato de prompt Developer (`developer.md:83-89`) | Não como dado do DS | Prompt genérico | Pode aparecer na resposta sem vir de fonte real. |
| `content_guidelines` | Não como campo de componente | `GuidelinesPage.tsx`, regras de voz e interação | Parcial | Chunks genéricos | O workflow de decisão de componente não busca guideline no chat novo. |
| `governance_notes` | Não como campo | Perfis/prompts de governança e capability registry | Não para componente | Prompt/capability textual | Não há nota de governança ligada ao componente recuperado. |
| `related_components` | Não | Apenas instrução de resposta genérica | Não | — | Não existe grafo/array canônico de relações. |
| `decision_notes` | Não no corpus de componente | Campo operacional do laboratório (`laboratory/store.py`) | Não | Banco do laboratório | Não fundamenta respostas da Beatrice. |
| `examples` | Sim em arquivos auxiliares | `componentIntentDocumentation.ts`; snippets e capability examples | Não para componente | UI ou texto de capability | Exemplos por intent e snippets não entram no chunk do componente. |
| `anti_patterns` | Não como campo | `when_not_to_use`; prompt global `antiPatterns.md` | Parcial | Texto solto/prompt | Não há anti-pattern estruturado e rastreável por componente. |

### Schema efetivo do corpus

O dump possui 182 chunks. Os únicos campos semânticos comuns são:

`title`, `status`, `structure`, `logic`, `context_of_use`, `when_to_use`, `when_not_to_use`, `trade_offs`, `accessibility`, `rag_relation`, `aetheris_insight`, `text`.

Nos 25 componentes, esses campos estão preenchidos, mas `states`, `intents`, snippets e explicações por intent não são extraídos. A montagem está em `rag/extract_docs.py:203-236,243-285`.

O ChromaDB possui 182 registros e somente estes metadados:

`source`, `page_type`, `title`, `status`, `when_to_use`, `when_not_to_use`, `aetheris_insight`, `char_count`.

## 2. Pipeline atual

| Etapa | O que entra | Transformação/perda | O que chega adiante |
|---|---|---|---|
| Fonte | `COMPONENT_CATALOG`, `componentUsageGuidance`, Foundations, Guidelines, Patterns, Tokens | Dados distribuídos em TSX auxiliares; não há schema único | UI rica, mas corpus parcial |
| Extração | Regex sobre arrays/strings TSX | `do[]` e `dont[]` são unidos em strings; `states`, `intents`, snippets e exemplos são ignorados | Dump JSON de 182 chunks |
| Chunk | Um documento textual por entidade | `status` fica fora de `text`; sem arrays estruturados | Texto longo + campos no dump |
| Embedding | `c["text"]`, BGE-M3, `max_length=512` | Campos tardios podem sofrer truncamento no encoder | Vetor dense |
| ChromaDB | Documento completo + 8 metadados | Nem todos os campos do dump viram metadata | Registro vetorial |
| Router | Query, perfil e comando | Classificação por keywords | `retrieval_intent`, `response_intent`, perfil |
| Agent planner | Intent + query | `component_decision` escolhe `search_component` e `search_pattern` | Duas ferramentas, top 5 cada |
| Retrieval | Documento, metadata, similaridade | Filtro por `page_type`; peso por perfil e boost lexical; metadata semântica é descartada | Dict com texto completo e scores |
| Evidence Builder | Chunks recuperados | Deduplica e trunca cada texto em 360 caracteres | `EvidenceItem` sem status/do/don't/states/a11y estruturados |
| Prompt final | System layers, perfil, intent, template, Agent Context JSON | Com `agent_context`, `rag_context` completo é desativado (`server.py:190`) | LLM recebe excerpts e scores; `dev/a11y` recebem contratos adicionais |
| Resposta | Composição Groq | Nenhuma validação factual por campo | Texto livre |
| `audit_metadata` | Plano, tools, steps, EvidenceItems, top similarity/tier | Não registra campos usados nem decisão campo a campo | Audit backend parcialmente estruturado |
| Frontend | SSE com sources/intent/audit | Mescla eventos iniciais e finais; warnings são opcionais | Chips mostram fontes; `AuditTrail` mostra o audit operacional, ainda sem cobertura por campo |

### O que aparece na UI

- `ReasoningBanner`: intent, contagem de fontes e skills (`ReasoningBanner.tsx:33-76`).
- Chips de fonte: título e similaridade (`ChatMessage.tsx:123-138`).
- `AuditTrail`: request, workflow, execution status, evidence tier/similarity, decision, tools, steps, fontes/excerpts e limitações (`AuditTrail.tsx:61-153`).
- O mecanismo legado de `AuditEntry` ainda deriva confiança e trade-offs localmente para outras superfícies (`domain/audit/transformers.ts:6-40`), mas o drawer atual também consome diretamente `audit_metadata`.
- Nenhuma superfície consegue exibir campos do componente efetivamente usados, porque esses dados não existem no contrato do audit.

## 3. Profundidade de uso

Escala pedida: 1 não existe; 2 existe mas não é indexado; 3 indexado como texto; 4 recuperado sem peso especial; 5 usado no prompt sem estrutura obrigatória; 6 Evidence Builder estruturado; 7 influencia recomendação; 8 auditável.

| Dado | Profundidade | Evidência | Impacto real | Lacuna |
|---|---:|---|---|---|
| Nome do componente | 8 | `title` no retrieval, EvidenceItem e audit | Identifica a recomendação e fonte | Falta campo explícito `recommended_component`. |
| Intent do componente | 2 | `intents[]` só no TSX/UI | Nenhum no RAG | Confundido com intent da query. |
| Status | 3* | Chroma metadata, descartado no retrieval | Nenhum | Caso especial: estruturado no índice, invisível após retrieval. |
| Do's | 4 | Viram `when_to_use` no documento | Afetam embedding; conteúdo parcial no excerpt | Sem regras individuais ou registro de uso. |
| Don'ts | 4 | Viram `when_not_to_use` | Afetam embedding; normalmente não chegam ao LLM novo | Sem regras individuais ou cobertura. |
| When to use | 4 | Documento + Chroma metadata | Ajuda ranking; presença no prompt é acidental pelo tamanho | Precisa campo no EvidenceItem. |
| When not to use | 4 | Documento + Chroma metadata | Ajuda ranking; geralmente truncado | Precisa campo no EvidenceItem. |
| Variants | 1 | Ausente | Nenhum | Normalizar variantes semânticas. |
| States | 2 | Array no TSX | Nenhum vindo da fonte | Contratos `dev/a11y` podem inventariar estados genéricos. |
| Accessibility requirements | 4 | `accessibility` em texto; chunks transversais | Afeta embedding; não chega de forma confiável | Recuperar contrato aplicável e preservar campo. |
| Keyboard behavior | 3 | Prosa solta | Pode afetar embedding; prompt especializado injeta conhecimento genérico | Estruturar teclas e transições. |
| ARIA requirements | 3 | Prosa solta | Igual ao keyboard behavior | Estruturar atributos e condições. |
| Edge cases | 1/5* | Não existe no corpus; existe no prompt Developer | Pode alterar resposta `dev`, mas não é evidência Aetheris | Separar requisito de resposta de dado real. |
| Content guidelines | 3 | Guidelines genéricas | Não são buscadas no workflow testado | Relacionar ao componente e à perspectiva Writer. |
| Governance notes | 1/5* | Perfis/prompts, não metadata | Pode mudar framing do Maintainer | Criar evidência governada por componente. |
| Related components | 1 | Ausente | Nenhum | Criar relações explícitas. |
| Decision notes | 1 | Só operação do laboratório | Nenhum | Conectar ADR/decision memory ao componente. |
| Examples | 2 | Intent docs/snippets fora do extractor | Nenhum vindo da fonte | Indexar exemplos com proveniência. |
| Anti-patterns | 3/5* | `when_not_to_use` + prompt global | Restrições podem aparecer, mas sem rastreabilidade | Campo próprio e IDs de regra. |

`*` indica que a taxonomia 1-8 não representa perfeitamente o estado híbrido: o dado está em metadata de armazenamento ou em prompt, mas não no Evidence Builder.

## 4. Caso de teste: ação destrutiva

Pergunta: **“Qual componente devo usar para uma ação destrutiva, como excluir um item importante?”**

### Retrieval real

- Router: `component_guidance`.
- Agent workflow: `component_decision`.
- Ferramentas: `search_component` + `search_pattern`.
- Top componentes: `Modal/Dialog` 0,561; `Button` 0,556; `Select/Dropdown` 0,539; `Card` 0,528; `Alert` 0,526.
- Tier global: `partial`.
- O terceiro resultado já é ruído; os cinco patterns adicionais também não ajudam diretamente à confirmação destrutiva.
- A chamada de composição atual recebeu HTTP 429 da Groq. Portanto não existe uma resposta nova válida para afirmar uso campo a campo.

### Evidência histórica mais próxima

O run `f41a4ceb-...` perguntou “Modal ou SideDrawer: qual padrão usar para confirmar uma ação destrutiva?” nas sete lentes. Todas recomendaram Modal, com diferenças pequenas de redação, e todas tinham `audit_metadata = {}`.

| Item | Entrou no contexto atual? | Apareceu na resposta histórica? | Mudou recomendação? | Auditável? | Origem |
|---|---|---|---|---|---|
| Intent do componente | Não | “confirmar” aparece como linguagem comum | Não demonstrável | Não | Query/modelo, não `intents[]` |
| Status | Não | Não | Não | Não | Fonte real perdida |
| Do's | Parcial; achatado e truncado | Recomendação de Modal | Possivelmente, mas não rastreável | Não | Fonte real + modelo |
| Don'ts | Não no excerpt decisivo | Algumas respostas dizem “não use” | Não demonstrável | Não | Provável prompt/modelo |
| When to use | Parcial | Justificativa de foco/confirmação | Compatível com a fonte | Não por regra | Fonte real parcial |
| When not to use | Não | Irregular | Não | Não | Modelo/prompt |
| States | Não | “erro” aparece genericamente; sem cobertura | Não | Não | Conhecimento genérico |
| Edge cases | Não no corpus | Não apareceram nos runs históricos | Não | Não | Só contrato novo Developer |
| Accessibility requirements | Campo real truncado | Sinais inconsistentes; até A11y não mostrou cobertura clara | Não demonstrável | Não | Prompt/modelo |
| Content guidelines | Não | Quase ausente | Não | Não | Modelo |
| Governance notes | Não | Não apareceram sinais de governança | Não | Não | Perfil não materializado |

**Resposta honesta ao teste:** a recomendação `Modal/Dialog` é coerente com a fonte real, e `Button negative` também existe na fonte. Porém o pipeline atual não consegue provar quais regras específicas causaram a escolha. A recomendação é plausivelmente ancorada pelo título, descrição e similaridade; não é auditável por intent/status/do/don't.

## 5. Uso por perspectiva

| Perspectiva | Dados que deveriam entrar | Dados que entram hoje | Profundidade | Lacuna principal |
|---|---|---|---:|---|
| Developer (`dev`) | states, edge cases, API, async/error/loading, implementation | Mesmos excerpts + perfil + contrato Developer | 5 | API/edge cases são exigidos pelo prompt, não sustentados por metadata real. |
| Accessibility Specialist (`a11y`) | a11y, keyboard, ARIA, focus, error prevention | Mesmos excerpts + perfil + contrato A11y | 5 | Contrato é forte, mas o campo real de acessibilidade foi truncado e chunks a11y não foram buscados. |
| QA (`qa`) | acceptance criteria, states, edge cases, regression | Mesmos excerpts + perfil e contrato QA | 4/5 | O corpus ainda não preserva states/criteria como campos estruturados. |
| Designer (`designer`) | visual guidelines, tokens, variants, states | Mesmos componentes/patterns + perfil Designer | 4/5 | Workflow não busca tokens/foundations; evidência não mudou no teste. |
| Maintainer (`maintainer`) | maintenance, reuse, duplication, coupling | Mesmos excerpts + perfil Maintainer | 4/5 | Sem metadata de manutenção ou dependências. |
| Tech Writer (`tech_writer`) | content guidance, naming, examples, microcopy | Mesmos excerpts + perfil e contrato Tech Writer | 4/5 | Exemplos e intent docs existem na UI, mas não no corpus. |
| Product Designer (`product_designer`) | user flow, necessidade, fricção, alternativas, validação | Mesmos excerpts + perfil e contrato Product Designer | 4/5 | A lente existe, mas evidência de pesquisa e comportamento ainda é limitada. |
| Design System Manager (`design_system_manager`) | governance, status, adoção, exceções, impacto | Mesmos excerpts + perfil e contrato Design System Manager | 4/5 | Falta evidência estruturada de governança, status e adoção. |

### Resultado do teste de perspectiva

Para a pergunta exata, as lentes mantiveram os mesmos resultados principais. Como todos os candidatos principais eram `component`, o peso por `page_type` multiplicou todos quase igualmente; o boost de vocabulário não alterou a ordem. Logo, a adaptação observável ocorreu no **prompt/perfil**, não na seleção de evidência.

## 6. Auditabilidade

| Questão rastreável | Hoje? | Evidência |
|---|---|---|
| Qual componente foi recomendado | Parcial | Fontes mostram candidatos; não há `recommended_component` nem vínculo entre conclusão e fonte. |
| Qual intent justificou a escolha | Só intent da query | `audit_metadata.intent`; não há intent do componente. |
| Qual status foi considerado | Não | `status` não sai do retrieval. |
| Quais do's foram usados | Não | Regras foram concatenadas e não há `used_rule_ids`. |
| Quais don'ts foram usados | Não | Mesmo problema; frequentemente truncados. |
| Quais fontes sustentaram | Sim | `audit_metadata.sources` com título, origem, excerpt e scores. |
| Evidence similarity | Sim | Global e por fonte. |
| Evidence tier | Sim, com ressalva | Global pelo maior score; SSE atribui o mesmo tier global a todas as fontes (`server.py:275-291`). |
| Sinais da perspectiva presentes/ausentes | Só `dev` e `a11y`, no evento final | `matched_signals` e warnings por matching lexical da resposta. |
| Campos efetivamente usados pelo LLM | Não | Não há field-level provenance ou coverage. |
| O que aparece na UI | Parcialmente | Audit operacional é renderizado; faltam componente recomendado, status considerado, regras usadas e proveniência por campo. |

O validator de perspectiva verifica frases observáveis na resposta (`prompts/perspective_contracts.py:304-346`). Ele não confirma que essas frases vieram da evidência recuperada.

## 7. Diagnóstico final

Entre as opções propostas, o diagnóstico correto é:

> **Parcialmente estruturada**, com uso efetivo dos metadados de componente ainda **superficial**.

Por quê:

- Há estrutura real para plano, tools, fontes, similarity, tier e steps.
- O corpus tem bons textos de uso/não uso e acessibilidade.
- Porém não existe `component_evidence` com os campos solicitados.
- O Evidence Builder reduz cada chunk a um excerpt de 360 caracteres.
- Status e arrays de componente são perdidos.
- Perspectivas especializadas, em geral, reinterpretam os mesmos excerpts.
- Apenas Developer e Accessibility possuem validação de sinais, e ela valida texto produzido, não proveniência.
- A UI apresenta o audit operacional, mas o backend não fornece evidência semântica por campo para ela apresentar.

## 8. Proposta de correção

### Fundação operacional

1. Manter as correções já aplicadas ao payload e ao parsing de warnings cobertas por regressão.
2. Adicionar teste E2E real frontend payload → FastAPI → SSE inicial/final → `AuditTrail`.
3. Unificar chat e laboratório no mesmo pipeline, ou marcar explicitamente versões diferentes.

### Nível 1: mínimo seguro

1. Fazer `_chunk_from_result` preservar `status`, `when_to_use`, `when_not_to_use`, `accessibility` e `aetheris_insight`.
2. Não usar o excerpt como armazenamento semântico. Manter `excerpt` só para UI; passar campos completos ao prompt.
3. Preservar `do[]`/`dont[]` como listas, mesmo que serializadas em JSON no Chroma.
4. Adicionar ao audit:
   - `recommended_component`;
   - `component_status`;
   - `used_do_rules`;
   - `used_dont_rules`;
   - `missing_component_fields`;
   - `field_sources`.
5. Instruir o prompt a declarar “O corpus não define X” quando status/intents/states/a11y não estiverem presentes.

### Nível 2: estruturado

1. Criar schema canônico `ComponentMetadata` fora do TSX visual:
   - identidade e status;
   - intents, variants e states;
   - do/don't e when use/not use;
   - a11y, keyboard e ARIA;
   - edge cases, content, governance, relations, examples e anti-patterns.
2. Indexar vetores por entidade, mas carregar o registro completo por `component_id` após retrieval. Chroma deve localizar; um store JSON/SQLite deve preservar arrays e objetos sem achatamento.
3. Criar `ComponentEvidence` no Evidence Builder com:
   - campos presentes;
   - campos ausentes;
   - proveniência por campo;
   - regras usadas;
   - similaridade da entidade;
   - coverage por perspectiva.
4. Definir requisitos mínimos por perspectiva e validar evidência **antes** da geração.
5. Validar a resposta contra `ComponentEvidence`, não apenas por ocorrência de palavras.

### Nível 3: inteligente por perspectiva

1. Retrieval field-aware: query expansion e boost por `states`, a11y, content, governance, edge cases e status.
2. Pesos por campo, não apenas por `page_type`; hoje multiplicar todos os componentes igualmente não muda a ordem.
3. Recuperação multi-hop:
   - componente;
   - contratos transversais aplicáveis;
   - related components;
   - decisões/governança;
   - exemplos e anti-patterns.
4. Aprofundar os sinais verificáveis dos contratos de QA, Designer, Product Designer, Tech Writer, Maintainer e Design System Manager.
5. Medir por perspectiva:
   - field coverage;
   - grounded field usage;
   - unsupported specialist claims;
   - divergence causada por evidência, não só por estilo.
6. Enriquecer o corpus onde o validator detectar ausência, com revisão humana e versionamento.

## Verificações executadas

- ChromaDB inspecionado diretamente: 182 registros.
- Retrieval BGE-M3 real para a pergunta em todas as lentes existentes.
- Chamada direta ao `/api/chat` em `general`, `dev` e `a11y`: retrieval e audit inicial funcionaram; composição bloqueada por rate limit 429.
- Run histórico de sete perspectivas consultado no SQLite do laboratório.
- `python3 scripts/test_perspective_contracts.py`: passou.
- `python3 -m unittest discover -s tests/agent -v`: 37 testes passaram.
- `python3 scripts/test_laboratory.py`: passou.
- `npm run build`: passou, incluindo navegação primária, TypeScript e build Vite.
- `pytest` não estava instalado no ambiente.
