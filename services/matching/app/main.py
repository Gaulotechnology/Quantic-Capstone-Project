from tumaini_shared.api.app import create_app

from app.api.routes import matching

app = create_app(
    title="Matching Service",
    description=(
        "RAG pipeline that scores and ranks candidates against job descriptions "
        "using DeepSeek (primary) and Llama 3 via Ollama (fallback). "
        "Produces explainable match scores with matched/missing skills."
    ),
)

app.include_router(matching.router, prefix="/api")


@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok", "service": "matching"}
