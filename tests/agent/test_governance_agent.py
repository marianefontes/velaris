"""Tests for the proactive governance agent."""

from __future__ import annotations

from agent.governance_agent import (
    SEVERITY_ORDER,
    build_governance_alerts,
    build_governance_alerts_block,
)


def test_build_governance_alerts_returns_expected_shape():
    payload = build_governance_alerts()

    assert "audited_at" in payload
    assert "total_alerts" in payload
    assert "severity_summary" in payload
    assert "category_summary" in payload
    assert "alerts" in payload
    assert isinstance(payload["alerts"], list)

    for severity in SEVERITY_ORDER:
        assert severity in payload["severity_summary"]


def test_governance_alert_fields_are_complete():
    payload = build_governance_alerts()

    for alert in payload["alerts"]:
        assert alert["id"].startswith("gov-")
        assert alert["category"]
        assert alert["severity"] in SEVERITY_ORDER
        assert isinstance(alert["priority"], int)
        assert alert["problem"]
        assert alert["impact"]
        assert isinstance(alert["affected_entities"], list)
        assert alert["recommendation"]


def test_build_governance_alerts_block_includes_header():
    payload = build_governance_alerts()
    block = build_governance_alerts_block(payload)

    assert "Governance Alerts (computed" in block
    assert f"total_alerts: {payload['total_alerts']}" in block


def test_alerts_sorted_by_priority():
    payload = build_governance_alerts()
    priorities = [alert["priority"] for alert in payload["alerts"]]

    assert priorities == sorted(priorities)
