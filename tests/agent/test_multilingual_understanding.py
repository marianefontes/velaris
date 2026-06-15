"""Behavior tests for multilingual understanding.

These lock the language detection and cross-language entity resolution that make
Abraxos usable for international testers (United States, Brazil, Portugal, plus
Spanish, French and Arabic speakers). Assertions check behavior, not rigid
response text.
"""

from __future__ import annotations

import unittest

from agent.understanding import analyze_query


class LanguageDetectionTests(unittest.TestCase):
    def test_existing_languages_are_preserved(self) -> None:
        # Regression lock: the originally supported languages must not drift.
        cases = {
            "Explique em português.": "pt-BR",
            "Explica isto em PT-PT.": "pt-PT",
            "Explain in English.": "en",
            "how do I make this accessible?": "en",
        }
        for query, expected in cases.items():
            with self.subTest(query=query):
                self.assertEqual(analyze_query(query).language, expected)

    def test_spanish_is_detected(self) -> None:
        cases = (
            "¿Tienes un componente de drawer?",
            "¿Cuál botón debo usar para una acción destructiva?",
            "Necesito una ventana modal, ¿qué uso?",
        )
        for query in cases:
            with self.subTest(query=query):
                self.assertEqual(analyze_query(query).language, "es")

    def test_french_is_detected(self) -> None:
        cases = (
            "Avez-vous un composant fenêtre latérale?",
            "Comment utiliser le bouton primaire, pouvez vous expliquer?",
        )
        for query in cases:
            with self.subTest(query=query):
                self.assertEqual(analyze_query(query).language, "fr")

    def test_arabic_is_detected(self) -> None:
        self.assertEqual(analyze_query("هل لديك مكون درج جانبي؟").language, "ar")

    def test_non_latin_script_falls_back_to_other(self) -> None:
        self.assertEqual(analyze_query("モーダルコンポーネントはありますか").language, "other")

    def test_english_without_domain_markers_is_detected(self) -> None:
        # The motivating example from the night brief.
        self.assertEqual(
            analyze_query("Do you have a drawer component?").language,
            "en",
        )

    def test_portuguese_is_not_misread_as_spanish(self) -> None:
        cases = (
            "Qual componente uso para uma ação destrutiva?",
            "Quando usar um modal em vez de um drawer?",
            "Como deixar um botão acessível?",
        )
        for query in cases:
            with self.subTest(query=query):
                self.assertIn(analyze_query(query).language, {"pt-BR", "pt-PT"})


class MultilingualEntityResolutionTests(unittest.TestCase):
    def test_spanish_and_french_button_resolves_to_canonical(self) -> None:
        for query in ("¿Tienes un botón primario?", "Avez-vous un bouton?"):
            with self.subTest(query=query):
                understanding = analyze_query(query)
                self.assertIn("Button", understanding.entities.components)
                self.assertNotEqual(understanding.user_intent, "out_of_scope")

    def test_spanish_modal_and_table_resolve(self) -> None:
        modal = analyze_query("¿Cuándo usar una ventana modal?")
        self.assertIn("Modal/Dialog", modal.entities.components)
        table = analyze_query("Necesito una tabla de datos")
        self.assertIn("Table/Data Table", table.entities.components)

    def test_foreign_language_real_component_is_never_out_of_scope(self) -> None:
        # A real catalog component asked in another language must not collapse to
        # a flat out-of-scope refusal.
        for query in (
            "¿Tienes un botón?",
            "Avez-vous une carte?",
            "¿Tienes un tooltip?",
        ):
            with self.subTest(query=query):
                self.assertNotEqual(
                    analyze_query(query).user_intent,
                    "out_of_scope",
                )


if __name__ == "__main__":
    unittest.main()
