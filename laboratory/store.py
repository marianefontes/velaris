from __future__ import annotations

import json
import os
import sqlite3
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from prompts.perspective_ids import CANONICAL_PERSPECTIVE_IDS, normalize_profile_id

from .calibration import source_calibration, validate_calibration
from .cases import CaseSet


DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "aetheris-laboratory.sqlite3"


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _json(value: Any) -> str:
    return json.dumps(value, ensure_ascii=True, sort_keys=True)


def _decode(value: str | None, default: Any) -> Any:
    if not value:
        return default
    try:
        return json.loads(value)
    except (TypeError, json.JSONDecodeError):
        return default


def _canonical_profile(value: object) -> str:
    raw_value = str(value).strip() if value is not None else ""
    return normalize_profile_id(raw_value, default=raw_value)


def _canonical_profiles(values: object) -> list[str]:
    if not isinstance(values, list):
        return []
    result: list[str] = []
    for value in values:
        profile = _canonical_profile(value)
        if profile and profile not in result:
            result.append(profile)
    return result


def _canonical_profile_mapping(values: object) -> dict[str, Any]:
    if not isinstance(values, dict):
        return {}
    result: dict[str, Any] = {}
    for key, value in values.items():
        profile = _canonical_profile(key)
        if profile and profile != key:
            result.setdefault(profile, value)
    for key, value in values.items():
        profile = _canonical_profile(key)
        if profile:
            result[profile] = value
    return result


