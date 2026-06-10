"""Live Groq smoke for perspective contracts across all canonical profiles.

Runs only when GROQ_API_KEY is configured and the Beatrice backend can reach Groq.
Uses the same generation path as the laboratory runner.
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv

from prompts.perspective_contracts import (
    get_perspective_response_contract,
    validate_perspective_response,
)
from prompts.perspective_ids import CANONICAL_PERSPECTIVE_IDS

load_dotenv(ROOT / ".env.local")

DESTRUCTIVE_ACTION_QUESTION = (
    "Qual componente uso para uma ação destrutiva?"
)


def _word_jaccard(left: str, right: str) -> float:
    left_words = {
        word.strip("`.,:;!?()[]{}\"'").lower()
        for word in left.split()
        if len(word.strip("`.,:;!?()[]{}\"'")) >= 4
    }
    right_words = {
        word.strip("`.,:;!?()[]{}\"'").lower()
        for word in right.split()
        if len(word.strip("`.,:;!?()[]{}\"'")) >= 4
    }
    if not left_words or not right_words:
        return 0.0
    return len(left_words & right_words) / len(left_words | right_words)


async def _generate_for_profile(profile: str) -> dict:
    from server import _generate_laboratory_answer

    return await _generate_laboratory_answer({
        "question": DESTRUCTIVE_ACTION_QUESTION,
        "profile": profile,
    })


def _pairwise_lexical_similarity(responses: dict[str, str]) -> list[dict]:
    pairs: list[dict] = []
    items = list(responses.items())
    for left_index, (left_profile, left_response) in enumerate(items):
        for right_profile, right_response in items[left_index + 1:]:
            pairs.append({
                "left_profile": left_profile,
                "right_profile": right_profile,
                "lexical_similarity": round(
                    _word_jaccard(left_response, right_response),
                    4,
                ),
            })
    return pairs


async def run_smoke() -> dict:
    api_key = os.environ.get("GROQ_API_KEY", "").strip()
    if not api_key:
        return {
            "status": "skipped",
            "reason": "GROQ_API_KEY is not configured",
            "question": DESTRUCTIVE_ACTION_QUESTION,
        }

    results: list[dict] = []
    responses_by_profile: dict[str, str] = {}

    for profile in CANONICAL_PERSPECTIVE_IDS:
        contract = get_perspective_response_contract(profile)
        generated = await _generate_for_profile(profile)
        answer_text = generated["answer_text"]
        audit = generated.get("audit_metadata", {})
        validation = validate_perspective_response(profile, answer_text)
        violations = [
            {
                "code": warning.get("code", ""),
                "signal_group": warning.get("signal_group", ""),
                "message": warning.get("message", ""),
            }
            for warning in audit.get("profile_contract_warnings", [])
        ]
        record = {
            "profile_id": profile,
            "contract_applied": audit.get("profile_contract_applied", False),
            "contract_id": audit.get("profile_contract_id"),
            "contract_path": contract.prompt_path if contract else None,
            "required_signals_found": audit.get("required_signals_found", []),
            "required_signals_missing": audit.get("required_signals_missing", []),
            "perspective_quality_score": audit.get("perspective_quality_score"),
            "violations": violations,
            "validation_status": validation.get("status"),
            "answer_preview": answer_text[:500],
            "answer_text": answer_text,
            "intent": generated.get("intent"),
            "source_count": len(generated.get("sources", [])),
        }
        results.append(record)
        responses_by_profile[profile] = answer_text

    pairwise = _pairwise_lexical_similarity(responses_by_profile)
    max_similarity = max(
        (pair["lexical_similarity"] for pair in pairwise),
        default=0.0,
    )

    return {
        "status": "completed",
        "question": DESTRUCTIVE_ACTION_QUESTION,
        "profiles_tested": len(results),
        "runtime_strategy": "hybrid_prompt_contract",
        "results": results,
        "pairwise_lexical_similarity": pairwise,
        "max_pairwise_lexical_similarity": max_similarity,
    }


def main() -> int:
    payload = asyncio.run(run_smoke())
    print(json.dumps(payload, ensure_ascii=False, indent=2))
    if payload["status"] == "skipped":
        print(
            "Perspective smoke E2E skipped. Set GROQ_API_KEY to run live checks.",
            file=sys.stderr,
        )
        return 0
    if payload["status"] != "completed":
        return 1

    failing_profiles = [
        item["profile_id"]
        for item in payload["results"]
        if item["validation_status"] == "warning"
    ]
    if failing_profiles:
        print(
            "Perspective smoke completed with contract warnings for: "
            + ", ".join(failing_profiles),
            file=sys.stderr,
        )
    else:
        print("Perspective smoke E2E completed.", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
