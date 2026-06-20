"""Deterministic anti-pattern detection for audit, enforce and recommendations."""

from __future__ import annotations

from component_metadata import component_registry, localized_text

from .component_fit import detect_context_violations
from .models import AntiPatternHit, ComponentSelection
from .understanding import normalize_text


def _hit(
    *,
    pattern_id: str,
    component_id: str,
    component_name: str,
    violated_rule_id: str,
    violated_field: str,
    rule_text: str,
    principle: str,
    recommended_alternative: str,
    severity: str = "high",
) -> AntiPatternHit:
    return AntiPatternHit(
        pattern_id=pattern_id,
        component_id=component_id,
        component_name=component_name,
        violated_rule_id=violated_rule_id,
        violated_field=violated_field,
        rule_text=rule_text,
        principle=principle,
        recommended_alternative=recommended_alternative,
        severity=severity,
    )


def detect_catalog_anti_patterns(
    query: str,
    *,
    component_id: str | None = None,
) -> list[AntiPatternHit]:
    normalized = normalize_text(query)
    hits: list[AntiPatternHit] = []

    registry = component_registry()
    candidates = [component_id] if component_id else []
    if not candidates:
        for marker, cid in (
            ("toast", "toast"),
            ("dialog", "modal-dialog"),
            ("modal", "modal-dialog"),
            ("tooltip", "explanation-tooltip"),
            ("accordion", "tabs"),
        ):
            if marker in normalized and cid in registry:
                candidates.append(cid)
        candidates = list(dict.fromkeys(candidates))

    for cid in candidates:
        component = registry.get(cid)
        if component is None:
            continue
        violations = detect_context_violations(query, component)
        for violation in violations:
            alternative = _recommended_alternative(cid, violation.field, normalized)
            hits.append(_hit(
                pattern_id=f"{cid}.{violation.rule_id}",
                component_id=cid,
                component_name=component.name,
                violated_rule_id=violation.rule_id,
                violated_field=violation.field,
                rule_text=violation.text,
                principle=_principle_for_field(violation.field),
                recommended_alternative=alternative,
            ))

    if any(term in normalized for term in ("toast", "notificacao", "notificação")):
        if any(term in normalized for term in ("erro critico", "erro crítico", "critical error", "pagamento")):
            component = registry.get("toast")
            if component and component.dont:
                rule = component.dont[0]
                hits.append(_hit(
                    pattern_id="toast.critical_error",
                    component_id="toast",
                    component_name=component.name,
                    violated_rule_id=rule.id,
                    violated_field="dont",
                    rule_text=localized_text(rule.text),
                    principle="Feedback crítico exige atenção garantida, não mensagem transitória.",
                    recommended_alternative="Alert ou Modal/Dialog",
                ))

    if "tooltip" in normalized and any(
        term in normalized
        for term in ("obrigator", "obrigat", "essential", "instrucao essencial", "instrução essencial")
    ):
        component = registry.get("explanation-tooltip")
        if component and component.dont:
            rule = next(
                (item for item in component.dont if "essencial" in localized_text(item.text).lower()),
                component.dont[0],
            )
            hits.append(_hit(
                pattern_id="tooltip.essential_instruction",
                component_id="explanation-tooltip",
                component_name=component.name,
                violated_rule_id=rule.id,
                violated_field="dont",
                rule_text=localized_text(rule.text),
                principle="Instruções essenciais precisam estar sempre visíveis no fluxo.",
                recommended_alternative="Form Field, texto de ajuda inline ou Alert",
            ))

    return _dedupe_hits(hits)


def detect_anti_patterns_from_selection(
    query: str,
    selection: ComponentSelection | None,
) -> list[AntiPatternHit]:
    component_id = (
        selection.recommended.component.component_id
        if selection and selection.recommended
        else None
    )
    return detect_catalog_anti_patterns(query, component_id=component_id)


def _principle_for_field(field: str) -> str:
    mapping = {
        "dont": "Violação de limite documentado no catálogo do componente.",
        "when_not_to_use": "Uso fora do contrato semântico do componente.",
        "anti_pattern": "Padrão sistêmico que quebra previsibilidade e governança.",
    }
    return mapping.get(field, "Violação de contrato do design system.")


def _recommended_alternative(
    component_id: str,
    field: str,
    normalized_query: str,
) -> str:
    if component_id == "modal-dialog":
        if any(term in normalized_query for term in ("passo", "etapa", "onboarding", "wizard")):
            return "Card + progresso por etapa, ou Side Drawer (decisão documentada)"
        return "Revisar componente mais alinhado ao fluxo descrito"
    if component_id == "toast":
        return "Alert ou Modal/Dialog"
    if component_id == "explanation-tooltip":
        return "Form Field com help text visível"
    if component_id == "tabs":
        return "Fluxo passo a passo com Card ou Form Field"
    return "Consultar alternativa documentada no catálogo"


def _dedupe_hits(hits: list[AntiPatternHit]) -> list[AntiPatternHit]:
    seen: set[str] = set()
    unique: list[AntiPatternHit] = []
    for hit in hits:
        key = f"{hit.component_id}:{hit.violated_rule_id}"
        if key in seen:
            continue
        seen.add(key)
        unique.append(hit)
    return unique
