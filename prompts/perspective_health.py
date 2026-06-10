"""Perspective Markdown contract health audit for Abraxos."""

from __future__ import annotations

import hashlib
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from prompts.loader import PROMPT_ROOT, load_prompt
from prompts.perspective_contracts import (
    PERSPECTIVE_RESPONSE_CONTRACTS,
    build_response_audit_metadata,
    get_perspective_response_contract,
    validate_perspective_response,
)
from prompts.perspective_ids import CANONICAL_PERSPECTIVE_IDS

PERSPECTIVES_DIR = PROMPT_ROOT / "perspectives"

EXPECTED_PERSPECTIVE_FILES: dict[str, str] = {
    profile: contract.prompt_path
    for profile, contract in PERSPECTIVE_RESPONSE_CONTRACTS.items()
}

IGNORED_PERSPECTIVE_FILES: tuple[str, ...] = (
    "perspectives/MANUAL_EVALUATION.md",
)

RUNTIME_STRATEGY = "hybrid_prompt_contract"
RAG_INDEXING_POLICY = "not_applicable"


def _utc_now() -> datetime:
    return datetime.now(tz=timezone.utc)


def _iso_timestamp(value: datetime) -> str:
    return value.isoformat(timespec="seconds")


def _iso_mtime(path: Path) -> str | None:
    if not path.exists():
        return None
    return _iso_timestamp(
        datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    )


def _sha256_file(path: Path) -> str | None:
    if not path.is_file():
        return None
    digest = hashlib.sha256()
    digest.update(path.read_bytes())
    return digest.hexdigest()


def _post_generation_validation_active() -> bool:
    try:
        sample = validate_perspective_response("dev", "")
        build_response_audit_metadata("dev", "")
        return isinstance(sample, dict) and "profile_contract_applied" in sample
    except Exception:
        return False


def _registry_divergences() -> list[str]:
    diverged: list[str] = []
    for profile in CANONICAL_PERSPECTIVE_IDS:
        if profile not in PERSPECTIVE_RESPONSE_CONTRACTS:
            diverged.append(profile)
            continue
        contract = PERSPECTIVE_RESPONSE_CONTRACTS[profile]
        if contract.profile != profile:
            diverged.append(profile)
        if contract.prompt_path != EXPECTED_PERSPECTIVE_FILES.get(profile):
            diverged.append(profile)
    return sorted(set(diverged))


def _profiles_without_applicable_contract() -> list[str]:
    missing_contract: list[str] = []
    for profile in CANONICAL_PERSPECTIVE_IDS:
        if get_perspective_response_contract(profile) is None:
            missing_contract.append(profile)
    return missing_contract


def _file_audit(profile: str, relative_path: str, *, audited_at: datetime) -> dict[str, Any]:
    absolute_path = (PROMPT_ROOT / relative_path).resolve()
    contract = get_perspective_response_contract(profile)
    exists = absolute_path.is_file()
    loaded = False
    load_error: str | None = None
    content_preview = ""
    loaded_at: str | None = None
    if exists:
        try:
            content_preview = load_prompt(relative_path)
            loaded = bool(content_preview.strip())
            if loaded:
                loaded_at = _iso_timestamp(audited_at)
        except Exception as error:
            load_error = str(error)

    registry_version = contract.version if contract else None
    registry_contract_id = contract.id if contract else None
    registry_prompt_path = contract.prompt_path if contract else None
    registry_diverged = bool(
        contract is not None
        and (
            contract.profile != profile
            or registry_prompt_path != relative_path
        )
    )

    return {
        "perspective_id": profile,
        "file_path": relative_path,
        "bytes": absolute_path.stat().st_size if exists else 0,
        "mtime": _iso_mtime(absolute_path),
        "sha256": _sha256_file(absolute_path) if exists else None,
        "loaded_at": loaded_at,
        "registry_version": registry_version,
        "registry_contract_id": registry_contract_id,
        "registry_prompt_path": registry_prompt_path,
        "registry_diverged": registry_diverged,
        "exists": exists,
        "loaded": loaded,
        "load_error": load_error,
        "used_as_response_rule": loaded and contract is not None,
        "repository_only": exists and not loaded,
        "heading": content_preview.splitlines()[0] if content_preview else None,
        "rag_chunk_count": 0,
    }


def _orphan_perspective_files() -> list[str]:
    if not PERSPECTIVES_DIR.exists():
        return []
    registered = {Path(path).name for path in EXPECTED_PERSPECTIVE_FILES.values()}
    registered.add("MANUAL_EVALUATION.md")
    orphans: list[str] = []
    for path in sorted(PERSPECTIVES_DIR.glob("*.md")):
        if path.name not in registered:
            orphans.append(f"perspectives/{path.name}")
    return orphans


