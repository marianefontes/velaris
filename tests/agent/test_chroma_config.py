import os
import unittest
from pathlib import Path
from unittest.mock import patch

from rag.chroma_config import (
    DEFAULT_CHROMA_DB_PATH,
    chroma_db_path,
    chroma_db_path_source,
    chroma_runtime_paths,
)


class ChromaConfigTests(unittest.TestCase):
    def test_default_chroma_path_is_repo_rag_directory(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            self.assertEqual(chroma_db_path(), DEFAULT_CHROMA_DB_PATH)
            self.assertEqual(chroma_db_path_source(), "default")

    def test_env_chroma_path_overrides_default(self) -> None:
        with patch.dict(os.environ, {"CHROMA_DB_PATH": "/var/data/chroma_db"}, clear=True):
            self.assertEqual(chroma_db_path(), Path("/var/data/chroma_db"))
            self.assertEqual(chroma_db_path_source(), "env:CHROMA_DB_PATH")
            payload = chroma_runtime_paths()
            self.assertEqual(payload["db_path"], "/var/data/chroma_db")
            self.assertEqual(payload["chroma_db_path"], "/var/data/chroma_db")


if __name__ == "__main__":
    unittest.main()
