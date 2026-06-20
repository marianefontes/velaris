"""Context-fit scoring for component recommendations.

Ranks and filters component candidates using documented intent, do/don't rules
and anti-patterns — not retrieval similarity alone.
"""

from __future__ import annotations

import re
import unicodedata
from typing import Literal

from component_metadata import ComponentMetadata, LocalizedRule, localized_text

from .models import ContextFitAssessment, ContextRuleViolation, SelectedRule


FIT_WEIGHT = 0.35
RETRIEVAL_WEIGHT = 0.65
VIOLATION_THRESHOLD = 0.38
HARD_REJECT_WORKFLOWS = frozenset({
    "component_decision",
    "compare_options",
    "page_recommendation",
    "design_audit",
    "single_choice_recommendation",
    "decision_rule_recommendation",
    "comparison_rule",
})

_CONTEXT_PROFILES: dict[str, tuple[str, ...]] = {
    "multi_step_flow": (
        "passo",
        "passos",
        "etapa",
        "etapas",
        "step",
        "steps",
        "onboarding",
        "wizard",
        "assistente",
        "guided",
        "multistep",
        "multi step",
        "multi-step",
        "jornada",
        "fluxo",
    ),
    "long_content": (
        "conteudo longo",
        "conteúdo longo",
        "long content",
        "muito texto",
        "formulario extens",
        "formulário extens",
    ),
    "critical_error": (
        "erro critico",
        "erro crítico",
        "critical error",
        "falha critica",
        "falha crítica",
        "pagamento falhou",
        "payment failed",
        "bloqueante",
        "blocking error",
        "erro de pagamento",
    ),
    "essential_instruction": (
        "instrucao obrigatoria",
        "instrução obrigatória",
        "essential instruction",
        "obrigatorio",
        "obrigatório",
        "required instruction",
        "help text",
        "texto de ajuda",
    ),
    "destructive_action": (
        "destrutiv",
        "excluir",
        "delete",
        "remover",
        "apagar",
        "destructive",
    ),
    "navigation_flow": (
        "navegacao",
        "navegação",
        "navigation",
        "navegar entre",
    ),
}

_RULE_PROFILE_MARKERS: dict[str, tuple[str, ...]] = {
    "multi_step_flow": (
        "multi",
        "etapa",
        "step",
        "passo",
        "longo",
        "long",
        "navega",
        "navigat",
        "jornada",
    ),
    "long_content": ("longo", "long", "extens", "conteudo", "conteúdo"),
    "critical_error": (
        "erro",
        "error",
        "correc",
        "correç",
        "criti",
        "imediata",
        "immediate",
        "blocking",
    ),
    "essential_instruction": (
        "essencial",
        "essential",
        "obrigator",
        "obrigat",
        "instruc",
        "instruç",
    ),
    "destructive_action": (
        "destrutiv",
        "exclu",
        "excluir",
        "delete",
        "remov",
        "apagar",
    ),
    "navigation_flow": ("navega", "navigat", "navigation"),
}


def _normalize_text(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value.lower())
    return "".join(
        character
        for character in normalized
        if unicodedata.category(character) != "Mn"
    )


def _normalize_tokens(value: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-z0-9]+", _normalize_text(value))
        if len(token) > 2
    }


def _lexical_score(query: str, text: str) -> float:
    query_tokens = _normalize_tokens(query)
    text_tokens = _normalize_tokens(text)
    if not query_tokens or not text_tokens:
        return 0.0
    overlap = len(query_tokens & text_tokens)
    union = len(query_tokens | text_tokens)
    coverage = overlap / len(query_tokens)
    jaccard = overlap / union if union else 0.0
    return round(min(1.0, coverage * 0.7 + jaccard * 0.3), 6)


def _rule_text(rule: LocalizedRule) -> str:
    return " ".join(
        part for part in (rule.text.pt, rule.text.en or "") if part
    )


def documented_purpose(component: ComponentMetadata) -> str:
    return (
        localized_text(component.about)
        or localized_text(component.logic)
        or localized_text(component.description)
        or ""
    )


def _active_context_profiles(query: str) -> set[str]:
    normalized = _normalize_text(query)
    return {
        profile_id
        for profile_id, markers in _CONTEXT_PROFILES.items()
        if any(marker in normalized for marker in markers)
    }


def _rule_profiles(rule_text: str) -> set[str]:
    normalized = _normalize_text(rule_text)
    return {
        profile_id
        for profile_id, markers in _RULE_PROFILE_MARKERS.items()
        if any(marker in normalized for marker in markers)
    }


def _component_named_in_query(query: str, component: ComponentMetadata) -> bool:
    normalized = _normalize_text(query)
    names = {
        _normalize_text(component.name),
        _normalize_text(component.component_id.replace("-", " ")),
    }
    for part in re.split(r"[/\s]+", component.name):
        if len(part) > 2:
            names.add(_normalize_text(part))
    names.update({"dialog", "modal", "toast", "tooltip"})
    return any(name and name in normalized for name in names)


def _negative_rules(component: ComponentMetadata) -> list[tuple[str, LocalizedRule]]:
    rules: list[tuple[str, LocalizedRule]] = []
    for field, collection in (
        ("dont", component.dont),
        ("when_not_to_use", component.when_not_to_use),
        ("anti_pattern", component.anti_patterns),
    ):
        if collection:
            rules.extend((field, rule) for rule in collection)
    return rules


