from __future__ import annotations

from component_metadata import (
    component_document_text,
    component_metadata,
)


MODAL_DIALOG = component_metadata("modal-dialog")
if MODAL_DIALOG is None:
    raise RuntimeError("modal-dialog fixture metadata is unavailable")


FIXTURE_CHUNKS = {
    "component_guidance": [
        {
            "title": "Dialog",
            "source": "data/component-metadata.json",
            "page_type": "component",
            "component_id": MODAL_DIALOG.component_id,
            "status": MODAL_DIALOG.status,
            "section": MODAL_DIALOG.section,
            "text": component_document_text(MODAL_DIALOG),
            "when_to_use": [
                rule.model_dump(mode="json")
                for rule in MODAL_DIALOG.when_to_use or []
            ],
            "when_not_to_use": [
                rule.model_dump(mode="json")
                for rule in MODAL_DIALOG.when_not_to_use or []
            ],
            "accessibility": MODAL_DIALOG.accessibility.model_dump(mode="json"),
            "aetheris_insight": MODAL_DIALOG.aetheris_insight.model_dump(mode="json"),
            "component_metadata": MODAL_DIALOG.model_dump(mode="json"),
            "similarity": 0.82,
            "retrieval_weight": 1.1,
            "weighted_score": 0.902,
        },
    ],
    "pattern_guidance": [
        {
            "title": "Destructive action confirmation",
            "source": "PatternsPage",
            "page_type": "pattern",
            "text": "Pattern | Prefer explicit consequence text and a clear cancel action. | Risk: ambiguous destructive labels.",
            "similarity": 0.77,
            "retrieval_weight": 1.0,
            "weighted_score": 0.77,
        },
    ],
    "token_lookup": [
        {
            "title": "Error color tokens",
            "source": "TokensPage",
            "page_type": "token",
            "text": "Tokens | Use semantic error tokens instead of hardcoded colors.",
            "similarity": 0.68,
            "retrieval_weight": 1.0,
            "weighted_score": 0.68,
        },
    ],
    "when_not_to_use": [
        {
            "title": "Button destructive state",
            "source": "GuidelinesPage",
            "page_type": "guideline",
            "text": "Guideline | Do not rely only on color. | Must expose a visible focus state.",
            "similarity": 0.72,
            "retrieval_weight": 1.0,
            "weighted_score": 0.72,
        },
    ],
    "comparison_query": [
        {
            "title": "Modal versus Drawer",
            "source": "DesignDecisionsPage",
            "page_type": "design_decision",
            "text": "Trade-off | Drawer preserves context. | Modal increases focus but interrupts continuity.",
            "similarity": 0.79,
            "retrieval_weight": 1.0,
            "weighted_score": 0.79,
        },
    ],
    "design_decision": [
        {
            "title": "Primary vs. Secondary Button Logic",
            "source": "DesignDecisionsPage",
            "page_type": "design_decision",
            "text": "Decision | Primary actions carry the main task. | Trade-off: excess primary emphasis weakens hierarchy.",
            "similarity": 0.76,
            "retrieval_weight": 1.0,
            "weighted_score": 0.76,
        },
    ],
    "xai_explanation": [
        {
            "title": "Confidence Badge",
            "source": "data/component-metadata.json",
            "page_type": "xai_component",
            "text": "Confidence Badge | Calibrate trust with a textual level and an explanation of evidence limits.",
            "similarity": 0.78,
            "retrieval_weight": 1.0,
            "weighted_score": 0.78,
        },
    ],
}


def fixture_retrieve(query: str, intent: str, top_k: int, profile: str) -> list[dict]:
    del query, profile
    return [dict(chunk) for chunk in FIXTURE_CHUNKS.get(intent, [])[:top_k]]
