FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock* .python-version* ./
COPY shared/ ./shared/
COPY services/vector/pyproject.toml ./services/vector/

RUN uv sync --package vector-service --no-dev

COPY services/vector/app/ ./services/vector/app/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/services/vector"
# Cache sentence-transformer model inside the image layer
ENV SENTENCE_TRANSFORMERS_HOME="/app/.cache/sentence-transformers"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
