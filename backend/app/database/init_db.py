from sqlalchemy.orm import Session

from app.database.connection import Base, SessionLocal, engine
from app.models.profissional import Profissional
from app.auth.security import gerar_hash


def criar_usuario_teste():
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        usuario_existente = db.query(Profissional).filter(
            Profissional.email == "teste@teste.com"
        ).first()

        if usuario_existente:
            print("Usuário de teste já existe.")
            return usuario_existente

        usuario_teste = Profissional(
            nome="Teste",
            especialidade="Administrativo",
            email="teste@teste.com",
            telefone="00000000000",
            senha=gerar_hash("teste123")
        )

        db.add(usuario_teste)
        db.commit()
        db.refresh(usuario_teste)

        print("Usuário de teste criado com sucesso: teste@teste.com / teste123")
        return usuario_teste
    finally:
        db.close()


if __name__ == "__main__":
    criar_usuario_teste()