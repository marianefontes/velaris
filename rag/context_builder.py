"""Build semantic RAG context without leaking implementation details."""

from typing import Any

SOURCE_LABELS: dict[str, str] = {
    "component": "Component Registry",
    "xai_component": "XAI Component Registry",
    "pattern": "Pattern Library",
    "token": "Token System",
    "token_alias": "Token System",
    "design_decision": "Decision Memory",
    "guideline": "Guideline System",
    "foundation": "Foundations",
    "reasoning": "Reasoning Model",
    "persona": "Persona Context",
    "dev_integration": "Developer Integration",
}

ENTITY_KIND_LABELS: dict[str, str] = {
    "component": "component",
    "xai_component": "explainability component",
    "pattern": "pattern",
    "token": "token group",
    "token_alias": "semantic token alias",
    "design_decision": "design decision",
    "guideline": "guideline",
    "foundation": "foundation",
    "reasoning": "reasoning primitive",
    "persona": "persona context",
    "dev_integration": "developer guidance",
}

CATALOG_OPENINGS: dict[str, str] = {
    "components": "O Velaris possui atualmente {count} componentes oficiais.",
    "patterns": "O Velaris possui atualmente {count} padrões oficiais.",
    "tokens": "O Velaris possui atualmente {count} grupos de tokens oficiais.",
    "decisions": "A memória de decisão do Velaris registra {count} decisões.",
    "all": "O registry semântico do Velaris contém {count} entidades oficiais neste recorte.",
}


def semantic_source_label(page_type: str) -> str:
    return SOURCE_LABELS.get(page_type, "Velaris Registry")


def semantic_entity_kind(page_type: str) -> str:
    return ENTITY_KIND_LABELS.get(page_type, "registry entity")


def evidence_strength(similarity: float | None) -> str:
    if similarity is None:
        return "registry"
    if similarity >= 0.75:
        return "strong"
    if similarity >= 0.5:
        return "partial"
    return "weak"


def split_semantic_fields(text: str) -> list[str]:
    return [segment.strip() for segment in text.split(" | ") if segment.strip()]


def serialize_sources(chunks: list[dict[str, Any]]) -> list[dict[str, Any]]:
    sources = []
    for chunk in chunks:
        page_type = chunk.get("page_type", "")
        sources.append({
            "title": chunk.get("title", ""),
            "source": semantic_source_label(page_type),
            "similarity": chunk.get("similarity", 1.0),
            "evidence_tier": evidence_strength(chunk.get("similarity")),
            "page_type": page_type,
            "retrieval_weight": chunk.get("retrieval_weight", 1.0),
            "weighted_score": chunk.get("weighted_score", chunk.get("similarity", 1.0)),
        })
    return sources


def build_perspective_evidence_block(chunks: list[dict[str, Any]]) -> str:
    if not chunks:
        return """
# Evidence Disclosure For The Active Perspective Contract

No source was retrieved. The mandatory evidence section must state that the
official Velaris evidence is insufficient and must not invent a component,
API, similarity, tier or source.
""".strip()

    rows = []
    for chunk in chunks:
        similarity = chunk.get("similarity")
        similarity_label = (
            f"{round(float(similarity) * 100)}%"
            if isinstance(similarity, (int, float))
            else "not available"
        )
        rows.append(
            "- "
            f"{chunk.get('title', '')} | "
            f"{semantic_source_label(chunk.get('page_type', ''))} | "
            f"evidence similarity {similarity_label} | "
            f"evidence tier {evidence_strength(similarity)}"
        )

    return f"""
# Evidence Disclosure For The Active Perspective Contract

Use only these values in the mandatory evidence section:
{chr(10).join(rows)}

Evidence similarity is retrieval relevance, not answer confidence. State at
least one limitation. If the records do not explicitly define exact props,
label the component API as proposed and not verified as the official Velaris
API.
""".strip()


def build_dialogue_context(messages: list[dict[str, Any]]) -> str:
    prior_user_msgs = [message for message in messages if message.get("role") == "user"]
    if len(prior_user_msgs) <= 1:
        return ""
    return f"""
# Dialogue Continuity

This is user message {len(prior_user_msgs)} in the current session. Preserve
coherence with previous recommendations unless the user explicitly asks to
reconsider.
""".strip()


def build_rag_context(
    chunks: list[dict[str, Any]],
    *,
    query: str,
    intent: str,
    catalog_mode: bool = False,
    catalog_entity: str = "none",
) -> str:
    if not chunks:
        return """
# Velaris Semantic Evidence

No official semantic evidence was recovered for this request. Stay inside the
Velaris domain, avoid invention and use the out-of-scope policy when needed.
""".strip()

    mode = "full_catalog" if catalog_mode else "semantic_retrieval"
    opening = ""
    if catalog_mode:
        opening_template = CATALOG_OPENINGS.get(catalog_entity, CATALOG_OPENINGS["all"])
        opening = f"\nrequired_opening: {opening_template.format(count=len(chunks))}"

    records = []
    for index, chunk in enumerate(chunks, start=1):
        page_type = chunk.get("page_type", "")
        similarity = chunk.get("similarity")
        similarity_label = (
            f"{round(float(similarity) * 100)}%"
            if isinstance(similarity, (int, float))
            else "not available"
        )
        fields = "\n".join(f"- {field}" for field in split_semantic_fields(chunk.get("text", "")))
        records.append(f"""
## Semantic Record {index}

entity: {chunk.get("title", "")}
semantic_area: {semantic_source_label(page_type)}
entity_kind: {semantic_entity_kind(page_type)}
evidence_strength: {evidence_strength(similarity)}
evidence_similarity: {similarity_label}
content:
{fields}
""".strip())

    return f"""
# Velaris Semantic Evidence

retrieval_mode: {mode}
intent: {intent}
catalog_scope: {catalog_entity}
entity_count: {len(chunks)}{opening}
user_query: {query}

Use these records as official Velaris evidence. Transform them into a clear
answer without exposing record numbers, metadata, files, routes or retrieval
mechanics.

{chr(10).join(records)}
""".strip()
