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
import math
import os
import re
import resource
import secrets
import sqlite3
import sys
import traceback
from contextlib import asynccontextmanager
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from typing import AsyncGenerator, Literal

import chromadb
import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, field_validator

from agent.evidence import evidence_tier
from agent.navigation_actions import serialize_navigation_payload
from agent.models import AgentChatRequest, CreateDecisionRecordInput, DecisionPatch
from agent.registry import ToolRegistry
from agent.pending_intent import (
    PendingIntentResolution,
    apply_pending_resolution_to_route,
    resolve_conversational_reference,
)
from agent.runtime import AgentRuntime
from agent.store import DecisionConflictError, agent_store
from agent.tools import (
    build_compare_design_options_tool,
    build_create_decision_record_tool,
    build_search_component_tool,
    build_search_design_decision_tool,
    build_search_explainability_tool,
    build_search_pattern_tool,
    build_search_token_tool,
    build_validate_design_system_tool,
)
from cognition.engines.registry import resolve_engine
from cognition.orchestration.reasoning_engine import CognitiveOrchestrationResult, build_cognitive_orchestration
from cognition.orchestration.skill_application import filter_applied_skills
from cognition.overrides.manual_override_parser import parse_manual_override
from laboratory.automation import LaboratoryAutomation
from laboratory.calibration import merge_profile_calibration
from laboratory.cases import list_case_sets, load_case_set
from laboratory.runner import LaboratoryRunner, RateLimitError
from laboratory.store import laboratory_store
from prompts.intent_router import route_query
from prompts.perspective_ids import CANONICAL_PERSPECTIVE_IDS, normalize_profile_id
from prompts.perspective_contracts import build_response_audit_metadata
from prompts.perspective_health import build_perspective_health_payload
from prompts.prompt_builder import (
    PromptBuildContext,
    build_surface_context_block,
    build_system_prompt,
)
from rag.bootstrap import bootstrap_collection, corpus_available
from rag.chroma_config import chroma_db_path, chroma_runtime_paths
from rag.embedding_provider import (
    create_embedding_provider,
    dense_vectors,
    embedder_label,
    embedding_mode,
)
from rag.context_builder import (
    build_dialogue_context,
    build_perspective_evidence_block,
    build_rag_context,
    semantic_source_label,
    serialize_sources,
)
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
# Persist the vector store on a durable path in production (e.g. a mounted disk)
# so the startup bootstrap runs once instead of on every restart.
DB_PATH = chroma_db_path()
COLLECTION_NAME = "aetheris_design_system"
MAX_HISTORY_MESSAGES = 16
GROQ_MAX_REQUEST_BYTES = int(os.environ.get("GROQ_MAX_REQUEST_BYTES", "120000"))
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
# Minimum top-chunk similarity for queries that the agent also classified as
# out_of_scope. Below this threshold the LLM call is skipped entirely and a
# canned boundary response is returned, saving tokens and avoiding
# hallucinated design-system answers.  Conservative default (0.22) means only
# clearly off-topic queries are gated; raise toward 0.30 after reviewing logs.
DOMAIN_GATE_THRESHOLD = float(os.environ.get("DOMAIN_GATE_THRESHOLD", "0.22"))

def _log_memory(label: str) -> None:
    """Print live RSS (Linux /proc) or peak RSS (macOS resource module) in MB."""
    try:
        rss_mb: float | None = None
        try:
            text = Path("/proc/self/status").read_text()
            for line in text.splitlines():
                if line.startswith("VmRSS:"):
                    rss_mb = int(line.split()[1]) / 1024
                    break
        except OSError:
            pass
        if rss_mb is None:
            usage = resource.getrusage(resource.RUSAGE_SELF).ru_maxrss
            rss_mb = usage / (1024 * 1024) if sys.platform == "darwin" else usage / 1024
        print(f"[mem:{label}] {rss_mb:.0f} MB")
    except Exception:
        pass


# ||| Global state | initialized at startup
_chroma: chromadb.ClientAPI | None = None
_collection: chromadb.Collection | None = None
_embedder = None
_rag_ready = False
_embedding_mode = "local"
_bootstrap_running = False
_bootstrap_status: dict[str, object] = {
    "state": "not_started",
    "started_at": None,
    "finished_at": None,
    "last_error": None,
    "last_indexed": 0,
    "attempts": 0,
}
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


def _query_with_surface_context(query: str, surface_context: dict | None) -> str:
    if not surface_context:
        return query
    entity_name = str(surface_context.get("entity_name") or "").strip()
    if not entity_name:
        return query
    from agent.entity_validation_gate import is_deictic_artifact_reference
    from agent.understanding import normalize_query

    normalized = normalize_query(query)
    if not is_deictic_artifact_reference(normalized):
        return query
    if entity_name.lower() in normalized:
        return query
    entity_type = str(surface_context.get("entity_type") or "component").strip()
    return f"{query}\n\nContexto de superfície: {entity_type}={entity_name}"


