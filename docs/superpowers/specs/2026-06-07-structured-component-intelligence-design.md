# Structured Component Intelligence

**Data:** 2026-06-07
**Status:** Design aprovado, aguardando revisão da especificação
**Escopo:** Metadados canônicos de componentes, evidência estruturada, seleção determinística, validação da resposta e auditoria

## 1. Objetivo

Substituir o uso superficial e parcialmente textual dos dados de componentes por um pipeline estruturado e auditável:

```text
JSON canônico
  -> validação
  -> texto derivado para indexação
  -> ChromaDB para localização semântica
  -> resolução por component_id
  -> ComponentEvidence
  -> seleção determinística
  -> composição limitada pelo LLM
  -> validação determinística
  -> resposta validada ou fallback
  -> audit_metadata e Audit Drawer
```

O trabalho cobre os níveis 1 e 2 aprovados. Não inclui integrações externas, agent builder, autonomia adicional ou expansão completa dos contratos de todas as perspectivas.

## 2. Princípios obrigatórios

1. `data/component-metadata.json` é a fonte única dos metadados semânticos dos componentes.
2. Frontend e backend consomem o mesmo arquivo.
3. O ChromaDB localiza candidatos, mas não armazena o registro semântico completo.
4. Todo candidato recuperado é resolvido no JSON por `component_id`.
5. `ComponentEvidence` é construído a partir do registro completo.
6. `excerpt` existe somente para apresentação na UI.
7. O prompt final recebe campos estruturados completos quando disponíveis.
8. `null` significa campo não documentado ou desconhecido.
9. `[]` significa campo revisado e confirmadamente vazio.
10. Campos `null` não podem ser completados pelo LLM como evidência do corpus.
11. Regras selecionadas recebem IDs e proveniência auditável.
12. `used_*` significa selecionado deterministicamente para composição, nunca usado pelo raciocínio interno do LLM.
13. O LLM não escolhe nem substitui `recommended_component`.
14. Evidence similarity representa similaridade semântica da evidência. Não representa confiança da resposta ou do LLM.
15. A UI mostra o rastro operacional e documental do sistema, nunca um reasoning trace inventado.

## 3. Abordagem selecionada

A arquitetura usa JSON canônico com adaptadores.

### 3.1 Fonte semântica

`data/component-metadata.json` contém identidade, status, documentação localizada, regras, estados, acessibilidade, relações e proveniência.

### 3.2 Adaptadores TypeScript

Ícones, snippets executáveis, componentes React e recursos estritamente visuais permanecem em TypeScript, associados por `component_id`.

O adaptador combina:

```text
ComponentMetadata + ComponentPresentation = ComponentDoc renderizável
```

O adaptador não pode redefinir textos, status, regras, intents, estados ou qualquer outro metadado semântico.

### 3.3 Pipeline Python

O Python valida o JSON, deriva texto pesquisável, indexa os identificadores e resolve registros completos depois do retrieval.

### 3.4 Fontes antigas

`COMPONENT_CATALOG`, `componentUsageGuidance.ts` e `componentIntentDocumentation.ts` deixam de ser fontes semânticas paralelas.

Antes da remoção:

1. é gerado um snapshot dos IDs atuais do frontend;
2. é gerado um snapshot dos IDs atuais extraídos para o RAG;
3. são registradas as fontes semânticas antigas;
4. testes de paridade são adicionados;
5. a migração é executada;
6. o estado novo é comparado com o snapshot.

## 4. Arquivo canônico

O arquivo possui versão no topo:

```json
{
  "schema_version": "1.0.0",
  "components": []
}
```

`schema_version` não é repetido nos componentes. Uma futura `metadata_version` por componente só será adicionada quando existir uma necessidade concreta.

## 5. Schema ComponentMetadata

### 5.1 Tipos básicos

```text
LocalizedText:
  pt: string
  en: string | null

LocalizedRule:
  id: string
  text: LocalizedText

NamedItem:
  id: string
  label: LocalizedText

IntentItem:
  id: string
  label: LocalizedText
  description: LocalizedText | null
  example: LocalizedText | null

AriaRule:
  id: string
  attribute: string
  value: string | null
  text: LocalizedText

ExampleItem:
  id: string
  title: LocalizedText | null
  text: LocalizedText

AccessibilityMetadata:
  summary: LocalizedText | null
  keyboard: LocalizedRule[] | null
  aria: AriaRule[] | null

SelectedRule:
  id: string
  text: LocalizedText
  rule_similarity: float
  sources: string[]

Provenance:
  Record<string, string[]>
```

