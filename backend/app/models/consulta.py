from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship

from app.database.connection import Base


class Consulta(Base):

    __tablename__ = "consultas"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    paciente_id = Column(
        Integer,
        ForeignKey("pacientes.id"),
        nullable=False
    )

    profissional_id = Column(
        Integer,
        ForeignKey("profissionais.id"),
        nullable=False
    )

    data_hora = Column(
        DateTime,
        nullable=False
    )

    status = Column(
        String,
        default="Agendada"
    )

    observacao = Column(
        String,
        nullable=True
    )

    paciente = relationship("Paciente")

    profissional = relationship("Profissional")