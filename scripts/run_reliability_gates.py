#!/usr/bin/env python3
"""Run Abraxos reliability gates — exit 1 if any gate fails."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from agent.reliability_gates import run_reliability_gates


def main() -> int:
    payload = run_reliability_gates()
    print(json.dumps(payload, indent=2, ensure_ascii=False))
    return 0 if payload["passed"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