O contrato completo é:

```text
ComponentMetadata:
  component_id: string
  name: string
  status: ComponentStatus
  section: ComponentSection
  description: LocalizedText | null
  logic: LocalizedText | null
  structure: LocalizedText | null
  intent: IntentItem | null
  intents: IntentItem[] | null
  variants: NamedItem[] | null
  states: NamedItem[] | null
  do: LocalizedRule[] | null
  dont: LocalizedRule[] | null
  when_to_use: LocalizedRule[] | null
  when_not_to_use: LocalizedRule[] | null
  accessibility: AccessibilityMetadata | null
  edge_cases: LocalizedRule[] | null
  content_guidelines: LocalizedRule[] | null
  governance_notes: LocalizedRule[] | null
  related_components: string[] | null
  examples: ExampleItem[] | null
  anti_patterns: LocalizedRule[] | null
  trade_offs: LocalizedText | null
  rag_relation: LocalizedText | null
  aetheris_insight: LocalizedText | null
  provenance: Provenance
```

`component_id`, `name`, `status`, `section` e `provenance` nunca são `null`. Todos os demais campos semânticos devem existir no objeto, mesmo quando o valor for `null`.

### 5.2 Enums

Status permitidos:

```text
draft
experimental
stable
deprecated
legacy
```

Sections permitidas:

```text
structure
action
input
feedback
navigation
content
layout
overlay
data_display
```

O mapeamento das seções antigas será explícito durante a migração. `Modal/Dialog` será classificado como `overlay`.

### 5.3 Registro completo

Cada componente contém todos os campos abaixo. Um campo não documentado usa `null`. Uma lista revisada e vazia usa `[]`.

```json
{
  "component_id": "modal-dialog",
  "name": "Modal/Dialog",
  "status": "stable",
  "section": "overlay",
  "description": {
    "pt": "Interrompe o fluxo para uma decisão que exige foco.",
    "en": "Interrupts the flow for a decision that requires focus."
  },
  "logic": {
    "pt": "Use foco concentrado para decisões críticas.",
    "en": "Use focused attention for critical decisions."
  },
  "structure": {
    "pt": "Título, conteúdo, ações e controle de fechamento.",
    "en": "Title, content, actions, and close control."
  },
  "intent": null,
  "intents": [
    {
      "id": "critical-decision",
      "label": {
        "pt": "Decisão crítica",
        "en": "Critical decision"
      },
      "description": null,
      "example": null
    }
  ],
  "variants": null,
  "states": [
    {
      "id": "closed",
      "label": {
        "pt": "Fechado",
        "en": "Closed"
      }
    }
  ],
  "do": [
    {
      "id": "modal-dialog.do.1",
      "text": {
        "pt": "Use para decisões críticas que exigem confirmação explícita.",
        "en": "Use for critical decisions that require explicit confirmation."
      }
    }
  ],
  "dont": [
    {
      "id": "modal-dialog.dont.1",
      "text": {
        "pt": "Não use para feedback passivo.",
        "en": "Do not use for passive feedback."
      }
    }
  ],
  "when_to_use": [
    {
      "id": "modal-dialog.when_to_use.1",
      "text": {
        "pt": "Use para confirmar ações destrutivas importantes.",
        "en": "Use to confirm important destructive actions."
      }
    }
  ],
  "when_not_to_use": [
    {
      "id": "modal-dialog.when_not_to_use.1",
      "text": {
        "pt": "Não use quando a decisão puder ser resolvida sem interrupção.",
        "en": "Do not use when the decision can be resolved without interruption."
      }
    }
  ],
  "accessibility": {
    "summary": {
      "pt": "Gerencie foco, nome e descrição acessíveis.",
      "en": "Manage focus, accessible name, and description."
    },
    "keyboard": null,
    "aria": null
  },
  "edge_cases": null,
  "content_guidelines": null,
  "governance_notes": null,
  "related_components": null,
  "examples": [],
  "anti_patterns": null,
  "trade_offs": {
    "pt": "Interrompe o contexto atual para priorizar a decisão.",
    "en": null
  },
  "rag_relation": {
    "pt": "Sustenta recomendações de decisões focadas.",
    "en": "Supports recommendations for focused decisions."
  },
  "aetheris_insight": {
    "pt": "A interrupção deve ser proporcional ao risco.",
    "en": "The interruption should be proportional to the risk."
  },
  "provenance": {
    "status": [
      "data/component-metadata.json#component/modal-dialog/status"
    ],
    "do.modal-dialog.do.1": [
      "legacy:componentUsageGuidance.ts#modal-dialog.do.1"
    ]
  }
}
```

