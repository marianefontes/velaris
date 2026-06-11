#!/usr/bin/env python3
"""
Inventory and classify all markdown files in AETHERIS project.
"""

import os
import json
import subprocess
from pathlib import Path
from datetime import datetime

# Set base directory
BASE_DIR = Path("/Users/mbsf/AETHERIS")

# Files used by runtime (from prompt_builder.py and perspective_contracts.py)
RUNTIME_PROMPTS = {
    "prompts/system/core.md",
    "prompts/system/identity.md",
    "prompts/system/orchestration.md",
    "prompts/system/antiPatterns.md",
    "prompts/system/responseRules.md",
    "prompts/system/behavior.md",
    "prompts/system/persona.md",
    "prompts/retrieval/retrievalPolicy.md",
    "prompts/retrieval/chunkingStrategy.md",
    "prompts/intents/componentGuidance.md",
    "prompts/intents/patternGuidance.md",
    "prompts/intents/designDecision.md",
    "prompts/intents/tokenLookup.md",
    "prompts/intents/accessibilityGuidance.md",
    "prompts/intents/explainability.md",
    "prompts/responses/componentResponse.md",
    "prompts/responses/patternResponse.md",
    "prompts/responses/accessibilityResponse.md",
    "prompts/responses/decisionResponse.md",
    "prompts/responses/tokenResponse.md",
    "prompts/responses/xaiResponse.md",
    "prompts/responses/comparisonResponse.md",
    "prompts/responses/outOfScope.md",
    "prompts/responses/governanceResponse.md",
    "prompts/responses/catalogResponse.md",
    "prompts/commands/enforce.md",
    "prompts/commands/tokenImpact.md",
    "prompts/commands/contractCheck.md",
    "prompts/commands/feedbackReview.md",
    "prompts/commands/tradeoff.md",
    "prompts/perspectives/developer.md",
    "prompts/perspectives/accessibility.md",
    "prompts/perspectives/designer.md",
    "prompts/perspectives/product-designer.md",
    "prompts/perspectives/qa.md",
    "prompts/perspectives/tech-writer.md",
    "prompts/perspectives/maintainer.md",
    "prompts/perspectives/design-system-manager.md",
}

# Cognition runtime files
COGNITION_RUNTIME = {
    "cognition/heuristics/activation_rules.md",
    "cognition/heuristics/confidence_rules.md",
    "cognition/heuristics/escalation_rules.md",
    "cognition/heuristics/routing_rules.md",
    "cognition/overrides/override_rules.md",
    "cognition/strategies/architecture_analysis.md",
    "cognition/strategies/component_fit_analysis.md",
    "cognition/strategies/component_misuse_detection.md",
    "cognition/strategies/design_system_governance_check.md",
    "cognition/strategies/design_to_code_contract_check.md",
    "cognition/strategies/implementation_planning.md",
    "cognition/strategies/interaction_guardrail.md",
    "cognition/strategies/pattern_exploration.md",
    "cognition/strategies/retrieval_deep_dive.md",
    "cognition/strategies/risk_assessment.md",
    "cognition/strategies/systems_thinking.md",
    "cognition/strategies/token_impact_analysis.md",
    "cognition/strategies/tradeoff_analysis.md",
}

# Abraxos identity
IDENTITY_FILES = {
    "abraxos/ABRAXOS.md",
}

# Project config/docs
PROJECT_DOCS = {
    "CLAUDE.md",
    "README.md" if (BASE_DIR / "README.md").exists() else None,
}
PROJECT_DOCS.discard(None)

# TCC/Academic
ACADEMIC_FILES = {
    "CONTEXTO-TCC.md",
    "linha-do-tempo.md",
    "decisoes-tomadas.md",
}

# Personal/Author tracking
PERSONAL_FILES = {
    "relatorio-orientadora.md",
}