def _fit_groq_messages(
    messages: list[dict],
    *,
    max_bytes: int = GROQ_MAX_REQUEST_BYTES,
) -> list[dict]:
    def payload_size(msgs: list[dict]) -> int:
        return len(
            json.dumps({"messages": msgs}, ensure_ascii=False).encode("utf-8")
        )

    fitted = [dict(message) for message in messages]
    while payload_size(fitted) > max_bytes and len(fitted) > 2:
        if fitted[1].get("role") != "user":
            break
        fitted.pop(1)
        if len(fitted) > 1 and fitted[1].get("role") == "assistant":
            fitted.pop(1)

    if payload_size(fitted) <= max_bytes:
        return fitted

    system = dict(fitted[0])
    content = str(system.get("content", ""))
    budget = max(8_000, max_bytes // 2)
    if len(content) > budget:
        system["content"] = (
            content[:budget]
            + "\n\n[contexto truncado para caber no limite da API Groq]"
        )
        fitted[0] = system
    return fitted


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


_DOMAIN_GATE_MESSAGES: dict[str, str] = {
    "pt-BR": (
        "Esta pergunta está fora do meu domínio. "
        "Abraxos orienta sobre o sistema de design Velaris: "
        "componentes, tokens, padrões, decisões de design e acessibilidade."
    ),
    "pt-PT": (
        "Esta pergunta está fora do meu domínio. "
        "Abraxos orienta sobre o sistema de design Velaris: "
        "componentes, tokens, padrões, decisões de design e acessibilidade."
    ),
    "es": (
        "Esta pregunta está fuera de mi dominio. "
        "Abraxos orienta sobre el sistema de diseño Velaris: "
        "componentes, tokens, patrones, decisiones de diseño y accesibilidad."
    ),
    "fr": (
        "Cette question est en dehors de mon domaine. "
        "Abraxos guide sur le système de design Velaris: "
        "composants, tokens, patterns, décisions de design et accessibilité."
    ),
    "en": (
        "This question is outside my domain. "
        "Abraxos guides on the Velaris design system: "
        "components, tokens, patterns, design decisions and accessibility."
    ),
}


def _domain_gate_response(language: str) -> str:
    return _DOMAIN_GATE_MESSAGES.get(language, _DOMAIN_GATE_MESSAGES["en"])


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


def _governance_alerts_block(route) -> str:
    """Inject pre-computed governance alerts for the Governance Agent engine."""
    engine = resolve_engine(route.active_command_mode)
    if engine is None or not engine.needs_governance_alerts:
        return ""
    from agent.governance_agent import build_governance_alerts_block

    return build_governance_alerts_block()


def _build_groq_messages(
    messages: list[dict],
    query: str,
    route,
    cognition: CognitiveOrchestrationResult,
    chunks: list[dict],
    calibration_override: dict | None = None,
    agent_context: str = "",
    surface_context: dict | None = None,
) -> list[dict]:
    rag_context = "" if agent_context else build_rag_context(
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
        answer_strategy=route.understanding.answer_strategy,
        language=route.understanding.language,
        cognitive_context=cognition.prompt_context,
        dialogue_context=build_dialogue_context(messages),
        agent_context=agent_context,
        calibration_override=calibration_override,
        evidence_metrics_block=_evidence_metrics_block(route, chunks),
        governance_alerts_block=_governance_alerts_block(route),
        perspective_evidence_block=build_perspective_evidence_block(chunks),
        surface_context_block=build_surface_context_block(surface_context),
        decision_analysis_mode=route.understanding.decision_analysis_mode,
        architect_review_mode=route.understanding.architect_review_mode,
    )
    system_content = build_system_prompt(prompt_context)
    return [{"role": "system", "content": system_content}] + messages


def _agent_retriever_for_route(route):
    def retrieve(query: str, intent: str, top_k: int, profile: str) -> list[dict]:
        if route.catalog_mode:
            catalog_entity = {
                "component_guidance": "components",
                "pattern_guidance": "patterns",
                "token_lookup": "tokens",
            }.get(intent, route.catalog_entity)
            return retrieve_catalog_chunks(
                collection=_collection,
                catalog_entity=catalog_entity,
                profile=profile,
            )
        return retrieve_chunks(
            collection=_collection,
            embedder=_embedder,
            rag_ready=_rag_ready,
            query=query,
            intent=intent,
            top_k=top_k,
            profile=profile,
        )

    return retrieve


def _build_agent_registry(route) -> ToolRegistry:
    retrieve = _agent_retriever_for_route(route)
    registry = ToolRegistry()
    for definition in (
        build_search_component_tool(retrieve),
        build_search_design_decision_tool(retrieve),
        build_search_explainability_tool(retrieve),
        build_search_pattern_tool(retrieve),
        build_search_token_tool(retrieve),
        build_compare_design_options_tool(retrieve),
        build_validate_design_system_tool(retrieve),
        build_create_decision_record_tool(agent_store),
    ):
        registry.register(definition)
    return registry


def _agent_chunks(context) -> list[dict]:
    if not context.execution:
        return []
    return [
        {
            "text": item.semantic_text,
            "component_id": item.component_id,
            "title": item.title,
            "source": item.source,
            "page_type": item.page_type,
            "status": item.status,
            "similarity": item.similarity,
            "retrieval_weight": item.retrieval_weight,
            "weighted_score": item.weighted_score,
        }
        for item in context.execution.evidence
    ]


def _agent_sources(context) -> list[dict]:
    if not context.execution:
        return []
    return [
        {
            "title": item.title,
            "source": semantic_source_label(item.page_type),
            "origin": item.source,
            "excerpt": item.excerpt,
            "similarity": item.similarity,
            "evidence_tier": evidence_tier(
                item.similarity,
                has_results=True,
            ),
            "page_type": item.page_type,
            "retrieval_weight": item.retrieval_weight,
            "weighted_score": item.weighted_score,
        }
        for item in context.execution.evidence
    ]


def _rule_similarity_scorer(query: str, texts: list[str]) -> list[float]:
    if not _rag_ready or _embedder is None or not texts:
        return []
    result = _embedder.encode(
        [query, *texts],
        return_dense=True,
        return_sparse=False,
        return_colbert_vecs=False,
    )
    vectors = dense_vectors(result)
    query_vector = vectors[0]
    query_norm = math.sqrt(sum(float(value) ** 2 for value in query_vector))
    scores: list[float] = []
    for vector in vectors[1:]:
        vector_norm = math.sqrt(sum(float(value) ** 2 for value in vector))
        denominator = query_norm * vector_norm
        if denominator == 0:
            scores.append(0.0)
            continue
        dot_product = sum(
            float(left) * float(right)
            for left, right in zip(query_vector, vector, strict=True)
        )
        scores.append(max(0.0, min(1.0, dot_product / denominator)))
    return scores


def _merge_audit_metadata(agent_metadata, perspective_metadata: dict | None = None) -> dict:
    payload = agent_metadata.model_dump(mode="json")
    if perspective_metadata:
        payload.update(perspective_metadata)
    return payload


def _build_response_audit_metadata(
    profile: str,
    response_text: str,
    cognition: CognitiveOrchestrationResult,
) -> dict:
    applied_skills = filter_applied_skills(
        response_text,
        cognition.active_skills,
    )
    return build_response_audit_metadata(
        profile,
        response_text,
        (
            str(skill.get("id", ""))
            for skill in applied_skills
            if skill.get("id")
        ),
    )


def _applied_cognitive_skills(
    response_text: str,
    cognition: CognitiveOrchestrationResult,
) -> list[dict]:
    return list(filter_applied_skills(response_text, cognition.active_skills))


def _composition_failure_events(
    *,
    runtime: AgentRuntime,
    agent_context,
    profile: str,
    cognition: CognitiveOrchestrationResult,
    limitation: str,
    error_message: str,
) -> list[str]:
    fallback = runtime.finalize_provider_fallback(
        agent_context,
        limitation=limitation,
    )
    if fallback:
        response_text, final_audit = fallback
        perspective_audit = _build_response_audit_metadata(
            profile,
            response_text,
            cognition,
        )
        return [
            _sse_payload({"delta": response_text}),
            _sse_payload({
                "final": True,
                "cognitive_skills": _applied_cognitive_skills(
                    response_text,
                    cognition,
                ),
                "audit_metadata": _merge_audit_metadata(
                    final_audit,
                    perspective_audit,
                ),
                **serialize_navigation_payload(
                    agent_context.navigation_action,
                    agent_context.secondary_navigation_actions,
                ),
            }),
            "data: [DONE]\n\n",
        ]

    final_audit = runtime.finalize_failure(
        agent_context,
        limitation=limitation,
    )
    return [
        _sse_payload({
            "error": error_message,
            "request_id": agent_context.request_id,
            "audit_metadata": _merge_audit_metadata(final_audit),
            **serialize_navigation_payload(
                agent_context.navigation_action,
                agent_context.secondary_navigation_actions,
            ),
        })
    ]


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
        "cognitive_skills": _applied_cognitive_skills(answer_text, cognition),
        "sources": serialize_sources(chunks),
        "evidence_metrics": evidence_metrics,
        "audit_metadata": _build_response_audit_metadata(
            route.persona_profile,
            answer_text,
            cognition,
        ),
        "prompt_tokens": int(usage.get("prompt_tokens", 0) or 0),
        "completion_tokens": int(usage.get("completion_tokens", 0) or 0),
    }