### 5.4 Campos estruturados adicionais

Quando preenchidos:

- `edge_cases`, `content_guidelines`, `governance_notes` e `anti_patterns` usam `LocalizedRule[]`;
- `related_components` usa `component_id[]`;
- `variants` usa `NamedItem[]`;
- `accessibility.keyboard` usa `LocalizedRule[]`;
- `accessibility.aria` usa `AriaRule[]`;
- `examples` usa `ExampleItem[]`.

### 5.5 Regras de IDs

1. `component_id` é único e estável.
2. IDs de regras são únicos no arquivo inteiro.
3. Estados e variants são únicos dentro do componente.
4. Relações só podem apontar para `component_id` existente.
5. IDs não mudam quando apenas o texto localizado muda.
6. O formato recomendado é `<component_id>.<field>.<sequence>`.

### 5.6 Proveniência

`provenance` aceita granularidade por campo e por item.

Exemplos:

```text
status
accessibility.summary
do.modal-dialog.do.1
when_to_use.modal-dialog.when_to_use.1
accessibility.keyboard.modal-dialog.keyboard.1
```

O resolver converte essas entradas em `field_sources`.

## 6. Validação do schema

Haverá validação equivalente em Python e TypeScript.

As validações cobrem:

1. `schema_version` suportada;
2. campos obrigatórios presentes;
3. enums válidos;
4. `component_id` único;
5. IDs de regras únicos;
6. distinção preservada entre `null` e `[]`;
7. referências existentes;
8. textos localizados válidos;
9. status `deprecated` e `legacy` identificáveis;
10. proveniência referenciando campos ou itens existentes;
11. ausência de metadados semânticos nos adaptadores visuais.

O processo de build do frontend e o extractor Python falham quando o arquivo for inválido.

## 7. Snapshot e paridade

Antes de remover as fontes antigas, será salvo um artefato de migração com:

```text
frontend_component_ids
rag_component_ids
legacy_semantic_sources
component_count
```

Os testes exigem:

1. os IDs principais antigos continuam no catálogo novo;
2. os IDs renderizados no frontend correspondem aos IDs canônicos;
3. os IDs indexados no RAG correspondem aos IDs canônicos;
4. todo adapter visual aponta para um componente existente;
5. todo componente que exige apresentação possui adapter visual;
6. nenhum arquivo antigo permanece como fonte semântica;
7. não existem registros duplicados por ID ou nome normalizado.

## 8. Indexação e retrieval

### 8.1 Texto derivado

O extractor deixa de analisar `ComponentsPage.tsx` para componentes. Ele lê o JSON e deriva um documento pesquisável com:

```text
name
status
section
description
logic
structure
intent
intents
variants
states
do
dont
when_to_use
when_not_to_use
accessibility
edge_cases
content_guidelines
governance_notes
related_components
examples
anti_patterns
trade_offs
aetheris_insight
```

Listas podem ser concatenadas somente para produzir o texto de embedding. A estrutura original permanece intacta no JSON e no `ComponentEvidence`.

### 8.2 Metadata mínima do Chroma

O registro vetorial guarda:

```text
component_id
title
source
page_type
status
section
schema_version
char_count
```

Campos semânticos completos não são serializados como substituto do JSON.

### 8.3 Retorno do retrieval

`_chunk_from_result` preserva os dados disponíveis no resultado vetorial:

```text
component_id
status
text
title
source
page_type
similarity
retrieval_weight
vocabulary_boost
weighted_score
retrieval_mode
```

Depois da ordenação e do corte por `top_k`, uma etapa explícita de enriquecimento resolve cada `component_id` no JSON e acrescenta ao resultado:

```text
when_to_use
when_not_to_use
accessibility
aetheris_insight
component_metadata
```

Os quatro primeiros campos atendem compatibilidade com consumidores atuais. `component_metadata` é o registro autoritativo usado pelo Evidence Builder. Nenhum desses campos é reconstruído a partir do excerpt.