# Reports and audits
AUDIT_REPORT_FILES = {
    "ABRAXOS_CHAT_LAYOUT_REFINEMENT_REPORT.md",
    "ABRAXOS_INTELLIGENCE_AUDIT.md",
    "ABRAXOS_INTELLIGENCE_PHASE_2_3_REPORT.md",
    "ABRAXOS_INTELLIGENCE_PHASE_3_6_REPORT.md",
    "ABRAXOS_ORCHESTRATION_RESTORE_REPORT.md",
    "ABRAXOS_PARTICLE_HOVER_EFFECT.md",
    "ABRAXOS_RENAME_AND_TECELA_REPORT.md",
    "ABRAXOS_TRANSITION_EXPERIMENT.md",
    "BEATRICE-BASELINE-PRE-AGENT.md",
    "BEATRICE-DESIGN-SYSTEM-DATA-AUDIT.md",
    "BEATRICE_AGENTIC_INTELLIGENCE_REPORT.md",
    "BEATRICE_INTELLIGENCE_TESTS.md",
    "BEATRICE_RESPONSE_QUALITY_RUBRIC.md",
    "CODEX_ACCESSIBILITY_AUDIT.md",
    "CODEX_ACCESSIBILITY_REMEDIATION_REPORT.md",
    "CODEX_BEATRICE_UX_AUDIT.md",
    "CODEX_BEATRICE_UX_REFINEMENT_REPORT.md",
    "CODEX_DESIGN_SYSTEM_AUDIT.md",
    "CODEX_PATCH_PLAN.md",
    "CODEX_UI_AUDIT.md",
    "CODEX_UI_REFINEMENT_REPORT.md",
    "CODEX_VISUAL_QA_CHECKLIST.md",
    "COMPONENTS_STRUCTURE_REFINEMENT_REPORT.md",
    "COMPONENT_ABOUT_CARD_REFINEMENT_REPORT.md",
    "COMPONENT_DETAIL_LAYOUT_REFINEMENT_REPORT.md",
    "COMPONENT_SIDE_PANEL_REFINEMENT_REPORT.md",
    "FOUNDATIONS_VISUAL_STANDARDIZATION_REPORT.md",
    "PAGE_HEADER_ALIGNMENT_REPORT.md",
    "PERSPECTIVE_MARKDOWN_ACCESS_AUDIT.md",
    "REASONING_LAYOUT_SPACING_REPORT.md",
    "UNSUPPORTED_ENTITY_DETECTION_REPORT.md",
}

# Technical docs
TECH_DOCS = {
    "ACCESSIBILITY.md",
    "AGENT.md",
    "ARCHITECTURE.md",
    "COMMENT_STANDARDS.md",
    "DECISION_LOG.md",
    "EXECUTION_MODES.md",
    "GENERATED_FILES.md",
    "PERFORMANCE.md",
    "PERMISSIONS.md",
    "PERSPECTIVES.md",
    "PLANO_MIGRACAO.md",
    "PRODUCT.md",
    "RELEASE_CHECKLIST.md",
    "RESPONSE_QUALITY_GUIDE.md",
    "REVISAO_BEATRICE.md",
    "RISK_MODEL.md",
    "TESTE_PUBLICO_BEATRICE.md",
    "TOKENS.md",
}

# RAG docs
RAG_DOCS = {
    "rag/aetheris-docs-dump.md",
    "rag/component-map.md",
    "rag/embedding-model-justification.md",
    "rag/intent-map.md",
    "rag/pipeline-specs.md",
    "rag/xai-architecture.md",
}

# Evals
EVALS_DOCS = {
    "evals/README.md",
}

def get_file_size(path):
    """Get file size in human readable format."""
    size = path.stat().st_size
    for unit in ['B', 'KB', 'MB']:
        if size < 1024:
            return f"{size:.1f}{unit}"
        size /= 1024
    return f"{size:.1f}GB"

def get_file_date(path):
    """Get file modification date."""
    mtime = path.stat().st_mtime
    return datetime.fromtimestamp(mtime).strftime("%Y-%m-%d %H:%M")

def classify_file(relative_path, filename):
    """Classify a markdown file."""
    if relative_path in RUNTIME_PROMPTS or relative_path in COGNITION_RUNTIME:
        return "A_RUNTIME"
    elif relative_path in PROJECT_DOCS:
        return "B_PROJECT_CONFIG"
    elif relative_path in ACADEMIC_FILES:
        return "C_ACADEMIC"
    elif relative_path in PERSONAL_FILES:
        return "D_PERSONAL"
    elif relative_path in AUDIT_REPORT_FILES or relative_path in TECH_DOCS:
        if relative_path in AUDIT_REPORT_FILES:
            return "E_AUDIT_REPORT"
        else:
            return "E_TECH_DOCS"
    elif relative_path in IDENTITY_FILES:
        return "F_IDENTITY"
    elif relative_path in RAG_DOCS:
        return "G_RAG"
    elif relative_path in EVALS_DOCS:
        return "H_EVALS"
    else:
        return "Z_UNCATEGORIZED"