def _perspective_chunks_from_collection(collection: Any | None) -> dict[str, list[dict[str, Any]]]:
    chunks_by_perspective: dict[str, list[dict[str, Any]]] = {
        profile: [] for profile in CANONICAL_PERSPECTIVE_IDS
    }
    if collection is None:
        return chunks_by_perspective

    try:
        total = collection.count()
    except Exception:
        return chunks_by_perspective

    if total <= 0:
        return chunks_by_perspective

    try:
        payload = collection.get(
            include=["metadatas", "documents"],
            limit=total,
        )
    except Exception:
        return chunks_by_perspective

    metadatas = payload.get("metadatas") or []
    documents = payload.get("documents") or []
    ids = payload.get("ids") or []

    for chunk_id, metadata, document in zip(ids, metadatas, documents):
        if not isinstance(metadata, dict):
            continue
        source = str(metadata.get("source", ""))
        page_type = str(metadata.get("page_type", ""))
        perspective_id = str(metadata.get("perspective_id", ""))
        is_perspective_chunk = (
            perspective_id in CANONICAL_PERSPECTIVE_IDS
            or "perspectives/" in source
            or page_type == "perspective"
        )
        if not is_perspective_chunk:
            continue
        profile = (
            perspective_id
            if perspective_id in CANONICAL_PERSPECTIVE_IDS
            else _profile_from_source(source)
        )
        if profile not in chunks_by_perspective:
            continue
        chunks_by_perspective[profile].append({
            "id": chunk_id,
            "source": source,
            "page_type": page_type,
            "perspective_id": perspective_id or profile,
            "title": metadata.get("title", ""),
            "retrieval_intent": metadata.get("retrieval_intent", ""),
            "section": metadata.get("section", ""),
            "text_preview": (document or "")[:160],
        })

    return chunks_by_perspective


def _profile_from_source(source: str) -> str:
    for profile, relative_path in EXPECTED_PERSPECTIVE_FILES.items():
        if relative_path in source or Path(relative_path).name in source:
            return profile
    return ""


def build_perspective_health_payload(collection: Any | None = None) -> dict[str, Any]:
    audited_at = _utc_now()
    files = [
        _file_audit(profile, path, audited_at=audited_at)
        for profile, path in EXPECTED_PERSPECTIVE_FILES.items()
    ]
    chunks_by_perspective = _perspective_chunks_from_collection(collection)
    total_perspective_chunks = sum(len(items) for items in chunks_by_perspective.values())

    for entry in files:
        profile = entry["perspective_id"]
        entry["rag_chunk_count"] = len(chunks_by_perspective.get(profile, []))

    found_paths = {entry["file_path"] for entry in files if entry["exists"]}
    missing_perspectives = sorted(
        profile
        for profile, path in EXPECTED_PERSPECTIVE_FILES.items()
        if path not in found_paths
    )
    loaded_profiles = [
        entry["perspective_id"]
        for entry in files
        if entry["loaded"]
    ]
    stale_perspectives = [
        entry["perspective_id"]
        for entry in files
        if entry["exists"] and not entry["loaded"]
    ]
    orphan_files = _orphan_perspective_files()
    registry_divergences = _registry_divergences()
    profiles_without_contract = _profiles_without_applicable_contract()
    post_generation_validation_active = _post_generation_validation_active()
    warnings: list[dict[str, str]] = []

    if missing_perspectives:
        warnings.append({
            "code": "perspective_health.missing_files",
            "message": (
                "One or more perspective contract files are missing: "
                + ", ".join(missing_perspectives)
            ),
        })

    if stale_perspectives:
        warnings.append({
            "code": "perspective_health.load_failed",
            "message": (
                "Perspective files exist but failed to load at runtime: "
                + ", ".join(stale_perspectives)
            ),
        })

    if profiles_without_contract:
        warnings.append({
            "code": "perspective_health.missing_applicable_contract",
            "message": (
                "Canonical profileIds without an applicable response contract: "
                + ", ".join(profiles_without_contract)
            ),
        })

    if not post_generation_validation_active:
        warnings.append({
            "code": "perspective_health.post_generation_validation_inactive",
            "message": (
                "Post-generation perspective contract validation is not active."
            ),
        })

    if registry_divergences or any(entry["registry_diverged"] for entry in files):
        diverged_profiles = sorted(
            set(registry_divergences)
            | {
                entry["perspective_id"]
                for entry in files
                if entry["registry_diverged"]
            }
        )
        warnings.append({
            "code": "perspective_health.registry_file_divergence",
            "message": (
                "Perspective registry entries diverge from on-disk contract files: "
                + ", ".join(diverged_profiles)
            ),
        })

    if orphan_files:
        warnings.append({
            "code": "perspective_health.orphan_files",
            "message": (
                "Perspective markdown files are not registered in the contract "
                "registry: " + ", ".join(orphan_files)
            ),
        })

    return {
        "status": "healthy" if not warnings else "warning",
        "rag_indexing": RAG_INDEXING_POLICY,
        "total_perspective_files_expected": len(EXPECTED_PERSPECTIVE_FILES),
        "total_perspective_files_found": len(found_paths),
        "total_perspective_files_loaded": len(loaded_profiles),
        "total_perspective_chunks": total_perspective_chunks,
        "chunks_by_perspective": {
            profile: len(chunks_by_perspective.get(profile, []))
            for profile in CANONICAL_PERSPECTIVE_IDS
        },
        "missing_perspectives": missing_perspectives,
        "stale_perspectives": stale_perspectives,
        "orphan_files": orphan_files,
        "registry_divergences": sorted(
            set(registry_divergences)
            | {
                entry["perspective_id"]
                for entry in files
                if entry["registry_diverged"]
            }
        ),
        "ignored_files": list(IGNORED_PERSPECTIVE_FILES),
        "runtime_strategy": RUNTIME_STRATEGY,
        "runtime_layers": {
            "controlled_perspective_contract_injection": True,
            "cognitive_profile_registry": True,
            "retrieval_profile_filter": True,
            "post_generation_validation": post_generation_validation_active,
            "frontend_label_only": False,
        },
        "contracts": files,
        "chunks": chunks_by_perspective,
        "warnings": warnings,
        "audited_at": _iso_timestamp(audited_at),
    }
