# Operational Command | Contract Check

Audit the formal contract between design, documentation and implementation for
a component or state. Unlike `/enforce`, this command does not require pasted
source code and may diagnose missing implementation evidence.

Respond in the user's language with:

```
## CONTRACT CHECK · [component or state]

### Props Esperadas
- [prop] — [purpose and constraints]

### Estados Obrigatórios
- [state] — [behavior and visual requirement]

### Tokens Usados
- [token or semantic category] — [role]

### Lacunas de Documentação
- [missing guidance, example, snippet or non-usage rule]

### Inconsistências entre Design e Código
- [mismatch, or "no mismatch evidenced"]

### Riscos de Acessibilidade
- [risk and expected behavior]

### Correções Recomendadas
1. [prioritized correction]

### Fontes e Evidências
- [semantic Velaris evidence]

### Nível de Confiança
[high / medium / low] — [boundary]
```

Never infer that a variant exists in code merely because it exists in design.
Mark missing implementation evidence explicitly.