def scan_markdown_files():
    """Scan all markdown files and collect inventory."""
    inventory = []

    for md_file in sorted(BASE_DIR.rglob("*.md")):
        # Skip node_modules, .git
        if "node_modules" in str(md_file) or ".git" in str(md_file):
            continue

        relative_path = md_file.relative_to(BASE_DIR)
        relative_str = str(relative_path)
        filename = md_file.name

        category = classify_file(relative_str, filename)
        size = get_file_size(md_file)
        date = get_file_date(md_file)

        # Read first 200 chars to detect content type
        with open(md_file, 'r', encoding='utf-8', errors='ignore') as f:
            content_preview = f.read(200)

        # Detect if legacy (Beatrice/Aetheris)
        is_beatrice_legacy = "Beatrice" in content_preview or "beatrice" in content_preview
        is_aetheris_legacy = "Aetheris" in content_preview or "aetheris" in content_preview
        has_abraxos = "Abraxos" in content_preview or "abraxos" in content_preview
        has_velaris = "Velaris" in content_preview or "velaris" in content_preview

        inventory.append({
            "path": relative_str,
            "filename": filename,
            "category": category,
            "size": size,
            "modified": date,
            "is_beatrice_legacy": is_beatrice_legacy,
            "is_aetheris_legacy": is_aetheris_legacy,
            "has_abraxos": has_abraxos,
            "has_velaris": has_velaris,
        })

    return inventory

def group_by_category(inventory):
    """Group inventory by category."""
    groups = {}
    for item in inventory:
        cat = item["category"]
        if cat not in groups:
            groups[cat] = []
        groups[cat].append(item)
    return groups

def print_inventory(inventory, groups):
    """Print formatted inventory."""
    category_names = {
        "A_RUNTIME": "Runtime (Prompts, Cognition, System)",
        "B_PROJECT_CONFIG": "Project Configuration",
        "C_ACADEMIC": "Academic/TCC",
        "D_PERSONAL": "Personal/Author",
        "E_AUDIT_REPORT": "Audit Reports",
        "E_TECH_DOCS": "Technical Documentation",
        "F_IDENTITY": "Identity/Brand",
        "G_RAG": "RAG Documentation",
        "H_EVALS": "Evals",
        "Z_UNCATEGORIZED": "Uncategorized",
    }

    print("\n" + "=" * 100)
    print("MARKDOWN FILE INVENTORY AND CLASSIFICATION")
    print("=" * 100)
    print(f"\nTotal files: {len(inventory)}\n")

    for cat_key in sorted(groups.keys()):
        items = groups[cat_key]
        cat_name = category_names.get(cat_key, cat_key)

        print(f"\n{cat_name} ({len(items)} files)")
        print("-" * 100)

        for item in sorted(items, key=lambda x: x["filename"]):
            legacy_marker = ""
            if item["is_beatrice_legacy"]:
                legacy_marker += " [BEATRICE]"
            if item["is_aetheris_legacy"]:
                legacy_marker += " [AETHERIS]"
            if item["has_abraxos"]:
                legacy_marker += " [ABRAXOS]"
            if item["has_velaris"]:
                legacy_marker += " [VELARIS]"

            print(f"  {item['path']:<60} {item['size']:>8} {item['modified']}{legacy_marker}")

def save_json_inventory(inventory, output_path):
    """Save inventory as JSON."""
    with open(output_path, 'w') as f:
        json.dump(inventory, f, indent=2)
    print(f"\nJSON inventory saved to: {output_path}")

if __name__ == "__main__":
    inventory = scan_markdown_files()
    groups = group_by_category(inventory)

    print_inventory(inventory, groups)

    output_path = BASE_DIR / "scripts" / "markdown_inventory.json"
    save_json_inventory(inventory, output_path)

    # Summary stats
    print("\n" + "=" * 100)
    print("SUMMARY BY CATEGORY")
    print("=" * 100)
    for cat_key in sorted(groups.keys()):
        category_names = {
            "A_RUNTIME": "Runtime",
            "B_PROJECT_CONFIG": "Project Config",
            "C_ACADEMIC": "Academic",
            "D_PERSONAL": "Personal",
            "E_AUDIT_REPORT": "Audit Reports",
            "E_TECH_DOCS": "Tech Docs",
            "F_IDENTITY": "Identity",
            "G_RAG": "RAG",
            "H_EVALS": "Evals",
            "Z_UNCATEGORIZED": "Uncategorized",
        }
        print(f"{category_names.get(cat_key, cat_key):<25} {len(groups[cat_key]):>3} files")
