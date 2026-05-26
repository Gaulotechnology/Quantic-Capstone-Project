FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock* .python-version* ./
COPY shared/ ./shared/
COPY services/job/pyproject.toml ./services/job/

RUN uv sync --package job-service --no-dev

COPY services/job/app/ ./services/job/app/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/services/job"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
