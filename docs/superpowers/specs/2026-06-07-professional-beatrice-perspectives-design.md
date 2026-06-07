# Perspectivas Profissionais da Beatrice

Data: 2026-06-07

## Objetivo

Substituir a arquitetura visual e técnica baseada em personas fictícias por oito perspectivas profissionais da Beatrice. A interface deve apresentar lentes de análise, não personagens independentes.

## Registro canônico

O sistema terá um único registro canônico:

| ID | Nome exibido | Contrato |
|---|---|---|
| `dev` | Developer | `developer.md` |
| `designer` | Designer | `designer.md` |
| `product_designer` | Product Designer | `product-designer.md` |
| `qa` | QA | `qa.md` |
| `tech_writer` | Tech Writer | `tech-writer.md` |
| `a11y` | Accessibility Specialist | `accessibility.md` |
| `maintainer` | Maintainer | `maintainer.md` |
| `design_system_manager` | Design System Manager | `design-system-manager.md` |

`general` continua disponível apenas como fallback interno neutro. Ele não integra a lista selecionável de perspectivas profissionais.

## Compatibilidade de entrada

Valores antigos serão normalizados na fronteira de entrada:

| ID antigo | ID canônico |
|---|---|
| `pm` | `design_system_manager` |
| `writer` | `tech_writer` |

Depois da normalização, estado, eventos, calibração, testes, chamadas HTTP e processamento no backend usarão somente IDs canônicos.

Dados antigos em localStorage e payloads compatíveis serão aceitos. Ao serem carregados, passarão a ser persistidos com o ID canônico. Não haverá registros antigos e novos em paralelo.

## Perfis profissionais

### Developer

Implementação, arquitetura de código, TypeScript, componentes, estados, integração, performance, reuso e edge cases.

### Designer

Composição visual, hierarquia, tokens, espaçamento, tipografia, cores, estados visuais, densidade e consistência estética.

### Product Designer

Combina Design e UX Research. Avalia interface, experiência, usabilidade, fluxo, hierarquia visual, consistência, clareza da interação, necessidades do usuário, contexto de uso, hipóteses de comportamento, fricção, alternativas e formas de validação.

Não será tratado como Product Manager nem limitado ao design visual. Sua recomendação deve conectar a qualidade visual e interativa à evidência disponível sobre a experiência.

### QA

Critérios de aceite, cenários de teste, regressão, edge cases, estados de erro, loading e validação manual e automatizada.

### Tech Writer

Documentação, nomenclatura, exemplos, microcopy, clareza, consistência terminológica e instruções acionáveis.

### Accessibility Specialist

WCAG, foco, teclado, ARIA, leitores de tela, contraste, estados acessíveis, prevenção de erro e inclusão.

### Maintainer

Manutenção, simplicidade, reuso, dívida técnica, acoplamento, duplicação, risco futuro e custo de evolução.

### Design System Manager

Estratégia, governança, adoção, prioridade, valor de produto, roadmap, consistência sistêmica, impacto em múltiplos times, critérios de exceção e maturidade do design system.

Essa perspectiva absorve a responsabilidade estratégica antes associada a Product Manager.

## Limites entre perspectivas

Designer avalia principalmente a composição e a qualidade visual.

Product Designer avalia a solução visual e interativa, a experiência, as necessidades do usuário e a evidência usada para validar a solução.

Design System Manager avalia prioridade, adoção, governança, roadmap e impacto sistêmico entre times.

Maintainer avalia saúde técnica, simplicidade, dívida, acoplamento, duplicação e custo futuro de evolução.

## Interface

Todos os seletores, cards, menus, dropdowns, tooltips, estados selecionados, cabeçalhos e listas usarão os nomes profissionais como título principal.

A interface explicará que o usuário está escolhendo uma perspectiva profissional da Beatrice. Os nomes Adrian Vale, Elena Voss, Sofia Mercer, Maya Sterling, Lucien Ward, Iris Holloway e Kai Renner serão removidos de títulos, menus e detalhes dos perfis.

Campos internos que ainda usam terminologia de persona poderão ser mantidos quando uma renomeação ampla não for necessária para o comportamento, mas nenhum texto visível deve apresentar as perspectivas como personagens.

## Fluxo de dados

1. Valores externos ou persistidos passam pelo normalizador de IDs.
2. O frontend resolve a estratégia pelo ID canônico.
3. O estado ativo e a calibração são persistidos com o ID canônico.
4. Eventos de estudo e requisições de chat enviam o ID canônico.
5. O backend valida e normaliza o perfil recebido.
6. O perfil canônico seleciona o perfil cognitivo e o contrato Markdown correspondente.
7. Auditoria, laboratório e metadados registram somente o ID canônico.

## Contratos Markdown

Cada uma das oito perspectivas terá um contrato Markdown próprio em `prompts/perspectives/`.

O registro de contratos mapeará diretamente o ID canônico ao arquivo correspondente. Developer e Accessibility Specialist preservarão seus contratos especializados atuais. Os outros seis contratos serão adicionados com critérios e estrutura coerentes com suas responsabilidades.

Aliases não serão chaves do registro de contratos. A normalização ocorrerá antes da consulta.

## Migração e armazenamento

O carregamento do perfil ativo aceitará `pm` e `writer`, converterá os valores e atualizará o localStorage.

Calibrações e ensaios armazenados com os IDs antigos serão lidos por compatibilidade e migrados para as chaves canônicas quando acessados. Novas gravações nunca usarão IDs antigos.

Registros históricos de laboratório não precisam ser reescritos no banco para preservar a integridade da pesquisa. Qualquer dado histórico apresentado ou reutilizado pelo pipeline será normalizado na leitura.

## Testes

Os testes devem verificar:

1. As oito opções profissionais exibidas na UI e seus IDs.
2. A ausência de nomes fictícios nos dados usados pela UI.
3. O envio de IDs canônicos pelo frontend.
4. A conversão de `pm` e `writer` na entrada.
5. A persistência canônica após carregar dados antigos.
6. O carregamento do contrato Markdown correto para cada ID.
7. A preservação dos contratos especializados de Developer e Accessibility Specialist.
8. A existência independente de Designer e Product Designer.
9. A separação de responsabilidades entre Product Designer e Design System Manager.
10. A rejeição ou normalização controlada de IDs não canônicos fora das fronteiras de compatibilidade.

## Escopo de atualização

Serão atualizados o domínio de perspectivas, tipos, localização, componentes visuais, workspaces, persistência, calibração, laboratório, perfis cognitivos, allowlists, contratos, evals e documentação operacional que ainda descreva `pm` como Product Manager.

Documentos históricos de pesquisa que descrevem participantes reais ou decisões passadas não serão reescritos quando o termo Product Manager se referir ao papel estudado, e não à arquitetura atual de perspectivas.

## Critérios de conclusão

O trabalho estará concluído quando:

1. A UI apresentar somente os oito nomes profissionais.
2. Todo novo estado, evento e request usar IDs canônicos.
3. Aliases antigos forem aceitos apenas na entrada e normalizados.
4. Os oito contratos forem carregáveis pelo backend.
5. Designer, Product Designer e Design System Manager tiverem responsabilidades distintas.
6. Build e testes focados passarem.
