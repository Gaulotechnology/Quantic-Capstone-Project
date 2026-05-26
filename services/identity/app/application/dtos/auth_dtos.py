import uuid

from pydantic import BaseModel, EmailStr, Field

from app.domain.user.value_objects import Role


# ---------------------------------------------------------------------------
# Requests
# ---------------------------------------------------------------------------

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1, max_length=255)
    role: Role = Role.CANDIDATE


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class PasswordResetRequestBody(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(min_length=8)


# ---------------------------------------------------------------------------
# Responses
# ---------------------------------------------------------------------------

class RegisterResponse(BaseModel):
    user_id: uuid.UUID
    email: str
    role: Role


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user_id: uuid.UUID
    role: Role


class RefreshResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    user_id: uuid.UUID
    email: str
    full_name: str
    role: Role
    is_active: bool
