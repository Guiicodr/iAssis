from sqlalchemy.orm import Session

from app.repositories import consulta_repository
from app.schemas.consulta_schema import ConsultaCreate
from fastapi import HTTPException


def criar_consulta(
    db: Session,
    consulta: ConsultaCreate
):

    consulta_existente = consulta_repository.buscar_consulta_por_horario(
        db,
        consulta.profissional_id,
        consulta.data_hora
    )

    if consulta_existente:

        raise HTTPException(
            status_code=400,
            detail="Já existe uma consulta nesse horário para este profissional."
        )

    return consulta_repository.criar_consulta(
        db,
        consulta
    )


def listar_consultas(db: Session):

    return consulta_repository.listar_consultas(db)