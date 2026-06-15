import os
import unittest
from unittest.mock import MagicMock, patch

from rag.embedding_provider import (
    HuggingFaceEmbeddingProvider,
    _mean_pool,
    _normalize_hf_response,
    create_embedding_provider,
    default_hf_api_url,
    dense_vectors,
    embedder_label,
)


class EmbeddingProviderTests(unittest.TestCase):
    def test_mean_pool_token_rows(self) -> None:
        pooled = _mean_pool([[1.0, 3.0], [3.0, 5.0]])
        self.assertEqual(pooled, [2.0, 4.0])

    def test_normalize_hf_batch_response(self) -> None:
        payload = [[0.1, 0.2], [0.3, 0.4]]
        vectors = _normalize_hf_response(payload, 2)
        self.assertEqual(vectors, payload)

    def test_dense_vectors_from_numpy_like(self) -> None:
        array_like = MagicMock()
        array_like.tolist.return_value = [[0.5, 0.5]]
        self.assertEqual(dense_vectors({"dense_vecs": array_like}), [[0.5, 0.5]])

    @patch.dict(
        os.environ,
        {
            "AETHERIS_EMBEDDING_MODE": "api",
            "HF_API_TOKEN": "hf_test",
            "AETHERIS_EMBEDDING_MODEL": "BAAI/bge-m3",
        },
        clear=False,
    )
    @patch("rag.embedding_provider.httpx.post")
    def test_hf_provider_encodes_batch(self, mock_post) -> None:
        mock_post.return_value.status_code = 200
        mock_post.return_value.headers = {}
        mock_post.return_value.json.return_value = [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
        ]

        provider = HuggingFaceEmbeddingProvider(
            model="BAAI/bge-m3",
            token="hf_test",
            api_url=default_hf_api_url("BAAI/bge-m3"),
        )
        with patch.object(provider, "_embed_batch_hub", side_effect=ImportError):
            result = provider.encode(["alpha", "beta"], batch_size=2)
        self.assertEqual(
            dense_vectors(result),
            [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
        )
        self.assertTrue(
            mock_post.call_args.args[0].startswith("https://router.huggingface.co/")
        )

    def test_hf_provider_requires_token(self) -> None:
        with patch.dict(os.environ, {"AETHERIS_EMBEDDING_MODE": "api"}, clear=False):
            os.environ.pop("HF_API_TOKEN", None)
            os.environ.pop("HUGGINGFACE_API_KEY", None)
            with self.assertRaises(ValueError):
                create_embedding_provider()

    @patch("rag.embedding_provider.httpx.post")
    def test_hf_provider_retries_on_503(self, mock_post) -> None:
        waiting = MagicMock()
        waiting.status_code = 503
        waiting.headers = {"retry-after": "0"}
        waiting.text = "loading"

        ready = MagicMock()
        ready.status_code = 200
        ready.headers = {}
        ready.json.return_value = [0.1, 0.2]

        mock_post.side_effect = [waiting, ready]
        provider = HuggingFaceEmbeddingProvider(model="BAAI/bge-m3", token="hf_test")
        with patch("rag.embedding_provider.time.sleep"):
            vectors = dense_vectors(provider.encode(["query"]))
        self.assertEqual(vectors, [[0.1, 0.2]])
        self.assertEqual(mock_post.call_count, 2)


if __name__ == "__main__":
    unittest.main()
