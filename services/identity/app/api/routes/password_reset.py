from fastapi import APIRouter, Depends, HTTPException, status

from app.application.dtos.auth_dtos import PasswordResetConfirm, PasswordResetRequestBody
from app.application.services.auth_service import AuthService
from app.api.deps import get_auth_service
from app.domain.user.exceptions import TokenError, UserNotFoundError, WeakPasswordError

router = APIRouter(prefix="/auth/password-reset", tags=["auth"])


@router.post("/request", status_code=status.HTTP_202_ACCEPTED)
async def request_reset(
    body: PasswordResetRequestBody,
    auth: AuthService = Depends(get_auth_service),
) -> dict:
    """
    Request a password reset link.
    Always returns 202 regardless of whether the email is registered
    — this prevents email enumeration attacks.
    """
    await auth.request_password_reset(body.email)
    return {"detail": "If that email is registered, a reset link has been sent."}


@router.post("/reset", status_code=status.HTTP_200_OK)
async def reset_password(
    body: PasswordResetConfirm,
    auth: AuthService = Depends(get_auth_service),
) -> dict:
    """Reset password using the token received by email."""
    try:
        await auth.reset_password(body.token, body.new_password)
    except (TokenError, UserNotFoundError) as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )
    except WeakPasswordError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    return {"detail": "Password updated successfully."}
