from tumaini_shared.api.app import create_app

from app.api.routes import search

app = create_app(
    title="Vector Service",
    description=(
        "Semantic candidate search powered by DeepSeek LLM. "
        "Generates 384-dimensional CV embeddings using sentence-transformers "
        "and stores them in Qdrant for sub-second retrieval."
    ),
)

app.include_router(search.router, prefix="/api")


@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok", "service": "vector"}