async def _bootstrap_corpus_background() -> None:
    global _bootstrap_running, _bootstrap_status
    if _collection is None or _embedder is None:
        return
    _bootstrap_running = True
    _bootstrap_status = {
        **_bootstrap_status,
        "state": "running",
        "started_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
        "finished_at": None,
        "last_error": None,
        "last_indexed": 0,
        "attempts": int(_bootstrap_status.get("attempts", 0) or 0) + 1,
    }
    try:
        indexed = await asyncio.to_thread(bootstrap_collection, _collection, _embedder)
        total = _collection.count()
        _bootstrap_status = {
            **_bootstrap_status,
            "state": "ready" if total > 0 else "empty",
            "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
            "last_error": None,
            "last_indexed": indexed,
        }
        print(
            f"✅ Bootstrap concluído: {indexed} chunks indexados ({total} no total)"
        )
        _log_memory("bootstrap-done")
    except Exception as error:
        stack_trace = traceback.format_exc()
        _bootstrap_status = {
            **_bootstrap_status,
            "state": "failed",
            "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
            "last_error": stack_trace,
            "last_indexed": 0,
        }
        print(
            f"⚠️  Falha no bootstrap do corpus "
            f"({type(error).__name__}): {error}"
        )
        print(stack_trace)
    finally:
        _bootstrap_running = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _chroma, _collection, _embedder, _rag_ready
    global _embedding_mode, _bootstrap_running, _bootstrap_status
    global _laboratory_runner, _laboratory_automation

    study_store.initialize()
    print(f"Research database ready: {study_store.db_path}")
    agent_store.initialize()
    print(f"Agent database ready: {agent_store.db_path}")
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
            _bootstrap_status = {**_bootstrap_status, "state": "skipped"}
        else:
            print("🗄️  Carregando ChromaDB...")
            print(f"   DB_PATH={DB_PATH}")
            print(
                "   CHROMA_DB_PATH="
                f"{os.environ.get('CHROMA_DB_PATH') or '<unset; using default>'}"
            )
            DB_PATH.mkdir(parents=True, exist_ok=True)
            _chroma = chromadb.PersistentClient(path=str(DB_PATH))
            _collection = _chroma.get_or_create_collection(
                COLLECTION_NAME,
                metadata={"hnsw:space": "cosine"},
            )
            collection_count = _collection.count()
            print(f"✅ ChromaDB: {collection_count} chunks indexados")
            if collection_count > 0:
                _bootstrap_status = {
                    **_bootstrap_status,
                    "state": "ready",
                    "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                    "last_error": None,
                    "last_indexed": 0,
                }
            _log_memory("chroma-ready")

            _embedding_mode = embedding_mode()
            try:
                if _embedding_mode == "api":
                    print("🔗 Modo de embeddings: Hugging Face Inference API")
                    print(
                        "[production-lite] FlagEmbedding/torch nao carregados "
                        "-- embeddings via HF API, RAG dentro de 2 GB"
                    )
                else:
                    print("🧠 Modo de embeddings: BGE-M3 local (FlagEmbedding)...")
                _embedder = create_embedding_provider()
                _rag_ready = True
                print(f"✅ Embedding provider pronto ({embedder_label(_embedder)})")
                _log_memory("embedder-ready")

                if _collection.count() == 0 and corpus_available():
                    if _embedding_mode == "api":
                        print(
                            "📚 Bootstrap do corpus via API em background "
                            "(o servidor abre enquanto indexa)..."
                        )
                        asyncio.create_task(_bootstrap_corpus_background())
                    else:
                        print(
                            "📚 Coleção vazia: reconstruindo índice a partir "
                            "do corpus versionado..."
                        )
                        _bootstrap_running = True
                        _bootstrap_status = {
                            **_bootstrap_status,
                            "state": "running",
                            "started_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                            "finished_at": None,
                            "last_error": None,
                            "last_indexed": 0,
                            "attempts": int(_bootstrap_status.get("attempts", 0) or 0) + 1,
                        }
                        try:
                            indexed = bootstrap_collection(_collection, _embedder)
                            total = _collection.count()
                            _bootstrap_status = {
                                **_bootstrap_status,
                                "state": "ready" if total > 0 else "empty",
                                "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                                "last_error": None,
                                "last_indexed": indexed,
                            }
                            print(
                                f"✅ Bootstrap concluído: {indexed} chunks indexados "
                                f"({total} no total)"
                            )
                            _log_memory("bootstrap-done")
                        except Exception as error:
                            stack_trace = traceback.format_exc()
                            _bootstrap_status = {
                                **_bootstrap_status,
                                "state": "failed",
                                "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                                "last_error": stack_trace,
                                "last_indexed": 0,
                            }
                            print(
                                f"⚠️  Falha no bootstrap do corpus "
                                f"({type(error).__name__}): {error}"
                            )
                            print(stack_trace)
                        finally:
                            _bootstrap_running = False
                elif _collection.count() == 0:
                    _bootstrap_status = {**_bootstrap_status, "state": "no_corpus"}
            except ImportError:
                _embedder = None
                _rag_ready = False
                _bootstrap_status = {
                    **_bootstrap_status,
                    "state": "embedding_unavailable",
                    "last_error": traceback.format_exc(),
                    "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                }
                print(
                    "⚠️  FlagEmbedding não instalado: use AETHERIS_EMBEDDING_MODE=api "
                    "ou pip install FlagEmbedding"
                )
            except Exception as error:
                _embedder = None
                _rag_ready = False
                _bootstrap_status = {
                    **_bootstrap_status,
                    "state": "embedding_failed",
                    "last_error": traceback.format_exc(),
                    "finished_at": datetime.now(tz=timezone.utc).isoformat(timespec="seconds"),
                }
                print(
                    "⚠️  Falha ao inicializar embeddings "
                    f"({type(error).__name__}): {error}. "
                    "RAG desativado; respostas usarão o catálogo canônico."
                )
                print(_bootstrap_status["last_error"])
        yield
    finally:
        if _laboratory_automation:
            await _laboratory_automation.stop()
        print("🛑 Shutting down Beatrice server")


# ||| FastAPI app
app = FastAPI(title="Beatrice Chat Server", version="2.3.0", lifespan=lifespan)

# CORS - configurable via ALLOWED_ORIGINS (comma-separated). Defaults to "*"
# so the public prototype works out of the box; set it to the frontend origin(s)
# in production to lock it down. We never use credentialed requests, so "*" is
# safe here. Example: ALLOWED_ORIGINS="https://aetheris-app.onrender.com"
_allowed_origins_raw = os.environ.get("ALLOWED_ORIGINS", "*").strip()
ALLOWED_ORIGINS = (
    ["*"]
    if _allowed_origins_raw in ("", "*")
    else [origin.strip() for origin in _allowed_origins_raw.split(",") if origin.strip()]
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _catalog_health() -> tuple[bool, int]:
    try:
        from component_metadata import component_catalog

        components = component_catalog().components
        return True, len(components)
    except Exception as error:
        print(f"[beatrice:health] catalog load error: {error}")
        return False, 0


def _last_indexed_at() -> str | None:
    dump_path = RAG_DIR / "aetheris-docs-dump.json"
    if not dump_path.exists():
        return None

    return datetime.fromtimestamp(
        dump_path.stat().st_mtime, tz=timezone.utc
    ).isoformat(timespec="seconds")


def _bootstrap_snapshot() -> dict[str, object]:
    return dict(_bootstrap_status)


def _health_payload() -> dict:
    try:
        count = _collection.count() if _collection else 0
        collection_loaded = _collection is not None
    except Exception as error:
        print(f"[beatrice:health] collection error: {error}")
        count = 0
        collection_loaded = False
    catalog_loaded, total_components = _catalog_health()
    automation = _laboratory_automation.status() if _laboratory_automation else {
        "enabled": LABORATORY_AUTOMATION_ENABLED,
        "paused": False,
        "next_slot": None,
        "active_calibration_version_id": None,
    }
    runtime_paths = chroma_runtime_paths()
    bootstrap = _bootstrap_snapshot()
    return {
        "status": "ok",
        "service": "beatrice-chat-server",
        **runtime_paths,
        "model": MODEL,
        "laboratory_model": LABORATORY_MODEL,
        "corpus_chunks": count,
        "rag_active": _rag_ready and count > 0,
        "embedder": embedder_label(_embedder) if _rag_ready else "none",
        "embedding_mode": _embedding_mode,
        "embedding_provider": os.environ.get("HF_INFERENCE_PROVIDER", "hf-inference")
        if _embedding_mode == "api"
        else "local",
        "hf_api_token_present": bool(
            os.environ.get("HF_API_TOKEN", "").strip()
            or os.environ.get("HF_TOKEN", "").strip()
            or os.environ.get("HUGGINGFACE_API_KEY", "").strip()
        ),
        "bootstrap_status": bootstrap.get("state"),
        "bootstrap_last_error": bootstrap.get("last_error"),
        "bootstrap_started_at": bootstrap.get("started_at"),
        "bootstrap_finished_at": bootstrap.get("finished_at"),
        "bootstrap_last_indexed": bootstrap.get("last_indexed"),
        "bootstrap_attempts": bootstrap.get("attempts"),
        "corpus_bootstrap_running": _bootstrap_running,
        "catalog_loaded": catalog_loaded,
        "total_components": total_components,
        "vector_collection_loaded": collection_loaded,
        "vector_collection_count": count,
        "embedding_model_loaded": _embedder is not None,
        "active_llm_provider": "groq" if API_KEY else "none",
        "last_indexed_at": _last_indexed_at(),
        "prompt_architecture": "modular",
        "cognitive_orchestration": "adaptive-hybrid",
        "persona_context_engine": "operational-profiles",
        "agent_layer": {
            "enabled": True,
            "planner": "rule-based",
            "decision_store": "sqlite",
            "memory": "session-project",
        },
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


@app.get("/api/knowledge/health")
def knowledge_health():
    payload = _health_payload()
    dump_path = RAG_DIR / "aetheris-docs-dump.json"
    corpus_version = None
    corpus_product = None
    if dump_path.exists():
        try:
            dump = json.loads(dump_path.read_text(encoding="utf-8"))
            corpus_version = dump.get("version") or dump.get("meta", {}).get("extractor_version")
            corpus_product = dump.get("meta", {}).get("product_name")
        except (json.JSONDecodeError, OSError):
            corpus_version = None
            corpus_product = None
    warnings: list[dict[str, str]] = []
    if not payload["rag_active"]:
        warnings.append({"code": "rag_inactive", "message": "Vector retrieval is inactive."})
    if not payload["catalog_loaded"]:
        warnings.append({"code": "catalog_missing", "message": "Canonical catalog failed to load."})
    return {
        "status": payload["status"],
        "corpus": {
            "chunks": payload["corpus_chunks"],
            "corpus_version": corpus_version,
            "product_name": corpus_product,
            "last_indexed_at": payload["last_indexed_at"],
        },
        "decision_rules": __import__(
            "agent.decision_rules",
            fromlist=["decision_rules_health"],
        ).decision_rules_health(),
        "chromadb": {
            "loaded": payload["vector_collection_loaded"],
            "count": payload["vector_collection_count"],
            "embedder": payload["embedder"],
        },
        "catalog": {
            "loaded": payload["catalog_loaded"],
            "total_components": payload["total_components"],
        },
        "warnings": warnings,
    }


@app.get("/api/orchestration/health")
def orchestration_health():
    from agent.comprehension import orchestration_health_snapshot

    return {
        "status": "ok",
        **orchestration_health_snapshot(),
    }


@app.get("/api/knowledge/perspectives/health")
def perspectives_health():
    payload = build_perspective_health_payload(_collection)
    if payload["warnings"]:
        print(
            "[beatrice:health] perspective warnings: "
            + "; ".join(warning["code"] for warning in payload["warnings"])
        )
    return payload


@app.get("/api/knowledge/health/dashboard")
def knowledge_health_dashboard(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    from agent.knowledge_health import build_knowledge_health_dashboard

    return build_knowledge_health_dashboard(_collection)


@app.get("/api/governance/alerts")
def governance_alerts():
    from agent.governance_agent import build_governance_alerts

    return build_governance_alerts()


@app.get("/api/intelligence/lab/cases")
def intelligence_lab_cases(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    from agent.intelligence_lab import list_adversarial_cases

    return {"cases": list_adversarial_cases()}


@app.post("/api/intelligence/lab/run")
def run_intelligence_lab_suite(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    from agent.intelligence_lab import run_adversarial_suite

    return run_adversarial_suite()


@app.get("/api/intelligence/reliability-gates")
def intelligence_reliability_gates(x_research_key: str | None = Header(default=None)):
    _require_research_admin(x_research_key)
    from agent.reliability_gates import run_reliability_gates

    return run_reliability_gates(_collection)


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
    profiles: list[str] = Field(min_length=1, max_length=8)
    repetitions: Literal[1] = 1

    @field_validator("profiles", mode="before")
    @classmethod
    def canonical_profiles(cls, value):
        if not isinstance(value, list):
            return value
        return [normalize_profile_id(profile, default="") for profile in value]


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


class FeedbackPayload(BaseModel):
    rating: str = Field(pattern="^(up|down)$")
    request_id: str | None = Field(default=None, max_length=200)
    session_id: str = Field(default="default-session", min_length=1, max_length=200)
    project_id: str = Field(default="default", min_length=1, max_length=200)
    reason: str = Field(default="", max_length=2000)
    user_query: str = Field(default="", max_length=10_000)
    detected_intent: str = Field(default="", max_length=120)
    detected_language: str = Field(default="", max_length=20)
    corrected_intent: str | None = Field(default=None, max_length=120)


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
ALLOWED_LABORATORY_PROFILES = set(CANONICAL_PERSPECTIVE_IDS)
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


@app.post("/api/decisions", status_code=201)
def create_decision(payload: CreateDecisionRecordInput):
    return agent_store.create_decision(payload)


@app.get("/api/decisions")
def list_decisions(
    status: str | None = None,
    workflow: str | None = None,
    profile: str | None = None,
    project_id: str | None = None,
    limit: int = 50,
    offset: int = 0,
):
    return {
        "decisions": agent_store.list_decisions(
            status=status,
            workflow=workflow,
            profile=profile,
            project_id=project_id,
            limit=limit,
            offset=offset,
        )
    }


@app.get("/api/decisions/{decision_id}")
def get_decision(decision_id: str):
    decision = agent_store.get_decision(decision_id)
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision


@app.patch("/api/decisions/{decision_id}")
def update_decision(decision_id: str, payload: DecisionPatch):
    try:
        decision = agent_store.update_decision_status(decision_id, payload.status)
    except DecisionConflictError as error:
        raise HTTPException(status_code=409, detail=str(error)) from error
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision


@app.post("/api/feedback", status_code=201)
def create_feedback(payload: FeedbackPayload):
    try:
        return agent_store.record_feedback(
            rating=payload.rating,
            request_id=payload.request_id,
            session_id=payload.session_id,
            project_id=payload.project_id,
            reason=payload.reason,
            user_query=payload.user_query,
            detected_intent=payload.detected_intent,
            detected_language=payload.detected_language,
            corrected_intent=payload.corrected_intent,
        )
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


@app.get("/api/feedback")
def list_feedback(rating: str | None = None, limit: int = 200):
    return {"feedback": agent_store.list_feedback(rating=rating, limit=limit)}


@app.get("/api/feedback/summary")
def feedback_summary():
    return agent_store.feedback_summary()


@app.post("/api/chat")
async def chat(payload: AgentChatRequest) -> StreamingResponse:
    messages = _trim_history([
        message.model_dump(mode="json")
        for message in payload.messages
    ])
    profile = payload.profile
    command_mode = payload.command_mode
    explicit_calibration = _sanitize_calibration(payload.calibration)
    raw_query = _last_user_query(messages)
    manual_override = parse_manual_override(raw_query)
    query = _model_query_from_override(raw_query, manual_override.clean_query)
    query = _query_with_surface_context(query, payload.surface_context)
    if query != raw_query:
        messages = _replace_last_user_query(messages, query)
    pending_resolution = resolve_conversational_reference(messages)
    routing_query = pending_resolution.resolved_query if pending_resolution else query
    route = route_query(routing_query, profile=profile, command_mode=command_mode)
    if pending_resolution is not None:
        route = replace(
            route,
            retrieval_intent=pending_resolution.retrieval_intent,
            response_intent=pending_resolution.retrieval_intent,
            understanding=apply_pending_resolution_to_route(
                pending_resolution,
                understanding=route.understanding,
            ),
        )
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
    runtime = AgentRuntime(
        registry=_build_agent_registry(route),
        store=agent_store,
        model=MODEL,
        rule_scorer=_rule_similarity_scorer,
    )
    agent_context = runtime.prepare(
        query=routing_query,
        profile=route.persona_profile,
        routed_intent=route.response_intent,
        command_mode=route.active_command_mode,
        session_id=payload.session_id,
        project_id=payload.project_id,
        preferred_detail_level=payload.preferred_detail_level,
        catalog_mode=route.catalog_mode,
        understanding=route.understanding,
        pending_resolution=pending_resolution,
    )
    active_engine = resolve_engine(route.active_command_mode)

    async def stream() -> AsyncGenerator[str, None]:
        sources = _agent_sources(agent_context)
        initial_audit = agent_context.audit_metadata(
            execution_status=(
                "running" if agent_context.should_compose
                else agent_store.get_run(agent_context.request_id)["status"]
            )
        )
        meta: dict = {
            "intent": route.response_intent,
            "workflow": agent_context.plan.workflow,
            "tools_used": [
                tool.model_dump(mode="json")
                for tool in initial_audit.tools_used
            ],
            "catalog_mode": route.catalog_mode,
            "engine": active_engine.id if active_engine else None,
            "calibration_version": active_calibration.get("id"),
            "audit_metadata": _merge_audit_metadata(initial_audit),
        }
        if sources:
            meta["sources"] = sources
        yield _sse_payload(meta)

        if not agent_context.should_compose:
            deterministic_response = agent_context.deterministic_response or ""
            if agent_context.deterministic_response:
                yield _sse_payload({"delta": agent_context.deterministic_response})
            perspective_audit = _build_response_audit_metadata(
                route.persona_profile,
                deterministic_response,
                cognition,
            )
            yield _sse_payload({
                "final": True,
                "cognitive_skills": _applied_cognitive_skills(
                    deterministic_response,
                    cognition,
                ),
                "audit_metadata": _merge_audit_metadata(
                    agent_context.audit_metadata(
                        execution_status=agent_store.get_run(
                            agent_context.request_id
                        )["status"]
                    ),
                    perspective_audit,
                ),
                **serialize_navigation_payload(
                    agent_context.navigation_action,
                    agent_context.secondary_navigation_actions,
                ),
            })
            yield "data: [DONE]\n\n"
            return

        if not API_KEY:
            for event in _composition_failure_events(
                runtime=runtime,
                agent_context=agent_context,
                profile=route.persona_profile,
                cognition=cognition,
                limitation="GROQ_API_KEY is not configured.",
                error_message=(
                    "GROQ_API_KEY não definida. Inicie o servidor com "
                    "GROQ_API_KEY=gsk_..."
                ),
            ):
                yield event
            return

        runtime.start_composition(agent_context)
        _log_memory("pre-retrieval")
        chunks = _agent_chunks(agent_context)
        _log_memory("post-retrieval")

        top_similarity = chunks[0]["similarity"] if chunks else 0.0
        if (
            top_similarity < DOMAIN_GATE_THRESHOLD
            and route.understanding.user_intent == "out_of_scope"
        ):
            gate_text = _domain_gate_response(route.understanding.language)
            perspective_audit = _build_response_audit_metadata(
                route.persona_profile, gate_text, cognition
            )
            yield _sse_payload({"delta": gate_text})
            yield _sse_payload({
                "final": True,
                "cognitive_skills": [],
                "audit_metadata": _merge_audit_metadata(
                    agent_context.audit_metadata(execution_status="completed"),
                    perspective_audit,
                ),
                **serialize_navigation_payload(None, None),
            })
            yield "data: [DONE]\n\n"
            return

        groq_messages = _fit_groq_messages(
            _build_groq_messages(
                messages,
                query,
                route,
                cognition,
                chunks,
                calibration_override=calibration_override,
                agent_context=runtime.structured_context(agent_context),
                surface_context=payload.surface_context,
            )
        )
        generated_text: list[str] = []
        buffer_until_validation = (
            agent_context.plan.workflow in {
                "component_decision",
                "token_lookup",
                "decision_analysis",
            }
            or agent_context.decision_intelligence_active()
        )
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
                        "temperature": 0.0,
                        "stream": True,
                        "messages": groq_messages,
                    },
                ) as resp:
                    if resp.status_code == 401:
                        for event in _composition_failure_events(
                            runtime=runtime,
                            agent_context=agent_context,
                            profile=route.persona_profile,
                            cognition=cognition,
                            limitation="Groq rejected the configured API key.",
                            error_message=(
                                "GROQ_API_KEY inválida (401). Verifique a chave."
                            ),
                        ):
                            yield event
                        return
                    if resp.status_code == 429:
                        for event in _composition_failure_events(
                            runtime=runtime,
                            agent_context=agent_context,
                            profile=route.persona_profile,
                            cognition=cognition,
                            limitation="Groq rate limit was reached.",
                            error_message=(
                                "Limite de requisições Groq atingido (429). "
                                "Aguarde alguns segundos e tente novamente."
                            ),
                        ):
                            yield event
                        return
                    if resp.status_code >= 400:
                        for event in _composition_failure_events(
                            runtime=runtime,
                            agent_context=agent_context,
                            profile=route.persona_profile,
                            cognition=cognition,
                            limitation=f"Groq returned HTTP {resp.status_code}.",
                            error_message=(
                                "Erro Groq HTTP 413 (contexto muito grande). "
                                "Inicie uma conversa nova ou faça uma pergunta mais curta."
                                if resp.status_code == 413
                                else f"Erro Groq HTTP {resp.status_code}. Tente novamente."
                            ),
                        ):
                            yield event
                        return

                    async for line in resp.aiter_lines():
                        if not line.startswith("data: "):
                            continue
                        data = line[6:].strip()
                        if data == "[DONE]":
                            break
                        try:
                            parsed = json.loads(data)
                            text = parsed["choices"][0]["delta"].get("content")
                            if text:
                                generated_text.append(text)
                                if not buffer_until_validation:
                                    yield _sse_payload({"delta": text})
                        except Exception:
                            pass
            except httpx.TimeoutException:
                for event in _composition_failure_events(
                    runtime=runtime,
                    agent_context=agent_context,
                    profile=route.persona_profile,
                    cognition=cognition,
                    limitation="Groq request timed out after 60 seconds.",
                    error_message=(
                        "Timeout na requisição ao Groq (60s). Tente novamente."
                    ),
                ):
                    yield event
                return
            except httpx.ConnectError:
                for event in _composition_failure_events(
                    runtime=runtime,
                    agent_context=agent_context,
                    profile=route.persona_profile,
                    cognition=cognition,
                    limitation="The server could not connect to Groq.",
                    error_message=(
                        "Sem conexão com a API Groq. Verifique sua internet."
                    ),
                ):
                    yield event
                return

        generated_response = "".join(generated_text)
        response_text = runtime.validate_response(
            agent_context,
            generated_response,
        )
        if buffer_until_validation and response_text:
            yield _sse_payload({"delta": response_text})
        perspective_audit = _build_response_audit_metadata(
            route.persona_profile,
            response_text,
            cognition,
        )
        final_audit = runtime.finalize_success(agent_context, response_text)
        yield _sse_payload({
            "final": True,
            "cognitive_skills": _applied_cognitive_skills(
                response_text,
                cognition,
            ),
            "audit_metadata": _merge_audit_metadata(
                final_audit,
                perspective_audit,
            ),
            **serialize_navigation_payload(
                agent_context.navigation_action,
                agent_context.secondary_navigation_actions,
            ),
        })
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
