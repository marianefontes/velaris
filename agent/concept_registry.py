"""Canonical concept registry for Velaris/Abraxos identity and system terms."""

from __future__ import annotations

from dataclasses import dataclass

from agent.concept_map import concept_response, resolve_concept_key


@dataclass(frozen=True)
class ConceptEntry:
    key: str
    label_pt: str
    label_en: str
    aliases: tuple[str, ...]


CONCEPT_REGISTRY: dict[str, ConceptEntry] = {
    "abraxos": ConceptEntry(
        key="abraxos",
        label_pt="Abraxos",
        label_en="Abraxos",
        aliases=("abraxos",),
    ),
    "velaris": ConceptEntry(
        key="velaris",
        label_pt="Velaris",
        label_en="Velaris",
        aliases=("velaris",),
    ),
    "beatrice": ConceptEntry(
        key="beatrice",
        label_pt="Beatrice",
        label_en="Beatrice",
        aliases=("beatrice",),
    ),
    "aetheris": ConceptEntry(
        key="aetheris",
        label_pt="Aetheris",
        label_en="Aetheris",
        aliases=("aetheris",),
    ),
    "tecela": ConceptEntry(
        key="tecela",
        label_pt="Tecelã",
        label_en="Tecelã",
        aliases=("tecela", "tecelã"),
    ),
    "rag": ConceptEntry(
        key="rag",
        label_pt="RAG",
        label_en="RAG",
        aliases=("rag", "retrieval", "recuperacao", "recuperação"),
    ),
    "xai": ConceptEntry(
        key="xai",
        label_pt="XAI",
        label_en="XAI",
        aliases=("xai", "explicabilidade", "explainability"),
    ),
    "evidence_tier": ConceptEntry(
        key="evidence_tier",
        label_pt="Evidence tier",
        label_en="Evidence tier",
        aliases=(
            "evidence tier",
            "nivel de evidencia",
            "nível de evidência",
        ),
    ),
    "catalogo": ConceptEntry(
        key="catalogo",
        label_pt="Catálogo canônico",
        label_en="Canonical catalog",
        aliases=(
            "catalogo canonico",
            "catálogo canônico",
            "canonical catalog",
        ),
    ),
    "perspectivas": ConceptEntry(
        key="perspectivas",
        label_pt="Perspectivas",
        label_en="Perspectives",
        aliases=("perspectivas", "perspectives", "persona", "personas"),
    ),
    "auditoria": ConceptEntry(
        key="auditoria",
        label_pt="Auditoria",
        label_en="Audit",
        aliases=("auditoria", "audit", "auditorias"),
    ),
    "operating_principles": ConceptEntry(
        key="operating_principles",
        label_pt="Princípios operacionais do Abraxos",
        label_en="Abraxos operating principles",
        aliases=(
            "principios operacionais",
            "princípios operacionais",
            "operating principles",
            "anti alucinacao",
            "anti-alucinação",
            "anti hallucination",
        ),
    ),
}


def resolve_concept(query: str) -> str | None:
    return resolve_concept_key(query)


def explain_concept(concept_key: str, *, english: bool = False) -> str:
    return concept_response(concept_key, english=english)
