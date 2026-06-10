# evals/ — Sistema de Avaliação da Beatrice

> Documentação do sistema de eval da Beatrice: schema JSONL, métricas, perspectivas, calibração e automação.
> Atualizado: 2026-06-06.

---

## Visão Geral

O sistema de eval mede a qualidade das respostas da Beatrice em três dimensões:

1. **Determinístico** — verificação automática de fatos, claims proibidos, fontes, abstinência e estrutura
2. **Relacional** — estabilidade entre repetições e convergência/divergência entre perspectivas
3. **Humano** — revisão manual de correção factual, fidelidade a fontes e utilidade

Os casos de eval estão em `evals/cases/*.jsonl`. O engine de avaliação está em `laboratory/`.

---

## Estrutura de Arquivos

```
evals/
  cases/
    beatrice-core-v1.jsonl   # Conjunto principal (8 casos)
    <novo-conjunto>.jsonl    # Futuros conjuntos de casos

laboratory/
  cases.py       # Loader + validador de schema JSONL
  metrics.py     # Cálculo de métricas determinísticas e relacionais
  runner.py      # Orquestrador assíncrono de execução
  store.py       # Persistência SQLite (WAL mode)
  calibration.py # Sistema de calibração de perspectivas
  automation.py  # Agendamento automático diário (3 slots)

data/
  aetheris-laboratory.sqlite3   # DB gerado em runtime (gitignored)
```

---

## Schema de um Caso de Eval

Cada linha do JSONL é um objeto JSON com os campos abaixo. Todos os campos são obrigatórios a menos que indicado.

```jsonc
{
  // Identificador único dentro do conjunto. Use kebab-case descritivo.
  "id": "blocking-error-toast",

  // Deve corresponder exatamente ao nome do arquivo sem extensão.
  // Ex: arquivo "beatrice-core-v1.jsonl" → version "beatrice-core-v1"
  "version": "beatrice-core-v1",

  // Pergunta natural exatamente como o usuário a faria.
  "question": "Devo usar Toast para comunicar um erro que bloqueia o fluxo?",

  // Categoria do caso. Valores permitidos abaixo.
  "category": "decision",

  // Intent que o classificador deve inferir. Valores permitidos abaixo.
  "expected_intent": "component_guidance",

  // Áreas de fonte esperadas. Deve cruzar com os page_type das chunks indexadas.
  "expected_source_areas": ["component", "guideline"],

  // Grupos de fatos obrigatórios. A resposta deve conter ao menos um termo
  // de cada grupo (verificação lexical normalizada).
  "required_facts": [
    {
      "id": "blocking-state",
      "any_of": ["bloqueia", "blocking", "impede a continuação"]
    },
    {
      "id": "persistent-recovery",
      "any_of": ["persistente", "persistent", "recuperação", "recovery"]
    }
  ],

  // Grupos de claims proibidos. A resposta NÃO deve conter nenhum.
  // Score de 0 se qualquer claim for encontrado.
  "forbidden_claims": [
    {
      "id": "always-toast",
      "any_of": ["sempre use toast", "always use toast"]
    }
  ],

  // Se true, a resposta deve conter uma das abstention_terms definidas em metrics.py.
  // Use em casos out_of_scope ou contradictory sem evidência.
  "abstention_expected": false,

  // Modo de convergência. Valores permitidos abaixo.
  "convergence": "diverge",

  // Termos esperados por perspectiva. Cada perspectiva deve cobrir
  // ao menos um dos termos para o perspective_signal ser 1.0.
  // Omitir uma perspectiva → perspective_signal "pending-review" para ela.
  "perspective_expectations": {
    "dev":      { "any_of": ["estado", "contrato", "orquestração"] },
    "designer": { "any_of": ["hierarquia", "tokens", "consistência visual"] },
    "product_designer": { "any_of": ["usabilidade", "fluxo", "validação"] },
    "qa":       { "any_of": ["falha", "regressão", "critério"] },
    "tech_writer": { "any_of": ["mensagem", "terminologia", "compreensão"] },
    "a11y":     { "any_of": ["foco", "tecnologia assistiva", "screen reader"] },
    "maintainer": { "any_of": ["manutenção", "acoplamento", "duplicação"] },
    "design_system_manager": { "any_of": ["governança", "adoção", "roadmap"] }
  },

  // Termos estruturais esperados na resposta (seções, headers, palavras-chave
  // de estrutura). Se vazio, o sistema verifica apenas comprimento mínimo (20 tokens).
  "structure_terms": ["recomendação"]
}
```