class LaboratoryStore:
    def __init__(self, db_path: str | Path | None = None):
        configured = db_path or os.environ.get("LABORATORY_DB_PATH") or DEFAULT_DB_PATH
        self.db_path = Path(configured)

    def _connect(self) -> sqlite3.Connection:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.db_path, timeout=15)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                PRAGMA journal_mode = WAL;

                CREATE TABLE IF NOT EXISTS laboratory_runs (
                    id TEXT PRIMARY KEY,
                    case_set_id TEXT NOT NULL,
                    dataset_version TEXT NOT NULL,
                    dataset_fingerprint TEXT NOT NULL,
                    version_label TEXT NOT NULL,
                    profiles_json TEXT NOT NULL,
                    repetitions INTEGER NOT NULL,
                    status TEXT NOT NULL,
                    total_items INTEGER NOT NULL,
                    completed_items INTEGER NOT NULL DEFAULT 0,
                    failed_items INTEGER NOT NULL DEFAULT 0,
                    model TEXT NOT NULL,
                    prompt_fingerprint TEXT NOT NULL,
                    aggregate_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL,
                    started_at TEXT,
                    completed_at TEXT,
                    cancel_requested_at TEXT,
                    is_baseline INTEGER NOT NULL DEFAULT 0,
                    approved_at TEXT
                );

                CREATE TABLE IF NOT EXISTS laboratory_run_items (
                    id TEXT PRIMARY KEY,
                    run_id TEXT NOT NULL REFERENCES laboratory_runs(id) ON DELETE CASCADE,
                    case_id TEXT NOT NULL,
                    profile TEXT NOT NULL,
                    repetition INTEGER NOT NULL,
                    question TEXT NOT NULL,
                    category TEXT NOT NULL,
                    convergence_mode TEXT NOT NULL,
                    status TEXT NOT NULL,
                    answer_text TEXT,
                    intent TEXT,
                    cognitive_skills_json TEXT NOT NULL DEFAULT '[]',
                    evidence_metrics_json TEXT NOT NULL DEFAULT '{}',
                    audit_metadata_json TEXT NOT NULL DEFAULT '{}',
                    duration_ms INTEGER,
                    error TEXT,
                    created_at TEXT NOT NULL,
                    started_at TEXT,
                    completed_at TEXT,
                    UNIQUE(run_id, case_id, profile, repetition)
                );

                CREATE TABLE IF NOT EXISTS laboratory_item_sources (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id TEXT NOT NULL REFERENCES laboratory_run_items(id) ON DELETE CASCADE,
                    position INTEGER NOT NULL,
                    title TEXT NOT NULL,
                    source TEXT NOT NULL,
                    page_type TEXT NOT NULL,
                    similarity REAL,
                    evidence_tier TEXT,
                    retrieval_weight REAL,
                    weighted_score REAL
                );

                CREATE TABLE IF NOT EXISTS laboratory_metric_scores (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    run_id TEXT NOT NULL REFERENCES laboratory_runs(id) ON DELETE CASCADE,
                    item_id TEXT REFERENCES laboratory_run_items(id) ON DELETE CASCADE,
                    case_id TEXT,
                    profile TEXT,
                    metric_name TEXT NOT NULL,
                    value REAL,
                    status TEXT NOT NULL,
                    rationale TEXT NOT NULL,
                    evaluator_version TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS laboratory_human_reviews (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    item_id TEXT NOT NULL UNIQUE REFERENCES laboratory_run_items(id) ON DELETE CASCADE,
                    reviewer TEXT NOT NULL,
                    scores_json TEXT NOT NULL,
                    notes TEXT NOT NULL,
                    reviewed_at TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_laboratory_items_run
                ON laboratory_run_items(run_id, status);

                CREATE INDEX IF NOT EXISTS idx_laboratory_metrics_run
                ON laboratory_metric_scores(run_id, metric_name);

                CREATE TABLE IF NOT EXISTS laboratory_state (
                    id INTEGER PRIMARY KEY CHECK (id = 1),
                    revision INTEGER NOT NULL DEFAULT 0,
                    automation_paused INTEGER NOT NULL DEFAULT 0,
                    pause_reason TEXT,
                    pause_until TEXT,
                    active_calibration_version_id TEXT,
                    previous_calibration_version_id TEXT,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS laboratory_schedule_slots (
                    id TEXT PRIMARY KEY,
                    schedule_date TEXT NOT NULL,
                    slot_index INTEGER NOT NULL,
                    scheduled_for TEXT NOT NULL,
                    status TEXT NOT NULL,
                    run_id TEXT REFERENCES laboratory_runs(id),
                    reason TEXT,
                    claimed_at TEXT NOT NULL,
                    completed_at TEXT,
                    UNIQUE(schedule_date, slot_index)
                );

                CREATE TABLE IF NOT EXISTS laboratory_calibration_versions (
                    id TEXT PRIMARY KEY,
                    label TEXT NOT NULL,
                    calibration_json TEXT NOT NULL,
                    parent_version_id TEXT,
                    origin TEXT NOT NULL,
                    proposal_id TEXT,
                    created_at TEXT NOT NULL,
                    activated_at TEXT
                );

                CREATE TABLE IF NOT EXISTS laboratory_calibration_proposals (
                    id TEXT PRIMARY KEY,
                    schedule_date TEXT NOT NULL,
                    base_version_id TEXT NOT NULL,
                    proposed_version_id TEXT NOT NULL,
                    targeted_perspectives_json TEXT NOT NULL,
                    changes_json TEXT NOT NULL,
                    rationale TEXT NOT NULL,
                    status TEXT NOT NULL,
                    control_run_id TEXT,
                    experiment_run_id TEXT,
                    validation_run_id TEXT,
                    guardrails_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS laboratory_recommendations (
                    id TEXT PRIMARY KEY,
                    recommendation_type TEXT NOT NULL,
                    status TEXT NOT NULL,
                    title TEXT NOT NULL,
                    summary TEXT NOT NULL,
                    rationale TEXT NOT NULL,
                    affected_perspectives_json TEXT NOT NULL DEFAULT '[]',
                    metric_comparison_json TEXT NOT NULL DEFAULT '{}',
                    guardrails_json TEXT NOT NULL DEFAULT '{}',
                    run_id TEXT,
                    proposal_id TEXT,
                    calibration_version_id TEXT,
                    is_read INTEGER NOT NULL DEFAULT 0,
                    decided_at TEXT,
                    decision TEXT,
                    decision_notes TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS laboratory_notifications (
                    id TEXT PRIMARY KEY,
                    event_type TEXT NOT NULL,
                    title TEXT NOT NULL,
                    body TEXT NOT NULL,
                    run_id TEXT,
                    recommendation_id TEXT,
                    deduplication_key TEXT UNIQUE,
                    created_at TEXT NOT NULL,
                    read_at TEXT
                );

                CREATE TABLE IF NOT EXISTS laboratory_audit_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_type TEXT NOT NULL,
                    actor TEXT NOT NULL,
                    metadata_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_laboratory_recommendations_created
                ON laboratory_recommendations(created_at DESC);

                CREATE INDEX IF NOT EXISTS idx_laboratory_notifications_created
                ON laboratory_notifications(created_at DESC);
                """
            )
            self._ensure_column(
                connection,
                "laboratory_runs",
                "origin",
                "TEXT NOT NULL DEFAULT 'manual'",
            )
            self._ensure_column(connection, "laboratory_runs", "schedule_date", "TEXT")
            self._ensure_column(connection, "laboratory_runs", "schedule_slot", "INTEGER")
            self._ensure_column(connection, "laboratory_runs", "calibration_version_id", "TEXT")
            self._ensure_column(connection, "laboratory_runs", "calibration_proposal_id", "TEXT")
            self._ensure_column(
                connection,
                "laboratory_runs",
                "calibration_snapshot_json",
                "TEXT NOT NULL DEFAULT '{}'",
            )
            self._ensure_column(connection, "laboratory_runs", "control_run_id", "TEXT")
            self._ensure_column(
                connection,
                "laboratory_runs",
                "prompt_tokens",
                "INTEGER NOT NULL DEFAULT 0",
            )
            self._ensure_column(
                connection,
                "laboratory_runs",
                "completion_tokens",
                "INTEGER NOT NULL DEFAULT 0",
            )
            self._ensure_column(connection, "laboratory_run_items", "error_category", "TEXT")
            self._ensure_column(
                connection,
                "laboratory_run_items",
                "audit_metadata_json",
                "TEXT NOT NULL DEFAULT '{}'",
            )
            self._ensure_column(
                connection,
                "laboratory_run_items",
                "retry_count",
                "INTEGER NOT NULL DEFAULT 0",
            )
            self._ensure_column(connection, "laboratory_run_items", "retry_after", "TEXT")
            self._ensure_column(connection, "laboratory_item_sources", "evidence_tier", "TEXT")
            now = _now()
            defaults = source_calibration()
            connection.execute(
                """
                INSERT OR IGNORE INTO laboratory_calibration_versions (
                    id, label, calibration_json, origin, created_at, activated_at
                ) VALUES ('source-defaults', 'Source defaults', ?, 'source-defaults', ?, ?)
                """,
                (_json(defaults), now, now),
            )
            connection.execute(
                """
                INSERT OR IGNORE INTO laboratory_state (
                    id, revision, automation_paused, active_calibration_version_id, updated_at
                ) VALUES (1, 0, 0, 'source-defaults', ?)
                """,
                (now,),
            )
            connection.execute(
                """
                UPDATE laboratory_state
                SET active_calibration_version_id = COALESCE(
                    active_calibration_version_id, 'source-defaults'
                )
                WHERE id = 1
                """
            )

    @staticmethod
    def _ensure_column(
        connection: sqlite3.Connection,
        table: str,
        column: str,
        definition: str,
    ) -> None:
        columns = {
            str(row["name"])
            for row in connection.execute(f"PRAGMA table_info({table})").fetchall()
        }
        if column not in columns:
            connection.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")

    @staticmethod
    def _bump_revision(connection: sqlite3.Connection) -> int:
        now = _now()
        connection.execute(
            """
            UPDATE laboratory_state
            SET revision = revision + 1, updated_at = ?
            WHERE id = 1
            """,
            (now,),
        )
        row = connection.execute(
            "SELECT revision FROM laboratory_state WHERE id = 1"
        ).fetchone()
        return int(row["revision"])

    def interrupt_running_runs(self) -> int:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_runs
                SET status = 'interrupted', completed_at = ?
                WHERE status IN ('queued', 'running')
                """,
                (_now(),),
            )
            connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'interrupted', completed_at = ?
                WHERE status IN ('running', 'waiting_rate_limit')
                """,
                (_now(),),
            )
            if cursor.rowcount:
                self._bump_revision(connection)
            return cursor.rowcount

    def create_run(
        self,
        *,
        case_set: CaseSet,
        version_label: str,
        profiles: list[str],
        repetitions: int,
        model: str,
        prompt_fingerprint: str,
        origin: str = "manual",
        schedule_date: str | None = None,
        schedule_slot: int | None = None,
        calibration_version_id: str | None = None,
        calibration_proposal_id: str | None = None,
        calibration_snapshot: dict[str, dict[str, float]] | None = None,
        control_run_id: str | None = None,
    ) -> dict[str, Any]:
        canonical_profiles = _canonical_profiles(profiles)
        invalid_profiles = [
            str(profile)
            for profile in profiles
            if normalize_profile_id(profile, default="") not in CANONICAL_PERSPECTIVE_IDS
        ]
        if invalid_profiles:
            raise ValueError(
                f"Unknown laboratory profiles: {', '.join(invalid_profiles)}"
            )
        if not canonical_profiles:
            raise ValueError("At least one laboratory profile is required")

        profiles = canonical_profiles
        run_id = str(uuid.uuid4())
        created_at = _now()
        total_items = len(case_set.cases) * len(profiles) * repetitions
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO laboratory_runs (
                    id, case_set_id, dataset_version, dataset_fingerprint,
                    version_label, profiles_json, repetitions, status,
                    total_items, model, prompt_fingerprint, created_at, origin,
                    schedule_date, schedule_slot, calibration_version_id,
                    calibration_proposal_id, calibration_snapshot_json, control_run_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    run_id,
                    case_set.id,
                    case_set.version,
                    case_set.fingerprint,
                    version_label,
                    _json(profiles),
                    repetitions,
                    total_items,
                    model,
                    prompt_fingerprint,
                    created_at,
                    origin,
                    schedule_date,
                    schedule_slot,
                    calibration_version_id,
                    calibration_proposal_id,
                    _json(calibration_snapshot or {}),
                    control_run_id,
                ),
            )
            for case in case_set.cases:
                for profile in profiles:
                    for repetition in range(1, repetitions + 1):
                        connection.execute(
                            """
                            INSERT INTO laboratory_run_items (
                                id, run_id, case_id, profile, repetition, question,
                                category, convergence_mode, status, created_at
                            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?)
                            """,
                            (
                                str(uuid.uuid4()),
                                run_id,
                                case.id,
                                profile,
                                repetition,
                                case.question,
                                case.category,
                                case.convergence,
                                created_at,
                            ),
                        )
            self._bump_revision(connection)
        return self.get_run(run_id, include_items=False) or {}

    def start_run(self, run_id: str) -> None:
        with self._connect() as connection:
            connection.execute(
                """
                UPDATE laboratory_runs
                SET status = 'running', started_at = COALESCE(started_at, ?)
                WHERE id = ? AND status = 'queued'
                """,
                (_now(), run_id),
            )
            self._bump_revision(connection)

    def next_queued_item(self, run_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT item.*, run.calibration_snapshot_json,
                       run.calibration_version_id, run.calibration_proposal_id
                FROM laboratory_run_items item
                JOIN laboratory_runs run ON run.id = item.run_id
                WHERE item.run_id = ? AND item.status = 'queued'
                  AND run.cancel_requested_at IS NULL
                ORDER BY item.created_at, item.case_id, item.profile, item.repetition
                LIMIT 1
                """,
                (run_id,),
            ).fetchone()
            if not row:
                return None
            started_at = _now()
            connection.execute(
                "UPDATE laboratory_run_items SET status = 'running', started_at = ? WHERE id = ?",
                (started_at, row["id"]),
            )
            item = dict(row)
            item["calibration_snapshot"] = _decode(
                item.pop("calibration_snapshot_json", "{}"),
                {},
            )
            item["calibration_snapshot"] = _canonical_profile_mapping(
                item["calibration_snapshot"]
            )
            item["profile"] = _canonical_profile(item["profile"])
            item["status"] = "running"
            item["started_at"] = started_at
            self._bump_revision(connection)
            return item

    def defer_item_for_rate_limit(
        self,
        item_id: str,
        error: str,
        *,
        retry_after: str,
    ) -> int:
        with self._connect() as connection:
            item = connection.execute(
                "SELECT run_id, retry_count FROM laboratory_run_items WHERE id = ?",
                (item_id,),
            ).fetchone()
            if not item:
                return 0
            retry_count = int(item["retry_count"] or 0) + 1
            connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'waiting_rate_limit', error = ?,
                    error_category = 'rate_limit', retry_count = ?,
                    retry_after = ?, completed_at = NULL
                WHERE id = ?
                """,
                (error[:1000], retry_count, retry_after, item_id),
            )
            self._bump_revision(connection)
            return retry_count

    def resume_rate_limited_item(self, item_id: str) -> None:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'running', error = NULL, error_category = NULL,
                    retry_after = NULL
                WHERE id = ? AND status = 'waiting_rate_limit'
                """,
                (item_id,),
            )
            if cursor.rowcount:
                self._bump_revision(connection)

    def cancel_active_item(self, item_id: str) -> None:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'cancelled', error = 'Execução cancelada antes da resposta.',
                    error_category = NULL, retry_after = NULL, completed_at = ?
                WHERE id = ? AND status IN ('running', 'waiting_rate_limit')
                """,
                (_now(), item_id),
            )
            if cursor.rowcount:
                self._bump_revision(connection)

    def complete_item(
        self,
        item_id: str,
        *,
        answer_text: str,
        intent: str,
        cognitive_skills: list[dict[str, Any]],
        evidence_metrics: dict[str, Any],
        audit_metadata: dict[str, Any],
        sources: list[dict[str, Any]],
        metrics: dict[str, dict[str, Any]],
        duration_ms: int,
        prompt_tokens: int = 0,
        completion_tokens: int = 0,
    ) -> None:
        completed_at = _now()
        with self._connect() as connection:
            item = connection.execute(
                "SELECT run_id, case_id, profile FROM laboratory_run_items WHERE id = ?",
                (item_id,),
            ).fetchone()
            if not item:
                raise ValueError("Laboratory item not found")
            profile = _canonical_profile(item["profile"])
            connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'completed', answer_text = ?, intent = ?,
                    cognitive_skills_json = ?, evidence_metrics_json = ?,
                    audit_metadata_json = ?,
                    duration_ms = ?, error = NULL, error_category = NULL,
                    retry_after = NULL, completed_at = ?
                WHERE id = ?
                """,
                (
                    answer_text,
                    intent,
                    _json(cognitive_skills),
                    _json(evidence_metrics),
                    _json(audit_metadata),
                    duration_ms,
                    completed_at,
                    item_id,
                ),
            )
            connection.execute(
                "DELETE FROM laboratory_item_sources WHERE item_id = ?",
                (item_id,),
            )
            for position, source in enumerate(sources, start=1):
                connection.execute(
                    """
                    INSERT INTO laboratory_item_sources (
                        item_id, position, title, source, page_type, similarity,
                        evidence_tier, retrieval_weight, weighted_score
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        item_id,
                        position,
                        str(source.get("title", "")),
                        str(source.get("source", "")),
                        str(source.get("page_type", "")),
                        source.get("similarity"),
                        str(source.get("evidence_tier", "")),
                        source.get("retrieval_weight"),
                        source.get("weighted_score"),
                    ),
                )
            connection.execute(
                "DELETE FROM laboratory_metric_scores WHERE item_id = ?",
                (item_id,),
            )
            for name, metric in metrics.items():
                connection.execute(
                    """
                    INSERT INTO laboratory_metric_scores (
                        run_id, item_id, case_id, profile, metric_name, value,
                        status, rationale, evaluator_version, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'deterministic-v1', ?)
                    """,
                    (
                        item["run_id"],
                        item_id,
                        item["case_id"],
                        profile,
                        name,
                        metric.get("value"),
                        metric["status"],
                        metric["rationale"],
                        completed_at,
                    ),
                )
            self._refresh_counts(connection, item["run_id"])
            connection.execute(
                """
                UPDATE laboratory_runs
                SET prompt_tokens = prompt_tokens + ?,
                    completion_tokens = completion_tokens + ?
                WHERE id = ?
                """,
                (max(0, prompt_tokens), max(0, completion_tokens), item["run_id"]),
            )
            self._bump_revision(connection)

    def fail_item(
        self,
        item_id: str,
        error: str,
        *,
        duration_ms: int = 0,
        error_category: str | None = None,
    ) -> None:
        with self._connect() as connection:
            item = connection.execute(
                "SELECT run_id FROM laboratory_run_items WHERE id = ?",
                (item_id,),
            ).fetchone()
            if not item:
                return
            connection.execute(
                """
                UPDATE laboratory_run_items
                SET status = 'failed', error = ?, error_category = ?,
                    duration_ms = ?, retry_after = NULL, completed_at = ?
                WHERE id = ?
                """,
                (error[:1000], error_category, duration_ms, _now(), item_id),
            )
            self._refresh_counts(connection, item["run_id"])
            self._bump_revision(connection)

    def _refresh_counts(self, connection: sqlite3.Connection, run_id: str) -> None:
        counts = connection.execute(
            """
            SELECT
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed
            FROM laboratory_run_items
            WHERE run_id = ?
            """,
            (run_id,),
        ).fetchone()
        connection.execute(
            """
            UPDATE laboratory_runs
            SET completed_items = ?, failed_items = ?
            WHERE id = ?
            """,
            (int(counts["completed"] or 0), int(counts["failed"] or 0), run_id),
        )

    def is_cancel_requested(self, run_id: str) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT cancel_requested_at FROM laboratory_runs WHERE id = ?",
                (run_id,),
            ).fetchone()
        return bool(row and row["cancel_requested_at"])

    def request_cancel(self, run_id: str) -> bool:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_runs
                SET cancel_requested_at = ?
                WHERE id = ? AND status IN ('queued', 'running')
                """,
                (_now(), run_id),
            )
            if cursor.rowcount:
                self._bump_revision(connection)
            return cursor.rowcount > 0

    def successful_items(self, run_id: str) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT id, case_id, profile, repetition, answer_text
                FROM laboratory_run_items
                WHERE run_id = ? AND status = 'completed'
                """,
                (run_id,),
            ).fetchall()
        items = [dict(row) for row in rows]
        for item in items:
            item["profile"] = _canonical_profile(item["profile"])
        return items

    def replace_relational_metrics(self, run_id: str, metrics: list[dict[str, Any]]) -> None:
        created_at = _now()
        with self._connect() as connection:
            connection.execute(
                """
                DELETE FROM laboratory_metric_scores
                WHERE run_id = ? AND item_id IS NULL
                """,
                (run_id,),
            )
            for metric in metrics:
                connection.execute(
                    """
                    INSERT INTO laboratory_metric_scores (
                        run_id, item_id, case_id, profile, metric_name, value,
                        status, rationale, evaluator_version, created_at
                    ) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 'relational-v1', ?)
                    """,
                    (
                        run_id,
                        metric.get("case_id"),
                        (
                            _canonical_profile(metric.get("profile"))
                            if metric.get("profile") is not None
                            else None
                        ),
                        metric["metric_name"],
                        metric.get("value"),
                        metric["status"],
                        metric["rationale"],
                        created_at,
                    ),
                )
            self._bump_revision(connection)

    def finalize_run(self, run_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            run = connection.execute(
                "SELECT * FROM laboratory_runs WHERE id = ?",
                (run_id,),
            ).fetchone()
            if not run:
                return None
            counts = connection.execute(
                """
                SELECT
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
                    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) AS failed
                FROM laboratory_run_items
                WHERE run_id = ?
                """,
                (run_id,),
            ).fetchone()
            completed = int(counts["completed"] or 0)
            failed = int(counts["failed"] or 0)
            if run["cancel_requested_at"]:
                status = "cancelled"
            elif completed == 0 and failed > 0:
                status = "failed"
            elif failed > 0:
                status = "partial"
            else:
                status = "completed"
            aggregate = self._aggregate_metrics(connection, run_id)
            connection.execute(
                """
                UPDATE laboratory_runs
                SET status = ?, completed_items = ?, failed_items = ?,
                    aggregate_json = ?, completed_at = ?
                WHERE id = ?
                """,
                (status, completed, failed, _json(aggregate), _now(), run_id),
            )
            self._bump_revision(connection)
        return self.get_run(run_id, include_items=False)

    def _aggregate_metrics(self, connection: sqlite3.Connection, run_id: str) -> dict[str, Any]:
        rows = connection.execute(
            """
            SELECT metric_name, AVG(value) AS mean_value, COUNT(value) AS samples
            FROM laboratory_metric_scores
            WHERE run_id = ? AND value IS NOT NULL
              AND status IN ('measured', 'provisional', 'human-reviewed')
            GROUP BY metric_name
            """,
            (run_id,),
        ).fetchall()
        metrics = {
            row["metric_name"]: {
                "value": round(float(row["mean_value"]), 3),
                "samples": int(row["samples"]),
            }
            for row in rows
        }
        primary = [
            metrics[name]["value"]
            for name in (
                "observed_correctness",
                "source_coverage",
                "perspective_signal",
                "repeat_stability",
                "factual_convergence",
                "principled_divergence",
                "factual_correctness",
                "source_fidelity",
                "perspective_adherence",
                "usefulness",
            )
            if name in metrics
        ]
        return {
            "score": round(sum(primary) / len(primary), 3) if primary else None,
            "metrics": metrics,
            "confidence_calibration": self._confidence_calibration(connection, run_id),
        }

    def _confidence_calibration(self, connection: sqlite3.Connection, run_id: str) -> dict[str, Any]:
        rows = connection.execute(
            """
            SELECT correctness.value AS correctness, confidence.value AS confidence
            FROM laboratory_metric_scores correctness
            JOIN laboratory_metric_scores confidence
              ON confidence.item_id = correctness.item_id
            WHERE correctness.run_id = ?
              AND correctness.metric_name = 'factual_correctness'
              AND correctness.status = 'human-reviewed'
              AND confidence.metric_name = 'evidence_confidence'
              AND confidence.value IS NOT NULL
            """,
            (run_id,),
        ).fetchall()
        if len(rows) < 5:
            return {
                "status": "insufficient-data",
                "ece": None,
                "samples": len(rows),
                "reason": "ECE requires at least 5 human-reviewed correctness samples",
            }

        bins: list[list[tuple[float, float]]] = [[] for _ in range(5)]
        for row in rows:
            confidence = max(0.0, min(1.0, float(row["confidence"])))
            correctness = max(0.0, min(1.0, float(row["correctness"])))
            bins[min(int(confidence * 5), 4)].append((confidence, correctness))

        total = len(rows)
        ece = 0.0
        for bucket in bins:
            if not bucket:
                continue
            mean_confidence = sum(pair[0] for pair in bucket) / len(bucket)
            mean_correctness = sum(pair[1] for pair in bucket) / len(bucket)
            ece += (len(bucket) / total) * abs(mean_correctness - mean_confidence)
        return {
            "status": "measured",
            "ece": round(ece, 3),
            "samples": total,
            "reason": "Expected Calibration Error across 5 confidence bins",
        }

    def list_runs(self, *, limit: int = 30) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM laboratory_runs
                ORDER BY created_at DESC
                LIMIT ?
                """,
                (max(1, min(limit, 100)),),
            ).fetchall()
        return [self._serialize_run(dict(row)) for row in rows]

    def get_run(self, run_id: str, *, include_items: bool = True) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_runs WHERE id = ?",
                (run_id,),
            ).fetchone()
            if not row:
                return None
            result = self._serialize_run(dict(row))
            if include_items:
                item_rows = connection.execute(
                    """
                    SELECT * FROM laboratory_run_items
                    WHERE run_id = ?
                    ORDER BY case_id, profile, repetition
                    """,
                    (run_id,),
                ).fetchall()
                result["items"] = [
                    self._serialize_item(connection, dict(item))
                    for item in item_rows
                ]
            return result

    def _serialize_run(self, run: dict[str, Any]) -> dict[str, Any]:
        run["profiles"] = _canonical_profiles(
            _decode(run.pop("profiles_json"), [])
        )
        run["aggregate"] = _decode(run.pop("aggregate_json"), {})
        run["calibration_snapshot"] = _canonical_profile_mapping(
            _decode(
                run.pop("calibration_snapshot_json", "{}"),
                {},
            )
        )
        run["is_baseline"] = bool(run["is_baseline"])
        progress_count = int(run["completed_items"]) + int(run["failed_items"])
        run["progress"] = round(progress_count / run["total_items"], 3) if run["total_items"] else 0
        return run

    def _serialize_item(self, connection: sqlite3.Connection, item: dict[str, Any]) -> dict[str, Any]:
        item["profile"] = _canonical_profile(item["profile"])
        item["cognitive_skills"] = _decode(item.pop("cognitive_skills_json"), [])
        item["evidence_metrics"] = _decode(item.pop("evidence_metrics_json"), {})
        item["audit_metadata"] = _decode(item.pop("audit_metadata_json", "{}"), {})
        sources = connection.execute(
            """
            SELECT position, title, source, page_type, similarity, evidence_tier,
                   retrieval_weight, weighted_score
            FROM laboratory_item_sources
            WHERE item_id = ?
            ORDER BY position
            """,
            (item["id"],),
        ).fetchall()
        metrics = connection.execute(
            """
            SELECT metric_name, value, status, rationale, evaluator_version
            FROM laboratory_metric_scores
            WHERE item_id = ?
            ORDER BY metric_name
            """,
            (item["id"],),
        ).fetchall()
        review = connection.execute(
            """
            SELECT reviewer, scores_json, notes, reviewed_at
            FROM laboratory_human_reviews
            WHERE item_id = ?
            """,
            (item["id"],),
        ).fetchone()
        item["sources"] = [dict(row) for row in sources]
        item["metrics"] = [dict(row) for row in metrics]
        item["review"] = (
            {
                **dict(review),
                "scores": _decode(review["scores_json"], {}),
            }
            if review
            else None
        )
        if item["review"]:
            item["review"].pop("scores_json", None)
        return item

    def set_baseline(self, run_id: str) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT status FROM laboratory_runs WHERE id = ?",
                (run_id,),
            ).fetchone()
            if not row or row["status"] != "completed":
                return False
            connection.execute("UPDATE laboratory_runs SET is_baseline = 0")
            connection.execute(
                "UPDATE laboratory_runs SET is_baseline = 1 WHERE id = ?",
                (run_id,),
            )
            self._bump_revision(connection)
            return True

    def save_review(
        self,
        item_id: str,
        *,
        reviewer: str,
        scores: dict[str, float],
        notes: str,
    ) -> bool:
        reviewed_at = _now()
        with self._connect() as connection:
            item = connection.execute(
                "SELECT run_id, case_id, profile FROM laboratory_run_items WHERE id = ?",
                (item_id,),
            ).fetchone()
            if not item:
                return False
            profile = _canonical_profile(item["profile"])
            connection.execute(
                """
                INSERT INTO laboratory_human_reviews (
                    item_id, reviewer, scores_json, notes, reviewed_at
                ) VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(item_id) DO UPDATE SET
                    reviewer = excluded.reviewer,
                    scores_json = excluded.scores_json,
                    notes = excluded.notes,
                    reviewed_at = excluded.reviewed_at
                """,
                (item_id, reviewer, _json(scores), notes, reviewed_at),
            )
            for metric_name, value in scores.items():
                connection.execute(
                    """
                    DELETE FROM laboratory_metric_scores
                    WHERE item_id = ? AND metric_name = ? AND evaluator_version = 'human-v1'
                    """,
                    (item_id, metric_name),
                )
                connection.execute(
                    """
                    INSERT INTO laboratory_metric_scores (
                        run_id, item_id, case_id, profile, metric_name, value,
                        status, rationale, evaluator_version, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, 'human-reviewed', ?, 'human-v1', ?)
                    """,
                    (
                        item["run_id"],
                        item_id,
                        item["case_id"],
                        profile,
                        metric_name,
                        value,
                        f"Human review by {reviewer}",
                        reviewed_at,
                    ),
                )
            aggregate = self._aggregate_metrics(connection, item["run_id"])
            connection.execute(
                "UPDATE laboratory_runs SET aggregate_json = ? WHERE id = ?",
                (_json(aggregate), item["run_id"]),
            )
            self._bump_revision(connection)
            return True

    def current_revision(self) -> int:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT revision FROM laboratory_state WHERE id = 1"
            ).fetchone()
        return int(row["revision"] if row else 0)

    def automation_state(self) -> dict[str, Any]:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_state WHERE id = 1"
            ).fetchone()
        if not row:
            return {
                "revision": 0,
                "paused": False,
                "pause_reason": None,
                "pause_until": None,
                "active_calibration_version_id": "source-defaults",
                "previous_calibration_version_id": None,
            }
        state = dict(row)
        state.pop("id", None)
        state["paused"] = bool(state.pop("automation_paused"))
        return state

    def set_automation_pause(
        self,
        paused: bool,
        *,
        reason: str | None = None,
        pause_until: str | None = None,
        actor: str = "admin",
    ) -> int:
        with self._connect() as connection:
            connection.execute(
                """
                UPDATE laboratory_state
                SET automation_paused = ?, pause_reason = ?, pause_until = ?, updated_at = ?
                WHERE id = 1
                """,
                (1 if paused else 0, reason if paused else None, pause_until if paused else None, _now()),
            )
            self._audit(
                connection,
                "automation_paused" if paused else "automation_resumed",
                actor,
                {"reason": reason, "pause_until": pause_until},
            )
            return self._bump_revision(connection)

    def calibration_version(self, version_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_calibration_versions WHERE id = ?",
                (version_id,),
            ).fetchone()
        return self._serialize_calibration_version(dict(row)) if row else None

    def active_calibration(self) -> dict[str, Any]:
        state = self.automation_state()
        version = self.calibration_version(
            state.get("active_calibration_version_id") or "source-defaults"
        )
        if version:
            return version
        fallback = self.calibration_version("source-defaults")
        if fallback:
            return fallback
        return {
            "id": "source-defaults",
            "label": "Source defaults",
            "calibration": source_calibration(),
            "origin": "source-defaults",
        }

    @staticmethod
    def _serialize_calibration_version(row: dict[str, Any]) -> dict[str, Any]:
        row["calibration"] = _canonical_profile_mapping(
            _decode(row.pop("calibration_json"), {})
        )
        return row

    def create_calibration_version(
        self,
        *,
        calibration: dict[str, dict[str, float]],
        label: str,
        parent_version_id: str,
        origin: str,
        proposal_id: str | None = None,
        version_id: str | None = None,
    ) -> dict[str, Any]:
        validated = validate_calibration(calibration)
        version_id = version_id or str(uuid.uuid4())
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO laboratory_calibration_versions (
                    id, label, calibration_json, parent_version_id, origin,
                    proposal_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    version_id,
                    label,
                    _json(validated),
                    parent_version_id,
                    origin,
                    proposal_id,
                    _now(),
                ),
            )
            self._bump_revision(connection)
        return self.calibration_version(version_id) or {}

    def activate_calibration(
        self,
        version_id: str,
        *,
        actor: str,
        reason: str,
    ) -> bool:
        with self._connect() as connection:
            version = connection.execute(
                "SELECT id FROM laboratory_calibration_versions WHERE id = ?",
                (version_id,),
            ).fetchone()
            if not version:
                return False
            state = connection.execute(
                "SELECT active_calibration_version_id FROM laboratory_state WHERE id = 1"
            ).fetchone()
            previous = state["active_calibration_version_id"] if state else None
            connection.execute(
                """
                UPDATE laboratory_state
                SET previous_calibration_version_id = active_calibration_version_id,
                    active_calibration_version_id = ?, updated_at = ?
                WHERE id = 1
                """,
                (version_id, _now()),
            )
            connection.execute(
                """
                UPDATE laboratory_calibration_versions
                SET activated_at = COALESCE(activated_at, ?)
                WHERE id = ?
                """,
                (_now(), version_id),
            )
            self._audit(
                connection,
                "calibration_promoted",
                actor,
                {"from": previous, "to": version_id, "reason": reason},
            )
            self._bump_revision(connection)
            return True

    def rollback_calibration(
        self,
        *,
        actor: str,
        reason: str,
        target_version_id: str | None = None,
    ) -> dict[str, Any] | None:
        with self._connect() as connection:
            state = connection.execute(
                "SELECT * FROM laboratory_state WHERE id = 1"
            ).fetchone()
            if not state:
                return None
            target = target_version_id or state["previous_calibration_version_id"]
            if not target or target == state["active_calibration_version_id"]:
                return None
            exists = connection.execute(
                "SELECT id FROM laboratory_calibration_versions WHERE id = ?",
                (target,),
            ).fetchone()
            if not exists:
                return None
            previous_active = state["active_calibration_version_id"]
            connection.execute(
                """
                UPDATE laboratory_state
                SET active_calibration_version_id = ?,
                    previous_calibration_version_id = ?,
                    updated_at = ?
                WHERE id = 1
                """,
                (target, previous_active, _now()),
            )
            self._audit(
                connection,
                "calibration_rolled_back",
                actor,
                {"from": previous_active, "to": target, "reason": reason},
            )
            self._bump_revision(connection)
        return self.calibration_version(target)

    def claim_schedule_slot(
        self,
        *,
        schedule_date: str,
        slot_index: int,
        scheduled_for: str,
    ) -> dict[str, Any] | None:
        slot_id = str(uuid.uuid4())
        with self._connect() as connection:
            try:
                connection.execute(
                    """
                    INSERT INTO laboratory_schedule_slots (
                        id, schedule_date, slot_index, scheduled_for, status, claimed_at
                    ) VALUES (?, ?, ?, ?, 'claimed', ?)
                    """,
                    (slot_id, schedule_date, slot_index, scheduled_for, _now()),
                )
            except sqlite3.IntegrityError:
                return None
            self._bump_revision(connection)
        return self.get_schedule_slot(schedule_date, slot_index)

    def get_schedule_slot(self, schedule_date: str, slot_index: int) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT * FROM laboratory_schedule_slots
                WHERE schedule_date = ? AND slot_index = ?
                """,
                (schedule_date, slot_index),
            ).fetchone()
        return dict(row) if row else None

    def list_schedule_slots(self, schedule_date: str) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM laboratory_schedule_slots
                WHERE schedule_date = ?
                ORDER BY slot_index
                """,
                (schedule_date,),
            ).fetchall()
        return [dict(row) for row in rows]

    def update_schedule_slot(
        self,
        *,
        schedule_date: str,
        slot_index: int,
        status: str,
        run_id: str | None = None,
        reason: str | None = None,
    ) -> bool:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_schedule_slots
                SET status = ?, run_id = COALESCE(?, run_id), reason = ?,
                    completed_at = CASE
                        WHEN ? IN ('completed', 'failed', 'skipped') THEN ?
                        ELSE completed_at
                    END
                WHERE schedule_date = ? AND slot_index = ?
                """,
                (
                    status,
                    run_id,
                    reason,
                    status,
                    _now(),
                    schedule_date,
                    slot_index,
                ),
            )
            if not cursor.rowcount:
                return False
            self._bump_revision(connection)
            return True

    def has_active_run(self) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT COUNT(*) AS count FROM laboratory_runs
                WHERE status IN ('queued', 'running')
                """
            ).fetchone()
        return bool(row and int(row["count"]))

    def create_proposal(
        self,
        *,
        schedule_date: str,
        base_version_id: str,
        proposed_version_id: str,
        targeted_perspectives: list[str],
        changes: list[dict[str, Any]],
        rationale: str,
        control_run_id: str,
        proposal_id: str | None = None,
    ) -> dict[str, Any]:
        proposal_id = proposal_id or str(uuid.uuid4())
        now = _now()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO laboratory_calibration_proposals (
                    id, schedule_date, base_version_id, proposed_version_id,
                    targeted_perspectives_json, changes_json, rationale, status,
                    control_run_id, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'proposed', ?, ?, ?)
                """,
                (
                    proposal_id,
                    schedule_date,
                    base_version_id,
                    proposed_version_id,
                    _json(targeted_perspectives),
                    _json(changes),
                    rationale,
                    control_run_id,
                    now,
                    now,
                ),
            )
            self._bump_revision(connection)
        return self.get_proposal(proposal_id) or {}

    def get_proposal(self, proposal_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_calibration_proposals WHERE id = ?",
                (proposal_id,),
            ).fetchone()
        return self._serialize_proposal(dict(row)) if row else None

    def proposal_for_date(self, schedule_date: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT * FROM laboratory_calibration_proposals
                WHERE schedule_date = ?
                ORDER BY created_at DESC LIMIT 1
                """,
                (schedule_date,),
            ).fetchone()
        return self._serialize_proposal(dict(row)) if row else None

    @staticmethod
    def _serialize_proposal(row: dict[str, Any]) -> dict[str, Any]:
        row["targeted_perspectives"] = _canonical_profiles(
            _decode(
                row.pop("targeted_perspectives_json"),
                [],
            )
        )
        row["changes"] = _decode(row.pop("changes_json"), [])
        for change in row["changes"]:
            if isinstance(change, dict) and "profile" in change:
                change["profile"] = _canonical_profile(change["profile"])
        row["guardrails"] = _decode(row.pop("guardrails_json"), {})
        return row

    def update_proposal(
        self,
        proposal_id: str,
        *,
        status: str | None = None,
        experiment_run_id: str | None = None,
        validation_run_id: str | None = None,
        guardrails: dict[str, Any] | None = None,
    ) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_calibration_proposals WHERE id = ?",
                (proposal_id,),
            ).fetchone()
            if not row:
                return False
            connection.execute(
                """
                UPDATE laboratory_calibration_proposals
                SET status = ?, experiment_run_id = ?, validation_run_id = ?,
                    guardrails_json = ?, updated_at = ?
                WHERE id = ?
                """,
                (
                    status or row["status"],
                    experiment_run_id or row["experiment_run_id"],
                    validation_run_id or row["validation_run_id"],
                    _json(guardrails) if guardrails is not None else row["guardrails_json"],
                    _now(),
                    proposal_id,
                ),
            )
            self._bump_revision(connection)
            return True

    def create_recommendation(
        self,
        *,
        recommendation_type: str,
        status: str,
        title: str,
        summary: str,
        rationale: str,
        affected_perspectives: list[str] | None = None,
        metric_comparison: dict[str, Any] | None = None,
        guardrails: dict[str, Any] | None = None,
        run_id: str | None = None,
        proposal_id: str | None = None,
        calibration_version_id: str | None = None,
    ) -> dict[str, Any]:
        recommendation_id = str(uuid.uuid4())
        now = _now()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO laboratory_recommendations (
                    id, recommendation_type, status, title, summary, rationale,
                    affected_perspectives_json, metric_comparison_json,
                    guardrails_json, run_id, proposal_id, calibration_version_id,
                    created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    recommendation_id,
                    recommendation_type,
                    status,
                    title,
                    summary,
                    rationale,
                    _json(affected_perspectives or []),
                    _json(metric_comparison or {}),
                    _json(guardrails or {}),
                    run_id,
                    proposal_id,
                    calibration_version_id,
                    now,
                    now,
                ),
            )
            self._bump_revision(connection)
        return self.get_recommendation(recommendation_id) or {}

    def get_recommendation(self, recommendation_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_recommendations WHERE id = ?",
                (recommendation_id,),
            ).fetchone()
        return self._serialize_recommendation(dict(row)) if row else None

    def list_recommendations(self, *, limit: int = 50) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM laboratory_recommendations
                ORDER BY created_at DESC LIMIT ?
                """,
                (max(1, min(limit, 100)),),
            ).fetchall()
        return [self._serialize_recommendation(dict(row)) for row in rows]

    @staticmethod
    def _serialize_recommendation(row: dict[str, Any]) -> dict[str, Any]:
        row["affected_perspectives"] = _canonical_profiles(
            _decode(
                row.pop("affected_perspectives_json"),
                [],
            )
        )
        row["metric_comparison"] = _decode(row.pop("metric_comparison_json"), {})
        row["guardrails"] = _decode(row.pop("guardrails_json"), {})
        row["is_read"] = bool(row["is_read"])
        return row

    def mark_recommendation_read(self, recommendation_id: str) -> bool:
        with self._connect() as connection:
            cursor = connection.execute(
                """
                UPDATE laboratory_recommendations
                SET is_read = 1, updated_at = ?
                WHERE id = ?
                """,
                (_now(), recommendation_id),
            )
            if not cursor.rowcount:
                return False
            self._bump_revision(connection)
            return True

    def decide_recommendation(
        self,
        recommendation_id: str,
        *,
        decision: str,
        notes: str,
        actor: str = "admin",
    ) -> bool:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT status FROM laboratory_recommendations WHERE id = ?",
                (recommendation_id,),
            ).fetchone()
            if not row or row["status"] not in {"awaiting_review", "informational"}:
                return False
            next_status = "rejected" if decision == "reject" else "approved_for_backlog"
            connection.execute(
                """
                UPDATE laboratory_recommendations
                SET status = ?, decision = ?, decision_notes = ?, decided_at = ?,
                    is_read = 1, updated_at = ?
                WHERE id = ?
                """,
                (
                    next_status,
                    decision,
                    notes,
                    _now(),
                    _now(),
                    recommendation_id,
                ),
            )
            self._audit(
                connection,
                "recommendation_decided",
                actor,
                {"recommendation_id": recommendation_id, "decision": decision},
            )
            self._bump_revision(connection)
            return True

    def create_notification(
        self,
        *,
        event_type: str,
        title: str,
        body: str,
        run_id: str | None = None,
        recommendation_id: str | None = None,
        deduplication_key: str | None = None,
    ) -> dict[str, Any]:
        notification_id = str(uuid.uuid4())
        with self._connect() as connection:
            try:
                connection.execute(
                    """
                    INSERT INTO laboratory_notifications (
                        id, event_type, title, body, run_id, recommendation_id,
                        deduplication_key, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        notification_id,
                        event_type,
                        title,
                        body,
                        run_id,
                        recommendation_id,
                        deduplication_key,
                        _now(),
                    ),
                )
            except sqlite3.IntegrityError:
                row = connection.execute(
                    """
                    SELECT * FROM laboratory_notifications
                    WHERE deduplication_key = ?
                    """,
                    (deduplication_key,),
                ).fetchone()
                return dict(row) if row else {}
            self._bump_revision(connection)
        return self.get_notification(notification_id) or {}

    def get_notification(self, notification_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM laboratory_notifications WHERE id = ?",
                (notification_id,),
            ).fetchone()
        return dict(row) if row else None

    def list_notifications(self, *, limit: int = 50) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT * FROM laboratory_notifications
                ORDER BY created_at DESC LIMIT ?
                """,
                (max(1, min(limit, 100)),),
            ).fetchall()
        return [dict(row) for row in rows]

    def mark_notifications_read(self, notification_ids: list[str] | None = None) -> int:
        with self._connect() as connection:
            if notification_ids:
                placeholders = ",".join("?" for _ in notification_ids)
                cursor = connection.execute(
                    f"""
                    UPDATE laboratory_notifications SET read_at = ?
                    WHERE read_at IS NULL AND id IN ({placeholders})
                    """,
                    (_now(), *notification_ids),
                )
            else:
                cursor = connection.execute(
                    """
                    UPDATE laboratory_notifications SET read_at = ?
                    WHERE read_at IS NULL
                    """,
                    (_now(),),
                )
            if cursor.rowcount:
                self._bump_revision(connection)
            return cursor.rowcount

    @staticmethod
    def _audit(
        connection: sqlite3.Connection,
        event_type: str,
        actor: str,
        metadata: dict[str, Any],
    ) -> None:
        connection.execute(
            """
            INSERT INTO laboratory_audit_events (
                event_type, actor, metadata_json, created_at
            ) VALUES (?, ?, ?, ?)
            """,
            (event_type, actor, _json(metadata), _now()),
        )

    def metrics_by_perspective(self, run_id: str) -> dict[str, dict[str, float]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT profile, metric_name, AVG(value) AS mean_value,
                       COUNT(value) AS sample_count
                FROM laboratory_metric_scores
                WHERE run_id = ? AND profile IS NOT NULL AND value IS NOT NULL
                  AND status IN ('measured', 'provisional', 'human-reviewed')
                GROUP BY profile, metric_name
                """,
                (run_id,),
            ).fetchall()
        totals: dict[str, dict[str, tuple[float, int]]] = {}
        for row in rows:
            profile = _canonical_profile(row["profile"])
            metric_name = str(row["metric_name"])
            sample_count = int(row["sample_count"])
            weighted_total = float(row["mean_value"]) * sample_count
            previous_total, previous_count = totals.setdefault(profile, {}).get(
                metric_name,
                (0.0, 0),
            )
            totals[profile][metric_name] = (
                previous_total + weighted_total,
                previous_count + sample_count,
            )
        result: dict[str, dict[str, float]] = {}
        for profile, metrics in totals.items():
            result[profile] = {
                metric_name: round(total / count, 3)
                for metric_name, (total, count) in metrics.items()
                if count
            }
        return result

    def snapshot(self, *, schedule_date: str | None = None) -> dict[str, Any]:
        runs = self.list_runs(limit=50)
        completed = [run for run in runs if run["status"] == "completed"]
        latest = completed[0] if completed else None
        latest_scheduled = next((run for run in runs if run.get("origin") == "scheduled"), None)
        latest_manual = next((run for run in runs if run.get("origin") == "manual"), None)
        baseline = next((run for run in runs if run["is_baseline"]), None)
        schedule_date = schedule_date or datetime.now(timezone.utc).date().isoformat()
        with self._connect() as connection:
            pending_reviews = int(connection.execute(
                """
                SELECT COUNT(DISTINCT item.id) AS count
                FROM laboratory_run_items item
                LEFT JOIN laboratory_human_reviews review ON review.item_id = item.id
                WHERE item.status = 'completed' AND review.id IS NULL
                """
            ).fetchone()["count"])
            counts = connection.execute(
                """
                SELECT
                    SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) AS unread_recommendations,
                    COUNT(*) AS recommendation_count
                FROM laboratory_recommendations
                """
            ).fetchone()
            unread_notifications = int(connection.execute(
                """
                SELECT COUNT(*) AS count FROM laboratory_notifications
                WHERE read_at IS NULL
                """
            ).fetchone()["count"])
        regression_metrics: list[dict[str, Any]] = []
        if latest and baseline and latest["id"] != baseline["id"]:
            current_metrics = latest.get("aggregate", {}).get("metrics", {})
            baseline_metrics = baseline.get("aggregate", {}).get("metrics", {})
            for name in sorted(set(current_metrics) & set(baseline_metrics)):
                delta = round(current_metrics[name]["value"] - baseline_metrics[name]["value"], 3)
                if delta < 0:
                    regression_metrics.append({"metric": name, "delta": delta})
        return {
            "revision": self.current_revision(),
            "generated_at": _now(),
            "run_count": len(runs),
            "completed_run_count": len(completed),
            "pending_reviews": pending_reviews,
            "unread_recommendations": int(counts["unread_recommendations"] or 0),
            "recommendation_count": int(counts["recommendation_count"] or 0),
            "unread_notifications": unread_notifications,
            "latest": latest,
            "latest_scheduled": latest_scheduled,
            "latest_manual": latest_manual,
            "baseline": baseline,
            "regressions": regression_metrics,
            "runs": runs,
            "automation": self.automation_state(),
            "active_calibration": self.active_calibration(),
            "candidates": self.list_schedule_slots(schedule_date),
            "recommendations": self.list_recommendations(limit=10),
            "notifications": self.list_notifications(limit=10),
            "latest_perspective_metrics": (
                self.metrics_by_perspective(latest["id"]) if latest else {}
            ),
        }

    def results_summary(self) -> dict[str, Any]:
        snapshot = self.snapshot()
        return {
            key: snapshot[key]
            for key in (
                "revision",
                "generated_at",
                "run_count",
                "completed_run_count",
                "pending_reviews",
                "unread_recommendations",
                "unread_notifications",
                "latest",
                "latest_scheduled",
                "latest_manual",
                "baseline",
                "regressions",
                "automation",
                "active_calibration",
                "candidates",
                "recommendations",
                "latest_perspective_metrics",
            )
        }


laboratory_store = LaboratoryStore()
