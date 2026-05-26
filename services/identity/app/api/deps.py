from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from redis.asyncio import Redis
from sqlalchemy.ext.asyncio import AsyncSession

from app.application.services.auth_service import AuthService
from app.config import get_settings
from app.domain.user.aggregate import User
from app.domain.user.exceptions import TokenError, TokenExpiredError, TokenRevokedError
from app.domain.user.value_objects import Role
from app.infrastructure.cache.redis_client import get_redis
from app.infrastructure.database.engine import get_db
from app.infrastructure.database.user_repository import PostgresUserRepository
from app.infrastructure.security.token_service import TokenService

# auto_error=False so we can return 401 (not 403) for missing credentials
_bearer = HTTPBearer(auto_error=False)


# ---------------------------------------------------------------------------
# Token service
# ---------------------------------------------------------------------------

async def get_token_service(redis: Redis = Depends(get_redis)) -> TokenService:
    s = get_settings()
    return TokenService(
        secret=s.JWT_SECRET,
        algorithm=s.JWT_ALGORITHM,
        access_expire_minutes=s.ACCESS_TOKEN_EXPIRE_MINUTES,
        refresh_expire_days=s.REFRESH_TOKEN_EXPIRE_DAYS,
        redis=redis,
    )


# ---------------------------------------------------------------------------
# Auth service
# ---------------------------------------------------------------------------

async def get_auth_service(
    db: AsyncSession = Depends(get_db),
    token_service: TokenService = Depends(get_token_service),
) -> AuthService:
    return AuthService(
        user_repo=PostgresUserRepository(db),
        token_service=token_service,
    )


# ---------------------------------------------------------------------------
# Current user — Story 2.4 RBAC
# ---------------------------------------------------------------------------

async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Security(_bearer),
    auth_service: AuthService = Depends(get_auth_service),
    token_service: TokenService = Depends(get_token_service),
) -> User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    if await token_service.is_access_token_blacklisted(token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked.",
        )
    try:
        payload = token_service.validate_access_token(token)
    except TokenExpiredError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (TokenError, TokenRevokedError) as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(exc),
            headers={"WWW-Authenticate": "Bearer"},
        )

    import uuid
    user = await auth_service.get_user_by_id(uuid.UUID(payload["sub"]))
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive.",
        )
    return user


def require_role(*roles: Role):
    """
    Dependency factory — restricts an endpoint to specific roles.

    Usage::

        @router.get("/recruiter/jobs")
        async def list_jobs(user: User = Depends(require_role(Role.RECRUITER))):
            ...
    """
    async def _check(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions.",
            )
        return current_user
    return _check


# Convenience type aliases
CurrentUser = Annotated[User, Depends(get_current_user)]
RecruiterUser = Annotated[User, Depends(require_role(Role.RECRUITER, Role.ADMIN))]
AdminUser = Annotated[User, Depends(require_role(Role.ADMIN))]
