from __future__ import annotations

import asyncio
import time
from collections.abc import Awaitable, Callable
from datetime import datetime, timedelta, timezone
from typing import Any

from .cases import load_case_set
from .metrics import relational_scores, score_answer
from .store import LaboratoryStore


GenerationCallback = Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]
FinalizationCallback = Callable[[dict[str, Any]], Awaitable[None]]


class RateLimitError(RuntimeError):
    def __init__(self, message: str, *, retry_after_seconds: float = 60.0):
        super().__init__(message)
        self.retry_after_seconds = max(0.0, float(retry_after_seconds))


def classify_generation_error(error: Exception) -> str:
    message = str(error).lower()
    if "not configured" in message:
        return "missing_credentials"
    if "invalid" in message and ("key" in message or "credential" in message):
        return "invalid_credentials"
    if "rate limit" in message or "429" in message:
        return "rate_limit"
    if "timeout" in message:
        return "timeout"
    if "invalid response" in message or "empty answer" in message:
        return "invalid_response"
    return "provider_error"


class LaboratoryRunner:
    def __init__(
        self,
        store: LaboratoryStore,
        generate: GenerationCallback,
        on_finalized: FinalizationCallback | None = None,
        *,
        request_interval_seconds: float = 0.0,
        max_rate_limit_retries: int = 6,
    ):
        self.store = store
        self.generate = generate
        self.on_finalized = on_finalized
        self.request_interval_seconds = max(0.0, request_interval_seconds)
        self.max_rate_limit_retries = max(0, max_rate_limit_retries)
        self._lock = asyncio.Lock()
        self._tasks: dict[str, asyncio.Task[None]] = {}
        self._last_request_started = 0.0

    def schedule(self, run_id: str) -> None:
        existing = self._tasks.get(run_id)
        if existing and not existing.done():
            return
        task = asyncio.create_task(self.process(run_id))
        self._tasks[run_id] = task
        task.add_done_callback(lambda _: self._tasks.pop(run_id, None))

    async def process(self, run_id: str) -> None:
        async with self._lock:
            run = self.store.get_run(run_id, include_items=False)
            if not run or run["status"] not in {"queued", "running"}:
                return
            if run["status"] == "queued":
                self.store.start_run(run_id)
            case_set = load_case_set(run["case_set_id"])
            case_by_id = {case.id: case for case in case_set.cases}
            pace_provider_requests = True

            while not self.store.is_cancel_requested(run_id):
                item = self.store.next_queued_item(run_id)
                if not item:
                    break
                started = time.perf_counter()
                rate_limit_retries = 0
                while not self.store.is_cancel_requested(run_id):
                    if pace_provider_requests:
                        await self._pace_requests()
                    try:
                        generated = await self.generate(item)
                        duration_ms = round((time.perf_counter() - started) * 1000)
                        case = case_by_id[item["case_id"]]
                        evidence_metrics = generated.get("evidence_metrics", {})
                        metrics = score_answer(
                            case,
                            profile=item["profile"],
                            answer=generated["answer_text"],
                            sources=generated.get("sources", []),
                            evidence_confidence=evidence_metrics.get("confidence"),
                        )
                        metrics["intent_match"] = {
                            "value": 1.0 if generated.get("intent") == case.expected_intent else 0.0,
                            "status": "measured",
                            "rationale": (
                                f"Expected intent {case.expected_intent}; "
                                f"observed {generated.get('intent', '')}"
                            ),
                        }
                        self.store.complete_item(
                            item["id"],
                            answer_text=generated["answer_text"],
                            intent=generated.get("intent", ""),
                            cognitive_skills=generated.get("cognitive_skills", []),
                            evidence_metrics=evidence_metrics,
                            audit_metadata=generated.get("audit_metadata", {}),
                            sources=generated.get("sources", []),
                            metrics=metrics,
                            duration_ms=duration_ms,
                            prompt_tokens=int(generated.get("prompt_tokens", 0) or 0),
                            completion_tokens=int(generated.get("completion_tokens", 0) or 0),
                        )
                        break
                    except RateLimitError as error:
                        if rate_limit_retries >= self.max_rate_limit_retries:
                            self.store.fail_item(
                                item["id"],
                                str(error),
                                duration_ms=round((time.perf_counter() - started) * 1000),
                                error_category="rate_limit",
                            )
                            break
                        rate_limit_retries += 1
                        retry_after = max(error.retry_after_seconds, 0.0)
                        retry_at = datetime.now(timezone.utc) + timedelta(seconds=retry_after)
                        self.store.defer_item_for_rate_limit(
                            item["id"],
                            (
                                "Limite temporário da Groq. "
                                f"Nova tentativa em {round(retry_after)} segundo(s)."
                            ),
                            retry_after=retry_at.isoformat(timespec="seconds"),
                        )
                        if not await self._wait_for_retry(run_id, retry_after):
                            break
                        self.store.resume_rate_limited_item(item["id"])
                    except Exception as error:
                        duration_ms = round((time.perf_counter() - started) * 1000)
                        error_category = classify_generation_error(error)
                        if error_category in {"missing_credentials", "invalid_credentials"}:
                            pace_provider_requests = False
                        self.store.fail_item(
                            item["id"],
                            str(error),
                            duration_ms=duration_ms,
                            error_category=error_category,
                        )
                        break
                if self.store.is_cancel_requested(run_id):
                    self.store.cancel_active_item(item["id"])

            completed_items = self.store.successful_items(run_id)
            self.store.replace_relational_metrics(
                run_id,
                relational_scores(completed_items, case_by_id),
            )
            finalized = self.store.finalize_run(run_id)
            if finalized and self.on_finalized:
                try:
                    await self.on_finalized(finalized)
                except Exception as error:
                    self.store.create_notification(
                        event_type="automation_callback_failed",
                        title="Falha ao processar resultado automático",
                        body=str(error)[:500],
                        run_id=run_id,
                        deduplication_key=f"automation-callback:{run_id}",
                    )

    async def _pace_requests(self) -> None:
        elapsed = time.monotonic() - self._last_request_started
        remaining = self.request_interval_seconds - elapsed
        if remaining > 0:
            await asyncio.sleep(remaining)
        self._last_request_started = time.monotonic()

    async def _wait_for_retry(self, run_id: str, seconds: float) -> bool:
        deadline = time.monotonic() + seconds
        while True:
            if self.store.is_cancel_requested(run_id):
                return False
            remaining = deadline - time.monotonic()
            if remaining <= 0:
                return True
            await asyncio.sleep(min(remaining, 1.0))
