from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.auth_schema import (
    LoginRequest,
    TokenResponse
)
from app.services import profissional_service

router = APIRouter(
    prefix="/auth",
    tags=["Autenticação"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    token = profissional_service.login(
        db,
        request.email,
        request.senha
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }