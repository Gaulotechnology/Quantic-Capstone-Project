from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

import jwt
from redis.asyncio import Redis

from app.domain.user.exceptions import TokenExpiredError, TokenError, TokenRevokedError
from app.domain.user.value_objects import Role

_ACCESS_TOKEN_TYPE = "access"
_REFRESH_TOKEN_TYPE = "refresh"
_RESET_TOKEN_TYPE = "reset"

_BLACKLIST_PREFIX = "token:blacklist:"
_REFRESH_PREFIX = "token:refresh:"


class TokenService:
    """
    Handles JWT creation, validation, rotation, and revocation.

    Access tokens  — short-lived (15 min), stateless.
    Refresh tokens — long-lived (7 days), tracked in Redis for rotation/revocation.
    Reset tokens   — short-lived (1 hr), tracked in Redis.
    """

    def __init__(
        self,
        secret: str,
        algorithm: str,
        access_expire_minutes: int,
        refresh_expire_days: int,
        redis: Redis,
    ) -> None:
        self._secret = secret
        self._algorithm = algorithm
        self._access_expire = timedelta(minutes=access_expire_minutes)
        self._refresh_expire = timedelta(days=refresh_expire_days)
        self._redis = redis

    # ------------------------------------------------------------------
    # Generation
    # ------------------------------------------------------------------

    def generate_access_token(self, user_id: uuid.UUID, role: Role) -> str:
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(user_id),
            "role": role.value,
            "type": _ACCESS_TOKEN_TYPE,
            "iat": now,
            "exp": now + self._access_expire,
        }
        return jwt.encode(payload, self._secret, algorithm=self._algorithm)

    async def generate_refresh_token(self, user_id: uuid.UUID) -> str:
        now = datetime.now(timezone.utc)
        jti = str(uuid.uuid4())
        payload = {
            "sub": str(user_id),
            "jti": jti,
            "type": _REFRESH_TOKEN_TYPE,
            "iat": now,
            "exp": now + self._refresh_expire,
        }
        token = jwt.encode(payload, self._secret, algorithm=self._algorithm)
        # Register in Redis so it can be invalidated
        ttl = int(self._refresh_expire.total_seconds())
        await self._redis.setex(f"{_REFRESH_PREFIX}{jti}", ttl, str(user_id))
        return token

    async def generate_reset_token(self, user_id: uuid.UUID) -> str:
        now = datetime.now(timezone.utc)
        jti = str(uuid.uuid4())
        expire = timedelta(hours=1)
        payload = {
            "sub": str(user_id),
            "jti": jti,
            "type": _RESET_TOKEN_TYPE,
            "iat": now,
            "exp": now + expire,
        }
        token = jwt.encode(payload, self._secret, algorithm=self._algorithm)
        ttl = int(expire.total_seconds())
        await self._redis.setex(f"{_REFRESH_PREFIX}{jti}", ttl, str(user_id))
        return token

    # ------------------------------------------------------------------
    # Validation
    # ------------------------------------------------------------------

    def validate_access_token(self, token: str) -> dict:
        """Decode and validate an access token. Returns the payload dict."""
        return self._decode(token, expected_type=_ACCESS_TOKEN_TYPE)

    async def validate_refresh_token(self, token: str) -> dict:
        payload = self._decode(token, expected_type=_REFRESH_TOKEN_TYPE)
        jti = payload["jti"]
        exists = await self._redis.exists(f"{_REFRESH_PREFIX}{jti}")
        if not exists:
            raise TokenRevokedError("Refresh token has been revoked.")
        return payload

    async def validate_reset_token(self, token: str) -> uuid.UUID:
        payload = self._decode(token, expected_type=_RESET_TOKEN_TYPE)
        jti = payload["jti"]
        exists = await self._redis.exists(f"{_REFRESH_PREFIX}{jti}")
        if not exists:
            raise TokenRevokedError("Reset token is invalid or already used.")
        # Consume — single use
        await self._redis.delete(f"{_REFRESH_PREFIX}{jti}")
        return uuid.UUID(payload["sub"])

    # ------------------------------------------------------------------
    # Rotation & Revocation
    # ------------------------------------------------------------------

    async def rotate_refresh_token(
        self, refresh_token: str, role: Role
    ) -> tuple[str, str]:
        """Invalidate the old refresh token and issue a fresh pair."""
        payload = await self.validate_refresh_token(refresh_token)
        user_id = uuid.UUID(payload["sub"])
        # Revoke old refresh token
        await self._redis.delete(f"{_REFRESH_PREFIX}{payload['jti']}")
        # Issue new pair
        new_access = self.generate_access_token(user_id, role)
        new_refresh = await self.generate_refresh_token(user_id)
        return new_access, new_refresh

    async def revoke_access_token(self, token: str) -> None:
        """Blacklist an access token until it naturally expires."""
        try:
            payload = self._decode(token, expected_type=_ACCESS_TOKEN_TYPE)
        except (TokenExpiredError, TokenError):
            return  # already dead — nothing to revoke
        exp: datetime = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
        ttl = int((exp - datetime.now(timezone.utc)).total_seconds())
        if ttl > 0:
            await self._redis.setex(f"{_BLACKLIST_PREFIX}{token}", ttl, "1")

    async def is_access_token_blacklisted(self, token: str) -> bool:
        return bool(await self._redis.exists(f"{_BLACKLIST_PREFIX}{token}"))

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _decode(self, token: str, *, expected_type: str) -> dict:
        try:
            payload = jwt.decode(
                token, self._secret, algorithms=[self._algorithm]
            )
        except jwt.ExpiredSignatureError:
            raise TokenExpiredError("Token has expired.")
        except jwt.InvalidTokenError as exc:
            raise TokenError(f"Invalid token: {exc}") from exc

        if payload.get("type") != expected_type:
            raise TokenError(f"Expected {expected_type} token.")
        return payload
