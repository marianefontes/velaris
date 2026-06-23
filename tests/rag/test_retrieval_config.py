import os
import unittest
from unittest.mock import patch

from rag.retrieval_config import (
    RETRIEVAL_MODE_DENSE,
    RETRIEVAL_MODE_HYBRID,
    hybrid_retrieval_active,
    resolve_retrieval_mode,
    retrieval_mode,
)


class RetrievalConfigTests(unittest.TestCase):
    def test_resolve_retrieval_mode_prefers_override(self) -> None:
        with patch.dict(os.environ, {"AETHERIS_RETRIEVAL_MODE": RETRIEVAL_MODE_DENSE}, clear=False):
            self.assertEqual(resolve_retrieval_mode("hybrid"), RETRIEVAL_MODE_HYBRID)
            self.assertEqual(resolve_retrieval_mode(None), RETRIEVAL_MODE_DENSE)

    def test_hybrid_retrieval_active_respects_override(self) -> None:
        with patch.dict(os.environ, {"AETHERIS_RETRIEVAL_MODE": RETRIEVAL_MODE_DENSE}, clear=False):
            self.assertFalse(hybrid_retrieval_active(None))
            self.assertTrue(hybrid_retrieval_active(RETRIEVAL_MODE_HYBRID))

    def test_retrieval_mode_defaults_to_dense(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            os.environ.pop("AETHERIS_RETRIEVAL_MODE", None)
            self.assertEqual(retrieval_mode(), RETRIEVAL_MODE_DENSE)


if __name__ == "__main__":
    unittest.main()
