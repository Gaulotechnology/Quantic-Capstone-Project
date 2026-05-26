from __future__ import annotations

import asyncio
import uuid
from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List

from pydantic import BaseModel, Field


class DomainEvent(BaseModel):
    """Base class for all domain events. Serialisable via Pydantic."""

    event_id: uuid.UUID = Field(default_factory=uuid.uuid4)
    event_name: str
    aggregate_id: uuid.UUID
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    data: Dict[str, Any] = Field(default_factory=dict)

    model_config = {"frozen": True}

    def to_json(self) -> str:
        return self.model_dump_json()

    @classmethod
    def from_json(cls, json_str: str) -> "DomainEvent":
        return cls.model_validate_json(json_str)


# ---------------------------------------------------------------------------
# Decorator-based handler registry (process-local, for simple wiring)
# ---------------------------------------------------------------------------
_handler_registry: Dict[str, List[Callable]] = {}


def event_handler(event_name: str) -> Callable:
    """Register a callable as a handler for a named domain event.

    Usage::

        @event_handler("identity.user_registered")
        async def on_user_registered(event: DomainEvent) -> None:
            ...
    """
    def decorator(func: Callable) -> Callable:
        _handler_registry.setdefault(event_name, []).append(func)
        return func
    return decorator


# ---------------------------------------------------------------------------
# EventBus interface + in-memory implementation for testing
# ---------------------------------------------------------------------------

class EventBus(ABC):
    """Abstract event bus — publish domain events, subscribe handlers."""

    @abstractmethod
    async def publish(self, event: DomainEvent) -> None: ...

    @abstractmethod
    async def subscribe(self, event_name: str, handler: Callable) -> None: ...


class InMemoryEventBus(EventBus):
    """Synchronous in-memory bus. Suitable for unit tests only."""

    def __init__(self) -> None:
        self._handlers: Dict[str, List[Callable]] = {}

    async def publish(self, event: DomainEvent) -> None:
        for handler in self._handlers.get(event.event_name, []):
            if asyncio.iscoroutinefunction(handler):
                await handler(event)
            else:
                handler(event)

    async def subscribe(self, event_name: str, handler: Callable) -> None:
        self._handlers.setdefault(event_name, []).append(handler)
