from contextlib import asynccontextmanager

from fastapi import FastAPI
from tumaini_shared.api.app import create_app
from app.api.routes import jobs, shortlists
from app.infrastructure.database.engine import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables on startup (dev convenience)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = create_app(
    title="Job Service",
    description=(
        "Manages job postings, candidate applications, shortlist creation, "
        "audit trails, and shortlist export to PDF and Excel."
    ),
)

app.router.lifespan_context = lifespan

app.include_router(jobs.router, prefix="/api")
app.include_router(shortlists.router, prefix="/api")


@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok", "service": "job"}


@app.get("/api/applications", tags=["applications"])
async def get_applications() -> list:
    """Stub endpoint to prevent 404 in frontend dashboard."""
    return []
