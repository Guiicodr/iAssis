from sqlalchemy import Column, Integer, String

from app.database.connection import Base


class Profissional(Base):
    __tablename__ = "profissionais"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    especialidade = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    telefone = Column(String)
    senha = Column(String, nullable=False)