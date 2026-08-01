from pydantic import BaseModel


class PacienteCreate(BaseModel):

    nome: str
    email: str
    telefone: str | None = None



class PacienteResponse(BaseModel):

    id: int
    nome: str
    email: str
    telefone: str | None = None


    class Config:
        from_attributes = True