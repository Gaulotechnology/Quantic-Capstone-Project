from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from scalar_fastapi import get_scalar_api_reference


def create_app(
    *,
    title: str,
    description: str = "",
    version: str = "0.1.0",
) -> FastAPI:
    """
    Application factory for all Tumaini microservices.

    - Disables the default Swagger UI and ReDoc.
    - Mounts Scalar API reference at ``/docs``.
    - OpenAPI JSON schema remains at ``/openapi.json``.
    - Configures CORS for local development and production.

    Usage::

        from tumaini_shared.api.app import create_app

        app = create_app(title="Identity Service", description="Auth & JWT")

        @app.get("/health")
        async def health() -> dict:
            return {"status": "ok", "service": "identity"}
    """
    app = FastAPI(
        title=title,
        description=description,
        version=version,
        docs_url=None,    # replaced by Scalar below
        redoc_url=None,
    )

    # ---------------------------------------------------------------------------
    # CORS (Cross-Origin Resource Sharing)
    # ---------------------------------------------------------------------------
    import os
    allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
    allowed_origins = [o.strip() for o in allowed_origins if o.strip()]
    
    # If ALLOWED_ORIGINS is not set, we default to a restrictive local-only regex in production
    # but keep the permissive one if specifically requested for development.
    origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX")
    
    if not allowed_origins and not origin_regex:
        # Default for local development
        origin_regex = r"https?://(localhost|127\.0\.0\.1)(:\d+)?"
    
    middleware_kwargs = {
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
        "expose_headers": ["*"],
    }
    
    if allowed_origins:
        middleware_kwargs["allow_origins"] = allowed_origins
    else:
        middleware_kwargs["allow_origin_regex"] = origin_regex

    app.add_middleware(CORSMiddleware, **middleware_kwargs)

    @app.get("/docs", include_in_schema=False, response_class=HTMLResponse)
    async def scalar_docs() -> HTMLResponse:
        return get_scalar_api_reference(
            openapi_url="/openapi.json",
            title=f"{title} — API Reference",
        )

    return app
