# Perspectivas Profissionais do Abraxos

Atualizado em 2026-06-07.

## Fonte de verdade

| Camada | Arquivo |
|---|---|
| IDs e aliases backend | `prompts/perspective_ids.py` |
| Perfis cognitivos | `prompts/cognitive_profiles.py` |
| Contratos de resposta | `prompts/perspective_contracts.py` |
| Contratos Markdown | `prompts/perspectives/` |
| IDs frontend | `src/beatrice/domain/perspective/profileIds.ts` |
| Estratégias da UI | `src/beatrice/domain/perspective/lenses.ts` |
| Localização | `src/beatrice/domain/perspective/localization.ts` |
| Instrumentação | `src/beatrice/pages/PerspectivesPage.tsx` |

As perspectivas são lentes profissionais do Abraxos. Não são personagens,
personas fictícias ou assistentes independentes.

## Registro canônico

| ID | Perspectiva | Foco |
|---|---|---|
| `dev` | Developer | Implementação, arquitetura, TypeScript, componentes, estado, integração, performance, reuso e edge cases |
| `designer` | Designer | Composição, hierarquia, tokens, espaçamento, tipografia, cores, estados visuais, densidade e consistência |
| `product_designer` | Product Designer | Interface, experiência, pesquisa, usabilidade, fluxo, necessidades, contexto, fricção, alternativas e validação |
| `qa` | QA | Critérios de aceite, cenários, regressão, edge cases, estados e validação |
| `tech_writer` | Tech Writer | Documentação, nomenclatura, exemplos, microcopy, terminologia e instruções acionáveis |
| `a11y` | Accessibility Specialist | WCAG, foco, teclado, ARIA, leitores de tela, contraste, estados e inclusão |
| `maintainer` | Maintainer | Manutenção, simplicidade, reuso, dívida, acoplamento, duplicação e custo de evolução |
| `design_system_manager` | Design System Manager | Estratégia, governança, adoção, prioridade, roadmap, impacto sistêmico, exceções e maturidade |

`general` é um fallback interno neutro e não aparece como opção profissional.

## Compatibilidade

Aliases são aceitos somente nas fronteiras de entrada:

| Alias antigo | ID canônico |
|---|---|
| `pm` | `design_system_manager` |
| `writer` | `tech_writer` |

Depois da normalização, estado, eventos, calibração, requests, laboratório,
auditoria e contratos usam somente IDs canônicos. Novas gravações nunca usam
aliases.

## Fronteiras de responsabilidade

### Designer

Avalia composição visual, hierarquia, tokens, tipografia, cores, densidade,
estados visuais e consistência estética.

### Product Designer

Une Designer e UX Researcher. Avalia a qualidade visual e interativa, o fluxo,
a usabilidade, as necessidades e o contexto do usuário, as hipóteses de
comportamento, a evidência disponível, alternativas e formas de validação.

Product Designer não é Product Manager.

### Design System Manager

Absorve a dimensão estratégica anteriormente associada a Product Manager.
Avalia governança, adoção, prioridade, valor, roadmap, impacto entre times,
critérios de exceção e maturidade do design system.

### Maintainer

Avalia saúde da implementação, simplicidade, ownership, reuso, dívida técnica,
acoplamento, duplicação, risco futuro e custo de evolução. Não substitui a
governança estratégica do Design System Manager.

## Contratos

| ID | Arquivo |
|---|---|
| `dev` | `developer.md` |
| `designer` | `designer.md` |
| `product_designer` | `product-designer.md` |
| `qa` | `qa.md` |
| `tech_writer` | `tech-writer.md` |
| `a11y` | `accessibility.md` |
| `maintainer` | `maintainer.md` |
| `design_system_manager` | `design-system-manager.md` |

Cada request canônico injeta o perfil cognitivo e o contrato Markdown da mesma
perspectiva. Developer e Accessibility Specialist mantêm seus contratos
especializados detalhados.

## Validação

Execute:

```bash
npm run test:perspectives
npm run test:agent-ui
npm run build
```
