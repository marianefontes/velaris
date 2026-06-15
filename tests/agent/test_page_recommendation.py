from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from agent.page_recommendation import (
    detect_page_type,
    resolve_page_recommendation_intent,
)
from agent.planner import build_agent_plan
from agent.runtime import AgentRuntime
from agent.store import AgentStore
from agent.understanding import analyze_query
from tests.agent.test_runtime import build_registry


COMPONENT_NOT_FOUND_EN = "I could not find that component"
COMPONENT_NOT_FOUND_PT = "Não encontrei esse componente"


class PageRecommendationClassificationTests(unittest.TestCase):
  ACCEPTANCE_QUERIES = (
      (
          "help me to build a home page, which components should I use",
          "component_recommendation",
          "homepage",
      ),
      (
          "me ajude a criar uma página inicial, quais componentes devo usar?",
          "component_recommendation",
          "homepage",
      ),
      (
          "ajuda-me a criar uma página inicial, que componentes devo utilizar?",
          "component_recommendation",
          "homepage",
      ),
      (
          "help me to build a home page",
          "component_recommendation",
          "homepage",
      ),
      (
          "me ajude a criar uma página inicial",
          "component_recommendation",
          "homepage",
      ),
      (
          "ajuda-me a criar uma página inicial",
          "component_recommendation",
          "homepage",
      ),
      (
          "create a dashboard",
          "component_recommendation",
          "dashboard",
      ),
      (
          "design a checkout",
          "page_architecture",
          "checkout",
      ),
      (
          "criar um fluxo de onboarding",
          "page_architecture",
          "onboarding",
      ),
      (
          "I need something for navigation",
          "component_discovery",
          "generic_page",
      ),
      (
          "preciso de um componente de feedback",
          "component_discovery",
          "generic_page",
      ),
  )

  def test_acceptance_classification(self) -> None:
      for query, expected_intent, expected_page_type in self.ACCEPTANCE_QUERIES:
          with self.subTest(query=query):
              understanding = analyze_query(query)
              self.assertEqual(understanding.user_intent, expected_intent)
              self.assertEqual(understanding.page_type, expected_page_type)

  def test_entity_lookup_is_not_misclassified(self) -> None:
      understanding = analyze_query("tem Button?")
      self.assertEqual(understanding.user_intent, "entity_lookup")

  def test_detect_page_type_homepage(self) -> None:
      self.assertEqual(
          detect_page_type("help me to build a home page"),
          "homepage",
      )


class PageRecommendationPlannerRuntimeTests(unittest.TestCase):
  def setUp(self) -> None:
      self.temp_dir = tempfile.TemporaryDirectory()
      self.store = AgentStore(Path(self.temp_dir.name) / "agent.sqlite3")
      self.store.initialize()
      self.runtime = AgentRuntime(
          registry=build_registry(self.store, lambda *args, **kwargs: []),
          store=self.store,
          model="test-model",
      )

  def tearDown(self) -> None:
      self.temp_dir.cleanup()

  def test_homepage_query_uses_page_recommendation_workflow(self) -> None:
      query = (
          "help me to build a home page, which components should I use"
      )
      plan = build_agent_plan(query)
      self.assertEqual(plan.workflow, "page_recommendation")

  def test_homepage_query_does_not_return_component_not_found(self) -> None:
      query = (
          "help me to build a home page, which components should I use"
      )
      context = self.runtime.prepare(
          query=query,
          profile="designer",
          routed_intent="component_guidance",
          command_mode=None,
          session_id="session_page",
          project_id="project_a",
          preferred_detail_level="balanced",
      )
      self.assertEqual(context.plan.workflow, "page_recommendation")
      self.assertTrue(context.should_compose)
      response = context.deterministic_response or ""
      self.assertNotIn(COMPONENT_NOT_FOUND_EN, response)
      self.assertNotIn(COMPONENT_NOT_FOUND_PT, response)
      structured = self.runtime.structured_context(context)
      self.assertIn("page_recommendation_contract", structured)
      self.assertIn("homepage", structured)
      self.assertIn("Button", structured)

  def test_portuguese_homepage_without_component_list(self) -> None:
      query = "me ajude a criar uma página inicial"
      context = self.runtime.prepare(
          query=query,
          profile="designer",
          routed_intent="general",
          command_mode=None,
          session_id="session_page_pt",
          project_id="project_a",
          preferred_detail_level="balanced",
      )
      self.assertEqual(
          context.plan.understanding.user_intent,
          "component_recommendation",
      )
      self.assertEqual(context.plan.workflow, "page_recommendation")
      self.assertTrue(context.should_compose)
      self.assertNotIn(COMPONENT_NOT_FOUND_PT, context.deterministic_response or "")


if __name__ == "__main__":
  unittest.main()
