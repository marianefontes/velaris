# Aetheris Design System — Component Map & Gap Analysis

> **Total de chunks indexados:** 37  
> **Modelo de embedding:** BAAI/bge-m3  
> **Versão:** 2.0.0-tsx  
> **Fontes processadas:** 4  

---

## 1. Mapa Completo de Chunks

| # | Chunk ID | Tipo | Título | Chars | Campos Preenchidos | Status |
|---|----------|------|--------|-------|--------------------|--------|
| 1 | `componentspage  ::  primary_action` | component | Primary Action | 387 | 4/7 | ✅ |
| 2 | `componentspage  ::  switch_control` | component | Switch Control | 389 | 4/7 | ✅ |
| 3 | `componentspage  ::  global_fab` | component | Global FAB | 397 | 4/7 | ✅ |
| 4 | `componentspage  ::  contextual_menu` | component | Contextual Menu | 399 | 4/7 | ✅ |
| 5 | `componentspage  ::  system_alerts` | component | System Alerts | 407 | 4/7 | ✅ |
| 6 | `componentspage  ::  toast_notification` | component | Toast Notification | 413 | 4/7 | ✅ |
| 7 | `componentspage  ::  skeleton_loader` | component | Skeleton Loader | 415 | 4/7 | ✅ |
| 8 | `componentspage  ::  metrics_plot` | component | Metrics Plot | 392 | 4/7 | ✅ |
| 9 | `componentspage  ::  bioluminescent_heatmap` | component | Bioluminescent Heatmap | 402 | 4/7 | ✅ |
| 10 | `componentspage  ::  radial_gauge` | component | Radial Gauge | 381 | 4/7 | ✅ |
| 11 | `componentspage  ::  sparkline_strip` | component | Sparkline Strip | 406 | 4/7 | ✅ |
| 12 | `componentspage  ::  entity_graph` | component | Entity Graph | 401 | 4/7 | ✅ |
| 13 | `componentspage  ::  neural_input` | component | Neural Input | 400 | 4/7 | ✅ |
| 14 | `componentspage  ::  selection_chips` | component | Selection Chips | 385 | 4/7 | ✅ |
| 15 | `componentspage  ::  gradient_slider` | component | Gradient Slider | 364 | 4/7 | ✅ |
| 16 | `componentspage  ::  toggle_switch` | component | Toggle Switch | 371 | 4/7 | ✅ |
| 17 | `componentspage  ::  date_picker` | component | Date Picker | 365 | 4/7 | ✅ |
| 18 | `componentspage  ::  search_command_bar` | component | Search Command Bar | 393 | 4/7 | ✅ |
| 19 | `patternspage  ::  dashboard` | pattern | Dashboard | 541 | 5/7 | ✅ |
| 20 | `patternspage  ::  multi_step_form` | pattern | Multi-step Form | 676 | 5/7 | ✅ |
| 21 | `patternspage  ::  onboarding` | pattern | Onboarding | 682 | 5/7 | ✅ |
| 22 | `patternspage  ::  data_explorer` | pattern | Data Explorer | 679 | 5/7 | ✅ |
| 23 | `patternspage  ::  empty_states` | pattern | Empty States | 755 | 6/7 | ✅ |
| 24 | `patternspage  ::  settings_config` | pattern | Settings & Config | 452 | 4/7 | ✅ |
| 25 | `patternspage  ::  command_center` | pattern | Command Center | 391 | 3/7 | ✅ |
| 26 | `patternspage  ::  focus_mode` | pattern | Focus Mode | 778 | 6/7 | ✅ |
| 27 | `patternspage  ::  collaboration` | pattern | Collaboration | 749 | 6/7 | ✅ |
| 28 | `patternspage  ::  timeline` | pattern | Timeline | 728 | 6/7 | ✅ |
| 29 | `patternspage  ::  entity_picker` | pattern | Entity Picker | 731 | 6/7 | ✅ |
| 30 | `TokensPage.tsx  ::  color_tokens` | token | Color Tokens | 428 | 6/7 | ✅ |
| 31 | `TokensPage.tsx  ::  semantic_colors` | token | Semantic Color Tokens | 260 | 6/7 | ✅ |
| 32 | `TokensPage.tsx  ::  typography_tokens` | token | Typography Tokens | 427 | 6/7 | ✅ |
| 33 | `TokensPage.tsx  ::  spacing_tokens` | token | Spacing Tokens | 302 | 6/7 | ✅ |
| 34 | `DesignDecisionsPage.tsx  ::  side_drawer_vs_modal` | design_decision | Side Drawer vs Modal Overlay | 620 | 7/7 | ✅ |
| 35 | `designdecisionspage  ::  primary_vs_secondary_button_logic` | design_decision | Primary vs. Secondary Button Logic | 205 | 2/7 | ✅ |
| 36 | `designdecisionspage  ::  list_vs_bento` | design_decision | List vs. Bento | 151 | 2/7 | ⚠️ thin |
| 37 | `designdecisionspage  ::  haptic_feedback` | design_decision | Haptic Feedback | 148 | 2/7 | ⚠️ thin |

---

## 2. Cobertura por Tipo de Página

| Tipo | Chunks | Média de Chars | Thin (⚠️) | Cobertura |
|------|--------|----------------|-----------|-----------|
| component | 18 | 392 | 0 | ██████████ 100% |
| pattern | 11 | 651 | 0 | ██████████ 100% |
| token | 4 | 354 | 0 | ██████████ 100% |
| design_decision | 4 | 281 | 2 | █████░░░░░ 50% |

---

## 3. Preenchimento de Campos Semânticos

Percentual de chunks que possuem cada campo preenchido:

| Campo | Chunks com dado | % de cobertura |
|-------|----------------|----------------|
| `context_of_use` | 36/37 | █████████░ 97% |
| `aetheris_insight` | 34/37 | █████████░ 92% |
| `when_not_to_use` | 31/37 | ████████░░ 84% |
| `when_to_use` | 23/37 | ██████░░░░ 62% |
| `logic` | 17/37 | ████░░░░░░ 46% |
| `structure` | 15/37 | ████░░░░░░ 41% |
| `trade_offs` | 10/37 | ██░░░░░░░░ 27% |

---

## 4. Gap Analysis — 2 Chunks com Conteúdo Escasso

> Critério: `char_count < 200` **ou** menos de 2 campos semânticos preenchidos.

### ⚠️ `designdecisionspage :: list_vs_bento`
- **Tipo:** design_decision  
- **Chars:** 151  
- **Campos preenchidos:** logic, context_of_use  
- **Campos ausentes:** structure, when_to_use, when_not_to_use, trade_offs, aetheris_insight  
- **Recomendação:** Adicionar ao TSX pelo menos `when_to_use`, `when_not_to_use` e `aetheris_insight` para este item.  

### ⚠️ `designdecisionspage :: haptic_feedback`
- **Tipo:** design_decision  
- **Chars:** 148  
- **Campos preenchidos:** logic, context_of_use  
- **Campos ausentes:** structure, when_to_use, when_not_to_use, trade_offs, aetheris_insight  
- **Recomendação:** Adicionar ao TSX pelo menos `when_to_use`, `when_not_to_use` e `aetheris_insight` para este item.  

---

## 5. Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Total de chunks | 37 |
| Chunks ricos (✅) | 35 |
| Chunks thin (⚠️) | 2 |
| Health score do corpus | **95%** |
| Campo mais coberto | `context_of_use` |
| Campo menos coberto | `trade_offs` |

> Um corpus com health ≥ 80% garante retrieval semântico de qualidade.
> Chunks thin devem ser enriquecidos no TSX antes de re-rodar a indexação.
