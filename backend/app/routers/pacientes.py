from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.paciente_schema import (
    PacienteCreate,
    PacienteResponse
)
from app.services import paciente_service


router = APIRouter(
    prefix="/pacientes",
    tags=["Pacientes"]
)


@router.post(
    "/",
    response_model=PacienteResponse
)
def criar(
    paciente: PacienteCreate,
    db: Session = Depends(get_db)
):

    return paciente_service.criar_paciente(
        db,
        paciente
    )


@router.get(
    "/",
    response_model=list[PacienteResponse]
)
def listar(
    db: Session = Depends(get_db)
):

    return paciente_service.listar_pacientes(db)