### 8.4 Reindexação

Depois da migração:

1. o dump é regenerado;
2. a coleção Chroma é recriada;
3. IDs e contagem são comparados com o snapshot;
4. uma consulta de sanidade confirma retorno de `component_id`;
5. o teste sentinela confirma a seleção para ação destrutiva.

## 9. ComponentEvidence

### 9.1 Responsabilidade

`ComponentEvidence` representa um candidato com dados completos, scores, cobertura e proveniência.

```text
ComponentEvidence:
  component: ComponentMetadata
  excerpt: string
  similarity: float
  retrieval_weight: float
  weighted_score: float
  evidence_tier: strong | partial | weak | insufficient
  present_fields: string[]
  missing_fields: string[]
  empty_fields: string[]
  field_sources: Record<string, string[]>
  selected_do_rules: SelectedRule[]
  selected_dont_rules: SelectedRule[]
  selected_when_to_use: SelectedRule[]
  selected_when_not_to_use: SelectedRule[]
  perspective_coverage: PerspectiveCoverage
```

`excerpt` não participa da construção dos campos semânticos.

### 9.2 Presença, ausência e vazio

- valor diferente de `null` representa campo presente;
- `null` entra em `missing_fields`;
- `[]` entra em `empty_fields`, não em `missing_fields`;
- objetos parcialmente nulos registram o caminho específico ausente, como `accessibility.keyboard`.

### 9.3 Seleção de regras

Para o componente recomendado:

1. cada regra de `do`, `dont`, `when_to_use` e `when_not_to_use` é comparada semanticamente com a consulta usando o embedder local;
2. a comparação usa a concatenação dos textos localizados disponíveis;
3. as regras são ordenadas por similaridade da regra;
4. são selecionadas no máximo três regras por campo;
5. listas `null` geram campo ausente e limitação;
6. listas `[]` geram seleção vazia, sem serem tratadas como ausência;
7. os IDs selecionados alimentam `used_*`;
8. a similaridade de cada regra pode ser registrada internamente para depuração, mas não é confiança da resposta.

O termo `used` significa somente selecionado deterministicamente para composição da evidência e da resposta.

### 9.4 Coverage por perspectiva

Nesta fase:

- Developer exige `states`, `variants`, `edge_cases`, `accessibility.keyboard` e `accessibility.aria`;
- Accessibility Specialist exige `accessibility.summary`, `accessibility.keyboard`, `accessibility.aria`, `states` e `edge_cases`;
- outras perspectivas recebem cobertura base de identidade, status, intents, uso, não uso e acessibilidade.

Coverage registra:

```text
required_fields
present_required_fields
missing_required_fields
coverage_ratio
```

Coverage não é confiança da resposta.

## 10. Seleção determinística

### 10.1 Tier por candidato

Cada componente recebe tier a partir da própria `similarity`:

```text
strong: similarity >= 0.75
partial: similarity >= 0.50 e < 0.75
weak: similarity < 0.50
insufficient: sem resultado
```

### 10.2 Elegibilidade

Um candidato é elegível quando:

1. `page_type` é `component` ou `xai_component`;
2. possui `component_id` resolvível no JSON;
3. possui tier `partial` ou `strong`;
4. possui status `draft`, `experimental` ou `stable`.

`deprecated` e `legacy` nunca são elegíveis para recomendação.

### 10.3 Componente recomendado

`recommended_component` é o candidato elegível com maior `weighted_score`.

O LLM não participa dessa escolha.

Quando não existe candidato elegível:

- `recommended_component` é `null`;
- não ocorre recomendação pelo LLM;
- a resposta declara que a evidência do corpus é insuficiente para recomendar um componente com segurança.

### 10.4 Alternativas

`alternative_components` contém candidatos elegíveis que:

1. não são o recomendado;
2. possuem `weighted_score` até `0.03` abaixo do vencedor;
3. estão entre os três melhores candidatos elegíveis dentro desse limiar.

Constantes auditáveis:

```text
alternative_threshold: 0.03
alternative_limit: 3
```

Quando não existe alternativa no limiar, a lista é `[]`.

### 10.5 Candidatos rejeitados

`rejected_components` registra candidatos não elegíveis e a razão:

