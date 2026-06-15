"""Embedding providers for Velaris RAG.

Local mode loads BGE-M3 via FlagEmbedding (dev / machines with enough RAM).
API mode calls Hugging Face Inference Providers for dense vectors only — no
PyTorch on the server, so Render Standard (2GB) can run ChromaDB + FastAPI.
"""

from __future__ import annotations

import os
import time
from typing import Any, Protocol

import httpx

DEFAULT_EMBEDDING_MODEL = "BAAI/bge-m3"
DEFAULT_API_BATCH_SIZE = 4
DEFAULT_API_DELAY_SECONDS = 0.35


class EmbeddingProvider(Protocol):
    def encode(self, texts: list[str], **kwargs: Any) -> dict[str, Any]:
        """Return a FlagEmbedding-compatible payload with ``dense_vecs``."""


def embedding_mode() -> str:
    return os.environ.get("AETHERIS_EMBEDDING_MODE", "local").strip().lower()


def embedding_model_name() -> str:
    return os.environ.get("AETHERIS_EMBEDDING_MODEL", DEFAULT_EMBEDDING_MODEL).strip()


def dense_vectors(result: dict[str, Any]) -> list[list[float]]:
    dense = result.get("dense_vecs", [])
    if hasattr(dense, "tolist"):
        return dense.tolist()
    return list(dense)


def default_hf_api_url(model: str) -> str:
    return (
        f"https://router.huggingface.co/hf-inference/models/"
        f"{model}/pipeline/feature-extraction"
    )


def _mean_pool(nested: list[Any]) -> list[float]:
    if not nested:
        return []
    if all(isinstance(value, (int, float)) for value in nested):
        return [float(value) for value in nested]
    if nested and all(isinstance(row, list) for row in nested):
        if nested and all(isinstance(value, (int, float)) for value in nested[0]):
            width = len(nested[0])
            if width == 0:
                return []
            sums = [0.0] * width
            for row in nested:
                for index, value in enumerate(row):
                    sums[index] += float(value)
            return [value / len(nested) for value in sums]
        return _mean_pool([_mean_pool(row) for row in nested])
    raise ValueError("Unsupported embedding tensor shape from provider")


def _vector_from_payload(payload: Any) -> list[float]:
    if hasattr(payload, "tolist"):
        payload = payload.tolist()
    if isinstance(payload, list):
        return _mean_pool(payload)
    raise ValueError(f"Unexpected Hugging Face embedding payload: {type(payload).__name__}")


def _normalize_hf_response(payload: Any, expected: int) -> list[list[float]]:
    if isinstance(payload, list):
        if not payload:
            return []
        if all(isinstance(value, (int, float)) for value in payload):
            return [_mean_pool(payload)]
        if all(isinstance(row, list) for row in payload):
            if payload and all(isinstance(value, (int, float)) for value in payload[0]):
                return [_mean_pool(row) for row in payload]
            return [_mean_pool(row) for row in payload]
    raise ValueError(f"Unexpected Hugging Face embedding payload: {type(payload).__name__}")


class HuggingFaceEmbeddingProvider:
    """Dense embeddings via Hugging Face Inference Providers."""

    def __init__(
        self,
        *,
        model: str,
        token: str,
        batch_size: int | None = None,
        max_retries: int | None = None,
        request_delay_seconds: float | None = None,
        api_url: str | None = None,
    ) -> None:
        self.model = model
        self.token = token
        self.batch_size = max(
            1,
            int(os.environ.get("AETHERIS_EMBEDDING_API_BATCH", batch_size or DEFAULT_API_BATCH_SIZE)),
        )
        self.max_retries = max(
            1,
            int(os.environ.get("AETHERIS_EMBEDDING_API_RETRIES", max_retries or 6)),
        )
        self.request_delay_seconds = float(
            os.environ.get(
                "AETHERIS_EMBEDDING_API_DELAY",
                request_delay_seconds if request_delay_seconds is not None else DEFAULT_API_DELAY_SECONDS,
            )
        )
        self.api_url = (
            api_url
            or os.environ.get("AETHERIS_EMBEDDING_API_URL", "").strip()
            or default_hf_api_url(model)
        )
        self._hub_client = None

    def encode(self, texts: list[str], **kwargs: Any) -> dict[str, Any]:
        if not texts:
            return {"dense_vecs": []}

        vectors: list[list[float]] = []
        batch_size = max(1, int(kwargs.get("batch_size", self.batch_size)))
        for start in range(0, len(texts), batch_size):
            batch = texts[start : start + batch_size]
            vectors.extend(self._embed_batch(batch))
            if start + batch_size < len(texts) and self.request_delay_seconds > 0:
                time.sleep(self.request_delay_seconds)
        return {"dense_vecs": vectors}

    def _hub_inference_client(self):
        if self._hub_client is not None:
            return self._hub_client
        from huggingface_hub import InferenceClient

        provider = os.environ.get("HF_INFERENCE_PROVIDER", "auto").strip() or "auto"
        self._hub_client = InferenceClient(token=self.token, provider=provider)
        return self._hub_client

    def _embed_batch(self, texts: list[str]) -> list[list[float]]:
        try:
            return self._embed_batch_hub(texts)
        except ImportError:
            return self._embed_batch_http(texts)
        except Exception as error:
            print(
                "[beatrice:embeddings] huggingface_hub client failed "
                f"({type(error).__name__}): {error}. Falling back to HTTP router."
            )
            return self._embed_batch_http(texts)

    def _embed_batch_hub(self, texts: list[str]) -> list[list[float]]:
        client = self._hub_inference_client()
        return [
            _vector_from_payload(
                client.feature_extraction(text, model=self.model)
            )
            for text in texts
        ]

    def _embed_batch_http(self, texts: list[str]) -> list[list[float]]:
        payload = {"inputs": texts[0]} if len(texts) == 1 else {"inputs": texts}
        headers = {"Authorization": f"Bearer {self.token}"}
        urls = [self.api_url]
        legacy = f"https://api-inference.huggingface.co/pipeline/feature-extraction/{self.model}"
        if legacy not in urls:
            urls.append(legacy)

        last_error = "unknown error"
        for api_url in urls:
            for attempt in range(self.max_retries):
                try:
                    response = httpx.post(
                        api_url,
                        headers=headers,
                        json=payload,
                        timeout=httpx.Timeout(90.0, connect=20.0),
                    )
                except httpx.HTTPError as error:
                    last_error = f"{api_url}: {error}"
                    time.sleep(min(2 ** attempt, 20))
                    continue

                if response.status_code == 200:
                    return _normalize_hf_response(response.json(), len(texts))

                if response.status_code in {429, 503, 504}:
                    retry_after = response.headers.get("retry-after")
                    wait_seconds = float(retry_after) if retry_after else min(2 ** attempt, 30)
                    last_error = f"{api_url}: HTTP {response.status_code}: {response.text[:240]}"
                    time.sleep(wait_seconds)
                    continue

                last_error = f"{api_url}: HTTP {response.status_code}: {response.text[:240]}"
                break

        raise RuntimeError(
            f"Hugging Face embedding request failed for {self.model}: {last_error}"
        )


class LocalBGEM3Provider:
    """Local BGE-M3 via FlagEmbedding (development / high-memory hosts)."""

    def __init__(self, model: str) -> None:
        from FlagEmbedding import BGEM3FlagModel

        use_fp16 = os.environ.get("AETHERIS_EMBEDDER_FP16", "0") == "1"
        self._model = BGEM3FlagModel(model, use_fp16=use_fp16)
        self.model = model

    def encode(self, texts: list[str], **kwargs: Any) -> dict[str, Any]:
        return self._model.encode(
            texts,
            batch_size=kwargs.get("batch_size", 8),
            max_length=kwargs.get("max_length", 512),
            return_dense=True,
            return_sparse=False,
            return_colbert_vecs=False,
        )


def huggingface_api_token() -> str:
    return (
        os.environ.get("HF_API_TOKEN", "").strip()
        or os.environ.get("HUGGINGFACE_API_KEY", "").strip()
    )


def create_embedding_provider() -> EmbeddingProvider:
    model = embedding_model_name()
    mode = embedding_mode()

    if mode == "api":
        token = huggingface_api_token()
        if not token:
            raise ValueError(
                "AETHERIS_EMBEDDING_MODE=api requires HF_API_TOKEN (or HUGGINGFACE_API_KEY)."
            )
        return HuggingFaceEmbeddingProvider(model=model, token=token)

    if mode != "local":
        raise ValueError(
            f"Unsupported AETHERIS_EMBEDDING_MODE={mode!r}. Use 'local' or 'api'."
        )

    return LocalBGEM3Provider(model=model)


def embedder_label(provider: EmbeddingProvider | None) -> str:
    if provider is None:
        return "none"
    model = embedding_model_name()
    if embedding_mode() == "api":
        return f"api:{model}"
    return model
