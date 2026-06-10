#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def assert_absent_in_source(needles: tuple[str, ...]) -> None:
    for path in SRC.rglob("*"):
        if path.suffix not in {".ts", ".tsx", ".js", ".jsx"}:
            continue
        content = path.read_text(encoding="utf-8")
        for needle in needles:
            assert needle.lower() not in content.lower(), (
                f"Legacy execution-trace term found in {path.relative_to(ROOT)}: {needle}"
            )


def main() -> None:
    trace = read("src/beatrice/components/audit/ExecutionTrace.tsx")
    store = read("src/beatrice/stores/workspace.store.ts")
    server = read("server.py")
    runtime = read("agent/runtime.py")

    assert "Trilha de execução indisponível para esta resposta" in trace
    assert "steps.map" in trace
    assert "mergeAuditMetadata" in store
    assert "incoming.steps" in store
    assert "audit_metadata" in server
    assert "llm_composition_started" in runtime
    assert "out_of_scope_blocked" in runtime
    assert "Do not choose tools, execute actions" in runtime

    assert not (ROOT / "src/beatrice/components/reasoning/ReasoningTimeline.tsx").exists()
    assert not (ROOT / "src/beatrice/domain/reasoning/transformers.ts").exists()
    assert_absent_in_source(("Reasoning Trace", "reasoning trace"))

    print("Agent Layer contracts aligned")


if __name__ == "__main__":
    main()
