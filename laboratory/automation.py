from __future__ import annotations

import asyncio
import uuid
from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime, time, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

from .calibration import (
    build_proposal,
    evaluate_guardrails,
    perspective_objectives,
    validate_calibration,
)
from .cases import load_case_set
from .runner import LaboratoryRunner
from .store import LaboratoryStore


AUTOMATED_PROFILES = (
    "designer",
    "dev",
    "pm",
    "qa",
    "writer",
    "a11y",
    "maintainer",
)


@dataclass(frozen=True)
class AutomationSlot:
    index: int
    hour: int
    version_prefix: str
    repetitions: int


AUTOMATION_SLOTS = (
    AutomationSlot(1, 0, "candidate1", 1),
    AutomationSlot(2, 8, "candidate2", 1),
    AutomationSlot(3, 16, "candidate3", 1),
)


class LaboratoryAutomation:
    def __init__(
        self,
        *,
        store: LaboratoryStore,
        runner: LaboratoryRunner,
        prompt_fingerprint: Callable[[], str],
        model: str,
        credentials_ready: Callable[[], bool],
        enabled: bool = False,
        timezone_name: str = "Europe/Lisbon",
        case_set_id: str = "beatrice-core-v1",
        clock: Callable[[], datetime] | None = None,
        poll_seconds: float = 30.0,
    ):
        self.store = store
        self.runner = runner
        self.prompt_fingerprint = prompt_fingerprint
        self.model = model
        self.credentials_ready = credentials_ready
        self.enabled = enabled
        self.timezone = ZoneInfo(timezone_name)
        self.timezone_name = timezone_name
        self.case_set_id = case_set_id
        self.clock = clock or (lambda: datetime.now(timezone.utc))
        self.poll_seconds = poll_seconds
        self._task: asyncio.Task[None] | None = None

    def start(self) -> None:
        if not self.enabled or (self._task and not self._task.done()):
            return
        self._task = asyncio.create_task(self._loop())

    async def stop(self) -> None:
        if not self._task:
            return
        self._task.cancel()
        try:
            await self._task
        except asyncio.CancelledError:
            pass
        self._task = None

    async def _loop(self) -> None:
        while True:
            try:
                await self.tick()
            except Exception as error:
                self.store.create_notification(
                    event_type="automation_tick_failed",
                    title="Falha no agendamento do laboratório",
                    body=str(error)[:500],
                    deduplication_key=f"automation-tick:{self.local_now().date().isoformat()}",
                )
            await asyncio.sleep(self.poll_seconds)

    def local_now(self) -> datetime:
        value = self.clock()
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(self.timezone)

    def next_slot(self, now: datetime | None = None) -> dict[str, Any]:
        local_now = (now or self.local_now()).astimezone(self.timezone)
        for day_offset in (0, 1):
            day = local_now.date() + timedelta(days=day_offset)
            for slot in AUTOMATION_SLOTS:
                scheduled = datetime.combine(day, time(slot.hour), self.timezone)
                if scheduled > local_now:
                    return self._slot_metadata(slot, scheduled)
        raise RuntimeError("Unable to calculate next laboratory slot")

    def status(self) -> dict[str, Any]:
        state = self.store.automation_state()
        next_slot = self.next_slot()
        case_count = len(load_case_set(self.case_set_id).cases)
        return {
            "enabled": self.enabled,
            "paused": state["paused"],
            "pause_reason": state["pause_reason"],
            "pause_until": state["pause_until"],
            "timezone": self.timezone_name,
            "case_set_id": self.case_set_id,
            "next_slot": next_slot,
            "daily_estimated_calls": (
                case_count
                * len(AUTOMATED_PROFILES)
                * sum(slot.repetitions for slot in AUTOMATION_SLOTS)
            ),
            "active_calibration_version_id": state["active_calibration_version_id"],
            "revision": state["revision"],
        }

    async def tick(self, now: datetime | None = None) -> dict[str, Any] | None:
        if not self.enabled:
            return None
        local_now = (now or self.local_now()).astimezone(self.timezone)
        state = self.store.automation_state()
        if state["paused"]:
            pause_until = state.get("pause_until")
            if not pause_until or datetime.fromisoformat(pause_until) > local_now.astimezone(timezone.utc):
                return None
            self.store.set_automation_pause(False, actor="scheduler")

        if not self.credentials_ready():
            self.store.set_automation_pause(
                True,
                reason="GROQ_API_KEY is not configured",
                actor="scheduler",
            )
            self.store.create_notification(
                event_type="automation_paused",
                title="Automação pausada",
                body="A GROQ_API_KEY não está configurada no backend.",
                deduplication_key="automation-paused:missing-groq-key",
            )
            return None

        due = self._due_slot(local_now)
        if not due:
            return None
        slot, scheduled = due
        date_label = scheduled.date().isoformat()
        if self.store.get_schedule_slot(date_label, slot.index):
            return None
        claimed = self.store.claim_schedule_slot(
            schedule_date=date_label,
            slot_index=slot.index,
            scheduled_for=scheduled.astimezone(timezone.utc).isoformat(timespec="seconds"),
        )
        if not claimed:
            return None
        if self.store.has_active_run():
            self.store.update_schedule_slot(
                schedule_date=date_label,
                slot_index=slot.index,
                status="skipped",
                reason="Another laboratory run is active",
            )
            self.store.create_notification(
                event_type="schedule_skipped",
                title=f"{slot.version_prefix} não executada",
                body="A janela foi ignorada porque outra execução estava ativa.",
                deduplication_key=f"schedule-skipped:{date_label}:{slot.index}",
            )
            return None

        try:
            run = self._create_run(slot, date_label)
        except Exception as error:
            self.store.update_schedule_slot(
                schedule_date=date_label,
                slot_index=slot.index,
                status="failed",
                reason=str(error)[:500],
            )
            self.store.create_notification(
                event_type="schedule_failed",
                title=f"{slot.version_prefix} não pôde iniciar",
                body=str(error)[:500],
                deduplication_key=f"schedule-failed:{date_label}:{slot.index}",
            )
            return None

        self.store.update_schedule_slot(
            schedule_date=date_label,
            slot_index=slot.index,
            status="running",
            run_id=run["id"],
        )
        self.store.create_notification(
            event_type="scheduled_run_started",
            title=f"{run['version_label']} iniciada",
            body=f"{run['total_items']} combinações foram enfileiradas.",
            run_id=run["id"],
            deduplication_key=f"scheduled-started:{run['id']}",
        )
        self.runner.schedule(run["id"])
        return run

    def _due_slot(self, local_now: datetime) -> tuple[AutomationSlot, datetime] | None:
        for slot in AUTOMATION_SLOTS:
            scheduled = datetime.combine(local_now.date(), time(slot.hour), self.timezone)
            elapsed = local_now - scheduled
            if timedelta(0) <= elapsed <= timedelta(minutes=15):
                return slot, scheduled
        return None

    @staticmethod
    def _slot_metadata(slot: AutomationSlot, scheduled: datetime) -> dict[str, Any]:
        date_label = scheduled.date().isoformat()
        return {
            "index": slot.index,
            "version_label": f"{slot.version_prefix}-{date_label}",
            "repetitions": slot.repetitions,
            "scheduled_for": scheduled.isoformat(timespec="seconds"),
        }

    def _create_run(self, slot: AutomationSlot, schedule_date: str) -> dict[str, Any]:
        case_set = load_case_set(self.case_set_id)
        active_version = self.store.active_calibration()
        version = active_version
        proposal_id: str | None = None
        control_run_id: str | None = None

        if slot.index in (2, 3):
            proposal = self.store.proposal_for_date(schedule_date)
            if not proposal:
                raise RuntimeError("Candidate 1 has not produced a calibration proposal")
            control = self.store.get_run(proposal["control_run_id"], include_items=False)
            if not control or control["status"] != "completed":
                raise RuntimeError("Candidate 1 is not completed")
            proposal_id = proposal["id"]
            control_run_id = control["id"]
            if slot.index == 2:
                version = self.store.calibration_version(proposal["proposed_version_id"]) or active_version
            else:
                experiment = (
                    self.store.get_run(proposal["experiment_run_id"], include_items=False)
                    if proposal.get("experiment_run_id")
                    else None
                )
                if experiment and experiment["status"] == "completed" and proposal["status"] != "rejected":
                    version = self.store.calibration_version(proposal["proposed_version_id"]) or active_version
                else:
                    version = active_version
                    proposal_id = None

        return self.store.create_run(
            case_set=case_set,
            version_label=f"{slot.version_prefix}-{schedule_date}",
            profiles=list(AUTOMATED_PROFILES),
            repetitions=slot.repetitions,
            model=self.model,
            prompt_fingerprint=self.prompt_fingerprint(),
            origin="scheduled",
            schedule_date=schedule_date,
            schedule_slot=slot.index,
            calibration_version_id=version["id"],
            calibration_proposal_id=proposal_id,
            calibration_snapshot=version["calibration"],
            control_run_id=control_run_id,
        )

    async def on_run_finalized(self, run: dict[str, Any]) -> None:
        if run.get("origin") != "scheduled":
            return
        schedule_date = run.get("schedule_date")
        slot_index = int(run.get("schedule_slot") or 0)
        if not schedule_date or slot_index not in (1, 2, 3):
            return
        self.store.update_schedule_slot(
            schedule_date=schedule_date,
            slot_index=slot_index,
            status="completed" if run["status"] == "completed" else "failed",
            run_id=run["id"],
            reason=None if run["status"] == "completed" else run["status"],
        )
        self.store.create_notification(
            event_type="scheduled_run_completed",
            title=f"{run['version_label']} {self._status_label(run['status'])}",
            body=f"{run['completed_items']} de {run['total_items']} respostas foram concluídas.",
            run_id=run["id"],
            deduplication_key=f"scheduled-finished:{run['id']}",
        )

        detail = self.store.get_run(run["id"])
        if detail and any(
            item.get("error_category") == "rate_limit"
            for item in detail.get("items", [])
        ):
            pause_until = (datetime.now(timezone.utc) + timedelta(hours=8)).isoformat(
                timespec="seconds"
            )
            self.store.set_automation_pause(
                True,
                reason="Groq rate limit reached",
                pause_until=pause_until,
                actor="scheduler",
            )
            self.store.create_notification(
                event_type="automation_paused",
                title="Automação pausada por limite do provedor",
                body="As próximas janelas aguardarão o período de segurança.",
                run_id=run["id"],
                deduplication_key=f"rate-limit:{schedule_date}",
            )

        if slot_index == 1:
            self._after_candidate_one(run)
        elif slot_index == 2:
            self._after_candidate_two(run)
        else:
            self._after_candidate_three(run)

    def _after_candidate_one(self, run: dict[str, Any]) -> None:
        if run["status"] != "completed":
            self._create_run_recommendation(
                run,
                "rejected_automatically",
                "Candidate 1 incompleta",
                "O ciclo diário não pode propor ajustes sem um controle completo.",
            )
            return
        if self._rollback_unhealthy_promotion(run):
            return
        active = self.store.active_calibration()
        proposal_data = build_proposal(
            active=run.get("calibration_snapshot") or active["calibration"],
            metrics_by_perspective=self.store.metrics_by_perspective(run["id"]),
            experiment_index=datetime.fromisoformat(run["created_at"]).date().toordinal(),
        )
        proposal_id = str(uuid.uuid4())
        version_id = str(uuid.uuid4())
        self.store.create_calibration_version(
            calibration=proposal_data["calibration"],
            label=f"Proposal {run['schedule_date']}",
            parent_version_id=active["id"],
            origin="scheduled-proposal",
            proposal_id=proposal_id,
            version_id=version_id,
        )
        proposal = self.store.create_proposal(
            proposal_id=proposal_id,
            schedule_date=run["schedule_date"],
            base_version_id=active["id"],
            proposed_version_id=version_id,
            targeted_perspectives=proposal_data["targeted_perspectives"],
            changes=proposal_data["changes"],
            rationale=proposal_data["rationale"],
            control_run_id=run["id"],
        )
        self.store.create_recommendation(
            recommendation_type="calibration_proposal",
            status="informational",
            title="Experimento de calibração preparado",
            summary=proposal_data["rationale"],
            rationale=(
                "A candidate 2 testará somente os parâmetros numéricos listados; "
                "nenhuma mudança está ativa ainda."
            ),
            affected_perspectives=proposal_data["targeted_perspectives"],
            metric_comparison={
                "changes": proposal_data["changes"],
                "control_score": run.get("aggregate", {}).get("score"),
            },
            run_id=run["id"],
            proposal_id=proposal["id"],
            calibration_version_id=version_id,
        )

    def _rollback_unhealthy_promotion(self, run: dict[str, Any]) -> bool:
        active = self.store.active_calibration()
        proposal_id = active.get("proposal_id")
        if active.get("origin") != "scheduled-proposal" or not proposal_id:
            return False
        proposal = self.store.get_proposal(proposal_id)
        if not proposal or proposal.get("status") != "promoted":
            return False
        control = self.store.get_run(proposal["control_run_id"], include_items=False)
        if not control or control["status"] != "completed":
            return False

        health = self._health_guardrails(
            current=self._evaluation_payload(
                run,
                control,
                proposal["targeted_perspectives"],
            )
        )
        if health["passed"]:
            return False

        reverted = self.store.rollback_calibration(
            actor="scheduler",
            reason=f"Post-promotion health check failed in {run['version_label']}",
            target_version_id=proposal["base_version_id"],
        )
        if not reverted:
            return False
        self.store.update_proposal(
            proposal_id,
            status="reverted",
            guardrails={
                **(proposal.get("guardrails") or {}),
                "post_promotion_health": health,
            },
        )
        recommendation = self.store.create_recommendation(
            recommendation_type="automatic_rollback",
            status="reverted",
            title="Calibração revertida automaticamente",
            summary=f"Guardrails pós-promoção reprovados: {', '.join(health['failed'])}.",
            rationale=(
                "A primeira candidata após a promoção detectou regressão em métricas "
                "protegidas. A versão anterior foi restaurada e o ciclo foi interrompido."
            ),
            affected_perspectives=proposal["targeted_perspectives"],
            metric_comparison={
                "current": health["current"],
                "changes": proposal["changes"],
            },
            guardrails=health,
            run_id=run["id"],
            proposal_id=proposal_id,
            calibration_version_id=reverted["id"],
        )
        self.store.create_notification(
            event_type="calibration_rolled_back",
            title="Calibração revertida automaticamente",
            body=recommendation["summary"],
            run_id=run["id"],
            recommendation_id=recommendation["id"],
            deduplication_key=f"automatic-rollback:{proposal_id}",
        )
        return True

    @staticmethod
    def _health_guardrails(*, current: dict[str, Any]) -> dict[str, Any]:
        thresholds = {
            "observed_correctness": -0.01,
            "required_fact_coverage": 0.0,
            "forbidden_claim_avoidance": 0.0,
            "source_coverage": -0.01,
            "abstention": 0.0,
            "factual_convergence": -0.02,
            "principled_divergence": -0.02,
        }
        checks: list[dict[str, Any]] = []
        metrics = current.get("metrics", {})
        for name, minimum in thresholds.items():
            raw = metrics.get(name)
            value = raw.get("value") if isinstance(raw, dict) else raw
            control_raw = current.get("control_metrics", {}).get(name)
            control_value = (
                control_raw.get("value")
                if isinstance(control_raw, dict)
                else control_raw
            )
            delta = (
                round(float(value) - float(control_value), 3)
                if isinstance(value, (int, float))
                and isinstance(control_value, (int, float))
                else None
            )
            checks.append({
                "id": f"post_promotion_{name}_delta",
                "passed": delta is not None and delta >= minimum,
                "observed": delta,
                "threshold": minimum,
                "rationale": f"{name} must not regress beyond {minimum:+.2f}",
            })

        target_delta = float(current.get("targeted_objective_delta", 0.0) or 0.0)
        checks.append({
            "id": "post_promotion_targeted_objective",
            "passed": target_delta >= 0,
            "observed": target_delta,
            "threshold": 0.0,
            "rationale": "Targeted perspectives must retain their validated improvement",
        })
        perspective_deltas = current.get("perspective_objective_deltas", {})
        worst = (
            min((float(value) for value in perspective_deltas.values()), default=None)
            if isinstance(perspective_deltas, dict)
            else None
        )
        checks.append({
            "id": "post_promotion_individual_perspective_floor",
            "passed": worst is not None and worst >= -0.03,
            "observed": worst,
            "threshold": -0.03,
            "rationale": "No perspective may regress by more than 0.03",
        })
        return {
            "passed": all(check["passed"] for check in checks),
            "checks": checks,
            "failed": [check["id"] for check in checks if not check["passed"]],
            "current": current,
        }

    def _after_candidate_two(self, run: dict[str, Any]) -> None:
        proposal_id = run.get("calibration_proposal_id")
        if not proposal_id:
            return
        next_status = "experiment_completed" if run["status"] == "completed" else "rejected"
        self.store.update_proposal(
            proposal_id,
            status=next_status,
            experiment_run_id=run["id"],
        )
        if next_status == "rejected":
            self._create_run_recommendation(
                run,
                "rejected_automatically",
                "Candidate 2 rejeitada",
                "A execução experimental não terminou sem falhas; a calibração não será promovida.",
                proposal_id=proposal_id,
            )

    def _after_candidate_three(self, run: dict[str, Any]) -> None:
        proposal_id = run.get("calibration_proposal_id")
        if not proposal_id:
            self._create_run_recommendation(
                run,
                "informational",
                "Candidate 3 executada como controle",
                "A proposta anterior não era elegível; nenhuma promoção foi tentada.",
            )
            return
        proposal = self.store.get_proposal(proposal_id)
        if not proposal:
            return
        control = self.store.get_run(proposal["control_run_id"], include_items=False)
        experiment = self.store.get_run(proposal["experiment_run_id"], include_items=False)
        if not control or not experiment:
            return
        targets = proposal["targeted_perspectives"]
        control_eval = self._evaluation_payload(control, control, targets)
        experiment_eval = self._evaluation_payload(experiment, control, targets)
        validation_eval = self._evaluation_payload(run, control, targets)
        proposed_version = self.store.calibration_version(proposal["proposed_version_id"])
        proposal_valid = False
        if proposed_version:
            try:
                validate_calibration(proposed_version["calibration"])
                proposal_valid = True
            except ValueError:
                proposal_valid = False
        guardrails = evaluate_guardrails(
            control=control_eval,
            experiment=experiment_eval,
            validation=validation_eval,
            proposal_matches=(
                experiment.get("calibration_version_id")
                == run.get("calibration_version_id")
                == proposal["proposed_version_id"]
            ),
            proposal_valid=proposal_valid,
        )
        if guardrails["passed"]:
            self.store.activate_calibration(
                proposal["proposed_version_id"],
                actor="scheduler",
                reason=f"Validated by {run['version_label']}",
            )
            status = "promoted"
            recommendation_status = "applied_automatically"
            title = "Calibração promovida automaticamente"
            summary = "Candidate 2 e candidate 3 melhoraram o objetivo sem romper guardrails."
        else:
            status = "rejected"
            recommendation_status = "rejected_automatically"
            title = "Calibração rejeitada automaticamente"
            summary = f"Guardrails reprovados: {', '.join(guardrails['failed'])}"
        self.store.update_proposal(
            proposal_id,
            status=status,
            validation_run_id=run["id"],
            guardrails=guardrails,
        )
        recommendation = self.store.create_recommendation(
            recommendation_type="promotion_decision",
            status=recommendation_status,
            title=title,
            summary=summary,
            rationale=(
                "A decisão usa os mesmos parâmetros nas candidates 2 e 3 e "
                "avalia cada limite separadamente do score agregado."
            ),
            affected_perspectives=targets,
            metric_comparison={
                "control": control_eval,
                "experiment": experiment_eval,
                "validation": validation_eval,
                "changes": proposal["changes"],
            },
            guardrails=guardrails,
            run_id=run["id"],
            proposal_id=proposal_id,
            calibration_version_id=proposal["proposed_version_id"],
        )
        self.store.create_notification(
            event_type="calibration_promoted" if guardrails["passed"] else "calibration_rejected",
            title=title,
            body=summary,
            run_id=run["id"],
            recommendation_id=recommendation["id"],
            deduplication_key=f"promotion-decision:{proposal_id}",
        )

    def _evaluation_payload(
        self,
        run: dict[str, Any],
        control: dict[str, Any],
        targets: list[str],
    ) -> dict[str, Any]:
        metrics = run.get("aggregate", {}).get("metrics", {})
        current_objectives = perspective_objectives(
            self.store.metrics_by_perspective(run["id"])
        )
        control_objectives = perspective_objectives(
            self.store.metrics_by_perspective(control["id"])
        )
        deltas = {
            profile: round(current_objectives[profile] - control_objectives[profile], 3)
            for profile in set(current_objectives) & set(control_objectives)
        }
        target_values = [deltas[profile] for profile in targets if profile in deltas]
        return {
            "status": run["status"],
            "failed_items": run["failed_items"],
            "metrics": metrics,
            "control_metrics": control.get("aggregate", {}).get("metrics", {}),
            "targeted_objective_delta": (
                round(sum(target_values) / len(target_values), 3)
                if target_values
                else 0.0
            ),
            "perspective_objective_deltas": deltas,
        }

    def _create_run_recommendation(
        self,
        run: dict[str, Any],
        status: str,
        title: str,
        summary: str,
        *,
        proposal_id: str | None = None,
    ) -> None:
        self.store.create_recommendation(
            recommendation_type="run_outcome",
            status=status,
            title=title,
            summary=summary,
            rationale=f"Status observado: {run['status']}.",
            run_id=run["id"],
            proposal_id=proposal_id,
        )

    @staticmethod
    def _status_label(status: str) -> str:
        return {
            "completed": "concluída",
            "partial": "parcial",
            "failed": "falhou",
            "cancelled": "cancelada",
            "interrupted": "interrompida",
        }.get(status, status)
