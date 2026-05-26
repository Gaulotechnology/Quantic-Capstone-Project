from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from tumaini_shared.api.app import create_app

from app.api.routes import auth, password_reset
from app.infrastructure.cache.redis_client import close_redis, get_redis


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Warm up Redis connection on startup
    await get_redis()
    yield
    await close_redis()


app = create_app(
    title="Identity Service",
    description=(
        "Handles user registration, login, JWT access/refresh tokens, "
        "role-based access control (RBAC), and password reset."
    ),
)

# Override lifespan after create_app so we can manage Redis lifecycle
app.router.lifespan_context = lifespan

# ---------------------------------------------------------------------------
# Rate limiting (slowapi)
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(auth.router, prefix="/api")
app.include_router(password_reset.router, prefix="/api")


@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok", "service": "identity"}
