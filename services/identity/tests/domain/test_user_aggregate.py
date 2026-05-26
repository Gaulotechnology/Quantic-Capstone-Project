import pytest
from app.domain.user.aggregate import User
from app.domain.user.events import (
    PasswordChanged,
    UserDeactivated,
    UserLoggedIn,
    UserRegistered,
    UserRoleChanged,
)
from app.domain.user.exceptions import InactiveUserError, InvalidCredentialsError
from app.domain.user.value_objects import Role


class TestUserRegister:
    def test_creates_user_with_correct_fields(self):
        user = User.register("alice@test.com", "StrongP@ss1", "Alice Smith")
        assert user.email.value == "alice@test.com"
        assert user.full_name == "Alice Smith"
        assert user.role == Role.CANDIDATE
        assert user.is_active is True

    def test_raises_user_registered_event(self):
        user = User.register("alice@test.com", "StrongP@ss1", "Alice")
        events = user.pop_events()
        assert len(events) == 1
        assert isinstance(events[0], UserRegistered)
        assert events[0].data["email"] == "alice@test.com"

    def test_strips_full_name_whitespace(self):
        user = User.register("a@b.com", "StrongP@ss1", "  Bob  ")
        assert user.full_name == "Bob"

    def test_default_role_is_candidate(self):
        user = User.register("a@b.com", "StrongP@ss1", "Bob")
        assert user.role == Role.CANDIDATE

    def test_can_register_as_recruiter(self):
        user = User.register("r@b.com", "StrongP@ss1", "Rec", role=Role.RECRUITER)
        assert user.role == Role.RECRUITER


class TestUserAuthenticate:
    def setup_method(self):
        self.user = User.register("alice@test.com", "StrongP@ss1", "Alice")
        self.user.pop_events()  # clear registration event

    def test_correct_password_raises_logged_in_event(self):
        self.user.authenticate("StrongP@ss1")
        events = self.user.pop_events()
        assert len(events) == 1
        assert isinstance(events[0], UserLoggedIn)

    def test_wrong_password_raises_error(self):
        with pytest.raises(InvalidCredentialsError):
            self.user.authenticate("WrongPassword")

    def test_wrong_password_raises_no_event(self):
        with pytest.raises(InvalidCredentialsError):
            self.user.authenticate("WrongPassword")
        assert self.user.pop_events() == []

    def test_inactive_user_cannot_authenticate(self):
        self.user.deactivate()
        self.user.pop_events()
        with pytest.raises(InactiveUserError):
            self.user.authenticate("StrongP@ss1")


class TestUserChangeRole:
    def test_changes_role_and_raises_event(self):
        user = User.register("a@b.com", "StrongP@ss1", "Alice")
        user.pop_events()
        user.change_role(Role.RECRUITER)
        assert user.role == Role.RECRUITER
        events = user.pop_events()
        assert isinstance(events[0], UserRoleChanged)
        assert events[0].data["new_role"] == "RECRUITER"


class TestUserDeactivate:
    def test_deactivates_and_raises_event(self):
        user = User.register("a@b.com", "StrongP@ss1", "Alice")
        user.pop_events()
        user.deactivate()
        assert user.is_active is False
        events = user.pop_events()
        assert isinstance(events[0], UserDeactivated)


class TestChangePassword:
    def test_changes_password_and_raises_event(self):
        user = User.register("a@b.com", "OldP@ssword1", "Alice")
        user.pop_events()
        user.change_password("NewP@ssword1")
        assert user.password.verify("NewP@ssword1") is True
        assert user.password.verify("OldP@ssword1") is False
        events = user.pop_events()
        assert isinstance(events[0], PasswordChanged)
