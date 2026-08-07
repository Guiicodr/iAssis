from fastapi import APIRouter

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
def gerar_resumo(request: ResumoRequest):

    resumo = ia_service.gerar_resumo(
        request.texto
    )

    return {
        "resumo": resumo
    }