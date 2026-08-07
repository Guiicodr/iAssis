from datetime import datetime

from pydantic import BaseModel


class ConsultaCreate(BaseModel):

    paciente_id: int

    profissional_id: int

    data_hora: datetime

    observacao: str | None = None


class ConsultaResponse(BaseModel):

    id: int

    paciente_id: int

    profissional_id: int

    data_hora: datetime

    status: str

    observacao: str | None = None

    class Config:

        from_attributes = True