---

## Categorias

| Categoria | Quando usar |
|-----------|-------------|
| `factual` | Perguntas com resposta objetiva única no corpus |
| `decision` | Escolhas de componente, padrão ou abordagem com trade-offs |
| `ambiguous` | Perguntas sem contexto suficiente — Beatrice deve pedir mais informação |
| `contradictory` | Duas diretrizes parecem conflitar — Beatrice deve surfaçar o conflito |
| `out_of_scope` | Pergunta fora do domínio do design system — Beatrice deve abster-se |
| `accessibility` | Contratos de acessibilidade, ARIA, foco, teclado |
| `governance` | Variações locais, exceções, precedentes de decisão |

---

## Modos de Convergência

| Modo | Comportamento esperado | Métrica gerada |
|------|----------------------|----------------|
| `converge` | Todas as perspectivas chegam ao mesmo fato central | `factual_convergence` (similaridade lexical média) |
| `diverge` | Cada perspectiva contribui com ângulo distinto e complementar | `principled_divergence` (1 − similaridade; status `provisional` — requer revisão humana) |
| `abstain` | A Beatrice se recusa a responder (out_of_scope) | `abstention` (1.0 se absteve, 0.0 se respondeu) |

---

## Intents Esperados

Os valores de `expected_intent` devem corresponder aos intents reconhecidos pelo classificador em `server.py`:

| Intent | Quando usar |
|--------|-------------|
| `component_guidance` | Perguntas sobre uso correto de componentes |
| `pattern_guidance` | Perguntas sobre padrões de UX |
| `token_lookup` | Perguntas sobre tokens de design |
| `design_decision` | Perguntas sobre decisões arquiteturais documentadas |
| `when_not_to_use` | Perguntas sobre anti-padrões e restrições |
| `xai_explanation` | Perguntas sobre como a Beatrice raciocina |
| `comparison_query` | Comparações diretas entre componentes ou padrões |
| `general` | Catch-all — usado em out_of_scope |

---

## Perspectivas de Avaliação

O sistema executa cada caso por perspectiva. Cada perspectiva representa um papel profissional com prioridades diferentes:

| Perspectiva | Papel | Foco |
|------------|-------|------|
| `dev` | Developer | Contratos, estado, integração e implementação |
| `designer` | Designer | Composição, hierarquia, tokens e consistência visual |
| `product_designer` | Product Designer | Usabilidade, fluxo, necessidades, evidência e validação |
| `qa` | QA | Critérios de aceite, regressão, estados e cobertura |
| `tech_writer` | Tech Writer | Terminologia, exemplos, microcopy e instruções |
| `a11y` | Accessibility Specialist | WCAG, ARIA, foco, teclado e tecnologia assistiva |
| `maintainer` | Maintainer | Manutenção, acoplamento, duplicação e custo de evolução |
| `design_system_manager` | Design System Manager | Governança, adoção, prioridade, roadmap e maturidade |

---

## Métricas Computadas

### Métricas por Item (determinísticas)

| Métrica | Tipo | Descrição |
|---------|------|-----------|
| `required_fact_coverage` | `measured` | Proporção de grupos de fatos obrigatórios cobertos na resposta |
| `forbidden_claim_avoidance` | `measured` | 1.0 se nenhum claim proibido foi detectado |
| `retrieval_precision` | `measured` | Fontes recuperadas ∩ esperadas / fontes recuperadas |
| `source_coverage` | `measured` | Fontes recuperadas ∩ esperadas / fontes esperadas |
| `abstention` | `measured` | 1.0 se `abstention_expected` corresponde ao comportamento observado |
| `perspective_signal` | `measured` | 1.0 se ao menos um termo da perspectiva está na resposta |
| `structural_adherence` | `measured` | Proporção de `structure_terms` encontrados (mínimo 20 tokens se vazio) |
| `observed_correctness` | `provisional` | Composto de required_fact_coverage + forbidden_claim_avoidance + abstention |
| `evidence_confidence` | `measured` / `insufficient-data` | Confiança do retrieval reportada pelo servidor |
| `intent_match` | `measured` | 1.0 se o intent observado corresponde ao `expected_intent` |
| `factual_correctness` | `pending-review` | Requer revisão humana |
| `source_fidelity` | `pending-review` | Requer revisão humana |
| `usefulness` | `pending-review` | Requer revisão humana |

