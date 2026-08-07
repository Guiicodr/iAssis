from sqlalchemy.orm import Session

from app.models.consulta import Consulta
from app.schemas.consulta_schema import ConsultaCreate
from datetime import datetime

def buscar_consulta_por_horario(
    db: Session,
    profissional_id: int,
    data_hora: datetime
):

    return db.query(Consulta).filter(
        Consulta.profissional_id == profissional_id,
        Consulta.data_hora == data_hora
    ).first()

def criar_consulta(
    db: Session,
    consulta: ConsultaCreate
):

    nova_consulta = Consulta(
        paciente_id=consulta.paciente_id,
        profissional_id=consulta.profissional_id,
        data_hora=consulta.data_hora,
        observacao=consulta.observacao
    )

    db.add(nova_consulta)
    db.commit()
    db.refresh(nova_consulta)

    return nova_consulta


def listar_consultas(db: Session):

    return db.query(Consulta).all()