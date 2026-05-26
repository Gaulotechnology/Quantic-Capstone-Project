import pytest
from app.domain.user.exceptions import InvalidEmailError, WeakPasswordError
from app.domain.user.value_objects import Email, Password, Role


class TestEmail:
    def test_normalises_to_lowercase(self):
        assert Email("Alice@Example.COM").value == "alice@example.com"

    def test_strips_whitespace(self):
        assert Email("  user@test.com  ").value == "user@test.com"

    def test_rejects_invalid_format(self):
        with pytest.raises(InvalidEmailError):
            Email("not-an-email")

    def test_equal_by_value(self):
        assert Email("a@b.com") == Email("a@b.com")

    def test_case_insensitive_equality(self):
        assert Email("A@B.COM") == Email("a@b.com")

    def test_immutable(self):
        with pytest.raises((TypeError, AttributeError)):
            Email("a@b.com").value = "other"  # type: ignore[misc]


class TestPassword:
    def test_create_hashes_password(self):
        pwd = Password.create("StrongP@ss1")
        assert pwd.hashed != "StrongP@ss1"

    def test_verify_correct_password(self):
        pwd = Password.create("StrongP@ss1")
        assert pwd.verify("StrongP@ss1") is True

    def test_verify_wrong_password(self):
        pwd = Password.create("StrongP@ss1")
        assert pwd.verify("WrongPassword") is False

    def test_rejects_short_password(self):
        with pytest.raises(WeakPasswordError):
            Password.create("short")

    def test_from_hash_round_trip(self):
        pwd = Password.create("StrongP@ss1")
        restored = Password.from_hash(pwd.hashed)
        assert restored.verify("StrongP@ss1") is True

    def test_hashed_is_never_plaintext(self):
        plain = "StrongP@ss1"
        pwd = Password.create(plain)
        assert plain not in pwd.hashed


class TestRole:
    def test_all_roles_defined(self):
        assert Role.CANDIDATE.value == "CANDIDATE"
        assert Role.RECRUITER.value == "RECRUITER"
        assert Role.ADMIN.value == "ADMIN"
