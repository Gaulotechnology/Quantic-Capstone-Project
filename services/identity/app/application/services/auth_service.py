from __future__ import annotations

import logging
import uuid

from app.domain.user.aggregate import User
from app.domain.user.exceptions import (
    EmailAlreadyRegisteredError,
    InvalidCredentialsError,
    UserNotFoundError,
)
from app.domain.user.repository import UserRepository
from app.domain.user.value_objects import Email, Role
from app.infrastructure.security.token_service import TokenService

logger = logging.getLogger(__name__)


class AuthService:
    """
    Application-layer orchestrator for auth operations.
    Coordinates between the User aggregate, repository, and token service.
    """

    def __init__(self, user_repo: UserRepository, token_service: TokenService) -> None:
        self._repo = user_repo
        self._tokens = token_service

    # ------------------------------------------------------------------
    # Register
    # ------------------------------------------------------------------

    async def register(
        self,
        email: str,
        plain_password: str,
        full_name: str,
        role: Role = Role.CANDIDATE,
    ) -> User:
        email_vo = Email(email)
        if await self._repo.email_exists(email_vo):
            raise EmailAlreadyRegisteredError(f"Email already registered: {email}")

        user = User.register(email, plain_password, full_name, role)
        await self._repo.add(user)
        logger.info("User registered: %s (%s)", user.id, user.email.value)
        return user

    # ------------------------------------------------------------------
    # Login
    # ------------------------------------------------------------------

    async def get_user_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self._repo.get_by_id(user_id)

    async def login(
        self, email: str, plain_password: str
    ) -> tuple[User, str, str]:
        """Return (user, access_token, refresh_token) on success."""
        user = await self._repo.get_by_email(Email(email))
        if not user:
            raise InvalidCredentialsError("Invalid credentials.")

        user.authenticate(plain_password)  # raises on failure
        await self._repo.update(user)

        access = self._tokens.generate_access_token(user.id, user.role)
        refresh = await self._tokens.generate_refresh_token(user.id)
        logger.info("User logged in: %s", user.id)
        return user, access, refresh

    # ------------------------------------------------------------------
    # Logout
    # ------------------------------------------------------------------

    async def logout(self, access_token: str) -> None:
        await self._tokens.revoke_access_token(access_token)

    # ------------------------------------------------------------------
    # Refresh
    # ------------------------------------------------------------------

    async def refresh(self, refresh_token: str) -> tuple[str, str]:
        payload = await self._tokens.validate_refresh_token(refresh_token)
        user_id = uuid.UUID(payload["sub"])
        user = await self._repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError("User not found.")
        return await self._tokens.rotate_refresh_token(refresh_token, user.role)

    # ------------------------------------------------------------------
    # Password reset
    # ------------------------------------------------------------------

    async def request_password_reset(self, email: str) -> str | None:
        """
        Returns a reset token if the email exists.
        Returns None for unknown emails — caller must NOT reveal the difference.
        """
        user = await self._repo.get_by_email(Email(email))
        if not user:
            return None
        token = await self._tokens.generate_reset_token(user.id)
        logger.info("Password reset requested for user: %s", user.id)
        # In production, send the token via email. For MVP, log it.
        logger.warning("[MVP] Password reset token for %s: %s", email, token)
        return token

    async def reset_password(self, reset_token: str, new_password: str) -> None:
        user_id = await self._tokens.validate_reset_token(reset_token)
        user = await self._repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError("User not found.")
        user.change_password(new_password)
        await self._repo.update(user)
        logger.info("Password reset completed for user: %s", user_id)
