#!/usr/bin/env python3
"""Run baseline (n=25) vs expanded (n=50) laboratory evals in dense and hybrid modes.

Uses the same generation path as server._generate_laboratory_answer.
Profiles default to designer, dev, qa, a11y (4 × 50 = 200 requests cap).

Usage:
  set -a && source .env.local && set +a
  python3 scripts/run_eval_expansion_compare.py
  python3 scripts/run_eval_expansion_compare.py --profiles designer --dry-run
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
import time
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def _load_dotenv_local() -> None:
  env_path = ROOT / ".env.local"
  if not env_path.is_file():
    return
  for line in env_path.read_text(encoding="utf-8").splitlines():
    stripped = line.strip()
    if not stripped or stripped.startswith("#") or "=" not in stripped:
      continue
    key, value = stripped.split("=", 1)
    key = key.strip()
    value = value.strip().strip('"').strip("'")
    os.environ.setdefault(key, value)


_load_dotenv_local()

import chromadb

from laboratory.cases import load_case_set
from laboratory.retrieval_snapshot import capture_retrieval_snapshot
from laboratory.runner import LaboratoryRunner
from laboratory.store import LaboratoryStore
from rag.chroma_config import chroma_db_path
from rag.embedding_provider import create_embedding_provider, embedder_label

METRICS = (
    "retrieval_precision",
    "source_coverage",
    "evidence_confidence",
    "observed_correctness",
    "forbidden_claim_avoidance",
    "required_fact_coverage",
    "intent_match",
)

DEFAULT_PROFILES = ("designer", "dev", "qa", "a11y")
COLLECTION_NAME = "aetheris_design_system"


def _init_rag():
    import server as beatrice_server

    db_path = chroma_db_path()
    if not db_path.exists():
        raise SystemExit(f"ChromaDB not found at {db_path}. Run: npm run index")

    beatrice_server._chroma = chromadb.PersistentClient(path=str(db_path))
    beatrice_server._collection = beatrice_server._chroma.get_or_create_collection(
        COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"},
    )
    beatrice_server._embedder = create_embedding_provider()
    beatrice_server._rag_ready = beatrice_server._collection.count() > 0
    print(
        f"RAG ready: {beatrice_server._collection.count()} chunks, "
        f"embedder={embedder_label(beatrice_server._embedder)}"
    )
    return beatrice_server


def _distribution(case_set_id: str) -> dict[str, int]:
    """Knowledge-type distribution for reporting."""
    cases = load_case_set(case_set_id).cases

    def bucket(case) -> str:
        if case.category == "out_of_scope":
            return "out_of_scope"
        if case.category == "accessibility":
            return "accessibility_guidelines"
        if case.expected_intent == "token_lookup":
            return "tokens"
        if case.expected_intent == "pattern_guidance":
            return "patterns"
        if case.expected_intent == "design_decision":
            return "design_decisions"
        if case.expected_intent == "when_not_to_use":
            return "components_not_use"
        if case.expected_intent in {"component_guidance", "comparison_query"}:
            return "components_identify"
        return "other"

    dist: dict[str, int] = {}
    for case in cases:
        key = bucket(case)
        dist[key] = dist.get(key, 0) + 1
    return dist


async def _run_one(
    *,
    store: LaboratoryStore,
    generate,
    case_set_id: str,
    version_label: str,
    retrieval_mode: str,
    profiles: list[str],
    prompt_fingerprint: str,
    model: str,
    comparison_group_id: str | None = None,
    control_run_id: str | None = None,
) -> dict:
    import server as beatrice_server

    case_set = load_case_set(case_set_id)
    request_count = len(case_set.cases) * len(profiles)
    if request_count > 200:
        raise ValueError(
            f"{case_set_id}/{retrieval_mode}: {request_count} requests exceeds limit 200"
        )

    snapshot = capture_retrieval_snapshot(
        collection=beatrice_server._collection,
        embedder=beatrice_server._embedder,
        retrieval_mode_override=retrieval_mode,
    )
    run = store.create_run(
        case_set=case_set,
        version_label=version_label,
        profiles=profiles,
        repetitions=1,
        model=model,
        prompt_fingerprint=prompt_fingerprint,
        calibration_snapshot={},
        retrieval_snapshot=snapshot,
        comparison_group_id=comparison_group_id,
        control_run_id=control_run_id,
    )
    runner = LaboratoryRunner(
        store,
        generate,
        request_interval_seconds=float(os.environ.get("LABORATORY_REQUEST_INTERVAL_SECONDS", "1.0")),
        max_rate_limit_retries=int(os.environ.get("LABORATORY_RATE_LIMIT_RETRIES", "6")),
    )
    started = time.perf_counter()
    await runner.process(run["id"])
    elapsed = round(time.perf_counter() - started, 1)
    detail = store.get_run(run["id"])
    if not detail:
        raise RuntimeError(f"Run {run['id']} not found after processing")
    return {
        "run_id": run["id"],
        "case_set_id": case_set_id,
        "n_cases": len(case_set.cases),
        "n_items": detail["total_items"],
        "profiles": profiles,
        "retrieval_mode": snapshot.get("retrieval_mode"),
        "hybrid_effective": snapshot.get("hybrid_effective"),
        "status": detail["status"],
        "completed_items": detail["completed_items"],
        "failed_items": detail["failed_items"],
        "elapsed_seconds": elapsed,
        "aggregate": detail.get("aggregate") or {},
        "distribution": _distribution(case_set_id),
    }


def _metric_row(aggregate: dict, name: str) -> float | None:
    metrics = (aggregate or {}).get("metrics") or {}
    entry = metrics.get(name)
    if not entry:
        return None
    return entry.get("value")


async def main_async(args: argparse.Namespace) -> int:
    if args.dry_run:
        print(json.dumps({
            "profiles": list(dict.fromkeys(args.profiles)),
            "plan": [
                {
                    "case_set": cs,
                    "label": label,
                    "mode": mode,
                    "requests": len(load_case_set(cs).cases) * len(dict.fromkeys(args.profiles)),
                    "distribution": _distribution(cs),
                }
                for cs, label, mode, _, _ in [
                    ("beatrice-baseline-v1", "baseline-n25-dense", "dense", None, None),
                    ("beatrice-baseline-v1", "baseline-n25-hybrid", "hybrid", None, None),
                    ("beatrice-core-v1", "expanded-n50-dense", "dense", None, None),
                    ("beatrice-core-v1", "expanded-n50-hybrid", "hybrid", None, None),
                ]
            ],
        }, indent=2, ensure_ascii=False))
        return 0

    if not os.environ.get("GROQ_API_KEY"):
        print("GROQ_API_KEY is required (source .env.local)", file=sys.stderr)
        return 1

    beatrice_server = _init_rag()
    from server import LABORATORY_MODEL, _generate_laboratory_answer, _prompt_fingerprint

    profiles = list(dict.fromkeys(args.profiles))
    db_path = Path(args.db) if args.db else ROOT / "data" / "eval-expansion-compare.sqlite3"
    store = LaboratoryStore(db_path)
    store.initialize()

    plan = [
        ("beatrice-baseline-v1", "baseline-n25-dense", "dense", None, None),
        ("beatrice-baseline-v1", "baseline-n25-hybrid", "hybrid", None, None),
        ("beatrice-core-v1", "expanded-n50-dense", "dense", None, None),
        ("beatrice-core-v1", "expanded-n50-hybrid", "hybrid", None, None),
    ]

    results = []
    baseline_dense_id = None
    for case_set_id, label, mode, _, _ in plan:
        control = baseline_dense_id if mode == "hybrid" and "baseline" in label else (
            next((r["run_id"] for r in results if r["retrieval_mode"] == "dense" and r["case_set_id"] == case_set_id), None)
            if mode == "hybrid"
            else None
        )
        group = str(uuid.uuid4()) if mode == "dense" else None
        print(f"\n▶ {label} ({case_set_id}, {mode}) …")
        row = await _run_one(
            store=store,
            generate=_generate_laboratory_answer,
            case_set_id=case_set_id,
            version_label=label,
            retrieval_mode=mode,
            profiles=profiles,
            prompt_fingerprint=_prompt_fingerprint(),
            model=LABORATORY_MODEL,
            comparison_group_id=group,
            control_run_id=control,
        )
        results.append(row)
        if label == "baseline-n25-dense":
            baseline_dense_id = row["run_id"]
        print(f"  status={row['status']} items={row['completed_items']}/{row['n_items']} elapsed={row['elapsed_seconds']}s")

    report = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "profiles": profiles,
        "model": LABORATORY_MODEL,
        "prompt_fingerprint": _prompt_fingerprint(),
        "runs": results,
        "comparison_table": _build_table(results),
    }
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nReport written to {out}")
    _print_table(report["comparison_table"])
    return 0


def _build_table(results: list[dict]) -> list[dict]:
    by_key = {(r["case_set_id"], r["retrieval_mode"]): r for r in results}
    rows = []
    for metric in METRICS:
        row = {"metric": metric}
        for col, (cs, mode) in {
            "baseline_dense": ("beatrice-baseline-v1", "dense"),
            "baseline_hybrid": ("beatrice-baseline-v1", "hybrid"),
            "expanded_dense": ("beatrice-core-v1", "dense"),
            "expanded_hybrid": ("beatrice-core-v1", "hybrid"),
        }.items():
            run = by_key.get((cs, mode))
            row[col] = _metric_row(run["aggregate"], metric) if run else None
            if run and col.endswith("_dense"):
                row[f"{col}_n"] = run["n_cases"]
                row[f"{col}_items"] = run["n_items"]
        rows.append(row)
    return rows


def _print_table(table: list[dict]) -> None:
    cols = ["baseline_dense", "baseline_hybrid", "expanded_dense", "expanded_hybrid"]
    print("\n| Métrica | Baseline dense (n=25) | Baseline hybrid | Expandido dense (n=50) | Expandido hybrid |")
    print("|---------|------------------------:|----------------:|-----------------------:|-----------------:|")
    for row in table:
        cells = " | ".join(
            f"{row[c]:.3f}" if isinstance(row.get(c), (int, float)) else "—"
            for c in cols
        )
        print(f"| {row['metric']} | {cells} |")


def main() -> None:
    parser = argparse.ArgumentParser(description="Compare baseline vs expanded eval runs")
    parser.add_argument("--profiles", default=",".join(DEFAULT_PROFILES))
    parser.add_argument("--db", default="")
    parser.add_argument("--output", default=str(ROOT / "data" / "eval-expansion-report.json"))
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    args.profiles = [p.strip() for p in args.profiles.split(",") if p.strip()]
    raise SystemExit(asyncio.run(main_async(args)))


if __name__ == "__main__":
    main()
