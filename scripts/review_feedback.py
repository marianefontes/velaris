"""Offline review of user feedback collected by Abraxos.

Read only. Reads the response_feedback table through AgentStore and prints an
actionable summary to guide corpus, alias and prompt improvements. It does not
change anything and does not update model weights.

Usage:
    python3 scripts/review_feedback.py
    python3 scripts/review_feedback.py --limit 50
    python3 scripts/review_feedback.py --db /path/to/aetheris-agent.sqlite3
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from agent.store import AgentStore


def _print_header(title: str) -> None:
    print()
    print(title)
    print("=" * len(title))


def _print_rows(rows: list[dict], columns: tuple[tuple[str, str], ...]) -> None:
    if not rows:
        print("  (none)")
        return
    for row in rows:
        parts = [f"{label}={row.get(key)}" for label, key in columns]
        print("  " + "  ".join(parts))


def main() -> None:
    parser = argparse.ArgumentParser(description="Review Abraxos user feedback.")
    parser.add_argument(
        "--db",
        default=None,
        help="Path to the agent sqlite database. Defaults to the configured store.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="How many recent negative items to list (default 20).",
    )
    args = parser.parse_args()

    store = AgentStore(args.db) if args.db else AgentStore()
    store.initialize()
    summary = store.feedback_summary()

    _print_header("Abraxos feedback summary")
    print(f"  total: {summary['total']}")
    print(f"  up: {summary['up']}")
    print(f"  down: {summary['down']}")
    print(f"  satisfaction_ratio: {summary['satisfaction_ratio']}")

    if summary["total"] == 0:
        print()
        print("No feedback recorded yet. Wire the chat UI to POST /api/feedback")
        print("to start collecting signal from real testers.")
        return

    _print_header("Negative feedback by detected intent")
    _print_rows(
        summary["down_by_intent"],
        (("intent", "intent"), ("count", "count")),
    )

    _print_header("Negative feedback by detected language")
    _print_rows(
        summary["down_by_language"],
        (("language", "language"), ("count", "count")),
    )

    _print_header("Suggested intent corrections (from user)")
    _print_rows(
        summary["suggested_intent_corrections"],
        (("from", "from"), ("to", "to"), ("count", "count")),
    )

    _print_header(f"Most recent negative items (limit {args.limit})")
    negatives = store.list_feedback(rating="down", limit=args.limit)
    if not negatives:
        print("  (none)")
    for item in negatives:
        print(f"  [{item['created_at']}] lang={item['detected_language']} "
              f"intent={item['detected_intent']}")
        print(f"    query: {item['user_query']!r}")
        if item["reason"]:
            print(f"    reason: {item['reason']!r}")
        if item["corrected_intent"]:
            print(f"    suggested intent: {item['corrected_intent']}")

    _print_header("How to act on this")
    print("  - Intents with many down votes: review the matching prompt and rules.")
    print("  - Languages with many down votes: check the multilingual behavior.")
    print("  - Suggested intent corrections: candidates for new aliases or routing.")
    print("  - Recurring missing entities in queries: candidates for the catalog or")
    print("    the unsupported-entity registry.")


if __name__ == "__main__":
    main()