```text
weak_evidence
insufficient_evidence
deprecated_status
legacy_status
unresolved_component_id
unsupported_page_type
```

Para eliminar ambiguidade, candidatos `deprecated` e `legacy` ficam em `rejected_components`, nunca em `alternative_components`.

Se somente candidatos descontinuados tiverem tier `partial` ou `strong`, a recomendação permanece `null` e a resposta informa que não existe opção ativa suficientemente sustentada.

### 10.6 Política registrada

```text
selection_policy:
  highest_weighted_score_among_active_candidates_with_partial_or_strong_evidence
```

`selection_reason` explica que a escolha veio do maior `weighted_score` entre candidatos elegíveis.

### 10.7 Semântica dos scores no audit

Quando existe recomendação:

- `weighted_score`, `evidence_similarity` e `evidence_tier` no `audit_metadata` pertencem ao `recommended_component`;
- scores de alternativas e rejeitados ficam nos respectivos objetos.

Quando a recomendação é `null`:

- `weighted_score`, `evidence_similarity` e `evidence_tier` pertencem ao melhor candidato de componente recuperado, quando existir;
- `selection_reason` explica por que esse candidato não era elegível;
- sem candidato recuperado, score e similarity são `0.0` e o tier é `insufficient`.

Resultados de patterns não substituem os scores do candidato de componente nesses campos.

## 11. Contexto enviado ao LLM

O prompt recebe:

1. recomendação já definida;
2. alternativas permitidas;
3. `ComponentEvidence` completo do recomendado;
4. regras deterministicamente selecionadas;
5. campos presentes;
6. campos ausentes;
7. campos confirmadamente vazios;
8. proveniência;
9. evidence similarity;
10. evidence tier;
11. coverage da perspectiva;
12. limitações obrigatórias.

O prompt impõe:

1. não escolher outro componente;
2. não promover uma alternativa;
3. não inventar componentes;
4. não apresentar campo `null` como documentado;
5. declarar campos relevantes ausentes;
6. usar Developer e Accessibility Specialist somente com campos estruturados disponíveis;
7. não completar lacunas com conhecimento genérico apresentado como evidência Aetheris;
8. não chamar evidence similarity de confiança.

## 12. Formato verificável da resposta

Para permitir validação determinística sem analisar raciocínio interno, respostas de decisão de componente seguem uma estrutura mínima:

```text
Componente recomendado: <nome ou evidência insuficiente>

Motivo
<síntese baseada somente nos campos disponíveis>

Limites
<dont e when_not_to_use disponíveis>

Campos ausentes
<campos relevantes ausentes ou "Nenhum">

Evidência
<evidence tier e fontes>

Alternativas
<somente quando alternative_components não estiver vazio>
```

A redação pode variar dentro das seções. O cabeçalho da recomendação deve ser parseável.

## 13. Validação determinística da resposta

### 13.1 Momento da validação

A resposta do LLM é acumulada no backend antes de ser enviada ao cliente. Depois da validação:

- a resposta válida é emitida;
- ou o fallback determinístico é emitido no lugar dela.

Isso impede que texto inválido seja mostrado antes da substituição. Não existe segunda chamada ao LLM.

### 13.2 Escopo da validação

O validator confirma:

1. a recomendação principal corresponde a `recommended_component`;
2. alternativas não foram promovidas;
3. o nome recomendado existe no catálogo;
4. `deprecated` ou `legacy` não foram recomendados;
5. campos `null` não foram apresentados como evidência documentada;
6. limitações obrigatórias aparecem;
7. afirmações explícitas sobre status, intent e regras não contradizem `ComponentEvidence`;
8. a seção de alternativas só aparece quando `alternative_components` não está vazia;
9. nomes na seção de alternativas pertencem à lista permitida.

O validator não tenta validar toda linguagem natural e não infere raciocínio interno.

### 13.3 Violation types

```text
promoted_alternative
invented_component
contradicted_recommended_component
unsupported_claim
missing_required_limitation
```

Casos de status descontinuado são classificados como `contradicted_recommended_component` ou `unsupported_claim`, conforme a forma da afirmação.

### 13.4 Resultado

```text
response_validation_status:
  pass
  fallback
  not_applicable
```

Quando houver múltiplas violações:

- `validation_violation_type` guarda a primeira por prioridade;
- `validation_violations` guarda a lista completa.

Prioridade:

