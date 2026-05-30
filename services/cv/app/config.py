from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # LLM Settings (DeepSeek)
    OPENAI_API_KEY: str = "sk-..."
    OPENAI_BASE_URL: str = "https://api.deepseek.com"
    LLM_MODEL: str = "deepseek-chat"

    # Service Settings
    VECTOR_SERVICE_URL: str = "http://vector:8000/api/vectors/add"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache
def get_settings() -> Settings:
    return Settings()
