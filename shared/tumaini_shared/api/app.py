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
    # Allow all origins and all ports for local development
    app.add_middleware(
        CORSMiddleware,
        allow_origin_regex=r"https?://.*",  # Permissive regex for all ports/origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )

    @app.get("/docs", include_in_schema=False, response_class=HTMLResponse)
    async def scalar_docs() -> HTMLResponse:
        return get_scalar_api_reference(
            openapi_url="/openapi.json",
            title=f"{title} — API Reference",
        )

    return app
