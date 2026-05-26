from tumaini_shared.domain.events import DomainEvent


class UserRegistered(DomainEvent):
    """Raised when a new user successfully registers."""


class UserLoggedIn(DomainEvent):
    """Raised on successful authentication."""


class UserLoggedOut(DomainEvent):
    """Raised when a user explicitly logs out."""


class UserRoleChanged(DomainEvent):
    """Raised when an admin changes a user's role."""


class UserDeactivated(DomainEvent):
    """Raised when a user account is deactivated."""


class PasswordChanged(DomainEvent):
    """Raised when a user changes their password."""


class PasswordResetRequested(DomainEvent):
    """Raised when a password-reset email is requested."""
