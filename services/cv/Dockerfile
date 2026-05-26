FROM python:3.12-slim

# tesseract OCR for scanned PDF fallback
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

WORKDIR /app

COPY pyproject.toml uv.lock* .python-version* ./
COPY shared/ ./shared/
COPY services/cv/pyproject.toml ./services/cv/

RUN uv sync --package cv-service --frozen --no-dev

COPY services/cv/app/ ./services/cv/app/

ENV PATH="/app/.venv/bin:$PATH"
ENV PYTHONPATH="/app/services/cv"

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
