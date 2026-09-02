from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.schemas.ia_schema import (
    ResumoRequest,
    ResumoResponse
)
from app.services import ia_service

router = APIRouter(
    prefix="/ia",
    tags=["Inteligência Artificial"]
)


@router.post(
    "/resumo",
    response_model=ResumoResponse
)
def gerar_resumo(
    request: ResumoRequest,
    usuario=Depends(get_current_user)
):

    resumo = ia_service.gerar_resumo(
        request.texto[:20000]  # Limita a 20k caracteres
    )

    return {
        "resumo": resumo
    }