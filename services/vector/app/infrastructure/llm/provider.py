"""LLM provider — DeepSeek-powered semantic candidate search."""

from __future__ import annotations

import json
import logging
from typing import Optional

from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)

SEARCH_SYSTEM_PROMPT = """You are a semantic CV search engine for a recruitment platform.
A recruiter has entered a natural-language query describing their ideal candidate.

Your task: return and rank the candidates from the pool that have any relevance to the query.

Rules:
- Score each candidate 0-100 based on how well they match the query.
- Be inclusive: a partial match is better than no match. Even if a candidate only matches 1-2 skills or the industry sector, include them.
- Consider transferable skills and industry background.
- Goal is "Talent Discovery": help the recruiter find potential matches they might have missed.
- Return ONLY a JSON object with this exact structure:
{
  "candidates": [
    {
      "candidate_id": "<id>",
      "name": "<name>",
      "score": <float 0-100>,
      "rationale": "<1 sentence why this candidate matches>",
      "matched_skills": ["<skill>", ...],
      "missing_skills": ["<skill>", ...]
    }
  ],
  "total_count": <int>
}"""


class LLMProvider:
    """LLM-powered semantic search. Uses DeepSeek via OpenAI-compatible API."""

    def __init__(self) -> None:
        settings = get_settings()
        self._model = settings.LLM_MODEL
        self._client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )

    async def semantic_search(
        self,
        *,
        query: str,
        candidates: list[dict],
        limit: int = 10,
    ) -> dict:
        """Score and rank candidates against a natural-language query."""
        candidates_json = json.dumps(candidates, indent=2)

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {"role": "system", "content": SEARCH_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": (
                        f"Search query: \"{query}\"\n\n"
                        f"Candidate pool:\n{candidates_json}\n\n"
                        f"Return the top {limit} matching candidates as JSON."
                    ),
                },
            ],
            temperature=0.1,
            max_tokens=1024,
        )

        content = response.choices[0].message.content or ""
        return self._parse_response(content)

    @staticmethod
    def _parse_response(text: str) -> dict:
        text = text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[-1]
            if text.endswith("```"):
                text = text[:-3]
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            logger.error("Failed to parse LLM JSON: %s", text[:200])
            return {"candidates": [], "total_count": 0}


_llm_provider: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    global _llm_provider
    if _llm_provider is None:
        _llm_provider = LLMProvider()
    return _llm_provider
