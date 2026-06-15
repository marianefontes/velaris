"""Trigger a laboratory run immediately without waiting for the nightly schedule.

This is the manual equivalent of candidate1: it creates a run against the full
automated profile set and queues it for execution. The server must already be
running with a valid GROQ_API_KEY and RESEARCH_ADMIN_KEY.

The automated calibration cycle (00:00 candidate1, 08:00 candidate2, 16:00
candidate3) requires LABORATORY_AUTOMATION_ENABLED=1 in the server environment.
Runs created here appear in the lab UI alongside scheduled ones but are not
treated as calibration control runs; use them to get a quick quality snapshot.

Usage:
    python3 scripts/lab_trigger_now.py
    python3 scripts/lab_trigger_now.py --label "manual-baseline"
    python3 scripts/lab_trigger_now.py --url http://localhost:3333 --key secret
    python3 scripts/lab_trigger_now.py --profiles dev,designer,qa
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone

ROOT_URL_DEFAULT = "http://localhost:3333"
CASE_SET = "beatrice-core-v1"
ALL_PROFILES = [
    "dev",
    "designer",
    "product_designer",
    "qa",
    "tech_writer",
    "a11y",
    "maintainer",
    "design_system_manager",
]


def _post(url: str, payload: dict, *, key: str) -> dict:
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Research-Key": key,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        body_text = exc.read().decode(errors="replace")
        print(f"HTTP {exc.code}: {body_text}", file=sys.stderr)
        sys.exit(1)
    except urllib.error.URLError as exc:
        print(f"Connection error: {exc.reason}", file=sys.stderr)
        print("Make sure the server is running.", file=sys.stderr)
        sys.exit(1)


def main() -> None:
    parser = argparse.ArgumentParser(description="Trigger a Velaris lab run now.")
    parser.add_argument("--url", default=ROOT_URL_DEFAULT, help="Server base URL")
    parser.add_argument(
        "--key",
        default=os.environ.get("RESEARCH_ADMIN_KEY", ""),
        help="Research admin key (or set RESEARCH_ADMIN_KEY env var)",
    )
    parser.add_argument("--label", default=None, help="Version label for the run")
    parser.add_argument(
        "--profiles",
        default=",".join(ALL_PROFILES),
        help="Comma-separated profile list",
    )
    parser.add_argument(
        "--repetitions",
        type=int,
        default=1,
        help="Repetitions per case (default 1)",
    )
    args = parser.parse_args()

    if not args.key:
        print(
            "No research key. Pass --key or set RESEARCH_ADMIN_KEY.",
            file=sys.stderr,
        )
        sys.exit(1)

    profiles = [p.strip() for p in args.profiles.split(",") if p.strip()]
    label = args.label or f"manual-{datetime.now(timezone.utc).strftime('%Y-%m-%dT%H%M')}"

    endpoint = args.url.rstrip("/") + "/api/laboratory/runs"
    payload = {
        "case_set_id": CASE_SET,
        "version_label": label,
        "profiles": profiles,
        "repetitions": args.repetitions,
    }

    print(f"Triggering run: {label}")
    print(f"  endpoint : {endpoint}")
    print(f"  case_set : {CASE_SET}")
    print(f"  profiles : {', '.join(profiles)}")
    print(f"  requests : {25 * len(profiles) * args.repetitions} (25 cases)")

    run = _post(endpoint, payload, key=args.key)
    print()
    print(f"Run queued: {run['id']}")
    print(f"  status       : {run['status']}")
    print(f"  total_items  : {run['total_items']}")
    print()
    print("Track progress in the lab UI or watch server logs.")
    print("At 13 s/request this run takes roughly "
          f"{round(run['total_items'] * 13 / 60)} minutes.")


if __name__ == "__main__":
    main()
