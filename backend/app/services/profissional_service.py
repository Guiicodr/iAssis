from sqlalchemy.orm import Session

from app.repositories import profissional_repository
from app.schemas.profissional_schema import ProfissionalCreate
from app.auth.security import gerar_hash

from fastapi import HTTPException

from app.auth.auth import criar_token
from app.auth.security import verificar_senha

def criar_profissional(
    db: Session,
    profissional: ProfissionalCreate
):

    profissional.senha = gerar_hash(
        profissional.senha
    )

    return profissional_repository.criar_profissional(
        db,
        profissional
    )


def listar_profissionais(db: Session):

    return profissional_repository.listar_profissionais(db)

def login(
    db: Session,
    email: str,
    senha: str
):

    profissional = profissional_repository.buscar_por_email(
        db,
        email
    )

    if not profissional:

        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas"
        )

    if not verificar_senha(
        senha,
        profissional.senha
    ):

        raise HTTPException(
            status_code=401,
            detail="Credenciais inválidas"
        )

    token = criar_token(
        {
            "sub": profissional.email
        }
    )

    return token