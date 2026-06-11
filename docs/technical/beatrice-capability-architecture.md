# Arquitetura Pública de Capacidades do Abraxos

Abraxos apresenta somente dois tipos principais de capacidade para
consumidores do design system:

1. **Habilidades do Abraxos**: capacidades internas, ativadas automaticamente.
2. **Comandos do Oráculo**: ações e modos acionáveis pelo usuário com `/`.

A fonte de verdade indexada pelo RAG é
`src/beatrice/domain/governance/capabilities.ts`.

## Relação entre Abraxos, Tecelã e Pipeline

Abraxos fala. A Tecelã de Evidências organiza intenção, entidades, catálogo,
fontes, força da evidência e limites antes da resposta. O Pipeline comprova o
percurso técnico completo.

A Tecelã não é uma habilidade pública nem substitui o agente ou o Pipeline.
Ela é a camada conceitual de organização cognitiva que prepara a base usada por
Abraxos.

## Habilidades do Abraxos

**Subtítulo público:** Ativação automática.

Abraxos ativa estas habilidades ao interpretar a intenção, o contexto e o
tipo de problema apresentado. O usuário não precisa chamar uma habilidade
manualmente. Até cinco habilidades podem ser combinadas na mesma resposta.

| Habilidade | Quando é ativada | Saída esperada |
|---|---|---|
| Component Fit Analysis | Escolha ou comparação de componentes | Recomendação, justificativa, estados e riscos |
| Component Misuse Detection | Proposta de uso fora do contrato do componente | Risco, explicação e alternativa segura |
| Design-to-Code Contract Check | Possível divergência entre design, docs e código | Gaps, estados ausentes e correções |
| Token Impact Analysis | Mudança ou dependência de token | Aliases, consumidores, estados e validações |
| Accessibility & Interaction Guardrail | Foco, teclado, contraste, erro ou estado interativo | Guardrails violados e alternativa acessível |
| Governance Readiness Check | Proposta que entra ou altera o sistema | Veredito, condições e gaps de governança |
| Pattern & State Exploration | Problema de interface ainda ambíguo | Opções fundamentadas e direção recomendada |
| Design System Architecture Analysis | Arquitetura, acoplamento ou refatoração | Fronteiras, dependências e riscos estruturais |
| Implementation & Migration Planning | Implementação, integração ou rollout | Etapas, dependências, validação e rollback |
| Component & Pattern Trade-off Analysis | Alternativas com custos relevantes | Critérios, trade-offs e recomendação |
| Cross-System Impact Analysis | Efeitos indiretos entre camadas | Dependências e impactos de segunda ordem |
| Design System Risk Assessment | Regressão, dívida, edge case ou incerteza | Riscos priorizados, mitigação e testes |

Retrieval Deep Dive permanece oculto. Ele pode aumentar a profundidade RAG, mas
não aparece como habilidade pública nem exige comando.

## Comandos do Oráculo

**Subtítulo público:** Ações e modos acionáveis.

No chat, o usuário digita `/`, escolhe o comando e fornece a pergunta, contexto
ou artefato. A antiga separação entre “Operational Commands” e “Oracle Engines”
foi removida da experiência principal.

### Ação operacional

Executa uma tarefa concreta e retorna artefato, validação ou transformação.

| Comando | Função |
|---|---|
| `/enforce` | Validar JSX/TSX, contrato, tokens, acessibilidade e mau uso |
| `/migrate` | Orientar migração de componente ou padrão legado |
| `/capture` | Estruturar conhecimento bruto de PR, Slack, RFC ou reunião |
| `/document` | Produzir documentação publicável |
| `/token-impact` | Gerar relatório formal de impacto de token |
| `/contract-check` | Auditar design, documentação e implementação |
| `/feedback-review` | Analisar feedback sem prometer aprendizado automático |

### Modo investigativo

Orienta o raciocínio do Abraxos para uma investigação profunda, explicável e
ancorada em RAG.

| Comando público | Contrato canônico | Função |
|---|---|---|
| `/memory` | `/organizational-memory` | Recuperar memória institucional |
| `/decision` | `/decision-archaeology` | Reconstruir origem e consequências de uma decisão |
| `/perspectives` | `/perspective-synthesis` | Sintetizar perspectivas profissionais |
| `/audit` | `/explainability-audit` | Auditar fontes, lacunas e confiança |
| `/knowledge-gap` | igual | Diagnosticar lacunas documentais |
| `/governance-impact` | igual | Avaliar impacto sistêmico |
| `/principle-conflict` | igual | Resolver conflitos entre princípios |
| `/adoption-friction` | igual | Diagnosticar barreiras de adoção |
| `/oracle-council` | igual | Deliberação experimental entre perspectivas |

## Exemplos

```text
/enforce <Button color="red">Delete</Button>
/migrate LegacyDrawer → Drawer
/capture [cole uma discussão de PR ou decisão de produto]
/memory O que já foi decidido sobre o uso de modais em ações destrutivas?
/decision Por que usamos Toast em vez de Alert para feedback não bloqueante?
/perspectives Compare essa decisão do ponto de vista de design, frontend e QA.
/audit Mostre as fontes, lacunas e nível de confiança desta recomendação.
```

## Compatibilidade

Os comandos canônicos longos continuam válidos. Também permanecem os aliases
legados:

- `/history` → `/organizational-memory`
- `/why` → `/decision-archaeology`
- `/score` → `/explainability-audit`
- `/simulate` → `/governance-impact`
- `/learn` → `/feedback-review`

`/tradeoff` continua aceito como compatibilidade formal, mas a análise de
trade-offs também pode ser ativada automaticamente como habilidade.

## Auditabilidade

- Habilidades registram nome público, motivo de ativação, intensidade e
  confiança.
- Comandos registram o alias digitado, o contrato canônico, as fontes RAG e a
  categoria: ação operacional ou modo investigativo.
- Inferências devem permanecer separadas de evidência observada.
