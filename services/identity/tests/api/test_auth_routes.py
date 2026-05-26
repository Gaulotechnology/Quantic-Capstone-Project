"""
API tests for /api/auth/* endpoints.
All stories: 2.1 register, 2.3 login/logout/refresh, 2.4 /me RBAC, 2.5 password reset.
"""
import pytest
from httpx import AsyncClient

from tests.api.conftest import register_and_login

pytestmark = pytest.mark.asyncio


# ===========================================================================
# POST /api/auth/register  (Story 2.3)
# ===========================================================================

class TestRegister:
    async def test_returns_201_with_user_id(self, client: AsyncClient):
        resp = await client.post("/api/auth/register", json={
            "email": "alice@test.com",
            "password": "StrongP@ss1",
            "full_name": "Alice Smith",
            "role": "CANDIDATE",
        })
        assert resp.status_code == 201
        body = resp.json()
        assert "user_id" in body
        assert body["email"] == "alice@test.com"
        assert body["role"] == "CANDIDATE"

    async def test_duplicate_email_returns_409(self, client: AsyncClient):
        payload = {"email": "dup@test.com", "password": "StrongP@ss1", "full_name": "Dup"}
        await client.post("/api/auth/register", json=payload)
        resp = await client.post("/api/auth/register", json=payload)
        assert resp.status_code == 409
        assert "already registered" in resp.json()["detail"].lower()

    async def test_weak_password_returns_422(self, client: AsyncClient):
        resp = await client.post("/api/auth/register", json={
            "email": "user@test.com", "password": "short", "full_name": "User"
        })
        assert resp.status_code == 422

    async def test_invalid_email_returns_422(self, client: AsyncClient):
        resp = await client.post("/api/auth/register", json={
            "email": "not-an-email", "password": "StrongP@ss1", "full_name": "User"
        })
        assert resp.status_code == 422

    async def test_missing_fields_returns_422(self, client: AsyncClient):
        resp = await client.post("/api/auth/register", json={"email": "a@b.com"})
        assert resp.status_code == 422

    async def test_can_register_as_recruiter(self, client: AsyncClient):
        resp = await client.post("/api/auth/register", json={
            "email": "rec@test.com", "password": "StrongP@ss1",
            "full_name": "Recruiter", "role": "RECRUITER",
        })
        assert resp.status_code == 201
        assert resp.json()["role"] == "RECRUITER"


# ===========================================================================
# POST /api/auth/login  (Story 2.3)
# ===========================================================================

class TestLogin:
    async def test_returns_200_with_tokens(self, client: AsyncClient):
        tokens = await register_and_login(client)
        assert "access_token" in tokens
        assert "refresh_token" in tokens
        assert tokens["token_type"] == "bearer"

    async def test_wrong_password_returns_401(self, client: AsyncClient):
        await client.post("/api/auth/register", json={
            "email": "u@test.com", "password": "StrongP@ss1", "full_name": "U"
        })
        resp = await client.post("/api/auth/login", json={
            "email": "u@test.com", "password": "WrongPass"
        })
        assert resp.status_code == 401

    async def test_unknown_email_returns_401(self, client: AsyncClient):
        resp = await client.post("/api/auth/login", json={
            "email": "nobody@test.com", "password": "StrongP@ss1"
        })
        assert resp.status_code == 401

    async def test_returns_user_id_and_role(self, client: AsyncClient):
        tokens = await register_and_login(client, role="RECRUITER")
        assert "user_id" in tokens
        assert tokens["role"] == "RECRUITER"


# ===========================================================================
# POST /api/auth/logout  (Story 2.3)
# ===========================================================================

class TestLogout:
    async def test_returns_204(self, client: AsyncClient):
        tokens = await register_and_login(client)
        resp = await client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        assert resp.status_code == 204

    async def test_token_rejected_after_logout(self, client: AsyncClient):
        tokens = await register_and_login(client)
        access = tokens["access_token"]
        await client.post(
            "/api/auth/logout",
            headers={"Authorization": f"Bearer {access}"},
        )
        resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {access}"},
        )
        assert resp.status_code == 401

    async def test_logout_without_token_returns_401(self, client: AsyncClient):
        resp = await client.post("/api/auth/logout")
        assert resp.status_code == 401


# ===========================================================================
# POST /api/auth/refresh  (Story 2.3)
# ===========================================================================

class TestRefresh:
    async def test_returns_new_token_pair(self, client: AsyncClient):
        tokens = await register_and_login(client)
        resp = await client.post(
            "/api/auth/refresh",
            json={"refresh_token": tokens["refresh_token"]},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert "access_token" in body
        assert "refresh_token" in body
        # Refresh token always rotates (unique jti); access token may be
        # identical if both were issued within the same second (JWT precision).
        assert body["refresh_token"] != tokens["refresh_token"]

    async def test_invalid_refresh_token_returns_401(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/refresh", json={"refresh_token": "garbage.token.here"}
        )
        assert resp.status_code == 401


# ===========================================================================
# GET /api/auth/me  (Story 2.4 — RBAC)
# ===========================================================================

class TestMe:
    async def test_returns_user_profile(self, client: AsyncClient):
        tokens = await register_and_login(client, email="me@test.com")
        resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {tokens['access_token']}"},
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["email"] == "me@test.com"
        assert body["is_active"] is True

    async def test_no_token_returns_401(self, client: AsyncClient):
        resp = await client.get("/api/auth/me")
        assert resp.status_code == 401

    async def test_invalid_token_returns_401(self, client: AsyncClient):
        resp = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid.token.here"},
        )
        assert resp.status_code == 401


# ===========================================================================
# POST /api/auth/password-reset/*  (Story 2.5)
# ===========================================================================

class TestPasswordReset:
    async def test_request_always_returns_202(self, client: AsyncClient):
        # Known email
        await client.post("/api/auth/register", json={
            "email": "known@test.com", "password": "StrongP@ss1", "full_name": "K"
        })
        resp = await client.post(
            "/api/auth/password-reset/request",
            json={"email": "known@test.com"},
        )
        assert resp.status_code == 202

    async def test_unknown_email_also_returns_202(self, client: AsyncClient):
        """Prevents email enumeration — unknown emails must get the same response."""
        resp = await client.post(
            "/api/auth/password-reset/request",
            json={"email": "nobody@test.com"},
        )
        assert resp.status_code == 202

    async def test_reset_with_invalid_token_returns_400(self, client: AsyncClient):
        resp = await client.post(
            "/api/auth/password-reset/reset",
            json={"token": "invalid.token", "new_password": "NewP@ssword1"},
        )
        assert resp.status_code == 400

    async def test_full_reset_flow(self, client: AsyncClient, auth_service):
        """Register → request reset → use token → login with new password."""
        await client.post("/api/auth/register", json={
            "email": "reset@test.com", "password": "OldP@ssword1", "full_name": "R"
        })
        # Grab the token directly from the service (MVP: no email sending)
        reset_token = await auth_service.request_password_reset("reset@test.com")
        assert reset_token is not None

        resp = await client.post(
            "/api/auth/password-reset/reset",
            json={"token": reset_token, "new_password": "NewP@ssword1"},
        )
        assert resp.status_code == 200

        # Login with new password succeeds
        login = await client.post("/api/auth/login", json={
            "email": "reset@test.com", "password": "NewP@ssword1"
        })
        assert login.status_code == 200

        # Old password no longer works
        old_login = await client.post("/api/auth/login", json={
            "email": "reset@test.com", "password": "OldP@ssword1"
        })
        assert old_login.status_code == 401