def _violation_rules(component: ComponentMetadata) -> list[tuple[str, LocalizedRule]]:
    return [
        (field, rule)
        for field, rule in _negative_rules(component)
        if field in {"dont", "when_not_to_use"}
    ]


def _positive_texts(component: ComponentMetadata) -> list[str]:
    texts: list[str] = []
    purpose = documented_purpose(component)
    if purpose:
        texts.append(purpose)
    for collection in (component.do, component.when_to_use):
        if collection:
            texts.extend(_rule_text(rule) for rule in collection)
    return texts


def _negative_texts(component: ComponentMetadata) -> list[str]:
    return [_rule_text(rule) for _, rule in _negative_rules(component)]


def detect_context_violations(
    query: str,
    component: ComponentMetadata,
) -> list[ContextRuleViolation]:
    active_profiles = _active_context_profiles(query)
    if not active_profiles:
        return []

    violations: list[ContextRuleViolation] = []
    named = _component_named_in_query(query, component)

    for field, rule in _violation_rules(component):
        rule_text = _rule_text(rule)
        if not rule_text:
            continue
        rule_profiles = _rule_profiles(rule_text)
        overlap = active_profiles & rule_profiles
        if not overlap:
            continue

        rule_similarity = _lexical_score(query, rule_text)
        strength = max(rule_similarity, 0.36 if overlap else 0.0)
        if named:
            strength = min(1.0, strength + 0.12)
        if len(overlap) >= 2:
            strength = min(1.0, strength + 0.08)

        if strength < VIOLATION_THRESHOLD:
            continue

        violations.append(ContextRuleViolation(
            rule_id=rule.id,
            field=field,  # type: ignore[arg-type]
            text=localized_text(rule.text),
            violation_strength=round(strength, 4),
            context_profiles=sorted(overlap),
        ))

    violations.sort(key=lambda item: item.violation_strength, reverse=True)
    return violations


def score_context_fit(
    query: str,
    component: ComponentMetadata,
) -> ContextFitAssessment:
    purpose = documented_purpose(component)
    active_profiles = _active_context_profiles(query)
    positive_scores = [_lexical_score(query, text) for text in _positive_texts(component)]
    contextual_negative_scores = []
    for field, rule in _negative_rules(component):
        rule_text = _rule_text(rule)
        if not rule_text:
            continue
        score = _lexical_score(query, rule_text)
        overlap = active_profiles & _rule_profiles(rule_text)
        if field not in {"dont", "when_not_to_use"}:
            if score >= 0.25:
                contextual_negative_scores.append(score * 0.5)
            continue
        if overlap:
            contextual_negative_scores.append(max(score, 0.35))
        elif score >= 0.25:
            contextual_negative_scores.append(score)

    positive_signal = max(positive_scores, default=0.0)
    if len(positive_scores) > 1:
        positive_signal = round(
            positive_signal * 0.7 + (sum(positive_scores) / len(positive_scores)) * 0.3,
            6,
        )

    negative_signal = max(contextual_negative_scores, default=0.0)
    fit_score = round(max(0.0, min(1.0, positive_signal - negative_signal * 0.85)), 6)
    violations = detect_context_violations(query, component)

    return ContextFitAssessment(
        fit_score=fit_score,
        documented_purpose=purpose,
        positive_signal=positive_signal,
        negative_signal=negative_signal,
        violations=violations,
        combined_ranking_score=fit_score,
    )


def combined_ranking_score(
    *,
    retrieval_score: float,
    fit_score: float,
) -> float:
    return round(
        RETRIEVAL_WEIGHT * retrieval_score + FIT_WEIGHT * fit_score,
        6,
    )


def should_hard_reject(
    assessment: ContextFitAssessment,
    *,
    workflow: str | None,
) -> bool:
    if workflow in {"entity_lookup", "direct_entity_guidance"}:
        return False
    if workflow is not None and workflow not in HARD_REJECT_WORKFLOWS:
        return False
    return bool(assessment.violations)


def violation_summary(violations: list[ContextRuleViolation]) -> str:
    if not violations:
        return ""
    primary = violations[0]
    return (
        f"{primary.field} rule {primary.rule_id} applies to this context "
        f"({', '.join(primary.context_profiles)})."
    )


def selected_anti_pattern_rules(
    query: str,
    component: ComponentMetadata,
    *,
    limit: int = 2,
) -> list[SelectedRule]:
    if not component.anti_patterns:
        return []
    texts = [_rule_text(rule) for rule in component.anti_patterns]
    scores = [_lexical_score(query, text) for text in texts]
    ranked = sorted(
        zip(component.anti_patterns, scores, strict=True),
        key=lambda pair: pair[1],
        reverse=True,
    )
    selected: list[SelectedRule] = []
    for rule, score in ranked[:limit]:
        sources = (
            component.provenance.get(f"anti_patterns.{rule.id}")
            or component.provenance.get("anti_patterns", [])
        )
        selected.append(SelectedRule(
            id=rule.id,
            field="anti_pattern",
            text=localized_text(rule.text),
            rule_similarity=max(0.0, min(1.0, float(score))),
            sources=sources,
        ))
    return selected
