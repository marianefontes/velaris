# Documentation Structure

Estrutura organizada de documentação do projeto Abraxos.

## Pastas Principais

### `technical/`
Documentação técnica oficial: arquitetura, decisões de design, guias operacionais.

**Alimenta:** Referência para desenvolvedores
**RAG:** Excluído (documentação manual)

### `academic/`
Documentação académica para TCC: contexto, metodologia, linha do tempo, decisões.

**Alimenta:** Relatórios académicos, monografia
**RAG:** Excluído

### `_superpowers/`
Especificações de design e planos de implementação de features.

**Alimenta:** Histórico de desenvolvimento, specs de features
**RAG:** Excluído

### `_audits/`
Relatórios técnicos de auditoria gerados durante desenvolvimento.

**Alimenta:** Histórico de decisões técnicas
**RAG:** Excluído (não são conhecimento oficial)

### `_personal/`
Documentos pessoais de autoria e acompanhamento.

**Alimenta:** Histórico pessoal
**RAG:** Excluído

### `_legacy/` (vazio por enquanto)
Documentação obsoleta, arquivos históricos que não devem ser consultados.

**RAG:** Excluído

---

## Documentação de Runtime

### Prompts (alimentam Abraxos em runtime)
```
prompts/
├── system/          # Sistema core, identidade, comportamento
├── perspectives/    # Contratos de perspectivas (8 personas)
├── intents/         # Mapeamento de intenções de user
├── responses/       # Templates de resposta
├── commands/        # Comandos especiais (enforce, tradeoff, etc)
├── engines/         # Estratégias de raciocínio
└── retrieval/       # Políticas de recuperação RAG
```

### Cognition (camada de raciocínio)
```
cognition/
├── heuristics/      # Regras de ativação, confiança, escalação
├── overrides/       # Regras de override
└── strategies/      # Estratégias de análise (fit analysis, governance check, etc)
```

### Identity/Brand
```
abraxos/
└── ABRAXOS.md      # Carta canônica de identidade visual
```

---

## RAG Exclusions

O pipeline RAG está configurado para **não indexar**:
* `docs/_audits/*`
* `docs/_personal/*`
* `docs/_legacy/*`
* `docs/_superpowers/*`
* `docs/academic/*`

Apenas documentação técnica de `docs/technical/` pode ser considerada para indexação futura.

---

## Convenções de Nomenclatura

Veja `/Users/mbsf/AETHERIS/CLAUDE.md` para convenções de:
* Nomes de projetos (Velaris/Abraxos = atual; Aetheris/Beatrice = legacy)
* Estrutura de código
* Convenções de routing e componentes

---

Última atualização: 2026-06-11
