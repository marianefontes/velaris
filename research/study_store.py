from __future__ import annotations

import hashlib
import json
import os
import secrets
import sqlite3
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any


CONSENT_VERSION = "2026-06-06-v1"
DEFAULT_DB_PATH = Path(__file__).resolve().parent.parent / "data" / "aetheris-study.sqlite3"


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(value: datetime) -> str:
    return value.isoformat(timespec="seconds")


def _token_hash(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


class StudyStore:
    def __init__(self, db_path: str | Path | None = None):
        configured = db_path or os.environ.get("STUDY_DB_PATH") or DEFAULT_DB_PATH
        self.db_path = Path(configured)

    def _connect(self) -> sqlite3.Connection:
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        connection = sqlite3.connect(self.db_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def initialize(self) -> None:
        with self._connect() as connection:
            connection.executescript(
                """
                PRAGMA journal_mode = WAL;

                CREATE TABLE IF NOT EXISTS research_invites (
                    id TEXT PRIMARY KEY,
                    token_hash TEXT NOT NULL UNIQUE,
                    participant_code TEXT NOT NULL UNIQUE,
                    status TEXT NOT NULL DEFAULT 'invited',
                    created_at TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    started_at TEXT,
                    completed_at TEXT,
                    revoked_at TEXT
                );

                CREATE TABLE IF NOT EXISTS participant_identities (
                    id TEXT PRIMARY KEY,
                    full_name TEXT NOT NULL,
                    company_name TEXT,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS participant_profiles (
                    id TEXT PRIMARY KEY,
                    participant_code TEXT NOT NULL UNIQUE,
                    role_title TEXT NOT NULL,
                    primary_area TEXT NOT NULL,
                    experience_range TEXT NOT NULL,
                    design_system_experience TEXT NOT NULL,
                    design_system_frequency TEXT NOT NULL,
                    company_disclosure INTEGER NOT NULL DEFAULT 0,
                    created_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS study_sessions (
                    id TEXT PRIMARY KEY,
                    invite_id TEXT NOT NULL UNIQUE REFERENCES research_invites(id),
                    identity_id TEXT NOT NULL UNIQUE REFERENCES participant_identities(id),
                    profile_id TEXT NOT NULL UNIQUE REFERENCES participant_profiles(id),
                    access_token_hash TEXT NOT NULL UNIQUE,
                    consent_version TEXT NOT NULL,
                    consented_at TEXT NOT NULL,
                    started_at TEXT NOT NULL,
                    completed_at TEXT,
                    last_seen_at TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS study_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT NOT NULL REFERENCES study_sessions(id),
                    event_type TEXT NOT NULL,
                    occurred_at TEXT NOT NULL,
                    path TEXT,
                    metadata_json TEXT NOT NULL DEFAULT '{}'
                );

                CREATE INDEX IF NOT EXISTS idx_study_events_session
                ON study_events(session_id, occurred_at);
                """
            )

    def _next_participant_code(self, connection: sqlite3.Connection) -> str:
        rows = connection.execute(
            "SELECT participant_code FROM research_invites ORDER BY created_at DESC"
        ).fetchall()
        highest = 0
        for row in rows:
            code = str(row["participant_code"])
            if code.startswith("P") and code[1:].isdigit():
                highest = max(highest, int(code[1:]))
        return f"P{highest + 1:03d}"

    def create_invite(
        self,
        participant_code: str | None = None,
        expires_in_days: int = 30,
    ) -> dict[str, Any]:
        now = _utc_now()
        raw_token = secrets.token_urlsafe(24)
        invite_id = str(uuid.uuid4())
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            code = participant_code or self._next_participant_code(connection)
            connection.execute(
                """
                INSERT INTO research_invites (
                    id, token_hash, participant_code, status, created_at, expires_at
                ) VALUES (?, ?, ?, 'invited', ?, ?)
                """,
                (
                    invite_id,
                    _token_hash(raw_token),
                    code,
                    _iso(now),
                    _iso(now + timedelta(days=expires_in_days)),
                ),
            )
        return {
            "token": raw_token,
            "participant_code": code,
            "status": "invited",
            "expires_at": _iso(now + timedelta(days=expires_in_days)),
        }

    def get_public_invite(self, raw_token: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT participant_code, status, expires_at, revoked_at
                FROM research_invites
                WHERE token_hash = ?
                """,
                (_token_hash(raw_token),),
            ).fetchone()
        if not row:
            return None

        expired = datetime.fromisoformat(row["expires_at"]) < _utc_now()
        status = "expired" if expired else row["status"]
        if row["revoked_at"]:
            status = "revoked"
        return {
            "participant_code": row["participant_code"],
            "status": status,
            "expires_at": row["expires_at"],
            "consent_version": CONSENT_VERSION,
        }

    def enroll(self, raw_token: str, participant: dict[str, Any]) -> dict[str, Any]:
        now = _utc_now()
        access_token = secrets.token_urlsafe(32)
        session_id = str(uuid.uuid4())
        identity_id = str(uuid.uuid4())
        profile_id = str(uuid.uuid4())

        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            invite = connection.execute(
                "SELECT * FROM research_invites WHERE token_hash = ?",
                (_token_hash(raw_token),),
            ).fetchone()
            if not invite:
                raise ValueError("invite_not_found")
            if invite["revoked_at"]:
                raise ValueError("invite_revoked")
            if datetime.fromisoformat(invite["expires_at"]) < now:
                raise ValueError("invite_expired")
            if invite["status"] != "invited":
                raise ValueError("invite_already_used")

            company_name = (
                participant["company_name"].strip()
                if participant["company_disclosure"] and participant.get("company_name")
                else None
            )
            connection.execute(
                """
                INSERT INTO participant_identities (id, full_name, company_name, created_at)
                VALUES (?, ?, ?, ?)
                """,
                (identity_id, participant["full_name"].strip(), company_name, _iso(now)),
            )
            connection.execute(
                """
                INSERT INTO participant_profiles (
                    id, participant_code, role_title, primary_area, experience_range,
                    design_system_experience, design_system_frequency,
                    company_disclosure, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    profile_id,
                    invite["participant_code"],
                    participant["role_title"].strip(),
                    participant["primary_area"],
                    participant["experience_range"],
                    participant["design_system_experience"],
                    participant["design_system_frequency"],
                    int(participant["company_disclosure"]),
                    _iso(now),
                ),
            )
            connection.execute(
                """
                INSERT INTO study_sessions (
                    id, invite_id, identity_id, profile_id, access_token_hash,
                    consent_version, consented_at, started_at, last_seen_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    session_id,
                    invite["id"],
                    identity_id,
                    profile_id,
                    _token_hash(access_token),
                    CONSENT_VERSION,
                    _iso(now),
                    _iso(now),
                    _iso(now),
                ),
            )
            connection.execute(
                """
                UPDATE research_invites
                SET status = 'started', started_at = ?
                WHERE id = ?
                """,
                (_iso(now), invite["id"]),
            )
            connection.execute(
                """
                INSERT INTO study_events (session_id, event_type, occurred_at, path, metadata_json)
                VALUES (?, 'study_started', ?, '/study', ?)
                """,
                (
                    session_id,
                    _iso(now),
                    json.dumps(
                        {
                            "participant_code": invite["participant_code"],
                            "consent_version": CONSENT_VERSION,
                        },
                        ensure_ascii=True,
                    ),
                ),
            )

        return {
            "session_id": session_id,
            "access_token": access_token,
            "participant_code": invite["participant_code"],
            "status": "started",
        }

    def get_session(self, session_id: str, access_token: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT s.id, s.completed_at, s.last_seen_at, i.participant_code, i.status
                FROM study_sessions s
                JOIN research_invites i ON i.id = s.invite_id
                WHERE s.id = ? AND s.access_token_hash = ?
                """,
                (session_id, _token_hash(access_token)),
            ).fetchone()
        if not row:
            return None
        return dict(row)

    def append_event(
        self,
        session_id: str,
        access_token: str,
        event_type: str,
        path: str | None,
        metadata: dict[str, Any],
    ) -> bool:
        now = _iso(_utc_now())
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            session = connection.execute(
                """
                SELECT id, invite_id FROM study_sessions
                WHERE id = ? AND access_token_hash = ?
                """,
                (session_id, _token_hash(access_token)),
            ).fetchone()
            if not session:
                return False
            connection.execute(
                """
                INSERT INTO study_events (session_id, event_type, occurred_at, path, metadata_json)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    session_id,
                    event_type,
                    now,
                    path,
                    json.dumps(metadata, ensure_ascii=True),
                ),
            )
            completed_at = now if event_type == "study_completed" else None
            connection.execute(
                """
                UPDATE study_sessions
                SET last_seen_at = ?, completed_at = COALESCE(?, completed_at)
                WHERE id = ?
                """,
                (now, completed_at, session_id),
            )
            if completed_at:
                connection.execute(
                    """
                    UPDATE research_invites
                    SET status = 'completed', completed_at = ?
                    WHERE id = ?
                    """,
                    (completed_at, session["invite_id"]),
                )
        return True

    def list_invites(self) -> list[dict[str, Any]]:
        with self._connect() as connection:
            rows = connection.execute(
                """
                SELECT
                    i.participant_code,
                    i.status,
                    i.created_at,
                    i.expires_at,
                    i.started_at,
                    i.completed_at,
                    s.id AS session_id,
                    p.role_title,
                    p.primary_area,
                    identity.full_name,
                    identity.company_name,
                    (
                        SELECT COUNT(*)
                        FROM study_events event
                        WHERE event.session_id = s.id
                    ) AS event_count
                FROM research_invites i
                LEFT JOIN study_sessions s ON s.invite_id = i.id
                LEFT JOIN participant_profiles p ON p.id = s.profile_id
                LEFT JOIN participant_identities identity ON identity.id = s.identity_id
                ORDER BY i.created_at DESC
                """
            ).fetchall()
        return [dict(row) for row in rows]

    def get_research_session_detail(self, session_id: str) -> dict[str, Any] | None:
        with self._connect() as connection:
            session = connection.execute(
                """
                SELECT
                    s.id AS session_id,
                    s.consented_at,
                    s.started_at,
                    s.completed_at,
                    s.last_seen_at,
                    i.participant_code,
                    i.status,
                    identity.full_name,
                    identity.company_name,
                    p.role_title,
                    p.primary_area,
                    p.experience_range,
                    p.design_system_experience,
                    p.design_system_frequency,
                    p.company_disclosure
                FROM study_sessions s
                JOIN research_invites i ON i.id = s.invite_id
                JOIN participant_identities identity ON identity.id = s.identity_id
                JOIN participant_profiles p ON p.id = s.profile_id
                WHERE s.id = ?
                """,
                (session_id,),
            ).fetchone()
            if not session:
                return None
            event_rows = connection.execute(
                """
                SELECT id, event_type, occurred_at, path, metadata_json
                FROM study_events
                WHERE session_id = ?
                ORDER BY occurred_at ASC, id ASC
                """,
                (session_id,),
            ).fetchall()

        events = []
        for row in event_rows:
            event = dict(row)
            try:
                event["metadata"] = json.loads(event.pop("metadata_json"))
            except (json.JSONDecodeError, TypeError):
                event["metadata"] = {}
                event.pop("metadata_json", None)
            events.append(event)

        return {**dict(session), "events": events}

    def get_public_results(self) -> dict[str, Any]:
        with self._connect() as connection:
            invitation_count = connection.execute(
                "SELECT COUNT(*) AS count FROM research_invites WHERE revoked_at IS NULL"
            ).fetchone()["count"]
            session_summary = connection.execute(
                """
                SELECT
                    COUNT(*) AS started,
                    SUM(CASE WHEN completed_at IS NOT NULL THEN 1 ELSE 0 END) AS completed,
                    AVG(
                        CASE
                            WHEN completed_at IS NOT NULL
                            THEN (julianday(completed_at) - julianday(started_at)) * 1440
                        END
                    ) AS average_session_minutes,
                    MAX(last_seen_at) AS latest_activity
                FROM study_sessions
                """
            ).fetchone()
            event_rows = connection.execute(
                """
                SELECT event_type, COUNT(*) AS count
                FROM study_events
                GROUP BY event_type
                """
            ).fetchall()
            profile_rows = connection.execute(
                """
                SELECT
                    primary_area,
                    experience_range,
                    design_system_experience,
                    design_system_frequency
                FROM participant_profiles
                """
            ).fetchall()

        started = int(session_summary["started"] or 0)
        completed = int(session_summary["completed"] or 0)
        event_counts = {row["event_type"]: int(row["count"]) for row in event_rows}

        def distribution(field: str) -> list[dict[str, Any]]:
            counts: dict[str, int] = {}
            for row in profile_rows:
                key = str(row[field])
                counts[key] = counts.get(key, 0) + 1
            total = sum(counts.values())
            return [
                {
                    "key": key,
                    "count": count,
                    "percentage": round((count / total) * 100, 1) if total else 0,
                }
                for key, count in sorted(
                    counts.items(),
                    key=lambda item: (-item[1], item[0]),
                )
            ]

        prompts = event_counts.get("prompt_submitted", 0)
        average_session_minutes = session_summary["average_session_minutes"]
        return {
            "generated_at": _iso(_utc_now()),
            "participants": {
                "invited": int(invitation_count or 0),
                "started": started,
                "completed": completed,
                "active": max(started - completed, 0),
                "completion_rate": round((completed / started) * 100, 1) if started else 0,
            },
            "profiles": {
                "primary_area": distribution("primary_area"),
                "experience_range": distribution("experience_range"),
                "design_system_experience": distribution("design_system_experience"),
                "design_system_frequency": distribution("design_system_frequency"),
            },
            "usage": {
                "total_events": sum(event_counts.values()),
                "page_views": event_counts.get("page_view", 0),
                "prompts": prompts,
                "responses": event_counts.get("response_completed", 0),
                "errors": event_counts.get("response_error", 0),
                "perspective_changes": event_counts.get("perspective_changed", 0),
                "average_prompts_per_session": round(prompts / started, 1) if started else 0,
                "average_session_minutes": (
                    round(float(average_session_minutes), 1)
                    if average_session_minutes is not None
                    else None
                ),
                "latest_activity": session_summary["latest_activity"],
            },
            "privacy": {
                "aggregation_only": True,
                "minimum_identity_exposure": 0,
            },
        }


study_store = StudyStore()