```text
invented_component
promoted_alternative
contradicted_recommended_component
unsupported_claim
missing_required_limitation
```

## 14. Fallback determinístico

O fallback usa somente:

- `ComponentEvidence`;
- seleção determinística;
- campos presentes;
- campos ausentes;
- campos confirmadamente vazios;
- evidence tier;
- audit metadata.

Conteúdo mínimo:

1. componente recomendado;
2. motivo baseado em intent, `when_to_use`, `do` e status quando disponíveis;
3. limites baseados em `dont` e `when_not_to_use` quando disponíveis;
4. campos ausentes;
5. evidence tier;
6. alternativas, somente quando existirem.

Quando `recommended_component` é `null`, o fallback declara evidência insuficiente e não inventa recomendação.

## 15. AuditMetadata

O contrato passa a registrar:

```text
query
intent
workflow
recommended_component
recommended_component_id
component_status
weighted_score
evidence_similarity
evidence_tier
alternative_components
alternative_threshold
alternative_limit
rejected_components
selection_reason
selection_policy
status_policy_applied
component_intent
used_do_rules
used_dont_rules
used_when_to_use
used_when_not_to_use
when_to_use
when_not_to_use
missing_component_fields
field_sources
component_evidence
response_validation_status
validation_violation_type
validation_violations
promoted_component_detected
expected_recommended_component
fallback_used
fallback_reason
sources
limitations
```

`component_evidence.missing_fields` corresponde semanticamente a `missing_component_fields`.

Regras:

- nomes de campos são estáveis;
- alternativas incluem ID, nome, status, score, similarity e tier;
- rejeitados incluem a razão;
- regras usadas incluem ID, texto selecionado e fontes;
- `when_to_use` e `when_not_to_use` preservam as listas estruturadas completas do componente recomendado;
- `field_sources` preserva granularidade por campo e regra;
- similarity nunca recebe rótulo de confiança.

## 16. Developer e Accessibility Specialist

### 16.1 Developer

O prompt Developer usa, quando disponíveis:

- states;
- variants;
- edge cases;
- related components;
- keyboard;
- ARIA;
- accessibility summary.

Quando ausentes, a resposta declara a limitação. O contrato não pode transformar requisitos genéricos em fatos documentados do componente.

### 16.2 Accessibility Specialist

O prompt Accessibility Specialist usa, quando disponíveis:

- accessibility summary;
- keyboard rules;
- ARIA rules;
- states;
- edge cases;
- content guidance relacionada a prevenção de erro.

Campos ausentes aparecem na resposta e no audit.

## 17. Frontend

### 17.1 Catálogo de componentes

`ComponentsPage` passa a renderizar dados do JSON por meio de um adapter tipado.

O registro visual associa:

```text
component_id
icon
snippet factory
preview renderer
playground configuration
```

Ele não contém cópias de textos semânticos.

### 17.2 Audit Drawer

O drawer mostra:

1. componente recomendado e status;
2. weighted score;
3. evidence similarity, rotulada como similaridade da evidência;
4. evidence tier;
5. alternativas;
6. candidatos rejeitados e razões;
7. regras selecionadas;
8. campos ausentes;
9. field sources;
10. resultado da validação;
11. violação detectada;
12. indicador de fallback e motivo.

Execution Trace continua mostrando somente eventos operacionais reais. O frontend não cria steps nem descreve pensamento interno.

## 18. Migração em fases

### Fase 1: snapshot e testes de paridade

1. capturar IDs atuais;
2. capturar fontes antigas;
3. adicionar testes que falham se a cobertura cair;
4. manter fontes antigas ainda intactas.

### Fase 2: schema e catálogo canônico

1. criar schema;
2. migrar todos os componentes;
3. validar Python e TypeScript;
4. comparar IDs com snapshot.

### Fase 3: adapters e remoção das fontes paralelas

1. criar registro visual;
2. atualizar frontend;
3. atualizar extractor;
4. remover catálogo e helpers semânticos antigos;
5. provar ausência de duplicação.

### Fase 4: retrieval e ComponentEvidence

1. indexar `component_id`;
2. preservar campos básicos no retrieval;
3. resolver JSON após ranking;
4. construir evidência completa;
5. selecionar regras.

### Fase 5: seleção, prompt, validação e fallback

1. definir recomendação e alternativas;
2. injetar evidência estruturada;
3. acumular resposta;
4. validar;
5. emitir resposta válida ou fallback.

