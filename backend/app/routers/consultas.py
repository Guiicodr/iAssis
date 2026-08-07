from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.consulta_schema import (
    ConsultaCreate,
    ConsultaResponse
)
from app.services import consulta_service
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/consultas",
    tags=["Consultas"]
)


@router.post(
    "/",
    response_model=ConsultaResponse
)
def criar(
    consulta: ConsultaCreate,
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):

    return consulta_service.criar_consulta(
        db,
        consulta
    )


@router.get(
    "/",
    response_model=list[ConsultaResponse]
)
def listar(
    db: Session = Depends(get_db),
    usuario=Depends(get_current_user)
):
    
    return consulta_service.listar_consultas(db)