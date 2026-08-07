from sqlalchemy.orm import Session

from app.models.profissional import Profissional
from app.schemas.profissional_schema import ProfissionalCreate


def criar_profissional(
    db: Session,
    profissional: ProfissionalCreate
):

    novo_profissional = Profissional(
        nome=profissional.nome,
        especialidade=profissional.especialidade,
        email=profissional.email,
        telefone=profissional.telefone,
        senha=profissional.senha
    )

    db.add(novo_profissional)
    db.commit()
    db.refresh(novo_profissional)

    return novo_profissional


def listar_profissionais(db: Session):

    return db.query(Profissional).all()

def buscar_por_email(
    db: Session,
    email: str
):

    return db.query(Profissional).filter(
        Profissional.email == email
    ).first()