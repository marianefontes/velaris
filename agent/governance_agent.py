"""Proactive governance analysis for the Abraxos design system catalog."""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path
from typing import Any, Callable

from component_metadata import ComponentMetadata, component_catalog, component_registry

from agent.catalog_registries import (
    extract_dot_notation_tokens,
    guideline_catalog,
    token_catalog,
)
from agent.entity_alias_registry import COMPONENT_ALIASES
from agent.knowledge_health import (
    COVERAGE_DIMENSIONS,
    _component_dimension_coverage,
    _has_localized_text,
)

BASE_DIR = Path(__file__).resolve().parents[1]
DUMP_PATH = BASE_DIR / "rag" / "aetheris-docs-dump.json"
METADATA_PATH = BASE_DIR / "data" / "component-metadata.json"

SEVERITY_ORDER = ("critical", "high", "medium", "low")

KNOWN_OVERLAP_PAIRS: tuple[tuple[str, str, str], ...] = (
    ("alert", "toast", "Feedback não bloqueante vs feedback persistente"),
    ("modal-dialog", "card", "Container modal vs container de conteúdo estático"),
    ("select-dropdown", "selectable-chip", "Seleção única em lista vs chips selecionáveis"),
    ("tabs", "selectable-chip", "Navegação por abas vs seleção por chips"),
)

OVERLAP_KEYWORD_GROUPS: tuple[frozenset[str], str] = (
    (frozenset({"feedback", "notifica", "alerta", "toast", "banner"}), "feedback"),
    (frozenset({"modal", "dialog", "drawer", "overlay", "painel"}), "container"),
    (frozenset({"select", "dropdown", "picker", "chip", "option"}), "selection"),
    (frozenset({"input", "field", "textarea", "form"}), "form"),
)


@dataclass(frozen=True)
class GovernanceAlert:
    id: str
    category: str
    severity: str
    priority: int
    problem: str
    impact: str
    affected_entities: tuple[str, ...]
    recommendation: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "category": self.category,
            "severity": self.severity,
            "priority": self.priority,
            "problem": self.problem,
            "impact": self.impact,
            "affected_entities": list(self.affected_entities),
            "recommendation": self.recommendation,
        }


def _utc_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat(timespec="seconds")


def _normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


def _tokenize(value: str) -> set[str]:
    return {
        token
        for token in re.findall(r"[a-záàâãéêíóôõúç0-9-]+", value.lower())
        if len(token) > 2
    }


def _similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, _normalize_text(a), _normalize_text(b)).ratio()