### Fase 6: audit e UI

1. ampliar schemas Python e TypeScript;
2. emitir metadata inicial e final;
3. renderizar seleção, regras, lacunas e fallback;
4. manter trace estritamente operacional.

### Fase 7: reindexação e aceite

1. recriar Chroma;
2. comparar IDs e contagem;
3. executar testes;
4. executar pergunta sentinela.

## 19. Estratégia de testes

### 19.1 Schema

- versão suportada;
- enums;
- IDs únicos;
- regras únicas;
- referências válidas;
- `null` versus `[]`;
- proveniência válida;
- rejeição de campo semântico no adapter.

### 19.2 Paridade

- mesmos IDs principais no frontend;
- mesmos IDs no RAG;
- mesmo número de componentes;
- ausência de duplicação;
- cobertura visual para componentes renderizáveis.

### 19.3 Retrieval e resolver

- retorno de `component_id`;
- preservação dos campos básicos;
- resolução do registro completo;
- excerpt limitado à UI;
- listas preservadas.

### 19.4 ComponentEvidence

- campos presentes;
- campos ausentes;
- campos vazios;
- proveniência por regra;
- regras selecionadas deterministicamente;
- coverage Developer;
- coverage Accessibility Specialist.

### 19.5 Seleção

- maior weighted score;
- tier mínimo;
- limiar `0.03`;
- máximo de três alternativas;
- recomendado fora da lista de alternativas;
- nenhuma alternativa fora do limiar;
- bloqueio de `deprecated` e `legacy`;
- recomendação nula sem candidato elegível;
- candidatos rejeitados com razão.

### 19.6 Validação e fallback

- alternativa promovida;
- componente inventado;
- recomendação contradita;
- claim estruturado sem suporte;
- limitação obrigatória ausente;
- fallback sem segunda chamada;
- resposta válida preservada;
- metadata de validação completa.

### 19.7 SSE e UI

- nenhum delta inválido antes da validação;
- resposta final validada;
- Audit Drawer mostrando fallback;
- labels corretos para similarity;
- ausência de reasoning trace artificial.

## 20. Teste sentinela

Pergunta:

```text
Qual componente devo usar para uma ação destrutiva, como excluir um item importante?
```

O teste deve verificar:

```text
query
intent
recommended_component
recommended_component_id
component_status
component_intent ou limitação
alternative_components
rejected_components
used_do_rules
used_dont_rules
used_when_to_use
used_when_not_to_use
when_to_use
when_not_to_use
missing_component_fields
field_sources
evidence_similarity
evidence_tier
selection_reason
selection_policy
status_policy_applied
response_validation_status
validation_violations
fallback_used
sources
```

Resultado esperado:

- o componente recomendado é definido antes do LLM;
- a resposta mantém esse componente;
- intent e status vêm do JSON ou geram limitação;
- regras são identificadas por ID;
- campos ausentes são explícitos;
- similarity é apresentada somente como similaridade da evidência;
- alternativas aparecem somente quando elegíveis e dentro do limiar;
- uma resposta contraditória é substituída pelo fallback.

## 21. Critérios de aceite

O trabalho estará concluído quando:

1. o JSON for a única fonte semântica dos componentes;
2. frontend e RAG preservarem a cobertura dos IDs do snapshot;
3. Chroma retornar `component_id`;
4. `ComponentEvidence` carregar o registro completo;
5. excerpt for usado somente para UI;
6. seleção e alternativas forem determinísticas;
7. candidatos descontinuados nunca forem recomendados;
8. campos ausentes gerarem limitações;
9. Developer e Accessibility Specialist consumirem campos estruturados;
10. a resposta for validada antes de chegar ao cliente;
11. violações acionarem fallback sem nova chamada ao LLM;
12. o audit registrar seleção, regras, lacunas, fontes e validação;
13. o Audit Drawer expuser fallback sem simular reasoning trace;
14. o teste sentinela passar;
15. build, testes Python e testes TypeScript passarem.

## 22. Fora de escopo

- integrações externas;
- agent builder;
- framework externo de agentes;
- SQLite para metadados de componentes;
- edição visual do catálogo;
- expansão completa para todas as perspectivas;
- validação geral de toda linguagem natural;
- captura ou exposição de chain-of-thought;
- uso de evidence similarity como confiança da resposta.
