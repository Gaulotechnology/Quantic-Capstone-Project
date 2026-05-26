"""LLM provider abstraction — DeepSeek (primary) + Ollama (fallback)."""

from app.infrastructure.llm.provider import LLMProvider, get_llm_provider

__all__ = ["LLMProvider", "get_llm_provider"]
