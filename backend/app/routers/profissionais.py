from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.profissional_schema import (
    ProfissionalCreate,
    ProfissionalResponse
)
from app.services import profissional_service

router = APIRouter(
    prefix="/profissionais",
    tags=["Profissionais"]
)


@router.post(
    "/",
    response_model=ProfissionalResponse
)
def criar(
    profissional: ProfissionalCreate,
    db: Session = Depends(get_db)
):

    return profissional_service.criar_profissional(
        db,
        profissional
    )


@router.get(
    "/",
    response_model=list[ProfissionalResponse]
)
def listar(
    db: Session = Depends(get_db)
):

    return profissional_service.listar_profissionais(db)