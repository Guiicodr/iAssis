from sqlalchemy.orm import Session

from app.repositories import paciente_repository
from app.schemas.paciente_schema import PacienteCreate


def criar_paciente(
    db: Session,
    paciente: PacienteCreate
):

    return paciente_repository.criar_paciente(
        db,
        paciente
    )


def listar_pacientes(
    db: Session
):

    return paciente_repository.listar_pacientes(
        db
    )