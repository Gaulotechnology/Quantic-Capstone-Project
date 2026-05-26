class DomainError(Exception):
    """Base for all identity domain errors."""


class EmailAlreadyRegisteredError(DomainError):
    pass


class InvalidCredentialsError(DomainError):
    pass


class UserNotFoundError(DomainError):
    pass


class InactiveUserError(DomainError):
    pass


class WeakPasswordError(DomainError):
    pass


class InvalidEmailError(DomainError):
    pass


class TokenError(DomainError):
    pass


class TokenExpiredError(TokenError):
    pass


class TokenRevokedError(TokenError):
    pass
