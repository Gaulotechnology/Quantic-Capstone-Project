"""LLM provider — DeepSeek (primary) with Ollama (fallback)."""

from __future__ import annotations

import json
import logging
from typing import Optional

import httpx
from openai import AsyncOpenAI

from app.config import get_settings

logger = logging.getLogger(__name__)

# ── Scoring prompt template ────────────────────────────────────────────
SCORING_SYSTEM_PROMPT = """You are an expert recruitment AI. Your task is to score a candidate
against a job description and explain the match.

Return ONLY a JSON object with this exact structure:
{
  "score": <float 0-100>,
  "rationale": "<2-3 sentence explanation>",
  "matched_skills": ["<skill1>", "<skill2>", ...],
  "missing_skills": ["<skill1>", "<skill2>", ...]
}"""


def _build_scoring_prompt(job_title: str, job_description: str, job_requirements: str,
                          candidate_skills: list[str], candidate_experience: str) -> str:
    return f"""Job Title: {job_title}

Job Description:
{job_description}

Requirements:
{job_requirements}

Candidate Skills: {', '.join(candidate_skills) if candidate_skills else 'Not specified'}

Candidate Experience:
{candidate_experience}

Score this candidate against the job and return the JSON."""


class LLMProvider:
    """Thin abstraction over OpenAI-compatible LLM APIs.

    Primary:  DeepSeek (`deepseek-chat`)
    Fallback: Ollama (`llama3`)
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._primary_model = settings.LLM_MODEL
        self._primary_client = AsyncOpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL,
        )
        self._ollama_url = settings.OLLAMA_BASE_URL
        self._ollama_model = "llama3"

    # ── Public API ─────────────────────────────────────────────────────

    async def score_candidate(
        self,
        *,
        job_title: str,
        job_description: str,
        job_requirements: str,
        candidate_skills: list[str],
        candidate_experience: str,
    ) -> dict:
        """Score a candidate against a job description.

        Returns a dict with keys: score, rationale, matched_skills, missing_skills.
        Tries DeepSeek first; falls back to Ollama on failure.
        """
        prompt = _build_scoring_prompt(
            job_title, job_description, job_requirements,
            candidate_skills, candidate_experience,
        )

        try:
            return await self._call_deepseek(prompt)
        except Exception:
            logger.warning("DeepSeek call failed, falling back to Ollama", exc_info=True)
            return await self._call_ollama(prompt)

    # ── Private: DeepSeek ──────────────────────────────────────────────

    async def _call_deepseek(self, prompt: str) -> dict:
        response = await self._primary_client.chat.completions.create(
            model=self._primary_model,
            messages=[
                {"role": "system", "content": SCORING_SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.1,
            max_tokens=512,
        )
        content = response.choices[0].message.content or ""
        return self._parse_json_response(content)

    # ── Private: Ollama fallback ───────────────────────────────────────

    async def _call_ollama(self, prompt: str) -> dict:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{self._ollama_url}/api/generate",
                json={
                    "model": self._ollama_model,
                    "prompt": f"{SCORING_SYSTEM_PROMPT}\n\n{prompt}",
                    "stream": False,
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return self._parse_json_response(data.get("response", ""))

    # ── Helpers ────────────────────────────────────────────────────────

    @staticmethod
    def _parse_json_response(text: str) -> dict:
        """Extract JSON from LLM output, handling markdown fences."""
        text = text.strip()
        # Strip ```json ... ``` fences
        if text.startswith("```"):
            text = text.split("\n", 1)[-1]
            if text.endswith("```"):
                text = text[:-3]
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            logger.error("Failed to parse LLM JSON response: %s", text[:200])
            return {
                "score": 0.0,
                "rationale": "Failed to parse LLM response.",
                "matched_skills": [],
                "missing_skills": [],
            }


# ── Singleton ──────────────────────────────────────────────────────────

_llm_provider: Optional[LLMProvider] = None


def get_llm_provider() -> LLMProvider:
    global _llm_provider
    if _llm_provider is None:
        _llm_provider = LLMProvider()
    return _llm_provider
