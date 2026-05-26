from __future__ import annotations

import uuid
from abc import ABC
from typing import Any, List


class Entity(ABC):
    """Base for all domain entities. Identity is determined solely by ID."""

    def __init__(self, id: uuid.UUID) -> None:
        self._id = id

    @property
    def id(self) -> uuid.UUID:
        return self._id

    def __eq__(self, other: Any) -> bool:
        if not isinstance(other, self.__class__):
            return False
        return self._id == other._id

    def __hash__(self) -> int:
        return hash(self._id)

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(id={self._id})"


class AggregateRoot(Entity):
    """Extends Entity with a domain event collection for pub/sub coordination."""

    def __init__(self, id: uuid.UUID) -> None:
        super().__init__(id)
        self._events: List[Any] = []

    def _raise_event(self, event: Any) -> None:
        self._events.append(event)

    def pop_events(self) -> List[Any]:
        """Return and clear all pending domain events."""
        events = list(self._events)
        self._events.clear()
        return events


class ValueObject(ABC):
    """
    Marker base for value objects.
    Every subclass must be decorated with @dataclass(frozen=True),
    which provides immutability and value-based equality automatically.
    """
    pass
