import importlib
import os
import sys
import tempfile
import time
from pathlib import Path

from fastapi.testclient import TestClient


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))


def main() -> None:
    with tempfile.TemporaryDirectory() as directory:
        os.environ["AETHERIS_SKIP_RAG_STARTUP"] = "1"
        os.environ["RESEARCH_ADMIN_KEY"] = "laboratory-test-key"
        os.environ["STUDY_DB_PATH"] = str(Path(directory) / "study.sqlite3")
        os.environ["LABORATORY_DB_PATH"] = str(Path(directory) / "laboratory.sqlite3")
        os.environ["LABORATORY_AUTOMATION_ENABLED"] = "0"
        os.environ["GROQ_API_KEY"] = ""

        server = importlib.import_module("server")
        with TestClient(server.app) as client:
            unauthorized = client.get("/api/laboratory/runs")
            assert unauthorized.status_code == 401

            headers = {"X-Research-Key": "laboratory-test-key"}
            verified = client.post("/api/laboratory/auth/verify", headers=headers)
            assert verified.status_code == 200
            assert verified.json()["authenticated"] is True

            case_sets = client.get("/api/laboratory/case-sets", headers=headers)
            assert case_sets.status_code == 200
            assert case_sets.json()["case_sets"][0]["id"] == "beatrice-core-v1"

            invalid = client.post(
                "/api/laboratory/runs",
                headers=headers,
                json={
                    "case_set_id": "beatrice-core-v1",
                    "version_label": "invalid-profile",
                    "profiles": ["unknown"],
                    "repetitions": 1,
                },
            )
            assert invalid.status_code == 422

            invalid_repetitions = client.post(
                "/api/laboratory/runs",
                headers=headers,
                json={
                    "case_set_id": "beatrice-core-v1",
                    "version_label": "invalid-repetitions",
                    "profiles": ["designer"],
                    "repetitions": 2,
                },
            )
            assert invalid_repetitions.status_code == 422

            created = client.post(
                "/api/laboratory/runs",
                headers=headers,
                json={
                    "case_set_id": "beatrice-core-v1",
                    "version_label": "api-test",
                    "profiles": ["designer"],
                    "repetitions": 1,
                },
            )
            assert created.status_code == 200
            run_id = created.json()["id"]

            detail_body = None
            for _ in range(30):
                detail = client.get(f"/api/laboratory/runs/{run_id}", headers=headers)
                assert detail.status_code == 200
                detail_body = detail.json()
                if detail_body["status"] in {"completed", "partial", "failed", "cancelled"}:
                    break
                time.sleep(0.05)
            assert detail_body is not None
            assert detail_body["case_set_id"] == "beatrice-core-v1"
            assert detail_body["status"] == "failed"
            assert detail_body["failed_items"] == detail_body["total_items"]

            public_study = client.get("/api/study/results")
            assert public_study.status_code == 200
            assert "laboratory" not in public_study.json()

            summary = client.get("/api/laboratory/results", headers=headers)
            assert summary.status_code == 200
            assert summary.json()["run_count"] == 1
            assert summary.json()["automation"]["enabled"] is False

            snapshot = client.get("/api/laboratory/snapshot", headers=headers)
            assert snapshot.status_code == 200
            assert snapshot.json()["latest_manual"]["id"] == run_id
            assert snapshot.json()["active_calibration"]["id"] == "source-defaults"

            revision = client.get("/api/laboratory/revision", headers=headers)
            assert revision.status_code == 200
            assert revision.json()["revision"] == snapshot.json()["revision"]

            paused = client.post(
                "/api/laboratory/automation/pause",
                headers=headers,
                json={"reason": "API test"},
            )
            assert paused.status_code == 200
            assert paused.json()["paused"] is True
            automation_status = client.get(
                "/api/laboratory/automation/status",
                headers=headers,
            )
            assert automation_status.status_code == 200
            assert automation_status.json()["paused"] is True

            notifications = client.get("/api/laboratory/notifications", headers=headers)
            assert notifications.status_code == 200
            assert notifications.json()["notifications"]
            read_notifications = client.post(
                "/api/laboratory/notifications/read",
                headers=headers,
                json={"ids": []},
            )
            assert read_notifications.status_code == 200
            assert read_notifications.json()["read"] >= 1

            resumed = client.post(
                "/api/laboratory/automation/resume",
                headers=headers,
            )
            assert resumed.status_code == 200
            assert resumed.json()["paused"] is False

    print("Laboratory API checks passed.")


if __name__ == "__main__":
    main()
