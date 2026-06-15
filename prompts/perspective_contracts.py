"""Specialized response contracts and observable-signal validation."""

from __future__ import annotations

from dataclasses import dataclass
import re
import unicodedata
from typing import Iterable

from prompts.loader import load_prompt
from prompts.perspective_ids import normalize_profile_id


@dataclass(frozen=True)
class SignalGroup:
    id: str
    label: str
    phrases: tuple[str, ...]
    minimum_matches: int = 1


@dataclass(frozen=True)
class PerspectiveResponseContract:
    id: str
    version: str
    profile: str
    prompt_path: str
    signal_groups: tuple[SignalGroup, ...]


def _group(
    group_id: str,
    label: str,
    phrases: Iterable[str],
    minimum_matches: int = 1,
) -> SignalGroup:
    return SignalGroup(
        id=group_id,
        label=label,
        phrases=tuple(phrases),
        minimum_matches=minimum_matches,
    )


PERSPECTIVE_RESPONSE_CONTRACTS: dict[str, PerspectiveResponseContract] = {
    "dev": PerspectiveResponseContract(
        id="developer-response-v1",
        version="1.2",
        profile="dev",
        prompt_path="perspectives/developer.md",
        signal_groups=(
            _group(
                "implementation_boundary",
                "implementation boundary and state ownership",
                (
                    "ownership do estado",
                    "state ownership",
                    "dono do estado",
                    "state owner",
                    "limite do componente",
                    "component boundary",
                    "ponto de integracao",
                    "integration point",
                ),
                minimum_matches=2,
            ),
            _group(
                "api_props",
                "component API or props",
                (
                    "props",
                    "api",
                    "open",
                    "onopenchange",
                    "onconfirm",
                    "oncancel",
                    "isloading",
                    "confirmLabel",
                    "cancelLabel",
                ),
                minimum_matches=2,
            ),
            _group(
                "state_flow",
                "state and async flow",
                (
                    "abre o modal",
                    "opens the dialog",
                    "onconfirm",
                    "loading",
                    "carregamento",
                    "sucesso",
                    "success",
                    "erro",
                    "error",
                    "cancelamento",
                    "cancellation",
                ),
                minimum_matches=4,
            ),
            _group(
                "edge_cases",
                "edge cases",
                (
                    "duplo clique",
                    "duplicate",
                    "varias vezes",
                    "falha de rede",
                    "erro de rede",
                    "network failure",
                    "permissao negada",
                    "permission denied",
                    "outro usuario",
                    "another user",
                    "loading infinito",
                    "infinite loading",
                    "durante a execucao",
                    "mobile",
                    "dependencias",
                    "dependencies",
                ),
                minimum_matches=5,
            ),
            _group(
                "technical_accessibility",
                "technical accessibility",
                (
                    "focus trap",
                    "prender o foco",
                    "aria-modal",
                    "aria-labelledby",
                    "aria-describedby",
                    "teclado",
                    "keyboard",
                    "retorno de foco",
                    "restaurar o foco",
                    "retornar o foco",
                    "return focus",
                    "escape",
                    "nao depender apenas de cor",
                    "not rely on color",
                ),
                minimum_matches=3,
            ),
            _group(
                "integration_reuse",
                "integration and reuse",
                (
                    "design system",
                    "padronizado",
                    "standardized",
                    "centralizar",
                    "centralizada",
                    "centralize",
                    "reuso",
                    "reuse",
                    "reutilizavel",
                    "reusable",
                    "nao duplicar",
                    "duplicacao",
                    "do not duplicate",
                    "cache",
                    "lista",
                    "list",
                ),
                minimum_matches=2,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability and limitations",
                (
                    "evidence similarity",
                    "similaridade da evidencia",
                    "evidence tier",
                    "tier de evidencia",
                    "fontes",
                    "sources",
                    "limitacao",
                    "limitation",
                ),
                minimum_matches=2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                ("limitacao", "limitation", "nao substitui validacao"),
            ),
        ),
    ),
    "a11y": PerspectiveResponseContract(
        id="accessibility-response-v1",
        version="1.2",
        profile="a11y",
        prompt_path="perspectives/accessibility.md",
        signal_groups=(
            _group(
                "barrier_impact",
                "concrete accessibility barrier and user impact",
                (
                    "barreira concreta",
                    "concrete barrier",
                    "barreira de acessibilidade",
                    "accessibility barrier",
                    "impacto no usuario",
                    "user impact",
                    "usuario afetado",
                    "affected user",
                ),
                minimum_matches=2,
            ),
            _group(
                "focus",
                "focus management",
                (
                    "gerenciamento de foco",
                    "focus management",
                    "prender o foco",
                    "captura de foco",
                    "foco deve ser capturado",
                    "foco seja preso",
                    "foco deve ser preso",
                    "foco e preso",
                    "foco visivel",
                    "visible focus",
                    "retorno de foco",
                    "restaurar o foco",
                    "retornar o foco",
                    "foco retorne",
                    "foco retorna",
                    "foco deve retornar",
                    "return focus",
                    "focus trap",
                    "ordem de foco",
                    "focus order",
                ),
                minimum_matches=3,
            ),
            _group(
                "keyboard",
                "keyboard navigation",
                ("teclado", "keyboard", "tab", "shift tab", "escape"),
            ),
            _group(
                "semantics_aria",
                "semantic HTML or ARIA",
                (
                    "html semantico",
                    "semantic html",
                    "role dialog",
                    "aria-modal",
                    "aria-labelledby",
                    "aria-describedby",
                    "papel semantico",
                    "semantic role",
                ),
                minimum_matches=2,
            ),
            _group(
                "assistive_technology",
                "screen readers or assistive technology",
                (
                    "leitor de tela",
                    "leitores de tela",
                    "screen reader",
                    "tecnologia assistiva",
                    "tecnologias assistivas",
                    "assistive technology",
                    "voiceover",
                    "nvda",
                ),
            ),
            _group(
                "accessible_states",
                "accessible loading, error, disabled and success states",
                (
                    "loading",
                    "carregamento",
                    "erro",
                    "error",
                    "disabled",
                    "desabilitado",
                    "sucesso",
                    "success",
                    "anuncio",
                    "announcement",
                ),
                minimum_matches=3,
            ),
            _group(
                "error_prevention",
                "error prevention",
                (
                    "prevencao de erro",
                    "error prevention",
                    "confirmacao explicita",
                    "explicit confirmation",
                    "consequencia",
                    "consequence",
                    "cancelar",
                    "cancel",
                    "desfazer",
                    "undo",
                    "duplo envio",
                    "duplicate submission",
                ),
                minimum_matches=2,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability and limitations",
                (
                    "evidence similarity",
                    "similaridade da evidencia",
                    "similaridade de",
                    "evidence tier",
                    "tier de evidencia",
                    "evidencia parcial",
                    "fontes",
                    "sources",
                    "limitacao",
                    "limitacoes da evidencia",
                    "limitation",
                ),
                minimum_matches=2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes da evidencia",
                    "limitation",
                    "nao substituem validacao",
                    "nao substitui validacao",
                ),
            ),
        ),
    ),
    "designer": PerspectiveResponseContract(
        id="designer-response-v3",
        version="3.0",
        profile="designer",
        prompt_path="perspectives/designer.md",
        signal_groups=(
            _group(
                "visual_diagnosis",
                "concrete visual cause and perceptual effect",
                (
                    "inconsistencia visual",
                    "visual inconsistency",
                    "causa visual",
                    "visual cause",
                    "efeito perceptivo",
                    "perceptual effect",
                    "peso visual",
                    "visual weight",
                    "foco visual",
                    "visual focus",
                ),
                2,
            ),
            _group(
                "visual_finding",
                "mandatory visual finding",
                (
                    "elemento ou regiao",
                    "element or region",
                    "causa visual",
                    "visual cause",
                    "efeito perceptivo",
                    "perceptual effect",
                    "correcao sistemica",
                    "system correction",
                    "dependencia de token ou estado",
                    "token or state dependency",
                    "fronteira de usabilidade",
                    "usability boundary",
                ),
                5,
            ),
            _group(
                "composition_rhythm",
                "hierarchy, composition and rhythm",
                (
                    "hierarquia",
                    "hierarchy",
                    "composicao",
                    "composition",
                    "grid",
                    "alinhamento",
                    "alignment",
                    "ritmo",
                    "rhythm",
                    "respiro",
                    "breathing room",
                    "densidade",
                    "density",
                ),
                3,
            ),
            _group(
                "visual_system",
                "tokens, typography, color and spacing",
                (
                    "token",
                    "tokens",
                    "espacamento",
                    "spacing",
                    "tipografia",
                    "typography",
                    "cor",
                    "color",
                    "contraste",
                    "contrast",
                ),
                3,
            ),
            _group(
                "states_affordance",
                "visual states, affordance and consistency",
                (
                    "estados visuais",
                    "visual states",
                    "affordance",
                    "consistencia estetica",
                    "aesthetic consistency",
                    "loading",
                    "erro",
                    "error",
                    "disabled",
                    "success",
                    "sucesso",
                    "empty",
                    "vazio",
                ),
                2,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
    "product_designer": PerspectiveResponseContract(
        id="product-designer-response-v3",
        version="3.0",
        profile="product_designer",
        prompt_path="perspectives/product-designer.md",
        signal_groups=(
            _group(
                "primary_action_user_need",
                "primary action and user need",
                (
                    "acao principal",
                    "primary action",
                    "proxima acao",
                    "next action",
                    "necessidade do usuario",
                    "user need",
                    "contexto de uso",
                    "context of use",
                ),
                2,
            ),
            _group(
                "experience_flow",
                "flow, friction, feedback and cognitive load",
                (
                    "fluxo",
                    "flow",
                    "friccao",
                    "friction",
                    "feedback",
                    "carga cognitiva",
                    "cognitive load",
                    "abandono",
                    "abandonment",
                    "acao errada",
                    "wrong action",
                ),
                3,
            ),
            _group(
                "evidence_hypothesis_risk",
                "observed evidence, hypothesis and behavioral risk",
                (
                    "evidencia observada",
                    "observed evidence",
                    "hipotese",
                    "hypothesis",
                    "risco comportamental",
                    "behavioral risk",
                    "maior risco",
                    "highest risk",
                ),
                3,
            ),
            _group(
                "behavioral_hypothesis_record",
                "mandatory behavioral hypothesis record",
                (
                    "acao principal esperada",
                    "expected primary action",
                    "necessidade ou contexto",
                    "need or context",
                    "evidencia observada",
                    "observed evidence",
                    "hipotese comportamental",
                    "behavioral hypothesis",
                    "maior risco",
                    "highest risk",
                    "mudanca proposta",
                    "proposed change",
                    "sinal que sustenta a hipotese",
                    "signal supporting the hypothesis",
                    "sinal que refuta a hipotese",
                    "signal refuting the hypothesis",
                ),
                6,
            ),
            _group(
                "alternatives_validation",
                "alternatives and practical validation",
                (
                    "alternativa",
                    "alternative",
                    "validacao qualitativa",
                    "qualitative validation",
                    "validacao quantitativa",
                    "quantitative validation",
                    "teste de usabilidade",
                    "usability test",
                    "taxa de conclusao",
                    "completion rate",
                ),
                3,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
    "qa": PerspectiveResponseContract(
        id="qa-response-v3",
        version="3.0",
        profile="qa",
        prompt_path="perspectives/qa.md",
        signal_groups=(
            _group(
                "principal_risk",
                "principal risk and regression surface",
                (
                    "risco principal",
                    "principal risk",
                    "superficie de regressao",
                    "regression surface",
                    "severidade",
                    "severity",
                ),
                2,
            ),
            _group(
                "acceptance_pass_fail",
                "observable pass or fail acceptance criteria",
                (
                    "criterio de aceite",
                    "acceptance criteria",
                    "passa se",
                    "passes if",
                    "falha se",
                    "fails if",
                    "pass",
                    "fail",
                ),
                3,
            ),
            _group(
                "test_oracle",
                "mandatory observable test oracle",
                (
                    "precondicao",
                    "precondition",
                    "acao",
                    "action",
                    "passa se",
                    "passes if",
                    "falha se",
                    "fails if",
                    "observacao",
                    "observation",
                ),
                5,
            ),
            _group(
                "test_coverage",
                "happy path, negative path and edge cases",
                (
                    "happy path",
                    "caminho feliz",
                    "negative path",
                    "caso negativo",
                    "negative case",
                    "edge case",
                    "regressao",
                    "regression",
                ),
                3,
            ),
            _group(
                "states",
                "observable loading, error, disabled, success and empty states",
                (
                    "loading",
                    "carregamento",
                    "erro",
                    "error",
                    "disabled",
                    "desabilitado",
                    "success",
                    "sucesso",
                    "empty",
                    "vazio",
                ),
                4,
            ),
            _group(
                "validation_layers",
                "automated, manual and accessibility validation",
                (
                    "automatizada",
                    "automated",
                    "manual",
                    "acessibilidade",
                    "accessibility",
                    "teste de contrato",
                    "contract test",
                ),
                3,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
    "tech_writer": PerspectiveResponseContract(
        id="tech-writer-response-v3",
        version="3.0",
        profile="tech_writer",
        prompt_path="perspectives/tech-writer.md",
        signal_groups=(
            _group(
                "canonical_terminology",
                "canonical term and terminology consistency",
                (
                    "termo canonico",
                    "canonical term",
                    "nomenclatura",
                    "naming",
                    "terminologia",
                    "terminology",
                    "glossario",
                    "glossary",
                ),
                2,
            ),
            _group(
                "ambiguity_interpretation",
                "ambiguity and incorrect interpretation",
                (
                    "ambiguidade",
                    "ambiguity",
                    "defeito do sistema",
                    "system defect",
                    "interpretacao errada",
                    "incorrect interpretation",
                    "pode ser interpretado",
                    "could be interpreted",
                ),
                2,
            ),
            _group(
                "editorial_decision",
                "mandatory editorial decision record",
                (
                    "audiencia",
                    "audience",
                    "termo canonico",
                    "canonical term",
                    "ambiguidade",
                    "ambiguity",
                    "interpretacao errada possivel",
                    "possible incorrect interpretation",
                    "redacao recomendada",
                    "recommended wording",
                    "redacao a evitar",
                    "wording to avoid",
                    "proxima acao documental",
                    "next documentation action",
                ),
                6,
            ),
            _group(
                "microcopy_messages",
                "microcopy, labels, errors and fallback messages",
                (
                    "microcopy",
                    "label",
                    "mensagem de erro",
                    "error message",
                    "fallback",
                    "audit drawer",
                    "evidence similarity",
                    "evidence tier",
                ),
                2,
            ),
            _group(
                "actionable_docs",
                "grounded examples and actionable instructions",
                (
                    "exemplo recomendado",
                    "recommended example",
                    "instrucoes acionaveis",
                    "actionable instructions",
                    "passo",
                    "step",
                    "resultado esperado",
                    "expected outcome",
                ),
                3,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
    "maintainer": PerspectiveResponseContract(
        id="maintainer-response-v3",
        version="3.0",
        profile="maintainer",
        prompt_path="perspectives/maintainer.md",
        signal_groups=(
            _group(
                "ownership_change_point",
                "ownership and probable future change point",
                (
                    "ownership",
                    "dono da logica",
                    "logic owner",
                    "logica deve morar",
                    "logic should live",
                    "ponto de mudanca",
                    "change point",
                    "mudanca futura",
                    "future change",
                ),
                2,
            ),
            _group(
                "maintenance_disposition",
                "explicit maintenance disposition and change trigger",
                (
                    "manter explicito",
                    "keep explicit",
                    "extrair abstracao pequena",
                    "extract small abstraction",
                    "consolidar regra compartilhada",
                    "consolidate shared rule",
                    "dividir responsabilidade",
                    "split responsibility",
                    "remover caminho obsoleto",
                    "remove obsolete path",
                    "adiar refatoracao",
                    "defer refactor",
                    "gatilho de mudanca",
                    "change trigger",
                ),
                2,
            ),
            _group(
                "coupling_duplication",
                "coupling and duplication classification",
                (
                    "acoplamento",
                    "coupling",
                    "duplicacao aceitavel",
                    "acceptable duplication",
                    "duplicacao perigosa",
                    "dangerous duplication",
                    "logica fragmentada",
                    "fragmented logic",
                ),
                3,
            ),
            _group(
                "minimum_abstraction",
                "minimum safe abstraction and explicit non-abstraction",
                (
                    "abstracao minima",
                    "minimum abstraction",
                    "menor caminho estavel",
                    "smallest stable path",
                    "nao abstrair",
                    "do not abstract",
                    "testavel",
                    "testable",
                    "removivel",
                    "removable",
                ),
                3,
            ),
            _group(
                "evolution_validation",
                "evolution cost, regression and validation",
                (
                    "custo de evolucao",
                    "evolution cost",
                    "risco de regressao",
                    "regression risk",
                    "onboarding",
                    "testabilidade",
                    "testability",
                    "validacao",
                    "validation",
                ),
                3,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
    "design_system_manager": PerspectiveResponseContract(
        id="design-system-manager-response-v3",
        version="3.0",
        profile="design_system_manager",
        prompt_path="perspectives/design-system-manager.md",
        signal_groups=(
            _group(
                "classification",
                "operational system classification",
                (
                    "padrao global",
                    "global standard",
                    "padrao experimental",
                    "experimental standard",
                    "excecao controlada",
                    "controlled exception",
                    "solucao local",
                    "local solution",
                    "proposta rejeitada",
                    "rejected proposal",
                ),
            ),
            _group(
                "governance_decision_record",
                "mandatory governance decision record",
                (
                    "classificacao",
                    "classification",
                    "owner da decisao",
                    "decision owner",
                    "times afetados",
                    "affected teams",
                    "gate de aprovacao",
                    "approval gate",
                    "gate de promocao",
                    "promotion gate",
                    "sinal de adocao",
                    "adoption signal",
                    "consequencia da fragmentacao",
                    "fragmentation consequence",
                ),
                6,
            ),
            _group(
                "adoption_teams",
                "affected teams and adoption impact",
                (
                    "times afetados",
                    "affected teams",
                    "design",
                    "engenharia",
                    "engineering",
                    "produto",
                    "product",
                    "qa",
                    "documentacao",
                    "documentation",
                    "impacto de adocao",
                    "adoption impact",
                ),
                4,
            ),
            _group(
                "governance_maturity",
                "governance, approval and maturity criteria",
                (
                    "governanca",
                    "governance",
                    "criterio minimo",
                    "minimum criterion",
                    "criterio de aprovacao",
                    "approval criterion",
                    "maturidade",
                    "maturity",
                    "promover",
                    "promote",
                    "ownership",
                ),
                3,
            ),
            _group(
                "fragmentation",
                "fragmentation and convergence risk",
                (
                    "risco de fragmentacao",
                    "fragmentation risk",
                    "cada time",
                    "each team",
                    "padrao concorrente",
                    "competing pattern",
                    "custo de convergencia",
                    "convergence cost",
                ),
                2,
            ),
            _group(
                "roadmap_adoption_signal",
                "roadmap, rollout cost and adoption signal",
                (
                    "prioridade",
                    "priority",
                    "roadmap",
                    "custo de rollout",
                    "rollout cost",
                    "custo de padronizacao",
                    "standardization cost",
                    "metrica de adocao",
                    "adoption metric",
                    "sinal de adocao",
                    "adoption signal",
                ),
                3,
            ),
            _group(
                "evidence_traceability",
                "evidence traceability",
                (
                    "evidence similarity",
                    "evidence tier",
                    "evidencia",
                    "evidence",
                    "fonte",
                    "source",
                ),
                2,
            ),
            _group(
                "evidence_limitation",
                "explicit evidence limitation",
                (
                    "limitacao",
                    "limitacoes",
                    "limitation",
                    "limitations",
                    "nao documentado",
                    "not documented",
                    "inferencia",
                    "inference",
                ),
            ),
        ),
    ),
}


def get_perspective_response_contract(
    profile: str,
) -> PerspectiveResponseContract | None:
    return PERSPECTIVE_RESPONSE_CONTRACTS.get(normalize_profile_id(profile))


def build_perspective_response_contract_prompt(
    profile: str,
    evidence_block: str = "",
) -> str:
    contract = get_perspective_response_contract(profile)
    if contract is None:
        return ""
    contract_prompt = load_prompt(contract.prompt_path)
    parts = [contract_prompt]
    if evidence_block.strip():
        parts.append(evidence_block.strip())
    parts.append(_final_output_gate(profile))
    return "\n\n".join(parts)


def _final_output_gate(profile: str) -> str:
    if profile == "dev":
        return """
# Final Output Gate

The answer is invalid unless all seven required Developer sections are present.
Use a proposed API example only. Unless retrieved evidence provides an exact
official import path and API, do not write an import statement and explicitly
say the props are a proposed contract, not a verified Velaris API.

Include the six named state bullets Trigger, Confirm, Loading, Success, Error
and Cancel. Include a concrete Integration and reuse paragraph using design
system, centralize, reuse and avoid duplication. In Evidências e limitações,
use the literal labels `evidence similarity` and `evidence tier` with supplied
values and state an explicit limitation.

Include this exact API line before the proposed TypeScript interface:
`API proposta: open, onOpenChange, title, description, confirmLabel,
cancelLabel, variant="destructive", isLoading, disabled, onConfirm e onCancel.`

Include this exact sentence in the component-contract section:
`Integração e reuso: use o componente padronizado do design system, centralize
a lógica para reuso e evite duplicação por tela.`
""".strip()
    if profile == "a11y":
        return """
# Final Output Gate

The answer is invalid unless all five required Accessibility sections are
present. In the semantics and focus section, explicitly include native dialog
semantics or `role="dialog"`, `aria-modal="true"`, `aria-labelledby`,
`aria-describedby`, focus trap, visible focus, focus return, Tab, Shift+Tab,
Escape and screen reader or assistive technology behavior.

Name loading, error, disabled and success. Include explicit confirmation,
consequence, cancellation, undo when reversible and duplicate-submission
prevention. Keep the short accessible checklist. In Evidências e limitações,
use the literal labels `evidence similarity` and `evidence tier` with supplied
values and state an explicit limitation.

Include these exact sentences:
`Foco: use focus trap, foco visível e retorno de foco ao gatilho.`
`Tecnologia assistiva: leitores de tela devem anunciar título, descrição,
loading e erro.`
`Limitação: as fontes recuperadas não substituem validação manual com teclado e
tecnologia assistiva.`
""".strip()
    return ""


def validate_perspective_response(profile: str, response_text: str) -> dict:
    contract = get_perspective_response_contract(profile)
    if contract is None:
        return {
            "profile_contract_applied": False,
            "profile_contract_id": None,
            "required_signals_found": [],
            "required_signals_missing": [],
            "perspective_quality_score": None,
            "perspective_contract": None,
            "status": "not_applicable",
            "matched_signals": [],
            "profile_contract_warnings": [],
        }

    normalized = _normalize(response_text)
    required_signals_found: list[str] = []
    required_signals_missing: list[str] = []
    profile_contract_warnings: list[dict[str, str]] = []

    for group in contract.signal_groups:
        matched = {
            _normalize(phrase)
            for phrase in group.phrases
            if _normalize(phrase) in normalized
        }
        if len(matched) >= group.minimum_matches:
            required_signals_found.append(group.id)
            continue
        required_signals_missing.append(group.id)
        profile_contract_warnings.append({
            "code": f"perspective_contract.missing_{group.id}",
            "signal_group": group.id,
            "message": (
                f"Response did not include enough observable signals for "
                f"{group.label} ({len(matched)}/{group.minimum_matches})."
            ),
        })

    perspective_quality_score = round(
        len(required_signals_found) / len(contract.signal_groups),
        3,
    )
    return {
        "profile_contract_applied": True,
        "profile_contract_id": contract.id,
        "required_signals_found": required_signals_found,
        "required_signals_missing": required_signals_missing,
        "perspective_quality_score": perspective_quality_score,
        "perspective_contract": {
            "id": contract.id,
            "version": contract.version,
            "profile": contract.profile,
        },
        "status": "pass" if not profile_contract_warnings else "warning",
        "validation_method": "observable_response_signals",
        "matched_signals": required_signals_found,
        "profile_contract_warnings": profile_contract_warnings,
    }


def build_response_audit_metadata(
    profile: str,
    response_text: str,
    selected_skills: Iterable[str] = (),
) -> dict:
    audit_metadata = validate_perspective_response(profile, response_text)
    audit_metadata["selected_skills"] = [
        str(skill_id)
        for skill_id in selected_skills
        if str(skill_id)
    ]
    audit_metadata["skill_content_requirement"] = (
        "Each selected skill must materially affect a recommendation, risk, "
        "guardrail, implementation detail or validation criterion."
    )
    return audit_metadata


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    ascii_text = "".join(
        character
        for character in decomposed
        if not unicodedata.combining(character)
    )
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", ascii_text.lower())).strip()
