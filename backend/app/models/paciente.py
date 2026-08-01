from sqlalchemy import Column, Integer, String
from app.database.connection import Base


class Paciente(Base):

    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    telefone = Column(String)