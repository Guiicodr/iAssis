from sqlalchemy.orm import Session

from app.models.paciente import Paciente
from app.schemas.paciente_schema import PacienteCreate



def criar_paciente(
    db: Session,
    paciente: PacienteCreate
):

    novo_paciente = Paciente(
        nome=paciente.nome,
        email=paciente.email,
        telefone=paciente.telefone
    )

    db.add(novo_paciente)

    db.commit()

    db.refresh(novo_paciente)

    return novo_paciente

def listar_pacientes(db: Session):

    return db.query(Paciente).all()