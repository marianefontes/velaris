"""Regression checks for Beatrice's two-type public capability architecture."""

from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from cognition.engines.registry import PUBLIC_ENGINES, resolve_engine
from cognition.orchestration.orchestration_weights import (
    DISCLOSABLE_SKILLS,
    SKILL_DISPLAY_NAMES,
    STRATEGIES,
)
from cognition.orchestration.reasoning_engine import build_cognitive_orchestration
from cognition.overrides.manual_override_parser import parse_manual_override
from prompts.intent_router import route_query
from prompts.prompt_builder import build_response_template

def active_skill_ids(query: str) -> set[str]:
    route = route_query(query)
    result = build_cognitive_orchestration(query=query, route=route)
    assert len(result.activations) <= 5
    return {activation.id for activation in result.activations}


def command_names_from_frontend() -> set[str]:
    policies = (ROOT / "src/beatrice/domain/governance/policies.ts").read_text(encoding="utf-8")
    pattern_line = next(
        (line.strip() for line in policies.splitlines() if line.strip().startswith("/^\\/(")),
        None,
    )
    assert pattern_line, "frontend command pattern was not found"
    alternatives = pattern_line.split("/^\\/(", 1)[1].split(")\\b/", 1)[0]
    return set(alternatives.split("|"))


def test_automatic_skill_taxonomy() -> None:
    expected = {
        "pattern_exploration",
        "architecture_analysis",
        "interaction_guardrail",
        "design_system_governance_check",
        "component_fit_analysis",
        "component_misuse_detection",
        "token_impact_analysis",
        "design_to_code_contract_check",
        "implementation_planning",
        "tradeoff_analysis",
        "systems_thinking",
        "risk_assessment",
    }
    assert DISCLOSABLE_SKILLS == expected
    assert set(SKILL_DISPLAY_NAMES) == expected
    assert "retrieval_deep_dive" in STRATEGIES
    assert "retrieval_deep_dive" not in DISCLOSABLE_SKILLS


def test_intent_triggered_skills() -> None:
    assert "component_fit_analysis" in active_skill_ids("Uso Modal ou Alert para esse caso?")
    assert "component_misuse_detection" in active_skill_ids(
        "Vou usar Toast para avisar um erro que bloqueia o fluxo."
    )
    assert "token_impact_analysis" in active_skill_ids(
        "O que acontece se eu mudar primary-200?"
    )
    assert "design_to_code_contract_check" in active_skill_ids(
        "O estado disabled do Button está coerente com a documentação e existe no código?"
    )
    assert "interaction_guardrail" in active_skill_ids(
        "Esse componente precisa de foco visível e navegação por teclado?"
    )


def test_use_override_accepts_canonical_names() -> None:
    expected = {
        "pattern_exploration",
        "interaction_guardrail",
        "design_system_governance_check",
        "component_fit_analysis",
        "component_misuse_detection",
        "token_impact_analysis",
        "design_to_code_contract_check",
    }
    for canonical_id in expected:
        command_name = canonical_id.replace("_", "-")
        override = parse_manual_override(f"/use {command_name}\nAnalise este caso.")
        assert override.active
        assert canonical_id in override.boosted_strategies


def test_engine_registry_and_aliases() -> None:
    public_ids = {engine.id for engine in PUBLIC_ENGINES}
    assert public_ids == {
        "organizational-memory",
        "decision-archaeology",
        "perspective-synthesis",
        "explainability-audit",
        "knowledge-gap",
        "governance-impact",
        "principle-conflict",
        "adoption-friction",
    }
    aliases = {
        "memory": "organizational-memory",
        "decision": "decision-archaeology",
        "perspectives": "perspective-synthesis",
        "audit": "explainability-audit",
        "history": "organizational-memory",
        "why": "decision-archaeology",
        "score": "explainability-audit",
        "simulate": "governance-impact",
    }
    for alias, canonical in aliases.items():
        engine = resolve_engine(alias)
        assert engine is not None and engine.id == canonical

    council = resolve_engine("oracle-council")
    assert council is not None
    assert council.tier == "experimental"
    assert not council.public


def test_operational_commands_and_legacy_normalization() -> None:
    commands = command_names_from_frontend()
    assert {"enforce", "migrate", "capture", "document"} <= commands
    assert {"token-impact", "contract-check", "feedback-review"} <= commands
    assert {"memory", "decision", "perspectives", "audit"} <= commands
    assert "component-fit" not in commands
    assert "misuse-detection" not in commands

    assert route_query("primary-200", command_mode="token-impact").active_command_mode == "token-impact"
    assert route_query("Button disabled", command_mode="contract-check").active_command_mode == "contract-check"
    assert route_query("feedback", command_mode="learn").active_command_mode == "feedback-review"
    assert route_query("feedback", profile="learn").active_command_mode == "feedback-review"
    assert route_query("Table", command_mode="adoption-friction").active_command_mode == "adoption-friction"
    assert route_query("modais", command_mode="memory").active_command_mode == "organizational-memory"
    assert route_query("toast", command_mode="decision").active_command_mode == "decision-archaeology"
    assert route_query("compare", command_mode="perspectives").active_command_mode == "perspective-synthesis"
    assert route_query("sources", command_mode="audit").active_command_mode == "explainability-audit"
    assert "TOKEN IMPACT" in build_response_template("token_lookup", command_mode="token-impact")
    assert "CONTRACT CHECK" in build_response_template("component_guidance", command_mode="contract-check")
    assert "does not train" in build_response_template("design_decision", command_mode="feedback-review")


def test_public_picker_and_documentation() -> None:
    models = (ROOT / "src/beatrice/domain/governance/models.ts").read_text(encoding="utf-8")
    actions = re.search(r"export const ORACLE_ACTION_ORDER:.*?= \[(.*?)\];", models, re.S)
    investigations = re.search(r"export const ORACLE_INVESTIGATION_ORDER:.*?= \[(.*?)\];", models, re.S)
    assert actions and investigations
    assert '"enforce"' in actions.group(1)
    assert '"capture"' in actions.group(1)
    for alias in ('"memory"', '"decision"', '"perspectives"', '"audit"'):
        assert alias in investigations.group(1)
    assert '"learn"' not in actions.group(1)
    assert '"organizational-memory"' not in investigations.group(1)

    docs = (ROOT / "docs/beatrice-capability-architecture.md").read_text(encoding="utf-8")
    assert "Habilidades da Beatrice" in docs
    assert "Comandos do Oráculo" in docs
    assert "Ativação automática" in docs
    assert "/memory" in docs
    assert "/decision" in docs
    assert "/perspectives" in docs
    assert "/audit" in docs
    assert "Retrieval Deep Dive permanece oculto" in docs
    assert "/adoption-friction" in docs
    assert "/feedback-review" in docs

    rag_dump = (ROOT / "rag/aetheris-docs-dump.md").read_text(encoding="utf-8")
    assert "[AUTOMATIC_SKILL] Component Fit Analysis" in rag_dump
    assert "[ORACLE_COMMAND] Adoption Friction" in rag_dump
    assert "[ORACLE_COMMAND] Contract Check" in rag_dump


if __name__ == "__main__":
    test_automatic_skill_taxonomy()
    test_intent_triggered_skills()
    test_use_override_accepts_canonical_names()
    test_engine_registry_and_aliases()
    test_operational_commands_and_legacy_normalization()
    test_public_picker_and_documentation()
    print("Beatrice capability architecture checks passed.")
