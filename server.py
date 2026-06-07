"""
server.py | Beatrice Chat Server (Python / FastAPI)
RAG-augmented proxy for Groq streaming | ChromaDB + BGE-M3 + modular prompts.

Usage:
  pip install -r requirements.txt
  # Option 1: add GROQ_API_KEY to .env.local
  # Option 2: export GROQ_API_KEY=gsk_...
  uvicorn server:app --port 3333 --reload
"""

import asyncio
import hashlib
import json
import os
import re
import secrets
import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator, Literal

import chromadb
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from cognition.engines.registry import resolve_engine
from cognition.orchestration.reasoning_engine import CognitiveOrchestrationResult, build_cognitive_orchestration
from cognition.overrides.manual_override_parser import parse_manual_override
from laboratory.automation import LaboratoryAutomation
from laboratory.calibration import merge_profile_calibration
from laboratory.cases import list_case_sets, load_case_set
from laboratory.runner import LaboratoryRunner, RateLimitError
from laboratory.store import laboratory_store
from prompts.intent_router import route_query
from prompts.prompt_builder import PromptBuildContext, build_system_prompt
from rag.context_builder import build_dialogue_context, build_rag_context, serialize_sources
from rag.evidence_metrics import build_evidence_metrics_block, compute_evidence_metrics
from rag.retrieval import retrieve_catalog_chunks, retrieve_chunks
from research.study_store import CONSENT_VERSION, study_store

# ||| Environment
load_dotenv(Path(__file__).parent / ".env.local")

