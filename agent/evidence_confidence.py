"""Evidence confidence summary for component recommendations and enforce flows."""

from __future__ import annotations

from .models import ComponentSelection, EvidenceConfidenceItem


def build_evidence_confidence(
    selection: ComponentSelection | None,
    *,
    english: bool = False,
) -> list[EvidenceConfidenceItem]:
    if selection is None or selection.recommended is None:
        return [
            EvidenceConfidenceItem(
                key="selection",
                label="Component selection" if english else "Seleção de componente",
                status="fail",
                detail=(
                    "No recommended component was resolved."
                    if english
                    else "Nenhum componente recomendado foi resolvido."
                ),
            )
        ]

    recommended = selection.recommended
    component = recommended.component
    items: list[EvidenceConfidenceItem] = []

    contract_present = bool(
        component.states
        and component.variants
        and component.accessibility
    )
    items.append(EvidenceConfidenceItem(
        key="contract",
        label="Contract" if english else "Contrato",
        status="pass" if contract_present else "warn",
        detail=(
            "States, variants and accessibility are documented."
            if contract_present and english
            else "Estados, variantes e acessibilidade documentados."
            if contract_present
            else (
                "Contract is partially documented in the catalog."
                if english
                else "Contrato parcialmente documentado no catálogo."
            )
        ),
    ))

    do_count = len(recommended.selected_do_rules)
    items.append(EvidenceConfidenceItem(
        key="dos",
        label="Do's" if english else "Do's",
        status="pass" if do_count else "warn",
        detail=(
            f"{do_count} do rule(s) selected for this context."
            if english
            else f"{do_count} regra(s) do selecionada(s) para este contexto."
        ),
    ))

    dont_count = len(recommended.selected_dont_rules)
    violation_count = len(
        recommended.context_fit.violations
        if recommended.context_fit
        else []
    )
    dont_status = "fail" if violation_count else "pass" if dont_count else "warn"
    items.append(EvidenceConfidenceItem(
        key="donts",
        label="Don'ts" if english else "Don'ts",
        status=dont_status,
        detail=(
            f"{violation_count} don't violation(s) detected for this context."
            if violation_count and english
            else f"{violation_count} violação(ões) de don't detectada(s) para este contexto."
            if violation_count
            else (
                f"{dont_count} don't rule(s) available as guardrails."
                if english
                else f"{dont_count} regra(s) don't disponíveis como limites."
            )
        ),
    ))

    guidelines_status = "pass" if component.when_to_use else "warn"
    items.append(EvidenceConfidenceItem(
        key="guidelines",
        label="Guidelines" if english else "Guidelines",
        status=guidelines_status,
        detail=(
            "when_to_use / when_not_to_use documented."
            if guidelines_status == "pass" and english
            else "when_to_use / when_not_to_use documentados."
            if guidelines_status == "pass"
            else (
                "Usage guidelines are incomplete."
                if english
                else "Guidelines de uso incompletas."
            )
        ),
    ))

    a11y_status = (
        "pass"
        if component.accessibility and component.accessibility.summary
        else "warn"
    )
    items.append(EvidenceConfidenceItem(
        key="accessibility",
        label="Accessibility" if english else "Acessibilidade",
        status=a11y_status,
        detail=(
            "Accessibility contract documented."
            if a11y_status == "pass" and english
            else "Contrato de acessibilidade documentado."
            if a11y_status == "pass"
            else (
                "Accessibility guidance is partial or missing."
                if english
                else "Orientação de acessibilidade parcial ou ausente."
            )
        ),
    ))

    if selection.documented_purpose:
        items.append(EvidenceConfidenceItem(
            key="intent",
            label="Component intent" if english else "Intenção do componente",
            status="pass",
            detail=selection.documented_purpose[:220],
        ))

    return items


def format_evidence_confidence(
    items: list[EvidenceConfidenceItem],
    *,
    english: bool = False,
) -> str:
    header = "### Evidence considered" if english else "### Evidências consideradas"
    lines = [header, ""]
    icon = {"pass": "✓", "warn": "⚠", "fail": "✗"}
    for item in items:
        lines.append(f"- {icon[item.status]} **{item.label}:** {item.detail}")
    return "\n".join(lines)
