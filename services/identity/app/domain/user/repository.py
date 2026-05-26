from __future__ import annotations

import uuid
from abc import ABC, abstractmethod

from app.domain.user.aggregate import User
from app.domain.user.value_objects import Email


class UserRepository(ABC):
    """Async persistence interface for the User aggregate."""

    @abstractmethod
    async def add(self, user: User) -> None: ...

    @abstractmethod
    async def get_by_id(self, id: uuid.UUID) -> User | None: ...

    @abstractmethod
    async def get_by_email(self, email: Email) -> User | None: ...

    @abstractmethod
    async def update(self, user: User) -> None: ...

    @abstractmethod
    async def email_exists(self, email: Email) -> bool: ...