# ||| Config
API_KEY = os.environ.get("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"
LABORATORY_MODEL = os.environ.get(
    "LABORATORY_GROQ_MODEL",
    "meta-llama/llama-4-scout-17b-16e-instruct",
)
LABORATORY_REQUEST_INTERVAL_SECONDS = max(
    0.0,
    float(os.environ.get("LABORATORY_REQUEST_INTERVAL_SECONDS", "13")),
)
LABORATORY_RATE_LIMIT_RETRIES = max(
    0,
    int(os.environ.get("LABORATORY_RATE_LIMIT_RETRIES", "6")),
)
RAG_DIR = Path(__file__).parent / "rag"
DB_PATH = RAG_DIR / "chroma_db"
COLLECTION_NAME = "aetheris_design_system"
MAX_HISTORY_MESSAGES = 16
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
RESEARCH_ADMIN_KEY = os.environ.get("RESEARCH_ADMIN_KEY", "")
LABORATORY_AUTOMATION_ENABLED = os.environ.get(
    "LABORATORY_AUTOMATION_ENABLED",
    "",
).lower() in {"1", "true", "yes", "on"}
LABORATORY_SCHEDULE_TIMEZONE = os.environ.get(
    "LABORATORY_SCHEDULE_TIMEZONE",
    "Europe/Lisbon",
)
LABORATORY_AUTOMATION_CASE_SET = os.environ.get(
    "LABORATORY_AUTOMATION_CASE_SET",
    "beatrice-core-v1",
)

# ||| Global state | initialized at startup
_chroma: chromadb.ClientAPI | None = None
_collection: chromadb.Collection | None = None
_embedder = None
_rag_ready = False
_laboratory_runner: LaboratoryRunner | None = None
_laboratory_automation: LaboratoryAutomation | None = None


def _max_tokens_for_response(catalog_mode: bool, command_mode: str | None) -> int:
    if catalog_mode:
        return 3500
    if command_mode:
        return 2400
    return 1800


def _sse_payload(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def _trim_history(messages: list[dict]) -> list[dict]:
    if len(messages) <= MAX_HISTORY_MESSAGES:
        return messages
    return messages[-MAX_HISTORY_MESSAGES:]


def _last_user_query(messages: list[dict]) -> str:
    last_user = next((message for message in reversed(messages) if message.get("role") == "user"), None)
    return last_user.get("content", "") if last_user else ""


def _replace_last_user_query(messages: list[dict], clean_query: str) -> list[dict]:
    next_messages = [dict(message) for message in messages]
    for index in range(len(next_messages) - 1, -1, -1):
        if next_messages[index].get("role") == "user":
            next_messages[index]["content"] = clean_query
            break
    return next_messages


def _model_query_from_override(raw_query: str, clean_query: str) -> str:
    if clean_query.strip():
        return clean_query.strip()
    if raw_query.strip().lower().startswith("/use "):
        return "O usuário ajustou a preferência cognitiva, mas ainda não informou a pergunta ou tarefa."
    return raw_query.strip()


def _build_chunks(query: str, route, cognition: CognitiveOrchestrationResult) -> list[dict]:
    if route.catalog_mode:
        catalog_chunks = retrieve_catalog_chunks(
            collection=_collection,
            catalog_entity=route.catalog_entity,
            profile=route.persona_profile,
        )
        if catalog_chunks:
            return catalog_chunks

    return retrieve_chunks(
        collection=_collection,
        embedder=_embedder,
        rag_ready=_rag_ready,
        query=query,
        intent=route.retrieval_intent,
        top_k=cognition.retrieval_top_k,
        profile=route.persona_profile,
    )


def _evidence_metrics_block(route, chunks: list[dict]) -> str:
    """Inject grounded XAI metrics only when the active engine needs them."""
    engine = resolve_engine(route.active_command_mode)
    if engine is None or not engine.needs_evidence_metrics:
        return ""
    metrics = compute_evidence_metrics(chunks, top_k=route.top_k)
    return build_evidence_metrics_block(metrics)


def _build_groq_messages(
    messages: list[dict],
    query: str,
    route,
    cognition: CognitiveOrchestrationResult,
    chunks: list[dict],
    calibration_override: dict | None = None,
) -> list[dict]:
    rag_context = build_rag_context(
        chunks,
        query=query,
        intent=route.response_intent,
        catalog_mode=route.catalog_mode,
        catalog_entity=route.catalog_entity,
    )
    prompt_context = PromptBuildContext(
        query=query,
        retrieval_intent=route.retrieval_intent,
        response_intent=route.response_intent,
        profile=route.persona_profile,
        command_mode=route.active_command_mode,
        catalog_mode=route.catalog_mode,
        catalog_entity=route.catalog_entity,
        rag_context=rag_context,
        cognitive_context=cognition.prompt_context,
        dialogue_context=build_dialogue_context(messages),
        calibration_override=calibration_override,
        evidence_metrics_block=_evidence_metrics_block(route, chunks),
    )
    system_content = build_system_prompt(prompt_context)
    return [{"role": "system", "content": system_content}] + messages


def _sanitize_calibration(raw) -> dict | None:
    """Accept only the three knobs the user can tune on /perspectives."""
    if not isinstance(raw, dict):
        return None
    sanitized: dict = {}
    if raw.get("depth") in ("low", "medium", "high"):
        sanitized["depth"] = raw["depth"]
    for field in ("technicality", "risk_sensitivity"):
        value = raw.get(field)
        if isinstance(value, (int, float)):
            sanitized[field] = max(0.0, min(1.0, float(value)))
    return sanitized or None


def _prompt_fingerprint() -> str:
    digest = hashlib.sha256()
    for directory in (Path(__file__).parent / "prompts", Path(__file__).parent / "cognition"):
        for path in sorted(directory.rglob("*")):
            if not path.is_file() or path.suffix not in {".md", ".py"}:
                continue
            digest.update(str(path.relative_to(Path(__file__).parent)).encode("utf-8"))
            digest.update(path.read_bytes())
    return digest.hexdigest()[:16]


async def _generate_laboratory_answer(item: dict) -> dict:
    if not API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")

    query = str(item["question"])
    profile = str(item["profile"])
    messages = [{"role": "user", "content": query}]
    route = route_query(query, profile=profile)
    cognition = build_cognitive_orchestration(
        query=query,
        route=route,
        messages=messages,
    )
    chunks = _build_chunks(query, route, cognition)
    calibration = merge_profile_calibration(
        profile,
        item.get("calibration_snapshot"),
        None,
    )
    groq_messages = _build_groq_messages(
        messages,
        query,
        route,
        cognition,
        chunks,
        calibration_override=calibration,
    )

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": LABORATORY_MODEL,
                "max_tokens": _max_tokens_for_response(route.catalog_mode, route.active_command_mode),
                "stream": False,
                "temperature": 0.2,
                "messages": groq_messages,
            },
        )
    if response.status_code == 401:
        raise RuntimeError("GROQ_API_KEY is invalid")
    if response.status_code == 429:
        try:
            retry_after = float(response.headers.get("retry-after", "60"))
        except ValueError:
            retry_after = 60.0
        raise RateLimitError(
            "Groq rate limit reached",
            retry_after_seconds=retry_after,
        )
    if response.status_code >= 400:
        raise RuntimeError(f"Groq request failed with HTTP {response.status_code}")
    payload = response.json()
    try:
        answer_text = str(payload["choices"][0]["message"]["content"]).strip()
    except (KeyError, IndexError, TypeError) as error:
        raise RuntimeError("Groq returned an invalid response") from error
    if not answer_text:
        raise RuntimeError("Groq returned an empty answer")

    evidence_metrics = compute_evidence_metrics(
        chunks,
        top_k=cognition.retrieval_top_k,
    )
    usage = payload.get("usage") if isinstance(payload.get("usage"), dict) else {}
    return {
        "answer_text": answer_text,
        "intent": route.response_intent,
        "cognitive_skills": list(cognition.active_skills),
        "sources": serialize_sources(chunks),
        "evidence_metrics": evidence_metrics,
        "prompt_tokens": int(usage.get("prompt_tokens", 0) or 0),
        "completion_tokens": int(usage.get("completion_tokens", 0) or 0),
    }


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _chroma, _collection, _embedder, _rag_ready
    global _laboratory_runner, _laboratory_automation

    study_store.initialize()
    print(f"Research database ready: {study_store.db_path}")
    laboratory_store.initialize()
    interrupted = laboratory_store.interrupt_running_runs()
    _laboratory_runner = LaboratoryRunner(
        laboratory_store,
        _generate_laboratory_answer,
        request_interval_seconds=LABORATORY_REQUEST_INTERVAL_SECONDS,
        max_rate_limit_retries=LABORATORY_RATE_LIMIT_RETRIES,
    )
    _laboratory_automation = LaboratoryAutomation(
        store=laboratory_store,
        runner=_laboratory_runner,
        prompt_fingerprint=_prompt_fingerprint,
        model=LABORATORY_MODEL,
        credentials_ready=lambda: bool(API_KEY),
        enabled=LABORATORY_AUTOMATION_ENABLED,
        timezone_name=LABORATORY_SCHEDULE_TIMEZONE,
        case_set_id=LABORATORY_AUTOMATION_CASE_SET,
    )
    _laboratory_runner.on_finalized = _laboratory_automation.on_run_finalized
    _laboratory_automation.start()
    print(f"Laboratory database ready: {laboratory_store.db_path} ({interrupted} interrupted run(s))")

    try:
        if os.environ.get("AETHERIS_SKIP_RAG_STARTUP") == "1":
            print("RAG startup skipped by AETHERIS_SKIP_RAG_STARTUP")
        else:
            print("🗄️  Carregando ChromaDB...")
            _chroma = chromadb.PersistentClient(path=str(DB_PATH))
            _collection = _chroma.get_or_create_collection(
                COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"},
            )
            print(f"✅ ChromaDB: {_collection.count()} chunks indexados")

            print("🧠 Carregando BAAI/bge-m3 (pode levar ~30s na primeira vez)...")
            try:
                from FlagEmbedding import BGEM3FlagModel

                _embedder = BGEM3FlagModel("BAAI/bge-m3", use_fp16=True)
                _rag_ready = True
                print("✅ BGE-M3 carregado — retrieval vetorial ativo")
            except ImportError:
                _embedder = None
                _rag_ready = False
                print("⚠️  FlagEmbedding não instalado — RAG desativado (pip install FlagEmbedding)")
        yield
    finally:
        if _laboratory_automation:
            await _laboratory_automation.stop()
        print("🛑 Shutting down Beatrice server")


