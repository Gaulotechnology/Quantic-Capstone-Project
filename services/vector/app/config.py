"""Vector service configuration loaded from environment / .env."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ── Qdrant ───────────────────────────────────────────────
    QDRANT_URL: str = "http://localhost:6333"

    # ── Redis ────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/1"

    # ── RabbitMQ ─────────────────────────────────────────────
    RABBITMQ_URL: str = "amqp://guest:guest@localhost:5672/"

    # ── LLM ──────────────────────────────────────────────────
    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.deepseek.com"
    LLM_MODEL: str = "deepseek-chat"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
