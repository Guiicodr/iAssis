from pydantic import BaseModel


class ProfissionalCreate(BaseModel):
    nome: str
    especialidade: str
    email: str
    telefone: str | None = None


class ProfissionalResponse(BaseModel):
    id: int
    nome: str
    especialidade: str
    email: str
    telefone: str | None = None

    class Config:
        from_attributes = True

class ProfissionalCreate(BaseModel):

    nome: str
    especialidade: str
    email: str
    telefone: str
    senha: str