# ||| FastAPI app
app = FastAPI(title="Beatrice Chat Server", version="2.3.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def _health_payload() -> dict:
    count = _collection.count() if _collection else 0
    automation = _laboratory_automation.status() if _laboratory_automation else {
        "enabled": LABORATORY_AUTOMATION_ENABLED,
        "paused": False,
        "next_slot": None,
        "active_calibration_version_id": None,
    }
    return {
        "status": "ok",
        "service": "beatrice-chat-server",
        "model": MODEL,
        "laboratory_model": LABORATORY_MODEL,
        "corpus_chunks": count,
        "rag_active": _rag_ready and count > 0,
        "embedder": "BAAI/bge-m3" if _rag_ready else "none",
        "prompt_architecture": "modular",
        "cognitive_orchestration": "adaptive-hybrid",
        "persona_context_engine": "operational-profiles",
        "laboratory_automation": {
            "enabled": automation["enabled"],
            "paused": automation["paused"],
            "next_slot": automation["next_slot"],
            "active_calibration_version_id": automation["active_calibration_version_id"],
        },
    }


@app.get("/health")
def health():
    return _health_payload()


@app.get("/api/health")
def health_api():
    return _health_payload()


class CreateResearchInvitePayload(BaseModel):
    participant_code: str | None = Field(default=None, max_length=12)
    expires_in_days: int = Field(default=30, ge=1, le=180)


class StudyEnrollmentPayload(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    role_title: str = Field(min_length=2, max_length=100)
    primary_area: str
    experience_range: str
    design_system_experience: str
    design_system_frequency: str
    company_disclosure: bool = False
    company_name: str | None = Field(default=None, max_length=140)
    confirms_adult: bool
    consent_academic_use: bool
    consent_interaction_recording: bool
    consent_voluntary: bool


class StudyEventPayload(BaseModel):
    event_type: str = Field(min_length=2, max_length=50)
    path: str | None = Field(default=None, max_length=500)
    metadata: dict = Field(default_factory=dict)


class CreateLaboratoryRunPayload(BaseModel):
    case_set_id: str = Field(min_length=2, max_length=100)
    version_label: str = Field(min_length=2, max_length=80)
    profiles: list[str] = Field(min_length=1, max_length=7)
    repetitions: Literal[1] = 1


class LaboratoryReviewPayload(BaseModel):
    reviewer: str = Field(min_length=2, max_length=80)
    scores: dict[str, float]
    notes: str = Field(default="", max_length=2000)


class LaboratoryPausePayload(BaseModel):
    reason: str = Field(default="Paused by administrator", max_length=500)


class LaboratoryDecisionPayload(BaseModel):
    decision: str = Field(pattern="^(reject|approve_for_backlog)$")
    notes: str = Field(default="", max_length=2000)


class LaboratoryNotificationReadPayload(BaseModel):
    ids: list[str] = Field(default_factory=list, max_length=100)


class LaboratoryRollbackPayload(BaseModel):
    reason: str = Field(min_length=2, max_length=500)


ALLOWED_PRIMARY_AREAS = {
    "design",
    "frontend",
    "product",
    "qa",
    "content",
    "accessibility",
    "research",
    "other",
}
ALLOWED_EXPERIENCE_RANGES = {"under-1", "1-2", "3-5", "6-10", "over-10"}
ALLOWED_DS_EXPERIENCE = {"none", "basic", "intermediate", "advanced"}
ALLOWED_DS_FREQUENCY = {"never", "rarely", "monthly", "weekly", "daily"}
ALLOWED_STUDY_EVENTS = {
    "study_started",
    "page_view",
    "prompt_submitted",
    "response_completed",
    "response_error",
    "task_started",
    "task_completed",
    "source_opened",
    "perspective_changed",
    "survey_answered",
    "study_completed",
}
ALLOWED_LABORATORY_PROFILES = {
    "designer",
    "dev",
    "pm",
    "qa",
    "writer",
    "a11y",
    "maintainer",
}
ALLOWED_REVIEW_METRICS = {
    "factual_correctness",
    "source_fidelity",
    "completeness",
    "perspective_adherence",
    "divergence_quality",
    "abstention_quality",
    "usefulness",
}
MAX_LABORATORY_REQUESTS = 200


def _require_research_admin(x_research_key: str | None) -> None:
    if not RESEARCH_ADMIN_KEY:
        raise HTTPException(status_code=503, detail="RESEARCH_ADMIN_KEY is not configured")
    if not x_research_key or not secrets.compare_digest(x_research_key, RESEARCH_ADMIN_KEY):
        raise HTTPException(status_code=401, detail="Invalid research administration key")


def _study_access_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing study session token")
    return authorization.removeprefix("Bearer ").strip()


@app.post("/api/laboratory/auth/verify")
def verify_laboratory_auth(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    return {"authenticated": True}


@app.get("/api/laboratory/case-sets")
def get_laboratory_case_sets(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    return {"case_sets": list_case_sets()}


@app.post("/api/laboratory/runs")
async def create_laboratory_run(
    payload: CreateLaboratoryRunPayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    profiles = list(dict.fromkeys(payload.profiles))
    invalid_profiles = sorted(set(profiles) - ALLOWED_LABORATORY_PROFILES)
    if invalid_profiles:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported laboratory profiles: {', '.join(invalid_profiles)}",
        )
    try:
        case_set = load_case_set(payload.case_set_id)
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    request_count = len(case_set.cases) * len(profiles) * payload.repetitions
    if request_count > MAX_LABORATORY_REQUESTS:
        raise HTTPException(
            status_code=422,
            detail=f"Laboratory run exceeds the {MAX_LABORATORY_REQUESTS}-request limit",
        )
    active_calibration = laboratory_store.active_calibration()
    run = laboratory_store.create_run(
        case_set=case_set,
        version_label=payload.version_label.strip(),
        profiles=profiles,
        repetitions=payload.repetitions,
        model=LABORATORY_MODEL,
        prompt_fingerprint=_prompt_fingerprint(),
        calibration_version_id=active_calibration["id"],
        calibration_snapshot=active_calibration["calibration"],
    )
    if _laboratory_runner is None:
        raise HTTPException(status_code=503, detail="Laboratory runner is unavailable")
    _laboratory_runner.schedule(run["id"])
    await asyncio.sleep(0)
    return laboratory_store.get_run(run["id"], include_items=False)


@app.get("/api/laboratory/runs")
def list_laboratory_runs(
    limit: int = 30,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    return {"runs": laboratory_store.list_runs(limit=limit)}


@app.get("/api/laboratory/runs/{run_id}")
def get_laboratory_run(
    run_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    run = laboratory_store.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Laboratory run not found")
    return run


@app.post("/api/laboratory/runs/{run_id}/cancel")
def cancel_laboratory_run(
    run_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    if not laboratory_store.request_cancel(run_id):
        raise HTTPException(status_code=409, detail="Laboratory run cannot be cancelled")
    return {"cancel_requested": True}


@app.post("/api/laboratory/runs/{run_id}/baseline")
def set_laboratory_baseline(
    run_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    if not laboratory_store.set_baseline(run_id):
        raise HTTPException(status_code=409, detail="Only completed runs can become baseline")
    return {"baseline": run_id}


@app.post("/api/laboratory/items/{item_id}/review")
def review_laboratory_item(
    item_id: str,
    payload: LaboratoryReviewPayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    invalid_metrics = sorted(set(payload.scores) - ALLOWED_REVIEW_METRICS)
    if invalid_metrics:
        raise HTTPException(
            status_code=422,
            detail=f"Unsupported review metrics: {', '.join(invalid_metrics)}",
        )
    if not payload.scores:
        raise HTTPException(status_code=422, detail="At least one review score is required")
    if any(value < 0 or value > 1 for value in payload.scores.values()):
        raise HTTPException(status_code=422, detail="Review scores must be between 0 and 1")
    if not laboratory_store.save_review(
        item_id,
        reviewer=payload.reviewer.strip(),
        scores=payload.scores,
        notes=payload.notes.strip(),
    ):
        raise HTTPException(status_code=404, detail="Laboratory item not found")
    return {"reviewed": True}


@app.get("/api/laboratory/results")
def get_laboratory_results(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    results = laboratory_store.results_summary()
    if _laboratory_automation:
        results["automation"] = _laboratory_automation.status()
    return results


@app.get("/api/laboratory/snapshot")
def get_laboratory_snapshot(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    schedule_date = (
        _laboratory_automation.local_now().date().isoformat()
        if _laboratory_automation
        else None
    )
    snapshot = laboratory_store.snapshot(schedule_date=schedule_date)
    snapshot["automation"] = (
        _laboratory_automation.status()
        if _laboratory_automation
        else snapshot["automation"]
    )
    return snapshot


@app.get("/api/laboratory/revision")
def get_laboratory_revision(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    return {"revision": laboratory_store.current_revision()}


@app.get("/api/laboratory/automation/status")
def get_laboratory_automation_status(
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    if not _laboratory_automation:
        raise HTTPException(status_code=503, detail="Laboratory automation is unavailable")
    return _laboratory_automation.status()


@app.post("/api/laboratory/automation/pause")
def pause_laboratory_automation(
    payload: LaboratoryPausePayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    revision = laboratory_store.set_automation_pause(
        True,
        reason=payload.reason.strip(),
        actor="admin",
    )
    laboratory_store.create_notification(
        event_type="automation_paused",
        title="Automação pausada",
        body=payload.reason.strip(),
        deduplication_key=None,
    )
    return {"paused": True, "revision": max(revision, laboratory_store.current_revision())}


@app.post("/api/laboratory/automation/resume")
def resume_laboratory_automation(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    revision = laboratory_store.set_automation_pause(False, actor="admin")
    return {"paused": False, "revision": revision}


@app.get("/api/laboratory/recommendations")
def list_laboratory_recommendations(
    limit: int = 50,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    return {
        "recommendations": laboratory_store.list_recommendations(limit=limit),
        "revision": laboratory_store.current_revision(),
    }


@app.get("/api/laboratory/recommendations/{recommendation_id}")
def get_laboratory_recommendation(
    recommendation_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    recommendation = laboratory_store.get_recommendation(recommendation_id)
    if not recommendation:
        raise HTTPException(status_code=404, detail="Laboratory recommendation not found")
    return recommendation


@app.post("/api/laboratory/recommendations/{recommendation_id}/read")
def read_laboratory_recommendation(
    recommendation_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    if not laboratory_store.mark_recommendation_read(recommendation_id):
        raise HTTPException(status_code=404, detail="Laboratory recommendation not found")
    return {"read": True, "revision": laboratory_store.current_revision()}


@app.post("/api/laboratory/recommendations/{recommendation_id}/decision")
def decide_laboratory_recommendation(
    recommendation_id: str,
    payload: LaboratoryDecisionPayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    if not laboratory_store.decide_recommendation(
        recommendation_id,
        decision=payload.decision,
        notes=payload.notes.strip(),
    ):
        raise HTTPException(status_code=409, detail="Recommendation cannot be decided")
    return {"decided": True, "revision": laboratory_store.current_revision()}


@app.post("/api/laboratory/calibrations/{version_id}/rollback")
def rollback_laboratory_calibration(
    version_id: str,
    payload: LaboratoryRollbackPayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    active = laboratory_store.active_calibration()
    if active["id"] != version_id:
        raise HTTPException(status_code=409, detail="Only the active calibration can be rolled back")
    reverted = laboratory_store.rollback_calibration(
        actor="admin",
        reason=payload.reason.strip(),
    )
    if not reverted:
        raise HTTPException(status_code=409, detail="No previous calibration is available")
    recommendation = laboratory_store.create_recommendation(
        recommendation_type="rollback",
        status="reverted",
        title="Calibração revertida",
        summary=f"A versão ativa voltou para {reverted['label']}.",
        rationale=payload.reason.strip(),
        calibration_version_id=reverted["id"],
    )
    laboratory_store.create_notification(
        event_type="calibration_rolled_back",
        title="Calibração revertida",
        body=payload.reason.strip(),
        recommendation_id=recommendation["id"],
    )
    return {
        "reverted_to": reverted,
        "revision": laboratory_store.current_revision(),
    }


@app.get("/api/laboratory/notifications")
def list_laboratory_notifications(
    limit: int = 50,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    return {
        "notifications": laboratory_store.list_notifications(limit=limit),
        "revision": laboratory_store.current_revision(),
    }


@app.post("/api/laboratory/notifications/read")
def read_laboratory_notifications(
    payload: LaboratoryNotificationReadPayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    count = laboratory_store.mark_notifications_read(payload.ids or None)
    return {
        "read": count,
        "revision": laboratory_store.current_revision(),
    }


@app.post("/api/research/invites")
def create_research_invite(
    payload: CreateResearchInvitePayload,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    participant_code = payload.participant_code.strip().upper() if payload.participant_code else None
    if participant_code and not re.fullmatch(r"[A-Z0-9-]{2,12}", participant_code):
        raise HTTPException(status_code=422, detail="Invalid participant code")
    try:
        return study_store.create_invite(participant_code, payload.expires_in_days)
    except sqlite3.IntegrityError as error:
        raise HTTPException(status_code=409, detail="Participant code already exists") from error


@app.get("/api/research/invites")
def list_research_invites(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    return {"invites": study_store.list_invites()}


@app.get("/api/research/sessions/{session_id}")
def get_research_session_detail(
    session_id: str,
    x_research_key: str | None = Header(default=None),
):
    _require_research_admin(x_research_key)
    session = study_store.get_research_session_detail(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Research session not found")
    return session


@app.get("/api/study/results")
def get_public_study_results():
    return study_store.get_public_results()


@app.get("/api/study/invites/{token}")
def get_study_invite(token: str):
    invite = study_store.get_public_invite(token)
    if not invite:
        raise HTTPException(status_code=404, detail="Study invitation not found")
    return invite


@app.post("/api/study/invites/{token}/enroll")
def enroll_study_participant(token: str, payload: StudyEnrollmentPayload):
    if payload.primary_area not in ALLOWED_PRIMARY_AREAS:
        raise HTTPException(status_code=422, detail="Invalid primary area")
    if payload.experience_range not in ALLOWED_EXPERIENCE_RANGES:
        raise HTTPException(status_code=422, detail="Invalid experience range")
    if payload.design_system_experience not in ALLOWED_DS_EXPERIENCE:
        raise HTTPException(status_code=422, detail="Invalid design-system experience")
    if payload.design_system_frequency not in ALLOWED_DS_FREQUENCY:
        raise HTTPException(status_code=422, detail="Invalid design-system frequency")
    if payload.company_disclosure and not (payload.company_name or "").strip():
        raise HTTPException(status_code=422, detail="Company name is required when disclosure is enabled")
    if not all(
        (
            payload.confirms_adult,
            payload.consent_academic_use,
            payload.consent_interaction_recording,
            payload.consent_voluntary,
        )
    ):
        raise HTTPException(status_code=422, detail="All consent confirmations are required")

    try:
        return study_store.enroll(token, payload.model_dump())
    except ValueError as error:
        statuses = {
            "invite_not_found": 404,
            "invite_revoked": 410,
            "invite_expired": 410,
            "invite_already_used": 409,
        }
        code = str(error)
        raise HTTPException(status_code=statuses.get(code, 400), detail=code) from error


@app.get("/api/study/sessions/{session_id}")
def get_study_session(session_id: str, authorization: str | None = Header(default=None)):
    session = study_store.get_session(session_id, _study_access_token(authorization))
    if not session:
        raise HTTPException(status_code=404, detail="Study session not found")
    return session


@app.post("/api/study/sessions/{session_id}/events", status_code=202)
def record_study_event(
    session_id: str,
    payload: StudyEventPayload,
    authorization: str | None = Header(default=None),
):
    if payload.event_type not in ALLOWED_STUDY_EVENTS:
        raise HTTPException(status_code=422, detail="Unsupported study event")
    serialized = json.dumps(payload.metadata, ensure_ascii=True)
    if len(serialized.encode("utf-8")) > 50_000:
        raise HTTPException(status_code=413, detail="Study event metadata is too large")
    recorded = study_store.append_event(
        session_id,
        _study_access_token(authorization),
        payload.event_type,
        payload.path,
        payload.metadata,
    )
    if not recorded:
        raise HTTPException(status_code=404, detail="Study session not found")
    return {"recorded": True, "consent_version": CONSENT_VERSION}


@app.post("/api/chat")
async def chat(payload: dict) -> StreamingResponse:
    if not API_KEY:
        async def _err():
            yield _sse_payload({"error": "GROQ_API_KEY não definida. Inicie o servidor com GROQ_API_KEY=gsk_..."})

        return StreamingResponse(_err(), media_type="text/event-stream")

    raw_messages = payload.get("messages", [])
    messages = _trim_history(raw_messages if isinstance(raw_messages, list) else [])
    profile = payload.get("profile", "general")
    command_mode = payload.get("command_mode")
    explicit_calibration = _sanitize_calibration(payload.get("calibration"))
    raw_query = _last_user_query(messages)
    manual_override = parse_manual_override(raw_query)
    query = _model_query_from_override(raw_query, manual_override.clean_query)
    if query != raw_query:
        messages = _replace_last_user_query(messages, query)
    route = route_query(query, profile=profile, command_mode=command_mode)
    active_calibration = laboratory_store.active_calibration()
    calibration_override = merge_profile_calibration(
        route.persona_profile,
        active_calibration.get("calibration"),
        explicit_calibration,
    )
    cognition = build_cognitive_orchestration(
        query=query,
        route=route,
        messages=messages,
        manual_override=manual_override,
    )
    chunks = _build_chunks(query, route, cognition)
    groq_messages = _build_groq_messages(
        messages, query, route, cognition, chunks,
        calibration_override=calibration_override,
    )

    active_engine = resolve_engine(route.active_command_mode)

    async def stream() -> AsyncGenerator[str, None]:
        # ||| XAI attribution | emitted before text so the frontend can build audit state.
        # Always carries the disclosed cognitive skills + active oracle engine, even
        # when no chunks were retrieved, so the UI can surface the reasoning signal.
        meta: dict = {
            "intent": route.response_intent,
            "catalog_mode": route.catalog_mode,
            "engine": active_engine.id if active_engine else None,
            "cognitive_skills": list(cognition.active_skills),
            "calibration_version": active_calibration.get("id"),
        }
        if chunks:
            meta["sources"] = serialize_sources(chunks)
        yield _sse_payload(meta)

        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                async with client.stream(
                    "POST",
                    GROQ_URL,
                    headers={
                        "Authorization": f"Bearer {API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": MODEL,
                        "max_tokens": _max_tokens_for_response(route.catalog_mode, route.active_command_mode),
                        "stream": True,
                        "messages": groq_messages,
                    },
                ) as resp:
                    if resp.status_code == 401:
                        yield _sse_payload({"error": "GROQ_API_KEY inválida (401). Verifique a chave."})
                        return
                    if resp.status_code == 429:
                        yield _sse_payload({"error": "Limite de requisições Groq atingido (429). Aguarde alguns segundos e tente novamente."})
                        return
                    if resp.status_code >= 400:
                        yield _sse_payload({"error": f"Erro Groq HTTP {resp.status_code}. Tente novamente."})
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data = line[6:].strip()
                        if data == "[DONE]":
                            yield "data: [DONE]\n\n"
                            break
                        try:
                            parsed = json.loads(data)
                            text = parsed["choices"][0]["delta"].get("content")
                            if text:
                                yield _sse_payload({"delta": text})
                        except Exception:
                            pass
            except httpx.TimeoutException:
                yield _sse_payload({"error": "Timeout na requisição ao Groq (60s). Tente novamente."})
            except httpx.ConnectError:
                yield _sse_payload({"error": "Sem conexão com a API Groq. Verifique sua internet."})

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
