import os
import unittest
from pathlib import Path
from unittest.mock import patch

from rag.chroma_config import (
    DEFAULT_CHROMA_DB_PATH,
    RENDER_DISK_CHROMA_DB_PATH,
    chroma_db_path,
    chroma_db_path_source,
    chroma_runtime_paths,
)


class ChromaConfigTests(unittest.TestCase):
    def test_default_chroma_path_is_repo_rag_directory(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            with patch("rag.chroma_config._render_disk_available", return_value=False):
                with patch("rag.chroma_config._directory_writable", return_value=False):
                    self.assertEqual(chroma_db_path(), DEFAULT_CHROMA_DB_PATH)
                    self.assertEqual(chroma_db_path_source(), "default")

    def test_env_chroma_path_overrides_default(self) -> None:
        with patch.dict(os.environ, {"CHROMA_DB_PATH": "/var/data/chroma_db"}, clear=True):
            with patch("rag.chroma_config._directory_writable", return_value=True):
                self.assertEqual(chroma_db_path(), Path("/var/data/chroma_db"))
                self.assertEqual(chroma_db_path_source(), "env:CHROMA_DB_PATH")
                payload = chroma_runtime_paths()
                self.assertEqual(payload["db_path"], "/var/data/chroma_db")
                self.assertEqual(payload["chroma_db_path"], "/var/data/chroma_db")

    def test_env_chroma_path_falls_back_when_unwritable(self) -> None:
        with patch.dict(os.environ, {"CHROMA_DB_PATH": "/var/data/chroma_db"}, clear=True):
            with patch("rag.chroma_config._directory_writable", return_value=False):
                with patch("rag.chroma_config._render_disk_available", return_value=False):
                    self.assertEqual(chroma_db_path(), DEFAULT_CHROMA_DB_PATH)
                    self.assertEqual(chroma_db_path_source(), "env:CHROMA_DB_PATH→default")

    def test_render_disk_is_used_when_env_is_missing(self) -> None:
        with patch.dict(os.environ, {}, clear=True):
            with patch("rag.chroma_config._render_disk_available", return_value=True):
                with patch("rag.chroma_config._directory_writable", return_value=True):
                    self.assertEqual(chroma_db_path(), RENDER_DISK_CHROMA_DB_PATH)
                    self.assertEqual(chroma_db_path_source(), "render-disk:/var/data")
                    payload = chroma_runtime_paths()
                    self.assertEqual(payload["db_path"], "/var/data/chroma_db")
                    self.assertTrue(payload["render_disk_available"])


if __name__ == "__main__":
    unittest.main()
