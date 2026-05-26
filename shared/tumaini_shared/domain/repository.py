from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from typing import Any, Generic, List, Optional, TypeVar

T = TypeVar("T")


# ---------------------------------------------------------------------------
# Specification pattern — composable query predicates
# ---------------------------------------------------------------------------

class Specification(ABC, Generic[T]):
    """Encapsulates a single query predicate. Supports AND / OR / NOT composition."""

    @abstractmethod
    def is_satisfied_by(self, entity: T) -> bool: ...

    def and_(self, other: Specification[T]) -> AndSpecification[T]:
        return AndSpecification(self, other)

    def or_(self, other: Specification[T]) -> OrSpecification[T]:
        return OrSpecification(self, other)

    def not_(self) -> NotSpecification[T]:
        return NotSpecification(self)


class AndSpecification(Specification[T]):
    def __init__(self, left: Specification[T], right: Specification[T]) -> None:
        self._left = left
        self._right = right

    def is_satisfied_by(self, entity: T) -> bool:
        return self._left.is_satisfied_by(entity) and self._right.is_satisfied_by(entity)


class OrSpecification(Specification[T]):
    def __init__(self, left: Specification[T], right: Specification[T]) -> None:
        self._left = left
        self._right = right

    def is_satisfied_by(self, entity: T) -> bool:
        return self._left.is_satisfied_by(entity) or self._right.is_satisfied_by(entity)


class NotSpecification(Specification[T]):
    def __init__(self, spec: Specification[T]) -> None:
        self._spec = spec

    def is_satisfied_by(self, entity: T) -> bool:
        return not self._spec.is_satisfied_by(entity)


# ---------------------------------------------------------------------------
# Generic repository interface
# ---------------------------------------------------------------------------

class GenericRepository(ABC, Generic[T]):
    """Persistence-agnostic contract for an aggregate root repository."""

    @abstractmethod
    def add(self, entity: T) -> None: ...

    @abstractmethod
    def get(self, id: uuid.UUID) -> Optional[T]: ...

    @abstractmethod
    def find(self, specification: Specification[T]) -> List[T]: ...

    @abstractmethod
    def find_all(self) -> List[T]: ...

    @abstractmethod
    def update(self, entity: T) -> None: ...

    @abstractmethod
    def delete(self, id: uuid.UUID) -> None: ...

    @abstractmethod
    def save(self) -> None: ...


class InMemoryRepository(GenericRepository[T]):
    """Dict-backed repository for unit tests. No persistence."""

    def __init__(self) -> None:
        self._store: dict[uuid.UUID, T] = {}

    def add(self, entity: T) -> None:
        self._store[entity.id] = entity  # type: ignore[attr-defined]

    def get(self, id: uuid.UUID) -> Optional[T]:
        return self._store.get(id)

    def find(self, specification: Specification[T]) -> List[T]:
        return [e for e in self._store.values() if specification.is_satisfied_by(e)]

    def find_all(self) -> List[T]:
        return list(self._store.values())

    def update(self, entity: T) -> None:
        self._store[entity.id] = entity  # type: ignore[attr-defined]

    def delete(self, id: uuid.UUID) -> None:
        self._store.pop(id, None)

    def save(self) -> None:
        pass  # no-op — changes are immediate in memory


# ---------------------------------------------------------------------------
# Unit of Work interface
# ---------------------------------------------------------------------------

class UnitOfWork(ABC):
    """Coordinates commits and rollbacks across multiple repositories."""

    @abstractmethod
    def __enter__(self) -> UnitOfWork: ...

    @abstractmethod
    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None: ...

    @abstractmethod
    def commit(self) -> None: ...

    @abstractmethod
    def rollback(self) -> None: ...


class InMemoryUnitOfWork(UnitOfWork):
    """No-op unit of work for use with InMemoryRepository in tests."""

    def __enter__(self) -> InMemoryUnitOfWork:
        return self

    def __exit__(self, exc_type: Any, exc_val: Any, exc_tb: Any) -> None:
        if exc_type:
            self.rollback()

    def commit(self) -> None:
        pass

    def rollback(self) -> None:
        pass