def _jaccard(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    union = a | b
    if not union:
        return 0.0
    return len(a & b) / len(union)


def _component_purpose_text(component: ComponentMetadata) -> str:
    parts: list[str] = []
    for value in (component.description, component.about):
        if value and _has_localized_text(value):
            parts.append(str(getattr(value, "pt", "") or getattr(value, "en", "")))
    for entry in component.when_to_use or []:
        parts.append(str(getattr(entry, "pt", "") or getattr(entry, "en", "")))
    for entry in component.common_uses or []:
        parts.append(str(getattr(entry, "pt", "") or getattr(entry, "en", "")))
    return " ".join(parts)


def _rag_chunks() -> tuple[dict[str, Any], ...]:
    if not DUMP_PATH.exists():
        return ()
    payload = json.loads(DUMP_PATH.read_text(encoding="utf-8"))
    return tuple(payload.get("chunks", []))


def _metadata_corpus() -> str:
    if not METADATA_PATH.exists():
        return ""
    return METADATA_PATH.read_text(encoding="utf-8").lower()


def _severity_priority(severity: str) -> int:
    order = {name: index for index, name in enumerate(SEVERITY_ORDER)}
    return order.get(severity, 99)


def _next_alert_id(counter: list[int]) -> str:
    counter[0] += 1
    return f"gov-{counter[0]:04d}"


def _detect_duplicate_components(counter: list[int]) -> list[GovernanceAlert]:
    alerts: list[GovernanceAlert] = []
    components = list(component_registry().values())
    seen_pairs: set[tuple[str, str]] = set()

    for index, left in enumerate(components):
        left_text = _component_purpose_text(left)
        left_tokens = _tokenize(left_text)
        for right in components[index + 1 :]:
            pair_key = tuple(sorted((left.component_id, right.component_id)))
            if pair_key in seen_pairs:
                continue

            right_text = _component_purpose_text(right)
            text_similarity = _similarity(left_text, right_text)
            token_overlap = _jaccard(left_tokens, _tokenize(right_text))
            name_similarity = _similarity(left.name, right.name)

            if (
                text_similarity >= 0.72
                or token_overlap >= 0.65
                or (name_similarity >= 0.85 and left.section == right.section)
            ):
                seen_pairs.add(pair_key)
                severity = "critical" if text_similarity >= 0.82 else "high"
                alerts.append(
                    GovernanceAlert(
                        id=_next_alert_id(counter),
                        category="duplicate_components",
                        severity=severity,
                        priority=_severity_priority(severity),
                        problem=(
                            f"Componentes '{left.name}' e '{right.name}' têm propósitos "
                            f"documentados muito similares (similaridade {text_similarity:.0%})."
                        ),
                        impact=(
                            "Times podem escolher componentes equivalentes de forma inconsistente, "
                            "fragmentando padrões e aumentando dívida de governança."
                        ),
                        affected_entities=(left.name, right.name),
                        recommendation=(
                            "Consolidar contratos, clarificar fronteiras de uso ou deprecar "
                            "um dos componentes com guia de migração explícito."
                        ),
                    )
                )
    return alerts


def _detect_overlapping_components(counter: list[int]) -> list[GovernanceAlert]:
    alerts: list[GovernanceAlert] = []
    registry = component_registry()
    seen_pairs: set[tuple[str, str]] = set()

    for left_id, right_id, reason in KNOWN_OVERLAP_PAIRS:
        left = registry.get(left_id)
        right = registry.get(right_id)
        if left is None or right is None:
            continue
        seen_pairs.add(tuple(sorted((left.component_id, right.component_id))))
        alerts.append(
            GovernanceAlert(
                id=_next_alert_id(counter),
                category="overlapping_components",
                severity="high",
                priority=_severity_priority("high"),
                problem=f"Superposição funcional conhecida entre '{left.name}' e '{right.name}': {reason}.",
                impact=(
                    "Decisões de interface ficam ambíguas; adoção e documentação divergem "
                    "entre times que interpretam o mesmo cenário de formas diferentes."
                ),
                affected_entities=(left.name, right.name),
                recommendation=(
                    "Publicar critérios de escolha explícitos (when_to_use / when_not_to_use) "
                    "e referenciar a decisão de design que separa os dois casos."
                ),
            )
        )

    components = list(registry.values())
    for index, left in enumerate(components):
        left_keywords = _tokenize(_component_purpose_text(left))
        for right in components[index + 1 :]:
            pair_key = tuple(sorted((left.component_id, right.component_id)))
            if pair_key in seen_pairs:
                continue
            right_keywords = _tokenize(_component_purpose_text(right))
            for group, label in OVERLAP_KEYWORD_GROUPS:
                if not (left_keywords & group and right_keywords & group):
                    continue
                overlap = _jaccard(left_keywords, right_keywords)
                if overlap >= 0.35 and left.section == right.section:
                    seen_pairs.add(pair_key)
                    alerts.append(
                        GovernanceAlert(
                            id=_next_alert_id(counter),
                            category="overlapping_components",
                            severity="medium",
                            priority=_severity_priority("medium"),
                            problem=(
                                f"'{left.name}' e '{right.name}' competem no domínio "
                                f"de {label} com vocabulário sobreposto."
                            ),
                            impact=(
                                "Usuários do design system recebem recomendações conflitantes "
                                "para cenários parecidos."
                            ),
                            affected_entities=(left.name, right.name),
                            recommendation=(
                                "Documentar matriz de decisão entre os dois componentes "
                                "e revisar related_components para apontar alternativas."
                            ),
                        )
                    )
                break
    return alerts


def _collect_token_references() -> set[str]:
    references: set[str] = set()
    corpus = _metadata_corpus()
    for token in token_catalog():
        normalized = token.lower().strip()
        if normalized and normalized in corpus:
            references.add(normalized)

    for chunk in _rag_chunks():
        if chunk.get("page_type") in {"component", "pattern", "guideline", "design_decision"}:
            text = str(chunk.get("text", "")).lower()
            for token in extract_dot_notation_tokens(text):
                references.add(token.lower())
            for token in token_catalog():
                if token.lower() in text:
                    references.add(token.lower())
    return references


def _detect_orphan_tokens(counter: list[int]) -> list[GovernanceAlert]:
    references = _collect_token_references()
    orphans = sorted(
        token
        for token in token_catalog()
        if token.lower() not in references
    )
    if not orphans:
        return []

    severity = "critical" if len(orphans) >= 5 else "high" if len(orphans) >= 2 else "medium"
    sample = orphans[:8]
    extra = len(orphans) - len(sample)
    entities = tuple(sample + ([f"+{extra} more"] if extra > 0 else []))

    return [
        GovernanceAlert(
            id=_next_alert_id(counter),
            category="orphan_tokens",
            severity=severity,
            priority=_severity_priority(severity),
            problem=f"{len(orphans)} token(s) no catálogo sem referência em componentes ou documentação.",
            impact=(
                "Tokens órfãos inflam o registry, confundem buscas e aumentam risco "
                "de uso acidental de valores não mantidos."
            ),
            affected_entities=entities,
            recommendation=(
                "Vincular tokens a consumidores documentados, deprecar entradas obsoletas "
                "ou remover do registry se não forem mais suportados."
            ),
        )
    ]


def _detect_guidelines_without_reference(counter: list[int]) -> list[GovernanceAlert]:
    guidelines = guideline_catalog()
    if not guidelines:
        return []

    corpus_parts: list[str] = [_metadata_corpus()]
    for chunk in _rag_chunks():
        if chunk.get("page_type") in {"component", "design_decision", "pattern"}:
            corpus_parts.append(str(chunk.get("text", "")).lower())

    corpus = "\n".join(corpus_parts)
    unreferenced: list[str] = []
    for key, label in guidelines.items():
        normalized_label = label.lower()
        if normalized_label not in corpus and key not in corpus:
            unreferenced.append(label)

    if not unreferenced:
        return []

    severity = "high" if len(unreferenced) >= 3 else "medium"
    sample = tuple(sorted(set(unreferenced))[:10])
    return [
        GovernanceAlert(
            id=_next_alert_id(counter),
            category="guidelines_without_reference",
            severity=severity,
            priority=_severity_priority(severity),
            problem=f"{len(unreferenced)} guideline(s) publicada(s) sem referência cruzada no catálogo.",
            impact=(
                "Princípios de design ficam isolados da prática; componentes e decisões "
                "podem violar guidelines sem detecção automática."
            ),
            affected_entities=sample,
            recommendation=(
                "Referenciar guidelines em when_to_use, content_guidelines ou ADRs "
                "dos componentes que devem obedecê-las."
            ),
        )
    ]


def _detect_missing_dimension(
    counter: list[int],
    *,
    dimension: str,
    category: str,
    label: str,
    impact: str,
    recommendation: str,
    severity_fn: Callable[[int], str],
) -> list[GovernanceAlert]:
    missing: list[str] = []
    checker = dict(COVERAGE_DIMENSIONS).get(dimension)
    if checker is None:
        return []

    for component in component_registry().values():
        if component.status == "deprecated":
            continue
        if not checker(component):
            missing.append(component.name)

    if not missing:
        return []

    severity = severity_fn(len(missing))
    sample = tuple(missing[:12])
    extra = len(missing) - len(sample)
    entities = sample + ((f"+{extra} more",) if extra > 0 else ())

    return [
        GovernanceAlert(
            id=_next_alert_id(counter),
            category=category,
            severity=severity,
            priority=_severity_priority(severity),
            problem=f"{len(missing)} componente(s) sem {label}.",
            impact=impact,
            affected_entities=entities,
            recommendation=recommendation,
        )
    ]


def _detect_inconsistent_documentation(counter: list[int]) -> list[GovernanceAlert]:
    alerts: list[GovernanceAlert] = []
    rag_by_component: dict[str, list[str]] = {}

    for chunk in _rag_chunks():
        if chunk.get("page_type") != "component":
            continue
        title = str(chunk.get("title", "")).strip()
        if not title:
            continue
        rag_by_component.setdefault(title.lower(), []).append(str(chunk.get("text", "")))

    for component in component_registry().values():
        rag_text = " ".join(rag_by_component.get(component.name.lower(), [])).lower()
        if not rag_text:
            continue

        metadata_variants = {variant.id.lower() for variant in (component.variants or [])}
        metadata_states = {state.id.lower() for state in (component.states or [])}

        rag_variants = set(re.findall(r"\bvariant[e]?\s+([a-z0-9-]+)", rag_text))
        rag_states = set(re.findall(r"\b(?:state|estado)\s+([a-z0-9-]+)", rag_text))

        variant_drift = metadata_variants - rag_variants if metadata_variants else set()
        state_drift = metadata_states - rag_states if metadata_states else set()

        if not variant_drift and not state_drift:
            continue

        drift_parts: list[str] = []
        if variant_drift:
            drift_parts.append(f"variantes {', '.join(sorted(variant_drift))}")
        if state_drift:
            drift_parts.append(f"estados {', '.join(sorted(state_drift))}")

        alerts.append(
            GovernanceAlert(
                id=_next_alert_id(counter),
                category="inconsistent_documentation",
                severity="medium",
                priority=_severity_priority("medium"),
                problem=(
                    f"Documentação RAG de '{component.name}' diverge do metadata "
                    f"({'; '.join(drift_parts)})."
                ),
                impact=(
                    "Respostas do oráculo e a UI do catálogo podem contradizer-se, "
                    "reduzindo confiança nas recomendações."
                ),
                affected_entities=(component.name,),
                recommendation=(
                    "Reindexar o corpus RAG ou alinhar component-metadata.json "
                    "para que variantes e estados coincidam."
                ),
            )
        )
    return alerts


def _detect_conflicting_aliases(counter: list[int]) -> list[GovernanceAlert]:
    alias_map: dict[str, list[str]] = {}
    registry = component_registry()

    for component_id, aliases in COMPONENT_ALIASES.items():
        component = registry.get(component_id)
        if component is None:
            continue
        for alias in aliases:
            normalized = _normalize_text(alias)
            alias_map.setdefault(normalized, []).append(component.name)

    conflicts: list[tuple[str, tuple[str, ...]]] = [
        (alias, tuple(sorted(set(names))))
        for alias, names in alias_map.items()
        if len(set(names)) > 1
    ]

    if not conflicts:
        return []

    entities: list[str] = []
    for alias, names in conflicts[:6]:
        entities.append(f"'{alias}' → {', '.join(names)}")

    return [
        GovernanceAlert(
            id=_next_alert_id(counter),
            category="conflicting_aliases",
            severity="critical",
            priority=_severity_priority("critical"),
            problem=f"{len(conflicts)} alias(es) resolvem para múltiplos componentes distintos.",
            impact=(
                "Consultas ao oráculo e buscas por nome podem retornar entidades erradas, "
                "causando recomendações incorretas."
            ),
            affected_entities=tuple(entities),
            recommendation=(
                "Desambiguar aliases no entity_alias_registry: reservar termos genéricos "
                "para um componente canônico ou usar aliases compostos."
            ),
        )
    ]


def _detect_low_coverage_entities(counter: list[int]) -> list[GovernanceAlert]:
    alerts: list[GovernanceAlert] = []
    for component in component_catalog().components:
        coverage = _component_dimension_coverage(component)
        if coverage["backlog_priority"] not in {"critical", "high"}:
            continue
        missing = ", ".join(coverage["missing_fields"][:5])
        extra = len(coverage["missing_fields"]) - min(5, len(coverage["missing_fields"]))
        if extra > 0:
            missing += f" (+{extra})"

        severity = "critical" if coverage["backlog_priority"] == "critical" else "high"
        alerts.append(
            GovernanceAlert(
                id=_next_alert_id(counter),
                category="low_coverage",
                severity=severity,
                priority=_severity_priority(severity),
                problem=(
                    f"'{component.name}' tem cobertura documental de "
                    f"{coverage['coverage_v2_percent']}% — abaixo do mínimo de governança."
                ),
                impact=(
                    "Respostas sobre este componente terão evidência fraca; "
                    "times não conseguem validar contratos completos."
                ),
                affected_entities=(component.name,),
                recommendation=f"Preencher campos ausentes: {missing}.",
            )
        )
    return alerts


def build_governance_alerts() -> dict[str, Any]:
    counter = [0]
    alerts: list[GovernanceAlert] = []

    detectors: tuple[Callable[[list[int]], list[GovernanceAlert]], ...] = (
        _detect_conflicting_aliases,
        _detect_duplicate_components,
        _detect_overlapping_components,
        _detect_orphan_tokens,
        _detect_guidelines_without_reference,
        lambda c: _detect_missing_dimension(
            c,
            dimension="examples",
            category="components_without_examples",
            label="exemplos de uso",
            impact="Times não conseguem copiar padrões validados; adoção fica lenta e inconsistente.",
            recommendation="Adicionar exemplos concretos com contexto, props e estados relevantes.",
            severity_fn=lambda count: "high" if count >= 5 else "medium",
        ),
        lambda c: _detect_missing_dimension(
            c,
            dimension="edge_cases",
            category="components_without_edge_cases",
            label="edge cases documentados",
            impact="Implementações falham em cenários limítrofes não cobertos pelo contrato.",
            recommendation="Documentar edge cases com comportamento esperado e estados de fallback.",
            severity_fn=lambda count: "medium" if count >= 3 else "low",
        ),
        lambda c: _detect_missing_dimension(
            c,
            dimension="accessibility",
            category="components_without_accessibility",
            label="contrato de acessibilidade",
            impact="Risco de regressões a11y e não conformidade com WCAG em produção.",
            recommendation="Completar accessibility.summary, keyboard, aria e items no metadata.",
            severity_fn=lambda count: "critical" if count >= 3 else "high",
        ),
        _detect_inconsistent_documentation,
        _detect_low_coverage_entities,
    )

    for detector in detectors:
        alerts.extend(detector(counter))

    alerts.sort(key=lambda alert: (alert.priority, alert.id))

    by_severity = {severity: 0 for severity in SEVERITY_ORDER}
    by_category: dict[str, int] = {}
    for alert in alerts:
        by_severity[alert.severity] = by_severity.get(alert.severity, 0) + 1
        by_category[alert.category] = by_category.get(alert.category, 0) + 1

    return {
        "audited_at": _utc_now(),
        "total_alerts": len(alerts),
        "severity_summary": by_severity,
        "category_summary": by_category,
        "alerts": [alert.to_dict() for alert in alerts],
    }


def build_governance_alerts_block(payload: dict[str, Any] | None = None) -> str:
    data = payload or build_governance_alerts()
    lines = [
        "# Governance Alerts (computed — quote these, do not invent)",
        f"- audited_at: {data['audited_at']}",
        f"- total_alerts: {data['total_alerts']}",
        f"- severity_summary: {json.dumps(data['severity_summary'], ensure_ascii=False)}",
        "",
        "## Active Alerts",
    ]

    for alert in data.get("alerts", [])[:25]:
        entities = ", ".join(alert.get("affected_entities", []))
        lines.extend([
            f"### {alert['id']} · {alert['category']} · {alert['severity']}",
            f"- problem: {alert['problem']}",
            f"- impact: {alert['impact']}",
            f"- affected_entities: {entities}",
            f"- recommendation: {alert['recommendation']}",
            f"- priority: {alert['priority']}",
            "",
        ])

    remaining = data.get("total_alerts", 0) - min(25, len(data.get("alerts", [])))
    if remaining > 0:
        lines.append(f"({remaining} additional alerts omitted — prioritize by severity.)")

    return "\n".join(lines).strip()
