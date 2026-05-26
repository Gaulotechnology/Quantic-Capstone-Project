from __future__ import annotations

import uuid
from datetime import datetime, timezone

from tumaini_shared.domain.base import AggregateRoot

from app.domain.user.events import (
    PasswordChanged,
    UserDeactivated,
    UserLoggedIn,
    UserRegistered,
    UserRoleChanged,
)
from app.domain.user.exceptions import InactiveUserError, InvalidCredentialsError
from app.domain.user.value_objects import Email, Password, Role


class User(AggregateRoot):
    """
    User aggregate root.

    All state changes go through methods — no direct attribute mutation from outside.
    Domain events are collected via _raise_event() and published after persistence.
    """

    def __init__(
        self,
        id: uuid.UUID,
        email: Email,
        password: Password,
        full_name: str,
        role: Role,
        is_active: bool = True,
        created_at: datetime | None = None,
        updated_at: datetime | None = None,
    ) -> None:
        super().__init__(id)
        self.email = email
        self.password = password
        self.full_name = full_name
        self.role = role
        self.is_active = is_active
        self.created_at = created_at or datetime.now(timezone.utc)
        self.updated_at = updated_at or datetime.now(timezone.utc)

    # ------------------------------------------------------------------
    # Factory
    # ------------------------------------------------------------------

    @classmethod
    def register(
        cls,
        email: str,
        plain_password: str,
        full_name: str,
        role: Role = Role.CANDIDATE,
    ) -> "User":
        """Create a new user and raise UserRegistered event."""
        user = cls(
            id=uuid.uuid4(),
            email=Email(email),
            password=Password.create(plain_password),
            full_name=full_name.strip(),
            role=role,
        )
        user._raise_event(
            UserRegistered(
                event_name="identity.user_registered",
                aggregate_id=user.id,
                data={
                    "user_id": str(user.id),
                    "email": user.email.value,
                    "role": user.role.value,
                },
            )
        )
        return user

    # ------------------------------------------------------------------
    # Behaviour
    # ------------------------------------------------------------------

    def authenticate(self, plain_password: str) -> None:
        """
        Verify credentials and raise UserLoggedIn event.
        Raises InvalidCredentialsError or InactiveUserError on failure.
        """
        if not self.is_active:
            raise InactiveUserError("Account is deactivated.")
        if not self.password.verify(plain_password):
            raise InvalidCredentialsError("Invalid credentials.")
        self._raise_event(
            UserLoggedIn(
                event_name="identity.user_logged_in",
                aggregate_id=self.id,
                data={"user_id": str(self.id), "email": self.email.value},
            )
        )

    def change_role(self, new_role: Role) -> None:
        old_role = self.role
        self.role = new_role
        self.updated_at = datetime.now(timezone.utc)
        self._raise_event(
            UserRoleChanged(
                event_name="identity.user_role_changed",
                aggregate_id=self.id,
                data={
                    "user_id": str(self.id),
                    "old_role": old_role.value,
                    "new_role": new_role.value,
                },
            )
        )

    def change_password(self, new_plain_password: str) -> None:
        self.password = Password.create(new_plain_password)
        self.updated_at = datetime.now(timezone.utc)
        self._raise_event(
            PasswordChanged(
                event_name="identity.password_changed",
                aggregate_id=self.id,
                data={"user_id": str(self.id)},
            )
        )

    def deactivate(self) -> None:
        self.is_active = False
        self.updated_at = datetime.now(timezone.utc)
        self._raise_event(
            UserDeactivated(
                event_name="identity.user_deactivated",
                aggregate_id=self.id,
                data={"user_id": str(self.id)},
            )
        )