### Métricas Relacionais (por conjunto de itens)

| Métrica | Escopo | Descrição |
|---------|--------|-----------|
| `repeat_stability` | Case + perspectiva | Similaridade lexical média entre repetições do mesmo caso/perspectiva |
| `factual_convergence` | Case (converge) | Similaridade lexical média entre perspectivas — esperada alta |
| `principled_divergence` | Case (diverge) | 1 − similaridade entre perspectivas — esperada alta; `provisional` |

### Status de Métricas

| Status | Significado |
|--------|-------------|
| `measured` | Determinístico — confiável sem revisão |
| `provisional` | Calculado automaticamente mas pode ser substituído por humano |
| `pending-review` | Requer revisão humana obrigatória |
| `not-applicable` | Campo não relevante para este caso |
| `insufficient-data` | Dados insuficientes para calcular (ex: < 5 amostras para ECE) |
| `human-reviewed` | Score inserido por revisor humano via `save_review()` |

---

## Termos de Abstinência

O sistema detecta abstinência quando qualquer um dos seguintes termos aparece na resposta (normalizado — sem acentos, lowercase):

```
"nao ha evidencia"
"nao encontrei evidencia"
"o corpus oficial nao define"
"o corpus oficial do aetheris nao define"
"nao posso afirmar"
"evidencia insuficiente"
"fora do escopo"
"no official evidence"
"insufficient evidence"
"the official corpus does not define"
"out of scope"
```

---

## Como Adicionar um Novo Caso

### 1. Identifique a categoria e o modo de convergência

- A pergunta tem resposta objetiva única? → `factual` + `converge`
- A pergunta exige trade-offs? → `decision` + `diverge`
- A pergunta é vaga demais? → `ambiguous` + `diverge`
- A pergunta é fora do domínio? → `out_of_scope` + `abstain`, `abstention_expected: true`

### 2. Escreva o caso em JSONL

```jsonc
// Uma linha por caso — sem quebras de linha dentro do objeto
{"id":"my-new-case","version":"beatrice-core-v1","question":"...","category":"decision","expected_intent":"component_guidance","expected_source_areas":["component"],"required_facts":[{"id":"fact-1","any_of":["termo-obrigatório"]}],"forbidden_claims":[],"abstention_expected":false,"convergence":"diverge","perspective_expectations":{"designer":{"any_of":["hierarquia"]},"dev":{"any_of":["contrato"]}},"structure_terms":["recomendação"]}
```

### 3. Valide o schema

```bash
python3 -c "from laboratory.cases import load_case_set; print(load_case_set('beatrice-core-v1').public_metadata())"
```

Se houver erro de schema, a mensagem indica o campo e o case_id problemático.

### 4. Regras de qualidade

- `id` deve ser único no arquivo — duplicatas causam `ValueError` no load
- `version` deve ser idêntico ao nome do arquivo sem `.jsonl`
- `required_facts` devem ser verificáveis lexicalmente — use sinônimos variados em `any_of`
- `forbidden_claims` devem ser específicos o suficiente para não dar falsos positivos
- Cubra ao menos 3 perspectivas em `perspective_expectations` por caso `decision`
- Casos `out_of_scope` devem ter `expected_source_areas: []` e `required_facts: []`

---

## Como Criar um Novo Conjunto de Casos

1. Criar `evals/cases/<nome-do-conjunto>.jsonl`
2. O `version` de cada linha deve ser `<nome-do-conjunto>` (idêntico ao filename sem extensão)
3. O conjunto será carregado automaticamente por `list_case_sets()` e estará disponível na UI do laboratório
4. Para usar como conjunto padrão da automação, atualizar `case_set_id` em `LaboratoryAutomation.__init__`

---

## Pipeline de Execução

```
JSONL case file
    ↓ load_case_set()          # laboratory/cases.py
    ↓ LaboratoryStore.create_run()  # Cria run + items no SQLite
    ↓ LaboratoryRunner.process()    # Para cada item:
        ↓ generate(item)            # Chama Beatrice (RAG + Groq)
        ↓ score_answer()            # laboratory/metrics.py
        ↓ store.complete_item()     # Persiste resposta + métricas
    ↓ relational_scores()      # Métricas entre items
    ↓ store.finalize_run()     # Agrega scores, gera ECE se possível
```

