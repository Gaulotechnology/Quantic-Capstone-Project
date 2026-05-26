from __future__ import annotations

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.user.aggregate import User
from app.domain.user.repository import UserRepository
from app.domain.user.value_objects import Email, Password, Role
from app.infrastructure.database.models import UserModel


class PostgresUserRepository(UserRepository):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def add(self, user: User) -> None:
        self._session.add(_to_model(user))
        await self._session.flush()

    async def get_by_id(self, id: uuid.UUID) -> User | None:
        result = await self._session.get(UserModel, id)
        return _to_aggregate(result) if result else None

    async def get_by_email(self, email: Email) -> User | None:
        stmt = select(UserModel).where(UserModel.email == email.value)
        result = await self._session.execute(stmt)
        model = result.scalar_one_or_none()
        return _to_aggregate(model) if model else None

    async def update(self, user: User) -> None:
        model = await self._session.get(UserModel, user.id)
        if model:
            model.email = user.email.value
            model.password_hash = user.password.hashed
            model.full_name = user.full_name
            model.role = user.role.value
            model.is_active = user.is_active
            model.updated_at = user.updated_at
            await self._session.flush()

    async def email_exists(self, email: Email) -> bool:
        stmt = select(UserModel.id).where(UserModel.email == email.value)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None


# ---------------------------------------------------------------------------
# Mapper helpers
# ---------------------------------------------------------------------------

def _to_model(user: User) -> UserModel:
    return UserModel(
        id=user.id,
        email=user.email.value,
        password_hash=user.password.hashed,
        full_name=user.full_name,
        role=user.role.value,
        is_active=user.is_active,
        created_at=user.created_at,
        updated_at=user.updated_at,
    )


def _to_aggregate(model: UserModel) -> User:
    return User(
        id=model.id,
        email=Email(model.email),
        password=Password.from_hash(model.password_hash),
        full_name=model.full_name,
        role=Role(model.role),
        is_active=model.is_active,
        created_at=model.created_at,
        updated_at=model.updated_at,
    )
