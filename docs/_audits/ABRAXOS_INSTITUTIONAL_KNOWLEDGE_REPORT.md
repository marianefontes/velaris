# Abraxos Institutional Knowledge Enrichment Report

**Data:** 2026-06-17
**Escopo:** enriquecimento do conhecimento institucional usado pelo RAG, sem alterar modelo, prompts principais, backend ou arquitetura.

## Resumo

- Markdown institucional criado/enriquecido: `rag/institutional-knowledge.md`.
- Dump Markdown regenerado: `rag/aetheris-docs-dump.md`.
- Metadata canônico enriquecido: `data/component-metadata.json`.
- Chunks antes do suplemento: 303.
- Chunks finais no dump: 377.
- Novos chunks criados: 74.

## Markdowns enriquecidos

- `rag/institutional-knowledge.md`: racional, impacto arquitetural, consequências UX, acessibilidade, governança, manutenção, falhas, relações, comparações, migrações e cobertura por perspectiva.
- `rag/aetheris-docs-dump.md`: corpus legível regenerado com os chunks suplementares embutidos.

## Novos chunks criados

- Component institutional knowledge: 25 chunks.
- Perspective matrix: 25 chunks.
- Comparative decisions: 10 chunks.
- Knowledge relationships: 7 chunks.
- Migration knowledge: 7 chunks.

## Comparações adicionadas

- Button vs Link
- Modal/Dialog vs Drawer
- Tooltip vs Popover
- Toast vs Alert
- Skeleton Loader vs Spinner
- Accordion vs Tabs
- Checkbox vs Radio Button
- Select/Dropdown vs Radio Button
- Input / Text Input vs Text Area
- Source Attribution vs Audit Panel

## Relações adicionadas

- Knowledge Relationships — Action Controls: Button ↔ Link ↔ IconButton candidate ↔ Floating Action Button candidate ↔ Form Actions ↔ Command Palette
- Knowledge Relationships — Overlay And Interruption: Modal/Dialog ↔ Drawer candidate ↔ SideDrawer legacy reference ↔ Overlay ↔ Confirmation Pattern ↔ Alert
- Knowledge Relationships — Help And Validation: Explanation Bubble / Tooltip ↔ Popover candidate ↔ HelpText ↔ Inline Validation ↔ Form Field ↔ Alert
- Knowledge Relationships — Feedback And Loading: Toast ↔ Alert ↔ Skeleton Loader ↔ Empty State Pattern ↔ Source Attribution
- Knowledge Relationships — Selection And Forms: Checkbox ↔ Radio Button ↔ Selectable Chip ↔ Select/Dropdown ↔ Form Field ↔ Date Picker
- Knowledge Relationships — Data And Explainability: Data Table ↔ Confidence Badge ↔ Source Attribution ↔ Audit Panel ↔ Typography
- Knowledge Relationships — Navigation And Discovery: Tabs ↔ Link ↔ Command Palette ↔ Card ↔ Typography ↔ Icon

## Cobertura por perspectiva

- Componentes cobertos: 25.
- Perspectivas cobertas: 9.
- Entradas disciplinares geradas: 225.

| Perspectiva | Componentes cobertos |
|---|---:|
| Designer | 25 |
| UX Specialist | 25 |
| Developer | 25 |
| Solution Architect | 25 |
| QA | 25 |
| Accessibility | 25 |
| Maintainer | 25 |
| Tech Writer | 25 |
| Design System Manager | 25 |

## Migrações adicionadas

- Legacy Modal to Modal/Dialog
- Legacy Table to Table/Data Table
- Custom Input to Canonical Input / Text Input
- Styled Link Button to Button or Link
- Hover Help to Explanation Bubble / Tooltip
- Spinner-Heavy Loading to Skeleton Loader
- Mixed Notifications to Alert and Toast

## Observações operacionais

- O ChromaDB não foi reindexado neste passo para evitar carregar embedding local ou acionar provider externo.
- Para aplicar os novos chunks no banco persistente, execute a reindexação em ambiente apropriado.
- Nenhum commit foi criado.
