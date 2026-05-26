"""Matching service configuration loaded from environment / .env."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Database ─────────────────────────────────────────────
    DATABASE_URL: str = (
        "postgresql+asyncpg://tumaini:tumaini_dev@localhost:5436/matching_db"
    )

    # ── RabbitMQ ─────────────────────────────────────────────
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672/"

    # ── LLM ──────────────────────────────────────────────────
    # Primary: DeepSeek via OpenAI-compatible API
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.deepseek.com"
    LLM_MODEL: str = "deepseek-chat"

    # Fallback: local Llama 3 via Ollama
    OLLAMA_BASE_URL: str = "http://localhost:11434"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
