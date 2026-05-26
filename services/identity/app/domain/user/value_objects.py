from __future__ import annotations

import re
from dataclasses import dataclass
from enum import Enum

import bcrypt

from tumaini_shared.domain.base import ValueObject
from app.domain.user.exceptions import InvalidEmailError, WeakPasswordError

_EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")
_MIN_PASSWORD_LENGTH = 8


@dataclass(frozen=True)
class Email(ValueObject):
    value: str

    def __post_init__(self) -> None:
        normalized = self.value.strip().lower()
        if not _EMAIL_RE.match(normalized):
            raise InvalidEmailError(f"Invalid email format: {self.value!r}")
        object.__setattr__(self, "value", normalized)

    def __str__(self) -> str:
        return self.value


@dataclass(frozen=True)
class Password(ValueObject):
    """Stores only the bcrypt hash — never the plain-text password."""

    hashed: str

    @classmethod
    def create(cls, plain: str) -> "Password":
        if len(plain) < _MIN_PASSWORD_LENGTH:
            raise WeakPasswordError(
                f"Password too weak: minimum {_MIN_PASSWORD_LENGTH} characters"
            )
        hashed = bcrypt.hashpw(plain.encode(), bcrypt.gensalt(rounds=12)).decode()
        return cls(hashed=hashed)

    @classmethod
    def from_hash(cls, hashed: str) -> "Password":
        """Reconstruct a Password from a stored hash (e.g. loaded from DB)."""
        return cls(hashed=hashed)

    def verify(self, plain: str) -> bool:
        return bcrypt.checkpw(plain.encode(), self.hashed.encode())


class Role(str, Enum):
    CANDIDATE = "CANDIDATE"
    RECRUITER = "RECRUITER"
    ADMIN = "ADMIN"
