FROM python:3.12-slim

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

# Copy workspace manifests (needed for dep resolution)
COPY pyproject.toml uv.lock* .python-version* ./
COPY shared/ ./shared/
COPY services/identity/pyproject.toml ./services/identity/

# Install production deps for this service only
RUN uv sync --package identity-service --frozen --no-dev

# Copy service source code and migrations
COPY services/identity/app/ ./services/identity/app/
COPY services/identity/alembic/ ./services/identity/alembic/
COPY services/identity/alembic.ini ./services/identity/alembic.ini

ENV PATH="/app/.venv/bin:$PATH"
# uvicorn resolves app.main:app relative to this directory
ENV PYTHONPATH="/app/services/identity"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
