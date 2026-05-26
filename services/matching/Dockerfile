FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock* .python-version* ./
COPY shared/ ./shared/
COPY services/matching/pyproject.toml ./services/matching/

RUN uv sync --package matching-service --no-dev

COPY services/matching/app/ ./services/matching/app/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/services/matching"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
