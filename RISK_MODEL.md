# RISK_MODEL.md — Modelo de Risco, Impacto e Confiança

> Escala para classificar ações do agente de código antes de executá-las. Memória operacional.
> Atualizado: 2026-06-07.

---

## 1. Eixos de pontuação

Toda ação não-trivial recebe três rótulos: **Risco**, **Impacto**, **Confiança**.

### Risco (probabilidade × gravidade de quebrar algo)

| Nível | Significado | Exemplos |
|-------|-------------|----------|
| **None** | Sem efeito em runtime/dados | Ler arquivos, criar `.md` novo |
| **Low** | Reversível, isolado, type-safe | Adicionar prop opcional, novo componente não importado, novo hook |
| **Medium** | Toca caminho ativo ou múltiplos arquivos | Mudar componente em uso, alterar layout, editar lógica de render |
| **High** | Irreversível, dados persistidos, contrato público, espelhamento | Renomear chave de perspectiva, deletar arquivo, mudar schema, alterar contrato de API/SSE |

### Impacto (alcance se der certo OU errado)

| Nível | Alcance |
|-------|---------|
| **Local** | Um componente/arquivo |
| **Module** | Um módulo (ex: `beatrice/`, `laboratory/`) |
| **System** | App inteiro, build, ou dados de usuário |

### Confiança (quão certo estou da análise)

| Nível | Base |
|-------|------|
| **High** | Li o código relevante e validei a hipótese |
| **Medium** | Li parte; inferi o resto por padrão |
| **Low** | Hipótese não verificada — declarar explicitamente |

---

## 2. Matriz de gating (o que cada combinação exige)

| Risco | Ação requerida |
|-------|----------------|
| None | Executar livremente. Registrar se relevante. |
| Low | Executar; resumir depois. |
| Medium | Apresentar plano + pedir OK se afetar UX/dados visíveis. Validar com `npm run build`. |
| High | **Parar. Pedir permissão explícita.** Apresentar diff/plano + rollback ANTES de executar. |

Confiança **Low** rebaixa a autorização: nunca executar Risco ≥ Medium com Confiança Low — investigar mais primeiro.

---

## 3. Gatilhos automáticos de "High Risk → parar e pedir"

- Deletar/renomear/mover qualquer arquivo
- Renomear export, chave de perspectiva, rota, token
- Alterar contrato de API ou protocolo SSE (`server.py`, `useChatStream.ts`)
- Tocar dados persistidos (localStorage `beatrice.*`, SQLite `data/*.sqlite3`, `evals/*.jsonl`)
- Editar artefato gerado (`GENERATED_FILES.md`)
- Mudar `tsconfig*`, `vite.config.ts`, `tailwind.config.ts`
- Operação `git` que reescreve histórico ou descarta mudanças

---

## 4. Formato de declaração de risco (na resposta)

```
Risk: Medium · Impact: Module · Confidence: High
Por quê: edita ChatMessage (caminho ativo do chat), mas é memoização aditiva e type-safe.
Rollback: reverter o React.memo; sem migração de dados.
Validação: npm run build + React Profiler antes/depois.
```

---

## 5. Princípio de reversibilidade

Preferir sempre o caminho reversível:
- Adicionar > substituir
- Manter chave + mudar label > renomear chave
- Feature atrás de flag > mudança direta em comportamento ativo
- Deprecar com alias > remover

Se uma ação não tem rollback claro, ela é **High** por definição.
