import uuid
from dataclasses import dataclass

import pytest

from tumaini_shared.domain.base import AggregateRoot, Entity, ValueObject


# ---------------------------------------------------------------------------
# Concrete test doubles
# ---------------------------------------------------------------------------

class User(Entity):
    def __init__(self, id: uuid.UUID, name: str) -> None:
        super().__init__(id)
        self.name = name


class Order(AggregateRoot):
    def __init__(self, id: uuid.UUID) -> None:
        super().__init__(id)

    def place(self, event: object) -> None:
        self._raise_event(event)


@dataclass(frozen=True)
class Email(ValueObject):
    value: str


# ---------------------------------------------------------------------------
# Entity tests
# ---------------------------------------------------------------------------

class TestEntity:
    def test_equal_when_same_id(self) -> None:
        id_ = uuid.uuid4()
        assert User(id_, "Alice") == User(id_, "Different name")

    def test_not_equal_when_different_id(self) -> None:
        assert User(uuid.uuid4(), "Alice") != User(uuid.uuid4(), "Alice")

    def test_hash_based_on_id(self) -> None:
        id_ = uuid.uuid4()
        assert hash(User(id_, "Alice")) == hash(User(id_, "Bob"))

    def test_id_property_returns_uuid(self) -> None:
        id_ = uuid.uuid4()
        assert User(id_, "x").id == id_

    def test_different_types_not_equal(self) -> None:
        id_ = uuid.uuid4()
        assert User(id_, "x") != id_


# ---------------------------------------------------------------------------
# AggregateRoot tests
# ---------------------------------------------------------------------------

class TestAggregateRoot:
    def test_raises_event_and_pop_returns_it(self) -> None:
        order = Order(uuid.uuid4())
        order.place("OrderPlaced")
        events = order.pop_events()
        assert events == ["OrderPlaced"]

    def test_pop_clears_the_event_list(self) -> None:
        order = Order(uuid.uuid4())
        order.place("OrderPlaced")
        order.pop_events()
        assert order.pop_events() == []

    def test_multiple_events_preserved_in_order(self) -> None:
        order = Order(uuid.uuid4())
        order.place("first")
        order.place("second")
        assert order.pop_events() == ["first", "second"]


# ---------------------------------------------------------------------------
# ValueObject tests
# ---------------------------------------------------------------------------

class TestValueObject:
    def test_equal_by_value(self) -> None:
        assert Email("a@b.com") == Email("a@b.com")

    def test_not_equal_on_different_value(self) -> None:
        assert Email("a@b.com") != Email("c@d.com")

    def test_immutable_raises_on_assignment(self) -> None:
        with pytest.raises((TypeError, AttributeError)):
            Email("a@b.com").value = "changed"  # type: ignore[misc]

    def test_usable_as_dict_key(self) -> None:
        d = {Email("a@b.com"): 1}
        assert d[Email("a@b.com")] == 1
