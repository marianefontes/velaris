from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parent.parent
CASES_DIR = ROOT / "evals" / "cases"
ALLOWED_CONVERGENCE_MODES = {"converge", "diverge", "abstain"}
ALLOWED_CATEGORIES = {
    "factual",
    "decision",
    "ambiguous",
    "contradictory",
    "out_of_scope",
    "accessibility",
    "governance",
}


@dataclass(frozen=True)
class EvaluationCase:
    id: str
    version: str
    question: str
    category: str
    expected_intent: str
    expected_source_areas: tuple[str, ...]
    required_facts: tuple[dict[str, Any], ...]
    forbidden_claims: tuple[dict[str, Any], ...]
    abstention_expected: bool
    convergence: str
    perspective_expectations: dict[str, dict[str, Any]]
    structure_terms: tuple[str, ...]


@dataclass(frozen=True)
class CaseSet:
    id: str
    version: str
    path: Path
    fingerprint: str
    cases: tuple[EvaluationCase, ...]

    def public_metadata(self) -> dict[str, Any]:
        categories: dict[str, int] = {}
        for case in self.cases:
            categories[case.category] = categories.get(case.category, 0) + 1
        return {
            "id": self.id,
            "version": self.version,
            "case_count": len(self.cases),
            "fingerprint": self.fingerprint,
            "categories": categories,
        }


def _require_string(record: dict[str, Any], field: str, *, case_id: str) -> str:
    value = record.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValueError(f"{case_id}: field '{field}' must be a non-empty string")
    return value.strip()


def _validate_phrase_groups(value: Any, field: str, case_id: str) -> tuple[dict[str, Any], ...]:
    if value is None:
        return ()
    if not isinstance(value, list):
        raise ValueError(f"{case_id}: field '{field}' must be a list")
    groups = []
    for index, group in enumerate(value):
        if not isinstance(group, dict):
            raise ValueError(f"{case_id}: {field}[{index}] must be an object")
        group_id = _require_string(group, "id", case_id=case_id)
        phrases = group.get("any_of")
        if not isinstance(phrases, list) or not phrases or not all(
            isinstance(phrase, str) and phrase.strip() for phrase in phrases
        ):
            raise ValueError(f"{case_id}: {field}.{group_id}.any_of must contain phrases")
        groups.append({"id": group_id, "any_of": [phrase.strip() for phrase in phrases]})
    return tuple(groups)


def _validate_perspective_expectations(value: Any, case_id: str) -> dict[str, dict[str, Any]]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ValueError(f"{case_id}: perspective_expectations must be an object")
    result: dict[str, dict[str, Any]] = {}
    for profile, expectation in value.items():
        if not isinstance(expectation, dict):
            raise ValueError(f"{case_id}: expectation for {profile} must be an object")
        phrases = expectation.get("any_of", [])
        if not isinstance(phrases, list) or not all(
            isinstance(phrase, str) and phrase.strip() for phrase in phrases
        ):
            raise ValueError(f"{case_id}: expectation for {profile} has invalid any_of")
        result[str(profile)] = {
            "any_of": [phrase.strip() for phrase in phrases],
            "description": str(expectation.get("description", "")).strip(),
        }
    return result


def _parse_case(record: dict[str, Any], *, expected_version: str) -> EvaluationCase:
    case_id = _require_string(record, "id", case_id="<unknown>")
    version = _require_string(record, "version", case_id=case_id)
    if version != expected_version:
        raise ValueError(f"{case_id}: expected version '{expected_version}', got '{version}'")
    category = _require_string(record, "category", case_id=case_id)
    if category not in ALLOWED_CATEGORIES:
        raise ValueError(f"{case_id}: unsupported category '{category}'")
    convergence = _require_string(record, "convergence", case_id=case_id)
    if convergence not in ALLOWED_CONVERGENCE_MODES:
        raise ValueError(f"{case_id}: unsupported convergence mode '{convergence}'")
    sources = record.get("expected_source_areas", [])
    if not isinstance(sources, list) or not all(isinstance(item, str) for item in sources):
        raise ValueError(f"{case_id}: expected_source_areas must be a string list")
    structure_terms = record.get("structure_terms", [])
    if not isinstance(structure_terms, list) or not all(
        isinstance(item, str) for item in structure_terms
    ):
        raise ValueError(f"{case_id}: structure_terms must be a string list")

    return EvaluationCase(
        id=case_id,
        version=version,
        question=_require_string(record, "question", case_id=case_id),
        category=category,
        expected_intent=_require_string(record, "expected_intent", case_id=case_id),
        expected_source_areas=tuple(item.strip() for item in sources if item.strip()),
        required_facts=_validate_phrase_groups(record.get("required_facts"), "required_facts", case_id),
        forbidden_claims=_validate_phrase_groups(record.get("forbidden_claims"), "forbidden_claims", case_id),
        abstention_expected=bool(record.get("abstention_expected", False)),
        convergence=convergence,
        perspective_expectations=_validate_perspective_expectations(
            record.get("perspective_expectations"),
            case_id,
        ),
        structure_terms=tuple(item.strip() for item in structure_terms if item.strip()),
    )


def load_case_set(case_set_id: str) -> CaseSet:
    path = CASES_DIR / f"{case_set_id}.jsonl"
    if not path.exists():
        raise ValueError(f"Unknown case set '{case_set_id}'")

    version = case_set_id
    raw = path.read_bytes()
    cases = []
    seen_ids: set[str] = set()
    for line_number, line in enumerate(raw.decode("utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError as error:
            raise ValueError(f"{path.name}:{line_number}: invalid JSON") from error
        if not isinstance(record, dict):
            raise ValueError(f"{path.name}:{line_number}: case must be an object")
        case = _parse_case(record, expected_version=version)
        if case.id in seen_ids:
            raise ValueError(f"{path.name}:{line_number}: duplicate case id '{case.id}'")
        seen_ids.add(case.id)
        cases.append(case)

    if not cases:
        raise ValueError(f"Case set '{case_set_id}' is empty")
    return CaseSet(
        id=case_set_id,
        version=version,
        path=path,
        fingerprint=hashlib.sha256(raw).hexdigest()[:16],
        cases=tuple(cases),
    )


def list_case_sets() -> list[dict[str, Any]]:
    if not CASES_DIR.exists():
        return []
    return [
        load_case_set(path.stem).public_metadata()
        for path in sorted(CASES_DIR.glob("*.jsonl"))
    ]