### Tratamento de Rate Limit

O runner faz até 6 retentativas com backoff quando recebe `RateLimitError`. O item fica em status `waiting_rate_limit` durante a espera e volta a `running` após o tempo indicado pelo servidor.

---

## Automação Diária

O `LaboratoryAutomation` agenda 3 slots por dia no fuso `Europe/Lisbon`:

| Slot | Hora | Label | Repetições | Propósito |
|------|------|-------|------------|-----------|
| 1 | 00:00 | `candidate1` | 1 | Run de controle com calibração atual |
| 2 | 08:00 | `candidate2` | 2 | Experimento com calibração proposta |
| 3 | 16:00 | `candidate3` | 3 | Validação final da proposta |

### Ciclo de Calibração

Após o candidate1, o sistema:
1. Calcula `perspective_objectives` (média das métricas objetivas por perspectiva)
2. Identifica as 2 perspectivas com pior score
3. Propõe ajuste de ±0.05 em `technicality` ou `risk_sensitivity` dentro do limite de ±0.15
4. Executa candidate2 e candidate3 com a nova calibração
5. Avalia guardrails (regressão máxima tolerada por métrica)
6. Se todos os guardrails passam → cria recomendação de promoção da calibração

---

## Calibração de Perspectivas

Cada perspectiva tem dois parâmetros calibráveis:

| Campo | Padrão | Faixa | Significado |
|-------|--------|-------|-------------|
| `technicality` | Varia por perfil | 0.0 – 1.0 | Nível de detalhe técnico esperado na resposta |
| `risk_sensitivity` | Varia por perfil | 0.0 – 1.0 | Ênfase em riscos e salvaguardas |

A calibração ativa é persistida em `laboratory_calibration_versions` no SQLite.
O drift máximo de qualquer campo em relação ao default do perfil é **±0.15**.

---

## Persistência SQLite

O banco fica em `data/aetheris-laboratory.sqlite3` (criado automaticamente, gitignored).

Tabelas principais:

| Tabela | Conteúdo |
|--------|----------|
| `laboratory_runs` | Metadados de cada run (case set, profiles, status, aggregate) |
| `laboratory_run_items` | Um item por (run, case, profile, repetition) |
| `laboratory_item_sources` | Fontes recuperadas por item |
| `laboratory_metric_scores` | Todos os scores (determinísticos, relacionais, humanos) |
| `laboratory_human_reviews` | Revisões humanas |
| `laboratory_calibration_versions` | Histórico de versões de calibração |
| `laboratory_calibration_proposals` | Propostas geradas pela automação |
| `laboratory_recommendations` | Recomendações para o administrador |
| `laboratory_notifications` | Notificações de eventos |
| `laboratory_audit_events` | Log imutável de ações |

---

## Conjunto Atual: `beatrice-core-v1`

8 casos cobrindo todas as 7 categorias:

| ID | Categoria | Convergência | Intent |
|----|-----------|-------------|--------|
| `factual-token-source` | `factual` | `converge` | `token_lookup` |
| `blocking-error-toast` | `decision` | `diverge` | `component_guidance` |
| `destructive-confirmation` | `decision` | `diverge` | `comparison_query` |
| `accessible-dialog-contract` | `accessibility` | `converge` | `component_guidance` |
| `ambiguous-dashboard-density` | `ambiguous` | `diverge` | `component_guidance` |
| `contradictory-guidance` | `contradictory` | `diverge` | `design_decision` |
| `governance-exception` | `governance` | `diverge` | `design_decision` |
| `outside-corpus-tax-policy` | `out_of_scope` | `abstain` | `general` |

---

## Checklist para Revisão Humana

Ao revisar um item no laboratório, avaliar:

- [ ] **factual_correctness** (0.0 – 1.0): A resposta está correta em relação ao corpus?
- [ ] **source_fidelity** (0.0 – 1.0): A resposta reflete fielmente as fontes citadas?
- [ ] **usefulness** (0.0 – 1.0): A resposta seria útil para um profissional real neste papel?

Reviews substituem o score `provisional` de `observed_correctness` e alimentam o ECE (Expected Calibration Error).
