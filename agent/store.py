from __future__ import annotations

import json
import os
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from .models import CreateDecisionRecordInput


DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "aetheris-agent.sqlite3"
MEMORY_WINDOW = 8


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


class DecisionConflictError(ValueError):
    pass


class AgentStore:
    def __init__(self, db_path: str | Path | None = None):
        configured = db_path or os.environ.get("AGENT_DB_PATH") or DEFAULT_DB_PATH
        self.db_path = Path(configured)

    @contextmanager
    def _connect(self):
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.db_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                PRAGMA journal_mode = WAL;

                CREATE TABLE IF NOT EXISTS decisions (
                    decision_id TEXT PRIMARY KEY,
                    request_id TEXT NOT NULL,
                    session_id TEXT NOT NULL,
                    project_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    user_query TEXT NOT NULL,
                    profile TEXT NOT NULL,
                    workflow TEXT NOT NULL,
                    recommendation TEXT NOT NULL,
                    alternatives_considered_json TEXT NOT NULL DEFAULT '[]',
                    tradeoffs_json TEXT NOT NULL DEFAULT '[]',
                    evidence_sources_json TEXT NOT NULL DEFAULT '[]',
                    top_similarity REAL NOT NULL DEFAULT 0,
                    evidence_tier TEXT NOT NULL,
                    model TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'draft',
                    created_by TEXT NOT NULL DEFAULT 'beatrice',
                    confirmed_by_user INTEGER NOT NULL DEFAULT 0,
                    updated_at TEXT NOT NULL
                );

                CREATE INDEX IF NOT EXISTS idx_agent_decisions_project
                ON decisions(project_id, timestamp DESC);

                CREATE INDEX IF NOT EXISTS idx_agent_decisions_status
                ON decisions(status, timestamp DESC);

                CREATE TABLE IF NOT EXISTS session_memory (
                    session_id TEXT PRIMARY KEY,
                    project_id TEXT NOT NULL,
                    profile TEXT NOT NULL,
                    last_intents_json TEXT NOT NULL DEFAULT '[]',
                    recent_decisions_json TEXT NOT NULL DEFAULT '[]',
                    preferred_detail_level TEXT NOT NULL DEFAULT 'balanced',
                    recurring_topics_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS project_memory (
                    project_id TEXT PRIMARY KEY,
                    last_profile TEXT NOT NULL,
                    last_intents_json TEXT NOT NULL DEFAULT '[]',
                    recent_decisions_json TEXT NOT NULL DEFAULT '[]',
                    preferred_detail_level TEXT NOT NULL DEFAULT 'balanced',
                    recurring_topics_json TEXT NOT NULL DEFAULT '{}',
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS agent_runs (
                    request_id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    project_id TEXT NOT NULL,
                    user_query TEXT NOT NULL,
                    profile TEXT NOT NULL,
                    intent TEXT NOT NULL,
                    workflow TEXT NOT NULL,
                    plan_json TEXT NOT NULL,
                    tools_used_json TEXT NOT NULL DEFAULT '[]',
                    steps_json TEXT NOT NULL DEFAULT '[]',
                    sources_json TEXT NOT NULL DEFAULT '[]',
                    top_similarity REAL NOT NULL DEFAULT 0,
                    evidence_tier TEXT NOT NULL DEFAULT 'insufficient',
                    limitations_json TEXT NOT NULL DEFAULT '[]',
                    decision_id TEXT,
                    model TEXT NOT NULL,
                    status TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    completed_at TEXT,
                    duration_ms INTEGER
                );

                CREATE INDEX IF NOT EXISTS idx_agent_runs_session
                ON agent_runs(session_id, created_at DESC);
                """
            )

    def create_decision(self, payload: CreateDecisionRecordInput) -> dict[str, Any]:
        now = _now()
        decision_id = f"dec_{uuid.uuid4().hex[:16]}"
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO decisions (
                    decision_id, request_id, session_id, project_id, timestamp,
                    user_query, profile, workflow, recommendation,
                    alternatives_considered_json, tradeoffs_json,
                    evidence_sources_json, top_similarity, evidence_tier, model,
                    status, created_by, confirmed_by_user, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                          'draft', 'beatrice', 0, ?)
                """,
                (
                    decision_id,
                    payload.request_id,
                    payload.session_id,
                    payload.project_id,
                    now,
                    payload.user_query,
                    payload.profile,
                    payload.workflow,
                    payload.recommendation,
                    _json(payload.alternatives_considered),
                    _json(payload.tradeoffs),
                    _json([
                        source.model_dump(mode="json")
                        for source in payload.evidence_sources
                    ]),
                    payload.top_similarity,
                    payload.evidence_tier,
                    payload.model,
                    now,
                ),
            )
        decision = self.get_decision(decision_id)
        if decision is None:
            raise RuntimeError("Decision was not persisted")
        return decision

    def get_decision(self, decision_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM decisions WHERE decision_id = ?",
                (decision_id,),
            ).fetchone()
        return self._serialize_decision(row) if row else None

    def list_decisions(
        self,
        *,
        status: str | None = None,
        workflow: str | None = None,
        profile: str | None = None,
        project_id: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> list[dict[str, Any]]:
        clauses: list[str] = []
        values: list[Any] = []
        for column, value in (
            ("status", status),
            ("workflow", workflow),
            ("profile", profile),
            ("project_id", project_id),
        ):
            if value is not None:
                clauses.append(f"{column} = ?")
                values.append(value)
        where = f" WHERE {' AND '.join(clauses)}" if clauses else ""
        values.extend([max(1, min(limit, 200)), max(0, offset)])
        with self._connect() as connection:
            rows = connection.execute(
                f"""
                SELECT * FROM decisions
                {where}
                ORDER BY timestamp DESC
                LIMIT ? OFFSET ?
                """,
                values,
            ).fetchall()
        return [self._serialize_decision(row) for row in rows]

    def update_decision_status(self, decision_id: str, status: str) -> dict[str, Any] | None:
        if status not in {"confirmed", "rejected"}:
            raise ValueError("Unsupported decision status")
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            row = connection.execute(
                "SELECT status FROM decisions WHERE decision_id = ?",
                (decision_id,),
            ).fetchone()
            if row is None:
                return None
            current = str(row["status"])
            if current == status:
                pass
            elif current != "draft":
                raise DecisionConflictError(
                    f"Decision is already {current} and cannot become {status}"
                )
            else:
                connection.execute(
                    """
                    UPDATE decisions
                    SET status = ?,
                        confirmed_by_user = ?,
                        updated_at = ?
                    WHERE decision_id = ?
                    """,
                    (status, 1 if status == "confirmed" else 0, _now(), decision_id),
                )
        return self.get_decision(decision_id)

    def create_run(
        self,
        *,
        request_id: str,
        session_id: str,
        project_id: str,
        user_query: str,
        profile: str,
        intent: str,
        workflow: str,
        plan: dict[str, Any],
        model: str,
        steps: list[dict[str, Any]],
    ) -> dict[str, Any]:
        now = _now()
        with self._connect() as connection:
            connection.execute(
                """
                INSERT INTO agent_runs (
                    request_id, session_id, project_id, user_query, profile,
                    intent, workflow, plan_json, steps_json, model, status,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'running', ?)
                """,
                (
                    request_id,
                    session_id,
                    project_id,
                    user_query,
                    profile,
                    intent,
                    workflow,
                    _json(plan),
                    _json(steps),
                    model,
                    now,
                ),
            )
        run = self.get_run(request_id)
        if run is None:
            raise RuntimeError("Agent run was not persisted")
        return run

    def finalize_run(
        self,
        request_id: str,
        *,
        tools_used: list[dict[str, Any]],
        steps: list[dict[str, Any]],
        sources: list[dict[str, Any]],
        top_similarity: float,
        evidence_tier: str,
        limitations: list[str],
        status: str,
        decision_id: str | None = None,
    ) -> dict[str, Any] | None:
        current = self.get_run(request_id)
        if current is None:
            return None
        completed_at = _now()
        started = datetime.fromisoformat(current["created_at"])
        completed = datetime.fromisoformat(completed_at)
        duration_ms = max(0, round((completed - started).total_seconds() * 1000))
        with self._connect() as connection:
            connection.execute(
                """
                UPDATE agent_runs
                SET tools_used_json = ?,
                    steps_json = ?,
                    sources_json = ?,
                    top_similarity = ?,
                    evidence_tier = ?,
                    limitations_json = ?,
                    decision_id = ?,
                    status = ?,
                    completed_at = ?,
                    duration_ms = ?
                WHERE request_id = ?
                """,
                (
                    _json(tools_used),
                    _json(steps),
                    _json(sources),
                    top_similarity,
                    evidence_tier,
                    _json(limitations),
                    decision_id,
                    status,
                    completed_at,
                    duration_ms,
                    request_id,
                ),
            )
        return self.get_run(request_id)

    def get_run(self, request_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM agent_runs WHERE request_id = ?",
                (request_id,),
            ).fetchone()
        return self._serialize_run(row) if row else None

    def update_memory(
        self,
        *,
        session_id: str,
        project_id: str,
        profile: str,
        intent: str,
        preferred_detail_level: str,
        topics: list[str],
        decision_id: str | None = None,
    ) -> dict[str, dict[str, Any]]:
        now = _now()
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            session = connection.execute(
                "SELECT * FROM session_memory WHERE session_id = ?",
                (session_id,),
            ).fetchone()
            project = connection.execute(
                "SELECT * FROM project_memory WHERE project_id = ?",
                (project_id,),
            ).fetchone()
            session_values = self._next_memory_values(
                session,
                intent=intent,
                topics=topics,
                decision_id=decision_id,
            )
            project_values = self._next_memory_values(
                project,
                intent=intent,
                topics=topics,
                decision_id=decision_id,
            )
            connection.execute(
                """
                INSERT INTO session_memory (
                    session_id, project_id, profile, last_intents_json,
                    recent_decisions_json, preferred_detail_level,
                    recurring_topics_json, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    project_id = excluded.project_id,
                    profile = excluded.profile,
                    last_intents_json = excluded.last_intents_json,
                    recent_decisions_json = excluded.recent_decisions_json,
                    preferred_detail_level = excluded.preferred_detail_level,
                    recurring_topics_json = excluded.recurring_topics_json,
                    updated_at = excluded.updated_at
                """,
                (
                    session_id,
                    project_id,
                    profile,
                    _json(session_values["last_intents"]),
                    _json(session_values["recent_decisions"]),
                    preferred_detail_level,
                    _json(session_values["recurring_topics"]),
                    session["created_at"] if session else now,
                    now,
                ),
            )
            connection.execute(
                """
                INSERT INTO project_memory (
                    project_id, last_profile, last_intents_json,
                    recent_decisions_json, preferred_detail_level,
                    recurring_topics_json, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(project_id) DO UPDATE SET
                    last_profile = excluded.last_profile,
                    last_intents_json = excluded.last_intents_json,
                    recent_decisions_json = excluded.recent_decisions_json,
                    preferred_detail_level = excluded.preferred_detail_level,
                    recurring_topics_json = excluded.recurring_topics_json,
                    updated_at = excluded.updated_at
                """,
                (
                    project_id,
                    profile,
                    _json(project_values["last_intents"]),
                    _json(project_values["recent_decisions"]),
                    preferred_detail_level,
                    _json(project_values["recurring_topics"]),
                    project["created_at"] if project else now,
                    now,
                ),
            )
        return {
            "session": self.get_session_memory(session_id) or {},
            "project": self.get_project_memory(project_id) or {},
        }

    def get_session_memory(self, session_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM session_memory WHERE session_id = ?",
                (session_id,),
            ).fetchone()
        return self._serialize_memory(row, project=False) if row else None

    def get_project_memory(self, project_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM project_memory WHERE project_id = ?",
                (project_id,),
            ).fetchone()
        return self._serialize_memory(row, project=True) if row else None

    @staticmethod
    def _next_memory_values(
        row: sqlite3.Row | None,
        *,
        intent: str,
        topics: list[str],
        decision_id: str | None,
    ) -> dict[str, Any]:
        intents = _decode(row["last_intents_json"], []) if row else []
        decisions = _decode(row["recent_decisions_json"], []) if row else []
        recurring = _decode(row["recurring_topics_json"], {}) if row else {}
        intents = [*intents, intent][-MEMORY_WINDOW:]
        if decision_id:
            decisions = [item for item in decisions if item != decision_id]
            decisions = [*decisions, decision_id][-MEMORY_WINDOW:]
        for topic in topics:
            normalized = " ".join(topic.lower().split())[:120]
            if normalized:
                recurring[normalized] = int(recurring.get(normalized, 0)) + 1
        recurring = dict(sorted(
            recurring.items(),
            key=lambda item: (-item[1], item[0]),
        )[:20])
        return {
            "last_intents": intents,
            "recent_decisions": decisions,
            "recurring_topics": recurring,
        }

    @staticmethod
    def _serialize_decision(row: sqlite3.Row) -> dict[str, Any]:
        return {
            "decision_id": row["decision_id"],
            "request_id": row["request_id"],
            "session_id": row["session_id"],
            "project_id": row["project_id"],
            "timestamp": row["timestamp"],
            "user_query": row["user_query"],
            "profile": row["profile"],
            "workflow": row["workflow"],
            "recommendation": row["recommendation"],
            "alternatives_considered": _decode(row["alternatives_considered_json"], []),
            "tradeoffs": _decode(row["tradeoffs_json"], []),
            "evidence_sources": _decode(row["evidence_sources_json"], []),
            "top_similarity": float(row["top_similarity"]),
            "evidence_tier": row["evidence_tier"],
            "model": row["model"],
            "status": row["status"],
            "created_by": row["created_by"],
            "confirmed_by_user": bool(row["confirmed_by_user"]),
            "updated_at": row["updated_at"],
        }

    @staticmethod
    def _serialize_memory(row: sqlite3.Row, *, project: bool) -> dict[str, Any]:
        result = {
            "last_intents": _decode(row["last_intents_json"], []),
            "recent_decisions": _decode(row["recent_decisions_json"], []),
            "preferred_detail_level": row["preferred_detail_level"],
            "recurring_topics": _decode(row["recurring_topics_json"], {}),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        }
        if project:
            result.update({
                "project_id": row["project_id"],
                "last_profile": row["last_profile"],
            })
        else:
            result.update({
                "session_id": row["session_id"],
                "project_id": row["project_id"],
                "profile": row["profile"],
            })
        return result

    @staticmethod
    def _serialize_run(row: sqlite3.Row) -> dict[str, Any]:
        return {
            "request_id": row["request_id"],
            "session_id": row["session_id"],
            "project_id": row["project_id"],
            "user_query": row["user_query"],
            "profile": row["profile"],
            "intent": row["intent"],
            "workflow": row["workflow"],
            "plan": _decode(row["plan_json"], {}),
            "tools_used": _decode(row["tools_used_json"], []),
            "steps": _decode(row["steps_json"], []),
            "sources": _decode(row["sources_json"], []),
            "top_similarity": float(row["top_similarity"]),
            "evidence_tier": row["evidence_tier"],
            "limitations": _decode(row["limitations_json"], []),
            "decision_id": row["decision_id"],
            "model": row["model"],
            "status": row["status"],
            "created_at": row["created_at"],
            "completed_at": row["completed_at"],
            "duration_ms": row["duration_ms"],
        }


agent_store = AgentStore()
