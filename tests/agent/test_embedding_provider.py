import os
import unittest
from unittest.mock import MagicMock, patch

from rag.embedding_provider import (
    HuggingFaceEmbeddingProvider,
    _mean_pool,
    _normalize_hf_response,
    _validate_hf_api_url,
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

    def test_normalize_single_token_rows(self) -> None:
        payload = [[1.0, 3.0], [3.0, 5.0]]
        vectors = _normalize_hf_response(payload, 1)
        self.assertEqual(vectors, [[2.0, 4.0]])

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

    @patch.dict(
        os.environ,
        {"HF_INFERENCE_PROVIDER": "hf-inference"},
        clear=False,
    )
    @patch("huggingface_hub.InferenceClient")
    def test_hf_provider_uses_official_client_with_api_key(self, mock_client) -> None:
        mock_client.return_value.feature_extraction.return_value = [
            [0.1, 0.2, 0.3],
            [0.4, 0.5, 0.6],
        ]

        provider = HuggingFaceEmbeddingProvider(model="BAAI/bge-m3", token="hf_test")
        result = provider.encode(["alpha", "beta"], batch_size=2)

        mock_client.assert_called_once_with(
            provider="hf-inference",
            api_key="hf_test",
            timeout=90,
        )
        mock_client.return_value.feature_extraction.assert_called_once_with(
            ["alpha", "beta"],
            model="BAAI/bge-m3",
        )
        self.assertEqual(
            dense_vectors(result),
            [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
        )

    def test_rejects_legacy_huggingface_inference_api_url(self) -> None:
        with self.assertRaises(ValueError):
            _validate_hf_api_url(
                "https://api-inference.huggingface.co/pipeline/feature-extraction/BAAI/bge-m3"
            )

    def test_hf_provider_requires_token(self) -> None:
        with patch.dict(os.environ, {"AETHERIS_EMBEDDING_MODE": "api"}, clear=False):
            os.environ.pop("HF_API_TOKEN", None)
            os.environ.pop("HF_TOKEN", None)
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
        with patch.object(provider, "_embed_batch_hub", side_effect=ImportError):
            with patch("rag.embedding_provider.time.sleep"):
                vectors = dense_vectors(provider.encode(["query"]))
        self.assertEqual(vectors, [[0.1, 0.2]])
        self.assertEqual(mock_post.call_count, 2)


if __name__ == "__main__":
    unittest.main()
